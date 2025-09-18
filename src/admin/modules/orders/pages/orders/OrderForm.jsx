import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: '',
    email: '',
    phone: '',
    address: '',
    items: [{ product: '', quantity: 1, price: 0 }]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 處理表單提交
    console.log('訂單數據:', formData);
    // 跳轉回訂單列表
    navigate('/admin/orders');
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1, price: 0 }]
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">新增訂單</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              客戶姓名
            </label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => setFormData({...formData, customer: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電子郵件
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電話號碼
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              配送地址
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">訂單商品</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-3">
              <input
                type="text"
                placeholder="商品名稱"
                value={item.product}
                onChange={(e) => {
                  const newItems = [...formData.items];
                  newItems[index].product = e.target.value;
                  setFormData({...formData, items: newItems});
                }}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="數量"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const newItems = [...formData.items];
                  newItems[index].quantity = parseInt(e.target.value);
                  setFormData({...formData, items: newItems});
                }}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="單價"
                min="0"
                step="0.01"
                value={item.price}
                onChange={(e) => {
                  const newItems = [...formData.items];
                  newItems[index].price = parseFloat(e.target.value);
                  setFormData({...formData, items: newItems});
                }}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  const newItems = formData.items.filter((_, i) => i !== index);
                  setFormData({...formData, items: newItems});
                }}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={formData.items.length === 1}
              >
                刪除
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            新增商品
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/orders')}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            創建訂單
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;