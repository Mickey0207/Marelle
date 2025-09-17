import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import accountingDataManager, { EntryStatus, EntrySourceType } from '../data/accountingDataManager';
import StandardTable from '../../components/StandardTable';

const JournalEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const entriesData = accountingDataManager.getAllJournalEntries();
      setEntries(entriesData);
    } catch (error) {
      console.error('載入會計分錄失敗:', error);
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
      [EntryStatus.DRAFT]: { color: 'bg-gray-100 text-gray-800', text: '草稿' },
      [EntryStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', text: '待審' },
      [EntryStatus.APPROVED]: { color: 'bg-green-100 text-green-800', text: '已審核' },
      [EntryStatus.REJECTED]: { color: 'bg-red-100 text-red-800', text: '已拒絕' },
      [EntryStatus.POSTED]: { color: 'bg-blue-100 text-blue-800', text: '已過帳' },
    };

    const config = statusConfig[status] || statusConfig[EntryStatus.DRAFT];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // 定義表格列配置
  const columns = [
    {
      key: 'entryNumber',
      label: '分錄編號',
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: 'date',
      label: '日期',
      sortable: true,
      render: (value) => <span className="text-gray-500">{new Date(value).toLocaleDateString('zh-TW')}</span>
    },
    {
      key: 'description',
      label: '描述',
      sortable: true,
      render: (value) => (
        <div className="max-w-xs truncate text-gray-900">{value}</div>
      )
    },
    {
      key: 'totalAmount',
      label: '金額',
      sortable: true,
      render: (value) => <span className="text-gray-900">{formatCurrency(value)}</span>
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (value, entry) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900" title="查看詳情">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="text-green-600 hover:text-green-900" title="編輯">
            <PencilIcon className="h-4 w-4" />
          </button>
          <button className="text-red-600 hover:text-red-900" title="刪除">
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
          <p className="text-gray-600">載入會計分錄中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">會計分錄管理</h1>
          <p className="text-gray-600">管理和審核所有會計分錄</p>
        </div>

        {/* 操作工具列 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors">
                <PlusIcon className="h-4 w-4" />
                新增分錄
              </button>
            </div>
          </div>
        </div>

        {/* 分錄列表 */}
        <StandardTable
          data={entries}
          columns={columns}
          title="會計分錄清單"
          emptyMessage="尚無會計分錄"
          exportFileName="會計分錄清單"
        />
    </div>
  );
};

export default JournalEntries;