import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShoppingBagIcon,
  UsersIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  EyeIcon,
  ChartPieIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import analyticsDataManager from '../../../lib/mocks/analytics/analyticsDataManager';
import SearchableSelect from "../ui/SearchableSelect";

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const periodOptions = [
    { value: '7days', label: '最近7天' },
    { value: '30days', label: '最近30天' },
    { value: '90days', label: '最近90天' },
    { value: '1year', label: '最近1年' },
    { value: 'custom', label: '自訂範圍' }
  ];

  const metricOptions = [
    { value: 'revenue', label: '營收分析', icon: CurrencyDollarIcon },
    { value: 'orders', label: '訂單分析', icon: ShoppingBagIcon },
    { value: 'customers', label: '客戶分析', icon: UsersIcon },
    { value: 'products', label: '商品分析', icon: ChartBarIcon }
  ];

  useEffect(() => {
    loadSalesData();
  }, [selectedPeriod, selectedMetric]);

  const loadSalesData = async () => {
    setLoading(true);
    try {
      const data = analyticsDataManager.getSalesAnalytics(selectedPeriod, selectedMetric);
      setSalesData(data);
    } catch (error) {
      console.error('載入銷售數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬API調用
    await loadSalesData();
    setRefreshing(false);
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

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  // 模擬銷售數據
  const mockSalesMetrics = {
    totalRevenue: { value: 2580000, trend: 12.5, label: '總營收' },
    totalOrders: { value: 1250, trend: 8.3, label: '總訂單' },
    avgOrderValue: { value: 2064, trend: 3.7, label: '平均訂單價值' },
    conversionRate: { value: 3.2, trend: -1.2, label: '轉換率' },
    totalCustomers: { value: 856, trend: 15.6, label: '總客戶數' },
    repeatCustomers: { value: 342, trend: 22.1, label: '回購客戶' }
  };

  const mockTopProducts = [
    { id: 1, name: '經典珍珠項鍊', sales: 125, revenue: 156250, growth: 18.5 },
    { id: 2, name: '玫瑰金手鍊', sales: 98, revenue: 98000, growth: 12.3 },
    { id: 3, name: '鑽石耳環套組', sales: 87, revenue: 217500, growth: 8.7 },
    { id: 4, name: '翡翠玉鐲', sales: 65, revenue: 195000, growth: 25.6 },
    { id: 5, name: '銀飾戒指', sales: 156, revenue: 62400, growth: -3.2 }
  ];

  const mockSalesChannels = [
    { channel: '官方網站', revenue: 1548000, percentage: 60.0, growth: 15.2 },
    { channel: '第三方平台', revenue: 645000, percentage: 25.0, growth: 8.9 },
    { channel: '實體店面', revenue: 258000, percentage: 10.0, growth: -5.3 },
    { channel: '社群媒體', revenue: 129000, percentage: 5.0, growth: 28.7 }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="w-full px-6">
        {/* 頁面標題和控制項 */}
  <div className="flex flex-row items-center justify-between mb-8">
          <div className="mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">銷售分析</h1>
            <p className="text-gray-600">深度分析銷售數據，洞察商業趨勢與機會</p>
          </div>
          
          <div className="flex flex-row gap-4">
            {/* 時間範圍選擇 */}
            <SearchableSelect
              options={periodOptions.map(option => ({ 
                value: option.value, 
                label: option.label 
              }))}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              placeholder="選擇時間範圍"
              className="min-w-[160px]"
            />

            {/* 刷新按鈕 */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8753f] transition-colors flex items-center ${
                refreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? '更新中...' : '刷新數據'}
            </button>

            {/* 匯出按鈕 */}
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              匯出報表
            </button>
          </div>
        </div>

        {/* 核心指標卡片 */}
  <div className="grid grid-cols-6 gap-6 mb-8">
          {Object.entries(mockSalesMetrics).map(([key, metric]) => (
            <div key={key} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
                {getTrendIcon(metric.trend)}
              </div>
              
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  {key === 'totalRevenue' || key === 'avgOrderValue' ? 
                    formatCurrency(metric.value) : 
                    key === 'conversionRate' ? 
                    formatPercentage(metric.value) : 
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

  <div className="grid grid-cols-2 gap-6 mb-8">
          {/* 銷售趨勢圖表 */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                銷售趨勢
              </h3>
              
              <div className="flex space-x-2">
                {metricOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedMetric(option.value)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedMetric === option.value
                        ? 'bg-[#cc824d] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 模擬圖表區域 */}
            <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">銷售趨勢圖表</p>
                <p className="text-gray-400 text-xs">圖表組件整合中...</p>
              </div>
            </div>
          </div>

          {/* 銷售管道分析 */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <ChartPieIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
              銷售管道分析
            </h3>
            
            <div className="space-y-4">
              {mockSalesChannels.map((channel, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{channel.channel}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">
                        {formatCurrency(channel.revenue)}
                      </span>
                      <span className={`text-xs font-medium ${getTrendColor(channel.growth)}`}>
                        {channel.growth > 0 ? '+' : ''}{channel.growth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#cc824d] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${channel.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-0">
                      {channel.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

  <div className="grid grid-cols-2 gap-6">
          {/* 熱銷商品排行 */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ShoppingBagIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                熱銷商品排行
              </h3>
              
              <button className="text-sm text-[#cc824d] hover:text-[#b8753f] flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                查看全部
              </button>
            </div>
            
            <div className="space-y-4">
              {mockTopProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>銷量: {formatNumber(product.sales)}</span>
                      <span>營收: {formatCurrency(product.revenue)}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${getTrendColor(product.growth)}`}>
                      {getTrendIcon(product.growth)}
                      <span className="text-sm font-medium">
                        {Math.abs(product.growth).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 銷售預測與洞察 */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
              銷售預測與洞察
            </h3>
            
            <div className="space-y-6">
              {/* 本月預測 */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">本月銷售預測</h4>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">預估營收</span>
                  <span className="font-bold text-blue-900">{formatCurrency(3200000)}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-blue-700">預估訂單</span>
                  <span className="font-bold text-blue-900">{formatNumber(1580)}</span>
                </div>
              </div>

              {/* 關鍵洞察 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">關鍵洞察</h4>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">週末銷售表現優異</p>
                      <p className="text-xs text-green-700">週末轉換率提升 23%，建議加強週末促銷活動</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <ArrowTrendingDownIcon className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">手機端轉換率偏低</p>
                      <p className="text-xs text-orange-700">手機端轉換率較桌面端低 15%，需優化行動體驗</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <UsersIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">客戶回購率成長</p>
                      <p className="text-xs text-purple-700">新客戶回購率較上月提升 8.5%，客戶忠誠度提高</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;