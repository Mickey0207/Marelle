import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCartIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import procurementDataManager from '../../data/procurementDataManager';

const ProcurementOverview = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [urgentSuggestions, setUrgentSuggestions] = useState([]);
  const [pendingInspections, setPendingInspections] = useState([]);

  useEffect(() => {
    // 載入統計數據
    const dashboardStats = procurementDataManager.getDashboardStats();
    setStats(dashboardStats);

    // 載入最近的採購單
    const orders = procurementDataManager.getPurchaseOrders();
    setRecentOrders(orders.slice(0, 5));

    // 載入緊急建議
    const suggestions = procurementDataManager.getProcurementSuggestions({ 
      priority: 'urgent',
      isActionTaken: false 
    });
    setUrgentSuggestions(suggestions.slice(0, 3));

    // 載入待驗收項目
    const inspections = procurementDataManager.getInspectionRecords({ 
      status: 'pending' 
    });
    setPendingInspections(inspections.slice(0, 3));
  }, []);

  const StatCard = ({ title, value, subtitle, icon: Icon, color, link }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600', 
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };

    const CardContent = () => (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-gray-100 text-gray-600'}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );

    return link ? (
      <Link to={link} className="block">
        <CardContent />
      </Link>
    ) : (
      <CardContent />
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'production': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'draft': '草稿',
      'pending': '待審核',
      'approved': '已核准',
      'confirmed': '已確認',
      'production': '生產中',
      'shipped': '已出貨',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status] || '未知';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'text-gray-600',
      'normal': 'text-blue-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600',
      'critical': 'text-red-800'
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 主要統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="本月採購額"
          value={`$${(stats.thisMonthSpending || 0).toLocaleString()}`}
          subtitle="較上月"
          icon={CurrencyDollarIcon}
          color="blue"
          link="/admin/procurement/analytics"
        />
        <StatCard
          title="待處理訂單"
          value={stats.pendingOrders || 0}
          subtitle="需要關注"
          icon={ClockIcon}
          color="yellow"
          link="/admin/procurement/orders"
        />
        <StatCard
          title="本月節省"
          value={`$${(stats.costSavings || 0).toLocaleString()}`}
          subtitle="成本控制"
          icon={CurrencyDollarIcon}
          color="green"
          link="/admin/procurement/analytics"
        />
        <StatCard
          title="準時交貨率"
          value={`${(stats.onTimeDeliveryRate || 0).toFixed(1)}%`}
          subtitle="供應商表現"
          icon={TruckIcon}
          color="purple"
          link="/admin/procurement/analytics"
        />
      </div>

      {/* 次要統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="緊急建議"
          value={stats.urgentSuggestions || 0}
          subtitle="需要處理"
          icon={ExclamationTriangleIcon}
          color="red"
          link="/admin/procurement/suggestions"
        />
        <StatCard
          title="待驗收項目"
          value={stats.pendingInspections || 0}
          subtitle="等待確認"
          icon={ClipboardDocumentCheckIcon}
          color="indigo"
          link="/admin/procurement/inspection"
        />
        <StatCard
          title="已完成訂單"
          value={stats.completedOrders || 0}
          subtitle="成功交付"
          icon={CheckCircleIcon}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 最近採購單 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <DocumentTextIcon className="w-6 h-6 mr-2" />
              最近採購單
            </h2>
            <Link 
              to="/admin/procurement/orders"
              className="text-[#cc824d] hover:text-[#b3723f] text-sm font-medium"
            >
              查看全部
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/admin/procurement/orders/${order.id}`}
                    className="text-gray-900 font-medium hover:text-[#cc824d]"
                  >
                    {order.poNumber}
                  </Link>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{order.supplierName}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    金額: ${order.totalWithTax.toLocaleString()}
                  </span>
                  <span className="text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            
            {recentOrders.length === 0 && (
              <p className="text-gray-500 text-center py-4">暫無最近採購單</p>
            )}
          </div>
        </div>

        {/* 緊急建議 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
              緊急建議
            </h2>
            <Link 
              to="/admin/procurement/suggestions"
              className="text-[#cc824d] hover:text-[#b3723f] text-sm font-medium"
            >
              查看全部
            </Link>
          </div>
          
          <div className="space-y-4">
            {urgentSuggestions.map((suggestion) => (
              <div 
                key={suggestion.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-gray-900 font-medium text-sm">
                    {suggestion.productName || suggestion.supplierName}
                  </h3>
                  <span className={`text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{suggestion.reason}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{suggestion.type === 'stock_alert' ? '庫存警告' : '供應商問題'}</span>
                  <span>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            
            {urgentSuggestions.length === 0 && (
              <p className="text-gray-500 text-center py-4">暫無緊急建議</p>
            )}
          </div>
        </div>
      </div>

      {/* 快速操作按鈕 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/procurement/orders/add"
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg p-4 text-center hover:bg-white transition-colors"
          >
            <ShoppingCartIcon className="w-8 h-8 text-[#cc824d] mx-auto mb-2" />
            <span className="text-gray-900 font-medium">新增採購單</span>
          </Link>
          
          <Link
            to="/admin/procurement/suggestions"
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg p-4 text-center hover:bg-white transition-colors"
          >
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <span className="text-gray-900 font-medium">查看建議</span>
          </Link>
          
          <Link
            to="/admin/procurement/inspection"
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg p-4 text-center hover:bg-white transition-colors"
          >
            <ClipboardDocumentCheckIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-gray-900 font-medium">驗收管理</span>
          </Link>
          
          <Link
            to="/admin/procurement/analytics"
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg p-4 text-center hover:bg-white transition-colors"
          >
            <CurrencyDollarIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-gray-900 font-medium">成本分析</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProcurementOverview;