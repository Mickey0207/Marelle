import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import couponDataManager, { 
  CouponType, 
  CouponStatus, 
  ConditionType 
} from '../../data/couponDataManager';
import SearchableSelect from '../../../components/SearchableSelect';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  GiftIcon,
  TagIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShareIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  EllipsisVerticalIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadCoupons();
    loadStatistics();
  }, [selectedStatus, selectedType, dateRange]);

  const loadCoupons = () => {
    setLoading(true);
    try {
      const filters = {
        search: '',
        status: selectedStatus,
        type: selectedType,
        startDate: dateRange.start,
        endDate: dateRange.end,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      
      const filteredCoupons = couponDataManager.getAllCoupons(filters);
      setCoupons(filteredCoupons);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = () => {
    const stats = couponDataManager.getCouponStatistics(dateRange);
    setStatistics(stats);
  };

  const handleSelectCoupon = (couponId) => {
    setSelectedCoupons(prev => {
      const newSelection = prev.includes(couponId)
        ? prev.filter(id => id !== couponId)
        : [...prev, couponId];
      
      setShowBatchActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedCoupons.length === coupons.length) {
      setSelectedCoupons([]);
      setShowBatchActions(false);
    } else {
      setSelectedCoupons(coupons.map(c => c.id));
      setShowBatchActions(true);
    }
  };

  const handleBatchStatusUpdate = (newStatus) => {
    const result = couponDataManager.batchUpdateCoupons(selectedCoupons, { status: newStatus });
    if (result.success) {
      loadCoupons();
      setSelectedCoupons([]);
      setShowBatchActions(false);
    }
  };

  const handleBatchDelete = () => {
    if (window.confirm('確定要刪除選中的優惠券嗎？')) {
      const result = couponDataManager.batchDeleteCoupons(selectedCoupons);
      if (result.success) {
        loadCoupons();
        setSelectedCoupons([]);
        setShowBatchActions(false);
      }
    }
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm('確定要刪除這個優惠券嗎？')) {
      const result = couponDataManager.deleteCoupon(id);
      if (result.success) {
        loadCoupons();
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [CouponStatus.ACTIVE]: { 
        label: '啟用中', 
        className: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      },
      [CouponStatus.DRAFT]: { 
        label: '草稿', 
        className: 'bg-gray-100 text-gray-800',
        icon: ClockIcon
      },
      [CouponStatus.PAUSED]: { 
        label: '暫停', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: PauseIcon
      },
      [CouponStatus.EXPIRED]: { 
        label: '已過期', 
        className: 'bg-red-100 text-red-800',
        icon: ExclamationTriangleIcon
      },
      [CouponStatus.DEPLETED]: { 
        label: '已用完', 
        className: 'bg-orange-100 text-orange-800',
        icon: StopIcon
      },
      [CouponStatus.CANCELLED]: { 
        label: '已取消', 
        className: 'bg-red-100 text-red-800',
        icon: ExclamationTriangleIcon
      }
    };

    const config = statusConfig[status] || { 
      label: status, 
      className: 'bg-gray-100 text-gray-800',
      icon: ClockIcon
    };
    
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        <IconComponent className="w-4 h-4 mr-2" />
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      [CouponType.FIXED_AMOUNT]: { label: '固定金額', color: 'blue' },
      [CouponType.PERCENTAGE]: { label: '百分比', color: 'green' },
      [CouponType.FREE_SHIPPING]: { label: '免運券', color: 'purple' },
      [CouponType.BUY_ONE_GET_ONE]: { label: '買一送一', color: 'pink' },
      [CouponType.BUNDLE_DISCOUNT]: { label: '組合優惠', color: 'indigo' },
      [CouponType.MEMBER_EXCLUSIVE]: { label: '會員專屬', color: 'yellow' },
      [CouponType.NEW_USER_BONUS]: { label: '新會員', color: 'cyan' },
      [CouponType.BIRTHDAY_GIFT]: { label: '生日禮', color: 'rose' },
      [CouponType.CASHBACK]: { label: '現金回饋', color: 'emerald' }
    };

    const config = typeConfig[type] || { label: type, color: 'gray' };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const calculateUsageRate = (coupon) => {
    const userCoupons = couponDataManager.getUserCoupons('all', { couponId: coupon.id });
    const totalIssued = userCoupons.length;
    const totalUsed = userCoupons.filter(uc => uc.status === 'used').length;
    return totalIssued > 0 ? ((totalUsed / totalIssued) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">載入優惠券資料中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-chinese">優惠券管理</h1>
            <p className="text-gray-600 mt-2 font-chinese">管理所有優惠券、疊加規則和分享設定</p>
          </div>
          <Link
            to="/admin/coupons/new"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>新增優惠券</span>
          </Link>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總優惠券數</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TagIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">啟用中</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.active || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">使用率</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.usageRate?.toFixed(1) || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總折扣金額</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(statistics.totalDiscount || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 篩選 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 border border-gray-300 text-gray-700 rounded-lg hover:bg-[#fdf8f2]/30 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>篩選</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">狀態</label>
                <SearchableSelect
                  options={[
                    { value: '', label: '全部狀態' },
                    { value: CouponStatus.ACTIVE, label: '啟用中' },
                    { value: CouponStatus.DRAFT, label: '草稿' },
                    { value: CouponStatus.PAUSED, label: '暫停' },
                    { value: CouponStatus.EXPIRED, label: '已過期' },
                    { value: CouponStatus.DEPLETED, label: '已用完' },
                    { value: CouponStatus.CANCELLED, label: '已取消' }
                  ]}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="選擇狀態"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">類型</label>
                <SearchableSelect
                  options={[
                    { value: '', label: '全部類型' },
                    { value: CouponType.FIXED_AMOUNT, label: '固定金額' },
                    { value: CouponType.PERCENTAGE, label: '百分比' },
                    { value: CouponType.FREE_SHIPPING, label: '免運券' },
                    { value: CouponType.BUY_ONE_GET_ONE, label: '買一送一' },
                    { value: CouponType.MEMBER_EXCLUSIVE, label: '會員專屬' },
                    { value: CouponType.NEW_USER_BONUS, label: '新會員優惠' }
                  ]}
                  value={selectedType}
                  onChange={setSelectedType}
                  placeholder="選擇類型"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">開始日期</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">結束日期</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 批量操作工具列 */}
      {showBatchActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              已選擇 {selectedCoupons.length} 個優惠券
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBatchStatusUpdate(CouponStatus.ACTIVE)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                批量啟用
              </button>
              <button
                onClick={() => handleBatchStatusUpdate(CouponStatus.PAUSED)}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                批量暫停
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                批量刪除
              </button>
              <button
                onClick={() => {
                  setSelectedCoupons([]);
                  setShowBatchActions(false);
                }}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                取消選擇
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 優惠券列表 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#fdf8f2]/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCoupons.length === coupons.length && coupons.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  優惠券資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  類型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  折扣
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  有效期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[#fdf8f2]/30 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCoupons.includes(coupon.id)}
                      onChange={() => handleSelectCoupon(coupon.id)}
                      className="rounded border-gray-300 text-[#cc824d] focus:ring-[#cc824d]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#cc824d] to-[#b3723f] rounded-lg flex items-center justify-center">
                        <GiftIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{coupon.name}</div>
                        <div className="text-sm text-gray-500 font-mono">{coupon.code}</div>
                        <div className="text-xs text-gray-400 mt-1">{coupon.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getTypeBadge(coupon.type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {coupon.type === CouponType.PERCENTAGE ? 
                        `${coupon.discountConfig.value}%` :
                        coupon.type === CouponType.FIXED_AMOUNT ?
                        formatCurrency(coupon.discountConfig.value) :
                        coupon.type === CouponType.FREE_SHIPPING ?
                        '免運費' : '優惠'
                      }
                    </div>
                    {coupon.discountConfig.minOrderAmount && (
                      <div className="text-xs text-gray-500">
                        滿 {formatCurrency(coupon.discountConfig.minOrderAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {coupon.validity.validityType === 'permanent' ? (
                        <span className="text-green-600">永久有效</span>
                      ) : (
                        <div>
                          <div>{formatDate(coupon.validity.startDate)}</div>
                          <div className="text-gray-500">至 {formatDate(coupon.validity.endDate)}</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {calculateUsageRate(coupon)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(coupon.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/admin/coupons/${coupon.id}`}
                        className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors"
                        title="查看詳情"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/coupons/${coupon.id}/edit`}
                        className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors"
                        title="編輯"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      {coupon.sharingConfig?.isShareable && (
                        <button
                          className="p-2 text-gray-400 hover:text-[#cc824d] transition-colors"
                          title="分享管理"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="刪除"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-12">
            <GiftIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">沒有優惠券</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedStatus || selectedType 
                ? '沒有符合篩選條件的優惠券'
                : '開始建立您的第一個優惠券吧！'
              }
            </p>
            {!searchQuery && !selectedStatus && !selectedType && (
              <div className="mt-6">
                <Link
                  to="/admin/coupons/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#cc824d] hover:bg-[#b3723f]"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  新增優惠券
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponList;