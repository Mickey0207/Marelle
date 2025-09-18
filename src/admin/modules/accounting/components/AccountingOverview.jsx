import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  BanknotesIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const AccountingOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 模擬數據
  const mockDashboardData = {
    totalAssets: 5800000,
    totalLiabilities: 2100000,
    totalEquity: 3700000,
    netIncome: 450000,
    totalRevenue: 2800000,
    totalExpenses: 2350000,
    grossProfit: 980000,
    recentEntries: [
      { id: 1, date: '2024-01-15', description: '銷售收入', amount: 150000, status: 'posted' },
      { id: 2, date: '2024-01-14', description: '辦公用品採購', amount: -5000, status: 'posted' },
      { id: 3, date: '2024-01-13', description: '租金費用', amount: -25000, status: 'pending' },
      { id: 4, date: '2024-01-12', description: '廣告費用', amount: -8000, status: 'draft' }
    ]
  };

  useEffect(() => {
    // 模擬API調用
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDashboardData(mockDashboardData);
      } catch (error) {
        console.error('載入會計概覽失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!loading) {
      // 動畫效果
      gsap.fromTo(
        '.dashboard-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      posted: { color: 'bg-green-100 text-green-800', text: '已過帳' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '待審核' },
      draft: { color: 'bg-gray-100 text-gray-800', text: '草稿' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d] mx-auto mb-4"></div>
              <span className="text-gray-600">載入會計概覽中..</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">會計管理概覽</h1>
          <p className="text-gray-600">財務狀況一覽及關鍵指標</p>
        </div>

        {/* 財務指標卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 總資產 */}
          <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BanknotesIcon className="h-8 w-8 text-blue-600" />
              </div>
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">總資產</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(dashboardData.totalAssets)}</p>
              <p className="text-sm text-green-600 mt-1">+5.2% 較上月</p>
            </div>
          </div>

          {/* 淨收入 */}
          <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
              </div>
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">淨收入</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(dashboardData.netIncome)}</p>
              <p className="text-sm text-green-600 mt-1">+12.8% 較上月</p>
            </div>
          </div>

          {/* 總收入 */}
          <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">總收入</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(dashboardData.totalRevenue)}</p>
              <p className="text-sm text-green-600 mt-1">+8.4% 較上月</p>
            </div>
          </div>

          {/* 總支出 */}
          <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ArrowTrendingDownIcon className="h-8 w-8 text-orange-600" />
              </div>
              <ArrowTrendingDownIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">總支出</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(dashboardData.totalExpenses)}</p>
              <p className="text-sm text-orange-600 mt-1">需要監控</p>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">新增分錄</h3>
                <p className="text-sm text-gray-600">記錄新的會計交易</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">銀行對帳</h3>
                <p className="text-sm text-gray-600">核對銀行帳戶餘額</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">財務報表</h3>
                <p className="text-sm text-gray-600">生成財務分析報告</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingOverview;
