function genGifts() {
  return Array.from({ length: 10 }).map((_, i) => ({ id: `GF-${i+1}`, name: `贈品${i+1}`, stock: Math.max(0, 100 - i*7), status: ['active','out_of_stock','inactive'][i%3] }))
}

export default {
  async getGifts() { return { success: true, data: genGifts() } },
  async getGiftStatistics() {
    const list = genGifts()
    const totalGifts = list.length
    const activeGifts = list.filter(g=>g.status==='active').length
    const outOfStock = list.filter(g=>g.status==='out_of_stock' || g.stock===0).length
    const totalValue = list.reduce((s,g)=>s+g.stock,0)
    return { success: true, data: { totalGifts, activeGifts, outOfStock, totalValue } }
  },
  async deleteGift(id) { return { success: true } },
  getAllGifts() { return genGifts() },
}
