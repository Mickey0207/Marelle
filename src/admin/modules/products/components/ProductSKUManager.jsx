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

  // ?üÊ??Ä?âÂèØ?ΩÁ?SKUÁµÑÂ?
  const generateAllSKUCombinations = (variants) => {
    if (variants.length === 0) return [];

    const combinations = [];
    
    // ?ûÊ≠∏?üÊ??Ä?âÁ???
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

  // ?üÊ?SKU‰ª?¢º
  const generateSKUCode = (combination) => {
    let sku = formData.skuPrefix || 'PRD';
    combination.forEach(variant => {
      sku += variant.skuCode;
    });
    return sku;
  };

  // ?™Â??üÊ??Ä?âSKU
  const handleGenerateAllSKUs = () => {
    if (variants.length === 0) {
      alert('Ë´ãÂ?Ë®≠Â?ËÆäÈ?Â±§Á?');
      return;
    }

    if (!formData.skuPrefix) {
      alert('Ë´ãÂ?Ë®≠Â?SKU?çÁ∂¥');
      return;
    }

    setLoading(true);

    try {
      const combinations = generateAllSKUCombinations(variants);
      const newSKUs = combinations.map((combination, index) => ({
        id: Date.now() + index,
        sku: generateSKUCode(combination),
        variantPath: combination,
        
        // ?πÊ†ºË®≠Â? (ÁπºÊâø?∫Á??πÊ†º)
        costPrice: formData.baseCostPrice || null,
        originalPrice: formData.baseOriginalPrice || null,
        salePrice: formData.baseSalePrice || null,
        bronzePrice: formData.baseBronzePrice || null,
        silverPrice: formData.baseSilverPrice || null,
        goldPrice: formData.baseGoldPrice || null,
        
        // ?∂‰?Ë®≠Â?
        imageUrl: null,
        qrCodeUrl: null,
        isActive: true,
        stock: 0,
        
        createdAt: new Date().toISOString()
      }));

      setSKUs(newSKUs);
      alert(`?êÂ??üÊ? ${newSKUs.length} ?ãSKU`);
    } catch (error) {
      console.error('?üÊ?SKUÂ§±Ê?:', error);
      alert('?üÊ?SKUÂ§±Ê?');
    } finally {
      setLoading(false);
    }
  };

  // ?¥Êñ∞?ÆÂÄãSKU
  const handleUpdateSKU = (skuId, field, value) => {
    setSKUs(prevSKUs => 
      prevSKUs.map(sku => 
        sku.id === skuId 
          ? { ...sku, [field]: value, updatedAt: new Date().toISOString() }
          : sku
      )
    );
  };

  // ?πÈ??¥Êñ∞?∏‰∏≠?ÑSKU
  const handleBulkUpdate = (field, value) => {
    if (selectedSKUs.length === 0) {
      alert('Ë´ãÂ??∏Ê?Ë¶ÅÊõ¥?∞Á?SKU');
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

  // ?üÊ?QR Code
  const handleGenerateQRCode = (skuId) => {
    const sku = skus.find(s => s.id === skuId);
    if (!sku) return;

    // Ê®°Êì¨QR Code?üÊ?
    const qrData = {
      type: 'sku_info',
      sku: sku.sku,
      productName: formData.name['zh-TW'] || formData.name['en'],
      variantPath: sku.variantPath,
      price: sku.originalPrice || formData.baseOriginalPrice
    };

    // ?ôË£°?ÉË™ø?®ÂØ¶?õÁ?QR Code?üÊ?API
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

  // ?ºÂ??ñË?È´îË∑ØÂæëÈ°ØÁ§?
  const formatVariantPath = (variantPath) => {
    return variantPath.map(variant => 
      `${variant.levelName['zh-TW']}: ${variant.optionName['zh-TW']}`
    ).join(' / ');
  };

  // ?ïÁ??ñÁ?‰∏äÂÇ≥
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
        <h3 className="text-lg font-semibold text-gray-900 font-chinese">SKU ÁÆ°Á?</h3>
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
                ?üÊ?‰∏?..
              </>
            ) : (
              <>
                <CogIcon className="w-4 h-4 mr-2" />
                ?™Â??üÊ?SKU
              </>
            )}
          </button>
        </div>
      </div>

      {/* ?πÈ??ç‰?Â∑•ÂÖ∑Ê¨?*/}
      {selectedSKUs.length > 0 && (
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-chinese">
              Â∑≤ÈÅ∏??{selectedSKUs.length} ?ãSKU
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="?πÈ?Ë®≠Â??üÂÉπ"
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
                ?ñÊ??∏Ê?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SKU ?óË°® */}
      <div className="glass rounded-lg overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">{/* ?ÅË®±?ÇÁõ¥Ê∫¢Âá∫‰ª•È°ØÁ§∫‰??âÈÅ∏??*/}
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
                <th className="px-4 py-3 text-left font-chinese">SKU‰ª?¢º</th>
                <th className="px-4 py-3 text-left font-chinese">ËÆäÈ?ÁµÑÂ?</th>
                <th className="px-4 py-3 text-left font-chinese">?êÊú¨??/th>
                <th className="px-4 py-3 text-left font-chinese">?üÂÉπ</th>
                <th className="px-4 py-3 text-left font-chinese">?™Ê???/th>
                <th className="px-4 py-3 text-left font-chinese">?ÖÁ???/th>
                <th className="px-4 py-3 text-left font-chinese">?Ä?åÂÉπ</th>
                <th className="px-4 py-3 text-left font-chinese">ÈªÉÈ???/th>
                <th className="px-4 py-3 text-left font-chinese">?ñÁ?</th>
                <th className="px-4 py-3 text-left font-chinese">QR Code</th>
                <th className="px-4 py-3 text-left font-chinese">?Ä??/th>
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
                        ‰∏äÂÇ≥
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
                        title="?üÊ?QR Code"
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
            Â∞öÊú™?üÊ?‰ªª‰?SKUÔºåË??àË®≠ÂÆöË?È´îÂ±§Á¥öÂ?ÈªûÊ??åËá™?ïÁ??êSKU??
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSKUManager;
