import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  HeartIcon,
  ShareIcon,
  ShoppingBagIcon,
  ChevronLeftIcon,
  StarIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { mockProducts, formatPrice } from '../utils/data';
import { useCart } from '../hooks';
import ProductVariantSelector from '../components/ProductVariantSelector';
import DynamicPriceDisplay from '../components/DynamicPriceDisplay';
import StockStatusIndicator from '../components/StockStatusIndicator';

const EnhancedProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [stockLevel, setStockLevel] = useState(50);
  const [memberTier, setMemberTier] = useState('regular'); // 模擬會員等級
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMemberPrices, setShowMemberPrices] = useState(false);
  const { addToCart } = useCart();

  // 模擬商品變體數據
  const mockVariants = [
    {
      id: 'color',
      name: { 'zh-TW': '顏色', 'en': 'Color' },
      options: [
        { id: 'white', name: { 'zh-TW': '純白', 'en': 'White' } },
        { id: 'beige', name: { 'zh-TW': '米色', 'en': 'Beige' } },
        { id: 'pink', name: { 'zh-TW': '粉色', 'en': 'Pink' } }
      ]
    },
    {
      id: 'size',
      name: { 'zh-TW': '規格', 'en': 'Size' },
      options: [
        { id: 'small', name: { 'zh-TW': '30ml', 'en': '30ml' } },
        { id: 'medium', name: { 'zh-TW': '50ml', 'en': '50ml' } },
        { id: 'large', name: { 'zh-TW': '100ml', 'en': '100ml' } }
      ]
    }
  ];

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      // 動畫效果
      gsap.fromTo(
        '.product-detail-content',
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    } else {
      navigate('/products');
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product && stockLevel > 0) {
      // 檢查是否需要選擇變體
      const requiredVariants = mockVariants.length;
      const selectedVariantCount = Object.keys(selectedVariants).length;
      
      if (requiredVariants > 0 && selectedVariantCount < requiredVariants) {
        // 顯示提示動畫
        gsap.fromTo('.variant-selector-container',
          { scale: 1 },
          { 
            scale: 1.02, 
            duration: 0.2, 
            yoyo: true, 
            repeat: 3,
            ease: 'power2.inOut'
          }
        );
        return;
      }

      const productWithVariants = {
        ...product,
        selectedVariants,
        variantText: Object.entries(selectedVariants).map(([levelId, optionId]) => {
          const level = mockVariants.find(v => v.id === levelId);
          const option = level?.options.find(o => o.id === optionId);
          return level && option ? `${level.name['zh-TW']}: ${option.name['zh-TW']}` : '';
        }).filter(Boolean).join(', ')
      };

      addToCart(productWithVariants, quantity);
      
      // 成功動畫
      gsap.fromTo(
        '.add-to-cart-btn',
        { scale: 1 },
        { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 }
      );
    }
  };

  const handleVariantChange = (newVariants) => {
    setSelectedVariants(newVariants);
    
    // 變體變化時的價格更新動畫
    gsap.fromTo('.price-section',
      { y: 0 },
      { y: -5, duration: 0.2, yoyo: true, repeat: 1 }
    );
  };

  const handleStockChange = (newStock, status) => {
    // 根據庫存狀態調整 UI
    const button = document.querySelector('.add-to-cart-btn');
    if (button) {
      if (status === 'out-of-stock') {
        button.textContent = '暫時缺貨';
      } else if (status === 'low-stock') {
        button.textContent = '立即搶購';
      } else {
        button.textContent = '加入購物車';
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#faf8f3]">
        <div className="p-8 rounded-2xl bg-white/80 border border-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cc824d] mx-auto mb-4"></div>
          <p className="font-chinese text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  // 模擬多張產品圖片
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-[#faf8f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按鈕 */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 font-chinese flex items-center px-4 py-2 rounded-lg transition-all duration-200 bg-white/80 hover:bg-white text-gray-700 hover:text-[#cc824d] border border-gray-200"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          返回
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 商品圖片區 */}
          <div className="product-detail-content">
            <div className="space-y-4">
              {/* 主圖 */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/80 border border-gray-200 group">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* 圖片放大按鈕 */}
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors duration-200"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
                
                {/* 圖片指示器 */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        selectedImage === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* 縮圖 */}
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg transition-all duration-200 ${
                      selectedImage === index
                        ? 'ring-2 ring-[#cc824d] shadow-lg'
                        : 'opacity-70 hover:opacity-100 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 商品資訊區 */}
          <div className="product-detail-content space-y-6">
            {/* 分類 */}
            <div className="text-sm text-[#cc824d] font-chinese font-medium">
              {product.category}
            </div>

            {/* 標題 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-chinese">
              {product.name}
            </h1>

            {/* 評分 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500 font-chinese">
                ({product.reviews} 則評價)
              </span>
            </div>

            {/* 動態價格顯示 */}
            <div className="price-section">
              <DynamicPriceDisplay
                basePrice={product.price}
                originalPrice={product.originalPrice}
                selectedVariants={selectedVariants}
                memberTier={memberTier}
                showMemberPrices={showMemberPrices}
              />
              
              {/* 會員價格切換 */}
              <button
                onClick={() => setShowMemberPrices(!showMemberPrices)}
                className="mt-2 text-sm text-[#cc824d] hover:text-[#b3723f] underline font-chinese"
              >
                {showMemberPrices ? '隱藏' : '查看'}會員專享價格
              </button>
            </div>

            {/* 商品描述 */}
            <div className="prose max-w-none">
              <p className="text-gray-700 font-chinese leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* 變體選擇器 */}
            {mockVariants.length > 0 && (
              <div className="variant-selector-container">
                <ProductVariantSelector
                  variants={mockVariants}
                  onVariantChange={handleVariantChange}
                  selectedVariants={selectedVariants}
                  language="zh-TW"
                />
              </div>
            )}

            {/* 庫存狀態 */}
            <StockStatusIndicator
              stockLevel={stockLevel}
              selectedVariants={selectedVariants}
              onStockChange={handleStockChange}
            />

            {/* 數量和操作按鈕 */}
            <div className="space-y-4">
              {/* 數量選擇器 */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-chinese">數量：</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                    disabled={stockLevel === 0}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={stockLevel === 0}
                  className={`add-to-cart-btn flex-1 flex items-center justify-center py-3 px-6 rounded-lg font-medium transition-all duration-200 font-chinese ${
                    stockLevel > 0
                      ? 'bg-[#cc824d] hover:bg-[#b3723f] text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  {stockLevel > 0 ? '加入購物車' : '暫時缺貨'}
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-white transition-colors duration-200"
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-white transition-colors duration-200">
                    <ShareIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* 商品詳情 */}
            <div className="bg-white/80 border border-gray-200 p-6 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-4 font-chinese">商品詳情</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-chinese">分類：</span>
                  <span className="text-[#cc824d] font-chinese">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-chinese">評分：</span>
                  <span className="text-gray-900">{product.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-chinese">評價數：</span>
                  <span className="text-gray-900">{product.reviews}</span>
                </div>
                {Object.keys(selectedVariants).length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-chinese">已選規格：</span>
                    <span className="text-[#cc824d] font-chinese">
                      {Object.entries(selectedVariants).map(([levelId, optionId]) => {
                        const level = mockVariants.find(v => v.id === levelId);
                        const option = level?.options.find(o => o.id === optionId);
                        return level && option ? option.name['zh-TW'] : '';
                      }).filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 相關商品 */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-[#cc824d] mb-8 font-chinese">
              相關商品
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white/80 border border-gray-200 rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 font-chinese line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#cc824d]">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <button
                        onClick={() => navigate(`/products/${relatedProduct.id}`)}
                        className="px-4 py-2 bg-gray-100 hover:bg-[#cc824d] hover:text-white text-gray-700 rounded-lg transition-colors duration-200 text-sm font-chinese"
                      >
                        查看
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 圖片放大模態框 */}
      {showImageModal && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-4xl max-h-screen p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/30">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors duration-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProductDetail;