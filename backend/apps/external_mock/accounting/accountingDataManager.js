// Mock data manager for Accounting Management

const pad = (n) => String(n).padStart(2, '0');
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const TYPES = ['發票', '收據', '請款單', '費用報銷'];
const STATUSES = ['draft', 'submitted', 'approved', 'paid', 'void'];

const entries = Array.from({ length: 35 }).map((_, i) => {
  const d = new Date(Date.now() - randInt(0, 120) * 86400000);
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const subtotal = randInt(500, 10000);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  return {
    id: `ACC-${1000 + i}`,
    docNo: `A${d.getFullYear()}${pad(d.getMonth() + 1)}-${1000 + i}`,
    type: pick(TYPES),
    date,
    period: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`,
    partner: pick(['美樂有限公司', '安盛股份有限公司', '群益科技', '福臨門企業']),
    subtotal,
    tax,
    total,
    status: pick(STATUSES),
    note: pick(['', '專案 X 報支', '年度保固費用', '行銷合作款'] ),
  };
});

export default {
  async list() {
    await new Promise(r => setTimeout(r, 80));
    return { success: true, data: [...entries] };
  },
  async getById(id) {
    await new Promise(r => setTimeout(r, 50));
    const found = entries.find(e => e.id === id);
    return found ? { success: true, data: { ...found } } : { success: false };
  },
  async update(id, payload) {
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return { success: false };
    entries[idx] = { ...entries[idx], ...payload };
    await new Promise(r => setTimeout(r, 60));
    return { success: true, data: { ...entries[idx] } };
  },
  async create(payload) {
    // Generate id/docNo if missing
    const now = payload?.date ? new Date(payload.date) : new Date();
    const y = now.getFullYear();
    const m = pad(now.getMonth() + 1);
    const d = pad(now.getDate());
    const nextNum = 1000 + entries.length + 1;
    const id = payload?.id || `ACC-${nextNum}`;
    const docNo = payload?.docNo || `A${y}${m}-${nextNum}`;
    const subtotal = Number(payload?.subtotal || 0);
    const tax = Number(payload?.tax ?? Math.round(subtotal * 0.05));
    const total = Number(payload?.total ?? (subtotal + tax));
    const entry = {
      id,
      docNo,
      type: payload?.type || TYPES[0],
      date: payload?.date || `${y}-${m}-${d}`,
      period: payload?.period || `${y}-${m}`,
      partner: payload?.partner || '',
      subtotal,
      tax,
      total,
      status: payload?.status || 'draft',
      note: payload?.note || ''
    };
    entries.unshift(entry);
    await new Promise(r => setTimeout(r, 80));
    return { success: true, data: { ...entry } };
  },
  TYPES,
  STATUSES,
};
