import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StandardTable from '../../components/StandardTable';
import procurementDataManager, { PurchaseOrderStatus, PurchasePriority } from '../../data/procurementDataManager';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    loadOrders();
    loadStatistics();
  }, [searchQuery, selectedStatus, selectedPriority]);

  const loadOrders = () => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (selectedStatus) filters.status = selectedStatus;
    if (selectedPriority) filters.priority = selectedPriority;
    
    const results = procurementDataManager.getPurchaseOrders(filters);
    setOrders(results);
  };

  const loadStatistics = () => {
    const stats = procurementDataManager.getDashboardStats();
    setStatistics(stats);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [PurchaseOrderStatus.DRAFT]: { label: '草稿', className: 'bg-gray-100 text-gray-800' },
      [PurchaseOrderStatus.PENDING_APPROVAL]: { label: '待審核', className: 'bg-yellow-100 text-yellow-800' },
      [PurchaseOrderStatus.APPROVED]: { label: '已核准', className: 'bg-blue-100 text-blue-800' },
      [PurchaseOrderStatus.SENT_TO_SUPPLIER]: { label: '已發送', className: 'bg-purple-100 text-purple-800' },
      [PurchaseOrderStatus.CONFIRMED]: { label: '已確認', className: 'bg-green-100 text-green-800' },
      [PurchaseOrderStatus.COMPLETED]: { label: '已完成', className: 'bg-green-100 text-green-800' },
      [PurchaseOrderStatus.CANCELLED]: { label: '已取消', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || statusConfig[PurchaseOrderStatus.DRAFT];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      [PurchasePriority.LOW]: { label: '低', className: 'bg-gray-100 text-gray-800' },
      [PurchasePriority.MEDIUM]: { label: '中', className: 'bg-blue-100 text-blue-800' },
      [PurchasePriority.HIGH]: { label: '高', className: 'bg-yellow-100 text-yellow-800' },
      [PurchasePriority.URGENT]: { label: '緊急', className: 'bg-red-100 text-red-800' }
    };

    const config = priorityConfig[priority] || priorityConfig[PurchasePriority.MEDIUM];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // 表格列配置
  const columns = [
    {
      key: 'poNumber',
      label: '採購單號',
      sortable: true,
      render: (_, order) => (
        <Link
          to={`/admin/procurement/orders/${order?.id}`}
          className="text-[#cc824d] hover:text-[#b3723f] font-medium"
        >
          {order?.poNumber || 'N/A'}
        </Link>
      )
    },
    {
      key: 'supplierName',
      label: '供應商',
      sortable: true,
      render: (_, order) => (
        <span className="text-gray-900">{order?.supplierName || 'N/A'}</span>
      )
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (_, order) => getStatusBadge(order?.status)
    },
    {
      key: 'priority',
      label: '優先級',
      sortable: true,
      render: (_, order) => getPriorityBadge(order?.priority)
    },
    {
      key: 'totalWithTax',
      label: '總金額',
      sortable: true,
      render: (_, order) => (
        <span className="text-gray-900 font-medium">
          ${order?.totalWithTax ? order.totalWithTax.toLocaleString() : '0'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: '建立日期',
      sortable: true,
      render: (_, order) => (
        <span className="text-gray-500">
          {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '操作',
      render: (_, order) => (
        <div className="flex space-x-2">
          <Link
            to={`/admin/procurement/orders/${order?.id}`}
            className="text-[#cc824d] hover:text-[#b3723f]"
            title="查看詳情"
          >
            <EyeIcon className="w-4 h-4" />
          </Link>
          <Link
            to={`/admin/procurement/orders/edit/${order?.id}`}
            className="text-green-600 hover:text-green-900"
            title="編輯"
          >
            <PencilIcon className="w-4 h-4" />
          </Link>
        </div>
      )
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600'
    };

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-8">
      {/* 頁面標題和統計 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">採購單管理</h1>
            <p className="text-gray-600">管理和追蹤所有採購訂單</p>
          </div>
          <Link
            to="/admin/procurement/orders/add"
            className="bg-[#cc824d] hover:bg-[#b3723f] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            新增採購單
          </Link>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="總採購單"
            value={statistics.totalOrders || 0}
            icon={DocumentTextIcon}
            color="blue"
          />
          <StatCard
            title="待處理"
            value={statistics.pendingOrders || 0}
            icon={ClockIcon}
            color="yellow"
          />
          <StatCard
            title="已完成"
            value={statistics.completedOrders || 0}
            icon={CheckCircleIcon}
            color="green"
          />
          <StatCard
            title="本月支出"
            value={`$${(statistics.thisMonthSpending || 0).toLocaleString()}`}
            icon={CurrencyDollarIcon}
            color="green"
          />
        </div>
      </div>

      {/* 搜尋和篩選 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有狀態</option>
              <option value={PurchaseOrderStatus.DRAFT}>草稿</option>
              <option value={PurchaseOrderStatus.PENDING_APPROVAL}>待審核</option>
              <option value={PurchaseOrderStatus.APPROVED}>已核准</option>
              <option value={PurchaseOrderStatus.SENT_TO_SUPPLIER}>已發送</option>
              <option value={PurchaseOrderStatus.CONFIRMED}>已確認</option>
              <option value={PurchaseOrderStatus.COMPLETED}>已完成</option>
            </select>
          </div>
        </div>
      </div>

      {/* 訂單列表 */}
      <StandardTable 
        title="採購單清單"
        columns={columns}
        data={orders}
        exportFileName="purchase-orders"
        emptyMessage="沒有找到採購單，開始建立第一個採購單吧"
      />
    </div>
  );
};

export default PurchaseOrderList;