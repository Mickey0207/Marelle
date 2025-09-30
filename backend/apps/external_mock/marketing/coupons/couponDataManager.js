function genList() {
  const now = Date.now()
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `CP-${i+1}`,
    name: `折扣券${i+1}`,
    code: `CODE${1000+i}`,
    type: ['percentage','fixed_amount','free_shipping'][i % 3],
    discountValue: i % 3 === 0 ? 10 : i % 3 === 1 ? 100 : 0,
    status: ['active','inactive','expired'][i % 3],
    usageCount: Math.floor(Math.random()*200),
    validTo: new Date(now + (i+1)*86400000).toISOString().slice(0,10),
  }))
}

export default {
  getCouponList() { return { success: true, data: genList() } },
  getAllCoupons() { return genList() },
}
