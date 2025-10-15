import React, { useEffect } from 'react';
import GlassModal from './GlassModal.jsx';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * 共用成功提示模態
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - title?: string (預設: '操作成功')
 * - message?: string
 * - autoCloseMs?: number (預設: 3000; 設為 0/undefined 表示不自動關閉)
 * - size?: string (Tailwind max-w 類; 預設: 'max-w-xl')
 * - icon?: ReactNode (預設: 綠色勾勾)
 */
const SuccessModal = ({
  isOpen,
  onClose,
  title = '操作成功',
  message,
  autoCloseMs = 3000,
  size = 'max-w-xl',
  icon,
}) => {
  useEffect(() => {
    if (!isOpen || !autoCloseMs) return;
    const t = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(t);
  }, [isOpen, autoCloseMs, onClose]);

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      size={size}
      showCloseButton={false}
      headerClass=""
    >
      <div className="px-6 py-0 glass-modal-root">
        <div className="glass-modal-portal"></div>
        <div className="text-center">
          {icon ?? <CheckCircleIcon className="w-16 h-16 text-green-500 inline-block mt-8 mb-4" />}
          <h3 className="text-2xl font-bold font-chinese mb-2" style={{ color: '#333333' }}>{title}</h3>
          {message && (
            <p className="text-sm font-chinese mb-8" style={{ color: '#666666' }}>{message}</p>
          )}
        </div>
      </div>
    </GlassModal>
  );
};

export default SuccessModal;
