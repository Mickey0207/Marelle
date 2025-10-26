import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { formatPrice } from '../../../external_mock/data/format.js';
// 後端已提供產品與優惠標籤與顏色，將優先使用
// 若後端已提供 href，優先使用；否則退回舊有 mock 的 URL 生成（可逐步移除）
import { buildProductDetailUrl } from '../../../external_mock/data/products.mock.js';

const ProductCard = ({ product, isFavorite, onToggleFavorite, onQuickAdd }) => {
  // 產品標籤（左上）
  const productTags = Array.isArray(product.tags) ? product.tags : [];
  let leftLabelText = productTags[0] || null;
  const leftLabelBg = product.productTagBgColor || '#CC824D';
  const leftLabelTextColor = product.productTagTextColor || '#FFFFFF';

  // 優惠標籤（右上）
  const promoText = product.promotionLabel || null;
  const promoBg = product.promotionLabelBgColor || '#CC824D';
  const promoTextColor = product.promotionLabelTextColor || '#FFFFFF';
  const hasDiscount = typeof product.originalPrice === 'number' && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.max(1, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100))
    : null;

  // 缺貨覆寫：若低庫存且未啟用中的預購，強制顯示「缺貨」
  const isPreorderActive = !!product.preorderActive;
  const isLowStock = !!product.isLowStock;
  const preorderEnded = !!product.preorderEnded;
  if (isLowStock && !isPreorderActive) {
    leftLabelText = '缺貨';
  }

  return (
    <div id={`product-${product.id}`} className="group">
  <Link to={product.href || buildProductDetailUrl(product)} className="block">
        <div className="relative mb-3 xs:mb-3.5 sm:mb-4 md:mb-4 overflow-hidden bg-white rounded-lg" style={{aspectRatio: '1/1'}}>
          {leftLabelText && (
            <div
              className="absolute top-2 xs:top-3 sm:top-3 md:top-4 left-2 xs:left-3 sm:left-3 md:left-4 z-10 px-2.5 xs:px-3 sm:px-3.5 md:px-3.5 py-1 xs:py-1 sm:py-1.5 md:py-1.5 text-[10px] xs:text-xs sm:text-xs md:text-xs font-semibold font-chinese tracking-widest uppercase shadow-lg rounded-full"
              style={{
                background: (isLowStock && !isPreorderActive) ? '#999999' : leftLabelBg,
                color: (isLowStock && !isPreorderActive) ? '#FFFFFF' : leftLabelTextColor,
                border: `1px solid rgba(255,255,255,0.5)`,
                backdropFilter: 'blur(8px)'
              }}
            >
              {leftLabelText}
            </div>
          )}
          {/* 預購中副標籤：預購啟用且在區間內時顯示，顯示在產品標籤下方 */}
          {isPreorderActive && (
            <div
              className="absolute top-8 xs:top-10 sm:top-10 md:top-11 left-2 xs:left-3 sm:left-3 md:left-4 z-10 px-2 xs:px-2.5 sm:px-3 md:px-3 py-0.5 xs:py-0.5 sm:py-1 md:py-1 rounded-full shadow font-chinese text-[9px] xs:text-[10px] sm:text-xs md:text-xs tracking-wider"
              style={{ background: '#4B5563', color: '#FFFFFF' }}
              aria-label="預購狀態"
            >
              預購中
            </div>
          )}
          {(promoText || hasDiscount) && (
            <div
              className="absolute top-2 xs:top-3 sm:top-3 md:top-4 right-2 xs:right-3 sm:right-3 md:right-4 z-10 px-2 xs:px-2.5 sm:px-3 md:px-3 py-1 xs:py-1 sm:py-1.5 md:py-1.5 rounded-full shadow-lg font-chinese text-[10px] xs:text-xs sm:text-xs md:text-xs tracking-wider"
              style={{ background: promoText ? promoBg : '#CC824D', color: promoText ? promoTextColor : '#FFFFFF' }}
              aria-label="優惠標籤"
            >
              {promoText || (discountPercent ? `省 ${discountPercent}%` : '優惠')}
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
              {product.inStock && !preorderEnded && (
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
              {preorderEnded && (
                <button
                  disabled
                  className="px-3 xs:px-4 sm:px-5 md:px-6 h-10 xs:h-11 sm:h-12 md:h-12 rounded-full font-chinese text-xs xs:text-xs sm:text-sm md:text-sm font-medium tracking-wide transition-all duration-300 flex items-center justify-center opacity-70 cursor-not-allowed"
                  style={{ background: '#D1D5DB', color: '#6B7280' }}
                >
                  預購結束
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
