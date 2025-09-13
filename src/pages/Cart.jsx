import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { formatPrice } from '../utils/data';
import { useCart } from '../hooks';

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
      <div className="min-h-screen pt-20 flex items-center justify-center bg-lofi">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white/80 border border-gray-200 p-12 rounded-2xl">
            <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-lofi mb-4 font-chinese">
              購物車是空的
            </h2>
            <p className="text-gray-500 mb-8 font-chinese">
              還沒有商品在購物車裡，快去挑選喜歡的商品吧！
            </p>
            <Link to="/products" className="btn-primary font-chinese">
              開始購物
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-chinese">
              購物車
            </h1>
            <p className="text-gray-600 mt-2 font-chinese">
              {cartItemsCount} 件商品
            </p>
          </div>
          <button
            onClick={clearCart}
            className="btn-ghost text-red-600 hover:bg-red-50 font-chinese"
          >
            清空購物車
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="cart-item glass p-6 rounded-2xl"
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 font-chinese">
                          <Link 
                            to={`/products/${item.id}`}
                            className="hover:text-apricot-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-apricot-600 font-chinese">
                          {item.category}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-lg font-bold text-apricot-600">
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
            <div className="glass p-6 rounded-2xl sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 font-chinese">
                訂單摘要
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-chinese">商品小計</span>
                  <span className="text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-chinese">運費</span>
                  <span className="text-gray-900">免費</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900 font-chinese">總計</span>
                    <span className="text-lg font-bold text-apricot-600">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full mt-8 py-4 text-lg font-chinese"
              >
                前往結帳
              </Link>

              <Link
                to="/products"
                className="btn-secondary w-full mt-4 py-3 font-chinese"
              >
                繼續購物
              </Link>

              {/* Shipping Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-chinese">
                  🚚 購買滿 $1000 免運費
                </p>
                {cartTotal < 1000 && (
                  <p className="text-xs text-green-600 mt-1 font-chinese">
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