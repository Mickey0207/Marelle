import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import GlassModal from '../../components/ui/GlassModal';
import TabNavigation from '../../components/ui/TabNavigation';
import SearchableSelect from '../../components/ui/SearchableSelect';
import { VARIABLE_CATEGORIES, getVariableCatalog, buildSampleContext } from '../../../../external_mock/notifications/variables';
import { getPresetOptions, getPresetContext } from '../../../../external_mock/notifications/presets';
import {
  getTemplates,
  searchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  publishTemplate,
  renderMailFieldsWithContext,
} from '../../../../external_mock/notifications/mailTextTemplateDataManager';

const MailTextMessage = () => {
  // 小元件：Email 預覽
  const EmailPreview = ({ subject = '', content = '', headerImageUrl = '', signatureText = '', signatureImageUrl = '' }) => {
    const renderedContent = content?.trim() ? content : '（尚未輸入內容）';
    return (
      <div className="w-full">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 overflow-hidden bg-white shadow">
          {/* Header bar */}
          <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium">Email 預覽</div>
          <div className="p-0 bg-white">
            {headerImageUrl ? (
              <img src={headerImageUrl} alt="Header" className="w-full object-cover max-h-48" />
            ) : (
              <div className="w-full h-10 bg-gray-100 flex items-center justify-center text-xs text-gray-400">無標頭圖片</div>
            )}
            <div className="px-5 py-4 space-y-3">
              <div className="text-lg font-semibold text-gray-900 break-words">{subject || '（無主旨）'}</div>
              <div className="h-px bg-gray-200" />
              <div className="whitespace-pre-wrap text-gray-800 text-[15px] leading-7 break-words">{renderedContent}</div>
              {(signatureImageUrl || signatureText) && (
                <div className="pt-4 mt-2 border-t border-gray-200">
                  {signatureImageUrl && (
                    <img src={signatureImageUrl} alt="Signature" className="max-h-24 object-contain mb-2" />
                  )}
                  {signatureText && (
                    <div className="text-gray-600 whitespace-pre-wrap text-sm">{signatureText}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 左側清單狀態
  const [keyword, setKeyword] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [list, setList] = useState([]);

  // 右側編輯狀態
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    tags: [],
    subject: '',
    content: '',
    headerImageUrl: '',
    signatureText: '',
    signatureImageUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const contentRef = useRef(null);
  const subjectRef = useRef(null);

  // Modal 與動作狀態
  const [showDelete, setShowDelete] = useState(false);
  const [showVarPicker, setShowVarPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewCtx, setPreviewCtx] = useState(() => buildSampleContext());
  const [previewPreset, setPreviewPreset] = useState('default');
  const [previewActiveTab, setPreviewActiveTab] = useState('preview');

  // 測試傳送狀態
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // 變數插入器
  const [activeVarTab, setActiveVarTab] = useState(VARIABLE_CATEGORIES[0].key);
  const [varSearch, setVarSearch] = useState('');
  const variableCatalog = useMemo(() => getVariableCatalog(), []);

  // 將 catalog 攤平成可查詢的陣列/索引: path -> meta, token -> meta
  const flatCatalog = useMemo(() => {
    const items = [];
    Object.entries(variableCatalog).forEach(([category, arr]) => {
      (arr || []).forEach((it) => {
        const path = (it.token || '').replace(/\{\{|\}\}/g, '').trim();
        items.push({ ...it, category, path });
      });
    });
    const byPath = Object.fromEntries(items.map((i) => [i.path, i]));
    const byToken = Object.fromEntries(items.map((i) => [i.token, i]));
    return { items, byPath, byToken };
  }, [variableCatalog]);

  // 從模板抓取實際使用到的變數 path（唯一）
  const usedPaths = useMemo(() => {
    const subject = form?.subject || '';
    const content = form?.content || '';
    const re = /\{\{\s*([\w.]+)\s*\}\}/g;
    const set = new Set();
    let m;
    [subject, content].forEach((txt) => {
      while ((m = re.exec(txt))) { if (m[1]) set.add(m[1]); }
    });
    return Array.from(set);
  }, [form?.subject, form?.content]);

  const usedVarEntries = useMemo(() => {
    if (!usedPaths.length) return [];
    return usedPaths.map((p) => {
      const found = flatCatalog.byPath[p];
      if (found) return found;
      const top = p.split('.')[0];
      return { label: p, token: `{{${p}}}`, desc: '', category: top, path: p };
    });
  }, [usedPaths, flatCatalog.byPath]);

  const getByPath = (obj, path) => path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : ''), obj);
  const setByPath = (obj, path, value) => {
    const segs = path.split('.');
    const clone = Array.isArray(obj) ? [...obj] : { ...obj };
    let cur = clone;
    for (let i = 0; i < segs.length; i++) {
      const key = segs[i];
      if (i === segs.length - 1) cur[key] = value; else {
        const next = cur[key];
        const isObj = next && typeof next === 'object' && !Array.isArray(next);
        cur[key] = isObj ? { ...next } : {};
        cur = cur[key];
      }
    }
    return clone;
  };

  const modalSize = useMemo(() => {
    const count = usedVarEntries.length;
    if (previewActiveTab === 'preview') {
      if (count <= 2) return 'max-w-4xl';
      if (count <= 8) return 'max-w-5xl';
      return 'max-w-6xl';
    }
    if (count === 0) return 'max-w-xl';
    if (count <= 2) return 'max-w-2xl';
    if (count <= 6) return 'max-w-3xl';
    if (count <= 10) return 'max-w-4xl';
    return 'max-w-5xl';
  }, [previewActiveTab, usedVarEntries.length]);

  // 初次載入
  useEffect(() => {
    const items = getTemplates();
    setList(items);
    if (items.length) setSelectedId(items[0].id);
  }, []);

  const current = useMemo(() => list.find(t => t.id === selectedId) || null, [list, selectedId]);

  useEffect(() => {
    if (current) {
      setForm({
        name: current.name || '',
        category: current.category || '',
        description: current.description || '',
        tags: Array.isArray(current.tags) ? current.tags : [],
        subject: current.subject || '',
        content: current.content || '',
        headerImageUrl: current.headerImageUrl || '',
        signatureText: current.signatureText || '',
        signatureImageUrl: current.signatureImageUrl || '',
      });
    } else {
      setForm({ name: '', category: '', description: '', tags: [], subject: '', content: '', headerImageUrl: '', signatureText: '', signatureImageUrl: '' });
    }
  }, [current]);

  const filtered = useMemo(() => (keyword ? searchTemplates(keyword) : list), [keyword, list]);

  const handleCreate = () => {
    const item = createTemplate({ name: '新郵件範本', description: '' });
    const next = getTemplates();
    setList(next);
    setSelectedId(item.id);
  };
  const handleDuplicate = (id) => {
    const item = duplicateTemplate(id);
    const next = getTemplates();
    setList(next);
    if (item) setSelectedId(item.id);
  };
  const handlePublish = (id) => { publishTemplate(id); setList(getTemplates()); };
  const handleDelete = () => {
    if (!current) return;
    deleteTemplate(current.id);
    const next = getTemplates();
    setList(next);
    setSelectedId(next[0]?.id || null);
    setShowDelete(false);
  };
  const handleSave = () => {
    if (!current) return;
    setSaving(true);
    updateTemplate(current.id, { ...form });
    setList(getTemplates());
    setSaving(false);
  };

  const categories = [
    { label: '通用', value: '通用' },
    { label: '會員', value: '會員' },
    { label: '訂單', value: '訂單' },
    { label: '行銷', value: '行銷' },
    { label: '物流', value: '物流' },
  ];
  const tagOptions = [
    { label: 'welcome', value: 'welcome' },
    { label: 'member', value: 'member' },
    { label: 'order', value: 'order' },
    { label: 'logistics', value: 'logistics' },
    { label: 'promo', value: 'promo' },
    { label: 'cart', value: 'cart' },
    { label: 'remarketing', value: 'remarketing' },
  ];

  const insertAtCursor = (ref, valueToInsert) => {
    const el = ref?.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);
    const next = `${before}${valueToInsert}${after}`;
    const key = el === subjectRef.current ? 'subject' : 'content';
    setForm((p) => ({ ...p, [key]: next }));
    requestAnimationFrame(() => { el.focus(); const pos = start + valueToInsert.length; el.setSelectionRange(pos, pos); });
  };

  // 發送測試（僅接收者，其餘使用預覽 context）
  const [testForm, setTestForm] = useState({ recipient: '', email: '' });
  const handleSendTest = () => {
    setSending(true);
    setSendResult(null);
    const rendered = renderMailFieldsWithContext({ subject: form.subject, content: form.content, signatureText: form.signatureText }, previewCtx);
    setTimeout(() => {
      setSending(false);
      setSendResult({ success: true, message: '測試郵件已模擬送出', rendered });
    }, 700);
  };

  const previewPresets = getPresetOptions();
  const applyPreviewPreset = (key) => { setPreviewCtx(getPresetContext(key)); };
  useEffect(() => { if (showPreview) applyPreviewPreset(previewPreset || 'default'); }, [showPreview]);

  return (
    <div className={`${ADMIN_STYLES.pageContainer}`}>
      <div className={`${ADMIN_STYLES.contentContainer}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={ADMIN_STYLES.pageTitle}>Mail 一般訊息</h1>
            <p className={ADMIN_STYLES.pageSubtitle}>集中管理 Email 純文字（可含圖片與簽名）範本</p>
          </div>
          <div className="flex items-center gap-2">
            <button className={ADMIN_STYLES.secondaryButton} onClick={() => current && handleDuplicate(current.id)}>複製範本</button>
            <button className={ADMIN_STYLES.primaryButton} onClick={handleCreate}>新增範本</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* 左側清單 */}
          <div className="col-span-1">
            <div className={`${ADMIN_STYLES.glassCard} space-y-4`}>
              <div className="flex gap-3">
                <input
                  placeholder="搜尋名稱、描述、分類、主旨、標籤"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className={`${ADMIN_STYLES.input}`}
                />
              </div>

              <div className="divide-y divide-gray-200/60 border border-gray-200/60 rounded-xl overflow-hidden bg-white/70 backdrop-blur-sm">
                {filtered.length === 0 && (
                  <div className="p-4 text-gray-500">沒有符合的範本</div>
                )}
                {filtered.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full text-left p-4 transition-colors ${selectedId === t.id ? 'bg-[#cc824d]/10' : 'hover:bg-gray-50/60'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 font-chinese truncate">{t.name}</div>
                        <div className="text-xs text-gray-500 truncate">{t.subject || '（無主旨）'}</div>
                        <div className="text-xs text-gray-500 truncate">{t.description || '—'}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {t.status === 'published' ? '已發佈' : '草稿'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右側編輯器 */}
          <div className="col-span-2">
            <div className={`${ADMIN_STYLES.glassCard} space-y-6`}>
              {!current ? (
                <div className="text-gray-500">請先在左側選擇或新增一個範本</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">範本名稱</label>
                      <input className={ADMIN_STYLES.input} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">分類</label>
                      <SearchableSelect options={categories} value={form.category} onChange={(v) => setForm((p) => ({ ...p, category: v }))} placeholder="選擇分類" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">描述</label>
                    <input className={ADMIN_STYLES.input} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">標籤</label>
                    <SearchableSelect options={tagOptions} value={form.tags} onChange={(v) => setForm((p) => ({ ...p, tags: v }))} multiple={true} placeholder="新增或選擇標籤" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 gap-3">
                      <label className="block text-sm font-medium text-gray-700 font-chinese">主旨</label>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">可用變數：{'{{user.name}}'}, {'{{order.number}}'}, {'{{shipment.tracking}}'}</div>
                        <button className={ADMIN_STYLES.btnGhost} onClick={() => setShowVarPicker(true)}>插入變數</button>
                      </div>
                    </div>
                    <input ref={subjectRef} className={ADMIN_STYLES.input} value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} placeholder="輸入郵件主旨" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 gap-3">
                      <label className="block text-sm font-medium text-gray-700 font-chinese">內容</label>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">可用變數：{'{{user.name}}'}, {'{{order.number}}'}, {'{{shipment.tracking}}'}</div>
                        <button className={ADMIN_STYLES.btnGhost} onClick={() => setShowVarPicker(true)}>插入變數</button>
                      </div>
                    </div>
                    <textarea ref={contentRef} className={`${ADMIN_STYLES.input} min-h-[200px]`} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="輸入郵件純文字內容（可換行）" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">標頭圖片 URL（可選）</label>
                      <input className={ADMIN_STYLES.input} value={form.headerImageUrl} onChange={(e) => setForm((p) => ({ ...p, headerImageUrl: e.target.value }))} placeholder="https://.../header.png" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">簽名圖片 URL（可選）</label>
                      <input className={ADMIN_STYLES.input} value={form.signatureImageUrl} onChange={(e) => setForm((p) => ({ ...p, signatureImageUrl: e.target.value }))} placeholder="https://.../signature.png" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">簽名文字（可選）</label>
                    <textarea className={`${ADMIN_STYLES.input} min-h-[100px]`} value={form.signatureText} onChange={(e) => setForm((p) => ({ ...p, signatureText: e.target.value }))} placeholder="公司名稱、聯絡方式等…" />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-gray-500">上次修改：{current.updatedAt ? new Date(current.updatedAt).toLocaleString() : '—'}</div>
                    <div className="flex items-center gap-2">
                      <button className={ADMIN_STYLES.btnSecondary} onClick={() => setShowDelete(true)}>刪除</button>
                      {current.status !== 'published' && (<button className={ADMIN_STYLES.btnGhost} onClick={() => handlePublish(current.id)}>發佈</button>)}
                      <button className={ADMIN_STYLES.btnGhost} onClick={() => setShowPreview(true)}>預覽</button>
                      <button className={`${ADMIN_STYLES.btnPrimary} ${saving ? 'opacity-70 pointer-events-none' : ''}`} onClick={handleSave}>{saving ? '儲存中…' : '儲存變更'}</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 刪除確認 */}
      <GlassModal isOpen={showDelete} onClose={() => setShowDelete(false)} title="刪除範本">
        <div className="space-y-4 p-6">
          <p className="text-gray-600">確定要刪除「{current?.name}」嗎？此動作無法復原。</p>
          <div className="flex justify-end gap-2">
            <button className={ADMIN_STYLES.secondaryButton} onClick={() => setShowDelete(false)}>取消</button>
            <button className={ADMIN_STYLES.primaryButton} onClick={handleDelete}>確定刪除</button>
          </div>
        </div>
      </GlassModal>

      {/* 預覽（含子頁籤） */}
      <GlassModal isOpen={showPreview} onClose={() => setShowPreview(false)} title="預覽" size={modalSize}>
        <div className="space-y-6 p-6">
          <TabNavigation
            mode="controlled"
            activeKey={previewActiveTab}
            onTabChange={(t) => setPreviewActiveTab(t.key || t.label)}
            layout="left"
            className="px-2"
            tabs={[{ key: 'preview', label: '預覽與發送' }, { key: 'context', label: '情境與欄位' }]}
          />

          {previewActiveTab === 'preview' && (
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-6">
                {(() => {
                  const rendered = renderMailFieldsWithContext({ subject: form.subject, content: form.content, signatureText: form.signatureText }, previewCtx);
                  return (
                    <EmailPreview
                      subject={rendered.subject}
                      content={rendered.content}
                      headerImageUrl={form.headerImageUrl}
                      signatureText={rendered.signatureText}
                      signatureImageUrl={form.signatureImageUrl}
                    />
                  );
                })()}
              </div>
              <div className="col-span-6">
                <div className="text-sm text-gray-700 font-medium mb-3">發送測試</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">測試收件者（Email）</label>
                    <input className={ADMIN_STYLES.input} value={testForm.email} onChange={(e) => setTestForm((p) => ({ ...p, email: e.target.value }))} placeholder="name@example.com" />
                  </div>
                  <div className="text-xs text-gray-500">不會真正寄出 Email，只做本地模擬</div>
                  <div className="flex justify-end">
                    <button className={`${ADMIN_STYLES.primaryButton} ${sending ? 'opacity-70 pointer-events-none' : ''}`} onClick={handleSendTest}>{sending ? '傳送中…' : '送出測試'}</button>
                  </div>
                  {sendResult && (
                    <div className={`${sendResult.success ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'} p-3 rounded-lg text-sm`}>
                      {sendResult.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {previewActiveTab === 'context' && (
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-12">
                <div className="text-sm text-gray-700 font-medium mb-3">情境與欄位</div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">快速切換情境</label>
                    <SearchableSelect options={previewPresets} value={previewPreset} onChange={(val) => { setPreviewPreset(val); applyPreviewPreset(val); }} placeholder="選擇情境" />
                  </div>

                  {usedVarEntries.length === 0 ? (
                    <div className="text-xs text-gray-500">此範本未插入任何變數，無需調整欄位。</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {usedVarEntries.map((v) => {
                        const isSystem = v.category === 'system' || v.path.startsWith('system.');
                        const val = getByPath(previewCtx, v.path);
                        const label = `${v.label || v.path} ${v.path}`;
                        return (
                          <div key={v.path}>
                            <label className="block text-xs text-gray-600 mb-1">{label}</label>
                            <input
                              className={ADMIN_STYLES.input}
                              value={val || ''}
                              disabled={isSystem}
                              onChange={(e) => { const next = setByPath(previewCtx, v.path, e.target.value); setPreviewCtx(next); }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">更改會即時反映於預覽分頁</div>
                    <div className="flex items-center gap-2">
                      <button className={ADMIN_STYLES.secondaryButton} onClick={() => { setPreviewPreset('default'); applyPreviewPreset('default'); }}>重置</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button className={ADMIN_STYLES.primaryButton} onClick={() => setShowPreview(false)}>關閉</button>
          </div>
        </div>
      </GlassModal>

      {/* 變數插入器 */}
      <GlassModal isOpen={showVarPicker} onClose={() => setShowVarPicker(false)} title="插入變數">
        <div className="space-y-4 p-6">
          <TabNavigation
            mode="controlled"
            activeKey={activeVarTab}
            onTabChange={(t) => setActiveVarTab(t.key)}
            layout="left"
            tabs={VARIABLE_CATEGORIES.map((c) => ({ key: c.key, label: c.label }))}
            className="px-2"
          />

          <div className="flex items-center gap-2">
            <input value={varSearch} onChange={(e) => setVarSearch(e.target.value)} placeholder="搜尋變數關鍵字…" className={`${ADMIN_STYLES.input}`} />
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto px-1">
            {(VARIABLE_CATEGORIES.find(c => c.key === activeVarTab) ? variableCatalog[activeVarTab] : [])
              .filter((v) => {
                const q = varSearch.trim().toLowerCase();
                if (!q) return true;
                return [v.label, v.token, v.desc].filter(Boolean).some((s) => s.toLowerCase().includes(q));
              })
              .map((v) => (
                <div key={v.token} className="flex items-center justify-between p-4 rounded-xl border border-gray-200/80 bg-white/80 hover:bg-gray-50/60 transition">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 font-chinese">{v.label}</div>
                    <div className="text-xs text-gray-600 truncate font-mono">{v.token}</div>
                    {v.desc && <div className="text-xs text-gray-400">{v.desc}</div>}
                  </div>
                  {/* 可插入到主旨或內容 */}
                  <div className="flex items-center gap-2">
                    <button className={ADMIN_STYLES.btnGhost} onClick={() => insertAtCursor(subjectRef, v.token)}>插入主旨</button>
                    <button className={ADMIN_STYLES.primaryButton} onClick={() => insertAtCursor(contentRef, v.token)}>插入內容</button>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-end gap-2">
            <button className={ADMIN_STYLES.secondaryButton} onClick={() => setShowVarPicker(false)}>完成</button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};

export default MailTextMessage;
