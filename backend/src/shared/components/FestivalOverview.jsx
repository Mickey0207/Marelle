import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  GiftIcon,
  TicketIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import festivalDataManager from '../utils/festivalDataManager';

const FestivalOverview = () => {
  const [overallStats, setOverallStats] = useState({});
  const [activeFestivals, setActiveFestivals] = useState([]);
  const [upcomingFestivals, setUpcomingFestivals] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const stats = festivalDataManager.getOverallStats();
      const active = festivalDataManager.getActiveFestivals();
      const upcoming = festivalDataManager.getUpcomingFestivals();
      
      setOverallStats(stats);
      setActiveFestivals(active);
      setUpcomingFestivals(upcoming);
      
      // 模擬?�近活?�數??
      setRecentActivity([
        {
          id: 1,
          type: 'festival_created',
          message: '?�建節?�活?��??�人節?��?',
          timestamp: '2025-01-20T14:00:00Z',
          icon: CalendarIcon,
          color: 'text-blue-500'
        },
        {
          id: 2,
          type: 'promotion_activated',
          message: '?��??��??�扣已�???,
          timestamp: '2025-01-20T08:00:00Z',
          icon: GiftIcon,
          color: 'text-green-500'
        },
        {
          id: 3,
          type: 'coupon_issued',
          message: '?�放500張春節專屬?��???,
          timestamp: '2025-01-19T16:30:00Z',
          icon: TicketIcon,
          color: 'text-purple-500'
        }
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error('載入?��?失�?:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: '?��?�?, color: 'bg-green-100 text-green-800' },
      scheduled: { text: '已�?�?, color: 'bg-blue-100 text-blue-800' },
      draft: { text: '?�稿', color: 'bg-gray-100 text-gray-800' },
      ended: { text: '已�???, color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cc824d]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div>
        {/* ?�面標�? */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">節?�管?�總�?/h1>
          <p className="text-gray-600">管�??�?��??�活?�、�??�設定�??��??��?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ?��?中�?節??*/}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">?��?中�?節??/h2>
              <ChartBarIcon className="h-5 w-5 text-[#cc824d]" />
            </div>
            <div className="space-y-4">
              {activeFestivals.length > 0 ? (
                activeFestivals.map((festival) => (
                  <div key={festival.id} className="p-4 bg-white/50 rounded-lg border border-white/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{festival.name}</h3>
                      {getStatusBadge(festival.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{festival.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">?��??��?:</span>
                        <div className="font-medium text-gray-900">{formatDate(festival.startDate)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">結�??��?:</span>
                        <div className="font-medium text-gray-900">{formatDate(festival.endDate)}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{festival.analytics?.views?.toLocaleString()}</div>
                          <div className="text-gray-500">?�覽??/div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{festival.analytics?.participation?.toLocaleString()}</div>
                          <div className="text-gray-500">?��?人次</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{formatCurrency(festival.analytics?.revenue || 0)}</div>
                          <div className="text-gray-500">?��?</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>?��?沒�??��?中�?節?�活??/p>
                </div>
              )}
            </div>
          </div>

          {/* ?��??��??��???*/}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">?��??��??��???/h2>
              <ClockIcon className="h-5 w-5 text-[#cc824d]" />
            </div>
            <div className="space-y-4">
              {upcomingFestivals.length > 0 ? (
                upcomingFestivals.map((festival) => (
                  <div key={festival.id} className="p-4 bg-white/50 rounded-lg border border-white/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{festival.name}</h3>
                      {getStatusBadge(festival.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{festival.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">?��??��?:</span>
                        <div className="font-medium text-gray-900">{formatDate(festival.startDate)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">結�??��?:</span>
                        <div className="font-medium text-gray-900">{formatDate(festival.endDate)}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">?��??��?類別:</span>
                        <div className="flex flex-wrap gap-1">
                          {festival.targetProducts?.map((product, index) => (
                            <span key={index} className="px-2 py-1 bg-[#cc824d]/10 text-[#cc824d] rounded text-xs">
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>?��?沒�??��??��??��??�活??/p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ?�近活??*/}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">?�近活??/h2>
            <ExclamationTriangleIcon className="h-5 w-5 text-[#cc824d]" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg border border-white/30">
                <div className={`flex-shrink-0 ${activity.color}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-500">{formatDate(activity.timestamp)}</p>
                </div>
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速�?�?*/}
        <div className="mt-8 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">快速�?�?/h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8734a] transition-colors">
              <CalendarIcon className="h-5 w-5 mr-2" />
              ?�建節??
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <GiftIcon className="h-5 w-5 mr-2" />
              設�?促銷
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <TicketIcon className="h-5 w-5 mr-2" />
              ?�放?��???
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              ?��??��?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalOverview;
