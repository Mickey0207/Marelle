import { TAG_TYPES } from './productTags.js';
import { categories, flattenCategories, findCategoryById, getCategoryPath } from './categories.js';

// 產品模板數據
const productTemplates = [
  // 書寫工具 - 鋼筆
  { name: 'Meisterstück 149 鋼筆', price: 28800, category: 'meisterstuck-149', image: 'pen-149' },
  { name: 'Meisterstück 146 鋼筆', price: 24800, category: 'meisterstuck-146', image: 'pen-146' },
  { name: 'Meisterstück 145 鋼筆', price: 19800, category: 'meisterstuck-145', image: 'pen-145' },
  { name: 'Heritage Rouge et Noir 鋼筆', price: 32800, category: 'heritage-rouge-noir', image: 'pen-heritage-1' },
  { name: 'Heritage 1912 鋼筆', price: 29800, category: 'heritage-1912', image: 'pen-heritage-2' },
  
  // 書寫工具 - 原子筆
  { name: 'StarWalker 樹脂原子筆', price: 12800, category: 'starwalker-precious-resin', image: 'pen-star-1' },
  { name: 'StarWalker 金屬原子筆', price: 15800, category: 'starwalker-metal', image: 'pen-star-2' },
  
  // 書寫工具 - 鋼珠筆
  { name: 'Bohème Bleu 鋼珠筆', price: 18800, category: 'boheme-bleu', image: 'pen-boheme-1' },
  { name: 'Bohème Rouge 鋼珠筆', price: 18800, category: 'boheme-rouge', image: 'pen-boheme-2' },
  
  // 書寫工具 - 墨水與筆芯
  { name: '鋼筆墨水瓶 - 神秘黑', price: 880, category: 'ink-bottles', image: 'ink-1' },
  { name: '鋼筆墨水瓶 - 午夜藍', price: 880, category: 'ink-bottles', image: 'ink-2' },
  { name: '墨水匣組合包', price: 580, category: 'ink-cartridges', image: 'ink-3' },
  { name: '原子筆芯 - 黑色', price: 280, category: 'ballpoint-black', image: 'refill-1' },
  { name: '原子筆芯 - 藍色', price: 280, category: 'ballpoint-blue', image: 'refill-2' },
  
  // 書寫工具 - 筆記本
  { name: '#146 經典筆記本', price: 2280, category: 'notebook-146', image: 'notebook-1' },
  { name: '#149 大師筆記本', price: 2680, category: 'notebook-149', image: 'notebook-2' },
  
  // 包款 - 公事包
  { name: 'Sartorial 纖薄公事包', price: 38800, category: 'sartorial-slim', image: 'bag-brief-1' },
  { name: 'Sartorial 大型公事包', price: 42800, category: 'sartorial-large', image: 'bag-brief-2' },
  
  // 包款 - 後背包
  { name: 'Extreme 小型後背包', price: 32800, category: 'extreme-small', image: 'bag-back-1' },
  { name: 'Extreme 大型後背包', price: 36800, category: 'extreme-large', image: 'bag-back-2' },
  
  // 包款 - 旅行袋
  { name: 'Nightflight 登機箱', price: 45800, category: 'nightflight-cabin', image: 'luggage-1' },
  { name: 'Nightflight 大型行李箱', price: 52800, category: 'nightflight-large', image: 'luggage-2' },
  
  // 配件 - 腕錶
  { name: 'Heritage Spirit Date 腕錶', price: 128000, category: 'spirit-date', image: 'watch-1' },
  { name: 'Heritage Spirit Moonphase 腕錶', price: 158000, category: 'spirit-moonphase', image: 'watch-2' },
  
  // 配件 - 耳機
  { name: 'MB 01 黑色頭戴式耳機', price: 22800, category: 'mb01-black', image: 'headphone-1' },
  { name: 'MB 01 棕色頭戴式耳機', price: 22800, category: 'mb01-brown', image: 'headphone-2' },
  
  // 香水 - 男士
  { name: 'Legend 淡香水 50ml', price: 3280, category: 'legend-50ml', image: 'fragrance-m-1' },
  { name: 'Legend 淡香水 100ml', price: 4280, category: 'legend-100ml', image: 'fragrance-m-2' },
  { name: 'Legend 濃香水 50ml', price: 3680, category: 'legend-edp-50ml', image: 'fragrance-m-3' },
  { name: 'Legend 濃香水 100ml', price: 4680, category: 'legend-edp-100ml', image: 'fragrance-m-4' },
  { name: 'Explorer 探險家 60ml', price: 3480, category: 'explorer-60ml', image: 'fragrance-m-5' },
  { name: 'Explorer 探險家 100ml', price: 4480, category: 'explorer-100ml', image: 'fragrance-m-6' },
  
  // 香水 - 女士
  { name: 'Signature Absolue 30ml', price: 3880, category: 'signature-30ml', image: 'fragrance-w-1' },
  { name: 'Signature Absolue 90ml', price: 5880, category: 'signature-90ml', image: 'fragrance-w-2' },
];

// 使用 categories.js 的資料處理器獲取分類完整路徑
const getCategoryFullPath = (categoryId) => {
  const category = findCategoryById(categoryId);
  if (!category) {
    console.warn(`Category not found: ${categoryId}`);
    return null;
  }
  
  const path = getCategoryPath(categoryId);
  if (!path) {
    console.warn(`Category path not found: ${categoryId}`);
    return null;
  }
  
  return {
    ids: path.map(c => c.id),
    names: path.map(c => c.name),
    slugs: path.map(c => c.slug),
    href: category.href,
    category: category
  };
};

// 生成產品資料
export const mockProducts = productTemplates.map((template, i) => {
  const tags = [];
  const pathInfo = getCategoryFullPath(template.category);

  // 根據索引分配不同標籤
  if (i % 7 === 0 && i % 5 !== 0) tags.push(TAG_TYPES.HOT_SALE);
  if (i % 8 === 0 && i % 5 !== 0) tags.push(TAG_TYPES.PRE_ORDER);
  if (i % 9 === 0) tags.push(TAG_TYPES.NEW_ARRIVAL);
  if (i % 6 === 0 && i % 5 !== 0) tags.push(TAG_TYPES.LIMITED);
  if (i % 3 === 0 && i % 5 !== 0) tags.push(TAG_TYPES.SALE);

  // 折扣 / 優惠對應的 mock 欄位
  const isOnSale = tags.includes(TAG_TYPES.SALE);
  const originalPrice = isOnSale ? Math.round(template.price * 1.3) : undefined;
  const discountPercent = isOnSale && originalPrice
    ? Math.max(1, Math.round(((originalPrice - template.price) / originalPrice) * 100))
    : null;

  // 產生 URL Key（例如：最後分類為 146，模板為 notebook-1 -> 146notebook）
  const lastSlug = pathInfo ? pathInfo.slugs[pathInfo.slugs.length - 1] : '';
  const digitsOnly = /^\d+$/.test(lastSlug || '');
  const catDigits = (lastSlug && (lastSlug.match(/\d+/)?.[0])) || '';
  const baseName = String(template.image).split('-')[0];
  const urlKey = (catDigits ? `${catDigits}${baseName}` : String(template.image).replace(/[^a-zA-Z0-9]/g, ''))
    .toLowerCase();

  return {
    id: i + 1,
    name: template.name,
    price: template.price,
    originalPrice,
  // 英文商品 slug（統一採用 #146 筆記本邏輯：<分類數字><英文 baseName>）
  slug: urlKey,
  // 產品唯一網址鍵（不含中文與空白），例：146notebook、149pen；與 slug 同步
    urlKey,
    // 促銷資訊（供前端顯示優惠標籤或其他用途）
    isOnSale,
    discountPercent,
    promotion: isOnSale && discountPercent ? { type: 'discount', percent: discountPercent, label: `省 ${discountPercent}%` } : null,
    category: pathInfo ? pathInfo.names[0] : '商品',
    categoryId: template.category,
    categoryPath: pathInfo ? pathInfo.ids : [],
    categoryNames: pathInfo ? pathInfo.names : [],
    categorySlugs: pathInfo ? pathInfo.slugs : [],
    fullCategoryName: pathInfo ? pathInfo.names.join(' > ') : '商品',
    image: `https://picsum.photos/seed/${template.image}/600/600`,
    inStock: i % 5 !== 0,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    reviews: Math.floor(Math.random() * 150) + 10,
    description: `${template.name}採用頂級工藝製作，展現品牌經典風格與卓越品質。每個細節都經過精心設計，為您帶來完美的使用體驗。`,
    tags: tags,
    // 使用 categories.js 提供的正確路由
    href: pathInfo ? pathInfo.href : `/products/${template.category}`,
    // 添加產品詳情頁路由
    detailHref: `/product/${i + 1}`
  };
});

// 根據分類篩選產品
export const getProductsByCategory = (categoryId) => {
  if (!categoryId) return mockProducts;
  return mockProducts.filter(product => 
    product.categoryPath.includes(categoryId)
  );
};

// 根據分類路徑篩選產品
export const getProductsByCategoryPath = (pathArray) => {
  if (!pathArray || pathArray.length === 0) return mockProducts;
  return mockProducts.filter(product => {
    // 檢查產品的分類路徑是否包含給定路徑的所有元素
    return pathArray.every((catId, index) => product.categoryPath[index] === catId);
  });
};

// 獲取分類下的產品數量
export const getProductCountByCategory = (categoryId) => {
  return getProductsByCategory(categoryId).length;
};

// 依產品生成詳情頁 URL（類別多層 + hash 帶 id 與名稱）
export function buildProductDetailUrl(product) {
  // 以分類 href 作為基底，避免 slug 與實際路徑段落不一致（例如 slug: meisterstuck-149，但 href 段為 .../meisterstuck/149）
  const href = product?.href || '';
  const prefix = '/products/';
  const path = href.startsWith(prefix) ? href.slice(prefix.length) : href.replace(/^\/+/, '');
  const parts = path.split('/').filter(Boolean);

  // 通用規則：依類別分支截斷到「最終掛載層級」，再接上單一 urlKey
  // - leather-goods/travel -> 僅到 /leather-goods/travel
  // - leather-goods/bags -> 到 /leather-goods/bags/{briefcases|backpacks}
  // - writing-instruments/pens -> 到 /writing-instruments/pens/{fountain-pens|ballpoint-pens|rollerball-pens}
  // - writing-instruments/refills -> notebooks 到 /.../refills/notebooks；其它筆芯到 /.../refills/pen-refills/{...}
  // - accessories/watches -> 到 /accessories/watches
  // - accessories/audio -> 到 /accessories/audio/headphones
  // - fragrance -> 到 /fragrance/{mens-fragrance|womens-fragrance}/{legend|signature|explorer...}
  // 其餘：若最後一段為純數字，移除；否則保留全部

  let used = parts;
  if (parts.length > 0) {
    const [l1, l2, l3] = parts;
    if (l1 === 'leather-goods') {
      if (l2 === 'travel') {
        // 旅行袋：固定到 travel 層級
        used = parts.slice(0, 2);
      } else if (l2 === 'bags') {
        // 公事包/後背包：保留到第 3 層（briefcases/backpacks）
        used = parts.slice(0, 3);
      } else {
        // 其他包款：至少保留到第 2 層
        used = parts.slice(0, Math.min(2, parts.length));
      }
    } else if (l1 === 'writing-instruments') {
      if (l2 === 'pens') {
        // 書寫工具-筆：保留到第 3 層（fountain/ballpoint/rollerball）
        used = parts.slice(0, 3);
      } else if (l2 === 'refills') {
        if (l3 === 'notebooks') {
          // 筆記本：保留到 notebooks
          used = parts.slice(0, 3);
        } else {
          // 其它補充品（筆芯/墨水）：保留到 pen-refills/fountain-pen-refills 等第 4 層
          used = parts.slice(0, 4);
        }
      } else {
        used = parts.slice(0, Math.min(2, parts.length));
      }
    } else if (l1 === 'accessories') {
      if (l2 === 'watches') {
        // 腕錶：到 watches 層
        used = parts.slice(0, 2);
      } else if (l2 === 'audio') {
        // 耳機：到 audio/headphones 層
        used = parts.slice(0, 3);
      } else {
        used = parts.slice(0, Math.min(2, parts.length));
      }
    } else if (l1 === 'fragrance') {
      // 香水：到 {mens-fragrance|womens-fragrance}/{legend|signature|explorer...}
      used = parts.slice(0, 3);
    } else {
      // 一般回退：若最後段是數字（146/149/50ml 等），移除末段
      const last = parts[parts.length - 1] || '';
      const digitsOnly = /^\d+$/.test(last);
      used = digitsOnly ? parts.slice(0, -1) : parts;
    }
  }

  const base = used.join('/');
  return base ? `/products/${base}/${product.urlKey}` : `/products/${product.urlKey}`;
}

// 透過 urlKey 尋找產品（格式：自定義如 146notebook）
export function getProductByUrlKey(urlKey) {
  if (!urlKey) return null;
  const key = String(urlKey).toLowerCase();
  return mockProducts.find(p => p.urlKey === key) || null;
}

// 取得商品（依 id）
export function getProductById(id) {
  return mockProducts.find(p => p.id === Number(id));
}
