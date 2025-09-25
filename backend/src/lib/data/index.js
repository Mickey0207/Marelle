/**
 * Utils 模組統一導出
 * 按業務模組分類的數據管理器集合
 */

// 商品模組
export * from './products/categoryDataManager.js';
export * from './products/mockProductData.js';

// 訂單模組
export * from './orders/orderDataManager.js';

// 物流模組
export * from './logistics/logisticsDataManager.js';

// 會員模組
export * from './analytics/userTrackingDataManager.js';
export * from './gifts/giftDataManager.js';

// 優惠券模組
export * from './coupons/couponDataManager.js';

// 財務模組
export * from './finance/accountingDataManager.js';

// 採購/供應商模組
export * from './procurement/supplierDataManager.js';
export * from './procurement/procurementDataManager.js';

// 分析模組
export * from './analytics/analyticsDataManager.js';

// 行銷模組
export * from './marketing/marketingDataManager.js';
export * from './marketing/festivalDataManager.js';

// 文件模組
export * from './documents/documentDataManager.js';

// 系統設定模組
export * from './settings/systemSettingsDataManager.js';
export * from './settings/adminConfig.js';
export * from './settings/adminDataManager.js';

// 核心功能模組
export * from './core/dashboardDataManager.js';
export * from './core/data.js';

// UI 模組
export * from './ui/styleUpdater.js';

// 模組分類對照表
export const MODULE_CATEGORIES = {
  products: ['categoryDataManager', 'mockProductData'],
  orders: ['orderDataManager'],
  logistics: ['logisticsDataManager'],
  members: ['userTrackingDataManager', 'giftDataManager'],
  coupons: ['couponDataManager'],
  finance: ['accountingDataManager'],
  procurement: ['supplierDataManager', 'procurementDataManager'],
  analytics: ['analyticsDataManager'],
  marketing: ['marketingDataManager', 'festivalDataManager'],
  documents: ['documentDataManager'],
  settings: ['systemSettingsDataManager', 'adminConfig', 'adminDataManager'],
  core: ['dashboardDataManager', 'data'],
  ui: ['styleUpdater']
};