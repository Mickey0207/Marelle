import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  CurrencyDollarIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "@shared/adminStyles";
import Overview from '../pages/Overview';
import SalesAnalytics from '../pages/SalesAnalytics';
import OperationsManagement from '../pages/OperationsManagement';
import FinanceReports from '../pages/FinanceReports';
import LogisticsManagement from '../pages/LogisticsManagement';

const DashboardTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // å¾?URL è·¯å?ç¢ºå??¶å??ç±¤
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/admin/sales')) return 'sales';
    if (path.includes('/admin/operations')) return 'operations';
    if (path.includes('/admin/finance')) return 'finance';
    if (path.includes('/admin/logistics-dashboard')) return 'logistics';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  const tabs = [
    {
      id: 'overview',
      name: 'ç¸½è¦½',
      icon: HomeIcon,
      path: '/admin',
      component: Overview
    },
    {
      id: 'sales',
      name: '?·å”®?†æ?',
      icon: ChartBarIcon,
      path: '/admin/sales',
      component: SalesAnalytics
    },
    {
      id: 'operations',
      name: '?Ÿé?ç®¡ç?',
      icon: CogIcon,
      path: '/admin/operations',
      component: OperationsManagement
    },
    {
      id: 'finance',
      name: 'è²¡å??±è¡¨',
      icon: CurrencyDollarIcon,
      path: '/admin/finance',
      component: FinanceReports
    },
    {
      id: 'logistics',
      name: '?©æ?ç®¡ç?',
      icon: TruckIcon,
      path: '/admin/logistics-dashboard',
      component: LogisticsManagement
    }
  ];

  const handleTabChange = (tabId, path) => {
    setActiveTab(tabId);
    navigate(path);
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Overview;

  return (
    <div className="min-h-screen bg-[#fdf8f2]">
      {/* å°èˆªæ¨™ç±¤ */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex space-x-1 bg-gray-100/50 rounded-lg p-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id, tab.path)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap
                    transition-all duration-200 font-chinese
                    ${isActive 
                      ? 'bg-white text-[#cc824d] shadow-sm ring-1 ring-[#cc824d]/20' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#cc824d]' : 'text-gray-500'}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ?é¢?§å®¹ */}
      <div className="flex-1">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default DashboardTabs;
