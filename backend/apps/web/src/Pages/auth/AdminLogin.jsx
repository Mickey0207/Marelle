import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth, LoginAttemptWarning } from '../../components/auth/AuthComponents';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lineMsg, setLineMsg] = useState('');

  useEffect(() => {
    // 解析 LINE callback 回來的狀態
    const params = new URLSearchParams(location.search);
    const status = params.get('line_status');
    const bound = params.get('bound');
    const reason = params.get('reason');
    if (!status) return;
    if (status === 'success') {
      if (bound === '1') setLineMsg('已綁定 LINE，後續可直接使用 LINE 登入');
      else setLineMsg('尚未綁定任何帳號，請先以 Email/密碼登入後至「第三方登入」完成綁定');
    } else if (status === 'error') {
      const r = reason || '未知錯誤';
      setLineMsg(`LINE 登入失敗：${decodeURIComponent(r)}`);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
  const result = await login(formData);
      
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
    <div className="min-h-screen flex flex-col bg-[#fdf8f2]">
      <main className="flex-1 flex flex-col items-center justify-center py-8 pt-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-transparent flex flex-col items-center">
          <h1 className="text-2xl font-serif font-bold text-[#2d1e0f] mb-8 mt-2 tracking-wider">Marelle 管理員登入</h1>
          <div className="w-full flex flex-col gap-6">
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className="block w-full border-0 border-b border-[#e5ded6] bg-transparent text-base py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
                placeholder="管理員信箱"
                required
                autoFocus
              />
              <LoginAttemptWarning email={formData.email} />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                className="block w-full border-0 border-b border-[#e5ded6] bg-transparent text-base py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
                placeholder="密碼"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#bfae9b] hover:text-[#a88c6b]"
                tabIndex={-1}
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {/* 移除忘記密碼按鈕 */}
            {error && (
              <div className="text-red-600 text-sm font-serif text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full bg-[#cc824d] hover:bg-[#b86c37] text-white text-base font-bold py-3 rounded transition-colors font-serif tracking-wider mt-2 disabled:bg-[#e5ded6] disabled:text-[#bfae9b]"
            >
              {loading ? '登入中...' : '進入管理後台'}
            </button>
          </div>
          <div className="w-full flex items-center my-6">
            <div className="flex-1 h-px bg-[#e5ded6]" />
            <span className="mx-4 text-[#bfae9b] text-sm font-serif">或使用社群帳號登入</span>
            <div className="flex-1 h-px bg-[#e5ded6]" />
          </div>
        </form>
        <div className="w-full max-w-md mx-auto mb-8">
          {lineMsg && (
            <div className="mb-3 text-sm text-[#2d1e0f] bg-[#fff2c2] border border-[#f1d48a] rounded p-3 font-serif text-center">
              {lineMsg}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              const apiBase = (window && window.__MARELLE_API_BASE__) || '/'
              const url = new URL('/backend/auth/line/start', apiBase)
              url.searchParams.set('next', `${window.location.origin}/`)
              window.location.href = url.toString()
            }}
            className="w-full bg-[#00c300] hover:bg-[#00b300] text-white text-base font-bold py-3 rounded transition-colors font-serif tracking-wider flex items-center justify-center gap-3"
          >
            <i className="fa-brands fa-line text-xl" />
            <span>LINE 登入</span>
          </button>
        </div>
        {/* 已移除預設帳號提示區塊 */}
      </main>
    </div>
  );
};

export default AdminLogin;
