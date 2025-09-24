import { useEffect, useState } from 'react';
import {
  QrCodeIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  DocumentTextIcon,
  LinkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// 單一模式：將「商品連結 + SKU 資訊 + 圖片」合併成一個 QR payload
// product: { name, slug, categories?, images? }
// sku: { sku/fullSKU, salePrice, comparePrice, costPrice, variantPath? }
const QRCodeGenerator = ({ product, sku = null, onGenerated, autoGenerate = false, compact = false }) => {
  const [generating, setGenerating] = useState(false);
  const [generatedQR, setGeneratedQR] = useState(null);
  

  // 生成 QR Code 數據
  const generateQRData = () => {
    const baseUrl = window.location.origin;
    const productName = product?.name?.['zh-TW'] || product?.name || '';
    const variantPath = Array.isArray(sku?.variantPath) ? sku.variantPath : [];
    const variantInfo = variantPath.map((v, i) => {
      const level = v?.levelName?.['zh-TW'] || v?.level || `層級${i + 1}`;
      const option = v?.optionName?.['zh-TW'] || v?.option || '選項';
      return `${level}: ${option}`;
    }).join(' / ') || '基本款';
    const categories = Array.isArray(product?.categories) ? product.categories.map(c => (c?.name?.['zh-TW'] || c?.name || c?.title || c?.slug || c?.id)).filter(Boolean) : [];
    const url = `${baseUrl}/products/${product?.slug || product?.urlSlug?.['zh-TW'] || product?.id || ''}`;
    // 圖片：優先使用變體圖片，其次用產品主圖
    const variantImage = Array.isArray(sku?.images) && sku.images.length > 0 ? sku.images[0]?.url || sku.images[0] : null;
    const productImage = Array.isArray(product?.images) && product.images.length > 0 ? product.images[0]?.url || product.images[0] : null;
    const imageUrl = variantImage || productImage || '';
    return {
      type: 'product_bundle',
      url,
      productName,
      sku: sku?.sku || sku?.fullSKU || `${product?.skuPrefix || ''}BASE`,
      salePrice: sku?.salePrice ?? sku?.price ?? product?.price ?? null,
      comparePrice: sku?.comparePrice ?? product?.comparePrice ?? null,
      costPrice: sku?.costPrice ?? product?.costPrice ?? null,
      variantInfo,
      categories,
      imageUrl,
      description: '商品連結 + SKU 資訊 + 圖片'
    };
  };

  // 模擬 QR Code 生成 (實際專案中會調用 QR Code 庫)
  const generateQRCodeImage = (data) => {
    // 這裡模擬 QR Code 生成
    const qrData = encodeURIComponent(JSON.stringify(data));
    
    // 使用 SVG 創建簡單的 QR Code 樣式 (實際會使用 qrcode 庫)
    const qrSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="20" height="20" fill="black"/>
        <rect x="60" y="20" width="20" height="20" fill="black"/>
        <rect x="100" y="20" width="20" height="20" fill="black"/>
        <rect x="140" y="20" width="20" height="20" fill="black"/>
        <rect x="20" y="60" width="20" height="20" fill="black"/>
        <rect x="100" y="60" width="20" height="20" fill="black"/>
        <rect x="160" y="60" width="20" height="20" fill="black"/>
        <rect x="20" y="100" width="20" height="20" fill="black"/>
        <rect x="60" y="100" width="20" height="20" fill="black"/>
        <rect x="140" y="100" width="20" height="20" fill="black"/>
        <rect x="20" y="140" width="20" height="20" fill="black"/>
        <rect x="60" y="140" width="20" height="20" fill="black"/>
        <rect x="100" y="140" width="20" height="20" fill="black"/>
        <rect x="160" y="140" width="20" height="20" fill="black"/>
        <rect x="40" y="160" width="60" height="20" fill="black"/>
        <rect x="120" y="160" width="60" height="20" fill="black"/>
        <text x="100" y="190" font-family="Arial" font-size="8" text-anchor="middle" fill="black">
          ${data.type.toUpperCase()}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(qrSvg)}`;
  };

  // 生成 QR Code
  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      const qrData = generateQRData();
      if (!qrData) {
        throw new Error('無效的QR Code類型');
      }

      // 模擬異步生成過程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const qrImageUrl = generateQRCodeImage(qrData);
      
      const qrResult = {
        id: Date.now(),
        type: qrData.type,
        data: qrData,
        imageUrl: qrImageUrl,
        productId: product.id,
        skuId: sku?.id || null,
        createdAt: new Date().toISOString()
      };
      
      setGeneratedQR(qrResult);
      
      if (onGenerated) {
        onGenerated(qrResult);
      }
      
    } catch (error) {
      console.error('QR Code生成失敗:', error);
      alert('QR Code生成失敗，請稍後再試');
    } finally {
      setGenerating(false);
    }
  };

  // 自動生成模式：掛載後直接生成
  useEffect(() => {
    if (autoGenerate && !generatedQR && !generating) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerate]);

  // 下載 QR Code
  const handleDownload = () => {
    if (!generatedQR) return;
    
    const link = document.createElement('a');
    link.href = generatedQR.imageUrl;
    link.download = `qr-${generatedQR.type}-${sku?.sku || product.skuPrefix || 'product'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 複製 QR Code 數據
  const handleCopyData = () => {
    if (!generatedQR) return;
    
    const dataText = JSON.stringify(generatedQR.data, null, 2);
    navigator.clipboard.writeText(dataText).then(() => {
      alert('QR Code數據已複製到剪貼簿');
    });
  };

  // 精簡顯示模式：只呈現 QR 圖片
  if (compact) {
    return (
      <div className="qr-generator">
        {generatedQR ? (
          <div className="text-center">
            <img 
              src={generatedQR.imageUrl} 
              alt="Generated QR Code"
              className="w-56 h-56 mx-auto border rounded-lg shadow-md"
            />
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-gray-500 font-chinese">
            {generating ? '生成中…' : '準備中…'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="qr-generator glass rounded-lg p-6">
      <div className="flex items-center mb-4">
        <QrCodeIcon className="w-6 h-6 text-[#cc824d] mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 font-chinese">QR Code 生成器（整合版）</h3>
      </div>

      {/* 生成按鈕 */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1 px-4 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-chinese flex items-center justify-center"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              生成中...
            </>
          ) : (
            <>
              <QrCodeIcon className="w-5 h-5 mr-2" />
              生成 QR Code
            </>
          )}
        </button>
      </div>

      {/* 生成結果 */}
      {generatedQR && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 font-chinese">生成結果</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyData}
                className="px-3 py-1 text-sm text-[#cc824d] border border-[#cc824d] rounded hover:bg-[#cc824d] hover:text-white transition-colors font-chinese"
              >
                複製數據
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-sm bg-[#cc824d] text-white rounded hover:bg-[#b3723f] transition-colors font-chinese flex items-center"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                下載
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code 圖片 */}
            <div className="text-center">
              <img 
                src={generatedQR.imageUrl} 
                alt="Generated QR Code"
                className="w-48 h-48 mx-auto border rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-600 mt-2 font-chinese">
                商品連結 + SKU 資訊 + 圖片
              </p>
            </div>

            {/* QR Code 資訊 */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-chinese">類型</label>
                <p className="text-sm text-gray-900">{generatedQR.type}</p>
              </div>
              
              {generatedQR.data.url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-chinese">連結</label>
                  <p className="text-sm text-gray-900 break-all">{generatedQR.data.url}</p>
                </div>
              )}
              {generatedQR.data.imageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-chinese">圖片</label>
                  <img src={generatedQR.data.imageUrl} alt="Variant/Product" className="w-24 h-24 object-cover rounded border" />
                </div>
              )}

              
              {generatedQR.data.sku && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-chinese">SKU</label>
                  <p className="text-sm text-gray-900">{generatedQR.data.sku}</p>
                </div>
              )}
              
              {generatedQR.data.variantInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-chinese">變體資訊</label>
                  <p className="text-sm text-gray-900">{generatedQR.data.variantInfo}</p>
                </div>
              )}

              {typeof generatedQR.data.salePrice !== 'undefined' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">售價</label>
                    <p className="text-sm text-gray-900">{generatedQR.data.salePrice != null ? `NT$${Number(generatedQR.data.salePrice).toLocaleString()}` : '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">原價</label>
                    <p className="text-sm text-gray-900">{generatedQR.data.comparePrice != null ? `NT$${Number(generatedQR.data.comparePrice).toLocaleString()}` : '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese">成本價</label>
                    <p className="text-sm text-gray-900">{generatedQR.data.costPrice != null ? `NT$${Number(generatedQR.data.costPrice).toLocaleString()}` : '-'}</p>
                  </div>
                </div>
              )}

              {Array.isArray(generatedQR.data.categories) && generatedQR.data.categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-chinese">分類</label>
                  <p className="text-sm text-gray-900">{generatedQR.data.categories.join(' / ')}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-chinese">生成時間</label>
                <p className="text-sm text-gray-900">
                  {new Date(generatedQR.createdAt).toLocaleString('zh-TW')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;