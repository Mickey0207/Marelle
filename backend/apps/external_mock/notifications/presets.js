export function getPresetOptions() {
  return [
    { key: 'order_shipped', label: '出貨通知' },
    { key: 'order_paid', label: '付款成功' },
  ]
}
export function getPresetContext(key) {
  const base = { user: { name: '小明' }, order: { id: 'O-1001' } }
  if (key === 'order_shipped') return { ...base, logistics: { trackingNo: 'T-778899' } }
  if (key === 'order_paid') return { ...base, payment: { amount: 1234 } }
  return base
}
