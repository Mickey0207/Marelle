import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { mockProducts, categories, formatPrice } from '../utils/data';
import { useCart } from '../hooks';
import EnhancedProductCard from '../components/EnhancedProductCard';

const EnhancedProducts = () => {
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' 或 'list'
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    // 頁面載入動畫
    gsap.fromTo(
      '.product-item',
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      }
    );
  }, [filteredProducts]);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, sortBy, priceRange]);

  const filterAndSortProducts = async () => {
    setIsLoading(true);
    
    // 模擬 API 載入延遲
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
    setIsLoading(false);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    
    // 成功提示動畫
    gsap.fromTo('.cart-notification',
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.3,
        ease: 'back.out(1.7)',
        onComplete: () => {
          setTimeout(() => {
            gsap.to('.cart-notification', {
              scale: 0,
              opacity: 0,
              duration: 0.2
            });
          }, 2000);
        }
      }
    );
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
    setPriceRange([0, 10000]);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-[#faf8f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-chinese text-[#cc824d]">
            商品目錄
          </h1>
          <p className="text-lg font-chinese text-gray-600">
            發現 {filteredProducts.length} 件精選商品
          </p>
        </div>

        {/* 搜尋和篩選區域 */}
        <div className="bg-white/80 border border-gray-200 p-6 mb-8 rounded-xl shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* 搜尋框 */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋商品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese"
              />
            </div>

            {/* 控制按鈕組 */}
            <div className="flex items-center gap-3">
              {/* 篩選器切換 */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 rounded-lg transition-all duration-200 font-medium lg:hidden font-chinese flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <FunnelIcon className="w-5 h-5 mr-2" />
                篩選
              </button>

              {/* 視圖切換 */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-[#cc824d] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-[#cc824d] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>

              {/* 排序 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese"
              >
                <option value="name">依名稱排序</option>
                <option value="price-low">價格由低到高</option>
                <option value="price-high">價格由高到低</option>
                <option value="rating">依評分排序</option>
              </select>
            </div>
          </div>

          {/* 篩選器 */}
          <div className={`mt-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 分類篩選 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">分類</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese"
                >
                  <option value="all">全部分類</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 價格範圍 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  價格範圍: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* 重置按鈕 */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-chinese"
                >
                  重置篩選
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 載入指示器 */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#cc824d] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-chinese">載入中...</p>
          </div>
        )}

        {/* 商品網格 */}
        {!isLoading && (
          <>
            {filteredProducts.length > 0 ? (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }`}>
                {filteredProducts.map((product) => (
                  <EnhancedProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(product.id)}
                    showQuickView={true}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-8 rounded-xl max-w-md mx-auto bg-white/80 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-2 font-chinese text-gray-700">
                    沒有找到相關商品
                  </h3>
                  <p className="mb-4 font-chinese text-gray-500">
                    請嘗試調整搜尋條件或篩選器
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 rounded-lg font-medium font-chinese bg-[#cc824d] hover:bg-[#b3723f] text-white transition-colors duration-200"
                  >
                    清除篩選
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* 成功通知 */}
        <div className="cart-notification fixed top-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg opacity-0 scale-0 z-50">
          <p className="font-chinese">已加入購物車！</p>
        </div>
      </div>

      {/* 快速瀏覽模態框 */}
      {showQuickView && quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold font-chinese">快速瀏覽</h3>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold font-chinese">{quickViewProduct.name}</h4>
                  <p className="text-gray-600 font-chinese">{quickViewProduct.description}</p>
                  <div className="text-xl font-bold text-[#cc824d]">
                    {formatPrice(quickViewProduct.price)}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToCart(quickViewProduct)}
                      className="flex-1 py-2 px-4 bg-[#cc824d] hover:bg-[#b3723f] text-white rounded-lg transition-colors duration-200 font-chinese"
                    >
                      加入購物車
                    </button>
                    <button
                      onClick={() => {
                        setShowQuickView(false);
                        // 導航到商品詳情頁
                        window.location.href = `/products/${quickViewProduct.id}`;
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-chinese"
                    >
                      查看詳情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProducts;