import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TagIcon,
  ClockIcon,
  UserGroupIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import marketingDataManager from '../../../lib/data/marketing/marketingDataManager';

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'seasonal',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
    objectives: {
      primaryGoal: 'sales',
      kpis: []
    }
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchTerm, statusFilter, typeFilter]);

  const loadCampaigns = () => {
    const data = marketingDataManager.getCampaigns();
    setCampaigns(data);
  };

  const filterCampaigns = () => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.type === typeFilter);
    }

    setFilteredCampaigns(filtered);
  };

  const handleCreateCampaign = () => {
    const campaignData = {
      ...newCampaign,
      schedule: {
        startDate: newCampaign.startDate,
        endDate: newCampaign.endDate,
        timezone: 'Asia/Taipei',
        preHeatPeriod: 7,
        phases: [
          {
            id: 'main',
            name: '主要促銷期',
            startDate: newCampaign.startDate,
            endDate: newCampaign.endDate,
            status: 'scheduled'
          }
        ]
      },
      budget: {
        totalBudget: newCampaign.budget,
        spentBudget: 0,
        projectedROI: 3.0
      },
      animations: {
        themeType: 'promotional',
        effectIntensity: 'moderate',
        mobileOptimization: true,
        performanceMode: 'balanced'
      },
      discounts: {
        rules: [],
        stackingPolicy: 'stackable',
        usageLimit: {
          perUser: 5,
          total: 1000
        }
      },
      advertising: {
        adCampaigns: [],
        pushNotifications: true,
        emailMarketing: true,
        socialMediaPosts: ['facebook', 'instagram']
      },
      inventory: {
        reservedStockPercentage: 10,
        priorityAllocation: false,
        dynamicInventory: true,
        oversellProtection: true
      },
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        ctr: 0,
        conversionRate: 0,
        cpa: 0,
        roas: 0
      },
      createdBy: 'admin',
      status: 'draft'
    };

    marketingDataManager.createCampaign(campaignData);
    loadCampaigns();
    setShowCreateModal(false);
    setNewCampaign({
      name: '',
      type: 'seasonal',
      description: '',
      startDate: '',
      endDate: '',
      budget: 0,
      objectives: {
        primaryGoal: 'sales',
        kpis: []
      }
    });
  };

  const handleUpdateCampaign = (id, updates) => {
    marketingDataManager.updateCampaign(id, updates);
    loadCampaigns();
  };

  const handleStatusChange = (campaignId, newStatus) => {
    marketingDataManager.updateCampaignStatus(campaignId, newStatus);
    loadCampaigns();
  };

  const handleDeleteCampaign = (campaignId) => {
    if (window.confirm('確定要刪除此檔期活動嗎？')) {
      marketingDataManager.deleteCampaign(campaignId);
      loadCampaigns();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 bg-green-50 border-green-200',
      scheduled: 'text-blue-600 bg-blue-50 border-blue-200',
      paused: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      completed: 'text-gray-600 bg-gray-50 border-gray-200',
      draft: 'text-purple-600 bg-purple-50 border-purple-200',
      cancelled: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      active: '進行中',
      scheduled: '已排程',
      paused: '已暫停',
      completed: '已完成',
      draft: '草稿',
      cancelled: '已取消'
    };
    return statusTexts[status] || status;
  };

  const getTypeText = (type) => {
    const typeTexts = {
      festival: '節慶活動',
      seasonal: '季節性',
      product_launch: '新品發佈',
      clearance: '清倉促銷',
      brand_collab: '品牌合作',
      flash_sale: '限時搶購'
    };
    return typeTexts[type] || type;
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <PlayIcon className="h-4 w-4" />,
      scheduled: <CalendarIcon className="h-4 w-4" />,
      paused: <PauseIcon className="h-4 w-4" />,
      completed: <CheckIcon className="h-4 w-4" />,
      draft: <PencilIcon className="h-4 w-4" />
    };
    return icons[status] || <ClockIcon className="h-4 w-4" />;
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="p-6">
        {/* 頁面標題與操作 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">檔期活動管理</h1>
            <p className="text-gray-600">創建和管理行銷檔期活動</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#cc824d] text-white px-6 py-3 rounded-lg hover:bg-[#b8753f] transition-colors flex items-center font-medium"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            建立新檔期
          </button>
        </div>

        {/* 篩選 */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="all">所有狀態</option>
              <option value="active">進行中</option>
              <option value="scheduled">已排程</option>
              <option value="paused">已暫停</option>
              <option value="completed">已完成</option>
              <option value="draft">草稿</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="all">所有類型</option>
              <option value="festival">節慶活動</option>
              <option value="seasonal">季節性</option>
              <option value="product_launch">新品發佈</option>
              <option value="clearance">清倉促銷</option>
              <option value="brand_collab">品牌合作</option>
              <option value="flash_sale">限時搶購</option>
            </select>
            <div className="flex items-center text-sm text-gray-600">
              <FunnelIcon className="h-5 w-5 mr-2" />
              共 {filteredCampaigns.length} 個檔期
            </div>
          </div>
        </div>

        {/* 檔期列表 */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1">{getStatusText(campaign.status)}</span>
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      <TagIcon className="h-4 w-4 mr-1" />
                      {getTypeText(campaign.type)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{campaign.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                      <div>
                        <p className="font-medium">檔期時間</p>
                        <p>{formatDate(campaign.schedule?.startDate)} - {formatDate(campaign.schedule?.endDate)}</p>
                        {getDaysRemaining(campaign.schedule?.endDate) !== null && (
                          <p className="text-xs text-gray-500">
                            {getDaysRemaining(campaign.schedule?.endDate) > 0 
                              ? `剩餘 ${getDaysRemaining(campaign.schedule?.endDate)} 天`
                              : '已結束'
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                      <div>
                        <p className="font-medium">預算使用</p>
                        <p>{formatCurrency(campaign.budget?.spentBudget)} / {formatCurrency(campaign.budget?.totalBudget)}</p>
                        <p className="text-xs text-gray-500">
                          {campaign.budget?.totalBudget ? 
                            `使用率 ${((campaign.budget?.spentBudget || 0) / campaign.budget.totalBudget * 100).toFixed(1)}%` 
                            : '未設定預算'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <ChartBarIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                      <div>
                        <p className="font-medium">表現指標</p>
                        <p>ROAS: {(campaign.budget?.actualROI || campaign.budget?.projectedROI || 0).toFixed(1)}x</p>
                        <p className="text-xs text-gray-500">
                          轉換率: {(campaign.performance?.conversionRate || 0).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                      <div>
                        <p className="font-medium">目標設定</p>
                        <p>{campaign.objectives?.primaryGoal === 'sales' ? '銷售導向' : 
                             campaign.objectives?.primaryGoal === 'engagement' ? '互動導向' : 
                             campaign.objectives?.primaryGoal === 'awareness' ? '認知導向' : '其他'}</p>
                        <p className="text-xs text-gray-500">
                          {campaign.objectives?.kpis?.length || 0} 個KPI指標
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {campaign.status === 'active' && (
                    <button
                      onClick={() => handleStatusChange(campaign.id, 'paused')}
                      className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                      title="暫停檔期"
                    >
                      <PauseIcon className="h-5 w-5" />
                    </button>
                  )}
                  {campaign.status === 'paused' && (
                    <button
                      onClick={() => handleStatusChange(campaign.id, 'active')}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="恢復檔期"
                    >
                      <PlayIcon className="h-5 w-5" />
                    </button>
                  )}
                  {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                    <button
                      onClick={() => handleStatusChange(campaign.id, 'active')}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="啟動檔期"
                    >
                      <PlayIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setEditingCampaign(campaign)}
                    className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors"
                    title="編輯檔期"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="刪除檔期"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到檔期活動</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? '請調整搜尋條件或篩選設定' 
                : '開始建立您的第一個檔期活動'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#cc824d] text-white px-6 py-2 rounded-lg hover:bg-[#b8753f] transition-colors"
            >
              建立新檔期
            </button>
          </div>
        )}

        {/* 建立檔期模態視窗 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">建立新檔期活動</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">檔期名稱</label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="輸入檔期活動名稱"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">檔期類型</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  >
                    <option value="seasonal">季節性</option>
                    <option value="festival">節慶活動</option>
                    <option value="product_launch">新品發佈</option>
                    <option value="clearance">清倉促銷</option>
                    <option value="brand_collab">品牌合作</option>
                    <option value="flash_sale">限時搶購</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">檔期描述</label>
                  <textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="描述檔期活動的目標和內容"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">開始日期</label>
                    <input
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">結束日期</label>
                    <input
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">預算金額</label>
                  <input
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="輸入預算金額"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">主要目標</label>
                  <select
                    value={newCampaign.objectives.primaryGoal}
                    onChange={(e) => setNewCampaign({ 
                      ...newCampaign, 
                      objectives: { ...newCampaign.objectives, primaryGoal: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  >
                    <option value="sales">銷售導向</option>
                    <option value="engagement">互動導向</option>
                    <option value="awareness">認知導向</option>
                    <option value="retention">客戶留存</option>
                  </select>
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
                  onClick={handleCreateCampaign}
                  disabled={!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate}
                  className="bg-[#cc824d] text-white px-6 py-2 rounded-lg hover:bg-[#b8753f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  建立檔期
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignManagement;