import React, { useMemo, useState } from 'react';
import StandardTable from '../../components/ui/StandardTable';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';
import { FunnelIcon, EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

// 簡易模擬：統一表單審批入口
// 未來可由不同模組提交表單到此處，由管理員審核
const mockForms = [
  {
    id: 'REQ-2025-0001',
    type: '採購申請',
    module: '採購管理',
    applicant: '王小明',
    submittedAt: '2025-09-26 14:10',
    status: '待審',
    priority: '高',
  },
  {
    id: 'REQ-2025-0002',
    type: '退款申請',
    module: '訂單管理',
    applicant: '林依婷',
    submittedAt: '2025-09-26 15:42',
    status: '待審',
    priority: '中',
  },
  {
    id: 'REQ-2025-0003',
    type: '調價申請',
    module: '商品管理',
    applicant: '張育誠',
    submittedAt: '2025-09-27 09:05',
    status: '退回',
    priority: '低',
  },
];

const FormApprovals = () => {
  const [statusFilter, setStatusFilter] = useState('全部');
  const [keyword, setKeyword] = useState('');

  const rows = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return mockForms.filter(f => {
      const byStatus = statusFilter === '全部' || f.status === statusFilter;
      const byKW = kw ? JSON.stringify(f).toLowerCase().includes(kw) : true;
      return byStatus && byKW;
    });
  }, [statusFilter, keyword]);

  const getStatusBadge = (s) => {
    const map = {
      '待審': 'bg-yellow-100 text-yellow-800',
      '通過': 'bg-green-100 text-green-800',
      '退回': 'bg-red-100 text-red-800',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[s] || 'bg-gray-100 text-gray-700'}`}>{s}</span>;
  };

  const columns = [
    { key: 'id', label: '單號', sortable: true },
    { key: 'type', label: '表單類型', sortable: true },
    { key: 'module', label: '來源模組', sortable: true },
    { key: 'applicant', label: '申請人', sortable: true },
    { key: 'submittedAt', label: '送出時間', sortable: true },
    { key: 'status', label: '狀態', sortable: true, render: (v) => getStatusBadge(v) },
    { key: 'priority', label: '優先級', sortable: true },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-blue-600" title="檢視"><EyeIcon className="w-4 h-4"/></button>
          <button className="p-2 text-gray-400 hover:text-green-600" title="通過"><CheckIcon className="w-4 h-4"/></button>
          <button className="p-2 text-gray-400 hover:text-red-600" title="退回"><XMarkIcon className="w-4 h-4"/></button>
        </div>
      )
    },
  ];

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className={ADMIN_STYLES.pageTitle}>表單審批</h1>
            <p className={ADMIN_STYLES.pageSubtitle}>所有模組提交的表單在此統一審核與處理</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <FunnelIcon className="w-5 h-5 text-gray-400 mr-2" />
              <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {['全部','待審','通過','退回'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <input
              value={keyword}
              onChange={(e)=> setKeyword(e.target.value)}
              placeholder="搜尋單號/類型/申請人..."
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <StandardTable
          data={rows}
          columns={columns}
          title="待辦表單"
          emptyMessage="目前沒有需要審核的表單"
          exportFileName="form-approvals"
        />
      </div>
    </div>
  );
};

export default FormApprovals;
