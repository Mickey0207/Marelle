import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  PhotoIcon,
  PlayIcon,
  PauseIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  TagIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import marketingDataManager from '../utils/marketingDataManager';

const AdvertisingManagement = () => {
  const [adCampaigns, setAdCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [creativeAssets, setCreativeAssets] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreativeModal, setShowCreativeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [newAdCampaign, setNewAdCampaign] = useState({
    name: '',
    campaignId: '',
    platform: {
      name: 'facebook',
      accountId: '',
      campaignId: ''
    },
    campaignType: 'conversion',
    budget: {
      dailyBudget: 1000,
      bidStrategy: 'target_roas',
      targetROAS: 3.0
    },
    targeting: {
      demographics: {
        age: { min: 18, max: 65 },
        gender: ['all'],
        interests: []
      },
      geotargeting: {
        countries: ['TW'],
        cities: []
      }
    },
    delivery: {
      startDate: '',
      endDate: '',
      pacing: 'standard'
    }
  });
  const [newCreative, setNewCreative] = useState({
    name: '',
    type: 'image',
    category: 'campaign_banner',
    tags: []
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAdCampaigns();
  }, [adCampaigns, searchTerm, platformFilter, statusFilter]);

  const loadData = () => {
    setAdCampaigns(marketingDataManager.getAdCampaigns());
    setCampaigns(marketingDataManager.getCampaigns());
    setCreativeAssets(marketingDataManager.getCreativeAssets());
  };

  const filterAdCampaigns = () => {
    let filtered = adCampaigns;

    if (searchTerm) {
      filtered = filtered.filter(ad =>
        ad.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (platformFilter !== 'all') {
      filtered = filtered.filter(ad => ad.platform.name === platformFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ad => ad.status === statusFilter);
    }

    setFilteredAds(filtered);
  };

  const handleCreateAdCampaign = () => {
    const adCampaignData = {
      ...newAdCampaign,
      creatives: {
        images: [],
        videos: [],
        texts: [],
        callToActions: ['立即購買']
      },
      tracking: {
        conversionEvents: ['purchase', 'add_to_cart'],
        utmParameters: {
          source: newAdCampaign.platform.name,
          medium: 'cpc',
          campaign: newAdCampaign.name.toLowerCase().replace(/\s+/g, '_')
        }
      },
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: 0,
        ctr: 0,
        cpc: 0,
        cpa: 0,
        roas: 0
      },
      status: 'draft'
    };

    marketingDataManager.createAdCampaign(adCampaignData);
    loadData();
    setShowCreateModal(false);
    resetNewAdCampaign();
  };

  const handleCreateCreative = () => {
    const creativeData = {
      ...newCreative,
      file: {
        url: `/assets/creatives/${newCreative.name.toLowerCase().replace(/\s+/g, '_')}.jpg`,
        size: 1024000,
        dimensions: { width: 1200, height: 800 },
        format: newCreative.type === 'image' ? 'jpg' : 'mp4'
      },
      variants: [],
      brand: 'marelle',
      usage: {
        campaigns: [],
        platforms: [],
        performance: {
          impressions: 0,
          clicks: 0,
          ctr: 0,
          conversions: 0,
          conversionRate: 0
        }
      },
      compliance: {
        approved: false,
        issues: []
      },
      version: '1.0'
    };

    marketingDataManager.createCreativeAsset(creativeData);
    loadData();
    setShowCreativeModal(false);
    setNewCreative({
      name: '',
      type: 'image',
      category: 'campaign_banner',
      tags: []
    });
  };

  const handleStatusChange = (adId, newStatus) => {
    marketingDataManager.updateAdCampaign(adId, { status: newStatus });
    loadData();
  };

  const handleDeleteAdCampaign = (adId) => {
    if (window.confirm('確定要刪除此廣告系列嗎？')) {
      marketingDataManager.deleteAdCampaign(adId);
      loadData();
    }
  };

  const resetNewAdCampaign = () => {
    setNewAdCampaign({
      name: '',
      campaignId: '',
      platform: {
        name: 'facebook',
        accountId: '',
        campaignId: ''
      },
      campaignType: 'conversion',
      budget: {
        dailyBudget: 1000,
        bidStrategy: 'target_roas',
        targetROAS: 3.0
      },
      targeting: {
        demographics: {
          age: { min: 18, max: 65 },
          gender: ['all'],
          interests: []
        },
        geotargeting: {
          countries: ['TW'],
          cities: []
        }
      },
      delivery: {
        startDate: '',
        endDate: '',
        pacing: 'standard'
      }
    });
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

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: '📘',
      instagram: '📷',
      google_ads: '🔍',
      line: '💚',
      tiktok: '🎵',
      youtube: '📺'
    };
    return icons[platform] || '🌐';
  };

  const getPlatformName = (platform) => {
    const names = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      google_ads: 'Google Ads',
      line: 'LINE',
      tiktok: 'TikTok',
      youtube: 'YouTube'
    };
    return names[platform] || platform;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 bg-green-50 border-green-200',
      paused: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      draft: 'text-purple-600 bg-purple-50 border-purple-200',
      review: 'text-blue-600 bg-blue-50 border-blue-200',
      approved: 'text-green-600 bg-green-50 border-green-200',
      completed: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      active: '投放中',
      paused: '已暫停',
      draft: '草稿',
      review: '審核中',
      approved: '已批准',
      completed: '已完成'
    };
    return statusTexts[status] || status;
  };

  const getCampaignName = (campaignId) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.name : '未關聯檔期';
  };

  // 計算平台總覽數據
  const getPlatformOverview = () => {
    const platformStats = {};
    
    adCampaigns.forEach(ad => {
      const platform = ad.platform.name;
      if (!platformStats[platform]) {
        platformStats[platform] = {
          platform,
          campaigns: 0,
          totalSpend: 0,
          totalImpressions: 0,
          totalClicks: 0,
          totalConversions: 0
        };
      }
      
      platformStats[platform].campaigns++;
      platformStats[platform].totalSpend += ad.performance?.spend || 0;
      platformStats[platform].totalImpressions += ad.performance?.impressions || 0;
      platformStats[platform].totalClicks += ad.performance?.clicks || 0;
      platformStats[platform].totalConversions += ad.performance?.conversions || 0;
    });

    return Object.values(platformStats).map(stats => ({
      ...stats,
      avgCTR: stats.totalImpressions > 0 ? (stats.totalClicks / stats.totalImpressions * 100) : 0,
      avgCPC: stats.totalClicks > 0 ? (stats.totalSpend / stats.totalClicks) : 0,
      avgROAS: stats.totalSpend > 0 ? (stats.totalConversions * 1000 / stats.totalSpend) : 0
    }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="p-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">廣告投放管理</h1>
            <p className="text-gray-600">跨平台廣告系列與創意素材管理</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreativeModal(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <PhotoIcon className="h-5 w-5 mr-2" />
              上傳素材
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#cc824d] text-white px-6 py-2 rounded-lg hover:bg-[#b8753f] transition-colors flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              建立廣告系列
            </button>
          </div>
        </div>

        {/* 分頁標籤 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campaigns'
                  ? 'border-[#cc824d] text-[#cc824d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              廣告系列管理
            </button>
            <button
              onClick={() => setActiveTab('platforms')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'platforms'
                  ? 'border-[#cc824d] text-[#cc824d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              平台表現總覽
            </button>
            <button
              onClick={() => setActiveTab('creatives')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'creatives'
                  ? 'border-[#cc824d] text-[#cc824d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              創意素材庫
            </button>
          </nav>
        </div>

        {/* 廣告系列管理 */}
        {activeTab === 'campaigns' && (
          <div>
            {/* 篩選 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="all">所有平台</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="google_ads">Google Ads</option>
                  <option value="line">LINE</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="all">所有狀態</option>
                  <option value="active">投放中</option>
                  <option value="paused">已暫停</option>
                  <option value="draft">草稿</option>
                  <option value="review">審核中</option>
                </select>
                <div className="flex items-center text-sm text-gray-600">
                  共 {filteredAds.length} 個廣告系列
                </div>
              </div>
            </div>

            {/* 廣告系列列表 */}
            <div className="space-y-4">
              {filteredAds.map((ad) => (
                <div key={ad.id} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{getPlatformIcon(ad.platform.name)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{ad.name}</h3>
                          <p className="text-sm text-gray-600">關聯檔期: {getCampaignName(ad.campaignId)}</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ad.status)}`}>
                          {getStatusText(ad.status)}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                          {getPlatformName(ad.platform.name)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">曝光數</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatNumber(ad.performance?.impressions)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">點擊數</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatNumber(ad.performance?.clicks)}
                          </p>
                          <p className="text-xs text-gray-500">
                            CTR: {formatPercentage(ad.performance?.ctr)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">轉換數</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatNumber(ad.performance?.conversions)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">花費</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(ad.performance?.spend)}
                          </p>
                          <p className="text-xs text-gray-500">
                            CPC: {formatCurrency(ad.performance?.cpc)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">ROAS</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {(ad.performance?.roas || 0).toFixed(1)}x
                          </p>
                          <p className="text-xs text-gray-500">
                            CPA: {formatCurrency(ad.performance?.cpa)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                        <span>預算: {formatCurrency(ad.budget?.dailyBudget)}/日</span>
                        <span>出價策略: {ad.budget?.bidStrategy}</span>
                        <span>投放期間: {ad.delivery?.startDate} - {ad.delivery?.endDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {ad.status === 'active' && (
                        <button
                          onClick={() => handleStatusChange(ad.id, 'paused')}
                          className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                          title="暫停廣告"
                        >
                          <PauseIcon className="h-5 w-5" />
                        </button>
                      )}
                      {ad.status === 'paused' && (
                        <button
                          onClick={() => handleStatusChange(ad.id, 'active')}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="恢復廣告"
                        >
                          <PlayIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors" title="編輯廣告">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAdCampaign(ad.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="刪除廣告"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAds.length === 0 && (
              <div className="text-center py-12">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到廣告系列</h3>
                <p className="text-gray-600 mb-4">開始建立您的第一個廣告系列</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#cc824d] text-white px-6 py-2 rounded-lg hover:bg-[#b8753f] transition-colors"
                >
                  建立廣告系列
                </button>
              </div>
            )}
          </div>
        )}

        {/* 平台表現總覽 */}
        {activeTab === 'platforms' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getPlatformOverview().map((platform) => (
              <div key={platform.platform} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{getPlatformIcon(platform.platform)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getPlatformName(platform.platform)}
                      </h3>
                      <p className="text-sm text-gray-500">{platform.campaigns} 個廣告系列</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">總花費</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(platform.totalSpend)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">總曝光</span>
                    <span className="font-semibold text-gray-900">{formatNumber(platform.totalImpressions)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">總點擊</span>
                    <span className="font-semibold text-gray-900">{formatNumber(platform.totalClicks)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">平均CTR</span>
                    <span className="font-semibold text-gray-900">{formatPercentage(platform.avgCTR)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">平均CPC</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(platform.avgCPC)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ROAS</span>
                    <span className="font-semibold text-gray-900">{platform.avgROAS.toFixed(1)}x</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 創意素材庫 */}
        {activeTab === 'creatives' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {creativeAssets.map((asset) => (
                <div key={asset.id} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-4 shadow-sm">
                  <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    {asset.type === 'image' ? (
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    ) : (
                      <PlayIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2">{asset.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {asset.type} • {asset.file?.dimensions?.width}x{asset.file?.dimensions?.height}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {asset.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      asset.compliance?.approved 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {asset.compliance?.approved ? '已審核' : '待審核'}
                    </span>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-[#cc824d] transition-colors">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-[#cc824d] transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 建立廣告系列模態視窗 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">建立廣告系列</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">廣告系列名稱</label>
                    <input
                      type="text"
                      value={newAdCampaign.name}
                      onChange={(e) => setNewAdCampaign({ ...newAdCampaign, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="輸入廣告系列名稱"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">關聯檔期</label>
                    <select
                      value={newAdCampaign.campaignId}
                      onChange={(e) => setNewAdCampaign({ ...newAdCampaign, campaignId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    >
                      <option value="">選擇檔期活動</option>
                      {campaigns.map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">投放平台</label>
                    <select
                      value={newAdCampaign.platform.name}
                      onChange={(e) => setNewAdCampaign({ 
                        ...newAdCampaign, 
                        platform: { ...newAdCampaign.platform, name: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="google_ads">Google Ads</option>
                      <option value="line">LINE</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">廣告目標</label>
                    <select
                      value={newAdCampaign.campaignType}
                      onChange={(e) => setNewAdCampaign({ ...newAdCampaign, campaignType: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    >
                      <option value="conversion">轉換</option>
                      <option value="traffic">流量</option>
                      <option value="awareness">認知</option>
                      <option value="engagement">互動</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">每日預算</label>
                    <input
                      type="number"
                      value={newAdCampaign.budget.dailyBudget}
                      onChange={(e) => setNewAdCampaign({ 
                        ...newAdCampaign, 
                        budget: { ...newAdCampaign.budget, dailyBudget: Number(e.target.value) }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">出價策略</label>
                    <select
                      value={newAdCampaign.budget.bidStrategy}
                      onChange={(e) => setNewAdCampaign({ 
                        ...newAdCampaign, 
                        budget: { ...newAdCampaign.budget, bidStrategy: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    >
                      <option value="target_roas">目標ROAS</option>
                      <option value="target_cpa">目標CPA</option>
                      <option value="manual_cpc">手動CPC</option>
                      <option value="automatic">自動出價</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">目標ROAS</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newAdCampaign.budget.targetROAS}
                      onChange={(e) => setNewAdCampaign({ 
                        ...newAdCampaign, 
                        budget: { ...newAdCampaign.budget, targetROAS: Number(e.target.value) }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">開始日期</label>
                    <input
                      type="date"
                      value={newAdCampaign.delivery.startDate}
                      onChange={(e) => setNewAdCampaign({ 
                        ...newAdCampaign, 
                        delivery: { ...newAdCampaign.delivery, startDate: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">結束日期</label>
                    <input
                      type="date"
                      value={newAdCampaign.delivery.endDate}
                      onChange={(e) => setNewAdCampaign({ 
                        ...newAdCampaign, 
                        delivery: { ...newAdCampaign.delivery, endDate: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 p-6 border-t">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateAdCampaign}
                  disabled={!newAdCampaign.name || !newAdCampaign.delivery.startDate}
                  className="bg-[#cc824d] text-white px-6 py-2 rounded-lg hover:bg-[#b8753f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  建立廣告系列
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 上傳素材模態視窗 */}
        {showCreativeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">上傳創意素材</h2>
                <button
                  onClick={() => setShowCreativeModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">素材名稱</label>
                  <input
                    type="text"
                    value={newCreative.name}
                    onChange={(e) => setNewCreative({ ...newCreative, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="輸入素材名稱"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">素材類型</label>
                    <select
                      value={newCreative.type}
                      onChange={(e) => setNewCreative({ ...newCreative, type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    >
                      <option value="image">圖片</option>
                      <option value="video">影片</option>
                      <option value="gif">GIF</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">素材分類</label>
                    <select
                      value={newCreative.category}
                      onChange={(e) => setNewCreative({ ...newCreative, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    >
                      <option value="campaign_banner">檔期橫幅</option>
                      <option value="product_image">商品圖片</option>
                      <option value="video_ad">廣告影片</option>
                      <option value="social_post">社群貼文</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">檔案上傳</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">拖拽檔案至此處或點擊上傳</p>
                    <p className="text-sm text-gray-500 mt-2">支援 JPG, PNG, GIF, MP4 格式</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">標籤 (以逗號分隔)</label>
                  <input
                    type="text"
                    value={newCreative.tags.join(', ')}
                    onChange={(e) => setNewCreative({ 
                      ...newCreative, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="例如: 春季, 美妝, 促銷"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 p-6 border-t">
                <button
                  onClick={() => setShowCreativeModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateCreative}
                  disabled={!newCreative.name}
                  className="bg-[#cc824d] text-white px-6 py-2 rounded-lg hover:bg-[#b8753f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上傳素材
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisingManagement;