import React, { useState, useEffect } from 'react';
import { ADMIN_STYLES } from '../../../../adminStyles';
import couponDataManager, { CouponType } from '../../../../lib/mocks/marketing/coupons/couponDataManager';

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

  useEffect(() => {
    const allCoupons = couponDataManager.getAllCoupons();
    setCoupons(allCoupons);
  }, []);

  const handleCouponSelect = (coupon) => {
    setSelectedCoupon(coupon);
    if (coupon && coupon.stacking_rules) {
      setStackingRules({ ...stackingRules, ...coupon.stacking_rules });
    }
  };

  const updateStackingRules = (field, value) => {
    setStackingRules(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateGlobalRules = (field, value) => {
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
    
    couponDataManager.updateCoupon(updatedCoupon.id, updatedCoupon);
    setCoupons(prev => 
      prev.map(c => c.id === updatedCoupon.id ? updatedCoupon : c)
    );
    
    alert('疊加規則已保存！');
  };

  const getCouponTypeLabel = (type) => {
    const labels = {
      [CouponType.PERCENTAGE]: '百分比折扣',
      [CouponType.FIXED_AMOUNT]: '固定金額',
      [CouponType.FREE_SHIPPING]: '免運費',
      [CouponType.BUY_X_GET_Y]: '買X送Y'
    };
    return labels[type] || type;
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>優惠券疊加規則管理</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>設定優惠券疊加使用規則和優先級</p>
        </div>
        
        <div className={ADMIN_STYLES.contentCard + " mb-6"}>
          <h2 className="text-xl font-semibold mb-4">選擇優惠券</h2>
          <div className="grid grid-cols-3 gap-4">
            {coupons.map(coupon => (
              <div
                key={coupon.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCoupon?.id === coupon.id
                    ? 'border-[#cc824d] bg-[#cc824d]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCouponSelect(coupon)}
              >
                <div className="font-semibold">{coupon.code}</div>
                <div className="text-sm text-gray-600">{getCouponTypeLabel(coupon.type)}</div>
                <div className="text-sm text-gray-500">
                  {coupon.type === CouponType.PERCENTAGE && `${coupon.discount_value}%`}
                  {coupon.type === CouponType.FIXED_AMOUNT && `$${coupon.discount_value}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCoupon && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-6">
            <h2 className="text-xl font-semibold mb-4">疊加規則設定 - {selectedCoupon.code}</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={stackingRules.can_stack}
                    onChange={(e) => updateStackingRules('can_stack', e.target.checked)}
                    className="mr-2"
                  />
                  允許與其他優惠券疊加
                </label>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">優先級 (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={stackingRules.priority}
                    onChange={(e) => updateStackingRules('priority', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">最大疊加數量</label>
                  <input
                    type="number"
                    min="1"
                    value={stackingRules.max_stack_count}
                    onChange={(e) => updateStackingRules('max_stack_count', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">全域規則</label>
                  
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">最大總折扣百分比 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={stackingRules.global_rules.max_total_discount_percentage}
                      onChange={(e) => updateGlobalRules('max_total_discount_percentage', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">疊加最低訂單金額</label>
                    <input
                      type="number"
                      min="0"
                      value={stackingRules.global_rules.min_order_value_for_stacking}
                      onChange={(e) => updateGlobalRules('min_order_value_for_stacking', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={stackingRules.global_rules.allow_same_type_stacking}
                      onChange={(e) => updateGlobalRules('allow_same_type_stacking', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-xs">允許相同類型券疊加</span>
                  </label>
                </div>

                <button
                  onClick={saveStackingRules}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存規則
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <h2 className="text-xl font-semibold mb-4">疊加規則說明</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• 優先級：數字越高優先級越高，當有衝突時會選擇優先級高的券</p>
            <p>• 最大疊加數量：單一訂單中可以疊加的最大優惠券數量</p>
            <p>• 最大總折扣：防止過度折扣的保護機制</p>
            <p>• 最低訂單金額：允許疊加的最低訂單金額限制</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackingRulesManager;