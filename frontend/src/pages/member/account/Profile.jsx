import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../../external_mock/state/users.js';
import { useNavigate } from 'react-router-dom';
import ProfileInfo from '../../../components/member/account/ProfileInfo.jsx';
import ProfileNotice from '../../../components/member/account/ProfileNotice.jsx';
import ProfileQuickLinks from '../../../components/member/account/ProfileQuickLinks.jsx';

// 個人資料頁（前端模擬）
// 規則：僅使用現有 UI 風格，不創新按鈕樣式。

const Profile = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      // 未登入導向登入頁，記錄來源路徑
      navigate('/login', { state: { from: '/account' } });
    } else {
      setUser(u);
    }
  }, [navigate]);

  if (!user) {
    return null; // 短暫空白, 導頁中
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-8 max-w-5xl mx-auto font-chinese">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-light tracking-wide" style={{color:'#333333'}}>個人資料</h1>
        <p className="mt-2 text-sm" style={{color:'#666666'}}>此頁面為前端模擬，資料僅存在瀏覽器 localStorage。</p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <ProfileInfo user={user} />
          <ProfileNotice />
        </div>
        <aside className="space-y-6">
          <ProfileQuickLinks />
          <div className="text-xs" style={{color:'#999999'}}>所有資料皆儲存在瀏覽器，不會上傳伺服器。</div>
        </aside>
      </div>
    </div>
  );
};

export default Profile;
