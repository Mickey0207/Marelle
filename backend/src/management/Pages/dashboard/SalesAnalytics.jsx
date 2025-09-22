import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../lib/ui/adminStyles";
import { DashboardStatsSection, STATS_CATEGORIES } from "../../components/dashboard/DashboardStatsSection";
// withPageTabs HOC 已移除，子頁籤導航統一在頂部管理

const SalesAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    salesTrends: [],
    topCategories: [],
    timeRanges: []
  });

  useEffect(() => {
    gsap.fromTo(
      '.analytics-section',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
    
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    // 模擬分析數據
    setAnalyticsData({
      salesTrends: [
        { period: '本週', sales: 125600, growth: 12.5 },
        { period: '本月', sales: 456800, growth: 8.3 },
        { period: '本季', sales: 1345600, growth: 15.7 },
        { period: '本年', sales: 4567800, growth: 22.1 }
      ],
      topCategories: [
        { name: '連衣裙', sales: 145600, percentage: 32.1 },
        { name: '外套', sales: 98400, percentage: 21.7 },
        { name: '配件', sales: 76500, percentage: 16.8 },
        { name: '鞋類', sales: 67200, percentage: 14.8 },
        { name: '其他', sales: 65800, percentage: 14.6 }
      ],
      timeRanges: [
        { hour: '09:00', sales: 12400 },
        { hour: '12:00', sales: 18600 },
        { hour: '15:00', sales: 15200 },
        { hour: '18:00', sales: 23800 },
        { hour: '21:00', sales: 16900 }
      ]
    });
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="analytics-section mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">銷售分析</h1>
        <p className="text-gray-600 mt-2">
          深入分析銷售數據，洞察商業趨勢
        </p>
      </div>

      {/* 銷售統計 */}
      <div className="analytics-section">
        <DashboardStatsSection 
          categories={[STATS_CATEGORIES.SALES]}
          defaultExpandedCategories={[STATS_CATEGORIES.SALES]}
          showRefreshButton={true}
          className="mb-8"
        />
      </div>

      {/* 銷售趨勢 */}
      <div className="analytics-section mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">銷售趨勢</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData.salesTrends.map((trend, index) => (
            <div key={index} className={ADMIN_STYLES.glassCard}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-chinese">{trend.period}</h3>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  +{trend.growth}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-[#cc824d]">
                  {trend.sales.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">較上期成長</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 熱銷類別 */}
        <div className="analytics-section">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">熱銷類別</h2>
          <div className={ADMIN_STYLES.glassCard}>
            <div className="space-y-4">
              {analyticsData.topCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 font-chinese">{category.name}</span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{category.sales.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{category.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#cc824d] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 時段分析 */}
        <div className="analytics-section">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">時段分析</h2>
          <div className={ADMIN_STYLES.glassCard}>
            <div className="space-y-4">
              {analyticsData.timeRanges.map((timeRange, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{timeRange.hour}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{timeRange.sales.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">銷售額</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 圖表預覽 */}
      <div className="analytics-section mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">圖表分析</h2>
        <div className={ADMIN_STYLES.glassCard}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-chinese">圖表功能開發中</p>
              <p className="text-sm">將顯示詳細的銷售趨勢圖表</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
