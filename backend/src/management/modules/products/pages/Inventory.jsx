import React, { useState, useMemo } from 'react';
import { 
  ArchiveBoxIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PencilIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  TruckIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
// import CustomSelect from "../../components/ui/CustomSelect";
// import SearchableSelect from "../../../components/SearchableSelect";
// import StandardTable from "../../../components/StandardTable";

// 模擬剛才庫存剛才
const mockInventoryData = [
  {
    id: 1,
    sku: 'TSHIRT-001-WH-M',
    name: '經典T恤/白色/M',
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
    name: '經典T恤/黑色/L',
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
    name: '剛才水壺',
    category: '配件',
    warehouse: '主倉庫A',
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
    name: '精美禮品套裝',
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
  const [selectedWarehouse, setSelectedWarehouse] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // 篩選剛才
  const filteredData = useMemo(() => {
    let filtered = mockInventoryData.filter(item => {
      const matchWarehouse = selectedWarehouse === '全部' || item.warehouse === selectedWarehouse;
      const matchCategory = selectedCategory === '全部' || item.category === selectedCategory;
      
      return matchWarehouse && matchCategory;
    });

    return filtered;
  }, [selectedWarehouse, selectedCategory]);

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
      label: '分鐘前稱',
      sortable: true,
      render: (value) => <span className="font-chinese">{value}</span>
    },
    {
      key: 'warehouse',
      label: '倉庫',
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
      key: 'avgCost',
      label: '平均成本',
      sortable: true,
      render: (value) => `NT$ ${value}`
    },
    {
      key: 'totalValue',
      label: '庫存價值',
      sortable: true,
      render: (value) => (
        <span className={`font-bold ${value < 0 ? 'text-purple-600' : 'text-gray-900'}`}>
          NT$ {value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'barcode',
      label: '條碼',
      sortable: false,
      render: (value) => (
        <div className="flex items-center space-x-1">
          <QrCodeIcon className="w-4 h-4 text-gray-400" />
          <span className="font-mono text-xs">{value}</span>
        </div>
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
          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="編輯">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="剛才">
            <TruckIcon className="w-4 h-4" />
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

      {/* 篩選即時*/}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          
          <div className="flex items-center space-x-2">
            <BuildingStorefrontIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '全部', label: '全部倉庫' },
                { value: '主倉庫', label: '主倉庫' },
                { value: '主倉庫A', label: '主倉庫A' }
              ]}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="分鐘前庫"
              className="w-36"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '全部', label: '全部分類' },
                { value: '服飾', label: '服飾' },
                { value: '配件', label: '配件' },
                { value: '贈品', label: '贈品' }
              ]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="選擇分類"
              className="w-32"
            />
          </div>

          <div className="text-sm text-gray-500 font-chinese">
            ??{filteredData.length} 即時?
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

      {/* 統計資料 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{filteredData.length}</div>
          <div className="text-sm text-gray-500 font-chinese">總商品數</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{filteredData.filter(item => item.status === 'low').length}</div>
          <div className="text-sm text-gray-500 font-chinese">低庫存警告</div>
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
