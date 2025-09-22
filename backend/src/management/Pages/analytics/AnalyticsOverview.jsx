import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ClockIcon,
  ArrowPathIcon,
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import analyticsDataManager from '../../../lib/data/analytics/analyticsDataManager';

const AnalyticsOverview = () => {
  const [kpiData, setKpiData] = useState({});
  const [realtimeData, setRealtimeData] = useState({});
  const [salesTrends, setSalesTrends] = useState({});
  const [aiInsights, setAiInsights] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadAnalyticsData();
    const interval = setInterval(loadRealtimeData, 30000); // 每30秒更新實時數據
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // 獲取 KPI 數據
      const kpis = analyticsDataManager.getKPIDashboard(selectedPeriod);
      setKpiData(kpis);
      
      // 獲取銷售趨勢
      const trends = analyticsDataManager.getSalesTrends(selectedPeriod);
      setSalesTrends(trends);
      
      // 獲取 AI 洞察
      const insights = analyticsDataManager.getAIInsights();
      setAiInsights(insights);
      
      // 獲取實時數據
      loadRealtimeData();
      
    } catch (error) {
      console.error('載入分析數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeData = () => {
    const realtime = analyticsDataManager.getRealTimeMetrics();
    setRealtimeData(realtime);
    setLastUpdated(new Date());
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('zh-TW').format(number);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center space-x-3">
            <ArrowPathIcon className="h-6 w-6 animate-spin text-[#cc824d]" />
            <span className="text-lg text-gray-600">載入數據分析中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="w-full px-6">
        {/* 頁面標題和控制項 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">數據分析總覽</h1>
            <p className="text-gray-600">360度全方位業務數據洞察與智能分析</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="7d">近 7 天</option>
              <option value="30d">近 30 天</option>
              <option value="90d">近 90 天</option>
              <option value="1y">近 1 年</option>
            </select>
            
            <button
              onClick={loadRealtimeData}
              className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b8753f] transition-colors flex items-center"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              刷新
            </button>
          </div>
        </div>

        {/* 實時監控儀表板 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
              實時監控
            </h2>
            <span className="text-sm text-gray-500">
              最後更新: {lastUpdated.toLocaleTimeString('zh-TW')}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">當前訪客</h3>
                <EyeIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(realtimeData.current_visitors || 0)}
              </div>
              <div className="text-sm text-gray-500">
                活躍會話: {formatNumber(realtimeData.active_sessions || 0)}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">即時銷售</h3>
                <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(realtimeData.real_time_sales || 0)}
              </div>
              <div className="text-sm text-gray-500">
                轉換率: {realtimeData.conversion_rate || 0}%
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">設備分布</h3>
                <DevicePhoneMobileIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>手機</span>
                  <span className="font-semibold">{formatPercentage(realtimeData.device_breakdown?.mobile)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>桌機</span>
                  <span className="font-semibold">{formatPercentage(realtimeData.device_breakdown?.desktop)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">熱門頁面</h3>
                <FireIcon className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-1">
                {(realtimeData.top_pages || []).slice(0, 2).map((page, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="truncate">{page.page}</span>
                    <span className="font-semibold">{formatNumber(page.visitors)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 關鍵績效指標 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            關鍵績效指標 (KPIs)
          </h2>
          
          {/* 財務 KPI */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">財務績效</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">總營收</h4>
                  <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(kpiData.financial_kpis?.total_revenue || 0)}
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(5.2)}
                  <span className={getTrendColor(5.2)}>+5.2% vs 上期</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">毛利潤</h4>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(kpiData.financial_kpis?.gross_profit || 0)}
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(3.1)}
                  <span className={getTrendColor(3.1)}>+3.1% vs 上期</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">平均訂單價值</h4>
                  <ShoppingBagIcon className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(kpiData.financial_kpis?.average_order_value || 0)}
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(-1.5)}
                  <span className={getTrendColor(-1.5)}>-1.5% vs 上期</span>
                </div>
              </div>
            </div>
          </div>

          {/* 營運 KPI */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">營運績效</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">轉換率</h4>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPercentage(kpiData.operational_kpis?.conversion_rate || 0)}
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(2.3)}
                  <span className={getTrendColor(2.3)}>+2.3% vs 上期</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">購物車放棄率</h4>
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPercentage(kpiData.operational_kpis?.cart_abandonment_rate || 0)}
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(-3.8)}
                  <span className={getTrendColor(-3.8)}>-3.8% vs 上期</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">客戶滿意度</h4>
                  <UsersIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPercentage(kpiData.operational_kpis?.customer_satisfaction || 0)}
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(1.2)}
                  <span className={getTrendColor(1.2)}>+1.2% vs 上期</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">庫存周轉率</h4>
                  <ArrowPathIcon className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {(kpiData.operational_kpis?.inventory_turnover || 0).toFixed(1)}x
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(0.8)}
                  <span className={getTrendColor(0.8)}>+0.8% vs 上期</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI 智能洞察 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            AI 智能洞察
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 商業機會 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
                商業機會
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-yellow-800">護膚類商品需求上升</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        檢測到護膚類商品搜尋量增加 23%，建議增加相關產品推廣
                      </p>
                      <div className="text-xs text-yellow-600 mt-2">置信度: 87%</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-green-800">交叉銷售機會</h4>
                      <p className="text-sm text-green-700 mt-1">
                        購買保養品的客戶有 68% 機率同時購買工具類商品
                      </p>
                      <div className="text-xs text-green-600 mt-2">置信度: 92%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 風險警示 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-500" />
                風險警示
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-red-800">庫存不足警告</h4>
                      <p className="text-sm text-red-700 mt-1">
                        5 件熱銷商品庫存將在 7 天內售完，需要及時補貨
                      </p>
                      <div className="text-xs text-red-600 mt-2">風險等級: 高</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-orange-800">客戶流失風險</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        23 位 VIP 客戶 30 天內未購物，存在流失風險
                      </p>
                      <div className="text-xs text-orange-600 mt-2">風險等級: 中</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 地理分布和熱門商品 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 地理分布 */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
              訂單地理分布
            </h3>
            <div className="space-y-3">
              {(realtimeData.geographic_distribution || []).map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 bg-[#cc824d] rounded-full"
                      style={{ opacity: 0.3 + (location.percentage / 100) * 0.7 }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{location.region}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatNumber(location.visitors)}
                    </div>
                    <div className="text-xs text-gray-500">{location.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 熱門商品 */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FireIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
              今日熱銷商品
            </h3>
            <div className="space-y-3">
              {(realtimeData.top_products || []).slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#cc824d] text-white text-xs font-bold rounded-full">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {product.product_name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatNumber(product.sales)} 件
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(product.views)} 瀏覽
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;