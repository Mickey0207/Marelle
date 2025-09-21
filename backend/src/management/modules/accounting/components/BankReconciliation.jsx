import React, { useState, useEffect } from 'react';
import { 
  BanknotesIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const BankReconciliation = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [reconciliationDate, setReconciliationDate] = useState('');
  const [statementEndingBalance, setStatementEndingBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [reconciliationStatus, setReconciliationStatus] = useState('pending');

  // 模擬銀行帳戶數據
  const mockBankAccounts = [
    {
      id: 'acc-001',
      name: '中國信託主要帳戶',
      accountNumber: '****-****-1234',
      balance: 2580000,
      currency: 'TWD'
    },
    {
      id: 'acc-002', 
      name: '台灣銀行外幣帳戶',
      accountNumber: '****-****-5678',
      balance: 156000,
      currency: 'USD'
    }
  ];

  // 模擬待對帳交易
  const mockTransactions = [
    {
      id: 'txn-001',
      date: '2024-01-15',
      description: '客戶付款 - 訂單 #ORD-2024-001',
      amount: 125000,
      type: 'credit',
      status: 'pending',
      reference: 'PAY-001'
    },
    {
      id: 'txn-002',
      date: '2024-01-16', 
      description: '供應商付款 - 採購訂單 #PO-2024-001',
      amount: -85000,
      type: 'debit',
      status: 'pending',
      reference: 'PAY-002'
    },
    {
      id: 'txn-003',
      date: '2024-01-17',
      description: '銀行手續費',
      amount: -150,
      type: 'debit', 
      status: 'completed',
      reference: 'FEE-001'
    }
  ];

  useEffect(() => {
    setBankAccounts(mockBankAccounts);
    setTransactions(mockTransactions);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { color: 'bg-green-100 text-green-800', text: '已完成' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: '待處理' },
      'review': { color: 'bg-blue-100 text-blue-800', text: '待審核' },
    };

    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const calculateBookBalance = () => {
    const account = bankAccounts.find(acc => acc.id === selectedAccount);
    if (!account) return 0;
    
    const pendingTransactions = transactions.filter(txn => txn.status === 'pending');
    const pendingAmount = pendingTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    
    return account.balance + pendingAmount;
  };

  const calculateDifference = () => {
    const bookBalance = calculateBookBalance();
    const statementBalance = parseFloat(statementEndingBalance) || 0;
    return statementBalance - bookBalance;
  };

  const handleReconcile = () => {
    if (!selectedAccount) {
      alert('請選擇銀行帳戶');
      return;
    }
    
    if (!reconciliationDate) {
      alert('請選擇對帳日期');
      return;
    }
    
    if (!statementEndingBalance) {
      alert('請輸入銀行對帳單結餘');
      return;
    }

    setLoading(true);
    
    // 模擬對帳處理
    setTimeout(() => {
      const difference = calculateDifference();
      if (Math.abs(difference) < 0.01) {
        setReconciliationStatus('completed');
        alert('對帳成功！帳目平衡。');
      } else {
        setReconciliationStatus('review');
        alert(`對帳完成，但存在差異：${difference.toFixed(2)} 元，需要審核。`);
      }
      setLoading(false);
    }, 2000);
  };

  const handleTransactionToggle = (transactionId) => {
    setTransactions(prev => 
      prev.map(txn => 
        txn.id === transactionId 
          ? { ...txn, status: txn.status === 'pending' ? 'completed' : 'pending' }
          : txn
      )
    );
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">銀行對帳</h1>
          <p className="text-gray-600">進行銀行帳戶對帳，確保帳目準確性</p>
        </div>

        {/* 對帳表單 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">開始新的對帳</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                選擇銀行帳戶
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="">請選擇銀行帳戶</option>
                {bankAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.accountNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                對帳日期
              </label>
              <input
                type="date"
                value={reconciliationDate}
                onChange={(e) => setReconciliationDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                銀行對帳單結餘
              </label>
              <input
                type="number"
                value={statementEndingBalance}
                onChange={(e) => setStatementEndingBalance(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleReconcile}
              disabled={loading || !selectedAccount || !reconciliationDate || !statementEndingBalance}
              className="px-6 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b8743d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>處理中...</span>
                </>
              ) : (
                <>
                  <DocumentCheckIcon className="w-4 h-4" />
                  <span>開始對帳</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 對帳摘要 */}
        {selectedAccount && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <div className="flex items-center space-x-3">
                <BanknotesIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">銀行餘額</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${(parseFloat(statementEndingBalance) || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <div className="flex items-center space-x-3">
                <DocumentCheckIcon className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">帳面餘額</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${calculateBookBalance().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">差異金額</p>
                  <p className={`text-2xl font-bold ${
                    Math.abs(calculateDifference()) < 0.01 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${calculateDifference().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 對帳狀態 */}
        {reconciliationStatus !== 'pending' && (
          <div className={`p-4 rounded-lg mb-8 ${
            reconciliationStatus === 'completed' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center space-x-3">
              {reconciliationStatus === 'completed' ? (
                <DocumentCheckIcon className="w-6 h-6 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
              )}
              <div>
                <h3 className={`font-medium ${
                  reconciliationStatus === 'completed' ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {reconciliationStatus === 'completed' ? '對帳完成' : '需要審核'}
                </h3>
                <p className={`text-sm ${
                  reconciliationStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {reconciliationStatus === 'completed' 
                    ? '銀行餘額與帳面餘額一致，對帳成功。'
                    : '發現差異，請檢查未處理的交易或聯繫會計部門。'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 調整後銀行餘額 */}
        {selectedAccount && (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">調整後銀行餘額</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-bold text-gray-800">調整後銀行餘額</span>
                <span className="text-xl font-bold text-blue-600">
                  ${calculateBookBalance().toLocaleString()}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>銀行對帳單餘額：</span>
                  <span>${(parseFloat(statementEndingBalance) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>減：未提示存款</span>
                  <span>$0</span>
                </div>
                <div className="flex justify-between">
                  <span>加：未兌現支票</span>
                  <span>$0</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>調整後銀行餘額：</span>
                  <span>${calculateBookBalance().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 未對帳交易 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">未對帳交易</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜尋交易..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FunnelIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      描述
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      參考號碼
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      金額
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
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleTransactionToggle(transaction.id)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            transaction.status === 'pending'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {transaction.status === 'pending' ? '標記為已核對' : '標記為未核對'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <DocumentCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">尚無銀行對帳記錄</h3>
              <p className="text-gray-500 mb-4">請先進行第一次銀行對帳</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankReconciliation;
