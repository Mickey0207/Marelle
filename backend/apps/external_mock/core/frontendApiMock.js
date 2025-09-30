// 前端本地 Mock：移除所有後端與 API SDK 依賴，保留同介面以便前端開發

let accessToken = undefined
const setToken = (t) => { accessToken = t }
export function getAccessToken() { return accessToken }
export function clearAccessToken() { accessToken = undefined }

// 簡單的本地資料存放（記憶體）
const db = {
  admins: [
    { id: '1', email: 'admin@example.com', name: 'Admin User' },
  ],
  modules: [
    { id: 'm1', name: 'dashboard' },
    { id: 'm2', name: 'settings' },
    { id: 'm3', name: 'products' },
  ],
  roles: [
    { id: 'r1', name: 'manager' },
    { id: 'r2', name: 'staff' },
  ],
  departments: [
    { id: 'd1', name: '營運部' },
    { id: 'd2', name: '行銷部' },
  ],
  adminModules: {
    '1': ['dashboard', 'settings', 'products']
  }
}

// 模擬非同步延遲
const delay = (ms = 200) => new Promise(res => setTimeout(res, ms))

// Auth
export async function login(email) {
  await delay()
  // 任意帳密都通過，用於前端頁面開發
  const token = `mock-token-${Date.now()}`
  setToken(token)
  // 若新帳號不存在，幫忙掛一個临时帳號
  if (!db.admins.find(a => a.email === email)) {
    db.admins.push({ id: String(db.admins.length + 1), email, name: email.split('@')[0] })
    db.adminModules[String(db.admins.length)] = ['dashboard']
  }
  return token
}

export async function refreshAccessToken() {
  await delay(50)
  if (!accessToken) return undefined
  const token = `mock-token-${Date.now()}`
  setToken(token)
  return token
}

export async function me() {
  await delay(50)
  if (!accessToken) {
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }
  // 取第一個 admin 當目前使用者（僅供頁面串接）
  const user = db.admins[0]
  return { id: user.id, email: user.email, name: user.name }
}

// Admin management helpers
export async function createAdmin(input) {
  await delay()
  const id = String(db.admins.length + 1)
  const item = { id, ...input }
  db.admins.push(item)
  db.adminModules[id] = []
  return item
}

export async function updateAdmin(id, input) {
  await delay()
  const idx = db.admins.findIndex(a => a.id === String(id))
  if (idx === -1) throw new Error('Admin not found')
  db.admins[idx] = { ...db.admins[idx], ...input }
  return db.admins[idx]
}

export async function listAdminsFull() {
  await delay()
  return db.admins.map(a => ({ ...a, modules: db.adminModules[a.id] || [] }))
}

// Admin permissions helpers
export async function getAdminModules(id) {
  await delay(50)
  return db.adminModules[String(id)] || []
}
export async function setAdminModules(id, modules) {
  await delay(50)
  db.adminModules[String(id)] = Array.isArray(modules) ? modules : []
  return { id: String(id), modules: db.adminModules[String(id)] }
}

// Settings CRUD helpers
export async function listDepartments() { await delay(50); return [...db.departments] }
export async function createDepartment(name) {
  await delay(50)
  const item = { id: `d${Date.now()}`, name }
  db.departments.push(item)
  return item
}
export async function updateDepartment(id, name) {
  await delay(50)
  const idx = db.departments.findIndex(d => d.id === id)
  if (idx === -1) throw new Error('Department not found')
  db.departments[idx] = { ...db.departments[idx], name }
  return db.departments[idx]
}
export async function deleteDepartment(id) {
  await delay(50)
  const idx = db.departments.findIndex(d => d.id === id)
  if (idx !== -1) db.departments.splice(idx, 1)
  return true
}

export async function listRoles() { await delay(50); return [...db.roles] }
export async function createRole(name) {
  await delay(50)
  const item = { id: `r${Date.now()}`, name }
  db.roles.push(item)
  return item
}
export async function updateRole(id, name) {
  await delay(50)
  const idx = db.roles.findIndex(d => d.id === id)
  if (idx === -1) throw new Error('Role not found')
  db.roles[idx] = { ...db.roles[idx], name }
  return db.roles[idx]
}
export async function deleteRole(id) {
  await delay(50)
  const idx = db.roles.findIndex(d => d.id === id)
  if (idx !== -1) db.roles.splice(idx, 1)
  return true
}

export async function listModules() { await delay(50); return [...db.modules] }
export async function createModule(name) {
  await delay(50)
  const item = { id: `m${Date.now()}`, name }
  db.modules.push(item)
  return item
}
export async function updateModule(id, name) {
  await delay(50)
  const idx = db.modules.findIndex(d => d.id === id)
  if (idx === -1) throw new Error('Module not found')
  db.modules[idx] = { ...db.modules[idx], name }
  return db.modules[idx]
}
export async function deleteModule(id) {
  await delay(50)
  const idx = db.modules.findIndex(d => d.id === id)
  if (idx !== -1) db.modules.splice(idx, 1)
  return true
}

// Auth: bind LINE（僅回傳成功假資料）
export async function bindLine(line_user_id, line_display_name) {
  await delay(50)
  return { line_user_id, line_display_name, bound: true }
}
