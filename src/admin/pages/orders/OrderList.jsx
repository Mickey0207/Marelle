import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderDataManager, { 
  OrderStatus, 
  PaymentStatus, 
  OrderType, 
  OrderPriority 
} from '../../data/orderDataManager';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    loadStatistics();
  }, [searchQuery, selectedStatus, selectedPaymentStatus, selectedType, selectedPriority]);

  const loadOrders = () => {
    setLoading(true);
    try {
      const filters = {
        status: selectedStatus ? [selectedStatus] : [],
        paymentStatus: selectedPaymentStatus ? [selectedPaymentStatus] : [],
        type: selectedType || null,
        priority: selectedPriority || null
      };
      
      const results = orderDataManager.searchOrders(searchQuery, filters);
      setOrders(results);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = () => {
    try {
      const stats = orderDataManager.getOrderStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('確定要刪除這個訂單嗎？此操作無法復原。')) {
      const result = orderDataManager.deleteOrder(id);
      if (result.success) {
        loadOrders();
        loadStatistics();
      } else {
        alert('刪除失敗：' + result.error);
      }
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    const result = orderDataManager.updateOrderStatus(
      orderId, 
      newStatus, 
      '手動更新狀態', 
      null, 
      true
    );
    
    if (result.success) {
      loadOrders();
      loadStatistics();
    } else {
      alert('狀態更新失敗：' + result.error);
    }
  };

  const handleBatchStatusUpdate = (newStatus) => {
    if (selectedOrders.length === 0) {
      alert('請先選擇要操作的訂單');
      return;
    }

    if (window.confirm(`確定要將 ${selectedOrders.length} 個訂單狀態更新為「${getStatusLabel(newStatus)}」嗎？`)) {
      const result = orderDataManager.batchUpdateStatus(
        selectedOrders,
        newStatus,
        '批次狀態更新'
      );

      if (result.success) {
        alert(`成功更新 ${result.results.successful.length} 個訂單`);
        setSelectedOrders([]);
        setShowBatchActions(false);
        loadOrders();
        loadStatistics();
      } else {
        alert('批次更新失敗：' + result.error);
      }
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      const newSelection = prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId];
      
      setShowBatchActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
      setShowBatchActions(false);
    } else {
      const allOrderIds = orders.map(order => order.id);
      setSelectedOrders(allOrderIds);
      setShowBatchActions(true);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [OrderStatus.PENDING]: { 
        label: '待處理', 
        className: 'bg-gray-100 text-gray-800',
        icon: ClockIcon
      },
      [OrderStatus.PAYMENT_PENDING]: { 
        label: '待付款', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: CurrencyDollarIcon
      },
      [OrderStatus.CONFIRMED]: { 
        label: '已確認', 
        className: 'bg-blue-100 text-blue-800',
        icon: CheckCircleIcon
      },
      [OrderStatus.PROCESSING]: { 
        label: '處理中', 
        className: 'bg-purple-100 text-purple-800',
        icon: ClockIcon
      },
      [OrderStatus.SHIPPED]: { 
        label: '已出貨', 
        className: 'bg-indigo-100 text-indigo-800',
        icon: TruckIcon
      },
      [OrderStatus.DELIVERED]: { 
        label: '已送達', 
        className: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      },
      [OrderStatus.COMPLETED]: { 
        label: '已完成', 
        className: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      },
      [OrderStatus.CANCELLED]: { 
        label: '已取消', 
        className: 'bg-red-100 text-red-800',
        icon: ExclamationTriangleIcon
      },
      [OrderStatus.REFUNDED]: { 
        label: '已退款', 
        className: 'bg-orange-100 text-orange-800',
        icon: ExclamationTriangleIcon
      }
    };

    const config = statusConfig[status] || { 
      label: status, 
      className: 'bg-gray-100 text-gray-800',
      icon: ClockIcon
    };
    
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      [PaymentStatus.UNPAID]: { label: '未付款', className: 'bg-red-100 text-red-800' },
      [PaymentStatus.PAID]: { label: '已付款', className: 'bg-green-100 text-green-800' },
      [PaymentStatus.CONFIRMED]: { label: '已確認', className: 'bg-green-100 text-green-800' },
      [PaymentStatus.FAILED]: { label: '失敗', className: 'bg-red-100 text-red-800' },
      [PaymentStatus.REFUNDED]: { label: '已退款', className: 'bg-orange-100 text-orange-800' }
    };

    const config = statusConfig[status] || { 
      label: status, 
      className: 'bg-gray-100 text-gray-800' 
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      [OrderPriority.LOW]: { label: '低', className: 'bg-gray-100 text-gray-800' },
      [OrderPriority.NORMAL]: { label: '一般', className: 'bg-blue-100 text-blue-800' },
      [OrderPriority.HIGH]: { label: '高', className: 'bg-orange-100 text-orange-800' },
      [OrderPriority.URGENT]: { label: '緊急', className: 'bg-red-100 text-red-800' },
      [OrderPriority.VIP]: { label: 'VIP', className: 'bg-purple-100 text-purple-800' }
    };

    const config = priorityConfig[priority] || { 
      label: priority, 
      className: 'bg-gray-100 text-gray-800' 
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getStatusLabel = (status) => {
    const labels = {
      [OrderStatus.PENDING]: '待處理',
      [OrderStatus.PAYMENT_PENDING]: '待付款',
      [OrderStatus.CONFIRMED]: '已確認',
      [OrderStatus.PROCESSING]: '處理中',
      [OrderStatus.SHIPPED]: '已出貨',
      [OrderStatus.DELIVERED]: '已送達',
      [OrderStatus.COMPLETED]: '已完成',
      [OrderStatus.CANCELLED]: '已取消'
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">載入訂單資料中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題和統計卡片 */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-chinese">訂單管理</h1>
          <Link
            to="/admin/orders/add"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>新增訂單</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">總訂單</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">總營收</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(statistics.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">今日訂單</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.todayOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">獨立客戶</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.uniqueCustomers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">待處理</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(statistics.statusDistribution?.pending || 0) + 
                   (statistics.statusDistribution?.payment_pending || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜尋和篩選工具列 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋訂單編號、客戶信箱、電話..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 border border-gray-300 text-gray-700 rounded-lg hover:bg-[#fdf8f2]/30 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>篩選</span>
            </button>
          </div>
        </div>

        {/* 篩選選項 */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">訂單狀態</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">全部狀態</option>
                  <option value={OrderStatus.PENDING}>待處理</option>
                  <option value={OrderStatus.PAYMENT_PENDING}>待付款</option>
                  <option value={OrderStatus.CONFIRMED}>已確認</option>
                  <option value={OrderStatus.PROCESSING}>處理中</option>
                  <option value={OrderStatus.SHIPPED}>已出貨</option>
                  <option value={OrderStatus.DELIVERED}>已送達</option>
                  <option value={OrderStatus.COMPLETED}>已完成</option>
                  <option value={OrderStatus.CANCELLED}>已取消</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">付款狀態</label>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">全部狀態</option>
                  <option value={PaymentStatus.UNPAID}>未付款</option>
                  <option value={PaymentStatus.PAID}>已付款</option>
                  <option value={PaymentStatus.CONFIRMED}>已確認</option>
                  <option value={PaymentStatus.FAILED}>失敗</option>
                  <option value={PaymentStatus.REFUNDED}>已退款</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">訂單類型</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">全部類型</option>
                  <option value={OrderType.NORMAL}>一般訂單</option>
                  <option value={OrderType.PRE_ORDER}>預購訂單</option>
                  <option value={OrderType.GIFT}>禮品訂單</option>
                  <option value={OrderType.SAMPLE}>試用品</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">優先級</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">全部優先級</option>
                  <option value={OrderPriority.LOW}>低</option>
                  <option value={OrderPriority.NORMAL}>一般</option>
                  <option value={OrderPriority.HIGH}>高</option>
                  <option value={OrderPriority.URGENT}>緊急</option>
                  <option value={OrderPriority.VIP}>VIP</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 批次操作工具列 */}
      {showBatchActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              已選擇 {selectedOrders.length} 個訂單
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBatchStatusUpdate(OrderStatus.CONFIRMED)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                批次確認
              </button>
              <button
                onClick={() => handleBatchStatusUpdate(OrderStatus.SHIPPED)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                批次出貨
              </button>
              <button
                onClick={() => handleBatchStatusUpdate(OrderStatus.CANCELLED)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                批次取消
              </button>
              <button
                onClick={() => {
                  setSelectedOrders([]);
                  setShowBatchActions(false);
                }}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                取消選擇
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 訂單表格 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#fdf8f2]/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  訂單資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客戶資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  建立時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#fdf8f2]/30 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 font-mono">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} 件商品
                      </div>
                      {order.priority !== OrderPriority.NORMAL && (
                        <div className="mt-1">
                          {getPriorityBadge(order.priority)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerEmail}
                      </div>
                      {order.customerPhone && (
                        <div className="text-sm text-gray-500">
                          {order.customerPhone}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        {order.customerType === 'member' ? '會員' : '訪客'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="text-xs text-green-600">
                          折扣 {formatCurrency(order.discountAmount)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-[#cc824d] hover:text-[#b3723f] transition-colors"
                        title="查看詳情"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/admin/orders/${order.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="編輯"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="刪除"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">沒有找到訂單</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedStatus || selectedPaymentStatus || selectedType || selectedPriority
                ? '嘗試調整搜尋條件或篩選器'
                : '開始建立您的第一個訂單'
              }
            </p>
            {!searchQuery && !selectedStatus && !selectedPaymentStatus && !selectedType && !selectedPriority && (
              <div className="mt-6">
                <Link
                  to="/admin/orders/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#cc824d] hover:bg-[#b3723f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cc824d]"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  新增訂單
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;