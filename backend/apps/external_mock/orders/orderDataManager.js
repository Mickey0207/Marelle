// Minimal orders mock for OrderList page

const _orders = Array.from({ length: 28 }).map((_, i) => {
  const id = `ORD-${1000 + i}`
  const customerName = ['張小明','李小美','王先生','陳小姐','林大哥'][i % 5]
  const items = Math.floor(Math.random()*5)+1
  const amount = Math.floor(Math.random()*5000)+1000
  const status = ['pending','processing','shipped','delivered','cancelled'][i % 5]
  const date = new Date(Date.now() - i*86400000).toISOString().slice(0,10)
  // 提供 UI 期望的欄位別名，避免 undefined 導致 toLocaleString 錯誤
  return {
    id,
    customerName,
    customerEmail: `user${i+1}@example.com`,
    items,
    amount,
    status,
    date,
    // UI 期望欄位
    itemCount: items,
    totalAmount: amount,
    createdAt: date,
  }
})

export default {
  async getAllOrders() {
    await new Promise(r => setTimeout(r, 80))
    return [..._orders]
  },
  async getOrderStatistics() {
    await new Promise(r => setTimeout(r, 50))
    const totalOrders = _orders.length
    const statusDistribution = _orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status]||0)+1
      return acc
    }, { pending:0, processing:0, shipped:0, delivered:0, cancelled:0 })
    return { totalOrders, statusDistribution }
  },
  deleteOrder(id) {
    const idx = _orders.findIndex(o => o.id === id)
    if (idx === -1) return { success:false, error:'Not found' }
    _orders.splice(idx,1)
    return { success:true }
  }
}
