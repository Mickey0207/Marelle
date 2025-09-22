import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  ChartBarIcon,
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import analyticsDataManager from '../../../lib/data/analytics/analyticsDataManager';
import SearchableSelect from "../ui/SearchableSelect";

const CustomerAnalytics = () => {
  const [customerData, setCustomerData] = useState({});
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const segmentOptions = [
    { value: 'all', label: '全部客戶' },
    { value: 'vip', label: 'VIP客戶' },
    { value: 'loyal', label: '忠誠客戶' },
    { value: 'new', label: '新客戶' },
    { value: 'inactive', label: '流失客戶' }
  ];

  const tabOptions = [
    { value: 'overview', label: '客戶概覽', icon: ChartBarIcon },
    { value: 'rfm', label: 'RFM分析', icon: FunnelIcon },
    { value: 'lifecycle', label: '生命週期', icon: ClockIcon },
    { value: 'behavior', label: '購買行為', icon: ShoppingBagIcon },
    { value: 'satisfaction', label: '滿意度分析', icon: HeartIcon }
  ];

  useEffect(() => {
    loadCustomerData();
  }, [selectedSegment, selectedPeriod, activeTab]);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const data = analyticsDataManager.getCustomerAnalytics(selectedSegment, selectedPeriod, activeTab);
      setCustomerData(data);
    } catch (error) {
      console.error('載入客戶數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('zh-TW').format(num || 0);
  };

  const formatPercentage = (num) => {
    return `${(num || 0).toFixed(1)}%`;
  };

  // 模擬客戶數據
  const mockCustomerMetrics = {
    totalCustomers: { value: 12580, trend: 8.5, label: '總客戶數' },
    newCustomers: { value: 1250, trend: 15.2, label: '新客戶' },
    activeCustomers: { value: 8950, trend: 5.8, label: '活躍客戶' },
    churned: { value: 520, trend: -12.3, label: '流失客戶' },
    avgLifetimeValue: { value: 8650, trend: 12.1, label: '平均生命週期價值' },
    avgOrderValue: { value: 2100, trend: 3.7, label: '平均訂單價值' },
    repeatRate: { value: 35.8, trend: 6.2, label: '回購率' },
    satisfaction: { value: 4.2, trend: 2.4, label: '滿意度評分' }
  };

  const mockRFMSegments = [
    { 
      segment: '冠軍客戶', 
      count: 1256, 
      percentage: 10.0, 
      rfm: 'R5F5M5', 
      characteristics: '高頻次、高價值、近期活躍',
      color: 'bg-green-500',
      textColor: 'text-green-900',
      bgColor: 'bg-green-50'
    },
    { 
      segment: '忠誠客戶', 
      count: 2512, 
      percentage: 20.0, 
      rfm: 'R4F4M4', 
      characteristics: '中高頻次、穩定價值、定期購買',
      color: 'bg-blue-500',
      textColor: 'text-blue-900',
      bgColor: 'bg-blue-50'
    },
    { 
      segment: '潛力客戶', 
      count: 1884, 
      percentage: 15.0, 
      rfm: 'R3F3M3', 
      characteristics: '中等頻次、有成長潛力',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-900',
      bgColor: 'bg-yellow-50'
    },
    { 
      segment: '新客戶', 
      count: 3144, 
      percentage: 25.0, 
      rfm: 'R5F1M2', 
      characteristics: '近期註冊、首次或少量購買',
      color: 'bg-purple-500',
      textColor: 'text-purple-900',
      bgColor: 'bg-purple-50'
    },
    { 
      segment: '需要關注', 
      count: 2010, 
      percentage: 16.0, 
      rfm: 'R2F2M2', 
      characteristics: '購買頻次下降、需要重新喚醒',
      color: 'bg-orange-500',
      textColor: 'text-orange-900',
      bgColor: 'bg-orange-50'
    },
    { 
      segment: '流失客戶', 
      count: 1774, 
      percentage: 14.0, 
      rfm: 'R1F1M1', 
      characteristics: '長期未購買、低價值',
      color: 'bg-red-500',
      textColor: 'text-red-900',
      bgColor: 'bg-red-50'
    }
  ];

  const mockLifecycleStages = [
    { stage: '潛在客戶', count: 5230, conversion: 15.8, avgTime: '7天' },
    { stage: '新客戶', count: 3144, conversion: 45.2, avgTime: '30天' },
    { stage: '活躍客戶', count: 8950, conversion: 72.5, avgTime: '90天' },
    { stage: '忠誠客戶', count: 2512, conversion: 85.3, avgTime: '180天' },
    { stage: '冠軍客戶', count: 1256, conversion: 92.1, avgTime: '365天+' }
  ];

  const mockCustomerBehavior = [
    { behavior: '瀏覽商品', percentage: 100, sessions: 45230 },
    { behavior: '加入購物車', percentage: 25.8, sessions: 11669 },
    { behavior: '開始結帳', percentage: 12.5, sessions: 5654 },
    { behavior: '完成付款', percentage: 8.9, sessions: 4025 },
    { behavior: '重複購買', percentage: 3.2, sessions: 1447 }
  ];

  const mockSatisfactionData = [
    { aspect: '商品品質', score: 4.5, responses: 2340 },
    { aspect: '配送服務', score: 4.2, responses: 2156 },
    { aspect: '客服體驗', score: 4.3, responses: 1890 },
    { aspect: '網站體驗', score: 4.1, responses: 2567 },
    { aspect: '價格合理性', score: 3.9, responses: 2234 }
  ];

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const renderOverviewTab = () => (
    <>
      {/* 核心指標 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(mockCustomerMetrics).map(([key, metric]) => (
          <div key={key} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
              {getTrendIcon(metric.trend)}
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">
                {key.includes('Value') || key.includes('Order') ? 
                  formatCurrency(metric.value) : 
                  key === 'repeatRate' ? 
                  formatPercentage(metric.value) :
                  key === 'satisfaction' ?
                  `${metric.value}/5.0` :
                  formatNumber(metric.value)
                }
              </p>
              
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                  {Math.abs(metric.trend).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">vs 上期</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 客戶分佈圖表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            客戶分佈趨勢
          </h3>
          
          <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">客戶分佈圖表</p>
              <p className="text-gray-400 text-xs">圖表組件整合中...</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            地理分佈
          </h3>
          
          <div className="space-y-4">
            {[
              { region: '台北市', customers: 3250, percentage: 25.8 },
              { region: '新北市', customers: 2890, percentage: 23.0 },
              { region: '台中市', customers: 1560, percentage: 12.4 },
              { region: '高雄市', customers: 1340, percentage: 10.7 },
              { region: '其他縣市', customers: 3540, percentage: 28.1 }
            ].map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">{region.region}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#cc824d] h-2 rounded-full"
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 min-w-0">
                    {formatNumber(region.customers)} ({region.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderRFMTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <FunnelIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          RFM 客戶分群分析
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRFMSegments.map((segment, index) => (
            <div key={index} className={`${segment.bgColor} border border-gray-200 rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-lg font-semibold ${segment.textColor}`}>{segment.segment}</h4>
                <div className={`w-4 h-4 rounded-full ${segment.color}`}></div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">客戶數量</span>
                  <span className="font-bold text-gray-900">{formatNumber(segment.count)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">佔比</span>
                  <span className="font-bold text-gray-900">{formatPercentage(segment.percentage)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">RFM評分</span>
                  <span className="font-mono text-sm font-bold text-gray-900">{segment.rfm}</span>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">{segment.characteristics}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLifecycleTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          客戶生命週期分析
        </h3>
        
        <div className="space-y-4">
          {mockLifecycleStages.map((stage, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">轉換率: {formatPercentage(stage.conversion)}</span>
                  <span className="text-gray-600">平均停留: {stage.avgTime}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#cc824d] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(stage.count / 12580) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-900 min-w-0">
                  {formatNumber(stage.count)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBehaviorTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <ShoppingBagIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          購買行為漏斗分析
        </h3>
        
        <div className="space-y-4">
          {mockCustomerBehavior.map((behavior, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{behavior.behavior}</span>
                <div className="text-right">
                  <span className="font-bold text-gray-900">{formatNumber(behavior.sessions)}</span>
                  <span className="text-sm text-gray-600 ml-2">({formatPercentage(behavior.percentage)})</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-[#cc824d] to-[#b8753f] h-4 rounded-full transition-all duration-700"
                  style={{ width: `${behavior.percentage}%` }}
                ></div>
              </div>
              
              {index < mockCustomerBehavior.length - 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSatisfactionTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <HeartIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
          客戶滿意度分析
        </h3>
        
        <div className="space-y-6">
          {mockSatisfactionData.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{item.aspect}</h4>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-gray-900">{item.score}</span>
                  <span className="text-sm text-gray-600">/5.0</span>
                  <span className="text-xs text-gray-500">({formatNumber(item.responses)}則評價)</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`w-6 h-6 rounded ${
                      star <= Math.floor(item.score)
                        ? 'bg-yellow-400'
                        : star === Math.ceil(item.score) && item.score % 1 !== 0
                        ? 'bg-gradient-to-r from-yellow-400 to-gray-300'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
                <div className="flex-1 ml-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="w-full px-6">
        {/* 頁面標題和控制項 */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">客戶分析</h1>
            <p className="text-gray-600">深度了解客戶行為，提升客戶價值與忠誠度</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchableSelect
              options={segmentOptions.map(option => ({ 
                value: option.value, 
                label: option.label 
              }))}
              value={selectedSegment}
              onChange={setSelectedSegment}
              placeholder="選擇客戶群組"
              className="min-w-[160px]"
            />
            
            <SearchableSelect
              options={[
                { value: '7days', label: '最近7天' },
                { value: '30days', label: '最近30天' },
                { value: '90days', label: '最近90天' },
                { value: '1year', label: '最近1年' }
              ]}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              placeholder="選擇時間範圍"
              className="min-w-[140px]"
            />
          </div>
        </div>

        {/* 頁籤導航 */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabOptions.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.value;
              
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-[#cc824d] text-[#cc824d]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 頁籤內容 */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'rfm' && renderRFMTab()}
        {activeTab === 'lifecycle' && renderLifecycleTab()}
        {activeTab === 'behavior' && renderBehaviorTab()}
        {activeTab === 'satisfaction' && renderSatisfactionTab()}
      </div>
    </div>
  );
};

export default CustomerAnalytics;