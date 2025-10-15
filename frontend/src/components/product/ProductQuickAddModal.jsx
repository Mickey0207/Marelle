import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import VariantTreeSelector from './Detail/VariantTreeSelector.jsx';

// 移動到 product 資料夾
const ProductQuickAddModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  // 五層規格選擇狀態
  const [variantState, setVariantState] = useState({ path: [], isComplete: false, leaf: undefined });
  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
    if (hasVariants && (!variantState.isComplete || !variantState.leaf)) return;
    const payloadProduct = hasVariants ? { ...product, variant: variantState.leaf } : product;
    onAddToCart(payloadProduct, quantity, variantState.leaf);
    onClose();
    setQuantity(1);
    setVariantState({ path: [], isComplete: false, leaf: undefined });
  };

  // 當 modal 關閉時重置狀態
  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setVariantState({ path: [], isComplete: false, leaf: undefined });
    }
  }, [isOpen]);

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const effectivePrice = hasVariants ? (variantState.leaf?.payload?.price ?? product.price) : product.price;
  const effectiveInStock = hasVariants
    ? (variantState.isComplete ? ((variantState.leaf?.payload?.stock ?? 0) > 0) : true)
    : product.inStock;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full sm:w-[90%] sm:max-w-2xl max-h-[85vh] flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all" style={{ color: '#666666' }}>
            <XMarkIcon className="w-5 h-5" style={{ strokeWidth: 2 }} />
          </button>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-0 px-5 sm:px-6 pb-6 mt-6">
              <div className="relative">
                <div className="rounded-xl overflow-hidden bg-gray-100 aspect-square sm:aspect-square h-48 sm:h-auto">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-medium font-chinese mb-2" style={{ color: '#333333' }}>{product.name}</h3>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-bold font-chinese" style={{ color: '#CC824D' }}>NT$ {effectivePrice?.toLocaleString()}</span>
                  {product.originalPrice && !hasVariants && (
                    <span className="text-sm line-through" style={{ color: '#999999' }}>NT$ {product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${effectiveInStock ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{effectiveInStock ? '有庫存' : '暫時缺貨'}</span>
                </div>
                {hasVariants && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium font-chinese mb-3" style={{ color: '#666666' }}>選擇規格</label>
                    <VariantTreeSelector
                      data={product.variants}
                      maxDepth={5}
                      onChange={setVariantState}
                      labels={["顏色", "尺寸", "內頁", "封面", "包裝"]}
                      renderSelect={({ level, options, value, onChange, disabled, label }) => (
                        <div className="flex flex-col gap-2 mb-2">
                          {label && (
                            <div className="text-xs font-chinese text-gray-500">{label}</div>
                          )}
                          <div className="flex flex-wrap gap-3">
                            {options.map(opt => {
                              const selected = value === opt.id;
                              const isDisabled = disabled;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => onChange(opt.id)}
                                  disabled={isDisabled}
                                  className={`px-3 py-2 rounded-lg text-sm font-chinese border transition-colors ${
                                    selected
                                      ? 'border-[#CC824D] text-[#CC824D] bg-white'
                                      : 'border-[#E5E7EB] text-[#666666] bg-[#F7F8FA]'
                                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  onMouseEnter={(e) => { if (!selected && !isDisabled) { e.currentTarget.style.background = '#F0F2F5'; } }}
                                  onMouseLeave={(e) => { if (!selected && !isDisabled) { e.currentTarget.style.background = '#F7F8FA'; } }}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}
                <div className="mb-6">
                  <label className="block text-sm font-medium font-chinese mb-3" style={{ color: '#666666' }}>數量</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center" style={{ color: '#666666' }}>−</button>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 h-10 text-center border border-gray-300 rounded-lg font-medium" style={{ color: '#333333' }} min="1" />
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center" style={{ color: '#666666' }}>+</button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!effectiveInStock || (hasVariants && !variantState.isComplete)}
                  className={`w-full h-12 rounded-full font-chinese text-sm font-medium tracking-wide transition-all ${(!effectiveInStock || (hasVariants && !variantState.isComplete)) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary-btn text-white hover:opacity-90'}`}
                >
                  {effectiveInStock ? (hasVariants && !variantState.isComplete ? '請選擇完整規格' : '加入購物車') : '暫時缺貨'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductQuickAddModal;