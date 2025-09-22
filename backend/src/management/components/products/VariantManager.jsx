import React, { useState } from 'react';
import {
  PlusIcon,
  XMarkIcon,
  TrashIcon,
  TagIcon,
  CubeIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';

const VariantManager = ({ hasVariants, variants, onChange }) => {
  const [variantOptions, setVariantOptions] = useState([
    { id: 1, name: '顏色', values: ['紅色', '藍色', '綠色'] },
    { id: 2, name: '尺寸', values: ['S', 'M', 'L', 'XL'] }
  ]);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionValues, setNewOptionValues] = useState('');

  // 生成變體組合
  const generateVariants = (options) => {
    if (options.length === 0) return [];
    
    const combinations = [];
    const generate = (current, remaining) => {
      if (remaining.length === 0) {
        combinations.push(current);
        return;
      }
      
      const [first, ...rest] = remaining;
      first.values.forEach(value => {
        generate([...current, { option: first.name, value }], rest);
      });
    };
    
    generate([], options);
    
    return combinations.map((combo, index) => {
      const variantName = combo.map(c => c.value).join(' / ');
      const sku = combo.map(c => c.value.substring(0, 2).toUpperCase()).join('-');
      
      return {
        id: index + 1,
        name: variantName,
        sku: `VAR-${sku}-${String(index + 1).padStart(3, '0')}`,
        price: '',
        comparePrice: '',
        quantity: '',
        weight: '',
        image: null,
        isActive: true,
        combinations: combo
      };
    });
  };

  const addVariantOption = () => {
    if (!newOptionName.trim() || !newOptionValues.trim()) {
      alert('請填寫選項名稱和值');
      return;
    }

    const values = newOptionValues.split(',').map(v => v.trim()).filter(v => v);
    if (values.length === 0) {
      alert('請至少添加一個選項值');
      return;
    }

    const newOption = {
      id: Date.now(),
      name: newOptionName.trim(),
      values
    };

    const updatedOptions = [...selectedOptions, newOption];
    setSelectedOptions(updatedOptions);
    
    // 生成新的變體組合
    const newVariants = generateVariants(updatedOptions);
    onChange(newVariants);

    setNewOptionName('');
    setNewOptionValues('');
  };

  const removeVariantOption = (optionId) => {
    const updatedOptions = selectedOptions.filter(opt => opt.id !== optionId);
    setSelectedOptions(updatedOptions);
    
    if (updatedOptions.length === 0) {
      onChange([]);
    } else {
      const newVariants = generateVariants(updatedOptions);
      onChange(newVariants);
    }
  };

  const updateVariant = (variantId, field, value) => {
    const updatedVariants = variants.map(variant => 
      variant.id === variantId 
        ? { ...variant, [field]: value }
        : variant
    );
    onChange(updatedVariants);
  };

  const removeVariant = (variantId) => {
    const updatedVariants = variants.filter(variant => variant.id !== variantId);
    onChange(updatedVariants);
  };

  if (!hasVariants) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CubeIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p>此產品沒有變體選項</p>
        <p className="text-sm">如果產品有不同的顏色、尺寸等選項，請在上一步啟用變體功能</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 變體選項設定 */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">變體選項設定</h4>
        
        {/* 已添加的選項 */}
        {selectedOptions.length > 0 && (
          <div className="space-y-3 mb-4">
            {selectedOptions.map(option => (
              <div key={option.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{option.name}:</span>
                  <span className="ml-2 text-gray-600">
                    {option.values.join(', ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariantOption(option.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 添加新選項 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選項名稱 (如：顏色、尺寸)
            </label>
            <input
              type="text"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              className={ADMIN_STYLES.input}
              placeholder="輸入選項名稱"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選項值 (用逗號分隔)
            </label>
            <input
              type="text"
              value={newOptionValues}
              onChange={(e) => setNewOptionValues(e.target.value)}
              className={ADMIN_STYLES.input}
              placeholder="紅色,藍色,綠色"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={addVariantOption}
              className={`${ADMIN_STYLES.btnPrimary} w-full`}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              添加選項
            </button>
          </div>
        </div>
      </div>

      {/* 變體列表 */}
      {variants.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              變體詳細設定 ({variants.length} 個變體)
            </h4>
            <span className="text-sm text-gray-500">
              自動生成的變體組合
            </span>
          </div>

          <div className="space-y-4 max-h-96" style={{overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {variants.map(variant => (
              <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 變體名稱和 SKU */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <div className="font-medium text-gray-900 mb-1">
                      {variant.name}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      SKU: {variant.sku}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.isActive}
                        onChange={(e) => updateVariant(variant.id, 'isActive', e.target.checked)}
                        className="h-4 w-4 text-[#cc824d] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">啟用</span>
                    </div>
                  </div>

                  {/* 價格設定 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      價格
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                      className={`${ADMIN_STYLES.input} text-sm`}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* 庫存數量 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      庫存
                    </label>
                    <input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) => updateVariant(variant.id, 'quantity', e.target.value)}
                      className={`${ADMIN_STYLES.input} text-sm`}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* 重量 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      重量 (g)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={variant.weight}
                        onChange={(e) => updateVariant(variant.id, 'weight', e.target.value)}
                        className={`${ADMIN_STYLES.input} text-sm flex-1`}
                        placeholder="0"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="刪除此變體"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 變體組合顯示 */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {variant.combinations.map((combo, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#cc824d]/10 text-[#cc824d]"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        {combo.option}: {combo.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 批量操作 */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-900 mb-3">批量設定</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  統一價格
                </label>
                <input
                  type="number"
                  className={`${ADMIN_STYLES.input} text-sm`}
                  placeholder="為所有變體設定相同價格"
                  onChange={(e) => {
                    const price = e.target.value;
                    if (price) {
                      const updatedVariants = variants.map(v => ({ ...v, price }));
                      onChange(updatedVariants);
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  統一庫存
                </label>
                <input
                  type="number"
                  className={`${ADMIN_STYLES.input} text-sm`}
                  placeholder="為所有變體設定相同庫存"
                  onChange={(e) => {
                    const quantity = e.target.value;
                    if (quantity) {
                      const updatedVariants = variants.map(v => ({ ...v, quantity }));
                      onChange(updatedVariants);
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  統一重量
                </label>
                <input
                  type="number"
                  className={`${ADMIN_STYLES.input} text-sm`}
                  placeholder="為所有變體設定相同重量"
                  onChange={(e) => {
                    const weight = e.target.value;
                    if (weight) {
                      const updatedVariants = variants.map(v => ({ ...v, weight }));
                      onChange(updatedVariants);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {variants.length === 0 && selectedOptions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <TagIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>開始添加變體選項</p>
          <p className="text-sm">例如：顏色、尺寸、材質等</p>
        </div>
      )}
    </div>
  );
};

export default VariantManager;