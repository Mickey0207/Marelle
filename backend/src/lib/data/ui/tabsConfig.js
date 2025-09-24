// 中央集中式 Tab 配置，基於 AppRouter.jsx 的路由結構

// Dashboard 模組 tabs
const dashboardTabs = [
  { label: '概覽', path: '/dashboard/overview' },
  { label: '銷售分析', path: '/dashboard/sales-analytics' },
  { label: '營運管理', path: '/dashboard/operations' },
  { label: '財務報告', path: '/dashboard/finance' },
  { label: '物流管理', path: '/dashboard/logistics' },
  { label: '任務管理', path: '/dashboard/tasks' },
  { label: '審批管理', path: '/dashboard/approvals' },
  { label: '即時監控', path: '/dashboard/realtime' }
];

// Products 模組 tabs
const productsTabs = [
  { label: '產品列表', path: '/products' },
  { label: '新增產品', path: '/products/add' },
];

// Orders 模組 tabs
const ordersTabs = [
  { label: '訂單列表', path: '/orders' },
  { label: '訂單管理', path: '/orders/management' },
  { label: '新增訂單', path: '/orders/new' }
];

// Members 模組 tabs
const membersTabs = [
  { label: '會員管理', path: '/members' },
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
  { label: '供應商列表', path: '/suppliers' },
  { label: '新增供應商', path: '/suppliers/new' }
];

// Procurement 模組 tabs
const procurementTabs = [
  { label: '採購概覽', path: '/procurement' },
  { label: '採購訂單', path: '/procurement/purchase-orders' },
  { label: '新增採購訂單', path: '/procurement/purchase-orders/new' },
  { label: '採購建議', path: '/procurement/suggestions' },
  { label: '檢驗收貨', path: '/procurement/inspection' },
  { label: '採購分析', path: '/procurement/analytics' }
];

// Logistics 模組 tabs
const logisticsTabs = [
  // 目前僅保留物流追蹤頁
  { label: '物流追蹤', path: '/logistics' },
  // 如需擴充再逐步開啟：
  // { label: '出貨管理', path: '/logistics/shipments' },
  // { label: '運費設定', path: '/logistics/rates' },
  // { label: '退貨管理', path: '/logistics/returns' },
  // { label: '物流分析', path: '/logistics/analytics' },
  // { label: '物流供應商', path: '/logistics/providers' }
];

// Coupons 模組 tabs
const couponsTabs = [
  { label: '優惠券管理', path: '/coupons' },
  { label: '分享管理', path: '/coupons/sharing' },
  { label: '叠加規則', path: '/coupons/stacking-rules' }
];

// Notifications 模組 tabs
const notificationsTabs = [
  { label: '通知管理', path: '/notifications' },
  { label: '模板管理', path: '/notifications/templates' },
  { label: '變數管理', path: '/notifications/variables' },
  { label: '觸發器管理', path: '/notifications/triggers' },
  { label: '通道設定', path: '/notifications/channels' },
  { label: '通知歷史', path: '/notifications/history' },
  { label: '通知分析', path: '/notifications/analytics' }
];

// Accounting 模組 tabs
const accountingTabs = [
  { label: '會計概覽', path: '/accounting' },
  { label: '會計管理', path: '/accounting/management' },
  { label: '會計科目', path: '/accounting/chart-of-accounts' },
  { label: '日記帳分錄', path: '/accounting/journal-entries' },
  { label: '財務報告', path: '/accounting/financial-reports' },
  { label: '銀行對帳', path: '/accounting/bank-reconciliation' }
];

// Analytics 模組 tabs
const analyticsTabs = [
  { label: '分析概覽', path: '/analytics' },
  { label: '主分析', path: '/analytics/main' },
  { label: '銷售分析', path: '/analytics/sales' },
  { label: '客戶分析', path: '/analytics/customers' },
  { label: '產品分析', path: '/analytics/products' },
  { label: '營運分析', path: '/analytics/operations' },
  { label: 'AI 洞察', path: '/analytics/ai-insights' }
];

// Settings 模組 tabs
const settingsTabs = [
  { label: '系統設定概覽', path: '/settings' },
  { label: '主設定', path: '/settings/main' },
  { label: '一般設定', path: '/settings/general' },
  { label: '安全設定', path: '/settings/security' },
  { label: '通知設定', path: '/settings/notifications' },
  { label: '付款設定', path: '/settings/payment' },
  { label: '運送設定', path: '/settings/shipping' }
];

// Documents 模組 tabs
const documentsTabs = [
  { label: '文件概覽', path: '/documents' },
  { label: '銷售文件', path: '/documents/sales' },
  { label: '採購文件', path: '/documents/purchase' },
  { label: '庫存文件', path: '/documents/inventory' },
  { label: '審批工作流程', path: '/documents/approval-workflow' }
];

// Admin 模組 tabs
const adminTabs = [
  { label: '管理員管理', path: '/admin' },
  { label: '角色管理', path: '/admin/roles' },
  { label: '用戶管理', path: '/admin/users' }
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
  { label: '庫存管理', path: '/inventory' },
  { label: '倉庫管理', path: '/inventory/warehouses' }
];

// Tab 配置映射函數
export const getTabsForPath = (currentPath) => {
  // 移除查詢參數和 hash
  const cleanPath = currentPath.split('?')[0].split('#')[0];
  
  // Dashboard 模組
  if (cleanPath.startsWith('/dashboard')) {
    return dashboardTabs;
  }
  
  // Products 模組
  if (cleanPath.startsWith('/products')) {
    return productsTabs;
  }
  
  // Orders 模組
  if (cleanPath.startsWith('/orders')) {
    return ordersTabs;
  }
  
  // Members 模組
  if (cleanPath.startsWith('/members')) {
    return membersTabs;
  }
  
  // Suppliers 模組
  if (cleanPath.startsWith('/suppliers')) {
    return suppliersTabs;
  }
  
  // Procurement 模組
  if (cleanPath.startsWith('/procurement')) {
    return procurementTabs;
  }
  
  // Logistics 模組
  if (cleanPath.startsWith('/logistics')) {
    return logisticsTabs;
  }
  
  // Coupons 模組
  if (cleanPath.startsWith('/coupons')) {
    return couponsTabs;
  }
  
  // Notifications 模組
  if (cleanPath.startsWith('/notifications')) {
    return notificationsTabs;
  }
  
  // Accounting 模組
  if (cleanPath.startsWith('/accounting')) {
    return accountingTabs;
  }
  
  // Analytics 模組
  if (cleanPath.startsWith('/analytics')) {
    return analyticsTabs;
  }
  
  // Settings 模組
  if (cleanPath.startsWith('/settings')) {
    return settingsTabs;
  }
  
  // Documents 模組
  if (cleanPath.startsWith('/documents')) {
    return documentsTabs;
  }
  
  // Admin 模組
  if (cleanPath.startsWith('/admin')) {
    return adminTabs;
  }
  
  // Inventory 模組
  if (cleanPath.startsWith('/inventory')) {
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