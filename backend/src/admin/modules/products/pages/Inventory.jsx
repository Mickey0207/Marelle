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
import CustomSelect from "@shared/components/CustomSelect";
import SearchableSelect from "@shared/components/SearchableSelect";
import StandardTable from "@shared/components/StandardTable";

// Ê®°Êì¨?¥Â?Â∫´Â??∏Ê?
const mockInventoryData = [
  {
    id: 1,
    sku: 'TSHIRT-001-WH-M',
    name: 'Á∂ìÂÖ∏T???ΩËâ≤/M',
    category: '?çÈ£æ',
    warehouse: '‰∏ªÂÄâÂ∫´',
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
    name: 'Á∂ìÂÖ∏T??ÈªëËâ≤/L',
    category: '?çÈ£æ',
    warehouse: '‰∏ªÂÄâÂ∫´',
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
    name: '?ãÂ?Ê∞¥Â£∫',
    category: '?ç‰ª∂',
    warehouse: '?ÜÂÄâÂ∫´A',
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
    name: '?∞Ê?Á¶ÆÁ?Áµ?,
    category: 'Ë¥àÂ?',
    warehouse: '‰∏ªÂÄâÂ∫´',
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
  const [selectedWarehouse, setSelectedWarehouse] = useState('?®ÈÉ®');
  const [selectedCategory, setSelectedCategory] = useState('?®ÈÉ®');

  // ÁØ©ÈÅ∏?∏Ê?
  const filteredData = useMemo(() => {
    let filtered = mockInventoryData.filter(item => {
      const matchWarehouse = selectedWarehouse === '?®ÈÉ®' || item.warehouse === selectedWarehouse;
      const matchCategory = selectedCategory === '?®ÈÉ®' || item.category === selectedCategory;
      
      return matchWarehouse && matchCategory;
    });

    return filtered;
  }, [selectedWarehouse, selectedCategory]);

  const getStatusBadge = (item) => {
    if (item.status === 'presale') {
      return <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-purple-100 text-purple-700 rounded font-chinese">?êÂîÆ‰∏?/span>;
    } else if (item.status === 'low') {
      return <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded font-chinese">
        <ExclamationTriangleIcon className="w-3 h-3 mr-1" />‰ΩéÂ∫´Â≠?
      </span>;
    } else {
      return <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded font-chinese">Ê≠?∏∏</span>;
    }
  };

  // ÂÆöÁæ©Ë°®Ê†º?óÈ?ÁΩ?
  const columns = [
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'name',
      label: '?ÜÂ??çÁ®±',
      sortable: true,
      render: (value) => <span className="font-chinese">{value}</span>
    },
    {
      key: 'warehouse',
      label: '?âÂ∫´',
      sortable: true,
      render: (value) => <span className="font-chinese">{value}</span>
    },
    {
      key: 'currentStock',
      label: 'Â∫´Â???,
      sortable: true,
      render: (value, item) => (
        <span className={`font-bold ${value < 0 ? 'text-purple-600' : value < item.safeStock ? 'text-red-600' : 'text-green-600'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'safeStock',
      label: 'ÂÆâÂÖ®Â∫´Â?',
      sortable: true
    },
    {
      key: 'avgCost',
      label: 'Âπ≥Â??êÊú¨',
      sortable: true,
      render: (value) => `NT$ ${value}`
    },
    {
      key: 'totalValue',
      label: 'Â∫´Â??πÂÄ?,
      sortable: true,
      render: (value) => (
        <span className={`font-bold ${value < 0 ? 'text-purple-600' : 'text-gray-900'}`}>
          NT$ {value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'barcode',
      label: 'Ê¢ùÁ¢º',
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
      label: '?Ä??,
      sortable: false,
      render: (value, item) => getStatusBadge(item)
    },
    {
      key: 'actions',
      label: '?ç‰?',
      sortable: false,
      render: (value, item) => (
        <div className="flex space-x-2">
          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Á∑®ËºØ">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="?©Ê?">
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
        <h1 className="text-3xl font-bold text-gray-800 font-chinese">?¥Â?Â∫´Â?ÁÆ°Á?</h1>
      </div>

      {/* ÁØ©ÈÅ∏?Ä??*/}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          
          <div className="flex items-center space-x-2">
            <BuildingStorefrontIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '?®ÈÉ®', label: '?®ÈÉ®?âÂ∫´' },
                { value: '‰∏ªÂÄâÂ∫´', label: '‰∏ªÂÄâÂ∫´' },
                { value: '?ÜÂÄâÂ∫´A', label: '?ÜÂÄâÂ∫´A' }
              ]}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="?∏Ê??âÂ∫´"
              className="w-36"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <SearchableSelect
              options={[
                { value: '?®ÈÉ®', label: '?®ÈÉ®?ÜÈ?' },
                { value: '?çÈ£æ', label: '?çÈ£æ' },
                { value: '?ç‰ª∂', label: '?ç‰ª∂' },
                { value: 'Ë¥àÂ?', label: 'Ë¥àÂ?' }
              ]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="?∏Ê??ÜÂ??ÜÈ?"
              className="w-32"
            />
          </div>

          <div className="text-sm text-gray-500 font-chinese">
            ??{filteredData.length} ?ÖÂ???
          </div>
        </div>
      </div>

      {/* ‰∏ªË?Â∫´Â?Ë°®Ê†º */}
      <StandardTable
        data={filteredData}
        columns={columns}
        title="Â∫´Â?Ê∏ÖÂñÆ"
        emptyMessage="Ê≤íÊ??æÂà∞Á¨¶Â?Ê¢ù‰ª∂?ÑÂ∫´Â≠òË???
        exportFileName="Â∫´Â?Ê∏ÖÂñÆ"
      />

      {/* Áµ±Ë??òË? */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{filteredData.length}</div>
          <div className="text-sm text-gray-500 font-chinese">Á∏ΩÂ??ÅÊï∏</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{filteredData.filter(item => item.status === 'low').length}</div>
          <div className="text-sm text-gray-500 font-chinese">‰ΩéÂ∫´Â≠òË≠¶Á§?/div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{filteredData.filter(item => item.status === 'presale').length}</div>
          <div className="text-sm text-gray-500 font-chinese">?êÂîÆ?ÜÂ?</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            NT$ {filteredData.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-chinese">Á∏ΩÂ∫´Â≠òÂÉπ??/div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Inventory;
