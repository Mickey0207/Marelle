import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  CreditCardIcon,
  ShoppingBagIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { formatPrice } from "../../../external_mock/data/format.js";
import { useCart } from "../../../external_mock/state/cart.jsx";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderComplete]);

  useEffect(() => {
    // Animate checkout steps
    gsap.fromTo(
      '.checkout-step',
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      }
    );
  }, [currentStep]);

  const handleInputChange = (section, field, value) => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else if (section === 'payment') {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateStep = (step) => {
    if (step === 1) {
      return shippingInfo.fullName && 
             shippingInfo.email && 
             shippingInfo.phone && 
             shippingInfo.address && 
             shippingInfo.city && 
             shippingInfo.zipCode;
    } else if (step === 2) {
      if (paymentInfo.method === 'credit-card') {
        return paymentInfo.cardNumber && 
               paymentInfo.expiryDate && 
               paymentInfo.cvv && 
               paymentInfo.cardName;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      alert('請填寫所有必填欄位');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
    
    // Success animation
    gsap.fromTo(
      '.success-content',
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
      }
    );
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-16 xs:pt-18 sm:pt-20 md:pt-20 lg:pt-20 flex items-center justify-center" style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFDFB 100%)'}}>
        <div className="text-center max-w-md mx-auto px-4 xs:px-6 sm:px-8">
          <div className="bg-white/80 border border-gray-200 p-8 xs:p-10 sm:p-12 md:p-12 lg:p-14 rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl success-content">
            <CheckCircleIcon className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 text-green-500 mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-6" />
            <h2 className="text-xl xs:text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-lofi mb-3 xs:mb-3 sm:mb-4 md:mb-4 font-chinese">
              訂單完成！
            </h2>
            <p className="text-sm xs:text-sm sm:text-base md:text-base text-gray-500 mb-6 xs:mb-7 sm:mb-8 md:mb-8 font-chinese">
              感謝您的購買，我們會盡快為您處理訂單。
            </p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary w-full font-chinese"
            >
              繼續購物
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: '配送資訊', active: currentStep >= 1, completed: currentStep > 1 },
    { number: 2, title: '付款方式', active: currentStep >= 2, completed: currentStep > 2 },
    { number: 3, title: '確認訂單', active: currentStep >= 3, completed: false }
  ];

  return (
    <div className="min-h-screen pt-16 xs:pt-18 sm:pt-20 md:pt-20 lg:pt-20 pb-8 xs:pb-10 sm:pb-12 md:pb-12 lg:pb-14 xl:pb-16" style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFDFB 100%)'}}>
  <div className="w-full px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="mb-6 xs:mb-7 sm:mb-8 md:mb-8 lg:mb-10">
          <h1 className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-primary-btn font-chinese">
            結帳
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 xs:mb-10 sm:mb-12 md:mb-12 lg:mb-14">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center text-xs xs:text-sm sm:text-base md:text-base font-semibold ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : step.active 
                    ? 'bg-primary-btn text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.completed ? '✓' : step.number}
                </div>
                <span className={`ml-1 xs:ml-2 sm:ml-2 md:ml-2 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium font-chinese ${
                  step.active ? 'text-primary-btn' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 xs:h-0.5 sm:h-1 md:h-1 mx-2 xs:mx-3 sm:mx-4 md:mx-4 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8 md:gap-8 lg:gap-8 xl:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="checkout-step glass p-5 xs:p-6 sm:p-7 md:p-8 lg:p-8 rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl">
                <h2 className="text-lg xs:text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 md:mb-6 font-chinese">
                  配送資訊
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-3 sm:gap-4 md:gap-4 lg:gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleInputChange('shipping', 'fullName', e.target.value)}
                      className="input-glass font-chinese"
                      placeholder="請輸入您的姓名"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                      電子郵件 *
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                      className="input-glass"
                      placeholder="example@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                      電話 *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                      className="input-glass"
                      placeholder="09XX-XXX-XXX"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                      地址 *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                      className="input-glass font-chinese"
                      placeholder="請輸入詳細地址"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                      城市 *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                      className="input-glass font-chinese"
                      placeholder="台北市"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                      郵遞區號 *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleInputChange('shipping', 'zipCode', e.target.value)}
                      className="input-glass"
                      placeholder="100"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                      備註
                    </label>
                    <textarea
                      value={shippingInfo.notes}
                      onChange={(e) => handleInputChange('shipping', 'notes', e.target.value)}
                      className="input-glass font-chinese"
                      rows="3"
                      placeholder="配送備註（選填）"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <div className="checkout-step glass p-5 xs:p-6 sm:p-7 md:p-8 lg:p-8 rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl">
                <h2 className="text-lg xs:text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 md:mb-6 font-chinese">
                  付款方式
                </h2>
                
                {/* Payment Method Selection */}
                <div className="space-y-3 xs:space-y-3 sm:space-y-4 md:space-y-4 mb-5 xs:mb-5 sm:mb-6 md:mb-6">
                  <label className="flex items-center p-3 xs:p-3 sm:p-4 md:p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={paymentInfo.method === 'credit-card'}
                      onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                      className="mr-3"
                    />
                    <CreditCardIcon className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 mr-2" />
                    <span className="text-sm xs:text-sm sm:text-base md:text-base font-medium font-chinese">信用卡</span>
                  </label>
                  
                  <label className="flex items-center p-3 xs:p-3 sm:p-4 md:p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={paymentInfo.method === 'bank-transfer'}
                      onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-sm xs:text-sm sm:text-base md:text-base font-medium font-chinese">銀行轉帳</span>
                  </label>
                </div>

                {/* Credit Card Details */}
                {paymentInfo.method === 'credit-card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-3 sm:gap-4 md:gap-4 lg:gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                        持卡人姓名 *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardName}
                        onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                        className="input-glass font-chinese"
                        placeholder="請輸入持卡人姓名"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2">
                        卡號 *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                        className="input-glass"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2">
                        有效期限 *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                        className="input-glass"
                        placeholder="MM/YY"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                        className="input-glass"
                        placeholder="123"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {currentStep === 3 && (
              <div className="checkout-step glass p-5 xs:p-6 sm:p-7 md:p-8 lg:p-8 rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl">
                <h2 className="text-lg xs:text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 md:mb-6 font-chinese">
                  確認訂單
                </h2>
                
                {/* Order Items */}
                <div className="space-y-3 xs:space-y-3 sm:space-y-4 md:space-y-4 mb-6 xs:mb-7 sm:mb-8 md:mb-8">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 xs:space-x-3 sm:space-x-4 md:space-x-4 p-3 xs:p-3 sm:p-4 md:p-4 bg-white/50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm xs:text-sm sm:text-base md:text-base font-semibold text-gray-900 font-chinese">{item.name}</h3>
                        <p className="text-xs xs:text-xs sm:text-sm md:text-sm text-gray-600 font-chinese">數量：{item.quantity}</p>
                      </div>
                      <div className="text-base xs:text-base sm:text-lg md:text-lg font-bold text-apricot-600">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-6 mb-6 xs:mb-7 sm:mb-8 md:mb-8">
                  <div className="p-3 xs:p-3 sm:p-4 md:p-4 bg-white/50 rounded-lg">
                    <h3 className="text-sm xs:text-sm sm:text-base md:text-base font-semibold text-gray-900 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">配送地址</h3>
                    <p className="text-xs xs:text-xs sm:text-sm md:text-sm text-gray-600 font-chinese">
                      {shippingInfo.fullName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.city} {shippingInfo.zipCode}<br />
                      {shippingInfo.phone}
                    </p>
                  </div>
                  
                  <div className="p-3 xs:p-3 sm:p-4 md:p-4 bg-white/50 rounded-lg">
                    <h3 className="text-sm xs:text-sm sm:text-base md:text-base font-semibold text-gray-900 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">付款方式</h3>
                    <p className="text-xs xs:text-xs sm:text-sm md:text-sm text-gray-600 font-chinese">
                      {paymentInfo.method === 'credit-card' ? '信用卡' : '銀行轉帳'}
                      {paymentInfo.method === 'credit-card' && paymentInfo.cardNumber && (
                        <span className="block">**** **** **** {paymentInfo.cardNumber.slice(-4)}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 xs:mt-7 sm:mt-8 md:mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`btn-secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''} font-chinese`}
              >
                上一步
              </button>
              
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="btn-primary font-chinese"
                >
                  下一步
                </button>
              ) : (
                <button
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className={`btn-primary ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} font-chinese`}
                >
                  {isProcessing ? '處理中...' : '確認訂單'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass p-4 xs:p-5 sm:p-6 md:p-6 lg:p-6 rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl sticky top-20 xs:top-22 sm:top-24 md:top-24">
              <h2 className="text-lg xs:text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6 md:mb-6 font-chinese">
                訂單摘要
              </h2>
              
              <div className="space-y-3 xs:space-y-3 sm:space-y-4 md:space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm xs:text-sm sm:text-base md:text-base text-gray-600 font-chinese">商品小計</span>
                  <span className="text-sm xs:text-sm sm:text-base md:text-base text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm xs:text-sm sm:text-base md:text-base text-gray-600 font-chinese">運費</span>
                  <span className="text-sm xs:text-sm sm:text-base md:text-base text-gray-900">免費</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 xs:pt-3 sm:pt-4 md:pt-4">
                  <div className="flex justify-between">
                    <span className="text-base xs:text-base sm:text-lg md:text-lg lg:text-xl font-bold text-gray-900 font-chinese">總計</span>
                    <span className="text-base xs:text-base sm:text-lg md:text-lg lg:text-xl font-bold text-apricot-600">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;