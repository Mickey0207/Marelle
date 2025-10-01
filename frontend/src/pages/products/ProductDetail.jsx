import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  HeartIcon,
  ShareIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { mockProducts } from "../../../external_mock/data/products.mock.js";
import { formatPrice } from "../../../external_mock/data/format.js";
import { useCart } from "../../../external_mock/state/cart.jsx";
import { getCategoryPath, findCategoryById } from "../../../external_mock/data/categories.js";
import { getStockStatus } from "../../../external_mock/data/stockStatus.js";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // details, specs, shipping
  const { addToCart } = useCart();

  // Mock additional images
  const productImages = product ? [
    product.image,
    product.image,
    product.image,
    product.image
  ] : [];

  // 自動輪播
  useEffect(() => {
    if (!product) return;
    
    const interval = setInterval(() => {
      setSelectedImage((prev) => {
        const nextIndex = prev + 1;
        // 如果到達最後一張,跳回第一張
        return nextIndex >= productImages.length ? 0 : nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [product, productImages.length, selectedImage]); // 加入 selectedImage 作為依賴,當手動改變時重新計時

  // 上一張圖片
  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // 下一張圖片
  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      // Animate product details on load
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
    if (product) {
      addToCart(product, quantity);
      // Success animation
      gsap.fromTo(
        '.add-to-cart-btn',
        { scale: 1 },
        { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 }
      );
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-lofi">
        <div className="p-8 rounded-2xl bg-white/80 border border-gray-200">
          <p className="font-chinese text-lofi">載入中...</p>
        </div>
      </div>
    );
  }

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // 取得分類路徑用於麵包屑
  const categoryPath = product?.categoryId ? getCategoryPath(product.categoryId) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* 麵包屑導航 */}
      <div className="border-b" style={{borderColor: '#E5E7EB'}}>
        <div className="max-w-full mx-auto px-4 xs:px-6 sm:px-6 md:px-8 lg:px-12 py-4">
          <div className="flex items-center gap-2 text-xs xs:text-sm font-chinese" style={{color: '#666666'}}>
            <Link to="/" className="hover:underline transition-all" style={{color: '#666666'}}>首頁</Link>
            <ChevronRightIcon className="w-3 h-3 xs:w-4 xs:h-4" />
            <Link to="/products" className="hover:underline transition-all" style={{color: '#666666'}}>商品</Link>
            {categoryPath && categoryPath.map((cat, index) => (
              <span key={cat.id} className="flex items-center gap-2">
                <ChevronRightIcon className="w-3 h-3 xs:w-4 xs:h-4" />
                <Link 
                  to={cat.href} 
                  className={`hover:underline transition-all ${index === categoryPath.length - 1 ? 'font-medium' : ''}`}
                  style={{color: index === categoryPath.length - 1 ? '#333333' : '#666666'}}
                >
                  {cat.name}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 主要產品區域 */}
      <div className="max-w-full mx-auto px-4 xs:px-6 sm:px-6 md:px-8 lg:px-12 py-8 xs:py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-12 lg:gap-12">
          {/* 左側 - 產品圖片 */}
          <div className="product-detail-content">
            <div className="sticky top-24">
              {/* 主圖片 */}
              <div className="aspect-square overflow-hidden bg-white rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl mb-4 relative group">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* 左側點擊區域 */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-0 top-0 w-1/2 h-full cursor-pointer transition-all duration-300"
                  style={{
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  aria-label="上一張圖片"
                />
                {/* 右側點擊區域 */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-0 top-0 w-1/2 h-full cursor-pointer transition-all duration-300"
                  style={{
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to left, rgba(0,0,0,0.1), transparent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  aria-label="下一張圖片"
                />
              </div>
              
              {/* 進度條 */}
              <div className="w-full h-1 rounded-full" style={{background: '#F5F5F5'}}>
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    background: '#CC824D',
                    width: `${((selectedImage + 1) / productImages.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* 右側 - 產品資訊 */}
          <div className="product-detail-content">
            <div className="space-y-6">
              {/* 標題 */}
              <div>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-light font-chinese mb-3" style={{color: '#333333', letterSpacing: '-0.01em'}}>
                  {product.name}
                </h1>
                {product.categoryNames && product.categoryNames.length > 0 && (
                  <p className="text-sm font-chinese" style={{color: '#999999'}}>
                    {product.categoryNames[product.categoryNames.length - 1]}
                  </p>
                )}
              </div>

              {/* 價格 */}
              <div className="py-4 border-t border-b" style={{borderColor: '#E5E7EB'}}>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl xs:text-3xl font-light font-chinese" style={{color: '#333333'}}>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg font-chinese line-through" style={{color: '#CCCCCC'}}>
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* 描述 */}
              <div className="prose max-w-none">
                <p className="font-chinese leading-relaxed text-sm xs:text-base" style={{color: '#666666', lineHeight: '1.8'}}>
                  {product.description}
                </p>
              </div>

              {/* 貨態狀態 & 數量選擇器 (手機版排版) */}
              <div className="flex items-center justify-between gap-4">
                {/* 左側 - 貨態狀態 */}
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{background: getStockStatus(product.inStock).config.dotColor}}
                  />
                  <span className="text-sm font-chinese" style={{color: getStockStatus(product.inStock).config.color}}>
                    {getStockStatus(product.inStock).config.label}
                  </span>
                </div>

                {/* 右側 - 數量選擇器 */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-chinese" style={{color: '#666666'}}>數量</span>
                  <div className="flex items-center border rounded-lg" style={{borderColor: '#E5E7EB'}}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1.5 text-sm font-chinese transition-colors rounded-l-lg"
                      style={{color: '#666666'}}
                      disabled={quantity <= 1}
                      onMouseEnter={(e) => {
                        if (quantity > 1) e.currentTarget.style.background = '#F5F5F5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      −
                    </button>
                    <span className="px-3 py-1.5 border-x text-center min-w-[40px] text-sm font-chinese" style={{borderColor: '#E5E7EB', color: '#333333'}}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1.5 text-sm font-chinese transition-colors rounded-r-lg"
                      style={{color: '#666666'}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F5F5F5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`add-to-cart-btn w-full py-3.5 xs:py-4 font-chinese text-sm xs:text-base tracking-wider transition-all duration-300 rounded-lg ${
                    product.inStock
                      ? ''
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    background: product.inStock ? '#CC824D' : '#CCCCCC',
                    color: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => {
                    if (product.inStock) {
                      e.currentTarget.style.background = '#B8754A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (product.inStock) {
                      e.currentTarget.style.background = '#CC824D';
                    }
                  }}
                >
                  {product.inStock ? '加入購物車' : '暫時缺貨'}
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="flex-1 py-3.5 xs:py-4 border rounded-lg font-chinese text-sm xs:text-base tracking-wider transition-all duration-300"
                    style={{
                      borderColor: isFavorite ? '#CC824D' : '#E5E7EB',
                      color: isFavorite ? '#CC824D' : '#666666',
                      background: '#FFFFFF'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#CC824D';
                      e.currentTarget.style.color = '#CC824D';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isFavorite ? '#CC824D' : '#E5E7EB';
                      e.currentTarget.style.color = isFavorite ? '#CC824D' : '#666666';
                    }}
                  >
                    {isFavorite ? '已加入收藏' : '加入收藏'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 產品詳細資訊分頁 */}
        <div className="mt-8 border-t" style={{borderColor: '#E5E7EB'}}>
          {/* 分頁標籤 */}
          <div className="flex border-b" style={{borderColor: '#E5E7EB'}}>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-4 font-chinese text-sm xs:text-base transition-all ${
                activeTab === 'details' ? 'border-b-2' : ''
              }`}
              style={{
                borderColor: activeTab === 'details' ? '#CC824D' : 'transparent',
                color: activeTab === 'details' ? '#333333' : '#999999'
              }}
            >
              產品詳情
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 font-chinese text-sm xs:text-base transition-all ${
                activeTab === 'specs' ? 'border-b-2' : ''
              }`}
              style={{
                borderColor: activeTab === 'specs' ? '#CC824D' : 'transparent',
                color: activeTab === 'specs' ? '#333333' : '#999999'
              }}
            >
              規格
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-4 font-chinese text-sm xs:text-base transition-all ${
                activeTab === 'shipping' ? 'border-b-2' : ''
              }`}
              style={{
                borderColor: activeTab === 'shipping' ? '#CC824D' : 'transparent',
                color: activeTab === 'shipping' ? '#333333' : '#999999'
              }}
            >
              配送與退貨
            </button>
          </div>

          {/* 分頁內容 */}
          <div className="py-8">
            {activeTab === 'details' && (
              <div className="prose max-w-none">
                <p className="font-chinese leading-relaxed text-sm xs:text-base mb-4" style={{color: '#666666', lineHeight: '1.8'}}>
                  {product.description}
                </p>
                <ul className="space-y-2 font-chinese text-sm xs:text-base" style={{color: '#666666'}}>
                  <li>• 精選優質材料製作</li>
                  <li>• 精緻手工工藝</li>
                  <li>• 經典設計,永不過時</li>
                  <li>• 適合日常使用與特殊場合</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3 font-chinese text-sm xs:text-base">
                  <div className="flex justify-between py-2 border-b" style={{borderColor: '#E5E7EB'}}>
                    <span style={{color: '#999999'}}>分類</span>
                    <span style={{color: '#333333'}}>{product.categoryNames?.[product.categoryNames.length - 1] || '未分類'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b" style={{borderColor: '#E5E7EB'}}>
                    <span style={{color: '#999999'}}>評分</span>
                    <span style={{color: '#333333'}}>{product.rating}/5</span>
                  </div>
                  <div className="flex justify-between py-2 border-b" style={{borderColor: '#E5E7EB'}}>
                    <span style={{color: '#999999'}}>評價數</span>
                    <span style={{color: '#333333'}}>{product.reviews}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b" style={{borderColor: '#E5E7EB'}}>
                    <span style={{color: '#999999'}}>商品編號</span>
                    <span style={{color: '#333333'}}>{product.id}</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'shipping' && (
              <div className="space-y-4 font-chinese text-sm xs:text-base" style={{color: '#666666'}}>
                <div>
                  <h3 className="font-medium mb-2" style={{color: '#333333'}}>配送資訊</h3>
                  <p className="leading-relaxed">
                    • 台灣本島免運費（訂單金額滿 NT$2,000）<br />
                    • 標準配送時間：2-4 個工作天<br />
                    • 快速配送服務：1-2 個工作天（需加收運費）
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2" style={{color: '#333333'}}>退貨政策</h3>
                  <p className="leading-relaxed">
                    • 商品到貨後 7 天內可申請退貨<br />
                    • 商品需保持全新未使用狀態<br />
                    • 請保留完整包裝與配件<br />
                    • 退貨運費由買家負擔
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 相關商品 */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t pt-16" style={{borderColor: '#E5E7EB'}}>
            <h2 className="text-xl xs:text-2xl font-light font-chinese mb-8" style={{color: '#333333'}}>
              您可能也會喜歡
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group block"
                >
                  <div className="aspect-square overflow-hidden bg-white rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl mb-3">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-chinese text-sm xs:text-base mb-2 line-clamp-2" style={{color: '#333333', letterSpacing: '0.02em'}}>
                    {relatedProduct.name}
                  </h3>
                  <p className="font-chinese text-sm xs:text-base font-medium" style={{color: '#CC824D'}}>
                    {formatPrice(relatedProduct.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;