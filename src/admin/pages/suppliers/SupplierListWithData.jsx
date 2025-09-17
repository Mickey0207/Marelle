import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 先不導入 supplierDataManager，只測試基本功能
const SupplierListWithData = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // 模擬載入資料
    const loadSuppliers = async () => {
      try {
        // 嘗試從 localStorage 載入資料
        const storedSuppliers = localStorage.getItem('marelle-suppliers');
        if (storedSuppliers) {
          const parsedSuppliers = JSON.parse(storedSuppliers);
          setSuppliers(parsedSuppliers);
        } else {
          // 如果沒有資料，創建一些範例資料
          const sampleSuppliers = [
            {
              id: 'supplier-001',
              companyName: '美妝世界股份有限公司',
              companyNameEn: 'Beauty World Corp.',
              taxId: '12345678',
              status: 'active',
              grade: 'A_STRATEGIC',
              overallRating: 4.8,
              contactsCount: 2,
              productsCount: 5
            }
          ];
          localStorage.setItem('marelle-suppliers', JSON.stringify(sampleSuppliers));
          setSuppliers(sampleSuppliers);
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

  // 計算統計資料
  const stats = {
    total: suppliers.length,
    active: suppliers.filter(s => s.status === 'active').length,
    aGrade: suppliers.filter(s => s.grade === 'A_STRATEGIC').length,
    thisMonth: 0 // 暫時設為 0
  };

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
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
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
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">活躍供應商</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">A級供應商</div>
          <div className="text-2xl font-bold text-purple-600">{stats.aGrade}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600">本月新增</div>
          <div className="text-2xl font-bold text-blue-600">{stats.thisMonth}</div>
        </div>
      </div>

      {/* 供應商表格 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        {suppliers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    供應商資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    等級
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    評分
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡人/商品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
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
                        <div className="text-xs text-gray-400">
                          統編: {supplier.taxId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {supplier.status === 'active' ? '活躍' : '其他'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        A級
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {supplier.overallRating?.toFixed(1) || '0.0'} ⭐
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.contactsCount || 0} 聯絡人 / {supplier.productsCount || 0} 商品
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Link
                        to={`/admin/suppliers/${supplier.id}`}
                        className="text-[#cc824d] hover:text-[#b8704a] font-medium"
                      >
                        查看
                      </Link>
                      <Link
                        to={`/admin/suppliers/${supplier.id}/edit`}
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        編輯
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default SupplierListWithData;