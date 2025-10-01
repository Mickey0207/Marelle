import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ServerIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  BellIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  ShieldCheckIcon,
  SignalIcon,
  EyeIcon,
  Cog6ToothIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import dashboardDataManager from '../../../../external_mock/core/dashboardDataManager';

const RealTimeMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, _setRefreshInterval] = useState(30); // 30秒
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const loadData = () => {
    const operationalMetrics = dashboardDataManager.getOperationalMetrics();
    setMetrics(operationalMetrics);
    setAlerts(operationalMetrics.alert_system.critical_alerts);
    setAnomalies(operationalMetrics.anomaly_monitoring.active_anomalies);
    setLastUpdated(new Date());
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.alert_id === alertId 
        ? { ...alert, acknowledged_by: 1, acknowledged_at: new Date() }
        : alert
    ));
  };

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.alert_id === alertId 
        ? { ...alert, resolved_at: new Date() }
        : alert
    ));
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const { real_time_metrics, operational_efficiency, anomaly_monitoring, alert_system } = metrics;

  return (
    <div>
        {/* 頁面標題和控制 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">即時監控儀表板</h1>
              <p className="text-gray-600">實時系統狀態、警報和異常監控</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">自動更新</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoRefresh ? 'bg-amber-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoRefresh ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                最後更新: {lastUpdated.toLocaleTimeString()}
              </div>
              <button
                onClick={loadData}
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                刷新
              </button>
            </div>
          </div>
        </motion.div>

        {/* 系統健康狀態概覽 */}
        <SystemHealthOverview systemHealth={anomaly_monitoring.system_health} />

        {/* 即時營運指標 */}
  <div className="grid grid-cols-3 gap-6 mb-8">
          {/* 即時指標卡片 */}
          <div className="col-span-2">
            <RealTimeMetricsGrid metrics={real_time_metrics} />
          </div>
          
          {/* 關鍵警報面板 */}
          <div>
            <CriticalAlertsPanel 
              alerts={alerts} 
              onAcknowledge={acknowledgeAlert}
              onResolve={resolveAlert}
              onViewDetails={setSelectedAlert}
            />
          </div>
        </div>

        {/* 詳細監控區域 */}
  <div className="grid grid-cols-2 gap-6 mb-8">
          {/* 異常監控 */}
          <AnomalyMonitoringPanel anomalies={anomalies} />
          
          {/* 營運效率監控 */}
          <OperationalEfficiencyPanel efficiency={operational_efficiency} />
        </div>

        {/* 趨勢問題和建議 */}
  <div className="grid grid-cols-2 gap-6">
          {/* 趨勢問題 */}
          <TrendingIssuesPanel issues={alert_system.trending_issues} />
          
          {/* 智能建議 */}
          <SmartRecommendationsPanel 
            metrics={real_time_metrics}
            anomalies={anomalies}
            alerts={alerts}
          />
        </div>

        {/* 警報詳情模態框 */}
        <AlertDetailModal
          alert={selectedAlert}
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onAcknowledge={acknowledgeAlert}
          onResolve={resolveAlert}
        />
    </div>
  );
};

// 系統健康狀態概覽
const SystemHealthOverview = ({ systemHealth }) => {
  const getHealthStatus = () => {
    const { database_response_time, api_response_time, error_rate_percentage, queue_processing_status: _queue_processing_status } = systemHealth;
    
    if (database_response_time > 200 || api_response_time > 500 || parseFloat(error_rate_percentage) > 2) {
      return { status: 'critical', color: 'red', text: '嚴重' };
    } else if (database_response_time > 100 || api_response_time > 300 || parseFloat(error_rate_percentage) > 1) {
      return { status: 'warning', color: 'amber', text: '警告' };
    } else {
      return { status: 'healthy', color: 'green', text: '正常' };
    }
  };

  const healthStatus = getHealthStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">系統健康狀態</h3>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          healthStatus.color === 'green' ? 'bg-green-100 text-green-800' :
          healthStatus.color === 'amber' ? 'bg-amber-100 text-amber-800' :
          'bg-red-100 text-red-800'
        }`}>
          {healthStatus.color === 'green' ? <CheckCircleIcon className="h-4 w-4 mr-1" /> :
           healthStatus.color === 'amber' ? <ExclamationTriangleIcon className="h-4 w-4 mr-1" /> :
           <XCircleIcon className="h-4 w-4 mr-1" />}
          {healthStatus.text}
        </div>
      </div>

  <div className="grid grid-cols-4 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
            <ServerIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{systemHealth.database_response_time}ms</div>
          <div className="text-sm text-gray-600">資料庫回應</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
            <SignalIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{systemHealth.api_response_time}ms</div>
          <div className="text-sm text-gray-600">API 回應</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg mb-2 mx-auto">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{systemHealth.error_rate_percentage}%</div>
          <div className="text-sm text-gray-600">錯誤率</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-2 mx-auto">
            <Cog6ToothIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className={`text-lg font-bold ${
            systemHealth.queue_processing_status === 'healthy' ? 'text-green-600' :
            systemHealth.queue_processing_status === 'warning' ? 'text-amber-600' :
            'text-red-600'
          }`}>
            {systemHealth.queue_processing_status === 'healthy' ? '正常' :
             systemHealth.queue_processing_status === 'warning' ? '警告' : '嚴重'}
          </div>
          <div className="text-sm text-gray-600">佇列狀態</div>
        </div>
      </div>
    </motion.div>
  );
};

// 即時指標網格
const RealTimeMetricsGrid = ({ metrics }) => {
  const metricCards = [
    {
      title: '今日訂單',
      value: metrics.orders_today.total_orders,
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCartIcon,
      color: 'blue',
      subtitle: `總額: NT$ ${metrics.orders_today.revenue_today.toLocaleString()}`
    },
    {
      title: '當前訪客',
      value: metrics.website_performance.current_visitors,
      change: '+8.2%',
      trend: 'up',
      icon: UserGroupIcon,
      color: 'green',
      subtitle: `轉換率: ${metrics.website_performance.conversion_rate_today}%`
    },
    {
      title: '庫存警報',
      value: metrics.inventory_alerts.low_stock_items,
      change: '-5.1%',
      trend: 'down',
      icon: ExclamationTriangleIcon,
      color: 'amber',
      subtitle: `缺貨: ${metrics.inventory_alerts.out_of_stock_items} 項`
    },
    {
      title: '客服工單',
      value: metrics.customer_service.open_tickets,
      change: '+3.7%',
      trend: 'up',
      icon: ClockIcon,
      color: 'red',
      subtitle: `逾期: ${metrics.customer_service.overdue_tickets} 件`
    },
    {
      title: '系統正常時間',
      value: `${metrics.website_performance.uptime_percentage}%`,
      change: '+0.1%',
      trend: 'up',
      icon: ShieldCheckIcon,
      color: 'green',
      subtitle: `載入時間: ${metrics.website_performance.page_load_time_avg}s`
    },
    {
      title: '今日營收',
      value: `NT$ ${Math.round(metrics.financial_summary.revenue_today / 1000)}K`,
      change: '+15.3%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'blue',
      subtitle: `利潤: NT$ ${Math.round(metrics.financial_summary.profit_today / 1000)}K`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">即時營運指標</h3>
        <ChartBarIcon className="h-5 w-5 text-gray-500" />
      </div>

  <div className="grid grid-cols-3 gap-4">
        {metricCards.map((card, _index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: _index * 0.1 }}
            className="bg-white/50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${
                card.color === 'blue' ? 'bg-blue-100' :
                card.color === 'green' ? 'bg-green-100' :
                card.color === 'amber' ? 'bg-amber-100' :
                'bg-red-100'
              }`}>
                <card.icon className={`h-4 w-4 ${
                  card.color === 'blue' ? 'text-blue-600' :
                  card.color === 'green' ? 'text-green-600' :
                  card.color === 'amber' ? 'text-amber-600' :
                  'text-red-600'
                }`} />
              </div>
              <div className="flex items-center text-sm">
                {card.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={card.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {card.change}
                </span>
              </div>
            </div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">{card.title}</h4>
            <p className="text-lg font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-xs text-gray-500">{card.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// 關鍵警報面板
const CriticalAlertsPanel = ({ alerts, onAcknowledge, onResolve, onViewDetails }) => {
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged_by);
  const unresolvedAlerts = alerts.filter(alert => !alert.resolved_at);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">關鍵警報</h3>
        <div className="flex items-center">
          <BellIcon className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm font-medium text-red-600">
            {unacknowledgedAlerts.length} 未確認
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {unresolvedAlerts.map((alert, index) => (
            <motion.div
              key={alert.alert_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border ${
                alert.priority === 'critical' ? 'bg-red-50 border-red-200' :
                alert.priority === 'high' ? 'bg-orange-50 border-orange-200' :
                'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FireIcon className={`h-4 w-4 ${
                      alert.priority === 'critical' ? 'text-red-500' :
                      alert.priority === 'high' ? 'text-orange-500' :
                      'text-amber-500'
                    }`} />
                    <h4 className="text-sm font-medium text-gray-900">{alert.alert_type}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {alert.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(alert.created_at).toLocaleString('zh-TW')}
                  </p>
                </div>
                <div className="flex flex-col space-y-1 ml-3">
                  <button
                    onClick={() => onViewDetails(alert)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    詳情
                  </button>
                  {!alert.acknowledged_by && (
                    <button
                      onClick={() => onAcknowledge(alert.alert_id)}
                      className="text-xs text-amber-600 hover:text-amber-800"
                    >
                      確認
                    </button>
                  )}
                  <button
                    onClick={() => onResolve(alert.alert_id)}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    解決
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {unresolvedAlerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">目前沒有關鍵警報</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 異常監控面板
const AnomalyMonitoringPanel = ({ anomalies }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">異常監控</h3>
        <EyeIcon className="h-5 w-5 text-gray-500" />
      </div>

      <div className="space-y-4">
        {anomalies.map((anomaly, index) => (
          <motion.div
            key={anomaly.anomaly_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-orange-50 rounded-lg border border-orange-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <ExclamationTriangleIcon className={`h-4 w-4 ${
                    anomaly.severity === 'critical' ? 'text-red-500' :
                    anomaly.severity === 'high' ? 'text-orange-500' :
                    anomaly.severity === 'medium' ? 'text-amber-500' :
                    'text-blue-500'
                  }`} />
                  <h4 className="text-sm font-medium text-gray-900">{anomaly.metric_name}</h4>
                </div>
                <p className="text-sm text-gray-700 mb-2">{anomaly.description}</p>
                <p className="text-xs text-gray-500">
                  偵測時間: {new Date(anomaly.detected_at).toLocaleString('zh-TW')}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  建議: {anomaly.recommended_action}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                anomaly.severity === 'critical' ? 'bg-red-100 text-red-800' :
                anomaly.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                anomaly.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {anomaly.severity}
              </span>
            </div>
          </motion.div>
        ))}

        {anomalies.length === 0 && (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">系統運行正常，未發現異常</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 營運效率面板
const OperationalEfficiencyPanel = ({ efficiency }) => {
  const efficiencyMetrics = [
    {
      category: '處理效率',
      metrics: [
        { label: '每小時處理訂單', value: efficiency.processing_efficiency.orders_processed_per_hour, unit: '單' },
        { label: '平均處理時間', value: efficiency.processing_efficiency.avg_order_processing_time_minutes, unit: '分鐘' },
        { label: '自動化比率', value: efficiency.processing_efficiency.automatic_processing_rate, unit: '%' }
      ]
    },
    {
      category: '庫存效率',
      metrics: [
        { label: '庫存週轉率', value: efficiency.inventory_efficiency.inventory_turnover_rate, unit: '' },
        { label: '缺貨率', value: efficiency.inventory_efficiency.stockout_rate_percentage, unit: '%' },
        { label: '庫存準確率', value: efficiency.inventory_efficiency.inventory_accuracy_rate, unit: '%' }
      ]
    },
    {
      category: '客服效率',
      metrics: [
        { label: '首次解決率', value: efficiency.service_efficiency.first_contact_resolution_rate, unit: '%' },
        { label: '平均解決時間', value: efficiency.service_efficiency.avg_ticket_resolution_time_hours, unit: '小時' },
        { label: '客戶滿意度', value: efficiency.service_efficiency.customer_effort_score, unit: '分' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">營運效率</h3>
        <CpuChipIcon className="h-5 w-5 text-gray-500" />
      </div>

      <div className="space-y-6">
        {efficiencyMetrics.map((category) => (
          <div key={category.category}>
            <h4 className="text-sm font-medium text-gray-700 mb-3">{category.category}</h4>
            <div className="grid grid-cols-1 gap-3">
              {category.metrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {metric.value}{metric.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// 趨勢問題面板
const TrendingIssuesPanel = ({ issues }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">趨勢問題</h3>
        <ChartBarIcon className="h-5 w-5 text-gray-500" />
      </div>

      <div className="space-y-4">
        {issues.map((issue, _index) => (
          <motion.div
            key={_index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: _index * 0.1 }}
            className="p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">{issue.issue_pattern}</h4>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  issue.risk_assessment === 'high' ? 'bg-red-100 text-red-800' :
                  issue.risk_assessment === 'medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {issue.risk_assessment}
                </span>
                <span className={`text-xs ${
                  issue.trend_direction === 'increasing' ? 'text-red-600' :
                  issue.trend_direction === 'decreasing' ? 'text-green-600' :
                  'text-gray-600'
                }`}>
                  {issue.trend_direction === 'increasing' ? '↗' :
                   issue.trend_direction === 'decreasing' ? '↘' : '→'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              發生次數: {issue.occurrence_count} 次
            </p>
            <div className="text-xs text-blue-600">
              預防建議: {issue.prevention_recommendations.join(', ')}
            </div>
          </motion.div>
        ))}

        {issues.length === 0 && (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">目前沒有發現趨勢問題</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 智能建議面板
const SmartRecommendationsPanel = ({ metrics, anomalies, alerts }) => {
  const generateRecommendations = () => {
    const recommendations = [];

    // 基於指標的建議
    if (metrics.customer_service.open_tickets > 20) {
      recommendations.push({
        type: 'performance',
        title: '客服工單積壓',
        description: '當前開放工單數量較高，建議增加客服人力或優化處理流程',
        priority: 'high',
        action: '查看客服管理'
      });
    }

    if (metrics.inventory_alerts.low_stock_items > 10) {
      recommendations.push({
        type: 'inventory',
        title: '庫存預警',
        description: '多項商品庫存不足，建議及時補貨以避免缺貨',
        priority: 'medium',
        action: '檢視庫存狀態'
      });
    }

    if (parseFloat(metrics.website_performance.conversion_rate_today) < 2) {
      recommendations.push({
        type: 'marketing',
        title: '轉換率偏低',
        description: '今日轉換率低於平均水平，建議檢查網站體驗或行銷策略',
        priority: 'medium',
        action: '優化使用者體驗'
      });
    }

    // 基於異常的建議
    if (anomalies.length > 3) {
      recommendations.push({
        type: 'system',
        title: '系統異常偵測',
        description: '系統偵測到多項異常，建議進行全面系統檢查',
        priority: 'high',
        action: '進行系統診斷'
      });
    }

    // 基於警報的建議
    if (alerts.length > 2) {
      recommendations.push({
        type: 'alert',
        title: '警報處理',
        description: '有多個未解決的警報，建議優先處理高優先級警報',
        priority: 'urgent',
        action: '處理關鍵警報'
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">智能建議</h3>
        <LightBulbIcon className="h-5 w-5 text-amber-500" />
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <LightBulbIcon className="h-4 w-4 text-amber-500" />
                  <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    rec.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                <button className="text-xs text-amber-600 hover:text-amber-800 font-medium">
                  {rec.action} →
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {recommendations.length === 0 && (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">系統運行良好，暫無特別建議</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 警報詳情模態框
const AlertDetailModal = ({ alert, isOpen, onClose, onAcknowledge, onResolve }) => {
  if (!isOpen || !alert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">警報詳情</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <FireIcon className={`h-6 w-6 ${
                alert.priority === 'critical' ? 'text-red-500' :
                alert.priority === 'high' ? 'text-orange-500' :
                'text-amber-500'
              }`} />
              <h4 className="text-lg font-medium text-gray-900">{alert.alert_type}</h4>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {alert.priority}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">警報訊息</label>
              <p className="text-sm text-gray-900">{alert.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">影響區域</label>
              <p className="text-sm text-gray-900">{alert.affected_area}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">發生時間</label>
              <p className="text-sm text-gray-900">
                {new Date(alert.created_at).toLocaleString('zh-TW')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">預估影響</label>
              <p className="text-sm text-gray-900">{alert.estimated_impact}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">建議行動</label>
            <ul className="list-disc list-inside space-y-1">
              {alert.suggested_actions.map((action, index) => (
                <li key={index} className="text-sm text-gray-700">{action}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              關閉
            </button>
            {!alert.acknowledged_by && (
              <button
                onClick={() => {
                  onAcknowledge(alert.alert_id);
                  onClose();
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                確認警報
              </button>
            )}
            {!alert.resolved_at && (
              <button
                onClick={() => {
                  onResolve(alert.alert_id);
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                標記解決
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeMonitoringDashboard;