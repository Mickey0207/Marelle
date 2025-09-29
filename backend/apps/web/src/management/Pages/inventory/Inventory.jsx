import React, { useMemo, useState } from 'react';
import { 
  ArchiveBoxIcon, 
  FunnelIcon, 
  PencilIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  EyeIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import SearchableSelect from "../../components/ui/SearchableSelect";
import StandardTable from "../../components/ui/StandardTable";
import { buildInventoryFromProducts, getInventoryFilters } from "../../../lib/mocks/inventory/inventoryDataManager";
import { PRODUCT_CATEGORIES, getAllChildCategoryIds, getCategoryBreadcrumb } from "../../../lib/mocks/products/categoryDataManager";
import CategoryCascader from "../../components/ui/CategoryCascader";
import QRCodeGenerator from "../../components/ui/QRCodeGenerator";
import { ADMIN_STYLES } from "../../../adminStyles";
import IconActionButton from "../../components/ui/IconActionButton";

const Inventory = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState(null); // 使用分類ID，null 代表全部
  const [previewItem, setPreviewItem] = useState(null);
  const [qrItem, setQrItem] = useState(null);

  // 以產品資料動態建立 SKU 庫存列（多倉庫）
  const [rows, setRows] = useState(() => buildInventoryFromProducts('*'));
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
          avgCost: r.avgCost,
          totalValue: 0,
          barcode: r.barcode,
          imageUrl: r.variantImageUrl || r.productImageUrl || r.imageUrl,
          status: r.status,
          // 供 QR 視窗使用的補充欄位
          id: r.sku,
          name: parent.name,
          category: parent.category,
          warehouse: '彙總',
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
    { key: 'avgCost', label: '平均成本', sortable: true },
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
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
  <div className={ADMIN_STYLES.contentContainerFluid}>
      <div className="flex items-center mb-8">
        <ArchiveBoxIcon className="w-8 h-8 text-amber-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800 font-chinese">庫存管理</h1>
      </div>

      {/* 篩選區域 */}
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

      {/* 主要庫存表格 */}
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

      {/* QR Code 小視窗 */}
      {qrItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setQrItem(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-chinese">QR Code</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setQrItem(null)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start justify-center">
                <QRCodeGenerator
                  autoGenerate
                  compact
                  product={{ id: qrItem.sku, name: qrItem.name, slug: qrItem.sku, price: qrItem.totalValue, comparePrice: null, costPrice: qrItem.avgCost }}
                  sku={{ id: qrItem.id, sku: qrItem.sku, price: null, comparePrice: null, costPrice: qrItem.avgCost, variantPath: (qrItem.spec && qrItem.spec !== '-') ? qrItem.spec.split(' / ').map(s=>({ level: '規格', option: s })) : [] }}
                />
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">商品名稱</span><span className="font-chinese text-gray-900 max-w-[60%] truncate text-right">{qrItem.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">SKU</span><span className="font-mono">{qrItem.sku}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">規格</span><span className="font-chinese text-gray-900 max-w-[60%] truncate text-right">{qrItem.spec || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">分類</span><span className="font-chinese">{qrItem.category}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">倉庫</span><span className="font-chinese">{qrItem.warehouse}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">庫存量</span><span className="font-bold">{qrItem.currentStock}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">安全庫存</span><span>{qrItem.safeStock}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">平均成本</span><span>NT$ {Number(qrItem.avgCost).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">庫存價值</span><span>NT$ {Number(qrItem.totalValue).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">條碼</span><span className="font-mono text-xs">{qrItem.barcode}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">允許預購</span><span className="font-chinese">{qrItem.allowNegative ? '允許' : '禁止'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-chinese">更新日期</span><span className="text-gray-600">{qrItem.lastUpdated}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Inventory;
