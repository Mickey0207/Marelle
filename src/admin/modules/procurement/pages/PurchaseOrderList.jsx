import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PurchaseOrderList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬載入數據
    setTimeout(() => {
      setPurchaseOrders([]);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">採購訂單列表</h1>
          <Link
            to="/admin/procurement/create"
            className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors"
          >
            新增採購訂單
          </Link>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-8 text-center">
          <p className="text-gray-600">採購訂單列表開發中...</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderList;
