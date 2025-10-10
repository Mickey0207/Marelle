import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, verifyCredentials } from '../../../external_mock/state/users.js';
import LoginLogo from '../../components/auth/LoginLogo.jsx';
import LoginForm from '../../components/auth/LoginForm.jsx';
import LoginSocialButton from '../../components/auth/LoginSocialButton.jsx';
import LoginRegisterInvite from '../../components/auth/LoginRegisterInvite.jsx';

const FrontLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 已登入者造訪 /login 時，自動導回來源頁或帳戶頁
  useEffect(() => {
    const u = getCurrentUser();
    if (u) {
      const from = location.state?.from || '/account';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = async (credentials) => {
    setIsLoading(true);
    setError('');
    try {
      const sessionUser = await verifyCredentials(credentials.username.trim(), credentials.password);
      if (sessionUser) {
        const from = location.state?.from || '/account';
        navigate(from, { replace: true });
      } else {
        setError('帳號或密碼錯誤');
      }
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
