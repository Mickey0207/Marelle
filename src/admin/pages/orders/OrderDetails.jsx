import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import orderDataManager, { 
  OrderStatus, 
  PaymentStatus 
} from '../../data/orderDataManager';
import GlassModal from '../../../components/GlassModal';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  GiftIcon,
  UserIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  TagIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = () => {
    setLoading(true);
    try {
      const orderData = orderDataManager.getOrderById(id);
      if (orderData) {
        setOrder(orderData);
        const history = orderDataManager.getOrderStatusHistory(id);
        setStatusHistory(history);
      } else {
        navigate('/admin/orders');
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = () => {
    if (!newStatus || !statusReason.trim()) {
      alert('請選擇新狀態並填寫變更原因');
      return;
    }

    const result = orderDataManager.updateOrderStatus(
      parseInt(id),
      newStatus,
      statusReason,
      null, // changedBy - 在實際應用中應該是當前用戶ID
      true // notifyCustomer
    );

    if (result.success) {
      setShowStatusModal(false);
      setNewStatus('');
      setStatusReason('');
      loadOrderDetails();
    } else {
      alert('狀態更新失敗：' + result.error);
    }
  };

  const handleDeleteOrder = () => {
    if (window.confirm('確定要刪除這個訂單嗎？此操作無法復原。')) {
      const result = orderDataManager.deleteOrder(id);
      if (result.success) {
        navigate('/admin/orders');
      } else {
        alert('刪除失敗：' + result.error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [OrderStatus.PENDING]: { 
        label: '待處理', 
        className: 'bg-gray-100 text-gray-800',
        icon: ClockIcon
      },
      [OrderStatus.PAYMENT_PENDING]: { 
        label: '待付款', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: CurrencyDollarIcon
      },
      [OrderStatus.CONFIRMED]: { 
        label: '已確認', 
        className: 'bg-blue-100 text-blue-800',
        icon: CheckCircleIcon
      },
      [OrderStatus.PROCESSING]: { 
        label: '處理中', 
        className: 'bg-purple-100 text-purple-800',
        icon: ClockIcon
      },
      [OrderStatus.SHIPPED]: { 
        label: '已出貨', 
        className: 'bg-indigo-100 text-indigo-800',
        icon: TruckIcon
      },
      [OrderStatus.DELIVERED]: { 
        label: '已送達', 
        className: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      },
      [OrderStatus.COMPLETED]: { 
        label: '已完成', 
        className: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      },
      [OrderStatus.CANCELLED]: { 
        label: '已取消', 
        className: 'bg-red-100 text-red-800',
        icon: ExclamationTriangleIcon
      }
    };

    const config = statusConfig[status] || { 
      label: status, 
      className: 'bg-gray-100 text-gray-800',
      icon: ClockIcon
    };
    
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        <IconComponent className="w-4 h-4 mr-2" />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      [PaymentStatus.UNPAID]: { label: '未付款', className: 'bg-red-100 text-red-800' },
      [PaymentStatus.PAID]: { label: '已付款', className: 'bg-green-100 text-green-800' },
      [PaymentStatus.CONFIRMED]: { label: '已確認', className: 'bg-green-100 text-green-800' },
      [PaymentStatus.FAILED]: { label: '失敗', className: 'bg-red-100 text-red-800' },
      [PaymentStatus.REFUNDED]: { label: '已退款', className: 'bg-orange-100 text-orange-800' }
    };

    const config = statusConfig[status] || { 
      label: status, 
      className: 'bg-gray-100 text-gray-800' 
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusOptions = () => {
    // 根據當前狀態提供可選的下一個狀態
    const currentStatus = order?.status;
    const allStatuses = [
      { value: OrderStatus.PENDING, label: '待處理' },
      { value: OrderStatus.PAYMENT_PENDING, label: '待付款' },
      { value: OrderStatus.CONFIRMED, label: '已確認' },
      { value: OrderStatus.PROCESSING, label: '處理中' },
      { value: OrderStatus.SHIPPED, label: '已出貨' },
      { value: OrderStatus.DELIVERED, label: '已送達' },
      { value: OrderStatus.COMPLETED, label: '已完成' },
      { value: OrderStatus.CANCELLED, label: '已取消' }
    ];

    return allStatuses.filter(status => status.value !== currentStatus);
  };

  if (loading) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="text-center py-12">
          <div className="text-lg text-gray-600">載入訂單詳情中...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#fdf8f2] min-h-screen p-6">
        <div className="text-center py-12">
          <div className="text-lg text-red-600">訂單不存在</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      {/* 頁面標題 */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/admin/orders"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            返回訂單列表
          </Link>
          <div className="border-l border-gray-300 h-6"></div>
          <h1 className="text-2xl font-bold text-gray-900 font-chinese">
            訂單詳情 - {order.orderNumber}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {getStatusBadge(order.status)}
            {getPaymentStatusBadge(order.paymentStatus)}
            {order.isGift && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                <GiftIcon className="w-4 h-4 mr-2" />
                禮品訂單
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowStatusModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              <span>更新狀態</span>
            </button>
            <Link
              to={`/admin/orders/${order.id}/edit`}
              className="flex items-center space-x-2 px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              <span>編輯訂單</span>
            </Link>
            <button
              onClick={handleDeleteOrder}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              <span>刪除</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側主要內容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 商品明細 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">商品明細</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-[#fdf8f2]/30 rounded-lg border border-gray-200/30">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    {item.variantName && (
                      <p className="text-sm text-gray-500">規格: {item.variantName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.unitPrice)} × {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      小計: {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 訂單金額摘要 */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">商品小計</span>
                  <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.shippingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">運費</span>
                    <span className="text-gray-900">{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">折扣</span>
                    <span className="text-green-600">-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                {order.couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">優惠券折扣</span>
                    <span className="text-green-600">-{formatCurrency(order.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span className="text-gray-900">總金額</span>
                  <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 狀態時間軸 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">狀態歷史</h3>
            <div className="space-y-4">
              {statusHistory.map((history, index) => (
                <div key={history.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <ClockIcon className={`w-5 h-5 ${
                        index === 0 ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {history.fromStatus && (
                        <>
                          <span className="text-sm text-gray-500">{history.fromStatus}</span>
                          <span className="text-gray-400">→</span>
                        </>
                      )}
                      <span className="text-sm font-medium text-gray-900">{history.toStatus}</span>
                    </div>
                    {history.reason && (
                      <p className="text-sm text-gray-600 mt-1">{history.reason}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(history.createdAt)}
                      {history.automated && ' (自動)'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右側資訊欄 */}
        <div className="space-y-6">
          {/* 客戶資訊 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              客戶資訊
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">{order.customerEmail}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{order.customerPhone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <TagIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {order.customerType === 'member' ? '會員' : '訪客'}
                </span>
              </div>
            </div>
          </div>

          {/* 收件資訊 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2" />
              收件資訊
            </h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.addressLine1}
              </p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.city} {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              {order.shippingAddress.phone && (
                <p className="text-sm text-gray-600">
                  電話: {order.shippingAddress.phone}
                </p>
              )}
            </div>
          </div>

          {/* 付款資訊 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCardIcon className="w-5 h-5 mr-2" />
              付款資訊
            </h3>
            <div className="space-y-3">
              {order.paymentMethod && (
                <div>
                  <span className="text-sm text-gray-600">付款方式: </span>
                  <span className="text-sm text-gray-900">{order.paymentMethod}</span>
                </div>
              )}
              {order.paymentGateway && (
                <div>
                  <span className="text-sm text-gray-600">付款閘道: </span>
                  <span className="text-sm text-gray-900">{order.paymentGateway}</span>
                </div>
              )}
              {order.paymentReference && (
                <div>
                  <span className="text-sm text-gray-600">付款參考號: </span>
                  <span className="text-sm text-gray-900 font-mono">{order.paymentReference}</span>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">已付金額: </span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(order.paidAmount)}</span>
              </div>
              {order.paymentDate && (
                <div>
                  <span className="text-sm text-gray-600">付款時間: </span>
                  <span className="text-sm text-gray-900">{formatDate(order.paymentDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 物流資訊 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TruckIcon className="w-5 h-5 mr-2" />
              物流資訊
            </h3>
            <div className="space-y-3">
              {order.shippingMethod && (
                <div>
                  <span className="text-sm text-gray-600">配送方式: </span>
                  <span className="text-sm text-gray-900">{order.shippingMethod}</span>
                </div>
              )}
              {order.shippingCarrier && (
                <div>
                  <span className="text-sm text-gray-600">物流商: </span>
                  <span className="text-sm text-gray-900">{order.shippingCarrier}</span>
                </div>
              )}
              {order.trackingNumber && (
                <div>
                  <span className="text-sm text-gray-600">追蹤號碼: </span>
                  <span className="text-sm text-gray-900 font-mono">{order.trackingNumber}</span>
                </div>
              )}
              {order.shippedAt && (
                <div>
                  <span className="text-sm text-gray-600">出貨時間: </span>
                  <span className="text-sm text-gray-900">{formatDate(order.shippedAt)}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div>
                  <span className="text-sm text-gray-600">送達時間: </span>
                  <span className="text-sm text-gray-900">{formatDate(order.deliveredAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 訂單資訊 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              訂單資訊
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">建立時間: </span>
                <span className="text-sm text-gray-900">{formatDate(order.createdAt)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">訂單來源: </span>
                <span className="text-sm text-gray-900">{order.source}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">銷售渠道: </span>
                <span className="text-sm text-gray-900">{order.channel}</span>
              </div>
              {order.internalNotes && (
                <div>
                  <span className="text-sm text-gray-600">內部備註: </span>
                  <p className="text-sm text-gray-900 mt-1">{order.internalNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 狀態更新Modal */}
      <GlassModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="更新訂單狀態"
        size="max-w-md"
      >
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目前狀態
              </label>
              <div className="p-3 bg-[#fdf8f2]/30 rounded-lg border border-gray-200/30">
                {getStatusBadge(order.status)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                新狀態 <span className="text-red-500">*</span>
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
              >
                <option value="">請選擇狀態</option>
                {getStatusOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                變更原因 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                placeholder="請輸入狀態變更的原因..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-[#fdf8f2]/30 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors"
            >
              確認更新
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};

export default OrderDetails;