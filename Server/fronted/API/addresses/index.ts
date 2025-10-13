import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie } from 'hono/cookie'
import { createClient } from '@supabase/supabase-js'

const app = new Hono<{ Bindings: any }>({ strict: false })
app.use('*', cors({ origin: (o)=>o||'*', allowHeaders: ['Content-Type'], allowMethods: ['GET','POST','PATCH','DELETE','OPTIONS'], credentials: true }))

const ACCESS_COOKIE = 'sb-access-token'
const FRONT_SESSION_COOKIE = 'front-session'

function makeSupabase(c: any, accessToken?: string) {
  const url = c.env.SUPABASE_URL
  const anon = c.env.SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error('Missing SUPABASE env')
  const headers: Record<string,string> = {}
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers } })
}

async function verifyFrontSession(secret: string|undefined, token: string|undefined): Promise<string|null> {
  if (!secret || !token) return null
  try {
    const [p, sig] = String(token).split('.')
    if (!p || !sig) return null
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const got = await crypto.subtle.sign('HMAC', key, enc.encode(p))
    const b = String.fromCharCode(...new Uint8Array(got))
    const expect = btoa(b).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
    if (expect !== sig) return null
    const b64 = p.replace(/-/g,'+').replace(/_/g,'/')
    const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : ''
    const json = atob(b64 + pad)
    const payload = JSON.parse(new TextDecoder().decode(new Uint8Array([...json].map(ch=>ch.charCodeAt(0)))))
    if (!payload?.uid || !payload?.exp) return null
    if (payload.exp < Math.floor(Date.now()/1000)) return null
    return String(payload.uid)
  } catch { return null }
}

async function resolveUid(c: any): Promise<string|null> {
  const access = getCookie(c, ACCESS_COOKIE)
  if (access) {
    try {
      const supa = makeSupabase(c)
      const { data } = await supa.auth.getUser(access)
      if (data?.user?.id) return String(data.user.id)
    } catch {}
  }
  const uid = await verifyFrontSession(c.env.ADMIN_SESSION_SECRET, getCookie(c, FRONT_SESSION_COOKIE))
  return uid
}

function str(v: any): string|undefined { return typeof v === 'string' ? v.trim() : (v===null||v===undefined ? undefined : String(v).trim()) }
function has(obj:any, k:string){ return Object.prototype.hasOwnProperty.call(obj, k) }

// Create pickers (all required will be validated by caller)
function pickHomeCreate(body: any) {
  return {
    alias: str(body.alias) ?? undefined,
    receiver_name: str(body.receiver_name),
    receiver_phone: str(body.receiver_phone),
    zip3: str(body.zip3),
    city: str(body.city),
    district: str(body.district),
    address_line: str(body.address_line)
  }
}
function pickCvsCreate(body: any) {
  return {
    alias: str(body.alias) ?? undefined,
    vendor: str(body.vendor),
    store_id: str(body.store_id),
    store_name: str(body.store_name),
    store_address: str(body.store_address),
    receiver_name: str(body.receiver_name) ?? undefined,
    receiver_phone: str(body.receiver_phone) ?? undefined
  }
}

// Update pickers (only include provided fields)
function pickHomeUpdate(body: any) {
  const next: any = {}
  if (has(body,'alias')) next.alias = str(body.alias) ?? null
  if (has(body,'receiver_name')) next.receiver_name = str(body.receiver_name)
  if (has(body,'receiver_phone')) next.receiver_phone = str(body.receiver_phone)
  if (has(body,'zip3')) next.zip3 = str(body.zip3)
  if (has(body,'city')) next.city = str(body.city)
  if (has(body,'district')) next.district = str(body.district)
  if (has(body,'address_line')) next.address_line = str(body.address_line)
  return next
}
function pickCvsUpdate(body: any) {
  const next: any = {}
  if (has(body,'alias')) next.alias = str(body.alias) ?? null
  if (has(body,'vendor')) next.vendor = str(body.vendor)
  if (has(body,'store_id')) next.store_id = str(body.store_id)
  if (has(body,'store_name')) next.store_name = str(body.store_name)
  if (has(body,'store_address')) next.store_address = str(body.store_address)
  if (has(body,'receiver_name')) next.receiver_name = str(body.receiver_name) ?? null
  if (has(body,'receiver_phone')) next.receiver_phone = str(body.receiver_phone) ?? null
  return next
}

// GET /frontend/account/addresses?type=home|cvs
app.get('/frontend/account/addresses', async (c) => {
  try {
    const uid = await resolveUid(c)
    if (!uid) return c.json({ error: 'Unauthorized' }, 401)
    const type = String(c.req.query('type')||'').toLowerCase()
    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })
    if (type === 'home') {
      const { data } = await svc.from('fronted_users_home_addresses').select('*').eq('user_id', uid).eq('is_archived', false).order('is_default', { ascending: false }).order('updated_at', { ascending: false })
      return c.json(data || [])
    } else if (type === 'cvs') {
      const { data } = await svc.from('fronted_users_cvs_addresses').select('*').eq('user_id', uid).eq('is_archived', false).order('is_default', { ascending: false }).order('updated_at', { ascending: false })
      return c.json(data || [])
    }
    return c.json({ error: 'Invalid type' }, 400)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// POST /frontend/account/addresses { type, ... }
app.post('/frontend/account/addresses', async (c) => {
  try {
    const uid = await resolveUid(c)
    if (!uid) return c.json({ error: 'Unauthorized' }, 401)
    const body = await c.req.json().catch(()=>({}))
    const type = String(body.type||'').toLowerCase()
    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })

    if (type === 'home') {
      const v = pickHomeCreate(body)
      // 所有欄位必填：別稱、收件人、電話、郵遞區號、縣市、行政區、地址
      if (!v.alias || !v.receiver_name || !v.receiver_phone || !/^09\d{8}$/.test(v.receiver_phone) || !v.zip3 || !v.city || !v.district || !v.address_line) {
        return c.json({ error: 'Invalid payload' }, 400)
      }
      // first-of-type default
      const { count } = await svc.from('fronted_users_home_addresses').select('id', { count: 'exact', head: true }).eq('user_id', uid).eq('is_archived', false)
      const is_default = !count || count === 0 || !!body.is_default
      if (is_default) {
        await svc.from('fronted_users_home_addresses').update({ is_default: false }).eq('user_id', uid)
      }
      const { data, error } = await svc.from('fronted_users_home_addresses').insert([{ user_id: uid, ...v, is_default }]).select('*').single()
      if (error) return c.json({ error: 'Insert failed' }, 400)
      return c.json(data)
    } else if (type === 'cvs') {
      const v = pickCvsCreate(body)
      // 所有欄位必填：別稱、收件人、電話、物流、門市名稱、門市代號、門市地址
      if (!v.alias || !v.receiver_name || !v.receiver_phone || !/^09\d{8}$/.test(v.receiver_phone || '') || !v.vendor || !v.store_id || !v.store_name || !v.store_address) {
        return c.json({ error: 'Invalid payload' }, 400)
      }
      const { count } = await svc.from('fronted_users_cvs_addresses').select('id', { count: 'exact', head: true }).eq('user_id', uid).eq('is_archived', false)
      const is_default = !count || count === 0 || !!body.is_default
      if (is_default) {
        await svc.from('fronted_users_cvs_addresses').update({ is_default: false }).eq('user_id', uid)
      }
      const { data, error } = await svc.from('fronted_users_cvs_addresses').insert([{ user_id: uid, ...v, is_default }]).select('*').single()
      if (error) return c.json({ error: 'Insert failed' }, 400)
      return c.json(data)
    }
    return c.json({ error: 'Invalid type' }, 400)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// PATCH /frontend/account/addresses/:id
app.patch('/frontend/account/addresses/:id', async (c) => {
  try {
    const uid = await resolveUid(c)
    if (!uid) return c.json({ error: 'Unauthorized' }, 401)
    const id = c.req.param('id')
    const body = await c.req.json().catch(()=>({}))
    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })

    const type = String(body.type||'').toLowerCase()
    if (type === 'home') {
      const next: any = pickHomeUpdate(body)
      if (body.is_default === true) {
        await svc.from('fronted_users_home_addresses').update({ is_default: false }).eq('user_id', uid)
        next.is_default = true
      }
      // 當有提供欄位時，做基本驗證
      if (has(next,'receiver_phone') && next.receiver_phone && !/^09\d{8}$/.test(next.receiver_phone)) {
        return c.json({ error: 'Invalid phone' }, 400)
      }
      const { data, error } = await svc.from('fronted_users_home_addresses').update(next).eq('id', id).eq('user_id', uid).select('*').single()
      if (error) return c.json({ error: 'Update failed' }, 400)
      return c.json(data)
    } else if (type === 'cvs') {
      const next: any = pickCvsUpdate(body)
      if (body.is_default === true) {
        await svc.from('fronted_users_cvs_addresses').update({ is_default: false }).eq('user_id', uid)
        next.is_default = true
      }
      if (has(next,'receiver_phone') && next.receiver_phone && !/^09\d{8}$/.test(next.receiver_phone)) {
        return c.json({ error: 'Invalid phone' }, 400)
      }
      const { data, error } = await svc.from('fronted_users_cvs_addresses').update(next).eq('id', id).eq('user_id', uid).select('*').single()
      if (error) return c.json({ error: 'Update failed' }, 400)
      return c.json(data)
    }
    return c.json({ error: 'Invalid type' }, 400)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// DELETE /frontend/account/addresses/:id  (soft delete)
app.delete('/frontend/account/addresses/:id', async (c) => {
  try {
    const uid = await resolveUid(c)
    if (!uid) return c.json({ error: 'Unauthorized' }, 401)
    const id = c.req.param('id')
    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })
    // determine table and whether it is default before archiving
    const h = await svc.from('fronted_users_home_addresses').select('id,is_default').eq('id', id).eq('user_id', uid).maybeSingle()
    if (!h.error && h.data) {
      const wasDefault = !!h.data.is_default
      await svc.from('fronted_users_home_addresses').update({ is_archived: true, is_default: false }).eq('id', id).eq('user_id', uid)
      if (wasDefault) {
        // pick latest remaining as new default
        const pick = await svc.from('fronted_users_home_addresses').select('id').eq('user_id', uid).eq('is_archived', false).order('updated_at', { ascending: false }).limit(1).maybeSingle()
        if (!pick.error && pick.data) {
          await svc.from('fronted_users_home_addresses').update({ is_default: true }).eq('id', pick.data.id as any)
        }
      }
      return c.json({ ok: true })
    }
    const s = await svc.from('fronted_users_cvs_addresses').select('id,is_default').eq('id', id).eq('user_id', uid).maybeSingle()
    if (!s.error && s.data) {
      const wasDefault = !!s.data.is_default
      await svc.from('fronted_users_cvs_addresses').update({ is_archived: true, is_default: false }).eq('id', id).eq('user_id', uid)
      if (wasDefault) {
        const pick = await svc.from('fronted_users_cvs_addresses').select('id').eq('user_id', uid).eq('is_archived', false).order('updated_at', { ascending: false }).limit(1).maybeSingle()
        if (!pick.error && pick.data) {
          await svc.from('fronted_users_cvs_addresses').update({ is_default: true }).eq('id', pick.data.id as any)
        }
      }
      return c.json({ ok: true })
    }
    return c.json({ error: 'Not found' }, 404)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

// GET /frontend/account/zip/:zip3  -> { zip3, city, district }
app.get('/frontend/account/zip/:zip3', async (c) => {
  try {
    const zip3 = (c.req.param('zip3') || '').toString().trim()
    if (!/^\d{3}$/.test(zip3)) return c.json({ error: 'Invalid zip3' }, 400)
    const serviceKey = c.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) return c.json({ error: 'Server misconfigured' }, 500)
    const svc = createClient(c.env.SUPABASE_URL, serviceKey, { auth: { persistSession: false } })
    const { data } = await svc.from('fronted_address_zip_map').select('zip3,city,district').eq('zip3', zip3).maybeSingle()
    if (!data) return c.json({ error: 'Not found' }, 404)
    return c.json(data)
  } catch (e: any) {
    return c.json({ error: e?.message || 'Internal error' }, 500)
  }
})

export default app
