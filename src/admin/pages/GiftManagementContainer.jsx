import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  GiftIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import GiftManagement from './GiftManagement';
import GiftTierRules from './GiftTierRules';
import MemberGiftBenefits from './MemberGiftBenefits';
import GiftAllocationTracking from './GiftAllocationTracking';

const GiftManagementContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'gifts',
      name: '贈品管理',
      icon: GiftIcon,
      path: '/admin/gifts',
      description: '管理所有贈品的基本資訊和庫存'
    },
    {
      id: 'tier-rules',
      name: '階梯規則',
      icon: Cog6ToothIcon,
      path: '/admin/gifts/tier-rules',
      description: '設定多層級的贈品觸發條件'
    },
    {
      id: 'member-benefits',
      name: '會員福利',
      icon: UserGroupIcon,
      path: '/admin/gifts/member-benefits',
      description: '管理不同會員等級的專屬福利'
    },
    {
      id: 'allocation-tracking',
      name: '分配追蹤',
      icon: ChartBarIcon,
      path: '/admin/gifts/allocation-tracking',
      description: '監控分配歷史和成本統計'
    }
  ];

  const getCurrentTab = () => {
    const currentPath = location.pathname;
    if (currentPath === '/admin/gifts') return 'gifts';
    if (currentPath.includes('/tier-rules')) return 'tier-rules';
    if (currentPath.includes('/member-benefits')) return 'member-benefits';
    if (currentPath.includes('/allocation-tracking')) return 'allocation-tracking';
    return 'gifts';
  };

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  const activeTab = getCurrentTab();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2 !important' }}>
      {/* 頁面標題 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-[#cc824d] to-[#b3723f] rounded-xl">
              <GiftIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-chinese text-gray-900">贈品管理系統</h1>
              <p className="text-gray-600 font-chinese">完整的贈品配置、規則設定與分析追蹤</p>
            </div>
          </div>
        </div>
      </div>

      {/* 頁面內容 */}
      <div className="relative">
        <Routes>
          <Route index element={<GiftManagement />} />
          <Route path="tier-rules" element={<GiftTierRules />} />
          <Route path="member-benefits" element={<MemberGiftBenefits />} />
          <Route path="allocation-tracking" element={<GiftAllocationTracking />} />
        </Routes>
      </div>
    </div>
  );
};

export default GiftManagementContainer;