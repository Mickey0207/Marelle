import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  GiftIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../lib/ui/adminStyles";

const MemberGiftBenefits = () => {
  const [memberTiers, setMemberTiers] = useState([]);
  const [giftPolicies, setGiftPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadMemberTiers();
    loadGiftPolicies();

    gsap.fromTo(
      '.tier-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const loadMemberTiers = async () => {
    setLoading(true);
    try {
      // 模擬載入會員等級數據
      const mockTiers = [
        {
          id: 'tier-1',
          name: '一般會員',
          level: 1,
          requirements: {
            minPurchaseAmount: 0,
            minPurchaseCount: 0,
            membershipDays: 0
          },
          benefits: {
            pointsMultiplier: 1.0,
            birthdayGift: true,
            freeShipping: false,
            exclusiveEvents: false,
            personalShopper: false
          },
          giftAllocation: {
            quarterlyGifts: 0,
            birthdayGiftValue: 50,
            welcomeGift: true,
            anniversaryGift: false
          },
          memberCount: 2486,
          status: 'active'
        },
        {
          id: 'tier-2',
          name: '銀級會員',
          level: 2,
          requirements: {
            minPurchaseAmount: 5000,
            minPurchaseCount: 3,
            membershipDays: 30
          },
          benefits: {
            pointsMultiplier: 1.2,
            birthdayGift: true,
            freeShipping: true,
            exclusiveEvents: false,
            personalShopper: false
          },
          giftAllocation: {
            quarterlyGifts: 1,
            birthdayGiftValue: 100,
            welcomeGift: true,
            anniversaryGift: true
          },
          memberCount: 1245,
          status: 'active'
        },
        {
          id: 'tier-3',
          name: '金級會員',
          level: 3,
          requirements: {
            minPurchaseAmount: 15000,
            minPurchaseCount: 8,
            membershipDays: 90
          },
          benefits: {
            pointsMultiplier: 1.5,
            birthdayGift: true,
            freeShipping: true,
            exclusiveEvents: true,
            personalShopper: false
          },
          giftAllocation: {
            quarterlyGifts: 2,
            birthdayGiftValue: 200,
            welcomeGift: true,
            anniversaryGift: true
          },
          memberCount: 567,
          status: 'active'
        },
        {
          id: 'tier-4',
          name: '白金會員',
          level: 4,
          requirements: {
            minPurchaseAmount: 50000,
            minPurchaseCount: 20,
            membershipDays: 365
          },
          benefits: {
            pointsMultiplier: 2.0,
            birthdayGift: true,
            freeShipping: true,
            exclusiveEvents: true,
            personalShopper: true
          },
          giftAllocation: {
            quarterlyGifts: 4,
            birthdayGiftValue: 500,
            welcomeGift: true,
            anniversaryGift: true
          },
          memberCount: 123,
          status: 'active'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      setMemberTiers(mockTiers);
    } catch (error) {
      console.error('Error loading member tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGiftPolicies = async () => {
    try {
      // 模擬載入禮品政策
      const mockPolicies = [
        {
          id: 'policy-1',
          name: '生日禮品政策',
          description: '會員生日當月可領取的禮品',
          applicableTiers: ['tier-1', 'tier-2', 'tier-3', 'tier-4'],
          active: true
        },
        {
          id: 'policy-2',
          name: '季度禮品政策',
          description: '高級會員季度自動發送的禮品',
          applicableTiers: ['tier-2', 'tier-3', 'tier-4'],
          active: true
        }
      ];
      setGiftPolicies(mockPolicies);
    } catch (error) {
      console.error('Error loading gift policies:', error);
    }
  };

  const getTierColor = (level) => {
    const colors = {
      1: 'from-gray-400 to-gray-600',
      2: 'from-gray-300 to-gray-500',
      3: 'from-yellow-400 to-yellow-600',
      4: 'from-purple-400 to-purple-600'
    };
    return colors[level] || 'from-gray-400 to-gray-600';
  };

  const getTierIcon = (level) => {
    const icons = {
      1: UserGroupIcon,
      2: UserGroupIcon,
      3: StarIcon,
      4: GiftIcon
    };
    const IconComponent = icons[level] || UserGroupIcon;
    return <IconComponent className="w-8 h-8 text-white" />;
  };

  const handleEditTier = (tier) => {
    setSelectedTier(tier);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入會員福利數據中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">會員禮品福利</h1>
        <p className="text-gray-600 mt-2">管理不同會員等級的禮品分配與福利政策</p>
      </div>

      {/* 統計概覽 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {memberTiers.map((tier) => (
          <div key={tier.id} className="tier-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${getTierColor(tier.level)} rounded-lg flex items-center justify-center`}>
                {getTierIcon(tier.level)}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {tier.status === 'active' ? '啟用中' : '停用'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">{tier.name}</h3>
            <p className="text-2xl font-bold text-[#cc824d] mt-1">{tier.memberCount}</p>
            <p className="text-sm text-gray-500">位會員</p>
          </div>
        ))}
      </div>

      {/* 會員等級詳情 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 font-chinese">會員等級與福利</h2>
          <button className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            新增等級
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {memberTiers.map((tier) => (
            <div key={tier.id} className="tier-card bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:shadow-lg transition-all duration-200">
              {/* 等級標題 */}
              <div className={`p-6 bg-gradient-to-r ${getTierColor(tier.level)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      {getTierIcon(tier.level)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white font-chinese">{tier.name}</h3>
                      <p className="text-white/80">等級 {tier.level}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditTier(tier)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* 升級條件 */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 font-chinese">升級條件</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">最低消費金額：</span>
                      <span className="font-medium">{tier.requirements.minPurchaseAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">購買次數：</span>
                      <span className="font-medium">{tier.requirements.minPurchaseCount} 次</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">會員天數：</span>
                      <span className="font-medium">{tier.requirements.membershipDays} 天</span>
                    </div>
                  </div>
                </div>

                {/* 會員福利 */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 font-chinese">會員福利</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">積分倍數：</span>
                      <span className="text-sm font-medium">{tier.benefits.pointsMultiplier}x</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">生日禮品：</span>
                      {tier.benefits.birthdayGift ? 
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> : 
                        <XCircleIcon className="w-4 h-4 text-red-500" />
                      }
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">免運費：</span>
                      {tier.benefits.freeShipping ? 
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> : 
                        <XCircleIcon className="w-4 h-4 text-red-500" />
                      }
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">專屬活動：</span>
                      {tier.benefits.exclusiveEvents ? 
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> : 
                        <XCircleIcon className="w-4 h-4 text-red-500" />
                      }
                    </div>
                  </div>
                </div>

                {/* 禮品分配 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-chinese">禮品分配</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">季度禮品：</span>
                      <span className="font-medium">{tier.giftAllocation.quarterlyGifts} 個/季</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">生日禮品價值：</span>
                      <span className="font-medium">{tier.giftAllocation.birthdayGiftValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">入會禮品：</span>
                      {tier.giftAllocation.welcomeGift ? 
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> : 
                        <XCircleIcon className="w-4 h-4 text-red-500" />
                      }
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">週年禮品：</span>
                      {tier.giftAllocation.anniversaryGift ? 
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> : 
                        <XCircleIcon className="w-4 h-4 text-red-500" />
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 禮品政策 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">禮品政策</h2>
        <div className={ADMIN_STYLES.glassCard}>
          <div className="p-6">
            <div className="space-y-4">
              {giftPolicies.map((policy) => (
                <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 font-chinese">{policy.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">適用等級：</span>
                        {policy.applicableTiers.map((tierId) => {
                          const tier = memberTiers.find(t => t.id === tierId);
                          return tier ? (
                            <span key={tierId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tier.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        policy.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {policy.active ? '啟用中' : '停用'}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 編輯模態框 */}
      {showEditModal && selectedTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-chinese">
              編輯 {selectedTier.name}
            </h3>
            
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">基本信息</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">等級名稱</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedTier.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">等級</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedTier.level}
                    />
                  </div>
                </div>
              </div>

              {/* 升級條件 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">升級條件</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最低消費金額</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedTier.requirements.minPurchaseAmount}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">購買次數</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedTier.requirements.minPurchaseCount}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">會員天數</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedTier.requirements.membershipDays}
                    />
                  </div>
                </div>
              </div>

              {/* 禮品分配 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">禮品分配</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">季度禮品數量</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedTier.giftAllocation.quarterlyGifts}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">生日禮品價值</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      defaultValue={selectedTier.giftAllocation.birthdayGiftValue}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                      defaultChecked={selectedTier.giftAllocation.welcomeGift}
                    />
                    <span className="ml-2 text-sm">入會禮品</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                      defaultChecked={selectedTier.giftAllocation.anniversaryGift}
                    />
                    <span className="ml-2 text-sm">週年禮品</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTier(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button className="flex-1 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors">
                儲存變更
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberGiftBenefits;
