import React, { useState } from 'react';
import { ADMIN_STYLES } from '@shared/adminStyles';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true
    },
    loginAttempts: 5,
    lockoutDuration: 15
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordPolicyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [key]: value
      }
    }));
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>安全設定</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理系統安全性和權限設定</p>
        </div>

        <div className="space-y-6">
          {/* 認證設定 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">認證設定</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">雙因素驗證</label>
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 font-chinese">
                  會話超時時間 (分鐘)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  className="w-32 px-3 py-2 border rounded-md"
                  min="5"
                  max="1440"
                />
              </div>
            </div>
          </div>

          {/* 密碼政策 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">密碼政策</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 font-chinese">
                  最小長度
                </label>
                <input
                  type="number"
                  value={settings.passwordPolicy.minLength}
                  onChange={(e) => handlePasswordPolicyChange('minLength', e.target.value)}
                  className="w-24 px-3 py-2 border rounded-md"
                  min="6"
                  max="32"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.passwordPolicy.requireSpecialChars}
                    onChange={(e) => handlePasswordPolicyChange('requireSpecialChars', e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <label className="text-sm font-chinese">需要特殊字符</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.passwordPolicy.requireNumbers}
                    onChange={(e) => handlePasswordPolicyChange('requireNumbers', e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <label className="text-sm font-chinese">需要數字</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.passwordPolicy.requireUppercase}
                    onChange={(e) => handlePasswordPolicyChange('requireUppercase', e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <label className="text-sm font-chinese">需要大寫字母</label>
                </div>
              </div>
            </div>
          </div>

          {/* 登入安全 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">登入安全</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 font-chinese">
                  最大登入嘗試次數
                </label>
                <input
                  type="number"
                  value={settings.loginAttempts}
                  onChange={(e) => handleSettingChange('loginAttempts', e.target.value)}
                  className="w-24 px-3 py-2 border rounded-md"
                  min="3"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 font-chinese">
                  鎖定時間 (分鐘)
                </label>
                <input
                  type="number"
                  value={settings.lockoutDuration}
                  onChange={(e) => handleSettingChange('lockoutDuration', e.target.value)}
                  className="w-24 px-3 py-2 border rounded-md"
                  min="5"
                  max="60"
                />
              </div>
            </div>
          </div>

          {/* 儲存按鈕 */}
          <div className="flex justify-end">
            <button
              className="px-6 py-2 bg-[#D4A574] text-white rounded-md hover:bg-[#B8956A] transition-colors font-chinese"
            >
              儲存設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;