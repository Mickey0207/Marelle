import React from 'react';import React, { useState, useEffect } from 'react';

import couponDataManager, { CouponType } from '../../../shared/data/couponDataManager';

const StackingRulesManager = () => {

  return (const StackingRulesManager = () => {

    <div className="bg-[#fdf8f2] min-h-screen p-6">  const [coupons, setCoupons] = useState([]);

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">  const [selectedCoupon, setSelectedCoupon] = useState(null);

        <h1 className="text-2xl font-bold text-gray-900 mb-4">疊加規則管理</h1>  const [stackingRules, setStackingRules] = useState({

        <p className="text-gray-600">疊加規則管理功能開發中...</p>    can_stack: false,

      </div>    stack_with_types: [],

    </div>    priority: 1,

  );    max_stack_count: 1,

};    exclusive_with: [],

    global_rules: {

export default StackingRulesManager;      max_total_discount_percentage: 50,
      min_order_value_for_stacking: 100,
      allow_same_type_stacking: false
    }
  });
  const [testingScenarios, setTestingScenarios] = useState([]);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    loadCoupons();
    generateTestingScenarios();
  }, []);

  const loadCoupons = () => {
    const allCoupons = couponDataManager.getAllCoupons();
    setCoupons(allCoupons);
  };

  const generateTestingScenarios = () => {
    const scenarios = [
      {
        id: 1,
        name: '分析比�???+ 分析�?,
        coupons: ['SAVE20', 'FREESHIP'],
        order_value: 150,
        expected_result: '分析??,
        description: '20%?�扣分析分析費券分析使用'
      },
      {
        id: 2,
        name: '?�個固定�?額�???,
        coupons: ['SAVE50', 'SAVE30'],
        order_value: 200,
        expected_result: '不可分析',
        description: '分析?�優?�券不�?許�???
      },
      {
        id: 3,
        name: '超�??�大�??????,
        coupons: ['SAVE30', 'SAVE40'],
        order_value: 100,
        expected_result: '分析?�用',
        description: '總�??????0%?�制'
      },
      {
        id: 4,
        name: '低於?�低�?分析�?,
        coupons: ['SAVE20', 'FREESHIP'],
        order_value: 80,
        expected_result: '不可分析',
        description: '訂單分析低於分析?�低�分析
      }
    ];
    setTestingScenarios(scenarios);
  };

  const handleCouponSelect = (coupon) => {
    setSelectedCoupon(coupon);
    setStackingRules(coupon.stacking_rules || {
      can_stack: false,
      stack_with_types: [],
      priority: 1,
      max_stack_count: 1,
      exclusive_with: [],
      global_rules: {
        max_total_discount_percentage: 50,
        min_order_value_for_stacking: 100,
        allow_same_type_stacking: false
      }
    });
  };

  const handleRuleChange = (field, value) => {
    setStackingRules(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGlobalRuleChange = (field, value) => {
    setStackingRules(prev => ({
      ...prev,
      global_rules: {
        ...prev.global_rules,
        [field]: value
      }
    }));
  };

  const saveStackingRules = () => {
    if (!selectedCoupon) return;

    const updatedCoupon = {
      ...selectedCoupon,
      stacking_rules: stackingRules
    };

    const success = couponDataManager.updateCoupon(selectedCoupon.id, updatedCoupon);
    if (success) {
      loadCoupons();
      alert('分析規�?已�?存�?');
    } else {
      alert('保�?失�?，�??�試');
    }
  };

  const testStackingScenario = (scenario) => {
    // 模擬分析規�?測試
    const result = {
      scenario_id: scenario.id,
      can_stack: true,
      applied_coupons: scenario.coupons,
      total_discount: 0,
      discount_breakdown: [],
      warnings: [],
      errors: []
    };

    // 分析分析分析??
    const scenarioCoupons = scenario.coupons.map(code => 
      coupons.find(c => c.code === code)
    ).filter(Boolean);

    // 檢查分析規�?
    if (scenario.order_value < stackingRules.global_rules.min_order_value_for_stacking) {
      result.can_stack = false;
      result.errors.push('訂單分析低於分析?�低�分析);
    }

    // 檢查分析分析??
    const couponTypes = scenarioCoupons.map(c => c.type);
    const hasDuplicateTypes = couponTypes.length !== new Set(couponTypes).size;
    
    if (hasDuplicateTypes && !stackingRules.global_rules.allow_same_type_stacking) {
      result.can_stack = false;
      result.errors.push('分析?�優?�券不�?許�???);
    }

    // 計�?總�???
    let totalDiscount = 0;
    scenarioCoupons.forEach(coupon => {
      let discount = 0;
      if (coupon.type === CouponType.PERCENTAGE) {
        discount = scenario.order_value * (coupon.value / 100);
      } else if (coupon.type === CouponType.FIXED_AMOUNT) {
        discount = coupon.value;
      }
      
      totalDiscount += discount;
      result.discount_breakdown.push({
        coupon_code: coupon.code,
        coupon_type: coupon.type,
        discount_amount: discount
      });
    });

    result.total_discount = totalDiscount;

    // 檢查?�大�??????
    const discountPercentage = (totalDiscount / scenario.order_value) * 100;
    if (discountPercentage > stackingRules.global_rules.max_total_discount_percentage) {
      result.warnings.push(`總�???${discountPercentage.toFixed(1)}% 超�??�制 ${stackingRules.global_rules.max_total_discount_percentage}%`);
    }

    return result;
  };

  const runAllTests = () => {
    const results = testingScenarios.map(scenario => ({
      scenario,
      result: testStackingScenario(scenario)
    }));
    setTestResults(results);
  };

  const CouponTypeTag = ({ type }) => {
    const typeColors = {
      [CouponType.FIXED_AMOUNT]: 'bg-blue-100 text-blue-800',
      [CouponType.PERCENTAGE]: 'bg-green-100 text-green-800',
      [CouponType.FREE_SHIPPING]: 'bg-purple-100 text-purple-800',
      [CouponType.BOGO]: 'bg-orange-100 text-orange-800',
      [CouponType.BUNDLE]: 'bg-pink-100 text-pink-800'
    };

    const typeNames = {
      [CouponType.FIXED_AMOUNT]: '分析分析',
      [CouponType.PERCENTAGE]: '分析�?,
      [CouponType.FREE_SHIPPING]: '分析�?,
      [CouponType.BOGO]: '買N?�N',
      [CouponType.BUNDLE]: '組�?分析'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${typeColors[type]}`}>
        {typeNames[type]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">分析規�?管�?</h1>
          <p className="text-gray-600">管�?分析分析分析分析測試分析分析</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 分析分析�?*/}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">分析分析??/h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {coupons.map(coupon => (
                <div
                  key={coupon.id}
                  onClick={() => handleCouponSelect(coupon)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedCoupon?.id === coupon.id
                      ? 'border-[#cc824d] bg-[#cc824d]/10'
                      : 'border-gray-200 hover:border-[#cc824d]/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{coupon.name}</h3>
                    <CouponTypeTag type={coupon.type} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{coupon.code}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      分析: {coupon.stacking_rules?.can_stack ? '?�許' : '不�分析}
                    </span>
                    {coupon.stacking_rules?.can_stack && (
                      <span className="text-xs text-[#cc824d]">
                        分析�? {coupon.stacking_rules.priority}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 分析規�?設�? */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">分析規�?設�?</h2>
            
            {selectedCoupon ? (
              <div className="space-y-6">
                {/* ?�中?�優?�券資�? */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{selectedCoupon.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{selectedCoupon.code}</span>
                    <CouponTypeTag type={selectedCoupon.type} />
                  </div>
                </div>

                {/* ?�本分析設�? */}
                <div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="can_stack"
                      checked={stackingRules.can_stack}
                      onChange={(e) => handleRuleChange('can_stack', e.target.checked)}
                      className="mr-3 text-[#cc824d] focus:ring-[#cc824d]"
                    />
                    <label htmlFor="can_stack" className="font-medium text-gray-700">
                      ?�許分析使用
                    </label>
                  </div>

                  {stackingRules.can_stack && (
                    <div className="space-y-4 pl-6 border-l-2 border-[#cc824d]/20">
                      {/* 分析分析??*/}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          分析分析分析分析??
                        </label>
                        <div className="space-y-2">
                          {Object.values(CouponType).map(type => (
                            <label key={type} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={stackingRules.stack_with_types.includes(type)}
                                onChange={(e) => {
                                  const newTypes = e.target.checked
                                    ? [...stackingRules.stack_with_types, type]
                                    : stackingRules.stack_with_types.filter(t => t !== type);
                                  handleRuleChange('stack_with_types', newTypes);
                                }}
                                className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
                              />
                              <CouponTypeTag type={type} />
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 分析級�?分析?�制 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            分析�?(1-10)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={stackingRules.priority}
                            onChange={(e) => handleRuleChange('priority', parseInt(e.target.value))}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ?�大�??�數??
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={stackingRules.max_stack_count}
                            onChange={(e) => handleRuleChange('max_stack_count', parseInt(e.target.value))}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* 分析規�? */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">分析分析規�?</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              ?�大總?�扣分析�?(%)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={stackingRules.global_rules.max_total_discount_percentage}
                              onChange={(e) => handleGlobalRuleChange('max_total_discount_percentage', parseInt(e.target.value))}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              分析?�低�?分析�?
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={stackingRules.global_rules.min_order_value_for_stacking}
                              onChange={(e) => handleGlobalRuleChange('min_order_value_for_stacking', parseInt(e.target.value))}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="allow_same_type"
                              checked={stackingRules.global_rules.allow_same_type_stacking}
                              onChange={(e) => handleGlobalRuleChange('allow_same_type_stacking', e.target.checked)}
                              className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
                            />
                            <label htmlFor="allow_same_type" className="text-sm text-gray-600">
                              ?�許分析?�優?�券分析
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 保�?分析 */}
                <button
                  onClick={saveStackingRules}
                  className="w-full bg-[#cc824d] text-white py-3 rounded-lg hover:bg-[#b3723f] transition-colors"
                >
                  保�?分析規�?
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p>請選分析?�優?�券來設定�?分析??/p>
              </div>
            )}
          </div>

          {/* 分析測試 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">分析測試</h2>
              <button
                onClick={runAllTests}
                className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors text-sm"
              >
                分析測試
              </button>
            </div>

            {/* 測試?�景 */}
            <div className="space-y-4 mb-6">
              {testingScenarios.map(scenario => (
                <div key={scenario.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{scenario.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {scenario.coupons.map(code => (
                      <span key={code} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {code}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    訂單分析: ${scenario.order_value} | 分析: {scenario.expected_result}
                  </p>
                </div>
              ))}
            </div>

            {/* 測試結�? */}
            {testResults && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">測試結�?</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {testResults.map(({ scenario, result }) => (
                    <div key={scenario.id} className={`p-3 rounded-lg border ${
                      result.can_stack ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{scenario.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          result.can_stack ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.can_stack ? '分析?? : '不可分析'}
                        </span>
                      </div>
                      
                      {result.total_discount > 0 && (
                        <p className="text-sm text-gray-600 mb-1">
                          總�??? ${result.total_discount.toFixed(2)}
                        </p>
                      )}
                      
                      {result.warnings.length > 0 && (
                        <div className="text-xs text-orange-600 mb-1">
                          {result.warnings.map((warning, index) => (
                            <p key={index}>分析 {warning}</p>
                          ))}
                        </div>
                      )}
                      
                      {result.errors.length > 0 && (
                        <div className="text-xs text-red-600">
                          {result.errors.map((error, index) => (
                            <p key={index}>??{error}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackingRulesManager;
