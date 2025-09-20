import React from 'react';import React, { useState, useEffect } from 'react';

import couponDataManager from '../../../shared/data/couponDataManager';

const SharingManager = () => {

  return (const SharingManager = () => {

    <div className="bg-[#fdf8f2] min-h-screen p-6">  const [coupons, setCoupons] = useState([]);

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">  const [selectedCoupon, setSelectedCoupon] = useState(null);

        <h1 className="text-2xl font-bold text-gray-900 mb-4">分享管理</h1>  const [sharingSettings, setSharingSettings] = useState({

        <p className="text-gray-600">分享管理功能開發中...</p>    enabled: false,

      </div>    platforms: {

    </div>      facebook: false,

  );      instagram: false,

};      line: false,

      email: false,

export default SharingManager;      sms: false
    },
    share_reward: {
      enabled: false,
      type: 'percentage', // 'percentage' | 'fixed_amount' | 'points'
      value: 0,
      max_shares: -1, // -1 = unlimited
      reward_per_successful_referral: true
    },
    custom_message: '',
    share_link_template: '',
    tracking: {
      track_shares: true,
      track_conversions: true,
      attribution_window: 30 // days
    }
  });
  const [shareStats, setShareStats] = useState({});
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    loadCoupons();
    loadShareStats();
  }, []);

  const loadCoupons = () => {
    const allCoupons = couponDataManager.getAllCoupons();
    setCoupons(allCoupons);
  };

  const loadShareStats = () => {
    // 模擬?�享統�??��?
    const stats = {
      total_shares: 1247,
      platform_breakdown: {
        facebook: 456,
        instagram: 321,
        line: 289,
        email: 156,
        sms: 25
      },
      conversion_rate: 12.5,
      total_conversions: 156,
      top_sharers: [
        { user_id: 'user001', name: '張�?�?, shares: 23, conversions: 5 },
        { user_id: 'user002', name: '?��???, shares: 18, conversions: 4 },
        { user_id: 'user003', name: '?��???, shares: 15, conversions: 3 }
      ]
    };
    setShareStats(stats);
  };

  const handleCouponSelect = (coupon) => {
    setSelectedCoupon(coupon);
    
    // 載入該優?�券?��?享設�?
    const settings = coupon.sharing_settings || {
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
      custom_message: `?? 快�?使用?��?專屬?��???${coupon.code}！享??${coupon.type === 'percentage' ? coupon.value + '%' : '$' + coupon.value} ?��?！`,
      share_link_template: `https://marelle.com/coupon/${coupon.code}?ref={user_id}`,
      tracking: {
        track_shares: true,
        track_conversions: true,
        attribution_window: 30
      }
    };
    
    setSharingSettings(settings);
    generateQRCode(coupon);
  };

  const generateQRCode = (coupon) => {
    // 模擬QR碼�???
    const qrData = `https://marelle.com/coupon/${coupon.code}`;
    // ?�裡?�常?�調?�QR碼�??�API
    setQrCode(`data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="none" stroke="black" stroke-width="2"/>
        <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12">QR Code</text>
        <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="8">${coupon.code}</text>
      </svg>
    `)}`);
  };

  const handleSettingChange = (path, value) => {
    setSharingSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const saveSharingSettings = () => {
    if (!selectedCoupon) return;

    const updatedCoupon = {
      ...selectedCoupon,
      sharing_settings: sharingSettings
    };

    const success = couponDataManager.updateCoupon(selectedCoupon.id, updatedCoupon);
    if (success) {
      loadCoupons();
      alert('?�享設�?已�?存�?');
    } else {
      alert('保�?失�?，�??�試');
    }
  };

  const generateShareLinks = () => {
    if (!selectedCoupon) return {};

    const baseUrl = 'https://marelle.com';
    const couponUrl = `${baseUrl}/coupon/${selectedCoupon.code}`;
    const message = encodeURIComponent(sharingSettings.custom_message);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(couponUrl)}&quote=${message}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(couponUrl)}&text=${message}`,
      email: `mailto:?subject=${encodeURIComponent('Marelle ?��??��?�?)}&body=${message}%0A%0A${encodeURIComponent(couponUrl)}`,
      copy: couponUrl
    };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('已�?製到?�貼?��?');
    });
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.download = `${selectedCoupon.code}_qrcode.svg`;
    link.href = qrCode;
    link.click();
  };

  const PlatformToggle = ({ platform, label, icon }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={sharingSettings.platforms[platform]}
          onChange={(e) => handleSettingChange(`platforms.${platform}`, e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#cc824d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cc824d]"></div>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">?�享管�?</h1>
          <p className="text-gray-600">設�??��??��?享�??��?追蹤?�享?��?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ?��??��?�?*/}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">?��??��???/h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {coupons.map(coupon => (
                <div
                  key={coupon.id}
                  onClick={() => handleCouponSelect(coupon)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedCoupon?.id === coupon.id
                      ? 'border-[#cc824d] bg-[#cc824d]/10'
                      : 'border-gray-200 hover:border-[#cc824d]/50 hover:bg-gray-50'
                  }`}
                >
                  <h3 className="font-medium text-gray-900 mb-1">{coupon.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{coupon.code}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      ?�享: {coupon.sharing_settings?.enabled ? '已�??? : '?��???}
                    </span>
                    {coupon.sharing_settings?.enabled && (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ?�享設�? */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">?�享設�?</h2>
            
            {selectedCoupon ? (
              <div className="space-y-6">
                {/* ?�中?�優?�券資�? */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{selectedCoupon.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{selectedCoupon.code}</span>
                    <span className="px-2 py-1 bg-[#cc824d]/10 text-[#cc824d] text-xs rounded-full">
                      {selectedCoupon.type === 'percentage' ? `${selectedCoupon.value}% ?�扣` : `$${selectedCoupon.value} ?�扣`}
                    </span>
                  </div>
                </div>

                {/* ?�用?�享?�能 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">?�用?�享?�能</h3>
                    <p className="text-sm text-gray-600">?�許?�戶?�享此優?�券</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sharingSettings.enabled}
                      onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#cc824d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cc824d]"></div>
                  </label>
                </div>

                {sharingSettings.enabled && (
                  <>
                    {/* ?�享平台 */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">?�享平台</h3>
                      <div className="space-y-3">
                        <PlatformToggle platform="facebook" label="Facebook" icon="??" />
                        <PlatformToggle platform="instagram" label="Instagram" icon="?��" />
                        <PlatformToggle platform="line" label="LINE" icon="?��" />
                        <PlatformToggle platform="email" label="?��??�件" icon="?��" />
                        <PlatformToggle platform="sms" label="簡�?" icon="?��" />
                      </div>
                    </div>

                    {/* ?�享?�勵 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">?�享?�勵</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sharingSettings.share_reward.enabled}
                            onChange={(e) => handleSettingChange('share_reward.enabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#cc824d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cc824d]"></div>
                        </label>
                      </div>

                      {sharingSettings.share_reward.enabled && (
                        <div className="space-y-4 pl-4 border-l-2 border-[#cc824d]/20">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">?�勵類�?</label>
                              <select
                                value={sharingSettings.share_reward.type}
                                onChange={(e) => handleSettingChange('share_reward.type', e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                              >
                                <option value="percentage">?��?比�???/option>
                                <option value="fixed_amount">?��??��?</option>
                                <option value="points">點數</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">?�勵??/label>
                              <input
                                type="number"
                                min="0"
                                value={sharingSettings.share_reward.value}
                                onChange={(e) => handleSettingChange('share_reward.value', parseFloat(e.target.value))}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">?�大�?享次??/label>
                            <input
                              type="number"
                              min="-1"
                              value={sharingSettings.share_reward.max_shares}
                              onChange={(e) => handleSettingChange('share_reward.max_shares', parseInt(e.target.value))}
                              placeholder="-1 表示?��???
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="reward_per_referral"
                              checked={sharingSettings.share_reward.reward_per_successful_referral}
                              onChange={(e) => handleSettingChange('share_reward.reward_per_successful_referral', e.target.checked)}
                              className="mr-2 text-[#cc824d] focus:ring-[#cc824d]"
                            />
                            <label htmlFor="reward_per_referral" className="text-sm text-gray-600">
                              ?�在?��??�薦?�給予�???
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ?��??�享訊息 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">?��??�享訊息</label>
                      <textarea
                        value={sharingSettings.custom_message}
                        onChange={(e) => handleSettingChange('custom_message', e.target.value)}
                        placeholder="輸入?�享?�顯示�?訊息..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ?�使?��??? {'{user_name}'}, {'{coupon_code}'}, {'{discount_value}'}
                      </p>
                    </div>

                    {/* 追蹤設�? */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">追蹤設�?</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">追蹤?�享次數</span>
                          <input
                            type="checkbox"
                            checked={sharingSettings.tracking.track_shares}
                            onChange={(e) => handleSettingChange('tracking.track_shares', e.target.checked)}
                            className="text-[#cc824d] focus:ring-[#cc824d]"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">追蹤轉�???/span>
                          <input
                            type="checkbox"
                            checked={sharingSettings.tracking.track_conversions}
                            onChange={(e) => handleSettingChange('tracking.track_conversions', e.target.checked)}
                            className="text-[#cc824d] focus:ring-[#cc824d]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 mb-1">歸�?視�? (�?</label>
                          <input
                            type="number"
                            min="1"
                            max="90"
                            value={sharingSettings.tracking.attribution_window}
                            onChange={(e) => handleSettingChange('tracking.attribution_window', parseInt(e.target.value))}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 保�??��? */}
                <button
                  onClick={saveSharingSettings}
                  className="w-full bg-[#cc824d] text-white py-3 rounded-lg hover:bg-[#b3723f] transition-colors"
                >
                  保�??�享設�?
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <p>請選?��??�優?�券來設定�?享�???/p>
              </div>
            )}
          </div>

          {/* ?�享工具?�統�?*/}
          <div className="space-y-6">
            {/* ?�享工具 */}
            {selectedCoupon && sharingSettings.enabled && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">?�享工具</h2>
                
                <div className="space-y-4">
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white rounded-lg border">
                      {qrCode && (
                        <img src={qrCode} alt="QR Code" className="w-32 h-32 mx-auto" />
                      )}
                    </div>
                    <button
                      onClick={downloadQRCode}
                      className="mt-2 text-sm text-[#cc824d] hover:text-[#b3723f]"
                    >
                      下�? QR Code
                    </button>
                  </div>

                  {/* ?�享??? */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">快速�?�?/h3>
                    <div className="space-y-2">
                      {Object.entries(generateShareLinks()).map(([platform, url]) => (
                        <button
                          key={platform}
                          onClick={() => platform === 'copy' ? copyToClipboard(url) : window.open(url, '_blank')}
                          className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {platform === 'copy' ? '複製???' : platform}
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ?�享統�? */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">?�享統�?</h2>
              
              <div className="space-y-6">
                {/* 總�?統�? */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#cc824d]">{shareStats.total_shares}</p>
                    <p className="text-sm text-gray-600">總�?享次??/p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{shareStats.conversion_rate}%</p>
                    <p className="text-sm text-gray-600">轉�???/p>
                  </div>
                </div>

                {/* 平台?��? */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">平台?��?</h3>
                  <div className="space-y-2">
                    {Object.entries(shareStats.platform_breakdown || {}).map(([platform, count]) => (
                      <div key={platform} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{platform}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#cc824d] h-2 rounded-full" 
                              style={{ width: `${(count / shareStats.total_shares) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ?��??�享??*/}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">?��??�享??/h3>
                  <div className="space-y-2">
                    {(shareStats.top_sharers || []).map((sharer, index) => (
                      <div key={sharer.user_id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-[#cc824d] text-white text-xs rounded-full flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{sharer.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{sharer.shares} 次�?�?/p>
                          <p className="text-xs text-gray-500">{sharer.conversions} 次�???/p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharingManager;
