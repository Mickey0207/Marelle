import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import orderDataManager, { OrderStatus, PaymentStatus } from '../../data/orderDataManager';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  TruckIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const OrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    customerEmail: '',
    customerPhone: '',
    customerType: 'guest',
    items: [],
    shippingAddress: {
      firstName: '',
      lastName: '',
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      phone: ''
    },
    shippingMethod: 'standard',
    shippingCarrier: '',
    paymentMethod: 'credit_card',
    paymentStatus: PaymentStatus.UNPAID,
    status: OrderStatus.PENDING,
    internalNotes: '',
    isGift: false,
    giftMessage: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [availableProducts] = useState([
    // ÁØÑ‰??ÜÂ?Ë≥áÊ? - ?®ÂØ¶?õÊ??®‰∏≠?âÂ??¢Â?ÁÆ°Á?Á≥ªÁµ±?≤Â?
    { id: 1, name: '‰øùÊ?Á≤æËèØ', sku: 'MOIST-001', price: 1200, stock: 50 },
    { id: 2, name: '?óÁö∫?¢È?', sku: 'ANTI-002', price: 1800, stock: 30 },
    { id: 3, name: 'ÁæéÁôΩÁ≤æËèØ', sku: 'WHITE-003', price: 1500, stock: 25 },
    { id: 4, name: '?ºÈÉ®Á≤æËèØ', sku: 'EYE-004', price: 1000, stock: 40 },
    { id: 5, name: 'Ê∏ÖÊ??¢Ë?', sku: 'CLEAN-005', price: 800, stock: 60 },
  ]);

  useEffect(() => {
    if (isEditing) {
      loadOrderData();
    }
  }, [id, isEditing]);

  const loadOrderData = () => {
    setIsLoading(true);
    try {
      const order = orderDataManager.getOrderById(id);
      if (order) {
        setFormData({
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone || '',
          customerType: order.customerType,
          items: order.items,
          shippingAddress: order.shippingAddress,
          shippingMethod: order.shippingMethod || 'standard',
          shippingCarrier: order.shippingCarrier || '',
          paymentMethod: order.paymentMethod || 'credit_card',
          paymentStatus: order.paymentStatus,
          status: order.status,
          internalNotes: order.internalNotes || '',
          isGift: order.isGift || false,
          giftMessage: order.giftMessage || ''
        });
      } else {
        navigate('/admin/orders');
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOrderTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingFee = formData.shippingMethod === 'express' ? 150 : 80;
    return {
      subtotal,
      shippingFee,
      total: subtotal + shippingFee
    };
  };

  const handleAddProduct = (product) => {
    const existingItemIndex = formData.items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Â¶ÇÊ??ÜÂ?Â∑≤Â??®Ô?Â¢ûÂ??∏È?
      const newItems = [...formData.items];
      newItems[existingItemIndex].quantity += 1;
      newItems[existingItemIndex].totalPrice = newItems[existingItemIndex].unitPrice * newItems[existingItemIndex].quantity;
      setFormData(prev => ({ ...prev, items: newItems }));
    } else {
      // Ê∑ªÂ??∞Â???
      const newItem = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        unitPrice: product.price,
        quantity: 1,
        totalPrice: product.price
      };
      setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }
    setShowProductSearch(false);
    setProductSearchTerm('');
  };

  const handleItemQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) return;
    
    const newItems = formData.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: item.unitPrice * newQuantity
        };
      }
      return item;
    });
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleRemoveItem = (itemId) => {
    const newItems = formData.items.filter(item => item.id !== itemId);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const totals = calculateOrderTotal();
      const orderData = {
        ...formData,
        subtotal: totals.subtotal,
        shippingFee: totals.shippingFee,
        totalAmount: totals.total,
        paidAmount: formData.paymentStatus === PaymentStatus.PAID ? totals.total : 0
      };

      let result;
      if (isEditing) {
        result = orderDataManager.updateOrder(parseInt(id), orderData);
      } else {
        result = orderDataManager.createOrder(orderData);
      }

      if (result.success) {
        navigate('/admin/orders');
      } else {
        alert('?ç‰?Â§±Ê?Ôº? + result.error);
      }
    } catch (error) {
      console.error('Error saving order:', error);
      alert('‰øùÂ?Â§±Ê?Ôº? + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">ËºâÂÖ•‰∏?..</div>
        </div>
      </div>
    );
  }

  const totals = calculateOrderTotal();

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* ?ÅÈù¢Ê®ôÈ? */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/admin/orders"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            ËøîÂ?Ë®ÇÂñÆ?óË°®
          </Link>
          <div className="border-l border-gray-300 h-6"></div>
          <h1 className="text-2xl font-bold text-gray-900 font-chinese">
            {isEditing ? 'Á∑®ËºØË®ÇÂñÆ' : '?∞Â?Ë®ÇÂñÆ'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Â∑¶ÂÅ¥Ë°®ÂñÆ */}
          <div className="lg:col-span-2 space-y-6">
            {/* ÂÆ¢Êà∂Ë≥áË? */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                ÂÆ¢Êà∂Ë≥áË?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ?ªÂ??µ‰ª∂ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="customer@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ?ØÁµ°?ªË©±
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="0912-345-678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ÂÆ¢Êà∂È°ûÂ?
                  </label>
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  >
                    <option value="guest">Ë®™ÂÆ¢</option>
                    <option value="member">?ÉÂì°</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ?ÜÂ??ÖÁõÆ */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">?ÜÂ??ÖÁõÆ</h3>
                <button
                  type="button"
                  onClick={() => setShowProductSearch(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Ê∑ªÂ??ÜÂ?</span>
                </button>
              </div>

              {formData.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Â∞öÊú™Ê∑ªÂ?‰ªª‰??ÜÂ?
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-[#fdf8f2]/30 rounded-lg border border-gray-200/30">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.productName}</h4>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-500">?ÆÂÉπ: {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                        />
                        <span className="text-sm text-gray-500">‰ª?/span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(item.totalPrice)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ?ÜÂ??úÂ?Modal */}
              {showProductSearch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 w-full max-w-2xl max-h-96 overflow-hidden border border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">?∏Ê??ÜÂ?</h4>
                      <button
                        type="button"
                        onClick={() => setShowProductSearch(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ??
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleAddProduct(product)}
                          className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-[#fdf8f2]/30 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium text-gray-900">{product.name}</h5>
                              <p className="text-sm text-gray-500">SKU: {product.sku} | Â∫´Â?: {product.stock}</p>
                            </div>
                            <span className="font-medium text-[#cc824d]">{formatCurrency(product.price)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ?∂‰ª∂?∞Â? */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2" />
                ?∂‰ª∂?∞Â?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ÂßìÊ? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.firstName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, firstName: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ?çÂ? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.lastName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, lastName: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ?∞Â? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.addressLine1}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, addressLine1: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ?éÂ? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Á∏?? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.state}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ?µÈ??Ä??<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shippingAddress.postalCode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, postalCode: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ?ØÁµ°?ªË©±
                  </label>
                  <input
                    type="tel"
                    value={formData.shippingAddress.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Á¶ÆÂ??∏È? */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">?πÊ??∏È?</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isGift"
                    checked={formData.isGift}
                    onChange={(e) => setFormData(prev => ({ ...prev, isGift: e.target.checked }))}
                    className="w-4 h-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
                  />
                  <label htmlFor="isGift" className="ml-2 text-sm text-gray-700">
                    ?ôÊòØÁ¶ÆÂ?Ë®ÇÂñÆ
                  </label>
                </div>

                {formData.isGift && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Á¶ÆÂ??ôË?
                    </label>
                    <textarea
                      value={formData.giftMessage}
                      onChange={(e) => setFormData(prev => ({ ...prev, giftMessage: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="Ë´ãËº∏?•Á¶Æ?ÅÁ?Ë®Ä..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ?ßÈÉ®?ôË®ª
                  </label>
                  <textarea
                    value={formData.internalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="?ßÈÉ®?ôË®ªÔºàÂÆ¢?∂Á?‰∏çÂà∞Ôº?.."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ?≥ÂÅ¥Ë≥áË?Ê¨?*/}
          <div className="space-y-6">
            {/* Ë®ÇÂñÆ?òË? */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ë®ÇÂñÆ?òË?</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">?ÜÂ?Â∞èË?</span>
                  <span className="text-gray-900">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">?ãË≤ª</span>
                  <span className="text-gray-900">{formatCurrency(totals.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                  <span className="text-gray-900">Á∏ΩÈ?È°?/span>
                  <span className="text-gray-900">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>

            {/* ?çÈÄÅÈÅ∏??*/}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TruckIcon className="w-5 h-5 mr-2" />
                ?çÈÄÅË®≠ÂÆ?
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ?çÈÄÅÊñπÂº?
                  </label>
                  <select
                    value={formData.shippingMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  >
                    <option value="standard">Ê®ôÊ??çÈÄ?(+$80)</option>
                    <option value="express">Âø´ÈÄüÈ???(+$150)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ?©Ê???
                  </label>
                  <input
                    type="text"
                    value={formData.shippingCarrier}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingCarrier: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="‰æ? ÈªëË?ÂÆÖÊÄ•‰æø"
                  />
                </div>
              </div>
            </div>

            {/* ‰ªòÊ¨æ?áÁ???*/}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCardIcon className="w-5 h-5 mr-2" />
                ‰ªòÊ¨æ?áÁ???
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ‰ªòÊ¨æ?πÂ?
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  >
                    <option value="credit_card">‰ø°Áî®??/option>
                    <option value="bank_transfer">?ÄË°åË?Â∏?/option>
                    <option value="cod">Ë≤®Âà∞‰ªòÊ¨æ</option>
                    <option value="line_pay">Line Pay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ‰ªòÊ¨æ?Ä??
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  >
                    <option value={PaymentStatus.UNPAID}>?™‰?Ê¨?/option>
                    <option value={PaymentStatus.PAID}>Â∑≤‰?Ê¨?/option>
                    <option value={PaymentStatus.CONFIRMED}>Â∑≤Á¢∫Ë™?/option>
                    <option value={PaymentStatus.FAILED}>Â§±Ê?</option>
                    <option value={PaymentStatus.REFUNDED}>Â∑≤ÈÄÄÊ¨?/option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ë®ÇÂñÆ?Ä??
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                  >
                    <option value={OrderStatus.PENDING}>ÂæÖË???/option>
                    <option value={OrderStatus.PAYMENT_PENDING}>ÂæÖ‰?Ê¨?/option>
                    <option value={OrderStatus.CONFIRMED}>Â∑≤Á¢∫Ë™?/option>
                    <option value={OrderStatus.PROCESSING}>?ïÁ?‰∏?/option>
                    <option value={OrderStatus.SHIPPED}>Â∑≤Âá∫Ë≤?/option>
                    <option value={OrderStatus.DELIVERED}>Â∑≤ÈÄÅÈ?</option>
                    <option value={OrderStatus.COMPLETED}>Â∑≤Â???/option>
                    <option value={OrderStatus.CANCELLED}>Â∑≤Â?Ê∂?/option>
                  </select>
                </div>
              </div>
            </div>

            {/* ?ç‰??âÈ? */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || formData.items.length === 0}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <CheckIcon className="w-5 h-5" />
                  <span>{isLoading ? '‰øùÂ?‰∏?..' : (isEditing ? '?¥Êñ∞Ë®ÇÂñÆ' : 'Âª∫Á?Ë®ÇÂñÆ')}</span>
                </button>

                <Link
                  to="/admin/orders"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-[#fdf8f2]/30 transition-colors"
                >
                  <span>?ñÊ?</span>
                </Link>
              </div>
              
              {formData.items.length === 0 && (
                <p className="text-sm text-red-600 mt-2 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  Ë´ãËá≥Â∞ëÊ∑ª?†‰??ãÂ???
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
