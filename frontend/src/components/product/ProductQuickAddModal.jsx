import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// 移動到 product 資料夾
const ProductQuickAddModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedVariant);
    onClose();
    setQuantity(1);
    setSelectedVariant(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed z-[70] w-full sm:w-[90%] sm:max-w-2xl bottom-0 left-0 right-0 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[75vh] sm:max-h-none flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all" style={{ color: '#666666' }}>
            <XMarkIcon className="w-5 h-5" style={{ strokeWidth: 2 }} />
          </button>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 sm:p-6">
              <div className="relative">
                <div className="rounded-xl overflow-hidden bg-gray-100 aspect-square sm:aspect-square h-48 sm:h-auto">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-medium font-chinese mb-2" style={{ color: '#333333' }}>{product.name}</h3>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-bold font-chinese" style={{ color: '#CC824D' }}>NT$ {product.price?.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-sm line-through" style={{ color: '#999999' }}>NT$ {product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${product.inStock ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{product.inStock ? '有庫存' : '暫時缺貨'}</span>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium font-chinese mb-3" style={{ color: '#666666' }}>選擇規格</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['標準版', '豪華版', '限量版'].map((variant) => (
                      <button key={variant} onClick={() => setSelectedVariant(variant)} className={`px-4 py-2 rounded-lg text-sm font-chinese transition-all ${selectedVariant === variant ? 'bg-primary-btn text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{variant}</button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium font-chinese mb-3" style={{ color: '#666666' }}>數量</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center" style={{ color: '#666666' }}>−</button>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 h-10 text-center border border-gray-300 rounded-lg font-medium" style={{ color: '#333333' }} min="1" />
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center" style={{ color: '#666666' }}>+</button>
                  </div>
                </div>
                <button onClick={handleAddToCart} disabled={!product.inStock} className={`w-full h-12 rounded-full font-chinese text-sm font-medium tracking-wide transition-all ${product.inStock ? 'bg-primary-btn text-white hover:opacity-90' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>{product.inStock ? '加入購物車' : '暫時缺貨'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductQuickAddModal;