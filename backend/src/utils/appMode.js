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
      const port = window.location.port;
      
      // 3001 端口固定為後台管理
      if (port === '3001') {
        return 'admin';
      }
      
      // 檢查是否有明確的模式參數（作為備用方案）
      const searchParams = new URLSearchParams(window.location.search);
      const modeParam = searchParams.get('mode');
      
      if (modeParam === 'admin') {
        return 'admin';
      }
      
      // 3000 端口固定為前台
      return 'front';
    }
  }
  
  // 預設為前台
  return 'front';
};

export const isAdminMode = () => getAppMode() === 'admin';
export const isFrontMode = () => getAppMode() === 'front';