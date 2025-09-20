import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ServerIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import dashboardDataManager from '../data/dashboardDataManager';

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshInterval, setRefreshInterval] = useState(30); // 30ÁßíËá™?ïÊõ¥??

  useEffect(() => {
    loadDashboardData();
    
    // Ë®≠Â??™Â??¥Êñ∞
    const interval = setInterval(() => {
      loadDashboardData();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const loadDashboardData = () => {
    const summary = dashboardDataManager.getDashboardSummary();
    const metrics = dashboardDataManager.getOperationalMetrics();
    const tasks = dashboardDataManager.getTasks();
    const approvals = dashboardDataManager.getApprovalInstances();
    
    setDashboardData({
      summary,
      metrics,
      tasks: tasks.summary,
      approvals: approvals.summary
    });
    setLastUpdated(new Date());
  };

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const { summary, metrics, tasks, approvals } = dashboardData;

  return (
    <div className="space-y-6">
      {/* ?ÅÈù¢Ê®ôÈ??åÊõ¥?∞Ë?Ë®?*/}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">?üÈ??ÄË°®Êùø</h1>
              <p className="text-gray-600">?≥Ê???éßÁ≥ªÁµ±?Ä?ãÂ??üÈ??áÊ?</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                ?ÄÂæåÊõ¥?? {lastUpdated.toLocaleTimeString()}
              </div>
              <button
                onClick={loadDashboardData}
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                ?∑Êñ∞
              </button>
            </div>
          </div>
        </motion.div>

        {/* ?úÈçµ?áÊ??°Á? */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ‰ªäÊó•Ë®ÇÂñÆ */}
          <MetricCard
            title="‰ªäÊó•Ë®ÇÂñÆ"
            value={metrics.real_time_metrics.orders_today.total_orders}
            subValue={`NT$ ${metrics.real_time_metrics.orders_today.revenue_today.toLocaleString()}`}
            icon={ShoppingCartIcon}
            color="blue"
            trend={metrics.real_time_metrics.orders_today.total_orders > 80 ? 'up' : 'down'}
            percentage={12.5}
          />
          
          {/* ÂæÖËæ¶‰ªªÂ? */}
          <MetricCard
            title="ÂæÖËæ¶‰ªªÂ?"
            value={tasks.by_status?.pending || 0}
            subValue={`${tasks.overdue} ?æÊ?`}
            icon={ClockIcon}
            color="amber"
            trend={tasks.overdue > 5 ? 'down' : 'up'}
            percentage={8.2}
          />
          
          {/* Á≥ªÁµ±Ë≠¶Â†± */}
          <MetricCard
            title="Á≥ªÁµ±Ë≠¶Â†±"
            value={metrics.alert_system.critical_alerts.length}
            subValue="?ÄË¶ÅÈ?Ê≥?
            icon={ExclamationTriangleIcon}
            color="red"
            trend={metrics.alert_system.critical_alerts.length > 2 ? 'down' : 'up'}
            percentage={5.1}
          />
          
          {/* ÂÆ¢Êà∂ÊªøÊ?Â∫?*/}
          <MetricCard
            title="ÂÆ¢Êà∂ÊªøÊ?Â∫?
            value={metrics.real_time_metrics.customer_service.customer_satisfaction_today}
            subValue="‰ªäÊó•Âπ≥Â?"
            icon={UserGroupIcon}
            color="green"
            trend="up"
            percentage={3.7}
            isDecimal
          />
        </div>

        {/* Ë©≥Á¥∞?ÄË°®Êùø?Ä??*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Â∑¶ÂÅ¥ - ‰ªªÂ??åÁ∞Ω?∏Á???*/}
          <div className="lg:col-span-2 space-y-6">
            {/* ‰ªªÂ?Ê¶ÇÊ? */}
            <TaskOverview tasks={tasks} />
            
            {/* Á∞ΩÊ†∏ÊµÅÁ??Ä??*/}
            <ApprovalOverview approvals={approvals} />
            
            {/* ?üÈ??àÁ??áÊ? */}
            <OperationalEfficiency metrics={metrics.operational_efficiency} />
          </div>

          {/* ?≥ÂÅ¥ - ?≥Ê???éß?åË≠¶??*/}
          <div className="space-y-6">
            {/* Á≥ªÁµ±?•Â∫∑?Ä??*/}
            <SystemHealth systemHealth={metrics.anomaly_monitoring.system_health} />
            
            {/* Â∫´Â?Ë≠¶Â†± */}
            <InventoryAlerts inventory={metrics.real_time_metrics.inventory_alerts} />
            
            {/* ?Ä?∞Ë≠¶??*/}
            <RecentAlerts alerts={metrics.alert_system.critical_alerts} />
            
            {/* ?∞Â∏∏??éß */}
            <AnomalyMonitoring anomalies={metrics.anomaly_monitoring.active_anomalies} />
          </div>
        </div>
    </div>
  );
};

// ?áÊ??°Á??É‰ª∂
const MetricCard = ({ title, value, subValue, icon: Icon, color, trend, percentage, isDecimal = false }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex items-center space-x-1">
          {trend === 'up' ? (
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {percentage}%
          </span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">
        {isDecimal ? value : value.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">{subValue}</p>
    </motion.div>
  );
};

// ‰ªªÂ?Ê¶ÇÊ??É‰ª∂
const TaskOverview = ({ tasks }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">‰ªªÂ?Ê¶ÇÊ?</h3>
      <ChartBarIcon className="h-5 w-5 text-gray-500" />
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{tasks.by_status?.pending || 0}</div>
        <div className="text-sm text-gray-500">ÂæÖË???/div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-amber-600">{tasks.by_status?.in_progress || 0}</div>
        <div className="text-sm text-gray-500">?≤Ë?‰∏?/div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{tasks.by_status?.completed || 0}</div>
        <div className="text-sm text-gray-500">Â∑≤Â???/div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-600">{tasks.overdue}</div>
        <div className="text-sm text-gray-500">?æÊ?</div>
      </div>
    </div>
    
    {/* ?™Â?Á¥öÂ?Â∏?*/}
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-3">?™Â?Á¥öÂ?Â∏?/h4>
      <div className="space-y-2">
        {Object.entries(tasks.by_priority || {}).map(([priority, count]) => (
          <div key={priority} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 capitalize">{priority}</span>
            <span className="text-sm font-medium">{count}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Á∞ΩÊ†∏Ê¶ÇÊ??É‰ª∂
const ApprovalOverview = ({ approvals }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Á∞ΩÊ†∏ÊµÅÁ?</h3>
      <CheckCircleIcon className="h-5 w-5 text-gray-500" />
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-amber-600">{approvals.by_status?.pending || 0}</div>
        <div className="text-sm text-gray-500">ÂæÖÁ∞Ω??/div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{approvals.by_status?.approved || 0}</div>
        <div className="text-sm text-gray-500">Â∑≤Ê†∏??/div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-600">{approvals.overdue}</div>
        <div className="text-sm text-gray-500">?æÊ?</div>
      </div>
    </div>
    
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Âπ≥Â??ïÁ??ÇÈ?</span>
        <span className="font-medium">{Math.round(approvals.avg_processing_time / 60)} Â∞èÊ?</span>
      </div>
    </div>
  </motion.div>
);

// ?üÈ??àÁ??É‰ª∂
const OperationalEfficiency = ({ metrics }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">?üÈ??àÁ?</h3>
      <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">?ïÁ??àÁ?</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">ÊØèÂ??ÇË??ÜË???/span>
            <span className="text-sm font-medium">{metrics.processing_efficiency.orders_processed_per_hour}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Âπ≥Â??ïÁ??ÇÈ?</span>
            <span className="text-sm font-medium">{metrics.processing_efficiency.avg_order_processing_time_minutes} ?ÜÈ?</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">?™Â??ñÊ???/span>
            <span className="text-sm font-medium">{metrics.processing_efficiency.automatic_processing_rate}%</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Â∫´Â??àÁ?</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Â∫´Â??±Ë???/span>
            <span className="text-sm font-medium">{metrics.inventory_efficiency.inventory_turnover_rate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Áº∫Ë≤®??/span>
            <span className="text-sm font-medium">{metrics.inventory_efficiency.stockout_rate_percentage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Â∫´Â?Ê∫ñÁ¢∫??/span>
            <span className="text-sm font-medium">{metrics.inventory_efficiency.inventory_accuracy_rate}%</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Á≥ªÁµ±?•Â∫∑?Ä?ãÂ?‰ª?
const SystemHealth = ({ systemHealth }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Á≥ªÁµ±?•Â∫∑</h3>
      <ServerIcon className="h-5 w-5 text-gray-500" />
    </div>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Ë≥áÊ?Â∫´Â???/span>
        <span className={`text-sm font-medium ${systemHealth.database_response_time < 100 ? 'text-green-600' : 'text-amber-600'}`}>
          {systemHealth.database_response_time}ms
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">API ?ûÊ?</span>
        <span className={`text-sm font-medium ${systemHealth.api_response_time < 200 ? 'text-green-600' : 'text-amber-600'}`}>
          {systemHealth.api_response_time}ms
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">?ØË™§??/span>
        <span className={`text-sm font-medium ${parseFloat(systemHealth.error_rate_percentage) < 1 ? 'text-green-600' : 'text-red-600'}`}>
          {systemHealth.error_rate_percentage}%
        </span>
      </div>
      
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">‰ΩáÂ??Ä??/span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            systemHealth.queue_processing_status === 'healthy' ? 'bg-green-100 text-green-700' :
            systemHealth.queue_processing_status === 'warning' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {systemHealth.queue_processing_status === 'healthy' ? 'Ê≠?∏∏' :
             systemHealth.queue_processing_status === 'warning' ? 'Ë≠¶Â?' : '?¥È?'}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Â∫´Â?Ë≠¶Â†±?É‰ª∂
const InventoryAlerts = ({ inventory }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Â∫´Â?Ë≠¶Â†±</h3>
      <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Â∫´Â?‰∏çË∂≥</span>
        <span className="text-sm font-medium text-amber-600">{inventory.low_stock_items}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Áº∫Ë≤®?ÜÂ?</span>
        <span className="text-sm font-medium text-red-600">{inventory.out_of_stock_items}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">?éÈ?Â∫´Â?</span>
        <span className="text-sm font-medium text-blue-600">{inventory.overstock_items}</span>
      </div>
      
      <div className="pt-3 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            NT$ {inventory.total_inventory_value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Á∏ΩÂ∫´Â≠òÂÉπ??/div>
        </div>
      </div>
    </div>
  </motion.div>
);

// ?Ä?∞Ë≠¶?±Â?‰ª?
const RecentAlerts = ({ alerts }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">?Ä?∞Ë≠¶??/h3>
      <BellIcon className="h-5 w-5 text-red-500" />
    </div>
    
    <div className="space-y-3">
      {alerts.slice(0, 3).map((alert, index) => (
        <div key={alert.alert_id} className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">{alert.alert_type}</h4>
              <p className="text-xs text-red-600 mt-1">{alert.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(alert.created_at).toLocaleTimeString()}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              alert.priority === 'critical' ? 'bg-red-100 text-red-700' :
              alert.priority === 'high' ? 'bg-orange-100 text-orange-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {alert.priority}
            </span>
          </div>
        </div>
      ))}
      
      {alerts.length === 0 && (
        <div className="text-center py-4">
          <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">?ÆÂ?Ê≤íÊ?Ë≠¶Â†±</p>
        </div>
      )}
    </div>
  </motion.div>
);

// ?∞Â∏∏??éß?É‰ª∂
const AnomalyMonitoring = ({ anomalies }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">?∞Â∏∏??éß</h3>
      <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
    </div>
    
    <div className="space-y-3">
      {anomalies.slice(0, 3).map((anomaly, index) => (
        <div key={anomaly.anomaly_id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-orange-800">{anomaly.metric_name}</h4>
              <p className="text-xs text-orange-600 mt-1">{anomaly.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(anomaly.detected_at).toLocaleTimeString()}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              anomaly.severity === 'critical' ? 'bg-red-100 text-red-700' :
              anomaly.severity === 'high' ? 'bg-orange-100 text-orange-700' :
              anomaly.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {anomaly.severity}
            </span>
          </div>
        </div>
      ))}
      
      {anomalies.length === 0 && (
        <div className="text-center py-4">
          <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Á≥ªÁµ±?ãË?Ê≠?∏∏</p>
        </div>
      )}
    </div>
  </motion.div>
);

export default DashboardOverview;
