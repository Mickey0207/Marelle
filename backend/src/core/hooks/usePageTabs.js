import { useLocation } from 'react-router-dom';

/**
 * 通用子導航頁籤 Hook
 * 提供動態子導航配置和狀態管理
 */
export const usePageTabs = (tabsConfig = []) => {
  const location = useLocation();

  /**
   * 檢查指定路徑是否為當前活躍路徑
   * @param {string} path - 要檢查的路徑
   * @returns {boolean} 是否活躍
   */
  const isTabActive = (path) => {
    // 如果是根路徑，需要精確匹配
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    // 其他路徑使用前綴匹配
    return location.pathname.startsWith(path);
  };

  /**
   * 取得當前活躍的頁籤
   * @returns {object|null} 當前活躍的頁籤配置
   */
  const getActiveTab = () => {
    return tabsConfig.find(tab => isTabActive(tab.path)) || null;
  };

  /**
   * 為頁籤配置添加完整的基礎路徑
   * @param {string} basePath - 基礎路徑前綴
   * @returns {array} 處理後的頁籤配置
   */
  const getTabsWithBasePath = (basePath = '') => {
    return tabsConfig.map(tab => ({
      ...tab,
      path: basePath + tab.path
    }));
  };

  return {
    tabs: tabsConfig,
    activeTab: getActiveTab(),
    isTabActive,
    getTabsWithBasePath
  };
};

/**
 * 子導航頁籤配置的工廠函數
 * 用於創建標準化的頁籤配置
 */
export const createTabConfig = ({
  label,
  path,
  key,
  icon = null,
  count = undefined,
  permission = null,
  description = ''
}) => ({
  label,
  path,
  key: key || label.toLowerCase().replace(/\s+/g, '-'),
  icon,
  count,
  permission,
  description
});

/**
 * 批量創建頁籤配置
 * @param {array} configs - 頁籤配置數組
 * @returns {array} 標準化的頁籤配置
 */
export const createTabsConfig = (configs) => {
  return configs.map(config => createTabConfig(config));
};