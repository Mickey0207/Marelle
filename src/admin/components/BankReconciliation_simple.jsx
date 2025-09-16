import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  CalculatorIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  MinusIcon,
  ChevronRightIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import accountingDataManager from '../data/accountingDataManager';

const BankReconciliation = () => {
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState('');
  const [reconciliationData, setReconciliationData] = useState(null);

  useEffect(() => {
    loadReconciliations();
  }, []);

  const loadReconciliations = async () => {
    setLoading(true);
    try {
      const data = accountingDataManager.getBankReconciliations();
      setReconciliations(data);
      
      if (data.length > 0) {
        setSelectedBank(data[0].bankAccount);
        setReconciliationData(data[0]);
      }
    } catch (error) {
      console.error('載入銀行對帳失敗:', error);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { color: 'bg-green-100 text-green-800', text: '已完成' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: '進行中' },
      'review': { color: 'bg-blue-100 text-blue-800', text: '待審核' },
    };

    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fdf8f2]">
        <div className="text-center">
          <CalculatorIcon className="h-12 w-12 animate-pulse text-[#cc824d] mx-auto mb-4" />
          <p className="text-gray-600">載入銀行對帳資料中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">銀行對帳</h1>
          <p className="text-gray-600">進行銀行帳戶餘額對帳與調節</p>
        </div>

        {/* 銀行選擇器 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  選擇銀行帳戶
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                >
                  <option value="">請選擇銀行帳戶</option>
                  {reconciliations.map((rec) => (
                    <option key={rec.id} value={rec.bankAccount}>
                      {rec.bankAccount} - {rec.bankName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  對帳月份
                </label>
                <input
                  type="month"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  defaultValue="2024-09"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors">
                <PlusIcon className="h-4 w-4" />
                新增對帳
              </button>
            </div>
          </div>
        </div>

        {/* 對帳工作區 */}
        {reconciliationData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 帳面餘額 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                帳面餘額
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">期初餘額</span>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(reconciliationData.bookBalance?.opening || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">本期收入</span>
                  <span className="font-semibold text-green-600">
                    + {formatCurrency(reconciliationData.bookBalance?.income || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">本期支出</span>
                  <span className="font-semibold text-red-600">
                    - {formatCurrency(reconciliationData.bookBalance?.expense || 0)}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-800">帳面期末餘額</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(reconciliationData.bookBalance?.closing || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* 銀行餘額 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BuildingLibraryIcon className="h-5 w-5 mr-2 text-[#cc824d]" />
                銀行餘額
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">銀行對帳單餘額</span>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(reconciliationData.bankBalance?.statement || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">在途存款</span>
                  <span className="font-semibold text-green-600">
                    + {formatCurrency(reconciliationData.bankBalance?.depositsInTransit || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">未兌現支票</span>
                  <span className="font-semibold text-red-600">
                    - {formatCurrency(reconciliationData.bankBalance?.outstandingChecks || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">銀行手續費</span>
                  <span className="font-semibold text-red-600">
                    - {formatCurrency(reconciliationData.bankBalance?.bankCharges || 0)}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-800">調整後銀行餘額</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(reconciliationData.bankBalance?.adjusted || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 對帳結果 */}
        {reconciliationData && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">對帳結果</h3>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex items-center">
                {reconciliationData.reconciled ? (
                  <>
                    <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="font-semibold text-green-700">對帳成功</p>
                      <p className="text-sm text-gray-600">帳面餘額與銀行餘額一致</p>
                    </div>
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mr-3" />
                    <div>
                      <p className="font-semibold text-red-700">對帳差異</p>
                      <p className="text-sm text-gray-600">
                        差額: {formatCurrency(Math.abs((reconciliationData.bookBalance?.closing || 0) - (reconciliationData.bankBalance?.adjusted || 0)))}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  匯出報告
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircleIcon className="h-4 w-4" />
                  完成對帳
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 對帳歷史 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">對帳歷史</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    對帳月份
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    銀行帳戶
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    帳面餘額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    銀行餘額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    差異
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reconciliations.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rec.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rec.bankAccount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(rec.bookBalance?.closing || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(rec.bankBalance?.adjusted || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(Math.abs((rec.bookBalance?.closing || 0) - (rec.bankBalance?.adjusted || 0)))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(rec.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="查看詳情">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="下載報告">
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 空狀態 */}
        {reconciliations.length === 0 && (
          <div className="text-center py-12">
            <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">尚無銀行對帳記錄</h3>
            <p className="text-gray-500 mb-4">開始進行您的第一次銀行對帳</p>
            <button className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors">
              <PlusIcon className="h-4 w-4 mr-2" />
              新增對帳
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankReconciliation;