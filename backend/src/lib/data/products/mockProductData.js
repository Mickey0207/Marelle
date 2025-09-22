// 模擬商品數據管理器
// 用於開發和測試階段的產品數據

// 模擬商品分類枚舉 (簡化版，用於演示數據)
const MOCK_CATEGORIES = {
  ACCESSORIES: '配件',
  HOME: '家居',
  FRAGRANCE: '香氛',
  CLOTHING: '服飾',
  TEA: '茶品',
  LIFESTYLE: '生活用品'
};

// 產品狀態枚舉
export const PRODUCT_STATUS = {
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
  PRE_ORDER: 'pre_order',
  DISCONTINUED: 'discontinued'
};

// 模擬產品資料
export const mockProducts = [
  {
    id: 1,
    name: "優雅絲巾",
    price: 1280,
    originalPrice: 1680,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop",
    category: MOCK_CATEGORIES.ACCESSORIES,
    description: "採用100%真絲材質，手工印染的優雅絲巾，為您的造型增添精緻感。",
    inStock: true,
    status: PRODUCT_STATUS.IN_STOCK,
    featured: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: 2,
    name: "手工陶瓷花瓶",
    price: 2880,
    originalPrice: 3200,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    category: MOCK_CATEGORIES.HOME,
    description: "職人手工製作的陶瓷花瓶，結合現代簡約與傳統工藝的完美平衡。",
    inStock: true,
    status: PRODUCT_STATUS.IN_STOCK,
    featured: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: 3,
    name: "天然蜂蠟蠟燭",
    price: 680,
    originalPrice: 880,
    image: "https://images.unsplash.com/photo-1602874801006-8e0ac25604e9?w=400&h=400&fit=crop",
    category: MOCK_CATEGORIES.FRAGRANCE,
    description: "純天然蜂蠟製作，淡雅花香，燃燒時間長達40小時。",
    inStock: true,
    status: PRODUCT_STATUS.IN_STOCK,
    featured: false,
    rating: 4.7,
    reviews: 234
  },
  {
    id: 4,
    name: "羊毛混紡毛衣",
    price: 3200,
    originalPrice: 4200,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
    category: MOCK_CATEGORIES.CLOTHING,
    description: "精選羊毛混紡材質，柔軟舒適，適合秋冬季節穿著。",
    inStock: true,
    status: PRODUCT_STATUS.IN_STOCK,
    featured: true,
    rating: 4.6,
    reviews: 112
  },
  {
    id: 5,
    name: "有機綠茶組合",
    price: 1680,
    originalPrice: 2080,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
    category: MOCK_CATEGORIES.TEA,
    description: "來自高山的有機綠茶，清香回甘，包含三種不同風味。",
    inStock: true,
    status: PRODUCT_STATUS.IN_STOCK,
    featured: false,
    rating: 4.8,
    reviews: 78
  },
  {
    id: 6,
    name: "竹纖維浴巾",
    price: 880,
    originalPrice: 1180,
    image: "https://images.unsplash.com/photo-1620912330775-011bb5d31d4e?w=400&h=400&fit=crop",
    category: MOCK_CATEGORIES.LIFESTYLE,
    description: "天然竹纖維材質，吸水性佳，抗菌防蟎，親膚舒適。",
    inStock: false,
    status: PRODUCT_STATUS.OUT_OF_STOCK,
    featured: false,
    rating: 4.5,
    reviews: 167
  }
];

// 計算產品分類統計的輔助函數
const calculateCategoryCount = (categoryName) => {
  return mockProducts.filter(p => p.category === categoryName).length;
};

// 模擬分類資料（基於實際產品數據計算數量）
export const mockProductCategories = [
  { 
    id: 'all', 
    name: '全部商品', 
    slug: 'all',
    count: mockProducts.length 
  },
  { 
    id: 'accessories', 
    name: MOCK_CATEGORIES.ACCESSORIES, 
    slug: 'accessories',
    count: calculateCategoryCount(MOCK_CATEGORIES.ACCESSORIES)
  },
  { 
    id: 'home', 
    name: MOCK_CATEGORIES.HOME, 
    slug: 'home',
    count: calculateCategoryCount(MOCK_CATEGORIES.HOME)
  },
  { 
    id: 'fragrance', 
    name: MOCK_CATEGORIES.FRAGRANCE, 
    slug: 'fragrance',
    count: calculateCategoryCount(MOCK_CATEGORIES.FRAGRANCE)
  },
  { 
    id: 'clothing', 
    name: MOCK_CATEGORIES.CLOTHING, 
    slug: 'clothing',
    count: calculateCategoryCount(MOCK_CATEGORIES.CLOTHING)
  },
  { 
    id: 'tea', 
    name: MOCK_CATEGORIES.TEA, 
    slug: 'tea',
    count: calculateCategoryCount(MOCK_CATEGORIES.TEA)
  },
  { 
    id: 'lifestyle', 
    name: MOCK_CATEGORIES.LIFESTYLE, 
    slug: 'lifestyle',
    count: calculateCategoryCount(MOCK_CATEGORIES.LIFESTYLE)
  }
];

// =====  工具函數  =====

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

// 根據分類篩選產品
export const getProductsByCategory = (categoryId) => {
  if (categoryId === 'all') return mockProducts;
  const category = Object.values(MOCK_CATEGORIES).find((cat, index) => 
    Object.keys(MOCK_CATEGORIES)[index].toLowerCase() === categoryId
  );
  return mockProducts.filter(product => product.category === category);
};

// 獲取特色商品
export const getFeaturedProducts = () => {
  return mockProducts.filter(product => product.featured);
};

// 獲取有庫存的商品
export const getInStockProducts = () => {
  return mockProducts.filter(product => product.status === PRODUCT_STATUS.IN_STOCK);
};

// 根據價格範圍篩選商品
export const getProductsByPriceRange = (minPrice, maxPrice) => {
  return mockProducts.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
};

// 搜尋產品
export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
};

// 根據評分排序
export const sortProductsByRating = (products = mockProducts, order = 'desc') => {
  return [...products].sort((a, b) => 
    order === 'desc' ? b.rating - a.rating : a.rating - b.rating
  );
};

// 根據價格排序
export const sortProductsByPrice = (products = mockProducts, order = 'asc') => {
  return [...products].sort((a, b) => 
    order === 'asc' ? a.price - b.price : b.price - a.price
  );
};

// 計算折扣百分比
export const calculateDiscountPercentage = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// 獲取產品統計
export const getProductStats = () => {
  const totalProducts = mockProducts.length;
  const inStockProducts = getInStockProducts().length;
  const featuredProducts = getFeaturedProducts().length;
  const averagePrice = mockProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts;
  const averageRating = mockProducts.reduce((sum, p) => sum + p.rating, 0) / totalProducts;
  
  return {
    totalProducts,
    inStockProducts,
    outOfStockProducts: totalProducts - inStockProducts,
    featuredProducts,
    averagePrice: Math.round(averagePrice),
    averageRating: Number(averageRating.toFixed(1))
  };
};