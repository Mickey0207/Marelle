// 價格與格式相關工具
export const formatPrice = (num) => `NT$${num.toLocaleString('zh-TW', { minimumFractionDigits: 0 })}`;
