import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  UserIcon,
  GiftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { giftDataManager } from '../data/giftDataManager';
import GlassModal from '../../components/GlassModal';
import CustomSelect from '../components/CustomSelect';

const GiftAllocationTracking = () => {
  const [allocations, setAllocations] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [statistics, setStatistics] = useState({
    totalAllocations: 0,
    totalCost: 0,
    totalMembers: 0,
    avgGiftsPerMember: 0,
    topGifts: [],
    monthlyTrend: []
  });

  useEffect(() => {
    loadAllocations();
    loadGifts();
    calculateStatistics();
  }, []);

  const loadAllocations = () => {
    // 模擬載入分配記錄資料
    const mockAllocations = [
      {
        id: 'alloc-1',
        memberId: 'member-1',
        memberName: '王小明',
        memberTier: 'gold',
        orderId: 'order-1001',
        allocatedDate: new Date('2024-01-15'),
        gifts: [
          { giftId: 'gift-1', quantity: 1, unitCost: 150, selectionType: 'automatic' },
          { giftId: 'gift-2', quantity: 1, unitCost: 200, selectionType: 'manual' }
        ],
        totalCost: 350,
        status: 'shipped',
        shippedDate: new Date('2024-01-16'),
        ruleId: 'tier-rule-1',
        campaignId: 'campaign-2024-01'
      },
      {
        id: 'alloc-2',
        memberId: 'member-2',
        memberName: '李美麗',
        memberTier: 'silver',
        orderId: 'order-1002',
        allocatedDate: new Date('2024-01-16'),
        gifts: [
          { giftId: 'gift-3', quantity: 2, unitCost: 100, selectionType: 'automatic' }
        ],
        totalCost: 200,
        status: 'pending',
        shippedDate: null,
        ruleId: 'tier-rule-2',
        campaignId: 'campaign-2024-01'
      },
      {
        id: 'alloc-3',
        memberId: 'member-3',
        memberName: '張大華',
        memberTier: 'diamond',
        orderId: 'order-1003',
        allocatedDate: new Date('2024-01-17'),
        gifts: [
          { giftId: 'gift-1', quantity: 1, unitCost: 150, selectionType: 'manual' },
          { giftId: 'gift-4', quantity: 1, unitCost: 300, selectionType: 'priority' },
          { giftId: 'gift-5', quantity: 1, unitCost: 80, selectionType: 'bonus' }
        ],
        totalCost: 530,
        status: 'processing',
        shippedDate: null,
        ruleId: 'tier-rule-3',
        campaignId: 'campaign-2024-01'
      },
      {
        id: 'alloc-4',
        memberId: 'member-4',
        memberName: '陳靜雯',
        memberTier: 'vip',
        orderId: 'order-1004',
        allocatedDate: new Date('2024-01-18'),
        gifts: [
          { giftId: 'gift-6', quantity: 1, unitCost: 500, selectionType: 'exclusive' },
          { giftId: 'gift-7', quantity: 2, unitCost: 120, selectionType: 'bonus' }
        ],
        totalCost: 740,
        status: 'shipped',
        shippedDate: new Date('2024-01-19'),
        ruleId: 'tier-rule-4',
        campaignId: 'campaign-2024-01'
      },
      {
        id: 'alloc-5',
        memberId: 'member-5',
        memberName: '林志明',
        memberTier: 'bronze',
        orderId: 'order-1005',
        allocatedDate: new Date('2024-01-19'),
        gifts: [
          { giftId: 'gift-8', quantity: 1, unitCost: 50, selectionType: 'automatic' }
        ],
        totalCost: 50,
        status: 'cancelled',
        shippedDate: null,
        ruleId: 'tier-rule-1',
        campaignId: 'campaign-2024-01'
      }
    ];
    setAllocations(mockAllocations);
  };

  const loadGifts = () => {
    const allGifts = giftDataManager.getAllGifts();
    setGifts(allGifts);
  };

  const calculateStatistics = () => {
    // 計算統計資料
    const stats = {
      totalAllocations: 5,
      totalCost: 1870,
      totalMembers: 5,
      avgGiftsPerMember: 1.8,
      topGifts: [
        { giftId: 'gift-1', name: '高效保濕面膜', allocations: 15, totalCost: 2250 },
        { giftId: 'gift-2', name: '經典潔面乳', allocations: 12, totalCost: 2400 },
        { giftId: 'gift-3', name: '精華小樣組', allocations: 10, totalCost: 1000 }
      ],
      monthlyTrend: [
        { month: '2023-10', allocations: 45, cost: 6750 },
        { month: '2023-11', allocations: 52, cost: 7800 },
        { month: '2023-12', allocations: 68, cost: 10200 },
        { month: '2024-01', allocations: 75, cost: 11250 }
      ]
    };
    setStatistics(stats);
  };

  const getGiftName = (giftId) => {
    const gift = gifts.find(g => g.id === giftId);
    return gift ? gift.name : '未知贈品';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: '待處理',
      processing: '處理中',
      shipped: '已出貨',
      delivered: '已送達',
      cancelled: '已取消'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getTierColor = (tier) => {
    const colorMap = {
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      diamond: 'bg-purple-100 text-purple-800',
      vip: 'bg-pink-100 text-pink-800'
    };
    return colorMap[tier] || 'bg-gray-100 text-gray-800';
  };

  const getSelectionTypeText = (type) => {
    const typeMap = {
      automatic: '自動分配',
      manual: '手動選擇',
      priority: '優先選擇',
      bonus: '額外贈品',
      exclusive: '專屬贈品'
    };
    return typeMap[type] || type;
  };

  const handleViewDetails = (allocation) => {
    setSelectedAllocation(allocation);
    setIsModalOpen(true);
  };

  const handleExportData = () => {
    // 模擬匯出功能
    const csvData = allocations.map(alloc => ({
      '分配ID': alloc.id,
      '會員姓名': alloc.memberName,
      '會員等級': alloc.memberTier,
      '訂單編號': alloc.orderId,
      '分配日期': alloc.allocatedDate.toLocaleDateString(),
      '贈品數量': alloc.gifts.length,
      '總成本': alloc.totalCost,
      '狀態': getStatusText(alloc.status)
    }));
    
    console.log('匯出資料:', csvData);
    alert('匯出功能已觸發（這裡會產生 CSV 檔案）');
  };

  const filteredAllocations = allocations.filter(allocation => {
    // 搜尋過濾
    const matchesSearch = 
      allocation.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.id.toLowerCase().includes(searchTerm.toLowerCase());

    // 狀態過濾
    const matchesStatus = filterStatus === 'all' || allocation.status === filterStatus;

    // 日期過濾
    const now = new Date();
    let matchesDate = true;
    if (filterDateRange === 'today') {
      matchesDate = allocation.allocatedDate.toDateString() === now.toDateString();
    } else if (filterDateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = allocation.allocatedDate >= weekAgo;
    } else if (filterDateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = allocation.allocatedDate >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const statusOptions = [
    { value: 'all', label: '全部狀態' },
    { value: 'pending', label: '待處理' },
    { value: 'processing', label: '處理中' },
    { value: 'shipped', label: '已出貨' },
    { value: 'delivered', label: '已送達' },
    { value: 'cancelled', label: '已取消' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: '全部時間' },
    { value: 'today', label: '今天' },
    { value: 'week', label: '本週' },
    { value: 'month', label: '本月' }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* 操作按鈕 */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-chinese"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>匯出資料</span>
          </button>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <GiftIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-chinese">總分配次數</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalAllocations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-chinese">總成本</p>
                <p className="text-2xl font-bold text-gray-900">NT$ {statistics.totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-chinese">受惠會員</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalMembers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-chinese">平均贈品數</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.avgGiftsPerMember}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 搜尋和過濾 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋會員姓名、訂單編號或分配ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
              />
            </div>

            <div>
              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                options={statusOptions}
                placeholder="選擇狀態"
              />
            </div>

            <div>
              <CustomSelect
                value={filterDateRange}
                onChange={setFilterDateRange}
                options={dateRangeOptions}
                placeholder="選擇時間範圍"
              />
            </div>
          </div>
        </div>

        {/* 分配記錄表格 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                    會員資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                    訂單編號
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                    分配日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                    贈品數量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                    總成本
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredAllocations.map((allocation) => (
                  <tr key={allocation.id} className="hover:bg-white/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-chinese">{allocation.memberName}</div>
                          <div className="text-sm text-gray-500">
                            <span className={`px-2 py-1 text-xs rounded-full ${getTierColor(allocation.memberTier)}`}>
                              {allocation.memberTier}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {allocation.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400 mr-2" />
                        {allocation.allocatedDate.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <GiftIcon className="w-4 h-4 text-[#cc824d] mr-2" />
                        {allocation.gifts.length} 份
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-2" />
                        NT$ {allocation.totalCost.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(allocation.status)}`}>
                        {getStatusText(allocation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(allocation)}
                        className="text-[#cc824d] hover:text-[#b3723f] transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAllocations.length === 0 && (
            <div className="text-center py-12">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 font-chinese">沒有分配記錄</h3>
              <p className="mt-1 text-sm text-gray-500 font-chinese">目前沒有符合條件的分配記錄</p>
            </div>
          )}
        </div>
      </div>

      {/* 分配詳情模態框 */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="分配記錄詳情"
        size="max-w-4xl"
      >
        {selectedAllocation && (
          <div className="p-6 space-y-6">
            {/* 基本資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold font-chinese mb-4">分配資訊</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">分配ID</label>
                    <p className="text-gray-900">{selectedAllocation.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">會員姓名</label>
                    <p className="text-gray-900 font-chinese">{selectedAllocation.memberName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">會員等級</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTierColor(selectedAllocation.memberTier)}`}>
                      {selectedAllocation.memberTier}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">訂單編號</label>
                    <p className="text-gray-900">{selectedAllocation.orderId}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold font-chinese mb-4">時間軸</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 font-chinese">分配日期</p>
                      <p className="text-gray-900">{selectedAllocation.allocatedDate.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {selectedAllocation.shippedDate && (
                    <div className="flex items-center space-x-3">
                      <TruckIcon className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 font-chinese">出貨日期</p>
                        <p className="text-gray-900">{selectedAllocation.shippedDate.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className={`w-5 h-5 ${selectedAllocation.status === 'delivered' ? 'text-green-500' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-700 font-chinese">目前狀態</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedAllocation.status)}`}>
                        {getStatusText(selectedAllocation.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 贈品明細 */}
            <div>
              <h3 className="text-lg font-bold font-chinese mb-4">贈品明細</h3>
              <div className="bg-white/40 rounded-lg border border-white/30 overflow-hidden">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="bg-white/20">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                        贈品名稱
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                        數量
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                        單價
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                        小計
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-chinese">
                        選擇方式
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {selectedAllocation.gifts.map((gift, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900 font-chinese">
                          {getGiftName(gift.giftId)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {gift.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          NT$ {gift.unitCost}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          NT$ {gift.quantity * gift.unitCost}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-chinese">
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {getSelectionTypeText(gift.selectionType)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-white/20">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 font-chinese">
                        總計
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        NT$ {selectedAllocation.totalCost}
                      </td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* 規則資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold font-chinese mb-4">適用規則</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">規則ID</label>
                    <p className="text-gray-900">{selectedAllocation.ruleId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">活動ID</label>
                    <p className="text-gray-900">{selectedAllocation.campaignId}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold font-chinese mb-4">成本分析</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">贈品成本</label>
                    <p className="text-gray-900">NT$ {selectedAllocation.totalCost}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">平均單品成本</label>
                    <p className="text-gray-900">
                      NT$ {Math.round(selectedAllocation.totalCost / selectedAllocation.gifts.reduce((sum, gift) => sum + gift.quantity, 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
};

export default GiftAllocationTracking;