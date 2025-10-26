import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>({ strict: false })

app.use('*', cors({
  origin: (origin) => origin || '*',
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'OPTIONS'],
  maxAge: 86400
}))

function svc(c: any) {
  const url = c.env.SUPABASE_URL
  const key = c.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Server misconfigured')
  return createClient(url, key, { auth: { persistSession: false } })
}

// Helper: get transparent 1x1 png
const transparentPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='

// GET /frontend/products
// Query params:
// - category: optional string like "c-m/tops" (last slug used to match)
// - q: search keyword (name/slug ilike)
// - limit, offset
app.get('/frontend/products', async (c) => {
  try {
    const s = svc(c)
    const catPath = c.req.query('category') || ''
    const q = c.req.query('q') || ''
    const limit = Math.min(parseInt(c.req.query('limit') || '40', 10), 100)
    const offset = Math.max(parseInt(c.req.query('offset') || '0', 10), 0)

    // Find category id by last slug (support both cetegory and product_categories tables)
    let categoryId: number | null = null
    if (catPath) {
      const parts = catPath.split('/').filter(Boolean)
      const last = parts[parts.length - 1]
      // Try typo table first to align with existing data
      let { data: cat1 } = await s
        .from('backend_products_cetegory')
        .select('id')
        .eq('slug', last)
        .maybeSingle()
      if (cat1?.id) categoryId = Number(cat1.id)
      if (!categoryId) {
        const { data: cat2 } = await s
          .from('backend_product_categories')
          .select('id')
          .eq('slug', last)
          .maybeSingle()
        if (cat2?.id) categoryId = Number(cat2.id)
      }
    }

    // Base query to products table (newer schema with name/slug). If not available columns, fallback aliases.
    // We read generic columns used by backend API as well.
    let query = s
      .from('backend_products')
      .select('id, name, slug, has_variants, base_sku, visibility, tags, promotion_label, promotion_label_bg_color, promotion_label_text_color, product_tag_bg_color, product_tag_text_color, auto_hide_when_oos, enable_preorder, preorder_start_at, preorder_end_at, preorder_max_qty')
      .eq('visibility', 'visible')

    // Filter by category if possible: support either category_ids array or category_id single
    if (categoryId) {
      query = query.or(`category_ids.cs.{${categoryId}},category_id.eq.${categoryId}`)
    }
    if (q) {
      const term = `%${q}%`
      query = query.or(`name.ilike.${term},slug.ilike.${term}`)
    }

    const { data: products, error } = await query
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) return c.json({ error: 'Failed to list products' }, 500)

    const ids = (products || []).map(p => p.id)
  if (ids.length === 0) return c.json({ items: [] })

    // Fetch photos (primary only)
    const { data: photos } = await s
      .from('backend_products_photo')
      .select('product_id, photo_url_1')
      .in('product_id', ids)

    // Fetch inventory and prices for availability and price range
    const [{ data: inventory }, { data: prices }] = await Promise.all([
      s.from('backend_products_inventory').select('product_id, current_stock_qty, low_stock_threshold').in('product_id', ids),
      s.from('backend_products_prices').select('product_id, sku_key, sale_price, compare_at_price').in('product_id', ids)
    ])

    const photoMap = new Map<number, string>()
    ;(photos || []).forEach(p => photoMap.set(Number(p.product_id), p.photo_url_1 || ''))

    const invByProduct = new Map<number, any[]>()
    ;(inventory || []).forEach(iv => {
      const pid = Number(iv.product_id)
      if (!invByProduct.has(pid)) invByProduct.set(pid, [])
      invByProduct.get(pid)!.push(iv)
    })

    const priceByProduct = new Map<number, any[]>()
    ;(prices || []).forEach(pr => {
      const pid = Number(pr.product_id)
      if (!priceByProduct.has(pid)) priceByProduct.set(pid, [])
      priceByProduct.get(pid)!.push(pr)
    })

    const now = new Date()
    const items = (products || []).map((p: any) => {
      const pid = Number(p.id)
      const pPrices = priceByProduct.get(pid) || []
      // prefer base (sku_key null) else min over variants
      const base = pPrices.find(x => !x.sku_key)
      const sale = base?.sale_price ?? (pPrices.length ? Math.min(...pPrices.filter(x=>x.sale_price!=null).map(x=>Number(x.sale_price))) : null)
      const compare = base?.compare_at_price ?? (pPrices.length ? Math.max(...pPrices.filter(x=>x.compare_at_price!=null).map(x=>Number(x.compare_at_price))) : null)
      const image = photoMap.get(pid) || transparentPng
      const inv = invByProduct.get(pid) || []
      const inStock = inv.some(x => (Number(x.current_stock_qty) || 0) > 0)
      const allBelowLow = inv.length > 0 && inv.every(x => (Number(x.current_stock_qty) || 0) <= (Number(x.low_stock_threshold) || 0))
      const preorderEnabled = !!p.enable_preorder
      const startOk = p.preorder_start_at ? (now >= new Date(p.preorder_start_at)) : true
      const endOk = p.preorder_end_at ? (now <= new Date(p.preorder_end_at)) : true
      const preorderActive = preorderEnabled && startOk && endOk
      const preorderEnded = preorderEnabled && (!startOk || !endOk)
      const autoHide = !!p.auto_hide_when_oos
      const forceSoldOutTag = !preorderActive && allBelowLow
      return {
        id: pid,
        name: p.name || p.title || p.slug,
        slug: p.slug || p.route_slug,
        href: `/product/${p.slug || p.route_slug}`,
        image,
        price: sale ?? 0,
        originalPrice: compare || null,
        inStock,
        visibility: p.visibility || 'visible',
        // new label/color fields for overlays
        tags: Array.isArray(p.tags) ? p.tags : [],
        promotionLabel: p.promotion_label || null,
        promotionLabelBgColor: p.promotion_label_bg_color || null,
        promotionLabelTextColor: p.promotion_label_text_color || null,
        productTagBgColor: p.product_tag_bg_color || null,
        productTagTextColor: p.product_tag_text_color || null,
        // helper flags for UI
        isLowStock: allBelowLow,
        autoHideWhenOOS: autoHide,
        preorderEnabled,
        preorderActive,
        preorderEnded,
        preorderStartAt: p.preorder_start_at || null,
        preorderEndAt: p.preorder_end_at || null,
        preorderMaxQty: p.preorder_max_qty || null,
        forceSoldOutTag
      }
    })

    return c.json({ items })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

export default app
 
// =============== Product detail ===============
// GET /frontend/products/:slugOrId
// Returns product base info, photos, variant tree (up to 5 levels), and pricing
app.get('/frontend/products/:slugOrId', async (c) => {
  try {
    const s = svc(c)
    const slugOrId = c.req.param('slugOrId')
    const isNumeric = /^\d+$/.test(slugOrId)

  // 1) Find the product
    let product: any = null
    if (isNumeric) {
      const { data } = await s.from('backend_products')
        .select('id, name, slug, description, has_variants, base_sku, category_ids, visibility, tags, promotion_label, promotion_label_bg_color, promotion_label_text_color, product_tag_bg_color, product_tag_text_color, auto_hide_when_oos, enable_preorder, preorder_start_at, preorder_end_at, preorder_max_qty')
        .eq('id', Number(slugOrId)).maybeSingle()
      product = data
    } else {
      const { data } = await s.from('backend_products')
        .select('id, name, slug, description, has_variants, base_sku, category_ids, visibility, tags, promotion_label, promotion_label_bg_color, promotion_label_text_color, product_tag_bg_color, product_tag_text_color, auto_hide_when_oos, enable_preorder, preorder_start_at, preorder_end_at, preorder_max_qty')
        .eq('slug', slugOrId).maybeSingle()
      product = data
    }
    if (!product) return c.json({ error: 'Not found' }, 404)

    // Respect visibility
    if ((product as any).visibility && (product as any).visibility !== 'visible') {
      return c.json({ error: 'Not found' }, 404)
    }

    const pid = Number(product.id)

    // 2) Photos: product-level photos row (inventory_id is NULL)
    // Newer schema: one row per product with photo_url_1..photo_url_10
    const { data: photoRows } = await s
      .from('backend_products_photo')
      .select('id, inventory_id, photo_url_1, photo_url_2, photo_url_3, photo_url_4, photo_url_5, photo_url_6, photo_url_7, photo_url_8, photo_url_9, photo_url_10, variant_photo_url_1, variant_photo_url_2, variant_photo_url_3')
      .eq('product_id', pid)
    const productPhotoRow = (photoRows || []).find(r => !r.inventory_id) || null
    const productImages: string[] = []
    if (productPhotoRow) {
      for (let i = 1; i <= 10; i++) {
        const url = (productPhotoRow as any)[`photo_url_${i}`]
        if (url) productImages.push(url)
      }
    }
    if (productImages.length === 0) productImages.push(transparentPng)

    // 3) Inventory variants (sku rows). We support up to 5 levels
    const { data: invRows } = await s
      .from('backend_products_inventory')
      .select('id, product_id, sku_key, current_stock_qty, low_stock_threshold, sku_level_1, sku_level_1_name, sku_level_2, sku_level_2_name, sku_level_3, sku_level_3_name, sku_level_4, sku_level_4_name, sku_level_5, sku_level_5_name, spec_level_1_name, spec_level_2_name, spec_level_3_name, spec_level_4_name, spec_level_5_name, variant_photo_url_1, variant_photo_url_2, variant_photo_url_3')
      .eq('product_id', pid)

    // 4) Prices (per product and per variant)
    const { data: priceRows } = await s
      .from('backend_products_prices')
      .select('product_id, sku_key, sale_price, compare_at_price')
      .eq('product_id', pid)

    const priceBySku = new Map<string, { sale: number|null, compare: number|null }>()
    ;(priceRows || []).forEach(pr => {
      const key = String(pr.sku_key || '')
      priceBySku.set(key, {
        sale: pr.sale_price != null ? Number(pr.sale_price) : null,
        compare: pr.compare_at_price != null ? Number(pr.compare_at_price) : null
      })
    })

    // Helper: compute min price across rows
    function minPrice(): number | null {
      const vals: number[] = []
      ;(priceRows || []).forEach(pr => {
        if (pr.sale_price != null) vals.push(Number(pr.sale_price))
      })
      if (vals.length === 0) return null
      return Math.min(...vals)
    }

    // 5) Build variant tree (if any rows contain sku_key)
    const skuRows = (invRows || []).filter(r => r.sku_key && String(r.sku_key).trim() !== '')

    // Derive dimension labels from first row having them
    const dimLabels: (string|undefined)[] = [
      skuRows.find(r => r.spec_level_1_name)?.spec_level_1_name,
      skuRows.find(r => r.spec_level_2_name)?.spec_level_2_name,
      skuRows.find(r => r.spec_level_3_name)?.spec_level_3_name,
      skuRows.find(r => r.spec_level_4_name)?.spec_level_4_name,
      skuRows.find(r => r.spec_level_5_name)?.spec_level_5_name,
    ]

    // Map inventory_id -> variant-level photos if present in photo table rows
    const variantPhotosByInv = new Map<number, string[]>()
    ;(photoRows || []).filter(r => r.inventory_id).forEach(r => {
      const arr: string[] = []
      for (let i = 1; i <= 3; i++) {
        const u = (r as any)[`variant_photo_url_${i}`]
        if (u) arr.push(u)
      }
      variantPhotosByInv.set(Number(r.inventory_id), arr)
    })

    // Build nested structure
    type VariantNode = { id: string, label: string, children?: VariantNode[], payload?: any }
    const root: VariantNode[] = []

    function ensureChild(list: VariantNode[], id: string, label: string): VariantNode {
      let node = list.find(n => n.id === id)
      if (!node) { node = { id, label, children: [] }; list.push(node) }
      return node
    }

    for (const r of skuRows) {
      const levels = [r.sku_level_1_name, r.sku_level_2_name, r.sku_level_3_name, r.sku_level_4_name, r.sku_level_5_name].filter(v => v != null && String(v).trim() !== '')
      if (levels.length === 0) continue
      let curr = root
      let parent: VariantNode | undefined
      levels.forEach((lvlLabel: any, idx: number) => {
        const nodeId = `${idx}-${String(lvlLabel)}`
        const node = ensureChild(curr, nodeId, String(lvlLabel))
        parent = node
        if (idx < levels.length - 1) {
          if (!node.children) node.children = []
          curr = node.children
        }
      })
      // Leaf payload with sku, stock, price and image
      const pr = priceBySku.get(String(r.sku_key)) || priceBySku.get('') || { sale: null, compare: null }
      const variantImages: string[] = []
      // Prefer inventory-level variant photos if present
      for (let i = 1; i <= 3; i++) {
        const u = (r as any)[`variant_photo_url_${i}`]
        if (u) variantImages.push(u)
      }
      // Or photos table rows bound to this inventory id
      const extra = variantPhotosByInv.get(Number(r.id)) || []
      extra.forEach(u => { if (!variantImages.includes(u)) variantImages.push(u) })
      const leafPayload = {
        sku: r.sku_key,
        stock: Number(r.current_stock_qty) || 0,
        price: pr.sale != null ? pr.sale : null,
        compareAt: pr.compare != null ? pr.compare : null,
        image: variantImages[0] || productImages[0] || transparentPng,
      }
      if (parent) {
        // For leaves, represent as child-less node with payload
        delete parent.children
        parent.payload = leafPayload
      }
    }

    // If no variants, try to provide base price and stock
    let basePrice = priceBySku.get('')?.sale ?? null
    let baseCompare = priceBySku.get('')?.compare ?? null
  const inStockAny = (invRows || []).some(r => (Number(r.current_stock_qty) || 0) > 0)
  const allBelowLow = (invRows || []).length > 0 && (invRows || []).every(r => (Number(r.current_stock_qty) || 0) <= (Number(r.low_stock_threshold) || 0))
  const now2 = new Date()
  const preorderEnabled = !!product.enable_preorder
  const startOk = product.preorder_start_at ? (now2 >= new Date(product.preorder_start_at)) : true
  const endOk = product.preorder_end_at ? (now2 <= new Date(product.preorder_end_at)) : true
  const preorderActive = preorderEnabled && startOk && endOk
  const preorderEnded = preorderEnabled && (!startOk || !endOk)
    const minP = minPrice()
    const effectivePrice = basePrice != null ? basePrice : (minP != null ? minP : 0)

    // Response
    return c.json({
      id: pid,
      name: product.name,
      slug: product.slug,
      description: product.description,
      tags: product.tags || [],
      promotionLabel: product.promotion_label || null,
      promotionLabelBgColor: product.promotion_label_bg_color || null,
      promotionLabelTextColor: product.promotion_label_text_color || null,
      productTagBgColor: product.product_tag_bg_color || null,
      productTagTextColor: product.product_tag_text_color || null,
      images: productImages.length ? productImages : [transparentPng],
      variants: root,
      specsLabels: dimLabels.filter(Boolean),
      price: effectivePrice,
      originalPrice: baseCompare,
      inStock: inStockAny,
      isLowStock: allBelowLow,
      autoHideWhenOOS: !!product.auto_hide_when_oos,
      preorderEnabled,
      preorderActive,
      preorderEnded,
      preorderStartAt: product.preorder_start_at || null,
      preorderEndAt: product.preorder_end_at || null,
      preorderMaxQty: product.preorder_max_qty || null,
    })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})
