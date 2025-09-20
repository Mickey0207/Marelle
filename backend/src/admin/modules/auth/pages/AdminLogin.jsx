import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
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
    <div className="min-h-screen flex flex-col bg-[#fdf8f2]">
      <main className="flex-1 flex flex-col items-center justify-center py-8 pt-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-transparent flex flex-col items-center">
          <h2 className="text-2xl font-serif font-bold text-[#2d1e0f] mb-8 mt-2 tracking-wider">Marelle 管理員登入</h2>
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
            <div className="flex justify-end">
              <button type="button" className="text-xs text-[#bfae9b] hover:underline font-serif">忘記密碼？</button>
            </div>
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
          <button type="button" className="w-full bg-[#00c300] hover:bg-[#00b300] text-white text-base font-bold py-3 rounded transition-colors font-serif tracking-wider flex items-center justify-center gap-3">
            <i className="fa-brands fa-line text-xl" />
            <span>LINE 登入</span>
          </button>
        </div>
        
        {/* 預設帳號提示 */}
        <div className="w-full max-w-md mx-auto mt-8 p-4 bg-[#f7f2e8] border border-[#e5ded6] rounded">
          <h4 className="text-sm font-bold text-[#2d1e0f] mb-2 font-serif">預設管理員帳號</h4>
          <div className="text-xs text-[#666] space-y-1 font-serif">
            <p>帳號：admin@marelle.com</p>
            <p>密碼：Admin123!</p>
            <p className="text-[#cc824d] mt-2">建議首次登入後立即修改密碼</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
