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
      <section className="pt-32 pb-24 px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center hero-content">
            <h1 className="text-5xl md:text-7xl font-light mb-8 font-chinese tracking-tight" 
              style={{color: '#333333', letterSpacing: '-0.02em'}}>
              Marelle
            </h1>
            <p className="text-base md:text-lg mb-12 max-w-xl mx-auto font-chinese" 
              style={{color: '#999999', letterSpacing: '0.05em', lineHeight: '1.8'}}>
              探索溫暖質樸的生活美學<br/>
              每件商品都承載著簡約而美好的生活態度
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-10 py-4 font-medium font-chinese text-sm tracking-[0.1em] transition-all duration-300"
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
              <ChevronRightIcon className="ml-3 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6 font-chinese tracking-tight" style={{color: '#333333'}}>
              精選商品
            </h2>
            <p className="max-w-xl mx-auto font-chinese text-sm" style={{color: '#999999', letterSpacing: '0.05em'}}>
              嚴選質感生活用品，為您的生活空間增添溫暖與美好
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.map((product, index) => {
              const tags = getProductTags(product);
              const primaryTag = tags[0] ? getTagConfig(tags[0]) : null;
              
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="product-card group block"
                >
                  <div className="relative mb-4 overflow-hidden bg-white" style={{aspectRatio: '1/1'}}>
                    {primaryTag && (
                      <div 
                        className="absolute top-4 left-4 z-10 px-4 py-1.5 text-xs font-semibold font-chinese tracking-widest uppercase shadow-lg"
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
                <div className="text-center px-2">
                  <h3 className="font-chinese text-sm mb-2 transition-colors duration-200" 
                    style={{color: '#333333', letterSpacing: '0.02em'}}>
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-chinese text-base" style={{color: '#CC824D', fontWeight: 500}}>
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="font-chinese text-sm line-through" style={{color: '#CCCCCC'}}>
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
          
          <div className="text-center mt-16">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 font-medium font-chinese text-sm tracking-[0.1em] transition-all duration-300"
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
              <ChevronRightIcon className="ml-3 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 border-t" style={{borderColor: '#E5E7EB'}}>
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6 font-chinese tracking-tight" style={{color: '#333333'}}>
              為什麼選擇我們
            </h2>
            <p className="font-chinese text-sm" style={{color: '#999999', letterSpacing: '0.05em'}}>
              我們致力於為您提供最好的購物體驗和生活品質
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                <SparklesIcon className="h-10 w-10 transition-colors duration-300" style={{color: '#CC824D', strokeWidth: 1.5}} />
              </div>
              <h3 className="text-lg font-medium mb-3 font-chinese" style={{color: '#333333', letterSpacing: '0.02em'}}>
                精心策展
              </h3>
              <p className="font-chinese text-sm leading-relaxed" style={{color: '#999999'}}>
                每件商品都經過精心挑選<br/>確保品質與美感的完美結合
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                <HeartIcon className="h-10 w-10 transition-colors duration-300" style={{color: '#CC824D', strokeWidth: 1.5}} />
              </div>
              <h3 className="text-lg font-medium mb-3 font-chinese" style={{color: '#333333', letterSpacing: '0.02em'}}>
                用心服務
              </h3>
              <p className="font-chinese text-sm leading-relaxed" style={{color: '#999999'}}>
                從選購到售後<br/>我們提供貼心周到的服務體驗
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                <ShieldCheckIcon className="h-10 w-10 transition-colors duration-300" style={{color: '#CC824D', strokeWidth: 1.5}} />
              </div>
              <h3 className="text-lg font-medium mb-3 font-chinese" style={{color: '#333333', letterSpacing: '0.02em'}}>
                品質保證
              </h3>
              <p className="font-chinese text-sm leading-relaxed" style={{color: '#999999'}}>
                嚴格的品質控制<br/>讓您安心享受每一次購物
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 border-t" style={{borderColor: '#E5E7EB'}}>
        <div className="w-full max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6 font-chinese tracking-tight" style={{color: '#333333'}}>
            訂閱電子報
          </h2>
          <p className="font-chinese text-sm mb-10" style={{color: '#999999', letterSpacing: '0.05em'}}>
            獲取最新商品資訊和生活靈感，讓美好融入您的日常
          </p>
          <div className="max-w-md mx-auto flex gap-0">
            <input
              type="email"
              placeholder="輸入您的電子郵件"
              className="flex-1 px-6 py-4 font-chinese text-sm border transition-colors duration-200"
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
              className="px-8 py-4 font-chinese text-sm font-medium tracking-[0.1em] transition-all duration-300"
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