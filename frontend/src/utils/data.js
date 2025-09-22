// 根據 navigationConfig.js 設計的產品資料模擬
export const mockProducts = [
  // 油漆 > 單色 > 灰白色系 > 純白
  {
    id: 1,
    name: "純白牆面漆",
    price: 880,
    originalPrice: 1080,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    categoryPath: ["paint", "color", "gray-white", "pure-white"],
    categories: ["paint", "color", "gray-white", "pure-white"],
    description: "高品質純白色牆面漆，遮蔽力強，色澤純正，適合現代簡約風格。",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 234
  },
  {
    id: 2,
    name: "暖白色調漆",
    price: 920,
    originalPrice: 1120,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&h=400&fit=crop",
    categoryPath: ["paint", "color", "gray-white", "warm-white"],
    categories: ["paint", "color", "gray-white", "warm-white"],
    description: "溫暖舒適的白色調，帶有微妙的米色底調，營造溫馨居家氛圍。",
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 189
  },
  {
    id: 3,
    name: "冷灰調色漆",
    price: 950,
    originalPrice: 1150,
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=400&fit=crop",
    categoryPath: ["paint", "color", "gray-white", "cool-gray"],
    categories: ["paint", "color", "gray-white", "cool-gray"],
    description: "現代工業風格的冷灰色調，適合打造簡約時尚的空間感。",
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 156
  },
  
  // 油漆 > 單色 > 大地色系
  {
    id: 4,
    name: "土棕色牆漆",
    price: 980,
    originalPrice: 1180,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["paint", "color", "earth-tone", "earth-brown"],
    categories: ["paint", "color", "earth-tone", "earth-brown"],
    description: "自然大地色系的土棕色，溫潤質感，適合營造自然舒適的居住環境。",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 167
  },
  {
    id: 5,
    name: "沙米色調漆",
    price: 960,
    originalPrice: 1160,
    image: "https://images.unsplash.com/photo-1593504049359-74330189a345?w=400&h=400&fit=crop",
    categoryPath: ["paint", "color", "earth-tone", "sand-beige"],
    categories: ["paint", "color", "earth-tone", "sand-beige"],
    description: "柔和的沙米色調，中性溫暖，易於搭配各種家具風格。",
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 134
  },
  
  // 油漆 > 單色 > 其他色系
  {
    id: 6,
    name: "森林綠牆漆",
    price: 1080,
    originalPrice: 1280,
    image: "https://images.unsplash.com/photo-1574021633746-1f8a2d0c7801?w=400&h=400&fit=crop",
    categoryPath: ["paint", "color", "green"],
    categories: ["paint", "color", "green"],
    description: "深邃的森林綠色調，為空間帶來自然生機與寧靜感受。",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 198
  },
  {
    id: 7,
    name: "海洋藍色漆",
    price: 1120,
    originalPrice: 1320,
    image: "https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=400&h=400&fit=crop",
    categoryPath: ["paint", "color", "blue"],
    categories: ["paint", "color", "blue"],
    description: "清新的海洋藍色，營造開闊舒適的視覺效果。",
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 145
  },
  {
    id: 8,
    name: "奶茶色牆漆",
    price: 990,
    originalPrice: 1190,
    image: "https://images.unsplash.com/photo-1615486364268-0cc2d2395beb?w=400&h=400&fit=crop",
    categoryPath: ["paint", "color", "milk-tea"],
    categories: ["paint", "color", "milk-tea"],
    description: "溫潤的奶茶色調，兼具溫暖與優雅，適合臥室與客廳。",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 278
  },
  
  // 油漆 > 套組
  {
    id: 9,
    name: "小空間套組",
    price: 2880,
    originalPrice: 3480,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop",
    categoryPath: ["paint", "set", "small"],
    categories: ["paint", "set", "small"],
    description: "適合小空間的油漆套組，包含白色、灰色基礎色調及工具。",
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 123
  },
  {
    id: 10,
    name: "全屋改造套組",
    price: 5800,
    originalPrice: 6800,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=400&fit=crop",
    categoryPath: ["paint", "set", "large"],
    categories: ["paint", "set", "large"],
    description: "大型居家改造套組，多種色彩搭配，含完整施工工具。",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 89
  },
  {
    id: 11,
    name: "專業級套組",
    price: 8800,
    originalPrice: 10200,
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop",
    categoryPath: ["paint", "set", "professional"],
    categories: ["paint", "set", "professional"],
    description: "專業級油漆套組，高端材料配方，適合追求完美品質的用戶。",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 56
  },
  
  // 油漆 > 其他類別
  {
    id: 12,
    name: "木器保護漆",
    price: 1580,
    originalPrice: 1880,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    categoryPath: ["paint", "protective"],
    categories: ["paint", "protective"],
    description: "高效木器保護漆，防水防蟲，延長木製家具使用壽命。",
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 167
  },
  {
    id: 13,
    name: "試色罐組合",
    price: 380,
    originalPrice: 480,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    categoryPath: ["paint", "sample"],
    categories: ["paint", "sample"],
    description: "多色試色罐組合，先試色再決定，避免選色困擾。",
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 298
  },
  {
    id: 14,
    name: "專業工具組",
    price: 2280,
    originalPrice: 2680,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
    categoryPath: ["paint", "tools"],
    categories: ["paint", "tools"],
    description: "專業油漆工具組，包含刷具、滾筒、遮蔽膠帶等必需品。",
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 134
  },
  
  // 家具茶 > 椅子
  {
    id: 15,
    name: "人體工學辦公椅",
    price: 8800,
    originalPrice: 10800,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["furniture", "chair", "office"],
    categories: ["furniture", "chair", "office"],
    description: "符合人體工學設計的辦公椅，透氣網布材質，久坐舒適。",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 145
  },
  {
    id: 16,
    name: "實木餐椅",
    price: 3200,
    originalPrice: 3800,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    categoryPath: ["furniture", "chair", "dining"],
    categories: ["furniture", "chair", "dining"],
    description: "精選實木製作的餐椅，簡約設計，結實耐用。",
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 89
  },
  {
    id: 17,
    name: "舒適休閒椅",
    price: 5600,
    originalPrice: 6800,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["furniture", "chair", "leisure"],
    categories: ["furniture", "chair", "leisure"],
    description: "柔軟舒適的休閒椅，適合閱讀放鬆時光。",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 167
  },
  
  // 家具茶 > 桌子
  {
    id: 18,
    name: "現代風辦公桌",
    price: 12800,
    originalPrice: 15600,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    categoryPath: ["furniture", "table", "office"],
    categories: ["furniture", "table", "office"],
    description: "簡約現代風格的辦公桌，寬敞桌面，內建收納空間。",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 78
  },
  {
    id: 19,
    name: "實木餐桌",
    price: 18800,
    originalPrice: 22800,
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=400&h=400&fit=crop",
    categoryPath: ["furniture", "table", "dining"],
    categories: ["furniture", "table", "dining"],
    description: "天然實木餐桌，可容納6人用餐，家庭聚會首選。",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 134
  },
  {
    id: 20,
    name: "北歐咖啡桌",
    price: 4800,
    originalPrice: 5800,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["furniture", "table", "coffee"],
    categories: ["furniture", "table", "coffee"],
    description: "北歐簡約風格咖啡桌，圓潤造型，為客廳增添溫馨感。",
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 156
  },
  
  // 家具茶 > 收納
  {
    id: 21,
    name: "多功能收納櫃",
    price: 6800,
    originalPrice: 8200,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["furniture", "storage"],
    categories: ["furniture", "storage"],
    description: "多層收納設計，可放置書籍、裝飾品等，整理居家空間。",
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 198
  },
  
  // 地毯
  {
    id: 22,
    name: "北歐風客廳地毯",
    price: 2880,
    originalPrice: 3480,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["rug", "living-room"],
    categories: ["rug", "living-room"],
    description: "柔軟舒適的客廳地毯，北歐風格圖案設計。",
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 234
  },
  {
    id: 23,
    name: "溫馨臥室地毯",
    price: 1880,
    originalPrice: 2280,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["rug", "bedroom"],
    categories: ["rug", "bedroom"],
    description: "適合臥室的溫馨地毯，觸感柔軟，保暖舒適。",
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 167
  },
  {
    id: 24,
    name: "防水戶外地毯",
    price: 3200,
    originalPrice: 3800,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["rug", "outdoor"],
    categories: ["rug", "outdoor"],
    description: "防水防污的戶外地毯，適合陽台、庭院使用。",
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 89
  },
  
  // 窗簾
  {
    id: 25,
    name: "全遮光窗簾",
    price: 1680,
    originalPrice: 2080,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["curtain", "blackout"],
    categories: ["curtain", "blackout"],
    description: "100%遮光效果的窗簾，適合臥室使用，提升睡眠品質。",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 298
  },
  {
    id: 26,
    name: "優雅薄紗窗簾",
    price: 980,
    originalPrice: 1280,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["curtain", "sheer"],
    categories: ["curtain", "sheer"],
    description: "輕盈透氣的薄紗窗簾，柔化室內光線，營造浪漫氛圍。",
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 145
  },
  {
    id: 27,
    name: "實用百葉窗",
    price: 2280,
    originalPrice: 2680,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["curtain", "blinds"],
    categories: ["curtain", "blinds"],
    description: "可調節光線角度的百葉窗，實用性強，適合辦公空間。",
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 178
  },
  
  // 居家商品 > 照明
  {
    id: 28,
    name: "現代風吊燈",
    price: 3800,
    originalPrice: 4600,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["home", "lighting", "pendant"],
    categories: ["home", "lighting", "pendant"],
    description: "簡約現代風格的吊燈，LED光源，節能環保。",
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 123
  },
  {
    id: 29,
    name: "護眼檯燈",
    price: 1580,
    originalPrice: 1880,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["home", "lighting", "table"],
    categories: ["home", "lighting", "table"],
    description: "護眼設計的檯燈，無藍光危害，適合閱讀學習。",
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 234
  },
  {
    id: 30,
    name: "溫馨落地燈",
    price: 2680,
    originalPrice: 3280,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["home", "lighting", "floor"],
    categories: ["home", "lighting", "floor"],
    description: "溫暖柔和的落地燈，為空間營造舒適氛圍。",
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 156
  },
  
  // 居家商品 > 裝飾
  {
    id: 31,
    name: "抽象藝術畫",
    price: 2200,
    originalPrice: 2800,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["home", "decoration", "artwork"],
    categories: ["home", "decoration", "artwork"],
    description: "現代抽象風格藝術畫，為牆面增添藝術氣息。",
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 89
  },
  {
    id: 32,
    name: "手工陶瓷花瓶",
    price: 1880,
    originalPrice: 2280,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    categoryPath: ["home", "decoration", "vase"],
    categories: ["home", "decoration", "vase"],
    description: "職人手工製作的陶瓷花瓶，結合現代簡約與傳統工藝。",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 167
  },
  {
    id: 33,
    name: "北歐風擺飾",
    price: 680,
    originalPrice: 880,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    categoryPath: ["home", "decoration", "ornament"],
    categories: ["home", "decoration", "ornament"],
    description: "簡約北歐風格擺飾，為居家空間增添溫馨感。",
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 134
  },
  
  // 居家商品 > 香氛
  {
    id: 34,
    name: "天然蜂蠟蠟燭",
    price: 880,
    originalPrice: 1080,
    image: "https://images.unsplash.com/photo-1602874801006-8e0ac25604e9?w=400&h=400&fit=crop",
    categoryPath: ["home", "fragrance"],
    categories: ["home", "fragrance"],
    description: "純天然蜂蠟製作，淡雅花香，燃燒時間長達40小時。",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 298
  }
];

// 根據分類路徑篩選商品
export const getProductsByCategory = (categoryPath) => {
  if (!categoryPath || categoryPath === 'all') {
    return mockProducts;
  }
  
  // 支援字串或陣列格式的分類路徑
  const pathSegments = Array.isArray(categoryPath) 
    ? categoryPath 
    : categoryPath.split('/');
  
  return mockProducts.filter(product => {
    // 檢查商品的分類路徑是否匹配
    if (!product.categoryPath || !Array.isArray(product.categoryPath)) {
      return false;
    }
    
    // 如果查詢路徑比商品路徑長，不匹配
    if (pathSegments.length > product.categoryPath.length) {
      return false;
    }
    
    // 檢查每個層級是否匹配
    return pathSegments.every((segment, index) => 
      product.categoryPath[index] === segment
    );
  });
};

// 獲取特定分類的子分類商品
export const getSubcategoryProducts = (parentCategoryPath) => {
  const pathSegments = Array.isArray(parentCategoryPath) 
    ? parentCategoryPath 
    : parentCategoryPath.split('/');
  
  const subcategoryProducts = {};
  
  mockProducts.forEach(product => {
    if (product.categoryPath.length > pathSegments.length) {
      // 檢查是否為指定父分類的子商品
      const isChild = pathSegments.every((segment, index) => 
        product.categoryPath[index] === segment
      );
      
      if (isChild) {
        const subcategoryKey = product.categoryPath[pathSegments.length];
        if (!subcategoryProducts[subcategoryKey]) {
          subcategoryProducts[subcategoryKey] = [];
        }
        subcategoryProducts[subcategoryKey].push(product);
      }
    }
  });
  
  return subcategoryProducts;
};

// 分類結構 - 根據 navigationConfig.js 更新
export const categories = [
  { id: 'all', name: '所有商品', count: mockProducts.length },
  { id: 'paint', name: '油漆', count: getProductsByCategory(['paint']).length },
  { id: 'paint/color', name: '單色', count: getProductsByCategory(['paint', 'color']).length },
  { id: 'paint/set', name: '套組', count: getProductsByCategory(['paint', 'set']).length },
  { id: 'paint/protective', name: '保護漆', count: getProductsByCategory(['paint', 'protective']).length },
  { id: 'paint/sample', name: '試色罐', count: getProductsByCategory(['paint', 'sample']).length },
  { id: 'paint/tools', name: '工具組', count: getProductsByCategory(['paint', 'tools']).length },
  { id: 'furniture', name: '家具茶', count: getProductsByCategory(['furniture']).length },
  { id: 'furniture/chair', name: '椅子', count: getProductsByCategory(['furniture', 'chair']).length },
  { id: 'furniture/table', name: '桌子', count: getProductsByCategory(['furniture', 'table']).length },
  { id: 'furniture/storage', name: '收納', count: getProductsByCategory(['furniture', 'storage']).length },
  { id: 'rug', name: '地毯', count: getProductsByCategory(['rug']).length },
  { id: 'curtain', name: '窗簾', count: getProductsByCategory(['curtain']).length },
  { id: 'home', name: '居家商品', count: getProductsByCategory(['home']).length },
  { id: 'home/lighting', name: '照明', count: getProductsByCategory(['home', 'lighting']).length },
  { id: 'home/decoration', name: '裝飾', count: getProductsByCategory(['home', 'decoration']).length },
  { id: 'home/fragrance', name: '香氛', count: getProductsByCategory(['home', 'fragrance']).length }
];

// 價格格式化
export const formatPrice = (price) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(price);
};

// 獲取產品評級星星
export const getStarRating = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('★');
  }
  
  if (hasHalfStar) {
    stars.push('☆');
  }
  
  while (stars.length < 5) {
    stars.push('☆');
  }
  
  return stars.join('');
};

// 獲取精選商品
export const getFeaturedProducts = () => {
  return mockProducts.filter(product => product.featured);
};

// 獲取特定商品
export const getProductById = (id) => {
  return mockProducts.find(product => product.id === parseInt(id));
};

// 搜尋商品
export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery)
  );
};