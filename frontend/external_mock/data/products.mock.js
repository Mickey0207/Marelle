import { TAG_TYPES } from './productTags.js';

// 產品 Mock 資料
export const mockProducts = Array.from({ length: 20 }).map((_, i) => {
  const tags = [];
  
  // 根據索引分配不同標籤做示範
  if (i % 7 === 0 && i % 5 !== 0) tags.push(TAG_TYPES.HOT_SALE); // 熱銷中
  if (i % 8 === 0 && i % 5 !== 0) tags.push(TAG_TYPES.PRE_ORDER); // 預購中
  if (i % 9 === 0) tags.push(TAG_TYPES.NEW_ARRIVAL); // 新品
  if (i % 6 === 0 && i % 5 !== 0) tags.push(TAG_TYPES.LIMITED); // 限量
  if (i % 3 === 0 && i % 5 !== 0) tags.push(TAG_TYPES.SALE); // 特價
  
  return {
    id: i + 1,
    name: `質感商品 ${i + 1}`,
    price: 100 + i * 10,
    originalPrice: i % 3 === 0 ? 150 + i * 10 : undefined,
    category: i % 2 === 0 ? '居家' : '廚房',
    categoryPath: i % 2 === 0 ? ['home'] : ['kitchen'],
    image: `https://picsum.photos/seed/marelle-${i}/600/600`,
    inStock: i % 5 !== 0,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 200),
    description: '這是一個示範用的商品描述，展示前端靜態頁面。',
    tags: tags // 產品標籤
  };
});
