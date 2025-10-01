import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import inboxDataManager from '../../../../external_mock/notification-center/inboxDataManager';
import StandardTable from '../../components/ui/StandardTable';
import SearchableSelect from '../../components/ui/SearchableSelect';
import { BellIcon, EyeIcon } from '@heroicons/react/24/outline';

const columns = [
  { key: 'title', label: '標題', render: (v, row) => (
    <div>
      <div className="font-medium text-gray-900">{v}</div>
      <div className="text-xs text-gray-500 mt-0.5">{row.source}</div>
    </div>
  ) },
  { key: 'type', label: '類型', render: (v) => (
    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">{v}</span>
  )},
  { key: 'severity', label: '等級', render: (v) => (
    <span className={`px-2 py-0.5 text-xs rounded-full ${v === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{v}</span>
  )},
  { key: 'status', label: '狀態', render: (v) => (
    <span className={`px-2 py-0.5 text-xs rounded-full ${v === 'unread' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{v}</span>
  )},
  { key: 'receivedAt', label: '接收時間', render: (v) => new Date(v).toLocaleString() },
  { key: 'actions', label: '操作', sortable: false, render: (_, _row) => (
    <div className="flex items-center gap-2">
      <button className="p-2 text-gray-500 hover:text-[#cc824d]" title="檢視">
        <EyeIcon className="w-5 h-5" />
      </button>
    </div>
  )}
];

const NotificationCenter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [filter, setFilter] = useState({
    status: params.get('status') || 'all',
    type: params.get('type') || 'all',
  });

  const allData = inboxDataManager.getAll();
  const filtered = useMemo(() => {
    return allData.filter(item => {
      if (filter.status !== 'all') {
        if (filter.status === 'error' && item.severity !== 'error') return false;
        if (['unread','read','resolved'].includes(filter.status) && item.status !== filter.status) return false;
      }
      if (filter.type !== 'all' && item.type !== filter.type) return false;
      return true;
    });
  }, [allData, filter]);

  useEffect(() => {
    const next = new URLSearchParams(location.search);
    filter.status && filter.status !== 'all' ? next.set('status', filter.status) : next.delete('status');
    filter.type && filter.type !== 'all' ? next.set('type', filter.type) : next.delete('type');
    const nextSearch = next.toString();
    const currentSearch = location.search.startsWith('?') ? location.search.slice(1) : location.search;
    if (nextSearch !== currentSearch) {
      navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.status, filter.type]);

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2d1e0f]">通知中心</h1>
        <p className="text-gray-600 mt-1">接收來自顧客、金流與系統的所有訊息</p>
      </div>

      {/* 子頁籤改由頂部 ManagementLayout 根據 tabsConfig 顯示 */}

      {/* 篩選器（共用下拉元件） */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SearchableSelect
            options={[
              { value: 'all', label: '所有狀態' },
              { value: 'unread', label: '未讀' },
              { value: 'read', label: '已讀' },
              { value: 'resolved', label: '已處理' },
              { value: 'error', label: '錯誤/告警' },
            ]}
            value={filter.status}
            onChange={(val) => setFilter((f) => ({ ...f, status: val || 'all' }))}
            placeholder="選擇狀態"
            allowClear={false}
          />
          <SearchableSelect
            options={[
              { value: 'all', label: '所有類型' },
              { value: 'order', label: '訂單' },
              { value: 'payment', label: '金流' },
              { value: 'review', label: '評價' },
              { value: 'system', label: '系統' },
            ]}
            value={filter.type}
            onChange={(val) => setFilter((f) => ({ ...f, type: val || 'all' }))}
            placeholder="選擇類型"
            allowClear={false}
          />
        </div>
      </div>

      {/* 通用表格（收件匣）*/}
      <StandardTable
        data={filtered}
        columns={columns}
        title="收件匣"
        exportFileName="notification-center"
        getRowId={(row) => row.id}
        emptyIcon={BellIcon}
      />
    </div>
  );
};

export default NotificationCenter;
