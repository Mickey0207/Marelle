import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  DocumentTextIcon,
  Cog6ToothIcon,
  PlayIcon,
  InboxIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from '../../styles/adminStyles';
import TemplateManagement from './TemplateManagement';
import VariableManagement from './VariableManagement';
import TriggerManagement from './TriggerManagement';
import ChannelSettings from './ChannelSettings';
import NotificationHistory from './NotificationHistory';
import AnalyticsOverview from './AnalyticsOverview';

const NotificationManagementContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { 
      id: 'templates', 
      name: '範本管理', 
      icon: DocumentTextIcon,
      path: '/admin/notifications'
    },
    { 
      id: 'variables', 
      name: '變數管理', 
      icon: Cog6ToothIcon,
      path: '/admin/notifications/variables'
    },
    { 
      id: 'triggers', 
      name: '觸發器', 
      icon: PlayIcon,
      path: '/admin/notifications/triggers'
    },
    { 
      id: 'channels', 
      name: '渠道設定', 
      icon: InboxIcon,
      path: '/admin/notifications/channels'
    },
    { 
      id: 'history', 
      name: '通知歷史', 
      icon: ClockIcon,
      path: '/admin/notifications/history'
    },
    { 
      id: 'analytics', 
      name: '效果分析', 
      icon: ChartBarIcon,
      path: '/admin/notifications/analytics'
    }
  ];

  const isActiveTab = (path) => {
    if (path === '/admin/notifications') {
      return location.pathname === '/admin/notifications';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        {/* 頁面標題 */}
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>通知管理</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理系統通知範本、觸發器和分析效果</p>
        </div>

        {/* 頁籤導航 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = isActiveTab(tab.path);
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(tab.path)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      isActive
                        ? 'border-[#cc824d] text-[#cc824d]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon 
                      className={`mr-2 h-5 w-5 ${
                        isActive ? 'text-[#cc824d]' : 'text-gray-400 group-hover:text-gray-500'
                      }`} 
                    />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 內容區域 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 min-h-[600px]">
          <Routes>
            <Route index element={<TemplateManagement />} />
            <Route path="variables" element={<VariableManagement />} />
            <Route path="triggers" element={<TriggerManagement />} />
            <Route path="channels" element={<ChannelSettings />} />
            <Route path="history" element={<NotificationHistory />} />
            <Route path="analytics" element={<AnalyticsOverview />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagementContainer;