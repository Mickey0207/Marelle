import React, { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  KeyIcon,
  LockClosedIcon,
  ClockIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  PencilIcon,
  ShieldExclamationIcon,
  CpuChipIcon,
  ServerIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import systemSettingsDataManager from '../utils/systemSettingsDataManager';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  const [securityScore, setSecurityScore] = useState(0);
  const [securityRecommendations, setSecurityRecommendations] = useState([]);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    calculateSecurityScore();
  }, [settings]);

  const loadSettings = () => {
    const securitySettings = systemSettingsDataManager.getSettingsByCategory('system_security');
    setSettings(securitySettings);
    setTempValues(Object.fromEntries(
      Object.entries(securitySettings).map(([key, setting]) => [key, setting.value])
    ));
  };

  const calculateSecurityScore = () => {
    let score = 0;
    const recommendations = [];

    // 密碼最小長度檢查
    const passwordLength = settings['security.password_min_length']?.value || 0;
    if (passwordLength >= 12) {
      score += 25;
    } else if (passwordLength >= 8) {
      score += 15;
    } else {
      recommendations.push('建議密碼最小長度設為 12 個字元以提高安全性');
    }

    // 密碼複雜度檢查
    const requireUppercase = settings['security.password_require_uppercase']?.value;
    if (requireUppercase) {
      score += 20;
    } else {
      recommendations.push('建議要求密碼包含大寫字母');
    }

    // 登入嘗試次數檢查
    const maxAttempts = settings['security.login_max_attempts']?.value || 0;
    if (maxAttempts <= 3) {
      score += 20;
    } else if (maxAttempts <= 5) {
      score += 15;
    } else {
      recommendations.push('建議將登入最大嘗試次數設為 3 次');
    }

    // 會話超時檢查
    const sessionTimeout = settings['security.session_timeout']?.value || 0;
    if (sessionTimeout <= 15) {
      score += 20;
    } else if (sessionTimeout <= 30) {
      score += 15;
    } else {
      recommendations.push('建議將會話超時時間設為 30 分鐘以內');
    }

    // 額外安全功能
    score += 15; // 基礎安全配置

    setSecurityScore(Math.min(score, 100));
    setSecurityRecommendations(recommendations);
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
    const validation = systemSettingsDataManager.validateSetting('system_security', settingKey, newValue);
    
    if (!validation.valid) {
      setValidationErrors(prev => ({
        ...prev,
        [settingKey]: validation.error
      }));
      return;
    }

    try {
      systemSettingsDataManager.updateSetting('system_security', settingKey, newValue);
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
    
    // 清除之前的驗證錯誤
    if (validationErrors[settingKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[settingKey];
        return newErrors;
      });
    }
  };

  const handleReset = (settingKey) => {
    if (window.confirm('確定要重置此安全設定為預設值嗎？這可能會影響系統安全性。')) {
      systemSettingsDataManager.resetSetting('system_security', settingKey);
      loadSettings();
      setSaveStatus('reset');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const getSecurityLevel = (score) => {
    if (score >= 90) return { level: '優秀', color: 'text-green-600 bg-green-50 border-green-200' };
    if (score >= 70) return { level: '良好', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (score >= 50) return { level: '中等', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    return { level: '需改善', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const getFieldIcon = (settingKey) => {
    const icons = {
      'security.password_min_length': <KeyIcon className="h-5 w-5" />,
      'security.password_require_uppercase': <LockClosedIcon className="h-5 w-5" />,
      'security.password_require_lowercase': <LockClosedIcon className="h-5 w-5" />,
      'security.password_require_numbers': <CpuChipIcon className="h-5 w-5" />,
      'security.password_require_symbols': <ShieldExclamationIcon className="h-5 w-5" />,
      'security.login_max_attempts': <UserIcon className="h-5 w-5" />,
      'security.session_timeout': <ClockIcon className="h-5 w-5" />,
      'security.enable_2fa': <ShieldCheckIcon className="h-5 w-5" />,
      'security.ip_whitelist': <GlobeAltIcon className="h-5 w-5" />
    };
    return icons[settingKey] || <ShieldCheckIcon className="h-5 w-5" />;
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
            <div className="flex items-center space-x-3">
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
              {setting.constraints && (
                <span className="text-sm text-gray-500">
                  ({setting.constraints.minValue}-{setting.constraints.maxValue})
                </span>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{value}</p>
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

  const securityLevel = getSecurityLevel(securityScore);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">安全設定</h1>
            <p className="text-gray-600">管理系統安全相關配置和政策</p>
          </div>
        </div>

        {/* 狀態提示 */}
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center ${
            saveStatus === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            saveStatus === 'reset' ? 'bg-blue-50 border-blue-200 text-blue-800' :
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            {saveStatus === 'success' && <CheckCircleIcon className="h-5 w-5 mr-2" />}
            {saveStatus === 'reset' && <ArrowPathIcon className="h-5 w-5 mr-2" />}
            {saveStatus === 'error' && <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
            {saveStatus === 'success' && '安全設定已成功儲存'}
            {saveStatus === 'reset' && '安全設定已重置為預設值'}
            {saveStatus === 'error' && '儲存失敗，請稍後再試'}
          </div>
        )}

        {/* 安全評分 */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
            安全評分
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold text-gray-900">{securityScore}</div>
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${securityLevel.color}`}>
                  {securityLevel.level}
                </span>
                <p className="text-sm text-gray-600 mt-1">系統安全等級</p>
              </div>
            </div>
            <div className="w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - securityScore / 100)}`}
                  className={securityScore >= 70 ? 'text-green-500' : securityScore >= 50 ? 'text-yellow-500' : 'text-red-500'}
                />
              </svg>
            </div>
          </div>

          {/* 安全建議 */}
          {securityRecommendations.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                安全建議
              </h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                {securityRecommendations.map((recommendation, index) => (
                  <li key={index}>• {recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 安全設定項目 */}
        <div className="space-y-6">
          {Object.entries(settings).map(([settingKey, setting]) => (
            <div key={settingKey} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-red-100 rounded-lg">
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
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        安全設定
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{setting.description}</p>

                    {/* 輸入欄位 */}
                    {renderInputField(settingKey, setting)}

                    {/* 設定資訊 */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>版本: v{setting.version}</span>
                        <span>更新時間: {new Date(setting.updatedAt).toLocaleString('zh-TW')}</span>
                        {setting.requiresRestart && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            需要重啟
                          </span>
                        )}
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
                    <>
                      <button
                        onClick={() => handleEdit(settingKey)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="編輯"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReset(settingKey)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="重置為預設值"
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 安全說明 */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
            <ShieldExclamationIcon className="h-5 w-5 mr-2" />
            安全設定重要說明
          </h3>
          <div className="space-y-2 text-sm text-red-800">
            <p>• <strong>密碼政策</strong>：強密碼政策可以有效防止暴力破解攻擊</p>
            <p>• <strong>登入限制</strong>：限制失敗登入次數可以防止惡意嘗試</p>
            <p>• <strong>會話管理</strong>：適當的會話超時可以降低帳號被盜用風險</p>
            <p>• <strong>重要提醒</strong>：修改安全設定前請確保您了解其影響</p>
            <p>• <strong>備份建議</strong>：修改前建議先匯出目前設定作為備份</p>
            <p>• ⚠️ 不當的安全設定可能會影響系統安全性，請謹慎操作</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;