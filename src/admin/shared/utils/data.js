// 產品資料模擬
export const mockProducts = [
  {
    id: 1,
    name: "優雅絲巾",
    price: 1280,
    originalPrice: 1680,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop",
    category: "配件",
    description: "採用100%真絲材質，手工印染的優雅絲巾，為您的造型增添精緻感。",
    inStock: true,
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
    category: "家居",
    description: "職人手工製作的陶瓷花瓶，結合現代簡約與傳統工藝的完美平衡。",
    inStock: true,
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
    category: "香氛",
    description: "純天然蜂蠟製作，淡雅花香，燃燒時間長達40小時。",
    inStock: true,
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
    category: "服飾",
    description: "精選羊毛混紡材質，柔軟舒適，適合秋冬季節穿著。",
    inStock: true,
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
    category: "茶品",
    description: "來自高山的有機綠茶，清香回甘，包含三種不同風味。",
    inStock: true,
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
    category: "生活用品",
    description: "天然竹纖維材質，吸水性佳，抗菌防蟎，親膚舒適。",
    inStock: false,
    featured: false,
    rating: 4.5,
    reviews: 167
  }
];

// 分類資料
export const categories = [
  { id: 'all', name: '全部商品', count: mockProducts.length },
  { id: 'accessories', name: '配件', count: mockProducts.filter(p => p.category === '配件').length },
  { id: 'home', name: '家居', count: mockProducts.filter(p => p.category === '家居').length },
  { id: 'fragrance', name: '香氛', count: mockProducts.filter(p => p.category === '香氛').length },
  { id: 'clothing', name: '服飾', count: mockProducts.filter(p => p.category === '服飾').length },
  { id: 'tea', name: '茶品', count: mockProducts.filter(p => p.category === '茶品').length },
  { id: 'lifestyle', name: '生活用品', count: mockProducts.filter(p => p.category === '生活用品').length }
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