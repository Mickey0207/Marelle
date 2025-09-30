// Minimal procurement orders mock

const statuses = ['draft','pending','approved','confirmed','production','shipped','delivered','completed','cancelled']
const priorities = ['low','normal','high','urgent','critical']

const _orders = Array.from({ length: 36 }).map((_, i) => ({
  id: `PO-${2000+i}`,
  supplierId: `SUP-${1000+(i%12)}`,
  supplierName: `示範供應商 ${(i%12)+1}`,
  status: statuses[i % statuses.length],
  priority: priorities[i % priorities.length],
  totalAmount: Math.floor(Math.random()*500000)+50000,
  expectedDeliveryDate: new Date(Date.now()+ (i%10)*86400000).toISOString().slice(0,10),
  createdAt: new Date(Date.now()- i*86400000).toISOString().slice(0,10),
  notes: '',
}))

export const procurementDataManager = {
  getPurchaseOrders(params = {}) {
    const { status, search } = params
    let list = [..._orders]
    if (status) list = list.filter(o => o.status === status)
    if (search) {
      const s = String(search).toLowerCase()
      list = list.filter(o => String(o.id).toLowerCase().includes(s) || String(o.supplierName).toLowerCase().includes(s))
    }
    return list
  }
}
