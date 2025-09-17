import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  ShieldCheckIcon,
  GiftIcon,
  TrophyIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { giftDataManager } from '../data/giftDataManager';
import GlassModal from '../../components/GlassModal';
import CustomSelect from '../components/CustomSelect';

const MemberGiftBenefits = () => {
  const [memberTiers, setMemberTiers] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'

  // 表單資料
  const [formData, setFormData] = useState({
    name: '',
    level: 1,
    requirements: {
      minPurchaseAmount: 0,
      minPurchaseCount: 0,
      minMemberDays: 0
    },
    benefits: {
      exclusiveGifts: [],
      priorityAccess: false,
      extraSelections: 0,
      birthMonthGift: null,
      anniversaryGift: null
    },
    restrictions: {
      maxGiftsPerMonth: 0,
      maxGiftsPerYear: 0,
      blacklistedCategories: []
    },
    status: 'active'
  });

  const memberLevelColors = {
    1: 'from-gray-400 to-gray-500',
    2: 'from-orange-400 to-orange-500',
    3: 'from-yellow-400 to-yellow-500',
    4: 'from-purple-400 to-purple-500',
    5: 'from-pink-400 to-pink-500'
  };

  const memberLevelIcons = {
    1: UserGroupIcon,
    2: StarIcon,
    3: ShieldCheckIcon,
    4: TrophyIcon,
    5: SparklesIcon
  };

  useEffect(() => {
    loadMemberTiers();
    loadGifts();
  }, []);

  const loadMemberTiers = () => {
    // 模擬載入會員等級資料
    const tiers = [
      {
        id: 'tier-1',
        name: '一般會員',
        level: 1,
        requirements: {
          minPurchaseAmount: 0,
          minPurchaseCount: 0,
          minMemberDays: 0
        },
        benefits: {
          exclusiveGifts: [],
          priorityAccess: false,
          extraSelections: 0,
          birthMonthGift: null,
          anniversaryGift: null
        },
        restrictions: {
          maxGiftsPerMonth: 1,
          maxGiftsPerYear: 12,
          blacklistedCategories: ['limited', 'exclusive']
        },
        status: 'active',
        memberCount: 1250
      },
      {
        id: 'tier-2',
        name: '銀卡會員',
        level: 2,
        requirements: {
          minPurchaseAmount: 5000,
          minPurchaseCount: 5,
          minMemberDays: 30
        },
        benefits: {
          exclusiveGifts: ['gift-1', 'gift-2'],
          priorityAccess: false,
          extraSelections: 1,
          birthMonthGift: 'gift-sample-1',
          anniversaryGift: null
        },
        restrictions: {
          maxGiftsPerMonth: 2,
          maxGiftsPerYear: 24,
          blacklistedCategories: ['exclusive']
        },
        status: 'active',
        memberCount: 850
      },
      {
        id: 'tier-3',
        name: '金卡會員',
        level: 3,
        requirements: {
          minPurchaseAmount: 15000,
          minPurchaseCount: 15,
          minMemberDays: 90
        },
        benefits: {
          exclusiveGifts: ['gift-1', 'gift-2', 'gift-3', 'gift-4'],
          priorityAccess: true,
          extraSelections: 2,
          birthMonthGift: 'gift-beauty-1',
          anniversaryGift: 'gift-skincare-1'
        },
        restrictions: {
          maxGiftsPerMonth: 3,
          maxGiftsPerYear: 36,
          blacklistedCategories: []
        },
        status: 'active',
        memberCount: 320
      },
      {
        id: 'tier-4',
        name: '鑽石會員',
        level: 4,
        requirements: {
          minPurchaseAmount: 50000,
          minPurchaseCount: 30,
          minMemberDays: 180
        },
        benefits: {
          exclusiveGifts: ['gift-1', 'gift-2', 'gift-3', 'gift-4', 'gift-5', 'gift-6'],
          priorityAccess: true,
          extraSelections: 3,
          birthMonthGift: 'gift-beauty-2',
          anniversaryGift: 'gift-skincare-2'
        },
        restrictions: {
          maxGiftsPerMonth: 5,
          maxGiftsPerYear: 60,
          blacklistedCategories: []
        },
        status: 'active',
        memberCount: 85
      },
      {
        id: 'tier-5',
        name: 'VIP會員',
        level: 5,
        requirements: {
          minPurchaseAmount: 100000,
          minPurchaseCount: 50,
          minMemberDays: 365
        },
        benefits: {
          exclusiveGifts: ['gift-1', 'gift-2', 'gift-3', 'gift-4', 'gift-5', 'gift-6', 'gift-7', 'gift-8'],
          priorityAccess: true,
          extraSelections: 5,
          birthMonthGift: 'gift-exclusive-1',
          anniversaryGift: 'gift-exclusive-2'
        },
        restrictions: {
          maxGiftsPerMonth: 0, // 無限制
          maxGiftsPerYear: 0, // 無限制
          blacklistedCategories: []
        },
        status: 'active',
        memberCount: 25
      }
    ];
    setMemberTiers(tiers);
  };

  const loadGifts = () => {
    const allGifts = giftDataManager.getAllGifts();
    setGifts(allGifts);
  };

  const handleCreateTier = () => {
    setModalMode('create');
    setFormData({
      name: '',
      level: Math.max(...memberTiers.map(t => t.level), 0) + 1,
      requirements: {
        minPurchaseAmount: 0,
        minPurchaseCount: 0,
        minMemberDays: 0
      },
      benefits: {
        exclusiveGifts: [],
        priorityAccess: false,
        extraSelections: 0,
        birthMonthGift: null,
        anniversaryGift: null
      },
      restrictions: {
        maxGiftsPerMonth: 1,
        maxGiftsPerYear: 12,
        blacklistedCategories: []
      },
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEditTier = (tier) => {
    setModalMode('edit');
    setSelectedTier(tier);
    setFormData({
      name: tier.name,
      level: tier.level,
      requirements: { ...tier.requirements },
      benefits: { ...tier.benefits },
      restrictions: { ...tier.restrictions },
      status: tier.status
    });
    setIsModalOpen(true);
  };

  const handleViewTier = (tier) => {
    setModalMode('view');
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const handleDeleteTier = (tier) => {
    if (window.confirm(`確定要刪除會員等級「${tier.name}」嗎？`)) {
      const updatedTiers = memberTiers.filter(t => t.id !== tier.id);
      setMemberTiers(updatedTiers);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      const newTier = {
        id: `tier-${Date.now()}`,
        ...formData,
        memberCount: 0
      };
      setMemberTiers(prev => [...prev, newTier]);
    } else if (modalMode === 'edit') {
      setMemberTiers(prev => prev.map(tier => 
        tier.id === selectedTier.id 
          ? { ...tier, ...formData }
          : tier
      ));
    }

    setIsModalOpen(false);
  };

  const addExclusiveGift = (giftId) => {
    if (!formData.benefits.exclusiveGifts.includes(giftId)) {
      setFormData(prev => ({
        ...prev,
        benefits: {
          ...prev.benefits,
          exclusiveGifts: [...prev.benefits.exclusiveGifts, giftId]
        }
      }));
    }
  };

  const removeExclusiveGift = (giftId) => {
    setFormData(prev => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        exclusiveGifts: prev.benefits.exclusiveGifts.filter(id => id !== giftId)
      }
    }));
  };

  const getGiftName = (giftId) => {
    const gift = gifts.find(g => g.id === giftId);
    return gift ? gift.name : '未知贈品';
  };

  const getLevelIcon = (level) => {
    const IconComponent = memberLevelIcons[level] || UserGroupIcon;
    return IconComponent;
  };

  const getLevelColor = (level) => {
    return memberLevelColors[level] || 'from-gray-400 to-gray-500';
  };

  const availableGiftOptions = gifts.filter(gift => gift.status === 'active').map(gift => ({
    value: gift.id,
    label: gift.name
  }));

  const giftCategoryOptions = [
    { value: 'beauty', label: '美妝' },
    { value: 'skincare', label: '護膚' },
    { value: 'fragrance', label: '香氛' },
    { value: 'makeup', label: '彩妝' },
    { value: 'tools', label: '工具' },
    { value: 'samples', label: '小樣' },
    { value: 'limited', label: '限量' },
    { value: 'exclusive', label: '專屬' }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div>
        {/* 操作按鈕 */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleCreateTier}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-chinese"
          >
            <PlusIcon className="w-5 h-5" />
            <span>新增等級</span>
          </button>
        </div>

        {/* 會員等級卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberTiers.sort((a, b) => a.level - b.level).map((tier) => {
            const IconComponent = getLevelIcon(tier.level);
            const colorClass = getLevelColor(tier.level);
            
            return (
              <div key={tier.id} className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className={`h-2 bg-gradient-to-r ${colorClass}`}></div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-gradient-to-r ${colorClass} rounded-lg`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-chinese text-gray-900">{tier.name}</h3>
                        <span className="text-sm text-gray-600 font-chinese">等級 {tier.level}</span>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tier.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tier.status === 'active' ? '啟用中' : '停用'}
                    </span>
                  </div>

                  {/* 會員數量 */}
                  <div className="mb-4 p-3 bg-white/40 rounded-lg border border-white/30">
                    <div className="text-sm text-gray-600 font-chinese">目前會員數</div>
                    <div className="text-2xl font-bold text-gray-900">{tier.memberCount.toLocaleString()}</div>
                  </div>

                  {/* 加入條件 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 font-chinese mb-2">加入條件</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      {tier.requirements.minPurchaseAmount > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>消費滿 NT$ {tier.requirements.minPurchaseAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {tier.requirements.minPurchaseCount > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>購買滿 {tier.requirements.minPurchaseCount} 次</span>
                        </div>
                      )}
                      {tier.requirements.minMemberDays > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>會員資歷 {tier.requirements.minMemberDays} 天</span>
                        </div>
                      )}
                      {tier.requirements.minPurchaseAmount === 0 && 
                       tier.requirements.minPurchaseCount === 0 && 
                       tier.requirements.minMemberDays === 0 && (
                        <span className="text-green-600 font-chinese">無條件加入</span>
                      )}
                    </div>
                  </div>

                  {/* 專屬福利 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 font-chinese mb-2">專屬福利</h4>
                    <div className="space-y-1">
                      {tier.benefits.exclusiveGifts.length > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-blue-600">
                          <GiftIcon className="w-3 h-3" />
                          <span className="font-chinese">專屬贈品 {tier.benefits.exclusiveGifts.length} 款</span>
                        </div>
                      )}
                      {tier.benefits.priorityAccess && (
                        <div className="flex items-center space-x-1 text-xs text-purple-600">
                          <StarIcon className="w-3 h-3" />
                          <span className="font-chinese">優先選擇權</span>
                        </div>
                      )}
                      {tier.benefits.extraSelections > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-green-600">
                          <CheckCircleIcon className="w-3 h-3" />
                          <span className="font-chinese">額外選擇 +{tier.benefits.extraSelections}</span>
                        </div>
                      )}
                      {tier.benefits.birthMonthGift && (
                        <div className="flex items-center space-x-1 text-xs text-pink-600">
                          <GiftIcon className="w-3 h-3" />
                          <span className="font-chinese">生日專屬贈品</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 限制條件 */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 font-chinese mb-2">使用限制</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      {tier.restrictions.maxGiftsPerMonth > 0 ? (
                        <div>每月最多 {tier.restrictions.maxGiftsPerMonth} 份贈品</div>
                      ) : (
                        <div className="text-green-600 font-chinese">每月無限制</div>
                      )}
                      {tier.restrictions.maxGiftsPerYear > 0 ? (
                        <div>每年最多 {tier.restrictions.maxGiftsPerYear} 份贈品</div>
                      ) : (
                        <div className="text-green-600 font-chinese">每年無限制</div>
                      )}
                    </div>
                  </div>

                  {/* 操作按鈕 */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewTier(tier)}
                      className="flex-1 px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm font-chinese"
                    >
                      詳情
                    </button>
                    <button
                      onClick={() => handleEditTier(tier)}
                      className="flex-1 px-3 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-sm font-chinese"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDeleteTier(tier)}
                      className="px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {memberTiers.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 font-chinese">沒有會員等級</h3>
              <p className="mt-1 text-sm text-gray-500 font-chinese">開始創建您的第一個會員等級</p>
            </div>
          )}
        </div>
      </div>

      {/* 會員等級詳情/編輯模態框 */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'view' ? '會員等級詳情' : modalMode === 'create' ? '新增會員等級' : '編輯會員等級'}
        size="max-w-4xl"
      >
        {modalMode === 'view' ? (
          <div className="p-6 space-y-6">
            {selectedTier && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold font-chinese mb-4">基本資訊</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">等級名稱</label>
                        <p className="text-gray-900 font-chinese">{selectedTier.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">等級</label>
                        <p className="text-gray-900">{selectedTier.level}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">目前會員數</label>
                        <p className="text-gray-900">{selectedTier.memberCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">狀態</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedTier.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedTier.status === 'active' ? '啟用中' : '停用'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-chinese mb-4">加入條件</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">最低消費金額</label>
                        <p className="text-gray-900">NT$ {selectedTier.requirements.minPurchaseAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">最低購買次數</label>
                        <p className="text-gray-900">{selectedTier.requirements.minPurchaseCount} 次</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">最低會員天數</label>
                        <p className="text-gray-900">{selectedTier.requirements.minMemberDays} 天</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-chinese mb-4">專屬福利</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-chinese">優先選擇權</label>
                          <p className="text-gray-900">{selectedTier.benefits.priorityAccess ? '是' : '否'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-chinese">額外選擇數</label>
                          <p className="text-gray-900">+{selectedTier.benefits.extraSelections} 個</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-chinese">生日贈品</label>
                          <p className="text-gray-900 font-chinese">
                            {selectedTier.benefits.birthMonthGift ? getGiftName(selectedTier.benefits.birthMonthGift) : '無'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-chinese">週年贈品</label>
                          <p className="text-gray-900 font-chinese">
                            {selectedTier.benefits.anniversaryGift ? getGiftName(selectedTier.benefits.anniversaryGift) : '無'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-2">專屬贈品</label>
                      <div className="space-y-1">
                        {selectedTier.benefits.exclusiveGifts.map((giftId, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <GiftIcon className="w-4 h-4 text-[#cc824d]" />
                            <span className="font-chinese">{getGiftName(giftId)}</span>
                          </div>
                        ))}
                        {selectedTier.benefits.exclusiveGifts.length === 0 && (
                          <p className="text-gray-500 text-sm font-chinese">無專屬贈品</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-chinese mb-4">使用限制</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">每月最大贈品數</label>
                        <p className="text-gray-900">
                          {selectedTier.restrictions.maxGiftsPerMonth > 0 
                            ? `${selectedTier.restrictions.maxGiftsPerMonth} 份` 
                            : '無限制'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">每年最大贈品數</label>
                        <p className="text-gray-900">
                          {selectedTier.restrictions.maxGiftsPerYear > 0 
                            ? `${selectedTier.restrictions.maxGiftsPerYear} 份` 
                            : '無限制'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-2">限制分類</label>
                      <div className="space-y-1">
                        {selectedTier.restrictions.blacklistedCategories.map((category, index) => (
                          <div key={index} className="text-sm text-red-600 font-chinese">
                            • {giftCategoryOptions.find(opt => opt.value === category)?.label || category}
                          </div>
                        ))}
                        {selectedTier.restrictions.blacklistedCategories.length === 0 && (
                          <p className="text-gray-500 text-sm font-chinese">無分類限制</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 基本資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  等級名稱 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  placeholder="請輸入等級名稱"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  等級 *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* 加入條件 */}
            <div>
              <h3 className="text-lg font-bold font-chinese mb-4">加入條件</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    最低消費金額 (NT$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.requirements.minPurchaseAmount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        minPurchaseAmount: parseInt(e.target.value) || 0
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    最低購買次數
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.requirements.minPurchaseCount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        minPurchaseCount: parseInt(e.target.value) || 0
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    最低會員天數
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.requirements.minMemberDays}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        minMemberDays: parseInt(e.target.value) || 0
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            {/* 專屬福利 */}
            <div>
              <h3 className="text-lg font-bold font-chinese mb-4">專屬福利</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.benefits.priorityAccess}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          benefits: {
                            ...prev.benefits,
                            priorityAccess: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                      />
                      <span className="text-sm font-medium text-gray-700 font-chinese">優先選擇權</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                      額外選擇數
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.benefits.extraSelections}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        benefits: {
                          ...prev.benefits,
                          extraSelections: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                      生日贈品
                    </label>
                    <CustomSelect
                      value={formData.benefits.birthMonthGift || ''}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        benefits: {
                          ...prev.benefits,
                          birthMonthGift: value || null
                        }
                      }))}
                      options={[
                        { value: '', label: '無生日贈品' },
                        ...availableGiftOptions
                      ]}
                      placeholder="選擇生日贈品"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                      週年贈品
                    </label>
                    <CustomSelect
                      value={formData.benefits.anniversaryGift || ''}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        benefits: {
                          ...prev.benefits,
                          anniversaryGift: value || null
                        }
                      }))}
                      options={[
                        { value: '', label: '無週年贈品' },
                        ...availableGiftOptions
                      ]}
                      placeholder="選擇週年贈品"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 font-chinese">
                      專屬贈品
                    </label>
                    <CustomSelect
                      value=""
                      onChange={(value) => addExclusiveGift(value)}
                      options={[
                        { value: '', label: '選擇贈品...' },
                        ...availableGiftOptions.filter(opt => !formData.benefits.exclusiveGifts.includes(opt.value))
                      ]}
                      placeholder="新增專屬贈品"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    {formData.benefits.exclusiveGifts.map((giftId, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/60 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <GiftIcon className="w-4 h-4 text-[#cc824d]" />
                          <span className="font-chinese">{getGiftName(giftId)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExclusiveGift(giftId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {formData.benefits.exclusiveGifts.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm font-chinese">
                        尚未設定專屬贈品
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 使用限制 */}
            <div>
              <h3 className="text-lg font-bold font-chinese mb-4">使用限制</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    每月最大贈品數 (0 = 無限制)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.restrictions.maxGiftsPerMonth}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      restrictions: {
                        ...prev.restrictions,
                        maxGiftsPerMonth: parseInt(e.target.value) || 0
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    每年最大贈品數 (0 = 無限制)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.restrictions.maxGiftsPerYear}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      restrictions: {
                        ...prev.restrictions,
                        maxGiftsPerYear: parseInt(e.target.value) || 0
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-white/30">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 border border-white/30 text-gray-700 rounded-xl hover:bg-white/20 transition-colors font-chinese bg-white/50 backdrop-blur-sm"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#cc824d]/90 text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese backdrop-blur-sm"
              >
                {modalMode === 'create' ? '創建等級' : '更新等級'}
              </button>
            </div>
          </form>
        )}
      </GlassModal>
    </div>
  );
};

export default MemberGiftBenefits;