/**
 * 系統設定數據管理器
 * 基於 MickeyShop Beauty 系統設定模組設計
 * 提供集中式設定管理、權限控制、版本管理和設定同步功能
 */

class SystemSettingsDataManager {
  constructor() {
    this.storageKey = 'marelle-system-settings';
    this.changeLogKey = 'marelle-setting-changes';
    this.initializeDefaultSettings();
  }

  // 設定類別枚舉
  static SETTING_CATEGORIES = {
    SYSTEM_CORE: 'system_core',
    SYSTEM_SECURITY: 'system_security',
    SYSTEM_PERFORMANCE: 'system_performance',
    USER_MANAGEMENT: 'user_management',
    PRODUCT_MANAGEMENT: 'product_management',
    INVENTORY_MANAGEMENT: 'inventory_management',
    ORDER_MANAGEMENT: 'order_management',
    PAYMENT_MANAGEMENT: 'payment_management',
    SHIPPING_MANAGEMENT: 'shipping_management',
    PROMOTION_MANAGEMENT: 'promotion_management',
    CONTENT_MANAGEMENT: 'content_management',
    NOTIFICATION_MANAGEMENT: 'notification_management',
    ANALYTICS_MANAGEMENT: 'analytics_management',
    PAYMENT_GATEWAY: 'payment_gateway',
    LOGISTICS_PROVIDER: 'logistics_provider',
    EMAIL_SERVICE: 'email_service',
    SMS_SERVICE: 'sms_service',
    CLOUD_STORAGE: 'cloud_storage',
    FRONTEND_THEME: 'frontend_theme',
    FRONTEND_LAYOUT: 'frontend_layout',
    FRONTEND_SEO: 'frontend_seo',
    BACKEND_INTERFACE: 'backend_interface',
    BACKEND_WORKFLOW: 'backend_workflow',
    BACKEND_REPORTING: 'backend_reporting'
  };

  // 數據類型枚舉
  static DATA_TYPES = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    JSON: 'json',
    ARRAY: 'array',
    FILE: 'file',
    IMAGE: 'image',
    URL: 'url',
    EMAIL: 'email',
    PASSWORD: 'password',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    MULTI_SELECT: 'multi_select',
    DATE: 'date',
    TIME: 'time',
    DATETIME: 'datetime',
    COLOR: 'color',
    RANGE: 'range'
  };

  // 初始化默認設定
  initializeDefaultSettings() {
    const existingSettings = this.getAllSettings();
    if (Object.keys(existingSettings).length === 0) {
      const defaultSettings = this.getDefaultSettingsStructure();
      localStorage.setItem(this.storageKey, JSON.stringify(defaultSettings));
    }
  }

  // 獲取默認設定結構
  getDefaultSettingsStructure() {
    return {
      // 系統核心設定
      system_core: {
        'system.name': {
          settingId: 'system.name',
          category: 'system_core',
          key: 'system.name',
          displayName: '系統名稱',
          description: '電商平台的顯示名稱',
          value: 'Marelle',
          defaultValue: 'Marelle',
          dataType: 'string',
          isRequired: true,
          isSystem: true,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'system.description': {
          settingId: 'system.description',
          category: 'system_core',
          key: 'system.description',
          displayName: '系統描述',
          description: '電商平台的簡短描述',
          value: '優雅的線上購物體驗',
          defaultValue: '優雅的線上購物體驗',
          dataType: 'textarea',
          isRequired: false,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'system.contact_email': {
          settingId: 'system.contact_email',
          category: 'system_core',
          key: 'system.contact_email',
          displayName: '聯絡信箱',
          description: '系統管理員聯絡信箱',
          value: 'admin@marelle.com',
          defaultValue: 'admin@marelle.com',
          dataType: 'email',
          isRequired: true,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'system.phone': {
          settingId: 'system.phone',
          category: 'system_core',
          key: 'system.phone',
          displayName: '聯絡電話',
          description: '客服聯絡電話',
          value: '+886-2-1234-5678',
          defaultValue: '+886-2-1234-5678',
          dataType: 'string',
          isRequired: false,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },

      // 安全設定
      system_security: {
        'security.password_min_length': {
          settingId: 'security.password_min_length',
          category: 'system_security',
          key: 'security.password_min_length',
          displayName: '密碼最小長度',
          description: '使用者密碼的最小字元數',
          value: 8,
          defaultValue: 8,
          dataType: 'number',
          constraints: { minValue: 6, maxValue: 32 },
          isRequired: true,
          isSystem: true,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'security.password_require_uppercase': {
          settingId: 'security.password_require_uppercase',
          category: 'system_security',
          key: 'security.password_require_uppercase',
          displayName: '密碼需要大寫字母',
          description: '密碼是否必須包含大寫字母',
          value: true,
          defaultValue: true,
          dataType: 'boolean',
          isRequired: true,
          isSystem: true,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'security.login_max_attempts': {
          settingId: 'security.login_max_attempts',
          category: 'system_security',
          key: 'security.login_max_attempts',
          displayName: '登入最大嘗試次數',
          description: '帳號被鎖定前的最大登入失敗次數',
          value: 5,
          defaultValue: 5,
          dataType: 'number',
          constraints: { minValue: 3, maxValue: 10 },
          isRequired: true,
          isSystem: true,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'security.session_timeout': {
          settingId: 'security.session_timeout',
          category: 'system_security',
          key: 'security.session_timeout',
          displayName: '會話超時時間',
          description: '使用者會話的超時時間（分鐘）',
          value: 30,
          defaultValue: 30,
          dataType: 'number',
          constraints: { minValue: 10, maxValue: 720 },
          isRequired: true,
          isSystem: true,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },

      // 通知設定
      notification_management: {
        'notification.email_enabled': {
          settingId: 'notification.email_enabled',
          category: 'notification_management',
          key: 'notification.email_enabled',
          displayName: '啟用郵件通知',
          description: '是否啟用系統郵件通知功能',
          value: true,
          defaultValue: true,
          dataType: 'boolean',
          isRequired: true,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'notification.email_smtp_host': {
          settingId: 'notification.email_smtp_host',
          category: 'notification_management',
          key: 'notification.email_smtp_host',
          displayName: 'SMTP 主機',
          description: '郵件發送伺服器地址',
          value: 'smtp.gmail.com',
          defaultValue: 'smtp.gmail.com',
          dataType: 'string',
          isRequired: true,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: true,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'notification.sms_enabled': {
          settingId: 'notification.sms_enabled',
          category: 'notification_management',
          key: 'notification.sms_enabled',
          displayName: '啟用簡訊通知',
          description: '是否啟用系統簡訊通知功能',
          value: false,
          defaultValue: false,
          dataType: 'boolean',
          isRequired: true,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },

      // 支付設定
      payment_management: {
        'payment.currency': {
          settingId: 'payment.currency',
          category: 'payment_management',
          key: 'payment.currency',
          displayName: '預設貨幣',
          description: '系統預設的貨幣單位',
          value: 'TWD',
          defaultValue: 'TWD',
          dataType: 'select',
          constraints: {
            options: [
              { value: 'TWD', label: '新台幣 (TWD)' },
              { value: 'USD', label: '美元 (USD)' },
              { value: 'EUR', label: '歐元 (EUR)' },
              { value: 'JPY', label: '日圓 (JPY)' }
            ]
          },
          isRequired: true,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'payment.credit_card_enabled': {
          settingId: 'payment.credit_card_enabled',
          category: 'payment_management',
          key: 'payment.credit_card_enabled',
          displayName: '啟用信用卡支付',
          description: '是否啟用信用卡支付功能',
          value: true,
          defaultValue: true,
          dataType: 'boolean',
          isRequired: true,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'payment.handling_fee': {
          settingId: 'payment.handling_fee',
          category: 'payment_management',
          key: 'payment.handling_fee',
          displayName: '手續費百分比',
          description: '支付處理手續費百分比',
          value: 2.5,
          defaultValue: 2.5,
          dataType: 'number',
          constraints: { minValue: 0, maxValue: 10 },
          isRequired: false,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },

      // 物流設定
      shipping_management: {
        'shipping.free_shipping_threshold': {
          settingId: 'shipping.free_shipping_threshold',
          category: 'shipping_management',
          key: 'shipping.free_shipping_threshold',
          displayName: '免運費門檻',
          description: '享受免運費的最低消費金額',
          value: 1000,
          defaultValue: 1000,
          dataType: 'number',
          constraints: { minValue: 0, maxValue: 10000 },
          isRequired: false,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'shipping.default_rate': {
          settingId: 'shipping.default_rate',
          category: 'shipping_management',
          key: 'shipping.default_rate',
          displayName: '預設運費',
          description: '標準配送的預設運費',
          value: 80,
          defaultValue: 80,
          dataType: 'number',
          constraints: { minValue: 0, maxValue: 500 },
          isRequired: true,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        'shipping.processing_days': {
          settingId: 'shipping.processing_days',
          category: 'shipping_management',
          key: 'shipping.processing_days',
          displayName: '處理天數',
          description: '訂單處理所需的工作天數',
          value: 2,
          defaultValue: 2,
          dataType: 'number',
          constraints: { minValue: 1, maxValue: 10 },
          isRequired: true,
          isSystem: false,
          isUserConfigurable: true,
          requiresRestart: false,
          version: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    };
  }

  // 獲取所有設定
  getAllSettings() {
    const settings = localStorage.getItem(this.storageKey);
    return settings ? JSON.parse(settings) : {};
  }

  // 根據類別獲取設定
  getSettingsByCategory(category) {
    const allSettings = this.getAllSettings();
    return allSettings[category] || {};
  }

  // 獲取單一設定值
  getSetting(category, key) {
    const categorySettings = this.getSettingsByCategory(category);
    return categorySettings[key]?.value;
  }

  // 獲取完整設定物件
  getSettingObject(category, key) {
    const categorySettings = this.getSettingsByCategory(category);
    return categorySettings[key];
  }

  // 更新設定值
  updateSetting(category, key, newValue, userId = 'admin') {
    const allSettings = this.getAllSettings();
    
    if (!allSettings[category]) {
      allSettings[category] = {};
    }

    const oldValue = allSettings[category][key]?.value;
    
    if (allSettings[category][key]) {
      allSettings[category][key] = {
        ...allSettings[category][key],
        value: newValue,
        updatedAt: new Date().toISOString(),
        updatedBy: userId,
        version: allSettings[category][key].version + 1
      };
    }

    localStorage.setItem(this.storageKey, JSON.stringify(allSettings));

    // 記錄變更日誌
    this.logSettingChange(category, key, oldValue, newValue, userId);

    return allSettings[category][key];
  }

  // 重置設定為預設值
  resetSetting(category, key, userId = 'admin') {
    const setting = this.getSettingObject(category, key);
    if (setting) {
      return this.updateSetting(category, key, setting.defaultValue, userId);
    }
    return null;
  }

  // 批量更新設定
  updateMultipleSettings(updates, userId = 'admin') {
    const results = [];
    updates.forEach(({ category, key, value }) => {
      const result = this.updateSetting(category, key, value, userId);
      results.push(result);
    });
    return results;
  }

  // 記錄設定變更
  logSettingChange(category, key, oldValue, newValue, userId, reason = '') {
    const changeLogs = this.getChangeLogs();
    const changeLog = {
      logId: this.generateId(),
      settingId: `${category}.${key}`,
      category,
      key,
      changeType: oldValue === undefined ? 'create' : 'update',
      oldValue,
      newValue,
      reason,
      changedBy: userId,
      changedAt: new Date().toISOString(),
      ipAddress: 'localhost', // 在實際應用中應該獲取真實IP
      userAgent: navigator.userAgent
    };

    changeLogs.push(changeLog);
    localStorage.setItem(this.changeLogKey, JSON.stringify(changeLogs));
  }

  // 獲取變更日誌
  getChangeLogs(category = null, limit = 100) {
    const logs = localStorage.getItem(this.changeLogKey);
    let changeLogs = logs ? JSON.parse(logs) : [];

    if (category) {
      changeLogs = changeLogs.filter(log => log.category === category);
    }

    return changeLogs
      .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
      .slice(0, limit);
  }

  // 獲取設定統計
  getSettingsStatistics() {
    const allSettings = this.getAllSettings();
    const categories = Object.keys(allSettings);
    const changeLogs = this.getChangeLogs();

    let totalSettings = 0;
    let activeSettings = 0;
    let systemSettings = 0;
    let userConfigurableSettings = 0;

    categories.forEach(category => {
      const categorySettings = allSettings[category];
      Object.values(categorySettings).forEach(setting => {
        totalSettings++;
        if (setting.status === 'active') activeSettings++;
        if (setting.isSystem) systemSettings++;
        if (setting.isUserConfigurable) userConfigurableSettings++;
      });
    });

    return {
      totalSettings,
      activeSettings,
      systemSettings,
      userConfigurableSettings,
      totalCategories: categories.length,
      recentChanges: changeLogs.slice(0, 10),
      lastModified: changeLogs.length > 0 ? changeLogs[0].changedAt : null
    };
  }

  // 匯出設定
  exportSettings(categories = null) {
    const allSettings = this.getAllSettings();
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      settings: categories ? 
        Object.fromEntries(
          Object.entries(allSettings).filter(([key]) => categories.includes(key))
        ) : 
        allSettings
    };
    return JSON.stringify(exportData, null, 2);
  }

  // 匯入設定
  importSettings(settingsJson, userId = 'admin') {
    try {
      const importData = JSON.parse(settingsJson);
      const results = [];

      Object.entries(importData.settings).forEach(([category, categorySettings]) => {
        Object.entries(categorySettings).forEach(([key, setting]) => {
          const result = this.updateSetting(category, key, setting.value, userId);
          results.push({ category, key, success: !!result });
        });
      });

      return { success: true, results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 驗證設定值
  validateSetting(category, key, value) {
    const setting = this.getSettingObject(category, key);
    if (!setting) {
      return { valid: false, error: '設定不存在' };
    }

    const { dataType, constraints, isRequired } = setting;

    // 必填檢查
    if (isRequired && (value === null || value === undefined || value === '')) {
      return { valid: false, error: '此設定為必填項目' };
    }

    // 數據類型檢查
    if (value !== null && value !== undefined) {
      switch (dataType) {
        case 'number':
          if (isNaN(value)) {
            return { valid: false, error: '必須是數字' };
          }
          const numValue = Number(value);
          if (constraints?.minValue !== undefined && numValue < constraints.minValue) {
            return { valid: false, error: `最小值為 ${constraints.minValue}` };
          }
          if (constraints?.maxValue !== undefined && numValue > constraints.maxValue) {
            return { valid: false, error: `最大值為 ${constraints.maxValue}` };
          }
          break;

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return { valid: false, error: '請輸入有效的電子郵件地址' };
          }
          break;

        case 'url':
          try {
            new URL(value);
          } catch {
            return { valid: false, error: '請輸入有效的URL' };
          }
          break;

        case 'string':
        case 'textarea':
          if (constraints?.minLength && value.length < constraints.minLength) {
            return { valid: false, error: `最小長度為 ${constraints.minLength}` };
          }
          if (constraints?.maxLength && value.length > constraints.maxLength) {
            return { valid: false, error: `最大長度為 ${constraints.maxLength}` };
          }
          break;

        case 'select':
          if (constraints?.options) {
            const validOptions = constraints.options.map(opt => opt.value);
            if (!validOptions.includes(value)) {
              return { valid: false, error: '請選擇有效的選項' };
            }
          }
          break;
      }
    }

    return { valid: true };
  }

  // 搜尋設定
  searchSettings(query, category = null) {
    const allSettings = this.getAllSettings();
    const results = [];

    Object.entries(allSettings).forEach(([cat, categorySettings]) => {
      if (category && cat !== category) return;

      Object.entries(categorySettings).forEach(([key, setting]) => {
        const searchText = `${setting.displayName} ${setting.description} ${key}`.toLowerCase();
        if (searchText.includes(query.toLowerCase())) {
          results.push({
            ...setting,
            category: cat,
            key
          });
        }
      });
    });

    return results;
  }

  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 清除所有數據（用於測試）
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.changeLogKey);
  }
}

// 創建全局實例
const systemSettingsDataManager = new SystemSettingsDataManager();
export default systemSettingsDataManager;