// 綠界 取號結果通知 - 模擬資料（ATM/CVS/BARCODE）依官方文件：https://developers.ecpay.com.tw/?p=2881
const pad = (n) => String(n).padStart(2, '0');
const toTW = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}/${pad(dt.getMonth() + 1)}/${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
};

const now = new Date();

const rows = [
  // CVS 取號成功案例（RtnCode=10100073）
  {
    id: 'ecpaycode-1',
    MerchantID: '3002607',
    MerchantTradeNo: 'ORD-2024-203',
    StoreID: '',
    RtnCode: 10100073,
    RtnMsg: 'Get CVS Code Succeeded.',
    TradeNo: '24123111223344556677',
    TradeAmt: 1280,
    PaymentType: 'CVS_CVS',
    TradeDate: toTW(new Date(now.getTime() - 60 * 1000)),
    PaymentNo: '84861621',
    ExpireDate: toTW(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)),
    Barcode1: '',
    Barcode2: '',
    Barcode3: '',
    CheckMacValue: 'FAKE-CHECKMAC-CVS-1',
    CustomField1: '',
    CustomField2: '',
    CustomField3: '',
    CustomField4: '',
  },
  // ATM 取號成功案例（RtnCode=2）
  {
    id: 'ecpaycode-2',
    MerchantID: '3002607',
    MerchantTradeNo: 'ORD-2024-204',
    StoreID: '',
    RtnCode: 2,
    RtnMsg: 'Get Virtual Account Succeeded.',
    TradeNo: '24123199887766554433',
    TradeAmt: 2560,
    PaymentType: 'ATM_TAISHIN',
    TradeDate: toTW(new Date(now.getTime() - 2 * 60 * 1000)),
    BankCode: '812',
    vAccount: '012345678901',
    ExpireDate: '2025/10/05', // ATM 格式為 yyyy/MM/dd
    PaymentNo: '',
    Barcode1: '',
    Barcode2: '',
    Barcode3: '',
    CheckMacValue: 'FAKE-CHECKMAC-ATM-1',
    CustomField1: '',
    CustomField2: 'note-ATM',
    CustomField3: '',
    CustomField4: '',
  },
  // BARCODE 取號成功案例（RtnCode=10100073，Barcode1~3 有值）
  {
    id: 'ecpaycode-3',
    MerchantID: '3002607',
    MerchantTradeNo: 'ORD-2024-205',
    StoreID: '',
    RtnCode: 10100073,
    RtnMsg: 'Get BARCODE Succeeded.',
    TradeNo: '24123166778899001122',
    TradeAmt: 360,
    PaymentType: 'BARCODE_BARCODE',
    TradeDate: toTW(new Date(now.getTime() - 3 * 60 * 1000)),
    PaymentNo: '',
    ExpireDate: toTW(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)),
    Barcode1: 'ABCD1234567890',
    Barcode2: 'EFGH0987654321',
    Barcode3: 'IJKL1122334455',
    CheckMacValue: 'FAKE-CHECKMAC-BARCODE-1',
    CustomField1: 'campaign=bar',
    CustomField2: '',
    CustomField3: '',
    CustomField4: '',
  },
  // 失敗案例（示意 RtnCode 非成功值）
  {
    id: 'ecpaycode-4',
    MerchantID: '3002607',
    MerchantTradeNo: 'ORD-2024-206',
    StoreID: '',
    RtnCode: 340002, // 隨機錯誤碼示例
    RtnMsg: 'Get Code Failed: invalid params',
    TradeNo: '24123100001111222233',
    TradeAmt: 420,
    PaymentType: 'CVS_CVS',
    TradeDate: toTW(new Date(now.getTime() - 5 * 60 * 1000)),
    PaymentNo: '',
    ExpireDate: toTW(new Date(now.getTime() + 24 * 60 * 60 * 1000)),
    Barcode1: '',
    Barcode2: '',
    Barcode3: '',
    CheckMacValue: 'FAKE-CHECKMAC-FAIL-1',
    CustomField1: '',
    CustomField2: '',
    CustomField3: '',
    CustomField4: '',
  },
];

const codesData = {
  getList: () => [...rows],
};

export default codesData;
