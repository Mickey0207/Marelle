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
  // Reuse the same auth logic as elsewhere: accept sb-access-token or admin-session
  const access = getCookie(c, ACCESS_COOKIE)
  if (access) return true
  const sess = getCookie(c, ADMIN_SESSION_COOKIE)
  return !!sess
}

// GET /backend/admins
app.get('/backend/admins', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const svc = makeSvc(c)
    const { data, error } = await svc
      .from('backend_admins')
  .select('id,email,display_name,role,department,line_user_id,line_display_name,line_picture_url,is_active,created_at')
      .order('created_at', { ascending: false })
    if (error) return c.json({ error: 'Failed to list' }, 500)
    // shape fields for front-end expectations
    const list = (data || []).map((a: any) => ({
      id: a.id,
      email: a.email,
      display_name: a.display_name,
  role: a.role,
  department: a.department || null,
      line_user_id: a.line_user_id,
      line_display_name: a.line_display_name,
      line_picture_url: a.line_picture_url,
      is_active: a.is_active
    }))
    return c.json(list)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// PATCH /backend/admins/:id -> update basic fields (display_name, role, is_active, department)
app.patch('/backend/admins/:id', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const allowed: any = {}
    if (typeof body.display_name === 'string') allowed.display_name = body.display_name
    if (typeof body.role === 'string') allowed.role = body.role
  if (typeof body.is_active === 'boolean') allowed.is_active = body.is_active
  if (typeof body.department === 'string') allowed.department = body.department
    if (Object.keys(allowed).length === 0) return c.json({ error: 'No fields' }, 400)
    const svc = makeSvc(c)
    const { error } = await svc.from('backend_admins').update(allowed).eq('id', id)
    if (error) return c.json({ error: 'Update failed' }, 500)
    return c.json({ ok: true })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// GET /backend/roles -> list roles (from backend_role_modules)
app.get('/backend/roles', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const svc = makeSvc(c)
    const { data, error } = await svc.from('backend_role_modules').select('role').order('role')
    if (error) return c.json({ error: 'Failed to list' }, 500)
    const list = (data || []).map((r: any, idx: number) => ({ id: `r${idx}`, name: r.role }))
    return c.json(list)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /backend/roles -> create a new role row with all modules default false
app.post('/backend/roles', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const body = await c.req.json()
    const role = String(body?.name || '').trim()
    if (!role) return c.json({ error: 'Missing role name' }, 400)
    const svc = makeSvc(c)
    // Build an insert with only role; DB will set defaults for booleans
    const { error } = await svc.from('backend_role_modules').insert({ role })
    if (error) return c.json({ error: 'Create failed' }, 500)
    return c.json({ id: role, name: role })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// GET /backend/roles/:role/modules -> list enabled module keys for role
app.get('/backend/roles/:role/modules', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const role = c.req.param('role')
    const svc = makeSvc(c)
    const { data, error } = await svc.from('backend_role_modules').select('*').eq('role', role).single()
    if (error || !data) return c.json([])
    // convert boolean columns to keys
    const { role: _r, created_at: _ca, updated_at: _ua, ...flags } = data as any
    const keys = Object.entries(flags).filter(([, v]) => !!v).map(([k]) => k.replace(/_/g, '-'))
    // ensure module exists and is active
    const { data: mods } = await svc.from('backend_modules').select('key').eq('is_active', true)
    const active = new Set((mods || []).map(m => m.key))
    return c.json(keys.filter(k => active.has(k)))
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// PUT /backend/roles/:role/modules -> replace enabled modules for role
app.put('/backend/roles/:role/modules', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const role = c.req.param('role')
    const body = await c.req.json()
    const modules: string[] = Array.isArray(body?.modules) ? body.modules : []
    const svc = makeSvc(c)
    // Load active module keys
    const { data: mods } = await svc.from('backend_modules').select('key').eq('is_active', true)
    const active = new Set((mods || []).map(m => m.key))
    const safe = Array.from(new Set(modules)).filter(k => active.has(k))
    // Build patch object: set booleans for all columns present
    // Fetch one row to know columns
    const { data: row, error: getErr } = await svc.from('backend_role_modules').select('*').eq('role', role).single()
    if (getErr || !row) return c.json({ error: 'Role not found' }, 404)
    const patch: any = {}
    Object.keys(row).forEach((col) => {
      if (['role','created_at','updated_at'].includes(col)) return
      const key = col.replace(/_/g, '-')
      patch[col] = safe.includes(key)
    })
    const { error: updErr } = await svc.from('backend_role_modules').update(patch).eq('role', role)
    if (updErr) return c.json({ error: 'Update failed' }, 500)
    return c.json({ ok: true })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// GET /backend/modules -> list active modules for UI
app.get('/backend/modules', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const svc = makeSvc(c)
    const { data, error } = await svc
      .from('backend_modules')
      .select('key,name,is_active')
      .eq('is_active', true)
      .order('name', { ascending: true })
    if (error) return c.json({ error: 'Failed to list' }, 500)
    const list = (data || []).map((m: any) => ({ key: m.key, label: m.name || m.key }))
    return c.json(list)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /backend/admins -> create a new admin (Supabase Auth user + backend_admins row)
app.post('/backend/admins', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const body = await c.req.json()
    const email = String(body?.email || '').trim().toLowerCase()
    const password = String(body?.password || '')
  const display_name = String(body?.display_name || '').trim()
  const role = String(body?.role || 'Staff')
  const department = typeof body?.department === 'string' ? String(body.department) : null
    if (!email || !password) return c.json({ error: 'Missing email or password' }, 400)
    const svc = makeSvc(c)
    // 1) Create auth user
    const { data: created, error: createErr } = await (svc as any).auth.admin.createUser({ email, password, email_confirm: true })
    if (createErr || !created?.user) return c.json({ error: 'Create user failed' }, 500)
    const uid = created.user.id
    // 2) Insert backend_admins row
  const insertRow: any = { id: uid, email, is_active: true }
    if (display_name) insertRow.display_name = display_name
    if (role) insertRow.role = role
  if (department) insertRow.department = department
    const { error: insErr } = await svc.from('backend_admins').insert(insertRow)
    if (insErr) {
      // rollback auth user
      try { await (svc as any).auth.admin.deleteUser(uid) } catch {}
      return c.json({ error: 'Create admin row failed' }, 500)
    }
  return c.json({ id: uid, email, display_name: display_name || null, role, department: department || null })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// (removed) direct reset password endpoint; prefer email-based reset

// POST /backend/admins/:id/send-reset-email -> send a password reset email
app.post('/backend/admins/:id/send-reset-email', async (c) => {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const id = c.req.param('id')
    const svc = makeSvc(c)
    // load user email from backend_admins
    const { data: row, error } = await svc.from('backend_admins').select('email').eq('id', id).single()
    if (error || !row?.email) return c.json({ error: 'User not found' }, 404)
    // send reset email via Supabase
    const site = c.env.SITE_URL || 'http://localhost:3001'
    const { error: mailErr } = await (svc as any).auth.resetPasswordForEmail(row.email, {
      redirectTo: `${site.replace(/\/$/, '')}/auth/reset-password`
    })
    if (mailErr) return c.json({ error: 'Send reset email failed' }, 500)
    return c.json({ ok: true })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

export default app
