// 綠界 定期定額付款結果通知 - 模擬資料（依官方文件：https://developers.ecpay.com.tw/?p=5631）
const pad = (n) => String(n).padStart(2, '0');
const toTW = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}/${pad(dt.getMonth() + 1)}/${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
};

const now = new Date();

const rows = [
  {
    id: 'ecpaysub-1',
    MerchantID: '3002607',
    MerchantTradeNo: 'SUB-2024-001',
    StoreID: '',
    RtnCode: 1,
    RtnMsg: '付款成功',
    TradeNo: '2409011122334455',
    PaymentDate: toTW(now),
    PaymentType: 'Credit',
    TradeDate: toTW(new Date(now.getTime() - 60 * 1000)),
    SimulatePaid: 0,
    PeriodType: 'M', // D | M | Y
    Frequency: 1,
    ExecTimes: 2,
    Amount: 299,
    Gwsr: 12345678,
    ProcessDate: toTW(now),
    AuthCode: 'A1B2C3',
    FirstAuthAmount: 299,
    PeriodAmount: 299,
    TotalSuccessTimes: 2,
    TotalSuccessAmount: 598,
    CustomField1: 'plan=basic',
    CustomField2: '',
    CustomField3: '',
    CustomField4: '',
    CheckMacValue: 'FAKECHECKMACVALUE123',
  },
  {
    id: 'ecpaysub-2',
    MerchantID: '3002607',
    MerchantTradeNo: 'SUB-2024-002',
    StoreID: 'S1',
    RtnCode: 10100252,
    RtnMsg: '額度不足，請檢查卡片額度或餘額',
    TradeNo: '2409015566778899',
    PaymentDate: toTW(new Date(now.getTime() - 2 * 60 * 60 * 1000)),
    PaymentType: 'Credit',
    TradeDate: toTW(new Date(now.getTime() - 2 * 60 * 60 * 1000 - 60 * 1000)),
    SimulatePaid: 0,
    PeriodType: 'M',
    Frequency: 1,
    ExecTimes: 5,
    Amount: 799,
    Gwsr: 87654321,
    ProcessDate: toTW(new Date(now.getTime() - 2 * 60 * 60 * 1000)),
    AuthCode: '',
    FirstAuthAmount: 799,
    PeriodAmount: 799,
    TotalSuccessTimes: 4,
    TotalSuccessAmount: 3196,
    CustomField1: 'plan=premium',
    CustomField2: 'note-B',
    CustomField3: '',
    CustomField4: '',
    CheckMacValue: 'FAKECHECKMACVALUE456',
  },
  {
    id: 'ecpaysub-3',
    MerchantID: '3002607',
    MerchantTradeNo: 'SUB-TEST-SIM',
    StoreID: '',
    RtnCode: 1,
    RtnMsg: '付款成功(模擬)',
    TradeNo: 'SIM2409019988776655',
    PaymentDate: toTW(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
    PaymentType: 'Credit',
    TradeDate: toTW(new Date(now.getTime() - 24 * 60 * 60 * 1000 - 60 * 1000)),
    SimulatePaid: 1,
    PeriodType: 'D',
    Frequency: 7,
    ExecTimes: 1,
    Amount: 99,
    Gwsr: 19283746,
    ProcessDate: toTW(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
    AuthCode: 'Z9Y8X7',
    FirstAuthAmount: 99,
    PeriodAmount: 99,
    TotalSuccessTimes: 1,
    TotalSuccessAmount: 99,
    CustomField1: '',
    CustomField2: '',
    CustomField3: '',
    CustomField4: '',
    CheckMacValue: 'FAKECHECKMACVALUE789',
  },
];

const subscriptionsData = {
  getList: () => [...rows],
};

export default subscriptionsData;
