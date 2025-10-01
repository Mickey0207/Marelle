// 貨態狀態類型
export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',           // 有現貨
  LOW_STOCK: 'low_stock',         // 庫存不足
  OUT_OF_STOCK: 'out_of_stock',   // 暫時缺貨
  PRE_ORDER: 'pre_order',         // 接受預購
  DISCONTINUED: 'discontinued'     // 已停產
};

// 貨態狀態配置
export const STOCK_STATUS_CONFIG = {
  [STOCK_STATUS.IN_STOCK]: {
    label: '有現貨',
    color: '#059669',        // 綠色
    bgColor: '#ECFDF5',      // 淺綠背景
    dotColor: '#10B981',     // 點點顏色
    icon: '✓'
  },
  [STOCK_STATUS.LOW_STOCK]: {
    label: '庫存不足',
    color: '#D97706',        // 橙色
    bgColor: '#FFFBEB',      // 淺橙背景
    dotColor: '#F59E0B',     // 點點顏色
    icon: '!'
  },
  [STOCK_STATUS.OUT_OF_STOCK]: {
    label: '暫時缺貨',
    color: '#DC2626',        // 紅色
    bgColor: '#FEF2F2',      // 淺紅背景
    dotColor: '#EF4444',     // 點點顏色
    icon: '✕'
  },
  [STOCK_STATUS.PRE_ORDER]: {
    label: '接受預購',
    color: '#2563EB',        // 藍色
    bgColor: '#EFF6FF',      // 淺藍背景
    dotColor: '#3B82F6',     // 點點顏色
    icon: '◷'
  },
  [STOCK_STATUS.DISCONTINUED]: {
    label: '已停產',
    color: '#6B7280',        // 灰色
    bgColor: '#F9FAFB',      // 淺灰背景
    dotColor: '#9CA3AF',     // 點點顏色
    icon: '—'
  }
};

/**
 * 根據庫存狀態獲取配置
 * @param {boolean} inStock - 是否有庫存
 * @param {number} stockQuantity - 庫存數量 (可選)
 * @returns {Object} 貨態狀態配置
 */
export const getStockStatus = (inStock, stockQuantity = null) => {
  if (!inStock) {
    return {
      status: STOCK_STATUS.OUT_OF_STOCK,
      config: STOCK_STATUS_CONFIG[STOCK_STATUS.OUT_OF_STOCK]
    };
  }
  
  // 如果有提供庫存數量,根據數量判斷
  if (stockQuantity !== null) {
    if (stockQuantity === 0) {
      return {
        status: STOCK_STATUS.OUT_OF_STOCK,
        config: STOCK_STATUS_CONFIG[STOCK_STATUS.OUT_OF_STOCK]
      };
    } else if (stockQuantity > 0 && stockQuantity <= 5) {
      return {
        status: STOCK_STATUS.LOW_STOCK,
        config: STOCK_STATUS_CONFIG[STOCK_STATUS.LOW_STOCK]
      };
    }
  }
  
  return {
    status: STOCK_STATUS.IN_STOCK,
    config: STOCK_STATUS_CONFIG[STOCK_STATUS.IN_STOCK]
  };
};

/**
 * 根據狀態類型獲取配置
 * @param {string} statusType - 貨態狀態類型
 * @returns {Object} 貨態狀態配置
 */
export const getStockStatusConfig = (statusType) => {
  return STOCK_STATUS_CONFIG[statusType] || STOCK_STATUS_CONFIG[STOCK_STATUS.OUT_OF_STOCK];
};
