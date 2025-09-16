import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  ClockIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ProductStatusManager = ({ 
  initialStatus = 'draft', 
  onStatusChange,
  stockLevel = 0,
  publishDate = null,
  language = 'zh-TW'
}) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [scheduledDate, setScheduledDate] = useState(publishDate ? new Date(publishDate).toISOString().slice(0, 16) : '');
  const [statusHistory, setStatusHistory] = useState([
    { status: 'draft', timestamp: new Date(), user: '系統管理員', reason: '商品建立' }
  ]);
  const [showScheduler, setShowScheduler] = useState(false);
  const [stockAlert, setStockAlert] = useState(false);

  const statusConfig = {
    draft: {
      name: { 'zh-TW': '草稿', 'en': 'Draft' },
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-300',
      icon: ClockIcon,
      description: '商品尚未發布，僅管理員可見'
    },
    active: {
      name: { 'zh-TW': '啟用', 'en': 'Active' },
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
      icon: CheckCircleIcon,
      description: '商品已發布，對顧客可見'
    },
    inactive: {
      name: { 'zh-TW': '停用', 'en': 'Inactive' },
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
      icon: XCircleIcon,
      description: '商品已下架，對顧客不可見'
    },
    scheduled: {
      name: { 'zh-TW': '排程發布', 'en': 'Scheduled' },
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
      icon: CalendarIcon,
      description: '商品將在指定時間發布'
    },
    out_of_stock: {
      name: { 'zh-TW': '缺貨', 'en': 'Out of Stock' },
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
      icon: ExclamationTriangleIcon,
      description: '商品庫存不足，建議補貨'
    }
  };

  useEffect(() => {
    // 檢查庫存狀態
    if (stockLevel <= 0 && currentStatus === 'active') {
      setStockAlert(true);
      // 庫存警告動畫
      gsap.fromTo('.stock-alert',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    } else {
      setStockAlert(false);
    }
  }, [stockLevel, currentStatus]);

  const handleStatusChange = (newStatus, reason = '') => {
    if (newStatus === currentStatus) return;

    // 狀態變更驗證
    if (newStatus === 'active' && stockLevel <= 0) {
      if (!window.confirm('商品庫存為0，確定要啟用嗎？')) {
        return;
      }
    }

    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    
    // 添加到歷史記錄
    const newHistoryEntry = {
      status: newStatus,
      previousStatus,
      timestamp: new Date(),
      user: '當前用戶', // 實際應用中應該從用戶狀態獲取
      reason: reason || getDefaultReason(newStatus)
    };
    
    setStatusHistory(prev => [newHistoryEntry, ...prev]);
    
    // 狀態變更動畫
    gsap.fromTo('.status-indicator',
      { scale: 0.8, rotation: -10 },
      { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' }
    );
    
    onStatusChange?.(newStatus, newHistoryEntry);
  };

  const getDefaultReason = (status) => {
    const reasons = {
      draft: '設為草稿狀態',
      active: '商品上架',
      inactive: '商品下架',
      scheduled: '設定排程發布'
    };
    return reasons[status] || '狀態變更';
  };

  const handleScheduledPublish = () => {
    if (!scheduledDate) {
      alert('請選擇發布時間');
      return;
    }
    
    const scheduleTime = new Date(scheduledDate);
    const now = new Date();
    
    if (scheduleTime <= now) {
      alert('發布時間必須是未來時間');
      return;
    }
    
    handleStatusChange('scheduled', `排程於 ${scheduleTime.toLocaleString('zh-TW')} 發布`);
    setShowScheduler(false);
  };

  const getStatusDisplay = (status) => {
    const config = statusConfig[status];
    return config?.name?.[language] || config?.name?.['zh-TW'] || status;
  };

  const getCurrentConfig = () => statusConfig[currentStatus] || statusConfig.draft;
  const config = getCurrentConfig();
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* 當前狀態顯示 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">商品狀態</h3>
        
        <div className="status-indicator flex items-center space-x-4 mb-4">
          <div className={`flex items-center px-4 py-2 rounded-lg border-2 ${config.bgColor} ${config.borderColor}`}>
            <Icon className={`w-5 h-5 mr-2 ${config.textColor}`} />
            <span className={`font-medium ${config.textColor} font-chinese`}>
              {getStatusDisplay(currentStatus)}
            </span>
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-600 font-chinese">{config.description}</p>
            {currentStatus === 'scheduled' && scheduledDate && (
              <p className="text-xs text-blue-600 mt-1 font-chinese">
                發布時間: {new Date(scheduledDate).toLocaleString('zh-TW')}
              </p>
            )}
          </div>
        </div>

        {/* 庫存警告 */}
        {stockAlert && (
          <div className="stock-alert bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-800 font-chinese">庫存警告</h4>
                <p className="text-sm text-yellow-700 font-chinese">
                  商品庫存為 {stockLevel}，建議補貨或下架商品
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleStatusChange('inactive', '因庫存不足下架')}
                    className="text-xs px-3 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded font-chinese"
                  >
                    暫時下架
                  </button>
                  <button
                    onClick={() => setStockAlert(false)}
                    className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-chinese"
                  >
                    稍後處理
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 狀態操作按鈕 */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusConfig).map(([status, config]) => {
            if (status === currentStatus || status === 'out_of_stock') return null;
            
            const StatusIcon = config.icon;
            const isDisabled = status === 'active' && stockLevel <= 0;
            
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusChange(status)}
                disabled={isDisabled}
                className={`flex items-center px-3 py-2 rounded-lg border transition-colors duration-200 font-chinese text-sm ${
                  isDisabled 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : `${config.bgColor} ${config.textColor} ${config.borderColor} hover:opacity-80`
                }`}
              >
                <StatusIcon className="w-4 h-4 mr-1" />
                {getStatusDisplay(status)}
              </button>
            );
          })}
          
          {/* 排程發布按鈕 */}
          {!showScheduler && (
            <button
              type="button"
              onClick={() => setShowScheduler(true)}
              className="flex items-center px-3 py-2 rounded-lg border border-blue-300 bg-blue-100 text-blue-800 hover:opacity-80 transition-colors duration-200 font-chinese text-sm"
            >
              <CalendarIcon className="w-4 h-4 mr-1" />
              排程發布
            </button>
          )}
        </div>

        {/* 排程發布設定 */}
        {showScheduler && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-3 font-chinese">設定發布時間</h4>
            <div className="flex items-center space-x-3">
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleScheduledPublish}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-chinese text-sm"
              >
                確認
              </button>
              <button
                type="button"
                onClick={() => setShowScheduler(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 font-chinese text-sm"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 狀態歷史記錄 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">狀態變更記錄</h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {statusHistory.map((entry, index) => {
            const config = statusConfig[entry.status] || statusConfig.draft;
            const StatusIcon = config.icon;
            
            return (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-1 rounded-full ${config.bgColor}`}>
                  <StatusIcon className={`w-4 h-4 ${config.textColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 font-chinese">
                      {entry.previousStatus ? 
                        `${getStatusDisplay(entry.previousStatus)} → ${getStatusDisplay(entry.status)}` : 
                        getStatusDisplay(entry.status)
                      }
                    </p>
                    <time className="text-xs text-gray-500">
                      {entry.timestamp.toLocaleString('zh-TW')}
                    </time>
                  </div>
                  
                  <p className="text-sm text-gray-600 font-chinese">{entry.reason}</p>
                  <p className="text-xs text-gray-500 font-chinese">操作者: {entry.user}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 自動狀態規則 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">自動狀態規則</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="font-chinese">庫存為0時自動下架</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="font-chinese">低庫存時發送通知</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="font-chinese">排程時間到時自動發布</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStatusManager;