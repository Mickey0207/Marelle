import React, { useEffect, useState } from 'react';
import GlassModal from '../../ui/GlassModal.jsx';
import SearchableSelect from '../../ui/SearchableSelect.jsx';

export default function ProfileInfo({ user }) {
  const [activeTab, setActiveTab] = useState('personal'); // personal | address | line
  const [lineStatus, setLineStatus] = useState({ is_bound: null, line_display_name: null, line_picture_url: null });
  const [showUnbind, setShowUnbind] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ display_name: '', phone: '', gender: '', newsletter: false });

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
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium" style={{color:'#333333'}}>送貨地址</span>
          </div>
          <div style={{color:'#666666'}}>目前尚未設定送貨地址。</div>
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
                href="/frontend/account/line/start"
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
