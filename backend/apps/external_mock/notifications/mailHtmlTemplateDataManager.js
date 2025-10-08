import { renderTemplateWithContext } from './variables';

export function getDefaultMailHtml() {
  return (
    '<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Arial; line-height:1.7; color:#111;">\n' +
    '  <h2 style="margin:0 0 12px; font-size:20px;">嗨 {{ user.name }}，</h2>\n' +
    '  <p style="margin:0 0 12px;">您的訂單 <strong>{{ order.id }}</strong> 已出貨 🎉</p>\n' +
    '  <p style="margin:0 0 12px;">歡迎回到我們的商店逛逛最新商品與優惠：</p>\n' +
    '  <p style="margin:0 0 16px;"><a href="https://marelle.com.tw" style="background:#cc824d;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">前往 Marelle</a></p>\n' +
    '  <hr style="border:none;border-top:1px solid #e5e7eb; margin:16px 0;"/>\n' +
    '  <p style="margin:0; font-size:12px; color:#6b7280;">若有任何問題，隨時聯繫我們的客服。</p>\n' +
    '</div>'
  );
}

// Simple localStorage-based template store for Mail HTML
const KEY = '__mock_mail_html_templates__';
function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export function getTemplates() { return load(); }
export function searchTemplates(keyword) {
  const kw = String(keyword || '').toLowerCase();
  return load().filter(t =>
    (t.name||'').toLowerCase().includes(kw) ||
    (t.description||'').toLowerCase().includes(kw) ||
    (t.subject||'').toLowerCase().includes(kw)
  );
}
export function createTemplate(partial) {
  const list = load();
  const item = {
    id: `MH-${Date.now()}`,
    name: '',
    description: '',
    category: '',
    tags: [],
    subject: 'Marelle 最新優惠與通知',
    html: getDefaultMailHtml(),
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
  const copy = { ...src, id: `MH-${Date.now()}`, name: `${src.name || '未命名'} (複製)`, updatedAt: Date.now() };
  list.unshift(copy); save(list); return copy;
}
export function publishTemplate(id) {
  // no-op for mock; could mark status as published if needed
}

export function renderMailHtmlWithContext({ subject, html }, ctx) {
  return {
    subject: renderTemplateWithContext(subject || '', ctx),
    html: renderTemplateWithContext(html || '', ctx),
  };
}
