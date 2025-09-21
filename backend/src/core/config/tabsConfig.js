// 中央集中式 Tab 配置，基於 AppRouter.jsx 的路由結構

// Dashboard 模組 tabs
const dashboardTabs = [
  { label: '概覽', path: '/admin/dashboard/overview' },
  { label: '銷售分析', path: '/admin/dashboard/sales-analytics' },
  { label: '營運管理', path: '/admin/dashboard/operations' },
  { label: '財務報告', path: '/admin/dashboard/finance' },
  { label: '物流管理', path: '/admin/dashboard/logistics' },
  { label: '任務管理', path: '/admin/dashboard/tasks' },
  { label: '審批管理', path: '/admin/dashboard/approvals' },
  { label: '即時監控', path: '/admin/dashboard/realtime' }
];

// Products 模組 tabs
const productsTabs = [
  { label: '產品列表', path: '/admin/products' },
  { label: '新增產品', path: '/admin/products/add' },
  { label: '庫存管理', path: '/admin/products/inventory' }
];

// Orders 模組 tabs
const ordersTabs = [
  { label: '訂單列表', path: '/admin/orders' },
  { label: '訂單管理', path: '/admin/orders/management' },
  { label: '新增訂單', path: '/admin/orders/new' }
];

// Members 模組 tabs
const membersTabs = [
  { label: '會員管理', path: '/admin/members' },
  { label: '客戶管理', path: '/admin/members/customers' }
];

// Gifts 模組 tabs - 已移除，因為gifts目錄為空
// const giftsTabs = [
//   { label: '禮品管理', path: '/admin/gifts' },
//   { label: '等級規則', path: '/admin/gifts/tier-rules' },
//   { label: '會員福利', path: '/admin/gifts/member-benefits' },
//   { label: '分配追蹤', path: '/admin/gifts/allocation-tracking' }
// ];

// Suppliers 模組 tabs
const suppliersTabs = [
  { label: '供應商列表', path: '/admin/suppliers' },
  { label: '新增供應商', path: '/admin/suppliers/new' }
];

// Procurement 模組 tabs
const procurementTabs = [
  { label: '採購概覽', path: '/admin/procurement' },
  { label: '採購訂單', path: '/admin/procurement/purchase-orders' },
  { label: '新增採購訂單', path: '/admin/procurement/purchase-orders/new' },
  { label: '採購建議', path: '/admin/procurement/suggestions' },
  { label: '檢驗收貨', path: '/admin/procurement/inspection' },
  { label: '採購分析', path: '/admin/procurement/analytics' }
];

// Logistics 模組 tabs
const logisticsTabs = [
  { label: '物流概覽', path: '/admin/logistics' },
  { label: '出貨管理', path: '/admin/logistics/shipments' },
  { label: '運費設定', path: '/admin/logistics/rates' },
  { label: '物流追蹤', path: '/admin/logistics/tracking' },
  { label: '退貨管理', path: '/admin/logistics/returns' },
  { label: '物流分析', path: '/admin/logistics/analytics' },
  { label: '物流供應商', path: '/admin/logistics/providers' }
];

// Coupons 模組 tabs
const couponsTabs = [
  { label: '優惠券管理', path: '/admin/coupons' }
];

// Notifications 模組 tabs
const notificationsTabs = [
  { label: '通知管理', path: '/admin/notifications' },
  { label: '模板管理', path: '/admin/notifications/templates' },
  { label: '變數管理', path: '/admin/notifications/variables' },
  { label: '觸發器管理', path: '/admin/notifications/triggers' },
  { label: '通道設定', path: '/admin/notifications/channels' },
  { label: '通知歷史', path: '/admin/notifications/history' },
  { label: '通知分析', path: '/admin/notifications/analytics' }
];

// Accounting 模組 tabs
const accountingTabs = [
  { label: '會計概覽', path: '/admin/accounting' },
  { label: '會計管理', path: '/admin/accounting/management' },
  { label: '會計科目', path: '/admin/accounting/chart-of-accounts' },
  { label: '日記帳分錄', path: '/admin/accounting/journal-entries' },
  { label: '財務報告', path: '/admin/accounting/financial-reports' },
  { label: '銀行對帳', path: '/admin/accounting/bank-reconciliation' }
];

// Analytics 模組 tabs
const analyticsTabs = [
  { label: '分析概覽', path: '/admin/analytics' },
  { label: '主分析', path: '/admin/analytics/main' },
  { label: '銷售分析', path: '/admin/analytics/sales' },
  { label: '客戶分析', path: '/admin/analytics/customers' },
  { label: '產品分析', path: '/admin/analytics/products' },
  { label: '營運分析', path: '/admin/analytics/operations' },
  { label: 'AI 洞察', path: '/admin/analytics/ai-insights' }
];

// Settings 模組 tabs
const settingsTabs = [
  { label: '系統設定概覽', path: '/admin/settings' },
  { label: '主設定', path: '/admin/settings/main' },
  { label: '一般設定', path: '/admin/settings/general' },
  { label: '安全設定', path: '/admin/settings/security' },
  { label: '通知設定', path: '/admin/settings/notifications' },
  { label: '付款設定', path: '/admin/settings/payment' },
  { label: '運送設定', path: '/admin/settings/shipping' }
];

// Documents 模組 tabs
const documentsTabs = [
  { label: '文件概覽', path: '/admin/documents' },
  { label: '銷售文件', path: '/admin/documents/sales' },
  { label: '採購文件', path: '/admin/documents/purchase' },
  { label: '庫存文件', path: '/admin/documents/inventory' },
  { label: '審批工作流程', path: '/admin/documents/approval-workflow' }
];

// Admin 模組 tabs
const adminTabs = [
  { label: '管理員管理', path: '/admin/admin' },
  { label: '角色管理', path: '/admin/admin/roles' },
  { label: '用戶管理', path: '/admin/admin/users' }
];

// Marketing 模組 tabs - 已移除，因為marketing目錄為空
// const marketingTabs = [
//   { label: '行銷概覽', path: '/admin/marketing' },
//   { label: '活動管理', path: '/admin/marketing/campaigns' },
//   { label: '廣告管理', path: '/admin/marketing/advertising' },
//   { label: '受眾管理', path: '/admin/marketing/audience' }
// ];

// Festivals 模組 tabs - 已移除，因為festivals目錄為空
// const festivalsTabs = [
//   { label: '節慶概覽', path: '/admin/festivals' },
//   { label: '節慶管理', path: '/admin/festivals/management' },
//   { label: '促銷設定', path: '/admin/festivals/promotions' },
//   { label: '節慶分析', path: '/admin/festivals/analytics' }
// ];

// User Tracking 模組 tabs - 已移除，因為user-tracking目錄為空
// const userTrackingTabs = [
//   { label: '用戶追蹤概覽', path: '/admin/user-tracking' },
//   { label: '行為分析', path: '/admin/user-tracking/behavior' },
//   { label: '活動監控', path: '/admin/user-tracking/activity' },
//   { label: '用戶分群', path: '/admin/user-tracking/segments' },
//   { label: '隱私設定', path: '/admin/user-tracking/privacy' }
// ];

// Inventory 模組 tabs
const inventoryTabs = [
  { label: '庫存管理', path: '/admin/inventory' }
];

// Tab 配置映射函數
export const getTabsForPath = (currentPath) => {
  // 移除查詢參數和 hash
  const cleanPath = currentPath.split('?')[0].split('#')[0];
  
  // Dashboard 模組
  if (cleanPath.startsWith('/admin/dashboard')) {
    return dashboardTabs;
  }
  
  // Products 模組
  if (cleanPath.startsWith('/admin/products')) {
    return productsTabs;
  }
  
  // Orders 模組
  if (cleanPath.startsWith('/admin/orders')) {
    return ordersTabs;
  }
  
  // Members 模組
  if (cleanPath.startsWith('/admin/members')) {
    return membersTabs;
  }
  
  // Gifts 模組 - 已移除，因為gifts目錄為空
  // if (cleanPath.startsWith('/admin/gifts')) {
  //   return giftsTabs;
  // }
  
  // Suppliers 模組
  if (cleanPath.startsWith('/admin/suppliers')) {
    return suppliersTabs;
  }
  
  // Procurement 模組
  if (cleanPath.startsWith('/admin/procurement')) {
    return procurementTabs;
  }
  
  // Logistics 模組
  if (cleanPath.startsWith('/admin/logistics')) {
    return logisticsTabs;
  }
  
  // Coupons 模組
  if (cleanPath.startsWith('/admin/coupons')) {
    return couponsTabs;
  }
  
  // Notifications 模組
  if (cleanPath.startsWith('/admin/notifications')) {
    return notificationsTabs;
  }
  
  // Accounting 模組
  if (cleanPath.startsWith('/admin/accounting')) {
    return accountingTabs;
  }
  
  // Analytics 模組
  if (cleanPath.startsWith('/admin/analytics')) {
    return analyticsTabs;
  }
  
  // Settings 模組
  if (cleanPath.startsWith('/admin/settings')) {
    return settingsTabs;
  }
  
  // Documents 模組
  if (cleanPath.startsWith('/admin/documents')) {
    return documentsTabs;
  }
  
  // Admin 模組
  if (cleanPath.startsWith('/admin/admin')) {
    return adminTabs;
  }
  
  // Marketing 模組 - 已移除，因為marketing目錄為空
  // if (cleanPath.startsWith('/admin/marketing')) {
  //   return marketingTabs;
  // }
  
  // Festivals 模組 - 已移除，因為festivals目錄為空
  // if (cleanPath.startsWith('/admin/festivals')) {
  //   return festivalsTabs;
  // }
  
  // User Tracking 模組 - 已移除，因為user-tracking目錄為空
  // if (cleanPath.startsWith('/admin/user-tracking')) {
  //   return userTrackingTabs;
  // }
  
  // Inventory 模組
  if (cleanPath.startsWith('/admin/inventory')) {
    return inventoryTabs;
  }
  
  return [];
};

export default {
  getTabsForPath,
  dashboardTabs,
  productsTabs,
  ordersTabs,
  membersTabs,
  // giftsTabs, // 已移除
  suppliersTabs,
  procurementTabs,
  logisticsTabs,
  couponsTabs,
  notificationsTabs,
  accountingTabs,
  analyticsTabs,
  settingsTabs,
  documentsTabs,
  adminTabs,
  // marketingTabs, // 已移除
  // festivalsTabs, // 已移除
  // userTrackingTabs, // 已移除
  inventoryTabs
};