// User Tracking 模組的本地模擬資料，對齊各頁面使用的資料結構

export const EVENT_TYPES = ['PageView', 'AddToCart', 'Checkout', 'Purchase']
export const EVENT_LABELS = {
  PageView: '頁面瀏覽',
  AddToCart: '加入購物車',
  Checkout: '結帳',
  Purchase: '完成購買',
}
export const SOURCES = ['Direct', 'Email', 'Ads', 'Social', 'Referral']
export const DEVICES = ['Desktop', 'Mobile', 'Tablet']

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export function getEvents(filters = {}) {
  const now = Date.now()
  const out = Array.from({ length: 120 }).map((_, i) => {
    const type = EVENT_TYPES[i % EVENT_TYPES.length]
    const source = SOURCES[i % SOURCES.length]
    const device = DEVICES[i % DEVICES.length]
    const sessionId = `S-${1000 + (i % 40)}`
    const userId = `U-${200 + (i % 30)}`
    const ts = now - i * 60_000
    const base = {
      id: `EV-${i + 1}`,
      ts, // number timestamp（頁面以 new Date(ts) 轉換）
      type,
      userId,
      sessionId,
      source,
      device,
    }
    // 附帶一些欄位供表格顯示
    if (type === 'PageView') return { ...base, path: ['/','/products','/cart','/checkout'][i % 4] }
    if (type === 'AddToCart') return { ...base, sku: `SKU-${100 + (i % 50)}`, productId: `P-${i % 80}` }
    if (type === 'Checkout') return { ...base, step: ['address','payment','review'][i % 3] }
    if (type === 'Purchase') return { ...base, value: rnd(300, 5000), currency: 'TWD' }
    return base
  })

  // 簡單濾器
  const { types, sources, devices } = filters
  return out.filter(r => (
    (!types || types.length === 0 || types.includes(r.type)) &&
    (!sources || sources.length === 0 || sources.includes(r.source)) &&
    (!devices || devices.length === 0 || devices.includes(r.device))
  ))
}

export function getSessions(filters = {}) {
  const now = Date.now()
  const list = Array.from({ length: 40 }).map((_, i) => {
    const sessionId = `S-${1000 + i}`
    const userId = `U-${200 + (i % 30)}`
    const source = SOURCES[i % SOURCES.length]
    const device = DEVICES[i % DEVICES.length]
    const startedAt = new Date(now - rnd(10, 60) * 60_000).toISOString()
    const durationSec = rnd(60, 1800)
    const pageCount = rnd(1, 12)
    const eventCount = rnd(2, 20)

    // 生成與本 session 關聯的簡易事件序列
    const events = Array.from({ length: eventCount }).map((__, k) => {
      const type = EVENT_TYPES[k % EVENT_TYPES.length]
      const ts = now - k * 30_000
      const e = { id: `${sessionId}-EV-${k + 1}`, ts, type }
      if (type === 'PageView') e.path = ['/','/products','/cart','/checkout'][k % 4]
      if (type === 'AddToCart') e.sku = `SKU-${100 + (k % 50)}`
      if (type === 'Purchase') e.value = rnd(200, 7000)
      return e
    })

    return { sessionId, userId, source, device, startedAt, durationSec, pageCount, eventCount, events }
  })

  const { sources, devices } = filters
  return list.filter(r => (
    (!sources || sources.length === 0 || sources.includes(r.source)) &&
    (!devices || devices.length === 0 || devices.includes(r.device))
  ))
}

export function getFunnel(steps = ['Visit','Product View','Add to Cart','Purchase']) {
  // 依序遞減，計算 count 與 rate（相較於第一步的比率）
  const base = 1000
  const counts = steps.map((_, i) => Math.max(1, Math.round(base * Math.pow(0.6, i))))
  const first = counts[0] || 1
  return steps.map((step, i) => ({ step, count: counts[i], rate: counts[i] / first }))
}

export function getRetentionByWeek() {
  // 產生多組 cohort，每組 base 固定 100，週數 6 週，遞減留存
  const cohorts = 8
  const weeks = 6
  return Array.from({ length: cohorts }).map((_, c) => {
    const base = 100
    const cells = Array.from({ length: weeks }).map((__, w) => ({
      weekOffset: w,
      rate: Math.max(0, +(Math.pow(0.7, w)).toFixed(2)), // 1.00, 0.70, 0.49, ...
    }))
    return { cohortWeek: `W${c + 1}`, base, cells }
  })
}
