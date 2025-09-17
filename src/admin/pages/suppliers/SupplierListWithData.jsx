import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StandardTable from '../../components/StandardTable';
import { Star, Users, Shield, Package } from 'lucide-react';

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

  // 定義表格列
  const columns = [
    {
      key: 'companyInfo',
      label: '供應商資訊',
      sortable: true,
      render: (supplier) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{supplier.companyName}</div>
          <div className="text-sm text-gray-500">{supplier.companyNameEn}</div>
          <div className="text-xs text-gray-400">統編: {supplier.taxId}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (supplier) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          supplier.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {supplier.status === 'active' ? '啟用' : '停用'}
        </span>
      )
    },
    {
      key: 'grade',
      label: '等級',
      sortable: true,
      render: (supplier) => {
        const gradeMap = {
          'A_STRATEGIC': { text: 'A級', class: 'bg-purple-100 text-purple-800' },
          'B_CORE': { text: 'B級', class: 'bg-blue-100 text-blue-800' },
          'C_STANDARD': { text: 'C級', class: 'bg-gray-100 text-gray-800' },
          'D_ALTERNATIVE': { text: 'D級', class: 'bg-yellow-100 text-yellow-800' }
        };
        const grade = gradeMap[supplier.grade] || { text: supplier.grade, class: 'bg-gray-100 text-gray-800' };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${grade.class}`}>
            {grade.text}
          </span>
        );
      }
    },
    {
      key: 'rating',
      label: '評分',
      sortable: true,
      render: (supplier) => (
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm">{supplier.rating || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'contact',
      label: '聯絡人/商品',
      sortable: false,
      render: (supplier) => (
        <div>
          <div className="text-sm text-gray-900">{supplier.contact?.name || 'N/A'}</div>
          <div className="text-xs text-gray-500 flex items-center">
            <Package className="w-3 h-3 mr-1" />
            {supplier.productCount || 0} 項商品
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (supplier) => (
        <div className="flex gap-2">
          <Link
            to={`/admin/suppliers/${supplier.id}`}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            查看
          </Link>
          <button className="text-green-600 hover:text-green-900 text-sm font-medium">
            編輯
          </button>
        </div>
      )
    }
  ];

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
      <div className="glass rounded-2xl overflow-visible">

        <StandardTable
          data={suppliers}
          columns={columns}
          emptyMessage="目前沒有供應商資料"
          emptyDescription="點擊上方「新增供應商」按鈕開始新增供應商"
          emptyIcon={Users}
        />
      </div>
    </div>
  );
};

export default SupplierListWithData;