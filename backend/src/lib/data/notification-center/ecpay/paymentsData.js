// 綠界 付款結果通知 - 模擬資料
// 參考官方文件：https://developers.ecpay.com.tw/?p=2878

const toTWDate = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  const dt = new Date(d);
  return `${dt.getFullYear()}/${pad(dt.getMonth() + 1)}/${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
};

const now = new Date();

const rows = [
  {
    id: 'ecpayret-1',
    MerchantID: '3002607',
    MerchantTradeNo: 'D9RMXNrihUYM',
    StoreID: '',
    RtnCode: 1,
    RtnMsg: '交易成功',
    TradeNo: '2412311225437371',
    TradeAmt: 402,
    PaymentDate: toTWDate(now),
    PaymentType: 'Credit_CreditCard',
    PaymentTypeChargeFee: 10,
    TradeDate: toTWDate(new Date(now.getTime() - 60 * 1000)),
    PlatformID: '',
    SimulatePaid: 0,
    CustomField1: '',
    CustomField2: '',
    CustomField3: '',
    CustomField4: '',
    CheckMacValue: '85D927637935683EA756CDEF76498FEB9F5D098A7A1AC4F0CB3B3609A9D4116A',
  },
  {
    id: 'ecpayret-2',
    MerchantID: '3002607',
    MerchantTradeNo: 'ORD-2024-220',
    StoreID: '',
    RtnCode: 10100252,
    RtnMsg: '額度不足，請客戶檢查卡片額度或餘額',
    TradeNo: '2501011020304050',
    TradeAmt: 1280,
    PaymentDate: toTWDate(new Date(now.getTime() - 2 * 60 * 60 * 1000)),
    PaymentType: 'Credit_CreditCard',
    PaymentTypeChargeFee: 20,
    TradeDate: toTWDate(new Date(now.getTime() - 2 * 60 * 60 * 1000 - 120000)),
    PlatformID: '',
    SimulatePaid: 0,
    CustomField1: 'note-A',
    CustomField2: '',
    CustomField3: '',
    CustomField4: '',
    CheckMacValue: 'A1B2C3D4E5F60123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0',
  },
  {
    id: 'ecpayret-3',
    MerchantID: '3002607',
    MerchantTradeNo: 'TEST-SIM-001',
    StoreID: '',
    RtnCode: 1,
    RtnMsg: '交易成功(模擬)',
    TradeNo: 'SIM2412311225437371',
    TradeAmt: 999,
    PaymentDate: toTWDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
    PaymentType: 'WebATM_TAISHIN',
    PaymentTypeChargeFee: 5,
    TradeDate: toTWDate(new Date(now.getTime() - 24 * 60 * 60 * 1000 - 60000)),
    PlatformID: '',
    SimulatePaid: 1,
    CustomField1: '',
    CustomField2: '',
    CustomField3: '',
    CustomField4: '',
    CheckMacValue: 'FFEECCDDAA99887766554433221100FFEEDDCCBBAA00998877665544332211',
  },
];

const paymentsData = {
  getList: () => [...rows],
};

export default paymentsData;
