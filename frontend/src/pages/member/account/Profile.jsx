import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileInfo from '../../../components/member/account/ProfileInfo.jsx';
import ProfileNotice from '../../../components/member/account/ProfileNotice.jsx';
import LineBindPrompt from '../../../components/member/account/LineBindPrompt.jsx';

// 個人資料頁（前端模擬）
// 規則：僅使用現有 UI 風格，不創新按鈕樣式。

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/frontend/auth/me', { credentials: 'include' });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setUser({ id: data.id, email: data.email, display_name: data.display_name || null });
        } else {
          navigate('/login', { state: { from: '/account' } });
        }
      } catch {
        navigate('/login', { state: { from: '/account' } });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [navigate]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div
      className="pt-24 pb-20 w-full max-w-none font-chinese"
      style={{ paddingLeft: 'clamp(16px, 5vw, 64px)', paddingRight: 'clamp(16px, 5vw, 64px)' }}
    >
      <LineBindPrompt />
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-light tracking-wide" style={{color:'#333333'}}>個人資料</h1>
        <p className="mt-2 text-sm" style={{color:'#666666'}}>此頁面為前端模擬，資料僅存在瀏覽器 localStorage。</p>
      </div>

      <div className="grid md:grid-cols-4 gap-10">
        {/* 左側：個人資料（3/4 寬） */}
        <div className="md:col-span-3 space-y-8">
          <ProfileInfo user={user} />
        </div>
        {/* 右側：通知（1/4 寬） */}
        <aside className="md:col-span-1 space-y-6">
          <ProfileNotice />
          <div className="text-xs" style={{color:'#999999'}}>所有資料皆儲存在瀏覽器，不會上傳伺服器。</div>
        </aside>
      </div>
    </div>
  );
};

export default Profile;
