import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { mockProducts } from '../../utils/data';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    inStock: true,
    featured: false,
    tags: [],
    specifications: {
      material: '',
      dimensions: '',
      weight: '',
      color: '',
      origin: ''
    }
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // 載入產品資料
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
        inStock: product.inStock,
        featured: product.featured,
        tags: product.tags || [],
        specifications: product.specifications || {
          material: '',
          dimensions: '',
          weight: '',
          color: '',
          origin: ''
        }
      });

      // 設置圖片
      if (product.image) {
        setImages([{
          id: 1,
          url: product.image,
          name: 'product-image.jpg'
        }]);
      }
    }

    // 頁面載入動畫
    gsap.fromTo(
      '.edit-product-content',
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
  }, [id]);

  const categories = [
    { value: '配件', label: '配件' },
    { value: '家居', label: '家居' },
    { value: '香氛', label: '香氛' },
    { value: '服飾', label: '服飾' },
    { value: '茶品', label: '茶品' },
    { value: '生活用品', label: '生活用品' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除該欄位的錯誤
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSpecificationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: event.target.result,
            file: file,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '商品名稱為必填項目';
    }

    if (!formData.description.trim()) {
      newErrors.description = '商品描述為必填項目';
    }

    if (!formData.category) {
      newErrors.category = '請選擇商品分類';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = '請輸入有效的商品價格';
    }

    if (formData.originalPrice && parseFloat(formData.originalPrice) <= parseFloat(formData.price)) {
      newErrors.originalPrice = '原價必須大於售價';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 這裡會調用實際的API來更新商品
      const productData = {
        ...formData,
        images: images.map(img => img.url),
        id: parseInt(id),
        updatedAt: new Date().toISOString()
      };

      console.log('更新商品資料:', productData);

      // 成功後導航回商品列表
      navigate('/admin/products', {
        state: { message: '商品更新成功！' }
      });

    } catch (error) {
      console.error('更新商品失敗:', error);
      setErrors({ submit: '更新商品失敗，請稍後再試' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-product-content space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-400 hover:text-[#cc824d] rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-chinese">編輯商品</h1>
            <p className="text-gray-600 mt-1 font-chinese">修改商品資訊</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側 - 基本資訊 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本資訊卡片 */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 font-chinese">基本資訊</h2>
            
            <div className="space-y-4">
              {/* 商品名稱 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  商品名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="請輸入商品名稱"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 font-chinese">{errors.name}</p>
                )}
              </div>

              {/* 商品描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  商品描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="請輸入商品描述"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 font-chinese">{errors.description}</p>
                )}
              </div>

              {/* 分類和價格 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    商品分類 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">請選擇分類</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 font-chinese">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    售價 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 font-chinese">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    原價
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese ${
                      errors.originalPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  {errors.originalPrice && (
                    <p className="mt-1 text-sm text-red-600 font-chinese">{errors.originalPrice}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 商品規格 */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 font-chinese">商品規格</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">材質</label>
                <input
                  type="text"
                  value={formData.specifications.material}
                  onChange={(e) => handleSpecificationChange('material', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese"
                  placeholder="例如：100% 純棉"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">尺寸</label>
                <input
                  type="text"
                  value={formData.specifications.dimensions}
                  onChange={(e) => handleSpecificationChange('dimensions', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese"
                  placeholder="例如：長 x 寬 x 高"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">重量</label>
                <input
                  type="text"
                  value={formData.specifications.weight}
                  onChange={(e) => handleSpecificationChange('weight', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese"
                  placeholder="例如：500g"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">顏色</label>
                <input
                  type="text"
                  value={formData.specifications.color}
                  onChange={(e) => handleSpecificationChange('color', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese"
                  placeholder="例如：米白色"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">產地</label>
                <input
                  type="text"
                  value={formData.specifications.origin}
                  onChange={(e) => handleSpecificationChange('origin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese"
                  placeholder="例如：台灣製造"
                />
              </div>
            </div>
          </div>

          {/* 標籤 */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 font-chinese">商品標籤</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese"
                  placeholder="輸入標籤名稱"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors font-chinese"
                >
                  新增
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#cc824d] text-white font-chinese"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-gray-200"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右側 - 圖片和設定 */}
        <div className="space-y-6">
          {/* 商品圖片 */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 font-chinese">商品圖片</h2>
            
            <div className="space-y-4">
              {/* 上傳區域 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#cc824d] transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 font-chinese mb-2">點擊或拖拽圖片到此處</p>
                  <p className="text-xs text-gray-500 font-chinese">支援 JPG、PNG 格式</p>
                </label>
              </div>

              {/* 圖片預覽 */}
              {images.length > 0 && (
                <div className="space-y-3">
                  {images.map((image) => (
                    <div key={image.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate font-chinese">
                          {image.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 商品設定 */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 font-chinese">商品設定</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 font-chinese">庫存狀態</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => handleInputChange('inStock', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#cc824d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cc824d]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 font-chinese">推薦商品</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#cc824d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cc824d]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-chinese font-semibold flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  更新中...
                </>
              ) : (
                <>
                  <PencilIcon className="w-5 h-5 mr-2" />
                  更新商品
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-chinese"
            >
              取消
            </button>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-600 font-chinese">{errors.submit}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProduct;