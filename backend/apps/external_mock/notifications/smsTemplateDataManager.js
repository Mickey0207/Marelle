import { renderTemplateWithContext } from './variables';

export function getDefaultSmsTemplate() {
  return '【Marelle】嗨 {{ user.name }}，您的訂單 {{ order.id }} 已出貨。查詢碼：{{ shipment.tracking }}';
}

const KEY = '__mock_sms_text_templates__';
function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export function getTemplates() { return load(); }
export function searchTemplates(keyword) {
  const kw = String(keyword || '').toLowerCase();
  return load().filter(t => (t.name||'').toLowerCase().includes(kw) || (t.description||'').toLowerCase().includes(kw));
}
export function createTemplate(partial) {
  const list = load();
  const item = { id: `SM-${Date.now()}`,
    name: '', description: '', category: '', tags: [],
    content: getDefaultSmsTemplate(),
    ...partial };
  list.unshift(item); save(list); return item;
}
export function updateTemplate(id, patch) {
  const list = load().map(t => t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t);
  save(list);
}
export function deleteTemplate(id) {
  const list = load().filter(t => t.id !== id);
  save(list);
}
export function duplicateTemplate(id) {
  const list = load();
  const src = list.find(t => t.id === id);
  if (!src) return null;
  const copy = { ...src, id: `SM-${Date.now()}`, name: `${src.name || '未命名'} (複製)`, updatedAt: Date.now() };
  list.unshift(copy); save(list); return copy;
}
export function publishTemplate(id) {
  // no-op for mock; could mark as published if desired
}

export function renderSmsWithContext(content, ctx) {
  return renderTemplateWithContext(content || '', ctx);
}
