import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { formatPrice } from '../../../external_mock/data/format.js';
import { getProductTags, getTagConfig } from '../../../external_mock/data/productTags.js';

const ProductCard = ({ product, isFavorite, onToggleFavorite, onQuickAdd }) => {
  const tags = getProductTags(product);
  const primaryTag = tags[0] ? getTagConfig(tags[0]) : null;

  return (
    <div id={`product-${product.id}`} className="group">
      <Link to={`/product/${product.id}`} className="block">
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
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
            <div className="absolute bottom-3 xs:bottom-4 sm:bottom-5 md:bottom-6 left-0 right-0 flex justify-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-3 px-2 xs:px-3 sm:px-4 md:px-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(product.id);
                }}
                className="w-10 xs:w-11 sm:w-12 md:w-12 h-10 xs:h-11 sm:h-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  color: isFavorite ? '#CC824D' : '#666666'
                }}
                aria-label="收藏"
              >
                {isFavorite ? (
                  <HeartSolidIcon className="w-4 xs:w-5 sm:w-5 md:w-5 h-4 xs:h-5 sm:h-5 md:h-5" />
                ) : (
                  <HeartIcon className="w-4 xs:w-5 sm:w-5 md:w-5 h-4 xs:h-5 sm:h-5 md:h-5" />
                )}
              </button>
              {product.inStock && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickAdd(product);
                  }}
                  className="px-3 xs:px-4 sm:px-5 md:px-6 h-10 xs:h-11 sm:h-12 md:h-12 rounded-full font-chinese text-xs xs:text-xs sm:text-sm md:text-sm font-medium tracking-wide transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center justify-center"
                  style={{ background: '#CC824D', color: '#FFFFFF' }}
                >
                  加入購物車
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="text-center px-1 xs:px-1.5 sm:px-2 md:px-2">
          <h3
            className="font-chinese text-xs xs:text-xs sm:text-sm md:text-sm lg:text-base mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 transition-colors duration-200 line-clamp-2"
            style={{ color: '#333333', letterSpacing: '0.02em' }}
          >
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-3">
            <span
              className="font-chinese text-sm xs:text-sm sm:text-base md:text-base lg:text-lg"
              style={{ color: '#CC824D', fontWeight: 500 }}
            >
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span
                className="font-chinese text-xs xs:text-xs sm:text-sm md:text-sm line-through"
                style={{ color: '#CCCCCC' }}
              >
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
