import React, { useMemo, useState } from 'react';
import StandardTable from '../../components/ui/StandardTable';
import codesData from '../../../lib/mocks/notification-center/ecpay/codesData';
import paymentTypes from '../../../lib/mocks/notification-center/ecpay/paymentTypes';
import GlassModal from '../../components/ui/GlassModal';
import TabNavigation from '../../components/ui/TabNavigation';
import IconActionButton from '../../components/ui/IconActionButton';
import { QrCodeIcon, EyeIcon } from '@heroicons/react/24/outline';

// 表格精簡：特店交易編號、綠界交易編號、狀態訊息、交易金額、付款方式、訂單成立時間、繳費碼 + 操作
const columns = [
  { key: 'MerchantTradeNo', label: '特店交易編號' },
  { key: 'TradeNo', label: '綠界交易編號' },
  { key: 'RtnMsg', label: '狀態訊息' },
  { key: 'TradeAmt', label: '交易金額', render: (v) => <span>${v}</span> },
  { key: 'PaymentType', label: '付款方式', render: (v) => paymentTypes.formatWithChinese(v) },
  { key: 'TradeDate', label: '訂單成立時間' },
  // 繳費碼：ATM 顯示 vAccount，CVS 顯示 PaymentNo，BARCODE 顯示 Barcode1-3 合併
  { key: '_code', label: '繳費碼', sortable: false, render: (_v, row) => {
      if (row.PaymentType?.startsWith('ATM')) return row.vAccount || '-';
      if (row.PaymentType?.startsWith('CVS')) return row.PaymentNo || '-';
      if (row.PaymentType?.startsWith('BARCODE')) {
        const parts = [row.Barcode1, row.Barcode2, row.Barcode3].filter(Boolean);
        return parts.length ? parts.join(' ') : '-';
      }
      return '-';
    }
  },
  {
    key: '_actions',
    label: '操作',
    sortable: false,
    render: (_v, row) => (
      <IconActionButton Icon={EyeIcon} label="查看詳情" variant="blue" onClick={() => row.__onView?.(row)} />
    )
  }
];

export default function ECPayCodes() {
  const [detail, setDetail] = useState(null);
  const [activeKey, setActiveKey] = useState('basic');

  const rows = useMemo(() => codesData.getList().map(r => ({ ...r, __onView: () => { setDetail(r); setActiveKey('basic'); } })), []);
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2d1e0f]">通知中心</h1>
        <p className="text-gray-600 mt-1">綠界取號</p>
      </div>
      <StandardTable
        data={rows}
        columns={columns}
        title="綠界取號"
        exportFileName="ecpay-codes"
        getRowId={(row) => row.id}
        emptyIcon={QrCodeIcon}
      />

      {/* 詳情彈窗 */}
      <GlassModal
        isOpen={!!detail}
        onClose={() => setDetail(null)}
        title="取號詳情"
        size="max-w-5xl"
        contentMaxHeight="max-h-[calc(85vh-80px)]"
      >
        {detail && (
          <div className="flex flex-col">
            <div className="border-b">
              <TabNavigation
                tabs={[
                  { key: 'basic', label: '基本資料' },
                  { key: 'atm', label: 'ATM' },
                  { key: 'cvs', label: 'CVS' },
                  { key: 'barcode', label: 'BARCODE' },
                  { key: 'meta', label: '其他' },
                ]}
                mode="controlled"
                activeKey={activeKey}
                onTabChange={(tab) => setActiveKey(tab.key)}
                layout="left"
                className="px-4"
              />
            </div>

            <div className="p-6 space-y-6">
              {activeKey === 'basic' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="特店交易編號">{detail.MerchantTradeNo}</Field>
                  <Field label="綠界交易編號">{detail.TradeNo}</Field>
                  <Field label="交易金額">{`NT$${detail.TradeAmt}`}</Field>
                  <Field label="付款方式">{paymentTypes.formatWithChinese(detail.PaymentType)}</Field>
                  <Field label="狀態訊息">{detail.RtnMsg}</Field>
                  <Field label="訂單成立時間">{detail.TradeDate}</Field>
                  <Field label="檢查碼">
                    <code className="text-xs break-all">{detail.CheckMacValue}</code>
                  </Field>
                </div>
              )}

              {activeKey === 'atm' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="繳費銀行代碼">{detail.BankCode || '-'}</Field>
                  <Field label="繳費虛擬帳號">{detail.vAccount || '-'}</Field>
                  <Field label="繳費期限">{detail.ExpireDate || '-'}</Field>
                </div>
              )}

              {activeKey === 'cvs' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="繳費代碼">{detail.PaymentNo || '-'}</Field>
                  <Field label="繳費期限">{detail.ExpireDate || '-'}</Field>
                </div>
              )}

              {activeKey === 'barcode' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="條碼一">{detail.Barcode1 || '-'}</Field>
                  <Field label="條碼二">{detail.Barcode2 || '-'}</Field>
                  <Field label="條碼三">{detail.Barcode3 || '-'}</Field>
                  <Field label="繳費期限">{detail.ExpireDate || '-'}</Field>
                </div>
              )}

              {activeKey === 'meta' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="特店編號">{detail.MerchantID}</Field>
                  <Field label="店舖代號">{detail.StoreID || '-'}</Field>
                  <Field label="自訂欄位1">{detail.CustomField1 || '-'}</Field>
                  <Field label="自訂欄位2">{detail.CustomField2 || '-'}</Field>
                  <Field label="自訂欄位3">{detail.CustomField3 || '-'}</Field>
                  <Field label="自訂欄位4">{detail.CustomField4 || '-'}</Field>
                </div>
              )}
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
}

// 輕量 Field 元件（沿用既有風格）
const Field = ({ label, children }) => (
  <div className="grid grid-cols-3 gap-4 py-2">
    <div className="text-sm text-gray-500 font-chinese col-span-1">{label}</div>
    <div className="col-span-2 text-gray-900 text-sm break-words">{children || '-'}</div>
  </div>
);
