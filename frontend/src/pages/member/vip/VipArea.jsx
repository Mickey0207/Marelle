import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VipCoupons from '../../../components/member/vip/VipCoupons.jsx';
import { vipCashHistory } from '../../../../external_mock/data/vipCashHistory.js';
import ProfileNotice from '../../../components/member/account/ProfileNotice.jsx';

export default function VipArea() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Tabs: coupon | cash
  const [activeTab, setActiveTab] = useState('coupon');
  // 模擬後台開關（先由前端控制）
  const [cashEnabled, setCashEnabled] = useState(true);

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
          navigate('/login', { state: { from: '/vip' } });
        }
      } catch {
        navigate('/login', { state: { from: '/vip' } });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [navigate]);

  // 當停用購物金時，如果當前頁籤是購物金，切回優惠劵
  useEffect(() => {
    if (!cashEnabled && activeTab === 'cash') setActiveTab('coupon');
  }, [cashEnabled, activeTab]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div
      className="pt-24 pb-20 w-full max-w-none font-chinese"
      style={{ paddingLeft: 'clamp(16px, 5vw, 64px)', paddingRight: 'clamp(16px, 5vw, 64px)' }}
    >
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-light tracking-wide" style={{ color: '#CC824D' }}>會員專屬</h1>
        <p className="mt-2 text-sm" style={{color:'#666666'}}>此頁面為前端模擬，將提供會員獨享優惠與（可選）購物金展示。</p>
      </div>

      <div className="grid md:grid-cols-4 gap-10">
        {/* 左側：主要卡片（3/4 寬） */}
        <section className="md:col-span-3 border rounded-lg bg-white" style={{ borderColor:'#E5E7EB' }}>
          {/* 卡片標題與右側開關 */}
          <div className="flex items-center justify-between px-5 pt-5">
            <h2 className="text-base font-medium" style={{color:'#333333'}}>會員專屬內容</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{color:'#666666'}}>購物金頁籤</span>
              <button
                onClick={() => setCashEnabled((v) => !v)}
                className="px-3 py-1.5 rounded-md text-xs border"
                style={{ color:'#666666', borderColor:'#E5E7EB' }}
              >{cashEnabled ? '停用' : '啟用'}</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-5 mt-3">
            <div className="flex items-center border-b" style={{borderColor:'#E5E7EB'}}>
              <div className="flex items-center gap-4">
                {[{ key:'coupon', label:'優惠劵' }, ...(cashEnabled ? [{ key:'cash', label:'購物金' }] : [])].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="pb-2 text-sm transition-colors"
                    style={{
                      color: activeTab === tab.key ? '#CC824D' : '#666666',
                      borderBottom: activeTab === tab.key ? '2px solid #CC824D' : '2px solid transparent'
                    }}
                  >{tab.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* 內容區 */}
          <div className="p-5">
            {activeTab === 'coupon' && (
              <div>
                <VipCoupons />
              </div>
            )}
            {activeTab === 'cash' && cashEnabled && (
              <div className="text-sm">
                {/* 簡易展示：未串後端 API，先以假資料呈現 */}
                <div className="border rounded-md p-4" style={{ borderColor:'#E5E7EB' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium" style={{color:'#333333'}}>可用購物金</div>
                      <div className="text-2xl mt-1" style={{color:'#CC824D'}}>NT$ 0</div>
                    </div>
                    <div className="text-xs" style={{color:'#999999'}}>此區將於後台完成後改為動態資料</div>
                  </div>
                  <div className="mt-4 text-xs" style={{color:'#666666'}}>說明：購物金可於結帳時折抵，實際規則以後台設定為準。</div>
                </div>

                {/* 分隔線 */}
                <div className="my-5" style={{borderTop:'1px solid #E5E7EB'}} />

                {/* 歷史列表 */}
                <div className="space-y-3">
                  <div className="text-sm font-medium" style={{color:'#333333'}}>購物金獲得歷史</div>
                  {vipCashHistory.map(item => (
                    <div key={item.id} className="border rounded-md p-3 bg-white" style={{borderColor:'#E5E7EB'}}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs" style={{color:'#333333'}}>{item.source}</div>
                          <div className="text-[11px] mt-0.5" style={{color:'#999999'}}>{item.date}</div>
                        </div>
                        <div className="text-sm font-medium" style={{color:'#CC824D'}}>+ NT$ {item.amount}</div>
                      </div>
                      {item.note && (
                        <div className="text-[11px] mt-2" style={{color:'#666666'}}>{item.note}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 右側：通知（1/4 寬） */}
        <aside className="md:col-span-1 space-y-6">
          <ProfileNotice />
        </aside>
      </div>
    </div>
  );
}
