import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "@shared/adminStyles";
import supplierDataManager from "../../../shared/data/supplierDataManager";

const SupplierStatus = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  BLACKLISTED: 'blacklisted'
};

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliersPerPage] = useState(10);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0
  });

  useEffect(() => {
    loadSuppliers();
    loadStatistics();

    gsap.fromTo(
      '.supplier-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const result = await supplierDataManager.getSuppliers();
      if (result.success) {
        setSuppliers(result.data);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const result = await supplierDataManager.getSupplierStatistics();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm('確定要刪除這個供應商嗎？此操作會一併刪除相關聯絡人和採購記錄。')) {
      const result = supplierDataManager.deleteSupplier(id);
      if (result.success) {
        loadSuppliers();
        loadStatistics();
      } else {
        alert('刪除失敗：' + result.error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [SupplierStatus.ACTIVE]: { label: '活躍', className: 'bg-green-100 text-green-800' },
      [SupplierStatus.PENDING]: { label: '待審核', className: 'bg-yellow-100 text-yellow-800' },
      [SupplierStatus.SUSPENDED]: { label: '暫停', className: 'bg-red-100 text-red-800' },
      [SupplierStatus.BLACKLISTED]: { label: '黑名單', className: 'bg-red-100 text-red-900' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const indexOfLastSupplier = currentPage * suppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);
  const totalPages = Math.ceil(filteredSuppliers.length / suppliersPerPage);

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d]"></div>
          <span className="ml-3 text-gray-600">載入供應商數據中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">供應商管理</h1>
        <p className="text-gray-600 mt-2">管理所有供應商信息與合作關係</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="supplier-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
              <p className="text-sm text-gray-600">總供應商</p>
            </div>
          </div>
        </div>

        <div className="supplier-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.active}</p>
              <p className="text-sm text-gray-600">活躍供應商</p>
            </div>
          </div>
        </div>

        <div className="supplier-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.pending}</p>
              <p className="text-sm text-gray-600">待審核</p>
            </div>
          </div>
        </div>

        <div className="supplier-card bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{statistics.suspended}</p>
              <p className="text-sm text-gray-600">暫停合作</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜尋和篩選 */}
      <div className={`${ADMIN_STYLES.glassCard} p-6 mb-6`}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋供應商名稱、聯絡人或郵件..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="all">所有狀態</option>
                <option value="active">活躍</option>
                <option value="pending">待審核</option>
                <option value="suspended">暫停</option>
                <option value="blacklisted">黑名單</option>
              </select>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            新增供應商
          </button>
        </div>
      </div>

      {/* 供應商列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSuppliers.map((supplier) => (
          <div key={supplier.id} className={`supplier-card ${ADMIN_STYLES.glassCard}`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#cc824d] to-[#b8743d] rounded-lg flex items-center justify-center">
                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-chinese">{supplier.name}</h3>
                    <p className="text-sm text-gray-500">{supplier.category}</p>
                  </div>
                </div>
                {getStatusBadge(supplier.status)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {supplier.address}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {supplier.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {supplier.email}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">聯絡人：</span>
                  <span className="font-medium text-gray-900">{supplier.contactPerson}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">合作開始：</span>
                  <span className="font-medium text-gray-900">{supplier.startDate}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">信用評級：</span>
                  <span className="font-medium text-[#cc824d]">{supplier.creditRating}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  查看
                </button>
                <button className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteSupplier(supplier.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 分頁 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一頁
          </button>
          
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-[#cc824d] text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一頁
          </button>
        </div>
      )}

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg">沒有找到符合條件的供應商</div>
          <p className="text-gray-400 mt-2">嘗試調整搜尋條件或新增新的供應商</p>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
