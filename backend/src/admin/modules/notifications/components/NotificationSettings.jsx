import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  SpeakerWaveIcon,
  AtSymbolIcon,
  ServerIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  PencilIcon,
  EyeIcon,
  CogIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import systemSettingsDataManager from '../utils/systemSettingsDataManager';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  const [testingNotification, setTestingNotification] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const notificationSettings = systemSettingsDataManager.getSettingsByCategory('notification_management');
    setSettings(notificationSettings);
    setTempValues(Object.fromEntries(
      Object.entries(notificationSettings).map(([key, setting]) => [key, setting.value])
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
    const validation = systemSettingsDataManager.validateSetting('notification_management', settingKey, newValue);
    
    if (!validation.valid) {
      setValidationErrors(prev => ({
        ...prev,
        [settingKey]: validation.error
      }));
      return;
    }

    try {
      systemSettingsDataManager.updateSetting('notification_management', settingKey, newValue);
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

  const handleTestNotification = (type) => {
    setTestingNotification(type);
    // Ê®°Êì¨Ê∏¨Ë©¶?éÁ?
    setTimeout(() => {
      setTestingNotification('');
      alert(`${type === 'email' ? 'Ê∏¨Ë©¶?µ‰ª∂' : 'Ê∏¨Ë©¶Á∞°Ë?'}Â∑≤Áôº?ÅÔ?`);
    }, 2000);
  };

  const getFieldIcon = (settingKey) => {
    const icons = {
      'notification.email_enabled': <EnvelopeIcon className="h-5 w-5" />,
      'notification.email_smtp_host': <ServerIcon className="h-5 w-5" />,
      'notification.email_smtp_port': <CogIcon className="h-5 w-5" />,
      'notification.email_username': <AtSymbolIcon className="h-5 w-5" />,
      'notification.email_password': <KeyIcon className="h-5 w-5" />,
      'notification.sms_enabled': <DevicePhoneMobileIcon className="h-5 w-5" />,
      'notification.push_enabled': <SpeakerWaveIcon className="h-5 w-5" />
    };
    return icons[settingKey] || <BellIcon className="h-5 w-5" />;
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

    if (setting.dataType === 'password') {
      return (
        <div className="space-y-2">
          {isEditing ? (
            <input
              type="password"
              value={value || ''}
              onChange={(e) => handleInputChange(settingKey, e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                hasError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ëº∏ÂÖ•ÂØÜÁ¢º"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">
                {value ? '?¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä? : '?™Ë®≠ÂÆ?}
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
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleInputChange(settingKey, Number(e.target.value))}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                hasError ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{value}</p>
            </div>
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* ?ÅÈù¢Ê®ôÈ? */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">?öÁü•Ë®≠Â?</h1>
            <p className="text-gray-600">ÁÆ°Á?Á≥ªÁµ±?öÁü•?çÂ??åË??ØÁôº?ÅË®≠ÂÆ?/p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleTestNotification('email')}
              disabled={!settings['notification.email_enabled']?.value || testingNotification === 'email'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingNotification === 'email' ? (
                <ClockIcon className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <EnvelopeIcon className="h-5 w-5 mr-2" />
              )}
              Ê∏¨Ë©¶?µ‰ª∂
            </button>
            <button
              onClick={() => handleTestNotification('sms')}
              disabled={!settings['notification.sms_enabled']?.value || testingNotification === 'sms'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingNotification === 'sms' ? (
                <ClockIcon className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
              )}
              Ê∏¨Ë©¶Á∞°Ë?
            </button>
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
            {saveStatus === 'success' ? '?öÁü•Ë®≠Â?Â∑≤Ê??üÂÑ≤Â≠? : '?≤Â?Â§±Ê?ÔºåË?Á®çÂ??çË©¶'}
          </div>
        )}

        {/* ?öÁü•?Ä?ãÁ∏ΩË¶?*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">?µ‰ª∂?öÁü•</p>
                <p className="text-lg font-semibold text-gray-900">
                  {settings['notification.email_enabled']?.value ? 'Â∑≤Â??? : 'Â∑≤Â???}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                settings['notification.email_enabled']?.value ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <EnvelopeIcon className={`h-6 w-6 ${
                  settings['notification.email_enabled']?.value ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Á∞°Ë??öÁü•</p>
                <p className="text-lg font-semibold text-gray-900">
                  {settings['notification.sms_enabled']?.value ? 'Â∑≤Â??? : 'Â∑≤Â???}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                settings['notification.sms_enabled']?.value ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <DevicePhoneMobileIcon className={`h-6 w-6 ${
                  settings['notification.sms_enabled']?.value ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Á≥ªÁµ±?Ä??/p>
                <p className="text-lg font-semibold text-gray-900">Ê≠?∏∏?ã‰?</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ?öÁü•Ë®≠Â??ÖÁõÆ */}
        <div className="space-y-6">
          {Object.entries(settings).map(([settingKey, setting]) => (
            <div key={settingKey} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
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
                      {setting.requiresRestart && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ?ÄË¶ÅÈ???
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

        {/* ?öÁü•Ë®≠Â?Ë™™Ê? */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <InformationCircleIcon className="h-5 w-5 mr-2" />
            ?öÁü•Ë®≠Â?Ë™™Ê?
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>??<strong>?µ‰ª∂?öÁü•</strong>ÔºöÁî®?ºÁôº?ÅË??ÆÁ¢∫Ë™ç„ÄÅÂ?Á¢ºÈ?Ë®≠Á??çË??öÁü•</p>
            <p>??<strong>SMTP Ë®≠Â?</strong>ÔºöÈ?ÁΩÆÈÉµ‰ª∂Áôº?Å‰º∫?çÂô®ÔºåÂª∫Ë≠∞‰Ωø?®Â?Ê•≠Á??µ‰ª∂?çÂ?</p>
            <p>??<strong>Á∞°Ë??öÁü•</strong>ÔºöÁî®?ºÂç≥?ÇÈ?Ë¶ÅË??ØÔ?Â¶ÇÈ?Ë≠âÁ¢º?ÅÁ??•ÈÄöÁü•</p>
            <p>??<strong>Ê∏¨Ë©¶?üËÉΩ</strong>ÔºöÂª∫Ë≠∞Ë®≠ÂÆöÂ??êÂ??àÂü∑Ë°åÊ∏¨Ë©¶Á¢∫‰øùÊ??ôÊ≠£Â∏?/p>
            <p>??<strong>ÂÆâÂÖ®?êÈ?</strong>ÔºöSMTP ÂØÜÁ¢ºÁ≠âÊ??üË?Ë®äÊ?‰ª•Â?ÂØÜÊñπÂºèÂÑ≤Â≠?/p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
