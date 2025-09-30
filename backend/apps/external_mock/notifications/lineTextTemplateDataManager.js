import { renderTemplateWithContext } from './variables'

export const LINE_TEMPLATE_TABS = ['內容','預覽']
export function getLineMessageTextTemplate() {
  return '嗨 {{ user.name }}，您的訂單 {{ order.id }} 已出貨，謝謝！'
}
export function renderLineMessageTextTemplate(tpl, ctx) {
  return renderTemplateWithContext(tpl, ctx)
}

// Simple in-memory template store
const key = '__mock_line_text_templates__'
function load() {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function save(list) { localStorage.setItem(key, JSON.stringify(list)) }

export function getTemplates() { return load() }
export function searchTemplates(keyword) {
  const kw = String(keyword || '').toLowerCase()
  return load().filter(t => (t.name||'').toLowerCase().includes(kw) || (t.description||'').toLowerCase().includes(kw))
}
export function createTemplate(partial) {
  const list = load()
  const item = { id: `LT-${Date.now()}`, name: '', description: '', content: getLineMessageTextTemplate(), ...partial }
  list.unshift(item); save(list); return item
}
export function updateTemplate(id, patch) {
  const list = load().map(t => t.id === id ? { ...t, ...patch } : t)
  save(list)
}
export function deleteTemplate(id) {
  const list = load().filter(t => t.id !== id)
  save(list)
}
export function duplicateTemplate(id) {
  const list = load()
  const src = list.find(t => t.id === id)
  if (!src) return null
  const copy = { ...src, id: `LT-${Date.now()}`, name: `${src.name || '未命名'} (複製)` }
  list.unshift(copy); save(list); return copy
}
export function publishTemplate(id) {
  // no-op for mock; could mark as published
}
