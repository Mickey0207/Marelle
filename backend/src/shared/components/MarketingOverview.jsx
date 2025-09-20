import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  EyeIcon,
  BellIcon,
  CalendarIcon,
  FunnelIcon,
  MegaphoneIcon,
  CogIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import marketingDataManager from '../utils/marketingDataManager';
import SearchableSelect from "@shared/components/SearchableSelect";

const MarketingOverview = () => {
  const [analytics, setAnalytics] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [adCampaigns, setAdCampaigns] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  useEffect(() => {
    loadData();
  }, [selectedTimeRange]);

  const loadData = () => {
    const analyticsData = marketingDataManager.getMarketingAnalytics();
    const campaignsData = marketingDataManager.getCampaigns();
    const adCampaignsData = marketingDataManager.getAdCampaigns();
    const trendData = marketingDataManager.getTrendData(selectedTimeRange === '7d' ? 7 : 30);

    setAnalytics(analyticsData);
    setCampaigns(campaignsData);
    setAdCampaigns(adCampaignsData);
    setTrendData(trendData);
  };

  const handleCampaignStatusChange = (campaignId, newStatus) => {
    marketingDataManager.updateCampaignStatus(campaignId, newStatus);
    loadData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toLocaleString() || '0';
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 bg-green-50',
      scheduled: 'text-blue-600 bg-blue-50',
      paused: 'text-yellow-600 bg-yellow-50',
      completed: 'text-gray-600 bg-gray-50',
      draft: 'text-purple-600 bg-purple-50',
      cancelled: 'text-red-600 bg-red-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      active: '?��?�?,
      scheduled: '已�?�?,
      paused: '已暫??,
      completed: '已�???,
      draft: '?�稿',
      cancelled: '已�?�?
    };
    return statusTexts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <PlayIcon className="h-4 w-4" />,
      scheduled: <CalendarIcon className="h-4 w-4" />,
      paused: <PauseIcon className="h-4 w-4" />,
      completed: <StopIcon className="h-4 w-4" />,
      draft: <CogIcon className="h-4 w-4" />
    };
    return icons[status] || <CogIcon className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="p-6">
        {/* ?�面標�? */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">行銷管�?總覽</h1>
              <p className="text-gray-600">統�?管�?檔�?活�??�廣?��??��?客戶?��?</p>
            </div>
            <div className="flex items-center space-x-4">
              <SearchableSelect
                options={[
                  { value: '7d', label: '?�去7�? },
                  { value: '30d', label: '?�去30�? }
                ]}
                value={selectedTimeRange}
                onChange={setSelectedTimeRange}
                placeholder="?��??��?範�?"
                className="min-w-[140px]"
              />
              <button className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b8753f] transition-colors flex items-center">
                <BellIcon className="h-5 w-5 mr-2" />
                ?��?警報
              </button>
            </div>
          </div>
        </div>

        {/* ?��??��??��? */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-[#cc824d]" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">總收??/p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview?.totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+{formatPercentage(15.2)}</span>
                  <span className="text-sm text-gray-500 ml-1">較�???/span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-[#cc824d]" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">ROAS</p>
                <p className="text-2xl font-bold text-gray-900">{(analytics.overview?.totalROAS || 0).toFixed(1)}x</p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+{formatPercentage(8.7)}</span>
                  <span className="text-sm text-gray-500 ml-1">較�???/span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-8 w-8 text-[#cc824d]" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">總�??�數</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview?.totalImpressions)}</p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+{formatPercentage(23.1)}</span>
                  <span className="text-sm text-gray-500 ml-1">較�???/span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FunnelIcon className="h-8 w-8 text-[#cc824d]" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">轉�???/p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.overview?.avgConversionRate)}</p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600 font-medium">-{formatPercentage(2.3)}</span>
                  <span className="text-sm text-gray-500 ml-1">較�???/span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ?��?中�??�活??*/}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">?��?中�??�活??/h2>
              <MegaphoneIcon className="h-6 w-6 text-[#cc824d]" />
            </div>
            <div className="space-y-4">
              {campaigns.filter(c => c.status === 'active').slice(0, 3).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-500">{campaign.description}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1">{getStatusText(campaign.status)}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        ROAS: {(campaign.budget?.actualROI || 0).toFixed(1)}x
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCampaignStatusChange(campaign.id, campaign.status === 'active' ? 'paused' : 'active')}
                      className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors"
                    >
                      {campaign.status === 'active' ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors">
                      <CogIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 平台�??表現 */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">平台�??表現</h2>
              <ChartBarIcon className="h-6 w-6 text-[#cc824d]" />
            </div>
            <div className="space-y-4">
              {analytics.platformPerformance?.map((platform) => (
                <div key={platform.platform} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#cc824d] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {platform.platform.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 capitalize">
                        {platform.platform.replace('_', ' ')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {platform.campaigns} ?�廣?�系??
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(platform.spend)}
                    </p>
                    <p className="text-sm text-gray-500">
                      CTR: {platform.clicks && platform.impressions ? 
                        formatPercentage((platform.clicks / platform.impressions) * 100) : '0%'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ?�眾洞�? */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">?�眾洞�?</h2>
              <UserGroupIcon className="h-6 w-6 text-[#cc824d]" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">總�??�數</span>
                <span className="font-semibold">{analytics.audienceInsights?.totalAudiences || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">平�??�眾規模</span>
                <span className="font-semibold">
                  {formatNumber(analytics.audienceInsights?.averageAudienceSize)}
                </span>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">?�佳表?��???/p>
                <p className="text-sm text-gray-900">
                  {analytics.audienceInsights?.topPerformingAudience?.name || '?�無?��?'}
                </p>
                <p className="text-sm text-gray-500">
                  ?�入: {formatCurrency(analytics.audienceInsights?.topPerformingAudience?.performance?.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* ?��??�表??*/}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">?��??�表??/h2>
              <CogIcon className="h-6 w-6 text-[#cc824d]" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">?�用規�?</span>
                <span className="font-semibold">{analytics.automationInsights?.activeRules || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">觸發次數</span>
                <span className="font-semibold">
                  {formatNumber(analytics.automationInsights?.totalTriggered)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">轉�???/span>
                <span className="font-semibold text-green-600">
                  {formatPercentage(analytics.automationInsights?.automationConversionRate)}
                </span>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">?��??�收??/p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(analytics.automationInsights?.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          {/* ?��?使用?��?*/}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">?��?使用?��?/h2>
              <CurrencyDollarIcon className="h-6 w-6 text-[#cc824d]" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">總�?�?/span>
                  <span className="font-semibold">{formatCurrency(analytics.overview?.totalBudget)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#cc824d] h-2 rounded-full"
                    style={{
                      width: `${Math.min(analytics.overview?.budgetUtilization || 0, 100)}%`
                    }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">已使??/span>
                  <span className="text-sm font-medium">
                    {formatPercentage(analytics.overview?.budgetUtilization)}
                  </span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">已花�?/span>
                  <span className="font-semibold">{formatCurrency(analytics.overview?.totalSpent)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">?��??��?</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency((analytics.overview?.totalBudget || 0) - (analytics.overview?.totalSpent || 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 快速�?作�???*/}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">快速�?�?/h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <MegaphoneIcon className="h-6 w-6 text-[#cc824d] mr-2" />
              <span className="text-sm font-medium">建�?檔�?</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="h-6 w-6 text-[#cc824d] mr-2" />
              <span className="text-sm font-medium">�???�放</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <UserGroupIcon className="h-6 w-6 text-[#cc824d] mr-2" />
              <span className="text-sm font-medium">?�眾?��?</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CogIcon className="h-6 w-6 text-[#cc824d] mr-2" />
              <span className="text-sm font-medium">?��??�設�?/span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingOverview;
