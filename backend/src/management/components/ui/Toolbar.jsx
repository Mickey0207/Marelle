import React from 'react';

// 通用工具列/頁首：支援標題、描述、麵包屑與右側動作
export default function Toolbar({
  title,
  description,
  actions = null,
  breadcrumbs = null,
  className = ''
}) {
  return (
    <div className={`mb-8 ${className}`}>
      {breadcrumbs && (
        <div className="mb-2 text-sm text-gray-500 flex items-center gap-2">
          {breadcrumbs}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          {title && <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        {actions && (
          <div className="mt-4 sm:mt-0 flex items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
