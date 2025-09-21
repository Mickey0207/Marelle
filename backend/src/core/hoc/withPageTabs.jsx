import React from 'react';
import { useLocation } from 'react-router-dom';
import TabNavigation from '../../management/components/ui/TabNavigation';

/**
 * 高階組件：為頁面自動添加子導航
 * 避免在每個頁面重複寫子導航邏輯
 */
export const withPageTabs = (WrappedComponent, tabsConfig = [], options = {}) => {
  const ComponentWithTabs = (props) => {
    const location = useLocation();
    
    const {
      showTabs = true,
      tabsPosition = 'top', // 'top', 'bottom'
      basePath = '',
      layout = 'center',
      showDescription = false,
      onTabChange = null,
      className = '',
      containerClassName = ''
    } = options;

    // 如果沒有配置頁籤或不顯示頁籤，直接返回原組件
    if (!showTabs || !tabsConfig || tabsConfig.length === 0) {
      return <WrappedComponent {...props} />;
    }

    // 處理頁籤配置，支持動態更新
    const processedTabs = typeof tabsConfig === 'function' 
      ? tabsConfig(props, location) 
      : tabsConfig;

    const tabNavigation = (
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="h-14 flex items-center">
            <TabNavigation
              tabs={processedTabs}
              basePath={basePath}
              layout={layout}
              showDescription={showDescription}
              onTabChange={onTabChange}
              className={className}
            />
          </div>
        </div>
      </div>
    );

    return (
      <div className={`w-full ${containerClassName}`}>
        {tabsPosition === 'top' && tabNavigation}
        <WrappedComponent {...props} />
        {tabsPosition === 'bottom' && tabNavigation}
      </div>
    );
  };

  // 設定組件顯示名稱
  ComponentWithTabs.displayName = `withPageTabs(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ComponentWithTabs;
};

/**
 * 為組件添加子導航的簡化函數
 * @param {React.Component} Component - 要包裝的組件
 * @param {Array|Function} tabs - 頁籤配置
 * @param {Object} options - 選項
 * @returns {React.Component} 包裝後的組件
 */
export const addPageTabs = (Component, tabs, options = {}) => {
  return withPageTabs(Component, tabs, options);
};

export default withPageTabs;