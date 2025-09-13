import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ChevronRightIcon, SparklesIcon, HeartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { mockProducts, formatPrice } from '../utils/data';

const Home = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const productsRef = useRef(null);

  useEffect(() => {
    // Hero section animation
    gsap.fromTo(
      '.hero-content',
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
      }
    );

    // Product cards stagger animation
    gsap.fromTo(
      '.product-card',
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3,
      }
    );
  }, []);

  const featuredProducts = mockProducts.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center hero-content">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-chinese text-primary-btn">
              Lo-Fi
              <span className="text-lofi"> Marelle</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-lofi">
              探索溫暖質樸的生活美學，每件商品都承載著簡約而美好的生活態度
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 bg-primary-btn text-btn-white"
            >
              開始探索
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
  <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-chinese text-primary-btn">精選商品</h2>
            <p className="max-w-2xl mx-auto text-lofi">
              嚴選質感生活用品，為您的生活空間增添溫暖與美好
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="product-card group"
              >
                <div className="bg-white/80 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden" style={{background: 'linear-gradient(135deg, #EFEAE4 0%, #f5f1e8 100%)'}}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 group-hover:opacity-80 transition-opacity duration-200" style={{color: '#666666'}}>
                      {product.name}
                    </h3>
                    <p className="text-sm mb-3 line-clamp-2" style={{color: 'rgba(102, 102, 102, 0.7)'}}>
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold" style={{color: '#CC824D'}}>
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm line-through" style={{color: 'rgba(102, 102, 102, 0.4)'}}>
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-white/80 border rounded-lg transition-all duration-200 font-medium"
              style={{
                color: '#666666',
                borderColor: 'rgba(102, 102, 102, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.target.style.borderColor = 'rgba(102, 102, 102, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                e.target.style.borderColor = 'rgba(102, 102, 102, 0.2)';
              }}
            >
              查看全部商品
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-800 mb-4 font-chinese">為什麼選擇我們</h2>
            <p className="text-gray-600">
              我們致力於為您提供最好的購物體驗和生活品質
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card text-center group">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sage-200 transition-colors duration-200">
                <SparklesIcon className="h-8 w-8 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 mb-3">精心策展</h3>
              <p className="text-gray-600 leading-relaxed">
                每件商品都經過精心挑選，確保品質與美感的完美結合
              </p>
            </div>
            
            <div className="feature-card text-center group">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sage-200 transition-colors duration-200">
                <HeartIcon className="h-8 w-8 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 mb-3">用心服務</h3>
              <p className="text-gray-600 leading-relaxed">
                從選購到售後，我們提供貼心周到的服務體驗
              </p>
            </div>
            
            <div className="feature-card text-center group">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sage-200 transition-colors duration-200">
                <ShieldCheckIcon className="h-8 w-8 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 mb-3">品質保證</h3>
              <p className="text-gray-600 leading-relaxed">
                嚴格的品質控制，讓您安心享受每一次購物
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sage-50 to-lofi-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-sage-800 mb-4 font-chinese">訂閱電子報</h2>
          <p className="text-gray-600 mb-8">
            獲取最新商品資訊和生活靈感，讓美好融入您的日常
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="輸入您的電子郵件"
              className="flex-1 px-4 py-3 bg-white/80 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-300 focus:bg-white transition-all duration-200"
            />
            <button className="px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors duration-200 font-medium">
              訂閱
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;