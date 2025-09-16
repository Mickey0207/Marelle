import { useState, useEffect } from 'react';
import {
  CogIcon,
  QrCodeIcon,
  PhotoIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ProductSKUManager = ({ variants, skus, setSKUs, formData }) => {
  const [loading, setLoading] = useState(false);
  const [selectedSKUs, setSelectedSKUs] = useState([]);

  // 生成所有可能的SKU組合
  const generateAllSKUCombinations = (variants) => {
    if (variants.length === 0) return [];

    const combinations = [];
    
    // 遞歸生成所有組合
    const generateCombinations = (currentCombination, remainingLevels) => {
      if (remainingLevels.length === 0) {
        combinations.push(currentCombination);
        return;
      }

      const currentLevel = remainingLevels[0];
      const nextLevels = remainingLevels.slice(1);

      currentLevel.options.forEach(option => {
        generateCombinations(
          [...currentCombination, {
            levelId: currentLevel.id,
            level: currentLevel.level,
            levelName: currentLevel.levelName,
            optionName: option.name,
            skuCode: option.skuCode
          }],
          nextLevels
        );
      });
    };

    generateCombinations([], variants);
    return combinations;
  };

  // 生成SKU代碼
  const generateSKUCode = (combination) => {
    let sku = formData.skuPrefix || 'PRD';
    combination.forEach(variant => {
      sku += variant.skuCode;
    });
    return sku;
  };

  // 自動生成所有SKU
  const handleGenerateAllSKUs = () => {
    if (variants.length === 0) {
      alert('請先設定變體層級');
      return;
    }

    if (!formData.skuPrefix) {
      alert('請先設定SKU前綴');
      return;
    }

    setLoading(true);

    try {
      const combinations = generateAllSKUCombinations(variants);
      const newSKUs = combinations.map((combination, index) => ({
        id: Date.now() + index,
        sku: generateSKUCode(combination),
        variantPath: combination,
        
        // 價格設定 (繼承基礎價格)
        costPrice: formData.baseCostPrice || null,
        originalPrice: formData.baseOriginalPrice || null,
        salePrice: formData.baseSalePrice || null,
        bronzePrice: formData.baseBronzePrice || null,
        silverPrice: formData.baseSilverPrice || null,
        goldPrice: formData.baseGoldPrice || null,
        
        // 其他設定
        imageUrl: null,
        qrCodeUrl: null,
        isActive: true,
        stock: 0,
        
        createdAt: new Date().toISOString()
      }));

      setSKUs(newSKUs);
      alert(`成功生成 ${newSKUs.length} 個SKU`);
    } catch (error) {
      console.error('生成SKU失敗:', error);
      alert('生成SKU失敗');
    } finally {
      setLoading(false);
    }
  };

  // 更新單個SKU
  const handleUpdateSKU = (skuId, field, value) => {
    setSKUs(prevSKUs => 
      prevSKUs.map(sku => 
        sku.id === skuId 
          ? { ...sku, [field]: value, updatedAt: new Date().toISOString() }
          : sku
      )
    );
  };

  // 批量更新選中的SKU
  const handleBulkUpdate = (field, value) => {
    if (selectedSKUs.length === 0) {
      alert('請先選擇要更新的SKU');
      return;
    }

    setSKUs(prevSKUs => 
      prevSKUs.map(sku => 
        selectedSKUs.includes(sku.id)
          ? { ...sku, [field]: value, updatedAt: new Date().toISOString() }
          : sku
      )
    );
    
    setSelectedSKUs([]);
  };

  // 生成QR Code
  const handleGenerateQRCode = (skuId) => {
    const sku = skus.find(s => s.id === skuId);
    if (!sku) return;

    // 模擬QR Code生成
    const qrData = {
      type: 'sku_info',
      sku: sku.sku,
      productName: formData.name['zh-TW'] || formData.name['en'],
      variantPath: sku.variantPath,
      price: sku.originalPrice || formData.baseOriginalPrice
    };

    // 這裡會調用實際的QR Code生成API
    const qrCodeUrl = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="white"/>
        <text x="50" y="50" font-family="Arial" font-size="8" text-anchor="middle" fill="black">
          QR Code
          ${sku.sku}
        </text>
      </svg>
    `)}`;

    handleUpdateSKU(skuId, 'qrCodeUrl', qrCodeUrl);
  };

  // 格式化變體路徑顯示
  const formatVariantPath = (variantPath) => {
    return variantPath.map(variant => 
      `${variant.levelName['zh-TW']}: ${variant.optionName['zh-TW']}`
    ).join(' / ');
  };

  // 處理圖片上傳
  const handleImageUpload = (skuId, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleUpdateSKU(skuId, 'imageUrl', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sku-manager space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 font-chinese">SKU 管理</h3>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleGenerateAllSKUs}
            disabled={loading || variants.length === 0}
            className="px-4 py-2 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] disabled:opacity-50 transition-colors font-chinese flex items-center"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <CogIcon className="w-4 h-4 mr-2" />
                自動生成SKU
              </>
            )}
          </button>
        </div>
      </div>

      {/* 批量操作工具欄 */}
      {selectedSKUs.length > 0 && (
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-chinese">
              已選擇 {selectedSKUs.length} 個SKU
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="批量設定原價"
                className="px-3 py-1 text-sm border rounded focus:ring-2 focus:ring-[#cc824d] focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleBulkUpdate('originalPrice', parseFloat(e.target.value));
                    e.target.value = '';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setSelectedSKUs([])}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-chinese"
              >
                取消選擇
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SKU 列表 */}
      <div className="glass rounded-lg overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">{/* 允許垂直溢出以顯示下拉選單 */}
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#cc824d] to-[#b3723f] text-white">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSKUs(skus.map(sku => sku.id));
                      } else {
                        setSelectedSKUs([]);
                      }
                    }}
                    checked={selectedSKUs.length === skus.length && skus.length > 0}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left font-chinese">SKU代碼</th>
                <th className="px-4 py-3 text-left font-chinese">變體組合</th>
                <th className="px-4 py-3 text-left font-chinese">成本價</th>
                <th className="px-4 py-3 text-left font-chinese">原價</th>
                <th className="px-4 py-3 text-left font-chinese">優惠價</th>
                <th className="px-4 py-3 text-left font-chinese">銅牌價</th>
                <th className="px-4 py-3 text-left font-chinese">銀牌價</th>
                <th className="px-4 py-3 text-left font-chinese">黃金價</th>
                <th className="px-4 py-3 text-left font-chinese">圖片</th>
                <th className="px-4 py-3 text-left font-chinese">QR Code</th>
                <th className="px-4 py-3 text-left font-chinese">狀態</th>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku, index) => (
                <tr key={sku.id} className={`border-t ${index % 2 === 0 ? 'bg-white/50' : 'bg-white/30'}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedSKUs.includes(sku.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSKUs([...selectedSKUs, sku.id]);
                        } else {
                          setSelectedSKUs(selectedSKUs.filter(id => id !== sku.id));
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-sm font-medium">
                    {sku.sku}
                  </td>
                  <td className="px-4 py-3 text-sm font-chinese">
                    {formatVariantPath(sku.variantPath)}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sku.costPrice || ''}
                      onChange={(e) => handleUpdateSKU(sku.id, 'costPrice', e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-20 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sku.originalPrice || ''}
                      onChange={(e) => handleUpdateSKU(sku.id, 'originalPrice', e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-20 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sku.salePrice || ''}
                      onChange={(e) => handleUpdateSKU(sku.id, 'salePrice', e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-20 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sku.bronzePrice || ''}
                      onChange={(e) => handleUpdateSKU(sku.id, 'bronzePrice', e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-20 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sku.silverPrice || ''}
                      onChange={(e) => handleUpdateSKU(sku.id, 'silverPrice', e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-20 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={sku.goldPrice || ''}
                      onChange={(e) => handleUpdateSKU(sku.id, 'goldPrice', e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-20 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#cc824d] focus:border-transparent"
                      placeholder="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {sku.imageUrl ? (
                        <img src={sku.imageUrl} alt="SKU" className="w-8 h-8 object-cover rounded" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <PhotoIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleImageUpload(sku.id, e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        id={`image-${sku.id}`}
                      />
                      <label
                        htmlFor={`image-${sku.id}`}
                        className="text-xs text-[#cc824d] cursor-pointer hover:text-[#b3723f] font-chinese"
                      >
                        上傳
                      </label>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {sku.qrCodeUrl ? (
                      <img src={sku.qrCodeUrl} alt="QR Code" className="w-8 h-8" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleGenerateQRCode(sku.id)}
                        className="p-1 text-gray-400 hover:text-[#cc824d] transition-colors"
                        title="生成QR Code"
                      >
                        <QrCodeIcon className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleUpdateSKU(sku.id, 'isActive', !sku.isActive)}
                      className={`p-1 rounded transition-colors ${
                        sku.isActive 
                          ? 'text-green-600 hover:text-green-800' 
                          : 'text-red-600 hover:text-red-800'
                      }`}
                    >
                      {sku.isActive ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <XCircleIcon className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {skus.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-chinese">
            尚未生成任何SKU，請先設定變體層級後點擊「自動生成SKU」
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSKUManager;