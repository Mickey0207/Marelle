import React from 'react';
import GlassModal from './GlassModal';

/**
 * 確認刪除/操作的模態框
 * @param {boolean} isOpen - 是否顯示
 * @param {function} onClose - 關閉回調
 * @param {function} onConfirm - 確認回調
 * @param {string} title - 標題
 * @param {string} message - 確認訊息
 * @param {string} confirmVariant - 確認按鈕樣式 ('danger' | 'default')
 * @param {string} cancelText - 取消按鈕文字
 * @param {string} confirmText - 確認按鈕文字
 * @param {boolean} isLoading - 是否正在提交
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '確認操作',
  message = '確定要執行此操作嗎？',
  confirmVariant = 'danger',
  cancelText = '取消',
  confirmText = '確認',
  isLoading = false
}) => {
  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="max-w-md"
    >
      <div className="p-6 pt-0">
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white transition disabled:opacity-50 ${
              confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#cc824d] hover:bg-[#b8734a]'
            }`}
          >
            {isLoading ? '處理中...' : confirmText}
          </button>
        </div>
      </div>
    </GlassModal>
  );
};

export default ConfirmModal;
