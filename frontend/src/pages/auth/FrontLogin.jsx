import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Navbar from "../../components/layout/Navbar";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50" style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFDFB 100%)'}}>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-6 xs:py-8 sm:py-10 md:py-12 pt-16 xs:pt-18 sm:pt-20 md:pt-20 px-4 xs:px-6 sm:px-8">
        {/* LOGO 區域 */}
        <div className="w-full max-w-md mx-auto mb-6 xs:mb-7 sm:mb-8 md:mb-8 lg:mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#cc824d] to-[#b86c37] rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl mb-3 xs:mb-3 sm:mb-4 md:mb-4 shadow-lg">
            <span className="text-white text-2xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-serif font-bold">M</span>
          </div>
          <h1 className="text-2xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-serif font-bold text-[#2d1e0f] mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 tracking-wider">Marelle 登入</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-transparent flex flex-col items-center">
          <div className="w-full flex flex-col gap-5 xs:gap-5 sm:gap-6 md:gap-6 lg:gap-7">
            <div>
              <input
                type="text"
                value={credentials.username}
                onChange={e => handleInputChange('username', e.target.value)}
                className="block w-full border-0 border-b border-[#e5ded6] bg-transparent text-sm xs:text-sm sm:text-base md:text-base lg:text-lg py-2.5 xs:py-2.5 sm:py-3 md:py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
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
                className="block w-full border-0 border-b border-[#e5ded6] bg-transparent text-sm xs:text-sm sm:text-base md:text-base lg:text-lg py-2.5 xs:py-2.5 sm:py-3 md:py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
                placeholder="密碼"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#bfae9b] hover:text-[#a88c6b]"
                tabIndex={-1}
              >
                {showPassword ? <EyeSlashIcon className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" /> : <EyeIcon className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" />}
              </button>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-[10px] xs:text-xs sm:text-xs md:text-sm text-[#bfae9b] hover:underline font-serif">忘記密碼？</button>
            </div>
            {error && (
              <div className="text-red-600 text-xs xs:text-xs sm:text-sm md:text-sm font-serif text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#cc824d] hover:bg-[#b86c37] text-white text-sm xs:text-sm sm:text-base md:text-base lg:text-lg font-bold py-2.5 xs:py-2.5 sm:py-3 md:py-3 lg:py-3.5 rounded transition-colors font-serif tracking-wider mt-1.5 xs:mt-2 sm:mt-2 md:mt-2 disabled:bg-[#e5ded6] disabled:text-[#bfae9b]"
            >
              {isLoading ? '登入中...' : '開始購物吧！'}
            </button>
          </div>
          <div className="w-full flex items-center my-5 xs:my-5 sm:my-6 md:my-6 lg:my-7">
            <div className="flex-1 h-px bg-[#e5ded6]" />
            <span className="mx-3 xs:mx-3 sm:mx-4 md:mx-4 text-[#bfae9b] text-xs xs:text-xs sm:text-sm md:text-sm font-serif">或使用社群帳號登入</span>
            <div className="flex-1 h-px bg-[#e5ded6]" />
          </div>
        </form>
        <div className="w-full max-w-md mx-auto mb-6 xs:mb-7 sm:mb-8 md:mb-8">
          <button type="button" className="w-full bg-[#00c300] hover:bg-[#00b300] text-white text-sm xs:text-sm sm:text-base md:text-base lg:text-lg font-bold py-2.5 xs:py-2.5 sm:py-3 md:py-3 lg:py-3.5 rounded transition-colors font-serif tracking-wider flex items-center justify-center gap-2 xs:gap-2 sm:gap-3 md:gap-3">
            <i className="fa-brands fa-line text-lg xs:text-lg sm:text-xl md:text-xl" />
            <span>LINE 登入</span>
          </button>
        </div>
        <div className="w-full max-w-md mx-auto flex flex-col items-center mt-6 xs:mt-7 sm:mt-8 md:mt-8">
          <h3 className="text-lg xs:text-lg sm:text-xl md:text-xl lg:text-2xl font-serif font-bold text-[#2d1e0f] mb-3 xs:mb-3 sm:mb-4 md:mb-4 tracking-wider">還不是會員？</h3>
          <button onClick={() => navigate('/register')} className="w-full border border-[#cc824d] text-[#cc824d] text-sm xs:text-sm sm:text-base md:text-base lg:text-lg font-bold py-2.5 xs:py-2.5 sm:py-3 md:py-3 lg:py-3.5 rounded transition-colors font-serif tracking-wider hover:bg-[#f7ede3]">註冊會員</button>
        </div>
      </main>
    </div>
  );
};

export default FrontLogin;
