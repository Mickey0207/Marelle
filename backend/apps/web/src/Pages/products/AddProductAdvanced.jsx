import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhotoIcon,
  InformationCircleIcon,
  TagIcon,
  CubeIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import ImageUpload from '../../components/products/ImageUpload';
import CategoryTreeSelector from '../../components/products/CategoryTreeSelector';
import NestedSKUManager from '../../components/products/NestedSKUManager';
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
  // 標籤與顏色
  promotionLabel: '',
  promotionLabelBgColor: '#CC824D',
  promotionLabelTextColor: '#FFFFFF',
  productTagBgColor: '#CC824D',
  productTagTextColor: '#FFFFFF',
  // 缺貨/預購控制
  autoHideWhenOOS: false,
  enablePreorder: false,
  preorderStartAt: '',
  preorderEndAt: '',
  preorderMaxQty: '',
    
    // 定價資訊 (僅用於無變體商品)
    price: '',
    comparePrice: '',
    costPrice: '',
    profit: '',
    profitMargin: '',
    
    // SKU 資訊
    baseSKU: '', // 基礎 SKU，所有變體都會以此為基礎
    hasVariants: false,
    skuVariants: [], // 五層巢狀 SKU 變體
    
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
    useOpenGraphImageForSearch: true
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'warning' });

  const steps = [
    {
      id: 'basic',
      title: '基本資訊',
      description: '設定產品名稱、描述和基礎 SKU',
      icon: InformationCircleIcon,
      isCompleted: false
    },
    {
      id: 'variants',
      title: 'SKU 變體管理',
      description: '設定五層巢狀 SKU 變體和庫存',
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

  // 已不再使用的巢狀輸入處理器，移除以降低噪音

  const addTag = () => {
    if (newTag.trim()) {
      // 限制僅一個產品標籤
      handleInputChange('tags', [newTag.trim()]);
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
        if (!productData.baseSKU.trim()) newErrors.baseSKU = '基礎 SKU 為必填項目';
        else if (!/^[a-z0-9]+$/.test(productData.baseSKU)) newErrors.baseSKU = '基礎 SKU 只能包含小寫英文和數字';
        break;
      
      case 'pricing':
        // 僅在無變體時驗證價格
        if (!productData.hasVariants) {
          if (!productData.price || parseFloat(productData.price) <= 0) {
            newErrors.price = '請輸入有效的銷售價格';
          }
        }
        break;
      
      case 'variants':
        if (productData.hasVariants) {
          if (productData.skuVariants.length === 0) {
            newErrors.skuVariants = '請設定至少一個 SKU 變體';
          }
        }
        break;
        
      case 'categories':
      case 'media':
      case 'seo':
        // 這些步驟不是必填項目
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
          if (!productData.baseSKU.trim()) {
            stepErrors.baseSKU = '基礎 SKU 為必填項目';
            if (firstErrorStep === -1) {
              firstErrorStep = i;
              firstErrorField = 'baseSKU';
            }
          } else if (!/^[a-z0-9]+$/.test(productData.baseSKU)) {
            stepErrors.baseSKU = '基礎 SKU 只能包含小寫英文和數字';
            if (firstErrorStep === -1) {
              firstErrorStep = i;
              firstErrorField = 'baseSKU';
            }
          }
          break;
        
        case 'pricing':
          // 僅在無變體時驗證價格
          if (!productData.hasVariants) {
            if (!productData.price || parseFloat(productData.price) <= 0) {
              stepErrors.price = '請輸入有效的銷售價格';
              if (firstErrorStep === -1) {
                firstErrorStep = i;
                firstErrorField = 'price';
              }
            }
          }
          break;
        
        case 'variants':
          if (productData.hasVariants) {
            if (productData.skuVariants.length === 0) {
              stepErrors.skuVariants = '請設定至少一個 SKU 變體';
              if (firstErrorStep === -1) {
                firstErrorStep = i;
                firstErrorField = 'skuVariants';
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
      setAlert({ show: false });
      
      // 1. 建立商品基本資訊
      // 正規化分類 ID 為數字（後端為 bigint[]）。若沒有有效數字 ID，則不送此欄位。
      const numericCategoryIds = (Array.isArray(productData.categories) ? productData.categories : [])
        .filter((v) => v !== null && v !== undefined && v !== '')
        .map((c) => (c !== null && typeof c === 'object' ? (c.id ?? c.value ?? c) : c))
        .map((v) => (typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v))
        .filter((v) => typeof v === 'number' && Number.isFinite(v));

      const productRes = await fetch('/backend/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: productData.name,
          slug: productData.slug,
          short_description: productData.shortDescription || null,
          description: productData.description,
          tags: productData.tags,
          promotion_label: productData.promotionLabel || null,
          promotion_label_bg_color: productData.promotionLabelBgColor || null,
          promotion_label_text_color: productData.promotionLabelTextColor || null,
          product_tag_bg_color: productData.productTagBgColor || null,
          product_tag_text_color: productData.productTagTextColor || null,
          // 缺貨/預購
          auto_hide_when_oos: !!productData.autoHideWhenOOS,
          enable_preorder: !!productData.enablePreorder,
          preorder_start_at: productData.preorderStartAt ? new Date(productData.preorderStartAt).toISOString() : null,
          preorder_end_at: productData.preorderEndAt ? new Date(productData.preorderEndAt).toISOString() : null,
          preorder_max_qty: productData.preorderMaxQty === '' ? null : Number(productData.preorderMaxQty),
          base_sku: productData.baseSKU,
          has_variants: productData.hasVariants,
          status: productData.status,
          visibility: productData.visibility,
          is_featured: productData.featured,
          ...(numericCategoryIds.length > 0 ? { category_ids: numericCategoryIds } : {}),
          meta_title: productData.metaTitle || null,
          meta_description: productData.metaDescription || null,
          og_title: productData.openGraphTitle || null,
          og_description: productData.openGraphDescription || null,
          og_image_url: productData.openGraphImage || null,
          search_title: productData.searchTitle || null,
          search_description: productData.searchDescription || null,
          search_image_url: productData.searchImage || null,
          sitemap_indexing: productData.sitemapIndexing,
          custom_canonical_url: productData.customCanonicalUrl || null,
          exclude_from_search: productData.excludeFromSearch,
          use_meta_title_for_og: !!productData.useMetaTitleForOG,
          use_meta_description_for_og: !!productData.useMetaDescriptionForOG,
          use_meta_title_for_search: !!productData.useMetaTitleForSearch,
          use_meta_description_for_search: !!productData.useMetaDescriptionForSearch,
          use_og_image_for_search: !!productData.useOpenGraphImageForSearch
        })
      });
      
      if (!productRes.ok) {
        throw new Error(`建立商品失敗: ${productRes.statusText}`);
      }
      
      const createdProduct = await productRes.json();
      const productId = createdProduct.id;
      
      // 2. 上傳商品圖片 (批量上傳到固定10欄位結構)
      if (productData.images && productData.images.length > 0) {
        const filesToUpload = [];
        const urlsToUpload = [];
        
        // 分離本地文件和已有URL
        for (let i = 0; i < productData.images.length; i++) {
          const img = productData.images[i];
          if (img.file) {
            filesToUpload.push(img.file);
          } else if (img.url) {
            urlsToUpload.push(img.url);
          }
        }
        
        // 合併所有圖片URL
        const allImageUrls = [...urlsToUpload];
        
        // 上傳文件
        if (filesToUpload.length > 0) {
          for (const file of filesToUpload) {
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadRes = await fetch(`/backend/products/${productId}/storage-upload`, {
              method: 'POST',
              credentials: 'include',
              body: formData
            });
            
            if (uploadRes.ok) {
              const { url } = await uploadRes.json();
              allImageUrls.push(url);
            }
          }
        }
        
        // 批量更新所有10個圖片欄位
        if (allImageUrls.length > 0) {
          const photoUpdateData = {};
          for (let i = 0; i < 10; i++) {
            photoUpdateData[`photo_url_${i + 1}`] = allImageUrls[i] || null;
          }
          
          const photoRes = await fetch(`/backend/products/${productId}/photos`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(photoUpdateData)
          });
          
          if (!photoRes.ok) {
            console.error(`更新商品圖片失敗: ${photoRes.statusText}`);
          }
        }
      }
      
      // 3. 建立庫存與價格記錄
      if (productData.hasVariants && productData.skuVariants.length > 0) {
        // 為每個啟用的變體建立庫存和價格記錄
        for (const variant of productData.skuVariants) {
          if (!variant.isActive) continue; // 跳過未啟用的變體

          try {
            // 建立庫存記錄
            const inventoryData = {
              sku_key: variant.sku || null, // 使用完整 SKU 作為 sku_key
              warehouse: '主倉',
              current_stock_qty: variant.quantity ? parseInt(variant.quantity) : 0,
              safety_stock_qty: variant.lowStockThreshold ? parseInt(variant.lowStockThreshold) : 10,
              low_stock_threshold: variant.lowStockThreshold ? parseInt(variant.lowStockThreshold) : 5,
              track_inventory: variant.trackQuantity !== false,
              allow_backorder: variant.allowBackorder === true,
              allow_preorder: false,
              barcode: variant.config?.barcode || null,
              hs_code: variant.config?.hsCode || null,
              origin: variant.config?.origin || null,
              notes: variant.config?.note || null,
              weight: variant.config?.weight ? parseFloat(variant.config.weight) : null,
              length_cm: variant.config?.dimensions?.length ? parseFloat(variant.config.dimensions.length) : null,
              width_cm: variant.config?.dimensions?.width ? parseFloat(variant.config.dimensions.width) : null,
              height_cm: variant.config?.dimensions?.height ? parseFloat(variant.config.dimensions.height) : null
            };

            // 提取5層級SKU資訊
            if (variant.path && Array.isArray(variant.path)) {
              for (let i = 0; i < 5; i++) {
                const pathItem = variant.path[i];
                if (pathItem) {
                  inventoryData[`sku_level_${i + 1}`] = pathItem.option || null;
                  inventoryData[`sku_level_${i + 1}_name`] = pathItem.option || null;
                  inventoryData[`spec_level_${i + 1}_name`] = pathItem.level || null;
                } else {
                  inventoryData[`sku_level_${i + 1}`] = null;
                  inventoryData[`sku_level_${i + 1}_name`] = null;
                  inventoryData[`spec_level_${i + 1}_name`] = null;
                }
              }
            } else {
              // 如果沒有path資訊，初始化所有欄位為null
              for (let i = 0; i < 5; i++) {
                inventoryData[`sku_level_${i + 1}`] = null;
                inventoryData[`sku_level_${i + 1}_name`] = null;
                inventoryData[`spec_level_${i + 1}_name`] = null;
              }
            }

            const inventoryRes = await fetch(`/backend/products/${productId}/inventory`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(inventoryData)
            });

            if (!inventoryRes.ok) {
              console.error(`建立變體 ${variant.sku} 的庫存記錄失敗: ${inventoryRes.statusText}`);
            }
            let invRow = null;
            try { if (inventoryRes.ok) invRow = await inventoryRes.json(); } catch {}

            // 建立價格記錄 - 確保至少有一個價格欄位有值
            const hasPrice = (variant.price && variant.price !== '') || 
                            (variant.comparePrice && variant.comparePrice !== '') ||
                            (variant.costPrice && variant.costPrice !== '');
            
            if (hasPrice) {
              const priceData = {
                sku_key: variant.sku || null,
                sale_price: variant.price ? parseFloat(variant.price) : 0,
                compare_at_price: variant.comparePrice ? parseFloat(variant.comparePrice) : null,
                cost_price: variant.costPrice ? parseFloat(variant.costPrice) : null
              };

              const priceRes = await fetch(`/backend/products/${productId}/prices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(priceData)
              });

              if (!priceRes.ok) {
                console.error(`建立變體 ${variant.sku} 的價格記錄失敗: ${priceRes.statusText}`);
              } else {
                console.log(`成功建立變體 ${variant.sku} 的價格記錄`);
              }
            }

            // 變體圖片：最多 3 張，上傳至 storage 並回填 variant photos
            if (invRow && invRow.id) {
              const vImgs = Array.isArray(variant.config?.variantImages) ? variant.config.variantImages : [];
              if (vImgs.length > 0) {
                const urls = [];
                for (const img of vImgs.slice(0,3)) {
                  if (img?.file) {
                    const fd = new FormData();
                    fd.append('file', img.file);
                    const upRes = await fetch(`/backend/products/${productId}/variant-photos/${invRow.id}/upload`, { method:'POST', credentials:'include', body: fd });
                    if (upRes.ok) { const { url } = await upRes.json(); urls.push(url); }
                  } else if (img?.url) {
                    urls.push(img.url);
                  }
                }
                const patchBody = { variant_photo_url_1: urls[0] || null, variant_photo_url_2: urls[1] || null, variant_photo_url_3: urls[2] || null };
                await fetch(`/backend/products/${productId}/variant-photos/${invRow.id}`, {
                  method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(patchBody)
                }).catch(e => console.warn('建立變體圖片失敗:', e));
              }
            }
          } catch (error) {
            console.error(`處理變體 ${variant.sku} 的庫存/價格記錄時出錯:`, error);
            // 繼續處理其他變體，不中斷流程
          }
        }
      } else if (!productData.hasVariants) {
        // 單一SKU產品：建立基本庫存和價格記錄（sku_key 為 null）
        try {
          // 建立庫存記錄（sku_key 為 null 表示此產品無變體）
          const inventoryData = {
            sku_key: null,
            warehouse: '主倉',
            current_stock_qty: 0,
            safety_stock_qty: 10,
            low_stock_threshold: 5,
            track_inventory: true,
            allow_backorder: false,
            allow_preorder: false
          };

          const inventoryRes = await fetch(`/backend/products/${productId}/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(inventoryData)
          });

          if (!inventoryRes.ok) {
            console.error(`建立單一SKU產品的庫存記錄失敗: ${inventoryRes.statusText}`);
          } else {
            console.log('成功建立單一SKU產品的庫存記錄');
          }

          // 建立價格記錄 - 確保至少有一個價格欄位有值
          const hasPrice = (productData.price && productData.price !== '') || 
                          (productData.comparePrice && productData.comparePrice !== '') ||
                          (productData.costPrice && productData.costPrice !== '');
          
          if (hasPrice) {
            const priceData = {
              sku_key: null,
              sale_price: productData.price ? parseFloat(productData.price) : 0,
              compare_at_price: productData.comparePrice ? parseFloat(productData.comparePrice) : null,
              cost_price: productData.costPrice ? parseFloat(productData.costPrice) : null
            };

            const priceRes = await fetch(`/backend/products/${productId}/prices`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(priceData)
            });

            if (!priceRes.ok) {
              console.error(`建立單一SKU產品的價格記錄失敗: ${priceRes.statusText}`);
            } else {
              console.log('成功建立單一SKU產品的價格記錄');
            }
          }
        } catch (error) {
          console.error('建立單一SKU產品的庫存/價格記錄時出錯:', error);
        }
      }
      
      // 成功
      setAlert({
        show: true,
        type: 'success',
        title: '產品創建成功',
        message: `產品 "${productData.name}" 已成功創建！`
      });
      
      setTimeout(() => {
        navigate('/products');
      }, 2000);
      
    } catch (error) {
      console.error('創建產品失敗:', error);
      setAlert({
        show: true,
        type: 'error',
        title: '創建失敗',
        message: error.message || '創建產品時發生錯誤，請稍後再試。'
      });
    }
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
  <div className={ADMIN_STYLES.contentContainerFluid}>
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
          <div className="flex items-center gap-8">
            {/* 左側標題 */}
            <div className="w-auto">
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
            <div className="flex-1">
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
                      產品網址將是: {window.location.origin}/products/{productData.slug || 'product-slug'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      基礎 SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="baseSKU"
                      id="baseSKU"
                      value={productData.baseSKU}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                        handleInputChange('baseSKU', value);
                      }}
                      className={`${ADMIN_STYLES.input} ${errors.baseSKU ? 'border-red-500' : ''}`}
                      placeholder="例如：iphone"
                      maxLength={20}
                    />
                    {errors.baseSKU && <p className="mt-1 text-sm text-red-600">{errors.baseSKU}</p>}
                    <p className="mt-1 text-xs text-gray-500">
                      基礎 SKU 將作為所有變體的前綴，例如：{productData.baseSKU || 'iphone'}bkpro
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">產品標籤</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {productData.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm" style={{background: productData.productTagBgColor, color: productData.productTagTextColor}}>
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="ml-2" style={{color: productData.productTagTextColor}}>
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className={ADMIN_STYLES.input} placeholder="輸入標籤名稱" />
                      <button type="button" onClick={addTag} className={ADMIN_STYLES.btnSecondary}><PlusIcon className="w-4 h-4" /></button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">產品標籤背景色</label>
                        <input type="color" value={productData.productTagBgColor} onChange={(e)=>handleInputChange('productTagBgColor', e.target.value)} className="w-16 h-10 p-0 border rounded" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">產品標籤字體色</label>
                        <input type="color" value={productData.productTagTextColor} onChange={(e)=>handleInputChange('productTagTextColor', e.target.value)} className="w-16 h-10 p-0 border rounded" />
                      </div>
                    </div>
                  </div>

                  {/* 優惠標籤 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">優惠標籤</label>
                    <div className="grid grid-cols-3 gap-4 items-end">
                      <div className="col-span-2">
                        <div className="flex gap-2">
                          <input type="text" value={productData.promotionLabel} onChange={(e)=>handleInputChange('promotionLabel', e.target.value)} className={`flex-1 ${ADMIN_STYLES.input}`} placeholder="如：滿千折百 / 限時優惠" />
                          <button type="button" onClick={() => handleInputChange('promotionLabel', (productData.promotionLabel || '').trim())} className={ADMIN_STYLES.btnSecondary} title="新增優惠標籤">
                            <PlusIcon className="w-4 h-4" />
                          </button>
                          {productData.promotionLabel && (
                            <button type="button" onClick={() => handleInputChange('promotionLabel', '')} className={ADMIN_STYLES.btnSecondary} title="清除優惠標籤">
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {productData.promotionLabel && (
                          <span className="inline-block px-3 py-1 rounded-full text-sm" style={{background: productData.promotionLabelBgColor, color: productData.promotionLabelTextColor}}>
                            {productData.promotionLabel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">優惠標籤背景色</label>
                        <input type="color" value={productData.promotionLabelBgColor} onChange={(e)=>handleInputChange('promotionLabelBgColor', e.target.value)} className="w-16 h-10 p-0 border rounded" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">優惠標籤字體色</label>
                        <input type="color" value={productData.promotionLabelTextColor} onChange={(e)=>handleInputChange('promotionLabelTextColor', e.target.value)} className="w-16 h-10 p-0 border rounded" />
                      </div>
                    </div>
                  </div>

                  {/* 缺貨與預購設定 */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">缺貨與預購</h4>
                    <div className="space-y-3">
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]" checked={productData.autoHideWhenOOS} onChange={(e)=>handleInputChange('autoHideWhenOOS', e.target.checked)} />
                        <span className="text-sm text-gray-700">缺貨自動下架</span>
                      </label>
                      <div className="flex flex-col gap-3">
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]" checked={productData.enablePreorder} onChange={(e)=>handleInputChange('enablePreorder', e.target.checked)} />
                          <span className="text-sm text-gray-700">啟用預購</span>
                        </label>
                        {productData.enablePreorder && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">預購開始時間</label>
                              <input type="datetime-local" value={productData.preorderStartAt} onChange={(e)=>handleInputChange('preorderStartAt', e.target.value)} className={ADMIN_STYLES.input} />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">預購結束時間</label>
                              <input type="datetime-local" value={productData.preorderEndAt} onChange={(e)=>handleInputChange('preorderEndAt', e.target.value)} className={ADMIN_STYLES.input} />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">最大預購數</label>
                              <input type="number" min="0" value={productData.preorderMaxQty} onChange={(e)=>handleInputChange('preorderMaxQty', e.target.value)} className={ADMIN_STYLES.input} placeholder="例如 100" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>SKU 變體管理</h3>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="hasVariants"
                      checked={productData.hasVariants}
                      onChange={(e) => handleInputChange('hasVariants', e.target.checked)}
                      className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]"
                    />
                    <label htmlFor="hasVariants" className="ml-2 text-sm text-gray-700">
                      此產品有多個 SKU 變體 (如不同顏色、尺寸、規格等)
                    </label>
                  </div>
                  
                  {!productData.hasVariants && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <CubeIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-600 mb-2">此商品為單一 SKU 商品</p>
                      <p className="text-sm text-gray-500">
                        如果商品有不同的變體選項，請勾選上方的變體選項
                      </p>
                      {productData.baseSKU && (
                        <div className="mt-4 p-3 bg-white rounded border">
                          <p className="text-sm font-medium text-gray-700">商品 SKU:</p>
                          <p className="font-mono text-lg text-[#cc824d]">{productData.baseSKU}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {productData.hasVariants && (
                    <NestedSKUManager
                      baseSKU={productData.baseSKU}
                      skuVariants={productData.skuVariants}
                      onChange={(variants) => handleInputChange('skuVariants', variants)}
                      productName={productData.name}
                      productCategories={productData.categories}
                    />
                  )}
                  
                  {errors.skuVariants && <p className="mt-1 text-sm text-red-600">{errors.skuVariants}</p>}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>商品分類</h3>
                
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

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>圖片媒體</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    產品圖片
                  </label>
                  <ImageUpload
                    images={productData.images}
                    onChange={(images) => handleInputChange('images', images)}
                    maxImages={10}
                  />
                </div>
              </div>
              )}

            {currentStep === 4 && (
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
