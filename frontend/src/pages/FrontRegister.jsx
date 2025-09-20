import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Navbar from "../components/layout/Navbar";

const FrontRegister = () => {
  const [form, setForm] = useState({
    country: 'TW',
    phone: '',
    email: '',
    agree1: false,
    agree2: false
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const countries = [
    { code: 'TW', label: 'TW+886'},
  ];
  
  const navigate = useNavigate();

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleCheckbox = (field) => {
    setForm(f => ({ ...f, [field]: !f[field] }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: 串接前台會員註冊API
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
          <h1 className="text-3xl font-serif font-bold text-[#2d1e0f] mb-2 tracking-wider">Marelle 註冊會員</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col items-center">
          <div className="w-full flex flex-col gap-6">
            <div className="flex gap-2 items-center">
              {/* 自定義國家代碼選擇器 */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-3 border-0 border-b border-[#e5ded6] bg-transparent text-base focus:outline-none focus:border-[#bfae9b] font-serif min-w-[120px] transition-colors duration-200"
                >
                  <span className="text-lg">{countries.find(c => c.code === form.country)?.flag}</span>
                  <span className="text-[#2d1e0f]">{countries.find(c => c.code === form.country)?.label}</span>
                  <ChevronDownIcon className={`w-4 h-4 text-[#bfae9b] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* 下拉選單 */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5ded6] rounded-lg shadow-lg z-10 overflow-hidden">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          handleChange('country', country.code);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-[#f7f2e8] transition-colors duration-200 font-serif"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-[#2d1e0f]">{country.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                className="flex-1 border-0 border-b border-[#e5ded6] bg-transparent text-base py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
                placeholder="912 345 678"
                required
              />
            </div>
            <div>
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                className="block w-full border-0 border-b border-[#e5ded6] bg-transparent text-base py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
                placeholder="電郵"
                required
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-[#bfae9b]">
              <input type="checkbox" id="agree1" checked={form.agree1} onChange={() => handleCheckbox('agree1')} className="accent-[#cc824d]" />
              <label htmlFor="agree1">我願意接收Lo-Fi warehouse 居家生活館最新優惠活動及及服務推播/簡訊/郵件</label>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#bfae9b]">
              <input type="checkbox" id="agree2" checked={form.agree2} onChange={() => handleCheckbox('agree2')} className="accent-[#cc824d]" />
              <label htmlFor="agree2">我同意網站 <a href="#" className="underline">服務條款及隱私權條款</a></label>
            </div>
            <button type="submit" className="w-full bg-[#e5ded6] text-[#bfae9b] text-base font-bold py-3 rounded font-serif tracking-wider mt-2 cursor-not-allowed" disabled>下一步</button>
          </div>
          <div className="w-full flex items-center my-6">
            <div className="flex-1 h-px bg-[#e5ded6]" />
            <span className="mx-4 text-[#bfae9b] text-sm font-serif">或使用社群帳號註冊</span>
            <div className="flex-1 h-px bg-[#e5ded6]" />
          </div>
        </form>
        <div className="w-full max-w-md mx-auto mb-8">
          <button type="button" className="w-full bg-[#00c300] hover:bg-[#00b300] text-white text-base font-bold py-3 rounded transition-colors font-serif tracking-wider flex items-center justify-center gap-3">
            <i className="fa-brands fa-line text-xl" />
            <span>LINE 註冊</span>
          </button>
        </div>
        <div className="w-full max-w-md mx-auto flex flex-col items-center mt-8">
          <h3 className="text-xl font-serif font-bold text-[#2d1e0f] mb-2 tracking-wider">已經有帳號？</h3>
          <div className="text-[#bfae9b] text-sm mb-4">立即登入享有更多優惠！</div>
          <button onClick={() => navigate('/login')} className="w-full border border-[#cc824d] text-[#cc824d] text-base font-bold py-3 rounded transition-colors font-serif tracking-wider hover:bg-[#f7ede3]">登入</button>
        </div>
      </main>
    </div>
  );
};

export default FrontRegister;
