import React, { useState, useEffect } from 'react';
import { ADMIN_STYLES } from '../../../../lib/ui/adminStyles';
import couponDataManager from '../../../lib/data/coupons/couponDataManager';

const SharingManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [sharingSettings, setSharingSettings] = useState({
    enabled: false,
    platforms: {
      facebook: false,
      instagram: false,
      line: false,
      email: false,
      sms: false
    },
    share_reward: {
      enabled: false,
      type: 'percentage',
      value: 0,
      max_shares: -1,
      reward_per_successful_referral: true
    },
    custom_message: '',
    share_link_template: '',
    tracking: {
      track_shares: true,
      track_conversions: true,
      attribution_window: 30
    }
  });
  const [shareStats, setShareStats] = useState({});

  useEffect(() => {
    loadCoupons();
    loadShareStats();
  }, []);

  const loadCoupons = () => {
    const allCoupons = couponDataManager.getAllCoupons();
    setCoupons(allCoupons);
  };

  const loadShareStats = () => {
    setShareStats({
      total_shares: 156,
      successful_conversions: 23,
      conversion_rate: 14.7,
      platforms: {
        facebook: 45,
        instagram: 32,
        line: 67,
        email: 12
      }
    });
  };

  const handleCouponSelect = (coupon) => {
    setSelectedCoupon(coupon);
    if (coupon && coupon.sharing_settings) {
      setSharingSettings({ ...sharingSettings, ...coupon.sharing_settings });
    }
  };

  const updateSharingSettings = (field, value) => {
    setSharingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePlatformSettings = (platform, enabled) => {
    setSharingSettings(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: enabled
      }
    }));
  };

  const updateRewardSettings = (field, value) => {
    setSharingSettings(prev => ({
      ...prev,
      share_reward: {
        ...prev.share_reward,
        [field]: value
      }
    }));
  };

  const saveSharingSettings = () => {
    if (!selectedCoupon) return;
    
    const updatedCoupon = {
      ...selectedCoupon,
      sharing_settings: sharingSettings
    };
    
    couponDataManager.updateCoupon(updatedCoupon.id, updatedCoupon);
    setCoupons(prev => 
      prev.map(c => c.id === updatedCoupon.id ? updatedCoupon : c)
    );
    
    alert('分享設定已保存！');
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>優惠券分享管理</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理優惠券分享功能和設定</p>
        </div>
        
        <div className={ADMIN_STYLES.contentCard + " mb-6"}>
          <h2 className="text-xl font-semibold mb-4">選擇優惠券</h2>
          <div className="grid grid-cols-3 gap-4">
            {coupons.map(coupon => (
              <div
                key={coupon.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCoupon?.id === coupon.id
                    ? 'border-[#cc824d] bg-[#cc824d]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCouponSelect(coupon)}
              >
                <div className="font-semibold">{coupon.code}</div>
                <div className="text-sm text-gray-600">{coupon.name}</div>
                <div className="text-sm text-gray-500">
                  有效期至: {new Date(coupon.end_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCoupon && (
          <div className={ADMIN_STYLES.contentCard + " mb-6"}>
            <h2 className="text-xl font-semibold mb-4">分享設定 - {selectedCoupon.code}</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">基本設定</h3>
                
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={sharingSettings.enabled}
                    onChange={(e) => updateSharingSettings('enabled', e.target.checked)}
                    className="mr-2"
                  />
                  啟用分享功能
                </label>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">自訂分享訊息</label>
                  <textarea
                    value={sharingSettings.custom_message}
                    onChange={(e) => updateSharingSettings('custom_message', e.target.value)}
                    placeholder="輸入自訂的分享訊息..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="3"
                  />
                </div>

                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2">支援平台</h4>
                  <div className="space-y-2">
                    {Object.entries(sharingSettings.platforms).map(([platform, enabled]) => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => updatePlatformSettings(platform, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="capitalize">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">分享獎勵</h3>
                
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={sharingSettings.share_reward.enabled}
                    onChange={(e) => updateRewardSettings('enabled', e.target.checked)}
                    className="mr-2"
                  />
                  啟用分享獎勵
                </label>

                {sharingSettings.share_reward.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">獎勵類型</label>
                      <select
                        value={sharingSettings.share_reward.type}
                        onChange={(e) => updateRewardSettings('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="percentage">百分比折扣</option>
                        <option value="fixed_amount">固定金額</option>
                        <option value="points">點數獎勵</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">獎勵數值</label>
                      <input
                        type="number"
                        value={sharingSettings.share_reward.value}
                        onChange={(e) => updateRewardSettings('value', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">最大分享次數 (-1 = 無限制)</label>
                      <input
                        type="number"
                        value={sharingSettings.share_reward.max_shares}
                        onChange={(e) => updateRewardSettings('max_shares', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={saveSharingSettings}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                保存設定
              </button>
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <h3 className="text-lg font-semibold mb-4">分享統計</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>總分享次數</span>
              <span className="font-semibold">{shareStats.total_shares}</span>
            </div>
            <div className="flex justify-between">
              <span>成功轉換</span>
              <span className="font-semibold">{shareStats.successful_conversions}</span>
            </div>
            <div className="flex justify-between">
              <span>轉換率</span>
              <span className="font-semibold">{shareStats.conversion_rate}%</span>
            </div>
            
            {shareStats.platforms && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">各平台分享數</h4>
                {Object.entries(shareStats.platforms).map(([platform, count]) => (
                  <div key={platform} className="flex justify-between text-sm">
                    <span className="capitalize">{platform}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharingManager;