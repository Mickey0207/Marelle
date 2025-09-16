import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  DocumentTextIcon,
  CogIcon,
  GlobeAltIcon,
  TagIcon,
  CurrencyDollarIcon,
  CheckIcon,
  QrCodeIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import ProductVariantManager from '../components/ProductVariantManager';
import ProductSKUManager from '../components/ProductSKUManager';
import NestedVariantManager from '../components/NestedVariantManager';
import QRCodeGenerator from '../components/QRCodeGenerator';
import CategoryManager from '../components/CategoryManager';
import ProductStatusManager from '../components/ProductStatusManager';

const AddProductAdvanced = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [currentTab, setCurrentTab] = useState('basic');
  
  // 基本商品資訊
  const [formData, setFormData] = useState({
    // 基本資訊
    skuPrefix: '',
    name: { 'zh-TW': '', 'en': '' },
    description: { 'zh-TW': '', 'en': '' },
    shortDescription: { 'zh-TW': '', 'en': '' },
    category: '',
    categoryIds: [], // 支援多分類
    tags: [],
    
    // 價格設定
    baseCostPrice: '',
    baseOriginalPrice: '',
    baseSalePrice: '',
    baseBronzePrice: '',
    baseSilverPrice: '',
    baseGoldPrice: '',
    
    // SEO 設定
    metaTitle: { 'zh-TW': '', 'en': '' },
    metaDescription: { 'zh-TW': '', 'en': '' },
    urlSlug: { 'zh-TW': '', 'en': '' },
    
    // 商品狀態
    status: 'draft',
    publishDate: null,
    inStock: true,
    featured: false,
    sortWeight: 0,
    
    // 規格資訊
    specifications: {
      material: '',
      dimensions: '',
      weight: '',
      color: '',
      origin: ''
    }
  });

  // 變體和SKU管理
  const [variants, setVariants] = useState([]);
  const [skus, setSKUs] = useState([]);
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [language, setLanguage] = useState('zh-TW'); // 預設為繁體中文

  // 分頁狀態
  const tabs = [
    { id: 'basic', name: '基本資訊', icon: DocumentTextIcon },
    { id: 'categories', name: '分類管理', icon: FolderIcon },
    { id: 'variants', name: '變體管理', icon: CogIcon },
    { id: 'pricing', name: '價格設定', icon: CurrencyDollarIcon },
    { id: 'status', name: '狀態管理', icon: CheckIcon },
    { id: 'qr', name: 'QR Code', icon: QrCodeIcon },
    { id: 'seo', name: 'SEO設定', icon: GlobeAltIcon }
  ];

  useEffect(() => {
    // 頁面載入動畫
    gsap.fromTo(
      '.add-product-content',
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
  }, []);

  const categories = [
    { value: '配件', label: '配件' },
    { value: '家居', label: '家居' },
    { value: '香氛', label: '香氛' },
    { value: '服飾', label: '服飾' },
    { value: '茶品', label: '茶品' },
    { value: '生活用品', label: '生活用品' }
  ];

  const handleInputChange = (field, value, language = null) => {
    setFormData(prev => {
      if (language) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [language]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    
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

  // 自動生成URL Slug
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[\u4e00-\u9fff]/g, (char) => encodeURIComponent(char)) // 中文字符編碼
      .replace(/[^a-z0-9%]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // 當商品名稱改變時自動生成URL Slug
  useEffect(() => {
    if (formData.name['zh-TW'] && !formData.urlSlug['zh-TW']) {
      handleInputChange('urlSlug', generateSlug(formData.name['zh-TW']), 'zh-TW');
    }
    if (formData.name['en'] && !formData.urlSlug['en']) {
      handleInputChange('urlSlug', generateSlug(formData.name['en']), 'en');
    }
  }, [formData.name]);

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

    // 基本資訊驗證
    if (!formData.name['zh-TW']?.trim()) {
      newErrors.nameZh = '商品名稱(中文)為必填項目';
    }

    if (!formData.name['en']?.trim()) {
      newErrors.nameEn = '商品名稱(英文)為必填項目';
    }

    if (!formData.description['zh-TW']?.trim()) {
      newErrors.descriptionZh = '商品描述(中文)為必填項目';
    }

    if (!formData.description['en']?.trim()) {
      newErrors.descriptionEn = '商品描述(英文)為必填項目';
    }

    if (!formData.category) {
      newErrors.category = '請選擇商品分類';
    }

    if (!formData.skuPrefix?.trim()) {
      newErrors.skuPrefix = 'SKU前綴為必填項目';
    }

    if (!formData.baseOriginalPrice || parseFloat(formData.baseOriginalPrice) <= 0) {
      newErrors.baseOriginalPrice = '請輸入有效的基礎原價';
    }

    // SEO 驗證
    if (!formData.urlSlug['zh-TW']?.trim()) {
      newErrors.urlSlugZh = 'URL別名(中文)為必填項目';
    }

    if (!formData.urlSlug['en']?.trim()) {
      newErrors.urlSlugEn = 'URL別名(英文)為必填項目';
    }

    if (images.length === 0) {
      newErrors.images = '請至少上傳一張商品圖片';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('請修正表單錯誤後再提交');
      return;
    }

    setLoading(true);

    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const productData = {
        ...formData,
        images: images.map(img => img.url),
        variants,
        skus,
        createdAt: new Date().toISOString()
      };

      console.log('商品資料:', productData);

      // 成功後導航回商品列表
      navigate('/admin/products', {
        state: { message: '商品創建成功！' }
      });

    } catch (error) {
      console.error('創建商品失敗:', error);
      setErrors({ submit: '創建商品失敗，請稍後再試' });
    } finally {
      setLoading(false);
    }
  };

  // 變體更新時重新生成SKU
  const handleVariantUpdate = (updatedVariants) => {
    setVariants(updatedVariants);
    // 可以選擇自動重新生成SKU或提示用戶
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            {/* SKU前綴 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                SKU前綴 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.skuPrefix}
                onChange={(e) => handleInputChange('skuPrefix', e.target.value.toUpperCase())}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors ${
                  errors.skuPrefix ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例如：WHT"
                maxLength="10"
              />
              {errors.skuPrefix && (
                <p className="mt-1 text-sm text-red-600 font-chinese">{errors.skuPrefix}</p>
              )}
            </div>

            {/* 商品名稱 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  商品名稱 (中文) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name['zh-TW']}
                  onChange={(e) => handleInputChange('name', e.target.value, 'zh-TW')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese ${
                    errors.nameZh ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="請輸入商品名稱"
                />
                {errors.nameZh && (
                  <p className="mt-1 text-sm text-red-600 font-chinese">{errors.nameZh}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  商品名稱 (英文) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name['en']}
                  onChange={(e) => handleInputChange('name', e.target.value, 'en')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors ${
                    errors.nameEn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.nameEn && (
                  <p className="mt-1 text-sm text-red-600 font-chinese">{errors.nameEn}</p>
                )}
              </div>
            </div>

            {/* 商品描述 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  商品描述 (中文) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description['zh-TW']}
                  onChange={(e) => handleInputChange('description', e.target.value, 'zh-TW')}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese resize-none ${
                    errors.descriptionZh ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="請輸入商品描述"
                />
                {errors.descriptionZh && (
                  <p className="mt-1 text-sm text-red-600 font-chinese">{errors.descriptionZh}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  商品描述 (英文) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description['en']}
                  onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors resize-none ${
                    errors.descriptionEn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product description"
                />
                {errors.descriptionEn && (
                  <p className="mt-1 text-sm text-red-600 font-chinese">{errors.descriptionEn}</p>
                )}
              </div>
            </div>

            {/* 分類 */}
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

            {/* 商品圖片 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                商品圖片 <span className="text-red-500">*</span>
              </label>
              
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
                  <p className="text-xs text-gray-500 font-chinese">支援 JPG、PNG 格式，建議 4:3 比例</p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded font-chinese">
                          主圖
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {errors.images && (
                <p className="mt-1 text-sm text-red-600 font-chinese">{errors.images}</p>
              )}
            </div>

            {/* 標籤 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">商品標籤</label>
              
              <div className="flex gap-2 mb-2">
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
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">商品分類管理</h3>
            <CategoryManager
              selectedCategories={formData.categoryIds}
              onCategoriesChange={(categoryIds) => setFormData(prev => ({ ...prev, categoryIds }))}
              language={language}
            />
          </div>
        );

      case 'variants':
        return (
          <NestedVariantManager 
            variants={variants}
            setVariants={setVariants}
            skuPrefix={formData.skuPrefix}
            basePrice={{
              costPrice: formData.baseCostPrice,
              originalPrice: formData.baseOriginalPrice,
              salePrice: formData.baseSalePrice,
              bronzePrice: formData.baseBronzePrice,
              silverPrice: formData.baseSilverPrice,
              goldPrice: formData.baseGoldPrice
            }}
          />
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">價格設定</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  基礎成本價
                </label>
                <input
                  type="number"
                  value={formData.baseCostPrice}
                  onChange={(e) => handleInputChange('baseCostPrice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  基礎原價 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.baseOriginalPrice}
                  onChange={(e) => handleInputChange('baseOriginalPrice', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors ${
                    errors.baseOriginalPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                {errors.baseOriginalPrice && (
                  <p className="mt-1 text-sm text-red-600 font-chinese">{errors.baseOriginalPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  基礎優惠價
                </label>
                <input
                  type="number"
                  value={formData.baseSalePrice}
                  onChange={(e) => handleInputChange('baseSalePrice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  銅牌會員價
                </label>
                <input
                  type="number"
                  value={formData.baseBronzePrice}
                  onChange={(e) => handleInputChange('baseBronzePrice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  銀牌會員價
                </label>
                <input
                  type="number"
                  value={formData.baseSilverPrice}
                  onChange={(e) => handleInputChange('baseSilverPrice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  黃金會員價
                </label>
                <input
                  type="number"
                  value={formData.baseGoldPrice}
                  onChange={(e) => handleInputChange('baseGoldPrice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-chinese">
                💡 提示：這些是基礎價格，在「變體管理」分頁中，每個SKU都可以基於這些價格進行個別微調。
              </p>
            </div>
          </div>
        );

      case 'status':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">商品狀態管理</h3>
            <ProductStatusManager
              initialStatus={formData.status}
              onStatusChange={(newStatus, historyEntry) => {
                setFormData(prev => ({ ...prev, status: newStatus }));
                console.log('狀態變更:', newStatus, historyEntry);
              }}
              stockLevel={50} // 模擬庫存數量，實際應該從SKU總和計算
              publishDate={formData.publishDate}
              language={language}
            />
          </div>
        );

      case 'qr':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">QR Code 管理</h3>
            
            <QRCodeGenerator 
              product={formData}
              onGenerated={(qrResult) => {
                console.log('QR Code生成完成:', qrResult);
                // 可以將QR Code結果保存到商品資料中
              }}
            />

            {/* 如果有SKU，顯示SKU專屬QR Code */}
            {skus.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 font-chinese">SKU專屬 QR Code</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skus.slice(0, 4).map(sku => (
                    <div key={sku.id} className="p-4 border rounded-lg">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        SKU: {sku.sku}
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        {sku.variantPath.map(v => 
                          `${v.levelName['zh-TW']}: ${v.optionName['zh-TW']}`
                        ).join(' / ')}
                      </div>
                      <QRCodeGenerator 
                        product={formData}
                        sku={sku}
                        onGenerated={(qrResult) => {
                          console.log(`SKU ${sku.sku} QR Code生成完成:`, qrResult);
                        }}
                      />
                    </div>
                  ))}
                </div>
                {skus.length > 4 && (
                  <p className="text-sm text-gray-600 font-chinese">
                    還有 {skus.length - 4} 個SKU，請在SKU管理頁面中生成對應的QR Code
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">SEO 設定</h3>
            
            {/* URL Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  URL別名 (中文) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.urlSlug['zh-TW']}
                  onChange={(e) => handleInputChange('urlSlug', e.target.value, 'zh-TW')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese ${
                    errors.urlSlugZh ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="例如：beautiful-whitening-serum"
                />
                {errors.urlSlugZh && (
                  <p className="mt-1 text-sm text-red-600 font-chinese">{errors.urlSlugZh}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  URL別名 (英文) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.urlSlug['en']}
                  onChange={(e) => handleInputChange('urlSlug', e.target.value, 'en')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors ${
                    errors.urlSlugEn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="beautiful-whitening-serum"
                />
                {errors.urlSlugEn && (
                  <p className="mt-1 text-sm text-red-600 font-chinese">{errors.urlSlugEn}</p>
                )}
              </div>
            </div>

            {/* Meta Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  SEO標題 (中文)
                </label>
                <input
                  type="text"
                  value={formData.metaTitle['zh-TW']}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value, 'zh-TW')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese"
                  placeholder="SEO 標題（建議60字以內）"
                  maxLength="60"
                />
                <div className="mt-1 text-xs text-gray-500 font-chinese">
                  {formData.metaTitle['zh-TW']?.length || 0}/60 字
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  SEO標題 (英文)
                </label>
                <input
                  type="text"
                  value={formData.metaTitle['en']}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value, 'en')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors"
                  placeholder="SEO Title (max 60 chars)"
                  maxLength="60"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {formData.metaTitle['en']?.length || 0}/60 chars
                </div>
              </div>
            </div>

            {/* Meta Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  SEO描述 (中文)
                </label>
                <textarea
                  value={formData.metaDescription['zh-TW']}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value, 'zh-TW')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors font-chinese resize-none"
                  placeholder="SEO 描述（建議160字以內）"
                  maxLength="160"
                />
                <div className="mt-1 text-xs text-gray-500 font-chinese">
                  {formData.metaDescription['zh-TW']?.length || 0}/160 字
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                  SEO描述 (英文)
                </label>
                <textarea
                  value={formData.metaDescription['en']}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value, 'en')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-colors resize-none"
                  placeholder="SEO Description (max 160 chars)"
                  maxLength="160"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {formData.metaDescription['en']?.length || 0}/160 chars
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="add-product-content">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-400 hover:text-[#cc824d] rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-chinese">新增商品</h1>
            <p className="text-gray-600 mt-1 font-chinese">創建新的商品並設定變體</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese"
          >
            <option value="zh-TW">繁體中文</option>
            <option value="en">English</option>
          </select>
          
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese"
          >
            <option value="draft">草稿</option>
            <option value="active">啟用</option>
            <option value="inactive">停用</option>
          </select>
        </div>
      </div>

      {/* 分頁導航 */}
      <div className="glass rounded-2xl p-2 mb-6">
        <nav className="flex space-x-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 font-chinese ${
                  currentTab === tab.id
                    ? 'bg-[#cc824d] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#cc824d] hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 表單內容 */}
      <form onSubmit={handleSubmit}>
        <div className="glass rounded-2xl p-6 mb-6">
          {renderTabContent()}
        </div>

        {/* 提交按鈕 */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-chinese"
          >
            取消
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-chinese font-semibold flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                創建中...
              </>
            ) : (
              <>
                <CheckIcon className="w-5 h-5 mr-2" />
                創建商品
              </>
            )}
          </button>
        </div>

        {errors.submit && (
          <p className="mt-2 text-sm text-red-600 font-chinese text-center">{errors.submit}</p>
        )}
      </form>
    </div>
  );
};

export default AddProductAdvanced;