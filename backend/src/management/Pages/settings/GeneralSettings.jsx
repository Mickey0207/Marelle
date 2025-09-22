import React, { useState } from 'react';
import SearchableSelect from '../../components/ui/SearchableSelect';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Marelle 電商平台',
    siteDescription: '優雅珠寶與精品配件的專業電商平台',
    language: 'zh-TW',
    timezone: 'Asia/Taipei',
    currency: 'TWD',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // 儲存設定邏輯
    alert('設定已儲存');
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>一般設定</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理系統的基本配置和偏好設定</p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6 space-y-6">
          {/* 網站基本資訊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-chinese">網站基本資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">網站名稱</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">網站描述</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* 地區設定 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-chinese">地區設定</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SearchableSelect
                  placeholder="語言"
                  value={settings.language}
                  onChange={(value) => handleSettingChange('language', value)}
                  options={[
                    { value: 'zh-TW', label: '繁體中文' },
                    { value: 'zh-CN', label: '簡體中文' },
                    { value: 'en-US', label: 'English' },
                    { value: 'ja-JP', label: '日本語' }
                  ]}
                  size="sm"
                />
              </div>
              <div>
                <SearchableSelect
                  placeholder="時區"
                  value={settings.timezone}
                  onChange={(value) => handleSettingChange('timezone', value)}
                  options={[
                    { value: 'Asia/Taipei', label: '台北 (GMT+8)' },
                    { value: 'Asia/Shanghai', label: '上海 (GMT+8)' },
                    { value: 'Asia/Tokyo', label: '東京 (GMT+9)' },
                    { value: 'Asia/Hong_Kong', label: '香港 (GMT+8)' }
                  ]}
                  size="sm"
                />
              </div>
              <div>
                <SearchableSelect
                  placeholder="貨幣"
                  value={settings.currency}
                  onChange={(value) => handleSettingChange('currency', value)}
                  options={[
                    { value: 'TWD', label: '新台幣 (TWD)' },
                    { value: 'CNY', label: '人民幣 (CNY)' },
                    { value: 'USD', label: '美元 (USD)' },
                    { value: 'JPY', label: '日圓 (JPY)' },
                    { value: 'HKD', label: '港幣 (HKD)' }
                  ]}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* 格式設定 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-chinese">格式設定</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">日期格式</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="YYYY-MM-DD">2024-01-15</option>
                  <option value="DD/MM/YYYY">15/01/2024</option>
                  <option value="MM/DD/YYYY">01/15/2024</option>
                  <option value="DD-MM-YYYY">15-01-2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">時間格式</label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="24h">24小時制 (14:30)</option>
                  <option value="12h">12小時制 (2:30 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 儲存按鈕 */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-chinese"
            >
              儲存設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;