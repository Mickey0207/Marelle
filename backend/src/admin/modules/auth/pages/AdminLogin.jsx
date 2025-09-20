import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, KeyIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth, LoginAttemptWarning } from '../../../shared/components/AuthComponents';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = login(formData);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // 清除錯誤訊息
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8f2] via-[#f8f1e9] to-[#f3e8d7] flex items-center justify-center p-4">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-[#cc824d] opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-[#cc824d] opacity-10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo 區域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#cc824d] rounded-2xl mb-4">
            <KeyIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-chinese mb-2">Marelle</h1>
          <p className="text-gray-600 font-chinese">管理後台系統</p>
        </div>

        {/* 登入表單 */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-chinese mb-2">管理員登入</h2>
            <p className="text-gray-600 text-sm font-chinese">請使用您的管理員帳號登入系統</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 電子信箱輸入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                管理員帳號
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese placeholder-gray-400"
                  placeholder="輸入電子郵箱地址"
                  required
                />
              </div>
              <LoginAttemptWarning email={formData.email} />
            </div>

            {/* 密碼輸入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
                密碼
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#cc824d] focus:border-transparent font-chinese placeholder-gray-400"
                  placeholder="輸入您的密碼"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-800 font-chinese">{error}</span>
                </div>
              </div>
            )}

            {/* 登入按鈕 */}
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full py-3 px-4 bg-[#cc824d] text-white rounded-xl font-semibold font-chinese
                       hover:bg-[#b3723f] focus:ring-4 focus:ring-[#cc824d]/20 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登入中...
                </div>
              ) : (
                '登入管理後台'
              )}
            </button>
          </form>

          {/* 預設帳號顯示 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="text-sm font-semibold text-blue-900 mb-2 font-chinese">預設管理員帳號</h4>
            <div className="text-xs text-blue-700 space-y-1 font-chinese">
              <p>帳號：admin@marelle.com</p>
              <p>密碼：Admin123!</p>
              <p className="text-blue-600 mt-2">建議首次登入後立即修改密碼</p>
            </div>
          </div>

          {/* 安全提示 */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 font-chinese">
              為保護帳號安全，請勿在公共電腦上登入
            </p>
          </div>
        </div>

        {/* 錯誤訊息 */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-chinese">
            © 2024 Marelle. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
