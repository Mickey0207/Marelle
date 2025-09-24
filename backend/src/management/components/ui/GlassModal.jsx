import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * 通用玻璃態Modal組件
 * @param {boolean} isOpen - 是否顯示Modal
 * @param {function} onClose - 關閉Modal的回調函數
 * @param {string} title - Modal標題
 * @param {React.ReactNode} children - Modal內容
 * @param {string} size - Modal大小 (Tailwind CSS class)
 * @param {boolean} showCloseButton - 是否顯示關閉按鈕 (預設為true)
 * @param {string} headerClass - 自訂標題列樣式
 */
const GlassModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'max-w-4xl',
  showCloseButton = true,
  headerClass = 'bg-gradient-to-r from-[#cc824d]/80 to-[#b3723f]/80'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      {/* 玻璃態背景遮罩 */}
      <div 
        className="absolute inset-0 bg-white/20 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      {/* 玻璃態彈出視窗 */}
  <div className={`relative ${size} w-full max-h-[90vh] overflow-visible rounded-3xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl`}>
        {/* 標題列 */}
        {title && (
          <div className={`${headerClass} backdrop-blur-sm text-white px-6 py-4 border-b border-white/20 rounded-t-3xl`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-chinese">{title}</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* 內容區域 */}
        <div className="relative overflow-y-auto overflow-x-visible max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlassModal;