import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: any }>({ strict: false })
app.use('*', cors({ origin: (o)=>o||'*', allowHeaders: ['Content-Type'], allowMethods: ['GET','POST','OPTIONS'], credentials: true }))

function endpoint(env?: string) {
  return env === 'prod' ? 'https://logistics.ecpay.com.tw/Express/map' : 'https://logistics-stage.ecpay.com.tw/Express/map'
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
}

function buildCMV(params: Record<string,string>, key: string, iv: string) {
  const sorted = Object.keys(params).filter(k=>params[k]!==undefined && params[k] !== '').sort((a,b)=>a.localeCompare(b,'en')).map(k=>`${k}=${params[k]}`).join('&')
  const raw = `HashKey=${key}&${sorted}&HashIV=${iv}`
  return sha256HexUpper(normalizeUrlEncoded(raw))
}

async function buildStartHtml(c: any) {
  const env = (c.env.ECPAY_ENV || 'stage') as string
  const action = endpoint(env)
  const merchantId = c.env.ECPAY_LOGISTICS_MERCHANT_ID
  const key = c.env.ECPAY_HASH_KEY
  const iv = c.env.ECPAY_HASH_IV
  if (!merchantId || !key || !iv) return c.text('ECPay not configured', 500)

  // Build ReturnURL based on current origin
  let base = ''
  try { const u = new URL(c.req.url); base = u.origin } catch {}
  const debug = (c.req.query('debug') || '') === '1'
  const returnURL = `${base}/frontend/account/ecpay/map/return${debug ? '?debug=1' : ''}`

  const subType = (c.req.query('subType') || 'FAMIC2C').toString()
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

export default app
