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

  // ‰øÉÈä∑Ë°®ÂñÆ?∏Ê?
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

  // ?™Ê??∏Ë°®?ÆÊï∏??
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
    { value: 'discount', label: '?òÊâ£?™Ê?', icon: PercentBadgeIcon },
    { value: 'gift', label: 'ÊªøÈ?Ë¥àÁ¶Æ', icon: GiftIcon },
    { value: 'shipping', label: '?çÈ??™Ê?', icon: TruckIcon },
    { value: 'bundle', label: 'ÁµÑÂ??™Ê?', icon: ShoppingBagIcon }
  ];

  const couponTypes = [
    { value: 'percentage', label: '?æÂ?ÊØîÊ??? },
    { value: 'fixed', label: '?∫Â??ëÈ?' }
  ];

  const targetCustomerOptions = [
    { value: 'all', label: '?Ä?âÂÆ¢?? },
    { value: 'members', label: '?ÉÂì°?êÂ?' },
    { value: 'vip', label: 'VIP ?ÉÂì°' },
    { value: 'new', label: '?∞ÂÆ¢?? }
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
      console.error('ËºâÂÖ•?∏Ê?Â§±Ê?:', error);
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
      console.error('ËºâÂÖ•‰øÉÈä∑?∏Ê?Â§±Ê?:', error);
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
      console.error('?µÂª∫‰øÉÈä∑Â§±Ê?:', error);
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
      console.error('?¥Êñ∞‰øÉÈä∑Â§±Ê?:', error);
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
      console.error('?µÂª∫?™Ê??∏Â§±??', error);
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
      console.error('?¥Êñ∞?™Ê??∏Â§±??', error);
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
      console.error('?™Èô§Â§±Ê?:', error);
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
        {isActive ? '?üÁî®‰∏? : 'Â∑≤Â???}
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
        {/* ?ÅÈù¢Ê®ôÈ? */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">‰øÉÈä∑Ë®≠Â?</h1>
          <p className="text-gray-600">ÁÆ°Á?ÁØÄ?∂‰??∑Ê¥ª?ïÂ??™Ê???/p>
        </div>

        {/* ÁØÄ?∂ÈÅ∏??*/}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">?∏Ê?ÁØÄ??</label>
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

        {/* Ê®ôÁ±§??*/}
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
                  ‰øÉÈä∑Ê¥ªÂ? ({promotions.length})
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
                  ?™Ê???({coupons.length})
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* ?ç‰??âÈ? */}
            <div className="flex justify-end mb-6">
              {activeTab === 'promotions' ? (
                <button
                  onClick={() => setShowPromotionModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b8734a] transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  ?∞Âª∫‰øÉÈä∑
                </button>
              ) : (
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b8734a] transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  ?∞Âª∫?™Ê???
                </button>
              )}
            </div>

            {/* ‰øÉÈä∑Ê¥ªÂ??óË°® */}
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
                                <span>Â∑≤‰Ωø??{promotion.usageCount}/{promotion.usageLimit}</span>
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
                                title="Á∑®ËºØ"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title="?•Á?Ë©≥Ê?"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedItem(promotion);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                title="?™Èô§"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* ‰øÉÈä∑Ë¶èÂ?Ë©≥Ê? */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {promotion.type === 'discount' && (
                              <>
                                <div>
                                  <span className="text-gray-500">?Ä‰ΩéÈ?È°?</span>
                                  <div className="font-medium">NT${promotion.rules.minAmount?.toLocaleString()}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">?òÊâ£??</span>
                                  <div className="font-medium">{promotion.rules.discountRate * 100}%</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">?ÄÈ´òÊ???</span>
                                  <div className="font-medium">NT${promotion.rules.maxDiscount?.toLocaleString()}</div>
                                </div>
                              </>
                            )}
                            {promotion.type === 'gift' && (
                              <>
                                <div>
                                  <span className="text-gray-500">?Ä‰ΩéÈ?È°?</span>
                                  <div className="font-medium">NT${promotion.rules.minAmount?.toLocaleString()}</div>
                                </div>
                                <div className="md:col-span-3">
                                  <span className="text-gray-500">Ë¥àÂ?:</span>
                                  <div className="font-medium">{promotion.rules.giftItems?.join(', ')}</div>
                                </div>
                              </>
                            )}
                            <div>
                              <span className="text-gray-500">‰ΩøÁî®?êÂà∂:</span>
                              <div className="font-medium">{promotion.usageLimit} Ê¨?/div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <GiftIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Â∞öÊú™Âª∫Á?‰ªª‰?‰øÉÈä∑Ê¥ªÂ?</p>
                  </div>
                )}
              </div>
            )}

            {/* ?™Ê??∏Â?Ë°?*/}
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
                              <span>{coupon.type === 'percentage' ? `${coupon.value}% ?òÊâ£` : `NT$${coupon.value} Ê∏õÂ?`}</span>
                              <span>??/span>
                              <span>Â∑≤‰Ωø??{coupon.usedQuantity}/{coupon.totalQuantity}</span>
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
                              title="Á∑®ËºØ"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => navigator.clipboard.writeText(coupon.code)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              title="Ë§áË£Ω‰ª?¢º"
                            >
                              <ClipboardDocumentIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedItem(coupon);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                              title="?™Èô§"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* ?™Ê??∏Ë©≥??*/}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">?Ä‰ΩéÈ?È°?</span>
                            <div className="font-medium">NT${coupon.minAmount?.toLocaleString()}</div>
                          </div>
                          {coupon.type === 'percentage' && (
                            <div>
                              <span className="text-gray-500">?ÄÈ´òÊ???</span>
                              <div className="font-medium">NT${coupon.maxDiscount?.toLocaleString()}</div>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">?ÆÊ?ÂÆ¢Êà∂:</span>
                            <div className="font-medium">
                              {targetCustomerOptions.find(t => t.value === coupon.targetCustomers)?.label}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">?©È??∏È?:</span>
                            <div className="font-medium">{coupon.totalQuantity - coupon.usedQuantity}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <TicketIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Â∞öÊú™Âª∫Á?‰ªª‰??™Ê???/p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ‰øÉÈä∑Ê¥ªÂ? Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editMode ? 'Á∑®ËºØ‰øÉÈä∑Ê¥ªÂ?' : '?∞Âª∫‰øÉÈä∑Ê¥ªÂ?'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">‰øÉÈä∑?çÁ®±</label>
                <input
                  type="text"
                  value={promotionForm.name}
                  onChange={(e) => setPromotionForm({...promotionForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  placeholder="Ëº∏ÂÖ•‰øÉÈä∑?çÁ®±"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">‰øÉÈä∑È°ûÂ?</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">?ãÂ??ÇÈ?</label>
                  <input
                    type="date"
                    value={promotionForm.startTime}
                    onChange={(e) => setPromotionForm({...promotionForm, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ÁµêÊ??ÇÈ?</label>
                  <input
                    type="date"
                    value={promotionForm.endTime}
                    onChange={(e) => setPromotionForm({...promotionForm, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  />
                </div>
              </div>

              {/* ‰øÉÈä∑Ë¶èÂ?Ë®≠Â? */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">‰øÉÈä∑Ë¶èÂ?</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">?Ä‰ΩéÊ?Ë≤ªÈ?È°?/label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">?òÊâ£??(%)</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">?ÄÈ´òÊ????È°?/label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ë¥àÂ??ÖÁõÆ (‰ª•ÈÄóË??ÜÈ?)</label>
                      <input
                        type="text"
                        value={promotionForm.rules.giftItems?.join(', ')}
                        onChange={(e) => setPromotionForm({
                          ...promotionForm,
                          rules: {...promotionForm.rules, giftItems: e.target.value.split(',').map(item => item.trim())}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                        placeholder="Ë¥àÂ?1, Ë¥àÂ?2, Ë¥àÂ?3"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">‰ΩøÁî®Ê¨°Êï∏?êÂà∂</label>
                <input
                  type="number"
                  value={promotionForm.usageLimit}
                  onChange={(e) => setPromotionForm({...promotionForm, usageLimit: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  placeholder="0 Ë°®Á§∫?°È???
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
                  <span className="text-sm font-medium text-gray-700">Á´ãÂç≥?üÁî®</span>
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
                ?ñÊ?
              </button>
              <button
                onClick={editMode ? handleUpdatePromotion : handleCreatePromotion}
                className="px-4 py-2 bg-[#cc824d] text-white rounded-md hover:bg-[#b8734a]"
              >
                {editMode ? '?¥Êñ∞' : '?µÂª∫'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ?™Ê???Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editMode ? 'Á∑®ËºØ?™Ê??? : '?∞Âª∫?™Ê???}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">?™Ê??∏Â?Á®?/label>
                <input
                  type="text"
                  value={couponForm.name}
                  onChange={(e) => setCouponForm({...couponForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  placeholder="Ëº∏ÂÖ•?™Ê??∏Â?Á®?
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">?™Ê??∏‰ª£Á¢?/label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({...couponForm, code: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="Ëº∏ÂÖ•?ñÁ??ê‰ª£Á¢?
                  />
                  <button
                    onClick={generateCouponCode}
                    className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    ?üÊ?
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">?™Ê??∏È???/label>
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
                    {couponForm.type === 'percentage' ? '?òÊâ£?æÂ?ÊØ?(%)' : '?òÊâ£?ëÈ? (NT$)'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">?Ä‰ΩéÊ?Ë≤ªÈ?È°?/label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">?ÄÈ´òÊ????È°?/label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">?âÊ??ãÂ??•Ê?</label>
                  <input
                    type="date"
                    value={couponForm.validFrom}
                    onChange={(e) => setCouponForm({...couponForm, validFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">?âÊ?ÁµêÊ??•Ê?</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">?ºË??∏È?</label>
                  <input
                    type="number"
                    value={couponForm.totalQuantity}
                    onChange={(e) => setCouponForm({...couponForm, totalQuantity: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#cc824d] focus:border-[#cc824d]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">?ÆÊ?ÂÆ¢Êà∂</label>
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
                  <span className="text-sm font-medium text-gray-700">Á´ãÂç≥?üÁî®</span>
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
                ?ñÊ?
              </button>
              <button
                onClick={editMode ? handleUpdateCoupon : handleCreateCoupon}
                className="px-4 py-2 bg-[#cc824d] text-white rounded-md hover:bg-[#b8734a]"
              >
                {editMode ? '?¥Êñ∞' : '?µÂª∫'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ?™Èô§Á¢∫Ë? Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-900">Á¢∫Ë??™Èô§</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Á¢∫Â?Ë¶ÅÂà™?§{activeTab === 'promotions' ? '‰øÉÈä∑Ê¥ªÂ?' : '?™Ê???}?å{selectedItem?.name}?çÂ?ÔºüÊ≠§?ç‰??°Ê?Âæ©Â???
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ?ñÊ?
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                ?™Èô§
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionSettings;
