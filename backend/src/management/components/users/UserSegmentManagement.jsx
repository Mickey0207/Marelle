import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  FunnelIcon,
  ChartPieIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { userTrackingDataManager } from '../../../shared/data/userTrackingDataManager';

const UserSegmentManagement = () => {
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [segmentDetails, setSegmentDetails] = useState(null);

  useEffect(() => {
    loadSegmentData();
  }, []);

  useEffect(() => {
    if (selectedSegment) {
      loadSegmentDetails(selectedSegment.segmentId);
    }
  }, [selectedSegment]);

  const loadSegmentData = async () => {
    try {
      setLoading(true);
      const segmentData = await userTrackingDataManager.getUserSegmentData();
      setSegments(segmentData);
      if (segmentData.length > 0) {
        setSelectedSegment(segmentData[0]);
      }
    } catch (error) {
      console.error('載入分群數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSegmentDetails = async (segmentId) => {
    try {
      // 模擬獲取詳細分群數據
      const mockDetails = {
        segmentId,
        recentActivity: Array.from({ length: 10 }, () => ({
          userId: `user-${Math.random().toString(36).substr(2, 9)}`,
          action: ['瀏覽商品', '加入購物車', '完成購買', '搜尋', '查看類別'][Math.floor(Math.random() * 5)],
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          value: Math.floor(Math.random() * 1000)
        })),
        demographicBreakdown: {
          ageGroups: [
            { range: '18-25', percentage: 25, count: 250 },
            { range: '26-35', percentage: 35, count: 350 },
            { range: '36-45', percentage: 25, count: 250 },
            { range: '46+', percentage: 15, count: 150 }
          ],
          genderDistribution: [
            { gender: '女性', percentage: 68, count: 680 },
            { gender: '男性', percentage: 32, count: 320 }
          ]
        },
        behaviorPatterns: {
          preferredShoppingTime: [
            { time: '早上 (8-12)', percentage: 20 },
            { time: '下午 (12-18)', percentage: 45 },
            { time: '晚上 (18-24)', percentage: 35 }
          ],
          devicePreference: [
            { device: '手機', percentage: 60 },
            { device: '桌機', percentage: 30 },
            { device: '平板', percentage: 10 }
          ]
        }
      };
      setSegmentDetails(mockDetails);
    } catch (error) {
      console.error('載入分群詳情失敗:', error);
    }
  };

  const getSegmentIcon = (segmentId) => {
    const icons = {
      new_users: <SparklesIcon className="w-5 h-5" />,
      returning_users: <ArrowTrendingUpIcon className="w-5 h-5" />,
      vip_users: <TagIcon className="w-5 h-5" />,
      price_conscious: <CurrencyDollarIcon className="w-5 h-5" />,
      brand_loyal: <UserGroupIcon className="w-5 h-5" />,
      frequent_buyers: <ShoppingCartIcon className="w-5 h-5" />
    };
    return icons[segmentId] || <UserGroupIcon className="w-5 h-5" />;
  };

  const getSegmentColor = (segmentId) => {
    const colors = {
      new_users: 'bg-green-500',
      returning_users: 'bg-blue-500',
      vip_users: 'bg-purple-500',
      price_conscious: 'bg-yellow-500',
      brand_loyal: 'bg-pink-500',
      frequent_buyers: 'bg-indigo-500'
    };
    return colors[segmentId] || 'bg-gray-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + '%';
  };

  const tabs = [
    { id: 'overview', name: '總覽', icon: ChartPieIcon },
    { id: 'behavior', name: '行為分析', icon: EyeIcon },
    { id: 'preferences', name: '偏好分析', icon: FunnelIcon },
    { id: 'personalization', name: '個人化設定', icon: AdjustmentsHorizontalIcon }
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
      {/* 標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">用戶分群管理</h1>
          <p className="text-gray-600 mt-1">分析用戶行為模式並創建個人化體驗</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <SparklesIcon className="w-4 h-4" />
          <span>創建新分群</span>
        </button>
      </div>

      {/* 分群概覽 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((segment, index) => (
          <motion.div
            key={segment.segmentId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedSegment(segment)}
            className={`bg-white/70 backdrop-blur-sm rounded-xl p-6 border cursor-pointer transition-all ${
              selectedSegment?.segmentId === segment.segmentId
                ? 'border-primary-500 shadow-lg scale-105'
                : 'border-white/20 shadow-md hover:shadow-lg hover:scale-102'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${getSegmentColor(segment.segmentId)} rounded-lg flex items-center justify-center text-white`}>
                  {getSegmentIcon(segment.segmentId)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{segment.segmentName}</h3>
                  <p className="text-sm text-gray-600">{segment.userCount.toLocaleString()} 用戶</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">平均會話時長</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.floor(segment.behaviorMetrics.averageSessionDuration / 60)}:
                  {(segment.behaviorMetrics.averageSessionDuration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">轉換率</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPercentage(segment.behaviorMetrics.conversionRate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">平均訂單價值</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(segment.behaviorMetrics.averageOrderValue)}
                </span>
              </div>
            </div>

            {/* 類別偏好預覽 */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">熱門類別</p>
              <div className="flex flex-wrap gap-1">
                {segment.categoryPreferences.slice(0, 3).map((pref, idx) => {
                  const categoryNames = {
                    'cat-1': '臉部保養',
                    'cat-2': '彩妝',
                    'cat-3': '身體護理',
                    'cat-4': '香水',
                    'cat-5': '工具配件'
                  };
                  return (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {categoryNames[pref.categoryId] || pref.categoryId}
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 詳細分析 */}
      {selectedSegment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg"
        >
          {/* 分群詳情標題 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${getSegmentColor(selectedSegment.segmentId)} rounded-lg flex items-center justify-center text-white`}>
                {getSegmentIcon(selectedSegment.segmentId)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedSegment.segmentName}</h2>
                <p className="text-gray-600">{selectedSegment.userCount.toLocaleString()} 名用戶</p>
              </div>
            </div>
          </div>

          {/* 標籤導航 */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
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
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 關鍵指標 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">跳出率</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          {formatPercentage(selectedSegment.behaviorMetrics.bounceRate)}
                        </p>
                      </div>
                      <EyeIcon className="w-8 h-8 text-blue-500 opacity-30" />
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">頁面瀏覽</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          {selectedSegment.behaviorMetrics.averagePageViews.toFixed(1)}
                        </p>
                      </div>
                      <ChartPieIcon className="w-8 h-8 text-green-500 opacity-30" />
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">轉換率</p>
                        <p className="text-2xl font-bold text-purple-600 mt-1">
                          {formatPercentage(selectedSegment.behaviorMetrics.conversionRate)}
                        </p>
                      </div>
                      <ArrowTrendingUpIcon className="w-8 h-8 text-purple-500 opacity-30" />
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">平均訂單</p>
                        <p className="text-2xl font-bold text-orange-600 mt-1">
                          {formatCurrency(selectedSegment.behaviorMetrics.averageOrderValue)}
                        </p>
                      </div>
                      <CurrencyDollarIcon className="w-8 h-8 text-orange-500 opacity-30" />
                    </div>
                  </div>
                </div>

                {/* 人口統計和設備偏好 */}
                {segmentDetails && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/50 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-900 mb-4">年齡分佈</h4>
                      <div className="space-y-3">
                        {segmentDetails.demographicBreakdown.ageGroups.map((group) => (
                          <div key={group.range} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{group.range} 歲</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary-500 h-2 rounded-full"
                                  style={{ width: `${group.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-12">{group.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/50 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-900 mb-4">設備偏好</h4>
                      <div className="space-y-3">
                        {segmentDetails.behaviorPatterns.devicePreference.map((device) => (
                          <div key={device.device} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{device.device}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${device.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-12">{device.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'behavior' && segmentDetails && (
              <div className="space-y-6">
                {/* 最近活動 */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">最近用戶活動</h4>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {segmentDetails.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">用戶 {activity.userId.slice(-6)} {activity.action}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 購物時段偏好 */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">購物時段偏好</h4>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="space-y-3">
                      {segmentDetails.behaviorPatterns.preferredShoppingTime.map((time) => (
                        <div key={time.time} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{time.time}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${time.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12">{time.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">類別偏好排序</h4>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="space-y-3">
                      {selectedSegment.categoryPreferences.map((pref, index) => {
                        const categoryNames = {
                          'cat-1': '臉部保養',
                          'cat-2': '彩妝',
                          'cat-3': '身體護理',
                          'cat-4': '香水',
                          'cat-5': '工具配件'
                        };
                        return (
                          <div key={pref.categoryId} className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="font-medium text-gray-700">
                                {categoryNames[pref.categoryId] || pref.categoryId}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary-500 h-2 rounded-full"
                                  style={{ width: `${pref.preferenceScore * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-12">
                                {(pref.preferenceScore * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'personalization' && (
              <div className="space-y-6">
                <div className="bg-white/50 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">個人化策略設定</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">智能商品推薦</h5>
                        <p className="text-sm text-gray-600">基於此分群的偏好自動推薦商品</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                          defaultChecked
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">個人化電子報</h5>
                        <p className="text-sm text-gray-600">發送針對此分群的專屬優惠和內容</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                          defaultChecked
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">動態價格顯示</h5>
                        <p className="text-sm text-gray-600">根據用戶行為調整價格顯示策略</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">個人化首頁</h5>
                        <p className="text-sm text-gray-600">自訂首頁內容和類別排序</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      儲存個人化設定
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserSegmentManagement;