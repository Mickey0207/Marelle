import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import GlassModal from '../../components/ui/GlassModal';
import SearchableSelect from '../../components/ui/SearchableSelect';
import TabNavigation from '../../components/ui/TabNavigation';
import FlexRenderer from '../../components/notifications/FlexRenderer';
import { VARIABLE_CATEGORIES, getVariableCatalog, buildSampleContext, renderTemplateWithContext } from '../../../../external_mock/notifications/variables';
import { getPresetOptions, getPresetContext } from '../../../../external_mock/notifications/presets';
import {
  getTemplates,
  searchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  publishTemplate,
} from '../../../../external_mock/notifications/lineFlexTemplateDataManager';

const LineFlexMessage = () => {
  // 左側清單狀態
  const [keyword, setKeyword] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [list, setList] = useState([]);

  // 右側編輯狀態
  const [form, setForm] = useState({ name: '', category: '', description: '', tags: [], content: '' });
  const [saving, setSaving] = useState(false);
  const contentRef = useRef(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showVarPicker, setShowVarPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [testForm, setTestForm] = useState({ recipient: '' });

  // 變數插入器與預覽情境
  const [activeVarTab, setActiveVarTab] = useState(VARIABLE_CATEGORIES[0].key);
  const [varSearch, setVarSearch] = useState('');
  const variableCatalog = useMemo(() => getVariableCatalog(), []);
  const [previewCtx, setPreviewCtx] = useState(() => buildSampleContext());
  const _sampleCtx = useMemo(() => buildSampleContext(), []);
  const [previewPreset, setPreviewPreset] = useState('default');
  const [previewActiveTab, setPreviewActiveTab] = useState('preview');

  // 初次載入
  useEffect(() => {
    const items = getTemplates();
    setList(items);
    if (items.length) setSelectedId(items[0].id);
  }, []);

  const current = useMemo(() => list.find(t => t.id === selectedId) || null, [list, selectedId]);

  // 同步右側表單
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
  }, [current]);

  // 搜尋
  const filtered = useMemo(() => (keyword ? searchTemplates(keyword) : list), [keyword, list]);
  // 類別與標籤選項
  const categories = useMemo(() => {
    const set = new Set();
    list.forEach((t) => { if (t.category) set.add(t.category); });
    return Array.from(set).map((v) => ({ label: v, value: v }));
  }, [list]);

  const tagOptions = useMemo(() => {
    const set = new Set();
    list.forEach((t) => (t.tags || []).forEach((tag) => set.add(tag)));
    return Array.from(set).map((v) => ({ label: v, value: v }));
  }, [list]);

  // 預覽渲染：將變數套入 JSON 字串並解析
  const renderedJsonText = useMemo(() => {
    try {
      return renderTemplateWithContext(form.content || '', previewCtx || {});
    } catch {
      return form.content || '';
    }
  }, [form.content, previewCtx]);

  const { parsed, jsonError } = useMemo(() => {
    try {
      const data = JSON.parse(renderedJsonText || '{}');
      return { parsed: data, jsonError: null };
    } catch (e) {
      return { parsed: null, jsonError: e.message };
    }
  }, [renderedJsonText]);

  // 快速情境
  const previewPresets = useMemo(() => getPresetOptions(), []);
  const applyPreviewPreset = (key) => {
    const ctx = getPresetContext(key, _sampleCtx);
    if (ctx) setPreviewCtx(ctx);
  };

  // 工具：依路徑讀/寫
  const getByPath = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
  const setByPath = (obj, path, value) => {
    const parts = path.split('.');
    const next = { ...(obj || {}) };
    let cur = next;
    parts.forEach((p, idx) => {
      if (idx === parts.length - 1) {
        cur[p] = value;
      } else {
        cur[p] = typeof cur[p] === 'object' && cur[p] !== null ? { ...cur[p] } : {};
        cur = cur[p];
      }
    });
    return next;
  };

  // 插入變數至游標處
  const insertAtCursor = (text) => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);
    const next = before + text + after;
    setForm((p) => ({ ...p, content: next }));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    });
  };

  // 動作 handlers
  const reloadList = () => setList(getTemplates());

  const handleCreate = () => {
    const t = createTemplate();
    reloadList();
    setSelectedId(t.id);
  };

  const handleDuplicate = (id) => {
    if (!id) return;
    duplicateTemplate(id);
    reloadList();
  };

  const handleSave = async () => {
    if (!current) return;
    setSaving(true);
    try {
      updateTemplate(current.id, {
        name: form.name,
        category: form.category,
        description: form.description,
        tags: form.tags,
        content: form.content,
      });
      reloadList();
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = (id) => {
    if (!id) return;
    publishTemplate(id);
    reloadList();
  };

  const handleDelete = () => {
    if (!current) return;
    deleteTemplate(current.id);
    reloadList();
    setSelectedId(null);
    setShowDelete(false);
  };
  // 從模板擷取變數
  const usedPaths = useMemo(() => {
    const content = form?.content || '';
    const re = /\{\{\s*([\w.]+)\s*\}\}/g;
    const set = new Set();
    let m;
    while ((m = re.exec(content))) { if (m[1]) set.add(m[1]); }
    return Array.from(set);
  }, [form?.content]);

  const usedVarEntries = useMemo(() => {
    if (!usedPaths.length) return [];
    const items = variableCatalog;
    const flat = [];
    Object.entries(items).forEach(([category, arr]) => {
      (arr || []).forEach((it) => {
        const path = (it.token || '').replace(/\{\{|\}\}/g, '').trim();
        flat.push({ ...it, category, path });
      });
    });
    const byPath = Object.fromEntries(flat.map((i) => [i.path, i]));
    return usedPaths.map((p) => byPath[p] || { label: p, token: `{{${p}}}`, desc: '', category: p.split('.')[0], path: p });
  }, [usedPaths, variableCatalog]);

  // 依變數數量計算預覽 Modal 寬度
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

  // 測試發送（模擬）
  const handleSendTest = () => {
    setSending(true);
    setSendResult(null);
    setTimeout(() => {
      setSending(false);
      setSendResult({ success: true, message: '測試 Flex 訊息已模擬送出' });
    }, 700);
  };

  return (
    <div className={`${ADMIN_STYLES.pageContainer}`}>
      <div className={`${ADMIN_STYLES.contentContainer}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={ADMIN_STYLES.pageTitle}>Line Flex 訊息</h1>
            <p className={ADMIN_STYLES.pageSubtitle}>建立、管理並預覽 LINE Flex Message。可貼上 Flex Simulator 匯出的 JSON 以預覽。</p>
          </div>
          <div className="flex items-center gap-2">
            <button className={ADMIN_STYLES.secondaryButton} onClick={() => current && handleDuplicate(current.id)}>複製範本</button>
            <button className={ADMIN_STYLES.primaryButton} onClick={handleCreate}>新增範本</button>
          </div>
        </div>
        {/* 主內容：左清單 + 右表單（主頁無預覽） */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* 左側：清單 */}
          <div className="col-span-1">
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
                {filtered.length === 0 && <div className="p-4 text-gray-500">沒有符合的範本</div>}
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

          {/* 右側：表單 + JSON 編輯器（無預覽，預覽集中在 Modal） */}
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
                      <label className="block text-sm font-medium text-gray-700 font-chinese">Flex JSON</label>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">可直接貼上 Flex Simulator 匯出的 JSON</div>
                        <button className={ADMIN_STYLES.btnGhost} onClick={() => setShowVarPicker(true)}>插入變數</button>
                      </div>
                    </div>
                    <textarea
                      ref={contentRef}
                      className={`${ADMIN_STYLES.input} min-h-[420px] font-mono`}
                      value={form.content}
                      onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                      placeholder="貼上從 LINE Flex Simulator 匯出的 JSON"
                    />
                    {jsonError && <div className="mt-2 text-sm text-red-600">JSON 解析錯誤：{jsonError}</div>}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-gray-500">上次修改：{current.updatedAt ? new Date(current.updatedAt).toLocaleString() : '—'}</div>
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
        <div className="space-y-4 p-6 pt-0">
          <p className="text-gray-600">確定要刪除「{current?.name}」嗎？此動作無法復原。</p>
          <div className="flex justify-end gap-2">
            <button className={ADMIN_STYLES.secondaryButton} onClick={() => setShowDelete(false)}>取消</button>
            <button className={ADMIN_STYLES.primaryButton} onClick={handleDelete}>確定刪除</button>
          </div>
        </div>
  </GlassModal>

      {/* 預覽（含子頁籤） */}
      <GlassModal isOpen={showPreview} onClose={() => setShowPreview(false)} title="預覽" size={modalSize}>
        <div className="space-y-6 p-6 pt-0">
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
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-6">
                <FlexRenderer data={parsed} title={form.name || 'Marelle'} />
              </div>
              <div className="col-span-6">
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
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-12">
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
        <div className="space-y-4 p-6 pt-0">
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

export default LineFlexMessage;
