import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StandardTable from '../../components/StandardTable';
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
    if (!rating) return <span className="text-gray-400">未評分</span>;
    
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

  // 表格列配置
  const columns = [
    {
      key: 'companyName',
      label: '供應商資訊',
      sortable: true,
      render: (_, supplier) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-[#cc824d] to-[#b3723f] flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 font-chinese">
              {supplier?.companyName || 'N/A'}
            </div>
            <div className="text-sm text-gray-500">
              統編: {supplier?.taxId || 'N/A'} | {supplier?.industry || 'N/A'}
            </div>
            {supplier?.website && (
              <div className="text-sm text-blue-600 hover:text-blue-800">
                <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                  {supplier.website}
                </a>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'companyType',
      label: '公司類型',
      sortable: true,
      render: (_, supplier) => (
        <div>
          <div className="text-sm text-gray-900">{supplier?.companyType || 'N/A'}</div>
          <div className="text-sm text-gray-500">{supplier?.scale || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: '狀態/分級',
      sortable: true,
      render: (_, supplier) => (
        <div className="space-y-2">
          {getStatusBadge(supplier?.status)}
          {getGradeBadge(supplier?.grade)}
        </div>
      )
    },
    {
      key: 'overallRating',
      label: '評分',
      sortable: true,
      render: (_, supplier) => renderStarRating(supplier?.overallRating || 0)
    },
    {
      key: 'contacts',
      label: '關聯數據',
      render: (_, supplier) => (
        <div className="text-sm text-gray-900">
          <div className="flex items-center space-x-1">
            <PhoneIcon className="w-4 h-4 text-gray-400" />
            <span>{supplier?.contactsCount || 0} 聯絡人</span>
          </div>
          <div className="flex items-center space-x-1">
            <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
            <span>{supplier?.productsCount || 0} 關聯商品</span>
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: '操作',
      render: (_, supplier) => (
        <div className="flex space-x-2">
          <Link
            to={`/admin/suppliers/${supplier?.id}`}
            className="text-[#cc824d] hover:text-[#b3723f] transition-colors"
            title="查看詳情"
          >
            <EyeIcon className="w-5 h-5" />
          </Link>
          <Link
            to={`/admin/suppliers/${supplier?.id}/edit`}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="編輯"
          >
            <PencilIcon className="w-5 h-5" />
          </Link>
          <button
            onClick={() => handleDeleteSupplier(supplier?.id)}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="刪除"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

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
      <StandardTable 
        title="供應商清單"
        columns={columns}
        data={suppliers}
        exportFileName="suppliers"
        emptyMessage={
          searchQuery || selectedStatus || selectedGrade || selectedCompanyType
            ? '沒有找到符合條件的供應商，嘗試調整搜尋條件或篩選器'
            : '尚未添加任何供應商'
        }
      />
    </div>
  );
};

export default SupplierList;