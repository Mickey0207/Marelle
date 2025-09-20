import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  DocumentChartBarIcon,
  CalendarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const FinancialReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // 報表類型
  const reportTypes = [
    {
      id: 'trial-balance',
      name: '試算表',
      description: '驗證總帳帳簿平衡',
      icon: DocumentChartBarIcon,
      color: 'blue'
    },
    {
      id: 'income-statement',
      name: '損益表',
      description: '公司收支狀況',
      icon: ChartBarIcon,
      color: 'green'
    },
    {
      id: 'balance-sheet',
      name: '資產負債表',
      description: '財務狀況總覽',
      icon: BanknotesIcon,
      color: 'purple'
    },
    {
      id: 'cash-flow',
      name: '現金流量表',
      description: '現金流入流出分析',
      icon: CurrencyDollarIcon,
      color: 'orange'
    }
  ];

  // 模擬報表數據
  const mockReportData = {
    'trial-balance': {
      title: '試算表',
      period: '2024年1月1日 至 2024年1月31日',
      data: [
        { account: '現金', debit: 500000, credit: 0, balance: 500000 },
        { account: '應收帳款', debit: 800000, credit: 100000, balance: 700000 },
        { account: '存貨', debit: 1200000, credit: 0, balance: 1200000 },
        { account: '應付帳款', debit: 50000, credit: 400000, balance: -350000 },
        { account: '營業收入', debit: 0, credit: 2500000, balance: -2500000 },
        { account: '營業成本', debit: 1500000, credit: 0, balance: 1500000 }
      ],
      totals: { debit: 4050000, credit: 3000000 }
    },
    'income-statement': {
      title: '損益表',
      period: '2024年1月1日 至 2024年1月31日',
      data: {
        revenue: {
          name: '營業收入',
          items: [
            { name: '商品銷售收入', amount: 2200000 },
            { name: '服務收入', amount: 300000 }
          ],
          total: 2500000
        },
        cost: {
          name: '營業成本',
          items: [
            { name: '商品成本', amount: 1200000 },
            { name: '人工成本', amount: 300000 }
          ],
          total: 1500000
        },
        grossProfit: 1000000,
        expenses: {
          name: '營業費用',
          items: [
            { name: '薪資費用', amount: 400000 },
            { name: '租金費用', amount: 100000 },
            { name: '廣告費用', amount: 50000 }
          ],
          total: 550000
        },
        netIncome: 450000
      }
    }
  };

  useEffect(() => {
    // 動畫效果
    gsap.fromTo(
      '.report-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const generateReport = async () => {
    if (!selectedReport) {
      alert('請選擇報表類型');
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      alert('請選擇日期範圍');
      return;
    }

    setLoading(true);
    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = mockReportData[selectedReport];
      if (data) {
        setReportData({
          ...data,
          period: `${dateRange.startDate} 至 ${dateRange.endDate}`
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('生成報表失敗');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    if (!reportData) {
      alert('請先生成報表');
      return;
    }

    alert(`正在匯出${format.toUpperCase()}格式報表...`);
  };

  const printReport = () => {
    if (!reportData) {
      alert('請先生成報表');
      return;
    }

    window.print();
  };

  const getReportIcon = (reportType) => {
    const report = reportTypes.find(r => r.id === reportType);
    if (!report) return DocumentTextIcon;
    return report.icon;
  };

  const getReportColor = (reportType) => {
    const report = reportTypes.find(r => r.id === reportType);
    if (!report) return 'gray';
    return report.color;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-chinese">財務報表</h1>
          <p className="text-gray-600 mt-2">生成和查看各種財務報表</p>
        </div>

        {/* 報表類型選擇 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`report-card p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedReport === report.id
                  ? `border-${report.color}-500 bg-${report.color}-50`
                  : 'border-gray-200 bg-white/60 backdrop-blur-sm hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-${report.color}-100`}>
                  <report.icon className={`w-6 h-6 text-${report.color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-chinese">{report.name}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 報表參數設定 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 font-chinese">報表設定</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                報表類型
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="">請選擇報表類型</option>
                {reportTypes.map(report => (
                  <option key={report.id} value={report.id}>{report.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始日期
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                結束日期
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={generateReport}
              disabled={loading || !selectedReport || !dateRange.startDate || !dateRange.endDate}
              className="px-6 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <DocumentChartBarIcon className="w-4 h-4" />
                  <span>生成報表</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 報表結果 */}
        {reportData && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            {/* 報表標題 */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#cc824d] to-[#b8743d]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white font-chinese">{reportData.title}</h2>
                  <p className="text-white/80 mt-1">{reportData.period}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={printReport}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <PrinterIcon className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => exportReport('pdf')}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* 試算表 */}
              {selectedReport === 'trial-balance' && reportData.data && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">科目</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">借方</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">貸方</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">餘額</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-900">{item.account}</td>
                            <td className="py-3 px-4 text-right text-gray-900">
                              {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-900">
                              {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                            </td>
                            <td className={`py-3 px-4 text-right font-medium ${
                              item.balance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(Math.abs(item.balance))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-300 bg-gray-50">
                          <td className="py-3 px-4 font-bold text-gray-900">合計</td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">
                            {formatCurrency(reportData.totals.debit)}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">
                            {formatCurrency(reportData.totals.credit)}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">-</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* 損益表 */}
              {selectedReport === 'income-statement' && reportData.data && (
                <div className="space-y-6">
                  {/* 營業收入 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 font-chinese">
                      {reportData.data.revenue.name}
                    </h3>
                    <div className="space-y-2">
                      {reportData.data.revenue.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded font-semibold">
                        <span className="text-blue-900">營業收入總計</span>
                        <span className="text-blue-900">{formatCurrency(reportData.data.revenue.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 營業成本 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 font-chinese">
                      {reportData.data.cost.name}
                    </h3>
                    <div className="space-y-2">
                      {reportData.data.cost.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-3 px-4 bg-red-50 rounded font-semibold">
                        <span className="text-red-900">營業成本總計</span>
                        <span className="text-red-900">{formatCurrency(reportData.data.cost.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 毛利 */}
                  <div className="flex justify-between items-center py-4 px-6 bg-green-100 rounded-lg font-bold text-lg">
                    <span className="text-green-900">毛利</span>
                    <span className="text-green-900">{formatCurrency(reportData.data.grossProfit)}</span>
                  </div>

                  {/* 營業費用 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 font-chinese">
                      {reportData.data.expenses.name}
                    </h3>
                    <div className="space-y-2">
                      {reportData.data.expenses.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-3 px-4 bg-orange-50 rounded font-semibold">
                        <span className="text-orange-900">營業費用總計</span>
                        <span className="text-orange-900">{formatCurrency(reportData.data.expenses.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 淨利 */}
                  <div className="flex justify-between items-center py-4 px-6 bg-purple-100 rounded-lg font-bold text-xl">
                    <span className="text-purple-900">本期淨利</span>
                    <span className="text-purple-900">{formatCurrency(reportData.data.netIncome)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 快速報表模板 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 font-chinese">快速報表</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="report-card bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">本月損益</h3>
                  <p className="text-sm text-gray-600">當月收支狀況</p>
                </div>
              </div>
            </div>

            <div className="report-card bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">現金流量</h3>
                  <p className="text-sm text-gray-600">資金流動分析</p>
                </div>
              </div>
            </div>

            <div className="report-card bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BanknotesIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">資產負債</h3>
                  <p className="text-sm text-gray-600">財務狀況總覽</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
