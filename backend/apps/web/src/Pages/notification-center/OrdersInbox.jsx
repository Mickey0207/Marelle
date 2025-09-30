import React, { useMemo } from 'react';
import inboxDataManager from '../../../../external_mock/notification-center/inboxDataManager';
import StandardTable from '../../components/ui/StandardTable';
import { BellIcon, EyeIcon } from '@heroicons/react/24/outline';

const columns = [
  { key: 'title', label: '標題', render: (v, row) => (
    <div>
      <div className="font-medium text-gray-900">{v}</div>
      <div className="text-xs text-gray-500 mt-0.5">{row.source}</div>
    </div>
  ) },
  { key: 'severity', label: '等級', render: (v) => (
    <span className={`px-2 py-0.5 text-xs rounded-full ${v === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{v}</span>
  )},
  { key: 'status', label: '狀態', render: (v) => (
    <span className={`px-2 py-0.5 text-xs rounded-full ${v === 'unread' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{v}</span>
  )},
  { key: 'receivedAt', label: '接收時間', render: (v) => new Date(v).toLocaleString() },
];

const OrdersInbox = () => {
  const rows = useMemo(() => inboxDataManager.getByType('order'), []);
  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2d1e0f]">通知中心</h1>
        <p className="text-gray-600 mt-1">接收來自顧客、金流與系統的所有訊息</p>
      </div>

        {/* 子頁籤改由頂部 ManagementLayout 根據 tabsConfig 顯示 */}

      {/* 表格 */}
      <StandardTable
        data={rows}
        columns={columns}
        title="訂單相關訊息"
        exportFileName="notification-center-orders"
        getRowId={(row) => row.id}
        emptyIcon={BellIcon}
      />
    </div>
  );
};

export default OrdersInbox;
