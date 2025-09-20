import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StandardTable from "@shared/components/StandardTable";
import supplierDataManager, { SupplierStatus, SupplierGrade, CompanyType } from "@shared/data/supplierDataManager";
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
    if (window.confirm('確�?要刪?�這個�??��??��?此�?作�??��??�除?��??�聯絡人?��??��??��??��?)) {
      const result = supplierDataManager.deleteSupplier(id);
      if (result.success) {
        loadSuppliers();
        loadStatistics();
      } else {
        alert('?�除失�?�? + result.error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [SupplierStatus.ACTIVE]: { label: '活�?', className: 'bg-green-100 text-green-800' },
      [SupplierStatus.INACTIVE]: { label: '?�用', className: 'bg-gray-100 text-gray-800' },
      [SupplierStatus.PENDING]: { label: '待審??, className: 'bg-yellow-100 text-yellow-800' },
      [SupplierStatus.SUSPENDED]: { label: '?��?', className: 'bg-red-100 text-red-800' },
      [SupplierStatus.BLACKLISTED]: { label: '黑�???, className: 'bg-red-100 text-red-900' }
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
      [SupplierGrade.A_STRATEGIC]: { label: 'A�?, className: 'bg-purple-100 text-purple-800' },
      [SupplierGrade.B_PREFERRED]: { label: 'B�?, className: 'bg-blue-100 text-blue-800' },
      [SupplierGrade.C_QUALIFIED]: { label: 'C�?, className: 'bg-green-100 text-green-800' },
      [SupplierGrade.D_CONDITIONAL]: { label: 'D�?, className: 'bg-yellow-100 text-yellow-800' },
      [SupplierGrade.E_UNQUALIFIED]: { label: 'E�?, className: 'bg-red-100 text-red-800' }
    };

    const config = gradeConfig[grade];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const renderStarRating = (rating) => {
    if (!rating) return <span className="text-gray-400">?��???/span>;
    
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

  // 表格?��?�?
  const columns = [
    {
      label: '供�??��?�?,
      sortable: true,
      render: (supplier) => (
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
      )
    },
    {
      label: '?�司類�?',
      sortable: true,
      render: (supplier) => (
        <div>
          <div className="text-sm text-gray-900">{supplier.companyType}</div>
          <div className="text-sm text-gray-500">{supplier.scale}</div>
        </div>
      )
    },
    {
      label: '?�???��?',
      sortable: true,
      render: (supplier) => (
        <div className="space-y-2">
          {getStatusBadge(supplier.status)}
          {getGradeBadge(supplier.grade)}
        </div>
      )
    },
    {
      label: '評�?',
      sortable: true,
      render: (supplier) => renderStarRating(supplier.overallRating)
    },
    {
      label: '?�聯?��?',
      render: (supplier) => (
        <div className="text-sm text-gray-900">
          <div className="flex items-center space-x-1">
            <PhoneIcon className="w-4 h-4 text-gray-400" />
            <span>{supplier.contactsCount} ?�絡�?/span>
          </div>
          <div className="flex items-center space-x-1">
            <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
            <span>{supplier.productsCount} ?�聯?��?</span>
          </div>
        </div>
      )
    },
    {
      label: '?��?',
      render: (supplier) => (
        <div className="flex space-x-2">
          <Link
            to={`/admin/suppliers/${supplier.id}`}
            className="text-[#cc824d] hover:text-[#b3723f] transition-colors"
            title="?��?詳�?"
          >
            <EyeIcon className="w-5 h-5" />
          </Link>
          <Link
            to={`/admin/suppliers/${supplier.id}/edit`}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="編輯"
          >
            <PencilIcon className="w-5 h-5" />
          </Link>
          <button
            onClick={() => handleDeleteSupplier(supplier.id)}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="?�除"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* ?�面標�??�統計卡??*/}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TruckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">總�??��?</p>
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
                <p className="text-sm text-gray-600">活�?供�???/p>
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
                <p className="text-sm text-gray-600">平�?評�?</p>
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
                <p className="text-sm text-gray-600">A級�??��?</p>
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
                <p className="text-sm text-gray-600">待審??/p>
                <p className="text-2xl font-bold text-gray-900">{statistics.pending || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ?��??�篩?�工?��? */}
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
              <span>?��?供�???/span>
            </Link>
          </div>
        </div>

        {/* 篩選?��? */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">?�??/label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">?�部?�??/option>
                  <option value={SupplierStatus.ACTIVE}>活�?</option>
                  <option value={SupplierStatus.INACTIVE}>?�用</option>
                  <option value={SupplierStatus.PENDING}>待審??/option>
                  <option value={SupplierStatus.SUSPENDED}>?��?</option>
                  <option value={SupplierStatus.BLACKLISTED}>黑�???/option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">?��?</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">?�部?��?</option>
                  <option value={SupplierGrade.A_STRATEGIC}>A�?- 策略??/option>
                  <option value={SupplierGrade.B_PREFERRED}>B�?- ?�選</option>
                  <option value={SupplierGrade.C_QUALIFIED}>C�?- ?�格</option>
                  <option value={SupplierGrade.D_CONDITIONAL}>D�?- 條件??/option>
                  <option value={SupplierGrade.E_UNQUALIFIED}>E�?- 不�???/option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">?�司類�?</label>
                <select
                  value={selectedCompanyType}
                  onChange={(e) => setSelectedCompanyType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">?�部類�?</option>
                  <option value={CompanyType.CORPORATION}>?�份?��??�司</option>
                  <option value={CompanyType.LIMITED}>?��??�司</option>
                  <option value={CompanyType.PARTNERSHIP}>?�夥企業</option>
                  <option value={CompanyType.SOLE_PROPRIETORSHIP}>?��?企業</option>
                  <option value={CompanyType.FOREIGN}>外�?企業</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 供�??�表??*/}
      <StandardTable 
        title="供�??��???
        columns={columns}
        data={suppliers}
        exportFileName="suppliers"
        emptyMessage={
          searchQuery || selectedStatus || selectedGrade || selectedCompanyType
            ? '沒�??�到符�?條件?��??��?，�?試調?��?尋�?件�?篩選??
            : '尚未添�?任�?供�???
        }
      />
    </div>
  );
};

export default SupplierList;
