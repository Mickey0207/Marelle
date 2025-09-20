// 商品狀態
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
  LOW_STOCK: 'low_stock'
};

export const PRODUCT_STATUS_LABELS = {
  [PRODUCT_STATUS.ACTIVE]: '正常',
  [PRODUCT_STATUS.INACTIVE]: '停用',
  [PRODUCT_STATUS.OUT_OF_STOCK]: '缺貨',
  [PRODUCT_STATUS.LOW_STOCK]: '庫存不足'
};

// 訂單狀態
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: '待處理',
  [ORDER_STATUS.PROCESSING]: '處理中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消'
};

// 付款狀態
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed'
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: '待付款',
  [PAYMENT_STATUS.PAID]: '已付款',
  [PAYMENT_STATUS.REFUNDED]: '已退款',
  [PAYMENT_STATUS.FAILED]: '付款失敗'
};

// 出貨狀態
export const SHIPPING_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const SHIPPING_STATUS_LABELS = {
  [SHIPPING_STATUS.PENDING]: '待出貨',
  [SHIPPING_STATUS.PREPARING]: '準備中',
  [SHIPPING_STATUS.SHIPPED]: '已出貨',
  [SHIPPING_STATUS.DELIVERED]: '已送達',
  [SHIPPING_STATUS.CANCELLED]: '已取消'
};

// 客戶狀態
export const CUSTOMER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  VIP: 'vip',
  BLOCKED: 'blocked'
};

export const CUSTOMER_STATUS_LABELS = {
  [CUSTOMER_STATUS.ACTIVE]: '活躍',
  [CUSTOMER_STATUS.INACTIVE]: '非活躍',
  [CUSTOMER_STATUS.VIP]: 'VIP',
  [CUSTOMER_STATUS.BLOCKED]: '已封鎖'
};

// 商品分類
export const PRODUCT_CATEGORIES = [
  '上衣',
  '褲子',
  '外套',
  '鞋子',
  '配件',
  '其他'
];

// 用戶角色
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff'
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: '超級管理員',
  [USER_ROLES.MANAGER]: '管理者',
  [USER_ROLES.STAFF]: '工作人員'
};

// 分頁設定
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100]
};

// API 端點
export const API_ENDPOINTS = {
  // 認證
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // 商品
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  PRODUCT_IMAGE: (id) => `/products/${id}/image`,
  
  // 訂單
  ORDERS: '/orders',
  ORDER_DETAIL: (id) => `/orders/${id}`,
  ORDER_STATUS: (id) => `/orders/${id}/status`,
  ORDER_SHIPPING: (id) => `/orders/${id}/shipping`,
  
  // 客戶
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: (id) => `/customers/${id}`,
  CUSTOMER_NOTES: (id) => `/customers/${id}/notes`,
  
  // 分析
  ANALYTICS_OVERVIEW: '/analytics/overview',
  ANALYTICS_SALES: '/analytics/sales',
  ANALYTICS_PRODUCTS: '/analytics/products'
};

// 錯誤訊息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '網路連線錯誤，請檢查您的網路連線',
  UNAUTHORIZED: '您沒有權限執行此操作',
  NOT_FOUND: '找不到所請求的資源',
  SERVER_ERROR: '伺服器錯誤，請稍後再試',
  VALIDATION_ERROR: '輸入資料有誤，請檢查後再試',
  UNKNOWN_ERROR: '發生未知錯誤，請聯繫技術支援'
};

// 成功訊息
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: '保存成功',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '刪除成功',
  UPLOAD_SUCCESS: '上傳成功',
  LOGIN_SUCCESS: '登入成功',
  LOGOUT_SUCCESS: '登出成功'
};