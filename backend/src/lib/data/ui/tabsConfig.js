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
  // 新增訂單分頁已移除
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
];

// Procurement 模組 tabs
const procurementTabs = [
  { label: '採購概覽', path: '/procurement' },
  { label: '供應商管理', path: '/procurement/suppliers' }
];

// Logistics 模組 tabs
const logisticsTabs = [
  // 目前僅保留物流追蹤頁
  { label: '物流追蹤', path: '/logistics' },
  // { label: '物流通知', path: '/logistics/notifications' },
  // { label: '逆物流通知', path: '/logistics/reverse-notifications' },
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

// Marketing 模組 tabs（整合 優惠券/節慶/贈品 於頂部子頁籤）
const marketingTabs = [
  { label: '優惠券管理', path: '/marketing/coupons' },
  { label: '節慶管理', path: '/marketing/festivals' },
  { label: '贈品管理', path: '/marketing/gifts' },
];

// Notifications 模組 tabs（對外發送）
const notificationsTabs = [
  { label: '通知歷史', path: '/notifications' },
  { label: 'Line 一般訊息', path: '/notifications/line-text' },
  { label: 'Line Flex message', path: '/notifications/line-flex' },
  { label: 'Mail 一般訊息', path: '/notifications/mail-text' },
  { label: 'Mail html', path: '/notifications/mail-html' },
  { label: 'SMS', path: '/notifications/sms' },
  { label: '網站通知', path: '/notifications/web' }
];

// Notification Center 模組 tabs（對內接收，從頂部鈴鐺進入，不放側邊欄）
const notificationCenterTabs = [
  { label: '全部', path: '/notification-center' },
  { label: '訂單通知', path: '/notification-center/orders' },
  { label: '綠界付款', path: '/notification-center/ecpay/payments' },
  { label: '綠界定期定額', path: '/notification-center/ecpay/subscriptions' },
  { label: '綠界取號', path: '/notification-center/ecpay/codes' },
  { label: '綠界無卡分期申請', path: '/notification-center/ecpay/cardless-installments' },
];

// 表單審批 模組 tabs（單一路徑）
const fromsigningTabs = [
  { label: '表單簽核', path: '/fromsigning' },
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

// Documents 模組 tabs（精簡：僅保留銷售文件）
const documentsTabs = [
  { label: '銷售文件', path: '/documents/sales' },
];

// Admin 模組 tabs
const adminTabs = [
  { label: '管理員管理', path: '/admin' },
];

// Marketing 模組 tabs - 已移除，因為marketing目錄為空
// const marketingTabs = [
//   { label: '行銷概覽', path: '/admin/marketing' },
//   { label: '活動管理', path: '/admin/marketing/campaigns' },
//   { label: '廣告管理', path: '/admin/marketing/advertising' },
//   { label: '受眾管理', path: '/admin/marketing/audience' }
// ];

// Festivals 模組 tabs
const festivalsTabs = [
  { label: '管理', path: '/festivals/manage' },
];

// User Tracking 模組 tabs
const userTrackingTabs = [
  { label: '事件流', path: '/user-tracking/events' },
  { label: '會話', path: '/user-tracking/sessions' },
  { label: '分群', path: '/user-tracking/segments' },
  { label: '漏斗', path: '/user-tracking/funnels' },
  { label: '留存', path: '/user-tracking/retention' },
];

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

  // Marketing 模組
  if (cleanPath.startsWith('/marketing')) {
    return marketingTabs;
  }
  
  // Notifications 模組
  if (cleanPath.startsWith('/notifications')) {
    return notificationsTabs;
  }
  
  // Notification Center 模組（對內接收）
  if (cleanPath.startsWith('/notification-center')) {
    return notificationCenterTabs;
  }
  
  // 表單審批 模組
  if (cleanPath.startsWith('/fromsigning')) {
    return fromsigningTabs;
  }
  
  // Analytics 模組
  if (cleanPath.startsWith('/analytics')) {
    return analyticsTabs;
  }
  
  // Settings 模組
  if (cleanPath.startsWith('/settings')) {
    return settingsTabs;
  }
  
  // Festivals 模組
  if (cleanPath.startsWith('/festivals')) {
    return festivalsTabs;
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

  // User Tracking 模組
  if (cleanPath.startsWith('/user-tracking')) {
    return userTrackingTabs;
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
  fromsigningTabs,
  analyticsTabs,
  settingsTabs,
  documentsTabs,
  adminTabs,
  marketingTabs,
  festivalsTabs,
  userTrackingTabs,
  inventoryTabs,
  notificationCenterTabs,
};