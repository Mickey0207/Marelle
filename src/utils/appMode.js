// 根據主機名稱決定載入哪個應用
export const getAppMode = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // 檢查是否為 admin 子網域
    if (hostname.startsWith('admin.') || hostname.includes('admin')) {
      return 'admin';
    }
    
    // 檢查開發環境
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      // 可以根據 port 或 URL 參數來決定
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('mode') || 'admin'; // 預設為 admin 以便開發
    }
  }
  
  // 預設為前台
  return 'front';
};

export const isAdminMode = () => getAppMode() === 'admin';
export const isFrontMode = () => getAppMode() === 'front';