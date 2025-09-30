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
  onTabChange = null,
  // 新增：受控模式（不依賴路由）
  mode = 'route', // 'route' | 'controlled'
  activeKey = null
}) => {
  const location = useLocation();

  // 路徑正規化：
  // - 確保有前導斜線
  // - 移除多餘連續斜線
  // - 移除結尾斜線（根路徑除外）
  const normalizePath = (p) => {
    if (!p || p === '') return '/';
    let out = String(p).replace(/\\/g, '/');
    if (!out.startsWith('/')) out = '/' + out;
    out = out.replace(/\/{2,}/g, '/');
    if (out.length > 1 && out.endsWith('/')) out = out.slice(0, -1);
    return out;
  };

  // 路徑組合：支援 basePath 與相對路徑，避免出現 // 或漏斜線
  const joinPaths = (base, rel) => {
    const r = rel || '';
    if (r.startsWith('/')) return normalizePath(r);
    const b = base && base !== '' ? base : '/';
    return normalizePath(`${b}/${r}`);
  };

  // 處理頁籤路徑，支持基礎路徑前綴與空字串代表基礎路徑本身
  const getTabPath = (tab) => {
    // 兼容 { href } 或 { path } 兩種寫法，優先使用 href（通常為絕對路徑）
    const raw = tab?.href ?? tab?.path ?? '';
    if (raw && raw.startsWith('/')) return normalizePath(raw);
    return joinPaths(basePath || '/', raw);
  };

  // 檢查是否為活躍頁籤（使用「最長匹配」避免多個同時選中）
  const isTabActive = (tab) => {
    // 受控模式下由 activeKey 控制
    if (mode === 'controlled') {
      const key = tab.key || tab.label;
      return activeKey === key;
    }

    const currentPath = normalizePath(location.pathname || '/');
    const tabPath = getTabPath(tab);

    // 可選：tab.exact 為精確匹配
    if (tab.exact) {
      return currentPath === tabPath;
    }

    // 收集所有符合當前路徑的頁籤
    const matches = tabs.filter((t) => {
      const p = getTabPath(t);
      if (t.exact) return currentPath === p;
      return currentPath === p || currentPath.startsWith(p + '/');
    });

    if (matches.length === 0) return false;

    // 取路徑最長者（最具體）作為唯一活躍目標
    const longest = matches.reduce((prev, cur) => (
      getTabPath(prev).length >= getTabPath(cur).length ? prev : cur
    ));
    return getTabPath(longest) === tabPath;
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
        const key = tab.key || tab.label;

        return (
          <div 
            key={key}
            className="relative h-full flex items-center group"
            title={showDescription && tab.description ? tab.description : undefined}
          >
            {mode === 'controlled' ? (
              <button
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`font-medium font-serif text-sm tracking-wide transition-colors relative px-3 py-4 h-full flex items-center ${
                  isActive 
                    ? 'text-[#cc824d]' 
                    : 'text-gray-700 hover:text-[#cc824d]'
                }`}
              >
                <span className="flex items-center">
                  <span>{tab.label}</span>
                  {tab.icon && (
                    <span className="ml-1">
                      {typeof tab.icon === 'string' ? (
                        <i className={tab.icon} />
                      ) : (
                        tab.icon
                      )}
                    </span>
                  )}
                  {tab.count !== undefined && tab.count !== null && (
                    <span className="ml-2 px-2 py-1 text-xs bg-[#cc824d]/20 text-[#cc824d] rounded-full min-w-[20px] text-center">
                      {tab.count}
                    </span>
                  )}
                </span>
                <span 
                  className={`absolute left-0 bottom-0 h-0.5 bg-[#cc824d] transition-all duration-300 ${
                    isActive 
                      ? 'w-full' 
                      : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ) : (
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
                  <span>{tab.label}</span>
                  {tab.icon && (
                    <span className="ml-1">
                      {typeof tab.icon === 'string' ? (
                        <i className={tab.icon} />
                      ) : (
                        tab.icon
                      )}
                    </span>
                  )}
                  {tab.count !== undefined && tab.count !== null && (
                    <span className="ml-2 px-2 py-1 text-xs bg-[#cc824d]/20 text-[#cc824d] rounded-full min-w-[20px] text-center">
                      {tab.count}
                    </span>
                  )}
                </span>
                <span 
                  className={`absolute left-0 bottom-0 h-0.5 bg-[#cc824d] transition-all duration-300 ${
                    isActive 
                      ? 'w-full' 
                      : 'w-0 group-hover:w-full'
                  }`}
                />
              </NavLink>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TabNavigation;