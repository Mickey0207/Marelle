import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { createClient } from '@supabase/supabase-js'

const app = new Hono<{ Bindings: {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  ADMIN_SESSION_SECRET?: string
} }>()

const ACCESS_COOKIE = 'sb-access-token'
const ADMIN_SESSION_COOKIE = 'admin-session'

function makeSvc(c: any) {
  const url = c.env.SUPABASE_URL
  const key = c.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Server misconfigured')
  return createClient(url, key, { auth: { persistSession: false } })
}

async function requireAuth(c: any) {
  const access = getCookie(c, ACCESS_COOKIE)
  if (access) return true
  const sess = getCookie(c, ADMIN_SESSION_COOKIE)
  return !!sess
}

// GET /backend/products - List all products with filtering
app.get('/backend/products', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const svc = makeSvc(c)
    const status = c.req.query('status')
    const visibility = c.req.query('visibility')
    const search = c.req.query('search')

    let query = svc.from('backend_products').select(
      `id, name, slug, short_description, status, visibility, is_featured, 
       base_sku, has_variants, tags, category_ids, created_at, updated_at`
    )

    if (status) query = query.eq('status', status)
    if (visibility) query = query.eq('visibility', visibility)
    if (search) {
      const searchTerm = `%${search}%`
      query = query.or(`name.ilike.${searchTerm},slug.ilike.${searchTerm}`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) return c.json({ error: 'Failed to list products' }, 500)
    return c.json(data || [])
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// GET /backend/products/:id - Get product with all related data
app.get('/backend/products/:id', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const svc = makeSvc(c)

    // Fetch product
    const { data: product, error: prodErr } = await svc
      .from('backend_products')
      .select('*')
      .eq('id', id)
      .single()

    if (prodErr || !product) return c.json({ error: 'Product not found' }, 404)

    // Fetch product-level photos (inventory_id IS NULL)
    const { data: photos } = await svc
      .from('backend_products_photo')
      .select('photo_url_1, photo_url_2, photo_url_3, photo_url_4, photo_url_5, photo_url_6, photo_url_7, photo_url_8, photo_url_9, photo_url_10')
      .eq('product_id', id)
      .is('inventory_id', null)
      .maybeSingle()


    // Fetch SEO
    const { data: seo } = await svc
      .from('backend_products_seo')
      .select('*')
      .eq('product_id', id)
      .single()

    // Fetch inventory records
    const { data: inventory } = await svc
      .from('backend_products_inventory')
      .select('*')
      .eq('product_id', id)

    // Fetch prices records
    const { data: prices } = await svc
      .from('backend_products_prices')
      .select('*')
      .eq('product_id', id)

    // Compute variant-level photos from inventory columns (for backward compatibility response)
    const variantPhotos = (inventory || []).map((inv: any) => ({
      inventory_id: inv.id,
      variant_photo_url_1: inv.variant_photo_url_1 ?? null,
      variant_photo_url_2: inv.variant_photo_url_2 ?? null,
      variant_photo_url_3: inv.variant_photo_url_3 ?? null
    }))

    return c.json({
      ...product,
      photos: photos || [],
      variant_photos: variantPhotos || [],
      seo: seo || null,
      inventory: inventory || [],
      prices: prices || []
    })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /backend/products - Create new product
app.post('/backend/products', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const body = await c.req.json()
    const svc = makeSvc(c)

    // Validate required fields
    if (!body.name || !body.slug || !body.description || !body.base_sku) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Create product
    const { data: product, error: prodErr } = await svc
      .from('backend_products')
      .insert({
        name: body.name,
        slug: body.slug,
        short_description: body.short_description || null,
        description: body.description,
        tags: body.tags || [],
        base_sku: body.base_sku,
        has_variants: body.has_variants || false,
        status: body.status || 'draft',
        visibility: body.visibility || 'visible',
        is_featured: body.is_featured || false,
        category_ids: body.category_ids || []
      })
      .select()
      .single()

    if (prodErr) return c.json({ error: 'Failed to create product' }, 500)

    // Ensure SEO record exists (insert a row even if fields are mostly null)
    if (product.id) {
      const seoRow = {
        product_id: product.id,
        meta_title: body.meta_title ?? null,
        meta_description: body.meta_description ?? null,
        sitemap_indexing: body.sitemap_indexing !== false,
        custom_canonical_url: body.custom_canonical_url ?? null,
        og_title: body.og_title ?? null,
        og_description: body.og_description ?? null,
        og_image_url: body.og_image_url ?? null,
        use_meta_title_for_og: body.use_meta_title_for_og !== false,
        use_meta_description_for_og: body.use_meta_description_for_og !== false,
        search_title: body.search_title ?? null,
        search_description: body.search_description ?? null,
        search_image_url: body.search_image_url ?? null,
        use_meta_title_for_search: body.use_meta_title_for_search !== false,
        use_meta_description_for_search: body.use_meta_description_for_search !== false,
        use_og_image_for_search: body.use_og_image_for_search !== false,
        exclude_from_search: body.exclude_from_search || false
      }
      // Try insert; if unique constraint on product_id prevents, fall back to update
      try {
        await svc.from('backend_products_seo').insert(seoRow).select().single()
      } catch (_e) {
        await svc.from('backend_products_seo').update(seoRow).eq('product_id', product.id)
      }
    }

    return c.json(product)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// PATCH /backend/products/:id - Update product
app.patch('/backend/products/:id', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const svc = makeSvc(c)

    const allowed: any = {}
    if (typeof body.name === 'string') allowed.name = body.name
    if (typeof body.slug === 'string') allowed.slug = body.slug
    if (typeof body.description === 'string') allowed.description = body.description
    if (typeof body.short_description === 'string') allowed.short_description = body.short_description
    if (Array.isArray(body.tags)) allowed.tags = body.tags
    if (typeof body.status === 'string') allowed.status = body.status
    if (typeof body.visibility === 'string') allowed.visibility = body.visibility
  if (typeof body.is_featured === 'boolean') allowed.is_featured = body.is_featured
    if (typeof body.has_variants === 'boolean') allowed.has_variants = body.has_variants
  if (typeof body.base_sku === 'string') allowed.base_sku = body.base_sku
    if (Array.isArray(body.category_ids)) allowed.category_ids = body.category_ids

    if (Object.keys(allowed).length === 0) return c.json({ error: 'No fields to update' }, 400)

    const { data, error } = await svc
      .from('backend_products')
      .update(allowed)
      .eq('id', id)
      .select()
      .single()

    if (error) return c.json({ error: 'Update failed' }, 500)

  // Update or create SEO if provided
    if (
      body.meta_title !== undefined ||
      body.meta_description !== undefined ||
      body.open_graph_title !== undefined || body.og_title !== undefined ||
      body.open_graph_description !== undefined || body.og_description !== undefined ||
      body.open_graph_image !== undefined || body.og_image_url !== undefined ||
      body.search_title !== undefined || body.search_description !== undefined ||
      body.search_image !== undefined || body.search_image_url !== undefined ||
      body.sitemap_indexing !== undefined || body.custom_canonical_url !== undefined ||
      body.use_meta_title_for_og !== undefined || body.use_meta_description_for_og !== undefined ||
      body.use_meta_title_for_search !== undefined || body.use_meta_description_for_search !== undefined ||
      body.use_og_image_for_search !== undefined || body.exclude_from_search !== undefined
    ) {
      const seoUpdate: any = {}
      if (typeof body.meta_title === 'string') seoUpdate.meta_title = body.meta_title
      if (typeof body.meta_description === 'string') seoUpdate.meta_description = body.meta_description
      // Accept both open_graph_title and og_title
      if (typeof body.open_graph_title === 'string') seoUpdate.og_title = body.open_graph_title
      if (typeof body.og_title === 'string') seoUpdate.og_title = body.og_title
      if (typeof body.open_graph_description === 'string') seoUpdate.og_description = body.open_graph_description
      if (typeof body.og_description === 'string') seoUpdate.og_description = body.og_description
      if (typeof body.open_graph_image === 'string') seoUpdate.og_image_url = body.open_graph_image
      if (typeof body.og_image_url === 'string') seoUpdate.og_image_url = body.og_image_url
      if (typeof body.search_title === 'string') seoUpdate.search_title = body.search_title
      if (typeof body.search_description === 'string') seoUpdate.search_description = body.search_description
      if (typeof body.search_image === 'string') seoUpdate.search_image_url = body.search_image
      if (typeof body.search_image_url === 'string') seoUpdate.search_image_url = body.search_image_url
      if (typeof body.sitemap_indexing === 'boolean') seoUpdate.sitemap_indexing = body.sitemap_indexing
      if (typeof body.custom_canonical_url === 'string') seoUpdate.custom_canonical_url = body.custom_canonical_url
      if (typeof body.use_meta_title_for_og === 'boolean') seoUpdate.use_meta_title_for_og = body.use_meta_title_for_og
      if (typeof body.use_meta_description_for_og === 'boolean') seoUpdate.use_meta_description_for_og = body.use_meta_description_for_og
      if (typeof body.use_meta_title_for_search === 'boolean') seoUpdate.use_meta_title_for_search = body.use_meta_title_for_search
      if (typeof body.use_meta_description_for_search === 'boolean') seoUpdate.use_meta_description_for_search = body.use_meta_description_for_search
      if (typeof body.use_og_image_for_search === 'boolean') seoUpdate.use_og_image_for_search = body.use_og_image_for_search
      if (typeof body.exclude_from_search === 'boolean') seoUpdate.exclude_from_search = body.exclude_from_search

      if (Object.keys(seoUpdate).length > 0) {
        // Upsert: ensure the SEO row exists
        const { data: existingSeo } = await svc
          .from('backend_products_seo')
          .select('product_id')
          .eq('product_id', id)
          .maybeSingle()

        if (existingSeo) {
          await svc
            .from('backend_products_seo')
            .update(seoUpdate)
            .eq('product_id', id)
        } else {
          await svc
            .from('backend_products_seo')
            .insert({ product_id: parseInt(id), ...seoUpdate })
        }
      }
    }

    return c.json(data)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// DELETE /backend/products/:id - Delete product and all related data
app.delete('/backend/products/:id', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const svc = makeSvc(c)

    // Delete will cascade to photos, seo, prices, inventory
    const { error } = await svc
      .from('backend_products')
      .delete()
      .eq('id', id)

    if (error) return c.json({ error: 'Delete failed' }, 500)
    return c.json({ ok: true })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /backend/products/:id/photos/batch - Batch upload product photos (all 10 photo URLs)
app.post('/backend/products/:id/photos/batch', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const svc = makeSvc(c)

    // Upload files and get URLs
    const photoUrls: string[] = []
    
    if (body.files && Array.isArray(body.files)) {
      for (let i = 0; i < Math.min(body.files.length, 10); i++) {
        const fileData = body.files[i]
        if (!fileData) continue

        try {
          // Assume fileData is already processed and we have a URL
          // Or if it's a File object, upload it
          if (typeof fileData === 'string') {
            photoUrls.push(fileData)
          } else if (fileData instanceof File) {
            const filename = `${id}-${Date.now()}-${i}-${fileData.name}`
            const { error: uploadErr } = await svc.storage
              .from('products')
              .upload(filename, fileData, { upsert: false })

            if (!uploadErr) {
              const { data: publicUrl } = svc.storage
                .from('products')
                .getPublicUrl(filename)
              photoUrls.push(publicUrl?.publicUrl || '')
            }
          }
        } catch (err) {
          console.error(`Failed to upload photo ${i}:`, err)
        }
      }
    }

    // Create or update backend_products_photo record with 10 photo URL columns
    const updateData: any = {}
    for (let i = 0; i < 10; i++) {
      const colName = `photo_url_${i + 1}`
      updateData[colName] = photoUrls[i] || null
    }

    // Try to get existing record
    const { data: existing } = await svc
      .from('backend_products_photo')
      .select('id')
      .eq('product_id', id)
      .single()

    let result
    if (existing) {
      // Update existing record
      const { data, error } = await svc
        .from('backend_products_photo')
        .update(updateData)
        .eq('product_id', id)
        .select()
        .single()
      result = data
      if (error) return c.json({ error: 'Failed to update photos' }, 500)
    } else {
      // Create new record
      const { data, error } = await svc
        .from('backend_products_photo')
        .insert({
          product_id: parseInt(id),
          ...updateData
        })
        .select()
        .single()
      result = data
      if (error) return c.json({ error: 'Failed to create photo record' }, 500)
    }

    return c.json(result)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// PATCH /backend/products/:id/photos - Update product photos (replace old row-based endpoint)
app.patch('/backend/products/:id/photos', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const svc = makeSvc(c)

    // Support updating individual photo_url_N columns or all at once
    const updateData: any = {}
    for (let i = 1; i <= 10; i++) {
      const colName = `photo_url_${i}`
      if (body[colName] !== undefined) {
        updateData[colName] = body[colName]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return c.json({ error: 'No photo URLs to update' }, 400)
    }

    // Upsert behavior: update if exists, else insert a new record
    const { data: existing, error: existErr } = await svc
      .from('backend_products_photo')
      .select('id')
      .eq('product_id', id)
      .is('inventory_id', null)
      .maybeSingle()

    if (existErr) {
      console.error('Photos existence check failed:', existErr)
    }

    if (existing) {
      const { data, error } = await svc
        .from('backend_products_photo')
        .update(updateData)
        .eq('product_id', id)
        .is('inventory_id', null)
        .select()
        .single()
      if (error) return c.json({ error: 'Update failed' }, 500)
      return c.json(data)
    } else {
      const { data, error } = await svc
        .from('backend_products_photo')
        .insert({ product_id: parseInt(id), inventory_id: null, ...updateData })
        .select()
        .single()
      if (error) return c.json({ error: 'Insert failed' }, 500)
      return c.json(data)
    }
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// ==================== 庫存相關端點 ====================

// GET /backend/products/:productId/inventory - Get all inventory records for a product
app.get('/backend/products/:productId/inventory', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const productId = c.req.param('productId')
    const warehouse = c.req.query('warehouse')
    const svc = makeSvc(c)

    let query = svc
      .from('backend_products_inventory')
      .select('*')
      .eq('product_id', productId)

    if (warehouse) query = query.eq('warehouse', warehouse)

    const { data, error } = await query.order('warehouse', { ascending: true }).order('sku_key', { ascending: true })

    if (error) return c.json({ error: 'Failed to fetch inventory' }, 500)
    return c.json(data || [])
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /backend/products/:productId/inventory - Create inventory record
app.post('/backend/products/:productId/inventory', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const productId = c.req.param('productId')
    const body = await c.req.json()
    const svc = makeSvc(c)

    const { data, error } = await svc
      .from('backend_products_inventory')
      .insert({
        product_id: parseInt(productId),
        sku_key: body.sku_key || null,
        warehouse: body.warehouse || '主倉',
        current_stock_qty: parseInt(body.current_stock_qty) || 0,
        safety_stock_qty: parseInt(body.safety_stock_qty) || 10,
        low_stock_threshold: parseInt(body.low_stock_threshold) || 5,
        track_inventory: body.track_inventory !== false,
        allow_backorder: body.allow_backorder || false,
        allow_preorder: body.allow_preorder || false,
        barcode: body.barcode || null,
        hs_code: body.hs_code || null,
        origin: body.origin || null,
        notes: body.notes || null,
        weight: body.weight ? parseFloat(body.weight) : null,
        length_cm: body.length_cm ? parseFloat(body.length_cm) : null,
        width_cm: body.width_cm ? parseFloat(body.width_cm) : null,
        height_cm: body.height_cm ? parseFloat(body.height_cm) : null,
        sku_level_1: body.sku_level_1 || null,
        sku_level_2: body.sku_level_2 || null,
        sku_level_3: body.sku_level_3 || null,
        sku_level_4: body.sku_level_4 || null,
        sku_level_5: body.sku_level_5 || null,
        sku_level_1_name: body.sku_level_1_name || null,
        sku_level_2_name: body.sku_level_2_name || null,
        sku_level_3_name: body.sku_level_3_name || null,
        sku_level_4_name: body.sku_level_4_name || null,
        sku_level_5_name: body.sku_level_5_name || null,
        spec_level_1_name: body.spec_level_1_name || null,
        spec_level_2_name: body.spec_level_2_name || null,
        spec_level_3_name: body.spec_level_3_name || null,
        spec_level_4_name: body.spec_level_4_name || null,
        spec_level_5_name: body.spec_level_5_name || null
      })
      .select()
      .single()

    if (error) return c.json({ error: 'Failed to create inventory record' }, 500)
    return c.json(data)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// PATCH /backend/products/:productId/inventory/:inventoryId - Update inventory record
app.patch('/backend/products/:productId/inventory/:inventoryId', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const productId = c.req.param('productId')
    const inventoryId = c.req.param('inventoryId')
    const body = await c.req.json()
    const svc = makeSvc(c)

    const allowed: any = {}
    if (typeof body.current_stock_qty === 'number') allowed.current_stock_qty = body.current_stock_qty
    if (typeof body.safety_stock_qty === 'number') allowed.safety_stock_qty = body.safety_stock_qty
    if (typeof body.low_stock_threshold === 'number') allowed.low_stock_threshold = body.low_stock_threshold
    if (typeof body.track_inventory === 'boolean') allowed.track_inventory = body.track_inventory
    if (typeof body.allow_backorder === 'boolean') allowed.allow_backorder = body.allow_backorder
    if (typeof body.allow_preorder === 'boolean') allowed.allow_preorder = body.allow_preorder
    if (typeof body.warehouse === 'string') allowed.warehouse = body.warehouse
    if (body.barcode !== undefined) allowed.barcode = body.barcode || null
    if (body.hs_code !== undefined) allowed.hs_code = body.hs_code || null
    if (body.origin !== undefined) allowed.origin = body.origin || null
    if (body.notes !== undefined) allowed.notes = body.notes || null
    if (body.weight !== undefined) allowed.weight = body.weight ? parseFloat(body.weight) : null
    if (body.length_cm !== undefined) allowed.length_cm = body.length_cm ? parseFloat(body.length_cm) : null
    if (body.width_cm !== undefined) allowed.width_cm = body.width_cm ? parseFloat(body.width_cm) : null
    if (body.height_cm !== undefined) allowed.height_cm = body.height_cm ? parseFloat(body.height_cm) : null
    if (body.sku_level_1 !== undefined) allowed.sku_level_1 = body.sku_level_1 || null
    if (body.sku_level_2 !== undefined) allowed.sku_level_2 = body.sku_level_2 || null
    if (body.sku_level_3 !== undefined) allowed.sku_level_3 = body.sku_level_3 || null
    if (body.sku_level_4 !== undefined) allowed.sku_level_4 = body.sku_level_4 || null
    if (body.sku_level_5 !== undefined) allowed.sku_level_5 = body.sku_level_5 || null
    if (body.sku_level_1_name !== undefined) allowed.sku_level_1_name = body.sku_level_1_name || null
    if (body.sku_level_2_name !== undefined) allowed.sku_level_2_name = body.sku_level_2_name || null
    if (body.sku_level_3_name !== undefined) allowed.sku_level_3_name = body.sku_level_3_name || null
    if (body.sku_level_4_name !== undefined) allowed.sku_level_4_name = body.sku_level_4_name || null
    if (body.sku_level_5_name !== undefined) allowed.sku_level_5_name = body.sku_level_5_name || null
    if (body.spec_level_1_name !== undefined) allowed.spec_level_1_name = body.spec_level_1_name || null
    if (body.spec_level_2_name !== undefined) allowed.spec_level_2_name = body.spec_level_2_name || null
    if (body.spec_level_3_name !== undefined) allowed.spec_level_3_name = body.spec_level_3_name || null
    if (body.spec_level_4_name !== undefined) allowed.spec_level_4_name = body.spec_level_4_name || null
    if (body.spec_level_5_name !== undefined) allowed.spec_level_5_name = body.spec_level_5_name || null
  // Support updating variant photos directly through inventory PATCH as well
  if (body.variant_photo_url_1 !== undefined) allowed.variant_photo_url_1 = body.variant_photo_url_1 || null
  if (body.variant_photo_url_2 !== undefined) allowed.variant_photo_url_2 = body.variant_photo_url_2 || null
  if (body.variant_photo_url_3 !== undefined) allowed.variant_photo_url_3 = body.variant_photo_url_3 || null

    if (Object.keys(allowed).length === 0) return c.json({ error: 'No fields to update' }, 400)

    const { data, error } = await svc
      .from('backend_products_inventory')
      .update(allowed)
      .eq('id', inventoryId)
      .eq('product_id', productId)
      .select()
      .single()

    if (error) return c.json({ error: 'Update failed' }, 500)
    return c.json(data)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// DELETE /backend/products/:productId/inventory/:inventoryId - Delete inventory record
app.delete('/backend/products/:productId/inventory/:inventoryId', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const productId = c.req.param('productId')
    const inventoryId = c.req.param('inventoryId')
    const svc = makeSvc(c)

    // 不再主動刪除 Storage 中的變體圖片，避免編輯保存流程中先刪後建導致圖片遺失
    // 若要清除圖片，請在變體圖片 PATCH 時依 diff 刪除，或提供專門的清除端點

    const { error } = await svc
      .from('backend_products_inventory')
      .delete()
      .eq('id', inventoryId)
      .eq('product_id', productId)

    if (error) return c.json({ error: 'Delete failed' }, 500)
    return c.json({ ok: true })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// ==================== 變體圖片相關端點 ====================

// POST /backend/products/:productId/variant-photos/:inventoryId/upload - upload single photo for a variant, return URL
app.post('/backend/products/:productId/variant-photos/:inventoryId/upload', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const productId = c.req.param('productId')
    const inventoryId = c.req.param('inventoryId')
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    if (!file) return c.json({ error: 'No file provided' }, 400)

    const svc = makeSvc(c)
    const filename = `${productId}-${inventoryId}-${Date.now()}-${file.name}`
    const { error: uploadErr } = await svc.storage
      .from('products-sku')
      .upload(filename, file, { upsert: false })
    if (uploadErr) return c.json({ error: 'Upload failed', details: String((uploadErr as any)?.message || uploadErr) }, 500)
    const { data: publicUrl } = svc.storage
      .from('products-sku')
      .getPublicUrl(filename)
    return c.json({ url: publicUrl?.publicUrl || '' })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// PATCH /backend/products/:productId/variant-photos/:inventoryId - upsert 3 urls, delete removed files from storage
app.patch('/backend/products/:productId/variant-photos/:inventoryId', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const productId = c.req.param('productId')
    const inventoryId = c.req.param('inventoryId')
    const body = await c.req.json()
    const svc = makeSvc(c)
    const pId = parseInt(productId, 10)
    const invId = parseInt(inventoryId, 10)
    if (Number.isNaN(pId) || Number.isNaN(invId)) {
      return c.json({ error: 'Invalid productId or inventoryId' }, 400)
    }

    // Fetch existing inventory row for diff
    const { data: existing } = await svc
      .from('backend_products_inventory')
      .select('id, variant_photo_url_1, variant_photo_url_2, variant_photo_url_3')
      .eq('product_id', pId)
      .eq('id', invId)
      .maybeSingle()

    const nextUrls = [body.variant_photo_url_1 || null, body.variant_photo_url_2 || null, body.variant_photo_url_3 || null]
    const prevUrls = existing ? [existing.variant_photo_url_1, existing.variant_photo_url_2, existing.variant_photo_url_3] : []

    // Compute removed files
    const removed = (prevUrls || []).filter(u => !!u && !nextUrls.includes(u as any)) as string[]
    if (removed.length > 0) {
      const paths = removed
        .map(u => {
          const marker = '/object/public/products-sku/'
          const idx = u.indexOf(marker)
          return idx >= 0 ? u.substring(idx + marker.length) : ''
        })
        .filter(p => !!p)
      if (paths.length > 0) {
        await svc.storage.from('products-sku').remove(paths)
      }
    }

    const updateData: any = {
      variant_photo_url_1: nextUrls[0],
      variant_photo_url_2: nextUrls[1],
      variant_photo_url_3: nextUrls[2]
    }

    const { data, error } = await svc
      .from('backend_products_inventory')
      .update(updateData)
      .eq('product_id', pId)
      .eq('id', invId)
      .select()
      .single()
    if (error) return c.json({ error: 'Update failed', details: String((error as any)?.message || error) }, 500)
    return c.json(data)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// ==================== 價格相關端點 ====================

// GET /backend/products/:productId/prices - Get pricing info for a product
app.get('/backend/products/:productId/prices', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const productId = c.req.param('productId')
    const svc = makeSvc(c)

    const { data, error } = await svc
      .from('backend_products_prices')
      .select('*')
      .eq('product_id', productId)
      .order('sku_key', { ascending: true })

    if (error) return c.json({ error: 'Failed to fetch prices' }, 500)
    return c.json(data || [])
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /backend/products/:productId/prices - Create pricing record
app.post('/backend/products/:productId/prices', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const productId = c.req.param('productId')
    const body = await c.req.json()
    const svc = makeSvc(c)

    const { data, error } = await svc
      .from('backend_products_prices')
      .insert({
        product_id: parseInt(productId),
        sku_key: body.sku_key || null,
        sale_price: body.sale_price ? parseFloat(body.sale_price) : null,
        compare_at_price: body.compare_at_price ? parseFloat(body.compare_at_price) : null,
        cost_price: body.cost_price ? parseFloat(body.cost_price) : null,
        gold_member_price: body.gold_member_price ? parseFloat(body.gold_member_price) : null,
        silver_member_price: body.silver_member_price ? parseFloat(body.silver_member_price) : null,
        vip_member_price: body.vip_member_price ? parseFloat(body.vip_member_price) : null
      })
      .select()
      .single()

    if (error) return c.json({ error: 'Failed to create price record' }, 500)
    return c.json(data)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// PATCH /backend/products/:productId/prices/:priceId - Update pricing record
app.patch('/backend/products/:productId/prices/:priceId', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const productId = c.req.param('productId')
    const priceId = c.req.param('priceId')
    const body = await c.req.json()
    const svc = makeSvc(c)

    const allowed: any = {}
    if (body.sale_price !== undefined) allowed.sale_price = body.sale_price ? parseFloat(body.sale_price) : null
    if (body.compare_at_price !== undefined) allowed.compare_at_price = body.compare_at_price ? parseFloat(body.compare_at_price) : null
    if (body.cost_price !== undefined) allowed.cost_price = body.cost_price ? parseFloat(body.cost_price) : null
    if (body.gold_member_price !== undefined) allowed.gold_member_price = body.gold_member_price ? parseFloat(body.gold_member_price) : null
    if (body.silver_member_price !== undefined) allowed.silver_member_price = body.silver_member_price ? parseFloat(body.silver_member_price) : null
    if (body.vip_member_price !== undefined) allowed.vip_member_price = body.vip_member_price ? parseFloat(body.vip_member_price) : null

    if (Object.keys(allowed).length === 0) return c.json({ error: 'No fields to update' }, 400)

    const { data, error } = await svc
      .from('backend_products_prices')
      .update(allowed)
      .eq('id', priceId)
      .eq('product_id', productId)
      .select()
      .single()

    if (error) return c.json({ error: 'Update failed' }, 500)
    return c.json(data)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// DELETE /backend/products/:productId/prices/:priceId - Delete pricing record
app.delete('/backend/products/:productId/prices/:priceId', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const productId = c.req.param('productId')
    const priceId = c.req.param('priceId')
    const svc = makeSvc(c)

    const { error } = await svc
      .from('backend_products_prices')
      .delete()
      .eq('id', priceId)
      .eq('product_id', productId)

    if (error) return c.json({ error: 'Delete failed' }, 500)
    return c.json({ ok: true })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /backend/products/:id/storage-upload - Upload single file to storage and return URL
app.post('/backend/products/:id/storage-upload', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const formData = await c.req.formData()
    const file = formData.get('file') as File

    if (!file) return c.json({ error: 'No file provided' }, 400)

    const svc = makeSvc(c)

    // Upload to Supabase Storage
    const filename = `${id}-${Date.now()}-${file.name}`
    const { error: uploadErr } = await svc.storage
      .from('products')
      .upload(filename, file, { upsert: false })

    if (uploadErr) return c.json({ error: 'Upload failed' }, 500)

    // Get public URL
    const { data: publicUrl } = svc.storage
      .from('products')
      .getPublicUrl(filename)

    return c.json({ url: publicUrl?.publicUrl || '' })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

export default app

