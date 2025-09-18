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
    { status: 'draft', timestamp: new Date(), user: 'ç³»çµ±ç®¡ç???, reason: '?†å?å»ºç?' }
  ]);
  const [showScheduler, setShowScheduler] = useState(false);
  const [stockAlert, setStockAlert] = useState(false);

  const statusConfig = {
    draft: {
      name: { 'zh-TW': '?‰ç¨¿', 'en': 'Draft' },
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-300',
      icon: ClockIcon,
      description: '?†å?å°šæœª?¼å?ï¼Œå?ç®¡ç??¡å¯è¦?
    },
    active: {
      name: { 'zh-TW': '?Ÿç”¨', 'en': 'Active' },
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
      icon: CheckCircleIcon,
      description: '?†å?å·²ç™¼å¸ƒï?å°é¡§å®¢å¯è¦?
    },
    inactive: {
      name: { 'zh-TW': '?œç”¨', 'en': 'Inactive' },
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
      icon: XCircleIcon,
      description: '?†å?å·²ä??¶ï?å°é¡§å®¢ä??¯è?'
    },
    scheduled: {
      name: { 'zh-TW': '?’ç??¼å?', 'en': 'Scheduled' },
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
      icon: CalendarIcon,
      description: '?†å?å°‡åœ¨?‡å??‚é??¼å?'
    },
    out_of_stock: {
      name: { 'zh-TW': 'ç¼ºè²¨', 'en': 'Out of Stock' },
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
      icon: ExclamationTriangleIcon,
      description: '?†å?åº«å?ä¸è¶³ï¼Œå»ºè­°è?è²?
    }
  };

  useEffect(() => {
    // æª¢æŸ¥åº«å??€??
    if (stockLevel <= 0 && currentStatus === 'active') {
      setStockAlert(true);
      // åº«å?è­¦å??•ç•«
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

    // ?€?‹è??´é?è­?
    if (newStatus === 'active' && stockLevel <= 0) {
      if (!window.confirm('?†å?åº«å???ï¼Œç¢ºå®šè??Ÿç”¨?ï?')) {
        return;
      }
    }

    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    
    // æ·»å??°æ­·?²è???
    const newHistoryEntry = {
      status: newStatus,
      previousStatus,
      timestamp: new Date(),
      user: '?¶å??¨æˆ¶', // å¯¦é??‰ç”¨ä¸­æ?è©²å??¨æˆ¶?€?‹ç²??
      reason: reason || getDefaultReason(newStatus)
    };
    
    setStatusHistory(prev => [newHistoryEntry, ...prev]);
    
    // ?€?‹è??´å???
    gsap.fromTo('.status-indicator',
      { scale: 0.8, rotation: -10 },
      { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' }
    );
    
    onStatusChange?.(newStatus, newHistoryEntry);
  };

  const getDefaultReason = (status) => {
    const reasons = {
      draft: 'è¨­ç‚º?‰ç¨¿?€??,
      active: '?†å?ä¸Šæ¶',
      inactive: '?†å?ä¸‹æ¶',
      scheduled: 'è¨­å??’ç??¼å?'
    };
    return reasons[status] || '?€?‹è???;
  };

  const handleScheduledPublish = () => {
    if (!scheduledDate) {
      alert('è«‹é¸?‡ç™¼å¸ƒæ???);
      return;
    }
    
    const scheduleTime = new Date(scheduledDate);
    const now = new Date();
    
    if (scheduleTime <= now) {
      alert('?¼å??‚é?å¿…é??¯æœªä¾†æ???);
      return;
    }
    
    handleStatusChange('scheduled', `?’ç???${scheduleTime.toLocaleString('zh-TW')} ?¼å?`);
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
      {/* ?¶å??€?‹é¡¯ç¤?*/}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">?†å??€??/h3>
        
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
                ?¼å??‚é?: {new Date(scheduledDate).toLocaleString('zh-TW')}
              </p>
            )}
          </div>
        </div>

        {/* åº«å?è­¦å? */}
        {stockAlert && (
          <div className="stock-alert bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-800 font-chinese">åº«å?è­¦å?</h4>
                <p className="text-sm text-yellow-700 font-chinese">
                  ?†å?åº«å???{stockLevel}ï¼Œå»ºè­°è?è²¨æ?ä¸‹æ¶?†å?
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleStatusChange('inactive', '? åº«å­˜ä?è¶³ä???)}
                    className="text-xs px-3 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded font-chinese"
                  >
                    ?«æ?ä¸‹æ¶
                  </button>
                  <button
                    onClick={() => setStockAlert(false)}
                    className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-chinese"
                  >
                    ç¨å??•ç?
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ?€?‹æ?ä½œæ???*/}
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
          
          {/* ?’ç??¼å??‰é? */}
          {!showScheduler && (
            <button
              type="button"
              onClick={() => setShowScheduler(true)}
              className="flex items-center px-3 py-2 rounded-lg border border-blue-300 bg-blue-100 text-blue-800 hover:opacity-80 transition-colors duration-200 font-chinese text-sm"
            >
              <CalendarIcon className="w-4 h-4 mr-1" />
              ?’ç??¼å?
            </button>
          )}
        </div>

        {/* ?’ç??¼å?è¨­å? */}
        {showScheduler && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-3 font-chinese">è¨­å??¼å??‚é?</h4>
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
                ç¢ºè?
              </button>
              <button
                type="button"
                onClick={() => setShowScheduler(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 font-chinese text-sm"
              >
                ?–æ?
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ?€?‹æ­·?²è???*/}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">?€?‹è??´è???/h3>
        
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
                        `${getStatusDisplay(entry.previousStatus)} ??${getStatusDisplay(entry.status)}` : 
                        getStatusDisplay(entry.status)
                      }
                    </p>
                    <time className="text-xs text-gray-500">
                      {entry.timestamp.toLocaleString('zh-TW')}
                    </time>
                  </div>
                  
                  <p className="text-sm text-gray-600 font-chinese">{entry.reason}</p>
                  <p className="text-xs text-gray-500 font-chinese">?ä??? {entry.user}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ?ªå??€?‹è???*/}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">?ªå??€?‹è???/h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="font-chinese">åº«å????‚è‡ª?•ä???/span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="font-chinese">ä½åº«å­˜æ??¼é€é€šçŸ¥</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="font-chinese">?’ç??‚é??°æ??ªå??¼å?</span>
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
