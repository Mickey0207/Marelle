// 簡易的系統設定 Mock，提供內存儲存、搜尋、匯入/匯出與統計

const nowISO = () => new Date().toISOString();

// 內存設定儲存（含基本的幾個分類與鍵值）
const settingsStore = {
  system_core: {
    'system.name': { value: 'Marelle 管理系統', label: '系統名稱' },
    'system.timezone': { value: 'Asia/Taipei', label: '時區' },
    'system.language': { value: 'zh-TW', label: '語系' },
  },
  system_security: {
    'security.password_min_length': { value: 8, label: '密碼最小長度' },
    'security.login_max_attempts': { value: 5, label: '登入最大嘗試次數' },
    'security.session_timeout': { value: 30, label: '工作階段逾時(分鐘)' },
  },
  notification_management: {
    'notification.email_enabled': { value: true, label: '啟用 Email 通知' },
    'notification.sms_enabled': { value: false, label: '啟用 SMS 通知' },
  },
  payment_management: {
    'payment.currency': { value: 'TWD', label: '預設貨幣' },
    'payment.tax_rate': { value: 5, label: '稅率(%)' },
  },
  shipping_management: {
    'shipping.free_shipping_threshold': { value: 2000, label: '免運費門檻' },
    'shipping.default_carrier': { value: 'EZShip', label: '預設物流' },
    'shipping.enable_express': { value: false, label: '啟用快捷' },
  },
};

// 最近變更記錄
const recentChanges = [
  {
    settingId: 'system_core.system.name',
    changedAt: nowISO(),
    changedBy: 'admin',
    oldValue: 'Marelle',
    newValue: 'Marelle 管理系統',
  },
];

function getSetting(category, key) {
  return settingsStore?.[category]?.[key]?.value;
}

function updateSetting(category, key, value, changedBy = 'admin') {
  if (!settingsStore[category]) settingsStore[category] = {};
  const prev = settingsStore[category][key]?.value;
  settingsStore[category][key] = settingsStore[category][key] || { value: undefined };
  settingsStore[category][key].value = value;
  recentChanges.unshift({
    settingId: `${category}.${key}`,
    changedAt: nowISO(),
    changedBy,
    oldValue: prev,
    newValue: value,
  });
  // 限縮記錄長度（避免無限成長）
  if (recentChanges.length > 50) recentChanges.length = 50;
  return { success: true };
}

function getSettingsByCategory(category) {
  // 回傳鍵值物件（含 value），供 UI 以設定鍵取值
  return { ...(settingsStore[category] || {}) };
}

function getSettingsStatistics() {
  const categories = Object.keys(settingsStore);
  const totalSettings = categories.reduce((acc, c) => acc + Object.keys(settingsStore[c]).length, 0);
  const categoryBreakdown = categories.map(c => ({
    category: c,
    count: Object.keys(settingsStore[c]).length,
  }));
  return {
    totalSettings,
    categories: categories.length,
    categoryBreakdown,
    recentChanges: [...recentChanges],
    generatedAt: nowISO(),
  };
}

function exportSettings() {
  // 只輸出純值，便於匯入
  const plain = {};
  for (const c of Object.keys(settingsStore)) {
    plain[c] = {};
    for (const k of Object.keys(settingsStore[c])) {
      plain[c][k] = settingsStore[c][k].value;
    }
  }
  return JSON.stringify({ version: 'mock-1.0', exportedAt: nowISO(), settings: plain }, null, 2);
}

function importSettings(jsonString, changedBy = 'admin') {
  try {
    const parsed = JSON.parse(jsonString);
    const input = parsed.settings || parsed; // 兼容直接貼 settings 物件
    const categories = Object.keys(input || {});
    categories.forEach(c => {
      const keys = Object.keys(input[c] || {});
      keys.forEach(k => {
        updateSetting(c, k, input[c][k], changedBy);
      });
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e?.message || 'Invalid JSON' };
  }
}

function searchSettings(term) {
  const q = String(term || '').toLowerCase();
  if (!q) return [];
  const results = [];
  for (const category of Object.keys(settingsStore)) {
    for (const key of Object.keys(settingsStore[category])) {
      const entry = settingsStore[category][key];
      const valueStr = String(entry?.value);
      const labelStr = String(entry?.label || '');
      if (
        key.toLowerCase().includes(q) ||
        valueStr.toLowerCase().includes(q) ||
        labelStr.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q)
      ) {
        results.push({
          settingId: `${category}.${key}`,
          category,
          key,
          value: entry?.value,
          label: entry?.label,
        });
      }
    }
  }
  return results;
}

export default {
  // 舊接口（保留相容）
  getSystemSettings() {
    return {
      siteName: getSetting('system_core', 'system.name') || 'Marelle 管理系統',
      timezone: getSetting('system_core', 'system.timezone') || 'Asia/Taipei',
      language: getSetting('system_core', 'system.language') || 'zh-TW',
    };
  },

  // 供 SystemSettingsOverview 使用的 API
  getSettingsStatistics,
  getSettingsByCategory,
  getSetting,
  updateSetting,
  exportSettings,
  importSettings,
  searchSettings,
};
