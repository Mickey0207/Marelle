import { useState } from 'react';
import { gsap } from 'gsap';
import {
  PlusIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Bars3Icon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const ProductVariantManager = ({ variants, setVariants, onSKUGenerate }) => {
  const [showAddLevel, setShowAddLevel] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [newLevel, setNewLevel] = useState({
    level: 1,
    levelName: { 'zh-TW': '', 'en': '' },
    options: [{ name: { 'zh-TW': '', 'en': '' }, skuCode: '', sortOrder: 1 }]
  });

  // 添加新的變體層級
  const handleAddLevel = () => {
    const nextLevel = variants.length + 1;
    if (nextLevel > 10) {
      alert('最多只能設定10層變體');
      return;
    }

    setNewLevel({
      level: nextLevel,
      levelName: { 'zh-TW': '', 'en': '' },
      options: [{ name: { 'zh-TW': '', 'en': '' }, skuCode: '', sortOrder: 1 }]
    });
    setShowAddLevel(true);
  };

  // 保存變體層級
  const handleSaveLevel = () => {
    // 驗證必填欄位
    if (!newLevel.levelName['zh-TW'] || !newLevel.levelName['en']) {
      alert('請填寫完整的層級名稱');
      return;
    }

    // 驗證選項
    for (const option of newLevel.options) {
      if (!option.name['zh-TW'] || !option.name['en'] || !option.skuCode) {
        alert('請填寫完整的選項資訊');
        return;
      }
    }

    // 檢查SKU代碼重複
    const skuCodes = newLevel.options.map(opt => opt.skuCode);
    const duplicates = skuCodes.filter((code, index) => skuCodes.indexOf(code) !== index);
    if (duplicates.length > 0) {
      alert('SKU代碼不能重複');
      return;
    }

    // 添加到變體列表
    const updatedVariants = [...variants, {
      ...newLevel,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }];
    
    setVariants(updatedVariants);
    setShowAddLevel(false);
    
    // 觸發SKU重新生成
    if (onSKUGenerate) {
      onSKUGenerate(updatedVariants);
    }
  };

  // 添加選項到當前層級
  const handleAddOption = () => {
    const newOption = {
      name: { 'zh-TW': '', 'en': '' },
      skuCode: '',
      sortOrder: newLevel.options.length + 1
    };
    
    setNewLevel(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }));
  };

  // 移除選項
  const handleRemoveOption = (optionIndex) => {
    if (newLevel.options.length <= 1) {
      alert('至少需要一個選項');
      return;
    }
    
    setNewLevel(prev => ({
      ...prev,
      options: prev.options.filter((_, index) => index !== optionIndex)
    }));
  };

  // 更新選項資料
  const handleOptionChange = (optionIndex, field, value) => {
    setNewLevel(prev => ({
      ...prev,
      options: prev.options.map((option, index) => {
        if (index === optionIndex) {
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            return {
              ...option,
              [parent]: {
                ...option[parent],
                [child]: value
              }
            };
          }
          return { ...option, [field]: value };
        }
        return option;
      })
    }));
  };

  // 移動層級順序
  const handleMoveLevel = (levelId, direction) => {
    const currentIndex = variants.findIndex(v => v.id === levelId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === variants.length - 1)
    ) {
      return;
    }

    const newVariants = [...variants];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newVariants[currentIndex], newVariants[targetIndex]] = 
    [newVariants[targetIndex], newVariants[currentIndex]];

    // 更新level編號
    newVariants.forEach((variant, index) => {
      variant.level = index + 1;
    });

    setVariants(newVariants);
    
    if (onSKUGenerate) {
      onSKUGenerate(newVariants);
    }
  };

  // 刪除變體層級
  const handleDeleteLevel = (levelId) => {
    if (confirm('確定要刪除這個變體層級嗎？這將會影響所有相關的SKU。')) {
      const updatedVariants = variants.filter(v => v.id !== levelId)
        .map((variant, index) => ({ ...variant, level: index + 1 }));
      
      setVariants(updatedVariants);
      
      if (onSKUGenerate) {
        onSKUGenerate(updatedVariants);
      }
    }
  };

  return (
    <div className="variant-manager space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 font-chinese">變體管理</h3>
        <button
          type="button"
          onClick={handleAddLevel}
          className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors font-chinese flex items-center"
          disabled={variants.length >= 10}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          新增變體層級
        </button>
      </div>

      {/* 現有變體層級列表 */}
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div key={variant.id} className="glass rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 font-chinese">
                第{variant.level}層：{variant.levelName['zh-TW']} / {variant.levelName['en']}
              </h4>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleMoveLevel(variant.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-[#cc824d] disabled:opacity-50"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveLevel(variant.id, 'down')}
                  disabled={index === variants.length - 1}
                  className="p-1 text-gray-400 hover:text-[#cc824d] disabled:opacity-50"
                >
                  <ArrowDownIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingLevel(variant)}
                  className="p-1 text-gray-400 hover:text-blue-500"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLevel(variant.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {variant.options.map((option, optionIndex) => (
                <div key={optionIndex} className="p-3 border rounded-lg bg-white/50">
                  <div className="text-sm font-medium text-gray-700 font-chinese mb-1">
                    {option.name['zh-TW']} / {option.name['en']}
                  </div>
                  <div className="text-xs text-gray-500 font-chinese">
                    SKU: {option.skuCode}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 新增變體層級模態框 */}
      {showAddLevel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 font-chinese">
                新增變體層級 - 第{newLevel.level}層
              </h3>
              <button
                type="button"
                onClick={() => setShowAddLevel(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 層級名稱 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    層級名稱 (中文) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newLevel.levelName['zh-TW']}
                    onChange={(e) => setNewLevel(prev => ({
                      ...prev,
                      levelName: { ...prev.levelName, 'zh-TW': e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese"
                    placeholder="例如：顏色"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                    層級名稱 (英文) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newLevel.levelName['en']}
                    onChange={(e) => setNewLevel(prev => ({
                      ...prev,
                      levelName: { ...prev.levelName, 'en': e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                    placeholder="e.g., Color"
                  />
                </div>
              </div>

              {/* 選項列表 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 font-chinese">變體選項</h4>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="px-3 py-1 text-sm bg-[#cc824d] text-white rounded hover:bg-[#b3723f] transition-colors font-chinese flex items-center"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    新增選項
                  </button>
                </div>

                <div className="space-y-3">
                  {newLevel.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                      <Bars3Icon className="w-4 h-4 text-gray-400" />
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                        <input
                          type="text"
                          value={option.name['zh-TW']}
                          onChange={(e) => handleOptionChange(index, 'name.zh-TW', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese"
                          placeholder="選項名稱 (中文)"
                        />
                        <input
                          type="text"
                          value={option.name['en']}
                          onChange={(e) => handleOptionChange(index, 'name.en', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                          placeholder="Option Name (English)"
                        />
                        <input
                          type="text"
                          value={option.skuCode}
                          onChange={(e) => handleOptionChange(index, 'skuCode', e.target.value.toUpperCase())}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                          placeholder="SKU代碼"
                          maxLength="10"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="p-2 text-red-500 hover:text-red-700 rounded"
                        disabled={newLevel.options.length <= 1}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddLevel(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-chinese"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveLevel}
                  className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] transition-colors font-chinese"
                >
                  保存層級
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantManager;