import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from '../../../components/ui';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 模擬訂單詳細數據
  const order = {
    id: 'ORD-001',
    customer: {
      name: '王小明',
      email: 'wang@example.com',
      phone: '0912-345-678'
    },
    billing: {
      name: '王小明',
      address: '台北市信義區信義路五段7號',
      city: '台北市',
      postal: '110',
      country: '台灣'
    },
    shipping: {
      name: '王小明',
      address: '台北市信義區信義路五段7號',
      city: '台北市',
      postal: '110',
      country: '台灣',
      method: '宅配到府',
      fee: 100
    },
    items: [
      {
        id: 1,
        name: '經典白T恤',
        sku: 'WT-001',
        price: 899,
        quantity: 2,
        total: 1798
      },
      {
        id: 2,
        name: '牛仔褲',
        sku: 'JP-002',
        price: 1399,
        quantity: 1,
        total: 1399
      }
    ],
    subtotal: 3197,
    shippingFee: 100,
    discount: 0,
    tax: 0,
    total: 3297,
    status: 'processing',
    paymentStatus: 'paid',
    shippingStatus: 'preparing',
    paymentMethod: '信用卡',
    createdAt: '2024-01-15 10:30',
    updatedAt: '2024-01-15 11:00',
    notes: '請在工作時間送達，謝謝！'
  };

  const [orderStatus, setOrderStatus] = useState(order.status);
  const [shippingStatus, setShippingStatus] = useState(order.shippingStatus);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      // 這裡應該調用 API 更新訂單狀態
      console.log('更新訂單狀態:', { orderStatus, shippingStatus, notes });
      
      // 模擬 API 請求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('訂單狀態已更新');
    } catch (error) {
      console.error('更新訂單狀態錯誤:', error);
      alert('更新失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, type = 'order') => {
    const statusConfig = {
      order: {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: '待處理' },
        processing: { bg: 'bg-blue-100', text: 'text-blue-600', label: '處理中' },
        completed: { bg: 'bg-green-100', text: 'text-green-600', label: '已完成' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-600', label: '已取消' }
      },
      payment: {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: '待付款' },
        paid: { bg: 'bg-green-100', text: 'text-green-600', label: '已付款' },
        refunded: { bg: 'bg-gray-100', text: 'text-gray-600', label: '已退款' }
      },
      shipping: {
        pending: { bg: 'bg-gray-100', text: 'text-gray-600', label: '待出貨' },
        preparing: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: '準備中' },
        shipped: { bg: 'bg-blue-100', text: 'text-blue-600', label: '已出貨' },
        delivered: { bg: 'bg-green-100', text: 'text-green-600', label: '已送達' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-600', label: '已取消' }
      }
    };

    const config = statusConfig[type][status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
    
    return (
      <span className={`px-3 py-1 text-sm font-medium ${config.bg} ${config.text} rounded-full`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">訂單詳情</h1>
          <p className="text-gray-600 mt-1">訂單編號：{order.id}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/orders')}
        >
          返回列表
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：訂單詳情 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 訂單狀態 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">訂單狀態</h2>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">訂單狀態</p>
                {getStatusBadge(order.status, 'order')}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">付款狀態</p>
                {getStatusBadge(order.paymentStatus, 'payment')}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">出貨狀態</p>
                {getStatusBadge(order.shippingStatus, 'shipping')}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">建立時間</p>
                  <p className="font-medium">{order.createdAt}</p>
                </div>
                <div>
                  <p className="text-gray-600">最後更新</p>
                  <p className="font-medium">{order.updatedAt}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* 商品列表 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">訂單商品</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">📦</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-500">單價: NT$ {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">x {item.quantity}</p>
                    <p className="text-sm text-gray-600">NT$ {item.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 總計 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">商品小計</span>
                  <span>NT$ {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">運費</span>
                  <span>NT$ {order.shippingFee.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>折扣</span>
                    <span>-NT$ {order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span>總計</span>
                  <span>NT$ {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 地址資訊 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">地址資訊</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">帳單地址</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{order.billing.name}</p>
                  <p>{order.billing.address}</p>
                  <p>{order.billing.city} {order.billing.postal}</p>
                  <p>{order.billing.country}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">配送地址</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{order.shipping.name}</p>
                  <p>{order.shipping.address}</p>
                  <p>{order.shipping.city} {order.shipping.postal}</p>
                  <p>{order.shipping.country}</p>
                  <p className="text-blue-600 font-medium">{order.shipping.method}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 右側：客戶資訊和操作 */}
        <div className="space-y-6">
          {/* 客戶資訊 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">客戶資訊</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">姓名</p>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">信箱</p>
                <p className="font-medium">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">電話</p>
                <p className="font-medium">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">付款方式</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
            </div>
          </Card>

          {/* 訂單操作 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">訂單操作</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  訂單狀態
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">待處理</option>
                  <option value="processing">處理中</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出貨狀態
                </label>
                <select
                  value={shippingStatus}
                  onChange={(e) => setShippingStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">待出貨</option>
                  <option value="preparing">準備中</option>
                  <option value="shipped">已出貨</option>
                  <option value="delivered">已送達</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  備註
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="輸入處理備註..."
                />
              </div>

              <Button
                onClick={handleStatusUpdate}
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? '更新中...' : '更新狀態'}
              </Button>
            </div>
          </Card>

          {/* 客戶備註 */}
          {order.notes && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">客戶備註</h2>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {order.notes}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;