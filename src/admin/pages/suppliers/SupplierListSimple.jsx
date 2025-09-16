import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // 模擬載入資料
      setTimeout(() => {
        setSuppliers([]);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('載入供應商資料時發生錯誤');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-lg text-gray-600">載入中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 頁面標題 */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">供應商管理</h1>
          <Link
            to="/admin/suppliers/add"
            className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8704a] transition-colors"
          >
            新增供應商
          </Link>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">總供應商數</div>
          <div className="text-2xl font-bold text-gray-900">0</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">活躍供應商</div>
          <div className="text-2xl font-bold text-green-600">0</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">A級供應商</div>
          <div className="text-2xl font-bold text-purple-600">0</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">本月新增</div>
          <div className="text-2xl font-bold text-blue-600">0</div>
        </div>
      </div>

      {/* 供應商表格 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">目前沒有供應商資料</div>
            <p className="text-gray-400 mt-2">點擊上方「新增供應商」按鈕開始新增供應商</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierList;