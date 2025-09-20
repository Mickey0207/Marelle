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
  TruckIcon,
  BellIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  ShieldCheckIcon,
  SignalIcon,
  EyeIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import dashboardDataManager from '../data/dashboardDataManager';

const RealTimeMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // 30Áß?
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
        {/* ?ÅÈù¢Ê®ôÈ??åÊéß??*/}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">?≥Ê???éß?ÄË°®Êùø</h1>
              <p className="text-gray-600">ÂØ¶Ê?Á≥ªÁµ±?Ä?ã„ÄÅË≠¶?±Â??∞Â∏∏??éß</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">?™Â??¥Êñ∞</span>
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
                ?ÄÂæåÊõ¥?? {lastUpdated.toLocaleTimeString()}
              </div>
              <button
                onClick={loadData}
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                ?∑Êñ∞
              </button>
            </div>
          </div>
        </motion.div>

        {/* Á≥ªÁµ±?•Â∫∑?Ä?ãÊ?Ë¶?*/}
        <SystemHealthOverview systemHealth={anomaly_monitoring.system_health} />

        {/* ?≥Ê??üÈ??áÊ? */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ?≥Ê??áÊ??°Á? */}
          <div className="lg:col-span-2">
            <RealTimeMetricsGrid metrics={real_time_metrics} />
          </div>
          
          {/* ?úÈçµË≠¶Â†±?¢Êùø */}
          <div>
            <CriticalAlertsPanel 
              alerts={alerts} 
              onAcknowledge={acknowledgeAlert}
              onResolve={resolveAlert}
              onViewDetails={setSelectedAlert}
            />
          </div>
        </div>

        {/* Ë©≥Á¥∞??éß?Ä??*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ?∞Â∏∏??éß */}
          <AnomalyMonitoringPanel anomalies={anomalies} />
          
          {/* ?üÈ??àÁ???éß */}
          <OperationalEfficiencyPanel efficiency={operational_efficiency} />
        </div>

        {/* Ë∂®Âã¢?èÈ??åÂª∫Ë≠?*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ë∂®Âã¢?èÈ? */}
          <TrendingIssuesPanel issues={alert_system.trending_issues} />
          
          {/* ?∫ËÉΩÂª∫Ë≠∞ */}
          <SmartRecommendationsPanel 
            metrics={real_time_metrics}
            anomalies={anomalies}
            alerts={alerts}
          />
        </div>

        {/* Ë≠¶Â†±Ë©≥Ê?Ê®°Ê?Ê°?*/}
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

// Á≥ªÁµ±?•Â∫∑?Ä?ãÊ?Ë¶?
const SystemHealthOverview = ({ systemHealth }) => {
  const getHealthStatus = () => {
    const { database_response_time, api_response_time, error_rate_percentage, queue_processing_status } = systemHealth;
    
    if (database_response_time > 200 || api_response_time > 500 || parseFloat(error_rate_percentage) > 2) {
      return { status: 'critical', color: 'red', text: '?¥È?' };
    } else if (database_response_time > 100 || api_response_time > 300 || parseFloat(error_rate_percentage) > 1) {
      return { status: 'warning', color: 'amber', text: 'Ë≠¶Â?' };
    } else {
      return { status: 'healthy', color: 'green', text: 'Ê≠?∏∏' };
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
        <h3 className="text-xl font-semibold text-gray-900">Á≥ªÁµ±?•Â∫∑?Ä??/h3>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
            <ServerIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{systemHealth.database_response_time}ms</div>
          <div className="text-sm text-gray-600">Ë≥áÊ?Â∫´Â???/div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
            <SignalIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{systemHealth.api_response_time}ms</div>
          <div className="text-sm text-gray-600">API ?ûÊ?</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg mb-2 mx-auto">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{systemHealth.error_rate_percentage}%</div>
          <div className="text-sm text-gray-600">?ØË™§??/div>
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
            {systemHealth.queue_processing_status === 'healthy' ? 'Ê≠?∏∏' :
             systemHealth.queue_processing_status === 'warning' ? 'Ë≠¶Â?' : '?¥È?'}
          </div>
          <div className="text-sm text-gray-600">‰ΩáÂ??Ä??/div>
        </div>
      </div>
    </motion.div>
  );
};

// ?≥Ê??áÊ?Á∂≤Ê†º
const RealTimeMetricsGrid = ({ metrics }) => {
  const metricCards = [
    {
      title: '‰ªäÊó•Ë®ÇÂñÆ',
      value: metrics.orders_today.total_orders,
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCartIcon,
      color: 'blue',
      subtitle: `Á∏ΩÈ?: NT$ ${metrics.orders_today.revenue_today.toLocaleString()}`
    },
    {
      title: '?∂Â?Ë®™ÂÆ¢',
      value: metrics.website_performance.current_visitors,
      change: '+8.2%',
      trend: 'up',
      icon: UserGroupIcon,
      color: 'green',
      subtitle: `ËΩâÊ??? ${metrics.website_performance.conversion_rate_today}%`
    },
    {
      title: 'Â∫´Â?Ë≠¶Â†±',
      value: metrics.inventory_alerts.low_stock_items,
      change: '-5.1%',
      trend: 'down',
      icon: ExclamationTriangleIcon,
      color: 'amber',
      subtitle: `Áº∫Ë≤®: ${metrics.inventory_alerts.out_of_stock_items} ?Ö`
    },
    {
      title: 'ÂÆ¢Ê?Â∑•ÂñÆ',
      value: metrics.customer_service.open_tickets,
      change: '+3.7%',
      trend: 'up',
      icon: ClockIcon,
      color: 'red',
      subtitle: `?æÊ?: ${metrics.customer_service.overdue_tickets} ‰ª∂`
    },
    {
      title: 'Á≥ªÁµ±Ê≠?∏∏?ÇÈ?',
      value: `${metrics.website_performance.uptime_percentage}%`,
      change: '+0.1%',
      trend: 'up',
      icon: ShieldCheckIcon,
      color: 'green',
      subtitle: `ËºâÂÖ•?ÇÈ?: ${metrics.website_performance.page_load_time_avg}s`
    },
    {
      title: '‰ªäÊó•?üÊî∂',
      value: `NT$ ${Math.round(metrics.financial_summary.revenue_today / 1000)}K`,
      change: '+15.3%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'blue',
      subtitle: `?©ÊΩ§: NT$ ${Math.round(metrics.financial_summary.profit_today / 1000)}K`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">?≥Ê??üÈ??áÊ?</h3>
        <ChartBarIcon className="h-5 w-5 text-gray-500" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metricCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
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

// ?úÈçµË≠¶Â†±?¢Êùø
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
        <h3 className="text-xl font-semibold text-gray-900">?úÈçµË≠¶Â†±</h3>
        <div className="flex items-center">
          <BellIcon className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm font-medium text-red-600">
            {unacknowledgedAlerts.length} ?™Á¢∫Ë™?
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
                    Ë©≥Ê?
                  </button>
                  {!alert.acknowledged_by && (
                    <button
                      onClick={() => onAcknowledge(alert.alert_id)}
                      className="text-xs text-amber-600 hover:text-amber-800"
                    >
                      Á¢∫Ë?
                    </button>
                  )}
                  <button
                    onClick={() => onResolve(alert.alert_id)}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Ëß?±∫
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {unresolvedAlerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">?ÆÂ?Ê≤íÊ??úÈçµË≠¶Â†±</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ?∞Â∏∏??éß?¢Êùø
const AnomalyMonitoringPanel = ({ anomalies }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">?∞Â∏∏??éß</h3>
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
                  ?µÊ∏¨?ÇÈ?: {new Date(anomaly.detected_at).toLocaleString('zh-TW')}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Âª∫Ë≠∞: {anomaly.recommended_action}
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
            <p className="text-sm text-gray-500">Á≥ªÁµ±?ãË?Ê≠?∏∏ÔºåÊú™?ºÁèæ?∞Â∏∏</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ?üÈ??àÁ??¢Êùø
const OperationalEfficiencyPanel = ({ efficiency }) => {
  const efficiencyMetrics = [
    {
      category: '?ïÁ??àÁ?',
      metrics: [
        { label: 'ÊØèÂ??ÇË??ÜË???, value: efficiency.processing_efficiency.orders_processed_per_hour, unit: '?? },
        { label: 'Âπ≥Â??ïÁ??ÇÈ?', value: efficiency.processing_efficiency.avg_order_processing_time_minutes, unit: '?ÜÈ?' },
        { label: '?™Â??ñÊ???, value: efficiency.processing_efficiency.automatic_processing_rate, unit: '%' }
      ]
    },
    {
      category: 'Â∫´Â??àÁ?',
      metrics: [
        { label: 'Â∫´Â??±Ë???, value: efficiency.inventory_efficiency.inventory_turnover_rate, unit: '' },
        { label: 'Áº∫Ë≤®??, value: efficiency.inventory_efficiency.stockout_rate_percentage, unit: '%' },
        { label: 'Â∫´Â?Ê∫ñÁ¢∫??, value: efficiency.inventory_efficiency.inventory_accuracy_rate, unit: '%' }
      ]
    },
    {
      category: 'ÂÆ¢Ê??àÁ?',
      metrics: [
        { label: 'È¶ñÊ¨°Ëß?±∫??, value: efficiency.service_efficiency.first_contact_resolution_rate, unit: '%' },
        { label: 'Âπ≥Â?Ëß?±∫?ÇÈ?', value: efficiency.service_efficiency.avg_ticket_resolution_time_hours, unit: 'Â∞èÊ?' },
        { label: 'ÂÆ¢Êà∂ÊªøÊ?Â∫?, value: efficiency.service_efficiency.customer_effort_score, unit: '?? }
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
        <h3 className="text-xl font-semibold text-gray-900">?üÈ??àÁ?</h3>
        <CpuChipIcon className="h-5 w-5 text-gray-500" />
      </div>

      <div className="space-y-6">
        {efficiencyMetrics.map((category, index) => (
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

// Ë∂®Âã¢?èÈ??¢Êùø
const TrendingIssuesPanel = ({ issues }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Ë∂®Âã¢?èÈ?</h3>
        <ChartBarIcon className="h-5 w-5 text-gray-500" />
      </div>

      <div className="space-y-4">
        {issues.map((issue, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
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
                  {issue.trend_direction === 'increasing' ? '?? :
                   issue.trend_direction === 'decreasing' ? '?? : '??}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              ?ºÁ?Ê¨°Êï∏: {issue.occurrence_count} Ê¨?
            </p>
            <div className="text-xs text-blue-600">
              ?êÈò≤Âª∫Ë≠∞: {issue.prevention_recommendations.join(', ')}
            </div>
          </motion.div>
        ))}

        {issues.length === 0 && (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">?ÆÂ?Ê≤íÊ??ºÁèæË∂®Âã¢?èÈ?</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ?∫ËÉΩÂª∫Ë≠∞?¢Êùø
const SmartRecommendationsPanel = ({ metrics, anomalies, alerts }) => {
  const generateRecommendations = () => {
    const recommendations = [];

    // ?∫Êñº?áÊ??ÑÂª∫Ë≠?
    if (metrics.customer_service.open_tickets > 20) {
      recommendations.push({
        type: 'performance',
        title: 'ÂÆ¢Ê?Â∑•ÂñÆÁ©çÂ?',
        description: '?∂Â??ãÊîæÂ∑•ÂñÆ?∏È?ËºÉÈ?ÔºåÂª∫Ë≠∞Â??†ÂÆ¢?ç‰∫∫?õÊ??™Â??ïÁ?ÊµÅÁ?',
        priority: 'high',
        action: '?•Á?ÂÆ¢Ê?ÁÆ°Á?'
      });
    }

    if (metrics.inventory_alerts.low_stock_items > 10) {
      recommendations.push({
        type: 'inventory',
        title: 'Â∫´Â??êË≠¶',
        description: 'Â§öÈ??ÜÂ?Â∫´Â?‰∏çË∂≥ÔºåÂª∫Ë≠∞Â??ÇË?Ë≤®‰ª•?øÂ?Áº∫Ë≤®',
        priority: 'medium',
        action: 'Ê™¢Ë?Â∫´Â??Ä??
      });
    }

    if (parseFloat(metrics.website_performance.conversion_rate_today) < 2) {
      recommendations.push({
        type: 'marketing',
        title: 'ËΩâÊ??áÂ?‰Ω?,
        description: '‰ªäÊó•ËΩâÊ??á‰??ºÂπ≥?áÊ∞¥Âπ≥Ô?Âª∫Ë≠∞Ê™¢Êü•Á∂≤Á?È´îÈ??ñË??∑Á???,
        priority: 'medium',
        action: '?™Â?‰ΩøÁî®?ÖÈ?È©?
      });
    }

    // ?∫Êñº?∞Â∏∏?ÑÂª∫Ë≠?
    if (anomalies.length > 3) {
      recommendations.push({
        type: 'system',
        title: 'Á≥ªÁµ±?∞Â∏∏?µÊ∏¨',
        description: 'Á≥ªÁµ±?µÊ∏¨?∞Â??ÖÁï∞Â∏∏Ô?Âª∫Ë≠∞?≤Ë??®Èù¢Á≥ªÁµ±Ê™¢Êü•',
        priority: 'high',
        action: '?≤Ë?Á≥ªÁµ±Ë®∫Êñ∑'
      });
    }

    // ?∫ÊñºË≠¶Â†±?ÑÂª∫Ë≠?
    if (alerts.length > 2) {
      recommendations.push({
        type: 'alert',
        title: 'Ë≠¶Â†±?ïÁ?',
        description: '?âÂ??ãÊú™Ëß?±∫?ÑË≠¶?±Ô?Âª∫Ë≠∞?™Â??ïÁ?È´òÂÑ™?àÁ?Ë≠¶Â†±',
        priority: 'urgent',
        action: '?ïÁ??úÈçµË≠¶Â†±'
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
        <h3 className="text-xl font-semibold text-gray-900">?∫ËÉΩÂª∫Ë≠∞</h3>
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
                  {rec.action} ??
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {recommendations.length === 0 && (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Á≥ªÁµ±?ãË??ØÂ•ΩÔºåÊö´?°Áâπ?•Âª∫Ë≠?/p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Ë≠¶Â†±Ë©≥Ê?Ê®°Ê?Ê°?
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
          <h3 className="text-xl font-semibold text-gray-900">Ë≠¶Â†±Ë©≥Ê?</h3>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ë≠¶Â†±Ë®äÊÅØ</label>
              <p className="text-sm text-gray-900">{alert.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ÂΩ±Èüø?Ä??/label>
              <p className="text-sm text-gray-900">{alert.affected_area}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">?ºÁ??ÇÈ?</label>
              <p className="text-sm text-gray-900">
                {new Date(alert.created_at).toLocaleString('zh-TW')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">?ê‰º∞ÂΩ±Èüø</label>
              <p className="text-sm text-gray-900">{alert.estimated_impact}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Âª∫Ë≠∞Ë°åÂ?</label>
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
              ?úÈ?
            </button>
            {!alert.acknowledged_by && (
              <button
                onClick={() => {
                  onAcknowledge(alert.alert_id);
                  onClose();
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Á¢∫Ë?Ë≠¶Â†±
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
                Ê®ôË?Ëß?±∫
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeMonitoringDashboard;
