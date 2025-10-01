import { TAG_TYPES } from './productTags.js';
import { categories, flattenCategories } from './categories.js';

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

// 獲取分類的完整路徑
const getCategoryFullPath = (categoryId) => {
  const allCategories = flattenCategories();
  const category = allCategories.find(cat => cat.id === categoryId);
  if (!category) return null;
  
  // 遞迴獲取父分類
  const getParents = (id, cats = categories) => {
    for (const cat of cats) {
      if (cat.id === id) return [cat];
      if (cat.children) {
        for (const child of cat.children) {
          if (child.id === id) return [cat, child];
          if (child.children) {
            const found = getParents(id, child.children);
            if (found) return [cat, child, ...found];
          }
        }
      }
    }
    return [];
  };
  
  const path = getParents(categoryId);
  return {
    ids: path.map(c => c.id),
    names: path.map(c => c.name),
    slugs: path.map(c => c.slug),
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
  
  return {
    id: i + 1,
    name: template.name,
    price: template.price,
    originalPrice: tags.includes(TAG_TYPES.SALE) ? Math.round(template.price * 1.3) : undefined,
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
    href: pathInfo ? pathInfo.category.href : `/products/${template.category}`
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
