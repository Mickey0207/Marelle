import React, { useMemo } from 'react';
import StandardTable from '../../components/ui/StandardTable';
import paymentsData from '../../../../external_mock/notification-center/ecpay/paymentsData';
import { CreditCardIcon } from '@heroicons/react/24/outline';

const columns = [
  { key: 'MerchantTradeNo', label: '特店交易編號' },
  { key: 'TradeNo', label: '綠界交易編號' },
  { key: 'TradeAmt', label: '交易金額', render: (v) => <span>${v}</span> },
  { key: 'RtnCode', label: '狀態代碼' },
  { key: 'RtnMsg', label: '狀態訊息' },
  { key: 'PaymentType', label: '付款方式' },
  { key: 'PaymentTypeChargeFee', label: '交易服務金額' },
  { key: 'TradeDate', label: '訂單成立時間' },
  { key: 'PaymentDate', label: '付款時間' },
  { key: 'SimulatePaid', label: '模擬付款', render: (v) => v ? '是' : '否' },
  { key: 'MerchantID', label: '特店編號' },
  { key: 'StoreID', label: '店舖代號' },
  { key: 'PlatformID', label: '平台商代號' },
  { key: 'CustomField1', label: '自訂欄位1' },
  { key: 'CustomField2', label: '自訂欄位2' },
  { key: 'CustomField3', label: '自訂欄位3' },
  { key: 'CustomField4', label: '自訂欄位4' },
  { key: 'CheckMacValue', label: '檢查碼' },
];

export default function ECPayPayments() {
  const rows = useMemo(() => paymentsData.getList(), []);
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2d1e0f]">通知中心</h1>
        <p className="text-gray-600 mt-1">綠界付款結果</p>
      </div>
      <StandardTable
        data={rows}
        columns={columns}
        title="綠界付款結果"
        exportFileName="ecpay-payments"
        getRowId={(row) => row.id}
        emptyIcon={CreditCardIcon}
      />
    </div>
  );
}
