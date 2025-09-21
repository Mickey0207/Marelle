import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * 通用的子頁簽導航元件
 * 用於在頁面頂部顯示子功能的導航選項卡
 * 參考前台 Navbar 設計，保持一致的視覺效果
 */
const TabNavigation = ({ tabs = [], className = '' }) => {
  return (
    <div className={`flex items-center space-x-6 h-full flex-1 justify-center ${className}`}>
      {tabs.map((tab) => (
        <div key={tab.key || tab.label} className="relative h-full flex items-center group">
          <NavLink
            to={tab.path}
            className={({ isActive }) =>
              `font-medium font-serif text-sm tracking-wide transition-colors relative px-1 ${
                isActive 
                  ? 'text-[#cc824d]' 
                  : 'text-gray-700 hover:text-[#cc824d]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center">
                  {tab.label}
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
                  {tab.count !== undefined && (
                    <span className="ml-2 px-2 py-1 text-xs bg-[#cc824d]/20 text-[#cc824d] rounded-full">
                      {tab.count}
                    </span>
                  )}
                </span>
                
                {/* 底部指示線 - 完全參考前台設計 */}
                <span 
                  className={`absolute left-0 -bottom-2 h-0.5 bg-[#cc824d] transition-all duration-300 ${
                    isActive 
                      ? 'w-full' 
                      : 'w-0 group-hover:w-full'
                  }`}
                />
              </>
            )}
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default TabNavigation;