import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  CogIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import systemSettingsDataManager from '../../../lib/mocks/settings/systemSettingsDataManager';

const PaymentSettings = () => {
  const [settings, setSettings] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  const [showSensitiveData, setShowSensitiveData] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const paymentSettings = systemSettingsDataManager.getSettingsByCategory('payment_management');
    setSettings(paymentSettings);
    setTempValues(Object.fromEntries(
      Object.entries(paymentSettings).map(([key, setting]) => [key, setting.value])
    ));
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
    const validation = systemSettingsDataManager.validateSetting('payment_management', settingKey, newValue);
    
    if (!validation.valid) {
      setValidationErrors(prev => ({
        ...prev,
        [settingKey]: validation.error
      }));
      return;
    }

    try {
      systemSettingsDataManager.updateSetting('payment_management', settingKey, newValue);
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

  const toggleSensitiveData = (field) => {
    setShowSensitiveData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getFieldIcon = (settingKey) => {
    const icons = {
      'payment.currency': <CurrencyDollarIcon className="h-5 w-5" />,
      'payment.credit_card_enabled': <CreditCardIcon className="h-5 w-5" />,
      'payment.bank_transfer_enabled': <BuildingLibraryIcon className="h-5 w-5" />,
      'payment.mobile_payment_enabled': <DevicePhoneMobileIcon className="h-5 w-5" />,
      'payment.handling_fee': <BanknotesIcon className="h-5 w-5" />,
      'payment.gateway_api_key': <ShieldCheckIcon className="h-5 w-5" />,
      'payment.merchant_id': <CogIcon className="h-5 w-5" />
    };
    return icons[settingKey] || <CurrencyDollarIcon className="h-5 w-5" />;
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

    if (setting.dataType === 'select' && setting.constraints?.options) {
      return (
        <div className="space-y-2">
          {isEditing ? (
            <select
              value={value || ''}
              onChange={(e) => handleInputChange(settingKey, e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                hasError ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {setting.constraints.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">
                {setting.constraints.options.find(opt => opt.value === value)?.label || value || '未設定'}
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

    if (setting.dataType === 'number') {
      return (
        <div className="space-y-2">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={value || ''}
                onChange={(e) => handleInputChange(settingKey, Number(e.target.value))}
                step={settingKey.includes('fee') ? '0.01' : '1'}
                min={setting.constraints?.minValue}
                max={setting.constraints?.maxValue}
                className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  hasError ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {settingKey.includes('fee') && <span className="text-sm text-gray-500">%</span>}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">
                {value}{settingKey.includes('fee') ? '%' : ''}
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

    if (setting.dataType === 'password' || settingKey.includes('key') || settingKey.includes('secret')) {
      const isSensitive = true;
      const shouldShow = showSensitiveData[settingKey];
      
      return (
        <div className="space-y-2">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type={shouldShow ? 'text' : 'password'}
                value={value || ''}
                onChange={(e) => handleInputChange(settingKey, e.target.value)}
                className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                  hasError ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="輸入敏感資料"
              />
              <button
                type="button"
                onClick={() => toggleSensitiveData(settingKey)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {shouldShow ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-gray-900">
                  {value ? (shouldShow ? value : '••••••••••••••••') : '未設定'}
                </p>
                {value && (
                  <button
                    type="button"
                    onClick={() => toggleSensitiveData(settingKey)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {shouldShow ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                )}
              </div>
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

  const getPaymentMethodStatus = () => {
    const methods = [
      { key: 'payment.credit_card_enabled', name: '信用卡支付', icon: CreditCardIcon },
      { key: 'payment.bank_transfer_enabled', name: '銀行轉帳', icon: BuildingLibraryIcon },
      { key: 'payment.mobile_payment_enabled', name: '行動支付', icon: DevicePhoneMobileIcon }
    ];

    return methods.map(method => ({
      ...method,
      enabled: settings[method.key]?.value || false
    }));
  };

  const paymentMethods = getPaymentMethodStatus();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">支付設定</h1>
            <p className="text-gray-600">管理支付方式、手續費和金流服務設定</p>
          </div>
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
            {saveStatus === 'success' ? '支付設定已成功儲存' : '儲存失敗，請稍後再試'}
          </div>
        )}

        {/* 支付方式狀態 */}
  <div className="grid grid-cols-3 gap-6 mb-8">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <div key={method.key} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{method.name}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {method.enabled ? '已啟用' : '已停用'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    method.enabled ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      method.enabled ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 支付設定項目 */}
        <div className="space-y-6">
          {Object.entries(settings).map(([settingKey, setting]) => (
            <div key={settingKey} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-green-100 rounded-lg">
                    {getFieldIcon(settingKey)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{setting.displayName}</h3>
                      {setting.isRequired && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          必填
                        </span>
                      )}
                      {(settingKey.includes('key') || settingKey.includes('secret')) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          敏感資料
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{setting.description}</p>

                    {/* 輸入欄位 */}
                    {renderInputField(settingKey, setting)}

                    {/* 設定資訊 */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>版本: v{setting.version}</span>
                        <span>更新時間: {new Date(setting.updatedAt).toLocaleString('zh-TW')}</span>
                      </div>
                    </div>
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

        {/* 支付設定說明 */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <InformationCircleIcon className="h-5 w-5 mr-2" />
            支付設定說明
          </h3>
          <div className="space-y-2 text-sm text-green-800">
            <p>• <strong>支付貨幣</strong>：系統預設的交易貨幣，影響所有商品定價顯示</p>
            <p>• <strong>支付方式</strong>：可單獨啟用或停用各種支付管道</p>
            <p>• <strong>手續費設定</strong>：可設定各支付方式的處理費用百分比</p>
            <p>• <strong>API 金鑰</strong>：用於連接第三方支付服務，請妥善保管</p>
            <p>• <strong>測試模式</strong>：開發階段建議使用測試環境進行驗證</p>
            <p>• <strong>安全提醒</strong>：所有敏感資料都會加密儲存，定期更新金鑰以確保安全</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;