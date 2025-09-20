import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BellIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CursorArrowRaysIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { userTrackingDataManager } from '../data/userTrackingDataManager';

const RealTimeActivityMonitor = () => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [activityStream, setActivityStream] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
    
    if (isMonitoring) {
      // ÊØ?0ÁßíÊõ¥?∞ÂØ¶?ÇÊï∏??
      const realTimeInterval = setInterval(updateRealTimeData, 10000);
      // ÊØ?ÁßíÊõ¥?∞Ê¥ª?ïÊ?
      const streamInterval = setInterval(updateActivityStream, 5000);
      // ÊØ?0ÁßíÊ™¢?•Áï∞Â∏?
      const anomalyInterval = setInterval(checkAnomalies, 30000);

      return () => {
        clearInterval(realTimeInterval);
        clearInterval(streamInterval);
        clearInterval(anomalyInterval);
      };
    }
  }, [isMonitoring]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [realTime, anomalyData] = await Promise.all([
        userTrackingDataManager.getRealTimeActivity(),
        userTrackingDataManager.getAnomalyData()
      ]);
      
      setRealTimeData(realTime);
      setAnomalies(anomalyData.realtimeAnomalies);
      setActivityStream(realTime.recentEvents || []);
      
      // ?üÊ?Ê®°Êì¨Ë≠¶Â†±
      generateMockAlerts();
    } catch (error) {
      console.error('ËºâÂÖ•ÂØ¶Ê??∏Ê?Â§±Ê?:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRealTimeData = async () => {
    try {
      const realTime = await userTrackingDataManager.getRealTimeActivity();
      setRealTimeData(realTime);
    } catch (error) {
      console.error('?¥Êñ∞ÂØ¶Ê??∏Ê?Â§±Ê?:', error);
    }
  };

  const updateActivityStream = async () => {
    try {
      const events = await userTrackingDataManager.getUserBehaviorEvents({
        limit: 10
      });
      
      // Ê®°Êì¨?∞‰?‰ª?
      const newEvents = events.slice(0, Math.floor(Math.random() * 3) + 1);
      setActivityStream(prev => [
        ...newEvents,
        ...prev.slice(0, 20) // ‰øùÊ??ÄÂ§?0?ã‰?‰ª?
      ]);
    } catch (error) {
      console.error('?¥Êñ∞Ê¥ªÂ?ÊµÅÂ§±??', error);
    }
  };

  const checkAnomalies = async () => {
    try {
      const anomalyData = await userTrackingDataManager.getAnomalyData();
      setAnomalies(anomalyData.realtimeAnomalies);
      
      // Ê™¢Êü•?ØÂê¶?âÊñ∞?ÑÈ??¥È??ßÁï∞Â∏?
      const highSeverityAnomalies = anomalyData.realtimeAnomalies.filter(
        anomaly => anomaly.severity === 'high'
      );
      
      if (highSeverityAnomalies.length > 0) {
        // Ê∑ªÂ?Ë≠¶Â†±
        const newAlert = {
          id: Date.now(),
          type: 'critical',
          title: 'Ê™¢Ê∏¨?∞È?È¢®Èö™?∞Â∏∏',
          message: `?ºÁèæ ${highSeverityAnomalies.length} ?ãÈ??¥È??ßÁï∞Â∏∏`,
          timestamp: new Date(),
          read: false
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Ê™¢Êü•?∞Â∏∏Â§±Ê?:', error);
    }
  };

  const generateMockAlerts = () => {
    const mockAlerts = [
      {
        id: 1,
        type: 'info',
        title: 'Ê¥ªÂ?È´òÂ≥∞??,
        message: '?®Êà∂Ê¥ªÂ??èÊ?Âπ≥Ê?È´?25%',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: '?∞Â∏∏ÊµÅÈ?',
        message: 'Ê™¢Ê∏¨?∞‰??™ÁâπÂÆöÂú∞?Ä?ÑÁï∞Â∏∏Ê???,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: true
      }
    ];
    setAlerts(mockAlerts);
  };

  const markAlertAsRead = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '?õÊ?';
    if (minutes < 60) return `${minutes}?ÜÈ??ç`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}Â∞èÊ??ç`;
    return `${Math.floor(hours / 24)}Â§©Â?`;
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <BellIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ê®ôÈ??åÊéß??*/}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">ÂØ¶Ê?Ê¥ªÂ???éß</h1>
          <p className="text-gray-600 mt-1">?≥Ê???éß?®Êà∂Ê¥ªÂ??ÅÁï∞Â∏∏Ê™¢Ê∏¨Ë?ÂÆâÂÖ®Ë≠¶Â†±</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              isMonitoring
                ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200'
                : 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
            }`}
          >
            {isMonitoring ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            <span>{isMonitoring ? '?´Â???éß' : '?ãÂ???éß'}</span>
          </button>
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm font-medium">
              {isMonitoring ? '??éß‰∏? : 'Â∑≤Êö´??}
            </span>
          </div>
        </div>
      </div>

      {/* ÂØ¶Ê??áÊ? */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          key={realTimeData?.currentActiveUsers}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ê¥ªË??®Êà∂</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {realTimeData?.currentActiveUsers || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">?≥Ê?Áµ±Ë?</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-primary-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          key={realTimeData?.topCategories?.reduce((sum, cat) => sum + cat.clicksPerMinute, 0)}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ÊØèÂ??òÈ???/p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {realTimeData?.topCategories?.reduce((sum, cat) => sum + cat.clicksPerMinute, 0) || 0}
              </p>
              <p className="text-xs text-blue-600 mt-1">ÈªûÊ?/?ÜÈ?</p>
            </div>
            <CursorArrowRaysIcon className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">?∞Â∏∏‰∫ã‰ª∂</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {anomalies.length}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                {anomalies.filter(a => a.severity === 'high').length} È´òÈ¢®??
              </p>
            </div>
            <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Á≥ªÁµ±?Ä??/p>
              <p className="text-3xl font-bold text-green-600 mt-2">Ê≠?∏∏</p>
              <p className="text-xs text-green-600 mt-1">?Ä?âÊ??ôÈ?Ë°å‰∏≠</p>
            </div>
            <ShieldCheckIcon className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </motion.div>
      </div>

      {/* ‰∏ªË??ßÂÆπ?Ä??*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ê¥ªÂ?Êµ?*/}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg h-96"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">ÂØ¶Ê?Ê¥ªÂ?Êµ?/h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>?≥Ê??¥Êñ∞</span>
              </div>
            </div>
            <div className="h-80 overflow-y-auto space-y-2">
              {activityStream.map((event, index) => (
                <motion.div
                  key={`${event.eventId}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        ?®Êà∂??{event.eventData?.categoryName || '?™Áü•È°ûÂà•'} ?≤Ë? {event.eventData?.action || '?ç‰?'}
                      </p>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        Ë®≠Â?: {event.deviceInfo?.deviceType || '?™Áü•'}
                      </span>
                      <span className="text-xs text-gray-500">
                        ?èË¶Ω?? {event.deviceInfo?.browser || '?™Áü•'}
                      </span>
                      {event.eventData?.dwellTimeData?.currentDwellTime && (
                        <span className="text-xs text-gray-500">
                          ?úÁ?: {Math.round(event.eventData.dwellTimeData.currentDwellTime)}Áß?
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Ë≠¶Â†±?åÁï∞Â∏?*/}
        <div className="space-y-6">
          {/* Á≥ªÁµ±Ë≠¶Â†± */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Á≥ªÁµ±Ë≠¶Â†±</h3>
              {alerts.length > 0 && (
                <button
                  onClick={clearAllAlerts}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Ê∏ÖÈô§?®ÈÉ®
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Ê≤íÊ??™Ë?Ë≠¶Â†±</p>
              ) : (
                alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      getAlertBgColor(alert.type)
                    } ${alert.read ? 'opacity-60' : ''}`}
                    onClick={() => markAlertAsRead(alert.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(alert.timestamp)}
                        </p>
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* ?∞Â∏∏Ê™¢Ê∏¨ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">?∞Â∏∏Ê™¢Ê∏¨</h3>
            <div className="space-y-3">
              {anomalies.length === 0 ? (
                <div className="text-center py-4">
                  <ShieldCheckIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">?™Ê™¢Ê∏¨Âà∞?∞Â∏∏</p>
                </div>
              ) : (
                anomalies.map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      anomaly.severity === 'high' ? 'border-red-500 bg-red-50' :
                      anomaly.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{anomaly.description}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          ?∂Â??? {anomaly.currentValue} (?æÂÄ? {anomaly.threshold})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(anomaly.timestamp)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        anomaly.severity === 'high' ? 'bg-red-200 text-red-800' :
                        anomaly.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {anomaly.severity === 'high' ? 'È´? : anomaly.severity === 'medium' ? '‰∏? : '‰Ω?}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ?±È?È°ûÂà•ÂØ¶Ê?Ê¥ªÂ? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">È°ûÂà•Ê¥ªÂ??±Â∫¶</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {realTimeData?.topCategories?.map((category, index) => (
            <motion.div
              key={category.categoryId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/50 rounded-lg p-4 text-center"
            >
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                {index + 1}
              </div>
              <h4 className="font-medium text-gray-900 text-sm">{category.categoryName}</h4>
              <p className="text-lg font-bold text-primary-600 mt-1">
                {category.activeUsers}
              </p>
              <p className="text-xs text-gray-500">Ê¥ªË??®Êà∂</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-primary-500 h-1 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${Math.min(100, (category.clicksPerMinute / Math.max(...realTimeData.topCategories.map(c => c.clicksPerMinute))) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {category.clicksPerMinute} ÈªûÊ?/?ÜÈ?
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeActivityMonitor;
