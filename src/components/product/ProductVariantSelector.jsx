import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

const ProductVariantSelector = ({ 
  variants = [], 
  onVariantChange, 
  selectedVariants = {},
  language = 'zh-TW' 
}) => {
  const [selections, setSelections] = useState(selectedVariants);
  const [availableOptions, setAvailableOptions] = useState({});

  useEffect(() => {
    // 計算可用選項
    updateAvailableOptions();
    // 動畫效果
    gsap.fromTo(
      '.variant-option',
      { opacity: 0, scale: 0.9 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.3, 
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }
    );
  }, [variants, selections]);

  const updateAvailableOptions = () => {
    const available = {};
    
    variants.forEach(level => {
      available[level.id] = level.options.filter(option => {
        // 檢查這個選項是否與已選擇的其他變體兼容
        return isOptionAvailable(level.id, option.id);
      });
    });
    
    setAvailableOptions(available);
  };

  const isOptionAvailable = (levelId, optionId) => {
    // 簡化邏輯：假設所有組合都可用
    // 實際應用中應該檢查 SKU 庫存
    return true;
  };

  const handleSelectionChange = (levelId, optionId) => {
    const newSelections = {
      ...selections,
      [levelId]: optionId
    };
    
    setSelections(newSelections);
    onVariantChange?.(newSelections);

    // 選擇動畫效果
    gsap.fromTo(
      `[data-option-id="${levelId}-${optionId}"]`,
      { scale: 1 },
      { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 }
    );
  };

  const getDisplayName = (item) => {
    return item.name?.[language] || item.name?.['zh-TW'] || item.name || '';
  };

  if (!variants.length) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 font-chinese">請選擇規格</h3>
      
      {variants.map((level, levelIndex) => (
        <div key={level.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 font-chinese">
              {getDisplayName(level)}
            </label>
            {selections[level.id] && (
              <span className="text-sm text-[#cc824d] font-chinese">
                已選擇: {getDisplayName(
                  level.options.find(opt => opt.id === selections[level.id])
                )}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {(availableOptions[level.id] || level.options).map((option) => {
              const isSelected = selections[level.id] === option.id;
              const isAvailable = isOptionAvailable(level.id, option.id);
              
              return (
                <button
                  key={option.id}
                  data-option-id={`${level.id}-${option.id}`}
                  onClick={() => handleSelectionChange(level.id, option.id)}
                  disabled={!isAvailable}
                  className={`
                    variant-option px-4 py-2 rounded-lg border-2 transition-all duration-200 font-chinese
                    ${isSelected
                      ? 'border-[#cc824d] bg-[#cc824d] text-white shadow-md'
                      : isAvailable
                        ? 'border-gray-300 bg-white text-gray-700 hover:border-[#cc824d] hover:text-[#cc824d]'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                    ${isSelected ? 'transform scale-105' : 'hover:scale-105'}
                  `}
                >
                  {getDisplayName(option)}
                  {!isAvailable && (
                    <span className="ml-1 text-xs">(缺貨)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* 選擇摘要 */}
      {Object.keys(selections).length > 0 && (
        <div className="p-4 bg-[#f5f1e8] rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2 font-chinese">已選擇的規格：</h4>
          <div className="space-y-1">
            {Object.entries(selections).map(([levelId, optionId]) => {
              const level = variants.find(v => v.id === levelId);
              const option = level?.options.find(o => o.id === optionId);
              if (!level || !option) return null;
              
              return (
                <div key={levelId} className="flex justify-between text-sm">
                  <span className="text-gray-600 font-chinese">{getDisplayName(level)}:</span>
                  <span className="font-medium text-[#cc824d] font-chinese">{getDisplayName(option)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector;