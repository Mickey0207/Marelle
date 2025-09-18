import React, { useState, useEffect } from 'react';

const ReturnManagement = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">退貨管理</h1>
        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-8 text-center">
          <p className="text-gray-600">退貨管理開發中...</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnManagement;
