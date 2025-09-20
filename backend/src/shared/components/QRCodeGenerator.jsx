import { useState } from 'react';
import {
  QrCodeIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  DocumentTextIcon,
  LinkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const QRCodeGenerator = ({ product, sku = null, onGenerated }) => {
  const [generating, setGenerating] = useState(false);
  const [qrType, setQRType] = useState('product_url');
  const [generatedQR, setGeneratedQR] = useState(null);

  // QR Code 類�??��?
  const qrTypes = [
    {
      id: 'product_url',
      name: '?��??�面???',
      description: '?��??��?詳�??�面?�QR Code',
      icon: LinkIcon
    },
    {
      id: 'sku_info',
      name: 'SKU資�?',
      description: '?�含SKU�?��?�基?��?訊�?QR Code',
      icon: DocumentTextIcon
    },
    {
      id: 'product_image',
      name: '?��??��?',
      description: '?�接????��??�主?��?QR Code',
      icon: PhotoIcon
    }
  ];

  // ?��? QR Code ?��?
  const generateQRData = (type) => {
    const baseUrl = window.location.origin;
    
    switch (type) {
      case 'product_url':
        return {
          type: 'product_url',
          url: `${baseUrl}/products/${product.urlSlug?.['zh-TW'] || product.id}`,
          title: product.name?.['zh-TW'] || product.name,
          description: '?��??��??��?詳�?'
        };
        
      case 'sku_info':
        return {
          type: 'sku_info',
          sku: sku?.sku || `${product.skuPrefix}BASE`,
          productName: product.name?.['zh-TW'] || product.name,
          price: sku?.originalPrice || product.baseOriginalPrice,
          variantInfo: sku?.variantPath?.map(v => 
            `${v.levelName['zh-TW']}: ${v.optionName['zh-TW']}`
          ).join(' / ') || '?�本�?,
          description: 'SKU?��?資�?'
        };
        
      case 'product_image':
        return {
          type: 'product_image',
          imageUrl: product.mainImageUrl || (product.images && product.images[0]) || '',
          productName: product.name?.['zh-TW'] || product.name,
          description: '?��??��?'
        };
        
      default:
        return null;
    }
  };

  // 模擬 QR Code ?��? (實�?專�?中�?調用 QR Code �?
  const generateQRCodeImage = (data) => {
    // ?�裡模擬 QR Code ?��?
    const qrData = encodeURIComponent(JSON.stringify(data));
    
    // 使用 SVG ?�建簡單??QR Code �?? (實�??�使??qrcode �?
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

  // ?��? QR Code
  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      const qrData = generateQRData(qrType);
      if (!qrData) {
        throw new Error('?��??�QR Code類�?');
      }

      // 模擬?�步?��??��?
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const qrImageUrl = generateQRCodeImage(qrData);
      
      const qrResult = {
        id: Date.now(),
        type: qrType,
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
      console.error('QR Code?��?失�?:', error);
      alert('QR Code?��?失�?，�?稍�??�試');
    } finally {
      setGenerating(false);
    }
  };

  // 下�? QR Code
  const handleDownload = () => {
    if (!generatedQR) return;
    
    const link = document.createElement('a');
    link.href = generatedQR.imageUrl;
    link.download = `qr-${generatedQR.type}-${sku?.sku || product.skuPrefix || 'product'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 複製 QR Code ?��?
  const handleCopyData = () => {
    if (!generatedQR) return;
    
    const dataText = JSON.stringify(generatedQR.data, null, 2);
    navigator.clipboard.writeText(dataText).then(() => {
      alert('QR Code?��?已�?製到?�貼�?);
    });
  };

  return (
    <div className="qr-generator glass rounded-lg p-6">
      <div className="flex items-center mb-4">
        <QrCodeIcon className="w-6 h-6 text-[#cc824d] mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 font-chinese">QR Code ?��???/h3>
      </div>

      {/* QR Code 類�??��? */}
      <div className="space-y-3 mb-6">
        <label className="block text-sm font-medium text-gray-700 font-chinese">?��?QR Code類�?</label>
        <div className="grid grid-cols-1 gap-3">
          {qrTypes.map(type => {
            const Icon = type.icon;
            return (
              <label key={type.id} className="relative">
                <input
                  type="radio"
                  name="qr-type"
                  value={type.id}
                  checked={qrType === type.id}
                  onChange={(e) => setQRType(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  qrType === type.id 
                    ? 'border-[#cc824d] bg-[#cc824d]/10' 
                    : 'border-gray-300 hover:border-[#cc824d]/50'
                }`}>
                  <div className="flex items-start">
                    <Icon className={`w-5 h-5 mr-3 mt-0.5 ${
                      qrType === type.id ? 'text-[#cc824d]' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className={`font-medium font-chinese ${
                        qrType === type.id ? 'text-[#cc824d]' : 'text-gray-900'
                      }`}>
                        {type.name}
                      </div>
                      <div className="text-sm text-gray-600 font-chinese">
                        {type.description}
                      </div>
                    </div>
                    {qrType === type.id && (
                      <CheckCircleIcon className="w-5 h-5 text-[#cc824d] ml-auto" />
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* ?��??��? */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1 px-4 py-3 bg-[#cc824d] text-white rounded-lg hover:bg-[#b3723f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-chinese flex items-center justify-center"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ?��?�?..
            </>
          ) : (
            <>
              <QrCodeIcon className="w-5 h-5 mr-2" />
              ?��? QR Code
            </>
          )}
        </button>
      </div>

      {/* ?��?結�? */}
      {generatedQR && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 font-chinese">?��?結�?</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyData}
                className="px-3 py-1 text-sm text-[#cc824d] border border-[#cc824d] rounded hover:bg-[#cc824d] hover:text-white transition-colors font-chinese"
              >
                複製?��?
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-sm bg-[#cc824d] text-white rounded hover:bg-[#b3723f] transition-colors font-chinese flex items-center"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                下�?
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code ?��? */}
            <div className="text-center">
              <img 
                src={generatedQR.imageUrl} 
                alt="Generated QR Code"
                className="w-48 h-48 mx-auto border rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-600 mt-2 font-chinese">
                {qrTypes.find(t => t.id === generatedQR.type)?.name}
              </p>
            </div>

            {/* QR Code 資�? */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-chinese">類�?</label>
                <p className="text-sm text-gray-900">{generatedQR.type}</p>
              </div>
              
              {generatedQR.data.url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-chinese">???</label>
                  <p className="text-sm text-gray-900 break-all">{generatedQR.data.url}</p>
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
                  <label className="block text-sm font-medium text-gray-700 font-chinese">變�?資�?</label>
                  <p className="text-sm text-gray-900">{generatedQR.data.variantInfo}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-chinese">?��??��?</label>
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
