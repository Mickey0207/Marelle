import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * 通用的子頁簽導航元件
 * 用於在頁面頂部顯示子功能的導航選項卡
 * 支持動態配置和獨立使用，避免組件重複渲染
 */
const TabNavigation = ({ 
  tabs = [], 
  className = '', 
  basePath = '',
  layout = 'center', // 'center', 'left', 'right'
  showDescription = false,
  onTabChange = null
}) => {
  const location = useLocation();

  // 處理頁籤路徑，支持基礎路徑前綴
  const getTabPath = (tab) => {
    const path = tab.path.startsWith('/') ? tab.path : `${basePath}${tab.path}`;
    return path;
  };

  // 檢查是否為活躍頁籤
  const isTabActive = (tab) => {
    const tabPath = getTabPath(tab);
    const currentPath = location.pathname;
    
    // 根路徑需要精確匹配
    if (tabPath === '/') {
      return currentPath === '/' || currentPath === '';
    }
    
    // 精確匹配
    if (currentPath === tabPath) {
      return true;
    }
    
    // 檢查是否為子路徑，但要避免部分匹配
    // 例如 /products 不應該匹配 /products/inventory
    // 只有在路徑後面跟著 '/' 時才算匹配
    if (currentPath.startsWith(tabPath + '/')) {
      return true;
    }
    
    return false;
  };

  // 處理頁籤點擊事件
  const handleTabClick = (tab) => {
    if (onTabChange && typeof onTabChange === 'function') {
      onTabChange(tab);
    }
  };

  // 根據 layout 設定對齊方式
  const getLayoutClass = () => {
    switch (layout) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      case 'center':
      default:
        return 'justify-center';
    }
  };

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-6 h-16 flex-1 ${getLayoutClass()} ${className}`}>
      {tabs.map((tab) => {
        const isActive = isTabActive(tab);
        
        return (
          <div 
            key={tab.key || tab.label} 
            className="relative h-full flex items-center group"
            title={showDescription && tab.description ? tab.description : undefined}
          >
            <NavLink
              to={getTabPath(tab)}
              onClick={() => handleTabClick(tab)}
              className={`font-medium font-serif text-sm tracking-wide transition-colors relative px-3 py-4 h-full flex items-center ${
                isActive 
                  ? 'text-[#cc824d]' 
                  : 'text-gray-700 hover:text-[#cc824d]'
              }`}
            >
              <span className="flex items-center">
                {/* 頁籤標籤 */}
                <span>{tab.label}</span>
                
                {/* 如果有圖示 */}
                {tab.icon && (
                  <span className="ml-1">
                    {typeof tab.icon === 'string' ? (
                      <i className={tab.icon} />
                    ) : (
                      tab.icon
                    )}
                  </span>
                )}
                
                {/* 如果有計數 */}
                {tab.count !== undefined && tab.count !== null && (
                  <span className="ml-2 px-2 py-1 text-xs bg-[#cc824d]/20 text-[#cc824d] rounded-full min-w-[20px] text-center">
                    {tab.count}
                  </span>
                )}
              </span>
              
              {/* 底部指示線 */}
              <span 
                className={`absolute left-0 bottom-0 h-0.5 bg-[#cc824d] transition-all duration-300 ${
                  isActive 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                }`}
              />
            </NavLink>
          </div>
        );
      })}
    </div>
  );
};

export default TabNavigation;