import React, { useMemo, useState } from 'react';
import StandardTable from '../../components/ui/StandardTable';
import subscriptionsData from '../../../lib/mocks/notification-center/ecpay/subscriptionsData';
import GlassModal from '../../components/ui/GlassModal';
import TabNavigation from '../../components/ui/TabNavigation';
import IconActionButton from '../../components/ui/IconActionButton';
import { CalendarDaysIcon, EyeIcon } from '@heroicons/react/24/outline';

const mapPeriodType = (v) => {
  if (v === 'D') return '天 (D)';
  if (v === 'M') return '月 (M)';
  if (v === 'Y') return '年 (Y)';
  return v || '-';
};

// 表格僅顯示四個欄位 + 操作
const columns = [
  { key: 'MerchantTradeNo', label: '特店交易編號' },
  { key: 'TradeNo', label: '綠界交易編號' },
  { key: 'RtnMsg', label: '狀態訊息' },
  { key: 'Amount', label: '本次授權金額', render: (v) => <span>${v}</span> },
  {
    key: '_actions',
    label: '操作',
    sortable: false,
    render: (_v, row) => (
      <IconActionButton Icon={EyeIcon} label="查看詳情" variant="blue" onClick={() => row.__onView?.(row)} />
    ),
  },
];

export default function ECPaySubscriptions() {
  const [detail, setDetail] = useState(null);
  const [activeKey, setActiveKey] = useState('basic');

  // 將 onView 綁到每列，供操作欄位呼叫
  const rows = useMemo(() => (
    subscriptionsData.getList().map(r => ({ ...r, __onView: () => { setDetail(r); setActiveKey('basic'); } }))
  ), []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2d1e0f]">通知中心</h1>
        <p className="text-gray-600 mt-1">綠界定期定額</p>
      </div>
      <StandardTable
        data={rows}
        columns={columns}
        title="綠界定期定額付款結果"
        exportFileName="ecpay-subscriptions"
        getRowId={(row) => row.id}
        emptyIcon={CalendarDaysIcon}
      />

      {/* 詳情彈窗 */}
      <GlassModal
        isOpen={!!detail}
        onClose={() => setDetail(null)}
        title="定期定額付款詳情"
        size="max-w-5xl"
        contentMaxHeight="max-h-[calc(85vh-80px)]"
      >
        {detail && (
          <div className="flex flex-col">
            {/* 子頁籤 */}
            <div className="border-b">
              <TabNavigation
                tabs={[
                  { key: 'basic', label: '基本資料' },
                  { key: 'schedule', label: '週期設定' },
                  { key: 'timing', label: '時間' },
                  { key: 'amounts', label: '金額統計' },
                  { key: 'advanced', label: '進階欄位' },
                ]}
                mode="controlled"
                activeKey={activeKey}
                onTabChange={(tab) => setActiveKey(tab.key)}
                layout="left"
                className="px-4"
              />
            </div>

            {/* 內容 */}
            <div className="p-6 space-y-6">
              {activeKey === 'basic' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="特店交易編號">{detail.MerchantTradeNo}</Field>
                  <Field label="綠界交易編號">{detail.TradeNo}</Field>
                  <Field label="狀態代碼">{detail.RtnCode}</Field>
                  <Field label="狀態訊息">{detail.RtnMsg}</Field>
                  <Field label="付款方式">{detail.PaymentType || '-'}</Field>
                  <Field label="模擬付款">{detail.SimulatePaid ? '是' : '否'}</Field>
                  <Field label="特店編號">{detail.MerchantID}</Field>
                  <Field label="店舖代號">{detail.StoreID || '-'}</Field>
                </div>
              )}

              {activeKey === 'schedule' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="週期種類">{mapPeriodType(detail.PeriodType)}</Field>
                  <Field label="執行頻率">{detail.Frequency}</Field>
                  <Field label="執行次數">{detail.ExecTimes}</Field>
                  <Field label="每期授權金額">{detail.PeriodAmount != null ? `NT$${detail.PeriodAmount}` : '-'}</Field>
                </div>
              )}

              {activeKey === 'timing' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="訂單成立時間">{detail.TradeDate}</Field>
                  <Field label="付款時間">{detail.PaymentDate}</Field>
                  <Field label="處理時間">{detail.ProcessDate}</Field>
                </div>
              )}

              {activeKey === 'amounts' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="本次授權金額">{detail.Amount != null ? `NT$${detail.Amount}` : '-'}</Field>
                  <Field label="首次授權金額">{detail.FirstAuthAmount != null ? `NT$${detail.FirstAuthAmount}` : '-'}</Field>
                  <Field label="已成功次數">{detail.TotalSuccessTimes != null ? detail.TotalSuccessTimes : '-'}</Field>
                  <Field label="成功金額累計">{detail.TotalSuccessAmount != null ? `NT$${detail.TotalSuccessAmount}` : '-'}</Field>
                </div>
              )}

              {activeKey === 'advanced' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="授權碼">{detail.AuthCode || '-'}</Field>
                  <Field label="授權交易單號 (Gwsr)">{detail.Gwsr || '-'}</Field>
                  <Field label="自訂欄位1">{detail.CustomField1 || '-'}</Field>
                  <Field label="自訂欄位2">{detail.CustomField2 || '-'}</Field>
                  <Field label="自訂欄位3">{detail.CustomField3 || '-'}</Field>
                  <Field label="自訂欄位4">{detail.CustomField4 || '-'}</Field>
                  <div className="col-span-2">
                    <Field label="檢查碼">
                      <code className="text-xs break-all">{detail.CheckMacValue}</code>
                    </Field>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
}

// 輕量的欄位顯示工具（沿用既有風格）
const Field = ({ label, children }) => (
  <div className="grid grid-cols-3 gap-4 py-2">
    <div className="text-sm text-gray-500 font-chinese col-span-1">{label}</div>
    <div className="col-span-2 text-gray-900 text-sm break-words">{children || '-'}</div>
  </div>
);
