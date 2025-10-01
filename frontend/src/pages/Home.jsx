import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ChevronRightIcon, SparklesIcon, HeartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { mockProducts } from "../../external_mock/data/products.mock";
import { formatPrice } from "../../external_mock/data/format";
import { getProductTags, getTagConfig } from "../../external_mock/data/productTags";

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
    <div className="min-h-screen" style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFDFB 100%)'}}>
      {/* Hero Section */}
      <section className="pt-24 xs:pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 xs:pb-20 sm:pb-24 md:pb-28 lg:pb-32 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center hero-content">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light mb-6 xs:mb-7 sm:mb-8 md:mb-10 font-chinese tracking-tight" 
              style={{color: '#333333', letterSpacing: '-0.02em'}}>
              Marelle
            </h1>
            <p className="text-sm xs:text-base sm:text-base md:text-lg lg:text-xl mb-8 xs:mb-10 sm:mb-12 md:mb-14 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto font-chinese px-4 xs:px-0" 
              style={{color: '#999999', letterSpacing: '0.05em', lineHeight: '1.8'}}>
              探索溫暖質樸的生活美學<br/>
              每件商品都承載著簡約而美好的生活態度
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 xs:px-8 sm:px-10 md:px-12 py-3 xs:py-3.5 sm:py-4 md:py-4 font-medium font-chinese text-xs xs:text-sm sm:text-sm md:text-base tracking-[0.1em] transition-all duration-300 rounded-lg"
              style={{
                background: '#CC824D',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.color = '#CC824D';
                e.currentTarget.style.boxShadow = 'inset 0 0 0 1px #CC824D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#CC824D';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              探索商品
              <ChevronRightIcon className="ml-2 xs:ml-3 h-3.5 xs:h-4 w-3.5 xs:w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 xs:mb-5 sm:mb-6 md:mb-7 font-chinese tracking-tight" style={{color: '#333333'}}>
              精選商品
            </h2>
            <p className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto font-chinese text-xs xs:text-sm sm:text-sm md:text-base px-4 xs:px-0" style={{color: '#999999', letterSpacing: '0.05em'}}>
              嚴選質感生活用品，為您的生活空間增添溫暖與美好
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-3 xs:gap-x-4 sm:gap-x-5 md:gap-x-6 lg:gap-x-8 gap-y-8 xs:gap-y-10 sm:gap-y-12 md:gap-y-14 lg:gap-y-16">
            {featuredProducts.map((product, index) => {
              const tags = getProductTags(product);
              const primaryTag = tags[0] ? getTagConfig(tags[0]) : null;
              
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="product-card group block"
                >
                  <div className="relative mb-3 xs:mb-3.5 sm:mb-4 md:mb-4 overflow-hidden bg-white rounded-lg" style={{aspectRatio: '1/1'}}>
                    {primaryTag && (
                      <div 
                        className="absolute top-2 xs:top-3 sm:top-3 md:top-4 left-2 xs:left-3 sm:left-3 md:left-4 z-10 px-2 xs:px-3 sm:px-3 md:px-4 py-1 xs:py-1 sm:py-1.5 md:py-1.5 text-[10px] xs:text-xs sm:text-xs md:text-xs font-semibold font-chinese tracking-widest uppercase shadow-lg"
                        style={{
                          background: primaryTag.bgColor,
                          color: primaryTag.textColor,
                          border: `2px solid ${primaryTag.borderColor}`,
                          borderRadius: '4px',
                          backdropFilter: 'blur(8px)'
                        }}
                      >
                        {primaryTag.label}
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500"></div>
                  </div>
                <div className="text-center px-1 xs:px-1.5 sm:px-2 md:px-2">
                  <h3 className="font-chinese text-xs xs:text-xs sm:text-sm md:text-sm lg:text-base mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 transition-colors duration-200 line-clamp-2" 
                    style={{color: '#333333', letterSpacing: '0.02em'}}>
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-3">
                    <span className="font-chinese text-sm xs:text-sm sm:text-base md:text-base lg:text-lg" style={{color: '#CC824D', fontWeight: 500}}>
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="font-chinese text-xs xs:text-xs sm:text-sm md:text-sm line-through" style={{color: '#CCCCCC'}}>
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
          
          <div className="text-center mt-10 xs:mt-12 sm:mt-14 md:mt-16 lg:mt-20">
            <Link
              to="/products"
              className="inline-flex items-center px-6 xs:px-7 sm:px-8 md:px-10 py-2.5 xs:py-3 sm:py-3 md:py-3.5 font-medium font-chinese text-xs xs:text-sm sm:text-sm md:text-base tracking-[0.1em] transition-all duration-300 rounded-lg"
              style={{
                border: '1px solid #CC824D',
                color: '#CC824D',
                background: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#CC824D';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.color = '#CC824D';
              }}
            >
              查看全部商品
              <ChevronRightIcon className="ml-2 xs:ml-3 h-3.5 xs:h-4 w-3.5 xs:w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 border-t" style={{borderColor: '#E5E7EB'}}>
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 xs:mb-5 sm:mb-6 md:mb-7 font-chinese tracking-tight" style={{color: '#333333'}}>
              為什麼選擇我們
            </h2>
            <p className="font-chinese text-xs xs:text-sm sm:text-sm md:text-base px-4 xs:px-0" style={{color: '#999999', letterSpacing: '0.05em'}}>
              我們致力於為您提供最好的購物體驗和生活品質
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 xs:gap-10 sm:gap-12 md:gap-10 lg:gap-12 xl:gap-16">
            <div className="text-center group">
              <div className="w-12 xs:w-14 sm:w-16 md:w-16 h-12 xs:h-14 sm:h-16 md:h-16 flex items-center justify-center mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-6 transition-all duration-300">
                <SparklesIcon className="h-8 xs:h-9 sm:h-10 md:h-10 w-8 xs:w-9 sm:w-10 md:w-10 transition-colors duration-300" style={{color: '#CC824D', strokeWidth: 1.5}} />
              </div>
              <h3 className="text-base xs:text-lg sm:text-lg md:text-xl font-medium mb-2 xs:mb-2.5 sm:mb-3 md:mb-3 font-chinese" style={{color: '#333333', letterSpacing: '0.02em'}}>
                精心策展
              </h3>
              <p className="font-chinese text-xs xs:text-sm sm:text-sm md:text-base leading-relaxed px-4 xs:px-0" style={{color: '#999999'}}>
                每件商品都經過精心挑選<br/>確保品質與美感的完美結合
              </p>
            </div>
            <div className="text-center group">
              <div className="w-12 xs:w-14 sm:w-16 md:w-16 h-12 xs:h-14 sm:h-16 md:h-16 flex items-center justify-center mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-6 transition-all duration-300">
                <HeartIcon className="h-8 xs:h-9 sm:h-10 md:h-10 w-8 xs:w-9 sm:w-10 md:w-10 transition-colors duration-300" style={{color: '#CC824D', strokeWidth: 1.5}} />
              </div>
              <h3 className="text-base xs:text-lg sm:text-lg md:text-xl font-medium mb-2 xs:mb-2.5 sm:mb-3 md:mb-3 font-chinese" style={{color: '#333333', letterSpacing: '0.02em'}}>
                用心服務
              </h3>
              <p className="font-chinese text-xs xs:text-sm sm:text-sm md:text-base leading-relaxed px-4 xs:px-0" style={{color: '#999999'}}>
                從選購到售後<br/>我們提供貼心周到的服務體驗
              </p>
            </div>
            <div className="text-center group">
              <div className="w-12 xs:w-14 sm:w-16 md:w-16 h-12 xs:h-14 sm:h-16 md:h-16 flex items-center justify-center mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-6 transition-all duration-300">
                <ShieldCheckIcon className="h-8 xs:h-9 sm:h-10 md:h-10 w-8 xs:w-9 sm:w-10 md:w-10 transition-colors duration-300" style={{color: '#CC824D', strokeWidth: 1.5}} />
              </div>
              <h3 className="text-base xs:text-lg sm:text-lg md:text-xl font-medium mb-2 xs:mb-2.5 sm:mb-3 md:mb-3 font-chinese" style={{color: '#333333', letterSpacing: '0.02em'}}>
                品質保證
              </h3>
              <p className="font-chinese text-xs xs:text-sm sm:text-sm md:text-base leading-relaxed px-4 xs:px-0" style={{color: '#999999'}}>
                嚴格的品質控制<br/>讓您安心享受每一次購物
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 border-t" style={{borderColor: '#E5E7EB'}}>
        <div className="w-full max-w-7xl mx-auto text-center">
          <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 xs:mb-5 sm:mb-6 md:mb-7 font-chinese tracking-tight" style={{color: '#333333'}}>
            訂閱電子報
          </h2>
          <p className="font-chinese text-xs xs:text-sm sm:text-sm md:text-base mb-6 xs:mb-8 sm:mb-10 md:mb-12 px-4 xs:px-0" style={{color: '#999999', letterSpacing: '0.05em'}}>
            獲取最新商品資訊和生活靈感，讓美好融入您的日常
          </p>
          <div className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto flex flex-col xs:flex-col sm:flex-row gap-3 xs:gap-3 sm:gap-0">
            <input
              type="email"
              placeholder="輸入您的電子郵件"
              className="flex-1 px-4 xs:px-5 sm:px-6 md:px-6 py-3 xs:py-3.5 sm:py-4 md:py-4 font-chinese text-xs xs:text-sm sm:text-sm md:text-base border transition-colors duration-200 rounded-lg"
              style={{
                borderColor: '#E5E7EB',
                color: '#333333',
                background: '#FFFFFF'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#CC824D';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
              }}
            />
            <button 
              className="px-6 xs:px-7 sm:px-8 md:px-8 py-3 xs:py-3.5 sm:py-4 md:py-4 font-chinese text-xs xs:text-sm sm:text-sm md:text-base font-medium tracking-[0.1em] transition-all duration-300 whitespace-nowrap rounded-lg"
              style={{
                background: '#CC824D',
                color: '#FFFFFF',
                border: '1px solid #CC824D'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#b86c37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#CC824D';
              }}
            >
              訂閱
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;