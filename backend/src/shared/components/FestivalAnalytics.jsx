import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  EyeIcon,
  ShoppingCartIcon,
  TicketIcon,
  GiftIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import festivalDataManager from '../utils/festivalDataManager';

const FestivalAnalytics = () => {
  const [festivals, setFestivals] = useState([]);
  const [selectedFestival, setSelectedFestival] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedFestival) {
      loadAnalyticsData(selectedFestival);
    }
  }, [selectedFestival, dateRange]);

  const loadData = () => {
    try {
      const festivalsData = festivalDataManager.getAllFestivals();
      setFestivals(festivalsData);
      if (festivalsData.length > 0) {
        setSelectedFestival(festivalsData[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('ËºâÂÖ•?∏Ê?Â§±Ê?:', error);
      setLoading(false);
    }
  };

  const loadAnalyticsData = (festivalId) => {
    try {
      const data = festivalDataManager.getFestivalAnalytics(festivalId);
      const festival = festivalDataManager.getFestivalById(festivalId);
      
      setAnalyticsData(data);
      
      // Ë®àÁ??àÊ??áÊ?ÔºåÁ¢∫‰øùÊ??âÊï∏?ºÈÉΩ?âÈ?Ë®≠ÂÄ?
      const analytics = festival?.analytics || {};
      const revenue = Number(analytics.revenue) || 0;
      const views = Number(analytics.views) || 0;
      const participation = Number(analytics.participation) || 0;
      const conversionRate = Number(analytics.conversionRate) || 0;
      
      const metrics = {
        totalRevenue: revenue,
        totalViews: views,
        totalParticipation: participation,
        conversionRate: conversionRate,
        roi: calculateROI(revenue, 50000), // ?áË®≠?êÊú¨
        avgOrderValue: participation > 0 ? revenue / participation : 0,
        clickThroughRate: views > 0 ? (participation / views * 100) : 0
      };
      
      setPerformanceMetrics(metrics);
      
      // ?üÊ?ÊØîË??∏Ê?
      generateComparisonData();
      
    } catch (error) {
      console.error('ËºâÂÖ•?ÜÊ??∏Ê?Â§±Ê?:', error);
      // Ë®≠Â??êË®≠?º‰ª•?≤Ê≠¢?ØË™§
      setPerformanceMetrics({
        totalRevenue: 0,
        totalViews: 0,
        totalParticipation: 0,
        conversionRate: 0,
        roi: 0,
        avgOrderValue: 0,
        clickThroughRate: 0
      });
    }
  };

  const calculateROI = (revenue, cost) => {
    const numRevenue = Number(revenue) || 0;
    const numCost = Number(cost) || 0;
    
    if (numCost === 0) return 0;
    return ((numRevenue - numCost) / numCost * 100);
  };

  const generateComparisonData = () => {
    // Ê®°Êì¨?éÂéª30Â§©Á??∏Ê?
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 500) + 100,
        participation: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 20000) + 5000,
        conversions: Math.floor(Math.random() * 30) + 5
      });
    }
    
    setComparisonData(data);
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0
      }).format(0);
    }
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(Number(amount));
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.0%';
    }
    return `${Number(value).toFixed(1)}%`;
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100);
  };

  const getTrendIcon = (change) => {
    if (change > 0) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getMetricColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const exportData = () => {
    const selectedFestivalData = festivals.find(f => f.id === selectedFestival);
    const exportData = {
      festival: selectedFestivalData,
      analytics: analyticsData,
      metrics: performanceMetrics,
      timeSeriesData: comparisonData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `festival-analytics-${selectedFestivalData?.name}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cc824d]"></div>
      </div>
    );
  }

  const selectedFestivalData = festivals.find(f => f.id === selectedFestival);

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div>
        {/* ?ÅÈù¢Ê®ôÈ? */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ÁØÄ?∂Â???/h1>
            <p className="text-gray-600">Ê∑±ÂÖ•?ÜÊ?ÁØÄ?∂Ê¥ª?ïÁ??àÊ??áROI</p>
          </div>
          <button
            onClick={exportData}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b8734a] transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Â∞éÂá∫?∏Ê?
          </button>
        </div>

        {/* ?ßÂà∂?¢Êùø */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">?∏Ê?ÁØÄ??/label>
              <select
                value={selectedFestival}
                onChange={(e) => setSelectedFestival(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                {festivals.map((festival) => (
                  <option key={festival.id} value={festival.id}>
                    {festival.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">?ÇÈ?ÁØÑÂ?</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="7">?éÂéª7Â§?/option>
                <option value="30">?éÂéª30Â§?/option>
                <option value="90">?éÂéª3?ãÊ?</option>
                <option value="365">?éÂéª‰∏ÄÂπ?/option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">?Ä??/label>
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedFestivalData?.status === 'active' ? 'bg-green-100 text-green-800' : 
                    selectedFestivalData?.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    selectedFestivalData?.status === 'ended' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedFestivalData?.status === 'active' ? '?≤Ë?‰∏? : 
                     selectedFestivalData?.status === 'scheduled' ? 'Â∑≤Ê?Á®? :
                     selectedFestivalData?.status === 'ended' ? 'Â∑≤Á??? : '?âÁ®ø'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ?∏Â??áÊ? */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Á∏ΩÊî∂??/p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(performanceMetrics.totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(8.5)}
                  <span className={`text-sm ml-1 ${getMetricColor(8.5)}`}>+8.5%</span>
                  <span className="text-sm text-gray-500 ml-1">ËºÉ‰???/span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Á∏ΩÁÄèË¶Ω??/p>
                <p className="text-2xl font-bold text-gray-900">{performanceMetrics.totalViews?.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(12.3)}
                  <span className={`text-sm ml-1 ${getMetricColor(12.3)}`}>+12.3%</span>
                  <span className="text-sm text-gray-500 ml-1">ËºÉ‰???/span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">?ÉË?‰∫∫Ê¨°</p>
                <p className="text-2xl font-bold text-gray-900">{performanceMetrics.totalParticipation?.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(5.7)}
                  <span className={`text-sm ml-1 ${getMetricColor(5.7)}`}>+5.7%</span>
                  <span className="text-sm text-gray-500 ml-1">ËºÉ‰???/span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-8 w-8 text-[#cc824d]" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">ËΩâÊ???/p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(performanceMetrics.conversionRate)}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(-2.1)}
                  <span className={`text-sm ml-1 ${getMetricColor(-2.1)}`}>-2.1%</span>
                  <span className="text-sm text-gray-500 ml-1">ËºÉ‰???/span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ë©≥Á¥∞?ÜÊ? */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ?àÊ??áÊ? */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">?àÊ??áÊ?</h2>
              <ChartBarIcon className="h-5 w-5 text-[#cc824d]" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">ROI (?ïË??ûÂ†±??</p>
                  <p className="text-xs text-gray-500">?∂Á??∏Â??ºÊ?Ë≥áÊ??¨Á?ÊØîÁ?</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatPercentage(performanceMetrics.roi)}</p>
                  <div className="flex items-center">
                    {getTrendIcon(15.2)}
                    <span className={`text-sm ${getMetricColor(15.2)}`}>+15.2%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Âπ≥Â?Ë®ÇÂñÆ?πÂÄ?/p>
                  <p className="text-xs text-gray-500">ÊØèÁ?Ë®ÇÂñÆ?ÑÂπ≥?áÈ?È°?/p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(performanceMetrics.avgOrderValue)}</p>
                  <div className="flex items-center">
                    {getTrendIcon(3.8)}
                    <span className={`text-sm ${getMetricColor(3.8)}`}>+3.8%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">ÈªûÊ???/p>
                  <p className="text-xs text-gray-500">?èË¶Ω?∞Â??áÁ?ËΩâÊ?ÊØî‰?</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatPercentage(performanceMetrics.clickThroughRate)}</p>
                  <div className="flex items-center">
                    {getTrendIcon(-1.5)}
                    <span className={`text-sm ${getMetricColor(-1.5)}`}>-1.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ‰øÉÈä∑Ê¥ªÂ?Ë°®Áèæ */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">‰øÉÈä∑Ê¥ªÂ?Ë°®Áèæ</h2>
              <GiftIcon className="h-5 w-5 text-[#cc824d]" />
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-white/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">‰øÉÈä∑Ê¥ªÂ?</h3>
                  <span className="text-sm text-gray-500">{analyticsData?.promotions?.total || 0} ??/span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">?üÁî®‰∏?</span>
                    <span className="font-medium text-green-600 ml-1">{analyticsData?.promotions?.active || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Á∏Ω‰Ωø??</span>
                    <span className="font-medium text-gray-900 ml-1">{analyticsData?.promotions?.totalUsage || 0}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">?™Ê???/h3>
                  <span className="text-sm text-gray-500">{analyticsData?.coupons?.total || 0} Âº?/span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Â∑≤Áôº??</span>
                    <span className="font-medium text-blue-600 ml-1">{analyticsData?.coupons?.totalIssued || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Â∑≤‰Ωø??</span>
                    <span className="font-medium text-purple-600 ml-1">{analyticsData?.coupons?.totalUsed || 0}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>‰ΩøÁî®??/span>
                    <span>{analyticsData?.coupons?.totalIssued > 0 ? 
                      formatPercentage((analyticsData?.coupons?.totalUsed || 0) / analyticsData?.coupons?.totalIssued * 100) : 
                      '0%'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{
                        width: analyticsData?.coupons?.totalIssued > 0 ? 
                          `${(analyticsData?.coupons?.totalUsed || 0) / analyticsData?.coupons?.totalIssued * 100}%` : 
                          '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ë∂®Âã¢?ñË°® */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Ë∂®Âã¢?ÜÊ?</h2>
            <div className="flex items-center space-x-4">
              <select className="glass-select text-sm font-chinese">
                <option value="views">?èË¶Ω??/option>
                <option value="participation">?ÉË?‰∫∫Ê¨°</option>
                <option value="revenue">?∂Á?</option>
                <option value="conversions">ËΩâÊ?Ê¨°Êï∏</option>
              </select>
            </div>
          </div>
          
          {/* Á∞°Â??ÑË∂®?¢Â?Ë°®È°ØÁ§?*/}
          <div className="h-64 bg-white/30 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Ë∂®Âã¢?ñË°®?Ä??/p>
              <p className="text-sm text-gray-400 mt-1">
                È°ØÁ§∫?éÂéª{dateRange}Â§©Á??∏Ê?Ë∂®Âã¢
              </p>
            </div>
          </div>
        </div>

        {/* ÂÆ¢Êà∂?ÉË??ÜÊ? */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">ÂÆ¢Êà∂?ÉË??ÜÊ?</h2>
            <UserGroupIcon className="h-5 w-5 text-[#cc824d]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <EyeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">?∞Ë®™ÂÆ?/h3>
              <p className="text-2xl font-bold text-gray-900">{Math.floor(performanceMetrics.totalViews * 0.65).toLocaleString()}</p>
              <p className="text-sm text-gray-500">‰ΩîÁ∏Ω?èË¶Ω 65%</p>
            </div>
            
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">?ûÈ†≠ÂÆ?/h3>
              <p className="text-2xl font-bold text-gray-900">{Math.floor(performanceMetrics.totalViews * 0.35).toLocaleString()}</p>
              <p className="text-sm text-gray-500">‰ΩîÁ∏Ω?èË¶Ω 35%</p>
            </div>
            
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCartIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">ËΩâÊ?ÂÆ¢Êà∂</h3>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.totalParticipation?.toLocaleString()}</p>
              <p className="text-sm text-gray-500">ËΩâÊ???{formatPercentage(performanceMetrics.conversionRate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalAnalytics;
