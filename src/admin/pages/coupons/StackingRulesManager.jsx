import React, { useState, useEffect } from 'react';
import couponDataManager, { CouponType } from '../../data/couponDataManager';

const StackingRulesManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [stackingRules, setStackingRules] = useState({
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
        name: '百分比折扣 + 免運費',
        coupons: ['SAVE20', 'FREESHIP'],
        order_value: 150,
        expected_result: '可疊加',
        description: '20%折扣券與免運費券疊加使用'
      },
      {
        id: 2,
        name: '兩個固定金額折扣',
        coupons: ['SAVE50', 'SAVE30'],
        order_value: 200,
        expected_result: '不可疊加',
        description: '同類型優惠券不允許疊加'
      },
      {
        id: 3,
        name: '超過最大折扣限制',
        coupons: ['SAVE30', 'SAVE40'],
        order_value: 100,
        expected_result: '部分可用',
        description: '總折扣超過50%限制'
      },
      {
        id: 4,
        name: '低於最低訂單金額',
        coupons: ['SAVE20', 'FREESHIP'],
        order_value: 80,
        expected_result: '不可疊加',
        description: '訂單金額低於疊加最低要求'
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
      alert('疊加規則已保存！');
    } else {
      alert('保存失敗，請重試');
    }
  };

  const testStackingScenario = (scenario) => {
    // 模擬疊加規則測試
    const result = {
      scenario_id: scenario.id,
      can_stack: true,
      applied_coupons: scenario.coupons,
      total_discount: 0,
      discount_breakdown: [],
      warnings: [],
      errors: []
    };

    // 獲取相關優惠券
    const scenarioCoupons = scenario.coupons.map(code => 
      coupons.find(c => c.code === code)
    ).filter(Boolean);

    // 檢查疊加規則
    if (scenario.order_value < stackingRules.global_rules.min_order_value_for_stacking) {
      result.can_stack = false;
      result.errors.push('訂單金額低於疊加最低要求');
    }

    // 檢查同類型疊加
    const couponTypes = scenarioCoupons.map(c => c.type);
    const hasDuplicateTypes = couponTypes.length !== new Set(couponTypes).size;
    
    if (hasDuplicateTypes && !stackingRules.global_rules.allow_same_type_stacking) {
      result.can_stack = false;
      result.errors.push('同類型優惠券不允許疊加');
    }

    // 計算總折扣
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

    // 檢查最大折扣限制
    const discountPercentage = (totalDiscount / scenario.order_value) * 100;
    if (discountPercentage > stackingRules.global_rules.max_total_discount_percentage) {
      result.warnings.push(`總折扣 ${discountPercentage.toFixed(1)}% 超過限制 ${stackingRules.global_rules.max_total_discount_percentage}%`);
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
      [CouponType.FIXED_AMOUNT]: '固定金額',
      [CouponType.PERCENTAGE]: '百分比',
      [CouponType.FREE_SHIPPING]: '免運費',
      [CouponType.BOGO]: '買N送N',
      [CouponType.BUNDLE]: '組合優惠'
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">疊加規則管理</h1>
          <p className="text-gray-600">管理優惠券疊加規則和測試疊加效果</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 優惠券列表 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">選擇優惠券</h2>
            
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
                      疊加: {coupon.stacking_rules?.can_stack ? '允許' : '不允許'}
                    </span>
                    {coupon.stacking_rules?.can_stack && (
                      <span className="text-xs text-[#cc824d]">
                        優先級: {coupon.stacking_rules.priority}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 疊加規則設定 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">疊加規則設定</h2>
            
            {selectedCoupon ? (
              <div className="space-y-6">
                {/* 選中的優惠券資訊 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{selectedCoupon.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{selectedCoupon.code}</span>
                    <CouponTypeTag type={selectedCoupon.type} />
                  </div>
                </div>

                {/* 基本疊加設定 */}
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
                      允許疊加使用
                    </label>
                  </div>

                  {stackingRules.can_stack && (
                    <div className="space-y-4 pl-6 border-l-2 border-[#cc824d]/20">
                      {/* 可疊加類型 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          可疊加的優惠券類型
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

                      {/* 優先級和數量限制 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            優先級 (1-10)
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
                            最大疊加數量
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

                      {/* 全域規則 */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">全域疊加規則</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              最大總折扣百分比 (%)
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
                              疊加最低訂單金額
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
                              允許同類型優惠券疊加
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 保存按鈕 */}
                <button
                  onClick={saveStackingRules}
                  className="w-full bg-[#cc824d] text-white py-3 rounded-lg hover:bg-[#b3723f] transition-colors"
                >
                  保存疊加規則
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p>請選擇一個優惠券來設定疊加規則</p>
              </div>
            )}
          </div>

          {/* 疊加測試 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">疊加測試</h2>
              <button
                onClick={runAllTests}
                className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors text-sm"
              >
                執行測試
              </button>
            </div>

            {/* 測試場景 */}
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
                    訂單金額: ${scenario.order_value} | 預期: {scenario.expected_result}
                  </p>
                </div>
              ))}
            </div>

            {/* 測試結果 */}
            {testResults && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">測試結果</h3>
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
                          {result.can_stack ? '可疊加' : '不可疊加'}
                        </span>
                      </div>
                      
                      {result.total_discount > 0 && (
                        <p className="text-sm text-gray-600 mb-1">
                          總折扣: ${result.total_discount.toFixed(2)}
                        </p>
                      )}
                      
                      {result.warnings.length > 0 && (
                        <div className="text-xs text-orange-600 mb-1">
                          {result.warnings.map((warning, index) => (
                            <p key={index}>⚠️ {warning}</p>
                          ))}
                        </div>
                      )}
                      
                      {result.errors.length > 0 && (
                        <div className="text-xs text-red-600">
                          {result.errors.map((error, index) => (
                            <p key={index}>❌ {error}</p>
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