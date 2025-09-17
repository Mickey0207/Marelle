import React, { useState, useEffect } from 'react';
import { couponDataManager, CouponType } from './couponDataManager';

const StackingRulesManager = () => {
  const [rules, setRules] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    primary_type: CouponType.FIXED_AMOUNT,
    compatible_types: [],
    priority_levels: {},
    max_combinations: 2,
    combination_logic: 'sequential', // sequential, parallel, exclusive
    conditions: {
      min_cart_value: '',
      max_total_discount: '',
      user_tier_requirements: []
    },
    is_active: true
  });

  const [previewResult, setPreviewResult] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allCoupons = couponDataManager.getAllCoupons();
    setCoupons(allCoupons);
    
    // 載入疊加規則（模擬數據，實際應該從後端獲取）
    const mockRules = [
      {
        id: 'rule1',
        name: '折扣券疊加規則',
        description: '固定金額折扣可與免運費疊加',
        primary_type: CouponType.FIXED_AMOUNT,
        compatible_types: [CouponType.FREE_SHIPPING],
        priority_levels: {
          [CouponType.FIXED_AMOUNT]: 1,
          [CouponType.FREE_SHIPPING]: 2
        },
        max_combinations: 2,
        combination_logic: 'sequential',
        conditions: {
          min_cart_value: 100,
          max_total_discount: 50,
          user_tier_requirements: []
        },
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'rule2',
        name: '百分比疊加限制',
        description: '百分比折扣不可與其他折扣疊加',
        primary_type: CouponType.PERCENTAGE,
        compatible_types: [],
        priority_levels: {
          [CouponType.PERCENTAGE]: 1
        },
        max_combinations: 1,
        combination_logic: 'exclusive',
        conditions: {
          min_cart_value: 0,
          max_total_discount: 80,
          user_tier_requirements: []
        },
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
    setRules(mockRules);
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      primary_type: CouponType.FIXED_AMOUNT,
      compatible_types: [],
      priority_levels: {},
      max_combinations: 2,
      combination_logic: 'sequential',
      conditions: {
        min_cart_value: '',
        max_total_discount: '',
        user_tier_requirements: []
      },
      is_active: true
    });
    setShowRuleForm(true);
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setFormData({
      ...rule,
      conditions: {
        ...rule.conditions,
        min_cart_value: rule.conditions.min_cart_value.toString(),
        max_total_discount: rule.conditions.max_total_discount.toString()
      }
    });
    setShowRuleForm(true);
  };

  const handleDeleteRule = (ruleId) => {
    if (window.confirm('確定要刪除此疊加規則嗎？')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  const handleSubmitRule = (e) => {
    e.preventDefault();
    
    const ruleData = {
      ...formData,
      id: editingRule?.id || `rule_${Date.now()}`,
      conditions: {
        ...formData.conditions,
        min_cart_value: parseFloat(formData.conditions.min_cart_value) || 0,
        max_total_discount: parseFloat(formData.conditions.max_total_discount) || 0
      },
      created_at: editingRule?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (editingRule) {
      setRules(rules.map(rule => rule.id === editingRule.id ? ruleData : rule));
    } else {
      setRules([...rules, ruleData]);
    }

    setShowRuleForm(false);
  };

  const handlePreviewCombination = (primaryCoupon, secondaryCoupons) => {
    const result = couponDataManager.previewCouponCombination(
      primaryCoupon.id,
      secondaryCoupons.map(c => c.id),
      {
        cart_value: 200,
        items: [
          { id: 'item1', price: 100, quantity: 2 }
        ]
      }
    );
    setPreviewResult(result);
  };

  const toggleTypeInCompatible = (type) => {
    setFormData(prev => ({
      ...prev,
      compatible_types: prev.compatible_types.includes(type)
        ? prev.compatible_types.filter(t => t !== type)
        : [...prev.compatible_types, type]
    }));
  };

  const updatePriorityLevel = (type, priority) => {
    setFormData(prev => ({
      ...prev,
      priority_levels: {
        ...prev.priority_levels,
        [type]: parseInt(priority)
      }
    }));
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || rule.primary_type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type) => {
    const colors = {
      [CouponType.FIXED_AMOUNT]: 'bg-blue-100 text-blue-700',
      [CouponType.PERCENTAGE]: 'bg-purple-100 text-purple-700',
      [CouponType.FREE_SHIPPING]: 'bg-green-100 text-green-700',
      [CouponType.BOGO]: 'bg-pink-100 text-pink-700',
      [CouponType.BUNDLE]: 'bg-indigo-100 text-indigo-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getCombinationLogicColor = (logic) => {
    const colors = {
      sequential: 'bg-blue-100 text-blue-700',
      parallel: 'bg-green-100 text-green-700',
      exclusive: 'bg-red-100 text-red-700'
    };
    return colors[logic] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">疊加規則管理</h1>
              <p className="text-gray-600">配置優惠券組合邏輯和相容性規則</p>
            </div>
            <button
              onClick={handleCreateRule}
              className="bg-[#cc824d] text-white px-6 py-3 rounded-lg hover:bg-[#b3723f] transition-colors"
            >
              新增疊加規則
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              <option value="all">所有類型</option>
              <option value={CouponType.FIXED_AMOUNT}>固定金額折扣</option>
              <option value={CouponType.PERCENTAGE}>百分比折扣</option>
              <option value={CouponType.FREE_SHIPPING}>免運費</option>
              <option value={CouponType.BOGO}>買N送N</option>
              <option value={CouponType.BUNDLE}>組合優惠</option>
            </select>
          </div>
        </div>

        {/* Rules List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {filteredRules.map(rule => (
            <div key={rule.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{rule.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{rule.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {rule.is_active ? '啟用' : '停用'}
                  </span>
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="p-1 text-gray-400 hover:text-[#cc824d] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">主要類型:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(rule.primary_type)}`}>
                    {rule.primary_type}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">組合邏輯:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCombinationLogicColor(rule.combination_logic)}`}>
                    {rule.combination_logic === 'sequential' && '順序執行'}
                    {rule.combination_logic === 'parallel' && '平行執行'}
                    {rule.combination_logic === 'exclusive' && '互斥執行'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">最大組合數:</span>
                  <span className="font-medium">{rule.max_combinations}</span>
                </div>

                {rule.compatible_types.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">相容類型:</span>
                    <div className="flex flex-wrap gap-1">
                      {rule.compatible_types.map(type => (
                        <span key={type} className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(type)}`}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                  <div>
                    <span className="text-sm text-gray-500">最低購物車金額</span>
                    <p className="font-medium">${rule.conditions.min_cart_value}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">最高總折扣</span>
                    <p className="font-medium">${rule.conditions.max_total_discount}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rule Form Modal */}
        {showRuleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmitRule} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingRule ? '編輯疊加規則' : '新增疊加規則'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowRuleForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        規則名稱 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        主要優惠券類型 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.primary_type}
                        onChange={(e) => setFormData({...formData, primary_type: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      >
                        <option value={CouponType.FIXED_AMOUNT}>固定金額折扣</option>
                        <option value={CouponType.PERCENTAGE}>百分比折扣</option>
                        <option value={CouponType.FREE_SHIPPING}>免運費</option>
                        <option value={CouponType.BOGO}>買N送N</option>
                        <option value={CouponType.BUNDLE}>組合優惠</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        規則描述
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Combination Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">組合設定</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          組合邏輯
                        </label>
                        <select
                          value={formData.combination_logic}
                          onChange={(e) => setFormData({...formData, combination_logic: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        >
                          <option value="sequential">順序執行</option>
                          <option value="parallel">平行執行</option>
                          <option value="exclusive">互斥執行</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最大組合數量
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={formData.max_combinations}
                          onChange={(e) => setFormData({...formData, max_combinations: parseInt(e.target.value)})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        相容的優惠券類型
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.values(CouponType).map(type => (
                          <label key={type} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.compatible_types.includes(type)}
                              onChange={() => toggleTypeInCompatible(type)}
                              className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
                            />
                            <span className="text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Priority Levels */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">優先級設定</h3>
                    <div className="space-y-3">
                      {[formData.primary_type, ...formData.compatible_types].map(type => (
                        <div key={type} className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded text-sm font-medium ${getTypeColor(type)}`}>
                            {type}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">優先級:</span>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={formData.priority_levels[type] || 1}
                              onChange={(e) => updatePriorityLevel(type, e.target.value)}
                              className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Conditions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">使用條件</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最低購物車金額
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.conditions.min_cart_value}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditions: {...formData.conditions, min_cart_value: e.target.value}
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最高總折扣金額
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.conditions.max_total_discount}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditions: {...formData.conditions, max_total_discount: e.target.value}
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="mr-3 text-[#cc824d] focus:ring-[#cc824d]"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                      啟用此規則
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowRuleForm(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
                  >
                    {editingRule ? '更新規則' : '創建規則'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Result */}
        {previewResult && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">組合預覽結果</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">${previewResult.original_total}</div>
                <div className="text-sm text-blue-600">原始金額</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">${previewResult.total_discount}</div>
                <div className="text-sm text-green-600">總折扣</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">${previewResult.final_total}</div>
                <div className="text-sm text-purple-600">最終金額</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StackingRulesManager;