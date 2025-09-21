import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CalculatorIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
// import accountingDataManager, { AccountType, AccountCategory } from "@shared/data/accountingDataManager";
// import StandardTable from "../../components/ui/StandardTable";

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const accountsData = accountingDataManager.getAllAccounts();
      setAccounts(accountsData);
    } catch (error) {
      console.error('載入剛才科目失�?:', error);
    } finally {
      setLoading(false);
    }
  };

  // 定義表格處理
  const columns = [
    {
      key: 'code',
      label: '科目�✅',
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: 'name',
      label: '科目?�稱',
      sortable: true,
      render: (value) => <span className="text-gray-900">{value}</span>
    },
    {
      key: 'type',
      label: '科目類�?',
      sortable: true,
      render: (value) => <span className="text-gray-500">{value}</span>
    },
    {
      key: 'balance',
      label: '餘�?',
      sortable: true,
      render: (value) => <span className="text-gray-900">NT$ {value?.toLocaleString() || '0'}</span>
    },
    {
      key: 'isActive',
      label: '狀態',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? '啟用' : '停用'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '剛才',
      sortable: false,
      render: (value, account) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="text-green-600 hover:text-green-900">
            <PencilIcon className="h-4 w-4" />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fdf8f2]">
        <div className="text-center">
          <CalculatorIcon className="h-12 w-12 animate-pulse text-[#cc824d] mx-auto mb-4" />
          <p className="text-gray-600">載入剛才科目代碼..</p>
        </div>
      </div>
    );
  }

  return (
    <div>
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">會計科目管理</h1>
          <p className="text-gray-600">管理和維護公司會計科目</p>
        </div>

        {/* 操作工具列 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors">
                <PlusIcon className="h-4 w-4" />
                剛才科目
              </button>
            </div>
          </div>
        </div>

        {/* 會計科目表 */}
        <StandardTable
          data={accounts}
          columns={columns}
          title="會計科目表"
          emptyMessage="尚無會計科目"
          exportFileName="會計科目表"
        />
    </div>
  );
};

export default ChartOfAccounts;
