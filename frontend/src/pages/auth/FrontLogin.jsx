import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// 改用真正的 /frontend/auth/me 檢查是否已登入
import LoginLogo from '../../components/auth/LoginLogo.jsx';
import LoginForm from '../../components/auth/LoginForm.jsx';
import LoginSocialButton from '../../components/auth/LoginSocialButton.jsx';
import LoginRegisterInvite from '../../components/auth/LoginRegisterInvite.jsx';

const FrontLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const checkedRef = useRef(false);

  // 已登入者造訪 /login 時，自動導回首頁或來源頁（同一路徑只檢查一次）
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch('/frontend/auth/me', { method: 'GET', credentials: 'include', signal: ac.signal });
        if (res.ok) {
          const from = location.state?.from || '/';
          navigate(from, { replace: true });
        }
      } catch {}
    })();
    return () => ac.abort();
  }, [location.pathname, navigate]);

  // 註冊成功導回時顯示提示（location.state.registered）
  useEffect(() => {
    if (location.state?.registered) {
      setInfo('已寄出驗證信，請至信箱完成驗證後再登入');
      // 清除一次性提示的 state，避免返回/重整重複顯示
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.registered, location.pathname, navigate]);

  const handleSubmit = async (credentials) => {
    setIsLoading(true);
    setError('');
    try {
      const email = credentials.username.trim();
      const res = await fetch('/frontend/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: credentials.password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) setError('信箱或密碼錯誤');
        else if (res.status === 403) setError('您沒有前台權限');
        else setError(data?.error || `登入失敗 (${res.status})`);
        return;
      }
  const to = '/';
  navigate(to, { replace: true });
    } catch (err) {
      setError(err.message || '發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50" style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFDFB 100%)'}}>
      <main className="flex-1 flex flex-col items-center justify-center py-6 xs:py-8 sm:py-10 md:py-12 pt-16 xs:pt-18 sm:pt-20 md:pt-20 px-4 xs:px-6 sm:px-8">
        <LoginLogo />
        {info && (
          <div className="w-full max-w-md mx-auto mb-4">
            <div className="text-sm text-[#2d1e0f] bg-[#fff2c2] border border-[#f1d48a] rounded p-3 font-serif text-center">
              {info}
            </div>
          </div>
        )}
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
        <div className="w-full max-w-md mx-auto mb-6 xs:mb-7 sm:mb-8 md:mb-8">
          <LoginSocialButton />
        </div>
        <LoginRegisterInvite onRegister={() => navigate('/register')} />
      </main>
    </div>
  );
};

export default FrontLogin;
