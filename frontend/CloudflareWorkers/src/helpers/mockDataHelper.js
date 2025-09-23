/**
 * 模擬產品數據
 * 用於開發和測試階段的示例數據
 */

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
    reviews: 234,
    status: 'active',
    stock: 100,
    category: 'paint'
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
    reviews: 189,
    status: 'active',
    stock: 85,
    category: 'paint'
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
    reviews: 156,
    status: 'active',
    stock: 72,
    category: 'paint'
  },
  // 更多產品數據...
];

// 根據類別獲取產品
export const getProductsByCategory = (category) => {
  return mockProducts.filter(product => product.category === category);
};

// 根據 ID 獲取產品
export const getProductById = (id) => {
  return mockProducts.find(product => product.id === parseInt(id));
};

// 搜尋產品
export const searchProducts = (query) => {
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );
};