// 變數清單與工具（資料化）

// 分類定義（可供 UI 產生子頁籤）
export const VARIABLE_CATEGORIES = [
  { key: 'user', label: '會員' },
  { key: 'userAttributes', label: '會員屬性' },
  { key: 'address', label: '地址' },
  { key: 'invoice', label: '發票' },
  { key: 'promotion', label: '促銷' },
  { key: 'order', label: '訂單' },
  { key: 'shipment', label: '物流' },
  { key: 'system', label: '系統' },
];

// 變數目錄（token 格式一律為 {{path.to.value}}）
export function getVariableCatalog() {
  return {
    user: [
      { label: '會員名稱', token: '{{user.name}}', desc: '用戶顯示名稱' },
      { label: '會員 Email', token: '{{user.email}}', desc: '用戶電子郵件' },
      { label: '會員手機', token: '{{user.phone}}', desc: '手機號碼' },
      { label: '會員等級', token: '{{user.tier}}', desc: '會員分級/等級' },
      { label: '會員 ID', token: '{{user.id}}', desc: '內部識別 ID' },
    ],
    userAttributes: [
      { label: '性別', token: '{{userAttributes.gender}}', desc: '男/女/其他' },
      { label: '生日', token: '{{userAttributes.birthday}}', desc: 'YYYY-MM-DD' },
      { label: '年齡', token: '{{userAttributes.age}}', desc: '數字' },
      { label: '會員點數', token: '{{userAttributes.points}}', desc: '累積點數' },
    ],
    address: [
      { label: '城市', token: '{{address.city}}', desc: '如 台北市' },
      { label: '行政區', token: '{{address.district}}', desc: '如 大安區' },
      { label: '街道', token: '{{address.street}}', desc: '如 忠孝東路四段 123 號' },
      { label: '郵遞區號', token: '{{address.postalCode}}', desc: '如 106' },
    ],
    invoice: [
      { label: '發票號碼', token: '{{invoice.number}}', desc: '如 AB-12345678' },
      { label: '發票類型', token: '{{invoice.type}}', desc: '二聯式/三聯式' },
      { label: '載具', token: '{{invoice.carrier}}', desc: '手機載具/自然人憑證' },
      { label: '捐贈碼', token: '{{invoice.donationCode}}', desc: '捐贈發票碼' },
      { label: '公司統編', token: '{{invoice.companyTaxId}}', desc: '若為三聯式' },
    ],
    promotion: [
      { label: '優惠碼', token: '{{promotion.code}}', desc: '如 SAVE10' },
      { label: '折扣', token: '{{promotion.discount}}', desc: '如 10% 或 NT$ 100' },
      { label: '到期日', token: '{{promotion.expireDate}}', desc: 'YYYY-MM-DD' },
    ],
    order: [
      { label: '訂單編號', token: '{{order.number}}', desc: '如 ORD-0001' },
      { label: '訂單金額', token: '{{order.total}}', desc: '如 NT$ 1,280' },
      { label: '下單日期', token: '{{order.date}}', desc: 'YYYY-MM-DD' },
    ],
    shipment: [
      { label: '物流單號', token: '{{shipment.tracking}}', desc: '運單追蹤碼' },
      { label: '物流商', token: '{{shipment.carrier}}', desc: '如 黑貓/郵局' },
      { label: '物流狀態', token: '{{shipment.status}}', desc: '如 已出貨/配送中' },
    ],
    system: [
      { label: '現在時間', token: '{{system.now}}', desc: '依環境格式化' },
    ],
  };
}

// 建立預設的範例 Context（供測試預覽與 UI 顯示範例）
export function buildSampleContext(overrides = {}) {
  const base = {
    user: { id: 'U0001', name: '王小明', email: 'user@example.com', phone: '0912-345-678', tier: 'GOLD' },
    userAttributes: { gender: '男', birthday: '1995-07-15', age: 30, points: 1200 },
    address: { city: '台北市', district: '大安區', street: '忠孝東路四段 123 號', postalCode: '106' },
    invoice: { number: 'AB-12345678', type: '二聯式', carrier: '/ABC1234', donationCode: '16888', companyTaxId: '12345678' },
    promotion: { code: 'SAVE10', discount: '10%', expireDate: '2025-12-31' },
    order: { number: 'ORD-0001', total: 'NT$ 1,280', date: '2025-09-20' },
    shipment: { tracking: 'TW1234567890', carrier: '黑貓宅急便', status: '配送中' },
    system: { now: new Date().toLocaleString() },
  };
  return deepMerge(base, overrides);
}

// 將物件扁平化為 { 'a.b.c': value }
function flattenObject(obj, prefix = '', out = {}) {
  Object.keys(obj || {}).forEach((k) => {
    const val = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      flattenObject(val, key, out);
    } else {
      out[key] = val;
    }
  });
  return out;
}

// 深合併（簡易）
function deepMerge(target, source) {
  const out = { ...(target || {}) };
  Object.keys(source || {}).forEach((k) => {
    const sv = source[k];
    const tv = out[k];
    if (sv && typeof sv === 'object' && !Array.isArray(sv)) {
      out[k] = deepMerge(tv || {}, sv);
    } else {
      out[k] = sv;
    }
  });
  return out;
}

// 渲染模板字串（將 {{path}} 以 context 中對應值取代）
export function renderTemplateWithContext(template, context) {
  let out = String(template || '');
  const flat = flattenObject(context || {});
  // 補上常見別名（向後相容）
  if (!('now' in flat) && context?.system?.now) flat['now'] = context.system.now;
  Object.entries(flat).forEach(([k, v]) => {
    const token = new RegExp('\\{\\{\\s*' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\}}', 'g');
    out = out.replace(token, v ?? '');
  });
  return out;
}

export default {
  VARIABLE_CATEGORIES,
  getVariableCatalog,
  buildSampleContext,
  renderTemplateWithContext,
};
