import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  CalculatorIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import accountingDataManager, { ReportType } from '../data/accountingDataManager';

const FinancialReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(ReportType.TRIAL_BALANCE);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      // 載入可用報表
      const availableReports = [
        { type: ReportType.TRIAL_BALANCE, name: '試算表', description: '驗證會計帳簿平衡' },
        { type: ReportType.INCOME_STATEMENT, name: '損益表', description: '公司收支狀況' },
        { type: ReportType.BALANCE_SHEET, name: '資產負債表', description: '財務狀況概覽' },
        { type: ReportType.CASH_FLOW, name: '現金流量表', description: '現金收支分析' }
      ];
      setReports(availableReports);
      
      // 載入預設報表資料
      const data = accountingDataManager.generateFinancialReport(selectedReport);
      setReportData(data);
    } catch (error) {
      console.error('載入財務報表失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportType) => {
    setLoading(true);
    try {
      const data = accountingDataManager.generateFinancialReport(reportType);
      setReportData(data);
      setSelectedReport(reportType);
    } catch (error) {
      console.error('生成報表失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fdf8f2]">
        <div className="text-center">
          <CalculatorIcon className="h-12 w-12 animate-pulse text-[#cc824d] mx-auto mb-4" />
          <p className="text-gray-600">生成財務報表中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">財務報表</h1>
          <p className="text-gray-600">生成和查看各種財務報告</p>
        </div>

        {/* 報表選擇器 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {reports.map((report) => (
                <button
                  key={report.type}
                  onClick={() => generateReport(report.type)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedReport === report.type
                      ? 'bg-[#cc824d] text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {report.name}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                匯出PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <DocumentTextIcon className="h-4 w-4" />
                匯出Excel
              </button>
            </div>
          </div>
        </div>

        {/* 報表內容 */}
        {reportData && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-2 text-[#cc824d]" />
                {reports.find(r => r.type === selectedReport)?.name}
              </h2>
              <p className="text-gray-600">
                報表期間: {new Date().getFullYear()}年{new Date().getMonth() + 1}月
              </p>
            </div>

            {/* 試算表 */}
            {selectedReport === ReportType.TRIAL_BALANCE && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        科目代碼
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        科目名稱
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        借方餘額
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        貸方餘額
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.accounts?.map((account) => (
                      <tr key={account.code}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {account.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {account.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {account.debitBalance ? formatCurrency(account.debitBalance) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {account.creditBalance ? formatCurrency(account.creditBalance) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-sm font-bold text-gray-900">
                        合計
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                        {formatCurrency(reportData.totalDebit || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                        {formatCurrency(reportData.totalCredit || 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* 其他報表類型的佔位符 */}
            {selectedReport !== ReportType.TRIAL_BALANCE && (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">報表正在開發中</h3>
                <p className="text-gray-500">此報表功能即將推出</p>
              </div>
            )}

            {/* 平衡檢查 */}
            {selectedReport === ReportType.TRIAL_BALANCE && reportData && (
              <div className="mt-6 p-4 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  {reportData.totalDebit === reportData.totalCredit ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-700 font-medium">
                        試算表平衡 - 借貸相等
                      </span>
                    </>
                  ) : (
                    <>
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-red-700 font-medium">
                        試算表不平衡 - 差額: {formatCurrency(Math.abs(reportData.totalDebit - reportData.totalCredit))}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReports;