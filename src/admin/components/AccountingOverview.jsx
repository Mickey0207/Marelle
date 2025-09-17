import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  CurrencyDollarIcon, 
  CalculatorIcon,
  ChartPieIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  Cog6ToothIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import accountingDataManager from '../data/accountingDataManager';

const AccountingOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = accountingDataManager.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('載入會計概況失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div>
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <ArrowPathIcon className="h-6 w-6 animate-spin text-[#cc824d]" />
              <span className="text-gray-600">載入會計概況中...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div>
      <div>
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">會計管理概況</h1>
            <p className="text-gray-600">財務數據一覽與關鍵指標分析</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc824d]"
            >
              <option value="current">本月</option>
              <option value="quarter">本季</option>
              <option value="year">本年</option>
            </select>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors flex items-center space-x-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>重新整理</span>
            </button>
          </div>
        </div>

        {/* 核心財務指標卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 總資產 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
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
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
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
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">總收入</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(dashboardData.totalRevenue)}</p>
              <p className="text-sm text-green-600 mt-1">+8.4% 較上月</p>
            </div>
          </div>

          {/* 待審分錄 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                {dashboardData.pendingEntries}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">待審分錄</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.pendingEntries}</p>
              <p className="text-sm text-orange-600 mt-1">需要處理</p>
            </div>
          </div>
        </div>

        {/* 財務比率與趨勢 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 財務比率 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CalculatorIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
              財務比率分析
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">流動比率</span>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {dashboardData.currentRatio.toFixed(2)}
                  </span>
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 ml-2" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">負債權益比</span>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {dashboardData.debtToEquity.toFixed(2)}
                  </span>
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 ml-2" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">淨利率</span>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {formatPercentage(dashboardData.profitMargin)}
                  </span>
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 ml-2" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">毛利率</span>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {formatPercentage(dashboardData.grossProfit / dashboardData.totalRevenue)}
                  </span>
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 ml-2" />
                </div>
              </div>
            </div>
          </div>

          {/* 月度趨勢圖 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ChartPieIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
              月度財務趨勢
            </h3>
            <div className="space-y-4">
              {dashboardData.monthlyTrends.map((trend, index) => (
                <div key={trend.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">2024-{trend.month}</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(trend.profit)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#cc824d] h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(trend.profit / Math.max(...dashboardData.monthlyTrends.map(t => t.profit))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 最近分錄與快速操作 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 最近分錄 */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                最近會計分錄
              </h3>
              <button className="text-[#cc824d] hover:text-[#b3723f] transition-colors">
                查看全部
              </button>
            </div>
            <div className="space-y-3">
              {dashboardData.recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800">{entry.entryNumber}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entry.status === 'posted' ? 'bg-green-100 text-green-600' :
                        entry.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {entry.status === 'posted' ? '已過帳' : 
                         entry.status === 'pending' ? '待審核' : '草稿'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {new Date(entry.entryDate).toLocaleDateString('zh-TW')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      {formatCurrency(entry.totalDebit)}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <button className="p-1 text-gray-400 hover:text-[#cc824d] transition-colors">
                        <EyeIcon className="h-3 w-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-[#cc824d] transition-colors">
                        <PencilIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 快速操作 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Cog6ToothIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
              快速操作
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors">
                <PencilIcon className="h-4 w-4" />
                <span>新增分錄</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <DocumentTextIcon className="h-4 w-4" />
                <span>產生報表</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <CalculatorIcon className="h-4 w-4" />
                <span>會計科目</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <ChartBarIcon className="h-4 w-4" />
                <span>財務分析</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>匯出資料</span>
              </button>
            </div>

            {/* 統計摘要 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">本月統計</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">收入筆數</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">支出筆數</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">待審分錄</span>
                  <span className="font-semibold text-orange-600">{dashboardData.pendingEntries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">科目數量</span>
                  <span className="font-semibold">14</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingOverview;