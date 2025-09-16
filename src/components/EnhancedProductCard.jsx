import { useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  HeartIcon,
  ShoppingBagIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { formatPrice } from '../utils/data';

const EnhancedProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite = false,
  showQuickView = false,
  onQuickView 
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // 滑鼠懸停動畫
    gsap.to(`#product-card-${product.id}`, {
      y: -8,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    // 顯示操作按鈕
    gsap.to(`#product-actions-${product.id}`, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // 恢復原狀
    gsap.to(`#product-card-${product.id}`, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    // 隱藏操作按鈕
    gsap.to(`#product-actions-${product.id}`, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 添加到購物車動畫
    gsap.fromTo(`#add-cart-btn-${product.id}`,
      { scale: 1 },
      { 
        scale: 1.2, 
        duration: 0.1, 
        yoyo: true, 
        repeat: 1,
        ease: 'power2.inOut'
      }
    );
    
    onAddToCart?.(product);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 收藏動畫
    gsap.fromTo(`#favorite-btn-${product.id}`,
      { scale: 1 },
      { 
        scale: 1.3, 
        duration: 0.2, 
        yoyo: true, 
        repeat: 1,
        ease: 'back.out(1.7)'
      }
    );
    
    onToggleFavorite?.(product.id);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const getSavingsPercentage = () => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="product-item group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/products/${product.id}`}>
        <div className="bg-white/80 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200">
          {/* 商品圖片區域 */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#EFEAE4] to-[#f5f1e8]">
            {/* 折扣標籤 */}
            {getSavingsPercentage() > 0 && (
              <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                -{getSavingsPercentage()}%
              </div>
            )}
            
            {/* 收藏按鈕 */}
            <button
              id={`favorite-btn-${product.id}`}
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors duration-200"
            >
              {isFavorite ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* 商品圖片 */}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              } group-hover:scale-110`}
              onLoad={() => setIsImageLoaded(true)}
            />
            
            {/* 載入佔位符 */}
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#cc824d] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* 庫存狀態 */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold font-chinese">暫時缺貨</span>
              </div>
            )}

            {/* 快速操作按鈕 */}
            <div
              id={`product-actions-${product.id}`}
              className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 flex gap-2"
            >
              <button
                id={`add-cart-btn-${product.id}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 font-chinese ${
                  product.inStock
                    ? 'bg-[#cc824d] hover:bg-[#b3723f] text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingBagIcon className="w-4 h-4 mx-auto" />
              </button>
              
              {showQuickView && (
                <button
                  onClick={handleQuickView}
                  className="py-2 px-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 商品資訊 */}
          <div className="p-4 space-y-2">
            {/* 分類 */}
            <div className="text-xs text-[#cc824d] font-medium font-chinese">
              {product.category}
            </div>
            
            {/* 商品名稱 */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#cc824d] transition-colors duration-200 font-chinese">
              {product.name}
            </h3>
            
            {/* 商品描述 */}
            <p className="text-sm text-gray-600 line-clamp-2 font-chinese">
              {product.description}
            </p>

            {/* 評分 */}
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400 text-sm">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews})
              </span>
            </div>

            {/* 價格區域 */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-[#cc824d]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              {/* 庫存指示器 */}
              <div className={`text-xs px-2 py-1 rounded-full font-chinese ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? '有現貨' : '缺貨'}
              </div>
            </div>

            {/* 會員價格提示 */}
            <div className="text-xs text-gray-500 font-chinese">
              🎖️ 會員享有更多優惠
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EnhancedProductCard;