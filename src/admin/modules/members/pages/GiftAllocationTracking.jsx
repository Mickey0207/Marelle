import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  GiftIcon,
  UserIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "@shared/adminStyles";

const AllocationStatus = {
  PENDING: 'pending',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const SelectionType = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual'
};

const GiftAllocationTracking = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [statistics, setStatistics] = useState({
    totalAllocations: 0,
    totalCost: 0,
    pendingAllocations: 0,
    shippedAllocations: 0
  });

  useEffect(() => {
    loadAllocations();
    loadStatistics();

    gsap.fromTo(
      '.allocation-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const loadAllocations = async () => {
    setLoading(true);
    try {
      // 模擬載入配送記錄資料
      const mockAllocations = [
        {
          id: 'alloc-1',
          memberId: 'member-1',
          memberName: '張小明',
          memberTier: 'gold',
          orderId: 'order-1001',
          allocatedDate: new Date('2024-01-15'),
          gifts: [
            { giftId: 'gift-1', name: '精美茶具組', quantity: 1, unitCost: 150, selectionType: 'automatic' },
            { giftId: 'gift-2', name: '限量手錶', quantity: 1, unitCost: 200, selectionType: 'manual' }
          ],
          totalCost: 350,
          status: 'shipped',
          shippedDate: new Date('2024-01-16'),
          trackingNumber: 'TW123456789'
        },
        {
          id: 'alloc-2',
          memberId: 'member-2',
          memberName: '李小華',
          memberTier: 'silver',
          orderId: 'order-1002',
          allocatedDate: new Date('2024-01-16'),
          gifts: [
            { giftId: 'gift-3', name: '香氛蠟燭', quantity: 2, unitCost: 80, selectionType: 'automatic' }
          ],
          totalCost: 160,
          status: 'pending',
          shippedDate: null,
          trackingNumber: null
        },
        {
          id: 'alloc-3',
          memberId: 'member-3',
          memberName: '王小美',
          memberTier: 'platinum',
          orderId: 'order-1003',
          allocatedDate: new Date('2024-01-17'),
          gifts: [
            { giftId: 'gift-4', name: '高級護膚組', quantity: 1, unitCost: 300, selectionType: 'manual' },
            { giftId: 'gift-5', name: '絲質圍巾', quantity: 1, unitCost: 120, selectionType: 'automatic' }
          ],
          totalCost: 420,
          status: 'delivered',
          shippedDate: new Date('2024-01-18'),
          deliveredDate: new Date('2024-01-20'),
          trackingNumber: 'TW987654321'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      setAllocations(mockAllocations);
    } catch (error) {
      console.error('Error loading allocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const mockStats = {
        totalAllocations: 156,
        totalCost: 45620,
        pendingAllocations: 23,
        shippedAllocations: 89
      };
      setStatistics(mockStats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [AllocationStatus.PENDING]: { label: '待發貨', className: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      [AllocationStatus.SHIPPED]: { label: '已發貨', className: 'bg-blue-100 text-blue-800', icon: TruckIcon },
      [AllocationStatus.DELIVERED]: { label: '已送達', className: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      [AllocationStatus.CANCELLED]: { label: '已取消', className: 'bg-red-100 text-red-800', icon: XCircleIcon }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800', icon: ClockIcon };
    const IconComponent = config.icon;
    
    return (
      <div className="flex items-center space-x-1">
        <IconComponent className="w-4 h-4" />
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
          {config.label}
        </span>
      </div>
    );
  };

  const getSelectionTypeBadge = (type) => {
    return type === SelectionType.AUTOMATIC ? (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">自動分配</span>
    ) : (
      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">手動選擇</span>
    );
  };

  const getMemberTierBadge = (tier) => {
    const tierConfig = {
      platinum: { label: '白金會員', className: 'bg-gray-100 text-gray-800' },
      gold: { label: '黃金會員', className: 'bg-yellow-100 text-yellow-800' },
      silver: { label: '銀級會員', className: 'bg-gray-100 text-gray-600' },
      bronze: { label: '銅級會員', className: 'bg-orange-100 text-orange-800' }
    };

    const config = tierConfig[tier] || { label: tier, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = allocation.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allocation.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allocation.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || allocation.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入配送追蹤數據中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">禮品配送追蹤</h1>
        <p className="text-gray-600 mt-2">追蹤會員禮品的分配與配送狀況</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="allocation-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <GiftIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.totalAllocations}</p>
              <p className="text-sm text-gray-600">總配送記錄</p>
            </div>
          </div>
        </div>

        <div className="allocation-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.totalCost.toLocaleString()}</p>
              <p className="text-sm text-gray-600">總配送成本</p>
            </div>
          </div>
        </div>

        <div className="allocation-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.pendingAllocations}</p>
              <p className="text-sm text-gray-600">待發貨</p>
            </div>
          </div>
        </div>

        <div className="allocation-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TruckIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.shippedAllocations}</p>
              <p className="text-sm text-gray-600">已發貨</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜尋和篩選 */}
      <div className={`${ADMIN_STYLES.glassCard} p-6 mb-6`}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋會員姓名、訂單編號或追蹤號碼..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="all">所有狀態</option>
                <option value="pending">待發貨</option>
                <option value="shipped">已發貨</option>
                <option value="delivered">已送達</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 配送記錄列表 */}
      <div className="space-y-4">
        {filteredAllocations.map((allocation) => (
          <div key={allocation.id} className={`allocation-card ${ADMIN_STYLES.glassCard}`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#cc824d] to-[#b8743d] rounded-lg flex items-center justify-center">
                    <GiftIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-chinese">
                      配送單號: {allocation.id}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{allocation.memberName}</span>
                      </div>
                      {getMemberTierBadge(allocation.memberTier)}
                    </div>
                  </div>
                </div>
                {getStatusBadge(allocation.status)}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 基本信息 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">基本信息</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">訂單編號：</span>
                      <span className="font-medium">{allocation.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">配送日期：</span>
                      <span className="font-medium">{allocation.allocatedDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">總成本：</span>
                      <span className="font-medium text-[#cc824d]">{allocation.totalCost.toLocaleString()}</span>
                    </div>
                    {allocation.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">追蹤號碼：</span>
                        <span className="font-medium font-mono">{allocation.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 禮品詳情 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">禮品詳情</h4>
                  <div className="space-y-2">
                    {allocation.gifts.map((gift, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{gift.name}</span>
                          {getSelectionTypeBadge(gift.selectionType)}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>數量: {gift.quantity}</span>
                          <span>單價: {gift.unitCost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 配送狀態 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">配送狀態</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">禮品已分配</span>
                      <span className="text-xs text-gray-500">
                        {allocation.allocatedDate.toLocaleDateString()}
                      </span>
                    </div>
                    
                    {allocation.shippedDate && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">已發貨</span>
                        <span className="text-xs text-gray-500">
                          {allocation.shippedDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {allocation.deliveredDate && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-sm">已送達</span>
                        <span className="text-xs text-gray-500">
                          {allocation.deliveredDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAllocations.length === 0 && (
        <div className="text-center py-12">
          <GiftIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg">沒有找到符合條件的配送記錄</div>
          <p className="text-gray-400 mt-2">嘗試調整搜尋條件或篩選設定</p>
        </div>
      )}
    </div>
  );
};

export default GiftAllocationTracking;
