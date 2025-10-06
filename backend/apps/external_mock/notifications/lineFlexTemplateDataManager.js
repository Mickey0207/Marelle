// Mock data manager for LINE Flex Message templates stored in localStorage

const key = '__mock_line_flex_templates__';

function load() {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function save(list) { localStorage.setItem(key, JSON.stringify(list)); }

export function getTemplates() { return load(); }

export function searchTemplates(keyword) {
  const kw = String(keyword || '').toLowerCase();
  return load().filter(t =>
    (t.name || '').toLowerCase().includes(kw) ||
    (t.description || '').toLowerCase().includes(kw) ||
    (t.category || '').toLowerCase().includes(kw) ||
    (Array.isArray(t.tags) ? t.tags.join(',') : '').toLowerCase().includes(kw)
  );
}

export function getDefaultFlexJSON() {
  // A simple bubble sample based on LINE docs
  return {
    type: 'bubble',
    header: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: 'Marelle', weight: 'bold', size: 'lg' }
      ]
    },
    hero: {
      type: 'image',
      url: 'https://picsum.photos/800/400',
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover'
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'md',
      contents: [
        { type: 'text', text: '精選商品', weight: 'bold', size: 'md' },
        { type: 'text', text: '這是一個 Flex Message 預覽範例', size: 'sm', color: '#666666', wrap: true }
      ]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          style: 'primary',
          action: { type: 'uri', label: '前往', uri: 'https://example.com' }
        }
      ]
    }
  };
}

export function createTemplate(partial) {
  const list = load();
  const content = JSON.stringify(getDefaultFlexJSON(), null, 2);
  const item = {
    id: `LF-${Date.now()}`,
    name: '新 Flex 範本',
    description: '',
    category: '',
    tags: [],
    status: 'draft',
    content,
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
  const copy = { ...src, id: `LF-${Date.now()}`, name: `${src.name || '未命名'} (複製)`, updatedAt: Date.now() };
  list.unshift(copy); save(list); return copy;
}

export function publishTemplate(id) {
  const list = load().map(t => t.id === id ? { ...t, status: 'published', updatedAt: Date.now() } : t);
  save(list);
}
