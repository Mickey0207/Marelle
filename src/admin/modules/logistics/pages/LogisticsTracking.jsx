import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  DocumentTextIcon,
  PhoneIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const LogisticsTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentTrackings, setRecentTrackings] = useState([]);

  useEffect(() => {
    loadRecentTrackings();
    
    // 動畫效果
    gsap.fromTo(
      '.tracking-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      alert('請輸入追蹤號碼');
      return;
    }

    setLoading(true);
    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = {
        trackingNumber: trackingNumber,
        status: 'in_transit',
        estimatedDelivery: '2024-01-25',
        origin: '台北倉庫',
        destination: '高雄市前金區',
        currentLocation: '台中轉運站',
        carrier: '黑貓宅急便',
        carrierPhone: '0800-123-456',
        orderNumber: 'ORD-2024-001',
        recipient: '王小明',
        recipientPhone: '0912345678',
        packageCount: 2,
        weight: '1.5kg',
        timeline: [
          {
            status: 'created',
            time: '2024-01-20 10:30:00',
            location: '台北倉庫',
            description: '已建立運送單，準備出貨',
            completed: true
          },
          {
            status: 'picked_up',
            time: '2024-01-20 14:15:00',
            location: '台北倉庫',
            description: '商品已由快遞員取件',
            completed: true
          },
          {
            status: 'in_transit',
            time: '2024-01-21 08:45:00',
            location: '台中轉運站',
            description: '商品運送中，已到達台中轉運站',
            completed: true
          },
          {
            status: 'out_for_delivery',
            time: null,
            location: '高雄配送中心',
            description: '商品已到達目的地配送中心，準備派送',
            completed: false
          },
          {
            status: 'delivered',
            time: null,
            location: '高雄市前金區',
            description: '商品已送達收件人',
            completed: false
          }
        ]
      };
      
      setTrackingResult(mockResult);
      
      // 添加到最近查詢記錄
      setRecentTrackings(prev => {
        const filtered = prev.filter(item => item.trackingNumber !== trackingNumber);
        return [{ trackingNumber, result: mockResult, queriedAt: new Date() }, ...filtered].slice(0, 5);
      });
      
    } catch (error) {
      console.error('Error tracking package:', error);
      alert('查詢失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentTrackings = () => {
    // 模擬載入最近查詢記錄
    const mockRecent = [
      {
        trackingNumber: 'TW1234567890',
        result: {
          status: 'delivered',
          carrier: '黑貓宅急便',
          recipient: '張小華',
          orderNumber: 'ORD-2024-002'
        },
        queriedAt: new Date('2024-01-22 15:30:00')
      },
      {
        trackingNumber: 'TW0987654321',
        result: {
          status: 'in_transit',
          carrier: '新竹貨運',
          recipient: '李美玲',
          orderNumber: 'ORD-2024-003'
        },
        queriedAt: new Date('2024-01-22 09:15:00')
      }
    ];
    setRecentTrackings(mockRecent);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <DocumentTextIcon className="w-5 h-5 text-blue-500" />;
      case 'picked_up':
        return <TruckIcon className="w-5 h-5 text-orange-500" />;
      case 'in_transit':
        return <TruckIcon className="w-5 h-5 text-yellow-500" />;
      case 'out_for_delivery':
        return <MapPinIcon className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'created':
        return '已建立';
      case 'picked_up':
        return '已取件';
      case 'in_transit':
        return '運送中';
      case 'out_for_delivery':
        return '配送中';
      case 'delivered':
        return '已送達';
      default:
        return '未知狀態';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-orange-100 text-orange-800';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">物流追蹤</h1>
        <p className="text-gray-600 mt-2">輸入追蹤號碼查詢包裹運送狀態</p>
      </div>

      {/* 追蹤查詢區域 */}
      <div className="tracking-card bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-8 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <TruckIcon className="w-16 h-16 text-[#cc824d] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 font-chinese">包裹追蹤查詢</h2>
            <p className="text-gray-600 mt-2">請輸入完整的追蹤號碼</p>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="請輸入追蹤號碼，例如：TW1234567890"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              />
            </div>
            <button
              onClick={handleTrack}
              disabled={loading || !trackingNumber.trim()}
              className="px-8 py-4 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>查詢中...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>查詢</span>
                </>
              )}
            </button>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button className="flex items-center space-x-2 text-[#cc824d] hover:text-[#b8743d] transition-colors">
              <QrCodeIcon className="w-4 h-4" />
              <span className="text-sm">掃描追蹤二維碼</span>
            </button>
          </div>
        </div>
      </div>

      {/* 追蹤結果 */}
      {trackingResult && (
        <div className="tracking-card bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden mb-8">
          {/* 結果標題 */}
          <div className="bg-gradient-to-r from-[#cc824d] to-[#b8743d] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-chinese">追蹤結果</h3>
                <p className="text-white/80 mt-1">追蹤號碼：{trackingResult.trackingNumber}</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)} bg-white/20 backdrop-blur-sm border border-white/30`}>
                  {getStatusText(trackingResult.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* 基本資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">承運商資訊</span>
                </div>
                <p className="text-gray-700">{trackingResult.carrier}</p>
                <p className="text-sm text-gray-500 mt-1">
                  客服電話：{trackingResult.carrierPhone}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPinIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">配送資訊</span>
                </div>
                <p className="text-gray-700">收件人：{trackingResult.recipient}</p>
                <p className="text-sm text-gray-500 mt-1">
                  目的地：{trackingResult.destination}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <ClockIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">預計送達</span>
                </div>
                <p className="text-gray-700">{trackingResult.estimatedDelivery}</p>
                <p className="text-sm text-gray-500 mt-1">
                  目前位置：{trackingResult.currentLocation}
                </p>
              </div>
            </div>

            {/* 包裹詳情 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h4 className="font-medium text-blue-900 mb-2">包裹詳情</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">訂單編號：</span>
                  <span className="text-blue-900">{trackingResult.orderNumber}</span>
                </div>
                <div>
                  <span className="text-blue-600">包裹數量：</span>
                  <span className="text-blue-900">{trackingResult.packageCount} 件</span>
                </div>
                <div>
                  <span className="text-blue-600">總重量：</span>
                  <span className="text-blue-900">{trackingResult.weight}</span>
                </div>
                <div>
                  <span className="text-blue-600">收件電話：</span>
                  <span className="text-blue-900">{trackingResult.recipientPhone}</span>
                </div>
              </div>
            </div>

            {/* 運送時間軸 */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6 font-chinese">運送進度</h4>
              <div className="space-y-4">
                {trackingResult.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      event.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h5 className={`font-medium ${
                          event.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {event.description}
                        </h5>
                        {event.completed && (
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <span>{event.location}</span>
                        {event.time && (
                          <span className="ml-4">{formatDateTime(event.time)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 最近查詢記錄 */}
      {recentTrackings.length > 0 && (
        <div className="tracking-card bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">最近查詢記錄</h3>
          <div className="space-y-3">
            {recentTrackings.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => {
                  setTrackingNumber(item.trackingNumber);
                  setTrackingResult(item.result);
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.result.status)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.trackingNumber}</p>
                    <p className="text-sm text-gray-500">
                      {item.result.carrier}  {item.result.recipient}  {item.result.orderNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.result.status)}`}>
                    {getStatusText(item.result.status)}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateTime(item.queriedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 幫助資訊 */}
      <div className="tracking-card bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mt-8">
        <div className="flex items-start space-x-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">追蹤說明</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li> 追蹤號碼通常在出貨通知中提供</li>
              <li> 物流資訊可能有1-2小時的延遲更新</li>
              <li> 如有問題請聯繫對應的承運商客服</li>
              <li> 支援掃描包裹上的追蹤二維碼</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsTracking;
