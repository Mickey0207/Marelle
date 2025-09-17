import React, { useState, useEffect } from 'react';
import supplierDataManager from '../../data/supplierDataManager';

const SupplierPerformanceFixed = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('Loading supplier performance data...');
      const allSuppliers = supplierDataManager.getAllSuppliers();
      console.log('Loaded suppliers for performance:', allSuppliers);
      setSuppliers(allSuppliers);
      setLoading(false);
    } catch (err) {
      console.error('Error loading supplier performance:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">載入績效評估資料中...</div>
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

  // 計算績效統計
  const performanceStats = {
    totalSuppliers: suppliers.length,
    averageRating: suppliers.length > 0 
      ? suppliers.reduce((sum, s) => sum + (s.overallRating || 0), 0) / suppliers.length 
      : 0,
    topPerformers: suppliers.filter(s => (s.overallRating || 0) >= 4.5).length,
    needsImprovement: suppliers.filter(s => (s.overallRating || 0) < 3.0).length
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      {/* 頁面標題 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">供應商績效評估</h1>
        <p className="text-gray-600 mt-2">查看和管理供應商績效評估資料</p>
      </div>

      {/* 績效統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">總供應商</div>
          <div className="text-2xl font-bold text-gray-900">{performanceStats.totalSuppliers}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">平均評分</div>
          <div className="text-2xl font-bold text-blue-600">
            {performanceStats.averageRating.toFixed(1)}
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">優秀供應商</div>
          <div className="text-2xl font-bold text-green-600">{performanceStats.topPerformers}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">需改善</div>
          <div className="text-2xl font-bold text-red-600">{performanceStats.needsImprovement}</div>
        </div>
      </div>

      {/* 供應商績效列表 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">供應商績效概覽</h3>
          
          {suppliers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      供應商
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      等級
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      綜合評分
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      合作項目
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {supplier.companyName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {supplier.companyNameEn}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {supplier.grade?.includes('A') ? 'A級' : 
                           supplier.grade?.includes('B') ? 'B級' : 
                           supplier.grade?.includes('C') ? 'C級' : '未評級'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {supplier.overallRating?.toFixed(1) || '0.0'}
                          </span>
                          <span className="ml-1">⭐</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {supplier.status === 'active' ? '活躍' : '非活躍'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {supplier.contactsCount || 0} 聯絡人 / {supplier.productsCount || 0} 商品
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">目前沒有績效評估資料</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierPerformanceFixed;