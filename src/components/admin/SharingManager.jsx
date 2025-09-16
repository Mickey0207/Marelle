import React, { useState, useEffect } from 'react';
import { couponDataManager } from './couponDataManager';

const SharingManager = () => {
  const [activeTab, setActiveTab] = useState('platforms');
  const [platforms, setPlatforms] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [viralSettings, setViralSettings] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [showPlatformForm, setShowPlatformForm] = useState(false);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [editingReward, setEditingReward] = useState(null);

  const [platformForm, setPlatformForm] = useState({
    id: '',
    name: '',
    icon: '',
    share_url_template: '',
    is_enabled: true,
    tracking_params: {},
    custom_message_template: ''
  });

  const [rewardForm, setRewardForm] = useState({
    id: '',
    name: '',
    description: '',
    reward_type: 'points', // points, coupon, discount
    reward_value: '',
    trigger_condition: 'share', // share, click, register, purchase
    min_threshold: 1,
    max_per_user: '',
    is_active: true
  });

  useEffect(() => {
    loadSharingData();
  }, []);

  const loadSharingData = () => {
    // 載入分享平台配置
    const mockPlatforms = [
      {
        id: 'facebook',
        name: 'Facebook',
        icon: '📘',
        share_url_template: 'https://www.facebook.com/sharer/sharer.php?u={url}&quote={text}',
        is_enabled: true,
        tracking_params: {
          utm_source: 'facebook',
          utm_medium: 'social',
          utm_campaign: 'coupon_share'
        },
        custom_message_template: '🎉 發現超棒優惠！{coupon_name} - {description}'
      },
      {
        id: 'line',
        name: 'LINE',
        icon: '💚',
        share_url_template: 'https://social-plugins.line.me/lineit/share?url={url}&text={text}',
        is_enabled: true,
        tracking_params: {
          utm_source: 'line',
          utm_medium: 'social',
          utm_campaign: 'coupon_share'
        },
        custom_message_template: '🛍️ {coupon_name}\n{description}\n立即使用：{url}'
      },
      {
        id: 'instagram',
        name: 'Instagram',
        icon: '📷',
        share_url_template: '',
        is_enabled: false,
        tracking_params: {
          utm_source: 'instagram',
          utm_medium: 'social',
          utm_campaign: 'coupon_share'
        },
        custom_message_template: '✨ {coupon_name} ✨\n{description}'
      }
    ];
    setPlatforms(mockPlatforms);

    // 載入獎勵機制配置
    const mockRewards = [
      {
        id: 'share_reward',
        name: '分享獲得積分',
        description: '每次分享優惠券獲得10積分',
        reward_type: 'points',
        reward_value: 10,
        trigger_condition: 'share',
        min_threshold: 1,
        max_per_user: 50,
        is_active: true
      },
      {
        id: 'viral_bonus',
        name: '病毒式傳播獎勵',
        description: '當分享鏈接產生3次點擊時獲得額外優惠券',
        reward_type: 'coupon',
        reward_value: 'VIRAL20',
        trigger_condition: 'click',
        min_threshold: 3,
        max_per_user: 5,
        is_active: true
      }
    ];
    setRewards(mockRewards);

    // 載入病毒式傳播設定
    setViralSettings({
      tracking_enabled: true,
      click_threshold: 3,
      conversion_threshold: 1,
      reward_multiplier: 1.5,
      max_levels: 3,
      attribution_window: 30 // days
    });

    // 載入分析數據
    setAnalytics({
      total_shares: 1250,
      total_clicks: 4500,
      conversion_rate: 12.5,
      viral_coefficient: 1.8,
      top_platforms: [
        { platform: 'LINE', shares: 650, clicks: 2100 },
        { platform: 'Facebook', shares: 450, clicks: 1800 },
        { platform: 'Instagram', shares: 150, clicks: 600 }
      ],
      recent_activity: [
        {
          id: 1,
          user: 'user123@email.com',
          action: 'shared',
          platform: 'LINE',
          coupon: 'SUMMER20',
          timestamp: new Date().toISOString(),
          clicks_generated: 5
        },
        {
          id: 2,
          user: 'user456@email.com',
          action: 'clicked',
          platform: 'Facebook',
          coupon: 'WELCOME10',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          clicks_generated: 0
        }
      ]
    });
  };

  const handleCreatePlatform = () => {
    setEditingPlatform(null);
    setPlatformForm({
      id: '',
      name: '',
      icon: '',
      share_url_template: '',
      is_enabled: true,
      tracking_params: {},
      custom_message_template: ''
    });
    setShowPlatformForm(true);
  };

  const handleEditPlatform = (platform) => {
    setEditingPlatform(platform);
    setPlatformForm(platform);
    setShowPlatformForm(true);
  };

  const handleSubmitPlatform = (e) => {
    e.preventDefault();
    
    if (editingPlatform) {
      setPlatforms(platforms.map(p => p.id === editingPlatform.id ? platformForm : p));
    } else {
      setPlatforms([...platforms, { ...platformForm, id: Date.now().toString() }]);
    }
    
    setShowPlatformForm(false);
  };

  const handleCreateReward = () => {
    setEditingReward(null);
    setRewardForm({
      id: '',
      name: '',
      description: '',
      reward_type: 'points',
      reward_value: '',
      trigger_condition: 'share',
      min_threshold: 1,
      max_per_user: '',
      is_active: true
    });
    setShowRewardForm(true);
  };

  const handleEditReward = (reward) => {
    setEditingReward(reward);
    setRewardForm(reward);
    setShowRewardForm(true);
  };

  const handleSubmitReward = (e) => {
    e.preventDefault();
    
    if (editingReward) {
      setRewards(rewards.map(r => r.id === editingReward.id ? rewardForm : r));
    } else {
      setRewards([...rewards, { ...rewardForm, id: Date.now().toString() }]);
    }
    
    setShowRewardForm(false);
  };

  const togglePlatform = (platformId) => {
    setPlatforms(platforms.map(p => 
      p.id === platformId ? { ...p, is_enabled: !p.is_enabled } : p
    ));
  };

  const toggleReward = (rewardId) => {
    setRewards(rewards.map(r => 
      r.id === rewardId ? { ...r, is_active: !r.is_active } : r
    ));
  };

  const TabButton = ({ tabKey, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(tabKey)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-[#cc824d] text-white'
          : 'bg-white/80 text-gray-600 hover:bg-[#cc824d]/10'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">分享管理系統</h1>
              <p className="text-gray-600">配置社群分享平台、獎勵機制和病毒式傳播追蹤</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TabButton
              tabKey="platforms"
              label="分享平台"
              isActive={activeTab === 'platforms'}
              onClick={setActiveTab}
            />
            <TabButton
              tabKey="rewards"
              label="獎勵機制"
              isActive={activeTab === 'rewards'}
              onClick={setActiveTab}
            />
            <TabButton
              tabKey="viral"
              label="病毒式傳播"
              isActive={activeTab === 'viral'}
              onClick={setActiveTab}
            />
            <TabButton
              tabKey="analytics"
              label="分析報告"
              isActive={activeTab === 'analytics'}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'platforms' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">分享平台配置</h2>
                <button
                  onClick={handleCreatePlatform}
                  className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
                >
                  新增平台
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map(platform => (
                  <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={platform.is_enabled}
                            onChange={() => togglePlatform(platform.id)}
                          />
                          <span className={`slider ${platform.is_enabled ? 'bg-[#cc824d]' : 'bg-gray-300'}`}></span>
                        </label>
                        <button
                          onClick={() => handleEditPlatform(platform)}
                          className="p-1 text-gray-400 hover:text-[#cc824d] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">分享模板:</span>
                        <p className="text-gray-700 text-xs mt-1 bg-gray-50 p-2 rounded">
                          {platform.custom_message_template}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">追蹤參數:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(platform.tracking_params).map(([key, value]) => (
                            <span key={key} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {key}={value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">獎勵機制配置</h2>
                <button
                  onClick={handleCreateReward}
                  className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
                >
                  新增獎勵
                </button>
              </div>

              <div className="space-y-4">
                {rewards.map(reward => (
                  <div key={reward.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                        <p className="text-gray-600 text-sm">{reward.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          reward.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {reward.is_active ? '啟用' : '停用'}
                        </span>
                        <button
                          onClick={() => toggleReward(reward.id)}
                          className="p-1 text-gray-400 hover:text-[#cc824d] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditReward(reward)}
                          className="p-1 text-gray-400 hover:text-[#cc824d] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">獎勵類型</span>
                        <p className="font-medium">{reward.reward_type}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">獎勵值</span>
                        <p className="font-medium">{reward.reward_value}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">觸發條件</span>
                        <p className="font-medium">{reward.trigger_condition}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">最低門檻</span>
                        <p className="font-medium">{reward.min_threshold}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'viral' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">病毒式傳播設定</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    點擊門檻
                  </label>
                  <input
                    type="number"
                    value={viralSettings.click_threshold}
                    onChange={(e) => setViralSettings({
                      ...viralSettings,
                      click_threshold: parseInt(e.target.value)
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">達到此點擊數才觸發病毒獎勵</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    轉換門檻
                  </label>
                  <input
                    type="number"
                    value={viralSettings.conversion_threshold}
                    onChange={(e) => setViralSettings({
                      ...viralSettings,
                      conversion_threshold: parseInt(e.target.value)
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">達到此轉換數才給予額外獎勵</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    獎勵倍數
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={viralSettings.reward_multiplier}
                    onChange={(e) => setViralSettings({
                      ...viralSettings,
                      reward_multiplier: parseFloat(e.target.value)
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">病毒式傳播的獎勵乘數</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大傳播層級
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={viralSettings.max_levels}
                    onChange={(e) => setViralSettings({
                      ...viralSettings,
                      max_levels: parseInt(e.target.value)
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">分享鏈可追蹤的最大層級</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    歸因窗口 (天)
                  </label>
                  <input
                    type="number"
                    value={viralSettings.attribution_window}
                    onChange={(e) => setViralSettings({
                      ...viralSettings,
                      attribution_window: parseInt(e.target.value)
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">分享歸因的有效期間</p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="tracking_enabled"
                    checked={viralSettings.tracking_enabled}
                    onChange={(e) => setViralSettings({
                      ...viralSettings,
                      tracking_enabled: e.target.checked
                    })}
                    className="mr-3 text-[#cc824d] focus:ring-[#cc824d]"
                  />
                  <label htmlFor="tracking_enabled" className="text-sm font-medium text-gray-700">
                    啟用病毒式傳播追蹤
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">病毒係數計算</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">1.8</div>
                    <div className="text-sm text-blue-600">當前病毒係數</div>
                    <div className="text-xs text-gray-500 mt-2">
                      計算方式：平均每個用戶邀請的新用戶數量
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <div className="text-2xl font-bold text-blue-600">{analytics.total_shares}</div>
                <div className="text-sm text-blue-600">總分享次數</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <div className="text-2xl font-bold text-green-600">{analytics.total_clicks}</div>
                <div className="text-sm text-green-600">總點擊次數</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <div className="text-2xl font-bold text-purple-600">{analytics.conversion_rate}%</div>
                <div className="text-sm text-purple-600">轉換率</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <div className="text-2xl font-bold text-orange-600">{analytics.viral_coefficient}</div>
                <div className="text-sm text-orange-600">病毒係數</div>
              </div>
            </div>

            {/* Platform Performance */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">平台表現</h3>
              <div className="space-y-4">
                {analytics.top_platforms?.map(platform => (
                  <div key={platform.platform} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{platform.platform}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">分享:</span>
                        <span className="ml-1 font-medium">{platform.shares}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">點擊:</span>
                        <span className="ml-1 font-medium">{platform.clicks}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">比率:</span>
                        <span className="ml-1 font-medium">
                          {((platform.clicks / platform.shares) || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">近期活動</h3>
              <div className="space-y-3">
                {analytics.recent_activity?.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-500 mx-2">{activity.action}</span>
                      <span className="text-[#cc824d]">{activity.coupon}</span>
                      <span className="text-gray-500 mx-2">on</span>
                      <span className="font-medium">{activity.platform}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('zh-TW')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Platform Form Modal */}
        {showPlatformForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmitPlatform} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingPlatform ? '編輯分享平台' : '新增分享平台'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowPlatformForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        平台名稱 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={platformForm.name}
                        onChange={(e) => setPlatformForm({...platformForm, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        圖標 (Emoji)
                      </label>
                      <input
                        type="text"
                        value={platformForm.icon}
                        onChange={(e) => setPlatformForm({...platformForm, icon: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        placeholder="📘"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      分享 URL 模板
                    </label>
                    <input
                      type="text"
                      value={platformForm.share_url_template}
                      onChange={(e) => setPlatformForm({...platformForm, share_url_template: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="https://example.com/share?url={url}&text={text}"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      自定義訊息模板
                    </label>
                    <textarea
                      value={platformForm.custom_message_template}
                      onChange={(e) => setPlatformForm({...platformForm, custom_message_template: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      rows={3}
                      placeholder="🎉 {coupon_name} - {description}"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="platform_enabled"
                      checked={platformForm.is_enabled}
                      onChange={(e) => setPlatformForm({...platformForm, is_enabled: e.target.checked})}
                      className="mr-3 text-[#cc824d] focus:ring-[#cc824d]"
                    />
                    <label htmlFor="platform_enabled" className="text-sm font-medium text-gray-700">
                      啟用此平台
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowPlatformForm(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
                  >
                    {editingPlatform ? '更新平台' : '創建平台'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reward Form Modal */}
        {showRewardForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmitReward} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingReward ? '編輯獎勵機制' : '新增獎勵機制'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowRewardForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      獎勵名稱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={rewardForm.name}
                      onChange={(e) => setRewardForm({...rewardForm, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      獎勵描述
                    </label>
                    <textarea
                      value={rewardForm.description}
                      onChange={(e) => setRewardForm({...rewardForm, description: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        獎勵類型
                      </label>
                      <select
                        value={rewardForm.reward_type}
                        onChange={(e) => setRewardForm({...rewardForm, reward_type: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      >
                        <option value="points">積分</option>
                        <option value="coupon">優惠券</option>
                        <option value="discount">折扣</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        獎勵值
                      </label>
                      <input
                        type="text"
                        value={rewardForm.reward_value}
                        onChange={(e) => setRewardForm({...rewardForm, reward_value: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        placeholder="10 或 COUPON20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        觸發條件
                      </label>
                      <select
                        value={rewardForm.trigger_condition}
                        onChange={(e) => setRewardForm({...rewardForm, trigger_condition: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      >
                        <option value="share">分享</option>
                        <option value="click">點擊</option>
                        <option value="register">註冊</option>
                        <option value="purchase">購買</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最低門檻
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={rewardForm.min_threshold}
                        onChange={(e) => setRewardForm({...rewardForm, min_threshold: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      每人最大獲得次數
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={rewardForm.max_per_user}
                      onChange={(e) => setRewardForm({...rewardForm, max_per_user: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="留空表示無限制"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="reward_active"
                      checked={rewardForm.is_active}
                      onChange={(e) => setRewardForm({...rewardForm, is_active: e.target.checked})}
                      className="mr-3 text-[#cc824d] focus:ring-[#cc824d]"
                    />
                    <label htmlFor="reward_active" className="text-sm font-medium text-gray-700">
                      啟用此獎勵
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowRewardForm(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
                  >
                    {editingReward ? '更新獎勵' : '創建獎勵'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 20px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider:before {
          transform: translateX(20px);
        }
      `}</style>
    </div>
  );
};

export default SharingManager;