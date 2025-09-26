import React, { useMemo, useState } from 'react';
import GlassModal from '../../components/ui/GlassModal';
import TabNavigation from '../../components/ui/TabNavigation';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';
import QRCodeGenerator from '../../components/ui/QRCodeGenerator';

// 輕量的欄位顯示工具
const Field = ({ label, children }) => (
  <div className="grid grid-cols-3 gap-4 py-2">
    <div className="text-sm text-gray-500 font-chinese col-span-1">{label}</div>
    <div className="col-span-2 text-gray-900 text-sm break-words">{children || '-'}</div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h4 className="text-sm font-semibold text-gray-700 mb-3 font-chinese">{title}</h4>
    <div className="bg-white/70 rounded-lg border border-gray-100 p-4">{children}</div>
  </div>
);

const ImageGrid = ({ images = [] }) => {
  if (!images || images.length === 0) return <div className="text-sm text-gray-500">尚未上傳圖片</div>;
  return (
  <div className="grid grid-cols-5 gap-3">
      {images.slice(0, 10).map((img, idx) => (
        <img
          key={idx}
          src={img?.url || img}
          alt={`image-${idx}`}
          className="w-full h-24 object-cover rounded-lg border"
        />
      ))}
    </div>
  );
};

const mapStatus = (raw) => ({
  active: '上架',
  draft: '草稿',
  archived: '封存'
}[raw] || '草稿');

const mapVisibility = (raw) => ({
  visible: '可見',
  hidden: '隱藏'
}[raw] || '可見');

// 將變體的 path 友善格式化，例如：色彩: 黑 / 尺寸: M
const formatVariantPath = (path) => {
  if (!path) return '-';
  if (Array.isArray(path)) {
    return path.map((p) => {
      if (typeof p === 'string') return p;
      if (p && typeof p === 'object') {
        const level = p.level || p.title || p.name || '';
        const option = p.option || p.value || p.name || '';
        return level ? `${level}: ${option}` : (option || '-');
      }
      return String(p);
    }).join(' / ');
  }
  if (typeof path === 'object') {
    // 嘗試常見鍵位
    const arr = path.items || path.path || path.values;
    if (Array.isArray(arr)) return formatVariantPath(arr);
  }
  return String(path);
};

const ProductQuickViewModal = ({ open, onClose, product }) => {
  const [activeKey, setActiveKey] = useState('basic');
  const [qrVariantIndex, setQrVariantIndex] = useState(null);

  const tabs = useMemo(() => ([
    { key: 'basic', label: '基本資訊' },
    { key: 'pricing', label: '定價' },
    { key: 'variants', label: '變體' },
    { key: 'categories', label: '分類' },
    { key: 'media', label: '圖片' },
    { key: 'seo', label: 'SEO' }
  ]), []);

  const cover = product?.image || product?.images?.[0]?.url || '/placeholder-image.jpg';

  return (
    <GlassModal isOpen={open} onClose={onClose} title={`快速檢視：${product?.name || ''}`} size="max-w-5xl">
      {/* 頂部封面 + SKU */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          <img src={cover} alt={product?.name} className="w-16 h-16 rounded-lg object-cover border" />
          <div>
            <div className="text-lg font-bold text-gray-900 font-chinese">{product?.name}</div>
            <div className="text-xs text-gray-600">SKU: <span className="font-mono">{product?.baseSKU}</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t">
        <TabNavigation 
          tabs={tabs}
          mode="controlled"
          activeKey={activeKey}
          onTabChange={(tab) => setActiveKey(tab.key || tab.label)}
          className="px-4"
          layout="left"
        />
      </div>

      {/* 內容 */}
      <div className="px-6 pb-6">
        {activeKey === 'basic' && (
          <div>
            <Section title="基本資訊">
              <Field label="產品名稱">{product?.name}</Field>
              <Field label="Slug">{product?.slug}</Field>
              <Field label="簡短描述">{product?.shortDescription}</Field>
              <Field label="描述">{product?.description}</Field>
              <Field label="標籤">{(product?.tags || []).join('、') || '-'}</Field>
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="text-sm text-gray-500 font-chinese">狀態 / 可見性</div>
                <div className="col-span-2 text-sm text-gray-900">{mapStatus(product?.status)} / {mapVisibility(product?.visibility)}</div>
              </div>
            </Section>
          </div>
        )}

        {activeKey === 'pricing' && (
          <div>
            <Section title="定價資訊">
              <Field label="銷售價格">{product?.price ? `NT$${Number(product.price).toLocaleString()}` : '-'}</Field>
              <Field label="比較價格">{product?.comparePrice ? `NT$${Number(product.comparePrice).toLocaleString()}` : '-'}</Field>
              <Field label="成本價格">{product?.costPrice ? `NT$${Number(product.costPrice).toLocaleString()}` : '-'}</Field>
              <Field label="利潤">{product?.profit ? `NT$${Number(product.profit).toLocaleString()}` : '-'}</Field>
              <Field label="利潤率">{product?.profitMargin ? `${product.profitMargin}%` : '-'}</Field>
            </Section>
          </div>
        )}

        {activeKey === 'variants' && (
          <div>
            <Section title="SKU 變體">
              <Field label="是否多變體">{product?.hasVariants ? '是' : '否'}</Field>
              {product?.hasVariants ? (
                <div className="mt-2">
                  {(product?.skuVariants || []).length === 0 ? (
                    <div className="text-sm text-gray-500">尚未設定變體</div>
                  ) : (
                    <div className="space-y-3">
                      {(product?.skuVariants || []).map((v, idx) => {
                        const variantImages = v?.config?.variantImages || [];
                        const variantImg = (variantImages[0]?.url || variantImages[0]) || (product?.images?.[0]?.url || product?.image);
                        const fullSKU = v.fullSKU || v.sku || `${product?.baseSKU}${v.suffix || ''}`;
                        const salePrice = v.finalPrice ?? v.price ?? v?.config?.price ?? product?.price ?? null;
                        const comparePrice = v.finalComparePrice ?? v.comparePrice ?? v?.config?.comparePrice ?? product?.comparePrice ?? null;
                        const costPrice = v.finalCostPrice ?? v.costPrice ?? v?.config?.costPrice ?? product?.costPrice ?? null;
                        const variantPath = v.path ?? v.variantPath;
                        return (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-start gap-3">
                              <img src={variantImg || '/placeholder-image.jpg'} alt={fullSKU} className="w-14 h-14 rounded object-cover border" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-mono text-[#cc824d] truncate" title={fullSKU}>{fullSKU}</div>
                                  <button
                                    className="text-xs px-2 py-1 rounded border text-[#cc824d] border-[#cc824d] hover:bg-[#cc824d] hover:text-white transition-colors"
                                    onClick={() => setQrVariantIndex(qrVariantIndex === idx ? null : idx)}
                                  >{qrVariantIndex === idx ? '收合 QR' : '生成 QR'}</button>
                                </div>
                                {variantPath && (
                                  <div className="text-xs text-gray-600 mt-1 truncate">路徑：{formatVariantPath(variantPath)}</div>
                                )}
                                {(salePrice != null) && (
                                  <div className="text-xs text-gray-700 mt-1">價格：NT${Number(salePrice).toLocaleString()}</div>
                                )}
                                {(() => {
                                  const qty = v.stock ?? v.quantity ?? v?.config?.quantity;
                                  if (qty === undefined || qty === null || qty === '') return null;
                                  return (
                                    <div className="text-xs text-gray-700 mt-1">庫存：{qty}</div>
                                  );
                                })()}
                              </div>
                            </div>
                            {qrVariantIndex === idx && (
                              <div className="mt-3">
                                <QRCodeGenerator
                                  product={{ name: product?.name, categories: product?.categories, images: product?.images }}
                                  sku={{
                                    sku: fullSKU,
                                    salePrice,
                                    comparePrice,
                                    costPrice,
                                    variantPath,
                                    images: variantImages
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-600">單一 SKU：<span className="font-mono">{product?.baseSKU}</span></div>
              )}
            </Section>
          </div>
        )}

        {activeKey === 'categories' && (
          <div>
            <Section title="分類">
              <Field label="主分類">
                {product?.categories?.length
                  ? product.categories.map(c => c?.name || c).join('、')
                  : (product?.category || '未分類')}
              </Field>
            </Section>
          </div>
        )}

        {activeKey === 'media' && (
          <div>
            <Section title="圖片">
              <ImageGrid images={product?.images} />
            </Section>
          </div>
        )}

        {activeKey === 'seo' && (
          <div>
            <Section title="SEO 與分享">
              <Field label="Meta 標題">{product?.metaTitle}</Field>
              <Field label="Meta 描述">{product?.metaDescription}</Field>
              <Field label="Open Graph 標題">{product?.openGraphTitle || (product?.useMetaTitleForOG ? product?.metaTitle : '')}</Field>
              <Field label="Open Graph 描述">{product?.openGraphDescription || (product?.useMetaDescriptionForOG ? product?.metaDescription : '')}</Field>
              <Field label="搜尋標題">{product?.searchTitle || (product?.useMetaTitleForSearch ? product?.metaTitle : '')}</Field>
              <Field label="搜尋描述">{product?.searchDescription || (product?.useMetaDescriptionForSearch ? product?.metaDescription : '')}</Field>
              <Field label="排除於站內搜尋">{product?.excludeFromSearch ? '是' : '否'}</Field>
              <Field label="Sitemap 索引">{product?.sitemapIndexing ? '是' : '否'}</Field>
              <Field label="自訂 Canonical URL">{product?.customCanonicalUrl || '-'}</Field>
            </Section>
          </div>
        )}
      </div>
    </GlassModal>
  );
};

export default ProductQuickViewModal;
