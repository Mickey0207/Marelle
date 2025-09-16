import React from 'react';

const SupplierPerformanceSimple = () => {
  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">供應商績效評估</h1>
        <p className="text-gray-600">
          這是供應商績效評估頁面的簡化版本。如果您看到這個內容，表示路由配置是正確的。
        </p>
        <div className="mt-4 space-y-2">
          <p><strong>當前路徑:</strong> /admin/suppliers/performance</p>
          <p><strong>狀態:</strong> <span className="text-green-600">路由正常</span></p>
          <p><strong>功能:</strong> 查看和管理供應商績效評估</p>
        </div>
      </div>
    </div>
  );
};

export default SupplierPerformanceSimple;