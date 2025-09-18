import React, { useState, useEffect } from "react";
import { gsap } from 'gsap';
import {
  ChartBarIcon,
  ClockIcon,
  TruckIcon,
  CurrencyDollarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const LogisticsAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  // 模擬分析數據
  const mockAnalyticsData = {
    summary: {
      totalShipments: 1245,
      totalCost: 125680,
      averageDeliveryTime: 2.8,
      onTimeRate: 0.94,
      customerSatisfaction: 4.6
    },
    deliveryMethods: [
      { method: '標準配送', count: 680, percentage: 54.6 },
      { method: '快速配送', count: 412, percentage: 33.1 },
      { method: '特急配送', count: 153, percentage: 12.3 }
    ]
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockAnalyticsData);
    } catch (error) {
      console.error('載入分析數據失敗:', error);
    } finally {
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

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d] mx-auto mb-4"></div>
              <span className="text-gray-600">載入分析數據中...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">物流分析報表</h1>
              <p className="text-gray-600">詳細的物流數據分析、績效報表、趨勢預測</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors">
                匯出報表
              </button>
            </div>
          </div>
        </div>

        {/* 關鍵指標卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* 總配送費用 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">總配送費用</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analyticsData?.summary.totalCost || 0)}
                </p>
                <p className="text-sm text-green-600">↑ 12.5%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* 配送訂單量 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">配送訂單量</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData?.summary.totalShipments.toLocaleString() || 0}
                </p>
                <p className="text-sm text-green-600">↑ 8.3%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TruckIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* 平均配送時間 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">平均配送時間</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData?.summary.averageDeliveryTime || 0} 天
                </p>
                <p className="text-sm text-red-600">↑ 0.2天</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* 準時率 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">準時率</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(analyticsData?.summary.onTimeRate || 0)}
                </p>
                <p className="text-sm text-green-600">↑ 2.1%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* 客戶滿意度 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">客戶滿意度</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData?.summary.customerSatisfaction || 0}/5.0
                </p>
                <p className="text-sm text-green-600">↑ 0.3</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-orange-600 text-xl">★</span>
              </div>
            </div>
          </div>
        </div>

        {/* 配送方式統計 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">配送方式統計</h2>
          <div className="space-y-4">
            {analyticsData?.deliveryMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-${['blue', 'green', 'orange'][index]}-500`}></div>
                  <span className="text-gray-700">{method.method}</span>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 font-semibold">{method.count}</div>
                  <div className="text-gray-500 text-sm">{method.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsAnalytics;
