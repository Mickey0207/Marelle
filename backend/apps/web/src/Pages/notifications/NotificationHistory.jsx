import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BellIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EyeIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { gsap } from 'gsap';
import notificationDataManager from '../../../../external_mock/notifications/notificationDataManager.js';
import StandardTable from '../../components/ui/StandardTable';
import IconActionButton from '../../components/ui/IconActionButton.jsx';

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialStatus = ['all','delivered','failed','pending','sent'].includes(params.get('status')) ? params.get('status') : 'all';
  const [filters, setFilters] = useState({
    status: initialStatus,
    type: 'all',
    dateRange: 'all',
    searchQuery: ''
  });
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // 從資料管理器讀取模擬通知
  const allNotifications = notificationDataManager.getNotifications();

  useEffect(() => {
    loadNotifications();
    
    // 動畫效果
    gsap.fromTo(
      '.notification-item',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, [filters]);

  // 當使用者在 UI 切換狀態時，同步更新網址查詢參數（保持可分享）
  useEffect(() => {
    const next = new URLSearchParams(location.search);
    if (filters.status && filters.status !== 'all') {
      next.set('status', filters.status);
    } else {
      next.delete('status');
    }
    const nextSearch = next.toString();
    const currentSearch = location.search.startsWith('?') ? location.search.slice(1) : location.search;
    if (nextSearch !== currentSearch) {
      navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 800));
      
  let filteredNotifications = [...allNotifications];
      
      // 狀態篩選
      if (filters.status !== 'all') {
        filteredNotifications = filteredNotifications.filter(n => n.status === filters.status);
      }
      
      // 類型篩選
      if (filters.type !== 'all') {
        filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
      }
      
      // 搜尋篩選
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredNotifications = filteredNotifications.filter(n => 
          n.subject.toLowerCase().includes(query) ||
          n.recipientName.toLowerCase().includes(query) ||
          n.recipientEmail.toLowerCase().includes(query)
        );
      }
      
      // 日期範圍篩選
      const now = new Date();
      const dateFilter = {
        '1day': 1,
        '7days': 7,
        '30days': 30,
        '90days': 90
      };
      
      if (filters.dateRange !== 'all' && dateFilter[filters.dateRange]) {
        const cutoffDate = new Date(now.getTime() - dateFilter[filters.dateRange] * 24 * 60 * 60 * 1000);
        filteredNotifications = filteredNotifications.filter(n => 
          new Date(n.createdAt) >= cutoffDate
        );
      }
      
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return '已送達';
      case 'failed':
        return '發送失敗';
      case 'pending':
        return '待發送';
      case 'sent':
        return '已發送';
      default:
        return '未知';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order':
        return '';
      case 'payment':
        return '';
      case 'shipping':
        return '';
      case 'promotion':
        return '';
      case 'system':
        return '';
      default:
        return '';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'order':
        return '訂單通知';
      case 'payment':
        return '付款通知';
      case 'shipping':
        return '物流通知';
      case 'promotion':
        return '促銷通知';
      case 'system':
        return '系統通知';
      default:
        return '一般通知';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500';
      case 'high':
        return 'border-l-4 border-orange-500';
      case 'normal':
        return 'border-l-4 border-blue-500';
      case 'low':
        return 'border-l-4 border-gray-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => {
      if (prev.includes(notificationId)) {
        return prev.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  };

  const handleBatchDelete = (ids) => {
    if (!ids || ids.length === 0) return;
    if (!confirm(`確定要刪除選中的 ${ids.length} 個通知嗎？`)) return;
    setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
    setSelectedNotifications([]);
  };

  const handleDeleteSingle = (id) => {
    if (!confirm('確定要刪除此通知嗎？')) return;
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedNotifications(prev => prev.filter(sel => sel !== id));
  };

  const handleRetryFailed = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'pending', errorMessage: null }
          : n
      )
    );
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入通知歷史中...</span>
        </div>
      </div>
    );
  }

  // 定義表格欄位
  const columns = [
    {
      key: 'subject',
      label: '主旨',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-900 font-medium">{value}</span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClass(row.status)}`}>
            {getStatusText(row.status)}
          </span>
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
            {getTypeText(row.type)}
          </span>
        </div>
      )
    },
    {
      key: 'recipientName',
      label: '收件人',
      render: (value, row) => (
        <div className="text-gray-900">
          <div className="font-medium">{row.recipientName}</div>
          <div className="text-xs text-gray-500">{row.recipientEmail || '-'}</div>
        </div>
      )
    },
    { key: 'channel', label: '渠道' },
    { key: 'createdAt', label: '建立時間', render: (v) => <span>{formatDateTime(v)}</span> },
    { key: 'sentAt', label: '發送時間', render: (v) => <span>{formatDateTime(v)}</span> },
    { key: 'deliveredAt', label: '送達時間', render: (v) => <span>{formatDateTime(v)}</span> },
    { key: 'openedAt', label: '開啟時間', render: (v) => <span>{formatDateTime(v)}</span> },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <IconActionButton Icon={EyeIcon} label="檢視" variant="gray" />
          {row.status === 'failed' && (
            <IconActionButton Icon={ExclamationTriangleIcon} label="重新發送" variant="blue" onClick={() => handleRetryFailed(row.id)} />
          )}
          <IconActionButton Icon={TrashIcon} label="刪除" variant="red" onClick={() => handleDeleteSingle(row.id)} />
        </div>
      )
    }
  ];

  const batchActions = [
    {
      label: '刪除選取',
      variant: 'danger',
      onClick: handleBatchDelete,
      icon: TrashIcon
    }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">通知歷史</h1>
        <p className="text-gray-600 mt-2">查看所有已發送的通知記錄</p>
      </div>

      {/* 篩選器 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
        <div className="grid grid-cols-4 gap-4">
          {/* 搜尋 */}
          <div className="col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜尋收件人、主題..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
          </div>

          {/* 狀態篩選 */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="all">所有狀態</option>
              <option value="delivered">已送達</option>
              <option value="failed">發送失敗</option>
              <option value="pending">待發送</option>
              <option value="sent">已發送</option>
            </select>
          </div>

          {/* 類型篩選 */}
          <div>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="all">所有類型</option>
              <option value="order">訂單通知</option>
              <option value="payment">付款通知</option>
              <option value="shipping">物流通知</option>
              <option value="promotion">促銷通知</option>
              <option value="system">系統通知</option>
            </select>
          </div>
        </div>

  <div className="grid grid-cols-3 gap-4 mt-4">
          {/* 日期範圍 */}
          <div>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="all">所有時間</option>
              <option value="1day">最近1天</option>
              <option value="7days">最近7天</option>
              <option value="30days">最近30天</option>
              <option value="90days">最近90天</option>
            </select>
          </div>

          {/* 預留右側工具區 */}
          <div className="col-span-2" />
        </div>
      </div>

      {/* 通知表格 */}
      <StandardTable
        data={notifications}
        columns={columns}
        title="通知列表"
        exportFileName="通知歷史"
        enableBatchSelection={true}
        selectedItems={selectedNotifications}
        onSelectedItemsChange={(ids) => setSelectedNotifications(ids)}
        batchActions={batchActions}
        getRowId={(row) => row.id}
        emptyIcon={BellIcon}
      />
    </div>
  );
};

export default NotificationHistory;
