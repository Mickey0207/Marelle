import React, { useEffect, useMemo, useState } from 'react';
import GlassModal from '../../ui/GlassModal.jsx';
import SearchableSelect from '../../ui/SearchableSelect.jsx';

export default function ProfileInfo({ user }) {
  const [activeTab, setActiveTab] = useState('personal'); // personal | address | line
  const [lineStatus, setLineStatus] = useState({ is_bound: null, line_display_name: null, line_picture_url: null });
  const [showUnbind, setShowUnbind] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ display_name: '', phone: '', gender: '', newsletter: false });
  const apiBase = (typeof window !== 'undefined' && window.__MARELLE_API_BASE__) || '/'
  const lineBindHref = `${apiBase.replace(/\/$/, '')}/frontend/account/line/start`
  // 地址簿（串後端 API）
  const [homeAddresses, setHomeAddresses] = useState([]);
  const [storeAddresses, setStoreAddresses] = useState([]);
  const [addingHome, setAddingHome] = useState(false);
  const [addingStore, setAddingStore] = useState(false);
  const [homeDraft, setHomeDraft] = useState({ alias: '', recipient: '', phone: '', zip: '', city: '', district: '', address: '' });
  const [storeDraft, setStoreDraft] = useState({ alias: '', vendor: '', store_name: '', store_id: '', store_address: '', recipient: '', phone: '' });
  const [editingHomeId, setEditingHomeId] = useState(null);
  const [editingStoreId, setEditingStoreId] = useState(null);
  const [homeEditForm, setHomeEditForm] = useState(null);
  const [storeEditForm, setStoreEditForm] = useState(null);
  const [addrLoading, setAddrLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const vendorOptions = useMemo(() => ([
    { value: 'UNIMARTC2C', label: '7-ELEVEN (UNIMARTC2C)' },
    { value: 'FAMIC2C', label: '全家 (FAMIC2C)' },
    { value: 'HILIFEC2C', label: '萊爾富 (HILIFEC2C)' },
    { value: 'OKMARTC2C', label: 'OK (OKMARTC2C)' }
  ]), [])

  function pushToast(type, message) {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2,6)}`
    setToasts((arr) => [...arr, { id, type, message }])
    setTimeout(() => {
      setToasts((arr) => arr.filter(t => t.id !== id))
    }, 2600)
  }

  useEffect(() => {
    let cancelled = false;
    async function fetchLine() {
      try {
        const res = await fetch('/frontend/account/line/status', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setLineStatus({
          is_bound: !!data.is_bound,
          line_display_name: data.line_display_name || null,
          line_picture_url: data.line_picture_url || null
        });
      } catch {}
    }
    // 預先載入一次，避免切換時閃爍
    fetchLine();
    return () => { cancelled = true; };
  }, []);

  // 讀取地址簿
  const loadAddresses = async () => {
    try {
      setAddrLoading(true)
      const [h, s] = await Promise.all([
        fetch('/frontend/account/addresses?type=home', { credentials: 'include' }),
        fetch('/frontend/account/addresses?type=cvs', { credentials: 'include' })
      ])
      if (h.ok) { const d = await h.json(); setHomeAddresses(Array.isArray(d)?d:[]) }
      if (s.ok) { const d = await s.json(); setStoreAddresses(Array.isArray(d)?d:[]) }
    } catch {}
    finally { setAddrLoading(false) }
  }

  // 切換到地址分頁時載入
  useEffect(() => { if (activeTab === 'address') loadAddresses() }, [activeTab])

  // ZIP3 查詢
  const fetchZip = async (zip3) => {
    try {
      if (!/^\d{3}$/.test(String(zip3||''))) return null
      const res = await fetch(`/frontend/account/zip/${zip3}`, { credentials: 'include' })
      if (!res.ok) return null
      return await res.json()
    } catch { return null }
  }

  // 綠界選店（新視窗）
  function openCvsMap(subType = 'FAMIC2C') {
    const w = window.open('', 'ecpay_map', 'width=1024,height=768')
    const base = (typeof window !== 'undefined' && window.__MARELLE_API_BASE__) || '/'
    if (w) w.location.href = `${String(base).replace(/\/$/, '')}/frontend/account/ecpay/map/start?subType=${encodeURIComponent(subType)}`
  }

  // 接收選店回傳並填入新增草稿
  useEffect(() => {
    function onMsg(e) {
      if (!e?.data || e.data.type !== 'ecpay:cvs:selected') return
      try {
        const s = e.data?.data || (function(){
          const raw = localStorage.getItem('ecpay_map_store');
          return raw ? JSON.parse(raw) : null;
        })();
        if (!s) return
        setAddingStore(true)
        setStoreDraft(d => ({
          alias: d?.alias || s.store_name || '',
          vendor: s.sub_type || d?.vendor || '',
          store_id: s.store_id || '',
          store_name: s.store_name || '',
          store_address: s.store_address || '',
          recipient: d?.recipient || '',
          phone: d?.phone || ''
        }))
        pushToast('success', '已帶入選店結果，請確認後儲存')
      } catch {}
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  const [meta, setMeta] = useState({ created_at: null, last_sign_in_at: null, email: user.email || null, display_name: user.display_name || null, phone: null, gender: null, newsletter: false, privacy_policy: false })

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const res = await fetch('/frontend/account/profile', { credentials: 'include' })
        if (!res.ok) return;
        const data = await res.json()
        if (!cancelled) setMeta({
          created_at: data.created_at || null,
          last_sign_in_at: data.last_sign_in_at || null,
          email: data.email || user.email || null,
          display_name: data.display_name || user.display_name || null,
          phone: data.phone || null,
          gender: data.gender || null,
          newsletter: !!data.newsletter,
          privacy_policy: !!data.privacy_policy
        })
      } catch {}
    }
    loadProfile()
    return () => { cancelled = true }
  }, [user.email])

  const displayName = (meta.display_name || user.display_name || meta.email || user.email || '-')

  return (
    <section className="border rounded-lg p-6 bg-white" style={{borderColor:'#E5E7EB'}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium" style={{color:'#333333'}}>帳號資訊</h2>
        {/* 標題右側操作：僅在個人資料分頁顯示 */}
        {activeTab === 'personal' && (
          isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({ display_name: meta.display_name || '', phone: meta.phone || '', gender: meta.gender || '' });
                }}
                className="px-3 py-1.5 rounded-md text-xs border"
                style={{ color:'#666666', borderColor:'#E5E7EB' }}
              >
                取消
              </button>
              <button
                onClick={async () => {
                  const phone = editForm.phone.trim();
                  if (phone && !/^09\d{8}$/.test(phone)) {
                    return;
                  }
                  const payload = {
                    display_name: (editForm.display_name || '').trim() === '' ? null : (editForm.display_name || '').trim(),
                    phone: phone === '' ? null : phone,
                    gender: editForm.gender === '' ? null : editForm.gender,
                    newsletter: !!editForm.newsletter
                  };
                  try {
                    const res = await fetch('/frontend/account/profile', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                      setMeta((m) => ({ ...m, display_name: payload.display_name, phone: payload.phone, gender: payload.gender, newsletter: payload.newsletter ?? m.newsletter }));
                      setIsEditing(false);
                      try { pushToast('success', '已更新個人資料') } catch {}
                    } else {
                      try {
                        const data = await res.json().catch(()=>({}));
                        pushToast('error', data?.error || `更新失敗 (${res.status})`)
                      } catch {}
                    }
                  } catch {}
                }}
                className="px-3 py-1.5 rounded-md text-xs font-bold text-white"
                style={{ background:'#cc824d' }}
              >
                儲存
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditForm({ display_name: meta.display_name || '', phone: meta.phone || '', gender: meta.gender || '', newsletter: !!meta.newsletter });
                setIsEditing(true);
              }}
              className="px-3 py-1.5 rounded-md text-xs border"
              style={{ color:'#666666', borderColor:'#E5E7EB' }}
            >
              編輯
            </button>
          )
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b mb-5" style={{borderColor:'#E5E7EB'}}>
        <div className="flex items-center gap-4">
        {[
          { key: 'personal', label: '個人資料' },
          { key: 'address', label: '送貨地址' },
          { key: 'line', label: 'LINE 綁定' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="pb-2 text-sm transition-colors"
            style={{
              color: activeTab === tab.key ? '#CC824D' : '#666666',
              borderBottom: activeTab === tab.key ? '2px solid #CC824D' : '2px solid transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
        </div>
      </div>

      {/* Panels */}
      {activeTab === 'personal' && (
        <div className="space-y-0 text-sm">
          <Row label="使用者名稱">
            {isEditing ? (
              <input
                type="text"
                value={editForm.display_name}
                onChange={(e) => setEditForm(s => ({ ...s, display_name: e.target.value }))}
                placeholder="輸入顯示名稱（最多 50 字）"
                className="w-64 border rounded-md px-3 py-2 text-sm"
                style={{ borderColor:'#E5E7EB', color:'#333333' }}
                maxLength={50}
              />
            ) : (
              <span className="font-medium" style={{color:'#CC824D'}}>{displayName}</span>
            )}
          </Row>
          <Row label="E-mail"><span style={{color:'#333333'}}>{meta.email || '-'}</span></Row>
          <Row label="電話">
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm(s => ({ ...s, phone: e.target.value }))}
                placeholder="例如：0912345678"
                className="w-56 border rounded-md px-3 py-2 text-sm"
                style={{ borderColor:'#E5E7EB', color:'#333333' }}
              />
            ) : (
              <span style={{color:'#333333'}}>{meta.phone || '未設定'}</span>
            )}
          </Row>
          <Row label="性別">
            {isEditing ? (
              <div className="w-48">
                <SearchableSelect
                  options={[
                    { value: '', label: '未設定' },
                    { value: '男', label: '男' },
                    { value: '女', label: '女' },
                    { value: '不願透漏', label: '不願透漏' }
                  ]}
                  value={editForm.gender || ''}
                  onChange={(val) => setEditForm(s => ({ ...s, gender: val }))}
                  placeholder="選擇性別"
                  allowClear
                />
              </div>
            ) : (
              <span style={{color:'#333333'}}>{meta.gender || '未設定'}</span>
            )}
          </Row>
          <Row label="密碼">
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/frontend/auth/password/reset', { method: 'POST', credentials: 'include' })
                  // 可加上 toast 提示
                } catch {}
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all"
              style={{ background: '#cc824d', color: '#ffffff' }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.95)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
            >
              發送重設密碼信
            </button>
          </Row>
          <Row label="建立時間"><span style={{color:'#333333'}}>{meta.created_at ? new Date(meta.created_at).toLocaleDateString() : '-'}</span></Row>
          <Row label="最後登入時間"><span style={{color:'#333333'}}>{meta.last_sign_in_at ? new Date(meta.last_sign_in_at).toLocaleString() : '-'}</span></Row>
          <Row label="訂閱電子報">
            {isEditing ? (
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!editForm.newsletter}
                  onChange={(e) => setEditForm(s => ({ ...s, newsletter: e.target.checked }))}
                  className="accent-[#cc824d]"
                />
                <span style={{color:'#333333'}}>訂閱</span>
              </label>
            ) : (
              <span style={{color:'#333333'}}>{meta.newsletter ? '是' : '否'}</span>
            )}
          </Row>
          <Row
            label={
              <>
                <a href="http://localhost:3000/privacy" className="underline" style={{ color: '#CC824D' }}>隱私政策 </a>
                與
                <a href="http://localhost:3000/terms" className="underline" style={{ color: '#CC824D' }}> 服務條款 </a>
                同意
              </>
            }
          >
            <span style={{color:'#333333'}}>{meta.privacy_policy ? '是' : '否'}</span>
          </Row>
          <Row label="登入狀態">
            <span className="flex items-center gap-2" style={{color:'#16a34a'}}>
              <span className="inline-block w-2 h-2 rounded-full" style={{background:'#16a34a'}} />
              已登入
            </span>
          </Row>
        </div>
      )}

      {activeTab === 'address' && (
        <div className="text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左：宅配地址（可多筆） */}
            <section className="border rounded-lg p-5 bg-white" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium" style={{ color: '#333333' }}>宅配地址</h3>
                {!addingHome && editingHomeId === null && (
                  <button
                    onClick={() => { setAddingHome(true); setHomeDraft({ alias: '', recipient: '', phone: '', zip: '', city: '', district: '', address: '' }); }}
                    className="px-3 py-1.5 rounded-md text-xs border"
                    style={{ color:'#666666', borderColor:'#E5E7EB' }}
                  >新增</button>
                )}
              </div>

              {/* 新增宅配表單 */}
              {addingHome && (
                <div className="mb-4 border rounded-md p-4" style={{ borderColor: '#E5E7EB' }}>
                  <Row label={<span className="whitespace-nowrap">別稱</span>}>
                    <input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeDraft.alias} onChange={(e)=>setHomeDraft(s=>({ ...s, alias:e.target.value }))} />
                  </Row>
                  <Row label="收件人">
                    <input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeDraft.recipient} onChange={(e)=>setHomeDraft(s=>({ ...s, recipient:e.target.value }))} />
                  </Row>
                  <Row label="電話">
                    <input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeDraft.phone} onChange={(e)=>setHomeDraft(s=>({ ...s, phone:e.target.value }))} />
                  </Row>
                  <Row label="郵遞區號">
                    <input
                      className="w-32 border rounded-md px-3 py-2 text-sm"
                      style={{ borderColor:'#E5E7EB' }}
                      value={homeDraft.zip}
                      onChange={async (e)=>{
                        const v = e.target.value.replace(/[^0-9]/g,'').slice(0,3)
                        setHomeDraft(s=>({ ...s, zip:v }))
                        if (v.length===3) {
                          const m = await fetchZip(v)
                          if (m) setHomeDraft(s=>({ ...s, city:m.city||s.city, district:m.district||s.district }))
                        }
                      }}
                    />
                  </Row>
                  <Row label="縣市">
                    <input className="w-40 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeDraft.city} onChange={(e)=>setHomeDraft(s=>({ ...s, city:e.target.value }))} />
                  </Row>
                  <Row label="行政區">
                    <input className="w-40 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeDraft.district} onChange={(e)=>setHomeDraft(s=>({ ...s, district:e.target.value }))} />
                  </Row>
                  <Row label={<span className="whitespace-nowrap">詳細地址</span>}>
                    <input className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeDraft.address} onChange={(e)=>setHomeDraft(s=>({ ...s, address:e.target.value }))} />
                  </Row>
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button onClick={()=>{ setAddingHome(false); }} className="px-3 py-1.5 rounded-md text-xs border" style={{ color:'#666666', borderColor:'#E5E7EB' }}>取消</button>
                    <button onClick={async ()=>{
                      if (!homeDraft.alias?.trim()) { pushToast('error', '請輸入別稱'); return }
                      if (!homeDraft.recipient?.trim()) { pushToast('error', '請輸入收件人'); return }
                      if (!/^09\d{8}$/.test(homeDraft.phone?.trim()||'')) { pushToast('error', '電話格式錯誤，需為 09 開頭 10 碼'); return }
                      if (!/^\d{3}$/.test(homeDraft.zip?.trim()||'')) { pushToast('error', '請輸入 3 碼郵遞區號'); return }
                      if (!homeDraft.city?.trim() || !homeDraft.district?.trim() || !homeDraft.address?.trim()) { pushToast('error', '請完整填寫地址'); return }
                      const payload = {
                        type: 'home',
                        alias: homeDraft.alias || null,
                        receiver_name: homeDraft.recipient?.trim(),
                        receiver_phone: homeDraft.phone?.trim(),
                        zip3: homeDraft.zip?.trim(),
                        city: homeDraft.city?.trim(),
                        district: homeDraft.district?.trim(),
                        address_line: homeDraft.address?.trim()
                      }
                      const res = await fetch('/frontend/account/addresses', { method: 'POST', credentials: 'include', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
                      if (res.ok) { const created = await res.json(); setHomeAddresses(a=>[created, ...a.filter(x=>x.id!==created.id)]); setAddingHome(false); setHomeDraft({ alias:'', recipient:'', phone:'', zip:'', city:'', district:'', address:'' }); pushToast('success', '宅配地址已新增') } else { pushToast('error', '新增失敗，請稍後再試') }
                    }} className="px-3 py-1.5 rounded-md text-xs font-bold text-white" style={{ background:'#cc824d' }}>儲存</button>
                  </div>
                </div>
              )}

              {/* 清單 */}
              {homeAddresses.length === 0 && !addingHome && (
                <div className="text-gray-500">目前尚未新增宅配地址。</div>
              )}
              <ul className="space-y-3">
                {homeAddresses.map(item => (
                  <li key={item.id} className="border rounded-md" style={{ borderColor:'#E5E7EB' }}>
                    {editingHomeId === item.id ? (
                      <div className="p-4">
                        <Row label="別稱"><input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeEditForm?.alias||''} onChange={(e)=>setHomeEditForm(s=>({ ...s, alias:e.target.value }))} /></Row>
                        <Row label="收件人"><input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeEditForm?.recipient||''} onChange={(e)=>setHomeEditForm(s=>({ ...s, recipient:e.target.value }))} /></Row>
                        <Row label="電話"><input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeEditForm?.phone||''} onChange={(e)=>setHomeEditForm(s=>({ ...s, phone:e.target.value }))} /></Row>
                        <Row label="郵遞區號"><input className="w-32 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeEditForm?.zip||''} onChange={async (e)=>{ const v=e.target.value.replace(/[^0-9]/g,'').slice(0,3); setHomeEditForm(s=>({ ...s, zip:v })); if (v.length===3){ const m=await fetchZip(v); if(m) setHomeEditForm(s=>({ ...s, city:m.city||s.city, district:m.district||s.district })) } }} /></Row>
                        <Row label="縣市"><input className="w-40 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeEditForm?.city||''} onChange={(e)=>setHomeEditForm(s=>({ ...s, city:e.target.value }))} /></Row>
                        <Row label="行政區"><input className="w-40 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeEditForm?.district||''} onChange={(e)=>setHomeEditForm(s=>({ ...s, district:e.target.value }))} /></Row>
                        <Row label={<span className="whitespace-nowrap">詳細地址</span>}><input className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={homeEditForm?.address||''} onChange={(e)=>setHomeEditForm(s=>({ ...s, address:e.target.value }))} /></Row>
                        <div className="flex items-center justify-end gap-2 mt-3">
                          <button onClick={()=>{ setEditingHomeId(null); setHomeEditForm(null) }} className="px-3 py-1.5 rounded-md text-xs border" style={{ color:'#666666', borderColor:'#E5E7EB' }}>取消</button>
                          <button onClick={async ()=>{
                            if (!homeEditForm?.alias?.trim()) { pushToast('error', '請輸入別稱'); return }
                            if (!homeEditForm?.recipient?.trim()) { pushToast('error', '請輸入收件人'); return }
                            if (!/^09\d{8}$/.test((homeEditForm?.phone||'').trim())) { pushToast('error', '電話格式錯誤，需為 09 開頭 10 碼'); return }
                            if (!/^\d{3}$/.test((homeEditForm?.zip||'').trim())) { pushToast('error', '請輸入 3 碼郵遞區號'); return }
                            if (!homeEditForm?.city?.trim() || !homeEditForm?.district?.trim() || !homeEditForm?.address?.trim()) { pushToast('error', '請完整填寫地址'); return }
                            const payload = { type:'home', alias: homeEditForm?.alias||null, receiver_name: homeEditForm?.recipient?.trim(), receiver_phone: homeEditForm?.phone?.trim(), zip3: homeEditForm?.zip?.trim(), city: homeEditForm?.city?.trim(), district: homeEditForm?.district?.trim(), address_line: homeEditForm?.address?.trim() }
                            const res = await fetch(`/frontend/account/addresses/${item.id}`, { method:'PATCH', credentials:'include', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
                            if (res.ok) { const updated = await res.json(); setHomeAddresses(arr=>arr.map(x=>x.id===item.id?updated:x)); setEditingHomeId(null); setHomeEditForm(null); pushToast('success', '已更新') } else { pushToast('error', '更新失敗') }
                          }} className="px-3 py-1.5 rounded-md text-xs font-bold text-white" style={{ background:'#cc824d' }}>儲存</button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-gray-700 truncate whitespace-nowrap">
                          {item.is_default ? (<span className="inline-block px-2 py-0.5 rounded-full text-[10px]" style={{ background:'#F3F4F6', color:'#CC824D', border:'1px solid #E5E7EB' }}>預設</span>) : null}
                          <span>
                            {item.alias ? `${item.alias} ｜ ` : ''}收件人：{item.receiver_name || item.recipient || '—'} ｜ 電話：{item.receiver_phone || item.phone || '—'} ｜ 地址：({item.zip3 || item.zip || '—'}) {item.city || ''}{item.district || ''}{item.address_line || item.address || ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-3">
                          {!item.is_default && (
                            <button onClick={async ()=>{ const res = await fetch(`/frontend/account/addresses/${item.id}`, { method:'PATCH', credentials:'include', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ type:'home', is_default: true }) }); if (res.ok) { setHomeAddresses(arr=>arr.map(x=>({ ...x, is_default: x.id===item.id }))); pushToast('success', '已設定為預設地址') } else { pushToast('error', '設定失敗') } }} className="px-3 py-1.5 rounded-md text-xs border" style={{ color:'#666666', borderColor:'#E5E7EB' }}>設為預設</button>
                          )}
                          <button onClick={()=>{ setEditingHomeId(item.id); setHomeEditForm({ alias:item.alias||'', recipient:item.receiver_name||item.recipient||'', phone:item.receiver_phone||item.phone||'', zip:item.zip3||item.zip||'', city:item.city||'', district:item.district||'', address:item.address_line||item.address||'' }) }} className="px-3 py-1.5 rounded-md text-xs border" style={{ color:'#666666', borderColor:'#E5E7EB' }}>編輯</button>
                          <button onClick={async ()=>{ const r = await fetch(`/frontend/account/addresses/${item.id}`, { method:'DELETE', credentials:'include' }); if (r.ok) { loadAddresses(); pushToast('success', '已刪除') } else { pushToast('error', '刪除失敗') } }} className="px-3 py-1.5 rounded-md text-xs border" style={{ color:'#666666', borderColor:'#E5E7EB' }}>刪除</button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* 右：超商地址（可多筆） */}
            <section className="border rounded-lg p-5 bg-white" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium" style={{ color: '#333333' }}>超商地址</h3>
                {!addingStore && editingStoreId === null && (
                  <button
                    onClick={() => { setAddingStore(true); setStoreDraft({ alias: '', recipient:'', phone:'', vendor: '', store_name: '', store_id: '', store_address: '' }); }}
                    className="px-3 py-1.5 rounded-md text-xs border"
                    style={{ color:'#666666', borderColor:'#E5E7EB' }}
                  >新增</button>
                )}
              </div>

              {/* 新增超商表單 */}
              {addingStore && (
                <div className="mb-4 border rounded-md p-4" style={{ borderColor: '#E5E7EB' }}>
                  <Row label={<span className="whitespace-nowrap">別稱</span>}><input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeDraft.alias} onChange={(e)=>setStoreDraft(s=>({ ...s, alias:e.target.value }))} /></Row>
                  <Row label={<span className="whitespace-nowrap">收件人</span>}><input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeDraft.recipient} onChange={(e)=>setStoreDraft(s=>({ ...s, recipient:e.target.value }))} /></Row>
                  <Row label={<span className="whitespace-nowrap">收件電話</span>}><input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeDraft.phone} onChange={(e)=>setStoreDraft(s=>({ ...s, phone:e.target.value }))} placeholder="09xxxxxxxx" /></Row>
                  <Row label="物流廠商">
                    <div className="w-64">
                      <SearchableSelect
                        options={vendorOptions}
                        value={storeDraft.vendor || ''}
                        onChange={(val)=>setStoreDraft(s=>({ ...s, vendor: val }))}
                        placeholder="選擇物流廠商"
                      />
                    </div>
                  </Row>
                  <Row label="門市名稱"><input className="w-64 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeDraft.store_name} onChange={(e)=>setStoreDraft(s=>({ ...s, store_name:e.target.value }))} /></Row>
                  <Row label="門市代號"><input className="w-40 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeDraft.store_id} onChange={(e)=>setStoreDraft(s=>({ ...s, store_id:e.target.value }))} /></Row>
                  <Row label={<span className="whitespace-nowrap">門市地址</span>}><input className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeDraft.store_address} onChange={(e)=>setStoreDraft(s=>({ ...s, store_address:e.target.value }))} /></Row>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <button
                      onClick={()=>{ if (!storeDraft.vendor) { pushToast('error', '請先選擇物流廠商'); return } openCvsMap(storeDraft.vendor) }}
                      className="px-3 py-1.5 rounded-md text-xs border"
                      style={{ color:'#666666', borderColor:'#E5E7EB' }}
                    >選擇店鋪</button>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button onClick={()=>{ setAddingStore(false); }} className="px-3 py-1.5 rounded-md text-xs border" style={{ color:'#666666', borderColor:'#E5E7EB' }}>取消</button>
                    <button onClick={async ()=>{
                      if (!storeDraft.alias?.trim()) { pushToast('error', '請輸入別稱'); return }
                      if (!storeDraft.recipient?.trim()) { pushToast('error', '請輸入收件人'); return }
                      if (!/^09\d{8}$/.test((storeDraft.phone||'').trim())) { pushToast('error', '收件電話格式不正確'); return }
                      if (!storeDraft.vendor) { pushToast('error', '請先選擇物流廠商'); return }
                      if (!storeDraft.store_id || !storeDraft.store_name || !storeDraft.store_address) { pushToast('error', '請先完成「選擇店鋪」'); return }
                      const payload = { type:'cvs', alias: storeDraft.alias?.trim()||null, vendor: storeDraft.vendor?.trim(), store_id: storeDraft.store_id?.trim(), store_name: storeDraft.store_name?.trim(), store_address: storeDraft.store_address?.trim(), receiver_name: (storeDraft.recipient||'').trim(), receiver_phone: (storeDraft.phone||'').trim() }
                      const res = await fetch('/frontend/account/addresses', { method:'POST', credentials:'include', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
                      if (res.ok) { const created = await res.json(); setStoreAddresses(a=>[created, ...a.filter(x=>x.id!==created.id)]); setAddingStore(false); setStoreDraft({ alias:'', recipient:'', phone:'', vendor:'', store_name:'', store_id:'', store_address:'' }); pushToast('success', '超商地址已新增') } else { pushToast('error', '新增失敗，請稍後再試') }
                    }} className="px-3 py-1.5 rounded-md text-xs font-bold text-white" style={{ background:'#cc824d' }}>儲存</button>
                  </div>
                </div>
              )}

              {/* 清單 */}
              {storeAddresses.length === 0 && !addingStore && (
                <div className="text-gray-500">目前尚未新增超商地址。</div>
              )}
              <ul className="space-y-3">
                {storeAddresses.map(item => (
                  <li key={item.id} className="border rounded-md" style={{ borderColor:'#E5E7EB' }}>
                    {editingStoreId === item.id ? (
                      <div className="p-4">
                        <Row label="別稱"><input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeEditForm?.alias||''} onChange={(e)=>setStoreEditForm(s=>({ ...s, alias:e.target.value }))} /></Row>
                        <Row label={<span className="whitespace-nowrap">收件人</span>}><input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeEditForm?.recipient||''} onChange={(e)=>setStoreEditForm(s=>({ ...s, recipient:e.target.value }))} /></Row>
                        <Row label={<span className="whitespace-nowrap">收件電話</span>}><input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeEditForm?.phone||''} onChange={(e)=>setStoreEditForm(s=>({ ...s, phone:e.target.value }))} placeholder="09xxxxxxxx" /></Row>
                        <Row label="物流廠商"><input className="w-56 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeEditForm?.vendor||''} onChange={(e)=>setStoreEditForm(s=>({ ...s, vendor:e.target.value }))} /></Row>
                        <Row label="門市名稱"><input className="w-64 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeEditForm?.store_name||''} onChange={(e)=>setStoreEditForm(s=>({ ...s, store_name:e.target.value }))} /></Row>
                        <Row label="門市代號"><input className="w-40 border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeEditForm?.store_id||''} onChange={(e)=>setStoreEditForm(s=>({ ...s, store_id:e.target.value }))} /></Row>
                        <Row label={<span className="whitespace-nowrap">門市地址</span>}><input className="w-full border rounded-md px-3 py-2 text-sm" style={{ borderColor:'#E5E7EB' }} value={storeEditForm?.store_address||''} onChange={(e)=>setStoreEditForm(s=>({ ...s, store_address:e.target.value }))} /></Row>
                        <div className="flex items-center justify-end gap-2 mt-3">
                          <button onClick={()=>{ setEditingStoreId(null); setStoreEditForm(null) }} className="px-3 py-1.5 rounded-md text-xs border" style={{ color:'#666666', borderColor:'#E5E7EB' }}>取消</button>
                          <button onClick={async ()=>{
                            if (!storeEditForm?.alias?.trim()) { pushToast('error', '請輸入別稱'); return }
                            if (!storeEditForm?.recipient?.trim()) { pushToast('error', '請輸入收件人'); return }
                            if (!/^09\d{8}$/.test((storeEditForm?.phone||'').trim())) { pushToast('error', '收件電話格式不正確'); return }
                            if (!storeEditForm?.vendor?.trim() || !storeEditForm?.store_id?.trim() || !storeEditForm?.store_name?.trim() || !storeEditForm?.store_address?.trim()) { pushToast('error', '請完整填寫門市資訊'); return }
                            const payload = { type:'cvs', alias: storeEditForm?.alias||null, vendor: storeEditForm?.vendor?.trim(), store_id: storeEditForm?.store_id?.trim(), store_name: storeEditForm?.store_name?.trim(), store_address: storeEditForm?.store_address?.trim(), receiver_name: (storeEditForm?.recipient||'').trim(), receiver_phone: (storeEditForm?.phone||'').trim() }
                            const res = await fetch(`/frontend/account/addresses/${item.id}`, { method:'PATCH', credentials:'include', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
                            if (res.ok) { const updated = await res.json(); setStoreAddresses(arr=>arr.map(x=>x.id===item.id?updated:x)); setEditingStoreId(null); setStoreEditForm(null) }
                          }} className="px-3 py-1.5 rounded-md text-xs font-bold text-white" style={{ background:'#cc824d' }}>儲存</button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-gray-700 truncate whitespace-nowrap">
                          {item.is_default ? (<span className="inline-block px-2 py-0.5 rounded-full text-[10px]" style={{ background:'#F3F4F6', color:'#CC824D', border:'1px solid #E5E7EB' }}>預設</span>) : null}
                          <span>
                            {item.alias ? `${item.alias} ｜ ` : ''}收件人：{item.receiver_name || item.recipient || '—'} ｜ 電話：{item.receiver_phone || item.phone || '—'} ｜ 物流：{item.vendor || '—'} ｜ 門市：{item.store_name || '—'}（{item.store_id || '—'}） ｜ 地址：{item.store_address || '—'}
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-3">
                          {!item.is_default && (
                            <button onClick={async ()=>{ const res = await fetch(`/frontend/account/addresses/${item.id}`, { method:'PATCH', credentials:'include', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ type:'cvs', is_default: true }) }); if (res.ok) { setStoreAddresses(arr=>arr.map(x=>({ ...x, is_default: x.id===item.id }))); pushToast('success', '已設定為預設地址') } else { pushToast('error', '設定失敗') } }} className="px-3 py-1.5 rounded-md text-xs border" style={{ color:'#666666', borderColor:'#E5E7EB' }}>設為預設</button>
                          )}
                          <button onClick={()=>{ setEditingStoreId(item.id); setStoreEditForm({ alias:item.alias||'', vendor:item.vendor||'', store_name:item.store_name||'', store_id:item.store_id||'', store_address:item.store_address||'', recipient:item.receiver_name||item.recipient||'', phone:item.receiver_phone||item.phone||'' }) }} className="px-3 py-1.5 rounded-md text-xs border" style={{ color:'#666666', borderColor:'#E5E7EB' }}>編輯</button>
                          <button onClick={async ()=>{ const r = await fetch(`/frontend/account/addresses/${item.id}`, { method:'DELETE', credentials:'include' }); if (r.ok) { loadAddresses(); pushToast('success', '已刪除') } else { pushToast('error', '刪除失敗') } }} className="px-3 py-1.5 rounded-md text-xs border" style={{ color:'#666666', borderColor:'#E5E7EB' }}>刪除</button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}

      {/* 行內編輯已取代彈窗，保留 LINE 解除綁定之彈窗 */}

      {activeTab === 'line' && (
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium" style={{color:'#333333'}}>LINE 綁定狀態</span>
            {lineStatus.is_bound ? (
              <span className="flex items-center gap-2" style={{color:'#16a34a'}}>
                <span className="inline-block w-2 h-2 rounded-full" style={{background:'#16a34a'}} />
                已綁定
              </span>
            ) : (
              <span className="flex items-center gap-2" style={{color:'#dc2626'}}>
                <span className="inline-block w-2 h-2 rounded-full" style={{background:'#dc2626'}} />
                未綁定
              </span>
            )}
          </div>
          {lineStatus.is_bound ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {lineStatus.line_picture_url ? (
                  <img src={lineStatus.line_picture_url} alt="LINE avatar" className="w-8 h-8 rounded-full" />
                ) : null}
                <div style={{color:'#666666'}}>名稱：{lineStatus.line_display_name || '（無）'}</div>
              </div>
              <button
                onClick={() => setShowUnbind(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-md transition-all"
                style={{ background: '#ef4444', color: '#FFFFFF' }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.95)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
              >
                解除綁定
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href={lineBindHref}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-md transition-all"
                style={{ background: '#06C755', color: '#FFFFFF' }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.95)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
              >
                立即綁定 LINE
              </a>
              <span style={{color:'#999999'}}>為了快速查詢通知與優惠，建議完成綁定。</span>
            </div>
          )}

          <GlassModal
            isOpen={showUnbind}
            onClose={() => setShowUnbind(false)}
            title="解除 LINE 綁定"
            size="max-w-md"
          >
            <div className="px-6 pb-6 pt-0">
              <p className="text-sm mb-6" style={{color:'#666666'}}>
                確定要解除與 LINE 的綁定嗎？解除後將無法接收 LINE 通知，日後可再次綁定。
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowUnbind(false)}
                  className="px-4 py-2 rounded-md text-sm border"
                  style={{ color:'#666666', borderColor:'#E5E7EB' }}
                >
                  取消
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/frontend/account/line/unbind', { method: 'POST', credentials: 'include' })
                      if (res.ok) {
                        setLineStatus({ is_bound: false, line_display_name: null, line_picture_url: null })
                        setShowUnbind(false)
                      }
                    } catch {}
                  }}
                  className="px-4 py-2 rounded-md text-sm font-bold text-white"
                  style={{ background:'#ef4444' }}
                >
                  確認解除
                </button>
              </div>
            </div>
          </GlassModal>
        </div>
      )}
      {/* Toasts */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className="px-3 py-2 rounded-md shadow text-xs" style={{ background: t.type==='error' ? '#fee2e2' : '#ecfeff', color: t.type==='error' ? '#b91c1c' : '#0369a1', border: `1px solid ${t.type==='error' ? '#fecaca' : '#a5f3fc'}` }}>
            {t.message}
          </div>
        ))}
      </div>
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#E5E7EB' }}>
      <span style={{color:'#666666'}}>{label}</span>
      {children}
    </div>
  )
}
