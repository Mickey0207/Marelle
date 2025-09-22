/**
 * 路由輔助函數
 * 協助處理新的多層次路由結構
 */

import { navigationConfig, generateRoutePath, findNavigationItemByPath } from './navigationConfig.js';

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
  
  return generateRoutePath('/products', segments);
};

/**
 * 獲取當前路由的麵包屑導航
 * @param {string} pathname - 當前路由路徑
 * @returns {Array} - 麵包屑導航陣列
 */
export const getBreadcrumbs = (pathname) => {
  const params = parseRouteParams(pathname);
  const breadcrumbs = [
    { name: '首頁', href: '/' },
    { name: '商品', href: '/products' }
  ];
  
  if (params.segments.length === 0) {
    return breadcrumbs;
  }
  
  // 逐層建構麵包屑
  let currentPath = '/products';
  params.segments.forEach((segment, index) => {
    currentPath += '/' + segment;
    
    // 查找對應的導航項目來獲取中文名稱
    const navItem = findNavigationItemByPath(currentPath, navigationConfig);
    
    breadcrumbs.push({
      name: navItem ? navItem.name : segment,
      href: currentPath,
      isLast: index === params.segments.length - 1
    });
  });
  
  return breadcrumbs;
};

/**
 * 檢查路由是否為商品相關頁面
 * @param {string} pathname - 路由路徑
 * @returns {boolean} - 是否為商品頁面
 */
export const isProductRoute = (pathname) => {
  return pathname.startsWith('/products');
};

/**
 * 獲取分類的子分類列表
 * @param {string} categoryPath - 分類路徑
 * @returns {Array} - 子分類列表
 */
export const getSubcategories = (categoryPath) => {
  const params = parseRouteParams(categoryPath);
  
  // 在導航配置中查找對應的項目
  let currentLevel = navigationConfig;
  
  params.segments.forEach(segment => {
    const found = currentLevel.find(item => item.slug === segment);
    if (found && found.children) {
      currentLevel = found.children;
    } else {
      currentLevel = [];
    }
  });
  
  return currentLevel.map(item => ({
    ...item,
    href: generateRoutePath('/products', [...params.segments, item.slug])
  }));
};

/**
 * 檢查兩個路由是否為相同的父級分類
 * @param {string} path1 - 路由1
 * @param {string} path2 - 路由2
 * @param {number} level - 比較的層級深度
 * @returns {boolean} - 是否為相同父級
 */
export const isSameParentCategory = (path1, path2, level = 1) => {
  const params1 = parseRouteParams(path1);
  const params2 = parseRouteParams(path2);
  
  if (params1.segments.length < level || params2.segments.length < level) {
    return false;
  }
  
  return params1.segments.slice(0, level).join('/') === 
         params2.segments.slice(0, level).join('/');
};

/**
 * 轉換舊式查詢參數路由為新式路由
 * @param {string} pathname - 路徑
 * @param {URLSearchParams} searchParams - 查詢參數
 * @returns {string} - 新的路由路徑
 */
export const convertLegacyRoute = (pathname, searchParams) => {
  if (!pathname.startsWith('/products')) {
    return pathname;
  }
  
  const cat = searchParams.get('cat') || searchParams.get('category');
  if (!cat) {
    return pathname;
  }
  
  // 舊式路由轉換對照表
  const routeMap = {
    'paint': 'paint',
    'furniture': 'furniture', 
    'rug': 'rug',
    'curtain': 'curtain',
    'home': 'home',
    'accessories': 'home/decoration',
    'fragrance': 'home/fragrance',
    'tea': 'furniture' // 假設茶品歸類到家具茶
  };
  
  const newRoute = routeMap[cat];
  return newRoute ? `/products/${newRoute}` : pathname;
};

export default {
  parseRouteParams,
  buildProductRoute,
  getBreadcrumbs,
  isProductRoute,
  getSubcategories,
  isSameParentCategory,
  convertLegacyRoute
};