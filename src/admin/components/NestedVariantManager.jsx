import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CogIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const NestedVariantManager = ({ variants, setVariants, skuPrefix, basePrice, onSKUUpdate }) => {
  const [expandedVariants, setExpandedVariants] = useState({});
  const [skuCombinations, setSkuCombinations] = useState([]);

  // 生成所有SKU組合
  const generateSKUCombinations = () => {
    if (variants.length === 0) return [];

    const combinations = [];
    
    const generateCombinations = (index, currentCombination) => {
      if (index === variants.length) {
        // 生成SKU編碼
        const skuParts = currentCombination.map(item => item.sku || item.value.substring(0, 2).toUpperCase());
        const sku = `${skuPrefix || 'PRD'}-${skuParts.join('-')}`;
        
        combinations.push({
          id: `${sku}-${Date.now()}-${Math.random()}`,
          sku,
          combination: [...currentCombination],
          prices: {
            costPrice: parseFloat(basePrice?.costPrice) || 0,
            originalPrice: parseFloat(basePrice?.originalPrice) || 0,
            salePrice: parseFloat(basePrice?.salePrice) || 0,
            bronzePrice: parseFloat(basePrice?.bronzePrice) || 0,
            silverPrice: parseFloat(basePrice?.silverPrice) || 0,
            goldPrice: parseFloat(basePrice?.goldPrice) || 0,
          },
          stock: 0,
          images: []
        });
        return;
      }

      const variant = variants[index];
      variant.values.forEach(value => {
        generateCombinations(index + 1, [...currentCombination, {
          variantName: variant.name,
          value: value.value,
          sku: value.sku
        }]);
      });
    };

    if (variants.length > 0) {
      generateCombinations(0, []);
    }

    return combinations;
  };

  useEffect(() => {
    const newCombinations = generateSKUCombinations();
    setSkuCombinations(newCombinations);
    
    // 通知父元件SKU更新
    if (onSKUUpdate) {
      onSKUUpdate(newCombinations);
    }
  }, [variants, skuPrefix, basePrice]);

  useEffect(() => {
    // 當SKU組合變更時，通知父元件
    if (onSKUUpdate) {
      onSKUUpdate(skuCombinations);
    }
  }, [skuCombinations]);

  const addVariant = () => {
    const newVariant = {
      id: Date.now(),
      name: '',
      values: [{ id: Date.now(), value: '', sku: '' }]
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (variantId) => {
    setVariants(variants.filter(v => v.id !== variantId));
  };

  const updateVariant = (variantId, field, value) => {
    setVariants(variants.map(v => 
      v.id === variantId ? { ...v, [field]: value } : v
    ));
  };

  const addVariantValue = (variantId) => {
    setVariants(variants.map(v => 
      v.id === variantId 
        ? { 
            ...v, 
            values: [...v.values, { id: Date.now(), value: '', sku: '' }] 
          }
        : v
    ));
  };

  const removeVariantValue = (variantId, valueId) => {
    setVariants(variants.map(v => 
      v.id === variantId 
        ? { 
            ...v, 
            values: v.values.filter(val => val.id !== valueId) 
          }
        : v
    ));
  };

  const updateVariantValue = (variantId, valueId, field, value) => {
    setVariants(variants.map(v => 
      v.id === variantId 
        ? { 
            ...v, 
            values: v.values.map(val => 
              val.id === valueId ? { ...val, [field]: value } : val
            ) 
          }
        : v
    ));
  };

  const toggleVariantExpanded = (variantId) => {
    setExpandedVariants(prev => ({
      ...prev,
      [variantId]: !prev[variantId]
    }));
  };

  const updateSKUPrice = (skuId, priceType, value) => {
    setSkuCombinations(prev => prev.map(sku => 
      sku.id === skuId 
        ? { 
            ...sku, 
            prices: { 
              ...sku.prices, 
              [priceType]: parseFloat(value) || 0 
            } 
          }
        : sku
    ));
  };

  const updateSKUStock = (skuId, value) => {
    setSkuCombinations(prev => prev.map(sku => 
      sku.id === skuId 
        ? { ...sku, stock: parseInt(value) || 0 }
        : sku
    ));
  };

  const copyPriceToAll = (priceType, value) => {
    setSkuCombinations(prev => prev.map(sku => ({
      ...sku,
      prices: {
        ...sku.prices,
        [priceType]: parseFloat(value) || 0
      }
    })));
  };

  return (
    <div className="space-y-6">
      {/* 變體屬性設定 */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold font-chinese flex items-center">
            <CogIcon className="w-5 h-5 mr-2 text-amber-500" />
            變體屬性設定
          </h3>
          <button
            type="button"
            onClick={addVariant}
            className="btn btn-primary flex items-center text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            新增變體屬性
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((variant, variantIndex) => (
            <div key={variant.id} className="border border-gray-200 rounded-xl p-4 bg-white/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-sm font-medium text-gray-500 font-chinese">
                    第{variantIndex + 1}層
                  </span>
                  <input
                    type="text"
                    placeholder="變體名稱 (例如: 顏色、尺寸)"
                    className="input flex-1"
                    value={variant.name}
                    onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => toggleVariantExpanded(variant.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    {expandedVariants[variant.id] ? 
                      <ChevronDownIcon className="w-4 h-4" /> : 
                      <ChevronRightIcon className="w-4 h-4" />
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    className="p-2 text-red-400 hover:text-red-600 rounded-lg"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {(expandedVariants[variant.id] !== false) && (
                <div className="space-y-3 pl-4">
                  {variant.values.map((value, valueIndex) => (
                    <div key={value.id} className="flex items-center space-x-3">
                      <span className="text-xs text-gray-400 w-8">
                        {valueIndex + 1}.
                      </span>
                      <input
                        type="text"
                        placeholder="選項名稱"
                        className="input flex-1"
                        value={value.value}
                        onChange={(e) => updateVariantValue(variant.id, value.id, 'value', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="SKU代碼"
                        className="input w-24 text-center font-mono text-sm"
                        value={value.sku}
                        onChange={(e) => updateVariantValue(variant.id, value.id, 'sku', e.target.value.toUpperCase())}
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantValue(variant.id, value.id)}
                        className="p-2 text-red-400 hover:text-red-600 rounded-lg"
                        disabled={variant.values.length <= 1}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addVariantValue(variant.id)}
                    className="flex items-center text-sm text-amber-600 hover:text-amber-700 font-chinese"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    新增選項
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {variants.length === 0 && (
          <div className="text-center py-8 text-gray-500 font-chinese">
            <CogIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>尚未設定任何變體屬性</p>
            <p className="text-sm">點擊上方按鈕開始新增變體屬性</p>
          </div>
        )}
      </div>

      {/* SKU 組合管理 */}
      {skuCombinations.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-chinese flex items-center">
              <TagIcon className="w-5 h-5 mr-2 text-amber-500" />
              SKU 組合管理
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({skuCombinations.length} 個組合)
              </span>
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 font-chinese">批量操作:</span>
              <button
                type="button"
                onClick={() => {
                  const price = prompt('請輸入要套用到所有SKU的成本價:');
                  if (price !== null) copyPriceToAll('costPrice', price);
                }}
                className="btn btn-secondary text-xs"
              >
                <DocumentDuplicateIcon className="w-3 h-3 mr-1" />
                批量成本價
              </button>
              <button
                type="button"
                onClick={() => {
                  const price = prompt('請輸入要套用到所有SKU的售價:');
                  if (price !== null) copyPriceToAll('salePrice', price);
                }}
                className="btn btn-secondary text-xs"
              >
                <DocumentDuplicateIcon className="w-3 h-3 mr-1" />
                批量售價
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold font-chinese">SKU</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold font-chinese">變體組合</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold font-chinese">成本價</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold font-chinese">原價</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold font-chinese">售價</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold font-chinese">銅卡價</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold font-chinese">銀卡價</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold font-chinese">金卡價</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold font-chinese">庫存</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {skuCombinations.map((sku) => (
                  <tr key={sku.id} className="hover:bg-white/30">
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {sku.sku}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {sku.combination.map((combo, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="text-gray-500 font-chinese">{combo.variantName}:</span>
                            <span className="ml-1 font-medium font-chinese">{combo.value}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="input w-20 text-sm"
                        placeholder="0"
                        value={sku.prices.costPrice}
                        onChange={(e) => updateSKUPrice(sku.id, 'costPrice', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="input w-20 text-sm"
                        placeholder="0"
                        value={sku.prices.originalPrice}
                        onChange={(e) => updateSKUPrice(sku.id, 'originalPrice', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="input w-20 text-sm"
                        placeholder="0"
                        value={sku.prices.salePrice}
                        onChange={(e) => updateSKUPrice(sku.id, 'salePrice', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="input w-20 text-sm"
                        placeholder="0"
                        value={sku.prices.bronzePrice}
                        onChange={(e) => updateSKUPrice(sku.id, 'bronzePrice', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="input w-20 text-sm"
                        placeholder="0"
                        value={sku.prices.silverPrice}
                        onChange={(e) => updateSKUPrice(sku.id, 'silverPrice', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="input w-20 text-sm"
                        placeholder="0"
                        value={sku.prices.goldPrice}
                        onChange={(e) => updateSKUPrice(sku.id, 'goldPrice', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="input w-16 text-sm"
                        placeholder="0"
                        value={sku.stock}
                        onChange={(e) => updateSKUStock(sku.id, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NestedVariantManager;