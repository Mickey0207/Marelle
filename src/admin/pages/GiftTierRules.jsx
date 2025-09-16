import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  GiftIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { giftDataManager, GiftSelectionType, TierConditionType } from '../data/giftDataManager';
import GlassModal from '../../components/GlassModal';
import CustomSelect from '../components/CustomSelect';

const GiftTierRules = () => {
  const [tierRules, setTierRules] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [expandedRule, setExpandedRule] = useState(null);

  // 表單資料
  const [formData, setFormData] = useState({
    name: '',
    campaignId: '',
    targetProduct: {
      type: 'category',
      categoryIds: [],
      productIds: [],
      brandIds: []
    },
    tiers: [
      {
        level: 1,
        condition: {
          type: TierConditionType.QUANTITY,
          value: 1,
          operator: '>='
        },
        giftOptions: [],
        selectionType: GiftSelectionType.FIXED_COMBO,
        maxSelections: 1
      }
    ],
    memberRestrictions: [],
    dateRange: {
      start: '',
      end: ''
    },
    status: 'active'
  });

  useEffect(() => {
    loadTierRules();
    loadGifts();
  }, []);

  const loadTierRules = () => {
    const rules = giftDataManager.getAllTierRules();
    setTierRules(rules);
  };

  const loadGifts = () => {
    const allGifts = giftDataManager.getAllGifts();
    setGifts(allGifts);
  };

  const handleCreateRule = () => {
    setModalMode('create');
    setFormData({
      name: '',
      campaignId: '',
      targetProduct: {
        type: 'category',
        categoryIds: [],
        productIds: [],
        brandIds: []
      },
      tiers: [
        {
          level: 1,
          condition: {
            type: TierConditionType.QUANTITY,
            value: 1,
            operator: '>='
          },
          giftOptions: [],
          selectionType: GiftSelectionType.FIXED_COMBO,
          maxSelections: 1
        }
      ],
      memberRestrictions: [],
      dateRange: {
        start: '',
        end: ''
      },
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEditRule = (rule) => {
    setModalMode('edit');
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      campaignId: rule.campaignId || '',
      targetProduct: rule.targetProduct,
      tiers: rule.tiers,
      memberRestrictions: rule.memberRestrictions || [],
      dateRange: {
        start: rule.dateRange?.start ? new Date(rule.dateRange.start).toISOString().split('T')[0] : '',
        end: rule.dateRange?.end ? new Date(rule.dateRange.end).toISOString().split('T')[0] : ''
      },
      status: rule.status
    });
    setIsModalOpen(true);
  };

  const handleViewRule = (rule) => {
    setModalMode('view');
    setSelectedRule(rule);
    setIsModalOpen(true);
  };

  const handleDeleteRule = (rule) => {
    if (window.confirm(`確定要刪除規則「${rule.name}」嗎？`)) {
      // 這裡應該調用 giftDataManager 的刪除方法
      // 暫時使用過濾的方式
      const updatedRules = tierRules.filter(r => r.id !== rule.id);
      setTierRules(updatedRules);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const ruleData = {
      ...formData,
      dateRange: {
        start: formData.dateRange.start ? new Date(formData.dateRange.start) : null,
        end: formData.dateRange.end ? new Date(formData.dateRange.end) : null
      }
    };

    if (modalMode === 'create') {
      const newRule = giftDataManager.createTierRule(ruleData);
      setTierRules(prev => [...prev, newRule]);
    } else if (modalMode === 'edit') {
      const updatedRule = giftDataManager.updateTierRule(selectedRule.id, ruleData);
      setTierRules(prev => prev.map(rule => rule.id === selectedRule.id ? updatedRule : rule));
    }

    setIsModalOpen(false);
  };

  const addTier = () => {
    const newLevel = formData.tiers.length + 1;
    const newTier = {
      level: newLevel,
      condition: {
        type: TierConditionType.QUANTITY,
        value: newLevel,
        operator: '>='
      },
      giftOptions: [],
      selectionType: GiftSelectionType.SINGLE,
      maxSelections: 1
    };
    setFormData(prev => ({
      ...prev,
      tiers: [...prev.tiers, newTier]
    }));
  };

  const removeTier = (index) => {
    if (formData.tiers.length > 1) {
      const newTiers = formData.tiers.filter((_, i) => i !== index);
      // 重新編號
      const reorderedTiers = newTiers.map((tier, i) => ({
        ...tier,
        level: i + 1
      }));
      setFormData(prev => ({
        ...prev,
        tiers: reorderedTiers
      }));
    }
  };

  const updateTier = (index, updates) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers.map((tier, i) => i === index ? { ...tier, ...updates } : tier)
    }));
  };

  const addGiftToTier = (tierIndex, giftId) => {
    const newGiftOption = {
      giftId,
      quantity: 1,
      priority: formData.tiers[tierIndex].giftOptions.length + 1
    };
    
    updateTier(tierIndex, {
      giftOptions: [...formData.tiers[tierIndex].giftOptions, newGiftOption]
    });
  };

  const removeGiftFromTier = (tierIndex, giftOptionIndex) => {
    const newGiftOptions = formData.tiers[tierIndex].giftOptions.filter((_, i) => i !== giftOptionIndex);
    updateTier(tierIndex, { giftOptions: newGiftOptions });
  };

  const getGiftName = (giftId) => {
    const gift = gifts.find(g => g.id === giftId);
    return gift ? gift.name : '未知贈品';
  };

  const getConditionText = (condition) => {
    const typeText = condition.type === TierConditionType.QUANTITY ? '數量' : '金額';
    const operatorText = condition.operator === '>=' ? '大於等於' : condition.operator === '>' ? '大於' : '等於';
    const unit = condition.type === TierConditionType.QUANTITY ? '件' : 'NT$';
    return `${typeText} ${operatorText} ${condition.value} ${unit}`;
  };

  const getSelectionTypeText = (type) => {
    switch (type) {
      case GiftSelectionType.SINGLE:
        return '單選';
      case GiftSelectionType.MULTIPLE:
        return '多選';
      case GiftSelectionType.FIXED_COMBO:
        return '固定組合';
      case GiftSelectionType.WEIGHTED:
        return '權重選擇';
      default:
        return type;
    }
  };

  const selectionTypeOptions = [
    { value: GiftSelectionType.SINGLE, label: '單選' },
    { value: GiftSelectionType.MULTIPLE, label: '多選' },
    { value: GiftSelectionType.FIXED_COMBO, label: '固定組合' },
    { value: GiftSelectionType.WEIGHTED, label: '權重選擇' }
  ];

  const conditionTypeOptions = [
    { value: TierConditionType.QUANTITY, label: '購買數量' },
    { value: TierConditionType.AMOUNT, label: '購買金額' }
  ];

  const operatorOptions = [
    { value: '>=', label: '大於等於' },
    { value: '>', label: '大於' },
    { value: '==', label: '等於' }
  ];

  const availableGiftOptions = gifts.filter(gift => gift.status === 'active').map(gift => ({
    value: gift.id,
    label: gift.name
  }));

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* 操作按鈕 */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleCreateRule}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-chinese"
          >
            <PlusIcon className="w-5 h-5" />
            <span>新增規則</span>
          </button>
        </div>

        {/* 規則列表 */}
        <div className="space-y-4">
          {tierRules.map((rule) => (
            <div key={rule.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold font-chinese text-gray-900">{rule.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rule.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.status === 'active' ? '啟用中' : '停用'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewRule(rule)}
                      className="p-2 text-[#cc824d] hover:bg-[#cc824d]/10 rounded-lg transition-colors"
                      title="查看詳情"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditRule(rule)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="編輯"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="刪除"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedRule === rule.id ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <TagIcon className="w-4 h-4" />
                    <span>目標: {rule.targetProduct.type === 'category' ? '分類' : '商品'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span>階梯數: {rule.tiers.length}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {rule.dateRange?.start && rule.dateRange?.end 
                        ? `${new Date(rule.dateRange.start).toLocaleDateString()} - ${new Date(rule.dateRange.end).toLocaleDateString()}`
                        : '無期限限制'
                      }
                    </span>
                  </div>
                </div>

                {/* 階梯預覽 */}
                <div className="flex flex-wrap gap-2">
                  {rule.tiers.slice(0, 3).map((tier, index) => (
                    <div key={index} className="bg-gradient-to-r from-[#cc824d]/10 to-[#b3723f]/10 rounded-lg px-3 py-2 border border-[#cc824d]/20">
                      <div className="text-xs font-medium text-[#cc824d] font-chinese">
                        階梯 {tier.level}: {getConditionText(tier.condition)}
                      </div>
                      <div className="text-xs text-gray-600 font-chinese">
                        {tier.giftOptions.length} 個贈品 | {getSelectionTypeText(tier.selectionType)}
                      </div>
                    </div>
                  ))}
                  {rule.tiers.length > 3 && (
                    <div className="flex items-center px-3 py-2 text-xs text-gray-500 font-chinese">
                      還有 {rule.tiers.length - 3} 個階梯...
                    </div>
                  )}
                </div>

                {/* 展開的詳細資訊 */}
                {expandedRule === rule.id && (
                  <div className="mt-6 pt-6 border-t border-white/30">
                    <h4 className="text-md font-bold font-chinese mb-4">階梯詳情</h4>
                    <div className="space-y-4">
                      {rule.tiers.map((tier, index) => (
                        <div key={index} className="bg-white/40 rounded-lg p-4 border border-white/30">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium font-chinese">階梯 {tier.level}</h5>
                            <span className="text-sm text-gray-600 font-chinese">
                              {getSelectionTypeText(tier.selectionType)}
                              {tier.maxSelections > 1 && ` (最多${tier.maxSelections}個)`}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700 font-chinese">觸發條件: </span>
                            <span className="text-sm text-gray-900 font-chinese">{getConditionText(tier.condition)}</span>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium text-gray-700 font-chinese">可選贈品: </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {tier.giftOptions.map((giftOption, giftIndex) => (
                                <span key={giftIndex} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-chinese">
                                  <GiftIcon className="w-3 h-3 mr-1" />
                                  {getGiftName(giftOption.giftId)} x{giftOption.quantity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {tierRules.length === 0 && (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50">
              <Cog6ToothIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 font-chinese">沒有階梯規則</h3>
              <p className="mt-1 text-sm text-gray-500 font-chinese">開始創建您的第一個階梯贈品規則</p>
            </div>
          )}
        </div>
      </div>

      {/* 規則詳情/編輯模態框 */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'view' ? '規則詳情' : modalMode === 'create' ? '新增階梯規則' : '編輯階梯規則'}
        size="max-w-6xl"
      >
        {modalMode === 'view' ? (
          <div className="p-6 space-y-6">
            {selectedRule && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold font-chinese mb-4">基本資訊</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">規則名稱</label>
                        <p className="text-gray-900 font-chinese">{selectedRule.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">活動ID</label>
                        <p className="text-gray-900 font-chinese">{selectedRule.campaignId || '無關聯活動'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">目標對象</label>
                        <p className="text-gray-900 font-chinese">
                          {selectedRule.targetProduct.type === 'category' ? '商品分類' : '指定商品'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">狀態</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedRule.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedRule.status === 'active' ? '啟用中' : '停用'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-chinese mb-4">時間範圍</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">開始日期</label>
                        <p className="text-gray-900">
                          {selectedRule.dateRange?.start 
                            ? new Date(selectedRule.dateRange.start).toLocaleDateString() 
                            : '無限制'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-chinese">結束日期</label>
                        <p className="text-gray-900">
                          {selectedRule.dateRange?.end 
                            ? new Date(selectedRule.dateRange.end).toLocaleDateString() 
                            : '無限制'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-chinese mb-4">階梯設定</h3>
                  <div className="space-y-4">
                    {selectedRule.tiers.map((tier, index) => (
                      <div key={index} className="bg-white/40 rounded-lg p-4 border border-white/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium font-chinese mb-2">階梯 {tier.level}</h4>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-gray-600 font-chinese">觸發條件: </span>
                                <span className="font-medium font-chinese">{getConditionText(tier.condition)}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-600 font-chinese">選擇方式: </span>
                                <span className="font-medium font-chinese">{getSelectionTypeText(tier.selectionType)}</span>
                              </div>
                              {tier.maxSelections > 1 && (
                                <div className="text-sm">
                                  <span className="text-gray-600 font-chinese">最大選擇數: </span>
                                  <span className="font-medium">{tier.maxSelections}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 font-chinese mb-2">可選贈品</h5>
                            <div className="space-y-1">
                              {tier.giftOptions.map((giftOption, giftIndex) => (
                                <div key={giftIndex} className="flex items-center space-x-2 text-sm">
                                  <GiftIcon className="w-4 h-4 text-[#cc824d]" />
                                  <span className="font-chinese">{getGiftName(giftOption.giftId)}</span>
                                  <span className="text-gray-500">x{giftOption.quantity}</span>
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    優先級 {giftOption.priority}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                  規則名稱 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  placeholder="請輸入規則名稱"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  活動ID
                </label>
                <input
                  type="text"
                  value={formData.campaignId}
                  onChange={(e) => setFormData(prev => ({ ...prev, campaignId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                  placeholder="關聯的活動ID (選填)"
                />
              </div>
            </div>

            {/* 時間範圍 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  開始日期
                </label>
                <input
                  type="date"
                  value={formData.dateRange.start}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  結束日期
                </label>
                <input
                  type="date"
                  value={formData.dateRange.end}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* 階梯設定 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-chinese">階梯設定</h3>
                <button
                  type="button"
                  onClick={addTier}
                  className="flex items-center space-x-1 px-3 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors text-sm font-chinese"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>新增階梯</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.tiers.map((tier, tierIndex) => (
                  <div key={tierIndex} className="bg-white/40 rounded-lg p-4 border border-white/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium font-chinese">階梯 {tier.level}</h4>
                      {formData.tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(tierIndex)}
                          className="text-red-600 hover:text-red-800 text-sm font-chinese"
                        >
                          刪除階梯
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                          條件類型
                        </label>
                        <CustomSelect
                          value={tier.condition.type}
                          onChange={(value) => updateTier(tierIndex, {
                            condition: { ...tier.condition, type: value }
                          })}
                          options={conditionTypeOptions}
                          placeholder="選擇條件類型"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                          條件值
                        </label>
                        <input
                          type="number"
                          value={tier.condition.value}
                          onChange={(e) => updateTier(tierIndex, {
                            condition: { ...tier.condition, value: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                          運算符
                        </label>
                        <CustomSelect
                          value={tier.condition.operator}
                          onChange={(value) => updateTier(tierIndex, {
                            condition: { ...tier.condition, operator: value }
                          })}
                          options={operatorOptions}
                          placeholder="選擇運算符"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                          選擇方式
                        </label>
                        <CustomSelect
                          value={tier.selectionType}
                          onChange={(value) => updateTier(tierIndex, { selectionType: value })}
                          options={selectionTypeOptions}
                          placeholder="選擇方式"
                        />
                      </div>

                      {(tier.selectionType === GiftSelectionType.MULTIPLE) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                            最大選擇數
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={tier.maxSelections}
                            onChange={(e) => updateTier(tierIndex, { 
                              maxSelections: parseInt(e.target.value) || 1 
                            })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese bg-white/70 backdrop-blur-sm"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 font-chinese">
                          可選贈品
                        </label>
                        <CustomSelect
                          value=""
                          onChange={(value) => addGiftToTier(tierIndex, value)}
                          options={[
                            { value: '', label: '選擇贈品...' },
                            ...availableGiftOptions
                          ]}
                          placeholder="新增贈品"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        {tier.giftOptions.map((giftOption, giftIndex) => (
                          <div key={giftIndex} className="flex items-center justify-between bg-white/60 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <GiftIcon className="w-4 h-4 text-[#cc824d]" />
                              <span className="font-chinese">{getGiftName(giftOption.giftId)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="1"
                                value={giftOption.quantity}
                                onChange={(e) => {
                                  const newGiftOptions = [...tier.giftOptions];
                                  newGiftOptions[giftIndex].quantity = parseInt(e.target.value) || 1;
                                  updateTier(tierIndex, { giftOptions: newGiftOptions });
                                }}
                                className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center"
                              />
                              <button
                                type="button"
                                onClick={() => removeGiftFromTier(tierIndex, giftIndex)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {tier.giftOptions.length === 0 && (
                          <div className="text-center py-4 text-gray-500 text-sm font-chinese">
                            尚未選擇任何贈品
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                {modalMode === 'create' ? '創建規則' : '更新規則'}
              </button>
            </div>
          </form>
        )}
      </GlassModal>
    </div>
  );
};

export default GiftTierRules;