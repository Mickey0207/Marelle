import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Navbar from "../components/layout/Navbar";

const FrontLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // TODO: 串接前台會員登入API
    if (credentials.username === 'user' && credentials.password === 'password') {
      // 假設登入成功
      navigate('/');
    } else {
      setError('帳號或密碼錯誤');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f2]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-8 pt-16">
        {/* LOGO 區域 */}
        <div className="w-full max-w-md mx-auto mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#cc824d] to-[#b86c37] rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-3xl font-serif font-bold">M</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#2d1e0f] mb-2 tracking-wider">Marelle 登入</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-transparent flex flex-col items-center">
          <div className="w-full flex flex-col gap-6">
            <div>
              <input
                type="text"
                value={credentials.username}
                onChange={e => handleInputChange('username', e.target.value)}
                className="block w-full border-0 border-b border-[#e5ded6] bg-transparent text-base py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
                placeholder="信箱或手機號碼"
                required
                autoFocus
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
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
              disabled={isLoading}
              className="w-full bg-[#cc824d] hover:bg-[#b86c37] text-white text-base font-bold py-3 rounded transition-colors font-serif tracking-wider mt-2 disabled:bg-[#e5ded6] disabled:text-[#bfae9b]"
            >
              {isLoading ? '登入中...' : '開始購物吧！'}
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
        <div className="w-full max-w-md mx-auto flex flex-col items-center mt-8">
          <h3 className="text-xl font-serif font-bold text-[#2d1e0f] mb-4 tracking-wider">還不是會員？</h3>
          <button onClick={() => navigate('/register')} className="w-full border border-[#cc824d] text-[#cc824d] text-base font-bold py-3 rounded transition-colors font-serif tracking-wider hover:bg-[#f7ede3]">註冊會員</button>
        </div>
      </main>
    </div>
  );
};

export default FrontLogin;
