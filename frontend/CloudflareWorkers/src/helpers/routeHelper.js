/**
 * 路由輔助工具
 * 處理多層次路由結構和參數解析
 */

/**
 * 從路由路徑解析分類信息
 * @param {string} pathname - 當前路由路徑
 * @returns {Object} - 解析後的分類信息
 */
export const parseRouteParams = (pathname) => {
  // 移除開頭的 /products/ 
  const segments = pathname.replace(/^\/products\/?/, '').split('/').filter(Boolean);
  
  return {
    category: segments[0] || null,
    subcategory: segments[1] || null,
    subsubcategory: segments[2] || null,
    subsubsubcategory: segments[3] || null,
    subsubsubsubcategory: segments[4] || null,
    segments,
    level: segments.length
  };
};

/**
 * 根據分類參數生成路由路徑
 * @param {Object} params - 分類參數
 * @returns {string} - 完整路由路徑
 */
export const buildProductRoute = (params) => {
  const segments = [];
  
  if (params.category) segments.push(params.category);
  if (params.subcategory) segments.push(params.subcategory);
  if (params.subsubcategory) segments.push(params.subsubcategory);
  if (params.subsubsubcategory) segments.push(params.subsubsubcategory);
  if (params.subsubsubsubcategory) segments.push(params.subsubsubsubcategory);
  
  return `/products${segments.length > 0 ? '/' + segments.join('/') : ''}`;
};

/**
 * 驗證路由參數的有效性
 * @param {Object} params - 路由參數
 * @returns {boolean} - 是否有效
 */
export const validateRouteParams = (params) => {
  // 基本驗證：確保參數不包含非法字符
  const validPattern = /^[a-z0-9-]+$/;
  
  return Object.values(params).every(value => 
    value === null || (typeof value === 'string' && validPattern.test(value))
  );
};

/**
 * 格式化路由段落
 * @param {string} segment - 路由段落
 * @returns {string} - 格式化後的段落
 */
export const formatRouteSegment = (segment) => {
  if (!segment) return '';
  return segment.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

/**
 * 解析查詢參數
 * @param {string} search - URL 查詢字串
 * @returns {Object} - 解析後的參數對象
 */
export const parseQueryParams = (search) => {
  const params = new URLSearchParams(search);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};