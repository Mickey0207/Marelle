import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  CurrencyDollarIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

// 簡化的訂單狀態設定
const OrderStatus = {
  PENDING: 'pending',
  PAYMENT_PENDING: 'payment_pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬載入訂單資料
    setLoading(true);
    setTimeout(() => {
      setOrder({
        id: id,
        orderNumber: `ORD-${id.toString().padStart(6, '0')}`,
        status: OrderStatus.CONFIRMED,
        customer: {
          name: '張小明',
          email: 'zhang@example.com',
          phone: '0912345678'
        },
        totalAmount: 1200,
        items: [
          {
            id: 1,
            name: '商品A',
            quantity: 2,
            price: 600
          }
        ],
        createdAt: new Date().toISOString()
      });
      setLoading(false);
    }, 1000);
  }, [id]);

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
    [OrderStatus.CANCELLED]: { 
      label: '已取消', 
      className: 'bg-red-100 text-red-800',
      icon: XCircleIcon
    }
  };

  const handleDeleteOrder = () => {
    if (window.confirm('確認要刪除這個訂單嗎？此操作無法復原。')) {
      // 模擬刪除操作
      alert('訂單已刪除');
      navigate('/management/orders');
    }
  };

  const handleEditOrder = () => {
    navigate(`/management/orders/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">找不到訂單資料</p>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/management/orders')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">訂單詳情</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEditOrder}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            編輯
          </button>
          <button
            onClick={handleDeleteOrder}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            刪除
          </button>
        </div>
      </div>

      {/* 訂單基本資訊 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            訂單編號：{order.orderNumber}
          </h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.className}`}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {currentStatus.label}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">客戶資訊</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-900">{order.customer.name}</p>
              <p className="text-sm text-gray-600">{order.customer.email}</p>
              <p className="text-sm text-gray-600">{order.customer.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">訂單資訊</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-900">總金額：NT$ {order.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">
                建立時間：{new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 訂單商品 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">訂單商品</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">數量：{item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">NT$ {item.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">小計：NT$ {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;