import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'

// Bindings for environment variables
type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>({ strict: false })

app.use('*', cors({
  origin: (origin) => origin || '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'OPTIONS'],
  credentials: true,
  maxAge: 86400
}))

function makeServiceClient(c: any) {
  const url = c.env.SUPABASE_URL
  const key = c.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Server misconfigured')
  return createClient(url, key, { auth: { persistSession: false } })
}

// Build hierarchical tree with href composed from slug chain
function buildTree(rows: any[]) {
  // Map id -> node
  const map = new Map<number, any>()
  rows.forEach(r => {
    map.set(Number(r.id), {
      id: Number(r.id),
      name: r.name,
      slug: r.slug,
      image_url: r.image_url || null,
      parent_id: r.parent_id ? Number(r.parent_id) : null,
      children: [] as any[],
      href: ''
    })
  })
  // Build parent links
  const roots: any[] = []
  map.forEach((node) => {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id).children.push(node)
    } else {
      roots.push(node)
    }
  })

  // Compute hrefs by traversing
  const computeHref = (node: any, parentPath: string[]) => {
    const path = [...parentPath, node.slug]
    node.href = '/products/' + path.join('/')
    node.children.forEach((ch: any) => computeHref(ch, path))
  }
  roots.forEach(r => computeHref(r, []))
  return roots
}

// GET /frontend/categories -> hierarchical category tree
app.get('/frontend/categories', async (c) => {
  try {
    const svc = makeServiceClient(c)
    const { data, error } = await svc
      .from('backend_products_cetegory')
      .select('id,parent_id,name,slug,image_url')
      .order('parent_id', { ascending: true, nullsFirst: true })
      .order('id', { ascending: true })
    if (error) return c.json({ error: error.message }, 400)
    const roots = buildTree(data || [])
    return c.json({ categories: roots })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

export default app
