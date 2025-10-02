import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { getProductTags, getTagConfig } from '../../../external_mock/data/productTags';
import { formatPrice } from '../../../external_mock/data/format';

const FeaturedProducts = ({ products }) => {
  return (
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
          {products.map(product => {
            const tags = getProductTags(product);
            const primaryTag = tags[0] ? getTagConfig(tags[0]) : null;
            return (
              <Link key={product.id} to={`/product/${product.id}`} className="product-card group block">
                <div className="relative mb-3 xs:mb-3.5 sm:mb-4 md:mb-4 overflow-hidden bg-white rounded-lg" style={{aspectRatio: '1/1'}}>
                  {primaryTag && (
                    <div className="absolute top-2 xs:top-3 sm:top-3 md:top-4 left-2 xs:left-3 sm:left-3 md:left-4 z-10 px-2 xs:px-3 sm:px-3 md:px-4 py-1 xs:py-1 sm:py-1.5 md:py-1.5 text-[10px] xs:text-xs sm:text-xs md:text-xs font-semibold font-chinese tracking-widest uppercase shadow-lg"
                      style={{ background: primaryTag.bgColor, color: primaryTag.textColor, border: `2px solid ${primaryTag.borderColor}`, borderRadius: '4px', backdropFilter: 'blur(8px)' }}>
                      {primaryTag.label}
                    </div>
                  )}
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
                </div>
                <div className="text-center px-1 xs:px-1.5 sm:px-2 md:px-2">
                  <h3 className="font-chinese text-xs xs:text-xs sm:text-sm md:text-sm lg:text-base mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 transition-colors duration-200 line-clamp-2" style={{color: '#333333', letterSpacing: '0.02em'}}>
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
          <Link to="/products" className="inline-flex items-center px-6 xs:px-7 sm:px-8 md:px-10 py-2.5 xs:py-3 sm:py-3 md:py-3.5 font-medium font-chinese text-xs xs:text-sm sm:text-sm md:text-base tracking-[0.1em] transition-all duration-300 rounded-lg"
            style={{ border: '1px solid #CC824D', color: '#CC824D', background: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#CC824D'; e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#CC824D'; }}>
            查看全部商品
            <ChevronRightIcon className="ml-2 xs:ml-3 h-3.5 xs:h-4 w-3.5 xs:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;