/**
 * 管理後台統一樣式配置 (合併版本)
 * 確保所有管理頁面使用一致的設計系統
 */

// 1. 基礎顏色配置
export const ADMIN_COLORS = {
  // 主題背景色
  background: '#fdf8f2',
  
  // 主題色調
  primary: '#cc824d',
  primaryHover: '#b86c37',
  
  // 文字顏色
  textPrimary: '#1f2937', // gray-800
  textSecondary: '#6b7280', // gray-500
  textMuted: '#9ca3af', // gray-400
  
  // 邊框顏色
  border: '#e5e7eb', // gray-200
  borderLight: '#f3f4f6', // gray-100
  
  // 玻璃效果背景
  glassBackground: 'rgba(255, 255, 255, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
};

// 2. 統一的 CSS 類名配置
export const ADMIN_STYLES = {
  // 頁面容器
  pageContainer: 'min-h-screen bg-[#fdf8f2]',
  // 內容容器（調整為更寬、更自適應，避免超大螢幕左右留白過多）
  contentContainer: 'p-6 space-y-6',
  contentContainerWide: 'w-full max-w-[1800px] 2xl:max-w-[2100px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8',
  contentContainerStandard: 'w-full max-w-[1600px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8',
  // 全幅容器：不限制 max-width，適合寬表格/圖表
  contentContainerFluid: 'w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8',
  
  // 頁面標題
  pageTitle: 'text-3xl font-bold text-gray-900 font-chinese mb-2',
  pageSubtitle: 'text-gray-600 font-chinese',
  sectionTitle: 'text-xl font-bold text-gray-900 font-chinese',
  
  // 玻璃效果組件
  glassCard: 'glass p-6 rounded-2xl',
  glassCardSmall: 'glass p-4 rounded-xl',
  
  // 統計卡片
  statCard: 'glass p-6 rounded-2xl transition-all duration-200 hover:shadow-lg',
  
  // 表格樣式
  table: 'bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200/50',
  tableHeader: 'bg-gray-50/80 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
  tableCell: 'px-6 py-4 whitespace-nowrap',
  
  // 按鈕樣式
  primaryButton: 'bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b86c37] transition-colors font-chinese',
  secondaryButton: 'bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-chinese',
  btnPrimary: 'bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b86c37] transition-colors font-chinese',
  btnSecondary: 'bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-chinese',
  btnGhost: 'text-[#cc824d] hover:text-[#b86c37] hover:bg-[#cc824d]/10 px-4 py-2 rounded-lg transition-colors font-chinese',
  
  // 狀態標籤
  statusActive: 'bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium',
  statusInactive: 'bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium',
  statusPending: 'bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-medium',
  statusSuccess: 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 font-chinese',
  statusWarning: 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 font-chinese',
  statusError: 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 font-chinese',
  statusInfo: 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 font-chinese',
  
  // 表單元素
  input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese',
  select: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese',
  
  // 網格佈局
  gridCols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  gridCols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  gridCols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  
  // 分隔符
  divider: 'border-t border-gray-200 my-6',
  
  // 載入動畫
  loadingSpinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-[#cc824d]',
  
  // 內容卡片 (向後相容)
  contentCard: 'glass p-6 rounded-2xl',
  statsCard: 'glass p-6 rounded-2xl transition-all duration-200 hover:shadow-lg',
};

// 3. 響應式間距配置
export const ADMIN_SPACING = {
  // 頁面內邊距
  pagePadding: 'px-4 sm:px-6 lg:px-8',
  
  // 組件間距
  sectionSpacing: 'space-y-6',
  componentSpacing: 'space-y-4',
  itemSpacing: 'space-y-2',
  
  // 內邊距
  cardPadding: 'p-6',
  smallPadding: 'p-4',
  
  // 外邊距
  marginBottom: 'mb-6',
  marginTop: 'mt-6',
};

// 4. 動畫配置
export const ADMIN_ANIMATIONS = {
  fadeIn: 'opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]',
  slideUp: 'translate-y-4 opacity-0 animate-[slideUp_0.5s_ease-out_forwards]',
  hover: 'transition-all duration-200 hover:shadow-lg',
  buttonHover: 'transition-colors duration-200',
};

// 5. GSAP 動畫預設配置
export const GSAP_ANIMATIONS = {
  // 頁面載入動畫
  pageLoad: {
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  },
  
  // 卡片動畫
  cardStagger: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
  },
  
  // 表格行動畫
  tableRowStagger: {
    from: { opacity: 0, x: -20 },
    to: { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
  }
};

// 6. 標準化的狀態顏色映射
export const STATUS_COLORS = {
  // 通用狀態
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  
  // 訂單狀態
  completed: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  
  // 庫存狀態
  inStock: 'bg-green-100 text-green-800',
  lowStock: 'bg-yellow-100 text-yellow-800',
  outOfStock: 'bg-red-100 text-red-800',
  
  // 文檔狀態
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

// 7. 統一的組件 props 配置
export const COMPONENT_DEFAULTS = {
  // StandardTable 預設配置
  standardTable: {
    className: 'bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200/50',
    headerClassName: 'bg-gray-50/80',
    rowClassName: 'hover:bg-gray-50/50 transition-colors',
  },
  
  // Modal 預設配置
  modal: {
    overlayClassName: 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4',
    contentClassName: 'glass rounded-2xl p-6 w-full max-w-md mx-auto',
  },
  
  // 表單 預設配置
  form: {
    containerClassName: 'space-y-4',
    fieldClassName: 'space-y-2',
    labelClassName: 'block text-sm font-medium text-gray-700 font-chinese',
  }
};

// 8. 統一的圖標尺寸
export const ICON_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

// 9. 導出統一樣式應用函數
export const applyAdminStyles = (element, styles) => {
  if (typeof element === 'string' && styles[element]) {
    return styles[element];
  }
  return element;
};

// 10. 獲取狀態顏色的輔助函數
export const getStatusColor = (status, type = 'general') => {
  const statusKey = `${status}`;
  if (STATUS_COLORS[statusKey]) {
    return STATUS_COLORS[statusKey];
  }
  return STATUS_COLORS.inactive;
};

// 11. 預設導出
export default {
  ADMIN_COLORS,
  ADMIN_STYLES,
  ADMIN_SPACING,
  ADMIN_ANIMATIONS,
  GSAP_ANIMATIONS,
  STATUS_COLORS,
  COMPONENT_DEFAULTS,
  ICON_SIZES,
  applyAdminStyles,
  getStatusColor,
};