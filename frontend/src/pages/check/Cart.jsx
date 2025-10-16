import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { formatPrice } from "../../../external_mock/data/format.js";
import { useCart } from "../../../external_mock/state/cart.jsx";
import { buildProductDetailUrl } from "../../../external_mock/data/products.mock.js";

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    cartItemsCount 
  } = useCart();

  useEffect(() => {
    // Animate cart items on load
    gsap.fromTo(
      '.cart-item',
      {
        opacity: 0,
        x: -30,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      }
    );
  }, [cartItems]);

  // 取得選擇的變體路徑（例如：黑 / A5 / 無格 / 軟皮 / 單本）
  const getVariantPathLabels = (item) => {
    if (!item || !item.variant || !Array.isArray(item.variants) || item.variants.length === 0) return null;
    const targetId = item.variant.id;

    const dfs = (nodes, path) => {
      for (const node of nodes) {
        const nextPath = [...path, node.label];
        if (node.id === targetId) return nextPath;
        if (Array.isArray(node.children) && node.children.length > 0) {
          const found = dfs(node.children, nextPath);
          if (found) return found;
        }
      }
      return null;
    };

    return dfs(item.variants, []) || null;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    // Animate item removal
    gsap.to(`#cart-item-${productId}`, {
      opacity: 0,
      x: -100,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => removeFromCart(productId)
    });
  };

  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-screen pt-20 xs:pt-22 sm:pt-24 md:pt-24 flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFDFB 100%)' }}
      >
        <div className="text-center max-w-xs xs:max-w-sm sm:max-w-md md:max-w-md mx-auto">
          <div className="glass p-8 xs:p-10 sm:p-12 md:p-12 rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl">
            <ShoppingBagIcon className="w-12 xs:w-14 sm:w-16 md:w-16 h-12 xs:h-14 sm:h-16 md:h-16 text-gray-400 mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-6" />
            <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-2xl font-bold text-lofi mb-3 xs:mb-4 sm:mb-4 md:mb-4 font-chinese">
              購物車是空的
            </h2>
            <p className="text-gray-500 mb-6 xs:mb-7 sm:mb-8 md:mb-8 font-chinese text-sm xs:text-sm sm:text-base md:text-base">
              還沒有商品在購物車裡，快去挑選喜歡的商品吧！
            </p>
            <Link to="/products" className="btn-primary font-chinese inline-block px-6 xs:px-7 sm:px-8 md:px-8 py-2.5 xs:py-3 sm:py-3 md:py-3 text-sm xs:text-sm sm:text-base md:text-base">
              開始購物
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 xs:pt-22 sm:pt-24 md:pt-24 pb-10 xs:pb-12 sm:pb-16 md:pb-16" style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFDFB 100%)'}}>
      <div className="w-full px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Header */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-6 xs:mb-7 sm:mb-8 md:mb-8 gap-3 xs:gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 font-chinese">
              購物車
            </h1>
            <p className="text-gray-600 mt-1 xs:mt-1.5 sm:mt-2 md:mt-2 font-chinese text-sm xs:text-sm sm:text-base md:text-base">
              {cartItemsCount} 件商品
            </p>
          </div>
          <button
            onClick={clearCart}
            className="btn-ghost text-red-600 hover:bg-red-50 font-chinese text-xs xs:text-sm sm:text-sm md:text-base px-3 xs:px-4 sm:px-4 md:px-4 py-2 xs:py-2 sm:py-2 md:py-2"
          >
            清空購物車
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 xs:space-y-4 sm:space-y-4 md:space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="cart-item glass p-4 xs:p-5 sm:p-6 md:p-6 rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl"
              >
                <div className="flex items-start xs:items-center gap-3 xs:gap-4 sm:gap-4 md:gap-4">
                  {/* Product Image */}
                  <div className="w-16 xs:w-18 sm:w-20 md:w-20 h-16 xs:h-18 sm:h-20 md:h-20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md xs:rounded-md sm:rounded-lg md:rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 font-chinese text-sm xs:text-sm sm:text-base md:text-base line-clamp-2">
                          <Link 
                             to={buildProductDetailUrl(item)}
                            className="hover:text-apricot-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-xs xs:text-xs sm:text-sm md:text-sm text-apricot-600 font-chinese mt-1">
                          {item.category}
                        </p>
                        {/* 顯示使用者選擇的規格變體 */}
                        {(() => {
                          const path = getVariantPathLabels(item);
                          const sku = item?.variant?.payload?.sku;
                          if (!path && !sku) return null;
                          return (
                            <div className="mt-1 text-[11px] xs:text-xs sm:text-sm md:text-sm text-gray-600 font-chinese">
                              {path && (
                                <span className="inline-block">規格：{path.join(' / ')}</span>
                              )}
                              {sku && (
                                <span className="inline-block ml-2 text-gray-400">SKU：{sku}</span>
                              )}
                            </div>
                          );
                        })()}
                        <p className="text-base xs:text-base sm:text-lg md:text-lg font-bold text-gray-900 mt-1.5 xs:mt-2 sm:mt-2 md:mt-2">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 xs:p-2 sm:p-2 md:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <TrashIcon className="w-4 xs:w-5 sm:w-5 md:w-5 h-4 xs:h-5 sm:h-5 md:h-5" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3 xs:mt-3.5 sm:mt-4 md:mt-4">
                      <div className="flex items-center border border-gray-300 rounded-md xs:rounded-md sm:rounded-lg md:rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1.5 xs:p-2 sm:p-2 md:p-2 hover:bg-gray-100 transition-colors"
                        >
                          <MinusIcon className="w-3.5 xs:w-4 sm:w-4 md:w-4 h-3.5 xs:h-4 sm:h-4 md:h-4" />
                        </button>
                        <span className="px-3 xs:px-4 sm:px-4 md:px-4 py-1.5 xs:py-2 sm:py-2 md:py-2 border-x border-gray-300 min-w-[2.5rem] xs:min-w-[3rem] sm:min-w-[3rem] md:min-w-[3rem] text-center text-sm xs:text-base sm:text-base md:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1.5 xs:p-2 sm:p-2 md:p-2 hover:bg-gray-100 transition-colors"
                        >
                          <PlusIcon className="w-3.5 xs:w-4 sm:w-4 md:w-4 h-3.5 xs:h-4 sm:h-4 md:h-4" />
                        </button>
                      </div>
                      
                      <div className="text-base xs:text-base sm:text-lg md:text-lg font-bold text-apricot-600">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass p-5 xs:p-5 sm:p-6 md:p-6 rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl sticky top-24">
              <h2 className="text-lg xs:text-xl sm:text-xl md:text-xl font-bold text-gray-900 mb-5 xs:mb-5 sm:mb-6 md:mb-6 font-chinese">
                訂單摘要
              </h2>
              
              <div className="space-y-3 xs:space-y-3.5 sm:space-y-4 md:space-y-4">
                <div className="flex justify-between text-sm xs:text-sm sm:text-base md:text-base">
                  <span className="text-gray-600 font-chinese">商品小計</span>
                  <span className="text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm xs:text-sm sm:text-base md:text-base">
                  <span className="text-gray-600 font-chinese">運費</span>
                  <span className="text-gray-900">免費</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 xs:pt-3.5 sm:pt-4 md:pt-4">
                  <div className="flex justify-between">
                    <span className="text-base xs:text-lg sm:text-lg md:text-lg font-bold text-gray-900 font-chinese">總計</span>
                    <span className="text-base xs:text-lg sm:text-lg md:text-lg font-bold text-apricot-600">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full mt-6 xs:mt-7 sm:mt-8 md:mt-8 py-3 xs:py-3.5 sm:py-4 md:py-4 text-base xs:text-base sm:text-lg md:text-lg font-chinese inline-block text-center"
              >
                前往結帳
              </Link>

              <Link
                to="/products"
                className="btn-secondary w-full mt-3 xs:mt-3 sm:mt-4 md:mt-4 py-2.5 xs:py-2.5 sm:py-3 md:py-3 font-chinese inline-block text-center text-sm xs:text-sm sm:text-base md:text-base"
              >
                繼續購物
              </Link>

              {/* Shipping Info */}
              <div className="mt-5 xs:mt-5 sm:mt-6 md:mt-6 p-3 xs:p-3.5 sm:p-4 md:p-4 bg-green-50 rounded-lg xs:rounded-lg sm:rounded-lg md:rounded-lg">
                <p className="text-xs xs:text-sm sm:text-sm md:text-sm text-green-800 font-chinese">
                  🚚 購買滿 $1000 免運費
                </p>
                {cartTotal < 1000 && (
                  <p className="text-[10px] xs:text-xs sm:text-xs md:text-xs text-green-600 mt-1 font-chinese">
                    還差 {formatPrice(1000 - cartTotal)} 即可免運費
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;