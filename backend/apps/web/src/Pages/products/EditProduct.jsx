import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import ImageUpload from '../../components/products/ImageUpload';
import CategoryTreeSelector from '../../components/products/CategoryTreeSelector';
import NestedSKUManager from '../../components/products/NestedSKUManager';
import SEOSettings from '../../components/products/SEOSettings';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import AlertBox from '../../components/ui/AlertBox';
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

const defaultState = {
  // 基本資訊
  name: '',
  slug: '',
  shortDescription: '',
  categories: [],
  tags: [],
  // 定價
  price: '',
  comparePrice: '',
  costPrice: '',
  profit: '',
  profitMargin: '',
  // SKU
  baseSKU: '',
  hasVariants: false,
  skuVariants: [],
  // 圖片
  images: [],
  // SEO/可見性
  status: 'draft',
  visibility: 'visible',
  featured: false,
  metaTitle: '',
  metaDescription: '',
  sitemapIndexing: true,
  customCanonicalUrl: '',
  openGraphTitle: '',
  openGraphDescription: '',
  openGraphImage: '',
  useMetaTitleForOG: true,
  useMetaDescriptionForOG: true,
  // 搜尋
  excludeFromSearch: false,
  searchTitle: '',
  searchDescription: '',
  searchImage: '',
  useMetaTitleForSearch: true,
  useMetaDescriptionForSearch: true,
  useOpenGraphImageForSearch: true
};

const EditProduct = () => {
  const { sku } = useParams();
  const navigate = useNavigate();

  const [original, setOriginal] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  // 從 API 加載商品
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        // 第一步：從 /backend/products API 取得所有商品，尋找對應的 base_sku 以獲取商品 ID
        const listRes = await fetch('/backend/products', { credentials: 'include' });
        if (!listRes.ok) throw new Error('Failed to fetch products');
        
        const products = await listRes.json() || [];
        const productBasic = products.find(p => p.base_sku === sku);
        
        if (!productBasic) {
          setLoadingError(`找不到 SKU: ${sku} 的商品`);
          setLoadingProduct(false);
          return;
        }

        // 第二步：使用商品 ID 從詳細端點獲取完整信息（包括庫存、定價、照片、SEO）
        const detailRes = await fetch(`/backend/products/${productBasic.id}`, { credentials: 'include' });
        if (!detailRes.ok) {
          // 如果詳細端點失敗，使用基本信息
          setOriginal(productBasic);
        } else {
          const productDetail = await detailRes.json();
          setOriginal(productDetail);
        }
      } catch (err) {
        setLoadingError(err.message);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (sku) {
      fetchProduct();
    }
  }, [sku]);

  const mapProductToForm = useCallback((p) => {
    if (!p) return { ...defaultState };
    
    // 從庫存和定價記錄重建變體
    let skuVariants = [];
    const prices = p.prices || [];
    const inventory = p.inventory || [];
    
    // 優先使用庫存記錄，結合定價記錄重建變體
    if (inventory.length > 0) {
      const priceMap = new Map(prices.map(pr => [pr.sku_key, pr]));
  const variantPhotos = Array.isArray(p.variant_photos) ? p.variant_photos : [];
      // 以 sku_key 去重（避免多倉庫重複）
      const bySku = new Map();
      for (const inv of inventory) {
        const key = inv.sku_key || null;
        // 只保留每個 sku_key 的第一筆（不關心倉庫）
        if (!bySku.has(key)) bySku.set(key, inv);
      }

      // 只建立有 sku_key 的變體（null 表示非變體基底）
      for (const [skuKey, invRecord] of bySku.entries()) {
        if (!skuKey) continue;
        const priceRecord = priceMap.get(skuKey);

        // 重建五層 path
        const path = [];
        for (let i = 1; i <= 5; i++) {
          const option = invRecord[`sku_level_${i}_name`] || invRecord[`sku_level_${i}`];
          const level = invRecord[`spec_level_${i}_name`] || (option ? `層級${i}` : null);
          const code = invRecord[`sku_level_${i}`] || '';
          if (option && level) path.push({ level, option, code });
        }

        // 變體圖片：優先使用 inventory 列上的 variant_photo_url_1..3，其次相容舊回應的 variant_photos 陣列
        const variantImages = [];
        const directUrls = [invRecord.variant_photo_url_1, invRecord.variant_photo_url_2, invRecord.variant_photo_url_3].filter(Boolean);
        if (directUrls.length > 0) {
          directUrls.forEach((u, idx) => {
            variantImages.push({
              id: `vimg_${invRecord.id}_${idx + 1}`,
              url: u,
              name: `variant-${idx + 1}.jpg`,
              size: 0,
              type: 'image/jpeg'
            });
          });
        } else {
          const vp = variantPhotos.find(v => v.inventory_id === invRecord.id);
          if (vp) {
            const urls = [vp.variant_photo_url_1, vp.variant_photo_url_2, vp.variant_photo_url_3].filter(Boolean);
            urls.forEach((u, idx) => {
              variantImages.push({
                id: `vimg_${invRecord.id}_${idx + 1}`,
                url: u,
                name: `variant-${idx + 1}.jpg`,
                size: 0,
                type: 'image/jpeg'
              });
            });
          }
        }

        // 構造變體物件（NestedSKUManager 需要 path 才能重建樹）
        skuVariants.push({
          sku: skuKey,
          name: path.length > 0 ? path[path.length - 1].option : skuKey,
          path,
          pathDisplay: path.map(p => `${p.level}: ${p.option}`).join(' → '),
          price: priceRecord?.sale_price ?? '',
          comparePrice: priceRecord?.compare_at_price ?? '',
          costPrice: priceRecord?.cost_price ?? '',
          quantity: invRecord.current_stock_qty ?? '',
          barcode: invRecord.barcode ?? '',
          hsCode: invRecord.hs_code ?? '',
          origin: invRecord.origin ?? '',
          isActive: true,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: invRecord.low_stock_threshold ?? '',
          // 統一提供 config，供詳情面板顯示
          weight: invRecord.weight ?? '',
          dimensions: {
            length: invRecord.length_cm ?? '',
            width: invRecord.width_cm ?? '',
            height: invRecord.height_cm ?? ''
          },
          config: {
            weight: invRecord.weight ?? '',
            dimensions: {
              length: invRecord.length_cm ?? '',
              width: invRecord.width_cm ?? '',
              height: invRecord.height_cm ?? ''
            },
            isActive: true,
            hsCode: invRecord.hs_code ?? '',
            origin: invRecord.origin ?? '',
            note: invRecord.notes ?? '',
            variantImages
          }
        });
      }
    } else if (prices.length > 0) {
      // 備用：如果沒有庫存記錄，從定價記錄重建變體
      const inventoryMap = new Map(inventory.map(inv => [inv.sku_key, inv]));
      
      for (const priceRecord of prices) {
        const invRecord = inventoryMap.get(priceRecord.sku_key);
        // 從價格記錄重建時，也嘗試建立 path
        const path = [];
        if (invRecord) {
          for (let i = 1; i <= 5; i++) {
            const option = invRecord[`sku_level_${i}_name`] || invRecord[`sku_level_${i}`];
            const level = invRecord[`spec_level_${i}_name`] || (option ? `層級${i}` : null);
            const code = invRecord[`sku_level_${i}`] || '';
            if (option && level) path.push({ level, option, code });
          }
        }
        skuVariants.push({
          sku: priceRecord.sku_key || p.base_sku,
          name: path.length > 0 ? path[path.length - 1].option : (priceRecord.sku_key || p.base_sku),
          path,
          pathDisplay: path.map(p => `${p.level}: ${p.option}`).join(' → '),
          price: priceRecord.sale_price ?? '',
          comparePrice: priceRecord.compare_at_price ?? '',
          costPrice: priceRecord.cost_price ?? '',
          quantity: invRecord?.current_stock_qty ?? '',
          barcode: invRecord?.barcode ?? '',
          hsCode: invRecord?.hs_code ?? '',
          origin: invRecord?.origin ?? '',
          isActive: true,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: invRecord?.low_stock_threshold ?? '',
          weight: invRecord?.weight ?? '',
          dimensions: {
            length: invRecord?.length_cm ?? '',
            width: invRecord?.width_cm ?? '',
            height: invRecord?.height_cm ?? ''
          },
          config: {
            weight: invRecord?.weight ?? '',
            dimensions: {
              length: invRecord?.length_cm ?? '',
              width: invRecord?.width_cm ?? '',
              height: invRecord?.height_cm ?? ''
            },
            isActive: true,
            hsCode: invRecord?.hs_code ?? '',
            origin: invRecord?.origin ?? '',
            note: invRecord?.notes ?? '',
            variantImages: []
          }
        });
      }
    }
    
    // 處理 API 返回的圖片格式 (新的固定10列結構)
    let images = [];
    if (p.photos) {
      // 從backend_products_photo的10列結構轉為圖片陣列
      for (let i = 1; i <= 10; i++) {
        const photoUrl = p.photos[`photo_url_${i}`];
        if (photoUrl) {
          images.push({
            id: `photo_${i}`,
            url: photoUrl,
            name: `image-${i}.jpg`,
            size: 0,
            type: 'image/jpeg'
          });
        }
      }
    } else if (Array.isArray(p.images)) {
      // 舊版本兼容
      images = p.images.map((img, idx) => ({
        id: img.id || Date.now() + idx,
        url: img.url || img,
        name: img.name || `image-${idx}.jpg`,
        size: img.size || 0,
        type: img.type || 'image/jpeg'
      }));
    } else if (p.image) {
      images = [{ 
        id: Date.now(), 
        url: p.image, 
        name: 'cover.jpg', 
        size: 0, 
        type: 'image/jpeg' 
      }];
    }
    
    // SEO 物件（新結構）
    const seo = p.seo || {};
    return {
      name: p.name || '',
      slug: p.slug || '',
      description: p.description || '',
      shortDescription: p.short_description || '',
      // 改為直接使用數字 ID 陣列，交由 CategoryTreeSelector 以後端樹來顯示名稱
      categories: Array.isArray(p.category_ids) ? p.category_ids : [],
      tags: Array.isArray(p.tags) ? p.tags : [],
      price: p.price ?? '',
      comparePrice: p.compare_at_price ?? '',
      costPrice: p.cost_price ?? '',
      profit: p.profit ?? '',
      profitMargin: p.profit_margin ?? '',
      baseSKU: p.base_sku || '',
      hasVariants: p.has_variants || skuVariants.length > 0,
      skuVariants: skuVariants,
      images: images,
      status: p.status || 'draft',
      visibility: p.visibility || 'visible',
      featured: Boolean(p.is_featured),
      metaTitle: seo.meta_title || p.meta_title || '',
      metaDescription: seo.meta_description || p.meta_description || '',
      sitemapIndexing: (seo.sitemap_indexing !== undefined) ? !!seo.sitemap_indexing : (p.sitemap_indexing !== false),
      customCanonicalUrl: seo.custom_canonical_url || p.custom_canonical_url || '',
      openGraphTitle: seo.og_title || p.open_graph_title || '',
      openGraphDescription: seo.og_description || p.open_graph_description || '',
      openGraphImage: seo.og_image_url || p.open_graph_image || '',
      useMetaTitleForOG: (seo.use_meta_title_for_og !== undefined) ? !!seo.use_meta_title_for_og : (p.use_meta_title_for_og !== false),
      useMetaDescriptionForOG: (seo.use_meta_description_for_og !== undefined) ? !!seo.use_meta_description_for_og : (p.use_meta_description_for_og !== false),
      excludeFromSearch: (seo.exclude_from_search !== undefined) ? !!seo.exclude_from_search : !!p.exclude_from_search,
      searchTitle: seo.search_title || p.search_title || '',
      searchDescription: seo.search_description || p.search_description || '',
      searchImage: seo.search_image_url || p.search_image || '',
      useMetaTitleForSearch: (seo.use_meta_title_for_search !== undefined) ? !!seo.use_meta_title_for_search : (p.use_meta_title_for_search !== false),
      useMetaDescriptionForSearch: (seo.use_meta_description_for_search !== undefined) ? !!seo.use_meta_description_for_search : (p.use_meta_description_for_search !== false),
      useOpenGraphImageForSearch: (seo.use_og_image_for_search !== undefined) ? !!seo.use_og_image_for_search : (p.use_open_graph_image_for_search !== false)
    };
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [productData, setProductData] = useState(mapProductToForm(original));
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'warning' });

  // 當 original 改變時更新 productData
  useEffect(() => {
    if (original) {
      setProductData(mapProductToForm(original));
    }
  }, [original, mapProductToForm]);

  const steps = [
    { id: 'basic', title: '基本資訊', description: '設定產品名稱、描述和基礎 SKU', icon: InformationCircleIcon, isCompleted: false },
    { id: 'variants', title: 'SKU 變體管理', description: '設定五層巢狀 SKU 變體和庫存', icon: TagIcon, isCompleted: false },
    { id: 'categories', title: '商品分類', description: '設定商品分類歸屬', icon: TagIcon, isCompleted: false },
    { id: 'media', title: '圖片媒體', description: '上傳產品圖片和媒體', icon: PhotoIcon, isCompleted: false },
    { id: 'seo', title: 'SEO 設定', description: '搜尋引擎優化設定', icon: TagIcon, isCompleted: false }
  ];

  const handleInputChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSEOChange = (field, value) => handleInputChange(field, value);

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...productData.tags, newTag.trim()]);
      setNewTag('');
    }
  };
  const removeTag = (tagToRemove) => handleInputChange('tags', productData.tags.filter(tag => tag !== tagToRemove));

  const handleStepClick = (i) => { setCurrentStep(i); setErrors({}); };

  const _scrollToFirstError = (errorFieldName) => {
    setTimeout(() => {
      const el = document.querySelector(`[name="${errorFieldName}"] , #${errorFieldName}`);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
    }, 100);
  };

  const calculateProfit = () => {
    const price = parseFloat(productData.price) || 0;
    const cost = parseFloat(productData.costPrice) || 0;
    const profit = price - cost;
    const margin = price > 0 ? ((profit / price) * 100).toFixed(2) : 0;
    handleInputChange('profit', profit.toFixed(2));
    handleInputChange('profitMargin', margin);
  };

  const generateSlug = (name) => {
    if (!name) return '';
    return name.toLowerCase().trim()
      .replace(/[\u4e00-\u9fff]/g, (char) => `char-${char.charCodeAt(0)}`)
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
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
      case 'variants':
        if (productData.hasVariants) {
          if ((productData.skuVariants || []).length === 0) newErrors.skuVariants = '請設定至少一個 SKU 變體';
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSave = async () => {
    // 整體驗證
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) { setCurrentStep(i); return; }
    }

    try {
      setAlert({ show: true, type: 'warning', message: '正在保存...' });
      
      // 1. 更新商品基本信息
      // 正規化分類 ID 為數字（後端為 bigint[]）。若沒有有效數字 ID，則不送此欄位。
      const numericCategoryIds = (Array.isArray(productData.categories) ? productData.categories : [])
        .filter((v) => v !== null && v !== undefined && v !== '')
        .map((c) => (c !== null && typeof c === 'object' ? (c.id ?? c.value ?? c) : c))
        .map((v) => (typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v))
        .filter((v) => typeof v === 'number' && Number.isFinite(v));

      const productUpdatePayload = {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        short_description: productData.shortDescription,
        status: productData.status,
        visibility: productData.visibility,
        is_featured: Boolean(productData.featured),
        has_variants: productData.hasVariants,
        base_sku: productData.baseSKU,
        tags: Array.isArray(productData.tags) ? productData.tags : [],
        // SEO 相關字段（這些會在第二步分別更新到 backend_products_seo）
        meta_title: productData.metaTitle,
        meta_description: productData.metaDescription,
        open_graph_title: productData.openGraphTitle,
        open_graph_description: productData.openGraphDescription,
        open_graph_image: productData.openGraphImage,
        search_title: productData.searchTitle,
        search_description: productData.searchDescription,
        search_image: productData.searchImage,
        sitemap_indexing: !!productData.sitemapIndexing,
        custom_canonical_url: productData.customCanonicalUrl || null,
        use_meta_title_for_og: !!productData.useMetaTitleForOG,
        use_meta_description_for_og: !!productData.useMetaDescriptionForOG,
        use_meta_title_for_search: !!productData.useMetaTitleForSearch,
        use_meta_description_for_search: !!productData.useMetaDescriptionForSearch,
        use_og_image_for_search: !!productData.useOpenGraphImageForSearch,
        exclude_from_search: !!productData.excludeFromSearch
      };

      if (numericCategoryIds.length > 0) {
        productUpdatePayload.category_ids = numericCategoryIds;
      }

      // 注意：產品 PATCH 僅允許基本欄位，定價將在後續獨立處理

      const updateRes = await fetch(`/backend/products/${original.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(productUpdatePayload)
      });

      if (!updateRes.ok) {
        let serverMsg = '';
        try { serverMsg = (await updateRes.json())?.error || ''; } catch {}
        throw new Error(`更新商品基本信息失敗${serverMsg ? `：${serverMsg}` : ''}`);
      }

      // 2. 上傳圖片 (批量更新到固定10欄位結構)
      if (productData.images && productData.images.length > 0) {
        const filesToUpload = [];
        const urlsToUpload = [];
        
        // 分離本地文件和已有URL
        for (let i = 0; i < productData.images.length; i++) {
          const img = productData.images[i];
          if (img.file || img instanceof File) {
            filesToUpload.push(img.file || img);
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
            
            const uploadRes = await fetch(`/backend/products/${original.id}/storage-upload`, {
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
          
          const photoRes = await fetch(`/backend/products/${original.id}/photos`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(photoUpdateData)
          });
          
          if (!photoRes.ok) {
            console.warn(`更新商品圖片失敗`);
          }
        }
      }

      // 3. 更新庫存和定價
      if (productData.hasVariants && productData.skuVariants && productData.skuVariants.length > 0) {
        // 刪除舊的庫存和定價記錄
        if (original.inventory && original.inventory.length > 0) {
          for (const inv of original.inventory) {
            await fetch(`/backend/products/${original.id}/inventory/${inv.id}`, {
              method: 'DELETE',
              credentials: 'include'
            }).catch(e => console.warn('刪除舊庫存記錄失敗:', e));
          }
        }
        if (original.prices && original.prices.length > 0) {
          for (const pr of original.prices) {
            await fetch(`/backend/products/${original.id}/prices/${pr.id}`, {
              method: 'DELETE',
              credentials: 'include'
            }).catch(e => console.warn('刪除舊定價記錄失敗:', e));
          }
        }

        // 新增新的庫存和定價記錄
        // 並在建立庫存後，處理變體圖片上傳與回填到 variant photos
        const createdInventoryBySku = new Map();
        for (const variant of productData.skuVariants) {
          if (!variant.isActive) continue;

          // 建立庫存記錄（無條件建立，數量預設 0）
          {
            const invPayload = {
              sku_key: variant.sku || null,
              warehouse: '主倉',
              current_stock_qty: parseInt(variant.quantity) || 0,
              safety_stock_qty: variant.lowStockThreshold ? parseInt(variant.lowStockThreshold) : 10,
              low_stock_threshold: variant.lowStockThreshold ? parseInt(variant.lowStockThreshold) : 5,
              track_inventory: variant.trackQuantity !== false,
              allow_backorder: variant.allowBackorder === true,
              allow_preorder: false,
              barcode: variant.barcode || null,
              hs_code: variant.hsCode || null,
              origin: variant.origin || null,
              weight: variant.weight !== undefined && variant.weight !== '' ? parseFloat(variant.weight) : null,
              length_cm: variant.dimensions?.length ? parseFloat(variant.dimensions.length) : null,
              width_cm: variant.dimensions?.width ? parseFloat(variant.dimensions.width) : null,
              height_cm: variant.dimensions?.height ? parseFloat(variant.dimensions.height) : null
            };

            // 提取5層級SKU資訊
            if (variant.path && Array.isArray(variant.path)) {
              for (let i = 0; i < 5; i++) {
                const pathItem = variant.path[i];
                if (pathItem) {
                  invPayload[`sku_level_${i + 1}`] = pathItem.option || null;
                  invPayload[`sku_level_${i + 1}_name`] = pathItem.option || null;
                  invPayload[`spec_level_${i + 1}_name`] = pathItem.level || null;
                } else {
                  invPayload[`sku_level_${i + 1}`] = null;
                  invPayload[`sku_level_${i + 1}_name`] = null;
                  invPayload[`spec_level_${i + 1}_name`] = null;
                }
              }
            } else {
              // 如果沒有path資訊，初始化所有欄位為null
              for (let i = 0; i < 5; i++) {
                invPayload[`sku_level_${i + 1}`] = null;
                invPayload[`sku_level_${i + 1}_name`] = null;
                invPayload[`spec_level_${i + 1}_name`] = null;
              }
            }

            const invCreateRes = await fetch(`/backend/products/${original.id}/inventory`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(invPayload)
            }).catch(e => console.warn('創建庫存記錄失敗:', e));
            try {
              if (invCreateRes && invCreateRes.ok) {
                const invRow = await invCreateRes.json();
                if (invRow && variant.sku) createdInventoryBySku.set(variant.sku, invRow.id);
              }
            } catch {}
          }

          // 建立定價記錄
          if (variant.price) {
            const pricePayload = {
              sku_key: variant.sku !== productData.baseSKU ? variant.sku : null,
              sale_price: parseFloat(variant.price) || 0,
              compare_at_price: parseFloat(variant.comparePrice) || null,
              cost_price: parseFloat(variant.costPrice) || null
            };

            await fetch(`/backend/products/${original.id}/prices`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(pricePayload)
            }).catch(e => console.warn('創建定價記錄失敗:', e));
          }
          // 變體圖片處理：最多 3 張
          const vImages = Array.isArray(variant.config?.variantImages) ? variant.config.variantImages : [];
          if (vImages.length > 0) {
            const invId = createdInventoryBySku.get(variant.sku);
            if (invId) {
              const finalUrls = [];
              for (const img of vImages.slice(0,3)) {
                if (img?.file) {
                  const fd = new FormData();
                  fd.append('file', img.file);
                  const upRes = await fetch(`/backend/products/${original.id}/variant-photos/${invId}/upload`, {
                    method: 'POST', credentials: 'include', body: fd
                  });
                  if (upRes.ok) { const { url } = await upRes.json(); finalUrls.push(url); }
                } else if (img?.url) {
                  finalUrls.push(img.url);
                }
              }
              const patchBody = {
                variant_photo_url_1: finalUrls[0] || null,
                variant_photo_url_2: finalUrls[1] || null,
                variant_photo_url_3: finalUrls[2] || null
              };
              await fetch(`/backend/products/${original.id}/variant-photos/${invId}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(patchBody)
              }).catch(e => console.warn('更新變體圖片失敗:', e));
            }
          }
        }
      } else if (!productData.hasVariants) {
        // 非變體商品：建立或更新單一庫存和定價記錄
        const baseInventory = original.inventory?.find(inv => !inv.sku_key);
        const basePrice = original.prices?.find(pr => !pr.sku_key);

        // 更新或建立庫存
        if (baseInventory) {
          const invUpdateRes = await fetch(`/backend/products/${original.id}/inventory/${baseInventory.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              current_stock_qty: parseInt(productData.quantity) || 0,
              barcode: productData.barcode || null,
              hs_code: productData.hsCode || null,
              origin: productData.origin || null,
              weight: productData.weight !== undefined && productData.weight !== '' ? parseFloat(productData.weight) : null,
              length_cm: productData.dimensions?.length ? parseFloat(productData.dimensions.length) : null,
              width_cm: productData.dimensions?.width ? parseFloat(productData.dimensions.width) : null,
              height_cm: productData.dimensions?.height ? parseFloat(productData.dimensions.height) : null
            })
          }).catch(e => console.warn('更新庫存記錄失敗:', e));
        }

        // 更新或建立定價
        if (basePrice) {
          await fetch(`/backend/products/${original.id}/prices/${basePrice.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              sale_price: parseFloat(productData.price) || 0,
              compare_at_price: parseFloat(productData.comparePrice) || null,
              cost_price: parseFloat(productData.costPrice) || null
            })
          }).catch(e => console.warn('更新定價記錄失敗:', e));
        }
      }

      setAlert({ show: true, type: 'success', title: '儲存成功', message: `商品「${productData.name}」已更新。` });
      setTimeout(() => navigate('/products'), 1200);
    } catch (e) {
      console.error('保存失敗:', e);
      setAlert({ show: true, type: 'error', title: '儲存失敗', message: e.message || '更新時發生錯誤，請稍後重試。' });
    }
  };

  if (loadingProduct) {
    return (
      <div className={ADMIN_STYLES.pageContainer}>
        <div className={ADMIN_STYLES.contentContainerFluid}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900">正在加載商品信息...</h1>
            <p className="text-gray-600 mt-2">SKU: {sku}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadingError || !original) {
    return (
      <div className={ADMIN_STYLES.pageContainer}>
        <div className={ADMIN_STYLES.contentContainerFluid}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">找不到此商品</h1>
            <p className="text-gray-600 mt-2">SKU: {sku}</p>
            {loadingError && <p className="text-red-600 mt-2">{loadingError}</p>}
            <button onClick={() => navigate('/products')} className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">返回商品列表</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={ADMIN_STYLES.pageContainer}>
  <div className={ADMIN_STYLES.contentContainerFluid}>
        <AlertBox
          show={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          autoClose={alert.type === 'success' ? 3000 : 0}
        />

        {/* 標題與進度 */}
        <div className="mb-8">
          <div className="flex items-center gap-8">
            <div className="w-auto">
              <h1 className="text-3xl font-bold text-gray-900 font-chinese">編輯商品</h1>
              <p className="text-gray-600 font-chinese mt-1">SKU：<span className="font-mono">{productData.baseSKU}</span></p>
              <div className="mt-2">
                <div className="inline-flex items-center px-3 py-1 bg-[#cc824d]/10 text-[#cc824d] rounded-full text-sm font-medium">
                  步驟 {currentStep + 1} / {steps.length}: {steps[currentStep]?.title}
                </div>
              </div>
            </div>
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
            {/* 基本資訊 */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>基本資訊</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">產品名稱 <span className="text-red-500">*</span></label>
                    <input
                      type="text" name="name" id="name" value={productData.name}
                      onChange={(e) => {
                        handleInputChange('name', e.target.value);
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">產品路由 (Slug) <span className="text-red-500">*</span></label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text" name="slug" id="slug" value={productData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
                          className={`${ADMIN_STYLES.input} ${errors.slug ? 'border-red-500' : ''}`}
                          placeholder="product-slug" pattern="[a-z0-9-]+"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <span className="text-xs text-gray-400">/products/</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => handleInputChange('slug', generateSlug(productData.name))}
                        className="px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors" disabled={!productData.name}>
                        自動生成
                      </button>
                    </div>
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                    <p className="mt-1 text-xs text-gray-500">產品網址將是: {window.location.origin}/products/{productData.slug || 'product-slug'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">基礎 SKU <span className="text-red-500">*</span></label>
                    <input type="text" name="baseSKU" id="baseSKU" value={productData.baseSKU}
                      onChange={(e) => handleInputChange('baseSKU', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      className={`${ADMIN_STYLES.input} ${errors.baseSKU ? 'border-red-500' : ''}`} placeholder="例如：iphone" maxLength={20}
                    />
                    {errors.baseSKU && <p className="mt-1 text-sm text-red-600">{errors.baseSKU}</p>}
                    <p className="mt-1 text-xs text-gray-500">基礎 SKU 將作為所有變體的前綴，例如：{productData.baseSKU || 'iphone'}bkpro</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">簡短描述</label>
                    <input type="text" value={productData.shortDescription} onChange={(e) => handleInputChange('shortDescription', e.target.value)} className={ADMIN_STYLES.input} placeholder="一句話描述產品特色" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">產品描述 <span className="text-red-500">*</span></label>
                    <textarea name="description" id="description" value={productData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} className={`${ADMIN_STYLES.input} ${errors.description ? 'border-red-500' : ''}`} placeholder="詳細描述產品功能、特色和使用方法" />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">產品標籤</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {productData.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#cc824d] text-white">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-white hover:text-gray-200"><XMarkIcon className="w-4 h-4" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className={ADMIN_STYLES.input} placeholder="輸入標籤名稱" />
                      <button type="button" onClick={addTag} className={ADMIN_STYLES.btnSecondary}><PlusIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 定價設定 */}
            {/* 變體管理 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>SKU 變體管理</h3>
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center mb-6">
                    <input type="checkbox" id="hasVariants" checked={productData.hasVariants} onChange={(e) => handleInputChange('hasVariants', e.target.checked)} className="h-4 w-4 text-[#cc824d] border-gray-300 rounded focus:ring-[#cc824d]" />
                    <label htmlFor="hasVariants" className="ml-2 text-sm text-gray-700">此產品有多個 SKU 變體 (如不同顏色、尺寸、規格等)</label>
                  </div>
                  {!productData.hasVariants && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <CubeIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-600 mb-2">此商品為單一 SKU 商品</p>
                      <p className="text-sm text-gray-500">如果商品有不同的變體選項，請勾選上方的變體選項</p>
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
                      productId={original?.id}
                    />
                  )}
                  {errors.skuVariants && <p className="mt-1 text-sm text-red-600">{errors.skuVariants}</p>}
                </div>
              </div>
            )}

            {/* 分類 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>商品分類</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">選擇商品分類 (可複選)</label>
                  <CategoryTreeSelector selectedCategories={productData.categories} onChange={(categories) => handleInputChange('categories', categories)} />
                </div>
              </div>
            )}

            {/* 圖片 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>圖片媒體</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">產品圖片</label>
                  <ImageUpload images={productData.images} onChange={(images) => handleInputChange('images', images)} maxImages={10} />
                </div>
              </div>
            )}

            {/* SEO */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className={ADMIN_STYLES.sectionTitle}>SEO 設定</h3>
                <SEOSettings productData={productData} onChange={handleSEOChange} errors={errors} categories={productData.categories} />
              </div>
            )}
          </div>

          {/* 底部操作列 */}
          <div className="border-t border-gray-200 px-8 py-6 flex items-center justify-between bg-gray-50 rounded-b-xl">
            <div className="flex space-x-3">
              <button type="button" onClick={() => navigate('/products')} className={ADMIN_STYLES.btnSecondary}>取消</button>
              {currentStep > 0 && (
                <button type="button" onClick={prevStep} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <ChevronLeftIcon className="w-4 h-4 mr-2" /> 上一步
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">步驟 {currentStep + 1} / {steps.length}</span>
              <div className="flex space-x-3">
                {currentStep < steps.length - 1 ? (
                  <button type="button" onClick={nextStep} className="inline-flex items-center px-6 py-2 bg-[#cc824d] text-white rounded-lg text-sm font-medium hover:bg-[#b86c37] transition-colors shadow-sm">
                    下一步 <ChevronRightIcon className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button type="button" onClick={handleSave} className="inline-flex items-center px-8 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm">
                    <CheckCircleIcon className="w-4 h-4 mr-2" /> 儲存變更
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

export default EditProduct;