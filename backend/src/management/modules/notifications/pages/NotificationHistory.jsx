import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EyeIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { gsap } from 'gsap';

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: '7days',
    searchQuery: ''
  });
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // 模擬通知數據
  const mockNotifications = [
    {
      id: 'notif-1',
      type: 'order',
      status: 'delivered',
      priority: 'normal',
      recipientType: 'customer',
      recipientId: 'user-123',
      recipientName: '王小明',
      recipientEmail: 'wang@example.com',
      recipientPhone: '0912345678',
      createdAt: '2024-01-15T10:30:00Z',
      scheduledAt: '2024-01-15T10:30:00Z',
      sentAt: '2024-01-15T10:31:23Z',
      deliveredAt: '2024-01-15T10:31:45Z',
      openedAt: '2024-01-15T11:15:22Z',
      subject: '訂單確認通知',
      content: '您的訂單 #ORD-2024-001 已確認並開始處理',
      orderNumber: 'ORD-2024-001',
      channel: 'email',
      errorMessage: null
    },
    {
      id: 'notif-2',
      type: 'promotion',
      status: 'delivered',
      priority: 'high',
      recipientType: 'customer',
      recipientId: 'user-456',
      recipientName: '李美華',
      recipientEmail: 'li@example.com',
      recipientPhone: '0987654321',
      createdAt: '2024-01-15T09:00:00Z',
      scheduledAt: '2024-01-15T09:00:00Z',
      sentAt: '2024-01-15T09:01:15Z',
      deliveredAt: '2024-01-15T09:01:28Z',
      openedAt: null,
      subject: '生日快樂！專屬優惠等您領取',
      content: '慶祝您的生日，我們為您準備了專屬優惠券',
      channel: 'sms',
      errorMessage: null
    },
    {
      id: 'notif-3',
      type: 'system',
      status: 'failed',
      priority: 'urgent',
      recipientType: 'admin',
      recipientId: 'admin-001',
      recipientName: '系統管理員',
      recipientEmail: 'admin@marelle.com',
      recipientPhone: null,
      createdAt: '2024-01-15T08:45:00Z',
      scheduledAt: '2024-01-15T08:45:00Z',
      sentAt: '2024-01-15T08:46:00Z',
      deliveredAt: null,
      openedAt: null,
      subject: '庫存警告：商品庫存不足',
      content: '商品「經典手提包」庫存已降至警戒線以下',
      channel: 'email',
      errorMessage: 'SMTP服務器連接失敗'
    },
    {
      id: 'notif-4',
      type: 'shipping',
      status: 'delivered',
      priority: 'normal',
      recipientType: 'customer',
      recipientId: 'user-789',
      recipientName: '陳志強',
      recipientEmail: 'chen@example.com',
      recipientPhone: '0911111111',
      createdAt: '2024-01-14T16:20:00Z',
      scheduledAt: '2024-01-14T16:20:00Z',
      sentAt: '2024-01-14T16:21:10Z',
      deliveredAt: '2024-01-14T16:21:25Z',
      openedAt: '2024-01-14T18:45:30Z',
      subject: '商品已出貨',
      content: '您的訂單 #ORD-2024-002 已出貨，預計明日送達',
      orderNumber: 'ORD-2024-002',
      trackingNumber: 'TW1234567890',
      channel: 'app',
      errorMessage: null
    },
    {
      id: 'notif-5',
      type: 'payment',
      status: 'pending',
      priority: 'high',
      recipientType: 'customer',
      recipientId: 'user-101',
      recipientName: '張雅婷',
      recipientEmail: 'zhang@example.com',
      recipientPhone: '0922222222',
      createdAt: '2024-01-15T14:30:00Z',
      scheduledAt: '2024-01-15T14:35:00Z',
      sentAt: null,
      deliveredAt: null,
      openedAt: null,
      subject: '付款提醒',
      content: '您的訂單 #ORD-2024-003 尚未完成付款',
      orderNumber: 'ORD-2024-003',
      channel: 'email',
      errorMessage: null
    }
  ];

  useEffect(() => {
    loadNotifications();
    
    // 動畫效果
    gsap.fromTo(
      '.notification-item',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, [filters]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredNotifications = [...mockNotifications];
      
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

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedNotifications.length === 0) return;
    
    if (confirm(`確定要刪除選中的 ${selectedNotifications.length} 個通知嗎？`)) {
      setNotifications(prev => 
        prev.filter(n => !selectedNotifications.includes(n.id))
      );
      setSelectedNotifications([]);
    }
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

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">通知歷史</h1>
        <p className="text-gray-600 mt-2">查看所有已發送的通知記錄</p>
      </div>

      {/* 統計概覽 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BellIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-gray-500 text-sm">總通知數</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.status === 'delivered').length}
              </p>
              <p className="text-gray-500 text-sm">成功送達</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.status === 'failed').length}
              </p>
              <p className="text-gray-500 text-sm">發送失敗</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <EyeIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.openedAt).length}
              </p>
              <p className="text-gray-500 text-sm">已開啟閱讀</p>
            </div>
          </div>
        </div>
      </div>

      {/* 篩選器 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜尋 */}
          <div className="md:col-span-2">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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

          {/* 批量操作 */}
          <div className="md:col-span-2 flex justify-end space-x-2">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {selectedNotifications.length === notifications.length ? '取消全選' : '全選'}
            </button>
            
            {selectedNotifications.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
              >
                <TrashIcon className="w-4 h-4" />
                <span>刪除 ({selectedNotifications.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 通知列表 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到通知記錄</h3>
            <p className="text-gray-500">請調整篩選條件或檢查是否有通知被發送</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`notification-item p-6 hover:bg-gray-50/50 transition-colors ${getPriorityClass(notification.priority)}`}
              >
                <div className="flex items-start space-x-4">
                  {/* 選擇框 */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="mt-1 rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                  />

                  {/* 通知圖標 */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                      {getTypeIcon(notification.type)}
                    </div>
                  </div>

                  {/* 通知內容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {notification.subject}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(notification.status)}`}>
                            {getStatusText(notification.status)}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            {getTypeText(notification.type)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {notification.content}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>收件人：{notification.recipientName}</span>
                          <span>渠道：{notification.channel}</span>
                          <span>建立時間：{formatDateTime(notification.createdAt)}</span>
                        </div>

                        {notification.errorMessage && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            錯誤：{notification.errorMessage}
                          </div>
                        )}
                      </div>

                      {/* 狀態和操作 */}
                      <div className="flex items-center space-x-3 ml-4">
                        {getStatusIcon(notification.status)}
                        
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          
                          {notification.status === 'failed' && (
                            <button
                              onClick={() => handleRetryFailed(notification.id)}
                              className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                              title="重新發送"
                            >
                              <ExclamationTriangleIcon className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button className="p-1 text-red-400 hover:text-red-600 transition-colors">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 詳細時間軸 */}
                    <div className="mt-3 flex items-center space-x-6 text-xs text-gray-400">
                      {notification.scheduledAt && (
                        <span>排程：{formatDateTime(notification.scheduledAt)}</span>
                      )}
                      {notification.sentAt && (
                        <span>發送：{formatDateTime(notification.sentAt)}</span>
                      )}
                      {notification.deliveredAt && (
                        <span>送達：{formatDateTime(notification.deliveredAt)}</span>
                      )}
                      {notification.openedAt && (
                        <span>開啟：{formatDateTime(notification.openedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 分頁 */}
      {notifications.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              上一頁
            </button>
            <span className="px-3 py-2 bg-[#cc824d] text-white rounded-lg">1</span>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              下一頁
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationHistory;
