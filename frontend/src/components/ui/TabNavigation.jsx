import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * 前台頁籤導航元件
 * 專為前台頁面設計的子導航組件
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
    if (tabPath === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname.startsWith(tabPath);
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
    <div className={`flex items-center space-x-8 h-full flex-1 ${getLayoutClass()} ${className}`}>
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
              className={`font-medium font-serif text-base tracking-wide transition-colors relative px-2 ${
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
                  <span className="ml-2">
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
                className={`absolute left-0 -bottom-2 h-0.5 bg-[#cc824d] transition-all duration-300 ${
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