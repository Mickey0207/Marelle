import React, { useState, useEffect } from 'react';
import logisticsDataManager, { LogisticsType, CalculationMethod } from '../../data/logisticsDataManager';

const ShippingRateConfig = () => {
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logisticsTypes: [],
    calculationMethod: CalculationMethod.WEIGHT,
    baseRate: 0,
    tiers: [{ min: 0, max: 1, rate: 80 }],
    freeShippingThreshold: '',
    isActive: true
  });
  const [testCalculation, setTestCalculation] = useState({
    logisticsType: LogisticsType.HOME_DELIVERY,
    weight: 1,
    orderAmount: 500,
    result: null
  });

  useEffect(() => {
    loadShippingRates();
  }, []);

  const loadShippingRates = () => {
    const rates = logisticsDataManager.getAllShippingRates();
    setShippingRates(rates);
  };

  const handleCreateNew = () => {
    setFormData({
      name: '',
      logisticsTypes: [],
      calculationMethod: CalculationMethod.WEIGHT,
      baseRate: 0,
      tiers: [{ min: 0, max: 1, rate: 80 }],
      freeShippingThreshold: '',
      isActive: true
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (rate) => {
    setFormData({
      ...rate,
      freeShippingThreshold: rate.freeShippingThreshold || ''
    });
    setSelectedRate(rate);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogisticsTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      logisticsTypes: prev.logisticsTypes.includes(type)
        ? prev.logisticsTypes.filter(t => t !== type)
        : [...prev.logisticsTypes, type]
    }));
  };

  const handleTierChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers.map((tier, i) => 
        i === index ? { ...tier, [field]: parseFloat(value) || 0 } : tier
      )
    }));
  };

  const addTier = () => {
    const lastTier = formData.tiers[formData.tiers.length - 1];
    setFormData(prev => ({
      ...prev,
      tiers: [...prev.tiers, { min: lastTier.max, max: lastTier.max + 2, rate: lastTier.rate + 40 }]
    }));
  };

  const removeTier = (index) => {
    if (formData.tiers.length > 1) {
      setFormData(prev => ({
        ...prev,
        tiers: prev.tiers.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('請輸入運費設定名稱');
      return;
    }
    
    if (formData.logisticsTypes.length === 0) {
      alert('請選擇至少一種物流方式');
      return;
    }

    const rateData = {
      ...formData,
      baseRate: parseFloat(formData.baseRate),
      freeShippingThreshold: formData.freeShippingThreshold ? parseFloat(formData.freeShippingThreshold) : null
    };

    let success;
    if (isEditing) {
      success = logisticsDataManager.updateShippingRate(selectedRate.id, rateData);
    } else {
      success = logisticsDataManager.createShippingRate(rateData);
    }

    if (success) {
      loadShippingRates();
      setShowForm(false);
      setSelectedRate(null);
      alert(isEditing ? '運費設定更新成功' : '運費設定創建成功');
    } else {
      alert('操作失敗，請重試');
    }
  };

  const handleDelete = (rate) => {
    if (confirm(`確定要刪除運費設定「${rate.name}」嗎？`)) {
      // 這裡應該實現刪除功能
      alert('刪除功能待實現');
    }
  };

  const handleTestCalculation = () => {
    const result = logisticsDataManager.calculateShippingFee(
      testCalculation.logisticsType,
      testCalculation.weight,
      testCalculation.orderAmount
    );
    
    setTestCalculation(prev => ({
      ...prev,
      result
    }));
  };

  const getLogisticsTypeDisplayName = (type) => {
    const names = {
      [LogisticsType.CONVENIENCE_STORE]: '超商取貨',
      [LogisticsType.HOME_DELIVERY]: '宅配到府',
      [LogisticsType.POST_OFFICE]: '郵局配送',
      [LogisticsType.EXPRESS]: '快遞',
      [LogisticsType.PICKUP]: '自取'
    };
    return names[type] || type;
  };

  const getCalculationMethodDisplayName = (method) => {
    const names = {
      [CalculationMethod.WEIGHT]: '重量計費',
      [CalculationMethod.VOLUME]: '體積計費',
      [CalculationMethod.AMOUNT]: '金額計費',
      [CalculationMethod.QUANTITY]: '數量計費',
      [CalculationMethod.FIXED]: '固定費用'
    };
    return names[method] || method;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div>
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">運費設定管理</h1>
              <p className="text-gray-600">管理多維度運費計算規則、重量體積計費</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
            >
              + 新增運費設定
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 運費設定列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">運費設定列表</h2>
              
              <div className="space-y-4">
                {shippingRates.map((rate) => (
                  <div
                    key={rate.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRate?.id === rate.id
                        ? 'border-[#cc824d] bg-[#cc824d]/5'
                        : 'border-gray-200 hover:border-[#cc824d]/50'
                    }`}
                    onClick={() => setSelectedRate(rate)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{rate.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            rate.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rate.isActive ? '啟用' : '停用'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">適用方式:</span> {' '}
                          {rate.logisticsTypes.map(type => getLogisticsTypeDisplayName(type)).join(', ')}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">計費方式:</span> {getCalculationMethodDisplayName(rate.calculationMethod)}
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">基本費率:</span> {formatCurrency(rate.baseRate)}
                          {rate.freeShippingThreshold && (
                            <span className="ml-4">
                              <span className="font-medium">免運門檻:</span> {formatCurrency(rate.freeShippingThreshold)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(rate);
                          }}
                          className="text-[#cc824d] hover:text-[#b3723f] text-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(rate);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                    
                    {/* 費率階層預覽 */}
                    {rate.tiers && rate.tiers.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">費率階層:</div>
                        <div className="flex flex-wrap gap-2">
                          {rate.tiers.slice(0, 3).map((tier, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {tier.min}-{tier.max}kg: {formatCurrency(tier.rate)}
                            </span>
                          ))}
                          {rate.tiers.length > 3 && (
                            <span className="text-xs text-gray-400">+{rate.tiers.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {shippingRates.length === 0 && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">尚無運費設定</h3>
                  <p className="mt-1 text-sm text-gray-500">建立您的第一個運費計算規則</p>
                </div>
              )}
            </div>
          </div>

          {/* 運費計算器 */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">運費計算器</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">配送方式</label>
                  <select
                    value={testCalculation.logisticsType}
                    onChange={(e) => setTestCalculation(prev => ({
                      ...prev,
                      logisticsType: e.target.value
                    }))}
                    className="glass-select w-full font-chinese"
                  >
                    {Object.values(LogisticsType).map(type => (
                      <option key={type} value={type}>
                        {getLogisticsTypeDisplayName(type)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">重量 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={testCalculation.weight}
                    onChange={(e) => setTestCalculation(prev => ({
                      ...prev,
                      weight: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">訂單金額</label>
                  <input
                    type="number"
                    min="0"
                    value={testCalculation.orderAmount}
                    onChange={(e) => setTestCalculation(prev => ({
                      ...prev,
                      orderAmount: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handleTestCalculation}
                  className="w-full bg-[#cc824d] text-white py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
                >
                  計算運費
                </button>
                
                {testCalculation.result && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">計算結果</h3>
                    <div className="text-2xl font-bold text-[#cc824d] mb-1">
                      {formatCurrency(testCalculation.result.fee)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testCalculation.result.reason}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 選中的運費詳情 */}
            {selectedRate && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">運費設定詳情</h2>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">名稱:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedRate.name}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">狀態:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      selectedRate.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedRate.isActive ? '啟用' : '停用'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">計費方式:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {getCalculationMethodDisplayName(selectedRate.calculationMethod)}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">基本費率:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {formatCurrency(selectedRate.baseRate)}
                    </span>
                  </div>
                  
                  {selectedRate.freeShippingThreshold && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">免運門檻:</span>
                      <span className="ml-2 text-sm text-gray-900">
                        {formatCurrency(selectedRate.freeShippingThreshold)}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">適用方式:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedRate.logisticsTypes.map(type => (
                        <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {getLogisticsTypeDisplayName(type)}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {selectedRate.tiers && selectedRate.tiers.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">費率階層:</span>
                      <div className="mt-2 space-y-1">
                        {selectedRate.tiers.map((tier, index) => (
                          <div key={index} className="flex justify-between text-sm bg-gray-50 px-3 py-2 rounded">
                            <span>{tier.min} - {tier.max} kg</span>
                            <span className="font-medium">{formatCurrency(tier.rate)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 新增/編輯表單 Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditing ? '編輯運費設定' : '新增運費設定'}
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* 基本設定 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">設定名稱 *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="例：一般宅配"
                      required
                    />
                  </div>
                  
                  {/* 適用物流方式 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">適用物流方式 *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.values(LogisticsType).map(type => (
                        <label key={type} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.logisticsTypes.includes(type)}
                            onChange={() => handleLogisticsTypeToggle(type)}
                            className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
                          />
                          <span className="text-sm">{getLogisticsTypeDisplayName(type)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* 計費方式 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">計費方式</label>
                    <select
                      value={formData.calculationMethod}
                      onChange={(e) => handleInputChange('calculationMethod', e.target.value)}
                      className="glass-select w-full font-chinese"
                    >
                      {Object.values(CalculationMethod).map(method => (
                        <option key={method} value={method}>
                          {getCalculationMethodDisplayName(method)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 基本費率 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">基本費率</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.baseRate}
                      onChange={(e) => handleInputChange('baseRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    />
                  </div>
                  
                  {/* 免運門檻 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">免運門檻 (可選)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.freeShippingThreshold}
                      onChange={(e) => handleInputChange('freeShippingThreshold', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="留空表示無免運門檻"
                    />
                  </div>
                  
                  {/* 費率階層 (僅重量計費時顯示) */}
                  {formData.calculationMethod === CalculationMethod.WEIGHT && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-700">費率階層</label>
                        <button
                          type="button"
                          onClick={addTier}
                          className="text-[#cc824d] hover:text-[#b3723f] text-sm"
                        >
                          + 新增階層
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.tiers.map((tier, index) => (
                          <div key={index} className="grid grid-cols-4 gap-3 items-center">
                            <div>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={tier.min}
                                onChange={(e) => handleTierChange(index, 'min', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                                placeholder="最小值"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={tier.max}
                                onChange={(e) => handleTierChange(index, 'max', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                                placeholder="最大值"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={tier.rate}
                                onChange={(e) => handleTierChange(index, 'rate', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                                placeholder="費率"
                              />
                            </div>
                            <div>
                              {formData.tiers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTier(index)}
                                  className="text-red-600 hover:text-red-700 text-sm"
                                >
                                  刪除
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 啟用狀態 */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      啟用此運費設定
                    </label>
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
                  >
                    {isEditing ? '更新' : '創建'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingRateConfig;