import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersEmpty from '../../../components/member/order/OrdersEmpty.jsx';

export default function OrdersCenter() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
          navigate('/login', { state: { from: '/orders' } });
        }
      } catch {
        navigate('/login', { state: { from: '/orders' } });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [navigate]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto" style={{color:'#444'}}>
      <h1 className="text-2xl font-chinese mb-6 tracking-wide" style={{letterSpacing:'0.05em'}}>訂單中心</h1>
      <p className="text-sm mb-8" style={{color:'#666'}}>這裡將顯示您的歷史訂單與處理中的訂單 (目前為示意頁面)。</p>
      <OrdersEmpty />
    </div>
  );
}
