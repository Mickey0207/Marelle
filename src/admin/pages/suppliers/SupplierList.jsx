import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supplierDataManager, { SupplierStatus, SupplierGrade, CompanyType } from '../../data/supplierDataManager';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  TruckIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    loadSuppliers();
    loadStatistics();
  }, [searchQuery, selectedStatus, selectedGrade, selectedCompanyType]);

  const loadSuppliers = () => {
    const filters = {
      status: selectedStatus,
      grade: selectedGrade,
      companyType: selectedCompanyType
    };
    const results = supplierDataManager.searchSuppliers(searchQuery, filters);
    setSuppliers(results);
  };

  const loadStatistics = () => {
    const stats = supplierDataManager.getSupplierStatistics();
    setStatistics(stats);
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm('確定要刪除這個供應商嗎？此操作將同時刪除相關的聯絡人和商品關聯資料。')) {
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
      [SupplierStatus.INACTIVE]: { label: '停用', className: 'bg-gray-100 text-gray-800' },
      [SupplierStatus.PENDING]: { label: '待審核', className: 'bg-yellow-100 text-yellow-800' },
      [SupplierStatus.SUSPENDED]: { label: '暫停', className: 'bg-red-100 text-red-800' },
      [SupplierStatus.BLACKLISTED]: { label: '黑名單', className: 'bg-red-100 text-red-900' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getGradeBadge = (grade) => {
    const gradeConfig = {
      [SupplierGrade.A_STRATEGIC]: { label: 'A級', className: 'bg-purple-100 text-purple-800' },
      [SupplierGrade.B_PREFERRED]: { label: 'B級', className: 'bg-blue-100 text-blue-800' },
      [SupplierGrade.C_QUALIFIED]: { label: 'C級', className: 'bg-green-100 text-green-800' },
      [SupplierGrade.D_CONDITIONAL]: { label: 'D級', className: 'bg-yellow-100 text-yellow-800' },
      [SupplierGrade.E_UNQUALIFIED]: { label: 'E級', className: 'bg-red-100 text-red-800' }
    };

    const config = gradeConfig[grade];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
        ))}
        {hasHalfStar && <StarIconSolid className="w-4 h-4 text-yellow-400 opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題和統計卡片 */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TruckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">總供應商</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">活躍供應商</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.active || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">平均評分</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.averageRating ? statistics.averageRating.toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <StarIconSolid className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">A級供應商</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.gradeDistribution?.A || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">待審核</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.pending || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 搜尋和篩選工具列 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋供應商名稱、統編、行業..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>篩選</span>
            </button>

            <Link
              to="/admin/suppliers/add"
              className="flex items-center space-x-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>新增供應商</span>
            </Link>
          </div>
        </div>

        {/* 篩選選項 */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">狀態</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">全部狀態</option>
                  <option value={SupplierStatus.ACTIVE}>活躍</option>
                  <option value={SupplierStatus.INACTIVE}>停用</option>
                  <option value={SupplierStatus.PENDING}>待審核</option>
                  <option value={SupplierStatus.SUSPENDED}>暫停</option>
                  <option value={SupplierStatus.BLACKLISTED}>黑名單</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分級</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">全部分級</option>
                  <option value={SupplierGrade.A_STRATEGIC}>A級 - 策略性</option>
                  <option value={SupplierGrade.B_PREFERRED}>B級 - 優選</option>
                  <option value={SupplierGrade.C_QUALIFIED}>C級 - 合格</option>
                  <option value={SupplierGrade.D_CONDITIONAL}>D級 - 條件性</option>
                  <option value={SupplierGrade.E_UNQUALIFIED}>E級 - 不合格</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司類型</label>
                <select
                  value={selectedCompanyType}
                  onChange={(e) => setSelectedCompanyType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">全部類型</option>
                  <option value={CompanyType.CORPORATION}>股份有限公司</option>
                  <option value={CompanyType.LIMITED}>有限公司</option>
                  <option value={CompanyType.PARTNERSHIP}>合夥企業</option>
                  <option value={CompanyType.SOLE_PROPRIETORSHIP}>獨資企業</option>
                  <option value={CompanyType.FOREIGN}>外商企業</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 供應商表格 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  供應商資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  公司類型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態/分級
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  評分
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  關聯數據
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-[#cc824d] to-[#b3723f] flex items-center justify-center">
                          <TruckIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 font-chinese">
                          {supplier.companyName}
                        </div>
                        <div className="text-sm text-gray-500">
                          統編: {supplier.taxId} | {supplier.industry}
                        </div>
                        {supplier.website && (
                          <div className="text-sm text-blue-600 hover:text-blue-800">
                            <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                              {supplier.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{supplier.companyType}</div>
                    <div className="text-sm text-gray-500">{supplier.scale}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      {getStatusBadge(supplier.status)}
                      {getGradeBadge(supplier.grade)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStarRating(supplier.overallRating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span>{supplier.contactsCount} 聯絡人</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                        <span>{supplier.productsCount} 關聯商品</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/suppliers/${supplier.id}`}
                        className="text-[#cc824d] hover:text-[#b3723f] transition-colors"
                        title="查看詳情"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/admin/suppliers/${supplier.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="編輯"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="刪除"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {suppliers.length === 0 && (
          <div className="text-center py-12">
            <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">沒有找到供應商</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedStatus || selectedGrade || selectedCompanyType
                ? '嘗試調整搜尋條件或篩選器'
                : '開始新增您的第一個供應商'
              }
            </p>
            {!searchQuery && !selectedStatus && !selectedGrade && !selectedCompanyType && (
              <div className="mt-6">
                <Link
                  to="/admin/suppliers/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#cc824d] hover:bg-[#b3723f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cc824d]"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  新增供應商
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierList;