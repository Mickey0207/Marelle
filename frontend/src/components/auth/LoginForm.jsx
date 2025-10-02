import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginForm({ onSubmit, isLoading, error }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(credentials, () => setCredentials({ username: '', password: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-transparent flex flex-col items-center">
      <div className="w-full flex flex-col gap-5 xs:gap-5 sm:gap-6 md:gap-6 lg:gap-7">
        <div>
          <input
            type="text"
            value={credentials.username}
            onChange={e => handleChange('username', e.target.value)}
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
            onChange={e => handleChange('password', e.target.value)}
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
  );
}
