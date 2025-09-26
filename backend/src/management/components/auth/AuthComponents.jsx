import React, { useState, useEffect, useContext, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { adminDataManager } from '../../../lib/data/admin/adminDataManager.js';
import { hasPermission } from '../../../lib/data/admin/adminConfig.js';
import { authManager } from '../../../lib/data/auth/authManager.js';

// 創建認證上下文
const AuthContext = createContext();

// 認證提供者組件
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // 檢查現有會話
    const token = localStorage.getItem('marelle-admin-token');
    if (token) {
  const session = authManager.validateSession(token);
      if (session) {
        setCurrentUser(session);
        setupSessionWarning(session);
      } else {
        localStorage.removeItem('marelle-admin-token');
      }
    }
  }, []);

  const setupSessionWarning = (session) => {
    // 計算會話到期時間
    const expirationTime = new Date(session.lastActivity).getTime() + (24 * 60 * 60 * 1000); // 24小時
    const warningTime = expirationTime - (10 * 60 * 1000); // 到期前10分鐘
    const now = Date.now();

    if (warningTime > now) {
      // 設定到期提醒
      setTimeout(() => {
        showSessionWarning();
      }, warningTime - now);
    }
  };

  const showSessionWarning = () => {
    setSessionWarning(true);
    setCountdown(10 * 60); // 10分鐘倒數

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          handleSessionExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleExtendSession = () => {
    const token = localStorage.getItem('marelle-admin-token');
    if (token) {
  authManager.updateSessionActivity(token);
      setSessionWarning(false);
      setCountdown(0);
      
      // 重新設定提醒
  const session = authManager.validateSession(token);
      if (session) {
        setupSessionWarning(session);
      }
    }
  };

  const handleSessionExpired = () => {
    logout();
    alert('會話已到期，請重新登入');
  };

  const login = (credentials) => {
  const result = authManager.authenticate(credentials.email, credentials.password);
    if (result.success) {
      localStorage.setItem('marelle-admin-token', result.sessionToken);
      setCurrentUser(result.user);
      setupSessionWarning(result.user);
      return { success: true };
    }
    return result;
  };

  const logout = () => {
    const token = localStorage.getItem('marelle-admin-token');
    if (token) {
  authManager.invalidateSession(token);
    }
    localStorage.removeItem('marelle-admin-token');
    setCurrentUser(null);
    setSessionWarning(false);
    setCountdown(0);
  };

  const checkPermission = (module, operation) => {
    return currentUser ? hasPermission(currentUser.permissions, module, operation) : false;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const value = {
    currentUser,
    login,
    logout,
    checkPermission,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* 會話到期警告模態框 */}
      {sessionWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-chinese">會話即將到期</h3>
              <p className="text-gray-600 mb-4 font-chinese">
                您的會話將在 <span className="font-bold text-red-600">{formatTime(countdown)}</span> 後到期
              </p>
              <p className="text-sm text-gray-500 mb-6 font-chinese">
                是否要繼續操作？
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleExtendSession}
                  className="flex-1 px-4 py-3 bg-[#cc824d] text-white rounded-xl hover:bg-[#b3723f] transition-colors font-chinese"
                >
                  繼續操作
                </button>
                <button
                  onClick={logout}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-chinese"
                >
                  登出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// 使用認證的Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 受保護的路由組件
export const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // 如果用戶未登入，重定向到登入頁面
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 權限檢查組件
export const PermissionGate = ({ module, operation, children, fallback = null }) => {
  const { checkPermission } = useAuth();
  
  if (checkPermission(module, operation)) {
    return children;
  }
  
  return fallback;
};

// 密碼強度驗證組件
export const PasswordStrengthIndicator = ({ password, showRequirements = true }) => {
  const requirements = [
    { test: /.{8,}/, text: '至少8個字元', met: false },
    { test: /[A-Z]/, text: '包含大寫字母', met: false },
    { test: /[a-z]/, text: '包含小寫字母', met: false },
    { test: /\d/, text: '包含數字', met: false },
    { test: /[!@#$%^&*(),.?":{}|<>]/, text: '包含特殊符號', met: false }
  ];

  requirements.forEach(req => {
    req.met = req.test.test(password);
  });

  const metCount = requirements.filter(req => req.met).length;
  const strength = metCount === 0 ? 0 : Math.round((metCount / requirements.length) * 100);

  const getStrengthColor = () => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength < 40) return '弱';
    if (strength < 70) return '中等';
    return '強';
  };

  return (
    <div className="mt-2">
      {password && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 font-chinese">密碼強度</span>
            <span className="text-xs font-medium font-chinese">{getStrengthText()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: `${strength}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {showRequirements && password && (
        <div className="space-y-1">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center text-xs">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                req.met ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {req.met && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`font-chinese ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                {req.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 登入嘗試次數顯示組件
export const LoginAttemptWarning = ({ email }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (email) {
      const userData = adminDataManager.getUserByEmail(email);
      setUser(userData);
    }
  }, [email]);

  if (!user || user.failedLoginAttempts === 0) {
    return null;
  }

  const remainingAttempts = 5 - user.failedLoginAttempts;
  const isLocked = user.lockedUntil && new Date(user.lockedUntil) > new Date();

  if (isLocked) {
    return (
      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-800 font-chinese">帳號已被鎖定</p>
            <p className="text-xs text-red-600 font-chinese">
              請聯繫管理員解鎖或等待24小時後自動解鎖
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-sm font-medium text-yellow-800 font-chinese">
            登入失敗 {user.failedLoginAttempts} 次
          </p>
          <p className="text-xs text-yellow-600 font-chinese">
            還有 {remainingAttempts} 次機會，超過將被鎖定24小時
          </p>
        </div>
      </div>
    </div>
  );
};