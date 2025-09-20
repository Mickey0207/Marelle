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
import systemSettingsDataManager from '../utils/systemSettingsDataManager';

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
                ?üÁî®
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={settingKey}
                  checked={value === false}
                  onChange={() => handleInputChange(settingKey, false)}
                  className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
                />
                ?úÁî®
              </label>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                {value ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">Â∑≤Â???/span>
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">Â∑≤Â???/span>
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
                {setting.constraints.options.find(opt => opt.value === value)?.label || value || '?™Ë®≠ÂÆ?}
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
                placeholder="Ëº∏ÂÖ•?èÊ?Ë≥áÊ?"
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
                  {value ? (shouldShow ? value : '?¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä?) : '?™Ë®≠ÂÆ?}
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

    // ?êË®≠?∫Ê?Â≠óËº∏??
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
            <p className="text-gray-900">{value || '?™Ë®≠ÂÆ?}</p>
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
      { key: 'payment.credit_card_enabled', name: '‰ø°Áî®?°ÊîØ‰ª?, icon: CreditCardIcon },
      { key: 'payment.bank_transfer_enabled', name: '?ÄË°åË?Â∏?, icon: BuildingLibraryIcon },
      { key: 'payment.mobile_payment_enabled', name: 'Ë°åÂ??Ø‰?', icon: DevicePhoneMobileIcon }
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
        {/* ?ÅÈù¢Ê®ôÈ? */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">?Ø‰?Ë®≠Â?</h1>
            <p className="text-gray-600">ÁÆ°Á??Ø‰??πÂ??ÅÊ?Á∫åË≤ª?åÈ?ÊµÅÊ??ôË®≠ÂÆ?/p>
          </div>
        </div>

        {/* ?Ä?ãÊ?Á§?*/}
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
            {saveStatus === 'success' ? '?Ø‰?Ë®≠Â?Â∑≤Ê??üÂÑ≤Â≠? : '?≤Â?Â§±Ê?ÔºåË?Á®çÂ??çË©¶'}
          </div>
        )}

        {/* ?Ø‰??πÂ??Ä??*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <div key={method.key} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{method.name}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {method.enabled ? 'Â∑≤Â??? : 'Â∑≤Â???}
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

        {/* ?Ø‰?Ë®≠Â??ÖÁõÆ */}
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
                          ÂøÖÂ°´
                        </span>
                      )}
                      {(settingKey.includes('key') || settingKey.includes('secret')) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ?èÊ?Ë≥áÊ?
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{setting.description}</p>

                    {/* Ëº∏ÂÖ•Ê¨Ñ‰? */}
                    {renderInputField(settingKey, setting)}

                    {/* Ë®≠Â?Ë≥áË? */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>?àÊú¨: v{setting.version}</span>
                        <span>?¥Êñ∞?ÇÈ?: {new Date(setting.updatedAt).toLocaleString('zh-TW')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ?ç‰??âÈ? */}
                <div className="flex items-center space-x-2 ml-4">
                  {editingField === settingKey ? (
                    <>
                      <button
                        onClick={() => handleSave(settingKey)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="?≤Â?"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleCancel(settingKey)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="?ñÊ?"
                      >
                        ?
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(settingKey)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Á∑®ËºØ"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ?Ø‰?Ë®≠Â?Ë™™Ê? */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <InformationCircleIcon className="h-5 w-5 mr-2" />
            ?Ø‰?Ë®≠Â?Ë™™Ê?
          </h3>
          <div className="space-y-2 text-sm text-green-800">
            <p>??<strong>?Ø‰?Ë≤®Âπ£</strong>ÔºöÁ≥ªÁµ±È?Ë®≠Á?‰∫§Ê?Ë≤®Âπ£ÔºåÂΩ±?øÊ??âÂ??ÅÂ??πÈ°ØÁ§?/p>
            <p>??<strong>?Ø‰??πÂ?</strong>ÔºöÂèØ?ÆÁç®?üÁî®?ñÂ??®Â?Á®ÆÊîØ‰ªòÁÆ°??/p>
            <p>??<strong>?ãÁ?Ë≤ªË®≠ÂÆ?/strong>ÔºöÂèØË®≠Â??ÑÊîØ‰ªòÊñπÂºèÁ??ïÁ?Ë≤ªÁî®?æÂ?ÊØ?/p>
            <p>??<strong>API ?ëÈë∞</strong>ÔºöÁî®?ºÈÄ?é•Á¨¨‰??πÊîØ‰ªòÊ??ôÔ?Ë´ãÂ¶•?Ñ‰?ÁÆ?/p>
            <p>??<strong>Ê∏¨Ë©¶Ê®°Â?</strong>ÔºöÈ??ºÈ?ÊÆµÂª∫Ë≠∞‰Ωø?®Ê∏¨Ë©¶Áí∞Â¢ÉÈÄ≤Ë?È©óË?</p>
            <p>??<strong>ÂÆâÂÖ®?êÈ?</strong>ÔºöÊ??âÊ??üË??ôÈÉΩ?ÉÂ?ÂØÜÂÑ≤Â≠òÔ?ÂÆöÊ??¥Êñ∞?ëÈë∞‰ª•Á¢∫‰øùÂ???/p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
