import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { couponDataManager, CouponStatus, CouponType } from './couponDataManager';

const CouponForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: CouponType.FIXED_AMOUNT,
    value: '',
    start_date: '',
    end_date: '',
    usage_limit: '',
    user_limit: '',
    status: CouponStatus.DRAFT,
    conditions: {
      min_amount: '',
      max_discount: '',
      applicable_products: [],
      applicable_categories: [],
      user_groups: [],
      buy_quantity: '',
      get_quantity: ''
    },
    stacking_rules: {
      can_stack: false,
      stack_with_types: [],
      priority: 1,
      max_stack_count: 1
    }
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    // 載入商品和分類列表（模擬數據）
    setProductsList([
      { id: 'product1', name: '玫瑰精華面膜' },
      { id: 'product2', name: '薰衣草舒緩霜' },
      { id: 'product3', name: '維他命C精華液' },
      { id: 'product4', name: '蜂蜜修護乳霜' },
      { id: 'product5', name: '綠茶潔面慕斯' }
    ]);

    setCategoriesList([
      { id: 'skincare', name: '護膚品' },
      { id: 'makeup', name: '彩妝' },
      { id: 'fragrance', name: '香氛' },
      { id: 'bodycare', name: '身體護理' }
    ]);

    if (isEditing) {
      loadCoupon();
    } else {
      // 設置新增模式的默認值
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      setFormData(prev => ({
        ...prev,
        start_date: tomorrow.toISOString().slice(0, 16),
        end_date: nextMonth.toISOString().slice(0, 16),
        code: generateCouponCode()
      }));
    }
  }, [id, isEditing]);

  const loadCoupon = () => {
    const coupon = couponDataManager.getCouponById(id);
    if (coupon) {
      setFormData({
        ...coupon,
        start_date: new Date(coupon.start_date).toISOString().slice(0, 16),
        end_date: new Date(coupon.end_date).toISOString().slice(0, 16),
        value: coupon.value.toString(),
        usage_limit: coupon.usage_limit === -1 ? '' : coupon.usage_limit.toString(),
        user_limit: coupon.user_limit === -1 ? '' : coupon.user_limit.toString(),
        conditions: {
          ...coupon.conditions,
          min_amount: coupon.conditions.min_amount.toString(),
          max_discount: coupon.conditions.max_discount ? coupon.conditions.max_discount.toString() : '',
          buy_quantity: coupon.conditions.buy_quantity ? coupon.conditions.buy_quantity.toString() : '',
          get_quantity: coupon.conditions.get_quantity ? coupon.conditions.get_quantity.toString() : ''
        }
      });
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '請輸入優惠券名稱';
    }

    if (!formData.code.trim()) {
      newErrors.code = '請輸入優惠券代碼';
    } else if (!/^[A-Z0-9]{3,20}$/.test(formData.code)) {
      newErrors.code = '優惠券代碼只能包含大寫字母和數字，長度3-20位';
    }

    if (!formData.description.trim()) {
      newErrors.description = '請輸入優惠券描述';
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = '請輸入有效的優惠值';
    }

    if (formData.type === CouponType.PERCENTAGE && parseFloat(formData.value) > 100) {
      newErrors.value = '百分比折扣不能超過100%';
    }

    if (!formData.start_date) {
      newErrors.start_date = '請選擇開始時間';
    }

    if (!formData.end_date) {
      newErrors.end_date = '請選擇結束時間';
    }

    if (formData.start_date && formData.end_date && 
        new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.end_date = '結束時間必須晚於開始時間';
    }

    if (!formData.conditions.min_amount || parseFloat(formData.conditions.min_amount) < 0) {
      newErrors.min_amount = '請輸入有效的最低消費金額';
    }

    if (formData.type === CouponType.BOGO) {
      if (!formData.conditions.buy_quantity || parseInt(formData.conditions.buy_quantity) <= 0) {
        newErrors.buy_quantity = '請輸入有效的購買數量';
      }
      if (!formData.conditions.get_quantity || parseInt(formData.conditions.get_quantity) <= 0) {
        newErrors.get_quantity = '請輸入有效的贈送數量';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const couponData = {
        ...formData,
        value: parseFloat(formData.value),
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : -1,
        user_limit: formData.user_limit ? parseInt(formData.user_limit) : -1,
        conditions: {
          ...formData.conditions,
          min_amount: parseFloat(formData.conditions.min_amount),
          max_discount: formData.conditions.max_discount ? parseFloat(formData.conditions.max_discount) : null,
          buy_quantity: formData.conditions.buy_quantity ? parseInt(formData.conditions.buy_quantity) : null,
          get_quantity: formData.conditions.get_quantity ? parseInt(formData.conditions.get_quantity) : null
        }
      };

      let result;
      if (isEditing) {
        result = couponDataManager.updateCoupon(id, couponData);
      } else {
        result = couponDataManager.createCoupon(couponData);
      }

      if (result) {
        navigate('/admin/coupons');
      } else {
        setErrors({ submit: '保存失敗，請重試' });
      }
    } catch (error) {
      setErrors({ submit: '保存失敗：' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除相關錯誤
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleConditionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [field]: value
      }
    }));

    // 清除相關錯誤
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleStackingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      stacking_rules: {
        ...prev.stacking_rules,
        [field]: value
      }
    }));
  };

  const toggleArrayValue = (array, value) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  const InputField = ({ label, name, type = 'text', value, onChange, error, required = false, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  const SelectField = ({ label, name, value, onChange, options, error, required = false }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  const TextareaField = ({ label, name, value, onChange, error, required = false, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        rows={3}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  const CheckboxGroup = ({ label, options, selectedValues, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        {options.map(option => (
          <label key={option.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.id)}
              onChange={() => onChange(toggleArrayValue(selectedValues, option.id))}
              className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
            />
            <span className="text-sm">{option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/coupons')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? '編輯優惠券' : '新增優惠券'}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? '修改優惠券設定和條件' : '創建新的優惠券'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">基本資訊</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="優惠券名稱"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
                placeholder="例：新年特惠"
              />

              <InputField
                label="優惠券代碼"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                error={errors.code}
                required
                placeholder="例：NY2024"
                style={{ textTransform: 'uppercase' }}
              />

              <div className="md:col-span-2">
                <TextareaField
                  label="優惠券描述"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={errors.description}
                  required
                  placeholder="描述優惠券的用途和特色"
                />
              </div>

              <SelectField
                label="優惠券類型"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                error={errors.type}
                required
                options={[
                  { value: CouponType.FIXED_AMOUNT, label: '固定金額折扣' },
                  { value: CouponType.PERCENTAGE, label: '百分比折扣' },
                  { value: CouponType.FREE_SHIPPING, label: '免運費' },
                  { value: CouponType.BOGO, label: '買N送N' },
                  { value: CouponType.BUNDLE, label: '組合優惠' }
                ]}
              />

              <InputField
                label={formData.type === CouponType.PERCENTAGE ? '折扣百分比 (%)' : 
                       formData.type === CouponType.FREE_SHIPPING ? '免運門檻' : '折扣金額'}
                name="value"
                type="number"
                value={formData.value}
                onChange={handleInputChange}
                error={errors.value}
                required
                min="0"
                max={formData.type === CouponType.PERCENTAGE ? "100" : undefined}
                step={formData.type === CouponType.PERCENTAGE ? "0.1" : "1"}
              />

              <SelectField
                label="優惠券狀態"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={[
                  { value: CouponStatus.DRAFT, label: '草稿' },
                  { value: CouponStatus.ACTIVE, label: '啟用' },
                  { value: CouponStatus.PAUSED, label: '暫停' }
                ]}
              />
            </div>
          </div>

          {/* Time Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">時間設定</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="開始時間"
                name="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={handleInputChange}
                error={errors.start_date}
                required
              />

              <InputField
                label="結束時間"
                name="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={handleInputChange}
                error={errors.end_date}
                required
              />
            </div>
          </div>

          {/* Usage Limits */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">使用限制</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="總使用次數限制"
                name="usage_limit"
                type="number"
                value={formData.usage_limit}
                onChange={handleInputChange}
                placeholder="留空表示無限制"
                min="1"
              />

              <InputField
                label="每人使用次數限制"
                name="user_limit"
                type="number"
                value={formData.user_limit}
                onChange={handleInputChange}
                placeholder="留空表示無限制"
                min="1"
              />
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">使用條件</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="最低消費金額"
                  name="min_amount"
                  type="number"
                  value={formData.conditions.min_amount}
                  onChange={(name, value) => handleConditionChange('min_amount', value)}
                  error={errors.min_amount}
                  required
                  min="0"
                  step="0.01"
                />

                {(formData.type === CouponType.PERCENTAGE || formData.type === CouponType.FIXED_AMOUNT) && (
                  <InputField
                    label="最高折扣金額"
                    name="max_discount"
                    type="number"
                    value={formData.conditions.max_discount}
                    onChange={(name, value) => handleConditionChange('max_discount', value)}
                    placeholder="留空表示無限制"
                    min="0"
                    step="0.01"
                  />
                )}
              </div>

              {formData.type === CouponType.BOGO && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="購買數量"
                    name="buy_quantity"
                    type="number"
                    value={formData.conditions.buy_quantity}
                    onChange={(name, value) => handleConditionChange('buy_quantity', value)}
                    error={errors.buy_quantity}
                    required
                    min="1"
                  />

                  <InputField
                    label="贈送數量"
                    name="get_quantity"
                    type="number"
                    value={formData.conditions.get_quantity}
                    onChange={(name, value) => handleConditionChange('get_quantity', value)}
                    error={errors.get_quantity}
                    required
                    min="1"
                  />
                </div>
              )}

              <CheckboxGroup
                label="適用商品"
                options={productsList}
                selectedValues={formData.conditions.applicable_products}
                onChange={(values) => handleConditionChange('applicable_products', values)}
              />

              <CheckboxGroup
                label="適用分類"
                options={categoriesList}
                selectedValues={formData.conditions.applicable_categories}
                onChange={(values) => handleConditionChange('applicable_categories', values)}
              />
            </div>
          </div>

          {/* Stacking Rules */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">疊加規則</h2>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="can_stack"
                  checked={formData.stacking_rules.can_stack}
                  onChange={(e) => handleStackingChange('can_stack', e.target.checked)}
                  className="mr-3 text-[#cc824d] focus:ring-[#cc824d]"
                />
                <label htmlFor="can_stack" className="text-sm font-medium text-gray-700">
                  允許與其他優惠券疊加使用
                </label>
              </div>

              {formData.stacking_rules.can_stack && (
                <div className="space-y-4 pl-6 border-l-2 border-[#cc824d]/20">
                  <CheckboxGroup
                    label="可疊加的優惠券類型"
                    options={[
                      { id: CouponType.FIXED_AMOUNT, name: '固定金額折扣' },
                      { id: CouponType.PERCENTAGE, name: '百分比折扣' },
                      { id: CouponType.FREE_SHIPPING, name: '免運費' }
                    ]}
                    selectedValues={formData.stacking_rules.stack_with_types}
                    onChange={(values) => handleStackingChange('stack_with_types', values)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="優先級 (1-10)"
                      name="priority"
                      type="number"
                      value={formData.stacking_rules.priority}
                      onChange={(name, value) => handleStackingChange('priority', parseInt(value))}
                      min="1"
                      max="10"
                    />

                    <InputField
                      label="最大疊加數量"
                      name="max_stack_count"
                      type="number"
                      value={formData.stacking_rules.max_stack_count}
                      onChange={(name, value) => handleStackingChange('max_stack_count', parseInt(value))}
                      min="1"
                      max="5"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/coupons')}
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '保存中...' : (isEditing ? '更新優惠券' : '創建優惠券')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm;