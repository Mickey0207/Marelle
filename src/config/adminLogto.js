// 後台管理系統的 Logto 配置
export const adminLogtoConfig = {
  endpoint: import.meta.env.VITE_ADMIN_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_ADMIN_LOGTO_APP_ID,
  scopes: [
    // OpenID Connect 標準範圍
    'openid',
    'profile',
    'email'
  ],
  // 後台管理系統的重定向 URL
  redirectUri: (() => {
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/callback'
        : 'https://admin.marelle.com.tw/callback';
    }
    return 'http://localhost:3001/callback';
  })(),
  // 登出後重定向 URL  
  postLogoutRedirectUri: (() => {
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost'
        ? 'http://localhost:3001/login'
        : 'https://admin.marelle.com.tw/login';
    }
    return 'http://localhost:3001/login';
  })()
};

// 檢查配置是否完整
export const validateAdminLogtoConfig = () => {
  const requiredFields = ['endpoint', 'appId'];
  const missingFields = requiredFields.filter(field => !adminLogtoConfig[field]);
  
  if (missingFields.length > 0) {
    console.warn('後台 Logto 配置不完整，缺少字段:', missingFields);
    return false;
  }
  
  return true;
};