import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../../components/ui';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewProduct = id === 'new';

  const [formData, setFormData] = useState({
    name: isNewProduct ? '' : '經典白T恤',
    sku: isNewProduct ? '' : 'WT-001',
    category: isNewProduct ? '' : '上衣',
    price: isNewProduct ? '' : '899',
    stock: isNewProduct ? '' : '156',
    description: isNewProduct ? '' : '舒適的純棉白色T恤，適合日常穿著。',
    status: isNewProduct ? 'active' : 'active'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除該欄位的錯誤
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '請輸入商品名稱';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = '請輸入 SKU';
    }

    if (!formData.category.trim()) {
      newErrors.category = '請選擇分類';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = '請輸入有效的價格';
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = '請輸入有效的庫存數量';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // 這裡應該調用 API 保存商品數據
      console.log('保存商品數據:', formData);
      
      // 模擬 API 請求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存成功後導向商品列表
      navigate('/products');
    } catch (error) {
      console.error('保存商品錯誤:', error);
      setErrors({ general: '保存商品時發生錯誤，請稍後再試' });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    '上衣',
    '褲子',
    '外套',
    '鞋子',
    '配件',
    '其他'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNewProduct ? '新增商品' : '編輯商品'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isNewProduct ? '填寫商品詳細資訊' : '修改商品資訊'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/products')}
        >
          返回列表
        </Button>
      </div>

      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 基本資訊 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本資訊</h2>
            <div className="space-y-4">
              <Input
                label="商品名稱"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                placeholder="請輸入商品名稱"
              />

              <Input
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                error={errors.sku}
                required
                placeholder="請輸入商品 SKU"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分類 *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">請選擇分類</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品描述
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="請輸入商品描述"
                />
              </div>
            </div>
          </Card>

          {/* 價格和庫存 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">價格和庫存</h2>
            <div className="space-y-4">
              <Input
                label="售價 (NT$)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                required
                placeholder="請輸入售價"
                min="0"
                step="1"
              />

              <Input
                label="庫存數量"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                error={errors.stock}
                required
                placeholder="請輸入庫存數量"
                min="0"
                step="1"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  狀態
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">正常</option>
                  <option value="inactive">停用</option>
                  <option value="out_of_stock">缺貨</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* 商品圖片 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">商品圖片</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-2">點擊上傳或拖拽圖片到此處</p>
            <p className="text-xs text-gray-500">支援 JPG、PNG 格式，檔案大小不超過 5MB</p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => document.querySelector('input[type="file"]').click()}
            >
              選擇圖片
            </Button>
          </div>
        </Card>

        {/* 操作按鈕 */}
        <Card className="p-6">
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/products')}
            >
              取消
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? '保存中...' : (isNewProduct ? '新增商品' : '更新商品')}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ProductDetail;