import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { formatPrice } from '../utils/data';

const DynamicPriceDisplay = ({ 
  basePrice, 
  originalPrice, 
  selectedVariants = {}, 
  memberTier = 'regular',
  showMemberPrices = false 
}) => {
  const [currentPrice, setCurrentPrice] = useState(basePrice);
  const [currentOriginalPrice, setCurrentOriginalPrice] = useState(originalPrice);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    updatePrice();
  }, [selectedVariants, basePrice, originalPrice, memberTier]);

  const updatePrice = async () => {
    setPriceLoading(true);
    
    // 模擬價格計算動畫
    gsap.to('.price-container', {
      opacity: 0.5,
      duration: 0.2,
      onComplete: () => {
        // 計算變體價格調整
        let priceAdjustment = 0;
        let originalPriceAdjustment = 0;
        
        // 這裡應該根據選擇的變體計算價格調整
        Object.values(selectedVariants).forEach(variantId => {
          // 模擬變體價格調整
          priceAdjustment += Math.random() * 100 - 50; // 隨機調整 -50 到 +50
        });
        
        // 應用會員折扣
        let memberDiscount = 1;
        switch(memberTier) {
          case 'bronze':
            memberDiscount = 0.95; // 5% 折扣
            break;
          case 'silver':
            memberDiscount = 0.9; // 10% 折扣
            break;
          case 'gold':
            memberDiscount = 0.85; // 15% 折扣
            break;
          default:
            memberDiscount = 1;
        }
        
        const newPrice = Math.max(0, (basePrice + priceAdjustment) * memberDiscount);
        const newOriginalPrice = originalPrice ? (originalPrice + originalPriceAdjustment) : null;
        
        setCurrentPrice(newPrice);
        setCurrentOriginalPrice(newOriginalPrice);
        
        // 恢復透明度並添加彈跳動畫
        gsap.to('.price-container', {
          opacity: 1,
          duration: 0.3,
          ease: 'back.out(1.7)',
          onComplete: () => {
            setPriceLoading(false);
            // 價格變化高亮動畫
            gsap.fromTo('.current-price', 
              { scale: 1 },
              { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }
            );
          }
        });
      }
    });
  };

  const getSavingsAmount = () => {
    if (!currentOriginalPrice) return 0;
    return currentOriginalPrice - currentPrice;
  };

  const getSavingsPercentage = () => {
    if (!currentOriginalPrice) return 0;
    return Math.round((getSavingsAmount() / currentOriginalPrice) * 100);
  };

  const getMemberTierName = (tier) => {
    const names = {
      regular: '一般會員',
      bronze: '銅牌會員',
      silver: '銀牌會員',
      gold: '黃金會員'
    };
    return names[tier] || '一般會員';
  };

  return (
    <div className="space-y-4">
      {/* 主要價格顯示 */}
      <div className="price-container space-y-2">
        <div className="flex items-center space-x-4">
          <span className="current-price text-3xl font-bold text-[#cc824d]">
            {formatPrice(currentPrice)}
          </span>
          {currentOriginalPrice && currentOriginalPrice > currentPrice && (
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(currentOriginalPrice)}
            </span>
          )}
          {priceLoading && (
            <div className="w-6 h-6 border-2 border-[#cc824d] border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
        
        {/* 折扣顯示 */}
        {getSavingsAmount() > 0 && (
          <div className="flex items-center space-x-2">
            <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full font-chinese">
              省 {formatPrice(getSavingsAmount())}
            </span>
            <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full font-chinese">
              {getSavingsPercentage()}% OFF
            </span>
          </div>
        )}
        
        {/* 會員價格顯示 */}
        {memberTier !== 'regular' && (
          <div className="text-sm text-[#cc824d] font-chinese">
            🎖️ {getMemberTierName(memberTier)}專享價
          </div>
        )}
      </div>
      
      {/* 會員價格對比 */}
      {showMemberPrices && (
        <div className="p-4 bg-gradient-to-r from-[#f5f1e8] to-[#faf8f3] rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3 font-chinese">會員專享價格</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { tier: 'bronze', discount: 0.95, name: '銅牌會員' },
              { tier: 'silver', discount: 0.9, name: '銀牌會員' },
              { tier: 'gold', discount: 0.85, name: '黃金會員' }
            ].map(({ tier, discount, name }) => {
              const memberPrice = basePrice * discount;
              const isCurrentTier = memberTier === tier;
              
              return (
                <div 
                  key={tier}
                  className={`p-2 rounded-lg ${
                    isCurrentTier 
                      ? 'bg-[#cc824d] text-white' 
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <div className="font-medium font-chinese">{name}</div>
                  <div className="text-lg font-bold">
                    {formatPrice(memberPrice)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* 價格說明 */}
      <div className="text-xs text-gray-500 font-chinese">
        <p>※ 價格可能因選擇的規格而有所調整</p>
        {memberTier !== 'regular' && (
          <p>※ 已套用會員折扣，結帳時將以此價格計算</p>
        )}
      </div>
    </div>
  );
};

export default DynamicPriceDisplay;