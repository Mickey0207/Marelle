import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { mockProducts } from "../../../external_mock/data/products.mock.js";
import { useCart } from "../../../external_mock/state/cart.jsx";
import { getCategoryPath } from "../../../external_mock/data/categories.js";
import ProductBreadcrumb from '../../components/product/Detail/ProductBreadcrumb.jsx';
import ProductImageGallery from '../../components/product/Detail/ProductImageGallery.jsx';
import ProductPurchasePanel from '../../components/product/Detail/ProductPurchasePanel.jsx';
import ProductTabs from '../../components/product/Detail/ProductTabs.jsx';
import RelatedProducts from '../../components/product/Detail/RelatedProducts.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
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

  const handlePrevImage = () => setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  const handleNextImage = () => setSelectedImage((prev) => (prev + 1) % productImages.length);

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

  const handleAddToCart = (qty) => {
    if (!product) return;
    addToCart(product, qty);
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
      <ProductBreadcrumb categoryPath={categoryPath} />

      {/* 主要產品區域 */}
      <div className="max-w-full mx-auto px-4 xs:px-6 sm:px-6 md:px-8 lg:px-12 py-8 xs:py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-12 lg:gap-12">
          <div className="product-detail-content">
            <ProductImageGallery images={productImages} selectedIndex={selectedImage} onPrev={handlePrevImage} onNext={handleNextImage} />
          </div>
          <div className="product-detail-content">
            <ProductPurchasePanel product={product} onAddToCart={handleAddToCart} />
          </div>
        </div>

        {/* 產品詳細資訊分頁 */}
        <div className="mt-8 border-t" style={{borderColor: '#E5E7EB'}}>
          <ProductTabs active={activeTab} onChange={setActiveTab} />

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
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductDetail;