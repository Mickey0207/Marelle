import { useEffect } from 'react';
import { gsap } from 'gsap';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartPieIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "../../../lib/ui/adminStyles";
import { DashboardStatsSection, STATS_CATEGORIES } from "../../components/dashboard/DashboardStatsSection";

const FinanceReports = () => {
  useEffect(() => {
    gsap.fromTo(
      '.finance-section',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const financialSummary = [
    { title: '總收入', amount: 760000, change: '+12.5%', positive: true, isPercentage: false, period: '本月' },
    { title: '總支出', amount: 395800, change: '+8.2%', positive: false, isPercentage: false, period: '本月' },
    { title: '淨利潤', amount: 364200, change: '+18.3%', positive: true, isPercentage: false, period: '本月' },
    { title: '毛利率', amount: 47.9, change: '+2.1%', positive: true, isPercentage: true, period: '本月' }
  ];

  const recentTransactions = [
    { date: '2024-01-15', type: '銷售收入', description: '線上商店銷售', amount: 125600, positive: true },
    { date: '2024-01-14', type: '商品採購', description: '供應商付款', amount: 65400, positive: false },
    { date: '2024-01-14', type: '營運費用', description: '辦公室租金', amount: 12000, positive: false },
    { date: '2024-01-13', type: '銷售收入', description: '批發訂單', amount: 45600, positive: true }
  ];

  const profitLossData = [
    { category: '商品銷售', amount: 678900, percentage: 89.2 },
    { category: '服務收入', amount: 45600, percentage: 6.0 },
    { category: '其他收入', amount: 36500, percentage: 4.8 }
  ];

  const expenseData = [
    { category: '商品成本', amount: 245600, percentage: 62.1 },
    { category: '營運費用', amount: 89400, percentage: 22.6 },
    { category: '行銷費用', amount: 35200, percentage: 8.9 },
    { category: '管理費用', amount: 25800, percentage: 6.4 }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="finance-section mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">財務報表</h1>
        <p className="text-gray-600 mt-2">
          收支分析、利潤統計及財務健康度監控
        </p>
      </div>

      {/* 財務統計 */}
      <div className="finance-section">
        <DashboardStatsSection 
          categories={[STATS_CATEGORIES.FINANCIAL]}
          defaultExpandedCategories={[STATS_CATEGORIES.FINANCIAL]}
          showRefreshButton={true}
          className="mb-8"
        />
      </div>

      {/* 財務概覽 */}
      <div className="finance-section mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">財務概覽</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialSummary.map((item, index) => (
            <div key={index} className={ADMIN_STYLES.glassCard}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-chinese">{item.title}</h3>
                <div className={`flex items-center ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {item.positive ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{item.change}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-[#cc824d]">
                  {item.isPercentage ? `${item.amount}%` : `${item.amount.toLocaleString()}`}
                </div>
                <div className="text-sm text-gray-500">{item.period}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 收入結構 */}
        <div className="finance-section">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">收入結構分析</h2>
          <div className={ADMIN_STYLES.glassCard}>
            <div className="space-y-4">
              {profitLossData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 font-chinese">{item.category}</span>
                    <span className="font-semibold">{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#cc824d] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 支出結構 */}
        <div className="finance-section">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">支出結構分析</h2>
          <div className={ADMIN_STYLES.glassCard}>
            <div className="space-y-4">
              {expenseData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 font-chinese">{item.category}</span>
                    <span className="font-semibold">{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 最近交易記錄 */}
      <div className="finance-section mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">最近交易記錄</h2>
        <div className={ADMIN_STYLES.glassCard}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 font-chinese">日期</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 font-chinese">類型</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 font-chinese">描述</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 font-chinese">金額</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {transaction.date}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.positive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-chinese">{transaction.description}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      transaction.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.positive ? '+' : '-'}{transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 快速報表 */}
      <div className="finance-section mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">快速報表</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: DocumentTextIcon, label: '損益表', color: 'bg-blue-500' },
            { icon: ChartPieIcon, label: '資產負債表', color: 'bg-green-500' },
            { icon: BanknotesIcon, label: '現金流量', color: 'bg-purple-500' },
            { icon: CreditCardIcon, label: '應收帳款', color: 'bg-orange-500' }
          ].map((item, index) => (
            <button 
              key={index}
              className={`${ADMIN_STYLES.glassCard} group hover:shadow-lg transition-all duration-300 cursor-pointer text-left`}
            >
              <div className="flex items-center space-x-3">
                <div className={`${item.color} p-2 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900 font-chinese group-hover:text-[#cc824d] transition-colors">
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceReports;
