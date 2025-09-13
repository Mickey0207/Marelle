import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { mockProducts, categories, formatPrice } from '../utils/data';
import { useCart } from '../hooks';

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const { addToCart } = useCart();

  useEffect(() => {
    // Animate products on load
    gsap.fromTo(
      '.product-item',
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      }
    );
  }, [filteredProducts]);

  useEffect(() => {
    let filtered = mockProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryName = categories.find(c => c.id === selectedCategory)?.name;
      if (categoryName) {
        filtered = filtered.filter(product => product.category === categoryName);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
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
  }, [selectedCategory, sortBy, searchTerm]);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show success feedback
    gsap.fromTo(
      `#product-${product.id} .add-to-cart-btn`,
      { scale: 1 },
      { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 }
    );
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-chinese text-primary-btn">
            商品目錄
          </h1>
          <p className="text-lg font-chinese text-lofi">
            發現 {filteredProducts.length} 件精選商品
          </p>
        </div>

        {/* Search and Filters */}
  <div className="p-6 mb-8 rounded-xl shadow-sm bg-white/80 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋商品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-lofi w-full px-4 py-3 pl-10 rounded-lg font-chinese transition-all duration-200"
              />
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 rounded-lg transition-all duration-200 font-medium lg:hidden font-chinese flex items-center btn-secondary"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
              篩選
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-lofi px-4 py-3 rounded-lg font-chinese transition-all duration-200"
            >
              <option value="name">依名稱排序</option>
              <option value="price-low">價格由低到高</option>
              <option value="price-high">價格由高到低</option>
              <option value="rating">依評分排序</option>
            </select>
          </div>

          {/* Categories */}
          <div className={`mt-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-btn-lofi px-4 py-2 font-medium font-chinese ${selectedCategory === category.id ? 'selected' : ''}`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} id={`product-${product.id}`} className="product-item group">
              <div className="product-card-lofi shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 z-10 p-2 backdrop-blur-sm rounded-full transition-all duration-200 bg-white/90 border border-gray-200"
                >
                  {favorites.has(product.id) ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-lofi" />
                  )}
                </button>

                {/* Stock status */}
                {!product.inStock && (
                  <div className="absolute top-4 left-4 z-10 px-2 py-1 text-white text-xs rounded font-chinese bg-black/80">
                    缺貨
                  </div>
                )}

                {/* Product Image */}
                <Link to={`/products/${product.id}`} className="block">
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-6">
                  <div className="text-sm mb-2 font-chinese text-primary-btn">
                    {product.category}
                  </div>
                  
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold mb-2 font-chinese line-clamp-2 transition-opacity duration-200 text-lofi hover:opacity-80">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm mb-4 font-chinese line-clamp-2 text-lofi">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 text-sm">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="text-xs ml-2 text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold price-tag">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm price-original">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`add-to-cart-btn w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 font-chinese ${
                      !product.inStock ? 'cursor-not-allowed status-badge-lofi out' : 'bg-primary-btn text-btn-white hover:bg-primary-btn/90 transform hover:scale-105 shadow-lg hover:shadow-xl status-badge-lofi'
                    }`}
                  >
                    {product.inStock ? '加入購物車' : '暫時缺貨'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No products found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="p-8 rounded-xl max-w-md mx-auto shadow-sm bg-white/80 border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 font-chinese text-lofi">
                沒有找到相關商品
              </h3>
              <p className="mb-4 font-chinese text-gray-500">
                請嘗試調整搜尋條件或篩選器
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 rounded-lg font-medium font-chinese transform hover:scale-105 transition-all duration-200 bg-primary-btn text-btn-white"
              >
                清除篩選
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;