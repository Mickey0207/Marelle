/**
 * Marelle 電商平台 - 統一函式庫
 * 整合所有共享功能、業務邏輯和組件
 */

// ===== 數據模組 (按業務分類) =====
export * from './data/index.js';

// ===== 配置模組 =====
export * from './config/styles.js';
export * from './data/ui/tabsConfig.js';

// ===== UI 模組 =====
export * from './ui/adminStyles.js';

// 模組分類索引
export const LIB_MODULES = {
  data: 'Business data managers organized by modules',
  ui: 'UI styles and admin interface components'
};