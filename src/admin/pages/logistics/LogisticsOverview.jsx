import React, { useState, useEffect } from 'react';
import logisticsDataManager, { LogisticsStatus, LogisticsType } from '../../data/logisticsDataManager';

const LogisticsOverview = () => {
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [recentShipments, setRecentShipments] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = () => {
    // 載入統計數據
    const statusStats = logisticsDataManager.getShipmentStatusStats();
    const revenueStats = logisticsDataManager.getShippingRevenueStats();
    const typeStats = logisticsDataManager.getLogisticsTypeStats();
    const analyticsData = logisticsDataManager.getLogisticsAnalytics();
    
    setStats({
      ...statusStats,
      ...revenueStats,
      typeStats
    });
    
    setAnalytics(analyticsData);
    
    // 載入最近配送單
    const allShipments = logisticsDataManager.getAllShipments();
    setRecentShipments(allShipments.slice(0, 5));
    
    // 生成警示
    generateAlerts(allShipments, analyticsData);
  };

  const generateAlerts = (shipments, analyticsData) => {
    const alertList = [];
    
    // 檢查失敗配送
    const failedDeliveries = shipments.filter(s => s.status === LogisticsStatus.FAILED_DELIVERY);
    if (failedDeliveries.length > 0) {
      alertList.push({
        type: 'error',
        title: '配送失敗警告',
        message: `有 ${failedDeliveries.length} 筆配送失敗，需要處理`,
        count: failedDeliveries.length
      });
    }
    
    // 檢查逾期配送
    const now = new Date();
    const overdueShipments = shipments.filter(s => {
      if (!s.estimatedDelivery || s.status === LogisticsStatus.DELIVERED) return false;
      return new Date(s.estimatedDelivery) < now;
    });
    
    if (overdueShipments.length > 0) {
      alertList.push({
        type: 'warning',
        title: '逾期配送',
        message: `有 ${overdueShipments.length} 筆配送已逾期`,
        count: overdueShipments.length
      });
    }
    
    // 檢查準時率
    if (analyticsData.deliveryPerformance?.onTimeDeliveryRate < 90) {
      alertList.push({
        type: 'warning',
        title: '準時率偏低',
        message: `本月準時率為 ${analyticsData.deliveryPerformance.onTimeDeliveryRate}%，低於標準`,
        count: 1
      });
    }
    
    setAlerts(alertList);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      [LogisticsStatus.CREATED]: 'bg-gray-100 text-gray-800',
      [LogisticsStatus.PICKED_UP]: 'bg-blue-100 text-blue-800',
      [LogisticsStatus.IN_TRANSIT]: 'bg-yellow-100 text-yellow-800',
      [LogisticsStatus.OUT_FOR_DELIVERY]: 'bg-orange-100 text-orange-800',
      [LogisticsStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [LogisticsStatus.READY_FOR_PICKUP]: 'bg-purple-100 text-purple-800',
      [LogisticsStatus.PICKED_UP_BY_CUSTOMER]: 'bg-green-100 text-green-800',
      [LogisticsStatus.FAILED_DELIVERY]: 'bg-red-100 text-red-800',
      [LogisticsStatus.RETURNED]: 'bg-gray-100 text-gray-800',
      [LogisticsStatus.CANCELLED]: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplayName = (status) => {
    const names = {
      [LogisticsStatus.CREATED]: '已建立',
      [LogisticsStatus.PICKED_UP]: '已取貨',
      [LogisticsStatus.IN_TRANSIT]: '運送中',
      [LogisticsStatus.OUT_FOR_DELIVERY]: '派送中',
      [LogisticsStatus.DELIVERED]: '已送達',
      [LogisticsStatus.READY_FOR_PICKUP]: '可取貨',
      [LogisticsStatus.PICKED_UP_BY_CUSTOMER]: '已取貨',
      [LogisticsStatus.FAILED_DELIVERY]: '派送失敗',
      [LogisticsStatus.RETURNED]: '已退回',
      [LogisticsStatus.CANCELLED]: '已取消'
    };
    return names[status] || status;
  };

  const getLogisticsTypeDisplayName = (type) => {
    const names = {
      [LogisticsType.CONVENIENCE_STORE]: '超商取貨',
      [LogisticsType.HOME_DELIVERY]: '宅配到府',
      [LogisticsType.POST_OFFICE]: '郵局配送',
      [LogisticsType.EXPRESS]: '快遞',
      [LogisticsType.PICKUP]: '自取'
    };
    return names[type] || type;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ title, value, subtitle, icon, trend, trendValue }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-[#cc824d]/10 rounded-xl">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs 上個月</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">物流總覽</h1>
          <p className="text-gray-600">配送狀態、效能指標和即時追蹤</p>
        </div>

        {/* 警示面板 */}
        {alerts.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">⚠️ 重要警示</h2>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'error'
                      ? 'bg-red-50 border-red-400 text-red-700'
                      : 'bg-yellow-50 border-yellow-400 text-yellow-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{alert.title}</h3>
                      <p className="text-sm mt-1">{alert.message}</p>
                    </div>
                    <span className="bg-white px-2 py-1 rounded-full text-xs font-medium">
                      {alert.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="總配送數"
            value={stats.totalOrders || 0}
            subtitle="本月累計"
            icon={
              <svg className="w-6 h-6 text-[#cc824d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            trend="up"
            trendValue="+12.5%"
          />

          <StatCard
            title="運送中"
            value={stats[LogisticsStatus.IN_TRANSIT] || 0}
            subtitle="需要追蹤"
            icon={
              <svg className="w-6 h-6 text-[#cc824d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />

          <StatCard
            title="準時率"
            value={`${analytics.deliveryPerformance?.onTimeDeliveryRate || 0}%`}
            subtitle="本月表現"
            icon={
              <svg className="w-6 h-6 text-[#cc824d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend={analytics.deliveryPerformance?.onTimeDeliveryRate >= 90 ? 'up' : 'down'}
            trendValue="2.3%"
          />

          <StatCard
            title="運費收入"
            value={formatCurrency(stats.totalRevenue || 0)}
            subtitle="本月累計"
            icon={
              <svg className="w-6 h-6 text-[#cc824d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
            trend="up"
            trendValue="+8.1%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 配送狀態分佈 */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">配送狀態分佈</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(stats).map(([status, count]) => {
                if (!Object.values(LogisticsStatus).includes(status)) return null;
                
                return (
                  <div key={status} className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusBadgeColor(status)}`}>
                      {getStatusDisplayName(status)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 效能指標 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">效能指標</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">平均配送時間</span>
                  <span className="text-sm text-gray-900">{analytics.deliveryPerformance?.averageDeliveryTime || 0} 天</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#cc824d] h-2 rounded-full" 
                    style={{ width: `${Math.min((analytics.deliveryPerformance?.averageDeliveryTime || 0) * 20, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">客戶滿意度</span>
                  <span className="text-sm text-gray-900">{analytics.deliveryPerformance?.customerSatisfactionScore || 0}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${((analytics.deliveryPerformance?.customerSatisfactionScore || 0) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">失敗率</span>
                  <span className="text-sm text-gray-900">{analytics.deliveryPerformance?.failedDeliveryRate || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${analytics.deliveryPerformance?.failedDeliveryRate || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最近配送單 */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">最近配送單</h2>
            <button className="text-[#cc824d] hover:text-[#b3723f] font-medium">
              查看全部 →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單編號
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    收件人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    配送方式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    預計送達
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    運費
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{shipment.orderNumber}</div>
                      <div className="text-sm text-gray-500">{shipment.trackingNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shipment.receiverInfo.name}</div>
                      <div className="text-sm text-gray-500">{shipment.receiverInfo.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getLogisticsTypeDisplayName(shipment.logisticsType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(shipment.status)}`}>
                        {getStatusDisplayName(shipment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.estimatedDelivery ? 
                        new Date(shipment.estimatedDelivery).toLocaleDateString('zh-TW') : 
                        '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(shipment.shippingFee)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 物流方式分佈 */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">配送方式偏好</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(stats.typeStats || {}).map(([type, count]) => {
              const total = Object.values(stats.typeStats || {}).reduce((sum, c) => sum + c, 0);
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={type} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-[#cc824d] mb-1">{count}</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {getLogisticsTypeDisplayName(type)}
                  </div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsOverview;