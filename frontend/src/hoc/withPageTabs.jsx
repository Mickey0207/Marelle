import React from 'react';
import { useLocation } from 'react-router-dom';
import TabNavigation from '../components/ui/TabNavigation';

/**
 * 前台高階組件：為頁面自動添加子導航
 */
export const withPageTabs = (WrappedComponent, tabsConfig = [], options = {}) => {
  const ComponentWithTabs = (props) => {
    const location = useLocation();
    
    const {
      showTabs = true,
      tabsPosition = 'top',
      basePath = '',
      layout = 'center',
      showDescription = false,
      onTabChange = null,
      className = '',
      containerClassName = ''
    } = options;

    if (!showTabs || !tabsConfig || tabsConfig.length === 0) {
      return <WrappedComponent {...props} />;
    }

    const processedTabs = typeof tabsConfig === 'function' 
      ? tabsConfig(props, location) 
      : tabsConfig;

    const tabNavigation = (
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="h-16 flex items-center">
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

  ComponentWithTabs.displayName = `withPageTabs(${WrappedComponent.displayName || WrappedComponent.name})`;
  return ComponentWithTabs;
};

export const addPageTabs = (Component, tabs, options = {}) => {
  return withPageTabs(Component, tabs, options);
};

export default withPageTabs;