// 提供變數類別（供 Tabs 與選單使用）
export const VARIABLE_CATEGORIES = [
  { key: 'user', label: '使用者' },
  { key: 'order', label: '訂單' },
  { key: 'product', label: '商品' },
  { key: 'payment', label: '付款' },
  { key: 'logistics', label: '物流' },
  { key: 'system', label: '系統' },
]

// 回傳物件：{ categoryKey: Array<{ token,label,desc? }> }
export function getVariableCatalog() {
  return {
    user: [
      { token: '{{user.name}}', label: '使用者名稱' },
      { token: '{{user.email}}', label: 'Email' },
    ],
    order: [
      { token: '{{order.id}}', label: '訂單編號' },
      { token: '{{order.total}}', label: '訂單金額' },
      { token: '{{order.createdAt}}', label: '下單時間' },
    ],
    product: [
      { token: '{{product.title}}', label: '商品名稱' },
      { token: '{{product.sku}}', label: 'SKU' },
    ],
    payment: [
      { token: '{{payment.amount}}', label: '付款金額' },
      { token: '{{payment.method}}', label: '付款方式' },
    ],
    logistics: [
      { token: '{{logistics.trackingNo}}', label: '物流編號' },
      { token: '{{logistics.carrier}}', label: '物流業者' },
    ],
    system: [
      { token: '{{system.date}}', label: '日期' },
      { token: '{{system.time}}', label: '時間' },
    ],
  }
}

export function buildSampleContext() {
  const now = new Date()
  const pad = (n) => n.toString().padStart(2, '0')
  return {
    user: { name: '小明', email: 'user@example.com' },
    order: { id: 'O-1001', total: 1680, createdAt: `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}` },
    product: { title: '優雅白色連衣裙', sku: 'SKU-001' },
    payment: { amount: 1680, method: 'CreditCard' },
    logistics: { trackingNo: 'T-778899', carrier: '黑貓' },
    system: { date: `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`, time: `${pad(now.getHours())}:${pad(now.getMinutes())}` },
  }
}

export function renderTemplateWithContext(tpl, ctx) {
  return String(tpl || '').replace(/\{\{\s*([\w.]+)\s*\}\}/g,(_,k)=>{
    return k.split('.').reduce((p,c)=>p&&p[c], ctx) ?? ''
  })
}
