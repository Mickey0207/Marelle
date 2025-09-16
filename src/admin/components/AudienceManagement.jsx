import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChartBarIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  GlobeAltIcon,
  HeartIcon,
  ShoppingCartIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import marketingDataManager from '../utils/marketingDataManager';

const AudienceManagement = () => {
  const [audiences, setAudiences] = useState([]);
  const [filteredAudiences, setFilteredAudiences] = useState([]);
  const [segmentAnalysis, setSegmentAnalysis] = useState({});
  const [activeTab, setActiveTab] = useState('audiences');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAudience, setNewAudience] = useState({
    name: '',
    description: '',
    type: 'behavioral',
    criteria: {
      demographics: {
        age: { min: 18, max: 65 },
        gender: ['all']
      },
      behavioral: {
        purchaseHistory: {
          totalSpent: { min: 0 },
          frequency: { min: 1 }
        },
        engagementLevel: 'all'
      },
      geographic: {
        countries: ['TW'],
        cities: []
      },
      psychographic: {
        interests: [],
        lifestyle: []
      }
    },
    refreshFrequency: 'weekly'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAudiences();
  }, [audiences, searchTerm, typeFilter]);

  const loadData = () => {
    setAudiences(marketingDataManager.getAudiences());
    setSegmentAnalysis(marketingDataManager.getCustomerSegmentAnalysis());
  };

  const filterAudiences = () => {
    let filtered = audiences;

    if (searchTerm) {
      filtered = filtered.filter(audience =>
        audience.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audience.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(audience => audience.type === typeFilter);
    }

    setFilteredAudiences(filtered);
  };

  const handleCreateAudience = () => {
    const audienceData = {
      ...newAudience,
      size: {
        estimated: Math.floor(Math.random() * 5000) + 500,
        actual: Math.floor(Math.random() * 4500) + 450,
        lastUpdated: new Date().toISOString()
      },
      campaigns: [],
      platforms: [],
      performance: {
        averageCTR: Math.random() * 10 + 2,
        averageConversionRate: Math.random() * 15 + 3,
        averageCPA: Math.random() * 100 + 50,
        totalRevenue: Math.random() * 500000 + 100000
      },
      lastRefreshAt: new Date().toISOString()
    };

    marketingDataManager.createAudience(audienceData);
    loadData();
    setShowCreateModal(false);
    resetNewAudience();
  };

  const handleDeleteAudience = (audienceId) => {
    if (window.confirm('確定要刪除此受眾群體嗎？')) {
      marketingDataManager.deleteAudience(audienceId);
      loadData();
    }
  };

  const resetNewAudience = () => {
    setNewAudience({
      name: '',
      description: '',
      type: 'behavioral',
      criteria: {
        demographics: {
          age: { min: 18, max: 65 },
          gender: ['all']
        },
        behavioral: {
          purchaseHistory: {
            totalSpent: { min: 0 },
            frequency: { min: 1 }
          },
          engagementLevel: 'all'
        },
        geographic: {
          countries: ['TW'],
          cities: []
        },
        psychographic: {
          interests: [],
          lifestyle: []
        }
      },
      refreshFrequency: 'weekly'
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

  const getTypeIcon = (type) => {
    const icons = {
      demographic: <UserGroupIcon className="h-5 w-5" />,
      behavioral: <ChartBarIcon className="h-5 w-5" />,
      psychographic: <LightBulbIcon className="h-5 w-5" />,
      geographic: <GlobeAltIcon className="h-5 w-5" />,
      custom: <AdjustmentsHorizontalIcon className="h-5 w-5" />
    };
    return icons[type] || <UserGroupIcon className="h-5 w-5" />;
  };

  const getTypeText = (type) => {
    const typeTexts = {
      demographic: '人口統計',
      behavioral: '行為特徵',
      psychographic: '心理特徵',
      geographic: '地理位置',
      custom: '自訂條件'
    };
    return typeTexts[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      demographic: 'text-blue-600 bg-blue-50 border-blue-200',
      behavioral: 'text-green-600 bg-green-50 border-green-200',
      psychographic: 'text-purple-600 bg-purple-50 border-purple-200',
      geographic: 'text-orange-600 bg-orange-50 border-orange-200',
      custom: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getPerformanceColor = (value, threshold) => {
    if (value >= threshold * 1.2) return 'text-green-600';
    if (value >= threshold * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const generatePersonalizedRecommendations = (userId = 'sample_user') => {
    return marketingDataManager.getPersonalizedRecommendations(userId);
  };

  const generateDynamicPricing = (productId = 'sample_product') => {
    return marketingDataManager.getDynamicPricingRecommendation(productId);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">受眾管理中心</h1>
            <p className="text-gray-600">客戶分群分析、個人化推薦與精準行銷</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#cc824d] text-white px-6 py-3 rounded-lg hover:bg-[#b8753f] transition-colors flex items-center font-medium"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            建立受眾群體
          </button>
        </div>

        {/* 分頁標籤 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('audiences')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'audiences'
                  ? 'border-[#cc824d] text-[#cc824d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              受眾群體管理
            </button>
            <button
              onClick={() => setActiveTab('segments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'segments'
                  ? 'border-[#cc824d] text-[#cc824d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              客戶分群洞察
            </button>
            <button
              onClick={() => setActiveTab('personalization')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'personalization'
                  ? 'border-[#cc824d] text-[#cc824d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              個人化推薦
            </button>
          </nav>
        </div>

        {/* 受眾群體管理 */}
        {activeTab === 'audiences' && (
          <div>
            {/* 搜尋與篩選 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜尋受眾群體..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="all">所有類型</option>
                  <option value="demographic">人口統計</option>
                  <option value="behavioral">行為特徵</option>
                  <option value="psychographic">心理特徵</option>
                  <option value="geographic">地理位置</option>
                  <option value="custom">自訂條件</option>
                </select>
                <div className="flex items-center text-sm text-gray-600">
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  共 {filteredAudiences.length} 個受眾群體
                </div>
                <div className="flex justify-end">
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm">
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    AI智能分群
                  </button>
                </div>
              </div>
            </div>

            {/* 受眾列表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAudiences.map((audience) => (
                <div key={audience.id} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{audience.name}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(audience.type)}`}>
                          {getTypeIcon(audience.type)}
                          <span className="ml-1">{getTypeText(audience.type)}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{audience.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors" title="查看詳情">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors" title="編輯受眾">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAudience(audience.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="刪除受眾"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">受眾規模</p>
                      <p className="text-xl font-bold text-gray-900">{formatNumber(audience.size?.actual)}</p>
                      <p className="text-xs text-gray-500">預估 {formatNumber(audience.size?.estimated)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">總收入</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(audience.performance?.totalRevenue)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">平均CTR</span>
                      <span className={`font-semibold ${getPerformanceColor(audience.performance?.averageCTR, 5)}`}>
                        {formatPercentage(audience.performance?.averageCTR)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">轉換率</span>
                      <span className={`font-semibold ${getPerformanceColor(audience.performance?.averageConversionRate, 5)}`}>
                        {formatPercentage(audience.performance?.averageConversionRate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">平均CPA</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(audience.performance?.averageCPA)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        更新頻率: {audience.refreshFrequency === 'daily' ? '每日' : 
                                  audience.refreshFrequency === 'weekly' ? '每週' : 
                                  audience.refreshFrequency === 'monthly' ? '每月' : '手動'}
                      </span>
                      <div className="flex space-x-2">
                        {audience.campaigns?.length > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {audience.campaigns.length} 個檔期
                          </span>
                        )}
                        {audience.platforms?.length > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {audience.platforms.length} 個平台
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAudiences.length === 0 && (
              <div className="text-center py-12">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到受眾群體</h3>
                <p className="text-gray-600 mb-4">開始建立您的第一個受眾群體</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#cc824d] text-white px-6 py-2 rounded-lg hover:bg-[#b8753f] transition-colors"
                >
                  建立受眾群體
                </button>
              </div>
            )}
          </div>
        )}

        {/* 客戶分群洞察 */}
        {activeTab === 'segments' && (
          <div className="space-y-6">
            {/* 分群概覽 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {segmentAnalysis.segments?.map((segment, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#cc824d]">{formatPercentage(segment.percentage)}</p>
                      <p className="text-sm text-gray-500">{formatNumber(segment.size)} 人</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">平均消費</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(segment.avgSpend)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">購買頻率</span>
                      <span className="font-semibold text-gray-900">{segment.avgFrequency.toFixed(1)} 次/年</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">終身價值</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(segment.lifetimeValue)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">主要特徵</p>
                    <div className="flex flex-wrap gap-1">
                      {segment.characteristics?.map((char, charIndex) => (
                        <span key={charIndex} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 洞察摘要 */}
            {segmentAnalysis.insights && (
              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <LightBulbIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                  關鍵洞察
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {segmentAnalysis.insights.map((insight, index) => (
                    <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <LightBulbIcon className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 個人化推薦 */}
        {activeTab === 'personalization' && (
          <div className="space-y-6">
            {/* 個人化功能總覽 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <ShoppingCartIcon className="h-8 w-8 text-[#cc824d] mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">商品推薦</h3>
                    <p className="text-sm text-gray-600">AI驅動的個人化商品推薦</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">推薦準確率</span>
                    <span className="font-semibold text-green-600">87.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">點擊率提升</span>
                    <span className="font-semibold text-green-600">+42%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <CurrencyDollarIcon className="h-8 w-8 text-[#cc824d] mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">動態定價</h3>
                    <p className="text-sm text-gray-600">個人化價格策略</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">收入提升</span>
                    <span className="font-semibold text-green-600">+15.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">轉換率改善</span>
                    <span className="font-semibold text-green-600">+23%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <HeartIcon className="h-8 w-8 text-[#cc824d] mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">內容個人化</h3>
                    <p className="text-sm text-gray-600">客製化內容體驗</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">參與度提升</span>
                    <span className="font-semibold text-green-600">+38%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">停留時間</span>
                    <span className="font-semibold text-green-600">+28%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 推薦範例 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                個人化推薦示例
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 商品推薦 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">商品推薦 (示例用戶)</h4>
                  <div className="space-y-3">
                    {generatePersonalizedRecommendations().find(r => r.type === 'product')?.products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#cc824d]">
                            {(product.score * 100).toFixed(0)}% 匹配
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 動態定價 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">動態定價建議</h4>
                  {(() => {
                    const pricing = generateDynamicPricing();
                    return (
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">示例商品</span>
                            <span className="text-sm text-gray-500">信心度: {(pricing.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">基礎價格</span>
                            <span className="font-semibold">{formatCurrency(pricing.basePrice)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">建議價格</span>
                            <span className="font-semibold text-[#cc824d]">{formatCurrency(pricing.recommendedPrice)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">預期提升</span>
                            <span className="font-semibold text-green-600">+{pricing.expectedUplift.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* 自動化規則 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CogIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                個人化自動化規則
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">瀏覽行為觸發</h4>
                  <p className="text-sm text-gray-600 mb-3">基於用戶瀏覽歷史推薦相關商品</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    已啟用
                  </span>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">購買週期預測</h4>
                  <p className="text-sm text-gray-600 mb-3">預測用戶下次購買時間並主動推薦</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    已啟用
                  </span>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">價格敏感度調整</h4>
                  <p className="text-sm text-gray-600 mb-3">根據用戶行為調整個人化價格</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    測試中
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 建立受眾模態視窗 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">建立受眾群體</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">受眾名稱</label>
                    <input
                      type="text"
                      value={newAudience.name}
                      onChange={(e) => setNewAudience({ ...newAudience, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="輸入受眾群體名稱"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">分群類型</label>
                    <select
                      value={newAudience.type}
                      onChange={(e) => setNewAudience({ ...newAudience, type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    >
                      <option value="demographic">人口統計</option>
                      <option value="behavioral">行為特徵</option>
                      <option value="psychographic">心理特徵</option>
                      <option value="geographic">地理位置</option>
                      <option value="custom">自訂條件</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                  <textarea
                    value={newAudience.description}
                    onChange={(e) => setNewAudience({ ...newAudience, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="描述此受眾群體的特徵和用途"
                  />
                </div>

                {/* 條件設定 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">分群條件設定</h3>
                  
                  {/* 人口統計條件 */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">人口統計</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">年齡範圍</label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={newAudience.criteria.demographics.age.min}
                            onChange={(e) => setNewAudience({
                              ...newAudience,
                              criteria: {
                                ...newAudience.criteria,
                                demographics: {
                                  ...newAudience.criteria.demographics,
                                  age: { ...newAudience.criteria.demographics.age, min: Number(e.target.value) }
                                }
                              }
                            })}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="最小"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="number"
                            value={newAudience.criteria.demographics.age.max}
                            onChange={(e) => setNewAudience({
                              ...newAudience,
                              criteria: {
                                ...newAudience.criteria,
                                demographics: {
                                  ...newAudience.criteria.demographics,
                                  age: { ...newAudience.criteria.demographics.age, max: Number(e.target.value) }
                                }
                              }
                            })}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="最大"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">性別</label>
                        <select
                          value={newAudience.criteria.demographics.gender[0]}
                          onChange={(e) => setNewAudience({
                            ...newAudience,
                            criteria: {
                              ...newAudience.criteria,
                              demographics: {
                                ...newAudience.criteria.demographics,
                                gender: [e.target.value]
                              }
                            }
                          })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="all">不限</option>
                          <option value="female">女性</option>
                          <option value="male">男性</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">更新頻率</label>
                        <select
                          value={newAudience.refreshFrequency}
                          onChange={(e) => setNewAudience({ ...newAudience, refreshFrequency: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="real_time">即時</option>
                          <option value="daily">每日</option>
                          <option value="weekly">每週</option>
                          <option value="monthly">每月</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 行為條件 */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">行為特徵</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">最低消費金額</label>
                        <input
                          type="number"
                          value={newAudience.criteria.behavioral.purchaseHistory.totalSpent.min}
                          onChange={(e) => setNewAudience({
                            ...newAudience,
                            criteria: {
                              ...newAudience.criteria,
                              behavioral: {
                                ...newAudience.criteria.behavioral,
                                purchaseHistory: {
                                  ...newAudience.criteria.behavioral.purchaseHistory,
                                  totalSpent: { min: Number(e.target.value) }
                                }
                              }
                            }
                          })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">最低購買次數</label>
                        <input
                          type="number"
                          value={newAudience.criteria.behavioral.purchaseHistory.frequency.min}
                          onChange={(e) => setNewAudience({
                            ...newAudience,
                            criteria: {
                              ...newAudience.criteria,
                              behavioral: {
                                ...newAudience.criteria.behavioral,
                                purchaseHistory: {
                                  ...newAudience.criteria.behavioral.purchaseHistory,
                                  frequency: { min: Number(e.target.value) }
                                }
                              }
                            }
                          })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          placeholder="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">參與度</label>
                        <select
                          value={newAudience.criteria.behavioral.engagementLevel}
                          onChange={(e) => setNewAudience({
                            ...newAudience,
                            criteria: {
                              ...newAudience.criteria,
                              behavioral: {
                                ...newAudience.criteria.behavioral,
                                engagementLevel: e.target.value
                              }
                            }
                          })}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="all">不限</option>
                          <option value="high">高參與</option>
                          <option value="medium">中等參與</option>
                          <option value="low">低參與</option>
                        </select>
                      </div>
                    </div>
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
                  onClick={handleCreateAudience}
                  disabled={!newAudience.name || !newAudience.description}
                  className="bg-[#cc824d] text-white px-6 py-2 rounded-lg hover:bg-[#b8753f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  建立受眾群體
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudienceManagement;