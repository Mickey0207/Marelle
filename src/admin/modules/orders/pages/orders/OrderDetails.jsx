import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // 模擬載入訂單詳情
    setOrder({
      id: id,
      orderNumber: `ORD-${id}`,
      customer: '張三',
      status: '已完成',
      total: 1299,
      items: [
        { name: '經典白色T恤', quantity: 2, price: 399 },
        { name: '牛仔褲', quantity: 1, price: 899 }
      ]
    });
  }, [id]);

  if (!order) {
    return <div className="p-6">載入中...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">訂單詳情 #{order.orderNumber}</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">客戶姓名</label>
            <p className="mt-1 text-sm text-gray-900">{order.customer}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">訂單狀態</label>
            <p className="mt-1 text-sm text-gray-900">{order.status}</p>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-4">訂單商品</h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-500 ml-2">x{item.quantity}</span>
              </div>
              <span className="font-medium">${item.price}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">總計</span>
            <span className="text-xl font-bold text-green-600">${order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;