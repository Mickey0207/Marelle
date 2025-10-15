import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersEmpty from '../../../components/member/order/OrdersEmpty.jsx';
import { memberOrders } from '../../../../external_mock/data/memberOrders.js';

export default function OrdersCenter() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = useMemo(() => ([
    { key: 'pending_payment', label: '待付款' },
    { key: 'pending_ship', label: '待出貨' },
    { key: 'shipped', label: '待收貨' },
    { key: 'completed', label: '訂單已完成' },
    { key: 'refund', label: '退貨/退款' },
    { key: 'canceled', label: '不成立' },
  ]), []);
  const [activeTab, setActiveTab] = useState('pending_payment');
  const [selectedId, setSelectedId] = useState(null);

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

  const statusMap = useMemo(() => ({
    pending_payment: '待付款',
    pending_ship: '待出貨',
    shipped: '待收貨',
    completed: '訂單已完成',
    refund: '退貨/退款',
    canceled: '不成立',
  }), []);

  if (loading) return null;
  if (!user) return null;

  const filtered = memberOrders.filter(o => o.status === activeTab);
  const selected = filtered.find(o => o.id === selectedId) || null;

  return (
    <div
      className="pt-24 pb-20 w-full max-w-none font-chinese"
      style={{ paddingLeft: 'clamp(16px, 5vw, 64px)', paddingRight: 'clamp(16px, 5vw, 64px)' }}
    >
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-light tracking-wide" style={{ color: '#CC824D' }}>訂單中心</h1>
        <p className="mt-2 text-sm" style={{color:'#666666'}}>此頁面為前端模擬，僅顯示示意訂單。</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* 左側：列表 */}
        <section className="border rounded-lg bg-white" style={{ borderColor:'#E5E7EB' }}>
          <div className="px-5 pt-5">
            <div className="flex items-center border-b" style={{borderColor:'#E5E7EB'}}>
              <div className="flex items-center gap-4 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSelectedId(null); }}
                    className="pb-2 text-sm whitespace-nowrap"
                    style={{
                      color: activeTab === tab.key ? '#CC824D' : '#666666',
                      borderBottom: activeTab === tab.key ? '2px solid #CC824D' : '2px solid transparent'
                    }}
                  >{tab.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-5">
            {filtered.length === 0 ? (
              <OrdersEmpty />
            ) : (
              <div className="space-y-3">
                {filtered.map(order => {
                  const isActive = order.id === selectedId;
                  return (
                    <button
                      key={order.id}
                      onClick={() => setSelectedId(order.id)}
                      className="w-full text-left border rounded-md p-4 bg-white"
                      style={{ borderColor: isActive ? '#CC824D' : '#E5E7EB', boxShadow: isActive ? '0 0 0 2px rgba(204,130,77,0.1)' : 'none' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium" style={{color:'#333'}}>{order.id}</div>
                        <div className="text-xs" style={{color:'#999'}}>{order.createdAt}</div>
                      </div>
                      <div className="mt-1 text-xs" style={{color:'#999'}}>{statusMap[order.status] || order.status}</div>
                      <div className="mt-2 text-xs" style={{color:'#666'}}>
                        共 {order.items.reduce((n,i)=>n+i.qty,0)} 件，訂單金額 NT$ {order.total}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 右側：選中訂單詳情 */}
        <aside className="space-y-6">
          <section className="border rounded-lg p-5 bg-white" style={{borderColor:'#E5E7EB'}}>
            <h2 className="text-base font-medium mb-4" style={{color:'#333'}}>訂單詳情</h2>
            {!selected ? (
              <p className="text-sm" style={{color:'#999'}}>請在左側選擇一筆訂單查看詳細資訊。</p>
            ) : (
              <div className="text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium" style={{color:'#CC824D'}}>{selected.id}</div>
                  <div className="text-xs" style={{color:'#999'}}>{selected.createdAt}</div>
                </div>
                <div className="mt-1 text-xs" style={{color:'#999'}}>{statusMap[selected.status] || selected.status}</div>

                <div className="mt-4">
                  <div className="text-sm font-medium" style={{color:'#333'}}>商品明細</div>
                  <div className="mt-2 space-y-2">
                    {selected.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={it.image || '/product-placeholder.svg'} alt={it.name} className="w-12 h-12 object-cover rounded border" style={{borderColor:'#E5E7EB'}}/>
                          <div className="truncate">
                            <div className="text-xs" style={{color:'#333'}} title={it.name}>{it.name}</div>
                            {it.sku && <div className="text-[11px]" style={{color:'#999'}}>SKU: {it.sku}</div>}
                          </div>
                        </div>
                        <div className="text-xs whitespace-nowrap" style={{color:'#666'}}>× {it.qty}</div>
                        <div className="text-xs whitespace-nowrap" style={{color:'#333'}}>NT$ {it.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3" style={{borderTop:'1px solid #E5E7EB'}}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs" style={{color:'#666'}}>物流方式</div>
                    <div className="text-xs" style={{color:'#333'}}>
                      {selected.logistics.method === 'CVS' ? `${selected.logistics.vendor}／${selected.logistics.storeName}` : selected.logistics.address}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs" style={{color:'#666'}}>付款方式</div>
                    <div className="text-xs" style={{color:'#333'}}>{selected.payment.method}（{selected.payment.paid ? '已付款' : '未付款'}）</div>
                  </div>
                  {selected.coupon && (
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs" style={{color:'#666'}}>優惠劵</div>
                      <div className="text-xs" style={{color:'#333'}}>
                        {selected.coupon.title}（代碼：<span className="font-mono tracking-wider" style={{color:'#CC824D'}}>{selected.coupon.code}</span>）- 已折抵 NT$ {selected.coupon.discount}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs" style={{color:'#666'}}>訂單金額</div>
                    <div className="text-xs" style={{color:'#333'}}>NT$ {selected.total}</div>
                  </div>
                  {selected.note && <div className="mt-2 text-[11px]" style={{color:'#666'}}>{selected.note}</div>}
                </div>

                {/* 留言板（前端狀態） */}
                <div className="mt-5">
                  <div className="text-sm font-medium mb-2" style={{color:'#333'}}>留言板</div>
                  <OrderNotes orderId={selected.id} />
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

// 簡易留言板（以 localStorage 保存當前使用者留言；未串後端）
function OrderNotes({ orderId }) {
  const storageKey = `order_notes_${orderId}`;
  const [notes, setNotes] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch { return [] }
  });
  const [text, setText] = useState('');

  const addNote = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next = [...notes, { id: Date.now(), content: trimmed, time: new Date().toISOString().slice(0,16).replace('T',' ') }];
    setNotes(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setText('');
  };

  return (
    <div className="border rounded-md p-3 bg-white" style={{borderColor:'#E5E7EB'}}>
      <div className="space-y-2 max-h-40 overflow-auto pr-1">
        {notes.length === 0 ? (
          <div className="text-xs" style={{color:'#999'}}>目前沒有留言，歡迎留下您的問題或需求。</div>
        ) : (
          notes.map(n => (
            <div key={n.id} className="text-xs">
              <div className="text-[11px]" style={{color:'#999'}}>{n.time}</div>
              <div style={{color:'#333'}}>{n.content}</div>
            </div>
          ))
        )}
      </div>
      <div className="mt-3 flex items-start gap-2">
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          className="w-full text-xs border rounded-md p-2"
          style={{borderColor:'#E5E7EB'}}
          rows={3}
          placeholder="輸入留言..."
        />
        <button type="button" onClick={addNote} className="px-3 py-2 text-xs border rounded-md whitespace-nowrap shrink-0 leading-none" style={{color:'#666666', borderColor:'#E5E7EB'}}>
          送出
        </button>
      </div>
    </div>
  );
}
