/**
 * 批量更新管理頁面樣式腳本
 * 統一所有管理頁面的視覺風格
 */

// 需要更新的主要管理頁面樣式模式
export const STYLE_PATTERNS = {
  // 舊樣式模式
  oldPageContainer: 'min-h-screen bg-[#fdf8f2]',
  oldContentPadding: 'p-6',
  oldSpacing: 'space-y-8',
  oldTitle: 'text-3xl font-bold text-gray-900 font-chinese',
  oldSubtitle: 'text-gray-600 mt-2 font-chinese',
  oldGlassCard: 'glass p-6 rounded-2xl',
  oldButton: 'bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b86c37]',
  
  // 新統一樣式
  newPageContainer: 'ADMIN_STYLES.pageContainer',
  newContentContainer: 'ADMIN_STYLES.contentContainer',
  newSpacing: 'ADMIN_STYLES.sectionSpacing',
  newTitle: 'ADMIN_STYLES.pageTitle',
  newSubtitle: 'ADMIN_STYLES.pageSubtitle',
  newGlassCard: 'ADMIN_STYLES.glassCard',
  newButton: 'ADMIN_STYLES.btnPrimary',
};

// 需要添加的 import 語句
export const REQUIRED_IMPORTS = `
import { ADMIN_STYLES, GSAP_ANIMATIONS, getStatusColor } from '../styles/adminStyles';
`;

// 標準頁面結構模板
export const PAGE_TEMPLATE = `
  return (
    <div className={ADMIN_STYLES.sectionSpacing}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={ADMIN_STYLES.pageTitle}>[PAGE_TITLE]</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>
            [PAGE_DESCRIPTION]
          </p>
        </div>
        [HEADER_ACTIONS]
      </div>

      [PAGE_CONTENT]
    </div>
  );
`;

// 常用組件樣式映射
export const COMPONENT_STYLE_MAP = {
  // 按鈕樣式
  'bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b86c37] transition-colors': 'ADMIN_STYLES.btnPrimary',
  'bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors': 'ADMIN_STYLES.btnSecondary',
  'text-[#cc824d] hover:text-[#b86c37] px-4 py-2 rounded-lg transition-colors': 'ADMIN_STYLES.btnGhost',
  
  // 卡片樣式
  'glass p-6 rounded-2xl': 'ADMIN_STYLES.glassCard',
  'glass p-4 rounded-xl': 'ADMIN_STYLES.glassCardSmall',
  'bg-white/80 backdrop-blur-sm rounded-xl p-6': 'ADMIN_STYLES.glassCard',
  
  // 標題樣式
  'text-3xl font-bold text-gray-900 font-chinese': 'ADMIN_STYLES.pageTitle',
  'text-xl font-bold text-gray-900 font-chinese': 'ADMIN_STYLES.sectionTitle',
  'text-gray-600 font-chinese': 'ADMIN_STYLES.pageSubtitle',
  
  // 間距樣式
  'space-y-8': 'ADMIN_STYLES.sectionSpacing',
  'space-y-6': 'ADMIN_STYLES.sectionSpacing',
  'space-y-4': 'ADMIN_STYLES.componentSpacing',
  
  // 網格樣式
  'grid grid-cols-1 md:grid-cols-2 gap-6': 'ADMIN_STYLES.gridCols2',
  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6': 'ADMIN_STYLES.gridCols3',
  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6': 'ADMIN_STYLES.gridCols4',
  
  // 狀態樣式
  'bg-green-100 text-green-800': 'ADMIN_STYLES.statusSuccess',
  'bg-yellow-100 text-yellow-800': 'ADMIN_STYLES.statusWarning',
  'bg-red-100 text-red-800': 'ADMIN_STYLES.statusError',
  'bg-blue-100 text-blue-800': 'ADMIN_STYLES.statusInfo',
};

// 自動替換函數
export const replaceStylesInContent = (content) => {
  let updatedContent = content;
  
  // 替換樣式類名
  Object.entries(COMPONENT_STYLE_MAP).forEach(([oldStyle, newStyle]) => {
    const regex = new RegExp(`className=["']([^"']*\\s)?${oldStyle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s[^"']*)?["']`, 'g');
    updatedContent = updatedContent.replace(regex, (match, prefix = '', suffix = '') => {
      const cleanPrefix = prefix.trim() ? prefix.trim() + ' ' : '';
      const cleanSuffix = suffix.trim() ? ' ' + suffix.trim() : '';
      return `className={\`${cleanPrefix}\${${newStyle}}${cleanSuffix}\`}`;
    });
  });
  
  return updatedContent;
};

// 檢查是否需要添加樣式導入
export const needsStyleImport = (content) => {
  return !content.includes('ADMIN_STYLES') && 
         !content.includes('adminStyles');
};

// 生成樣式導入語句
export const generateStyleImport = (existingImports) => {
  const hasGsap = existingImports.includes('gsap');
  const hasGetStatusColor = existingImports.includes('getStatusColor');
  
  let imports = ['ADMIN_STYLES'];
  
  if (hasGsap && !existingImports.includes('GSAP_ANIMATIONS')) {
    imports.push('GSAP_ANIMATIONS');
  }
  
  if (hasGetStatusColor || existingImports.includes('STATUS_COLORS')) {
    imports.push('getStatusColor');
  }
  
  return `import { ${imports.join(', ')} } from '../styles/adminStyles';`;
};

export default {
  STYLE_PATTERNS,
  REQUIRED_IMPORTS,
  PAGE_TEMPLATE,
  COMPONENT_STYLE_MAP,
  replaceStylesInContent,
  needsStyleImport,
  generateStyleImport,
};