import React from 'react';

// 通用頁首區塊：左側標題/描述，右側自訂動作
export default function HeaderBar({ title, description, actions = null, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 ${className}`}>
      <div>
        {title && <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>}
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      {actions && (
        <div className="mt-4 sm:mt-0 flex items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
