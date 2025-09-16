import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 嘗試導入 supplierDataManager
let supplierDataManager, SupplierStatus, SupplierGrade, CompanyType;

try {
  const supplierModule = await import('../../data/supplierDataManager');
  supplierDataManager = supplierModule.default;
  SupplierStatus = supplierModule.SupplierStatus;
  SupplierGrade = supplierModule.SupplierGrade;
  CompanyType = supplierModule.CompanyType;
} catch (error) {
  console.error('Error importing supplierDataManager:', error);
}

const SupplierListTest = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        if (supplierDataManager) {
          // 使用 supplierDataManager
          const suppliersData = supplierDataManager.getAllSuppliers();
          setSuppliers(suppliersData);
        } else {
          // 備用方案：直接從 localStorage 載入
          const storedSuppliers = localStorage.getItem('marelle-suppliers');
          if (storedSuppliers) {
            const parsedSuppliers = JSON.parse(storedSuppliers);
            setSuppliers(parsedSuppliers);
          } else {
            setSuppliers([]);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading suppliers:', err);
        setError('載入供應商資料時發生錯誤: ' + err.message);
        setLoading(false);
      }
    };

    loadSuppliers();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">載入供應商資料中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
          <div className="text-red-600 mt-2">
            SupplierDataManager 狀態: {supplierDataManager ? '已載入' : '未載入'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 頁面標題 */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">供應商管理 (測試版)</h1>
          <Link
            to="/admin/suppliers/add"
            className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8704a] transition-colors"
          >
            新增供應商
          </Link>
        </div>
      </div>

      {/* 調試資訊 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="text-blue-800">
          <div>SupplierDataManager: {supplierDataManager ? '✅ 已載入' : '❌ 未載入'}</div>
          <div>供應商數量: {suppliers.length}</div>
          <div>資料來源: {supplierDataManager ? 'SupplierDataManager' : 'LocalStorage'}</div>
        </div>
      </div>

      {/* 供應商列表 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        {suppliers.length > 0 ? (
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">供應商列表</h3>
            <div className="space-y-2">
              {suppliers.map((supplier, index) => (
                <div key={supplier.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium">{supplier.companyName}</div>
                  <div className="text-sm text-gray-500">{supplier.companyNameEn}</div>
                  <div className="text-xs text-gray-400">統編: {supplier.taxId}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">目前沒有供應商資料</div>
            <p className="text-gray-400 mt-2">點擊上方「新增供應商」按鈕開始新增供應商</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierListTest;