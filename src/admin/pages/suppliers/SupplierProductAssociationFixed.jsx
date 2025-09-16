import React, { useState, useEffect } from 'react';
import supplierDataManager from '../../data/supplierDataManager';

const SupplierProductAssociationFixed = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('Loading supplier product associations...');
      const allSuppliers = supplierDataManager.getAllSuppliers();
      console.log('Loaded suppliers:', allSuppliers);
      setSuppliers(allSuppliers);
      setLoading(false);
    } catch (err) {
      console.error('Error loading supplier product associations:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">載入商品關聯資料中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">載入錯誤: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 頁面標題 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">商品關聯管理</h1>
        <p className="text-gray-600 mt-2">管理供應商與商品的關聯關係</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">總供應商數</div>
          <div className="text-2xl font-bold text-gray-900">{suppliers.length}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">商品關聯數</div>
          <div className="text-2xl font-bold text-blue-600">
            {suppliers.reduce((total, supplier) => total + (supplier.productsCount || 0), 0)}
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">活躍關聯</div>
          <div className="text-2xl font-bold text-green-600">
            {suppliers.filter(s => s.status === 'active').length}
          </div>
        </div>
      </div>

      {/* 供應商列表 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">供應商商品關聯</h3>
          
          {suppliers.length > 0 ? (
            <div className="space-y-4">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{supplier.companyName}</h4>
                      <p className="text-sm text-gray-500">{supplier.companyNameEn}</p>
                      <p className="text-xs text-gray-400">統編: {supplier.taxId}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        關聯商品: {supplier.productsCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        評分: {supplier.overallRating?.toFixed(1) || '0.0'} ⭐
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">目前沒有供應商資料</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierProductAssociationFixed;