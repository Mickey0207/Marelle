// 會員訂單 mock 資料（前端臨時）
// 狀態：pending_payment、pending_ship、shipped、completed、refund, canceled
export const memberOrders = [
  {
    id: 'MB20251015001',
    createdAt: '2025-10-12 14:32',
    status: 'pending_payment',
    total: 1880,
    coupon: { code: 'WELCOME10', title: '新會員 9 折券', discount: 188 },
    items: [
      { name: 'Meisterstück 145 鋼筆', qty: 1, price: 1880, image: '/product-placeholder.svg', sku: 'MB-145-PEN' }
    ],
    logistics: { method: 'CVS', vendor: '7-11', storeName: '松江門市', storeId: '123456' },
    payment: { method: '信用卡', paid: false },
    note: ''
  },
  {
    id: 'MB20251015002',
    createdAt: '2025-10-11 18:05',
    status: 'pending_ship',
    total: 4680,
    coupon: { code: 'SAVE200', title: '滿 1,500 折 200', discount: 200 },
    items: [
      { name: 'Legend 濃香水 100ml', qty: 1, price: 4680, image: '/product-placeholder.svg', sku: 'LEG-EDP-100' }
    ],
    logistics: { method: 'HOME', address: '台北市中山區南京東路三段 100 號 5 樓' },
    payment: { method: 'ATM', paid: true },
    note: '備註：禮物包裝'
  },
  {
    id: 'MB20251015003',
    createdAt: '2025-10-10 09:20',
    status: 'shipped',
    total: 280,
    items: [
      { name: '原子筆芯 - 黑色', qty: 1, price: 280, image: '/product-placeholder.svg', sku: 'BP-REFILL-BK' }
    ],
    logistics: { method: 'HOME', address: '台中市西屯區台灣大道二段 200 號 10 樓' },
    payment: { method: 'LINE Pay', paid: true },
    note: ''
  },
  {
    id: 'MB20251015004',
    createdAt: '2025-10-08 12:10',
    status: 'completed',
    total: 3280,
    items: [
      { name: 'Legend 淡香水 50ml', qty: 1, price: 3280, image: '/product-placeholder.svg', sku: 'LEG-EDT-50' }
    ],
    logistics: { method: 'CVS', vendor: 'FamilyMart', storeName: '林森門市', storeId: 'F12345' },
    payment: { method: '信用卡', paid: true },
    note: ''
  },
  {
    id: 'MB20251015005',
    createdAt: '2025-10-07 11:40',
    status: 'refund',
    total: 2280,
    items: [
      { name: '#146 經典筆記本', qty: 1, price: 2280, image: '/product-placeholder.svg', sku: '146NBK' }
    ],
    logistics: { method: 'HOME', address: '高雄市前鎮區中華五路 789 號' },
    payment: { method: '信用卡', paid: true },
    note: '退貨原因：尺寸不合'
  },
  {
    id: 'MB20251015006',
    createdAt: '2025-10-05 16:28',
    status: 'canceled',
    total: 580,
    items: [
      { name: '墨水匣組合包', qty: 1, price: 580, image: '/product-placeholder.svg', sku: 'INK-CART-SET' }
    ],
    logistics: { method: 'HOME', address: '新北市板橋區文化路一段 1 號' },
    payment: { method: '貨到付款', paid: false },
    note: '付款逾期自動取消'
  }
];
