import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { createClient } from '@supabase/supabase-js'

const app = new Hono<{ Bindings: {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  ADMIN_SESSION_SECRET?: string
  SITE_URL?: string
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

// Helper: recursively build tree from flat list
function buildCategoryTree(categories: any[], parentId: string | null = null): any[] {
  return categories
    .filter(c => c.parent_id === parentId)
    .map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image_url || '',
      children: buildCategoryTree(categories, c.id)
    }))
}

// GET /backend/categories -> fetch all categories as tree
app.get('/backend/categories', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const svc = makeSvc(c)
    const { data, error } = await svc
      .from('backend_products_cetegory')
      .select('id,name,slug,image_url,parent_id')
      .order('created_at', { ascending: true })
    if (error) return c.json({ error: 'Failed to list' }, 500)
    const tree = buildCategoryTree(data || [])
    return c.json(tree)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /backend/categories -> create new category
app.post('/backend/categories', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const body = await c.req.json()
    const name = String(body?.name || '').trim()
    const slug = String(body?.slug || '').trim()
    const parentId = body?.parent_id || null
    const imageUrl = String(body?.image_url || '').trim()

    if (!name || !slug) return c.json({ error: 'Missing name or slug' }, 400)

    const svc = makeSvc(c)
    const insertRow: any = {
      name,
      slug,
      image_url: imageUrl || null,
      parent_id: parentId
    }

    const { data, error } = await svc
      .from('backend_products_cetegory')
      .insert(insertRow)
      .select('id,name,slug,image_url,parent_id')
      .single()

    if (error) return c.json({ error: 'Create failed' }, 500)

    return c.json({
      id: data.id,
      name: data.name,
      slug: data.slug,
      image: data.image_url || '',
      parent_id: data.parent_id
    })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// PATCH /backend/categories/:id -> update category
app.patch('/backend/categories/:id', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    const allowed: any = {}
    if (typeof body.name === 'string') allowed.name = String(body.name).trim()
    if (typeof body.slug === 'string') allowed.slug = String(body.slug).trim()
    if (typeof body.image_url === 'string') allowed.image_url = String(body.image_url).trim() || null

    if (Object.keys(allowed).length === 0) return c.json({ error: 'No fields to update' }, 400)

    const svc = makeSvc(c)
    const { data, error } = await svc
      .from('backend_products_cetegory')
      .update(allowed)
      .eq('id', id)
      .select('id,name,slug,image_url,parent_id')
      .single()

    if (error) return c.json({ error: 'Update failed' }, 500)

    return c.json({
      id: data.id,
      name: data.name,
      slug: data.slug,
      image: data.image_url || '',
      parent_id: data.parent_id
    })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// DELETE /backend/categories/:id -> delete category and all children
app.delete('/backend/categories/:id', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const svc = makeSvc(c)

    // Recursively find and delete all children
    async function deleteRecursive(categoryId: string): Promise<void> {
      const { data: children } = await svc
        .from('backend_products_cetegory')
        .select('id')
        .eq('parent_id', categoryId)

      for (const child of children || []) {
        await deleteRecursive(child.id)
      }

      await svc
        .from('backend_products_cetegory')
        .delete()
        .eq('id', categoryId)
    }

    await deleteRecursive(id)
    return c.json({ ok: true })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /backend/categories/:id/upload-image -> upload image to Supabase Storage
app.post('/backend/categories/:id/upload-image', async (c) => {
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
      .from('product-categories')
      .upload(filename, file, { upsert: false })

    if (uploadErr) return c.json({ error: 'Upload failed' }, 500)

    // Get public URL
    const { data: publicUrl } = svc.storage
      .from('product-categories')
      .getPublicUrl(filename)

    // Update category with image URL
    const imageUrl = publicUrl?.publicUrl || ''
    const { data, error: updateErr } = await svc
      .from('backend_products_cetegory')
      .update({ image_url: imageUrl })
      .eq('id', id)
      .select('id,name,slug,image_url,parent_id')
      .single()

    if (updateErr) return c.json({ error: 'Update failed' }, 500)

    return c.json({
      id: data.id,
      image_url: data.image_url || '',
      public_url: imageUrl
    })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

export default app
