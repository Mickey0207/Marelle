import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhotoIcon,
  InformationCircleIcon,
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from '../../styles';
import ImageUpload from '../../components/products/ImageUpload';
import CategoryTreeSelector from '../../components/products/CategoryTreeSelector';
import VariantManager from '../../components/products/VariantManager';
import SEOSettings from '../../components/products/SEOSettings';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import AlertBox from '../../components/ui/AlertBox';

const AddProductAdvanced = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [productData, setProductData] = useState({
    // 基本資訊
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    categories: [], // 複選分類
    tags: [],
    
    // 定價資訊
    price: '',
    comparePrice: '',
    costPrice: '',
    profit: '',
    profitMargin: '',
    
    // 庫存資訊
    sku: '',
    trackQuantity: true,
    quantity: '',
    allowBackorder: false,
    lowStockThreshold: '',
    
    // 圖片資訊
    images: [],
    
    // SEO 和可見性
    status: 'draft', // draft, active, archived
    visibility: 'visible', // visible, hidden
    featured: false,
    metaTitle: '',
    metaDescription: '',
    sitemapIndexing: true,
    customCanonicalUrl: '',
    
    // 開放圖表設定
    openGraphTitle: '',
    openGraphDescription: '',
    openGraphImage: '',
    useMetaTitleForOG: true,
    useMetaDescriptionForOG: true,
    
    // 網站搜尋設定
    excludeFromSearch: false,
    searchTitle: '',
    searchDescription: '',
    searchImage: '',
    useMetaTitleForSearch: true,
    useMetaDescriptionForSearch: true,
    useOpenGraphImageForSearch: true,
    
    // 運送資訊
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    shippingRequired: true,
    
    // 變體資訊
    hasVariants: false,
    variants: []
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'warning' });

  const steps = [
    {
      id: 'basic',
      title: '基本資訊',
      description: '設定產品名稱、描述和分類',
      icon: InformationCircleIcon,
      isCompleted: false
    },
    {
      id: 'pricing',
      title: '定價設定',
      description: '設定價格、成本和利潤',
      icon: CurrencyDollarIcon,
      isCompleted: false
    },
    {
      id: 'inventory',
      title: '庫存管理',
      description: '設定 SKU、庫存數量和警告',
      icon: CubeIcon,
      isCompleted: false
    },
    {
      id: 'variants',
      title: '變體設定',
      description: '設定產品變體和選項',
      icon: TagIcon,
      isCompleted: false
    },
    {
      id: 'categories',
      title: '商品分類',
      description: '設定商品分類歸屬',
      icon: TagIcon,
      isCompleted: false
    },
    {
      id: 'media',
      title: '圖片媒體',
      description: '上傳產品圖片和媒體',
      icon: PhotoIcon,
      isCompleted: false
    },
    {
      id: 'seo',
      title: 'SEO 設定',
      description: '搜尋引擎優化設定',
      icon: TagIcon,
      isCompleted: false
    }
  ];

  const handleInputChange = (field, value) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除相關錯誤
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // SEO 組件專用的 onChange 處理器
  const handleSEOChange = (field, value) => {
    handleInputChange(field, value);
  };

  const handleNestedInputChange = (parentField, field, value) => {
    setProductData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...productData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    handleInputChange('tags', productData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    // 清除錯誤狀態
    setErrors({});
  };

  const scrollToFirstError = (errorFieldName) => {
    setTimeout(() => {
      const errorElement = document.querySelector(`[name="${errorFieldName}"], #${errorFieldName}`);
      if (errorElement) {
        errorElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        errorElement.focus();
      }
    }, 100);
  };

  const calculateProfit = () => {
    const price = parseFloat(productData.price) || 0;
    const cost = parseFloat(productData.costPrice) || 0;
    const profit = price - cost;
    const margin = cost > 0 ? ((profit / price) * 100).toFixed(2) : 0;
    
    handleInputChange('profit', profit.toFixed(2));
    handleInputChange('profitMargin', margin);
  };

  const generateSlug = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .trim()
      .replace(/[\u4e00-\u9fff]/g, (char) => {
        // 中文轉拼音（簡化版）
        const charCode = char.charCodeAt(0);
        return `char-${charCode}`;
      })
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50); // 限制長度
  };

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];
    const newErrors = {};

    switch (step.id) {
      case 'basic':
        if (!productData.name.trim()) newErrors.name = '產品名稱為必填項目';
        if (!productData.slug.trim()) newErrors.slug = '產品路由為必填項目';
        else if (!/^[a-z0-9-]+$/.test(productData.slug)) newErrors.slug = '路由只能包含小寫英文、數字和連字符';
        if (!productData.description.trim()) newErrors.description = '產品描述為必填項目';
        break;
      
      case 'pricing':
        if (!productData.price || parseFloat(productData.price) <= 0) {
          newErrors.price = '請輸入有效的銷售價格';
        }
        break;
      
      case 'inventory':
        if (!productData.sku.trim()) newErrors.sku = 'SKU 為必填項目';
        if (productData.trackQuantity && (!productData.quantity || parseInt(productData.quantity) < 0)) {
          newErrors.quantity = '請輸入有效的庫存數量';
        }
        break;
      
      case 'variants':
        if (productData.hasVariants && productData.variants.length === 0) {
          newErrors.variants = '請設定至少一個產品變體';
        }
        if (productData.hasVariants) {
          // 檢查變體是否有設定價格和庫存
          const invalidVariants = productData.variants.filter(v => 
            v.isActive && (!v.price || !v.quantity)
          );
          if (invalidVariants.length > 0) {
            newErrors.variants = '請為所有啟用的變體設定價格和庫存';
          }
        }
        break;
        
      case 'media':
        // 圖片不是必填項目，但可以在這裡加入其他媒體驗證
        break;
        
      case 'seo':
        // SEO 設定不是必填項目
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // 將當前步驟標記為已完成
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    // 驗證所有步驟
    const allErrors = {};
    let firstErrorStep = -1;
    let firstErrorField = null;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepErrors = {};

      switch (step.id) {
        case 'basic':
          if (!productData.name.trim()) {
            stepErrors.name = '產品名稱為必填項目';
            if (firstErrorStep === -1) {
              firstErrorStep = i;
              firstErrorField = 'name';
            }
          }
          if (!productData.slug.trim()) {
            stepErrors.slug = '產品路由為必填項目';
            if (firstErrorStep === -1) {
              firstErrorStep = i;
              firstErrorField = 'slug';
            }
          } else if (!/^[a-z0-9-]+$/.test(productData.slug)) {
            stepErrors.slug = '路由只能包含小寫英文、數字和連字符';
            if (firstErrorStep === -1) {
              firstErrorStep = i;
              firstErrorField = 'slug';
            }
          }
          if (!productData.description.trim()) {
            stepErrors.description = '產品描述為必填項目';
            if (firstErrorStep === -1) {
              firstErrorStep = i;
              firstErrorField = 'description';
            }
          }

          break;
        
        case 'pricing':
          if (!productData.price || parseFloat(productData.price) <= 0) {
            stepErrors.price = '請輸入有效的銷售價格';
            if (firstErrorStep === -1) {
              firstErrorStep = i;
              firstErrorField = 'price';
            }
          }
          break;
        
        case 'inventory':
          if (!productData.sku.trim()) {
            stepErrors.sku = 'SKU 為必填項目';
            if (firstErrorStep === -1) {
              firstErrorStep = i;
              firstErrorField = 'sku';
            }
          }
          if (productData.trackQuantity && (!productData.quantity || parseInt(productData.quantity) < 0)) {
            stepErrors.quantity = '請輸入有效的庫存數量';
            if (firstErrorStep === -1) {
              firstErrorStep = i;
              firstErrorField = 'quantity';
            }
          }
          break;
        
        case 'variants':
          if (productData.hasVariants && productData.variants.length === 0) {
            stepErrors.variants = '請設定至少一個產品變體';
            if (firstErrorStep === -1) {
              firstErrorStep = i;
              firstErrorField = 'variants';
            }
          }
          if (productData.hasVariants) {
            const invalidVariants = productData.variants.filter(v => 
              v.isActive && (!v.price || !v.quantity)
            );
            if (invalidVariants.length > 0) {
              stepErrors.variants = '請為所有啟用的變體設定價格和庫存';
              if (firstErrorStep === -1) {
                firstErrorStep = i;
                firstErrorField = 'variants';
              }
            }
          }
          break;
      }

      if (Object.keys(stepErrors).length > 0) {
        allErrors[step.id] = stepErrors;
      }
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors[steps[firstErrorStep].id] || {});
      setCurrentStep(firstErrorStep);
      
      // 顯示警告框
      const errorCount = Object.values(allErrors).reduce((count, stepErrors) => 
        count + Object.keys(stepErrors).length, 0
      );
      
      setAlert({
        show: true,
        type: 'warning',
        title: '請完成必填項目',
        message: (
          <div>
            <p>發現 {errorCount} 個未完成的必填項目：</p>
            <ul className="mt-2 text-xs space-y-1">
              {Object.entries(allErrors).map(([stepId, stepErrors]) => {
                const stepName = steps.find(s => s.id === stepId)?.title;
                return Object.values(stepErrors).map((error, index) => (
                  <li key={`${stepId}-${index}`} className="flex items-center">
                    <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                    {stepName}: {error}
                  </li>
                ));
              }).flat()}
            </ul>
          </div>
        )
      });
      
      // 滾動到第一個錯誤欄位
      scrollToFirstError(firstErrorField);
      return;
    }

    try {
      // 準備提交的產品資料
      const submitData = {
        ...productData,
        price: parseFloat(productData.price) || 0,
        comparePrice: parseFloat(productData.comparePrice) || 0,
        costPrice: parseFloat(productData.costPrice) || 0,
        quantity: parseInt(productData.quantity) || 0,
        lowStockThreshold: parseInt(productData.lowStockThreshold) || 0,
        weight: parseFloat(productData.weight) || 0,
        trackQuantity: Boolean(productData.trackQuantity),
        allowBackorder: Boolean(productData.allowBackorder),
        hasVariants: Boolean(productData.hasVariants),
        featured: Boolean(productData.featured),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productId: `PROD-${Date.now()}`,
        images: productData.images.map(img => ({
          id: img.id,
          url: img.url,
          name: img.name,
          size: img.size,
          isMain: img === productData.images[0]
        })),
        variants: productData.hasVariants ? productData.variants.map(variant => ({
          ...variant,
          price: parseFloat(variant.price) || 0,
          quantity: parseInt(variant.quantity) || 0,
          weight: parseFloat(variant.weight) || 0,
          isActive: Boolean(variant.isActive)
        })) : []
      };

      console.log('準備提交的產品資料:', submitData);
      
      // 模擬 API 請求延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 顯示成功消息
      setAlert({
        show: true,
        type: 'success',
        title: '產品創建成功',
        message: `產品 "${productData.name}" 已成功創建！\n產品 ID: ${submitData.productId}`
      });
      
      // 延遲導航以顯示成功消息
      setTimeout(() => {
        navigate('/products');
      }, 2000);
      
    } catch (error) {
      console.error('創建產品失敗:', error);
      setAlert({
        show: true,
        type: 'error',
        title: '創建失敗',
        message: '創建產品時發生錯誤，請稍後再試。'
      });
    }
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainerStandard}>
        {/* 警告框 */}
        <AlertBox
          show={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          autoClose={alert.type === 'success' ? 3000 : 0}
        />

        {/* 頁面標題和進度指示器 */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            {/* 左側標題 */}
            <div className="lg:w-auto">
              <h1 className="text-3xl font-bold text-gray-900 font-chinese">新增產品</h1>
              <p className="text-gray-600 font-chinese mt-1">
                創建新的產品並設定詳細資訊
              </p>
              {/* 當前步驟提示 */}
              <div className="mt-2">
                <div className="inline-flex items-center px-3 py-1 bg-[#cc824d]/10 text-[#cc824d] rounded-full text-sm font-medium">
                  步驟 {currentStep + 1} / {steps.length}: {steps[currentStep]?.title}
                </div>
              </div>
            </div>
            
            {/* 右側進度指示器 */}
            <div className="lg:ml-8 lg:flex-1">
              <ProgressIndicator
                steps={steps}
                currentStep={currentStep}
                onStepClick={handleStepClick}
                completedSteps={completedSteps}
                compact={true}
              />
            </div>
          </div>
        </div>

        {/* 表單內容 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            {/* 步驟內容 */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>基本資訊</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      產品名稱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={productData.name}
                      onChange={(e) => {
                        handleInputChange('name', e.target.value);
                        // 自動生成 slug
                        if (!productData.slug || productData.slug === generateSlug(productData.name)) {
                          const newSlug = generateSlug(e.target.value);
                          handleInputChange('slug', newSlug);
                        }
                      }}
                      className={`${ADMIN_STYLES.input} ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="輸入產品名稱"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      產品路由 (Slug) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          name="slug"
                          id="slug"
                          value={productData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
                          className={`${ADMIN_STYLES.input} ${errors.slug ? 'border-red-500' : ''}`}
                          placeholder="product-slug"
                          pattern="[a-z0-9-]+"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <span className="text-xs text-gray-400">/products/</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('slug', generateSlug(productData.name))}
                        className="px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                        disabled={!productData.name}
                      >
                        自動生成
                      </button>
                    </div>
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                    <p className="mt-1 text-xs text-gray-500">
                      產品網址將是: {window.location.origin}/{productData.categories.length > 0 ? productData.categories[0].slug || 'category' : 'products'}/{productData.slug || 'product-slug'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      簡短描述
                    </label>
                    <input
                      type="text"
                      value={productData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      className={ADMIN_STYLES.input}
                      placeholder="一句話描述產品特色"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      產品描述 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={productData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={`${ADMIN_STYLES.input} ${errors.description ? 'border-red-500' : ''}`}
                      placeholder="詳細描述產品功能、特色和使用方法"
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      產品標籤
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {productData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#cc824d] text-white"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-white hover:text-gray-200"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className={ADMIN_STYLES.input}
                        placeholder="輸入標籤名稱"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className={ADMIN_STYLES.btnSecondary}
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>定價設定</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      銷售價格 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">NT$</span>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={productData.price}
                        onChange={(e) => {
                          handleInputChange('price', e.target.value);
                          setTimeout(calculateProfit, 100);
                        }}
                        className={`${ADMIN_STYLES.input} pl-12 ${errors.price ? 'border-red-500' : ''}`}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      比較價格（原價）
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">NT$</span>
                      <input
                        type="number"
                        value={productData.comparePrice}
                        onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                        className={`${ADMIN_STYLES.input} pl-12`}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      成本價格
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">NT$</span>
                      <input
                        type="number"
                        value={productData.costPrice}
                        onChange={(e) => {
                          handleInputChange('costPrice', e.target.value);
                          setTimeout(calculateProfit, 100);
                        }}
                        className={`${ADMIN_STYLES.input} pl-12`}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      利潤
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">NT$</span>
                      <input
                        type="text"
                        value={productData.profit}
                        readOnly
                        className={`${ADMIN_STYLES.input} pl-12 bg-gray-50`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    利潤率
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={productData.profitMargin}
                      readOnly
                      className={`${ADMIN_STYLES.input} pr-8 bg-gray-50`}
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>庫存管理</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU (庫存單位) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    id="sku"
                    value={productData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className={`${ADMIN_STYLES.input} ${errors.sku ? 'border-red-500' : ''}`}
                    placeholder="例如：PROD-001"
                  />
                  {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trackQuantity"
                    checked={productData.trackQuantity}
                    onChange={(e) => handleInputChange('trackQuantity', e.target.checked)}
                    className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
                  />
                  <label htmlFor="trackQuantity" className="ml-2 text-sm text-gray-700">
                    追蹤庫存數量
                  </label>
                </div>

                {productData.trackQuantity && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        庫存數量 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={productData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        className={`${ADMIN_STYLES.input} ${errors.quantity ? 'border-red-500' : ''}`}
                        placeholder="0"
                        min="0"
                      />
                      {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        低庫存警告
                      </label>
                      <input
                        type="number"
                        value={productData.lowStockThreshold}
                        onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                        className={ADMIN_STYLES.input}
                        placeholder="5"
                        min="0"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowBackorder"
                    checked={productData.allowBackorder}
                    onChange={(e) => handleInputChange('allowBackorder', e.target.checked)}
                    className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
                  />
                  <label htmlFor="allowBackorder" className="ml-2 text-sm text-gray-700">
                    允許缺貨預訂
                  </label>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">產品變體</h4>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasVariants"
                      checked={productData.hasVariants}
                      onChange={(e) => handleInputChange('hasVariants', e.target.checked)}
                      className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
                    />
                    <label htmlFor="hasVariants" className="ml-2 text-sm text-gray-700">
                      此產品有多個變體 (如不同顏色、尺寸等)
                    </label>
                  </div>
                  
                  {productData.hasVariants && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 啟用變體後，您可以在下一步設定不同的產品選項和組合
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>變體設定</h3>
                
                <div id="variants">
                  <VariantManager
                    hasVariants={productData.hasVariants}
                    variants={productData.variants}
                    onChange={(variants) => handleInputChange('variants', variants)}
                  />
                  {errors.variants && <p className="mt-1 text-sm text-red-600">{errors.variants}</p>}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>商品分類設定</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    選擇商品分類 (可複選)
                  </label>
                  <CategoryTreeSelector
                    selectedCategories={productData.categories}
                    onChange={(categories) => handleInputChange('categories', categories)}
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>圖片媒體</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    產品圖片
                  </label>
                  <ImageUpload
                    images={productData.images}
                    onChange={(images) => handleInputChange('images', images)}
                    maxImages={5}
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">運送資訊</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        重量 (公克)
                      </label>
                      <input
                        type="number"
                        value={productData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className={ADMIN_STYLES.input}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        長度 (公分)
                      </label>
                      <input
                        type="number"
                        value={productData.dimensions.length}
                        onChange={(e) => handleNestedInputChange('dimensions', 'length', e.target.value)}
                        className={ADMIN_STYLES.input}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        寬度 (公分)
                      </label>
                      <input
                        type="number"
                        value={productData.dimensions.width}
                        onChange={(e) => handleNestedInputChange('dimensions', 'width', e.target.value)}
                        className={ADMIN_STYLES.input}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      高度 (公分)
                    </label>
                    <input
                      type="number"
                      value={productData.dimensions.height}
                      onChange={(e) => handleNestedInputChange('dimensions', 'height', e.target.value)}
                      className={ADMIN_STYLES.input}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>SEO 設定</h3>
                
                <SEOSettings
                  productData={productData}
                  onChange={handleSEOChange}
                  errors={errors}
                  categories={productData.categories}
                />
              </div>
            )}
          </div>

          {/* 表單操作按鈕 */}
          <div className="border-t border-gray-200 px-8 py-6 flex items-center justify-between bg-gray-50 rounded-b-xl">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className={ADMIN_STYLES.btnSecondary}
              >
                取消
              </button>
              
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4 mr-2" />
                  上一步
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* 進度指示 */}
              <span className="text-sm text-gray-500">
                步驟 {currentStep + 1} / {steps.length}
              </span>
              
              <div className="flex space-x-3">
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-6 py-2 bg-[#cc824d] text-white rounded-lg text-sm font-medium hover:bg-[#b86c37] transition-colors shadow-sm"
                  >
                    下一步
                    <ChevronRightIcon className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center px-8 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    創建產品
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductAdvanced;
