import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { createClient } from '@supabase/supabase-js'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  ALLOWED_ORIGIN?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  // Preferred backend-specific LINE envs
  BACKEND_LINE_CHANNEL_ID?: string
  BACKEND_LINE_CHANNEL_SECRET?: string
  BACKEND_LINE_REDIRECT_URI?: string
  // Legacy fallback
  LINE_CHANNEL_ID?: string
  LINE_CHANNEL_SECRET?: string
  LINE_REDIRECT_URI?: string
  ADMIN_SESSION_SECRET?: string
  FRONTEND_SITE_URL?: string
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
const LINE_STATE_COOKIE = 'line-oauth-state'
const ADMIN_SESSION_COOKIE = 'admin-session'
const LINE_MODE_COOKIE = 'line-oauth-mode'
const LINE_NEXT_COOKIE = 'line-oauth-next'

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

// ==== Simple HMAC-based admin session (for LINE direct login) ====
async function hmacSign(secret: string, data: string) {
  const enc = new TextEncoder()
  const keyBytes = enc.encode(secret)
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return bufferToBase64Url(sig)
}

function bufferToBase64Url(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf)
  let str = ''
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i])
  const b64 = btoa(str)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlEncode(str: string) {
  const b64 = btoa(unescape(encodeURIComponent(str)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecodeToString(b64url: string) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : ''
  const s = atob(b64 + pad)
  // convert to UTF-8
  const bytes = new Uint8Array([...s].map(ch => ch.charCodeAt(0)))
  const dec = new TextDecoder()
  return dec.decode(bytes)
}

async function createAdminSessionToken(secret: string, uid: string, ttlSec = 60 * 60 * 24) {
  const payload = { uid, exp: Math.floor(Date.now() / 1000) + ttlSec }
  const payloadB64 = base64UrlEncode(JSON.stringify(payload))
  const sig = await hmacSign(secret, payloadB64)
  return `${payloadB64}.${sig}`
}

async function verifyAdminSessionToken(secret: string, token: string): Promise<{ uid: string } | null> {
  const [payloadB64, sig] = token.split('.')
  if (!payloadB64 || !sig) return null
  const expected = await hmacSign(secret, payloadB64)
  if (expected !== sig) return null
  try {
    const payload = JSON.parse(base64UrlDecodeToString(payloadB64))
    if (!payload?.uid || !payload?.exp) return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return { uid: String(payload.uid) }
  } catch {
    return null
  }
}

function setAdminSessionCookie(c: any, token: string, ttlSec = 60 * 60 * 24) {
  const isLocal = isLocalRequest(c)
  setCookie(c, ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: 'Lax',
    path: '/',
    maxAge: ttlSec
  })
}

function clearAdminSessionCookie(c: any) {
  deleteCookie(c, ADMIN_SESSION_COOKIE, { path: '/' })
}

async function getCurrentAdminId(c: any): Promise<string | null> {
  const access = getCookie(c, ACCESS_COOKIE)
  if (access) {
    try {
      const supabase = makeSupabase(c)
      const { data, error } = await supabase.auth.getUser(access)
      if (!error && data?.user?.id) return String(data.user.id)
    } catch {}
  }
  const adminToken = getCookie(c, ADMIN_SESSION_COOKIE)
  const secret = c.env.ADMIN_SESSION_SECRET
  if (adminToken && secret) {
    const parsed = await verifyAdminSessionToken(secret, adminToken)
    if (parsed?.uid) return parsed.uid
  }
  return null
}

// ==== LINE Login helpers ====
function requiredEnv(c: any, key: keyof Bindings) {
  const v = c.env[key]
  if (!v) throw new Error(`Missing env: ${String(key)}`)
  return v
}

function getRedirectUri(c: any) {
  // prefer backend-specific env, then legacy, else infer from request origin
  const configured = c.env.BACKEND_LINE_REDIRECT_URI || c.env.LINE_REDIRECT_URI
  if (configured) return configured
  try {
    const u = new URL(c.req.url)
    return `${u.origin}/backend/auth/line/callback`
  } catch {
    throw new Error('Unable to resolve LINE_REDIRECT_URI')
  }
}

function randomString(len = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let s = ''
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

function setStateCookie(c: any, state: string) {
  const isLocal = isLocalRequest(c)
  setCookie(c, LINE_STATE_COOKIE, state, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 10 // 10 minutes
  })
}

function getStateCookie(c: any) {
  return getCookie(c, LINE_STATE_COOKIE)
}

function getBackendLineCreds(c: any) {
  const clientId = (c.env.BACKEND_LINE_CHANNEL_ID || c.env.LINE_CHANNEL_ID) as string | undefined
  const clientSecret = (c.env.BACKEND_LINE_CHANNEL_SECRET || c.env.LINE_CHANNEL_SECRET) as string | undefined
  if (!clientId) throw new Error('Missing env: BACKEND_LINE_CHANNEL_ID or LINE_CHANNEL_ID')
  if (!clientSecret) throw new Error('Missing env: BACKEND_LINE_CHANNEL_SECRET or LINE_CHANNEL_SECRET')
  return { clientId, clientSecret }
}

async function exchangeLineToken(c: any, code: string) {
  const { clientId, clientSecret } = getBackendLineCreds(c)
  const redirectUri = getRedirectUri(c)
  const body = new URLSearchParams()
  body.set('grant_type', 'authorization_code')
  body.set('code', code)
  body.set('redirect_uri', redirectUri)
  body.set('client_id', clientId)
  body.set('client_secret', clientSecret)
  const resp = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })
  if (!resp.ok) throw new Error(`LINE token exchange failed: ${resp.status}`)
  return resp.json()
}

async function fetchLineProfile(accessToken: string) {
  const resp = await fetch('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!resp.ok) throw new Error(`LINE profile failed: ${resp.status}`)
  return resp.json()
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
    const user = data.user
    // Enforce backend_admins must already exist and be active
    const svc = makeSupabase(c, session.access_token)
    const { data: row, error: selErr } = await svc
      .from('backend_admins')
      .select('id,is_active')
      .eq('id', user.id)
      .single()
    if (selErr || !row || row.is_active === false) {
      // Do not set cookies; deny login to backend
      return c.json({ error: 'Not a backend admin' }, 403)
    }
    setAuthCookies(c, session.access_token, session.expires_in ?? 900, session.refresh_token)
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
    clearAdminSessionCookie(c)
    return c.json({ ok: true })
  } catch (e: any) {
    clearAuthCookies(c)
    clearAdminSessionCookie(c)
    return c.json({ ok: true })
  }
})

// GET /backend/auth/me
app.get('/backend/auth/me', async (c) => {
  try {
    const access = getCookie(c, ACCESS_COOKIE)
    if (access) {
      const supabase = makeSupabase(c)
      const { data, error } = await supabase.auth.getUser(access)
      if (error || !data?.user) return c.json({ error: 'Unauthorized' }, 401)
      const user = data.user
      // must also exist in backend_admins and be active
      const svc = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, { auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${access}` } } })
      const { data: row } = await svc.from('backend_admins').select('id,is_active').eq('id', user.id).single()
      if (!row || row.is_active === false) return c.json({ error: 'Unauthorized' }, 401)
      return c.json({ id: user.id, email: user.email })
    }
    // Fallback: admin-session (LINE 直接登入)
    const adminToken = getCookie(c, ADMIN_SESSION_COOKIE)
    const secret = c.env.ADMIN_SESSION_SECRET
  if (!adminToken || !secret) return c.json({ error: 'Unauthorized' }, 401)
    const parsed = await verifyAdminSessionToken(secret, adminToken)
    if (!parsed) return c.json({ error: 'Unauthorized' }, 401)
  // Use service role to verify admin presence & read email
  const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
  const admin = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })
  const { data: rows } = await admin.from('backend_admins').select('email,is_active').eq('id', parsed.uid).limit(1)
  const r = Array.isArray(rows) ? rows[0] : null
  if (!r || r.is_active === false) return c.json({ error: 'Unauthorized' }, 401)
  const email = r?.email as string | undefined
  return c.json({ id: parsed.uid, email })
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

// Return modules for the logged-in admin derived from role matrix
app.get('/backend/auth/modules', async (c) => {
  try {
    // Determine current admin id and role
    let adminId: string | null = null
    let role: string | null = null

    const access = getCookie(c, ACCESS_COOKIE)
    if (access) {
      const supabase = makeSupabase(c)
      const { data, error } = await supabase.auth.getUser(access)
      if (!error && data?.user?.id) {
        adminId = String(data.user.id)
      }
    }

    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!adminId) {
      // Fallback: admin-session
      const adminToken = getCookie(c, ADMIN_SESSION_COOKIE)
      const secret = c.env.ADMIN_SESSION_SECRET
      if (!adminToken || !secret) return c.json({ error: 'Unauthorized' }, 401)
      const parsed = await verifyAdminSessionToken(secret, adminToken)
      if (!parsed) return c.json({ error: 'Unauthorized' }, 401)
      adminId = parsed.uid
    }

    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)

    const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })
    // Load admin role
    const { data: adminRow, error: adminErr } = await svc
      .from('backend_admins')
      .select('role,is_active')
      .eq('id', adminId)
      .single()
    if (adminErr || !adminRow || adminRow.is_active === false) return c.json({ error: 'Unauthorized' }, 401)
    role = adminRow?.role || 'Staff'

    // Load role matrix row
    const { data: roleRow, error: roleErr } = await svc
      .from('backend_role_modules')
      .select('*')
      .eq('role', role)
      .single()
    if (roleErr || !roleRow) return c.json([])

    // Load active modules list
    const { data: modules, error: modErr } = await svc
      .from('backend_modules')
      .select('key')
      .eq('is_active', true)
    if (modErr) return c.json({ error: 'Failed to load modules' }, 500)

    // Filter by roleRow boolean flags (convert keys to snake_case where needed)
    const toColumn = (k: string) => k.replace(/-/g, '_')
    const allowed = (modules || [])
      .map(m => m.key as string)
      .filter(k => !!(roleRow as any)[toColumn(k)])

    return c.json(allowed)
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

// ==== LINE Login routes ====

// GET /backend/auth/line/start -> redirect to LINE authorize
app.get('/backend/auth/line/start', async (c) => {
  try {
  const { clientId } = getBackendLineCreds(c)
    const redirectUri = getRedirectUri(c)
    const state = randomString(32)
    const nonce = randomString(16)
    setStateCookie(c, state)
    const isLocal = isLocalRequest(c)
  const u = new URL(c.req.url)
  const mode = u.searchParams.get('mode') || 'login'
  const next = u.searchParams.get('next') || (mode === 'bind' ? '/accountsetting/oauth' : '/')
    setCookie(c, LINE_MODE_COOKIE, mode, { httpOnly: true, secure: !isLocal, sameSite: 'Lax', path: '/', maxAge: 600 })
    setCookie(c, LINE_NEXT_COOKIE, next, { httpOnly: true, secure: !isLocal, sameSite: 'Lax', path: '/', maxAge: 600 })
    const params = new URLSearchParams()
    params.set('response_type', 'code')
    params.set('client_id', clientId)
    params.set('redirect_uri', redirectUri)
    params.set('state', state)
    params.set('scope', 'openid profile')
    params.set('nonce', nonce)
    // UI options
    const url = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`
    return c.redirect(url, 302)
  } catch (e: any) {
    return c.json({ error: e?.message || 'LINE start failed' }, 500)
  }
})

// GET /backend/auth/line/callback
app.get('/backend/auth/line/callback', async (c) => {
  try {
    const u = new URL(c.req.url)
    const code = u.searchParams.get('code')
    const state = u.searchParams.get('state')
    const error = u.searchParams.get('error')
    if (error) return c.redirect(`/login?line_status=error&reason=${encodeURIComponent(error)}`, 302)
    if (!code || !state) return c.redirect('/login?line_status=error&reason=missing_code_or_state', 302)
    const expected = getStateCookie(c)
    if (!expected || expected !== state) return c.redirect('/login?line_status=error&reason=state_mismatch', 302)

    const tokenRes = await exchangeLineToken(c, code)
    const accessToken = tokenRes?.access_token
    if (!accessToken) return c.redirect('/login?line_status=error&reason=no_access_token', 302)
    const profile = await fetchLineProfile(accessToken)
    const lineUserId = profile?.userId
  const lineName = profile?.displayName
  const linePicture = profile?.pictureUrl || null
    if (!lineUserId) return c.redirect('/login?line_status=error&reason=no_line_user', 302)

    // Mode & next
    const mode = getCookie(c, LINE_MODE_COOKIE) || 'login'
    const next = getCookie(c, LINE_NEXT_COOKIE) || (mode === 'bind' ? '/accountsetting/oauth' : '/login')
    deleteCookie(c, LINE_MODE_COOKIE, { path: '/' })
    deleteCookie(c, LINE_NEXT_COOKIE, { path: '/' })

    // Lookup binding and optionally create admin session
    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    let bound = false
    let uid: string | null = null
    if (serviceKey) {
      const admin = createClient(requiredEnv(c, 'SUPABASE_URL'), serviceKey, { auth: { persistSession: false } })
      const { data: rows } = await admin.from('backend_admins').select('id').eq('line_user_id', lineUserId).limit(1)
      bound = Array.isArray(rows) && rows.length > 0
      uid = bound ? String(rows![0].id) : null
    }

    // Bind flow: attach LINE to current logged-in admin
    if (mode === 'bind') {
      const currentUid = await (async () => {
        const access = getCookie(c, ACCESS_COOKIE)
        if (access) {
          try {
            const supabase = makeSupabase(c)
            const { data, error } = await supabase.auth.getUser(access)
            if (!error && data?.user?.id) return String(data.user.id)
          } catch {}
        }
        const adminToken = getCookie(c, ADMIN_SESSION_COOKIE)
        const secret = c.env.ADMIN_SESSION_SECRET
        if (adminToken && secret) {
          const parsed = await verifyAdminSessionToken(secret, adminToken)
          if (parsed?.uid) return parsed.uid
        }
        return null
      })()
      if (!currentUid) {
        return c.redirect(`/login?line_status=error&reason=${encodeURIComponent('not_logged_in_for_bind')}`, 302)
      }
      if (!serviceKey) {
        return c.redirect(`/accountsetting/oauth?bind=error&reason=${encodeURIComponent('missing_service_key')}`, 302)
      }
      const admin = createClient(requiredEnv(c, 'SUPABASE_URL'), serviceKey, { auth: { persistSession: false } })
      // 檢查是否被他人佔用
      const { data: existRows } = await admin
        .from('backend_admins')
        .select('id')
        .eq('line_user_id', lineUserId)
        .limit(1)
      const occupied = Array.isArray(existRows) && existRows.length > 0 && String(existRows[0].id) !== String(currentUid)
      if (occupied) {
        return c.redirect(`/accountsetting/oauth?bind=error&reason=${encodeURIComponent('line_id_taken')}`, 302)
      }
      const { error: updErr } = await admin
        .from('backend_admins')
        .update({ line_user_id: lineUserId, line_display_name: lineName || null, line_picture_url: linePicture, line_bound_at: new Date().toISOString() })
        .eq('id', currentUid)
      if (updErr) {
        return c.redirect(`/accountsetting/oauth?bind=error&reason=${encodeURIComponent('update_failed')}`, 302)
      }
      const sep = next.includes('?') ? '&' : '?'
      return c.redirect(`${next}${sep}bind=success`, 302)
    }

    if (bound && uid) {
      const secret = c.env.ADMIN_SESSION_SECRET
      if (!secret) {
        // 回退到登入頁顯示已綁定
        const q = new URLSearchParams({ line_status: 'success', bound: '1', name: lineName || '' })
        return c.redirect(`/login?${q.toString()}`, 302)
      }
      const token = await createAdminSessionToken(secret, uid, 60 * 60 * 12) // 12h
      setAdminSessionCookie(c, token, 60 * 60 * 12)
      // 目標導回：如果 next 是絕對網址就用 next；否則若有 ALLOWED_ORIGIN，拼接相對路徑；否則使用 next 或 '/'
      let target = '/'
      if (next && /^https?:\/\//i.test(next)) {
        target = next
      } else if (c.env.ALLOWED_ORIGIN) {
        const base = c.env.ALLOWED_ORIGIN.replace(/\/$/, '')
        const path = next || '/'
        target = `${base}${path.startsWith('/') ? '' : '/'}${path}`
      } else if (next) {
        target = next
      }
      return c.redirect(target, 302)
    }

    // 未綁定：回登入頁提示（盡量導回前端的 Login）
    const q = new URLSearchParams({ line_status: 'success', bound: '0', name: lineName || '' })
    let loginUrl = `/login?${q.toString()}`
    if (next && /^https?:\/\//i.test(next)) {
      const sep = next.endsWith('/') ? '' : '/'
      loginUrl = `${next}${sep}login?${q.toString()}`
    } else if (c.env.ALLOWED_ORIGIN) {
      const sep = c.env.ALLOWED_ORIGIN.endsWith('/') ? '' : '/'
      loginUrl = `${c.env.ALLOWED_ORIGIN}${sep}login?${q.toString()}`
    }
    return c.redirect(loginUrl, 302)
  } catch (e: any) {
    return c.redirect(`/login?line_status=error&reason=${encodeURIComponent(e?.message || 'callback_failed')}`, 302)
  }
})

// Account Setting: LINE profile
app.get('/backend/account/line/profile', async (c) => {
  try {
    // Determine current admin
    const access = getCookie(c, ACCESS_COOKIE)
    let adminId: string | null = null
    if (access) {
      try {
        const supabase = makeSupabase(c)
        const { data, error } = await supabase.auth.getUser(access)
        if (!error && data?.user?.id) adminId = String(data.user.id)
      } catch {}
    }
    if (!adminId) {
      const adminToken = getCookie(c, ADMIN_SESSION_COOKIE)
      const secret = c.env.ADMIN_SESSION_SECRET
      if (adminToken && secret) {
        const parsed = await verifyAdminSessionToken(secret, adminToken)
        if (parsed?.uid) adminId = parsed.uid
      }
    }
    if (!adminId) return c.json({ error: 'Unauthorized' }, 401)

    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    const admin = createClient(requiredEnv(c, 'SUPABASE_URL'), serviceKey, { auth: { persistSession: false } })
    const { data, error } = await admin
      .from('backend_admins')
      .select('line_user_id,line_display_name,line_picture_url')
      .eq('id', adminId)
      .single()
    if (error) return c.json({ error: 'Failed to load' }, 500)
  const linked = !!data?.line_user_id
  return c.json({ linked, line_user_id: data?.line_user_id || null, line_display_name: data?.line_display_name || null, line_picture_url: data?.line_picture_url || null })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal server error' }, 500)
  }
})

// Account Setting: LINE unbind
app.post('/backend/account/line/unbind', async (c) => {
  try {
    // Determine current admin
    const access = getCookie(c, ACCESS_COOKIE)
    let adminId: string | null = null
    if (access) {
      try {
        const supabase = makeSupabase(c)
        const { data, error } = await supabase.auth.getUser(access)
        if (!error && data?.user?.id) adminId = String(data.user.id)
      } catch {}
    }
    if (!adminId) {
      const adminToken = getCookie(c, ADMIN_SESSION_COOKIE)
      const secret = c.env.ADMIN_SESSION_SECRET
      if (adminToken && secret) {
        const parsed = await verifyAdminSessionToken(secret, adminToken)
        if (parsed?.uid) adminId = parsed.uid
      }
    }
    if (!adminId) return c.json({ error: 'Unauthorized' }, 401)

    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    const admin = createClient(requiredEnv(c, 'SUPABASE_URL'), serviceKey, { auth: { persistSession: false } })
    const { error } = await admin
      .from('backend_admins')
      .update({ line_user_id: null, line_display_name: null, line_picture_url: null, line_bound_at: null })
      .eq('id', adminId)
    if (error) return c.json({ error: 'Failed to unbind' }, 500)
    return c.json({ ok: true })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal server error' }, 500)
  }
})
