let _list = [
  { id:'FES-1', name:'雙11活動', type:'traditional', status:'planning', startDate:'2025-11-01', endDate:'2025-11-11', description:'雙11特賣', bannerImage:'', themeColor:'#ff6b6b', targetProducts:[], promotionSettings:{ discountType:'percentage', discountValue:10, freeShipping:false, giftThreshold:0, giftItems:[] } },
]

const types = [
  { value: 'traditional', label: '傳統節慶' },
  { value: 'western', label: '西洋節日' },
  { value: 'custom', label: '自訂活動' },
]
const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'planning', label: '規劃中' },
  { value: 'active', label: '進行中' },
  { value: 'ended', label: '已結束' },
]
const productCategories = [
  { value: 'apparel', label: '服飾' },
  { value: 'accessories', label: '配件' },
  { value: 'jewelry', label: '珠寶' },
]

export default {
  getFestivalTypes() { return types },
  getStatusOptions() { return statusOptions },
  getProductCategories() { return productCategories },
  getAllFestivals() { return _list.map(f=>({ ...f })) },
  createFestival(input) {
    const id = `FES-${Date.now()}`
    const item = { id, ...input }
    _list.unshift(item)
    return item
  },
  updateFestival(id, patch) {
    const idx = _list.findIndex(f=>f.id===id)
    if (idx === -1) return null
    _list[idx] = { ..._list[idx], ...patch }
    return _list[idx]
  },
  deleteFestival(id) {
    _list = _list.filter(f=>f.id!==id)
    return true
  },
}
