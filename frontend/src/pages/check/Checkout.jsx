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
import { CVS_BRANDS } from "../../../external_mock/data/addresses.js";
import SearchableSelect from "../../components/ui/SearchableSelect.jsx";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    zip3: '',
    city: '',
    district: '',
    address: '',
    notes: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'CREDIT', // CREDIT | INSTALLMENT | APPLE_PAY | ATM | CVS_CODE | WEBATM | TWQR | LINEPAY
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // 付款方式定義與開發用開關
  const PAYMENT_DEFS = [
    { id: 'CREDIT', label: '信用卡（一次付清）' },
    { id: 'INSTALLMENT', label: '信用卡分期' },
    { id: 'APPLE_PAY', label: 'Apple Pay（僅 iOS Safari）' },
    { id: 'ATM', label: 'ATM 轉帳付款' },
    { id: 'CVS_CODE', label: '超商代碼付款' },
    { id: 'WEBATM', label: 'WEBATM 網路轉帳' },
    { id: 'TWQR', label: 'TWQR 行動支付' },
    { id: 'LINEPAY', label: 'LINE Pay' },
  ];
  const [paymentSwitches, setPaymentSwitches] = useState({
    CREDIT: true,
    INSTALLMENT: true,
    APPLE_PAY: true,
    ATM: true,
    CVS_CODE: true,
    WEBATM: true,
    TWQR: true,
    LINEPAY: true,
  });

  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  useEffect(() => {
    try {
      const ua = navigator.userAgent || '';
      const isIOS = /iPhone|iPad|iPod/.test(ua);
      const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
      const hasAPS = typeof window !== 'undefined' && 'ApplePaySession' in window;
      setIsApplePayAvailable(Boolean(isIOS && isSafari && hasAPS));
    } catch {
      setIsApplePayAvailable(false);
    }
  }, []);

  const isMethodEnabled = (id) => {
    if (!paymentSwitches[id]) return false;
    if (id === 'APPLE_PAY') return isApplePayAvailable && paymentSwitches.APPLE_PAY;
    return true;
  };

  // 若目前選取的方式被關閉或不可用，自動回退到第一個可用方式
  useEffect(() => {
    if (!isMethodEnabled(paymentInfo.method)) {
      const first = PAYMENT_DEFS.find(m => isMethodEnabled(m.id));
      if (first) setPaymentInfo(prev => ({ ...prev, method: first.id }));
    }
  }, [paymentSwitches, isApplePayAvailable]);

  // 配送方式與地址簿/超商資訊
  const [shippingMethod, setShippingMethod] = useState('home'); // 'home' | 'cvs'
  const [homeAddresses, setHomeAddresses] = useState([]);
  const [cvsAddresses, setCvsAddresses] = useState([]);
  const [selectedHomeAddressId, setSelectedHomeAddressId] = useState('');
  const [selectedCvsAddressId, setSelectedCvsAddressId] = useState('');
  const [cvsInfo, setCvsInfo] = useState({ brand: '', storeName: '', storeId: '', storeAddress: '' });

  useEffect(() => {
    // 路由保護：未登入者導向登入頁
    (async () => {
      try {
        const res = await fetch('/frontend/auth/me', { method: 'GET', credentials: 'include' });
        if (!res.ok) {
          navigate(`/login?redirect=${encodeURIComponent('/checkout')}`, { replace: true });
          return;
        }
      } catch {
        navigate(`/login?redirect=${encodeURIComponent('/checkout')}`, { replace: true });
        return;
      }
    })();

    if (cartItems.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderComplete]);

  // 後端 API：載入地址簿（宅配 / 超商）
  useEffect(() => {
    let cancelled = false;
    async function loadBooks() {
      try {
        const [h, s] = await Promise.all([
          fetch('/frontend/account/addresses?type=home', { credentials: 'include' }),
          fetch('/frontend/account/addresses?type=cvs', { credentials: 'include' })
        ]);
        if (!cancelled) {
          if (h.ok) { const d = await h.json(); setHomeAddresses(Array.isArray(d) ? d : []); }
          if (s.ok) { const d2 = await s.json(); setCvsAddresses(Array.isArray(d2) ? d2 : []); }
        }
      } catch {}
    }
    loadBooks();
    return () => { cancelled = true; };
  }, []);

  // 郵遞區號 zip3 自動帶入 城市/地區
  useEffect(() => {
    const zip3 = String(shippingInfo.zip3 || '').trim();
    let active = true;
    async function fetchZip() {
      try {
        if (!/^\d{3}$/.test(zip3)) return;
        const res = await fetch(`/frontend/account/zip/${zip3}`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (!active || !data) return;
        setShippingInfo(prev => ({ ...prev, city: data.city || prev.city, district: data.district || prev.district }));
      } catch {}
    }
    fetchZip();
    return () => { active = false; };
  }, [shippingInfo.zip3]);

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
      if (shippingMethod === 'home') {
        return shippingInfo.fullName && 
               shippingInfo.phone && 
               shippingInfo.zip3 && 
               shippingInfo.city && 
               shippingInfo.district &&
               shippingInfo.address;
      }
      // 超商取貨：需姓名、電話、品牌與門市名稱
      return shippingInfo.fullName && shippingInfo.phone && cvsInfo.brand && cvsInfo.storeName;
    } else if (step === 2) {
      if (paymentInfo.method === 'CREDIT' || paymentInfo.method === 'INSTALLMENT') {
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

  // 綠界選店（新視窗）
  function openCvsMap(subType = 'FAMIC2C') {
    const w = window.open('', 'ecpay_map', 'width=1024,height=768');
    if (w) w.location.href = `/frontend/account/ecpay/map/start?subType=${encodeURIComponent(subType)}`;
  }

  // 接收選店回傳並填入 cvsInfo
  useEffect(() => {
    function onMsg(e) {
      if (!e?.data || e.data.type !== 'ecpay:cvs:selected') return;
      try {
        const s = e.data?.data || (function(){
          const raw = localStorage.getItem('ecpay_map_store');
          return raw ? JSON.parse(raw) : null;
        })();
        if (!s) return;
        // 將 LogisticsSubType 作為品牌 value
        setCvsInfo(prev => ({
          ...prev,
          brand: s.sub_type || prev.brand || '',
          storeId: s.store_id || prev.storeId || '',
          storeName: s.store_name || prev.storeName || '',
          storeAddress: s.store_address || prev.storeAddress || '',
        }));
      } catch {}
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

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
        {/* Header with Progress Steps */}
        <div className="mt-6 xs:mt-7 sm:mt-8 md:mt-10 lg:mt-10 mb-6 xs:mb-7 sm:mb-8 md:mb-8 lg:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            {/* Title */}
            <h1 className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold text-primary-btn font-chinese whitespace-nowrap flex-shrink-0">
              結帳
            </h1>
            
            {/* Progress Steps */}
            <div className="flex-1 lg:min-w-[500px] xl:min-w-[600px]">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs xs:text-sm sm:text-base md:text-base font-semibold flex-shrink-0 ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : step.active 
                        ? 'bg-primary-btn text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.completed ? '✓' : step.number}
                    </div>
                    <span className={`ml-1.5 xs:ml-2 sm:ml-2 md:ml-2 text-[11px] xs:text-xs sm:text-sm md:text-sm font-medium font-chinese whitespace-nowrap ${
                      step.active ? 'text-primary-btn' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 xs:h-0.5 sm:h-1 md:h-1 mx-2 xs:mx-2 sm:mx-3 md:mx-4 min-w-[20px] ${
                        step.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
                {/* 配送方式切換 */}
                <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-6">
                  <div className="inline-flex rounded-lg overflow-hidden border">
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm font-chinese ${shippingMethod === 'home' ? 'bg-primary-btn text-white' : 'bg-white text-gray-700'}`}
                      onClick={() => setShippingMethod('home')}
                    >
                      宅配到府
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm font-chinese border-l ${shippingMethod === 'cvs' ? 'bg-primary-btn text-white' : 'bg-white text-gray-700'}`}
                      onClick={() => setShippingMethod('cvs')}
                    >
                      超商取貨
                    </button>
                  </div>
                </div>

                {/* 地址簿下拉（宅配，保留欄位可覆寫） */}
                {shippingMethod === 'home' && (
                  <div className="mb-4">
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">從地址簿選擇</label>
                    <SearchableSelect
                      options={[
                        { value: '', label: '不套用（手動填寫）' },
                        ...homeAddresses.map(a => ({
                          value: a.id,
                          label: `${a.alias || a.receiver_name || ''}｜${a.city}${a.district}${a.address_line}`
                        }))
                      ]}
                      value={selectedHomeAddressId}
                      onChange={(id) => {
                        setSelectedHomeAddressId(id);
                        const a = homeAddresses.find(x => x.id === id);
                        if (!a) return;
                        setShippingInfo(prev => ({
                          ...prev,
                          fullName: a.receiver_name || prev.fullName,
                          phone: a.receiver_phone || prev.phone,
                          zip3: a.zip3 || prev.zip3,
                          city: a.city || prev.city,
                          district: a.district || prev.district,
                          address: a.address_line || prev.address,
                        }));
                      }}
                      placeholder="請選擇地址"
                      searchPlaceholder="搜尋地址..."
                      allowClear={true}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  {/* 超商地址簿（放在最前面） */}
                  {shippingMethod === 'cvs' && (
                    <div>
                      <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">從地址簿選擇</label>
                      <SearchableSelect
                        options={[
                          { value: '', label: '不套用（手動填寫）' },
                          ...cvsAddresses.map(a => ({
                            value: a.id,
                            label: `${a.alias || a.store_name || ''}｜${a.vendor}`
                          }))
                        ]}
                        value={selectedCvsAddressId}
                        onChange={(id) => {
                          setSelectedCvsAddressId(id);
                          const a = cvsAddresses.find(x => x.id === id);
                          if (!a) return;
                          setShippingInfo(prev => ({
                            ...prev,
                            fullName: a.receiver_name || prev.fullName,
                            phone: a.receiver_phone || prev.phone,
                          }));
                          setCvsInfo(prev => ({
                            ...prev,
                            brand: a.vendor || prev.brand,
                            storeId: a.store_id || prev.storeId,
                            storeName: a.store_name || prev.storeName,
                            storeAddress: a.store_address || prev.storeAddress,
                          }));
                        }}
                        placeholder="請選擇超商地址"
                        searchPlaceholder="搜尋門市..."
                        allowClear={true}
                      />
                    </div>
                  )}
                  
                  {/* 姓名欄位 */}
                  <div>
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleInputChange('shipping', 'fullName', e.target.value)}
                      className="input-glass font-chinese w-full"
                      placeholder="請輸入您的姓名"
                    />
                  </div>
                  
                  {/* 電話欄位 */}
                  <div>
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                      電話 *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                      className="input-glass w-full"
                      placeholder="09XX-XXX-XXX"
                    />
                  </div>
                  
                  {/* 宅配專屬欄位 */}
                  {shippingMethod === 'home' && (
                    <>
                      {/* 郵遞區號、城市、地區（三欄並排） */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">郵遞區號 *</label>
                          <input
                            type="text"
                            value={shippingInfo.zip3}
                            onChange={(e) => handleInputChange('shipping', 'zip3', e.target.value)}
                            className="input-glass w-full"
                            placeholder="100"
                            maxLength="3"
                          />
                        </div>
                        <div>
                          <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">城市 *</label>
                          <input
                            type="text"
                            value={shippingInfo.city}
                            onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                            className="input-glass font-chinese w-full"
                            placeholder="台北市"
                          />
                        </div>
                        <div>
                          <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">地區 *</label>
                          <input
                            type="text"
                            value={shippingInfo.district}
                            onChange={(e) => handleInputChange('shipping', 'district', e.target.value)}
                            className="input-glass font-chinese w-full"
                            placeholder="中正區"
                          />
                        </div>
                      </div>
                      
                      {/* 詳細地址 */}
                      <div>
                        <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                          詳細地址 *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.address}
                          onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                          className="input-glass font-chinese w-full"
                          placeholder="請輸入詳細地址"
                        />
                      </div>
                    </>
                  )}

                  {/* 超商取貨專屬欄位 */}
                  {shippingMethod === 'cvs' && (
                    <>
                      {/* 超商品牌與門市選擇（兩欄並排） */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">超商品牌 *</label>
                          <SearchableSelect
                            options={[
                              { value: '', label: '請選擇' },
                              ...CVS_BRANDS.map(b => ({
                                value: b.value,
                                label: b.label
                              }))
                            ]}
                            value={cvsInfo.brand}
                            onChange={(brand) => setCvsInfo(prev => ({ ...prev, brand }))}
                            placeholder="請選擇超商品牌"
                            searchPlaceholder="搜尋超商..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">門市代碼</label>
                          <input
                            type="text"
                            value={cvsInfo.storeId}
                            onChange={(e) => setCvsInfo(prev => ({ ...prev, storeId: e.target.value }))}
                            className="input-glass w-full"
                            placeholder="例如：123456"
                            readOnly
                          />
                        </div>
                      </div>
                      
                      {/* 門市名稱與選擇按鈕 */}
                      <div>
                        <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">門市名稱 *</label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={cvsInfo.storeName}
                            onChange={(e) => setCvsInfo(prev => ({ ...prev, storeName: e.target.value }))}
                            className="input-glass flex-1"
                            placeholder="請輸入或選擇門市"
                          />
                          <button
                            type="button"
                            onClick={() => openCvsMap(cvsInfo.brand || 'FAMIC2C')}
                            className="px-4 py-2 rounded-md text-sm border font-chinese whitespace-nowrap"
                            style={{ borderColor: '#E5E7EB', color: '#666666' }}
                          >
                            選擇門市
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* 備註欄位（兩種模式共用） */}
                  <div>
                    <label className="block text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">
                      備註
                    </label>
                    <textarea
                      value={shippingInfo.notes}
                      onChange={(e) => handleInputChange('shipping', 'notes', e.target.value)}
                      className="input-glass font-chinese w-full"
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
                
                {/* Payment Method Selection with dev toggles */}
                <div className="space-y-3 xs:space-y-3 sm:space-y-4 md:space-y-4 mb-5 xs:mb-5 sm:mb-6 md:mb-6">
                  {PAYMENT_DEFS.map((m) => {
                    const enabled = isMethodEnabled(m.id);
                    const selected = paymentInfo.method === m.id;
                    return (
                      <div key={m.id} className={`p-3 xs:p-3 sm:p-4 md:p-4 border rounded-lg ${enabled ? 'cursor-pointer hover:bg-gray-50' : 'opacity-50'} transition`}
                        onClick={() => enabled && handleInputChange('payment', 'method', m.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input type="radio" name="paymentMethod" value={m.id} checked={selected} onChange={() => {}} className="mr-3" disabled={!enabled} />
                            {m.id === 'CREDIT' && (<CreditCardIcon className="w-4 h-4 mr-2" />)}
                            <span className="text-sm xs:text-sm sm:text-base md:text-base font-medium font-chinese">{m.label}</span>
                            {m.id === 'APPLE_PAY' && !isApplePayAvailable && (
                              <span className="ml-2 text-xs text-gray-500">僅 iOS Safari 可用</span>
                            )}
                          </div>
                          {/* 開發用開關 */}
                          <label className="flex items-center gap-2 text-xs text-gray-600 select-none">
                            <span>啟用</span>
                            <input
                              type="checkbox"
                              checked={!!paymentSwitches[m.id]}
                              onChange={(e) => setPaymentSwitches(prev => ({ ...prev, [m.id]: e.target.checked }))}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Credit Card Details */}
                {(paymentInfo.method === 'CREDIT' || paymentInfo.method === 'INSTALLMENT') && (
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
                    <h3 className="text-sm xs:text-sm sm:text-base md:text-base font-semibold text-gray-900 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">配送資訊</h3>
                    {shippingMethod === 'home' ? (
                      <p className="text-xs xs:text-xs sm:text-sm md:text-sm text-gray-600 font-chinese">
                        {shippingInfo.fullName}<br />
                        {shippingInfo.zip3} {shippingInfo.city} {shippingInfo.district}<br />
                        {shippingInfo.address}<br />
                        {shippingInfo.phone}
                      </p>
                    ) : (
                      <p className="text-xs xs:text-xs sm:text-sm md:text-sm text-gray-600 font-chinese">
                        {shippingInfo.fullName}（超商取貨）<br />
                        {cvsInfo.brand && (<span>品牌：{CVS_BRANDS.find(b => b.value === cvsInfo.brand)?.label || cvsInfo.brand}<br /></span>)}
                        門市：{cvsInfo.storeName}{cvsInfo.storeId ? `（${cvsInfo.storeId}）` : ''}<br />
                        地址：{cvsInfo.storeAddress || '-'}<br />
                        電話：{shippingInfo.phone}
                      </p>
                    )}
                  </div>
                  
                  <div className="p-3 xs:p-3 sm:p-4 md:p-4 bg-white/50 rounded-lg">
                    <h3 className="text-sm xs:text-sm sm:text-base md:text-base font-semibold text-gray-900 mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 font-chinese">付款方式</h3>
                    <p className="text-xs xs:text-xs sm:text-sm md:text-sm text-gray-600 font-chinese">
                      {{
                        CREDIT: '信用卡（一次付清）',
                        INSTALLMENT: '信用卡分期',
                        APPLE_PAY: 'Apple Pay',
                        ATM: 'ATM 轉帳付款',
                        CVS_CODE: '超商代碼付款',
                        WEBATM: 'WEBATM 網路轉帳',
                        TWQR: 'TWQR 行動支付',
                        LINEPAY: 'LINE Pay',
                      }[paymentInfo.method] || '—'}
                      {(paymentInfo.method === 'CREDIT' || paymentInfo.method === 'INSTALLMENT') && paymentInfo.cardNumber && (
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