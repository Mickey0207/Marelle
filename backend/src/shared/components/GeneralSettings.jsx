import React, { useState, useEffect } from 'react';
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import systemSettingsDataManager from '../utils/systemSettingsDataManager';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const coreSettings = systemSettingsDataManager.getSettingsByCategory('system_core');
    setSettings(coreSettings);
    setTempValues(Object.fromEntries(
      Object.entries(coreSettings).map(([key, setting]) => [key, setting.value])
    ));
  };

  const handleEdit = (settingKey) => {
    setEditingField(settingKey);
    setTempValues(prev => ({
      ...prev,
      [settingKey]: settings[settingKey]?.value || ''
    }));
  };

  const handleCancel = (settingKey) => {
    setEditingField(null);
    setTempValues(prev => ({
      ...prev,
      [settingKey]: settings[settingKey]?.value || ''
    }));
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[settingKey];
      return newErrors;
    });
  };

  const handleSave = async (settingKey) => {
    const newValue = tempValues[settingKey];
    const validation = systemSettingsDataManager.validateSetting('system_core', settingKey, newValue);
    
    if (!validation.valid) {
      setValidationErrors(prev => ({
        ...prev,
        [settingKey]: validation.error
      }));
      return;
    }

    try {
      systemSettingsDataManager.updateSetting('system_core', settingKey, newValue);
      setEditingField(null);
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[settingKey];
        return newErrors;
      });
      setSaveStatus('success');
      setUnsavedChanges(false);
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
    setUnsavedChanges(true);
    
    // æ¸…é™¤ä¹‹å??„é?è­‰éŒ¯èª?
    if (validationErrors[settingKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[settingKey];
        return newErrors;
      });
    }
  };

  const handleReset = (settingKey) => {
    if (window.confirm('ç¢ºå?è¦é?ç½®æ­¤è¨­å??ºé?è¨­å€¼å?ï¼?)) {
      systemSettingsDataManager.resetSetting('system_core', settingKey);
      loadSettings();
      setSaveStatus('reset');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleSaveAll = () => {
    const updates = [];
    let hasErrors = false;

    Object.keys(tempValues).forEach(settingKey => {
      if (tempValues[settingKey] !== settings[settingKey]?.value) {
        const validation = systemSettingsDataManager.validateSetting('system_core', settingKey, tempValues[settingKey]);
        if (!validation.valid) {
          setValidationErrors(prev => ({
            ...prev,
            [settingKey]: validation.error
          }));
          hasErrors = true;
        } else {
          updates.push({
            category: 'system_core',
            key: settingKey,
            value: tempValues[settingKey]
          });
        }
      }
    });

    if (hasErrors) {
      setSaveStatus('validation_error');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    if (updates.length > 0) {
      systemSettingsDataManager.updateMultipleSettings(updates);
      setUnsavedChanges(false);
      setSaveStatus('success');
      loadSettings();
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const getFieldIcon = (settingKey) => {
    const icons = {
      'system.name': <BuildingOfficeIcon className="h-5 w-5" />,
      'system.description': <InformationCircleIcon className="h-5 w-5" />,
      'system.contact_email': <EnvelopeIcon className="h-5 w-5" />,
      'system.phone': <PhoneIcon className="h-5 w-5" />,
      'system.address': <MapPinIcon className="h-5 w-5" />,
      'system.website': <GlobeAltIcon className="h-5 w-5" />,
      'system.timezone': <ClockIcon className="h-5 w-5" />,
      'system.language': <LanguageIcon className="h-5 w-5" />
    };
    return icons[settingKey] || <InformationCircleIcon className="h-5 w-5" />;
  };

  const renderInputField = (settingKey, setting) => {
    const isEditing = editingField === settingKey;
    const value = isEditing ? tempValues[settingKey] : setting.value;
    const hasError = validationErrors[settingKey];

    if (setting.dataType === 'textarea') {
      return (
        <div className="space-y-2">
          {isEditing ? (
            <textarea
              value={value || ''}
              onChange={(e) => handleInputChange(settingKey, e.target.value)}
              rows={4}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
                hasError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={setting.description}
            />
          ) : (
            <div className="min-h-[100px] p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap">{value || '?ªè¨­å®?}</p>
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
                {setting.constraints.options.find(opt => opt.value === value)?.label || value || '?ªè¨­å®?}
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

    // ?è¨­?ºæ?å­—è¼¸??
    return (
      <div className="space-y-2">
        {isEditing ? (
          <input
            type={setting.dataType === 'email' ? 'email' : 
                  setting.dataType === 'number' ? 'number' : 
                  setting.dataType === 'url' ? 'url' : 'text'}
            value={value || ''}
            onChange={(e) => handleInputChange(settingKey, e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent ${
              hasError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={setting.description}
          />
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-900">{value || '?ªè¨­å®?}</p>
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
        {/* ?é¢æ¨™é? */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ä¸€?¬è¨­å®?/h1>
            <p className="text-gray-600">ç®¡ç?ç³»çµ±?„åŸº?¬è?è¨Šå??¯çµ¡?¹å?</p>
          </div>
          <div className="flex space-x-3">
            {unsavedChanges && (
              <button
                onClick={handleSaveAll}
                className="bg-[#cc824d] text-white px-6 py-3 rounded-lg hover:bg-[#b8753f] transition-colors flex items-center font-medium"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                ?²å??€?‰è???
              </button>
            )}
          </div>
        </div>

        {/* ?€?‹æ?ç¤?*/}
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center ${
            saveStatus === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            saveStatus === 'reset' ? 'bg-blue-50 border-blue-200 text-blue-800' :
            saveStatus === 'validation_error' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            {saveStatus === 'success' && <CheckCircleIcon className="h-5 w-5 mr-2" />}
            {saveStatus === 'reset' && <ArrowPathIcon className="h-5 w-5 mr-2" />}
            {saveStatus === 'validation_error' && <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
            {saveStatus === 'error' && <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
            {saveStatus === 'success' && 'è¨­å?å·²æ??Ÿå„²å­?}
            {saveStatus === 'reset' && 'è¨­å?å·²é?ç½®ç‚º?è¨­??}
            {saveStatus === 'validation_error' && 'è«‹ä¿®æ­??è­‰éŒ¯èª¤å??è©¦'}
            {saveStatus === 'error' && '?²å?å¤±æ?ï¼Œè?ç¨å??è©¦'}
          </div>
        )}

        {/* è¨­å??…ç›® */}
        <div className="space-y-6">
          {Object.entries(settings).map(([settingKey, setting]) => (
            <div key={settingKey} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getFieldIcon(settingKey)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{setting.displayName}</h3>
                      {setting.isRequired && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          å¿…å¡«
                        </span>
                      )}
                      {setting.isSystem && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ç³»çµ±è¨­å?
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{setting.description}</p>

                    {/* è¼¸å…¥æ¬„ä? */}
                    {renderInputField(settingKey, setting)}

                    {/* è¨­å?è³‡è? */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>?ˆæœ¬: v{setting.version}</span>
                        <span>?´æ–°?‚é?: {new Date(setting.updatedAt).toLocaleString('zh-TW')}</span>
                        {setting.requiresRestart && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ?€è¦é???
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ?ä??‰é? */}
                <div className="flex items-center space-x-2 ml-4">
                  {editingField === settingKey ? (
                    <>
                      <button
                        onClick={() => handleSave(settingKey)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="?²å?"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleCancel(settingKey)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="?–æ?"
                      >
                        ?
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(settingKey)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="ç·¨è¼¯"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReset(settingKey)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="?ç½®?ºé?è¨­å€?
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

        {/* è¨­å?èªªæ? */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <InformationCircleIcon className="h-5 w-5 mr-2" />
            è¨­å?èªªæ?
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>??<strong>ç³»çµ±?ç¨±</strong>ï¼šé¡¯ç¤ºåœ¨ç¶²ç?æ¨™é??Œç›¸?œæ?ä»¶ä¸­?„å¹³?°å?ç¨?/p>
            <p>??<strong>ç³»çµ±?è¿°</strong>ï¼šç°¡?­æ?è¿°æ‚¨?„é›»?†å¹³?°ç‰¹?²å??å?</p>
            <p>??<strong>?¯çµ¡ä¿¡ç®±</strong>ï¼šå®¢?¶æ??™å?ç³»çµ±?šçŸ¥?„ä¸»è¦ä¿¡ç®±åœ°?€</p>
            <p>??<strong>?¯çµ¡?»è©±</strong>ï¼šå®¢?¶å¯ä»¥è¯ç¹«ç??å??»è©±?Ÿç¢¼</p>
            <p>??æ¨™ç¤º?Œå?å¡«ã€ç??…ç›®?ºç³»çµ±æ­£å¸¸é?ä½œæ??€?„å?è¦è¨­å®?/p>
            <p>??æ¨™ç¤º?Œç³»çµ±è¨­å®šã€ç??…ç›®?ƒå½±?¿ç³»çµ±æ ¸å¿ƒå??½ï?è«‹è¬¹?ä¿®??/p>
            <p>??æ¨™ç¤º?Œé?è¦é??Ÿã€ç??…ç›®?¨è??´å??€è¦é??°å??•ç³»çµ±æ??ƒç???/p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
