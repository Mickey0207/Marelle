// Build inventory rows from products mock, supporting multi-warehouse view
import { mockProducts } from '../products/mockProductData'

const DEFAULT_WAREHOUSES = ['台北一倉', '新北二倉']

export function buildInventoryFromProducts(warehouse = '*') {
  const rows = []
  for (const p of mockProducts) {
    const variants = Array.isArray(p.skuVariants) ? p.skuVariants : []
    const warehouses = warehouse === '*' ? DEFAULT_WAREHOUSES : [warehouse]
    for (const w of warehouses) {
      for (const v of variants) {
        const currentStock = Math.floor(Math.random()*50) - 5 // allow negative for presale
        const avgCost = Math.floor((p.price || 500) * (0.5 + Math.random()*0.3))
        rows.push({
          warehouse: w,
          productId: p.id,
          baseSKU: p.baseSKU,
          name: p.name,
          category: p.category,
          categoryId: p.categoryId,
          productImageUrl: p.image,
          sku: v.sku,
          spec: v.spec,
          barcode: v.barcode,
          currentStock,
          safeStock: 10,
          avgCost,
          totalValue: currentStock * avgCost,
          status: currentStock < 0 ? 'presale' : (currentStock < 10 ? 'low' : 'normal'),
        })
      }
    }
  }
  return rows
}

export function getInventoryFilters(rows) {
  const warehouses = Array.from(new Set(rows.map(r => r.warehouse))).sort()
  return { warehouses }
}
