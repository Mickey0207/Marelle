// Frontend API for Admin module (calls Workers backend)
export async function fetchJSON(path: string, options: RequestInit = {}) {
  const base = (typeof window !== 'undefined' && (window as any).__MARELLE_API_BASE__) || '/'
  const res = await fetch(path.startsWith('http') ? path : (base.replace(/\/$/, '') + path), {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : undefined
  if (!res.ok) {
    const err: any = new Error(data?.error || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  return data
}

export async function listAdmins() {
  return fetchJSON('/backend/admins')
}

export async function updateAdmin(
  id: string,
  payload: Partial<{ display_name: string; role: string; is_active: boolean; department: string }>
) {
  return fetchJSON(`/backend/admins/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
}

export async function listRoles() {
  return fetchJSON('/backend/roles')
}

export async function createRole(name: string) {
  return fetchJSON('/backend/roles', { method: 'POST', body: JSON.stringify({ name }) })
}

export async function getRoleModules(role: string) {
  return fetchJSON(`/backend/roles/${encodeURIComponent(role)}/modules`)
}

export async function setRoleModules(role: string, modules: string[]) {
  return fetchJSON(`/backend/roles/${encodeURIComponent(role)}/modules`, { method: 'PUT', body: JSON.stringify({ modules }) })
}

export async function listModules() {
  const data = await fetchJSON('/backend/modules')
  // normalize to [{ key, label }]
  return Array.isArray(data) ? data.map((m: any) => ({ key: m.key, label: m.label || m.key })) : []
}

export async function createAdmin(payload: { email: string; password: string; display_name?: string; role?: string; department?: string }) {
  return fetchJSON('/backend/admins', { method: 'POST', body: JSON.stringify(payload) })
}

export async function sendResetEmail(id: string) {
  return fetchJSON(`/backend/admins/${id}/send-reset-email`, { method: 'POST' })
}
