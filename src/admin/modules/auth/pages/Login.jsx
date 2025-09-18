import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Navbar from "../components/layout/Navbar";

// 完全仿照?��?設�?
const AdminLogin = () => {
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
    if (credentials.username === 'admin@marelle.com.tw' && credentials.password === 'Walkerkevin2580') {
      localStorage.setItem('marelle-admin-token', 'mock-token');
      navigate('/admin');
    } else {
      setError('帳�??��?碼錯�?);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f2]">
      {/* ?�用主�?導覽??*/}
      <Navbar />
      {/* 主內�?*/}
  <main className="flex-1 flex flex-col items-center justify-center py-8 pt-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-transparent flex flex-col items-center">
          <h2 className="text-2xl font-serif font-bold text-[#2d1e0f] mb-8 mt-2 tracking-wider">?�入</h2>
          <div className="w-full flex flex-col gap-6">
            <div>
              <input
                type="text"
                value={credentials.username}
                onChange={e => handleInputChange('username', e.target.value)}
                className="block w-full border-0 border-b border-[#e5ded6] bg-transparent text-base py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
                placeholder="信箱?��?機�?�?
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
              <button type="button" className="text-xs text-[#bfae9b] hover:underline font-serif">忘�?密碼�?/button>
            </div>
            {error && (
              <div className="text-red-600 text-sm font-serif text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#cc824d] hover:bg-[#b86c37] text-white text-base font-bold py-3 rounded transition-colors font-serif tracking-wider mt-2 disabled:bg-[#e5ded6] disabled:text-[#bfae9b]"
            >
              {isLoading ? '?�入�?..' : '?��?購物?��?'}
            </button>
          </div>
          <div className="w-full flex items-center my-6">
            <div className="flex-1 h-px bg-[#e5ded6]" />
            <span className="mx-4 text-[#bfae9b] text-sm font-serif">?�使?�社群帳?�登??/span>
            <div className="flex-1 h-px bg-[#e5ded6]" />
          </div>
          <div className="flex gap-6 justify-center mb-8">
            <button type="button" className="w-12 h-12 rounded-full bg-[#00c300] flex items-center justify-center shadow hover:scale-105 transition-transform"><i className="fa-brands fa-line text-white text-2xl" /></button>
            <button type="button" className="w-12 h-12 rounded-full bg-[#1877f2] flex items-center justify-center shadow hover:scale-105 transition-transform"><i className="fa-brands fa-facebook-f text-white text-2xl" /></button>
          </div>
        </form>
        <div className="w-full max-w-md mx-auto flex flex-col items-center mt-8">
          <h3 className="text-xl font-serif font-bold text-[#2d1e0f] mb-4 tracking-wider">?��??��??��?</h3>
          <button onClick={() => navigate('/admin/register')} className="w-full border border-[#cc824d] text-[#cc824d] text-base font-bold py-3 rounded transition-colors font-serif tracking-wider hover:bg-[#f7ede3]">註�??�員</button>
        </div>
      </main>
      {/* ?�腳 */}
      <footer className="w-full mt-24 px-8 pb-8 pt-16 bg-transparent text-[#bfae9b] text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-serif font-bold mb-2">Lo-Fi warehouse</div>
            <div className="mb-2 text-xs">A missing piece of homestyle<br />歡�?你�?來�?，帶走�??��??�歡?�風??/div>
          </div>
          <div>
            <div className="font-serif font-bold mb-2">?��?資�?</div>
            <div className="text-xs leading-6">?�員帳戶<br />?��??�念<br />?��??��?</div>
          </div>
          <div>
            <div className="font-serif font-bold mb-2">常�??��?</div>
            <div className="text-xs leading-6">訂單?�??br />購物?�知<br />?�送說??br />?�?�貨?��?</div>
          </div>
          <div>
            <div className="font-serif font-bold mb-2">?�絡?��?/div>
            <div className="text-xs leading-6">LINE ID：@lofiwarehouse<br />客�??��?：週�??�週�? 10:00 - 18:00<br />信箱：lofi-warehouse.service@lofi-house.com</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
