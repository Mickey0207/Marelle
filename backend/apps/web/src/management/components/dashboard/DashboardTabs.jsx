import React from 'react';
import Overview from '../../Pages/dashboard/Overview';

const DashboardTabs = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f2]">
      {/* 頁面內容 - 導航已移至主 Dashboard.jsx */}
      <div className="flex-1">
        <Overview />
      </div>
    </div>
  );
};

export default DashboardTabs;
