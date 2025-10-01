// 產品標籤系統

// 標籤類型定義
export const TAG_TYPES = {
  OUT_OF_STOCK: 'outOfStock',
  HOT_SALE: 'hotSale',
  PRE_ORDER: 'preOrder',
  NEW_ARRIVAL: 'newArrival',
  LIMITED: 'limited',
  SALE: 'sale'
};

// 標籤配置 - 包含顯示文字、顏色和樣式
export const TAG_CONFIG = {
  [TAG_TYPES.OUT_OF_STOCK]: {
    label: '缺貨',
    bgColor: 'rgba(102, 102, 102, 0.95)', // 深灰色背景
    textColor: '#FFFFFF',
    borderColor: '#666666',
    priority: 100, // 優先級最高
  },
  [TAG_TYPES.HOT_SALE]: {
    label: '熱銷中',
    bgColor: 'rgba(204, 130, 77, 0.95)', // 品牌主色
    textColor: '#FFFFFF',
    borderColor: '#CC824D',
    priority: 90,
  },
  [TAG_TYPES.PRE_ORDER]: {
    label: '預購中',
    bgColor: 'rgba(59, 130, 246, 0.95)', // 藍色
    textColor: '#FFFFFF',
    borderColor: '#3B82F6',
    priority: 80,
  },
  [TAG_TYPES.NEW_ARRIVAL]: {
    label: '新品',
    bgColor: 'rgba(16, 185, 129, 0.95)', // 綠色
    textColor: '#FFFFFF',
    borderColor: '#10B981',
    priority: 70,
  },
  [TAG_TYPES.LIMITED]: {
    label: '限量',
    bgColor: 'rgba(239, 68, 68, 0.95)', // 紅色
    textColor: '#FFFFFF',
    borderColor: '#EF4444',
    priority: 85,
  },
  [TAG_TYPES.SALE]: {
    label: '特價',
    bgColor: 'rgba(245, 158, 11, 0.95)', // 橘色
    textColor: '#FFFFFF',
    borderColor: '#F59E0B',
    priority: 75,
  }
};

/**
 * 獲取產品標籤
 * @param {Object} product - 產品物件
 * @returns {Array} 標籤數組，按優先級排序
 */
export function getProductTags(product) {
  const tags = [];

  // 根據產品狀態自動添加標籤
  if (!product.inStock) {
    tags.push(TAG_TYPES.OUT_OF_STOCK);
  }

  // 從產品的 tags 欄位添加其他標籤
  if (product.tags && Array.isArray(product.tags)) {
    tags.push(...product.tags);
  }

  // 按優先級排序（優先級高的在前）
  return tags.sort((a, b) => {
    const priorityA = TAG_CONFIG[a]?.priority || 0;
    const priorityB = TAG_CONFIG[b]?.priority || 0;
    return priorityB - priorityA;
  });
}

/**
 * �取標籤配置
 * @param {string} tagType - 標籤類型
 * @returns {Object} 標籤配置物件
 */
export function getTagConfig(tagType) {
  return TAG_CONFIG[tagType] || {
    label: tagType,
    bgColor: 'rgba(153, 153, 153, 0.95)',
    textColor: '#FFFFFF',
    borderColor: '#999999',
    priority: 0,
  };
}

/**
 * 新增自訂標籤類型
 * @param {string} key - 標籤鍵值
 * @param {Object} config - 標籤配置
 */
export function addCustomTag(key, config) {
  if (!TAG_CONFIG[key]) {
    TAG_CONFIG[key] = {
      label: config.label || key,
      bgColor: config.bgColor || 'rgba(153, 153, 153, 0.95)',
      textColor: config.textColor || '#FFFFFF',
      borderColor: config.borderColor || '#999999',
      priority: config.priority || 50,
    };
    
    // 同時添加到 TAG_TYPES
    TAG_TYPES[key.toUpperCase()] = key;
  }
  return TAG_CONFIG[key];
}
