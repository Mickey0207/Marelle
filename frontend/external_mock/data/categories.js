// 五層級分類結構
// Level 1: 主分類
// Level 2: 次分類
// Level 3: 產品類別
// Level 4: 產品系列
// Level 5: 產品細項

export const categories = [
  {
    id: 'writing-instruments',
    name: '書寫工具',
    slug: 'writing-instruments',
    href: '/products/writing-instruments',
    children: [
      {
        id: 'pens',
        name: '鋼筆',
        slug: 'pens',
        href: '/products/writing-instruments/pens',
        children: [
          {
            id: 'fountain-pens',
            name: '經典鋼筆',
            slug: 'fountain-pens',
            href: '/products/writing-instruments/pens/fountain-pens',
            children: [
              {
                id: 'meisterstuck',
                name: 'Meisterstück 大師系列',
                slug: 'meisterstuck',
                href: '/products/writing-instruments/pens/fountain-pens/meisterstuck',
                children: [
                  { id: 'meisterstuck-149', name: 'Meisterstück 149', slug: 'meisterstuck-149', href: '/products/writing-instruments/pens/fountain-pens/meisterstuck/149' },
                  { id: 'meisterstuck-146', name: 'Meisterstück 146', slug: 'meisterstuck-146', href: '/products/writing-instruments/pens/fountain-pens/meisterstuck/146' },
                  { id: 'meisterstuck-145', name: 'Meisterstück 145', slug: 'meisterstuck-145', href: '/products/writing-instruments/pens/fountain-pens/meisterstuck/145' },
                ]
              },
              {
                id: 'heritage',
                name: 'Heritage 傳承系列',
                slug: 'heritage',
                href: '/products/writing-instruments/pens/fountain-pens/heritage',
                children: [
                  { id: 'heritage-rouge-noir', name: 'Heritage Rouge et Noir', slug: 'rouge-noir', href: '/products/writing-instruments/pens/fountain-pens/heritage/rouge-noir' },
                  { id: 'heritage-1912', name: 'Heritage 1912', slug: '1912', href: '/products/writing-instruments/pens/fountain-pens/heritage/1912' },
                ]
              },
            ]
          },
          {
            id: 'ballpoint-pens',
            name: '原子筆',
            slug: 'ballpoint-pens',
            href: '/products/writing-instruments/pens/ballpoint-pens',
            children: [
              {
                id: 'starwalker',
                name: 'StarWalker 星際行者',
                slug: 'starwalker',
                href: '/products/writing-instruments/pens/ballpoint-pens/starwalker',
                children: [
                  { id: 'starwalker-precious-resin', name: 'StarWalker 樹脂款', slug: 'precious-resin', href: '/products/writing-instruments/pens/ballpoint-pens/starwalker/precious-resin' },
                  { id: 'starwalker-metal', name: 'StarWalker 金屬款', slug: 'metal', href: '/products/writing-instruments/pens/ballpoint-pens/starwalker/metal' },
                ]
              },
            ]
          },
          {
            id: 'rollerball-pens',
            name: '鋼珠筆',
            slug: 'rollerball-pens',
            href: '/products/writing-instruments/pens/rollerball-pens',
            children: [
              {
                id: 'boheme',
                name: 'Bohème 波西米亞',
                slug: 'boheme',
                href: '/products/writing-instruments/pens/rollerball-pens/boheme',
                children: [
                  { id: 'boheme-bleu', name: 'Bohème Bleu', slug: 'bleu', href: '/products/writing-instruments/pens/rollerball-pens/boheme/bleu' },
                  { id: 'boheme-rouge', name: 'Bohème Rouge', slug: 'rouge', href: '/products/writing-instruments/pens/rollerball-pens/boheme/rouge' },
                ]
              },
            ]
          },
        ]
      },
      {
        id: 'refills',
        name: '補充筆芯與文具',
        slug: 'refills',
        href: '/products/writing-instruments/refills',
        children: [
          {
            id: 'pen-refills',
            name: '筆芯',
            slug: 'pen-refills',
            href: '/products/writing-instruments/refills/pen-refills',
            children: [
              {
                id: 'fountain-pen-refills',
                name: '鋼筆墨水',
                slug: 'fountain-pen-refills',
                href: '/products/writing-instruments/refills/pen-refills/fountain-pen-refills',
                children: [
                  { id: 'ink-bottles', name: '墨水瓶', slug: 'bottles', href: '/products/writing-instruments/refills/pen-refills/fountain-pen-refills/bottles' },
                  { id: 'ink-cartridges', name: '墨水匣', slug: 'cartridges', href: '/products/writing-instruments/refills/pen-refills/fountain-pen-refills/cartridges' },
                ]
              },
              {
                id: 'ballpoint-refills',
                name: '原子筆芯',
                slug: 'ballpoint-refills',
                href: '/products/writing-instruments/refills/pen-refills/ballpoint-refills',
                children: [
                  { id: 'ballpoint-black', name: '黑色筆芯', slug: 'black', href: '/products/writing-instruments/refills/pen-refills/ballpoint-refills/black' },
                  { id: 'ballpoint-blue', name: '藍色筆芯', slug: 'blue', href: '/products/writing-instruments/refills/pen-refills/ballpoint-refills/blue' },
                ]
              },
            ]
          },
          {
            id: 'notebooks',
            name: '筆記本',
            slug: 'notebooks',
            href: '/products/writing-instruments/refills/notebooks',
            children: [
              {
                id: 'fine-stationery',
                name: '精緻文具',
                slug: 'fine-stationery',
                href: '/products/writing-instruments/refills/notebooks/fine-stationery',
                children: [
                  { id: 'notebook-146', name: '#146 筆記本', slug: '146', href: '/products/writing-instruments/refills/notebooks/fine-stationery/146' },
                  { id: 'notebook-149', name: '#149 筆記本', slug: '149', href: '/products/writing-instruments/refills/notebooks/fine-stationery/149' },
                ]
              },
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'leather-goods',
    name: '包款',
    slug: 'leather-goods',
    href: '/products/leather-goods',
    children: [
      {
        id: 'bags',
        name: '公事包',
        slug: 'bags',
        href: '/products/leather-goods/bags',
        children: [
          {
            id: 'briefcases',
            name: '手提公事包',
            slug: 'briefcases',
            href: '/products/leather-goods/bags/briefcases',
            children: [
              {
                id: 'sartorial',
                name: 'Sartorial 系列',
                slug: 'sartorial',
                href: '/products/leather-goods/bags/briefcases/sartorial',
                children: [
                  { id: 'sartorial-slim', name: 'Sartorial 纖薄款', slug: 'slim', href: '/products/leather-goods/bags/briefcases/sartorial/slim' },
                  { id: 'sartorial-large', name: 'Sartorial 大型款', slug: 'large', href: '/products/leather-goods/bags/briefcases/sartorial/large' },
                ]
              },
            ]
          },
          {
            id: 'backpacks',
            name: '後背包',
            slug: 'backpacks',
            href: '/products/leather-goods/bags/backpacks',
            children: [
              {
                id: 'extreme',
                name: 'Extreme 系列',
                slug: 'extreme',
                href: '/products/leather-goods/bags/backpacks/extreme',
                children: [
                  { id: 'extreme-small', name: 'Extreme 小型後背包', slug: 'small', href: '/products/leather-goods/bags/backpacks/extreme/small' },
                  { id: 'extreme-large', name: 'Extreme 大型後背包', slug: 'large', href: '/products/leather-goods/bags/backpacks/extreme/large' },
                ]
              },
            ]
          },
        ]
      },
      {
        id: 'travel',
        name: '旅行袋',
        slug: 'travel',
        href: '/products/leather-goods/travel',
        children: [
          {
            id: 'luggage',
            name: '行李箱',
            slug: 'luggage',
            href: '/products/leather-goods/travel/luggage',
            children: [
              {
                id: 'my-montblanc-nightflight',
                name: 'My Montblanc Nightflight',
                slug: 'nightflight',
                href: '/products/leather-goods/travel/luggage/nightflight',
                children: [
                  { id: 'nightflight-cabin', name: 'Nightflight 登機箱', slug: 'cabin', href: '/products/leather-goods/travel/luggage/nightflight/cabin' },
                  { id: 'nightflight-large', name: 'Nightflight 大型行李箱', slug: 'large', href: '/products/leather-goods/travel/luggage/nightflight/large' },
                ]
              },
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'accessories',
    name: '配件',
    slug: 'accessories',
    href: '/products/accessories',
    children: [
      {
        id: 'watches',
        name: '腕錶',
        slug: 'watches',
        href: '/products/accessories/watches',
        children: [
          {
            id: 'heritage',
            name: 'Heritage 傳承',
            slug: 'heritage',
            href: '/products/accessories/watches/heritage',
            children: [
              {
                id: 'heritage-spirit',
                name: 'Heritage Spirit',
                slug: 'spirit',
                href: '/products/accessories/watches/heritage/spirit',
                children: [
                  { id: 'spirit-date', name: 'Heritage Spirit Date', slug: 'date', href: '/products/accessories/watches/heritage/spirit/date' },
                  { id: 'spirit-moonphase', name: 'Heritage Spirit Moonphase', slug: 'moonphase', href: '/products/accessories/watches/heritage/spirit/moonphase' },
                ]
              },
            ]
          },
        ]
      },
      {
        id: 'audio',
        name: '耳機',
        slug: 'audio',
        href: '/products/accessories/audio',
        children: [
          {
            id: 'headphones',
            name: '頭戴式耳機',
            slug: 'headphones',
            href: '/products/accessories/audio/headphones',
            children: [
              {
                id: 'mb01',
                name: 'MB 01 系列',
                slug: 'mb01',
                href: '/products/accessories/audio/headphones/mb01',
                children: [
                  { id: 'mb01-black', name: 'MB 01 黑色', slug: 'black', href: '/products/accessories/audio/headphones/mb01/black' },
                  { id: 'mb01-brown', name: 'MB 01 棕色', slug: 'brown', href: '/products/accessories/audio/headphones/mb01/brown' },
                ]
              },
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'fragrance',
    name: '香水',
    slug: 'fragrance',
    href: '/products/fragrance',
    children: [
      {
        id: 'mens-fragrance',
        name: '男士香水',
        slug: 'mens-fragrance',
        href: '/products/fragrance/mens-fragrance',
        children: [
          {
            id: 'legend',
            name: 'Legend 傳奇',
            slug: 'legend',
            href: '/products/fragrance/mens-fragrance/legend',
            children: [
              {
                id: 'legend-eau-de-toilette',
                name: 'Legend 淡香水',
                slug: 'eau-de-toilette',
                href: '/products/fragrance/mens-fragrance/legend/eau-de-toilette',
                children: [
                  { id: 'legend-50ml', name: 'Legend 50ml', slug: '50ml', href: '/products/fragrance/mens-fragrance/legend/eau-de-toilette/50ml' },
                  { id: 'legend-100ml', name: 'Legend 100ml', slug: '100ml', href: '/products/fragrance/mens-fragrance/legend/eau-de-toilette/100ml' },
                ]
              },
              {
                id: 'legend-eau-de-parfum',
                name: 'Legend 濃香水',
                slug: 'eau-de-parfum',
                href: '/products/fragrance/mens-fragrance/legend/eau-de-parfum',
                children: [
                  { id: 'legend-edp-50ml', name: 'Legend EDP 50ml', slug: '50ml', href: '/products/fragrance/mens-fragrance/legend/eau-de-parfum/50ml' },
                  { id: 'legend-edp-100ml', name: 'Legend EDP 100ml', slug: '100ml', href: '/products/fragrance/mens-fragrance/legend/eau-de-parfum/100ml' },
                ]
              },
            ]
          },
          {
            id: 'explorer',
            name: 'Explorer 探險家',
            slug: 'explorer',
            href: '/products/fragrance/mens-fragrance/explorer',
            children: [
              {
                id: 'explorer-original',
                name: 'Explorer 原創',
                slug: 'original',
                href: '/products/fragrance/mens-fragrance/explorer/original',
                children: [
                  { id: 'explorer-60ml', name: 'Explorer 60ml', slug: '60ml', href: '/products/fragrance/mens-fragrance/explorer/original/60ml' },
                  { id: 'explorer-100ml', name: 'Explorer 100ml', slug: '100ml', href: '/products/fragrance/mens-fragrance/explorer/original/100ml' },
                ]
              },
            ]
          },
        ]
      },
      {
        id: 'womens-fragrance',
        name: '女士香水',
        slug: 'womens-fragrance',
        href: '/products/fragrance/womens-fragrance',
        children: [
          {
            id: 'signature',
            name: 'Signature 簽名',
            slug: 'signature',
            href: '/products/fragrance/womens-fragrance/signature',
            children: [
              {
                id: 'signature-absolute',
                name: 'Signature Absolue',
                slug: 'absolute',
                href: '/products/fragrance/womens-fragrance/signature/absolute',
                children: [
                  { id: 'signature-30ml', name: 'Signature 30ml', slug: '30ml', href: '/products/fragrance/womens-fragrance/signature/absolute/30ml' },
                  { id: 'signature-90ml', name: 'Signature 90ml', slug: '90ml', href: '/products/fragrance/womens-fragrance/signature/absolute/90ml' },
                ]
              },
            ]
          },
        ]
      },
    ]
  },
];

// 輔助函數：遞迴搜尋分類
export const findCategoryById = (id, categoriesList = categories) => {
  for (const cat of categoriesList) {
    if (cat.id === id) return cat;
    if (cat.children) {
      const found = findCategoryById(id, cat.children);
      if (found) return found;
    }
  }
  return null;
};

// 輔助函數：獲取分類路徑
export const getCategoryPath = (id, categoriesList = categories, path = []) => {
  for (const cat of categoriesList) {
    if (cat.id === id) {
      return [...path, cat];
    }
    if (cat.children) {
      const found = getCategoryPath(id, cat.children, [...path, cat]);
      if (found) return found;
    }
  }
  return null;
};

// 輔助函數：將分類樹扁平化
export const flattenCategories = (categoriesList = categories, level = 0) => {
  const result = [];
  categoriesList.forEach(cat => {
    result.push({ ...cat, level, hasChildren: !!(cat.children && cat.children.length > 0) });
    if (cat.children) {
      result.push(...flattenCategories(cat.children, level + 1));
    }
  });
  return result;
};
