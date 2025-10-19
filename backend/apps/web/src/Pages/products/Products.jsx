import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import StandardTable from "../../components/ui/StandardTable";
import ProductQuickViewModal from "../../components/products/ProductQuickViewModal";
import GlassModal from "../../components/ui/GlassModal";
import NestedSKUManager from "../../components/products/NestedSKUManager";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  
} from '@heroicons/react/24/outline';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import IconActionButton from "../../components/ui/IconActionButton.jsx";
// 改用擴充後的模擬商品資料（包含新增/編輯頁完整欄位）
import { formatPrice } from "../../../../external_mock/products/mockProductData";
import { ADMIN_STYLES } from "../../Style/adminStyles.js";
// withPageTabs HOC 已移除，子頁籤導航統一在頂部管理

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesMap, setCategoriesMap] = useState({}); // id -> breadcrumb name
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [skuManagerOpen, setSkuManagerOpen] = useState(false);
  const [skuManagerTarget, setSkuManagerTarget] = useState(null); // { productId, product, variant }
  const [editPriceOpen, setEditPriceOpen] = useState(false);
  const [editPriceItem, setEditPriceItem] = useState(null);
  const [editPriceForm, setEditPriceForm] = useState({});

  // 載入分類並建立映射表（id -> 母/子麵包屑名稱）
  useEffect(() => {
    const buildMap = (nodes, path = [], acc = {}) => {
      (nodes || []).forEach(n => {
        const namePath = [...path, n.name].filter(Boolean);
        acc[n.id] = namePath.join(' / ');
        if (n.children && n.children.length) buildMap(n.children, namePath, acc);
      });
      return acc;
    };
    const loadCategories = async () => {
      try {
        const res = await fetch('/backend/categories', { credentials: 'include' });
        if (!res.ok) throw new Error('分類加載失敗');
        const tree = await res.json();
        setCategoriesMap(buildMap(Array.isArray(tree) ? tree : []));
        setCategoriesLoaded(true);
      } catch (e) {
        console.warn('載入分類失敗：', e);
        setCategoriesMap({});
        setCategoriesLoaded(true);
      }
    };
    loadCategories();
  }, []);

  // 加載商品列表及其價格和庫存信息
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/backend/products', {
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error('加載商品失敗');
        }
        
        const products = await res.json() || [];
        
        // 為每個商品加載價格和庫存數據
        const productsWithData = await Promise.all(
          products.map(async (product) => {
            try {
              const [pricesRes, inventoryRes] = await Promise.all([
                fetch(`/backend/products/${product.id}/prices`, { credentials: 'include' }),
                fetch(`/backend/products/${product.id}/inventory`, { credentials: 'include' })
              ]);
              
              const prices = pricesRes.ok ? await pricesRes.json() : [];
              const inventory = inventoryRes.ok ? await inventoryRes.json() : [];
              
              return {
                ...product,
                prices: prices || [],
                inventory: inventory || []
              };
            } catch (err) {
              console.warn(`加載商品 ${product.id} 的價格/庫存失敗:`, err);
              return {
                ...product,
                prices: [],
                inventory: []
              };
            }
          })
        );
        
        setProducts(productsWithData);
        setError(null);
      } catch (err) {
        console.error('加載商品列表失敗:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // 將 /backend/products/:id 詳細資料映射為 QuickView 需要的欄位形狀
  const mapDetailToQuickView = (detail) => {
    if (!detail) return null;
    // 圖片：從 backend_products_photo 的 10 欄組成陣列
    const images = [];
    if (detail.photos) {
      for (let i = 1; i <= 10; i++) {
        const url = detail.photos[`photo_url_${i}`];
        if (url) images.push({ id: `photo_${i}`, url, name: `image-${i}.jpg`, size: 0, type: 'image/jpeg' });
      }
    }

    // 變體：優先使用 inventory，並合併 prices
    const prices = Array.isArray(detail.prices) ? detail.prices : [];
    const inventory = Array.isArray(detail.inventory) ? detail.inventory : [];
    const priceMap = new Map(prices.map(pr => [pr.sku_key, pr]));
    const bySku = new Map();
    for (const inv of inventory) {
      const key = inv.sku_key || null;
      if (!bySku.has(key)) bySku.set(key, inv);
    }
    const skuVariants = [];
    for (const [skuKey, inv] of bySku.entries()) {
      if (!skuKey) continue; // 排除非變體基底（null）
      const price = priceMap.get(skuKey);
      const path = [];
      for (let i = 1; i <= 5; i++) {
        const option = inv[`sku_level_${i}_name`] || inv[`sku_level_${i}`];
        const level = inv[`spec_level_${i}_name`] || (option ? `層級${i}` : null);
        const code = inv[`sku_level_${i}`] || '';
        if (option && level) path.push({ level, option, code });
      }
      skuVariants.push({
        sku: skuKey,
        fullSKU: skuKey,
        name: path.length ? path[path.length - 1].option : skuKey,
        path,
        pathDisplay: path.map(p => `${p.level}: ${p.option}`).join(' / '),
        price: price?.sale_price ?? '',
        comparePrice: price?.compare_at_price ?? '',
        costPrice: price?.cost_price ?? '',
        quantity: inv?.current_stock_qty ?? '',
        barcode: inv?.barcode ?? '',
        config: {
          isActive: true,
          variantImages: []
        }
      });
    }

    // 單一 SKU 的價格：從 sku_key 為 null 的價格列取值
    const basePrice = prices.find(p => !p.sku_key) || {};

    // SEO 映射
    const seo = detail.seo || {};

    // 分類名稱（母/子麵包屑），多分類以陣列呈現
    const categoryNames = Array.isArray(detail.category_ids)
      ? detail.category_ids.map(id => categoriesMap[id]).filter(Boolean)
      : [];

    return {
      id: detail.id,
      name: detail.name || '',
      slug: detail.slug || '',
      description: detail.description || '',
      shortDescription: detail.short_description || '',
      tags: Array.isArray(detail.tags) ? detail.tags : [],
      baseSKU: detail.base_sku || '',
      status: detail.status || 'draft',
      visibility: detail.visibility || 'visible',
      hasVariants: !!detail.has_variants,
      skuVariants,
      images,
      categories: categoryNames,
      // 頁面頂部「定價」分頁使用的欄位（若為多變體，主價可能為空）
      price: basePrice.sale_price ?? '',
      comparePrice: basePrice.compare_at_price ?? '',
      costPrice: basePrice.cost_price ?? '',
      profit: '',
      profitMargin: '',
      // SEO
      metaTitle: seo.meta_title || '',
      metaDescription: seo.meta_description || '',
      openGraphTitle: seo.og_title || '',
      openGraphDescription: seo.og_description || '',
      openGraphImage: seo.og_image_url || '',
      useMetaTitleForOG: seo.use_meta_title_for_og !== false,
      useMetaDescriptionForOG: seo.use_meta_description_for_og !== false,
      searchTitle: seo.search_title || '',
      searchDescription: seo.search_description || '',
      searchImage: seo.search_image_url || '',
      useMetaTitleForSearch: seo.use_meta_title_for_search !== false,
      useMetaDescriptionForSearch: seo.use_meta_description_for_search !== false,
      useOpenGraphImageForSearch: seo.use_og_image_for_search !== false,
      excludeFromSearch: !!seo.exclude_from_search,
      sitemapIndexing: seo.sitemap_indexing !== false,
      customCanonicalUrl: seo.custom_canonical_url || ''
    };
  };

  const openQuickView = async (product) => {
    try {
      // 以詳細端點獲取完整資訊（含 photos、seo、inventory、prices）
      const res = await fetch(`/backend/products/${product.id}`, { credentials: 'include' });
      if (res.ok) {
        const detail = await res.json();
        const mapped = mapDetailToQuickView(detail);
        setQuickViewProduct(mapped);
      } else {
        // 後援：若失敗，用列表中的資料盡量填充
        setQuickViewProduct({
          id: product.id,
          name: product.name,
          slug: product.slug,
          baseSKU: product.base_sku,
          status: product.status,
          visibility: product.visibility,
          images: [],
          hasVariants: !!product.has_variants,
          skuVariants: [],
        });
      }
    } catch (err) {
      console.error('載入快速檢視資料失敗:', err);
      setQuickViewProduct({
        id: product.id,
        name: product.name,
        slug: product.slug,
        baseSKU: product.base_sku,
        status: product.status,
        visibility: product.visibility,
        images: [],
        hasVariants: !!product.has_variants,
        skuVariants: [],
      });
    } finally {
      setQuickViewOpen(true);
    }
  };
  const closeQuickView = () => {
    setQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // 開啟單一 SKU 管理彈窗
  const openSkuManager = (product, variant) => {
    setSkuManagerTarget({
      productId: product?.id,
      product,
      variant
    });
    setSkuManagerOpen(true);
  };

  const closeSkuManager = () => {
    setSkuManagerOpen(false);
    setSkuManagerTarget(null);
  };

  // 當 NestedSKUManager 變更時合併回產品列表（用 id 對應）
  const handleSkuManagerChange = (newVariants) => {
    if (!skuManagerTarget?.productId) return;
  // merge variants back to product list
    setProducts(prev => prev.map(p => {
      if (p.id !== skuManagerTarget.productId) return p;
      const merged = Array.isArray(p.skuVariants) ? p.skuVariants.map(v => {
        const updated = (newVariants || []).find(nv => nv.id === v.id || nv.sku === v.sku);
        return updated ? { ...v, ...updated, config: { ...v.config, ...(updated.config || {}) } } : v;
      }) : (newVariants || []);
      return { ...p, skuVariants: merged };
    }));
  };

  // 已移除母表格中的庫存欄位

  // 表格欄位定義
  const columns = [
    {
      key: 'name',
      label: '商品',
      sortable: true,
      render: (_, product) => {
        // 從 photos 陣列找主圖，否則用第一張
        const photos = product?.photos || [];
        const primaryPhoto = photos.find(p => p.is_primary);
        const cover = primaryPhoto?.image_url || photos[0]?.image_url || '/placeholder-image.jpg';
        return (
          <div className="flex items-center">
            <img
              src={cover}
              alt={product?.name || '產品圖片'}
              className="w-12 h-12 object-cover rounded-lg mr-4"
            />
            <div>
              <div className="font-medium text-gray-900 font-chinese">
                {product?.name || '未知商品'}
              </div>
              <div className="text-sm text-gray-500 font-chinese">
                SKU: {product?.base_sku || 'N/A'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'category',
      label: '類別',
      sortable: true,
      render: (_, product) => {
        const names = Array.isArray(product?.category_ids)
          ? product.category_ids.map(id => categoriesMap[id]).filter(Boolean)
          : [];
        const text = names.length ? names.join('、') : '未分類';
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium bg-apricot-100 text-apricot-800 rounded-full font-chinese">
            {text}
          </span>
        );
      }
    },
    {
      key: 'price',
      label: '價格',
      sortable: true,
      render: (_, product) => (
        <div>
          <div className="text-gray-500">
            需在編輯頁設定
          </div>
        </div>
      )
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: true,
      render: (_, product) => (
        <span className="text-xs text-gray-600">{product?.slug || '-'}</span>
      )
    },
    {
      key: 'status',
      label: '狀態',
      sortable: true,
      render: (_, product) => {
        const raw = (product?.status || 'draft');
        const map = {
          active: { text: '上架', color: 'bg-green-100 text-green-800' },
          draft: { text: '草稿', color: 'bg-yellow-100 text-yellow-800' },
          archived: { text: '封存', color: 'bg-gray-100 text-gray-800' }
        };
        const { text, color } = map[raw] || map.draft;
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
      }
    },
    {
      key: 'visibility',
      label: '可見性',
      sortable: true,
      render: (_, product) => {
        const raw = (product?.visibility || 'visible');
        const map = {
          visible: { text: '可見', color: 'bg-blue-100 text-blue-800' },
          hidden: { text: '隱藏', color: 'bg-gray-100 text-gray-800' }
        };
        const { text, color } = map[raw] || map.visible;
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
      }
    },
    // 移除：SKU、庫存狀態、多變體、評分 欄位
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      render: (_, product) => (
        <div className="flex items-center space-x-2">
          <IconActionButton Icon={EyeIcon} label="預覽" variant="blue" onClick={() => openQuickView(product)} />
          <Link to={`/products/edit/${product?.base_sku}`} className="inline-flex">
            <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" />
          </Link>
          <IconActionButton Icon={TrashIcon} label="刪除" variant="red" />
        </div>
      )
    }
  ];

  // 子表格欄位（SKU/變體價格清單）
  const subColumns = [
    {
      key: 'photo',
      label: '圖片',
      sortable: false,
      width: 'w-12',
      render: (_v, row) => {
        const variantImages = row?.config?.variantImages || [];
        const variantCover = (variantImages[0]?.url || variantImages[0]) || null;
        const cover = variantCover || '/placeholder-image.jpg';
        return (
          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
            {cover ? (
              <img src={cover} alt={row?.sku || 'SKU'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-gray-400">無圖</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'spec',
      label: '規格',
      sortable: false,
      render: (_v, row) => {
        // 從5層級SKU構建規格顯示
        const specs = [];
        for (let i = 1; i <= 5; i++) {
          const name = row[`spec_level_${i}_name`];
          const value = row[`sku_level_${i}_name`];
          if (name && value) {
            specs.push(`${name}: ${value}`);
          }
        }
        return (
          <div className="text-sm text-gray-900">
            {specs.length > 0 ? specs.join(' / ') : row?.pathDisplay || '標準規格'}
          </div>
        );
      }
    },
    {
      key: 'sale_price',
      label: '售價',
      sortable: true,
      render: (v) => (
        <span className="text-gray-900 font-medium">{typeof v === 'number' ? formatPrice(v) : '-'}</span>
      )
    },
    {
      key: 'compare_at_price',
      label: '原價',
      sortable: true,
      render: (v) => (
        <span className="text-gray-500 line-through">{typeof v === 'number' ? formatPrice(v) : '-'}</span>
      )
    },
    {
      key: 'gold_member_price',
      label: '金卡價',
      sortable: true,
      render: (v) => (
        <span className="text-amber-700 font-medium">{typeof v === 'number' ? formatPrice(v) : '-'}</span>
      )
    },
    {
      key: 'silver_member_price',
      label: '銀卡價',
      sortable: true,
      render: (v) => (
        <span className="text-slate-500 font-medium">{typeof v === 'number' ? formatPrice(v) : '-'}</span>
      )
    },
    {
      key: 'vip_member_price',
      label: 'VIP價',
      sortable: true,
      render: (v) => (
        <span className="text-purple-700 font-medium">{typeof v === 'number' ? formatPrice(v) : '-'}</span>
      )
    },
    {
      key: 'cost_price',
      label: '成本',
      sortable: true,
      render: (v) => (
        <span className="text-gray-600 text-sm">{typeof v === 'number' ? formatPrice(v) : '-'}</span>
      )
    },
    {
      key: 'actions',
      label: '操作',
      sortable: false,
      width: 'w-24',
      render: (_v, priceRecord, _idx, product) => (
        <IconActionButton
          Icon={PencilIcon}
          label="編輯"
          variant="amber"
          onClick={() => {
            setEditPriceItem({ ...priceRecord, product });
            setEditPriceForm({
              sale_price: priceRecord.sale_price,
              compare_at_price: priceRecord.compare_at_price,
              gold_member_price: priceRecord.gold_member_price,
              silver_member_price: priceRecord.silver_member_price,
              vip_member_price: priceRecord.vip_member_price,
              cost_price: priceRecord.cost_price,
            });
            setEditPriceOpen(true);
          }}
        />
      )
    },
  ];

  return (
    <div className={ADMIN_STYLES.pageContainer}>
  <div className={ADMIN_STYLES.contentContainerFluid}>
        {/* Header */}
  <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={ADMIN_STYLES.pageTitle}>商品管理</h1>
            <p className={ADMIN_STYLES.pageSubtitle}>
              管理商品資訊、庫存和雜貨
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              to="/products/add"
              className="inline-flex items-center px-6 py-3 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b86c37] transition-all duration-200 shadow-md hover:shadow-lg font-chinese"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              新增商品
            </Link>
          </div>
        </div>

        {/* 錯誤提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-chinese">⚠️ {error}</p>
          </div>
        )}

        {/* 加載狀態 */}
        {loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm p-8 text-center">
            <p className="text-gray-600 font-chinese">正在加載商品...</p>
          </div>
        )}

        {/* Products Table */}
        {!loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
            <StandardTable 
              title="商品清單"
              columns={columns}
              data={products}
              exportFileName="products"
              emptyMessage="沒有找到符合條件的商品"
              // 啟用子表格：顯示商品的所有SKU變體定價
              enableRowExpansion
              getSubRows={(product) => {
                // 如果有inventory數據，則以inventory記錄作為基礎（包含SKU層級信息）
                // 然後從prices表中匹配對應的價格
                if (product?.inventory && product.inventory.length > 0) {
                  return product.inventory.map(inv => {
                    // 找到對應的prices記錄
                    const priceRecord = product.prices?.find(p => p.sku_key === inv.sku_key) || {};
                    return {
                      id: inv.id,
                      sku_key: inv.sku_key,
                      spec: inv.barcode ? `條碼: ${inv.barcode}` : '標準規格',
                      ...inv,
                      ...priceRecord,
                      pathDisplay: [
                        inv.sku_level_1_name,
                        inv.sku_level_2_name,
                        inv.sku_level_3_name,
                        inv.sku_level_4_name,
                        inv.sku_level_5_name
                      ].filter(Boolean).join(' / ') || '標準'
                    };
                  });
                }
                
                // 如果沒有inventory數據但有prices數據，則直接使用prices
                if (product?.prices && product.prices.length > 0) {
                  return product.prices.map(p => ({
                    id: p.id,
                    sku_key: p.sku_key,
                    spec: p.sku_key ? `SKU: ${p.sku_key}` : '標準規格',
                    ...p
                  }));
                }
                
                // 如果都沒有，返回空陣列
                return [];
              }}
              subColumns={subColumns}
              renderSubtableHeader={(product) => {
                const rowCount = (product?.inventory?.length || 0) || (product?.prices?.length || 0);
                return (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {product?.name || '商品'} 的 SKU 變體定價
                    </div>
                    <div className="text-xs text-gray-500">
                      共 {rowCount} 項變體
                    </div>
                  </div>
                );
              }}
              subtableClassName="bg-white/70 rounded-xl"
            />
          </div>
        )}

        {/* 快速檢視彈窗 */}
        <ProductQuickViewModal 
          open={quickViewOpen}
          onClose={closeQuickView}
          product={quickViewProduct}
        />

        {/* 編輯價格彈窗 */}
        <GlassModal
          isOpen={editPriceOpen}
          onClose={() => setEditPriceOpen(false)}
          title={`編輯價格`}
          size="max-w-md"
          contentClass="pt-0"
          actions={[
            {
              label: '取消',
              variant: 'secondary',
              onClick: () => setEditPriceOpen(false)
            },
            {
              label: '保存',
              onClick: async () => {
                try {
                  const response = await fetch(
                    `/backend/products/${editPriceItem.product.id}/prices/${editPriceItem.id}`,
                    {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({
                        sale_price: Number(editPriceForm.sale_price),
                        compare_at_price: Number(editPriceForm.compare_at_price),
                        gold_member_price: Number(editPriceForm.gold_member_price),
                        silver_member_price: Number(editPriceForm.silver_member_price),
                        vip_member_price: Number(editPriceForm.vip_member_price),
                        cost_price: Number(editPriceForm.cost_price),
                      })
                    }
                  );

                  if (response.ok) {
                    // 更新本地數據
                    const updatedData = await response.json();
                    setProducts(prev => prev.map(p => {
                      if (p.id !== editPriceItem.product.id) return p;
                      return {
                        ...p,
                        prices: p.prices.map(pr => pr.id === editPriceItem.id ? updatedData : pr)
                      };
                    }));
                    setEditPriceOpen(false);
                  } else {
                    console.error('更新失敗');
                  }
                } catch (err) {
                  console.error('保存價格失敗:', err);
                }
              }
            }
          ]}
        >
          <div className="p-6 space-y-4">
            <div className="bg-white/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 font-chinese">定價</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-chinese">售價</label>
                  <input
                    type="number"
                    value={editPriceForm.sale_price ?? ''}
                    onChange={(e) => setEditPriceForm(prev => ({ ...prev, sale_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-chinese">原價</label>
                  <input
                    type="number"
                    value={editPriceForm.compare_at_price ?? ''}
                    onChange={(e) => setEditPriceForm(prev => ({ ...prev, compare_at_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-chinese">成本</label>
                  <input
                    type="number"
                    value={editPriceForm.cost_price ?? ''}
                    onChange={(e) => setEditPriceForm(prev => ({ ...prev, cost_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 font-chinese">會員價</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-chinese">金卡會員價</label>
                  <input
                    type="number"
                    value={editPriceForm.gold_member_price ?? ''}
                    onChange={(e) => setEditPriceForm(prev => ({ ...prev, gold_member_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-chinese">銀卡會員價</label>
                  <input
                    type="number"
                    value={editPriceForm.silver_member_price ?? ''}
                    onChange={(e) => setEditPriceForm(prev => ({ ...prev, silver_member_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-chinese">VIP 會員價</label>
                  <input
                    type="number"
                    value={editPriceForm.vip_member_price ?? ''}
                    onChange={(e) => setEditPriceForm(prev => ({ ...prev, vip_member_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        </GlassModal>

        {/* 單一 SKU 管理彈窗（使用 NestedSKUManager + GlassModal） */}
        <GlassModal
          isOpen={skuManagerOpen}
          onClose={closeSkuManager}
          title={skuManagerTarget ? `管理 SKU - ${skuManagerTarget?.variant?.sku || ''}` : ''}
          size="max-w-6xl"
          maxHeight="max-h-[95vh]"
          contentMaxHeight="max-h-[calc(95vh-80px)]"
        >
          {skuManagerTarget && (
            <div className="p-6">
              <NestedSKUManager
                baseSKU={skuManagerTarget.product?.baseSKU}
                skuVariants={[skuManagerTarget.variant]}
                onChange={handleSkuManagerChange}
                productName={skuManagerTarget.product?.name || ''}
                productCategories={skuManagerTarget.product?.categories || []}
                singleVariant
                variantSelected={skuManagerTarget.variant}
              />
            </div>
          )}
        </GlassModal>
      </div>
    </div>
  );
};

export default AdminProducts;
