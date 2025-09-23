/**
 * 導航配置輔助工具
 * 處理導航結構和路由生成
 */

/**
 * 生成路由路徑的工具函數
 * @param {string} basePath - 基礎路徑 (通常是 /products)
 * @param {Array} pathSegments - 路徑片段陣列
 * @returns {string} - 完整的路由路徑
 */
export const generateRoutePath = (basePath, pathSegments) => {
  const validSegments = pathSegments.filter(segment => segment && segment.trim() !== '');
  return validSegments.length > 0 ? `${basePath}/${validSegments.join('/')}` : basePath;
};

/**
 * 扁平化導航結構，提取所有可點擊的項目
 * @param {Array} navigationItems - 導航項目陣列
 * @param {string} basePath - 基礎路徑
 * @param {Array} parentPath - 父級路徑陣列
 * @returns {Array} - 扁平化的導航項目
 */
export const flattenNavigationItems = (navigationItems, basePath = '/products', parentPath = []) => {
  const flattened = [];
  
  navigationItems.forEach(item => {
    const currentPath = [...parentPath, item.slug];
    const fullPath = generateRoutePath(basePath, currentPath);
    
    // 添加當前項目
    flattened.push({
      ...item,
      fullPath,
      pathSegments: currentPath,
      level: currentPath.length
    });
    
    // 遞歸處理子項目
    if (item.children && item.children.length > 0) {
      flattened.push(...flattenNavigationItems(item.children, basePath, currentPath));
    }
  });
  
  return flattened;
};

/**
 * 根據路由路徑查找對應的導航項目
 * @param {Array} navigationItems - 導航項目陣列
 * @param {string} targetPath - 目標路徑
 * @returns {Object|null} - 找到的導航項目或 null
 */
export const findNavigationItemByPath = (navigationItems, targetPath) => {
  const flattened = flattenNavigationItems(navigationItems);
  return flattened.find(item => item.fullPath === targetPath) || null;
};

/**
 * 獲取麵包屑導航
 * @param {Array} navigationItems - 導航項目陣列  
 * @param {string} currentPath - 當前路徑
 * @returns {Array} - 麵包屑項目陣列
 */
export const getBreadcrumbs = (navigationItems, currentPath) => {
  const currentItem = findNavigationItemByPath(navigationItems, currentPath);
  if (!currentItem) return [];
  
  const breadcrumbs = [];
  const pathSegments = currentItem.pathSegments;
  
  // 構建每一層的麵包屑
  for (let i = 0; i < pathSegments.length; i++) {
    const segments = pathSegments.slice(0, i + 1);
    const path = generateRoutePath('/products', segments);
    const item = findNavigationItemByPath(navigationItems, path);
    
    if (item) {
      breadcrumbs.push({
        name: item.name,
        path: item.fullPath,
        isLast: i === pathSegments.length - 1
      });
    }
  }
  
  return breadcrumbs;
};