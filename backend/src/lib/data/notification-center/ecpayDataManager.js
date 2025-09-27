// 模擬 綠界（ECPay）相關對內通知資料
// 提供四類：付款結果、定期定額、取號（ATM/CVS/Barcode）、無卡分期申請

const now = new Date();
const toISO = (d) => new Date(d).toISOString();

const payments = [
  {
    id: 'ecpay-pay-1',
    orderNumber: 'ORD-2024-201',
    tradeNo: '2209151234567890',
    method: '信用卡一次付清',
    amount: 1980,
    status: 'success', // success | failed | pending
    message: '授權成功',
    receivedAt: toISO(now),
  },
  {
    id: 'ecpay-pay-2',
    orderNumber: 'ORD-2024-202',
    tradeNo: '2209152234567891',
    method: 'LINE Pay',
    amount: 860,
    status: 'failed',
    message: '交易逾時',
    receivedAt: toISO(new Date(now.getTime() - 60 * 60 * 1000)),
  },
];

const subscriptions = [
  {
    id: 'ecpay-sub-1',
    merchantTradeNo: 'SUB-2024-001',
    planName: '每月 299 方案',
    schedule: '每月',
    amount: 299,
    status: 'active', // active | paused | canceled | failed
    nextChargeAt: toISO(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)),
    receivedAt: toISO(new Date(now.getTime() - 2 * 60 * 60 * 1000)),
  },
  {
    id: 'ecpay-sub-2',
    merchantTradeNo: 'SUB-2024-002',
    planName: '每季 799 方案',
    schedule: '每季',
    amount: 799,
    status: 'failed',
    nextChargeAt: null,
    receivedAt: toISO(new Date(now.getTime() - 6 * 60 * 60 * 1000)),
  },
];

const codes = [
  {
    id: 'ecpay-code-1',
    orderNumber: 'ORD-2024-203',
    type: 'CVS繳費代碼',
    code: '84861621',
    amount: 1280,
    expireAt: toISO(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)),
    status: 'generated', // generated | paid | expired
    receivedAt: toISO(now),
  },
  {
    id: 'ecpay-code-2',
    orderNumber: 'ORD-2024-204',
    type: 'ATM 虛擬帳號',
    code: '822-012345678901',
    amount: 2560,
    expireAt: toISO(new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)),
    status: 'paid',
    receivedAt: toISO(new Date(now.getTime() - 4 * 60 * 60 * 1000)),
  },
];

const cardlessInstallments = [
  {
    id: 'ecpay-ci-1',
    applicationId: 'CI-2024-0001',
    applicant: '王小明',
    amount: 5980,
    terms: 6,
    status: 'approved', // approved | rejected | pending
    receivedAt: toISO(now),
  },
  {
    id: 'ecpay-ci-2',
    applicationId: 'CI-2024-0002',
    applicant: '林小華',
    amount: 12990,
    terms: 12,
    status: 'pending',
    receivedAt: toISO(new Date(now.getTime() - 8 * 60 * 60 * 1000)),
  },
];

const ecpayDataManager = {
  getPayments: () => [...payments].sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)),
  getSubscriptions: () => [...subscriptions].sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)),
  getCodes: () => [...codes].sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)),
  getCardlessInstallments: () => [...cardlessInstallments].sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)),
};

export default ecpayDataManager;
