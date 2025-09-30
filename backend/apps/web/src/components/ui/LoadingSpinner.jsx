import React from 'react';
import { ADMIN_STYLES } from '../../Style/adminStyles';

/**
 * 統一的圈圈載入元件
 * - 預設顯示置中的圓形旋轉圖示
 * - 可選擇全頁模式(fullPage)來顯示全螢幕置中
 */
const LoadingSpinner = ({ message = '載入中...', fullPage = false }) => {
  const containerClass = fullPage
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm'
    : 'w-full flex items-center justify-center py-8';

  return (
    <div className={containerClass} role="status" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-3">
        <div className={ADMIN_STYLES.loadingSpinner} />
        {message ? (
          <span className="text-sm text-gray-600 font-chinese">{message}</span>
        ) : null}
      </div>
    </div>
  );
};

export default LoadingSpinner;
