// 統一的後台前端 API 呼叫工具（使用同源 /backend 代理，攜帶 Cookie）

// 可用 window.__MARELLE_API_BASE__ 覆蓋，預設根路徑
const API_BASE = (typeof window !== 'undefined' && window.__MARELLE_API_BASE__) || '/'

export async function fetchJSON(path, options = {}) {
  const url = path.startsWith('http') ? path : (API_BASE.replace(/\/$/, '') + path)
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : undefined
  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  return data
}

export function getApiBase() { return API_BASE }
