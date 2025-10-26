import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { createClient } from '@supabase/supabase-js'

type Env = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

const app = new Hono<{ Bindings: Env }>()

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

async function listTable(c: any, table: string) {
  if (!(await requireAuth(c))) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const svc = makeSvc(c)
    const page = Math.max(parseInt(String(c.req.query('page') || '1'), 10) || 1, 1)
    const pageSize = Math.min(Math.max(parseInt(String(c.req.query('pageSize') || '20'), 10) || 20, 1), 100)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const sel = svc
      .from(table)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data, error, count } = await sel
    if (error) return c.json({ error: 'List failed' }, 500)

    return c.json({ items: data || [], total: count || 0, page, pageSize })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
}

app.get('/backend/orders/credit', (c) => listTable(c, 'fronted_credit_order'))
app.get('/backend/orders/atm', (c) => listTable(c, 'fronted_atm_order'))
app.get('/backend/orders/cvscode', (c) => listTable(c, 'fronted_cvscode_order'))
app.get('/backend/orders/webatm', (c) => listTable(c, 'fronted_webatm_order'))

export default app
