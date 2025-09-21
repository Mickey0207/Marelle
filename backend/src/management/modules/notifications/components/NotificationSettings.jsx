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
import systemSettingsDataManager from '../../../../shared/utils/systemSettingsDataManager';

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
    // 模擬測試通知
    setTimeout(() => {
      setTestingNotification('');
      alert(`${type === 'email' ? '測試郵件' : '測試簡訊'}已發送`);
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
              placeholder="輸入密碼"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">
                {value ? '已設定••••••' : '未設定'}
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

    // 預設文字輸入欄
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">通知設定</h1>
            <p className="text-gray-600">管理系統通知渠道和發送設定</p>
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
              測試郵件
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
              測試簡訊
            </button>
          </div>
        </div>

        {/* 保存狀態訊息 */}
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
            {saveStatus === 'success' ? '通知設定已成功儲存' : '儲存失敗，請稍後再試'}
          </div>
        )}

        {/* 通知類型總覽 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">郵件通知</p>
                <p className="text-lg font-semibold text-gray-900">
                  {settings['notification.email_enabled']?.value ? '已啟用' : '已停用'}
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
                <p className="text-sm font-medium text-gray-600">簡訊通知</p>
                <p className="text-lg font-semibold text-gray-900">
                  {settings['notification.sms_enabled']?.value ? '已啟用' : '已停用'}
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
                <p className="text-sm font-medium text-gray-600">系統狀態</p>
                <p className="text-lg font-semibold text-gray-900">運行正常</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 通知設定項目 */}
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
                          必填
                        </span>
                      )}
                      {setting.requiresRestart && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          需要重啟
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
                        ✕
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

        {/* 通知設定說明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <InformationCircleIcon className="h-5 w-5 mr-2" />
            通知設定說明
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>郵件通知</strong>：用於發送訂單確認、驗證碼及設定變更通知</p>
            <p>• <strong>SMTP 設定</strong>：配置郵件發送伺服器，建議使用專業郵件服務</p>
            <p>• <strong>簡訊通知</strong>：用於即時重要訊息如驗證碼及緊急通知</p>
            <p>• <strong>測試功能</strong>：建議設定完成後執行測試確保運作正常</p>
            <p>• <strong>安全性</strong>：SMTP 密碼等敏感訊息以加密方式儲存</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
