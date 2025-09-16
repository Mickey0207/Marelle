import React, { useState, useMemo } from 'react';
import { 
  ArchiveBoxIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PencilIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  TruckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import CustomSelect from '../components/CustomSelect';

// 模擬整合庫存數據
const mockInventoryData = [
  {
    id: 1,
    sku: 'TSHIRT-001-WH-M',
    name: '經典T恤 白色/M',
    category: '服飾',
    warehouse: '主倉庫',
    currentStock: 25,
    safeStock: 10,
    avgCost: 180,
    totalValue: 4500,
    barcode: '1234567890123',
    allowNegative: false,
    lastUpdated: '2024-09-15',
    status: 'normal'
  },
  {
    id: 2,
    sku: 'TSHIRT-001-BL-L', 
    name: '經典T恤 黑色/L',
    category: '服飾',
    warehouse: '主倉庫',
    currentStock: 3,
    safeStock: 5,
    avgCost: 180,
    totalValue: 540,
    barcode: '1234567890124',
    allowNegative: false,
    lastUpdated: '2024-09-14',
    status: 'low'
  },
  {
    id: 3,
    sku: 'BOTTLE-001',
    name: '運動水壺',
    category: '配件',
    warehouse: '分倉庫A',
    currentStock: 50,
    safeStock: 15,
    avgCost: 120,
    totalValue: 6000,
    barcode: '1234567890125',
    allowNegative: true,
    lastUpdated: '2024-09-16',
    status: 'normal'
  },
  {
    id: 4,
    sku: 'GIFT-SET-001',
    name: '新手禮盒組',
    category: '贈品',
    warehouse: '主倉庫',
    currentStock: -2,
    safeStock: 5,
    avgCost: 350,
    totalValue: -700,
    barcode: '1234567890126',
    allowNegative: true,
    lastUpdated: '2024-09-15',
    status: 'presale'
  }
];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortField, setSortField] = useState('sku');
  const [sortDirection, setSortDirection] = useState('asc');
  const [editingRow, setEditingRow] = useState(null);

  // 篩選和排序數據
  const filteredData = useMemo(() => {
    let filtered = mockInventoryData.filter(item => {
      const matchSearch = item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.barcode.includes(searchTerm);
      const matchWarehouse = selectedWarehouse === '全部' || item.warehouse === selectedWarehouse;
      const matchCategory = selectedCategory === '全部' || item.category === selectedCategory;
      
      return matchSearch && matchWarehouse && matchCategory;
    });

    // 排序
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedWarehouse, selectedCategory, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (item) => {
    if (item.status === 'presale') {
      return <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-purple-100 text-purple-700 rounded font-chinese">預售中</span>;
    } else if (item.status === 'low') {
      return <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">
        <ExclamationTriangleIcon className="w-3 h-3 mr-1" />低庫存
      </span>;
    } else {
      return <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">正常</span>;
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUpIcon className="w-4 h-4 inline ml-1" /> : 
      <ArrowDownIcon className="w-4 h-4 inline ml-1" />;
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className="container mx-auto px-6 py-8">
      <div className="flex items-center mb-8">
        <ArchiveBoxIcon className="w-8 h-8 text-amber-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800 font-chinese">整合庫存管理</h1>
      </div>

      {/* 搜尋和篩選區域 */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋 SKU、商品名稱或條碼..."
              className="input w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <BuildingStorefrontIcon className="w-5 h-5 text-gray-400" />
            <CustomSelect
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              options={[
                { value: '全部', label: '全部倉庫', icon: '🏢' },
                { value: '主倉庫', label: '主倉庫', icon: '🏪', description: '主要庫存倉庫' },
                { value: '分倉庫A', label: '分倉庫A', icon: '🏬', description: '分店庫存倉庫' }
              ]}
              className="w-36"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <CustomSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { value: '全部', label: '全部分類' },
                { value: '服飾', label: '服飾', icon: '👔', description: '服裝商品' },
                { value: '配件', label: '配件', icon: '👜', description: '配件商品' },
                { value: '贈品', label: '贈品', icon: '🎁', description: '促銷贈品' }
              ]}
              className="w-32"
            />
          </div>

          <div className="text-sm text-gray-500 font-chinese">
            共 {filteredData.length} 項商品
          </div>
        </div>
      </div>

      {/* 主要庫存表格 */}
      <div className="glass rounded-2xl overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">{/* 允許垂直溢出以顯示下拉選單 */}
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white" style={{ position: 'relative', zIndex: 1 }}>{/* 設定較低的z-index */}
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese cursor-pointer" onClick={() => handleSort('sku')}>
                  SKU <SortIcon field="sku" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese cursor-pointer" onClick={() => handleSort('name')}>
                  商品名稱 <SortIcon field="name" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese cursor-pointer" onClick={() => handleSort('warehouse')}>
                  倉庫 <SortIcon field="warehouse" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese cursor-pointer" onClick={() => handleSort('currentStock')}>
                  庫存量 <SortIcon field="currentStock" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese cursor-pointer" onClick={() => handleSort('safeStock')}>
                  安全庫存 <SortIcon field="safeStock" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese cursor-pointer" onClick={() => handleSort('avgCost')}>
                  平均成本 <SortIcon field="avgCost" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese cursor-pointer" onClick={() => handleSort('totalValue')}>
                  庫存價值 <SortIcon field="totalValue" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">條碼</th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">狀態</th>
                <th className="px-4 py-4 text-left text-sm font-semibold font-chinese">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-white/30">
                  <td className="px-4 py-3 font-mono text-sm">{item.sku}</td>
                  <td className="px-4 py-3 font-chinese">{item.name}</td>
                  <td className="px-4 py-3 font-chinese">{item.warehouse}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${item.currentStock < 0 ? 'text-purple-600' : item.currentStock < item.safeStock ? 'text-red-600' : 'text-green-600'}`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.safeStock}</td>
                  <td className="px-4 py-3">NT$ {item.avgCost}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${item.totalValue < 0 ? 'text-purple-600' : 'text-gray-900'}`}>
                      NT$ {item.totalValue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <QrCodeIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-xs">{item.barcode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item)}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="編輯">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="物流">
                        <TruckIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 統計摘要 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{filteredData.length}</div>
          <div className="text-sm text-gray-500 font-chinese">總商品數</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{filteredData.filter(item => item.status === 'low').length}</div>
          <div className="text-sm text-gray-500 font-chinese">低庫存警示</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{filteredData.filter(item => item.status === 'presale').length}</div>
          <div className="text-sm text-gray-500 font-chinese">預售商品</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            NT$ {filteredData.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">總庫存價值</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Inventory;
