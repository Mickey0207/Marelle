import React, { useMemo, useState, useEffect } from 'react';
import { 
  ArchiveBoxIcon, 
  FunnelIcon, 
  ExclamationTriangleIcon,
  QrCodeIcon,
  BuildingStorefrontIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import SearchableSelect from "../../components/ui/SearchableSelect";
import StandardTable from "../../components/ui/StandardTable";
import { getInventoryFilters } from "../../../../external_mock/inventory/inventoryDataManager";
import { PRODUCT_CATEGORIES, getAllChildCategoryIds, getCategoryBreadcrumb } from "../../../../external_mock/products/categoryDataManager";
import CategoryCascader from "../../components/ui/CategoryCascader";
import { QRCodePreviewModal } from "../../components/ui/QRCodeGenerator";
import GlassModal from "../../components/ui/GlassModal";
import { ADMIN_STYLES } from "../../Style/adminStyles";
import IconActionButton from "../../components/ui/IconActionButton";

const Inventory = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState(null); // 使用分類ID，null 代表全部
  const [previewItem, setPreviewItem] = useState(null);
  const [qrItem, setQrItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // 從 API 加載庫存數據
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        // 先取得所有商品
        const productsRes = await fetch('/backend/products', {
          credentials: 'include'
        });
        
        if (!productsRes.ok) {
          throw new Error('加載商品失敗');
        }
        
        const products = await productsRes.json() || [];
        
        // 為每個商品取得庫存記錄
        const allInventoryRows = [];
        
        for (const product of products) {
          try {
            const inventoryRes = await fetch(`/backend/products/${product.id}/inventory`, {
              credentials: 'include'
            });
            
            if (inventoryRes.ok) {
              const inventoryRecords = await inventoryRes.json() || [];
              
              // 將庫存記錄轉換為表格行格式
              for (const inv of inventoryRecords) {
                allInventoryRows.push({
                  productId: product.id,
                  baseSKU: product.base_sku,
                  name: product.name,
                  category: product.category_ids && product.category_ids.length > 0 ? product.category_ids.join(', ') : '未分類',
                  categoryId: product.category_ids && product.category_ids.length > 0 ? product.category_ids[0] : null,
                  productImageUrl: product.image_url,
                  sku: inv.sku_key || product.base_sku,
                  spec: (() => {
                    // 從5層級SKU構建規格顯示
                    const specs = [];
                    for (let i = 1; i <= 5; i++) {
                      const name = inv[`spec_level_${i}_name`];
                      const value = inv[`sku_level_${i}_name`];
                      if (name && value) {
                        specs.push(`${name}: ${value}`);
                      }
                    }
                    return specs.length > 0 ? specs.join(' / ') : (inv.barcode ? `條碼: ${inv.barcode}` : '標準規格');
                  })(),
                  warehouse: inv.warehouse || '主倉',
                  currentStock: inv.current_stock_qty || 0,
                  safeStock: inv.safety_stock_qty || 10,
                  lowStockThreshold: inv.low_stock_threshold || 5,
                  barcode: inv.barcode,
                  origin: inv.origin,
                  weight: inv.weight,
                  status: (inv.current_stock_qty || 0) < (inv.low_stock_threshold || 5) ? 'low' : 'normal',
                  // 5層級SKU欄位
                  skuLevel1: inv.sku_level_1,
                  skuLevel1Name: inv.sku_level_1_name,
                  specLevel1Name: inv.spec_level_1_name,
                  skuLevel2: inv.sku_level_2,
                  skuLevel2Name: inv.sku_level_2_name,
                  specLevel2Name: inv.spec_level_2_name,
                  skuLevel3: inv.sku_level_3,
                  skuLevel3Name: inv.sku_level_3_name,
                  specLevel3Name: inv.spec_level_3_name,
                  skuLevel4: inv.sku_level_4,
                  skuLevel4Name: inv.sku_level_4_name,
                  specLevel4Name: inv.spec_level_4_name,
                  skuLevel5: inv.sku_level_5,
                  skuLevel5Name: inv.sku_level_5_name,
                  specLevel5Name: inv.spec_level_5_name,
                  // 供明細使用
                  id: inv.id,
                  trackInventory: inv.track_inventory,
                  allowBackorder: inv.allow_backorder,
                  allowPreorder: inv.allow_preorder,
                });
              }
            }
          } catch (err) {
            console.error(`加載商品 ${product.id} 的庫存失敗:`, err);
          }
        }
        
        setRows(allInventoryRows);
        setError(null);
      } catch (err) {
        console.error('加載庫存數據失敗:', err);
        setError(err.message);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventoryData();
  }, []);

  const { warehouses } = useMemo(() => getInventoryFilters(rows), [rows]);

  // 聚合為父表（商品層級）
  const productRows = useMemo(() => {
    // 先依篩選條件過濾 SKU 列
    const filteredSkus = rows.filter(item => {
      const matchWarehouse = selectedWarehouse === '全部' || item.warehouse === selectedWarehouse;
      let matchCategory = true;
      if (selectedCategory) {
        const allowed = new Set([selectedCategory, ...getAllChildCategoryIds(PRODUCT_CATEGORIES, selectedCategory)]);
        matchCategory = item.categoryId ? allowed.has(item.categoryId) : false;
      }
      return matchWarehouse && matchCategory;
    });

    // 以 productId/baseSKU 做父層分組，彙總顯示
    const map = new Map();
    for (const r of filteredSkus) {
      const key = r.productId ?? r.baseSKU ?? r.name;
      if (!map.has(key)) {
        map.set(key, {
          productKey: key,
          productId: r.productId,
          baseSKU: r.baseSKU,
          name: r.name,
          category: r.category,
          categoryId: r.categoryId,
          imageUrl: r.productImageUrl || r.imageUrl,
          totalCurrentStock: 0,
          totalValue: 0,
          skuCount: 0,
          sample: r, // 取樣本帶其他欄位
        });
      }
      const agg = map.get(key);
      agg.totalCurrentStock += Number(r.currentStock || 0);
      agg.totalValue += Number(r.totalValue || 0);
      agg.skuCount += 1;
    }
    return Array.from(map.values());
  }, [selectedWarehouse, selectedCategory, rows]);

  const getStatusBadge = (item) => {
    if (item.status === 'presale') {
      return <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-purple-100 text-purple-700 rounded font-chinese">預售中</span>;
    } else if (item.status === 'low') {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />低庫存
        </span>
      );
    } else {
      return <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">正常</span>;
    }
  };

  // 定義表格處理
  const columns = [
    {
      key: 'imageUrl',
      label: '圖片',
      sortable: false,
      render: (value, item) => (
        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {value ? (
            <img src={value} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-gray-400">無圖</span>
          )}
        </div>
      )
    },
    {
      key: 'name',
      label: '商品名稱',
      sortable: true,
      render: (value, item) => <span className="font-chinese font-medium">{item.name}</span>
    },
    {
      key: 'baseSKU',
      label: '主 SKU',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'category',
      label: '分類',
      sortable: true,
      render: (value) => <span className="font-chinese">{value}</span>
    },
    {
      key: 'totalCurrentStock',
      label: '總庫存量',
      sortable: true,
      render: (value) => <span className={`font-bold ${value < 0 ? 'text-purple-600' : 'text-green-600'}`}>{value}</span>
    },
    {
      key: 'skuCount',
      label: 'SKU 數',
      sortable: true
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_v, item) => (
        <div className="flex items-center gap-2">
          <IconActionButton Icon={EyeIcon} label="檢視明細" variant="gray" onClick={() => setPreviewItem(item.sample)} />
        </div>
      )
    },
  ];

  // 子表：將同一產品下所有 SKU 彙總（跨倉庫加總），並顯示關鍵欄位
  const getSubRows = (parent) => {
    const related = rows.filter(r => (r.productId ?? r.baseSKU ?? r.name) === parent.productKey);
    // 以 SKU 聚合
    const skuMap = new Map();
    for (const r of related) {
      const key = r.sku;
      if (!skuMap.has(key)) {
        skuMap.set(key, {
          sku: r.sku,
          spec: r.spec,
          currentStock: 0,
          safeStock: r.safeStock,
          totalValue: 0,
          barcode: r.barcode,
          imageUrl: r.variantImageUrl || r.productImageUrl || r.imageUrl,
          status: r.status,
          // 供編輯和 QR 視窗使用的補充欄位
          id: r.id,
          productId: parent.productId,
          name: parent.name,
          category: parent.category,
          warehouse: '彙總',
          // 5層級SKU欄位
          skuLevel1: r.skuLevel1,
          skuLevel1Name: r.skuLevel1Name,
          specLevel1Name: r.specLevel1Name,
          skuLevel2: r.skuLevel2,
          skuLevel2Name: r.skuLevel2Name,
          specLevel2Name: r.specLevel2Name,
          skuLevel3: r.skuLevel3,
          skuLevel3Name: r.skuLevel3Name,
          specLevel3Name: r.specLevel3Name,
          skuLevel4: r.skuLevel4,
          skuLevel4Name: r.skuLevel4Name,
          specLevel4Name: r.specLevel4Name,
          skuLevel5: r.skuLevel5,
          skuLevel5Name: r.skuLevel5Name,
          specLevel5Name: r.specLevel5Name,
        });
      }
      const agg = skuMap.get(key);
      agg.currentStock += Number(r.currentStock || 0);
      agg.totalValue += Number(r.totalValue || 0);
      // 以較緊的 safeStock
      if (typeof r.safeStock === 'number' && (typeof agg.safeStock !== 'number' || r.safeStock < agg.safeStock)) {
        agg.safeStock = r.safeStock;
      }
      // 若任一倉庫為低庫存，整體標為低；若全部正常則正常；若有負數標預售
      if (r.currentStock < 0) agg.status = 'presale';
      else if (r.currentStock < r.safeStock && agg.status !== 'presale') agg.status = 'low';
    }
    return Array.from(skuMap.values());
  };

  const subColumns = [
    {
      key: 'imageUrl',
      label: '圖片',
      sortable: false,
      render: (value, item) => (
        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {value ? (
            <img src={value} alt={item.sku} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-gray-400">無圖</span>
          )}
        </div>
      )
    },
    { key: 'sku', label: 'SKU', sortable: true, render: (v) => <span className="font-mono text-xs text-gray-800">{v}</span> },
    { key: 'spec', label: '規格', sortable: true, render: (v) => <span className="text-sm text-gray-700 font-chinese">{v || '-'}</span> },
    { key: 'currentStock', label: '庫存量(總)', sortable: true, render: (v, r) => (
      <span className={`font-bold ${v < 0 ? 'text-purple-600' : v < (r.safeStock ?? 0) ? 'text-red-600' : 'text-green-600'}`}>{v}</span>
    ) },
    { key: 'safeStock', label: '安全庫存', sortable: true },
    { key: 'totalValue', label: '庫存價值(總)', sortable: true },
    { key: 'barcode', label: '條碼', sortable: true, render: (v, r) => (
      <button
        className="px-2 py-1 text-xs border rounded hover:bg-gray-50 flex items-center space-x-1"
        title="顯示 QR"
        onClick={() => setQrItem(r)}
      >
        <QrCodeIcon className="w-4 h-4" />
        <span>{v ? '顯示' : '產生'}</span>
      </button>
    ) },
    { key: 'status', label: '狀態', sortable: true, render: (_v, r) => getStatusBadge(r) },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_v, row) => (
        <IconActionButton
          Icon={PencilIcon}
          label="編輯"
          variant="gray"
          onClick={() => {
            setEditItem(row);
            setEditFormData({ ...row });
          }}
        />
      )
    },
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
  <div className={ADMIN_STYLES.contentContainerFluid}>
      <div className="flex items-center mb-8">
        <ArchiveBoxIcon className="w-8 h-8 text-amber-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800 font-chinese">庫存管理</h1>
      </div>

      {/* 加載狀態 */}
      {loading && (
        <div className="glass rounded-2xl p-12 mb-6 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-gray-600 font-chinese">正在加載庫存數據...</p>
        </div>
      )}

      {/* 錯誤狀態 */}
      {error && !loading && (
        <div className="glass rounded-2xl p-4 mb-6 bg-red-50 border border-red-200">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-700 font-chinese">加載庫存數據失敗: {error}</p>
          </div>
        </div>
      )}

      {/* 篩選區域 */}
      {!loading && (
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          
          <div className="flex items-center space-x-2">
            <BuildingStorefrontIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={warehouses.map(w => ({ value: w, label: w === '全部' ? '全部倉庫' : w }))}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="選擇倉庫"
              className="w-36"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <CategoryCascader
              tree={PRODUCT_CATEGORIES}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="選擇分類"
            />
          </div>

          {selectedCategory && (
            <div className="text-xs text-gray-500 font-chinese">
              分類路徑：{getCategoryBreadcrumb(PRODUCT_CATEGORIES, selectedCategory)}
            </div>
          )}

          <div className="text-sm text-gray-500 font-chinese">
            共{productRows.length} 項商品
          </div>
        </div>
      </div>
      )}

      {/* 主要庫存表格 */}
      {!loading && (
      <StandardTable
        data={productRows}
        columns={columns}
        title="庫存清單（按商品彙總）"
        emptyMessage="沒有找到符合條件的庫存資料"
        exportFileName="庫存清單"
        enableRowExpansion
        getSubRows={getSubRows}
        subColumns={subColumns}
        renderSubtableHeader={(row) => (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">{row.name} 的 SKU 彙總（跨倉庫）</div>
            <div className="text-xs text-gray-500">共 {getSubRows(row).length} 項 SKU</div>
          </div>
        )}
        subtableClassName="rounded-lg"
      />
      )}

      {/* 右側抽屜：庫存詳情與即時編輯 */}
      {previewItem && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPreviewItem(null)} />
          <div className="absolute right-0 top-0 h-full w-[460px] bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-chinese">庫存詳情</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setPreviewItem(null)}>✕</button>
            </div>

            <div className="space-y-6">
              {/* 基本資訊 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 font-chinese">基本資訊</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-chinese">SKU</span>
                    <span className="font-mono text-gray-900">{previewItem.sku}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-chinese">商品名稱</span>
                    <span className="font-chinese text-gray-900 max-w-[60%] truncate text-right">{previewItem.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-chinese">規格</span>
                    <span className="font-chinese text-gray-900 max-w-[60%] truncate text-right">{previewItem.spec || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-chinese">分類</span>
                    <span className="font-chinese text-gray-900"><span className="px-2 py-0.5 rounded bg-gray-100">{previewItem.category}</span></span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-chinese">倉庫</label>
                    <div className="w-full">
                      <SearchableSelect
                        options={warehouses.filter(w => w !== '全部').map(w => ({ value: w, label: w }))}
                        value={previewItem.warehouse}
                        onChange={(val) => setPreviewItem(prev => ({ ...prev, warehouse: val }))}
                        placeholder="選擇倉庫"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-chinese">更新日期</span>
                    <span className="text-gray-600">{previewItem.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* 數量與安全庫存（可即時編輯） */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 font-chinese">數量設定</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-chinese">庫存量</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={previewItem.currentStock}
                      onChange={(e)=> setPreviewItem(prev => ({...prev, currentStock: Number(e.target.value)}))} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-chinese">安全庫存</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={previewItem.safeStock}
                      onChange={(e)=> setPreviewItem(prev => ({...prev, safeStock: Number(e.target.value)}))} />
                  </div>
                </div>
              </div>

              {/* 成本與價值（可即時編輯） */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 font-chinese">成本與價值</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-chinese">平均成本</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={previewItem.avgCost}
                      onChange={(e)=> setPreviewItem(prev => ({...prev, avgCost: Number(e.target.value)}))} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-chinese">庫存價值</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={previewItem.totalValue}
                      onChange={(e)=> setPreviewItem(prev => ({...prev, totalValue: Number(e.target.value)}))} />
                  </div>
                </div>
              </div>

              {/* 其他設定 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 font-chinese">其他</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-chinese">允許預購</span>
                  <button className={`px-3 py-1 rounded text-xs font-chinese ${previewItem.allowNegative ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setPreviewItem(prev => ({...prev, allowNegative: !prev.allowNegative}))}>
                    {previewItem.allowNegative ? '允許' : '禁止'}
                  </button>
                </div>
                <div className="mt-4">
                  <label className="block text-xs text-gray-500 mb-1 font-chinese">條碼</label>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{previewItem.barcode}</span>
                    <button className="px-2 py-1 text-xs border rounded hover:bg-gray-50 flex items-center space-x-1" onClick={() => setQrItem(previewItem)}>
                      <QrCodeIcon className="w-4 h-4" /> <span>顯示 QR</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-[#cc824d] text-white rounded hover:bg-[#b3723f] font-chinese"
                  onClick={() => {
                    setRows(prev => prev.map(r => r.id === previewItem.id ? {
                      ...r,
                      ...previewItem,
                      // 自動帶出計算後的庫存價值
                      totalValue: Math.round(Number(previewItem.currentStock) * Number(previewItem.avgCost || 0))
                    } : r));
                    setPreviewItem(null);
                  }}
                >完成</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <QRCodePreviewModal
        isOpen={!!qrItem}
        onClose={() => setQrItem(null)}
        title={qrItem ? `QR 預覽 - ${qrItem.sku}` : 'QR 預覽'}
        product={{ id: qrItem?.sku, name: qrItem?.name, slug: qrItem?.sku, price: qrItem?.totalValue, comparePrice: null, costPrice: qrItem?.avgCost, categories: [qrItem?.category].filter(Boolean) }}
        sku={{ id: qrItem?.id, sku: qrItem?.sku, price: null, comparePrice: null, costPrice: qrItem?.avgCost, variantPath: (qrItem?.spec && qrItem?.spec !== '-') ? qrItem.spec.split(' / ').map(s=>({ level: '規格', option: s })) : [] }}
        details={qrItem ? [
          { label: '商品名稱', value: qrItem.name },
          { label: 'SKU', value: qrItem.sku, mono: true },
          { label: '規格', value: qrItem.spec || '-' },
          { label: '分類', value: qrItem.category },
          { label: '倉庫', value: qrItem.warehouse },
          { label: '庫存量', value: qrItem.currentStock },
          { label: '安全庫存', value: qrItem.safeStock },
          { label: '平均成本', value: `NT$ ${Number(qrItem.avgCost).toLocaleString()}` },
          { label: '庫存價值', value: `NT$ ${Number(qrItem.totalValue).toLocaleString()}` },
          { label: '條碼', value: qrItem.barcode, mono: true },
          { label: '允許預購', value: qrItem.allowNegative ? '允許' : '禁止' },
          { label: '更新日期', value: qrItem.lastUpdated },
        ] : undefined}
      />

      {/* 編輯 Modal */}
      <GlassModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        title={`編輯 SKU: ${editItem?.sku}`}
        size="max-w-md"
        contentClass="pt-0"
        actions={[
          {
            label: '取消',
            variant: 'secondary',
            onClick: () => setEditItem(null)
          },
          {
            label: '保存',
            onClick: async () => {
              try {
                const response = await fetch(`/backend/products/${editFormData.productId}/inventory/${editFormData.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    current_stock_qty: Number(editFormData.currentStock),
                    safety_stock_qty: Number(editFormData.safeStock),
                    low_stock_threshold: Number(editFormData.lowStockThreshold),
                    warehouse: editFormData.warehouse,
                  })
                });

                if (response.ok) {
                  // 更新本地行數據
                  setRows(prev => prev.map(r => r.id === editFormData.id ? {
                    ...r,
                    currentStock: Number(editFormData.currentStock),
                    safeStock: Number(editFormData.safeStock),
                    lowStockThreshold: Number(editFormData.lowStockThreshold),
                    warehouse: editFormData.warehouse,
                  } : r));
                  setEditItem(null);
                }
              } catch (err) {
                console.error('保存庫存記錄失敗:', err);
              }
            }
          }
        ]}
      >
        <div className="p-6 space-y-4">
          {/* 基本資訊 */}
          <div className="bg-white/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 font-chinese">基本資訊</h3>
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-chinese">SKU</label>
              <input
                type="text"
                value={editFormData.sku || ''}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border rounded text-sm font-mono"
              />
            </div>
          </div>

          {/* 庫存信息 */}
          <div className="bg-white/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 font-chinese">庫存信息</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-chinese">庫存量</label>
                <input
                  type="number"
                  value={editFormData.currentStock ?? ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, currentStock: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-chinese">安全庫存</label>
                <input
                  type="number"
                  value={editFormData.safeStock ?? ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, safeStock: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-chinese">低庫存警告</label>
                <input
                  type="number"
                  value={editFormData.lowStockThreshold ?? ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, lowStockThreshold: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-chinese">倉庫</label>
                <input
                  type="text"
                  value={editFormData.warehouse || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, warehouse: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </GlassModal>
    </div>
  </div>
  );
};

export default Inventory;
