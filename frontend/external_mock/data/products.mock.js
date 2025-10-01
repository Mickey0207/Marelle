// 產品 Mock 資料
export const mockProducts = Array.from({ length: 20 }).map((_, i) => ({
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
  description: '這是一個示範用的商品描述，展示前端靜態頁面。'
}));
