import { renderTemplateWithContext } from './variables';

export function getDefaultWebNotification() {
  return {
    title: '系統通知：訂單 {{ order.id }} 已出貨',
    body: '嗨 {{ user.name }}，系統偵測到您的訂單已出貨，物流單號：{{ shipment.tracking }}。',
    type: 'order', // order | payment | review | system
    severity: 'info', // info | warning | error | success
    source: '訂單系統',
    ctaLabel: '前往訂單',
    ctaUrl: 'https://marelle.com.tw/orders/{{ order.id }}',
  };
}

const KEY = '__mock_web_notification_templates__';
function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export function getTemplates() { return load(); }
export function searchTemplates(keyword) {
  const kw = String(keyword || '').toLowerCase();
  return load().filter(t =>
    (t.name||'').toLowerCase().includes(kw) ||
    (t.description||'').toLowerCase().includes(kw) ||
    (t.title||'').toLowerCase().includes(kw)
  );
}
export function createTemplate(partial) {
  const list = load();
  const def = getDefaultWebNotification();
  const item = {
    id: `WN-${Date.now()}`,
    name: '新站內通知',
    description: '',
    category: '',
    tags: [],
    ...def,
    ...partial,
  };
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
  const copy = { ...src, id: `WN-${Date.now()}`, name: `${src.name || '未命名'} (複製)`, updatedAt: Date.now() };
  list.unshift(copy); save(list); return copy;
}
export function publishTemplate(id) {
  // no-op mock
}

export function renderWebNotificationWithContext(fields, ctx) {
  return {
    title: renderTemplateWithContext(fields?.title || '', ctx),
    body: renderTemplateWithContext(fields?.body || '', ctx),
    ctaLabel: renderTemplateWithContext(fields?.ctaLabel || '', ctx),
    ctaUrl: renderTemplateWithContext(fields?.ctaUrl || '', ctx),
    type: fields?.type || 'system',
    severity: fields?.severity || 'info',
    source: renderTemplateWithContext(fields?.source || '', ctx),
  };
}
