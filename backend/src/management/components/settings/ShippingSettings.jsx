import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  GlobeAltIcon,
  ScaleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  BuildingOfficeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import systemSettingsDataManager from '../../../shared/utils/systemSettingsDataManager';

const ShippingSettings = () => {
  const [settings, setSettings] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  const [shippingZones, setShippingZones] = useState([]);
  const [showZoneModal, setShowZoneModal] = useState(false);

  useEffect(() => {
    loadSettings();
    loadShippingZones();
  }, []);

  const loadSettings = () => {
    const shippingSettings = systemSettingsDataManager.getSettingsByCategory('shipping_management');
    setSettings(shippingSettings);
    setTempValues(Object.fromEntries(
      Object.entries(shippingSettings).map(([key, setting]) => [key, setting.value])
    ));
  };

  const loadShippingZones = () => {
    // 模擬配送區域數據
    setShippingZones([
      {
        id: 1,
        name: '台灣本島',
        regions: ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市'],
        baseRate: 80,
        freeShippingThreshold: 1000,
        estimatedDays: '1-2'
      },
      {
        id: 2,
        name: '離島地區',
        regions: ['金門縣', '連江縣', '澎湖縣'],
        baseRate: 150,
        freeShippingThreshold: 2000,
        estimatedDays: '3-5'
      }
    ]);
  };

  const handleEdit = (settingKey) => {
    setEditingField(settingKey);
    setTempValues(prev => ({
      ...prev,
      [settingKey]: settings[settingKey]?.value
    }));
  };

  const handleCancel = (settingKey) => {
    setEditingField(null);
    setTempValues(prev => ({
      ...prev,
      [settingKey]: settings[settingKey]?.value
    }));
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[settingKey];
      return newErrors;
    });
  };

  const handleSave = async (settingKey) => {
    const newValue = tempValues[settingKey];
    const validation = systemSettingsDataManager.validateSetting('shipping_management', settingKey, newValue);
    
    if (!validation.valid) {
      setValidationErrors(prev => ({
        ...prev,
        [settingKey]: validation.error
      }));
      return;
    }

    try {
      systemSettingsDataManager.updateSetting('shipping_management', settingKey, newValue);
      setEditingField(null);
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[settingKey];
        return newErrors;
      });
      setSaveStatus('success');
      loadSettings();
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleInputChange = (settingKey, value) => {
    setTempValues(prev => ({
      ...prev,
      [settingKey]: value
    }));
    
    if (validationErrors[settingKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[settingKey];
        return newErrors;
      });
    }
  };

  const getFieldIcon = (settingKey) => {
    const icons = {
      'shipping.free_shipping_threshold': <CurrencyDollarIcon className="h-5 w-5" />,
      'shipping.default_rate': <TruckIcon className="h-5 w-5" />,
      'shipping.processing_days': <ClockIcon className="h-5 w-5" />,
      'shipping.weight_based_pricing': <ScaleIcon className="h-5 w-5" />,
      'shipping.domestic_zones': <MapPinIcon className="h-5 w-5" />,
      'shipping.international_enabled': <GlobeAltIcon className="h-5 w-5" />
    };
    return icons[settingKey] || <TruckIcon className="h-5 w-5" />;
  };

  const renderInputField = (settingKey, setting) => {
    const isEditing = editingField === settingKey;
    const value = isEditing ? tempValues[settingKey] : setting.value;
    const hasError = validationErrors[settingKey];

    if (setting.dataType === 'boolean') {
      return (
        <div className="space-y-2">
          {isEditing ? (
            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={settingKey}
                  checked={value === true}
                  onChange={() => handleInputChange(settingKey, true)}
                  className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
                />
                啟用
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={settingKey}
                  checked={value === false}
                  onChange={() => handleInputChange(settingKey, false)}
                  className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
                />
                停用
              </label>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                {value ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">已啟用</span>
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">已停用</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (setting.dataType === 'number') {
      return (
        <div className="space-y-2">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={value || ''}
                onChange={(e) => handleInputChange(settingKey, Number(e.target.value))}
                min={setting.constraints?.minValue}
                max={setting.constraints?.maxValue}
                className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  hasError ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {settingKey.includes('threshold') || settingKey.includes('rate') ? (
                <span className="text-sm text-gray-500">元</span>
              ) : settingKey.includes('days') ? (
                <span className="text-sm text-gray-500">天</span>
              ) : null}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">
                {value}
                {settingKey.includes('threshold') || settingKey.includes('rate') ? ' 元' : 
                 settingKey.includes('days') ? ' 天' : ''}
              </p>
            </div>
          )}
          {hasError && (
            <p className="text-sm text-red-600 flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
              {hasError}
            </p>
          )}
        </div>
      );
    }

    // 預設為文字輸入
    return (
      <div className="space-y-2">
        {isEditing ? (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(settingKey, e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
              hasError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={setting.description}
          />
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-900">{value || '未設定'}</p>
          </div>
        )}
        {hasError && (
          <p className="text-sm text-red-600 flex items-center">
            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
            {hasError}
          </p>
        )}
      </div>
    );
  };

  const calculateShippingCost = (orderAmount, zone) => {
    if (orderAmount >= zone.freeShippingThreshold) {
      return 0;
    }
    return zone.baseRate;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">物流設定</h1>
            <p className="text-gray-600">管理配送區域、運費計算和物流服務設定</p>
          </div>
          <button
            onClick={() => setShowZoneModal(true)}
            className="bg-[#cc824d] text-white px-6 py-3 rounded-lg hover:bg-[#b8753f] transition-colors flex items-center font-medium"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新增配送區域
          </button>
        </div>

        {/* 狀態提示 */}
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center ${
            saveStatus === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            {saveStatus === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            )}
            {saveStatus === 'success' ? '物流設定已成功儲存' : '儲存失敗，請稍後再試'}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：基本設定 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本物流設定 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                基本物流設定
              </h3>
              
              <div className="space-y-6">
                {Object.entries(settings).map(([settingKey, setting]) => (
                  <div key={settingKey} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          {getFieldIcon(settingKey)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-base font-semibold text-gray-900">{setting.displayName}</h4>
                            {setting.isRequired && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                必填
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{setting.description}</p>

                          {/* 輸入欄位 */}
                          {renderInputField(settingKey, setting)}
                        </div>
                      </div>

                      {/* 操作按鈕 */}
                      <div className="flex items-center space-x-2 ml-4">
                        {editingField === settingKey ? (
                          <>
                            <button
                              onClick={() => handleSave(settingKey)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="儲存"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleCancel(settingKey)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="取消"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(settingKey)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="編輯"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 配送區域管理 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                配送區域管理
              </h3>
              
              <div className="space-y-4">
                {shippingZones.map((zone) => (
                  <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">{zone.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          覆蓋區域：{zone.regions.join('、')}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">基本運費</span>
                            <p className="font-medium text-gray-900">{zone.baseRate} 元</p>
                          </div>
                          <div>
                            <span className="text-gray-500">免運門檻</span>
                            <p className="font-medium text-gray-900">{zone.freeShippingThreshold} 元</p>
                          </div>
                          <div>
                            <span className="text-gray-500">預計送達</span>
                            <p className="font-medium text-gray-900">{zone.estimatedDays} 天</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="編輯">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="刪除">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：運費計算器和說明 */}
          <div className="space-y-6">
            {/* 運費計算器 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ScaleIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                運費計算器
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">訂單金額</label>
                  <input
                    type="number"
                    placeholder="輸入訂單金額"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">配送區域</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent">
                    <option value="">選擇配送區域</option>
                    {shippingZones.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </div>
                
                <button className="w-full bg-[#cc824d] text-white py-2 rounded-lg hover:bg-[#b8753f] transition-colors">
                  計算運費
                </button>
                
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">計算結果將顯示在這裡</p>
                </div>
              </div>
            </div>

            {/* 物流統計 */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                物流統計
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">總配送區域</span>
                  <span className="font-medium text-gray-900">{shippingZones.length} 個</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">平均運費</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(shippingZones.reduce((sum, zone) => sum + zone.baseRate, 0) / shippingZones.length)} 元
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">免運門檻</span>
                  <span className="font-medium text-gray-900">{settings['shipping.free_shipping_threshold']?.value} 元</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">處理時間</span>
                  <span className="font-medium text-gray-900">{settings['shipping.processing_days']?.value} 天</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 物流設定說明 */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
            <InformationCircleIcon className="h-5 w-5 mr-2" />
            物流設定說明
          </h3>
          <div className="space-y-2 text-sm text-orange-800">
            <p>• <strong>免運門檻</strong>：達到此金額的訂單將享有免費配送服務</p>
            <p>• <strong>預設運費</strong>：未達免運門檻訂單的標準配送費用</p>
            <p>• <strong>處理天數</strong>：訂單確認後到商品出貨的作業時間</p>
            <p>• <strong>配送區域</strong>：可為不同地區設定不同的運費和配送時間</p>
            <p>• <strong>計算方式</strong>：可選擇按重量、體積或固定費率計算運費</p>
            <p>• <strong>建議</strong>：定期檢視配送政策以確保符合成本效益和客戶需求</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingSettings;