import { useLogto } from '@logto/react';
import { useEffect, useRef } from 'react';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading, signIn } = useLogto();
  const hasTriggeredSignIn = useRef(false);

  useEffect(() => {
    // 如果未認證且不在載入中，且尚未觸發登入
    if (!isLoading && !isAuthenticated && !hasTriggeredSignIn.current) {
      hasTriggeredSignIn.current = true;
      signIn('http://localhost:3001/callback');
    }
    
    // 如果已認證，重置標記
    if (isAuthenticated) {
      hasTriggeredSignIn.current = false;
    }
  }, [isAuthenticated, isLoading, signIn]);

  // 如果正在載入或未認證，顯示載入畫面
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-apricot-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isLoading ? '驗證中...' : '重定向中...'}
          </h2>
          <p className="text-gray-600">
            {isLoading ? '正在檢查登入狀態' : '正在跳轉到登入頁面'}
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;