import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'

const app = new Hono<{ Bindings: any }>({ strict: false })
app.use('*', cors({ origin: (o)=>o||'*', allowHeaders: ['Content-Type'], allowMethods: ['GET','POST','OPTIONS'], credentials: true }))

function endpoint(env?: string) {
  // 空字串或非 'stage' 一律使用正式環境
  return (env && env.toLowerCase() === 'stage')
    ? 'https://logistics-stage.ecpay.com.tw/Express/map'
    : 'https://logistics.ecpay.com.tw/Express/map'
}
function cashierEndpoint(env?: string) {
  return (env && env.toLowerCase() === 'stage')
    ? 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
    : 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'
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
    // ECPay 規範：空白需轉為加號（%20 -> +）
    .replace(/%20/g, '+')
}

function buildCMV(params: Record<string,string>, key: string, iv: string) {
  const sorted = Object.keys(params).filter(k=>params[k]!==undefined && params[k] !== '').sort((a,b)=>a.localeCompare(b,'en')).map(k=>`${k}=${params[k]}`).join('&')
  const raw = `HashKey=${key}&${sorted}&HashIV=${iv}`
  return sha256HexUpper(normalizeUrlEncoded(raw))
}

function pad2(n: number) { return String(n).padStart(2, '0') }
function formatTradeDate(d = new Date()) {
  // yyyy/MM/dd HH:mm:ss
  return `${d.getFullYear()}/${pad2(d.getMonth()+1)}/${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}
function genTradeNo(prefix = 'MRE') {
  const ts = Date.now().toString().slice(-10) // 10 digits
  const rand = Math.floor(Math.random()*1000).toString().padStart(3,'0')
  return (prefix + ts + rand).slice(0, 20)
}

function choosePaymentFrom(method: string) {
  // Map frontend method to ECPay ChoosePayment
  switch (method) {
    case 'CREDIT':
    case 'INSTALLMENT':
      return 'Credit'
    case 'ATM':
      return 'ATM'
    case 'CVS':
    case 'CVS_CODE':
      return 'CVS'
    case 'WEBATM':
      return 'WebATM'
    case 'TWQR':
      return 'TWQR'
    default:
      return 'Credit'
  }
}

// ===== Supabase helpers =====
type Env = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

function makeSvc(c: any) {
  const url = c.env.SUPABASE_URL as string
  const key = (c.env.SUPABASE_SERVICE_ROLE_KEY || '') as string
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key, { auth: { persistSession: false } })
}

function detectMethodFromPaymentType(paymentType: string) {
  const pt = String(paymentType || '').toLowerCase()
  if (pt.includes('credit')) return 'credit'
  if (pt.includes('webatm')) return 'webatm'
  if (pt.includes('atm')) return 'atm'
  if (pt.includes('cvs')) return 'cvscode'
  return 'credit'
}

function intOrNull(v: any) {
  const n = parseInt(String(v ?? ''), 10)
  return Number.isFinite(n) ? n : null
}

function numOrNull(v: any) {
  const n = Number(String(v ?? ''))
  return Number.isFinite(n) ? n : null
}

// ===== Logistics creation after payment success =====
async function createLogisticsAfterPaid(c: any, tradeNo: string, tradeAmt: number) {
  const svc = makeSvc(c)
  // 讀取在 checkout 時保存的需求
  const { data: req, error } = await svc
    .from('fronted_checkout_request')
    .select('*')
    .eq('merchant_trade_no', tradeNo)
    .maybeSingle()
  if (error) throw new Error('read checkout_request failed')
  if (!req || !req.create_logistics) return { skipped: true }
  if (req.logistics_created_at) return { skipped: true, reason: 'already-created' }

  // 準備呼叫物流 API
  let base = ''
  try { const u = new URL(c.req.url); base = u.origin } catch {}
  const frontBase = String(c.env.FRONTEND_SITE_URL || base)

  const logistics = req.logistics || {}
  const body = {
    merchantTradeNo: tradeNo,
    logisticsType: String(logistics?.type || 'CVS'),
    logisticsSubType: String(logistics?.subType || ''),
    mode: String(logistics?.mode || 'B2C'),
    reverse: !!logistics?.reverse,
    goodsAmount: Number(logistics?.goodsAmount || tradeAmt || 0),
    isCollection: String(logistics?.isCollection || 'N'),
    collectionAmount: Number(logistics?.collectionAmount || 0),
    goodsName: String(logistics?.goodsName || 'Marelle 訂單商品'),
    sender: logistics?.sender || {},
    receiver: logistics?.receiver || {},
    serverReplyURL: `${base}/frontend/logistics/ecpay/notify`,
    clientReplyURL: `${frontBase}/orders/shipment`,
    temperature: String(logistics?.temperature || ''),
    distance: String(logistics?.distance || ''),
    specification: String(logistics?.specification || ''),
    scheduledPickupTime: String(logistics?.scheduledPickupTime || ''),
    scheduledDeliveryTime: String(logistics?.scheduledDeliveryTime || ''),
    scheduledDeliveryDate: String(logistics?.scheduledDeliveryDate || ''),
    remark: String(logistics?.remark || ''),
    platformId: String(logistics?.platformId || ''),
  }

  const res = await fetch(base + '/frontend/logistics/ecpay/create', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  })
  const json = await res.json().catch(()=>({}))
  try { console.log('[ECPay][logistics][create][after-paid]', tradeNo, { status: res.status, ok: json?.ok, rtnCode: json?.rtnCode, rtnMsg: json?.rtnMsg }) } catch {}

  // 紀錄結果，避免重複建立
  await svc.from('fronted_checkout_request').update({ logistics_created_at: new Date().toISOString(), logistics_last_result: json }).eq('merchant_trade_no', tradeNo)
  return { ok: !!json?.ok, result: json }
}

async function upsertPayment(c: any, body: Record<string, any>) {
  const svc = makeSvc(c)
  const paymentType = String(body['PaymentType'] || '')
  const method = detectMethodFromPaymentType(paymentType)
  const common = {
    merchant_id: String(body['MerchantID'] || ''),
    merchant_trade_no: String(body['MerchantTradeNo'] || ''),
    rtn_code: intOrNull(body['RtnCode']) ?? null,
    rtn_msg: String(body['RtnMsg'] || ''),
    trade_no: String(body['TradeNo'] || ''),
    trade_amt: intOrNull(body['TradeAmt']) ?? null,
    payment_date: String(body['PaymentDate'] || ''),
    payment_type: paymentType,
    payment_type_charge_fee: numOrNull(body['PaymentTypeChargeFee']) ?? null,
    trade_date: String(body['TradeDate'] || ''),
    simulate_paid: intOrNull(body['SimulatePaid']) ?? null,
    check_mac_value: String(body['CheckMacValue'] || ''),
    raw_result: body as any
  }

  if (method === 'credit') {
    const row = {
      ...common,
      gwsr: String(body['Gwsr'] || ''),
      process_date: String(body['ProcessDate'] || ''),
      auth_code: String(body['AuthCode'] || ''),
      amount: intOrNull(body['Amount']) ?? null,
      eci: String(body['ECI'] || ''),
      card4no: String(body['Card4No'] || ''),
      card6no: String(body['Card6No'] || ''),
      red_dan: String(body['RedDan'] || ''),
      red_de_amt: intOrNull(body['RedDeAmt']) ?? null,
      red_ok_amt: intOrNull(body['RedOkAmt']) ?? null,
      stage: String(body['Stage'] || ''),
      stast: String(body['Stast'] || ''),
    }
    const { error } = await svc
      .from('fronted_credit_order')
      .upsert(row, { onConflict: 'merchant_trade_no' })
    if (error) throw new Error('upsert credit failed')
    return { method }
  }

  if (method === 'atm') {
    const row = {
      ...common,
      bank_code: String(body['BankCode'] || ''),
      v_account: String(body['vAccount'] || ''),
      expire_date: String(body['ExpireDate'] || ''),
    }
    const { error } = await svc
      .from('fronted_atm_order')
      .upsert(row, { onConflict: 'merchant_trade_no' })
    if (error) throw new Error('upsert atm failed')
    return { method }
  }

  if (method === 'cvscode') {
    const row = {
      ...common,
      payment_no: String(body['PaymentNo'] || ''),
      expire_date: String(body['ExpireDate'] || ''),
    }
    const { error } = await svc
      .from('fronted_cvscode_order')
      .upsert(row, { onConflict: 'merchant_trade_no' })
    if (error) throw new Error('upsert cvscode failed')
    return { method }
  }

  if (method === 'webatm') {
    const row = { ...common }
    const { error } = await svc
      .from('fronted_webatm_order')
      .upsert(row, { onConflict: 'merchant_trade_no' })
    if (error) throw new Error('upsert webatm failed')
    return { method }
  }

  return { method }
}

async function buildStartHtml(c: any) {
  const env = (c.env.ECPAY_ENV || 'stage') as string
  const action = endpoint(env)

  // 取得前端指定的超商子類別，預設 FAMIC2C
  const subType = (c.req.query('subType') || 'FAMIC2C').toString().toUpperCase()
  const isC2C = ['FAMIC2C','UNIMARTC2C','HILIFEC2C','OKMARTC2C'].includes(subType)

  // 在測試環境優先使用 C2C 的測試金鑰；若未提供則回退到統一物流金鑰；最後回退到共用 ECPAY_HASH_*
  let merchantId = ''
  let key = ''
  let iv = ''
  if ((env && env.toLowerCase() === 'stage') && isC2C) {
    merchantId = c.env.ECPAY_LOGISTICS_C2C_MERCHANT_ID || c.env.ECPAY_LOGISTICS_MERCHANT_ID || ''
    key = c.env.ECPAY_LOGISTICS_C2C_HASH_KEY || c.env.ECPAY_LOGISTICS_HASH_KEY || c.env.ECPAY_HASH_KEY || ''
    iv = c.env.ECPAY_LOGISTICS_C2C_HASH_IV || c.env.ECPAY_LOGISTICS_HASH_IV || c.env.ECPAY_HASH_IV || ''
  } else {
    merchantId = c.env.ECPAY_LOGISTICS_MERCHANT_ID || ''
    key = c.env.ECPAY_LOGISTICS_HASH_KEY || c.env.ECPAY_HASH_KEY || ''
    iv = c.env.ECPAY_LOGISTICS_HASH_IV || c.env.ECPAY_HASH_IV || ''
  }
  if (!merchantId || !key || !iv) return c.text('ECPay not configured', 500)

  // Build ReturnURL based on current origin
  let base = ''
  try { const u = new URL(c.req.url); base = u.origin } catch {}
  const debug = (c.req.query('debug') || '') === '1'
  const returnURL = `${base}/frontend/account/ecpay/map/return${debug ? '?debug=1' : ''}`

  const payload: Record<string,string> = {
    MerchantID: merchantId,
    LogisticsType: 'CVS',
    LogisticsSubType: subType,
    IsCollection: 'N',
    ServerReplyURL: returnURL,
    ReturnURL: returnURL,
  }
  const cmv = await buildCMV(payload, key, iv)
  const html = `<!doctype html><html><body>
    <form id="f" method="POST" action="${action}">
      ${Object.entries(payload).map(([k,v])=>`<input type="hidden" name="${k}" value="${v}"/>`).join('')}
      <input type="hidden" name="CheckMacValue" value="${cmv}" />
    </form>
    <script>document.getElementById('f').submit();</script>
  </body></html>`
  return c.html(html)
}

// POST /frontend/account/ecpay/map/start?subType=FAMIC2C
app.post('/frontend/account/ecpay/map/start', buildStartHtml)

// GET  /frontend/account/ecpay/map/start?subType=FAMIC2C
// 說明：前端以 window.open + location.href（GET）開啟時使用，回傳同樣的自動送出表單 HTML。
app.get('/frontend/account/ecpay/map/start', buildStartHtml)

// POST /frontend/account/ecpay/map/return
app.post('/frontend/account/ecpay/map/return', async (c) => {
  const body = await c.req.parseBody()
  const data = {
    store_id: String(body['CVSStoreID'] || ''),
    store_name: String(body['CVSStoreName'] || ''),
    store_address: String(body['CVSAddress'] || ''),
    sub_type: String(body['LogisticsSubType'] || ''),
  }
  const payload = JSON.stringify(data).replace(/</g, '\\u003c')
    const targetOrigin = (c.env.FRONTEND_SITE_URL || '*') as string
  const debug = (c.req.query('debug') || '') === '1'
  if (debug) {
    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>ECPay Map Debug</title></head><body style="font-family: ui-sans-serif, system-ui; padding:16px;">
      <h3>收到綠界回傳資料 (Debug)</h3>
      <pre id="p" style="background:#f6f8fa;padding:12px;border-radius:6px;">${payload}</pre>
      <div style="margin-top:12px;display:flex;gap:8px;">
        <button id="send" style="padding:6px 10px;border:1px solid #ddd;border-radius:6px;">回傳至 opener 並關閉</button>
      </div>
      <script>
        const payload = ${payload};
        document.getElementById('send').onclick = () => {
          try {
              // 保留本視窗所在來源的 localStorage（除錯/後援）
              localStorage.setItem('ecpay_map_store', JSON.stringify(payload));
              // 直接將資料夾帶回 opener，避免跨網域 localStorage 無法共享
              var __data = payload;
              if (window.opener) { window.opener.postMessage({ type: 'ecpay:cvs:selected', data: __data }, '${targetOrigin}'); }
          } catch (e) {}
          window.close();
        };
      </script>
    </body></html>`
    return c.html(html)
  } else {
    const html = `<!doctype html><html><body>
      <script>
        try {
            // 保留本視窗所在來源的 localStorage（除錯/後援）
            localStorage.setItem('ecpay_map_store', '${payload}');
            // 直接將資料夾帶回 opener，避免跨網域 localStorage 無法共享
            var __data = JSON.parse('${payload}');
            if (window.opener) { window.opener.postMessage({ type: 'ecpay:cvs:selected', data: __data }, '${targetOrigin}'); }
        } catch (e) {}
        window.close();
      </script>
    </body></html>`
    return c.html(html)
  }
})

// ===================== 金流：建立交易與回傳 =====================

// POST /frontend/pay/ecpay/checkout
// Body: { method: 'CREDIT'|'ATM'|'CVS_CODE'|'WEBATM'|'TWQR', amount: number, order: {...} }
app.post('/frontend/pay/ecpay/checkout', async (c) => {
  try {
    const env = (c.env.ECPAY_ENV || 'stage') as string
    const action = cashierEndpoint(env)
    const body = await c.req.json()
  const method = String(body?.method || 'CREDIT').toUpperCase()
    const amount = parseInt(String(body?.amount || '0'), 10) || 0
  const order = body?.order || {}
  const createLogistics = !!body?.createLogistics
  const logistics = body?.logistics || null

    // 允許的付款方式（新增：CVS_COD=超商取貨付款）
    const allowed = new Set(['CREDIT','ATM','CVS_CODE','WEBATM','CVS_COD'])
    if (!allowed.has(method)) {
      return c.text('Unsupported payment method', 400)
    }

    // Merchant parameters
  const merchantId = c.env.ECPAY_PAYMENT_MERCHANT_ID || c.env.ECPAY_MERCHANT_ID || c.env.ECPAY_LOGISTICS_MERCHANT_ID
  const key = c.env.ECPAY_PAYMENT_HASH_KEY || c.env.ECPAY_HASH_KEY
  const iv = c.env.ECPAY_PAYMENT_HASH_IV || c.env.ECPAY_HASH_IV
    if (!merchantId || !key || !iv) return c.text('ECPay payment not configured', 500)

    if (!(amount > 0)) return c.text('Invalid amount', 400)

  // Build URLs based on current origin (API) and configured frontend site
  let base = ''
  try { const u = new URL(c.req.url); base = u.origin } catch {}
  const frontBase = String(c.env.FRONTEND_SITE_URL || base)

    const tradeNo = genTradeNo('MRE')
    const tradeDate = formatTradeDate(new Date())
    const choosePayment = choosePaymentFrom(method)

    // Minimal item summary
    const items = Array.isArray(order?.items) ? order.items : []
    const names = items.map((it: any) => String(it?.name || '品項')).slice(0,5)
    const itemName = (names.length ? names.join('#') : 'Marelle 訂單')

    // ECPay requires url-encoded TradeDesc; we'll keep ASCII safe content
    const tradeDesc = 'Marelle 訂單付款'

    const payload: Record<string,string> = {
      MerchantID: String(merchantId),
      MerchantTradeNo: tradeNo,
      MerchantTradeDate: tradeDate,
      PaymentType: 'aio',
      TotalAmount: String(amount),
      TradeDesc: tradeDesc,
      ItemName: itemName,
      ReturnURL: `${base}/frontend/pay/ecpay/notify`,
      OrderResultURL: `${base}/frontend/pay/ecpay/result`,
      // 使用前端站台的返回網址，避免導到 API 網域造成 404
      ClientBackURL: `${frontBase}/checkout`,
      ChoosePayment: choosePayment,
      EncryptType: '1'
    }

    // Optional fields by method
    if (choosePayment === 'ATM') {
      // StoreExpireDate: 1~60 days (default 3); we can skip to use default on ECPay
    } else if (choosePayment === 'CVS') {
      // StoreExpireDate: default 7 days, can be set 1~60; skip for now
    }

  const cmv = await buildCMV(payload, key, iv)

    // 在付款前只保存建立物流的需求與資料，不實際建立；待付款成功（RtnCode=1）再建立。
    try {
      const svc = makeSvc(c)
      await svc.from('fronted_checkout_request').upsert({
        merchant_trade_no: tradeNo,
        create_logistics: !!createLogistics,
        logistics: logistics || null,
        order_json: order || null,
        payment_method: method,
      })
    } catch (e: any) {
      try { console.error('[ECPay][checkout] save request error', e?.message) } catch {}
      // 不阻斷付款流程
    }

    // 例外：超商取貨付款（CVS_COD 或 logistics.isCollection='Y'）需先建立物流單，因為付款發生在取貨現場
    if (method === 'CVS_COD' || (createLogistics && logistics && String(logistics?.type || 'CVS') === 'CVS' && String(logistics?.isCollection || 'N') === 'Y')) {
      try {
        const res = await fetch(base + '/frontend/logistics/ecpay/create', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            merchantTradeNo: tradeNo,
            logisticsType: 'CVS',
            logisticsSubType: String(logistics?.subType || ''),
            mode: 'C2C',
            reverse: !!logistics?.reverse,
            goodsAmount: Number(logistics?.goodsAmount || amount),
            isCollection: 'Y',
            collectionAmount: Number(logistics?.collectionAmount || 0),
            goodsName: String(logistics?.goodsName || itemName),
            sender: logistics?.sender || {},
            receiver: logistics?.receiver || {},
            serverReplyURL: `${base}/frontend/logistics/ecpay/notify`,
            clientReplyURL: `${frontBase}/orders/shipment`,
          })
        })
        try { const data = await res.clone().json().catch(()=>null); console.log('[ECPay][logistics][create][cvs-collection]', tradeNo, { status: res.status, data }) } catch {}
      } catch (e: any) {
        try { console.error('[ECPay][logistics][create][cvs-collection] error', tradeNo, e?.message) } catch {}
      }

      // 若是 CVS_COD，直接導回前台訂單頁，不走金流收銀台
      if (method === 'CVS_COD') {
        const html = `<!doctype html><html><head><meta charset="utf-8"/></head><body>
          <script>location.replace(${JSON.stringify(frontBase + '/orders?cod=1&orderNo=' + encodeURIComponent(tradeNo))});</script>
        </body></html>`
        return c.html(html)
      }
    }

    const html = `<!doctype html><html><body>
      <form id="f" method="POST" action="${action}">
        ${Object.entries(payload).map(([k,v])=>`<input type="hidden" name="${k}" value="${v}"/>`).join('')}
        <input type="hidden" name="CheckMacValue" value="${cmv}" />
      </form>
      <script>document.getElementById('f').submit();</script>
    </body></html>`
    return c.html(html)
  } catch (e: any) {
    return c.text(e?.message || 'error', 500)
  }
})

// POST /frontend/pay/ecpay/notify  (Server to Server)
app.post('/frontend/pay/ecpay/notify', async (c) => {
  try {
    const body = await c.req.parseBody()
    // Verify CheckMacValue
    const key = c.env.ECPAY_PAYMENT_HASH_KEY || c.env.ECPAY_HASH_KEY
    const iv = c.env.ECPAY_PAYMENT_HASH_IV || c.env.ECPAY_HASH_IV
    if (!key || !iv) return c.text('HashKey/IV missing', 500)

    const receivedCMV = String(body['CheckMacValue'] || '')
    const params: Record<string,string> = {}
    for (const [k,v] of Object.entries(body)) {
      if (k === 'CheckMacValue') continue
      params[k] = String(v ?? '')
    }
    const cmv = await buildCMV(params, key, iv)
    if (cmv !== receivedCMV) {
      try { console.log('[ECPay][notify] CMV mismatch', { receivedCMV, expected: cmv, merchantTradeNo: params['MerchantTradeNo'] }) } catch {}
      // 不回 1|OK，讓 ECPay 視為驗證失敗
      return c.text('CheckMacValue Mismatch', 400)
    }

    // 寫入/更新訂單（idempotent by merchant_trade_no）
  // 注意：ATM/CVS 於配號階段 (RtnCode=2) 也會有回傳，先紀錄配號資訊；後續繳款成功 (RtnCode=1) 再覆寫。
    try {
      await upsertPayment(c, body as any)
      try { console.log('[ECPay][notify] upsert ok', { merchantTradeNo: params['MerchantTradeNo'], paymentType: params['PaymentType'] }) } catch {}
    } catch (e: any) {
      try { console.error('[ECPay][notify] upsert error', { merchantTradeNo: params['MerchantTradeNo'], error: e?.message }) } catch {}
      return c.text('error', 500)
    }

    // 若付款成功 (RtnCode=1)，於伺服器端自動建立物流託運單（若使用者在結帳時有開啟 createLogistics）
    const tradeNo = String(params['MerchantTradeNo'] || '')
    const tradeAmt = intOrNull(params['TradeAmt']) ?? 0
    if (String(params['RtnCode'] || '') === '1' && tradeNo) {
      try { await createLogisticsAfterPaid(c, tradeNo, tradeAmt) } catch (e: any) { try { console.error('[ECPay][notify] create logistics error', tradeNo, e?.message) } catch {} }
    }

    // 規範：成功需回覆字串 1|OK
    return c.text('1|OK')
  } catch (e: any) {
    return c.text('error', 500)
  }
})

// POST /frontend/pay/ecpay/result  (User Browser redirect)
app.post('/frontend/pay/ecpay/result', async (c) => {
  try {
    const body = await c.req.parseBody()
    const key = c.env.ECPAY_PAYMENT_HASH_KEY || c.env.ECPAY_HASH_KEY
    const iv = c.env.ECPAY_PAYMENT_HASH_IV || c.env.ECPAY_HASH_IV
    if (!key || !iv) return c.html('<h3>設定有誤</h3>', 500)

    const receivedCMV = String(body['CheckMacValue'] || '')
    const params: Record<string,string> = {}
    for (const [k,v] of Object.entries(body)) {
      if (k === 'CheckMacValue') continue
      params[k] = String(v ?? '')
    }
    const cmv = await buildCMV(params, key, iv)
    const ok = (cmv === receivedCMV)
    const tradeNo = String(body['MerchantTradeNo'] || '')
    const rtnCode = String(body['RtnCode'] || '')

    // 亦在此嘗試寫入（例如 ATM/CVS 配號多半出現在結果頁）；若驗證通過則 upsert。
    if (ok) {
      try { await upsertPayment(c, body as any); try { console.log('[ECPay][result] upsert ok', { merchantTradeNo: tradeNo, paymentType: params['PaymentType'] }) } catch {} } catch (e: any) { try { console.error('[ECPay][result] upsert error', { merchantTradeNo: tradeNo, error: e?.message }) } catch {} }
    }

    // 付款成功但若 notify 尚未觸發或失敗，這裡做一次補償嘗試建立物流單（不保證一定執行到，僅後援）
    if (ok && rtnCode === '1' && tradeNo) {
      try { await createLogisticsAfterPaid(c, tradeNo, intOrNull(body['TradeAmt']) ?? 0) } catch {}
    }

    // 以前端站台的網域做導轉，避免導到 API 網域造成 404
    let base = ''
    try { const u = new URL(c.req.url); base = u.origin } catch {}
    const frontBase = String(c.env.FRONTEND_SITE_URL || base)
    const target = ok
      ? `${frontBase}/orders?orderNo=${encodeURIComponent(tradeNo)}&code=${encodeURIComponent(rtnCode)}`
      : `${frontBase}/checkout/fail?orderNo=${encodeURIComponent(tradeNo)}&reason=cmv`

    const html = `<!doctype html><html><head><meta charset="utf-8"/></head><body>
      <script>location.replace(${JSON.stringify(target)});</script>
    </body></html>`
    return c.html(html)
  } catch (e: any) {
    const html = `<!doctype html><html><body><h3>付款結果處理失敗</h3></body></html>`
    return c.html(html, 500)
  }
})

// GET /frontend/pay/ecpay/back (user clicks back from ECPay)
app.get('/frontend/pay/ecpay/back', (c) => {
  let base = ''
  try { const u = new URL(c.req.url); base = u.origin } catch {}
  const frontBase = String(c.env.FRONTEND_SITE_URL || base)
  const html = `<!doctype html><html><head><meta charset="utf-8"/></head><body>
    <script>location.replace(${JSON.stringify(frontBase + '/checkout?back=1')});</script>
  </body></html>`
  return c.html(html)
})

export default app
