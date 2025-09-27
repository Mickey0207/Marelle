// 產生 mock 事件資料（新位置：src/data）
export const EVENT_TYPES = ['page_view', 'product_view', 'add_to_cart', 'checkout_start', 'purchase', 'search', 'custom'];
export const EVENT_LABELS = {
  page_view: '頁面瀏覽',
  product_view: '商品瀏覽',
  add_to_cart: '加入購物車',
  checkout_start: '開始結帳',
  purchase: '完成購買',
  search: '站內搜尋',
  custom: '自訂事件'
};
export const SOURCES = ['direct', 'google', 'facebook', 'line', 'newsletter'];
export const DEVICES = ['desktop', 'mobile'];

let CACHE = null;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

export function generateMockEvents(count = 800) {
  if (CACHE) return CACHE;
  const now = Date.now();
  const events = [];
  for (let i = 0; i < count; i++) {
    const ts = now - rand(0, 1000 * 60 * 60 * 24 * 60); // 近 60 天
    const type = pick(EVENT_TYPES);
    const userId = 'U' + rand(1000, 1099);
    const sessionId = 'S' + rand(10000, 10999);
    const source = pick(SOURCES);
    const device = pick(DEVICES);
    const productId = rand(1, 40);
    const sku = 'SKU-' + productId + '-' + pick(['A', 'B', 'C']);
    const path = pick(['/', '/products', '/products/' + productId, '/cart', '/checkout', '/search']);
    const value = type === 'purchase' ? rand(300, 5000) : (type === 'checkout_start' ? rand(300, 5000) : null);
    const utmCampaign = pick(['', 'summer', 'autumn', 'xmas']);
    const id = 'E' + (100000 + i);
    events.push({ id, ts, type, userId, sessionId, source, device, path, productId, sku, value, utmCampaign, props: { note: 'mock' } });
  }
  events.sort((a, b) => a.ts - b.ts);
  CACHE = events;
  return events;
}

export default generateMockEvents;
