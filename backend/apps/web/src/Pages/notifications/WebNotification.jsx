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
  renderWebNotificationWithContext,
} from '../../../../external_mock/notifications/webNotificationTemplateDataManager';

const WebNotification = () => {
  // 預覽卡片（模擬通知中心的「檢視」彈窗內容）
  const WebNotificationPreview = ({ item }) => {
    if (!item) return null;
    const badge = (txt, cls) => <span className={`px-2 py-0.5 text-xs rounded-full ${cls}`}>{txt}</span>;
    const typeMap = { order: '訂單', payment: '金流', review: '評價', system: '系統' };
    const sevCls = item.severity === 'error' ? 'bg-red-100 text-red-800' : item.severity === 'warning' ? 'bg-amber-100 text-amber-800' : item.severity === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
    return (
      <div className="w-full">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 overflow-hidden bg-white shadow">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold text-gray-900">{item.title || '（無標題）'}</div>
              {badge(typeMap[item.type] || item.type || '一般', 'bg-gray-100 text-gray-700')}
              {badge(item.severity || 'info', sevCls)}
            </div>
            {item.source && <div className="text-xs text-gray-500 mt-1">{item.source}</div>}
          </div>
          <div className="p-5 space-y-3">
            <div className="text-gray-800 whitespace-pre-wrap leading-7">{item.body || '（無內容）'}</div>
            {item.ctaUrl && (
              <div className="pt-2">
                <a href={item.ctaUrl} target="_blank" rel="noreferrer" className="inline-block bg-[#cc824d] text-white text-sm px-3 py-2 rounded-lg hover:brightness-110">
                  {item.ctaLabel || '前往'}
                </a>
              </div>
            )}
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
    title: '',
    body: '',
    type: 'system',
    severity: 'info',
    source: '',
    ctaLabel: '',
    ctaUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const ctaLabelRef = useRef(null);
  const ctaUrlRef = useRef(null);

  // Modal 與動作狀態
  const [showDelete, setShowDelete] = useState(false);
  const [showVarPicker, setShowVarPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewCtx, setPreviewCtx] = useState(() => buildSampleContext());
  const [previewPreset, setPreviewPreset] = useState('default');
  const [previewActiveTab, setPreviewActiveTab] = useState('preview');

  // 變數插入器
  const [activeVarTab, setActiveVarTab] = useState(VARIABLE_CATEGORIES[0].key);
  const [varSearch, setVarSearch] = useState('');
  const variableCatalog = useMemo(() => getVariableCatalog(), []);

  const flatCatalog = useMemo(() => {
    const items = [];
    Object.entries(variableCatalog).forEach(([category, arr]) => {
      (arr || []).forEach((it) => {
        const path = (it.token || '').replace(/\{\{|\}\}/g, '').trim();
        items.push({ ...it, category, path });
      });
    });
    const byPath = Object.fromEntries(items.map((i) => [i.path, i]));
    return { items, byPath };
  }, [variableCatalog]);

  const usedPaths = useMemo(() => {
    const fields = [form.title || '', form.body || '', form.source || '', form.ctaLabel || '', form.ctaUrl || ''];
    const re = /\{\{\s*([\w.]+)\s*\}\}/g;
    const set = new Set();
    fields.forEach(txt => { let m; while ((m = re.exec(txt))) { if (m[1]) set.add(m[1]); } });
    return Array.from(set);
  }, [form]);

  const usedVarEntries = useMemo(() => usedPaths.map((p) => flatCatalog.byPath[p] || ({ label: p, token: `{{${p}}}`, desc: '', category: p.split('.')[0], path: p })), [usedPaths, flatCatalog.byPath]);

  const getByPath = (obj, path) => path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : ''), obj);
  const setByPath = (obj, path, value) => {
    const segs = path.split('.');
    const clone = Array.isArray(obj) ? [...obj] : { ...obj };
    let cur = clone;
    for (let i = 0; i < segs.length; i++) {
      const key = segs[i];
      if (i === segs.length - 1) cur[key] = value; else { const next = cur[key]; const isObj = next && typeof next === 'object' && !Array.isArray(next); cur[key] = isObj ? { ...next } : {}; cur = cur[key]; }
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
        title: current.title || '',
        body: current.body || '',
        type: current.type || 'system',
        severity: current.severity || 'info',
        source: current.source || '',
        ctaLabel: current.ctaLabel || '',
        ctaUrl: current.ctaUrl || '',
      });
    } else {
      setForm({ name: '', category: '', description: '', tags: [], title: '', body: '', type: 'system', severity: 'info', source: '', ctaLabel: '', ctaUrl: '' });
    }
  }, [current]);

  const filtered = useMemo(() => (keyword ? searchTemplates(keyword) : list), [keyword, list]);

  const handleCreate = () => { const item = createTemplate({ name: '新站內通知', description: '' }); const next = getTemplates(); setList(next); setSelectedId(item.id); };
  const handleDuplicate = (id) => { const item = duplicateTemplate(id); const next = getTemplates(); setList(next); if (item) setSelectedId(item.id); };
  const handlePublish = (id) => { publishTemplate(id); setList(getTemplates()); };
  const handleDelete = () => { if (!current) return; deleteTemplate(current.id); const next = getTemplates(); setList(next); setSelectedId(next[0]?.id || null); setShowDelete(false); };
  const handleSave = () => { if (!current) return; setSaving(true); updateTemplate(current.id, { ...form }); setList(getTemplates()); setSaving(false); };

  const categories = [
    { label: '通用', value: '通用' },
    { label: '會員', value: '會員' },
    { label: '訂單', value: '訂單' },
    { label: '行銷', value: '行銷' },
    { label: '物流', value: '物流' },
  ];
  const tagOptions = [
    { label: 'order', value: 'order' },
    { label: 'payment', value: 'payment' },
    { label: 'review', value: 'review' },
    { label: 'system', value: 'system' },
  ];

  const insertAtCursor = (ref, valueToInsert) => {
    const el = ref?.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);
    const next = `${before}${valueToInsert}${after}`;
    const key = el === titleRef.current ? 'title' : el === bodyRef.current ? 'body' : el === ctaLabelRef.current ? 'ctaLabel' : 'ctaUrl';
    setForm((p) => ({ ...p, [key]: next }));
    requestAnimationFrame(() => { el.focus(); const pos = start + valueToInsert.length; el.setSelectionRange(pos, pos); });
  };

  const previewPresets = getPresetOptions();
  const applyPreviewPreset = (key) => { setPreviewCtx(getPresetContext(key)); };
  useEffect(() => { if (showPreview) applyPreviewPreset(previewPreset || 'default'); }, [showPreview]);

  return (
    <div className={`${ADMIN_STYLES.pageContainer}`}>
      <div className={`${ADMIN_STYLES.contentContainer}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={ADMIN_STYLES.pageTitle}>網站通知</h1>
            <p className={ADMIN_STYLES.pageSubtitle}>集中管理站內通知（管理員/內部提醒）</p>
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
                <input placeholder="搜尋名稱、描述、分類、主題、標籤" value={keyword} onChange={(e) => setKeyword(e.target.value)} className={`${ADMIN_STYLES.input}`} />
              </div>
              <div className="divide-y divide-gray-200/60 border border-gray-200/60 rounded-xl overflow-hidden bg-white/70 backdrop-blur-sm">
                {filtered.length === 0 && (<div className="p-4 text-gray-500">沒有符合的範本</div>)}
                {filtered.map((t) => (
                  <button key={t.id} onClick={() => setSelectedId(t.id)} className={`w-full text-left p-4 transition-colors ${selectedId === t.id ? 'bg-[#cc824d]/10' : 'hover:bg-gray-50/60'}`}>
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 font-chinese truncate">{t.name}</div>
                        <div className="text-xs text-gray-500 truncate">{t.title || '（無標題）'}</div>
                        <div className="text-xs text-gray-500 truncate">{t.description || '—'}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{t.status === 'published' ? '已發佈' : '草稿'}</span>
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
                      <SearchableSelect options={[{label:'通用',value:'通用'},{label:'會員',value:'會員'},{label:'訂單',value:'訂單'},{label:'行銷',value:'行銷'},{label:'物流',value:'物流'}]} value={form.category} onChange={(v) => setForm((p) => ({ ...p, category: v }))} placeholder="選擇分類" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">描述</label>
                    <input className={ADMIN_STYLES.input} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">標籤</label>
                    <SearchableSelect options={[{label:'order',value:'order'},{label:'payment',value:'payment'},{label:'review',value:'review'},{label:'system',value:'system'}]} value={form.tags} onChange={(v) => setForm((p) => ({ ...p, tags: v }))} multiple={true} placeholder="新增或選擇標籤" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 gap-3">
                      <label className="block text-sm font-medium text-gray-700 font-chinese">標題</label>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">可用變數：{'{{user.name}}'}, {'{{order.number}}'}, {'{{shipment.tracking}}'}</div>
                        <button className={ADMIN_STYLES.btnGhost} onClick={() => setShowVarPicker(true)}>插入變數</button>
                      </div>
                    </div>
                    <input ref={titleRef} className={ADMIN_STYLES.input} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="輸入站內通知標題" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 gap-3">
                      <label className="block text-sm font-medium text-gray-700 font-chinese">內容</label>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">可用變數：{'{{user.name}}'}, {'{{order.number}}'}, {'{{shipment.tracking}}'}</div>
                        <button className={ADMIN_STYLES.btnGhost} onClick={() => setShowVarPicker(true)}>插入變數</button>
                      </div>
                    </div>
                    <textarea ref={bodyRef} className={`${ADMIN_STYLES.input} min-h-[160px]`} value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))} placeholder="輸入站內通知內容（支援變數）" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">類型</label>
                      <select className={ADMIN_STYLES.input} value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                        <option value="order">訂單</option>
                        <option value="payment">金流</option>
                        <option value="review">評價</option>
                        <option value="system">系統</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">等級</label>
                      <select className={ADMIN_STYLES.input} value={form.severity} onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))}>
                        <option value="info">一般</option>
                        <option value="success">成功</option>
                        <option value="warning">警告</option>
                        <option value="error">錯誤</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">來源</label>
                      <input className={ADMIN_STYLES.input} value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))} placeholder="例如：訂單系統／金流（ECPay）／系統監控" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">CTA 按鈕文字</label>
                      <input ref={ctaLabelRef} className={ADMIN_STYLES.input} value={form.ctaLabel} onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))} placeholder="例如：前往訂單" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">CTA 連結</label>
                    <input ref={ctaUrlRef} className={ADMIN_STYLES.input} value={form.ctaUrl} onChange={(e) => setForm((p) => ({ ...p, ctaUrl: e.target.value }))} placeholder="https://marelle.com.tw/... 或 /orders/123" />
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
          <TabNavigation mode="controlled" activeKey={previewActiveTab} onTabChange={(t) => setPreviewActiveTab(t.key || t.label)} layout="left" className="px-2" tabs={[{ key: 'preview', label: '預覽' }, { key: 'context', label: '情境與欄位' }]} />

          {previewActiveTab === 'preview' && (
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-7">
                {(() => {
                  const rendered = renderWebNotificationWithContext({ title: form.title, body: form.body, ctaLabel: form.ctaLabel, ctaUrl: form.ctaUrl, type: form.type, severity: form.severity, source: form.source }, previewCtx);
                  return <WebNotificationPreview item={rendered} />;
                })()}
              </div>
              <div className="col-span-5">
                <div className="text-sm text-gray-700 font-medium mb-3">通知元資料</div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">類型</label>
                      <input className={ADMIN_STYLES.input} value={form.type} disabled />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">等級</label>
                      <input className={ADMIN_STYLES.input} value={form.severity} disabled />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">來源</label>
                    <input className={ADMIN_STYLES.input} value={form.source} disabled />
                  </div>
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
                            <input className={ADMIN_STYLES.input} value={val || ''} disabled={isSystem} onChange={(e) => { const next = setByPath(previewCtx, v.path, e.target.value); setPreviewCtx(next); }} />
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
          <TabNavigation mode="controlled" activeKey={activeVarTab} onTabChange={(t) => setActiveVarTab(t.key)} layout="left" tabs={VARIABLE_CATEGORIES.map((c) => ({ key: c.key, label: c.label }))} className="px-2" />

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
                  <div className="flex items-center gap-2">
                    <button className={ADMIN_STYLES.btnGhost} onClick={() => insertAtCursor(titleRef, v.token)}>插入標題</button>
                    <button className={ADMIN_STYLES.primaryButton} onClick={() => insertAtCursor(bodyRef, v.token)}>插入內容</button>
                    <button className={ADMIN_STYLES.btnGhost} onClick={() => insertAtCursor(ctaLabelRef, v.token)}>插入 CTA 文</button>
                    <button className={ADMIN_STYLES.btnGhost} onClick={() => insertAtCursor(ctaUrlRef, v.token)}>插入 CTA 連結</button>
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

export default WebNotification;
