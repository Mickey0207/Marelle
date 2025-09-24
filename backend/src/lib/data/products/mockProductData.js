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

// 發佈狀態（新增商品頁使用）
export const PUBLICATION_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
};

// 模擬產品資料
export const mockProducts = [
  {
    id: 1,
    name: "優雅絲巾",
    slug: "elegant-scarf",
    shortDescription: "100% 真絲，手工印染，輕盈絲滑。",
    // 舊欄位保留相容
    price: 1280,
    originalPrice: 1680,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=800&fit=crop",
    category: MOCK_CATEGORIES.ACCESSORIES,
    // 新分類格式（供新增/編輯頁使用）
    categories: [
      { id: 'accessories', name: MOCK_CATEGORIES.ACCESSORIES, slug: 'accessories' }
    ],
    tags: ["絲巾", "真絲", "優雅"],
    description: "採用100%真絲材質，手工印染的優雅絲巾，為您的造型增添精緻感。",
    // 存貨與發佈狀態
    inStock: true,
    availabilityStatus: PRODUCT_STATUS.IN_STOCK,
    status: PUBLICATION_STATUS.ACTIVE,
    visibility: 'visible',
    featured: true,
    rating: 4.8,
    reviews: 156,
    // 價格欄位（新增商品頁）
    comparePrice: 1680,
    costPrice: 750,
    profit: 1280 - 750,
    profitMargin: Number((((1280 - 750) / 1280) * 100).toFixed(2)),
    // SKU 與變體
    baseSKU: 'scarf',
    hasVariants: true,
    skuVariants: [
      {
        id: 'sku-1-a',
        sku: 'scarfbk',
        name: '黑色',
        path: [ { level: '顏色', option: '黑色' } ],
        pathDisplay: '顏色: 黑色',
        config: {
          price: 1280,
          comparePrice: 1680,
          costPrice: 750,
          quantity: 20,
          lowStockThreshold: 5,
          allowBackorder: false,
          trackQuantity: true,
          weight: '120g',
          dimensions: { length: '70', width: '70', height: '1' },
          isActive: true,
          barcode: 'SCARF-BK-001',
          hsCode: '6214.90',
          origin: 'TW',
          note: ''
        }
      },
      {
        id: 'sku-1-b',
        sku: 'scarfbn',
        name: '棕色',
        path: [ { level: '顏色', option: '棕色' } ],
        pathDisplay: '顏色: 棕色',
        config: {
          price: 1280,
          comparePrice: 1680,
          costPrice: 750,
          quantity: 15,
          lowStockThreshold: 5,
          allowBackorder: false,
          trackQuantity: true,
          weight: '120g',
          dimensions: { length: '70', width: '70', height: '1' },
          isActive: true,
          barcode: 'SCARF-BN-001',
          hsCode: '6214.90',
          origin: 'TW',
          note: ''
        }
      }
    ],
    // 圖片（ImageUpload 期望的結構）
    images: [
      {
        id: 101,
        url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=800&fit=crop",
        name: "elegant-scarf-1.jpg",
        size: 250000,
        type: "image/jpeg"
      },
      {
        id: 102,
        url: "https://images.unsplash.com/photo-1520975922284-87a6c1dc7f3d?w=800&h=800&fit=crop",
        name: "elegant-scarf-2.jpg",
        size: 245000,
        type: "image/jpeg"
      }
    ],
    // SEO 與搜尋
    metaTitle: "優雅絲巾 | 真絲手工印染",
    metaDescription: "100% 真絲優雅絲巾，手工印染，質感細膩，為造型增添亮點。",
    sitemapIndexing: true,
    customCanonicalUrl: "",
    openGraphTitle: "優雅絲巾",
    openGraphDescription: "手工印染的真絲絲巾，輕盈絲滑。",
    openGraphImage: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200&h=630&fit=crop",
    useMetaTitleForOG: true,
    useMetaDescriptionForOG: true,
    excludeFromSearch: false,
    searchTitle: "優雅絲巾",
    searchDescription: "真絲絲巾，手工印染，時尚百搭。",
    searchImage: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=800&fit=crop",
    useMetaTitleForSearch: true,
    useMetaDescriptionForSearch: true,
    useOpenGraphImageForSearch: true
  },
  {
    id: 2,
    name: "手工陶瓷花瓶",
    slug: "handmade-ceramic-vase",
    shortDescription: "職人手工，簡約質樸，家居點綴之選。",
    price: 2880,
    originalPrice: 3200,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop",
    category: MOCK_CATEGORIES.HOME,
    categories: [
      { id: 'home', name: MOCK_CATEGORIES.HOME, slug: 'home' }
    ],
    tags: ["陶瓷", "手工", "花器"],
    description: "職人手工製作的陶瓷花瓶，結合現代簡約與傳統工藝的完美平衡。",
    inStock: true,
    availabilityStatus: PRODUCT_STATUS.IN_STOCK,
    status: PUBLICATION_STATUS.ACTIVE,
    visibility: 'visible',
    featured: true,
    rating: 4.9,
    reviews: 89,
    comparePrice: 3200,
    costPrice: 1600,
    profit: 2880 - 1600,
    profitMargin: Number((((2880 - 1600) / 2880) * 100).toFixed(2)),
    baseSKU: 'vase',
    hasVariants: false,
    skuVariants: [],
    images: [
      { id: 201, url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop", name: "ceramic-vase-1.jpg", size: 230000, type: "image/jpeg" },
      { id: 202, url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&h=800&fit=crop", name: "ceramic-vase-2.jpg", size: 235000, type: "image/jpeg" }
    ],
    metaTitle: "手工陶瓷花瓶",
    metaDescription: "簡約質樸的手工陶瓷花瓶，為家居增添溫度。",
    sitemapIndexing: true,
    customCanonicalUrl: "",
    openGraphTitle: "手工陶瓷花瓶",
    openGraphDescription: "職人手工製作的陶瓷花瓶。",
    openGraphImage: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&h=630&fit=crop",
    useMetaTitleForOG: true,
    useMetaDescriptionForOG: true,
    excludeFromSearch: false,
    searchTitle: "手工陶瓷花瓶",
    searchDescription: "家居點綴，簡約質樸。",
    searchImage: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop",
    useMetaTitleForSearch: true,
    useMetaDescriptionForSearch: true,
    useOpenGraphImageForSearch: true
  },
  {
    id: 3,
    name: "天然蜂蠟蠟燭",
    slug: "beeswax-candle",
    shortDescription: "天然蜂蠟，溫潤香氣，持久燃燒。",
    price: 680,
    originalPrice: 880,
    image: "https://images.unsplash.com/photo-1602874801006-8e0ac25604e9?w=800&h=800&fit=crop",
    category: MOCK_CATEGORIES.FRAGRANCE,
    categories: [ { id: 'fragrance', name: MOCK_CATEGORIES.FRAGRANCE, slug: 'fragrance' } ],
    tags: ["蜂蠟", "香氛", "居家"],
    description: "純天然蜂蠟製作，淡雅花香，燃燒時間長達40小時。",
    inStock: true,
    availabilityStatus: PRODUCT_STATUS.IN_STOCK,
    status: PUBLICATION_STATUS.ACTIVE,
    visibility: 'visible',
    featured: false,
    rating: 4.7,
    reviews: 234,
    comparePrice: 880,
    costPrice: 380,
    profit: 680 - 380,
    profitMargin: Number((((680 - 380) / 680) * 100).toFixed(2)),
    baseSKU: 'candle',
    hasVariants: false,
    skuVariants: [],
    images: [
      { id: 301, url: "https://images.unsplash.com/photo-1602874801006-8e0ac25604e9?w=800&h=800&fit=crop", name: "beeswax-candle-1.jpg", size: 210000, type: "image/jpeg" }
    ],
    metaTitle: "天然蜂蠟蠟燭",
    metaDescription: "純天然蜂蠟，淡雅香氣，40 小時燃燒。",
    sitemapIndexing: true,
    customCanonicalUrl: "",
    openGraphTitle: "天然蜂蠟蠟燭",
    openGraphDescription: "天然材料，溫潤香氣。",
    openGraphImage: "https://images.unsplash.com/photo-1602874801006-8e0ac25604e9?w=1200&h=630&fit=crop",
    useMetaTitleForOG: true,
    useMetaDescriptionForOG: true,
    excludeFromSearch: false,
    searchTitle: "天然蜂蠟蠟燭",
    searchDescription: "蜂蠟製作，持久燃燒。",
    searchImage: "https://images.unsplash.com/photo-1602874801006-8e0ac25604e9?w=800&h=800&fit=crop",
    useMetaTitleForSearch: true,
    useMetaDescriptionForSearch: true,
    useOpenGraphImageForSearch: true
  },
  {
    id: 4,
    name: "羊毛混紡毛衣",
    slug: "wool-blend-sweater",
    shortDescription: "保暖舒適，秋冬必備。",
    price: 3200,
    originalPrice: 4200,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop",
    category: MOCK_CATEGORIES.CLOTHING,
    categories: [ { id: 'clothing', name: MOCK_CATEGORIES.CLOTHING, slug: 'clothing' } ],
    tags: ["毛衣", "保暖", "秋冬"],
    description: "精選羊毛混紡材質，柔軟舒適，適合秋冬季節穿著。",
    inStock: true,
    availabilityStatus: PRODUCT_STATUS.IN_STOCK,
    status: PUBLICATION_STATUS.ACTIVE,
    visibility: 'visible',
    featured: true,
    rating: 4.6,
    reviews: 112,
    comparePrice: 4200,
    costPrice: 1900,
    profit: 3200 - 1900,
    profitMargin: Number((((3200 - 1900) / 3200) * 100).toFixed(2)),
    baseSKU: 'sweater',
    hasVariants: true,
    skuVariants: [
      {
        id: 'sku-4-a',
        sku: 'sweaterbkL',
        name: '黑色 L',
        path: [ { level: '顏色', option: '黑色' }, { level: '尺寸', option: 'L' } ],
        pathDisplay: '顏色: 黑色 → 尺寸: L',
        config: {
          price: 3200,
          comparePrice: 4200,
          costPrice: 1900,
          quantity: 8,
          lowStockThreshold: 3,
          allowBackorder: false,
          trackQuantity: true,
          weight: '500g',
          dimensions: { length: '', width: '', height: '' },
          isActive: true,
          barcode: 'SWEATER-BK-L-001',
          hsCode: '6110.30',
          origin: 'TW',
          note: ''
        }
      },
      {
        id: 'sku-4-b',
        sku: 'sweatergyM',
        name: '灰色 M',
        path: [ { level: '顏色', option: '灰色' }, { level: '尺寸', option: 'M' } ],
        pathDisplay: '顏色: 灰色 → 尺寸: M',
        config: {
          price: 3200,
          comparePrice: 4200,
          costPrice: 1900,
          quantity: 10,
          lowStockThreshold: 3,
          allowBackorder: false,
          trackQuantity: true,
          weight: '480g',
          dimensions: { length: '', width: '', height: '' },
          isActive: true,
          barcode: 'SWEATER-GY-M-001',
          hsCode: '6110.30',
          origin: 'TW',
          note: ''
        }
      }
    ],
    images: [
      { id: 401, url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop", name: "wool-sweater-1.jpg", size: 260000, type: "image/jpeg" }
    ],
    metaTitle: "羊毛混紡毛衣",
    metaDescription: "保暖舒適的羊毛混紡毛衣，適合秋冬穿搭。",
    sitemapIndexing: true,
    customCanonicalUrl: "",
    openGraphTitle: "羊毛混紡毛衣",
    openGraphDescription: "經典百搭，舒適保暖。",
    openGraphImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&h=630&fit=crop",
    useMetaTitleForOG: true,
    useMetaDescriptionForOG: true,
    excludeFromSearch: false,
    searchTitle: "羊毛混紡毛衣",
    searchDescription: "秋冬保暖必備單品。",
    searchImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop",
    useMetaTitleForSearch: true,
    useMetaDescriptionForSearch: true,
    useOpenGraphImageForSearch: true
  },
  {
    id: 5,
    name: "有機綠茶組合",
    slug: "organic-green-tea-set",
    shortDescription: "高山有機綠茶，三種風味一次體驗。",
    price: 1680,
    originalPrice: 2080,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop",
    category: MOCK_CATEGORIES.TEA,
    categories: [ { id: 'tea', name: MOCK_CATEGORIES.TEA, slug: 'tea' } ],
    tags: ["茶", "有機", "綠茶"],
    description: "來自高山的有機綠茶，清香回甘，包含三種不同風味。",
    inStock: true,
    availabilityStatus: PRODUCT_STATUS.IN_STOCK,
    status: PUBLICATION_STATUS.ACTIVE,
    visibility: 'visible',
    featured: false,
    rating: 4.8,
    reviews: 78,
    comparePrice: 2080,
    costPrice: 980,
    profit: 1680 - 980,
    profitMargin: Number((((1680 - 980) / 1680) * 100).toFixed(2)),
    baseSKU: 'greentea',
    hasVariants: true,
    skuVariants: [
      {
        id: 'sku-5-a',
        sku: 'greentealight',
        name: '清香型',
        path: [ { level: '風味', option: '清香型' } ],
        pathDisplay: '風味: 清香型',
        config: {
          price: 1680,
          comparePrice: 2080,
          costPrice: 980,
          quantity: 30,
          lowStockThreshold: 5,
          allowBackorder: false,
          trackQuantity: true,
          weight: '200g',
          dimensions: { length: '', width: '', height: '' },
          isActive: true,
          barcode: 'TEA-LGT-001',
          hsCode: '0902.10',
          origin: 'TW',
          note: ''
        }
      },
      {
        id: 'sku-5-b',
        sku: 'greenteaheavy',
        name: '濃香型',
        path: [ { level: '風味', option: '濃香型' } ],
        pathDisplay: '風味: 濃香型',
        config: {
          price: 1680,
          comparePrice: 2080,
          costPrice: 980,
          quantity: 25,
          lowStockThreshold: 5,
          allowBackorder: false,
          trackQuantity: true,
          weight: '200g',
          dimensions: { length: '', width: '', height: '' },
          isActive: true,
          barcode: 'TEA-HVY-001',
          hsCode: '0902.10',
          origin: 'TW',
          note: ''
        }
      }
    ],
    images: [
      { id: 501, url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop", name: "green-tea-1.jpg", size: 200000, type: "image/jpeg" }
    ],
    metaTitle: "有機綠茶組合",
    metaDescription: "高山有機綠茶，三款風味一次體驗。",
    sitemapIndexing: true,
    customCanonicalUrl: "",
    openGraphTitle: "有機綠茶組合",
    openGraphDescription: "清香回甘，純淨自然。",
    openGraphImage: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&h=630&fit=crop",
    useMetaTitleForOG: true,
    useMetaDescriptionForOG: true,
    excludeFromSearch: false,
    searchTitle: "有機綠茶組合",
    searchDescription: "自用送禮兩相宜。",
    searchImage: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop",
    useMetaTitleForSearch: true,
    useMetaDescriptionForSearch: true,
    useOpenGraphImageForSearch: true
  },
  {
    id: 6,
    name: "竹纖維浴巾",
    slug: "bamboo-fiber-towel",
    shortDescription: "竹纖維材質，柔軟親膚，吸水力強。",
    price: 880,
    originalPrice: 1180,
    image: "https://images.unsplash.com/photo-1620912330775-011bb5d31d4e?w=800&h=800&fit=crop",
    category: MOCK_CATEGORIES.LIFESTYLE,
    categories: [ { id: 'lifestyle', name: MOCK_CATEGORIES.LIFESTYLE, slug: 'lifestyle' } ],
    tags: ["浴巾", "竹纖維", "親膚"],
    description: "天然竹纖維材質，吸水性佳，抗菌防蟎，親膚舒適。",
    inStock: false,
    availabilityStatus: PRODUCT_STATUS.OUT_OF_STOCK,
    status: PUBLICATION_STATUS.ACTIVE,
    visibility: 'visible',
    featured: false,
    rating: 4.5,
    reviews: 167,
    comparePrice: 1180,
    costPrice: 500,
    profit: 880 - 500,
    profitMargin: Number((((880 - 500) / 880) * 100).toFixed(2)),
    baseSKU: 'towel',
    hasVariants: false,
    skuVariants: [],
    images: [
      { id: 601, url: "https://images.unsplash.com/photo-1620912330775-011bb5d31d4e?w=800&h=800&fit=crop", name: "bamboo-towel-1.jpg", size: 205000, type: "image/jpeg" }
    ],
    metaTitle: "竹纖維浴巾",
    metaDescription: "柔軟親膚的竹纖維浴巾，吸水性佳。",
    sitemapIndexing: true,
    customCanonicalUrl: "",
    openGraphTitle: "竹纖維浴巾",
    openGraphDescription: "天然材質，舒適耐用。",
    openGraphImage: "https://images.unsplash.com/photo-1620912330775-011bb5d31d4e?w=1200&h=630&fit=crop",
    useMetaTitleForOG: true,
    useMetaDescriptionForOG: true,
    excludeFromSearch: false,
    searchTitle: "竹纖維浴巾",
    searchDescription: "超強吸水，親膚舒適。",
    searchImage: "https://images.unsplash.com/photo-1620912330775-011bb5d31d4e?w=800&h=800&fit=crop",
    useMetaTitleForSearch: true,
    useMetaDescriptionForSearch: true,
    useOpenGraphImageForSearch: true
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
  // 以 inStock 布林判斷是否有庫存
  return mockProducts.filter(product => !!product.inStock);
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