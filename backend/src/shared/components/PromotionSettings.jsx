import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  GiftIcon,
  TicketIcon,
  PercentBadgeIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ShoppingBagIcon,
  UsersIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import festivalDataManager from '../utils/festivalDataManager';

const PromotionSettings = () => {
  const [festivals, setFestivals] = useState([]);
  const [selectedFestival, setSelectedFestival] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState('promotions');
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // 促銷表單?��?
  const [promotionForm, setPromotionForm] = useState({
    festivalId: '',
    name: '',
    type: 'discount',
    rules: {
      minAmount: 0,
      discountRate: 0,
      maxDiscount: 0,
      giftItems: []
    },
    startTime: '',
    endTime: '',
    isActive: true,
    usageLimit: 0
  });

  // ?��??�表?�數??
  const [couponForm, setCouponForm] = useState({
    festivalId: '',
    code: '',
    name: '',
    type: 'percentage',
    value: 0,
    minAmount: 0,
    maxDiscount: 0,
    validFrom: '',
    validTo: '',
    isActive: true,
    totalQuantity: 0,
    targetCustomers: 'all'
  });

  const promotionTypes = [
    { value: 'discount', label: '?�扣?��?', icon: PercentBadgeIcon },
    { value: 'gift', label: '滿�?贈禮', icon: GiftIcon },
    { value: 'shipping', label: '?��??��?', icon: TruckIcon },
    { value: 'bundle', label: '組�??��?', icon: ShoppingBagIcon }
  ];

  const couponTypes = [
    { value: 'percentage', label: '?��?比�??? },
    { value: 'fixed', label: '?��??��?' }
  ];

  const targetCustomerOptions = [
    { value: 'all', label: '?�?�客?? },
    { value: 'members', label: '?�員?��?' },
    { value: 'vip', label: 'VIP ?�員' },
    { value: 'new', label: '?�客?? }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedFestival) {
      loadPromotionsAndCoupons(selectedFestival);
    }
  }, [selectedFestival]);

  const loadData = () => {
    try {
      const festivalsData = festivalDataManager.getAllFestivals();
      setFestivals(festivalsData);
      if (festivalsData.length > 0) {
        setSelectedFestival(festivalsData[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('載入?��?失�?:', error);
      setLoading(false);
    }
  };

  const loadPromotionsAndCoupons = (festivalId) => {
    try {
      const promotionsData = festivalDataManager.getPromotionsByFestival(festivalId);
      const couponsData = festivalDataManager.getCouponsByFestival(festivalId);
      setPromotions(promotionsData);
      setCoupons(couponsData);
    } catch (error) {
      console.error('載入促銷?��?失�?:', error);
    }
  };

  const handleCreatePromotion = () => {
    try {
      const newPromotion = festivalDataManager.createPromotion({
        ...promotionForm,
        festivalId: selectedFestival
      });
      setPromotions([...promotions, newPromotion]);
      setShowPromotionModal(false);
      resetPromotionForm();
    } catch (error) {
      console.error('?�建促銷失�?:', error);
    }
  };

  const handleUpdatePromotion = () => {
    try {
      const updated = festivalDataManager.updatePromotion(selectedItem.id, promotionForm);
      setPromotions(promotions.map(p => p.id === selectedItem.id ? updated : p));
      setShowPromotionModal(false);
      setEditMode(false);
      resetPromotionForm();
    } catch (error) {
      console.error('?�新促銷失�?:', error);
    }
  };

  const handleCreateCoupon = () => {
    try {
      const newCoupon = festivalDataManager.createCoupon({
        ...couponForm,
        festivalId: selectedFestival
      });
      setCoupons([...coupons, newCoupon]);
      setShowCouponModal(false);
      resetCouponForm();
    } catch (error) {
      console.error('?�建?��??�失??', error);
    }
  };

  const handleUpdateCoupon = () => {
    try {
      const updated = festivalDataManager.updateCoupon(selectedItem.id, couponForm);
      setCoupons(coupons.map(c => c.id === selectedItem.id ? updated : c));
      setShowCouponModal(false);
      setEditMode(false);
      resetCouponForm();
    } catch (error) {
      console.error('?�新?��??�失??', error);
    }
  };

  const handleDelete = () => {
    try {
      if (activeTab === 'promotions') {
        festivalDataManager.deletePromotion(selectedItem.id);
        setPromotions(promotions.filter(p => p.id !== selectedItem.id));
      } else {
        festivalDataManager.deleteCoupon(selectedItem.id);
        setCoupons(coupons.filter(c => c.id !== selectedItem.id));
      }
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('?�除失�?:', error);
    }
  };

  const resetPromotionForm = () => {
    setPromotionForm({
      festivalId: '',
      name: '',
      type: 'discount',
      rules: {
        minAmount: 0,
        discountRate: 0,
        maxDiscount: 0,
        giftItems: []
      },
      startTime: '',
      endTime: '',
      isActive: true,
      usageLimit: 0
    });
  };

  const resetCouponForm = () => {
    setCouponForm({
      festivalId: '',
      code: '',
      name: '',
      type: 'percentage',
      value: 0,
      minAmount: 0,
      maxDiscount: 0,
      validFrom: '',
      validTo: '',
      isActive: true,
      totalQuantity: 0,
      targetCustomers: 'all'
    });
  };

  const openEditPromotion = (promotion) => {
    setSelectedItem(promotion);
    setPromotionForm({
      festivalId: promotion.festivalId,
      name: promotion.name,
      type: promotion.type,
      rules: promotion.rules,
      startTime: promotion.startTime?.split('T')[0] || '',
      endTime: promotion.endTime?.split('T')[0] || '',
      isActive: promotion.isActive,
      usageLimit: promotion.usageLimit
    });
    setEditMode(true);
    setShowPromotionModal(true);
  };

  const openEditCoupon = (coupon) => {
    setSelectedItem(coupon);
    setCouponForm({
      festivalId: coupon.festivalId,
      code: coupon.code,
      name: coupon.name,
      type: coupon.type,
      value: coupon.value,
      minAmount: coupon.minAmount,
      maxDiscount: coupon.maxDiscount,
      validFrom: coupon.validFrom?.split('T')[0] || '',
      validTo: coupon.validTo?.split('T')[0] || '',
      isActive: coupon.isActive,
      totalQuantity: coupon.totalQuantity,
      targetCustomers: coupon.targetCustomers
    });
    setEditMode(true);
    setShowCouponModal(true);
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponForm({...couponForm, code: result});
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? '?�用�? : '已�???}
      </span>
    );
  };

  const getPromotionTypeInfo = (type) => {
    const typeInfo = promotionTypes.find(t => t.value === type);
    return typeInfo || { label: type, icon: GiftIcon };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cc824d]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f2] p-6">
      <div>
        {/* ?�面標�? */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">促銷設�?</h1>
          <p className="text-gray-600">管�?節?��??�活?��??��???/p>
        </div>

        {/* 節?�選??*/}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">?��?節??</label>
            <select
              value={selectedFestival}
              onChange={(e) => setSelectedFestival(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
            >
              {festivals.map((festival) => (
                <option key={festival.id} value={festival.id}>
                  {festival.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 標籤??*/}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('promotions')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'promotions'
                    ? 'border-[#cc824d] text-[#cc824d]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <GiftIcon className="h-5 w-5 mr-2" />
                  促銷活�? ({promotions.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'coupons'
                    ? 'border-[#cc824d] text-[#cc824d]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <TicketIcon className="h-5 w-5 mr-2" />
                  ?��???({coupons.length})
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* ?��??��? */}
            <div className="flex justify-end mb-6">
              {activeTab === 'promotions' ? (
                <button
                  onClick={() => setShowPromotionModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b8734a] transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  ?�建促銷
                </button>
              ) : (
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b8734a] transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  ?�建?��???
                </button>
              )}
            </div>

            {/* 促銷活�??�表 */}
            {activeTab === 'promotions' && (
              <div className="space-y-4">
                {promotions.length > 0 ? (
                  promotions.map((promotion) => {
                    const typeInfo = getPromotionTypeInfo(promotion.type);
                    return (
                      <div key={promotion.id} className="bg-white/50 border border-white/30 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-[#cc824d]/10 rounded-lg">
                              <typeInfo.icon className="h-6 w-6 text-[#cc824d]" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{promotion.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span>{typeInfo.label}</span>
                                <span>??/span>
                                <span>已使??{promotion.usageCount}/{promotion.usageLimit}</span>
                                <span>??/span>
                                <span>{formatDate(promotion.startTime)} - {formatDate(promotion.endTime)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(promotion.isActive)}
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => openEditPromotion(promotion)}
                                className="text-[#cc824d] hover:text-[#b8734a] p-1 rounded"
                                title="編輯"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title="?��?詳�?"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedItem(promotion);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                title="?�除"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* 促銷規�?詳�? */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {promotion.type === 'discount' && (
                              <>
                                <div>
                                  <span className="text-gray-500">?�低�?�?</span>
                                  <div className="font-medium">NT${promotion.rules.minAmount?.toLocaleString()}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">?�扣??</span>
                                  <div className="font-medium">{promotion.rules.discountRate * 100}%</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">?�高�???</span>
                                  <div className="font-medium">NT${promotion.rules.maxDiscount?.toLocaleString()}</div>
                                </div>
                              </>
                            )}
                            {promotion.type === 'gift' && (
                              <>
                                <div>
                                  <span className="text-gray-500">?�低�?�?</span>
                                  <div className="font-medium">NT${promotion.rules.minAmount?.toLocaleString()}</div>
                                </div>
                                <div className="md:col-span-3">
                                  <span className="text-gray-500">贈�?:</span>
                                  <div className="font-medium">{promotion.rules.giftItems?.join(', ')}</div>
                                </div>
                              </>
                            )}
                            <div>
                              <span className="text-gray-500">使用?�制:</span>
                              <div className="font-medium">{promotion.usageLimit} �?/div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <GiftIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">尚未建�?任�?促銷活�?</p>
                  </div>
                )}
              </div>
            )}

            {/* ?��??��?�?*/}
            {activeTab === 'coupons' && (
              <div className="space-y-4">
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white/50 border border-white/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <TicketIcon className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{coupon.name}</h3>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded">
                                {coupon.code}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span>{coupon.type === 'percentage' ? `${coupon.value}% ?�扣` : `NT$${coupon.value} 減�?`}</span>
                              <span>??/span>
                              <span>已使??{coupon.usedQuantity}/{coupon.totalQuantity}</span>
                              <span>??/span>
                              <span>{formatDate(coupon.validFrom)} - {formatDate(coupon.validTo)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(coupon.isActive)}
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => openEditCoupon(coupon)}
                              className="text-[#cc824d] hover:text-[#b8734a] p-1 rounded"
                              title="編輯"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => navigator.clipboard.writeText(coupon.code)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              title="複製�?��"
                            >
                              <ClipboardDocumentIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedItem(coupon);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                              title="?�除"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* ?��??�詳??*/}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">?�低�?�?</span>
                            <div className="font-medium">NT${coupon.minAmount?.toLocaleString()}</div>
                          </div>
                          {coupon.type === 'percentage' && (
                            <div>
                              <span className="text-gray-500">?�高�???</span>
                              <div className="font-medium">NT${coupon.maxDiscount?.toLocaleString()}</div>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">?��?客戶:</span>
                            <div className="font-medium">
                              {targetCustomerOptions.find(t => t.value === coupon.targetCustomers)?.label}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">?��??��?:</span>
                            <div className="font-medium">{coupon.totalQuantity - coupon.usedQuantity}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <TicketIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">尚未建�?任�??��???/p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 促銷活�? Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editMode ? '編輯促銷活�?' : '?�建促銷活�?'}
              </h3>
              <button 
                onClick={() => {
                  setShowPromotionModal(false);
                  setEditMode(false);
                  resetPromotionForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">促銷?�稱</label>
                <input
                  type="text"
                  value={promotionForm.name}
                  onChange={(e) => setPromotionForm({...promotionForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  placeholder="輸入促銷?�稱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">促銷類�?</label>
                <select
                  value={promotionForm.type}
                  onChange={(e) => setPromotionForm({...promotionForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                >
                  {promotionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">?��??��?</label>
                  <input
                    type="date"
                    value={promotionForm.startTime}
                    onChange={(e) => setPromotionForm({...promotionForm, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">結�??��?</label>
                  <input
                    type="date"
                    value={promotionForm.endTime}
                    onChange={(e) => setPromotionForm({...promotionForm, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  />
                </div>
              </div>

              {/* 促銷規�?設�? */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">促銷規�?</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">?�低�?費�?�?/label>
                    <input
                      type="number"
                      value={promotionForm.rules.minAmount}
                      onChange={(e) => setPromotionForm({
                        ...promotionForm,
                        rules: {...promotionForm.rules, minAmount: Number(e.target.value)}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                      placeholder="0"
                    />
                  </div>

                  {promotionForm.type === 'discount' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">?�扣??(%)</label>
                        <input
                          type="number"
                          value={promotionForm.rules.discountRate * 100}
                          onChange={(e) => setPromotionForm({
                            ...promotionForm,
                            rules: {...promotionForm.rules, discountRate: Number(e.target.value) / 100}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">?�高�????�?/label>
                        <input
                          type="number"
                          value={promotionForm.rules.maxDiscount}
                          onChange={(e) => setPromotionForm({
                            ...promotionForm,
                            rules: {...promotionForm.rules, maxDiscount: Number(e.target.value)}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                          placeholder="0"
                        />
                      </div>
                    </>
                  )}

                  {promotionForm.type === 'gift' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">贈�??�目 (以逗�??��?)</label>
                      <input
                        type="text"
                        value={promotionForm.rules.giftItems?.join(', ')}
                        onChange={(e) => setPromotionForm({
                          ...promotionForm,
                          rules: {...promotionForm.rules, giftItems: e.target.value.split(',').map(item => item.trim())}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                        placeholder="贈�?1, 贈�?2, 贈�?3"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">使用次數?�制</label>
                <input
                  type="number"
                  value={promotionForm.usageLimit}
                  onChange={(e) => setPromotionForm({...promotionForm, usageLimit: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  placeholder="0 表示?��???
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={promotionForm.isActive}
                    onChange={(e) => setPromotionForm({...promotionForm, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">立即?�用</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowPromotionModal(false);
                  setEditMode(false);
                  resetPromotionForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ?��?
              </button>
              <button
                onClick={editMode ? handleUpdatePromotion : handleCreatePromotion}
                className="px-4 py-2 bg-[#cc824d] text-white rounded-md hover:bg-[#b8734a]"
              >
                {editMode ? '?�新' : '?�建'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ?��???Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editMode ? '編輯?��??? : '?�建?��???}
              </h3>
              <button 
                onClick={() => {
                  setShowCouponModal(false);
                  setEditMode(false);
                  resetCouponForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">?��??��?�?/label>
                <input
                  type="text"
                  value={couponForm.name}
                  onChange={(e) => setCouponForm({...couponForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  placeholder="輸入?��??��?�?
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">?��??�代�?/label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({...couponForm, code: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="輸入?��??�代�?
                  />
                  <button
                    onClick={generateCouponCode}
                    className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    ?��?
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">?��??��???/label>
                  <select
                    value={couponForm.type}
                    onChange={(e) => setCouponForm({...couponForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  >
                    {couponTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {couponForm.type === 'percentage' ? '?�扣?��?�?(%)' : '?�扣?��? (NT$)'}
                  </label>
                  <input
                    type="number"
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({...couponForm, value: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">?�低�?費�?�?/label>
                  <input
                    type="number"
                    value={couponForm.minAmount}
                    onChange={(e) => setCouponForm({...couponForm, minAmount: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="0"
                  />
                </div>
                {couponForm.type === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">?�高�????�?/label>
                    <input
                      type="number"
                      value={couponForm.maxDiscount}
                      onChange={(e) => setCouponForm({...couponForm, maxDiscount: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">?��??��??��?</label>
                  <input
                    type="date"
                    value={couponForm.validFrom}
                    onChange={(e) => setCouponForm({...couponForm, validFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">?��?結�??��?</label>
                  <input
                    type="date"
                    value={couponForm.validTo}
                    onChange={(e) => setCouponForm({...couponForm, validTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">?��??��?</label>
                  <input
                    type="number"
                    value={couponForm.totalQuantity}
                    onChange={(e) => setCouponForm({...couponForm, totalQuantity: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">?��?客戶</label>
                  <select
                    value={couponForm.targetCustomers}
                    onChange={(e) => setCouponForm({...couponForm, targetCustomers: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  >
                    {targetCustomerOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={couponForm.isActive}
                    onChange={(e) => setCouponForm({...couponForm, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">立即?�用</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCouponModal(false);
                  setEditMode(false);
                  resetCouponForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ?��?
              </button>
              <button
                onClick={editMode ? handleUpdateCoupon : handleCreateCoupon}
                className="px-4 py-2 bg-[#cc824d] text-white rounded-md hover:bg-[#b8734a]"
              >
                {editMode ? '?�新' : '?�建'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ?�除確�? Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-900">確�??�除</h3>
            </div>
            <p className="text-gray-600 mb-6">
              確�?要刪?�{activeTab === 'promotions' ? '促銷活�?' : '?��???}?�{selectedItem?.name}?��?？此?��??��?復�???
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ?��?
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                ?�除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionSettings;
