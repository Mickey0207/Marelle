import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie } from 'hono/cookie'
import { createClient } from '@supabase/supabase-js'

// Types for environment bindings
type Bindings = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

const ACCESS_COOKIE = 'sb-access-token'
const FRONT_SESSION_COOKIE = 'front-session'
const GUEST_TOKEN_COOKIE = 'front-guest'

function isLocalRequest(c: any) {
  try {
    const u = new URL(c.req.url)
    return u.hostname === '127.0.0.1' || u.hostname === 'localhost'
  } catch { return false }
}

function makeSupabase(c: any, accessToken?: string) {
  const url = c.env.SUPABASE_URL
  const anon = c.env.SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  }
  const headers: Record<string, string> = {}
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers }
  })
}

function makeServiceClient(c: any) {
  const url = c.env.SUPABASE_URL
  const key = c.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Server misconfigured: missing service role key')
  return createClient(url, key, { auth: { persistSession: false } })
}

async function resolveUserId(c: any): Promise<string | null> {
  const access = getCookie(c, ACCESS_COOKIE)
  if (access) {
    try {
      const supabase = makeSupabase(c, access)
      const { data } = await supabase.auth.getUser(access)
      if (data?.user?.id) return data.user.id
    } catch {}
  }
  // Fallback: front-session (HMAC)
  const token = getCookie(c, FRONT_SESSION_COOKIE)
  // Note: verification is handled in the auth app; here we only support access cookie
  return null
}

// Ensure guest token exists; return token
function ensureGuestToken(c: any): string {
  let token = getCookie(c, GUEST_TOKEN_COOKIE)
  if (!token) {
    token = crypto.randomUUID()
    const isLocal = isLocalRequest(c)
    setCookie(c, GUEST_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 60 // 60 days
    })
  }
  return token
}

const app = new Hono<{ Bindings: Bindings }>({ strict: false })

// CORS (align with other frontend apps)
app.use('*', cors({
  origin: (origin) => origin || '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  maxAge: 86400
}))

// Shape helpers
function mapItemRow(row: any) {
  return {
    id: row.id,
    product_id: row.product_id,
    inventory_id: row.inventory_id,
    sku_key: row.sku_key ?? null,
    name: row.name_snapshot,
    image_url: row.image_url ?? null,
    quantity: row.quantity,
    unit_price: Number(row.unit_price || 0),
    currency: row.currency || 'TWD',
    line_total: Number(row.unit_price || 0) * Number(row.quantity || 0),
    selected_options: row.selected_options || {}
  }
}

function mapCartRow(cart: any, items: any[]) {
  return {
    id: cart.id,
    status: cart.status,
    currency: cart.currency || 'TWD',
    totals: {
      subtotal: Number(cart.subtotal_amount || 0),
      discount: Number(cart.discount_amount || 0),
      shipping_fee: Number(cart.shipping_fee_amount || 0),
      tax: Number(cart.tax_amount || 0),
      grand_total: Number(cart.grand_total_amount || 0),
      quantity: Number(cart.total_quantity || 0)
    },
    items
  }
}

// GET /frontend/cart – return current active cart (user or guest)
app.get('/frontend/cart', async (c) => {
  try {
    const svc = makeServiceClient(c)
    const uid = await resolveUserId(c)

    if (uid) {
      const { data: carts } = await svc.from('fronted_carts')
        .select('*')
        .eq('user_id', uid)
        .eq('status', 'active')
        .limit(1)
      let cart = carts && carts[0]
      if (!cart) {
        const { data: created } = await svc.from('fronted_carts').insert({ user_id: uid }).select('*').single()
        cart = created
      }
      const { data: rows } = await svc.from('fronted_cart_items').select('*').eq('cart_id', cart.id)
      const items = (rows || []).map(mapItemRow)
      return c.json(mapCartRow(cart, items))
    }

    // Guest cart path (optional): ensure token and return empty cart snapshot (not persisted until POST)
    const token = ensureGuestToken(c)
    return c.json({ id: null, status: 'active', currency: 'TWD', totals: { subtotal: 0, discount: 0, shipping_fee: 0, tax: 0, grand_total: 0, quantity: 0 }, items: [] })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /frontend/cart/merge – merge local draft into user cart (login required)
app.post('/frontend/cart/merge', async (c) => {
  try {
    const svc = makeServiceClient(c)
    const uid = await resolveUserId(c)
    if (!uid) return c.json({ error: 'Unauthorized' }, 401)

    const body = await c.req.json().catch(() => ({})) as { draft_items?: Array<{ product_id: number, inventory_id?: number | null, sku_key?: string | null, quantity: number, selected_options?: any }> }
    const draft = Array.isArray(body.draft_items) ? body.draft_items : []

    // Ensure active cart
    let { data: carts } = await svc.from('fronted_carts').select('*').eq('user_id', uid).eq('status', 'active').limit(1)
    let cart = carts && carts[0]
    if (!cart) {
      const { data: created, error: icErr } = await svc.from('fronted_carts').insert({ user_id: uid }).select('*').single()
      if (icErr) return c.json({ error: icErr.message }, 400)
      cart = created
    }

    let added = 0, merged = 0, removed = 0
    for (const it of draft) {
      const qty = Math.max(1, Number(it.quantity || 1))

      // Resolve inventory row
      let inv: any = null
      if (it.inventory_id) {
        const { data } = await svc.from('backend_products_inventory').select('*').eq('id', it.inventory_id).single()
        inv = data
      } else if (it.sku_key) {
        const { data } = await svc.from('backend_products_inventory').select('*').eq('sku_key', it.sku_key).limit(1)
        inv = data && data[0]
      }
      if (!inv) { removed++; continue }

      // Resolve product
      const { data: prod } = await svc.from('backend_products').select('id,name').eq('id', inv.product_id).single()
      if (!prod) { removed++; continue }

      // Price snapshot (best-effort)
      let unit_price = 0
      try {
        const { data: priceRow } = await svc.from('backend_products_prices')
          .select('sale_price')
          .eq('product_id', prod.id)
          .eq('sku_key', inv.sku_key)
          .limit(1)
        if (priceRow && priceRow[0] && priceRow[0].sale_price != null) unit_price = Number(priceRow[0].sale_price)
      } catch {}

      // Upsert item (cart_id, inventory_id unique)
      const { data: exists } = await svc.from('fronted_cart_items').select('*').eq('cart_id', cart.id).eq('inventory_id', inv.id).limit(1)
      if (exists && exists[0]) {
        const nextQty = Number(exists[0].quantity || 0) + qty
        await svc.from('fronted_cart_items').update({ quantity: nextQty, unit_price, name_snapshot: prod.name, sku_key: inv.sku_key, selected_options: it.selected_options || {} }).eq('id', exists[0].id)
        merged++
      } else {
        await svc.from('fronted_cart_items').insert({
          cart_id: cart.id,
          product_id: prod.id,
          inventory_id: inv.id,
          sku_key: inv.sku_key,
          name_snapshot: prod.name,
          image_url: null,
          selected_options: it.selected_options || {},
          quantity: qty,
          unit_price,
          currency: 'TWD',
          line_total_amount: unit_price * qty,
          is_gift: false
        })
        added++
      }
    }

    // Fetch latest cart & items
    const { data: freshCart } = await svc.from('fronted_carts').select('*').eq('id', cart.id).single()
    const { data: rows } = await svc.from('fronted_cart_items').select('*').eq('cart_id', cart.id)
    const items = (rows || []).map(mapItemRow)
    return c.json({ cart: mapCartRow(freshCart, items), summary: { added, merged, removed } })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

export default app
