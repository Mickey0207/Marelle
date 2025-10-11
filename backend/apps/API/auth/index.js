import { fetchJSON } from '../core/http'

// 僅標記前端可見的 access 標誌；實際 token 存於 Cookie
let accessFlag = undefined
export function getAccessFlag() { return accessFlag }
export function clearAccessFlag() { accessFlag = undefined }

export async function login(email, password) {
  const result = await fetchJSON('/backend/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  accessFlag = 'cookie'
  return { token: 'cookie', user: result?.user }
}

export async function refresh() {
  try {
    await fetchJSON('/backend/auth/refresh', { method: 'POST' })
    accessFlag = 'cookie'
    return 'cookie'
  } catch (e) {
    clearAccessFlag()
    return undefined
  }
}

export async function me() {
  const data = await fetchJSON('/backend/auth/me', { method: 'GET' })
  return { id: data.id, email: data.email }
}

export async function logout() {
  try { await fetchJSON('/backend/auth/logout', { method: 'POST' }) } catch {}
  clearAccessFlag()
}

export async function getAdminModules() {
  const modules = await fetchJSON('/backend/auth/modules', { method: 'GET' })
  return Array.isArray(modules) ? modules : []
}
