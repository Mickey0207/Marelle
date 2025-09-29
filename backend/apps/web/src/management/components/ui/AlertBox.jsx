import React, { useEffect } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const AlertBox = ({ 
  show, 
  onClose, 
  title = "提醒", 
  message, 
  type = "warning", // warning, error, success, info
  autoClose = 5000 
}) => {
  useEffect(() => {
    if (show && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  if (!show) return null;

  const typeStyles = {
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      closeButton: 'text-yellow-400 hover:text-yellow-600'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-400',
      title: 'text-red-800',
      closeButton: 'text-red-400 hover:text-red-600'
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-400',
      title: 'text-green-800',
      closeButton: 'text-green-400 hover:text-green-600'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      closeButton: 'text-blue-400 hover:text-blue-600'
    }
  };

  const styles = typeStyles[type];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      <div className={`
        ${styles.container} 
        border rounded-lg p-4 shadow-lg backdrop-blur-sm
        animate-in slide-in-from-right-full duration-300
      `}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${styles.icon}`}>
            <ExclamationTriangleIcon className="h-5 w-5" />
          </div>
          
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {title}
            </h3>
            {message && (
              <div className="mt-1 text-sm">
                {typeof message === 'string' ? (
                  <p>{message}</p>
                ) : (
                  message
                )}
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className={`
                inline-flex rounded-md p-1.5 transition-colors duration-200
                ${styles.closeButton}
                hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current
              `}
            >
              <span className="sr-only">關閉</span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* 進度條 */}
        {autoClose > 0 && (
          <div className="mt-3 w-full bg-white/30 rounded-full h-1">
            <div 
              className="bg-current h-1 rounded-full transition-all duration-75 ease-out"
              style={{
                animation: `shrink ${autoClose}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default AlertBox;