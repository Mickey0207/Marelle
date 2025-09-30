// Minimal member orders/refunds mock

function buildOrders(memberId) {
  return Array.from({ length: Math.floor(Math.random()*6)+2 }).map((_, i) => ({
    id: `${memberId}-ORD-${i+1}`,
    date: new Date(Date.now() - i*86400000).toISOString().slice(0,10),
    items: Math.floor(Math.random()*4)+1,
    amount: Math.floor(Math.random()*4000)+500,
    status: ['pending','processing','shipped','delivered'][i % 4],
  }))
}

function buildRefunds(memberId) {
  return Array.from({ length: Math.floor(Math.random()*3) }).map((_, i) => ({
    id: `${memberId}-RF-${i+1}`,
    date: new Date(Date.now() - i*172800000).toISOString().slice(0,10),
    amount: Math.floor(Math.random()*2000)+200,
    status: ['requested','approved','rejected'][i % 3],
  }))
}

export default {
  async getOrdersByMember(memberId) {
    await new Promise(r => setTimeout(r, 60))
    return { success: true, data: buildOrders(memberId) }
  },
  async getRefundsByMember(memberId) {
    await new Promise(r => setTimeout(r, 60))
    return { success: true, data: buildRefunds(memberId) }
  }
}
