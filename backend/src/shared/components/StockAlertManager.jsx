import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  ExclamationTriangleIcon, 
  BellIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const StockAlertManager = ({ 
  products = [], 
  onAlertAction,
  lowStockThreshold = 10,
  outOfStockThreshold = 0 
}) => {
  const [alerts, setAlerts] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    lowStockEmail: true,
    outOfStockEmail: true,
    lowStockPush: false,
    outOfStockPush: true
  });

  useEffect(() => {
    checkStockLevels();
  }, [products, lowStockThreshold, outOfStockThreshold]);

  const checkStockLevels = () => {
    const newAlerts = [];
    
    products.forEach(product => {
      // 檢查每個產?��?總庫�?
      const totalStock = product.variants?.reduce((total, variant) => {
        return total + (variant.stock || 0);
      }, 0) || product.stock || 0;

      if (totalStock <= outOfStockThreshold) {
        newAlerts.push({
          id: `${product.id}-out-of-stock`,
          type: 'out-of-stock',
          severity: 'high',
          product,
          stockLevel: totalStock,
          message: `?��? "${product.name}" 已缺貨`,
          timestamp: new Date(),
          actions: ['restock', 'deactivate', 'notify-supplier']
        });
      } else if (totalStock <= lowStockThreshold) {
        newAlerts.push({
          id: `${product.id}-low-stock`,
          type: 'low-stock',
          severity: 'medium',
          product,
          stockLevel: totalStock,
          message: `?��? "${product.name}" 庫�?不足，剩�?${totalStock} 件`,
          timestamp: new Date(),
          actions: ['restock', 'adjust-threshold', 'notify-supplier']
        });
      }
    });

    setAlerts(newAlerts);
    
    // 如�??�新警�?，播?��???
    if (newAlerts.length > 0) {
      gsap.fromTo('.stock-alert-item',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      );
    }
  };

  const getAlertConfig = (type, severity) => {
    const configs = {
      'out-of-stock': {
        icon: XCircleIcon,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        textColor: 'text-red-800',
        badgeColor: 'bg-red-100 text-red-800'
      },
      'low-stock': {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-800',
        badgeColor: 'bg-yellow-100 text-yellow-800'
      }
    };
    
    return configs[type] || configs['low-stock'];
  };

  const handleAlertAction = (alertId, action) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    switch (action) {
      case 'restock':
        // 觸發補貨流�?
        onAlertAction?.('restock', alert.product);
        break;
      case 'deactivate':
        // 下架?��?
        onAlertAction?.('deactivate', alert.product);
        break;
      case 'notify-supplier':
        // ?�知供�???
        onAlertAction?.('notify-supplier', alert.product);
        break;
      case 'adjust-threshold':
        // 調整警�??��?
        onAlertAction?.('adjust-threshold', alert.product);
        break;
      case 'dismiss':
        // ?��?忽略警�?
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        break;
    }
    
    // ?��??��??�畫
    gsap.fromTo(`#alert-${alertId}`,
      { scale: 1 },
      { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }
    );
  };

  const getActionText = (action) => {
    const texts = {
      restock: '補貨',
      deactivate: '下架',
      'notify-supplier': '?�知供�???,
      'adjust-threshold': '調整?��?,
      dismiss: '忽略'
    };
    return texts[action] || action;
  };

  const getActionStyle = (action) => {
    const styles = {
      restock: 'bg-green-100 hover:bg-green-200 text-green-800',
      deactivate: 'bg-red-100 hover:bg-red-200 text-red-800',
      'notify-supplier': 'bg-blue-100 hover:bg-blue-200 text-blue-800',
      'adjust-threshold': 'bg-gray-100 hover:bg-gray-200 text-gray-800',
      dismiss: 'bg-gray-100 hover:bg-gray-200 text-gray-600'
    };
    return styles[action] || styles.dismiss;
  };

  const alertsByType = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* 警�??��? */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 font-chinese">庫�?警�?</h3>
          <div className="flex items-center space-x-2">
            {alertsByType['out-of-stock'] > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <XCircleIcon className="w-3 h-3 mr-1" />
                缺貨 {alertsByType['out-of-stock']}
              </span>
            )}
            {alertsByType['low-stock'] > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                低庫�?{alertsByType['low-stock']}
              </span>
            )}
            {alerts.length === 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircleIcon className="w-3 h-3 mr-1" />
                庫�?�?��
              </span>
            )}
          </div>
        </div>

        {/* 警�?清單 */}
        {alerts.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map((alert) => {
              const config = getAlertConfig(alert.type, alert.severity);
              const Icon = config.icon;
              
              return (
                <div
                  key={alert.id}
                  id={`alert-${alert.id}`}
                  className={`stock-alert-item p-4 border-2 rounded-lg ${config.bgColor} ${config.borderColor}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
                      <div className="flex-1">
                        <p className={`font-medium ${config.textColor} font-chinese`}>
                          {alert.message}
                        </p>
                        <p className="text-sm text-gray-600 font-chinese mt-1">
                          ?��?ID: {alert.product.id} | 庫�?: {alert.stockLevel} �?
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.timestamp.toLocaleString('zh-TW')}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.badgeColor}`}>
                      {alert.type === 'out-of-stock' ? '缺貨' : '低庫�?}
                    </span>
                  </div>
                  
                  {/* ?��??��? */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {alert.actions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleAlertAction(alert.id, action)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 font-chinese ${getActionStyle(action)}`}
                      >
                        {getActionText(action)}
                      </button>
                    ))}
                    <button
                      onClick={() => handleAlertAction(alert.id, 'dismiss')}
                      className="px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 font-chinese bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      ?��?忽略
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 font-chinese">?�?��??�庫存正�?/p>
          </div>
        )}
      </div>

      {/* ?�知設�? */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">庫�?警�?設�?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ?�值設�?*/}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 font-chinese">警�??��?/h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                低庫存警?��?件�?
              </label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => {
                  // ?�裡?�該?��?調函?��??�新?��?
                  console.log('Low stock threshold:', e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                缺貨警�?（件�?
              </label>
              <input
                type="number"
                value={outOfStockThreshold}
                onChange={(e) => {
                  console.log('Out of stock threshold:', e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          {/* ?�知設�? */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 font-chinese">?�知?��?</h4>
            
            <div className="space-y-3">
              {Object.entries(notificationSettings).map(([key, value]) => {
                const labels = {
                  lowStockEmail: '低庫存郵件通知',
                  outOfStockEmail: '缺貨?�件?�知',
                  lowStockPush: '低庫存推?�通知',
                  outOfStockPush: '缺貨?�播?�知'
                };
                
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-chinese">{labels[key]}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ?��??��? */}
      {alerts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">?��??��?</h3>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                alerts.forEach(alert => handleAlertAction(alert.id, 'notify-supplier'));
              }}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors duration-200 font-chinese"
            >
              ?�知?�?��??��?
            </button>
            
            <button
              onClick={() => {
                const outOfStockAlerts = alerts.filter(a => a.type === 'out-of-stock');
                outOfStockAlerts.forEach(alert => handleAlertAction(alert.id, 'deactivate'));
              }}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors duration-200 font-chinese"
            >
              下架?�?�缺貨�???
            </button>
            
            <button
              onClick={() => {
                setAlerts([]);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-200 font-chinese"
            >
              忽略?�?�警??
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAlertManager;
