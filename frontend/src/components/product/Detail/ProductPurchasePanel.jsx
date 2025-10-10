import { useState } from 'react';
import { gsap } from 'gsap';
import { formatPrice } from '../../../../external_mock/data/format.js';
import { getStockStatus } from '../../../../external_mock/data/stockStatus.js';

const ProductPurchasePanel = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const stock = getStockStatus(product.inStock);

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(quantity);
    gsap.fromTo('.add-to-cart-btn', { scale: 1 }, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-light font-chinese mb-3" style={{color: '#333333', letterSpacing: '-0.01em'}}>
          {product.name}
        </h1>
        {product.categoryNames?.length > 0 && (
          <p className="text-sm font-chinese" style={{color: '#999999'}}>
            {product.categoryNames[product.categoryNames.length - 1]}
          </p>
        )}
      </div>

      <div className="py-4 border-t border-b" style={{borderColor: '#E5E7EB'}}>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl xs:text-3xl font-light font-chinese" style={{color: '#333333'}}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-lg font-chinese line-through" style={{color: '#CCCCCC'}}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="prose max-w-none">
        <p className="font-chinese leading-relaxed text-sm xs:text-base" style={{color: '#666666', lineHeight: '1.8'}}>
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{background: stock.config.dotColor}} />
          <span className="text-sm font-chinese" style={{color: stock.config.color}}>{stock.config.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-chinese" style={{color: '#666666'}}>數量</span>
          <div className="flex items-center border rounded-lg" style={{borderColor: '#E5E7EB'}}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2.5 py-1.5 text-sm font-chinese transition-colors rounded-l-lg"
              style={{color: '#666666'}}
              disabled={quantity <= 1}
              onMouseEnter={(e) => { if (quantity > 1) e.currentTarget.style.background = '#F5F5F5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >−</button>
            <span className="px-3 py-1.5 border-x text-center min-w-[40px] text-sm font-chinese" style={{borderColor: '#E5E7EB', color: '#333333'}}>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-2.5 py-1.5 text-sm font-chinese transition-colors rounded-r-lg"
              style={{color: '#666666'}}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F5F5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >+</button>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`add-to-cart-btn w-full py-3.5 xs:py-4 font-chinese text-sm xs:text-base tracking-wider transition-all duration-300 rounded-lg ${product.inStock ? '' : 'opacity-50 cursor-not-allowed'}`}
          style={{ background: product.inStock ? '#CC824D' : '#CCCCCC', color: '#FFFFFF' }}
          onMouseEnter={(e) => { if (product.inStock) e.currentTarget.style.background = '#B8754A'; }}
          onMouseLeave={(e) => { if (product.inStock) e.currentTarget.style.background = '#CC824D'; }}
        >{product.inStock ? '加入購物車' : '暫時缺貨'}</button>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex-1 py-3.5 xs:py-4 border rounded-lg font-chinese text-sm xs:text-base tracking-wider transition-all duration-300"
            style={{ borderColor: isFavorite ? '#CC824D' : '#E5E7EB', color: isFavorite ? '#CC824D' : '#666666', background: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#CC824D'; e.currentTarget.style.color = '#CC824D'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = isFavorite ? '#CC824D' : '#E5E7EB'; e.currentTarget.style.color = isFavorite ? '#CC824D' : '#666666'; }}
          >{isFavorite ? '已加入收藏' : '加入收藏'}</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPurchasePanel;