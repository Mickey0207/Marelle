// 模擬：管理後台可用模組（桌面版）
export const MODULE_OPTIONS = [
  { key: 'dashboard', label: '總覽' },
  { key: 'products', label: '商品管理' },
  { key: 'inventory', label: '庫存管理' },
  { key: 'orders', label: '訂單管理' },
  { key: 'logistics', label: '物流管理' },
  { key: 'marketing', label: '行銷管理' },
  { key: 'members', label: '會員管理' },
  { key: 'procurement', label: '採購管理' },
  { key: 'fromsigning', label: '表單審批' },
  { key: 'notifications', label: '通知管理' },
  { key: 'admin', label: '管理員管理' },
  { key: 'analytics', label: '數據分析' },
  { key: 'settings', label: '系統設定' },
];

export const ROLE_PRESETS = {
  'Super Admin': MODULE_OPTIONS.map(m => m.key),
  'Manager': ['dashboard', 'products', 'inventory', 'orders', 'logistics', 'marketing', 'members', 'procurement', 'fromsigning', 'notifications', 'analytics'],
  'Staff': ['dashboard', 'orders', 'members']
};

export default { MODULE_OPTIONS, ROLE_PRESETS };
