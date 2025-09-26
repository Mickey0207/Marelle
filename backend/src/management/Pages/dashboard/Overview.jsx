import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../lib/ui/adminStyles";
import { DashboardStatsSection, STATS_CATEGORIES } from "../../components/dashboard/DashboardStatsSection";

const AdminOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    recentOrders: [],
    topProducts: [],
    alerts: []
  });

  useEffect(() => {
    gsap.fromTo(
      '.dashboard-section',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
    
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // 模擬載入數據
    setDashboardData({
      recentOrders: generateMockOrders(),
      topProducts: generateMockProducts(),
      alerts: [
        { id: 1, type: 'warning', message: '庫存不足警告：白色連衣裙庫存僅剩 3 件' },
        { id: 2, type: 'info', message: '新客戶註冊：今日新增 15 位客戶' },
        { id: 3, type: 'success', message: '銷售目標達成：本月已達成 105% 銷售目標' }
      ]
    });
  };

  const generateMockOrders = () => 
    Array.from({ length: 5 }, (_, i) => ({
      id: `ORD-${Date.now()}-${i}`,
      customerName: ['張小明', '李小美', '王先生', '陳小姐', '林大哥'][i],
      amount: Math.floor(Math.random() * 5000) + 1000,
      status: ['已完成', '處理中', '已發貨'][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      items: Math.floor(Math.random() * 5) + 1
    }));

  const generateMockProducts = () => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: ['優雅白色連衣裙', '經典黑色西裝外套', '時尚牛仔褲', '舒適棉質T恤', '精緻絲巾'][i],
      sales: Math.floor(Math.random() * 100) + 50
    }));

  const getStatusColor = (status) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-800';
      case '處理中':
        return 'bg-yellow-100 text-yellow-800';
      case '已發貨':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 歡迎區塊 */}
      <div className="dashboard-section mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-chinese">管理儀表板</h1>
            <p className="text-gray-600 mt-2">歡迎回到 Marelle 管理系統</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">今日日期</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString('zh-TW', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 統計卡片區塊 */}
      <div className="dashboard-section">
        <DashboardStatsSection 
          categories={[STATS_CATEGORIES.SALES, STATS_CATEGORIES.OPERATIONAL]}
          defaultExpandedCategories={[STATS_CATEGORIES.SALES]}
          showRefreshButton={true}
          className="mb-8"
        />
      </div>

      {/* 快速概覽卡片 */}
      <div className="dashboard-section mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">今日概覽</h2>
  <div className="grid grid-cols-4 gap-6">
          <div className={ADMIN_STYLES.glassCard}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">新訂單</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-green-600 font-chinese">+23% 較昨日</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={ADMIN_STYLES.glassCard}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">今日銷售</p>
                <p className="text-3xl font-bold text-gray-900">28,400</p>
                <p className="text-sm text-green-600 font-chinese">+15% 較昨日</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className={ADMIN_STYLES.glassCard}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">待處理訂單</p>
                <p className="text-3xl font-bold text-gray-900">17</p>
                <p className="text-sm text-orange-600 font-chinese">需要關注</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <ClockIcon className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className={ADMIN_STYLES.glassCard}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-chinese">庫存警告</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <p className="text-sm text-red-600 font-chinese">需要補貨</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ClipboardDocumentListIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

  <div className="grid grid-cols-3 gap-8">
        {/* 最近訂單 */}
  <div className="dashboard-section col-span-2">
          <div className={ADMIN_STYLES.glassCard}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-chinese">最近訂單</h3>
              <button className="text-[#cc824d] hover:text-[#b8753f] transition-colors font-chinese">
                查看全部
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#cc824d] rounded-full flex items-center justify-center">
                      <ShoppingBagIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 font-chinese">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.date}  {order.items} 件商品</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.amount.toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 熱銷商品 */}
        <div className="dashboard-section">
          <div className={ADMIN_STYLES.glassCard}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-chinese">熱銷商品</h3>
              <button className="text-[#cc824d] hover:text-[#b8753f] transition-colors font-chinese">
                查看全部
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#cc824d] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 font-chinese truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} 件已售出</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      {Math.floor(Math.random() * 20) + 5}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 系統警告 */}
      <div className="dashboard-section mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">系統通知</h2>
        <div className="space-y-4">
          {dashboardData.alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
              <p className="font-chinese">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 使用 HOC 為 Overview 頁面添加子導航 - 已移至頂部統一管理
export default AdminOverview;
