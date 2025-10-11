import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { createClient } from '@supabase/supabase-js'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  ALLOWED_ORIGIN?: string
}

const app = new Hono<{ Bindings: Bindings }>({ strict: false })

// CORS: allow credentials and echo Origin (for dev & prod behind same domain)
app.use('*', cors({
  origin: (origin) => origin || '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  exposeHeaders: [],
  credentials: true,
  maxAge: 86400
}))

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

const ACCESS_COOKIE = 'sb-access-token'
const REFRESH_COOKIE = 'sb-refresh-token'

function isLocalRequest(c: any) {
  try {
    const u = new URL(c.req.url)
    return u.hostname === '127.0.0.1' || u.hostname === 'localhost'
  } catch { return false }
}

function setAuthCookies(c: any, accessToken: string, expiresInSec: number, refreshToken: string) {
  const isLocal = isLocalRequest(c)
  setCookie(c, ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: 'Lax',
    path: '/',
    maxAge: Math.max(60, Math.min(expiresInSec, 60 * 60 * 24))
  })
  setCookie(c, REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })
}

function clearAuthCookies(c: any) {
  deleteCookie(c, ACCESS_COOKIE, { path: '/' })
  deleteCookie(c, REFRESH_COOKIE, { path: '/' })
}

// POST /backend/auth/login { email, password }
app.post('/backend/auth/login', async (c) => {
  try {
    const body = await c.req.json<{ email: string; password: string }>()
    const { email, password } = body || ({} as any)
    if (!email || !password) return c.json({ error: 'Missing email or password' }, 400)

    const supabase = makeSupabase(c)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data?.session?.access_token) {
      const msg = isLocalRequest(c) ? (error?.message || 'Invalid credentials') : 'Invalid credentials'
      if (error) console.warn('login failed:', error)
      return c.json({ error: msg }, 401)
    }

    const session = data.session
    setAuthCookies(c, session.access_token, session.expires_in ?? 900, session.refresh_token)

    // upsert backend_admins for this user (idempotent)
    const user = data.user
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin'
    const { error: upsertErr } = await makeSupabase(c, session.access_token)
      .from('backend_admins')
      .upsert({ id: user.id, email: user.email, display_name: displayName, is_active: true })
    if (upsertErr) {
      console.warn('backend_admins upsert failed', upsertErr)
    }
    return c.json({ user: { id: user.id, email: user.email } })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Login failed' }, 500)
  }
})

// POST /backend/auth/logout
app.post('/backend/auth/logout', async (c) => {
  try {
    const access = getCookie(c, ACCESS_COOKIE)
    const supabase = makeSupabase(c, access)
    try { await supabase.auth.signOut() } catch {}
    clearAuthCookies(c)
    return c.json({ ok: true })
  } catch (e: any) {
    clearAuthCookies(c)
    return c.json({ ok: true })
  }
})

// GET /backend/auth/me
app.get('/backend/auth/me', async (c) => {
  try {
    const access = getCookie(c, ACCESS_COOKIE)
    if (!access) return c.json({ error: 'Unauthorized' }, 401)
    const supabase = makeSupabase(c)
    const { data, error } = await supabase.auth.getUser(access)
    if (error || !data?.user) return c.json({ error: 'Unauthorized' }, 401)
    const user = data.user
    return c.json({ id: user.id, email: user.email })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal server error' }, 500)
  }
})

// POST /backend/auth/refresh
app.post('/backend/auth/refresh', async (c) => {
  try {
    const refresh = getCookie(c, REFRESH_COOKIE)
    if (!refresh) return c.json({ error: 'No refresh token' }, 401)
    const supabase = makeSupabase(c)
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refresh })
    if (error || !data?.session?.access_token) return c.json({ error: 'Refresh failed' }, 401)
    const session = data.session
    setAuthCookies(c, session.access_token, session.expires_in ?? 900, session.refresh_token)
    return c.json({ ok: true })
  } catch (e: any) {
    return c.json({ error: 'Refresh failed' }, 500)
  }
})

// Return modules for the logged-in admin from DB (RLS enforced)
app.get('/backend/auth/modules', async (c) => {
  try {
    const access = getCookie(c, ACCESS_COOKIE)
    if (!access) return c.json({ error: 'Unauthorized' }, 401)
    const supabase = makeSupabase(c, access)

    // read module keys assigned to this admin
    const { data: rows, error: mapErr } = await supabase
      .from('backend_admin_modules')
      .select('module_key')
    if (mapErr) return c.json({ error: 'Failed to load modules' }, 500)
    const keys = (rows || []).map(r => r.module_key)
    if (keys.length === 0) return c.json([])

    // read active modules details, filter by keys
    const { data: modules, error: modErr } = await supabase
      .from('backend_modules')
      .select('key')
      .in('key', keys)
      .eq('is_active', true)
    if (modErr) return c.json({ error: 'Failed to load modules' }, 500)
    return c.json((modules || []).map(m => m.key))
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal server error' }, 500)
  }
})

// Local-only diagnostics: reveal which Supabase project this Worker is using
app.get('/backend/_diag/env', (c) => {
  if (!isLocalRequest(c)) return c.notFound()
  const url = c.env.SUPABASE_URL
  let host: string | null = null
  try { host = url ? new URL(url).host : null } catch { host = null }
  return c.json({ supabaseUrlHost: host })
})

export default app
