import { useEffect } from 'react';

const ProductImageGallery = ({ images = [], selectedIndex, onPrev, onNext }) => {
  useEffect(() => {
    // 可在此加入獨立動畫或觀測
  }, [selectedIndex]);

  if (!images.length) return null;

  return (
    <div className="sticky top-24">
      <div className="aspect-square overflow-hidden bg-white rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl mb-4 relative group">
        <img src={images[selectedIndex]} alt="product" className="w-full h-full object-cover" />
        <button
          onClick={onPrev}
          className="absolute left-0 top-0 w-1/2 h-full cursor-pointer transition-all duration-300"
          style={{ background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          aria-label="上一張圖片"
        />
        <button
          onClick={onNext}
          className="absolute right-0 top-0 w-1/2 h-full cursor-pointer transition-all duration-300"
          style={{ background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(to left, rgba(0,0,0,0.1), transparent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          aria-label="下一張圖片"
        />
      </div>
      <div className="w-full h-1 rounded-full" style={{background: '#F5F5F5'}}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ background: '#CC824D', width: `${((selectedIndex + 1) / images.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;