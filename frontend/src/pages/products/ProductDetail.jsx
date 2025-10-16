import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { mockProducts, getProductByUrlKey } from "../../../external_mock/data/products.mock.js";
import { useCart } from "../../../external_mock/state/cart.jsx";
import { getCategoryPath } from "../../../external_mock/data/categories.js";
import ProductBreadcrumb from '../../components/product/Detail/ProductBreadcrumb.jsx';
import ProductImageGallery from '../../components/product/Detail/ProductImageGallery.jsx';
import ProductPurchasePanel from '../../components/product/Detail/ProductPurchasePanel.jsx';
import VariantTreeSelector from '../../components/product/Detail/VariantTreeSelector.jsx';
import ProductTabs from '../../components/product/Detail/ProductTabs.jsx';
import RelatedProducts from '../../components/product/Detail/RelatedProducts.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const { addToCart } = useCart();
  // 規格選擇狀態
  const [variantState, setVariantState] = useState({ path: [], isComplete: false, leaf: undefined });

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
    const parseLegacyId = (s) => {
      const m = String(s || '').match(/-(\d+)$/);
      return m ? parseInt(m[1], 10) : null;
    };

    let targetId = id ? parseInt(id) : null;
    if (!targetId) {
      // 從萬用字元路由中取最後一段，優先以 urlKey 查找，找不到再嘗試舊版 slug-id 解析
      const parts = location.pathname.split('/').filter(Boolean);
      const last = parts[parts.length - 1];
      const byKey = getProductByUrlKey(last);
      targetId = byKey ? byKey.id : parseLegacyId(last);
    }
    if (!targetId || Number.isNaN(targetId)) {
      setProduct(null);
      navigate('/products');
      return;
    }
    const foundProduct = mockProducts.find(p => p.id === targetId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setProduct(null);
      navigate('/products');
    }
    // 僅在 id 或 hash 變更時重查
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.hash, navigate]);

  // 在 product 狀態更新且 DOM 已渲染後再進行動畫，避免 GSAP target not found 警告
  useEffect(() => {
    if (!product) return;
    // 等待一個 frame 確保節點已插入
    const raf = requestAnimationFrame(() => {
      const targets = document.querySelectorAll('.product-detail-content');
      if (targets.length) {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
        );
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [product]);

  const handleAddToCart = (qty) => {
    if (!product) return;
    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
    if (hasVariants && (!variantState.isComplete || !variantState.leaf)) return;
    // 將選到的 variant leaf payload（若有）帶入購物車
    const payloadProduct = hasVariants ? { ...product, variant: variantState.leaf } : product;
    addToCart(payloadProduct, qty);
  };

  // 產生選項縮圖（資料 URI SVG），顏色層用對應色塊，其餘使用灰底縮圖
  const getVariantThumb = (opt, levelLabel) => {
    const encode = (s) => encodeURIComponent(String(s));
    const makeSvg = (fill, text) => {
      const svg = `<?xml version='1.0' encoding='UTF-8'?>\n<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>\n  <rect x='0' y='0' width='20' height='20' rx='4' fill='${fill}'/>\n  ${text ? `<text x='10' y='13' text-anchor='middle' font-size='10' fill='%23FFFFFF' font-family='Arial, Helvetica, sans-serif'>${text}</text>` : ''}\n</svg>`;
      return `data:image/svg+xml;utf8,${encode(svg)}`;
    };
    // 顏色層：依 label 給定常見色碼
    const isColorLevel = levelLabel === '顏色' || /^color-/.test(opt?.id || '');
    if (isColorLevel) {
      const label = String(opt?.label || '').trim();
      const colorMap = {
        '黑': '#000000', '藍': '#1E40AF', '紅': '#B91C1C', '棕': '#92400E', '白': '#FFFFFF', '綠': '#065F46', '灰': '#6B7280'
      };
      const fill = colorMap[label] || '#6B7280';
      // 白色需要邊框才看得見，這裡改用淡灰色
      const safeFill = fill.toLowerCase() === '#ffffff' ? '#E5E7EB' : fill;
      return makeSvg(safeFill);
    }
    // 其他層：灰底，首字母
    const initial = String(opt?.label || '').trim().charAt(0) || '';
    return makeSvg('#E5E7EB', initial);
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
            {/* 購買面板，按鈕 disabled 狀態依據 variantState.isComplete */}
            <ProductPurchasePanel
              product={{
                ...product,
                price: variantState.leaf?.payload?.price ?? product.price,
                // 修正：未完成變體選擇時，避免顯示缺貨，改為維持可購買狀態並提示需完成規格
                inStock: (Array.isArray(product.variants) && product.variants.length > 0)
                  ? (variantState.isComplete
                      ? ((variantState.leaf?.payload?.stock ?? 0) > 0)
                      : true)
                  : product.inStock,
              }}
              onAddToCart={handleAddToCart}
              addToCartDisabled={(Array.isArray(product.variants) && product.variants.length > 0) ? !variantState.isComplete : false}
              variantSelector={
                Array.isArray(product.variants) && product.variants.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm font-chinese text-gray-700">選擇規格</div>
                    <VariantTreeSelector
                      data={product.variants}
                      maxDepth={5}
                      onChange={setVariantState}
                      labels={["顏色", "尺寸", "內頁", "封面", "包裝"]}
                      renderSelect={({ level, options, value, onChange, disabled, label }) => (
                        <div className="flex flex-col gap-2">
                          {label && (
                            <div className="text-xs font-chinese text-gray-500">{label}</div>
                          )}
                          <div className="flex flex-wrap gap-3">
                            {options.map(opt => {
                              const selected = value === opt.id;
                              const isDisabled = disabled;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => onChange(opt.id)}
                                  disabled={isDisabled}
                                  className={`px-4 py-2 rounded-lg text-sm font-chinese border transition-colors ${
                                    selected
                                      ? 'border-[#CC824D] text-[#CC824D] bg-white'
                                      : 'border-[#E5E7EB] text-[#666666] bg-[#F7F8FA]'
                                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  onMouseEnter={(e) => { if (!selected && !isDisabled) { e.currentTarget.style.background = '#F0F2F5'; } }}
                                  onMouseLeave={(e) => { if (!selected && !isDisabled) { e.currentTarget.style.background = '#F7F8FA'; } }}
                                >
                                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2 align-middle">
                                    <img
                                      alt={opt.label}
                                      src={getVariantThumb(opt, label)}
                                      className="w-5 h-5 rounded object-cover"
                                    />
                                  </span>
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                ) : null
              }
            />
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