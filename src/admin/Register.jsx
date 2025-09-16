import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Register = () => {
  const [form, setForm] = useState({
    country: 'TW',
    phone: '',
    email: '',
    agree1: false,
    agree2: false
  });
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleCheckbox = (field) => {
    setForm(f => ({ ...f, [field]: !f[field] }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: 實際註冊流程
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f2]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-8 pt-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col items-center">
          <h2 className="text-2xl font-serif font-bold text-[#2d1e0f] mb-8 mt-2 tracking-wider">註冊會員</h2>
          <div className="w-full flex flex-col gap-6">
            <div className="flex gap-2 items-center">
              <select 
                value={form.country} 
                onChange={e => handleChange('country', e.target.value)} 
                className="border-0 border-b-2 border-[#e5ded6] bg-transparent text-base py-3 px-0 focus:ring-0 focus:border-[#cc824d] transition-colors duration-200 font-serif appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2rem'
                }}
              >
                <option value="TW">🇹🇼 TW+886</option>
                <option value="US">🇺🇸 US+1</option>
                <option value="CN">🇨🇳 CN+86</option>
                <option value="JP">🇯🇵 JP+81</option>
                <option value="KR">🇰🇷 KR+82</option>
                {/* 可擴充其他國碼 */}
              </select>
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
          <div className="flex gap-6 justify-center mb-8">
            <button type="button" className="w-12 h-12 rounded-full bg-[#00c300] flex items-center justify-center shadow hover:scale-105 transition-transform"><i className="fa-brands fa-line text-white text-2xl" /></button>
            <button type="button" className="w-12 h-12 rounded-full bg-[#1877f2] flex items-center justify-center shadow hover:scale-105 transition-transform"><i className="fa-brands fa-facebook-f text-white text-2xl" /></button>
          </div>
        </form>
        <div className="w-full max-w-md mx-auto flex flex-col items-center mt-8">
          <h3 className="text-xl font-serif font-bold text-[#2d1e0f] mb-2 tracking-wider">已經有帳號？</h3>
          <div className="text-[#bfae9b] text-sm mb-4">立即登入享有更多優惠！</div>
          <button onClick={() => navigate('/admin/login')} className="w-full border border-[#cc824d] text-[#cc824d] text-base font-bold py-3 rounded transition-colors font-serif tracking-wider hover:bg-[#f7ede3]">登入</button>
        </div>
      </main>
      <footer className="w-full mt-24 px-8 pb-8 pt-16 bg-transparent text-[#bfae9b] text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-serif font-bold mb-2">Lo-Fi warehouse</div>
            <div className="mb-2 text-xs">A missing piece of homestyle<br />歡迎你的來過，帶走一個你喜歡的風格</div>
          </div>
          <div>
            <div className="font-serif font-bold mb-2">品牌資訊</div>
            <div className="text-xs leading-6">會員帳戶<br />品牌理念<br />品牌故事</div>
          </div>
          <div>
            <div className="font-serif font-bold mb-2">常見問題</div>
            <div className="text-xs leading-6">訂單狀態<br />購物須知<br />配送說明<br />退換貨服務</div>
          </div>
          <div>
            <div className="font-serif font-bold mb-2">聯絡我們</div>
            <div className="text-xs leading-6">LINE ID：@lofiwarehouse<br />客服時間：週一至週五 10:00 - 18:00<br />信箱：lofi-warehouse.service@lofi-house.com</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
