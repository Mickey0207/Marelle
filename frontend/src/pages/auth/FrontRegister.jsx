import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../external_mock/state/users.js';

const FrontRegister = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agree1: false,
    agree2: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ percent: 0, label: '' });
  
  const navigate = useNavigate();
  const location = useLocation();

  // 已登入者造訪 /register 時，自動導回來源頁或帳戶頁
  useEffect(() => {
    const u = getCurrentUser();
    if (u) {
      const from = location.state?.from || '/account';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  // 計算密碼強度：8-12 碼，且需同時包含英文與數字
  const evaluateStrength = (pwd) => {
    const lenOK = pwd.length >= 8 && pwd.length <= 12
    const hasEnglish = /[A-Za-z]/.test(pwd)
    const hasDigit = /\d/.test(pwd)
    const checks = [lenOK, hasEnglish, hasDigit]
    const met = checks.filter(Boolean).length
    const percent = Math.round((met / 3) * 100)
    let label = '弱'
    if (met === 2) label = '中等'
    if (met === 3) label = '強'
    return { percent, label, lenOK, hasEnglish, hasDigit }
  }

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (field === 'password') {
      setPasswordStrength(evaluateStrength(value))
    }
  };

  const handleCheckbox = (field) => {
    setForm(f => ({ ...f, [field]: !f[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');

    // 驗證欄位
    if (!form.email) {
      setError('請輸入 Email');
      return;
    }
    if (!form.password || !form.confirmPassword) {
      setError('請輸入密碼與確認密碼');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('兩次密碼不一致');
      return;
    }
    // 規則：8-12 碼，需包含英文與數字
    const { lenOK, hasEnglish, hasDigit } = evaluateStrength(form.password)
    if (!lenOK) {
      setError('密碼長度需為 8 至 12 碼');
      return;
    }
    if (!hasEnglish || !hasDigit) {
      setError('密碼需同時包含英文與數字');
      return;
    }
    if (!form.agree2) {
      setError('請同意服務條款及隱私權');
      return;
    }

    const email = form.email.trim();
    try {
      setSubmitting(true);
  const res = await fetch('/frontend/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: form.password })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
      // 顯示提示並導向登入頁
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (err) {
      setError(err.message || '註冊失敗')
    } finally {
      setSubmitting(false)
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50" style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFDFB 100%)'}}>
      <main className="flex-1 flex flex-col items-center justify-center py-6 xs:py-8 sm:py-10 md:py-12 pt-16 xs:pt-18 sm:pt-20 md:pt-20 px-4 xs:px-6 sm:px-8">
        {/* LOGO 區域 */}
        <div className="w-full max-w-md mx-auto mb-6 xs:mb-7 sm:mb-8 md:mb-8 lg:mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#cc824d] to-[#b86c37] rounded-xl xs:rounded-xl sm:rounded-2xl md:rounded-2xl mb-3 xs:mb-3 sm:mb-4 md:mb-4 shadow-lg">
            <span className="text-white text-2xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-serif font-bold">M</span>
          </div>
          <h1 className="text-2xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-serif font-bold text-[#2d1e0f] mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 tracking-wider">Marelle 註冊會員</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col items-center">
          <div className="w-full flex flex-col gap-5 xs:gap-5 sm:gap-6 md:gap-6 lg:gap-7">
            <div>
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                className="block w-full border-0 border-b border-[#e5ded6] bg-transparent text-sm xs:text-sm sm:text-base md:text-base lg:text-lg py-2.5 xs:py-2.5 sm:py-3 md:py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
                placeholder="電郵"
              />
            </div>
            <div>
              <input
                type="password"
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                className="block w-full border-0 border-b border-[#e5ded6] bg-transparent text-sm xs:text-sm sm:text-base md:text-base lg:text-lg py-2.5 xs:py-2.5 sm:py-3 md:py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
                placeholder="設定密碼（8-12 碼，需含英文與數字）"
                required
                minLength={8}
                maxLength={12}
              />
              {form.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 font-serif">密碼強度</span>
                    <span className="text-xs font-medium font-serif">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.percent < 40 ? 'bg-red-500' : (passwordStrength.percent < 80 ? 'bg-yellow-500' : 'bg-green-500')}`}
                      style={{ width: `${passwordStrength.percent}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-gray-500 mt-2 font-serif">
                    需 8-12 碼，且同時包含英文與數字
                  </div>
                </div>
              )}
            </div>
            <div>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                className="block w-full border-0 border-b border-[#e5ded6] bg-transparent text-sm xs:text-sm sm:text-base md:text-base lg:text-lg py-2.5 xs:py-2.5 sm:py-3 md:py-3 px-0 focus:ring-0 focus:border-[#bfae9b] placeholder-[#bfae9b] font-serif"
                placeholder="確認密碼"
                required
                minLength={8}
                maxLength={12}
              />
            </div>
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2 md:gap-2 text-[10px] xs:text-xs sm:text-xs md:text-xs text-[#bfae9b]">
              <input type="checkbox" id="agree1" checked={form.agree1} onChange={() => handleCheckbox('agree1')} className="accent-[#cc824d]" />
              <label htmlFor="agree1">我願意接收Lo-Fi warehouse 居家生活館最新優惠活動及及服務推播/簡訊/郵件</label>
            </div>
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2 md:gap-2 text-[10px] xs:text-xs sm:text-xs md:text-xs text-[#bfae9b]">
              <input type="checkbox" id="agree2" checked={form.agree2} onChange={() => handleCheckbox('agree2')} className="accent-[#cc824d]" />
              <label htmlFor="agree2">我同意網站 <a href="#" className="underline">服務條款及隱私權條款</a></label>
            </div>
            {error && (
              <div className="text-red-600 text-xs xs:text-xs sm:text-sm md:text-sm font-serif">{error}</div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#cc824d] hover:bg-[#b86c37] disabled:bg-[#e5ded6] disabled:text-[#bfae9b] text-white text-sm xs:text-sm sm:text-base md:text-base lg:text-lg font-bold py-2.5 xs:py-2.5 sm:py-3 md:py-3 lg:py-3.5 rounded font-serif tracking-wider mt-1.5 xs:mt-2 sm:mt-2 md:mt-2 transition-colors"
            >
              {submitting ? '建立中...' : '建立帳號'}
            </button>
          </div>
          <div className="w-full flex items-center my-5 xs:my-5 sm:my-6 md:my-6 lg:my-7">
            <div className="flex-1 h-px bg-[#e5ded6]" />
            <span className="mx-3 xs:mx-3 sm:mx-4 md:mx-4 text-[#bfae9b] text-xs xs:text-xs sm:text-sm md:text-sm font-serif">或使用社群帳號註冊</span>
            <div className="flex-1 h-px bg-[#e5ded6]" />
          </div>
        </form>
        {/* 暫不提供 LINE 註冊；登入後再行綁定 */}
        <div className="w-full max-w-md mx-auto flex flex-col items-center mt-6 xs:mt-7 sm:mt-8 md:mt-8">
          <h3 className="text-lg xs:text-lg sm:text-xl md:text-xl lg:text-2xl font-serif font-bold text-[#2d1e0f] mb-1.5 xs:mb-2 sm:mb-2 md:mb-2 tracking-wider">已經有帳號？</h3>
          <div className="text-[#bfae9b] text-xs xs:text-xs sm:text-sm md:text-sm mb-3 xs:mb-3 sm:mb-4 md:mb-4">立即登入享有更多優惠！</div>
          <button onClick={() => navigate('/login')} className="w-full border border-[#cc824d] text-[#cc824d] text-sm xs:text-sm sm:text-base md:text-base lg:text-lg font-bold py-2.5 xs:py-2.5 sm:py-3 md:py-3 lg:py-3.5 rounded transition-colors font-serif tracking-wider hover:bg-[#f7ede3]">登入</button>
        </div>
      </main>
    </div>
  );
};

export default FrontRegister;
