import React from 'react';

// 共用的表格操作按鈕（採用物流追蹤頁樣式）
// - 預設：p-2 text-gray-400 transition-colors
// - hover 顏色依 variant 切換文字色（不使用背景色）
// - 必備 title 與 aria-label 以提升可近用性

const VARIANT_HOVER_CLASS = {
  blue: 'hover:text-blue-500',
  amber: 'hover:text-amber-600',
  green: 'hover:text-green-600',
  red: 'hover:text-red-600',
  gray: 'hover:text-gray-600',
};

const SIZE_ICON_CLASS = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export default function IconActionButton({
  Icon, // Heroicons 元件，例如 EyeIcon
  label, // 顯示於 title 與 aria-label
  onClick,
  variant = 'gray', // blue | amber | green | red | gray
  size = 'md', // sm | md | lg
  className = '',
  disabled = false,
  type = 'button',
}) {
  const hoverCls = VARIANT_HOVER_CLASS[variant] || VARIANT_HOVER_CLASS.gray;
  const iconCls = SIZE_ICON_CLASS[size] || SIZE_ICON_CLASS.md;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 text-gray-400 transition-colors ${hoverCls} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={label}
      aria-label={label}
    >
      {Icon ? <Icon className={iconCls} /> : null}
    </button>
  );
}
