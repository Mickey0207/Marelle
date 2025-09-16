import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import couponDataManager, { CouponStatus, CouponType } from '../../data/couponDataManager';

const CouponDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [usageHistory, setUsageHistory] = useState([]);
  const [sharingStats, setSharingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const loadCouponDetails = () => {
      const couponData = couponDataManager.getCouponById(id);
      if (couponData) {
        setCoupon(couponData);
        setUsageHistory(couponDataManager.getCouponUsageHistory(id));
        setSharingStats(couponDataManager.getCouponSharingStats(id));
      }
      setLoading(false);
    };

    loadCouponDetails();
  }, [id]);

  const handleStatusChange = (newStatus) => {
    const updated = couponDataManager.updateCoupon(id, { status: newStatus });
    if (updated) {
      setCoupon({ ...coupon, status: newStatus });
    }
  };

  const handleCloneCoupon = () => {
    const cloned = couponDataManager.cloneCoupon(id);
    if (cloned) {
      navigate(`/admin/coupons/${cloned.id}/edit`);
    }
  };

  const handleShareCoupon = (platform) => {
    const shareUrl = couponDataManager.generateShareUrl(id, platform);
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      // 記錄分享事件
      couponDataManager.recordCouponShare(id, platform);
      setSharingStats(couponDataManager.getCouponSharingStats(id));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      [CouponStatus.DRAFT]: 'bg-gray-100 text-gray-700',
      [CouponStatus.ACTIVE]: 'bg-green-100 text-green-700',
      [CouponStatus.PAUSED]: 'bg-yellow-100 text-yellow-700',
      [CouponStatus.EXPIRED]: 'bg-red-100 text-red-700',
      [CouponStatus.EXHAUSTED]: 'bg-orange-100 text-orange-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeColor = (type) => {
    const colors = {
      [CouponType.FIXED_AMOUNT]: 'bg-blue-100 text-blue-700',
      [CouponType.PERCENTAGE]: 'bg-purple-100 text-purple-700',
      [CouponType.FREE_SHIPPING]: 'bg-green-100 text-green-700',
      [CouponType.BOGO]: 'bg-pink-100 text-pink-700',
      [CouponType.BUNDLE]: 'bg-indigo-100 text-indigo-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const formatValue = (coupon) => {
    switch (coupon.type) {
      case CouponType.FIXED_AMOUNT:
        return `$${coupon.value}`;
      case CouponType.PERCENTAGE:
        return `${coupon.value}%`;
      case CouponType.FREE_SHIPPING:
        return '免運費';
      case CouponType.BOGO:
        return `買${coupon.conditions.buy_quantity}送${coupon.conditions.get_quantity}`;
      default:
        return coupon.value;
    }
  };

  const TabButton = ({ tabKey, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(tabKey)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-[#cc824d] text-white'
          : 'bg-white/80 text-gray-600 hover:bg-[#cc824d]/10'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f2] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="min-h-screen bg-[#fdf8f2] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">優惠券不存在</h1>
            <p className="text-gray-600 mb-6">找不到指定的優惠券資料</p>
            <button
              onClick={() => navigate('/admin/coupons')}
              className="bg-[#cc824d] text-white px-6 py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
            >
              返回優惠券列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/coupons')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{coupon.name}</h1>
                <p className="text-gray-600">{coupon.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(coupon.status)}`}>
                {coupon.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(coupon.type)}`}>
                {coupon.type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TabButton
              tabKey="details"
              label="基本資訊"
              isActive={activeTab === 'details'}
              onClick={setActiveTab}
            />
            <TabButton
              tabKey="usage"
              label="使用記錄"
              isActive={activeTab === 'usage'}
              onClick={setActiveTab}
            />
            <TabButton
              tabKey="sharing"
              label="分享統計"
              isActive={activeTab === 'sharing'}
              onClick={setActiveTab}
            />
            <TabButton
              tabKey="lifecycle"
              label="生命週期"
              isActive={activeTab === 'lifecycle'}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'details' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">優惠券詳情</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">基本資訊</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">優惠券名稱</span>
                        <p className="font-medium">{coupon.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">優惠券代碼</span>
                        <p className="font-medium font-mono">{coupon.code}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">優惠類型</span>
                        <p className="font-medium">{coupon.type}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">優惠值</span>
                        <p className="font-medium text-[#cc824d]">{formatValue(coupon)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">描述</span>
                        <p className="text-gray-700">{coupon.description}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">使用條件</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">最低消費金額</span>
                        <p className="font-medium">${coupon.conditions.min_amount}</p>
                      </div>
                      {coupon.conditions.max_discount && (
                        <div>
                          <span className="text-sm text-gray-500">最高折扣</span>
                          <p className="font-medium">${coupon.conditions.max_discount}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-500">使用限制</span>
                        <p className="font-medium">
                          {coupon.usage_limit === -1 ? '無限制' : `限${coupon.usage_limit}次`}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">每人限用</span>
                        <p className="font-medium">
                          {coupon.user_limit === -1 ? '無限制' : `${coupon.user_limit}次`}
                        </p>
                      </div>
                      {coupon.conditions.applicable_products?.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-500">適用商品</span>
                          <p className="font-medium">{coupon.conditions.applicable_products.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">有效期間</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">開始時間</span>
                      <p className="font-medium">{new Date(coupon.start_date).toLocaleString('zh-TW')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">結束時間</span>
                      <p className="font-medium">{new Date(coupon.end_date).toLocaleString('zh-TW')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">使用記錄</h2>
                
                {usageHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">暫無使用記錄</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {usageHistory.map((record, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">訂單 #{record.order_id}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(record.used_at).toLocaleString('zh-TW')}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">客戶:</span>
                            <span className="ml-2">{record.customer_email}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">折扣金額:</span>
                            <span className="ml-2 text-[#cc824d] font-medium">${record.discount_amount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sharing' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">分享統計</h2>
                
                {sharingStats ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{sharingStats.total_shares}</div>
                        <div className="text-sm text-blue-600">總分享次數</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{sharingStats.conversion_rate}%</div>
                        <div className="text-sm text-green-600">轉換率</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">{sharingStats.viral_coefficient}</div>
                        <div className="text-sm text-purple-600">病毒係數</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">分享平台統計</h3>
                      <div className="space-y-3">
                        {Object.entries(sharingStats.platform_breakdown).map(([platform, count]) => (
                          <div key={platform} className="flex items-center justify-between">
                            <span className="capitalize">{platform}</span>
                            <span className="font-medium">{count} 次</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">快速分享</h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleShareCoupon('facebook')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShareCoupon('line')}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          LINE
                        </button>
                        <button
                          onClick={() => handleShareCoupon('email')}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Email
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">暫無分享數據</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'lifecycle' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">生命週期管理</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">當前狀態</h3>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(coupon.status)}`}>
                        {coupon.status}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          {coupon.status === CouponStatus.DRAFT && '優惠券尚未發布，需要啟用才能使用'}
                          {coupon.status === CouponStatus.ACTIVE && '優惠券正在運行中，用戶可以正常使用'}
                          {coupon.status === CouponStatus.PAUSED && '優惠券已暫停，暫時無法使用'}
                          {coupon.status === CouponStatus.EXPIRED && '優惠券已過期，無法繼續使用'}
                          {coupon.status === CouponStatus.EXHAUSTED && '優惠券使用次數已達上限'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">狀態操作</h3>
                    <div className="flex gap-3 flex-wrap">
                      {coupon.status === CouponStatus.DRAFT && (
                        <button
                          onClick={() => handleStatusChange(CouponStatus.ACTIVE)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          啟用優惠券
                        </button>
                      )}
                      {coupon.status === CouponStatus.ACTIVE && (
                        <button
                          onClick={() => handleStatusChange(CouponStatus.PAUSED)}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          暫停優惠券
                        </button>
                      )}
                      {coupon.status === CouponStatus.PAUSED && (
                        <button
                          onClick={() => handleStatusChange(CouponStatus.ACTIVE)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          恢復優惠券
                        </button>
                      )}
                      <button
                        onClick={handleCloneCoupon}
                        className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b3723f] transition-colors"
                      >
                        複製優惠券
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">使用統計</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{coupon.usage_count}</div>
                        <div className="text-sm text-blue-600">已使用次數</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">
                          {coupon.usage_limit === -1 ? '∞' : coupon.usage_limit - coupon.usage_count}
                        </div>
                        <div className="text-sm text-green-600">剩餘次數</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {coupon.usage_limit === -1 ? '0' : ((coupon.usage_count / coupon.usage_limit) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-purple-600">使用率</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/admin/coupons/${id}/edit`)}
                  className="w-full bg-[#cc824d] text-white py-2 px-4 rounded-lg hover:bg-[#b3723f] transition-colors"
                >
                  編輯優惠券
                </button>
                <button
                  onClick={handleCloneCoupon}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  複製優惠券
                </button>
                {coupon.status === CouponStatus.ACTIVE && (
                  <button
                    onClick={() => handleStatusChange(CouponStatus.PAUSED)}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    暫停優惠券
                  </button>
                )}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">效果摘要</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">使用次數</span>
                  <span className="font-medium">{coupon.usage_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">分享次數</span>
                  <span className="font-medium">{sharingStats?.total_shares || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">轉換率</span>
                  <span className="font-medium">{sharingStats?.conversion_rate || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">總節省金額</span>
                  <span className="font-medium text-[#cc824d]">
                    ${usageHistory.reduce((sum, record) => sum + record.discount_amount, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Expiry Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">有效期資訊</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">開始時間</span>
                  <p className="font-medium text-sm">
                    {new Date(coupon.start_date).toLocaleDateString('zh-TW')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">結束時間</span>
                  <p className="font-medium text-sm">
                    {new Date(coupon.end_date).toLocaleDateString('zh-TW')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">剩餘時間</span>
                  <p className="font-medium text-sm">
                    {new Date(coupon.end_date) > new Date() 
                      ? `${Math.ceil((new Date(coupon.end_date) - new Date()) / (1000 * 60 * 60 * 24))} 天`
                      : '已過期'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponDetails;