import React from 'react';
import { ADMIN_STYLES } from "../../../../shared/styles/adminStyles";
import Overview from '../pages/Overview';

const DashboardTabs = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f2]">
      {/* 頁面內容 */}
      <div className="flex-1">
        <Overview />
      </div>
    </div>
  );
};

export default DashboardTabs;
