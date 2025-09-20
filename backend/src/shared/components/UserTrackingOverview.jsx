import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  EyeIcon, 
  CursorArrowRaysIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline';
import { userTrackingDataManager } from '../data/userTrackingDataManager';

const UserTrackingOverview = () => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [categoryAnalytics, setCategoryAnalytics] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // ÊØ?0ÁßíÊõ¥?∞ÂØ¶?ÇÊï∏??
    const interval = setInterval(loadRealTimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [realTime, categories, anomalyData] = await Promise.all([
        userTrackingDataManager.getRealTimeActivity(),
        userTrackingDataManager.getCategoryAnalytics(),
        userTrackingDataManager.getAnomalyData()
      ]);
      
      setRealTimeData(realTime);
      setCategoryAnalytics(categories.slice(0, 5));
      setAnomalies(anomalyData.realtimeAnomalies);
    } catch (error) {
      console.error('ËºâÂÖ•?ÄË°®Êùø?∏Ê?Â§±Ê?:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const realTime = await userTrackingDataManager.getRealTimeActivity();
      setRealTimeData(realTime);
    } catch (error) {
      console.error('?¥Êñ∞ÂØ¶Ê??∏Ê?Â§±Ê?:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const deviceIcons = {
    desktop: ComputerDesktopIcon,
    mobile: DevicePhoneMobileIcon,
    tablet: DeviceTabletIcon
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
      {/* Ê®ôÈ? */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">?®Êà∂ËøΩËπ§Á∏ΩË¶Ω</h1>
          <p className="text-gray-600 mt-1">?≥Ê???éß?®Êà∂Ë°åÁÇ∫?áÁ∂≤Á´ôÊ¥ª??/p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>?≥Ê??¥Êñ∞</span>
        </div>
      </div>

      {/* ÂØ¶Ê??áÊ??°Á? */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">?ÆÂ?Ê¥ªË??®Êà∂</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {realTimeData?.currentActiveUsers || 0}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                +12% ÊØîÊò®Â§?
              </p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-primary-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">?ÅÈù¢?èË¶Ω??/p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatNumber(realTimeData?.topCategories?.reduce((sum, cat) => sum + cat.clicksPerMinute * 60, 0) || 0)}
              </p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <EyeIcon className="w-3 h-3 mr-1" />
                ÊØèÂ???
              </p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Âπ≥Â??úÁ??ÇÈ?</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatTime(145)}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                ÊØîÂπ≥?áÈ? 8%
              </p>
            </div>
            <ClockIcon className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">‰∫íÂ?‰∫ã‰ª∂</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {formatNumber(realTimeData?.topCategories?.reduce((sum, cat) => sum + cat.clicksPerMinute, 0) || 0)}
              </p>
              <p className="text-xs text-purple-600 mt-1 flex items-center">
                <CursorArrowRaysIcon className="w-3 h-3 mr-1" />
                ÊØèÂ???
              </p>
            </div>
            <CursorArrowRaysIcon className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </motion.div>
      </div>

      {/* Ë®≠Â??Ü‰??åÁÜ±?ÄÈ°ûÂà• */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ë®≠Â?‰ΩøÁî®?Ü‰? */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ë®≠Â?‰ΩøÁî®?Ü‰?</h3>
          <div className="space-y-4">
            {Object.entries(realTimeData?.activeUsersByDevice || {}).map(([device, count]) => {
              const total = Object.values(realTimeData?.activeUsersByDevice || {}).reduce((sum, c) => sum + c, 0);
              const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
              const Icon = deviceIcons[device];
              
              return (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700 capitalize">
                      {device === 'mobile' ? '?ãÊ?' : device === 'desktop' ? 'Ê°åÊ?' : 'Âπ≥Êùø'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ?±È?È°ûÂà• */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">?±È?È°ûÂà•</h3>
          <div className="space-y-3">
            {realTimeData?.topCategories?.map((category, index) => (
              <div key={category.categoryId} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700">{category.categoryName}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{category.activeUsers} ?®Êà∂</p>
                  <p className="text-xs text-gray-500">{category.clicksPerMinute} ÈªûÊ?/??/p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* È°ûÂà•Ë°®ÁèæÁµ±Ë? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">È°ûÂà•Ë°®ÁèæÁµ±Ë?</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">È°ûÂà•?çÁ®±</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Ê¥ªË??®Êà∂</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Âπ≥Â??úÁ??ÇÈ?</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Ë∑≥Âá∫??/th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">ËΩâÊ???/th>
              </tr>
            </thead>
            <tbody>
              {categoryAnalytics.map((category) => (
                <tr key={category.categoryId} className="border-b border-gray-100 hover:bg-white/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{category.categoryName}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.realTimeMetrics.currentActiveUsers}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {formatTime(category.realTimeMetrics.averageDwellTime)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {(category.realTimeMetrics.bounceRate * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      category.realTimeMetrics.conversionRate > 0.05 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(category.realTimeMetrics.conversionRate * 100).toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ?∞Â∏∏Ë≠¶Â†± */}
      {anomalies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-4">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">?≥Ê?Ë≠¶Â†±</h3>
          </div>
          <div className="space-y-3">
            {anomalies.map((anomaly) => (
              <div 
                key={anomaly.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  anomaly.severity === 'high' ? 'border-red-500 bg-red-50' :
                  anomaly.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{anomaly.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {anomaly.affectedMetric}: {anomaly.currentValue} (?æÂÄ? {anomaly.threshold})
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(anomaly.timestamp).toLocaleString()}
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
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserTrackingOverview;
