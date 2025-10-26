import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StandardTable from "../../components/ui/StandardTable";
import ProductQuickViewModal from "../../components/products/ProductQuickViewModal";
import GlassModal from "../../components/ui/GlassModal";
import NestedSKUManager from "../../components/products/NestedSKUManager";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import IconActionButton from "../../components/ui/IconActionButton.jsx";
import { formatPrice } from "../../../../external_mock/products/mockProductData";
import { ADMIN_STYLES } from "../../Style/adminStyles.js";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [skuManagerOpen, setSkuManagerOpen] = useState(false);
  const [skuManagerTarget, setSkuManagerTarget] = useState(null);
  const [editPriceOpen, setEditPriceOpen] = useState(false);
  const [editPriceItem, setEditPriceItem] = useState(null);
  const [editPriceForm, setEditPriceForm] = useState({});

  // categories
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
      } catch (e) {
        console.warn('載入分類失敗：', e);
        setCategoriesMap({});
      }
    };
    loadCategories();
  }, []);

  // products list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/backend/products', { credentials: 'include' });
        if (!res.ok) throw new Error('加載商品失敗');
        const list = await res.json() || [];
        const withData = await Promise.all(
          list.map(async (product) => {
            try {
              const detailRes = await fetch(`/backend/products/${product.id}`, { credentials: 'include' });
              if (!detailRes.ok) throw new Error('detail failed');
              const detail = await detailRes.json();
              return {
                ...product,
                photos: detail.photos || null,
                prices: detail.prices || [],
                inventory: detail.inventory || []
              };
            } catch (e) {
              const [pricesRes, inventoryRes] = await Promise.all([
                fetch(`/backend/products/${product.id}/prices`, { credentials: 'include' }),
                fetch(`/backend/products/${product.id}/inventory`, { credentials: 'include' })
              ]);
              const prices = pricesRes.ok ? await pricesRes.json() : [];
              const inventory = inventoryRes.ok ? await inventoryRes.json() : [];
              return { ...product, prices: prices || [], inventory: inventory || [] };
            }
          })
        );
        setProducts(withData);
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

  // Helpers: 缺貨/預購計算
  const toNum = (v) => {
    if (typeof v === 'number') return v;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
  };
  const isVariantLow = (inv) => {
    if (!inv) return false;
    const qty = toNum(inv.current_stock_qty);
    const thr = inv.low_stock_threshold === null || inv.low_stock_threshold === undefined ? 0 : toNum(inv.low_stock_threshold);
    return qty <= thr;
  };
  const getOOSState = (product) => {
    const inv = Array.isArray(product?.inventory) ? product.inventory : [];
    const anyLow = inv.some(isVariantLow);
    if (!anyLow) return { text: '正常販售中', color: 'bg-green-100 text-green-800' };
    if (product?.auto_hide_when_oos) return { text: '缺貨自動下架中', color: 'bg-red-100 text-red-800' };
    return { text: '已上架，缺貨中', color: 'bg-yellow-100 text-yellow-800' };
  };
  const getPreorderState = (product) => {
    const enabled = !!product?.enable_preorder;
    if (!enabled) return { text: '—', color: 'bg-gray-100 text-gray-600' };
    const now = new Date();
    const start = product?.preorder_start_at ? new Date(product.preorder_start_at) : null;
    const end = product?.preorder_end_at ? new Date(product.preorder_end_at) : null;
    if (end && now > end) return { text: '預購結束', color: 'bg-gray-100 text-gray-700' };
    if (start && now < start) return { text: '預購待開始', color: 'bg-slate-100 text-slate-700' };
    return { text: '正常預購中', color: 'bg-blue-100 text-blue-800' };
  };

  const mapDetailToQuickView = (detail) => {
    if (!detail) return null;
    const images = [];
    if (detail.photos) {
      for (let i = 1; i <= 10; i++) {
        const url = detail.photos[`photo_url_${i}`];
        if (url) images.push({ id: `photo_${i}`, url, name: `image-${i}.jpg`, size: 0, type: 'image/jpeg' });
      }
    }
    const prices = Array.isArray(detail.prices) ? detail.prices : [];
    const inv = Array.isArray(detail.inventory) ? detail.inventory : [];
    const skuVariants = inv.map(v => {
      const variantImages = [];
      for (let i = 1; i <= 3; i++) {
        const url = v[`variant_photo_url_${i}`];
        if (url) variantImages.push({ url });
      }
      return { id: v.id, sku: v.sku_key, barcode: v.barcode || '', config: { isActive: true, variantImages } };
    });
    const basePrice = prices.find(p => !p.sku_key) || {};
    const seo = detail.seo || {};
    const categoryNames = Array.isArray(detail.category_ids) ? detail.category_ids.map(id => categoriesMap[id]).filter(Boolean) : [];
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
      price: basePrice.sale_price ?? '',
      comparePrice: basePrice.compare_at_price ?? '',
      costPrice: basePrice.cost_price ?? '',
      profit: '',
      profitMargin: '',
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
      const res = await fetch(`/backend/products/${product.id}`, { credentials: 'include' });
      if (res.ok) {
        const detail = await res.json();
        const mapped = mapDetailToQuickView(detail);
        setQuickViewProduct(mapped);
      } else {
        setQuickViewProduct({ id: product.id, name: product.name, slug: product.slug, baseSKU: product.base_sku, status: product.status, visibility: product.visibility, images: [], hasVariants: !!product.has_variants, skuVariants: [] });
      }
    } catch (err) {
      console.error('載入快速檢視資料失敗:', err);
      setQuickViewProduct({ id: product.id, name: product.name, slug: product.slug, baseSKU: product.base_sku, status: product.status, visibility: product.visibility, images: [], hasVariants: !!product.has_variants, skuVariants: [] });
    } finally {
      setQuickViewOpen(true);
    }
  };
  const closeQuickView = () => { setQuickViewOpen(false); setQuickViewProduct(null); };
  const closeSkuManager = () => { setSkuManagerOpen(false); setSkuManagerTarget(null); };

  const handleSkuManagerChange = (newVariants) => {
    if (!skuManagerTarget?.productId) return;
    setProducts(prev => prev.map(p => {
      if (p.id !== skuManagerTarget.productId) return p;
      const merged = Array.isArray(p.skuVariants) ? p.skuVariants.map(v => {
        const updated = (newVariants || []).find(nv => nv.id === v.id || nv.sku === v.sku);
        return updated ? { ...v, ...updated, config: { ...v.config, ...(updated.config || {}) } } : v;
      }) : (newVariants || []);
      return { ...p, skuVariants: merged };
    }));
  };

  const columns = [
    {
      key: 'name',
      label: '商品',
      sortable: true,
      render: (_, product) => {
        let cover = '/placeholder-image.jpg';
        const photos = product?.photos || null;
        if (photos && typeof photos === 'object') {
          for (let i = 1; i <= 10; i++) {
            const u = photos[`photo_url_${i}`];
            if (u) { cover = u; break; }
          }
        }
        return (
          <div className="flex items-center">
            <img src={cover} alt={product?.name || '產品圖片'} className="w-12 h-12 object-cover rounded-lg mr-4" />
            <div>
              <div className="font-medium text-gray-900 font-chinese">{product?.name || '未知商品'}</div>
              <div className="text-sm text-gray-500 font-chinese">SKU: {product?.base_sku || 'N/A'}</div>
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
        const names = Array.isArray(product?.category_ids) ? product.category_ids.map(id => categoriesMap[id]).filter(Boolean) : [];
        const text = names.length ? names.join('、') : '未分類';
        return <span className="inline-flex px-2 py-1 text-xs font-medium bg-apricot-100 text-apricot-800 rounded-full font-chinese">{text}</span>;
      }
    },
    {
      key: 'price',
      label: '價格',
      sortable: true,
      render: () => (<div><div className="text-gray-500">需在編輯頁設定</div></div>)
    },
    { key: 'slug', label: 'Slug', sortable: true, render: (_, p) => (<span className="text-xs text-gray-600">{p?.slug || '-'}</span>) },
    {
      key: 'status', label: '狀態', sortable: true,
      render: (_, product) => {
        const raw = (product?.status || 'draft');
        const map = { active: { text: '上架', color: 'bg-green-100 text-green-800' }, draft: { text: '草稿', color: 'bg-yellow-100 text-yellow-800' }, archived: { text: '封存', color: 'bg-gray-100 text-gray-800' } };
        const { text, color } = map[raw] || map.draft;
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
      }
    },
    {
      key: 'visibility', label: '可見性', sortable: true,
      render: (_, product) => {
        const raw = (product?.visibility || 'visible');
        const map = { visible: { text: '可見', color: 'bg-blue-100 text-blue-800' }, hidden: { text: '隱藏', color: 'bg-gray-100 text-gray-800' } };
        const { text, color } = map[raw] || map.visible;
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
      }
    },
    {
      key: 'oos', label: '缺貨狀態', sortable: false,
      render: (_, product) => {
        const { text, color } = getOOSState(product);
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
      }
    },
    {
      key: 'preorder', label: '預購狀態', sortable: false,
      render: (_, product) => {
        const { text, color } = getPreorderState(product);
        return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
      }
    },
    {
      key: 'actions', label: '操作', sortable: false,
      render: (_, product) => (
        <div className="flex items-center space-x-2">
          <IconActionButton Icon={EyeIcon} label="預覽" variant="blue" onClick={() => openQuickView(product)} />
          <Link to={`/products/edit/${product?.base_sku}`} className="inline-flex"><IconActionButton Icon={PencilIcon} label="編輯" variant="amber" /></Link>
          <IconActionButton Icon={TrashIcon} label="刪除" variant="red" />
        </div>
      )
    }
  ];

  const subColumns = [
    { key: 'photo', label: '圖片', sortable: false, width: 'w-12', render: (_v, row) => {
      const variantImages = row?.config?.variantImages || [];
      const variantCoverFromConfig = (variantImages[0]?.url || variantImages[0]) || null;
      const variantCoverFromInv = row?.variant_photo_url_1 || row?.variant_photo_url_2 || row?.variant_photo_url_3 || null;
      const cover = variantCoverFromConfig || variantCoverFromInv || '/placeholder-image.jpg';
      return (
        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {cover ? (<img src={cover} alt={row?.sku || 'SKU'} className="w-full h-full object-cover" />) : (<span className="text-[10px] text-gray-400">無圖</span>)}
        </div>
      );
    }},
    { key: 'spec', label: '規格', sortable: false, render: (_v, row) => {
      const specs = [];
      for (let i = 1; i <= 5; i++) {
        const name = row[`spec_level_${i}_name`];
        const value = row[`sku_level_${i}_name`];
        if (name && value) specs.push(`${name}: ${value}`);
      }
      return (<div className="text-sm text-gray-900">{specs.length > 0 ? specs.join(' / ') : row?.pathDisplay || '標準規格'}</div>);
    }},
    { key: 'sale_price', label: '售價', sortable: true, render: (v) => (<span className="text-gray-900 font-medium">{typeof v === 'number' ? formatPrice(v) : '-'}</span>) },
    { key: 'compare_at_price', label: '原價', sortable: true, render: (v) => (<span className="text-gray-500 line-through">{typeof v === 'number' ? formatPrice(v) : '-'}</span>) },
    { key: 'gold_member_price', label: '金卡價', sortable: true, render: (v) => (<span className="text-amber-700 font-medium">{typeof v === 'number' ? formatPrice(v) : '-'}</span>) },
    { key: 'silver_member_price', label: '銀卡價', sortable: true, render: (v) => (<span className="text-slate-500 font-medium">{typeof v === 'number' ? formatPrice(v) : '-'}</span>) },
    { key: 'vip_member_price', label: 'VIP價', sortable: true, render: (v) => (<span className="text-purple-700 font-medium">{typeof v === 'number' ? formatPrice(v) : '-'}</span>) },
    { key: 'cost_price', label: '成本', sortable: true, render: (v) => (<span className="text-gray-600 text-sm">{typeof v === 'number' ? formatPrice(v) : '-'}</span>) },
    { key: 'actions', label: '操作', sortable: false, width: 'w-24', render: (_v, priceRecord, _idx, product) => (
      <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => { setEditPriceItem({ ...priceRecord, product }); setEditPriceForm({ sale_price: priceRecord.sale_price, compare_at_price: priceRecord.compare_at_price, gold_member_price: priceRecord.gold_member_price, silver_member_price: priceRecord.silver_member_price, vip_member_price: priceRecord.vip_member_price, cost_price: priceRecord.cost_price, }); setEditPriceOpen(true); }} />
    )}
  ];

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={ADMIN_STYLES.pageTitle}>商品管理</h1>
            <p className={ADMIN_STYLES.pageSubtitle}>管理商品資訊、庫存和雜貨</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/products/add" className="inline-flex items-center px-6 py-3 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b86c37] transition-all duration-200 shadow-md hover:shadow-lg font-chinese">
              <PlusIcon className="w-5 h-5 mr-2" /> 新增商品
            </Link>
          </div>
        </div>

        {error && (<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"><p className="text-red-800 font-chinese">⚠️ {error}</p></div>)}
        {loading && (<div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm p-8 text-center"><p className="text-gray-600 font-chinese">正在加載商品...</p></div>)}

        {!loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
            <StandardTable
              title="商品清單"
              columns={columns}
              data={products}
              exportFileName="products"
              emptyMessage="沒有找到符合條件的商品"
              enableRowExpansion
              getSubRows={(product) => {
                if (product?.inventory && product.inventory.length > 0) {
                  const sourceInv = product.auto_hide_when_oos
                    ? product.inventory.filter(inv => !isVariantLow(inv))
                    : product.inventory;
                  return sourceInv.map(inv => {
                    const priceRecord = product.prices?.find(p => p.sku_key === inv.sku_key) || {};
                    return {
                      id: priceRecord.id || inv.id,
                      sku_key: inv.sku_key,
                      spec: inv.barcode ? `條碼: ${inv.barcode}` : '標準規格',
                      ...inv,
                      ...priceRecord,
                      pathDisplay: [inv.sku_level_1_name, inv.sku_level_2_name, inv.sku_level_3_name, inv.sku_level_4_name, inv.sku_level_5_name].filter(Boolean).join(' / ') || '標準'
                    };
                  });
                }
                if (product?.prices && product.prices.length > 0) {
                  return product.prices.map(p => ({ id: p.id, sku_key: p.sku_key, spec: p.sku_key ? `SKU: ${p.sku_key}` : '標準規格', ...p }));
                }
                return [];
              }}
              subColumns={subColumns}
              renderSubtableHeader={(product) => {
                const totalInv = product?.inventory?.length || 0;
                const hiddenByOOS = product?.auto_hide_when_oos ? (product?.inventory || []).filter(inv => isVariantLow(inv)).length : 0;
                const visibleInv = product?.auto_hide_when_oos ? Math.max(0, totalInv - hiddenByOOS) : totalInv;
                const rowCount = (visibleInv || 0) || (product?.prices?.length || 0);
                return (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">{product?.name || '商品'} 的 SKU 變體定價</div>
                    <div className="flex items-center gap-3">
                      {product?.auto_hide_when_oos && (
                        <span className="text-xs text-red-600">缺貨自動下架：隱藏 {hiddenByOOS} / {totalInv}</span>
                      )}
                      <div className="text-xs text-gray-500">共 {rowCount} 項變體</div>
                    </div>
                  </div>
                );
              }}
              subtableClassName="bg-white/70 rounded-xl"
            />
          </div>
        )}

        <ProductQuickViewModal open={quickViewOpen} onClose={closeQuickView} product={quickViewProduct} />

        <GlassModal
          isOpen={editPriceOpen}
          onClose={() => setEditPriceOpen(false)}
          title={`編輯價格`}
          size="max-w-md"
          contentClass="pt-0"
          actions={[
            { label: '取消', variant: 'secondary', onClick: () => setEditPriceOpen(false) },
            {
              label: '保存',
              onClick: async () => {
                try {
                  const pid = editPriceItem?.product?.id;
                  if (!pid) return;
                  const toNum = (v) => (v === '' || v === undefined || v === null) ? null : Number(v);
                  const payload = {
                    sale_price: toNum(editPriceForm.sale_price),
                    compare_at_price: toNum(editPriceForm.compare_at_price),
                    gold_member_price: toNum(editPriceForm.gold_member_price),
                    silver_member_price: toNum(editPriceForm.silver_member_price),
                    vip_member_price: toNum(editPriceForm.vip_member_price),
                    cost_price: toNum(editPriceForm.cost_price),
                  };
                  const res = await fetch(`/backend/products/${pid}/prices/${editPriceItem.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
                  if (!res.ok) throw new Error('更新失敗');
                  const updated = await res.json();
                  setProducts(prev => prev.map(p => {
                    if (p.id !== pid) return p;
                    const exists = Array.isArray(p.prices) ? p.prices.some(pr => pr.id === updated.id) : false;
                    const prices = exists ? p.prices.map(pr => (pr.id === updated.id ? updated : pr)) : [...(p.prices || []), updated];
                    return { ...p, prices };
                  }));
                  setEditPriceOpen(false);
                } catch (err) {
                  console.error('保存價格失敗:', err);
                }
              }
            }
          ]}
        >
          <div className="space-y-6 p-6">
            {/* 基本價格 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">售價</label>
                <input 
                  type="number" 
                  value={editPriceForm.sale_price ?? ''} 
                  onChange={(e) => setEditPriceForm(prev => ({ ...prev, sale_price: e.target.value }))} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-apricot-500 focus:border-transparent transition-all" 
                  step="0.01"
                  placeholder="1500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">原價</label>
                <input 
                  type="number" 
                  value={editPriceForm.compare_at_price ?? ''} 
                  onChange={(e) => setEditPriceForm(prev => ({ ...prev, compare_at_price: e.target.value }))} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-apricot-500 focus:border-transparent transition-all" 
                  step="0.01"
                  placeholder="1000"
                />
              </div>
            </div>

            {/* 成本 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">成本</label>
                <input 
                  type="number" 
                  value={editPriceForm.cost_price ?? ''} 
                  onChange={(e) => setEditPriceForm(prev => ({ ...prev, cost_price: e.target.value }))} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-apricot-500 focus:border-transparent transition-all" 
                  step="0.01"
                  placeholder="200"
                />
              </div>
            </div>

            {/* 會員價區塊 */}
            <div className="bg-gradient-to-br from-cream-50 to-apricot-50 rounded-xl p-6 border border-apricot-100">
              <h3 className="text-base font-semibold text-gray-800 mb-4 font-chinese">會員價</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">金卡會員價</label>
                  <input 
                    type="number" 
                    value={editPriceForm.gold_member_price ?? ''} 
                    onChange={(e) => setEditPriceForm(prev => ({ ...prev, gold_member_price: e.target.value }))} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
                    step="0.01"
                    placeholder="1400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">銀卡會員價</label>
                  <input 
                    type="number" 
                    value={editPriceForm.silver_member_price ?? ''} 
                    onChange={(e) => setEditPriceForm(prev => ({ ...prev, silver_member_price: e.target.value }))} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all" 
                    step="0.01"
                    placeholder="1300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">VIP 會員價</label>
                  <input 
                    type="number" 
                    value={editPriceForm.vip_member_price ?? ''} 
                    onChange={(e) => setEditPriceForm(prev => ({ ...prev, vip_member_price: e.target.value }))} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                    step="0.01"
                    placeholder="1222"
                  />
                </div>
              </div>
            </div>
          </div>
        </GlassModal>

        <GlassModal isOpen={skuManagerOpen} onClose={closeSkuManager} title={skuManagerTarget ? `管理 SKU - ${skuManagerTarget?.variant?.sku || ''}` : ''} size="max-w-6xl" maxHeight="max-h-[95vh]" contentMaxHeight="max-h-[calc(95vh-80px)]">
          {skuManagerTarget && (
            <div className="p-6">
              <NestedSKUManager baseSKU={skuManagerTarget.product?.baseSKU} skuVariants={[skuManagerTarget.variant]} onChange={handleSkuManagerChange} productName={skuManagerTarget.product?.name || ''} productCategories={skuManagerTarget.product?.categories || []} singleVariant variantSelected={skuManagerTarget.variant} />
            </div>
          )}
        </GlassModal>
      </div>
    </div>
  );
};

export default AdminProducts;
        
