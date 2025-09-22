import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  TruckIcon,
  UserIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../lib/ui/adminStyles";

export const STATS_CATEGORIES = {
  SALES: 'sales',
  OPERATIONS: 'operations', 
  FINANCIAL: 'financial',
  INVENTORY: 'inventory',
  CUSTOMER: 'customer',
  LOGISTICS: 'logistics',
  SYSTEM: 'system'
};

export const DashboardStatsSection = ({ 
  categories = [], 
  defaultExpandedCategories = [],
  showRefreshButton = false,
  className = ""
}) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set(defaultExpandedCategories));
  const [statsData, setStatsData] = useState({});
  const [loading, setLoading] = useState(false);

  const categoryConfig = {
    [STATS_CATEGORIES.SALES]: {
      title: '銷售統計',
      icon: CurrencyDollarIcon,
      stats: [
        { label: '今日銷售', value: '125,600', trend: '+12.5%', trendUp: true },
        { label: '本月銷售', value: '456,800', trend: '+8.3%', trendUp: true },
        { label: '訂單數量', value: '1,234', trend: '+15.7%', trendUp: true },
        { label: '平均訂單值', value: '380', trend: '-2.1%', trendUp: false }
      ]
    },
    [STATS_CATEGORIES.OPERATIONS]: {
      title: '營運統計',
      icon: ClipboardDocumentListIcon,
      stats: [
        { label: '待處理訂單', value: '23', trend: '+5', trendUp: false },
        { label: '已發貨訂單', value: '156', trend: '+12', trendUp: true },
        { label: '退貨處理', value: '8', trend: '-3', trendUp: true },
        { label: '客服工單', value: '45', trend: '+7', trendUp: false }
      ]
    },
    [STATS_CATEGORIES.FINANCIAL]: {
      title: '財務概況',
      icon: ChartBarIcon,
      stats: [
        { label: '本月收入', value: '456,800', trend: '+8.3%', trendUp: true },
        { label: '本月支出', value: '234,500', trend: '+12.1%', trendUp: false },
        { label: '淨利潤', value: '222,300', trend: '+4.2%', trendUp: true },
        { label: '毛利率', value: '48.7%', trend: '-1.2%', trendUp: false }
      ]
    },
    [STATS_CATEGORIES.INVENTORY]: {
      title: '庫存狀況',
      icon: BuildingStorefrontIcon,
      stats: [
        { label: '總商品數', value: '1,567', trend: '+45', trendUp: true },
        { label: '庫存不足', value: '23', trend: '+5', trendUp: false },
        { label: '暢銷商品', value: '145', trend: '+12', trendUp: true },
        { label: '滯銷商品', value: '67', trend: '-8', trendUp: true }
      ]
    },
    [STATS_CATEGORIES.CUSTOMER]: {
      title: '客戶數據',
      icon: UserIcon,
      stats: [
        { label: '總客戶數', value: '12,345', trend: '+234', trendUp: true },
        { label: '活躍客戶', value: '8,901', trend: '+123', trendUp: true },
        { label: '新註冊', value: '67', trend: '+12', trendUp: true },
        { label: '客戶滿意度', value: '4.8', trend: '+0.2', trendUp: true }
      ]
    },
    [STATS_CATEGORIES.LOGISTICS]: {
      title: '物流配送',
      icon: TruckIcon,
      stats: [
        { label: '待配送', value: '89', trend: '+12', trendUp: false },
        { label: '配送中', value: '145', trend: '+23', trendUp: true },
        { label: '已送達', value: '234', trend: '+45', trendUp: true },
        { label: '配送異常', value: '3', trend: '-2', trendUp: true }
      ]
    },
    [STATS_CATEGORIES.SYSTEM]: {
      title: '系統狀況',
      icon: CogIcon,
      stats: [
        { label: '系統運行時間', value: '99.8%', trend: '+0.1%', trendUp: true },
        { label: '今日訪問量', value: '23,456', trend: '+1,234', trendUp: true },
        { label: '頁面載入時間', value: '1.2s', trend: '-0.1s', trendUp: true },
        { label: '錯誤率', value: '0.02%', trend: '-0.01%', trendUp: true }
      ]
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      [STATS_CATEGORIES.SALES]: '',
      [STATS_CATEGORIES.OPERATIONS]: '',
      [STATS_CATEGORIES.FINANCIAL]: '',
      [STATS_CATEGORIES.INVENTORY]: '',
      [STATS_CATEGORIES.CUSTOMER]: '',
      [STATS_CATEGORIES.LOGISTICS]: '',
      [STATS_CATEGORIES.SYSTEM]: ''
    };
    return iconMap[category] || '';
  };

  useEffect(() => {
    loadStatsData();
  }, [categories]);

  const loadStatsData = async () => {
    setLoading(true);
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = {};
      categories.forEach(category => {
        if (categoryConfig[category]) {
          mockData[category] = categoryConfig[category].stats;
        }
      });
      setStatsData(mockData);
    } catch (error) {
      console.error('載入統計數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleRefresh = () => {
    loadStatsData();
  };

  useEffect(() => {
    if (Object.keys(statsData).length > 0) {
      gsap.fromTo(
        '.stats-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [statsData]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 刷新按鈕 */}
      {showRefreshButton && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 font-chinese">數據概覽</h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`${ADMIN_STYLES.button} bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b8743d] transition-colors disabled:opacity-50`}
          >
            {loading ? '載入中...' : '刷新數據'}
          </button>
        </div>
      )}

      {categories.map(category => {
        const config = categoryConfig[category];
        if (!config) return null;

        const isExpanded = expandedCategories.has(category);
        const IconComponent = config.icon;

        return (
          <div key={category} className="space-y-4">
            {/* 類別標題 */}
            <div 
              className="flex items-center justify-between cursor-pointer p-4 bg-white/60 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/80 transition-all duration-300"
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#cc824d]/10 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-[#cc824d]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-chinese">{config.title}</h3>
                  <p className="text-sm text-gray-500">點擊展開/收起</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 統計卡片 */}
            {isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(statsData[category] || config.stats).map((stat, index) => (
                  <div key={index} className={`stats-card ${ADMIN_STYLES.glassCard} p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-600 font-chinese">{stat.label}</h4>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        stat.trendUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {stat.trend}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500">
                      較上期 {stat.trendUp ? '上升' : '下降'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cc824d]"></div>
          <span className="ml-2 text-gray-600">載入統計數據中...</span>
        </div>
      )}
    </div>
  );
};

export default DashboardStatsSection;
