import React from 'react';

// 更通用的表單欄位容器：支援 label/hint/error/required/description
export default function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
  required = false,
  description = null,
  className = ''
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {description && (
        <div className="text-xs text-gray-500 mb-1">{description}</div>
      )}
      {children}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
