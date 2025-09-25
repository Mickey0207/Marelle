// 簡易的 Line 純文字訊息模板資料管理器（以 localStorage 模擬持久化）
// 提供 CRUD 與搜尋，方便頁面兩欄式（清單/編輯器）使用

const LS_KEY = 'marelle_line_text_templates_v1';

function nowISO() {
  return new Date().toISOString();
}

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch (e) {
    console.warn('Failed to load line text templates from localStorage', e);
    return null;
  }
}

function save(list) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save line text templates to localStorage', e);
  }
}

function uid() {
  return 'lt_' + Math.random().toString(36).slice(2, 10);
}

const defaultTemplates = [
  {
    id: uid(),
    name: '歡迎加入',
    description: '新會員加入歡迎訊息',
    category: '會員',
    tags: ['welcome', 'member'],
    content: '嗨 {{user.name}}，歡迎加入我們！有任何問題都可以回覆此訊息唷～',
    status: 'published',
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: uid(),
    name: '訂單已出貨',
    description: '通知客戶訂單出貨狀態',
    category: '訂單',
    tags: ['order', 'logistics'],
    content: '您的訂單 {{order.number}} 已出貨，物流單號：{{shipment.tracking}}。',
    status: 'published',
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: uid(),
    name: '購物車遺失提醒',
    description: '提醒用戶完成結帳',
    category: '行銷',
    tags: ['cart', 'remarketing'],
    content: '嗨 {{user.name}}，看到你遺留在購物車的商品～現在回來完成結帳享 95 折優惠！',
    status: 'draft',
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
];

function ensureSeed() {
  const data = load();
  if (data) return data;
  save(defaultTemplates);
  return defaultTemplates;
}

export function getTemplates() {
  return ensureSeed();
}

export function getTemplateById(id) {
  return getTemplates().find(t => t.id === id) || null;
}

export function searchTemplates(keyword) {
  const q = (keyword || '').trim().toLowerCase();
  if (!q) return getTemplates();
  return getTemplates().filter(t =>
    [t.name, t.description, t.category, (t.tags || []).join(',')]
      .filter(Boolean)
      .some(v => v.toLowerCase().includes(q))
  );
}

export function createTemplate(payload) {
  const list = getTemplates();
  const item = {
    id: uid(),
    name: payload?.name || '未命名範本',
    description: payload?.description || '',
    category: payload?.category || '通用',
    tags: payload?.tags || [],
    content: payload?.content || '',
    status: payload?.status || 'draft',
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  const next = [item, ...list];
  save(next);
  return item;
}

export function updateTemplate(id, changes) {
  const list = getTemplates();
  const idx = list.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const updated = { ...list[idx], ...changes, updatedAt: nowISO() };
  const next = [...list];
  next[idx] = updated;
  save(next);
  return updated;
}

export function deleteTemplate(id) {
  const next = getTemplates().filter(t => t.id !== id);
  save(next);
  return true;
}

export function duplicateTemplate(id, overrides = {}) {
  const src = getTemplateById(id);
  if (!src) return null;
  return createTemplate({
    ...src,
    id: undefined,
    name: (overrides.name || src.name) + ' (複本)',
    status: 'draft',
    ...overrides,
  });
}

export function publishTemplate(id) {
  return updateTemplate(id, { status: 'published' });
}

export default {
  getTemplates,
  getTemplateById,
  searchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  publishTemplate,
};
