import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StandardTable from '../../components/StandardTable';
import { Star, Users, Shield, Package } from 'lucide-react';

// 直接導入 supplierDataManager
import supplierDataManager from '../../data/supplierDataManager';

const SupplierListFinal = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        console.log('SupplierDataManager:', supplierDataManager);
        
        if (supplierDataManager && typeof supplierDataManager.getAllSuppliers === 'function') {
          const suppliersData = supplierDataManager.getAllSuppliers();
          console.log('Loaded suppliers:', suppliersData);
          setSuppliers(suppliersData);
        } else {
          throw new Error('SupplierDataManager 未正確載入或缺少 getAllSuppliers 方法');
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
          <div className="text-red-800 font-medium">錯誤詳情:</div>
          <div className="text-red-700 mt-2">{error}</div>
          <div className="text-red-600 mt-2 text-sm">
            請檢查瀏覽器控制台的詳細錯誤資訊
          </div>
        </div>
      </div>
    );
  }

  // 計算統計資料
  const stats = {
    total: suppliers.length,
    active: suppliers.filter(s => s.status === 'active').length,
    aGrade: suppliers.filter(s => s.grade && s.grade.includes('A')).length,
    thisMonth: 0
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
          <div className="text-sm text-gray-500">{supplier.companyNameEn || 'N/A'}</div>
          <div className="text-xs text-gray-400">統編: {supplier.taxId || 'N/A'}</div>
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
        const grade = gradeMap[supplier.grade] || { text: supplier.grade || 'N/A', class: 'bg-gray-100 text-gray-800' };
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

      {/* 搜尋和篩選 */}
      
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

export default SupplierListFinal;