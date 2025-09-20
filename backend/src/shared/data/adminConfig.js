// 管理員系統數據模型和配置
export const ADMIN_PERMISSIONS = {
  // 14個模組的權限矩陣 (56個權限點)
  product: { create: '新增商品', read: '查看商品', update: '編輯商品', delete: '刪除商品' },
  inventory: { create: '新增庫存', read: '查看庫存', update: '編輯庫存', delete: '刪除庫存' },
  order: { create: '新增訂單', read: '查看訂單', update: '編輯訂單', delete: '刪除訂單' },
  member: { create: '新增會員', read: '查看會員', update: '編輯會員', delete: '刪除會員' },
  promotion: { create: '新增優惠', read: '查看優惠', update: '編輯優惠', delete: '刪除優惠' },
  supplier: { create: '新增供應商', read: '查看供應商', update: '編輯供應商', delete: '刪除供應商' },
  analytics: { create: '新增分析', read: '查看分析', update: '編輯分析', delete: '刪除分析' },
  system: { create: '新增系統設定', read: '查看系統設定', update: '編輯系統設定', delete: '刪除系統設定' },
  notification: { create: '新增通知', read: '查看通知', update: '編輯通知', delete: '刪除通知' },
  content: { create: '新增內容', read: '查看內容', update: '編輯內容', delete: '刪除內容' },
  admin: { create: '新增管理員', read: '查看管理員', update: '編輯管理員', delete: '刪除管理員' },
  marketing: { create: '新增行銷', read: '查看行銷', update: '編輯行銷', delete: '刪除行銷' },
  purchase: { create: '新增採購', read: '查看採購', update: '編輯採購', delete: '刪除採購' },
  gift: { create: '新增贈品', read: '查看贈品', update: '編輯贈品', delete: '刪除贈品' }
};

// 預設角色配置
export const DEFAULT_ROLES = [
  {
    id: 1,
    roleName: '超級管理員',
    rolePrefix: 'S',
    permissions: Object.keys(ADMIN_PERMISSIONS).reduce((acc, module) => {
      acc[module] = { create: true, read: true, update: true, delete: true };
      return acc;
    }, {}),
    isSystemRole: true
  },
  {
    id: 2,
    roleName: '商品管理員',
    rolePrefix: 'P',
    permissions: {
      product: { create: true, read: true, update: true, delete: true },
      inventory: { create: true, read: true, update: true, delete: false },
      order: { create: false, read: true, update: true, delete: false },
      analytics: { create: false, read: true, update: false, delete: false }
    },
    isSystemRole: false
  },
  {
    id: 3,
    roleName: '客服管理員',
    rolePrefix: 'C',
    permissions: {
      order: { create: false, read: true, update: true, delete: false },
      member: { create: false, read: true, update: true, delete: false },
      notification: { create: true, read: true, update: true, delete: false }
    },
    isSystemRole: false
  }
];

// 預設管理員用戶
export const DEFAULT_ADMIN_USERS = [
  {
    id: 1,
    employeeId: 'S0001',
    roleId: 1,
    email: 'admin@marelle.com',
    displayName: '系統管理員',
    avatarUrl: null,
    isActive: true,
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: new Date().toISOString()
  }
];

// 工號生成配置
export const EMPLOYEE_ID_CONFIG = {
  minLength: 4, // 最小長度 (前綴 + 編號)
  maxLength: 10, // 最大長度
  startNumber: 1, // 起始編號
  padZeros: 4 // 編號補零位數 (S0001, P0001...)
};

// 密碼安全配置
export const PASSWORD_CONFIG = {
  minLength: 8,
  requireSpecialChar: true,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  maxAge: 90 // 密碼有效期 (天)
};

// 會話配置
export const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24小時 (毫秒)
  warningTime: 10 * 60 * 1000, // 到期前10分鐘提醒
  extendTime: 2 * 60 * 60 * 1000 // 延長2小時
};

// 安全配置
export const SECURITY_CONFIG = {
  maxFailedAttempts: 5, // 最大登入失敗次數
  lockoutDuration: 24 * 60 * 60 * 1000, // 鎖定時間 24小時
  inactiveThreshold: 30 * 24 * 60 * 60 * 1000 // 30天未登入視為不活躍
};

// 模組中文名稱映射
export const MODULE_NAMES = {
  product: '商品管理',
  inventory: '庫存管理',
  order: '訂單管理',
  member: '會員管理',
  promotion: '優惠管理',
  supplier: '供應商管理',
  analytics: '數據分析',
  system: '系統設定',
  notification: '通知管理',
  content: '內容管理',
  admin: '管理員管理',
  marketing: '行銷管理',
  purchase: '採購管理',
  gift: '贈品管理'
};

// 操作中文名稱映射
export const OPERATION_NAMES = {
  create: '新增',
  read: '查看',
  update: '編輯',
  delete: '刪除'
};

// 工具函數
export const generateEmployeeId = (rolePrefix, existingIds = []) => {
  const prefix = rolePrefix.toUpperCase();
  let number = EMPLOYEE_ID_CONFIG.startNumber;
  
  // 找到該前綴下最大的編號
  const prefixIds = existingIds
    .filter(id => id.startsWith(prefix))
    .map(id => parseInt(id.substring(prefix.length)))
    .filter(num => !isNaN(num));
  
  if (prefixIds.length > 0) {
    number = Math.max(...prefixIds) + 1;
  }
  
  // 生成格式化的工號
  const paddedNumber = number.toString().padStart(EMPLOYEE_ID_CONFIG.padZeros, '0');
  return `${prefix}${paddedNumber}`;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < PASSWORD_CONFIG.minLength) {
    errors.push(`密碼長度至少需要 ${PASSWORD_CONFIG.minLength} 個字元`);
  }
  
  if (PASSWORD_CONFIG.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密碼必須包含至少一個特殊符號');
  }
  
  if (PASSWORD_CONFIG.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('密碼必須包含至少一個大寫字母');
  }
  
  if (PASSWORD_CONFIG.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('密碼必須包含至少一個小寫字母');
  }
  
  if (PASSWORD_CONFIG.requireNumber && !/\d/.test(password)) {
    errors.push('密碼必須包含至少一個數字');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const hasPermission = (userPermissions, module, operation) => {
  return userPermissions?.[module]?.[operation] === true;
};

export const generateSessionToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};