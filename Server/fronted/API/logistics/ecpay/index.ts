import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'

const app = new Hono<{ Bindings: any }>({ strict: false })
app.use('*', cors({ origin: (o)=>o||'*', allowHeaders: ['Content-Type'], allowMethods: ['GET','POST','OPTIONS'], credentials: true }))

function logisticsAPIBase(env?: string) {
  // 空字串或非 'stage' 一律使用正式環境
  return (env && env.toLowerCase() === 'stage')
    ? 'https://logistics-stage.ecpay.com.tw/Express'
    : 'https://logistics.ecpay.com.tw/Express'
}

async function sha256HexUpper(s: string) {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(s))
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase()
}

function normalizeUrlEncoded(str: string) {
  return encodeURIComponent(str)
    .toLowerCase()
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+')
}

function buildCMV(params: Record<string,string>, key: string, iv: string) {
  const sorted = Object.keys(params).filter(k=>params[k]!==undefined && params[k] !== '').sort((a,b)=>a.localeCompare(b,'en')).map(k=>`${k}=${params[k]}`).join('&')
  const raw = `HashKey=${key}&${sorted}&HashIV=${iv}`
  return sha256HexUpper(normalizeUrlEncoded(raw))
}

function makeSvc(c: any) {
  const url = c.env.SUPABASE_URL as string
  const key = c.env.SUPABASE_SERVICE_ROLE_KEY as string
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { persistSession: false } })
}

function tableFor(logisticsType: string, reverse: boolean) {
  const lt = logisticsType.toLowerCase()
  if (reverse) {
    if (lt === 'home') return 'fronted_home_reverse_logistics_order'
    return 'fronted_b2c_reverse_logistics_order'
  }
  if (lt === 'home') return 'fronted_home_logistics_order'
  // CVS: use c2c or b2c depending on subType naming if provided by caller
  return null // decide by caller's mode param
}

function decideCvsTable(mode?: string, reverse?: boolean) {
  // 不再支援 B2C 與 CVS 逆物流，僅允許 C2C 正向
  if (reverse) return null
  return 'fronted_c2c_logistics_order'
}

async function callEcpayCreate(c: any, payload: Record<string,string>, reverse: boolean, type: 'CVS'|'Home') {
  const base = logisticsAPIBase(c.env.ECPAY_ENV || 'stage')
  const endpoint = reverse
    ? (type === 'Home' ? base + '/ReturnHome' : base + '/ReturnCVS')
    : (base + '/Create')

  // ECPay expects application/x-www-form-urlencoded
  const form = new URLSearchParams()
  Object.entries(payload).forEach(([k,v])=>form.append(k, v ?? ''))

  const res = await fetch(endpoint, { method: 'POST', body: form, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
  const text = await res.text()
  // ECPay usually returns key=value&...
  const out: Record<string,string> = {}
  text.split('&').forEach(pair=>{
    const [k,...rest] = pair.split('=')
    if (!k) return
    out[k] = decodeURIComponent((rest.join('=')||'').replace(/\+/g,' '))
  })
  return { ok: res.ok, status: res.status, body: text, data: out }
}

function intOrNull(v: any){ const n = parseInt(String(v ?? ''), 10); return Number.isFinite(n) ? n : null }

async function upsertLogistics(c: any, table: string, fields: any) {
  const svc = makeSvc(c)
  const { error } = await svc.from(table).upsert(fields, { onConflict: 'merchant_trade_no' })
  if (error) throw new Error(error.message)
}

app.post('/frontend/logistics/ecpay/create', async (c) => {
  try {
    const body = await c.req.json()
    const reverse = !!body?.reverse
    const mode = String(body?.mode || 'B2C').toUpperCase() // for CVS: C2C | B2C
    const logisticsType = String(body?.logisticsType || 'CVS') // CVS | Home

    const env = String(c.env.ECPAY_ENV || '')
    const isStage = env.toLowerCase() === 'stage'

    // 選擇適用的物流商店代號與金鑰
    let merchantId = ''
    let key = ''
    let iv = ''
    if (isStage) {
      // 測試環境：C2C 與 Home 可能有不同測試商店
      if (logisticsType === 'CVS' && (mode === 'C2C')) {
        merchantId = c.env.ECPAY_LOGISTICS_C2C_MERCHANT_ID || c.env.ECPAY_LOGISTICS_MERCHANT_ID || ''
        key = c.env.ECPAY_LOGISTICS_C2C_HASH_KEY || c.env.ECPAY_LOGISTICS_HASH_KEY || c.env.ECPAY_HASH_KEY || ''
        iv = c.env.ECPAY_LOGISTICS_C2C_HASH_IV || c.env.ECPAY_LOGISTICS_HASH_IV || c.env.ECPAY_HASH_IV || ''
      } else if (logisticsType === 'Home') {
        merchantId = c.env.ECPAY_LOGISTICS_HOME_MERCHANT_ID || c.env.ECPAY_LOGISTICS_MERCHANT_ID || ''
        key = c.env.ECPAY_LOGISTICS_HOME_HASH_KEY || c.env.ECPAY_LOGISTICS_HASH_KEY || c.env.ECPAY_HASH_KEY || ''
        iv = c.env.ECPAY_LOGISTICS_HOME_HASH_IV || c.env.ECPAY_LOGISTICS_HASH_IV || c.env.ECPAY_HASH_IV || ''
      } else {
        merchantId = c.env.ECPAY_LOGISTICS_MERCHANT_ID || ''
        key = c.env.ECPAY_LOGISTICS_HASH_KEY || c.env.ECPAY_HASH_KEY || ''
        iv = c.env.ECPAY_LOGISTICS_HASH_IV || c.env.ECPAY_HASH_IV || ''
      }
    } else {
      // 正式環境：使用統一物流金鑰
      merchantId = c.env.ECPAY_LOGISTICS_MERCHANT_ID || ''
      key = c.env.ECPAY_LOGISTICS_HASH_KEY || c.env.ECPAY_HASH_KEY || ''
      iv = c.env.ECPAY_LOGISTICS_HASH_IV || c.env.ECPAY_HASH_IV || ''
    }
    if (!merchantId || !key || !iv) return c.json({ error: 'ECPay logistics not configured' }, 500)

    // caller must provide the minimal required fields per ECPay
    const tradeNo = String(body?.merchantTradeNo || '')
    if (!tradeNo) return c.json({ error: 'merchantTradeNo required' }, 400)

    // 預設寄件人資訊（若前端未提供 sender，以環境變數補值）
    // 依物流類型優先選擇專用設定，缺少時回退到通用 LOGISTICS_SENDER_*
    const senderDefaults = (() => {
      if (logisticsType === 'Home') {
        return {
          name: String(c.env.LOGISTICS_SENDER_HOME_NAME || c.env.LOGISTICS_SENDER_NAME || ''),
          phone: String(c.env.LOGISTICS_SENDER_HOME_PHONE || c.env.LOGISTICS_SENDER_PHONE || ''),
          cellphone: String(c.env.LOGISTICS_SENDER_HOME_CELLPHONE || c.env.LOGISTICS_SENDER_CELLPHONE || ''),
          zip: String(c.env.LOGISTICS_SENDER_HOME_ZIP || c.env.LOGISTICS_SENDER_ZIP || ''),
          address: String(c.env.LOGISTICS_SENDER_HOME_ADDRESS || c.env.LOGISTICS_SENDER_ADDRESS || ''),
        }
      }
      // CVS / others
      return {
        name: String(c.env.LOGISTICS_SENDER_C2C_NAME || c.env.LOGISTICS_SENDER_NAME || ''),
        phone: String(c.env.LOGISTICS_SENDER_C2C_PHONE || c.env.LOGISTICS_SENDER_PHONE || ''),
        cellphone: String(c.env.LOGISTICS_SENDER_C2C_CELLPHONE || c.env.LOGISTICS_SENDER_CELLPHONE || ''),
        zip: String(c.env.LOGISTICS_SENDER_C2C_ZIP || c.env.LOGISTICS_SENDER_ZIP || ''),
        address: String(c.env.LOGISTICS_SENDER_C2C_ADDRESS || c.env.LOGISTICS_SENDER_ADDRESS || ''),
      }
    })()

    const payload: Record<string,string> = {
      MerchantID: String(merchantId),
      MerchantTradeNo: tradeNo,
      LogisticsType: logisticsType,
      LogisticsSubType: String(body?.logisticsSubType || ''),
      GoodsAmount: String(intOrNull(body?.goodsAmount) ?? 0),
      IsCollection: String(body?.isCollection || 'N'),
      CollectionAmount: String(intOrNull(body?.collectionAmount) ?? 0),
      GoodsName: String(body?.goodsName || '商品'),
      SenderName: String(body?.sender?.name || senderDefaults.name),
      SenderPhone: String(body?.sender?.phone || senderDefaults.phone),
      SenderCellPhone: String(body?.sender?.cellphone || senderDefaults.cellphone),
      SenderZipCode: String(body?.sender?.zip || senderDefaults.zip),
      SenderAddress: String(body?.sender?.address || senderDefaults.address),
      ReceiverName: String(body?.receiver?.name || ''),
      ReceiverPhone: String(body?.receiver?.phone || ''),
      ReceiverCellPhone: String(body?.receiver?.cellphone || ''),
      ReceiverEmail: String(body?.receiver?.email || ''),
      ReceiverZipCode: String(body?.receiver?.zip || ''),
      ReceiverAddress: String(body?.receiver?.address || ''),
      ServerReplyURL: String(body?.serverReplyURL || ''),
      ClientReplyURL: String(body?.clientReplyURL || ''),
      Temperature: String(body?.temperature || ''),
      Distance: String(body?.distance || ''),
      Specification: String(body?.specification || ''),
      ScheduledPickupTime: String(body?.scheduledPickupTime || ''),
      ScheduledDeliveryTime: String(body?.scheduledDeliveryTime || ''),
      ScheduledDeliveryDate: String(body?.scheduledDeliveryDate || ''),
      Remark: String(body?.remark || ''),
      PlatformID: String(body?.platformId || ''),
    }

    // CVS specific: store id
    if (logisticsType === 'CVS') {
      if (reverse) {
        return c.json({ error: 'CVS reverse logistics not supported' }, 400)
      }
      payload.ReceiverStoreID = String(body?.receiver?.storeId || '')
      if (reverse) {
        payload.ReturnStoreID = String(body?.returnStoreId || '')
      }
    }

    // 基本必填檢查（避免送出到綠界才失敗）
    if (logisticsType === 'CVS') {
      if (!String(body?.receiver?.storeId || '')) {
        return c.json({ error: 'ReceiverStoreID required for CVS' }, 400)
      }
      if (!payload.ReceiverName || !(payload.ReceiverPhone || payload.ReceiverCellPhone)) {
        return c.json({ error: 'Receiver name and phone required for CVS' }, 400)
      }
    } else if (logisticsType === 'Home') {
      if (!payload.ReceiverZipCode || !payload.ReceiverAddress) {
        return c.json({ error: 'Receiver zip and address required for Home' }, 400)
      }
    }

    // Compute CMV
    payload.CheckMacValue = await buildCMV(payload, key, iv)

    // Call ECPay
    const result = await callEcpayCreate(c, payload, reverse, logisticsType as ('CVS'|'Home'))

    // Decide target table
    let table = tableFor(logisticsType, reverse)
    if (!table && logisticsType === 'CVS') {
      table = decideCvsTable(mode, reverse)
    }
    if (!table) return c.json({ error: 'Unable to decide table' }, 400)

    // Upsert DB
    const rtn_code = String(result.data?.RtnCode || '')
    const rtn_msg = String(result.data?.RtnMsg || '')
    const success = (rtn_code === '1') || Boolean(result.data?.LogisticsID || result.data?.AllPayLogisticsID)

    const common = {
      merchant_id: merchantId,
      merchant_trade_no: tradeNo,
      logistics_type: logisticsType,
      logistics_sub_type: String(body?.logisticsSubType || ''),
      goods_amount: intOrNull(body?.goodsAmount) ?? null,
      is_collection: String(body?.isCollection || 'N'),
      collection_amount: intOrNull(body?.collectionAmount) ?? null,
      goods_name: String(body?.goodsName || '商品'),
      sender_name: String(body?.sender?.name || ''),
      sender_phone: String(body?.sender?.phone || ''),
      sender_cellphone: String(body?.sender?.cellphone || ''),
      sender_zip_code: String(body?.sender?.zip || ''),
      sender_address: String(body?.sender?.address || ''),
      receiver_name: String(body?.receiver?.name || ''),
      receiver_phone: String(body?.receiver?.phone || ''),
      receiver_cellphone: String(body?.receiver?.cellphone || ''),
      receiver_email: String(body?.receiver?.email || ''),
      receiver_zip_code: String(body?.receiver?.zip || ''),
      receiver_address: String(body?.receiver?.address || ''),
      receiver_store_id: String(body?.receiver?.storeId || ''),
      return_store_id: String(body?.returnStoreId || ''),
      server_reply_url: String(body?.serverReplyURL || ''),
      client_reply_url: String(body?.clientReplyURL || ''),
      check_mac_value: payload.CheckMacValue,
      status: success ? 'created' : 'failed',
      rtn_code,
      rtn_msg,
      raw_result: result.data || {},
    }

    // Some responses include LogisticsID / BookingNote
    const fields = {
      ...common,
      logistics_id: result.data?.AllPayLogisticsID || result.data?.LogisticsID || '',
      booking_note: result.data?.BookingNote || '',
      trade_desc: String(body?.tradeDesc || ''),
      temperature: String(body?.temperature || ''),
      distance: String(body?.distance || ''),
      specification: String(body?.specification || ''),
      scheduled_pickup_time: String(body?.scheduledPickupTime || ''),
      scheduled_delivery_time: String(body?.scheduledDeliveryTime || ''),
      scheduled_delivery_date: String(body?.scheduledDeliveryDate || ''),
      remark: String(body?.remark || ''),
      platform_id: String(body?.platformId || ''),
    }

    await upsertLogistics(c, table, fields)

    return c.json({ ok: success, status: result.status, rtnCode: rtn_code, rtnMsg: rtn_msg, data: result.data })
  } catch (e: any) {
    return c.json({ error: e?.message || 'error' }, 500)
  }
})

export default app
