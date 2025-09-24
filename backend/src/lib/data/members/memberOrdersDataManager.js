// 會員訂單模擬數據管理器

const mockOrders = [
  {
    id: 'O20240915001',
    memberId: 1,
    orderNo: 'O-2024-0915-001',
    createdAt: '2024-09-15 10:32',
    status: 'delivered', // pending | paid | processing | shipped | delivered | canceled | returned
    payment: { method: 'CreditCard', status: 'paid' },
    shipping: {
      method: 'home',
      fee: 100,
      address: { postalCode: '100', city: '臺北市', district: '中正區', streetAddress: '重慶南路一段 122 號 5 樓' },
      carrier: '黑貓',
      trackingNo: 'T1234567890'
    },
    items: [
      { sku: 'SKU-001', name: '經典保濕精華 50ml', qty: 1, price: 1280 },
      { sku: 'SKU-002', name: '玫瑰潔面乳 150ml', qty: 2, price: 680 },
    ],
    discounts: [ { type: 'coupon', code: 'WELCOME100', amount: 100 } ],
    totals: { subtotal: 2640, discount: 100, shipping: 100, grandTotal: 2640 },
    invoice: {
      type: '電子發票',
      number: 'AB12345678',
      carrier: '/1234567890',
      title: '個人',
      issuedAt: '2024-09-15 10:40',
      status: 'issued'
    }
  },
  {
    id: 'O20240828007',
    memberId: 1,
    orderNo: 'O-2024-0828-007',
    createdAt: '2024-08-28 16:05',
    status: 'shipped',
    payment: { method: 'ATM', status: 'paid' },
    shipping: {
      method: 'cvs', provider: 'FAMILY_MART', fee: 60,
      store: { id: 'F12345', name: '府前店', address: '臺南市中西區府前路一段 88 號' },
      carrier: '全家店到店',
      trackingNo: 'FM12345678'
    },
    items: [ { sku: 'SKU-010', name: '絲絨口紅 3g', qty: 1, price: 520 } ],
    discounts: [],
    totals: { subtotal: 520, discount: 0, shipping: 60, grandTotal: 580 },
    invoice: {
      type: '電子發票',
      number: 'CD23456789',
      carrier: '/9988776655',
      title: '個人',
      issuedAt: '2024-08-28 16:15',
      status: 'issued'
    }
  },
  {
    id: 'O20240712003',
    memberId: 2,
    orderNo: 'O-2024-0712-003',
    createdAt: '2024-07-12 11:20',
    status: 'processing',
    payment: { method: 'CreditCard', status: 'paid' },
    shipping: {
      method: 'home', fee: 100,
      address: { postalCode: '220', city: '新北市', district: '板橋區', streetAddress: '文化路一段 100 巷 8 號 3 樓' },
      carrier: '新竹物流',
      trackingNo: 'HCT87654321'
    },
    items: [
      { sku: 'SKU-003', name: '薰衣草身體乳 250ml', qty: 1, price: 880 },
      { sku: 'SKU-004', name: '晶透卸妝油 200ml', qty: 1, price: 720 }
    ],
    discounts: [ { type: 'points', amount: 50 } ],
    totals: { subtotal: 1600, discount: 50, shipping: 100, grandTotal: 1650 },
    invoice: {
      type: '電子發票',
      number: 'EF34567890',
      carrier: '/5566778899',
      title: '個人',
      issuedAt: '2024-07-12 11:35',
      status: 'issued'
    }
  }
];

// 退款模擬資料
const mockRefunds = [
  {
    id: 'R20240916001',
    memberId: 1,
    refundNo: 'R-2024-0916-001',
    originalOrderId: 'O20240915001',
    createdAt: '2024-09-16 09:20',
    status: 'refunded', // requested | approved | refunded | rejected
    payment: { method: 'CreditCard', status: 'refunded' },
    shippingReturn: {
      method: 'home',
      carrier: '黑貓',
      trackingNo: 'RT987654321'
    },
    items: [
      { sku: 'SKU-002', name: '玫瑰潔面乳 150ml', qty: 1, price: 680 }
    ],
    amounts: { subtotal: 680, shippingRefund: 100, totalRefund: 780 },
    invoice: { type: '折讓單', number: 'CN1234567', issuedAt: '2024-09-16 10:05', status: 'issued' }
  },
  {
    id: 'R20240830002',
    memberId: 1,
    refundNo: 'R-2024-0830-002',
    originalOrderId: 'O20240828007',
    createdAt: '2024-08-30 13:45',
    status: 'approved',
    payment: { method: 'ATM', status: 'pending' },
    shippingReturn: { method: 'cvs', provider: 'FAMILY_MART', storeId: 'F12345', storeName: '府前店' },
    items: [ { sku: 'SKU-010', name: '絲絨口紅 3g', qty: 1, price: 520 } ],
    amounts: { subtotal: 520, shippingRefund: 60, totalRefund: 580 },
    invoice: { type: '折讓單', number: 'CN2233445', issuedAt: null, status: 'pending' }
  }
];

class MemberOrdersDataManager {
  async getOrdersByMember(memberId) {
    const idNum = Number(memberId);
    const orders = mockOrders.filter(o => o.memberId === idNum);
    return { success: true, data: orders };
  }

  async getRefundsByMember(memberId) {
    const idNum = Number(memberId);
    const refunds = mockRefunds.filter(r => r.memberId === idNum);
    return { success: true, data: refunds };
  }
}

const memberOrdersDataManager = new MemberOrdersDataManager();
export default memberOrdersDataManager;
