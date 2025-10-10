// Mock data manager for Reviews Management

const pad = (n) => String(n).padStart(2, '0');
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const REVIEWS = Array.from({ length: 60 }).map((_, i) => {
  const d = new Date(Date.now() - randInt(0, 240) * 86400000);
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return {
    id: `RV-${1000 + i}`,
    orderNo: `O-${2000 + i}`,
    sku: `SKU-${1000 + (i % 20)}`,
    productName: pick(['經典帆布包', '保溫杯', '無線滑鼠', '藍牙耳機', '運動毛巾', '筆記本']),
    rating: randInt(1, 5),
    title: pick(['很喜歡', '普通', '品質不錯', '性價比高', '有點瑕疵']),
    content: pick([
      '出貨快、品質好，會再回購。',
      '一般般，沒有太大驚喜。',
      '設計很好看，容量也夠用。',
      '包裝完整，客服回覆也很快。',
      '有些小刮痕，但可接受。'
    ]),
    images: [],
    createdAt: date,
    status: pick(['published','hidden','pending']),
    author: pick(['王小明','李小美','陳大文','林靜怡','張雅婷']),
  };
});

export default {
  async list() {
    await new Promise(r => setTimeout(r, 80));
    return { success: true, data: [...REVIEWS] };
  },
  async update(id, payload) {
    const idx = REVIEWS.findIndex(r => r.id === id);
    if (idx === -1) return { success: false };
    REVIEWS[idx] = { ...REVIEWS[idx], ...payload };
    await new Promise(r => setTimeout(r, 60));
    return { success: true, data: { ...REVIEWS[idx] } };
  },
  async delete(id) {
    const idx = REVIEWS.findIndex(r => r.id === id);
    if (idx === -1) return { success: false };
    REVIEWS.splice(idx, 1);
    await new Promise(r => setTimeout(r, 40));
    return { success: true };
  }
};
