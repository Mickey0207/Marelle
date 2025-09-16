import React from 'react';

const SupplierTestPage = () => {
  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">供應商管理測試頁面</h1>
        <p className="text-gray-600">
          如果您看到這個頁面，表示供應商管理的路由配置是正確的。
        </p>
        <div className="mt-4 space-y-2">
          <p><strong>當前路徑:</strong> /admin/suppliers</p>
          <p><strong>狀態:</strong> <span className="text-green-600">路由正常</span></p>
        </div>
      </div>
    </div>
  );
};

export default SupplierTestPage;