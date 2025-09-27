// 綠界 無卡分期申請結果通知 - 模擬資料（依官方文件：https://developers.ecpay.com.tw/?p=37517）
const pad = (n) => String(n).padStart(2, '0');
const toTW = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}/${pad(dt.getMonth() + 1)}/${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
};

const now = new Date();

const rows = [
  // 申請已核准（RtnCode=1）
  {
    id: 'ecpaybnpl-1',
    MerchantID: '3002607',
    MerchantTradeNo: 'ORD-2024-310',
    StoreID: '',
    RtnCode: 1,
    RtnMsg: 'apply approved',
    TradeNo: '25010199887766554422',
    TradeAmt: 5980,
    PaymentType: 'BNPL',
    TradeDate: toTW(now),
    BNPLTradeNo: 'BNPL240101A123456789',
    BNPLInstallment: '06',
    CustomField1: 'plan=yufoo',
    CustomField2: '',
    CustomField3: '',
    CustomField4: '',
    CheckMacValue: 'FAKE-CHECKMAC-BNPL-OK',
  },
  // 申請中（RtnCode=2）
  {
    id: 'ecpaybnpl-2',
    MerchantID: '3002607',
    MerchantTradeNo: 'ORD-2024-311',
    StoreID: '',
    RtnCode: 2,
    RtnMsg: 'apply pending',
    TradeNo: '25010122334455667788',
    TradeAmt: 12000,
    PaymentType: 'BNPL',
    TradeDate: toTW(new Date(now.getTime() - 60 * 1000)),
    BNPLTradeNo: 'BNPL240101B223344556',
    BNPLInstallment: '12',
    CustomField1: '',
    CustomField2: 'note=pending',
    CustomField3: '',
    CustomField4: '',
    CheckMacValue: 'FAKE-CHECKMAC-BNPL-PENDING',
  },
  // 失敗（RtnCode=其他）
  {
    id: 'ecpaybnpl-3',
    MerchantID: '3002607',
    MerchantTradeNo: 'ORD-2024-312',
    StoreID: '',
    RtnCode: 340101,
    RtnMsg: 'apply rejected',
    TradeNo: '25010166778899001122',
    TradeAmt: 7990,
    PaymentType: 'BNPL',
    TradeDate: toTW(new Date(now.getTime() - 5 * 60 * 1000)),
    BNPLTradeNo: 'BNPL240101C667788990',
    BNPLInstallment: '03',
    CustomField1: '',
    CustomField2: '',
    CustomField3: '',
    CustomField4: '',
    CheckMacValue: 'FAKE-CHECKMAC-BNPL-FAIL',
  },
];

const cardlessInstallmentsData = {
  getList: () => [...rows],
};

export default cardlessInstallmentsData;
