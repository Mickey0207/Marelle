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
import { buildInventoryFromProducts, getInventoryFilters } from "../../../lib/data/inventory/inventoryDataManager";
import { PRODUCT_CATEGORIES, getAllChildCategoryIds, getCategoryBreadcrumb } from "../../../lib/data/products/categoryDataManager";
import CategoryCascader from "../../components/ui/CategoryCascader";
import QRCodeGenerator from "../../components/ui/QRCodeGenerator";

const Inventory = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState(null); // 使用分類ID，null 代表全部
  const [previewItem, setPreviewItem] = useState(null);
  const [qrItem, setQrItem] = useState(null);

  // 以產品資料動態建立 SKU 庫存列（多倉庫）
  const [rows, setRows] = useState(() => buildInventoryFromProducts('*'));
  const { warehouses } = useMemo(() => getInventoryFilters(rows), [rows]);

  // 篩選數據
  const filteredData = useMemo(() => {
    let filtered = rows.filter(item => {
      const matchWarehouse = selectedWarehouse === '全部' || item.warehouse === selectedWarehouse;
      // 類別過濾：若選到某個節點，包含其所有子分類
      let matchCategory = true;
      if (selectedCategory) {
        const allowed = new Set([selectedCategory, ...getAllChildCategoryIds(PRODUCT_CATEGORIES, selectedCategory)]);
        matchCategory = item.categoryId ? allowed.has(item.categoryId) : false;
      }
      
      return matchWarehouse && matchCategory;
    });

    return filtered;
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
      key: 'sku',
      label: 'SKU',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'name',
      label: '商品名稱',
      sortable: true,
      render: (value) => <span className="font-chinese">{value}</span>
    },
    {
      key: 'spec',
      label: '規格',
      sortable: true,
      render: (value) => <span className="font-chinese text-sm text-gray-600">{value || '-'}</span>
    },
    {
      key: 'category',
      label: '分類',
      sortable: true,
      render: (value) => <span className="font-chinese">{value}</span>
    },
    {
      key: 'currentStock',
      label: '庫存量',
      sortable: true,
      render: (value, item) => (
        <span className={`font-bold ${value < 0 ? 'text-purple-600' : value < item.safeStock ? 'text-red-600' : 'text-green-600'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'safeStock',
      label: '安全庫存',
      sortable: true
    },
    {
      key: 'qrcode',
      label: 'QR Code',
      sortable: false,
      render: (_, item) => (
        <button className="px-2 py-1 text-xs border rounded hover:bg-gray-50 flex items-center space-x-1" onClick={() => setQrItem(item)}>
          <QrCodeIcon className="w-4 h-4 text-gray-600" />
          <span>顯示</span>
        </button>
      )
    },
    {
      key: 'allowNegative',
      label: '允許預購',
      sortable: false,
      render: (value) => (
        value ? (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 rounded font-chinese">允許</span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded font-chinese">禁止</span>
        )
      )
    },
    {
      key: 'status',
      label: '狀態',
      sortable: false,
      render: (value, item) => getStatusBadge(item)
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (value, item) => (
        <div className="flex space-x-2">
          <button className="p-1 text-gray-700 hover:bg-gray-100 rounded flex items-center" title="檢視" onClick={() => setPreviewItem(item)}>
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className="container mx-auto px-6 py-8">
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
            共{filteredData.length} 項商品
          </div>
        </div>
      </div>

      {/* 主要庫存表格 */}
      <StandardTable
        data={filteredData}
        columns={columns}
        title="庫存清單"
        emptyMessage="沒有找到符合條件的庫存資料"
        exportFileName="庫存清單"
      />

      {/* 右側抽屜：庫存詳情與即時編輯 */}
      {previewItem && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPreviewItem(null)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[460px] bg-white shadow-2xl p-6 overflow-y-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
