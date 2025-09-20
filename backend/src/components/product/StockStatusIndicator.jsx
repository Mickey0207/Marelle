import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const StockStatusIndicator = ({ 
  stockLevel = 0, 
  selectedVariants = {},
  lowStockThreshold = 10,
  onStockChange
}) => {
  const [currentStock, setCurrentStock] = useState(stockLevel);
  const [stockStatus, setStockStatus] = useState('checking');
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);

  useEffect(() => {
    checkStock();
  }, [selectedVariants, stockLevel]);

  const checkStock = async () => {
    setStockStatus('checking');
    
    // 模擬庫存檢查 API 呼叫
    setTimeout(() => {
      let adjustedStock = stockLevel;
      
      // 根據選擇的變體調整庫存
      if (Object.keys(selectedVariants).length > 0) {
        // 模擬：某些變體組合可能有不同的庫存
        adjustedStock = Math.max(0, stockLevel - Math.floor(Math.random() * 5));
      }
      
      setCurrentStock(adjustedStock);
      
      // 計算庫存狀態
      let status;
      if (adjustedStock === 0) {
        status = 'out-of-stock';
      } else if (adjustedStock <= lowStockThreshold) {
        status = 'low-stock';
      } else {
        status = 'in-stock';
      }
      
      setStockStatus(status);
      
      // 計算預估送達時間
      if (adjustedStock > 0) {
        const deliveryDays = adjustedStock > lowStockThreshold ? 2 : 5;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
        setEstimatedDelivery(deliveryDate);
      } else {
        setEstimatedDelivery(null);
      }
      
      onStockChange?.(adjustedStock, status);
      
      // 庫存狀態變化動畫
      gsap.fromTo('.stock-indicator', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }, 500); // 模擬 API 延遲
  };

  const getStatusConfig = () => {
    switch (stockStatus) {
      case 'in-stock':
        return {
          icon: CheckCircleIcon,
          text: '現貨供應',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200'
        };
      case 'low-stock':
        return {
          icon: ExclamationTriangleIcon,
          text: `庫存不多 (剩餘 ${currentStock} 件)`,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          borderColor: 'border-yellow-200'
        };
      case 'out-of-stock':
        return {
          icon: XCircleIcon,
          text: '暫時缺貨',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          borderColor: 'border-red-200'
        };
      case 'checking':
      default:
        return {
          icon: ClockIcon,
          text: '檢查庫存中...',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          iconColor: 'text-gray-500',
          borderColor: 'border-gray-200'
        };
    }
  };

  const formatDeliveryDate = (date) => {
    if (!date) return '';
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '明天';
    if (diffDays === 2) return '後天';
    return `${diffDays} 天後`;
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="space-y-3">
      {/* 庫存狀態指示器 */}
      <div className={`
        stock-indicator flex items-center p-3 rounded-lg border-2 transition-all duration-200
        ${config.bgColor} ${config.borderColor}
      `}>
        <Icon className={`w-5 h-5 mr-2 ${config.iconColor}`} />
        <span className={`text-sm font-medium font-chinese ${config.textColor}`}>
          {config.text}
        </span>
        {stockStatus === 'checking' && (
          <div className="ml-2 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
      
      {/* 配送資訊 */}
      {stockStatus === 'in-stock' && estimatedDelivery && (
        <div className="flex items-center text-sm text-gray-600 font-chinese">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>預計 {formatDeliveryDate(estimatedDelivery)} 送達</span>
        </div>
      )}
      
      {/* 庫存警告和建議 */}
      {stockStatus === 'low-stock' && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 font-chinese">庫存即將售完</p>
              <p className="text-yellow-700 font-chinese">建議盡快下單以免向隅</p>
            </div>
          </div>
        </div>
      )}
      
      {stockStatus === 'out-of-stock' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <XCircleIcon className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
            <div className="text-sm space-y-2">
              <p className="font-medium text-red-800 font-chinese">此商品暫時缺貨</p>
              <div className="space-y-1">
                <button className="text-red-700 underline hover:text-red-800 font-chinese">
                  通知到貨
                </button>
                <span className="text-red-600 mx-2">•</span>
                <button className="text-red-700 underline hover:text-red-800 font-chinese">
                  查看相似商品
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 批量購買提示 */}
      {stockStatus === 'in-stock' && currentStock >= 20 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center text-sm text-blue-800 font-chinese">
            <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
            <span>庫存充足，支援批量訂購</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockStatusIndicator;