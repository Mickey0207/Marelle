import { useEffect } from 'react';
import { gsap } from 'gsap';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartPieIcon,
  BanknotesIcon,
  C        {/* ?臬蝯? */}
        <div className="finance-section">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">?臬蝯???</h2>itCardIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from "@shared/adminStyles";
import DashboardStatsSection from '../components/DashboardStatsSection';
import { STATS_CATEGORIES } from '../utils/dashboardStatsManager';

const FinanceReports = () => {
  useEffect(() => {
    // Animate page elements on load
    gsap.fromTo(
      '.finance-section',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );
  }, []);

  const financialSummary = [
    { 
      title: '蝮賣??, 
      amount: 678900, 
      change: '+12.5%', 
      positive: true,
      period: '?祆?'
    },
    { 
      title: '蝮賣??, 
      amount: 245600, 
      change: '+8.2%', 
      positive: false,
      period: '?祆?'
    },
    { 
      title: '瘛典瞏?, 
      amount: 433300, 
      change: '+15.8%', 
      positive: true,
      period: '?祆?'
    },
    { 
      title: '瘥??, 
      amount: 63.8, 
      change: '+2.1%', 
      positive: true,
      period: '?祆?',
      isPercentage: true
    }
  ];

  const recentTransactions = [
    { date: '2024-01-15', type: '?瑕?嗅', description: '蝺????瑕', amount: 15600, positive: true },
    { date: '2024-01-15', type: '???∟頃', description: '????∟頃', amount: -8900, positive: false },
    { date: '2024-01-14', type: '?瑕?嗅', description: '撖阡?摨?瑕', amount: 12300, positive: true },
    { date: '2024-01-14', type: '??鞎餌', description: '摨蝘?', amount: -25000, positive: false },
    { date: '2024-01-13', type: '?瑕?嗅', description: '?寧閮', amount: 45600, positive: true }
  ];

  const profitLossData = [
    { category: '???瑕', amount: 678900, percentage: 89.2 },
    { category: '???嗅', amount: 45600, percentage: 6.0 },
    { category: '?嗡??嗅', amount: 36500, percentage: 4.8 }
  ];

  const expenseData = [
    { category: '???', amount: 245600, percentage: 62.1 },
    { category: '??鞎餌', amount: 89400, percentage: 22.6 },
    { category: '銵鞎餌', amount: 35200, percentage: 8.9 },
    { category: '蝞∠?鞎餌', amount: 25800, percentage: 6.4 }
  ];

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* ?璅? */}
      <div className="finance-section mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-chinese">鞎∪??梯”</h1>
        <p className="text-gray-600 mt-2">
          ?嗆???瞏斤絞閮?鞎∪??亙熒摨衣??
        </p>
      </div>

      {/* 鞎∪?蝯梯? */}
      <div className="finance-section">
        <DashboardStatsSection 
          categories={[STATS_CATEGORIES.FINANCIAL]}
          defaultExpandedCategories={[STATS_CATEGORIES.FINANCIAL]}
          showRefreshButton={true}
          className="mb-8"
        />
      </div>

      {/* 鞎∪?璁汗 */}
      <div className="finance-section mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">鞎∪?璁汗</h2>
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
                  {item.isPercentage ? `${item.amount}%` : `瞼${item.amount.toLocaleString()}`}
                </div>
                <div className="text-sm text-gray-500">{item.period}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ?嗅蝯? */}
        <div className="finance-section">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">?嗅蝯???</h2>
          <div className={ADMIN_STYLES.glassCard}>
            <div className="space-y-4">
              {profitLossData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 font-chinese">{item.category}</span>
                    <span className="font-semibold">瞼{item.amount.toLocaleString()}</span>
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

        {/* ?嚙賢蝯蕭? */}
        <div className="finance-section">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">?嚙賢蝯蕭??嚙踝蕭?</h2>
          <div className={ADMIN_STYLES.glassCard}>
            <div className="space-y-4">
              {expenseData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 font-chinese">{item.category}</span>
                    <span className="font-semibold">瞼{item.amount.toLocaleString()}</span>
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

      {/* 餈蕭?鈭歹蕭?閮蕭? */}
      <div className="finance-section mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">餈蕭?鈭歹蕭?閮蕭?</h2>
        <div className={ADMIN_STYLES.glassCard}>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${transaction.positive ? 'bg-green-100' : 'bg-red-100'}`}>
                    {transaction.positive ? (
                      <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 font-chinese">{transaction.type}</h3>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                    <p className="text-xs text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.positive ? '+' : ''}瞼{Math.abs(transaction.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 敹恍嚙?*/}
      <div className="finance-section mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">敹恍嚙?/h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: DocumentTextIcon, label: '?嚙踝蕭?嚙?, color: 'bg-blue-500' },
            { icon: ChartPieIcon, label: '鞈鞎嚙?, color: 'bg-green-500' },
            { icon: BanknotesIcon, label: '?嚙踝蕭?瘚蕭?', color: 'bg-purple-500' },
            { icon: CreditCardIcon, label: '?嚙賣撣單狡', color: 'bg-orange-500' }
          ].map((report, index) => (
            <button 
              key={index}
              className={`${ADMIN_STYLES.glassCard} group hover:scale-105 transition-all duration-200 cursor-pointer`}
            >
              <div className="flex flex-col items-center space-y-3 p-4">
                <div className={`p-3 rounded-full ${report.color} group-hover:scale-110 transition-transform`}>
                  <report.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 font-chinese">{report.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceReports;

