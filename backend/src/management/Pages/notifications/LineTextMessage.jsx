import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';
import GlassModal from '../../components/ui/GlassModal';
import TabNavigation from '../../components/ui/TabNavigation';
import SearchableSelect from '../../components/ui/SearchableSelect';
import { VARIABLE_CATEGORIES, getVariableCatalog, buildSampleContext, renderTemplateWithContext } from '../../../lib/data/notifications/variables';
import { getPresetOptions, getPresetContext } from '../../../lib/data/notifications/presets';
import {
  getTemplates,
  searchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  publishTemplate,
} from '../../../lib/data/notifications/lineTextTemplateDataManager';

const LineTextMessage = () => {
  // 小元件：LINE 聊天預覽
  const LineChatPreview = ({ text = '', title = 'Marelle' }) => {
    const now = new Date();
    const ts = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const content = text?.trim() ? text : '（尚未輸入內容）';
    return (
      <div className="w-full">
        <div className="w-full max-w-md xl:max-w-lg rounded-2xl border border-gray-200 overflow-hidden bg-white shadow">
          {/* Header */}
          <div className="bg-[#06c755] text-white px-4 py-2 text-sm font-medium">{title}</div>
          {/* Messages */}
          <div className="bg-gray-100 p-3 space-y-2 min-h-[320px] lg:min-h-[360px] max-h-[480px] overflow-y-auto">
            {/* Outgoing bubble from brand (left) */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <div className="inline-block bg-white text-gray-900 px-3 py-2 rounded-2xl rounded-tl-sm shadow whitespace-pre-wrap max-w-[85%]">
                  {content}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">{ts}</div>
              </div>
            </div>
          </div>
          {/* Input bar (disabled) */}
          <div className="bg-white border-t border-gray-200 px-3 py-2 text-gray-400 text-sm">訊息輸入列（預覽）</div>
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
    content: '',
  });
  const [saving, setSaving] = useState(false);
  const contentRef = useRef(null);

  // Modal 與動作狀態
  const [showDelete, setShowDelete] = useState(false);
  const [showVarPicker, setShowVarPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // 預覽用 context（可切換與即時編輯）
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
  const sampleCtx = useMemo(() => buildSampleContext(), []);

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
    const content = form?.content || '';
    const re = /\{\{\s*([\w.]+)\s*\}\}/g;
    const set = new Set();
    let m;
    while ((m = re.exec(content))) {
      if (m[1]) set.add(m[1]);
    }
    return Array.from(set);
  }, [form?.content]);

  // 產生用於顯示的變數清單（帶 label、category、path 等）
  const usedVarEntries = useMemo(() => {
    if (!usedPaths.length) return [];
    return usedPaths.map((p) => {
      const found = flatCatalog.byPath[p];
      if (found) return found;
      // 不在 catalog 內的自訂變數，給予通用標籤
      const top = p.split('.')[0];
      return { label: p, token: `{{${p}}}`, desc: '', category: top, path: p };
    });
  }, [usedPaths, flatCatalog.byPath]);

  // 依 path 取值/寫值的工具
  const getByPath = (obj, path) => {
    return path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : ''), obj);
  };
  const setByPath = (obj, path, value) => {
    const segs = path.split('.');
    const clone = Array.isArray(obj) ? [...obj] : { ...obj };
    let cur = clone;
    for (let i = 0; i < segs.length; i++) {
      const key = segs[i];
      if (i === segs.length - 1) {
        cur[key] = value;
      } else {
        const next = cur[key];
        const isObj = next && typeof next === 'object' && !Array.isArray(next);
        cur[key] = isObj ? { ...next } : {};
        cur = cur[key];
      }
    }
    return clone;
  };

  // 根據欄位數與當前分頁自動調整 Modal 寬度
  const modalSize = useMemo(() => {
    const count = usedVarEntries.length;
    if (previewActiveTab === 'preview') {
      if (count <= 2) return 'max-w-4xl';
      if (count <= 8) return 'max-w-5xl';
      return 'max-w-6xl';
    }
    // context 分頁可更彈性
    if (count === 0) return 'max-w-xl';
    if (count <= 2) return 'max-w-2xl';
    if (count <= 6) return 'max-w-3xl';
    if (count <= 10) return 'max-w-4xl';
    return 'max-w-5xl';
  }, [previewActiveTab, usedVarEntries.length]);

  // 初次載入資料
  useEffect(() => {
    const items = getTemplates();
    setList(items);
    if (items.length) setSelectedId(items[0].id);
  }, []);

  const current = useMemo(() => list.find(t => t.id === selectedId) || null, [list, selectedId]);

  // 當前選擇變更時，同步編輯表單
  useEffect(() => {
    if (current) {
      setForm({
        name: current.name || '',
        category: current.category || '',
        description: current.description || '',
        tags: Array.isArray(current.tags) ? current.tags : [],
        content: current.content || '',
      });
    } else {
      setForm({ name: '', category: '', description: '', tags: [], content: '' });
    }
  }, [current?.id]);

  // 搜尋
  const filtered = useMemo(() => (keyword ? searchTemplates(keyword) : list), [keyword, list]);

  // 動作 handlers
  const handleCreate = () => {
    const item = createTemplate({ name: '新範本', description: '', content: '' });
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

  const handlePublish = (id) => {
    publishTemplate(id);
    setList(getTemplates());
  };

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

  const insertAtCursor = (txt) => {
    const el = contentRef.current;
    if (!el) {
      setForm((p) => ({ ...p, content: (p.content || '') + txt }));
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const before = form.content.slice(0, start);
    const after = form.content.slice(end);
    const next = `${before}${txt}${after}`;
    setForm((p) => ({ ...p, content: next }));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + txt.length;
      el.setSelectionRange(pos, pos);
    });
  };

  // 發送測試（僅接收者，其餘使用預覽 context）
  const [testForm, setTestForm] = useState({ recipient: '' });

  const handleSendTest = () => {
    setSending(true);
    setSendResult(null);
    const rendered = renderTemplateWithContext(form.content, previewCtx);
    setTimeout(() => {
      setSending(false);
      setSendResult({ success: true, message: '測試訊息已模擬送出', rendered });
    }, 700);
  };

  // 預覽情境：預設選項
  const previewPresets = getPresetOptions();

  const applyPreviewPreset = (key) => {
    setPreviewCtx(getPresetContext(key));
  };

  // 開啟預覽時刷新 now 等動態欄位
  useEffect(() => {
    if (showPreview) {
      applyPreviewPreset(previewPreset || 'default');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview]);

  return (
    <div className={`${ADMIN_STYLES.pageContainer}`}>
      <div className={`${ADMIN_STYLES.contentContainer}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={ADMIN_STYLES.pageTitle}>Line 一般訊息</h1>
            <p className={ADMIN_STYLES.pageSubtitle}>集中管理 Line 純文字訊息範本</p>
          </div>
          <div className="flex items-center gap-2">
            <button className={ADMIN_STYLES.secondaryButton} onClick={() => current && handleDuplicate(current.id)}>複製範本</button>
            <button className={ADMIN_STYLES.primaryButton} onClick={handleCreate}>新增範本</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：清單（lg: 1 欄） */}
          <div className="lg:col-span-1">
            <div className={`${ADMIN_STYLES.glassCard} space-y-4`}>
              <div className="flex gap-3">
                <input
                  placeholder="搜尋名稱、描述、分類、標籤"
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
                      <div>
                        <div className="font-medium text-gray-900 font-chinese">{t.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{t.description || '—'}</div>
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

          {/* 右側：編輯器（lg: 2 欄） */}
          <div className="lg:col-span-2">
            <div className={`${ADMIN_STYLES.glassCard} space-y-6`}>
              {!current ? (
                <div className="text-gray-500">請先在左側選擇或新增一個範本</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">範本名稱</label>
                      <input className={ADMIN_STYLES.input} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">分類</label>
                      <SearchableSelect
                        options={categories}
                        value={form.category}
                        onChange={(v) => setForm((p) => ({ ...p, category: v }))}
                        placeholder="選擇分類"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">描述</label>
                    <input className={ADMIN_STYLES.input} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-chinese mb-1">標籤</label>
                    <SearchableSelect
                      options={tagOptions}
                      value={form.tags}
                      onChange={(v) => setForm((p) => ({ ...p, tags: v }))}
                      multiple={true}
                      placeholder="新增或選擇標籤"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 gap-3">
                      <label className="block text-sm font-medium text-gray-700 font-chinese">內容</label>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500 hidden sm:block">可用變數：{'{{user.name}}'}, {'{{order.number}}'}, {'{{shipment.tracking}}'}</div>
                        <button className={ADMIN_STYLES.btnGhost} onClick={() => setShowVarPicker(true)}>插入變數</button>
                      </div>
                    </div>
                    <textarea
                      ref={contentRef}
                      className={`${ADMIN_STYLES.input} min-h-[160px]`}
                      value={form.content}
                      onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                      placeholder="輸入要發送的純文字內容"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-gray-500">
                      上次修改：{current.updatedAt ? new Date(current.updatedAt).toLocaleString() : '—'}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={ADMIN_STYLES.btnSecondary} onClick={() => setShowDelete(true)}>刪除</button>
                      {current.status !== 'published' && (
                        <button className={ADMIN_STYLES.btnGhost} onClick={() => handlePublish(current.id)}>發佈</button>
                      )}
                      <button className={ADMIN_STYLES.btnGhost} onClick={() => setShowPreview(true)}>預覽</button>
                      <button className={`${ADMIN_STYLES.btnPrimary} ${saving ? 'opacity-70 pointer-events-none' : ''}`} onClick={handleSave}>
                        {saving ? '儲存中…' : '儲存變更'}
                      </button>
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
            tabs={[
              { key: 'preview', label: '預覽與發送' },
              { key: 'context', label: '情境與欄位' },
            ]}
          />

          {previewActiveTab === 'preview' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <div className="xl:col-span-6">
                <LineChatPreview text={renderTemplateWithContext(form.content, previewCtx)} title="Marelle" />
              </div>
              <div className="xl:col-span-6">
                <div className="text-sm text-gray-700 font-medium mb-3">發送測試</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">測試接收者（名稱或 UserId）</label>
                    <input className={ADMIN_STYLES.input} value={testForm.recipient} onChange={(e) => setTestForm((p) => ({ ...p, recipient: e.target.value }))} placeholder="例如：王小明 或 Uxxxxxxxx" />
                  </div>
                  <div className="text-xs text-gray-500">不會真正送到 LINE，只做本地模擬</div>
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
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <div className="xl:col-span-12">
                <div className="text-sm text-gray-700 font-medium mb-3">情境與欄位</div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">快速切換情境</label>
                    <SearchableSelect
                      options={previewPresets}
                      value={previewPreset}
                      onChange={(val) => { setPreviewPreset(val); applyPreviewPreset(val); }}
                      placeholder="選擇情境"
                    />
                  </div>

                  {usedVarEntries.length === 0 ? (
                    <div className="text-xs text-gray-500">此範本未插入任何變數，無需調整欄位。</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              onChange={(e) => {
                                const next = setByPath(previewCtx, v.path, e.target.value);
                                setPreviewCtx(next);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">更改會即時反映於預覽分頁</div>
                    <div className="flex items-center gap-2">
                      <button
                        className={ADMIN_STYLES.secondaryButton}
                        onClick={() => { setPreviewPreset('default'); applyPreviewPreset('default'); }}
                      >重置</button>
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
            <input
              value={varSearch}
              onChange={(e) => setVarSearch(e.target.value)}
              placeholder="搜尋變數關鍵字…"
              className={`${ADMIN_STYLES.input}`}
            />
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto px-1">
            {(variableCatalog[activeVarTab] || [])
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
                  <button className={ADMIN_STYLES.primaryButton} onClick={() => insertAtCursor(v.token)}>插入</button>
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

export default LineTextMessage;
