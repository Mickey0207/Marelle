import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon,
  ChartPieIcon,
  ClockIcon,
  CursorArrowRaysIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  DocumentChartBarIcon,
  FunnelIcon as FilterIcon
} from '@heroicons/react/24/outline';
import { userTrackingDataManager } from '../../../lib/data/members/userTrackingDataManager';

const UserBehaviorAnalytics = () => {
  const [behaviorEvents, setBehaviorEvents] = useState([]);
  const [categoryAnalytics, setCategoryAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    eventType: '',
    deviceType: '',
    dateRange: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 過去7天
      endDate: new Date()
    }
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [filters]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [events, categories] = await Promise.all([
        userTrackingDataManager.getUserBehaviorEvents(filters),
        userTrackingDataManager.getCategoryAnalytics()
      ]);
      
      setBehaviorEvents(events);
      setCategoryAnalytics(categories);
    } catch (error) {
      console.error('載入分析數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 計算統計指標
  const analytics = useMemo(() => {
    if (!behaviorEvents.length) return {};

    const categoryClicks = {};
    const deviceStats = {};
    const hourlyActivity = Array(24).fill(0);
    let totalDwellTime = 0;
    let totalEvents = behaviorEvents.length;

    behaviorEvents.forEach(event => {
      // 類別點擊統計
      if (event.eventData?.categoryId) {
        const categoryId = event.eventData.categoryId;
        if (!categoryClicks[categoryId]) {
          categoryClicks[categoryId] = {
            categoryId,
            categoryName: event.eventData.categoryName,
            clicks: 0,
            totalDwellTime: 0,
            uniqueUsers: new Set()
          };
        }
        categoryClicks[categoryId].clicks += event.eventData.clickData?.clickCount || 1;
        categoryClicks[categoryId].totalDwellTime += event.eventData.dwellTimeData?.currentDwellTime || 0;
        categoryClicks[categoryId].uniqueUsers.add(event.userId);
      }

      // 設備統計
      const device = event.deviceInfo?.deviceType;
      if (device) {
        deviceStats[device] = (deviceStats[device] || 0) + 1;
      }

      // 時段活動統計
      const hour = new Date(event.timestamp).getHours();
      hourlyActivity[hour]++;

      // 停留時間統計
      if (event.eventData?.dwellTimeData?.currentDwellTime) {
        totalDwellTime += event.eventData.dwellTimeData.currentDwellTime;
      }
    });

    // 轉換為數組並排序
    const categoryClicksArray = Object.values(categoryClicks).map(cat => ({
      ...cat,
      uniqueUsers: cat.uniqueUsers.size,
      avgDwellTime: cat.totalDwellTime / cat.clicks || 0
    })).sort((a, b) => b.clicks - a.clicks);

    return {
      categoryClicks: categoryClicksArray,
      deviceStats,
      hourlyActivity,
      averageDwellTime: totalDwellTime / totalEvents || 0,
      totalEvents
    };
  }, [behaviorEvents]);

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}秒`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}分${remainingSeconds}秒`;
  };

  const handleExportReport = async () => {
    try {
      const report = await userTrackingDataManager.generateReport('behavior_analysis', filters.dateRange);
      // 這裡可以實現下載邏輯
      console.log('報告已生成:', report);
      alert(`報告已生成！報告ID: ${report.reportId}`);
    } catch (error) {
      console.error('生成報告失敗:', error);
    }
  };

  const tabs = [
    { id: 'overview', name: '總覽', icon: ChartPieIcon },
    { id: 'categories', name: '類別分析', icon: FunnelIcon },
    { id: 'patterns', name: '行為模式', icon: DocumentChartBarIcon },
    { id: 'timeline', name: '時間分佈', icon: ClockIcon }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 標題和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">用戶行為分析</h1>
          <p className="text-gray-600 mt-1">深度分析用戶行為模式與類別偏好</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={loadAnalyticsData}
            className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/20 rounded-lg text-gray-700 hover:bg-white/90 transition-all"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>重新整理</span>
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <DocumentChartBarIcon className="w-4 h-4" />
            <span>匯出報告</span>
          </button>
        </div>
      </div>

      {/* 篩選器 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center space-x-2 mb-4">
          <FilterIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">篩選條件</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">事件類型</label>
            <select
              value={filters.eventType}
              onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">全部類型</option>
              <option value="category_interaction">類別互動</option>
              <option value="product_interaction">商品互動</option>
              <option value="search_behavior">搜尋行為</option>
              <option value="shopping_behavior">購物行為</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">設備類型</label>
            <select
              value={filters.deviceType}
              onChange={(e) => setFilters(prev => ({ ...prev, deviceType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">全部設備</option>
              <option value="desktop">桌機</option>
              <option value="mobile">手機</option>
              <option value="tablet">平板</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">時間範圍</label>
            <select
              onChange={(e) => {
                const days = parseInt(e.target.value);
                setFilters(prev => ({
                  ...prev,
                  dateRange: {
                    startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                    endDate: new Date()
                  }
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="7">過去 7 天</option>
              <option value="14">過去 14 天</option>
              <option value="30">過去 30 天</option>
              <option value="90">過去 90 天</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* 標籤導航 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 內容區域 */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* 關鍵指標 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">總事件數</p>
                    <p className="text-2xl font-bold text-primary-600 mt-2">
                      {analytics.totalEvents?.toLocaleString() || 0}
                    </p>
                  </div>
                  <CursorArrowRaysIcon className="w-8 h-8 text-primary-500 opacity-30" />
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
                    <p className="text-sm font-medium text-gray-600">平均停留時間</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {formatDuration(analytics.averageDwellTime || 0)}
                    </p>
                  </div>
                  <ClockIcon className="w-8 h-8 text-blue-500 opacity-30" />
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
                    <p className="text-sm font-medium text-gray-600">熱門類別</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      {analytics.categoryClicks?.[0]?.categoryName || '-'}
                    </p>
                  </div>
                  <FunnelIcon className="w-8 h-8 text-green-500 opacity-30" />
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
                    <p className="text-sm font-medium text-gray-600">主要設備</p>
                    <p className="text-2xl font-bold text-purple-600 mt-2">
                      {Object.entries(analytics.deviceStats || {}).sort((a, b) => b[1] - a[1])[0]?.[0] === 'mobile' ? '手機' :
                       Object.entries(analytics.deviceStats || {}).sort((a, b) => b[1] - a[1])[0]?.[0] === 'desktop' ? '桌機' :
                       Object.entries(analytics.deviceStats || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}
                    </p>
                  </div>
                  <ChartPieIcon className="w-8 h-8 text-purple-500 opacity-30" />
                </div>
              </motion.div>
            </div>

            {/* 設備使用分佈 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">設備使用分佈</h3>
              <div className="space-y-4">
                {Object.entries(analytics.deviceStats || {}).map(([device, count]) => {
                  const total = Object.values(analytics.deviceStats || {}).reduce((sum, c) => sum + c, 0);
                  const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
                  
                  return (
                    <div key={device} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-700 capitalize">
                          {device === 'mobile' ? '手機' : device === 'desktop' ? '桌機' : device === 'tablet' ? '平板' : device}
                        </span>
                        <span className="text-sm text-gray-500">({count} 事件)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
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
          </>
        )}

        {activeTab === 'categories' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">類別互動分析</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 類別點擊排行 */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-4">點擊次數排行</h4>
                <div className="space-y-3">
                  {analytics.categoryClicks?.slice(0, 10).map((category, index) => (
                    <div key={category.categoryId} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-700">{category.categoryName}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{category.clicks} 次</p>
                        <p className="text-xs text-gray-500">{category.uniqueUsers} 用戶</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 平均停留時間 */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-4">平均停留時間</h4>
                <div className="space-y-3">
                  {analytics.categoryClicks?.slice(0, 10).map((category, index) => (
                    <div key={category.categoryId} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <span className="font-medium text-gray-700">{category.categoryName}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDuration(category.avgDwellTime)}
                        </p>
                        <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (category.avgDwellTime / Math.max(...(analytics.categoryClicks?.map(c => c.avgDwellTime) || [1]))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'patterns' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">行為模式分析</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 最近事件流 */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-4">最近用戶行為</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {behaviorEvents.slice(0, 20).map((event) => (
                    <div key={event.eventId} className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.eventData?.categoryName || '未知類別'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.eventData?.action || event.eventType} • {event.deviceInfo?.deviceType}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 行為統計 */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-4">行為類型分佈</h4>
                <div className="space-y-4">
                  {Object.entries(
                    behaviorEvents.reduce((acc, event) => {
                      const action = event.eventData?.action || event.eventType;
                      acc[action] = (acc[action] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([action, count]) => {
                    const percentage = ((count / behaviorEvents.length) * 100).toFixed(1);
                    return (
                      <div key={action} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">{action}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-12">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">時間分佈分析</h3>
            
            {/* 24小時活動分佈 */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">24小時活動分佈</h4>
              <div className="grid grid-cols-12 gap-2">
                {analytics.hourlyActivity?.map((activity, hour) => {
                  const maxActivity = Math.max(...(analytics.hourlyActivity || [1]));
                  const height = maxActivity > 0 ? (activity / maxActivity) * 100 : 0;
                  
                  return (
                    <div key={hour} className="flex flex-col items-center">
                      <div 
                        className="w-full bg-primary-500 rounded-t transition-all duration-500 mb-1"
                        style={{ height: `${Math.max(4, height)}px` }}
                        title={`${hour}:00 - ${activity} 事件`}
                      ></div>
                      <span className="text-xs text-gray-500">{hour}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0:00</span>
                <span>6:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:00</span>
              </div>
            </div>

            {/* 活動高峰時段 */}
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-700 mb-4">活動高峰時段</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: '晨間高峰', time: '08:00-10:00', value: analytics.hourlyActivity?.slice(8, 11).reduce((a, b) => a + b, 0) || 0 },
                  { name: '午間高峰', time: '12:00-14:00', value: analytics.hourlyActivity?.slice(12, 15).reduce((a, b) => a + b, 0) || 0 },
                  { name: '晚間高峰', time: '19:00-22:00', value: analytics.hourlyActivity?.slice(19, 23).reduce((a, b) => a + b, 0) || 0 }
                ].map((period) => (
                  <div key={period.name} className="bg-white/50 rounded-lg p-4 text-center">
                    <h5 className="font-medium text-gray-900">{period.name}</h5>
                    <p className="text-sm text-gray-600">{period.time}</p>
                    <p className="text-2xl font-bold text-primary-600 mt-2">{period.value}</p>
                    <p className="text-xs text-gray-500">事件數</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserBehaviorAnalytics;