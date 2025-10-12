import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { setCookie, deleteCookie, getCookie } from 'hono/cookie'
import { createClient } from '@supabase/supabase-js'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  FRONTEND_SITE_URL?: string
  // Frontend LINE (required for LINE login/bind)
  FRONTEND_LINE_CHANNEL_ID?: string
  FRONTEND_LINE_CHANNEL_SECRET?: string
  FRONTEND_LINE_REDIRECT_BASE?: string
  ADMIN_SESSION_SECRET?: string
}

const app = new Hono<{ Bindings: Bindings }>({ strict: false })

// CORS for frontend endpoints
app.use('*', cors({
  origin: (origin) => origin || '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  maxAge: 86400
}))

const ACCESS_COOKIE = 'sb-access-token'
const REFRESH_COOKIE = 'sb-refresh-token'
const FRONT_SESSION_COOKIE = 'front-session'

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

// --- Simple HMAC session for frontend LINE login ---
async function hmacSign(secret: string, data: string) {
  const enc = new TextEncoder()
  const keyBytes = enc.encode(secret)
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  const bytes = new Uint8Array(sig)
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64url(str: string) {
  const b64 = btoa(unescape(encodeURIComponent(str)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlToStr(b64url: string) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : ''
  const s = atob(b64 + pad)
  const bytes = new Uint8Array([...s].map(ch => ch.charCodeAt(0)))
  const dec = new TextDecoder()
  return dec.decode(bytes)
}

async function createFrontSessionToken(secret: string, uid: string, ttlSec = 60 * 60 * 24 * 7) {
  const payload = { uid, exp: Math.floor(Date.now() / 1000) + ttlSec }
  const p = b64url(JSON.stringify(payload))
  const sig = await hmacSign(secret, p)
  return `${p}.${sig}`
}

async function verifyFrontSessionToken(secret: string, token: string): Promise<{ uid: string } | null> {
  const [p, sig] = token.split('.')
  if (!p || !sig) return null
  const expSig = await hmacSign(secret, p)
  if (expSig !== sig) return null
  try {
    const payload = JSON.parse(b64urlToStr(p))
    if (!payload?.uid || !payload?.exp) return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return { uid: String(payload.uid) }
  } catch { return null }
}

function getFrontendRedirectLogin(c: any) {
  const url = c.env.FRONTEND_SITE_URL
  if (url) return `${url.replace(/\/$/, '')}/login`
  try {
    const u = new URL(c.req.url)
    return `${u.origin}/login`
  } catch {
    return '/login'
  }
}

// POST /frontend/auth/register { email, password, display_name? }
app.post('/frontend/auth/register', async (c) => {
  try {
    const body = await c.req.json<{ email: string; password: string; display_name?: string }>()
    const { email, password, display_name } = body || ({} as any)
    if (!email || !password) return c.json({ error: 'Missing email or password' }, 400)

    const supabase = makeSupabase(c)
    const emailRedirectTo = getFrontendRedirectLogin(c)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo }
    })
    if (error) {
      // 若 email 已存在於 Supabase Auth，直接建立/同步 fronted_users 並回 200
      const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
      if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
      try {
        const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })
        // supabase-js v2 admin API
        // @ts-ignore
        const { data: userByEmail } = await (svc as any).auth.admin.getUserByEmail(email)
        const uid = userByEmail?.user?.id
        if (uid) {
          const payload: any = { id: uid, email }
          if (display_name) payload.display_name = display_name
          await svc.from('fronted_users').upsert(payload, { onConflict: 'id' })
          return c.json({ ok: true, exists: true, confirmation_sent: false })
        }
      } catch (_) {
        // fallthrough to error return
      }
      return c.json({ error: error.message || 'Register failed' }, 400)
    }

    const userId = data?.user?.id
    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    if (userId) {
      const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })
      const payload: any = { id: userId, email }
      if (display_name) payload.display_name = display_name
      await svc.from('fronted_users').upsert(payload, { onConflict: 'id' })
    }
    return c.json({ ok: true, confirmation_sent: true })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Register failed' }, 500)
  }
})

// POST /frontend/auth/login { email, password }
app.post('/frontend/auth/login', async (c) => {
  try {
    const body = await c.req.json<{ email: string; password: string }>()
    const { email, password } = body || ({} as any)
    if (!email || !password) return c.json({ error: 'Missing email or password' }, 400)

    const supabase = makeSupabase(c)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data?.session?.access_token) {
      const msg = isLocalRequest(c) ? (error?.message || 'Invalid credentials') : 'Invalid credentials'
      if (error) console.warn('frontend login failed:', error)
      return c.json({ error: msg }, 401)
    }
    const session = data.session
    const user = data.user

    // Ensure fronted_users has this user and is active
    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })
    const { data: frow, error: ferr } = await svc
      .from('fronted_users')
      .select('id,is_active,display_name')
      .eq('id', user.id)
      .single()
    if (ferr || !frow || frow.is_active === false) {
      return c.json({ error: 'Not a frontend user' }, 403)
    }

    setAuthCookies(c, session.access_token, session.expires_in ?? 900, session.refresh_token)
    return c.json({ user: { id: user.id, email: user.email, display_name: (frow as any).display_name ?? null } })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Login failed' }, 500)
  }
})

// GET /frontend/auth/me
app.get('/frontend/auth/me', async (c) => {
  try {
    const access = getCookie(c, ACCESS_COOKIE)
    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })
    if (access) {
      const supabase = makeSupabase(c)
      const { data, error } = await supabase.auth.getUser(access)
      if (!error && data?.user) {
        const user = data.user
        const { data: row } = await svc.from('fronted_users').select('id,is_active,display_name,email').eq('id', user.id).single()
        if (row && row.is_active !== false) return c.json({ id: user.id, email: user.email, display_name: (row as any).display_name ?? null })
      }
    }
    // Fallback: front-session
    const secret = c.env.ADMIN_SESSION_SECRET
    const token = getCookie(c, FRONT_SESSION_COOKIE)
    if (secret && token) {
      const parsed = await verifyFrontSessionToken(secret, token)
      if (parsed?.uid) {
        const { data: row } = await svc.from('fronted_users').select('id,is_active,display_name,email').eq('id', parsed.uid).single()
        if (row && row.is_active !== false) {
          return c.json({ id: row.id, email: (row as any).email ?? null, display_name: (row as any).display_name ?? null })
        }
      }
    }
    return c.json({ error: 'Unauthorized' }, 401)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal server error' }, 500)
  }
})

// POST /frontend/auth/logout
app.post('/frontend/auth/logout', async (c) => {
  try {
    // Clear cookies
    deleteCookie(c, ACCESS_COOKIE, { path: '/' })
    deleteCookie(c, REFRESH_COOKIE, { path: '/' })
    deleteCookie(c, FRONT_SESSION_COOKIE, { path: '/' })
    return c.json({ ok: true })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Logout failed' }, 500)
  }
})

// ---------- LINE Bind ----------
// GET /frontend/account/line/status
app.get('/frontend/account/line/status', async (c) => {
  try {
    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })

    // Resolve user id: prefer Supabase session, fallback to front-session (LINE login)
    let uid: string | null = null
    const access = getCookie(c, ACCESS_COOKIE)
    if (access) {
      const supabase = makeSupabase(c)
      const { data, error } = await supabase.auth.getUser(access)
      if (!error && data?.user?.id) uid = data.user.id
    }
    if (!uid) {
      const secret = c.env.ADMIN_SESSION_SECRET
      const token = getCookie(c, FRONT_SESSION_COOKIE)
      if (secret && token) {
        const parsed = await verifyFrontSessionToken(secret, token)
        if (parsed?.uid) uid = parsed.uid
      }
    }

    if (!uid) return c.json({ is_bound: false }, 200)

    const { data: row } = await svc
      .from('fronted_users')
      .select('line_user_id, line_display_name, line_picture_url')
      .eq('id', uid)
      .single()
    const isBound = !!row?.line_user_id
    return c.json({ is_bound: isBound, line_display_name: row?.line_display_name ?? null, line_picture_url: row?.line_picture_url ?? null })
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

function getRedirectBase(c: any) {
  // Use configured FRONTEND_LINE_REDIRECT_BASE, fallback to request origin
  const base = c.env.FRONTEND_LINE_REDIRECT_BASE
  if (base) return String(base).replace(/\/$/, '')
  try { return new URL(c.req.url).origin } catch { return '' }
}

function getFrontendLineCreds(c: any) {
  const clientId = c.env.FRONTEND_LINE_CHANNEL_ID
  const clientSecret = c.env.FRONTEND_LINE_CHANNEL_SECRET
  return { clientId, clientSecret }
}

function getFrontendSiteBase(c: any) {
  const site = c.env.FRONTEND_SITE_URL
  if (site) return String(site).replace(/\/$/, '')
  const base = getRedirectBase(c)
  return base
}

// GET /frontend/account/line/start -> redirect to LINE authorize (bind flow)
app.get('/frontend/account/line/start', async (c) => {
  const { clientId, clientSecret } = getFrontendLineCreds(c)
  if (!clientId || !clientSecret) return c.json({ error: 'LINE not configured' }, 500)
  const base = getRedirectBase(c)
  const redirectUri = `${base}/frontend/line/callback`
  // generate state with flow and store in cookie
  const nonce = Math.random().toString(36).slice(2)
  const state = `bind:${nonce}`
  setCookie(c, 'line-oauth-state', state, { httpOnly: true, sameSite: 'Lax', path: '/', maxAge: 600 })
  const scope = encodeURIComponent('profile openid')
  const authorizeUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&scope=${scope}`
  // optional debug: ?dryrun=1 to return the URL instead of redirecting
  try {
    const u = new URL(c.req.url)
    if (u.searchParams.get('dryrun') === '1') {
      return c.json({ authorizeUrl, redirect_uri: redirectUri, client_id: clientId, base, flow: 'bind' })
    }
  } catch {}
  return c.redirect(authorizeUrl, 302)
})

// ---------- LINE Login (on /login page) ----------
// GET /frontend/auth/line/start (login flow)
app.get('/frontend/auth/line/start', async (c) => {
  const { clientId, clientSecret } = getFrontendLineCreds(c)
  if (!clientId || !clientSecret) return c.json({ error: 'LINE not configured' }, 500)
  const base = getRedirectBase(c)
  const redirectUri = `${base}/frontend/line/callback`
  const nonce = Math.random().toString(36).slice(2)
  const state = `login:${nonce}`
  setCookie(c, 'line-oauth-state', state, { httpOnly: true, sameSite: 'Lax', path: '/', maxAge: 600 })
  const scope = encodeURIComponent('profile openid')
  const authorizeUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&scope=${scope}`
  // debug
  try {
    const u = new URL(c.req.url)
    if (u.searchParams.get('dryrun') === '1') {
      return c.json({ authorizeUrl, redirect_uri: redirectUri, client_id: clientId, base, flow: 'login' })
    }
  } catch {}
  return c.redirect(authorizeUrl, 302)
})

// Unified LINE OAuth callback for both flows
// GET /frontend/line/callback
app.get('/frontend/line/callback', async (c) => {
  try {
    const { clientId, clientSecret } = getFrontendLineCreds(c)
    if (!clientId || !clientSecret) return c.text('LINE not configured', 500)
    const url = new URL(c.req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const stored = getCookie(c, 'line-oauth-state')
    if (!code || !state || !stored || state !== stored) return c.text('Invalid state', 400)
    deleteCookie(c, 'line-oauth-state', { path: '/' })

    // parse flow from state prefix: "login:" or "bind:"
    const flow = state.split(':', 1)[0]

    const base = getRedirectBase(c)
    const redirectUri = `${base}/frontend/line/callback`
    const tokenResp = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, client_id: clientId, client_secret: clientSecret }).toString()
    })
    if (!tokenResp.ok) return c.text('LINE token error', 400)
    const tokenJson: any = await tokenResp.json()
    const lineAccess = tokenJson.access_token
    const profResp = await fetch('https://api.line.me/v2/profile', { headers: { Authorization: `Bearer ${lineAccess}` } })
    if (!profResp.ok) return c.text('LINE profile error', 400)
    const prof: any = await profResp.json()

    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.text('Server misconfigured', 500)
    const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })
    const frontendBase = getFrontendSiteBase(c)

    if (flow === 'bind') {
      // Ensure user session
      const access = getCookie(c, ACCESS_COOKIE)
      if (!access) return c.text('Unauthorized', 401)
      const supabase = makeSupabase(c)
      const { data: userRes } = await supabase.auth.getUser(access)
      const userId = userRes?.user?.id
      if (!userId) return c.text('Unauthorized', 401)

      await svc
        .from('fronted_users')
        .update({
          line_user_id: prof.userId,
          line_display_name: prof.displayName ?? null,
          line_picture_url: prof.pictureUrl ?? null
        })
        .eq('id', userId)

      return c.redirect(`${frontendBase}/account?line_bound=1`, 302)
    } else if (flow === 'login') {
      // Login flow: reconcile user and set front-session cookie
      // find existing fronted_users by line_user_id
      let uid: string | null = null
      const { data: existing } = await svc
        .from('fronted_users')
        .select('id,is_active')
        .eq('line_user_id', prof.userId)
        .maybeSingle()
      if (existing && existing.is_active !== false) {
        uid = (existing as any).id
        // verify auth user exists
        // @ts-ignore
        const { data: gotUser } = await (svc as any).auth.admin.getUserById(uid)
        if (!gotUser?.user) {
          // create a synthetic auth user to satisfy dual-table rule
          // @ts-ignore
          const { data: created } = await (svc as any).auth.admin.createUser({ email: `${prof.userId}@line.local`, email_confirm: true })
          if (created?.user?.id) uid = created.user.id
        }
      } else {
        // create auth user and fronted_users
        // @ts-ignore
        const { data: created } = await (svc as any).auth.admin.createUser({ email: `${prof.userId}@line.local`, email_confirm: true })
        uid = created?.user?.id ?? null
        if (uid) {
          await svc.from('fronted_users').upsert({ id: uid, email: `${prof.userId}@line.local`, line_user_id: prof.userId, line_display_name: prof.displayName ?? null, line_picture_url: prof.pictureUrl ?? null }, { onConflict: 'id' })
        } else {
          return c.text('Unable to create user', 500)
        }
      }

      if (!uid) return c.text('Unauthorized', 401)
      const secret = c.env.ADMIN_SESSION_SECRET
      if (!secret) return c.text('Server misconfigured', 500)
      const token = await createFrontSessionToken(secret, uid)
      setCookie(c, FRONT_SESSION_COOKIE, token, { httpOnly: true, sameSite: 'Lax', path: '/', maxAge: 60 * 60 * 24 * 7 })

      return c.redirect(`${frontendBase}/account?line_login=1`, 302)
    } else {
      return c.text('Invalid flow', 400)
    }
  } catch (e: any) {
    console.error('LINE login callback error', e)
    return c.text('Internal error', 500)
  }
})

export default app
