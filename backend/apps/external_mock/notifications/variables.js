// 提供變數類別（供 Tabs 與選單使用）
export const VARIABLE_CATEGORIES = [
  { key: 'user', label: '使用者' },
  { key: 'order', label: '訂單' },
  { key: 'product', label: '商品' },
  { key: 'payment', label: '付款' },
  { key: 'logistics', label: '物流' },
  { key: 'coupon', label: '優惠券' },
  { key: 'campaign', label: '行銷活動' },
  { key: 'system', label: '系統' },
]

// 回傳物件：{ categoryKey: Array<{ token,label,desc? }> }
export function getVariableCatalog() {
  return {
    user: [
      { token: '{{user.name}}', label: '使用者名稱' },
      { token: '{{user.email}}', label: 'Email' },
      { token: '{{user.id}}', label: '使用者ID' },
      { token: '{{user.phone}}', label: '手機號碼' },
    ],
    order: [
      { token: '{{order.id}}', label: '訂單編號' },
      { token: '{{order.total}}', label: '訂單金額' },
      { token: '{{order.createdAt}}', label: '下單時間' },
      { token: '{{order.status}}', label: '訂單狀態' },
      { token: '{{order.itemCount}}', label: '品項數' },
      { token: '{{order.currency}}', label: '幣別' },
      { token: '{{order.shippingFee}}', label: '運費' },
      { token: '{{order.discountTotal}}', label: '折扣金額' },
      { token: '{{order.grandTotal}}', label: '應付金額' },
      { token: '{{order.note}}', label: '訂單備註' },
    ],
    product: [
      { token: '{{product.title}}', label: '商品名稱' },
      { token: '{{product.sku}}', label: 'SKU' },
      { token: '{{product.variant}}', label: '款式/規格' },
      { token: '{{product.price}}', label: '商品單價' },
      { token: '{{product.url}}', label: '商品連結' },
      { token: '{{product.imageUrl}}', label: '商品圖片' },
    ],
    payment: [
      { token: '{{payment.amount}}', label: '付款金額' },
      { token: '{{payment.method}}', label: '付款方式' },
      { token: '{{payment.status}}', label: '付款狀態' },
      { token: '{{payment.deadline}}', label: '付款期限' },
      { token: '{{payment.last4}}', label: '卡號後四碼' },
      { token: '{{payment.gateway}}', label: '金流通道' },
    ],
    logistics: [
      { token: '{{logistics.trackingNo}}', label: '物流編號' },
      { token: '{{logistics.carrier}}', label: '物流業者' },
      { token: '{{logistics.status}}', label: '物流狀態' },
      { token: '{{logistics.etaDate}}', label: '預計到達日' },
      { token: '{{logistics.receiverName}}', label: '收件人姓名' },
      { token: '{{logistics.receiverPhone}}', label: '收件人電話' },
      { token: '{{logistics.address.full}}', label: '收件地址' },
      { token: '{{logistics.address.city}}', label: '縣市' },
      { token: '{{logistics.address.district}}', label: '區/鄉鎮' },
      { token: '{{logistics.address.zip}}', label: '郵遞區號' },
      { token: '{{logistics.trackingUrl}}', label: '查件連結' },
      { token: '{{logistics.storeId}}', label: '超商店號' },
      { token: '{{logistics.storeName}}', label: '超商門市' },
      { token: '{{logistics.pickupCode}}', label: '取件代碼' },
    ],
    coupon: [
      { token: '{{coupon.code}}', label: '優惠碼' },
      { token: '{{coupon.expireDate}}', label: '到期日' },
      { token: '{{coupon.discountPercent}}', label: '折扣百分比' },
      { token: '{{coupon.discountAmount}}', label: '折抵金額' },
      { token: '{{coupon.minSpend}}', label: '最低消費' },
      { token: '{{coupon.url}}', label: '優惠券連結' },
    ],
    campaign: [
      { token: '{{campaign.name}}', label: '活動名稱' },
      { token: '{{campaign.startDate}}', label: '開始日期' },
      { token: '{{campaign.endDate}}', label: '結束日期' },
      { token: '{{campaign.url}}', label: '活動連結' },
    ],
    system: [
      { token: '{{system.date}}', label: '日期' },
      { token: '{{system.time}}', label: '時間' },
      { token: '{{system.siteName}}', label: '站台名稱' },
      { token: '{{system.siteUrl}}', label: '站台網址' },
      { token: '{{system.supportEmail}}', label: '客服Email' },
      { token: '{{system.supportPhone}}', label: '客服電話' },
      { token: '{{system.unsubscribeUrl}}', label: '退訂連結' },
      { token: '{{system.currentYear}}', label: '西元年' },
    ],
  }
}

export function buildSampleContext() {
  const now = new Date()
  const pad = (n) => n.toString().padStart(2, '0')
  return {
    user: { id: 'U-9001', name: '小明', email: 'user@example.com', phone: '0912-345-678' },
    order: {
      id: 'O-1001',
      total: 1680,
      createdAt: `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`,
      status: '已付款',
      itemCount: 2,
      currency: 'TWD',
      shippingFee: 60,
      discountTotal: 100,
      grandTotal: 1640,
      note: '感謝您的購買',
    },
    product: {
      title: '優雅白色連衣裙',
      sku: 'SKU-001',
      variant: 'M/白色',
      price: 1680,
      url: 'https://shop.example.com/p/SKU-001',
      imageUrl: 'https://picsum.photos/seed/dress/400/300',
    },
    payment: {
      amount: 1680,
      method: 'CreditCard',
      status: 'paid',
      deadline: `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate()+2)}`,
      last4: '4242',
      gateway: 'ECPay',
    },
    logistics: {
      trackingNo: 'T-778899',
      carrier: '黑貓',
      status: 'in_transit',
      etaDate: `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate()+3)}`,
      receiverName: '小明',
      receiverPhone: '0912-345-678',
      address: {
        full: '台北市大安區仁愛路四段100號8樓',
        city: '台北市',
        district: '大安區',
        zip: '106',
      },
      trackingUrl: 'https://track.example.com/T-778899',
      storeId: '000123',
      storeName: '7-ELEVEN 大安門市',
      pickupCode: 'A1B2C3',
    },
    coupon: {
      code: 'WELCOME100',
      expireDate: `${now.getFullYear()}-${pad(now.getMonth()+2)}-15`,
      discountPercent: 10,
      discountAmount: 100,
      minSpend: 1000,
      url: 'https://shop.example.com/coupon/WELCOME100',
    },
    campaign: {
      name: '秋季特賣',
      startDate: `${now.getFullYear()}-${pad(now.getMonth()+1)}-01`,
      endDate: `${now.getFullYear()}-${pad(now.getMonth()+1)}-30`,
      url: 'https://shop.example.com/campaigns/fall-sale',
    },
    system: {
      date: `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`,
      time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      siteName: 'Marelle',
      siteUrl: 'https://www.marelle.tw',
      supportEmail: 'support@marelle.tw',
      supportPhone: '02-1234-5678',
      unsubscribeUrl: 'https://www.marelle.tw/unsubscribe',
      currentYear: now.getFullYear(),
    },
  }
}

export function renderTemplateWithContext(tpl, ctx) {
  return String(tpl || '').replace(/\{\{\s*([\w.]+)\s*\}\}/g,(_,k)=>{
    return k.split('.').reduce((p,c)=>p&&p[c], ctx) ?? ''
  })
}
