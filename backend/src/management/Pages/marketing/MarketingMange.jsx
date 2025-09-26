import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// 行銷管理：內容由巢狀路由決定；子頁籤放在頂部（ManagementLayout 內的 TabNavigation）
const MarketingMange = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1">
        <Suspense fallback={<div className="p-6 text-gray-600">載入中...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default MarketingMange;

