import React, { useEffect, useState, useMemo } from 'react';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import StandardTable from '../../components/ui/StandardTable';
import GlassModal from '../../components/ui/GlassModal';
import IconActionButton from '../../components/ui/IconActionButton';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import coaManager from '../../../../external_mock/accounting/chartOfAccountsManager';
import SearchableSelect from '../../components/ui/SearchableSelect';

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [autos, setAutos] = useState([]);
  const [autoEditOpen, setAutoEditOpen] = useState(false);
  const [autoEditing, setAutoEditing] = useState(null);
  const [autoForm, setAutoForm] = useState({ id:'', name:'', eventKey:'', active:true, lines:[] });
  const [autoModalReady, setAutoModalReady] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ code:'', name:'', type:'資產', normal:'借', active:true });
  const [editing, setEditing] = useState(null);

  const refresh = () => {
    setAccounts(coaManager.listAccounts());
    setAutos(coaManager.listAutomations());
  };

  useEffect(() => { refresh(); }, []);

  // 避免模態框開啟動畫影響下拉選單的定位（等待動畫結束再渲染選單）
  useEffect(() => {
    if (autoEditOpen) {
      const t = setTimeout(() => setAutoModalReady(true), 250);
      return () => { clearTimeout(t); setAutoModalReady(false); };
    }
    setAutoModalReady(false);
  }, [autoEditOpen]);

  // Split accounts by normal balance: 借 / 貸
  const debitAccounts = useMemo(() => accounts.filter(a => a.normal === '借'), [accounts]);
  const creditAccounts = useMemo(() => accounts.filter(a => a.normal === '貸'), [accounts]);

  // 可選事件與對應金額來源
  const EVENT_OPTIONS = useMemo(() => ['訂單建立','訂單收款','訂單退款'], []);
  const AMOUNT_SOURCE_OPTIONS = useMemo(() => ({
    '訂單建立': ['訂單含稅總額', '銷貨收入（未稅-折扣）', '銷貨成本'],
    '訂單收款': ['收款金額'],
    '訂單退款': ['退款總額'],
  }), []);
  const SIDE_OPTIONS = useMemo(() => ['借','貸'], []);
  const accountCodeOptions = useMemo(() => accounts.map(a => ({ value: a.code, label: `${a.code} - ${a.name}` })), [accounts]);

  const accountColumns = useMemo(() => ([
    { key: 'code', label: '代碼', sortable: true, render: (v) => <span className="font-mono text-sm">{v}</span> },
    { key: 'name', label: '名稱', sortable: true },
    { key: 'type', label: '類別', sortable: true },
    { key: 'normal', label: '正常餘額', sortable: true },
    { key: 'active', label: '狀態', sortable: true, render: (v)=> (
      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${v? 'bg-green-100 text-green-800':'bg-gray-100 text-gray-700'}`}>{v? '啟用':'停用'}</span>
    ) },
    { key: 'actions', label: '操作', sortable: false, render: (_v, r) => (
      <div className="flex items-center gap-2">
        <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => { setEditing(r); setForm(r); setEditOpen(true); }} />
        <IconActionButton Icon={TrashIcon} label="刪除" variant="red" onClick={() => { coaManager.deleteAccount(r.code); refresh(); }} />
      </div>
    ) },
  ]), []);

  const autoColumns = useMemo(() => ([
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: '名稱', sortable: true },
    { key: 'eventKey', label: '事件鍵', sortable: true },
    { key: 'active', label: '啟用', sortable: true, render: (v)=> (
      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${v? 'bg-green-100 text-green-800':'bg-gray-100 text-gray-700'}`}>{v? '啟用':'停用'}</span>
    ) },
    { key: 'actions', label: '操作', sortable: false, render: (_v, r) => (
      <div className="flex items-center gap-2">
        <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => { setAutoEditing(r); setAutoForm(r); setAutoEditOpen(true); }} />
        <IconActionButton Icon={TrashIcon} label="刪除" variant="red" onClick={() => { coaManager.deleteAutomation(r.id); refresh(); }} />
      </div>
    ) },
  ]), []);

  const autoSubColumns = useMemo(() => ([
    { key: 'accountCode', label: '科目代碼', sortable: true },
    { key: 'accountName', label: '科目名稱', sortable: true, render: (_v, r) => coaManager.getAccountByCode(r.accountCode)?.name || '' },
    { key: 'side', label: '借/貸', sortable: true },
    { key: 'amountSource', label: '金額來源', sortable: true },
    { key: 'note', label: '說明', sortable: false },
  ]), []);

  const onSave = () => {
    if (editing) {
      coaManager.updateAccount(editing.code, form);
    } else {
      const res = coaManager.createAccount(form);
      if (!res.success) {
        alert(res.message || '新增失敗');
      }
    }
    setEditOpen(false);
    setEditing(null);
    setForm({ code:'', name:'', type:'資產', normal:'借', active:true });
    refresh();
  };

  const onSaveAutomation = () => {
    if (!autoForm.id) {
      alert('請輸入規則 ID');
      return;
    }
    coaManager.upsertAutomation(autoForm);
    setAutoEditOpen(false);
    setAutoEditing(null);
    setAutoForm({ id:'', name:'', eventKey:'', active:true, lines:[] });
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2]">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 font-chinese">會計科目</h1>
          <button
            className="inline-flex items-center px-6 py-3 bg-[#cc824d] text-white font-medium rounded-lg hover:bg-[#b86c37] transition-all duration-200 shadow-md hover:shadow-lg font-chinese"
            onClick={() => { setEditing(null); setForm({ code:'', name:'', type:'資產', normal:'借', active:true }); setEditOpen(true); }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />新增科目
          </button>
        </div>

        {/* 科目清單：兩欄式（左：借記、右：貸記） */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
            <StandardTable
              title="借記表格"
              data={debitAccounts}
              columns={accountColumns}
              exportFileName="借記科目"
            />
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
            <StandardTable
              title="貸記表格"
              data={creditAccounts}
              columns={accountColumns}
              exportFileName="貸記科目"
            />
          </div>
        </div>

        {/* 自動化規則清單（展開顯示分錄） */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 font-chinese">日記帳自動化規則</h2>
            <button
              className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white text-sm rounded-lg hover:bg-[#b86c37] transition-all duration-200 shadow-sm font-chinese"
              onClick={() => { setAutoEditing(null); setAutoForm({ id:'', name:'', eventKey:'', active:true, lines:[] }); setAutoEditOpen(true); }}
            >
              <PlusIcon className="w-4 h-4 mr-1" />新增規則
            </button>
          </div>
          <StandardTable
            title=""
            data={autos}
            columns={autoColumns}
            exportFileName="自動化規則"
            enableRowExpansion
            getSubRows={(row)=> row.lines || []}
            subColumns={autoSubColumns}
            renderSubtableHeader={(row)=> (
              <div className="text-sm text-gray-600">{row.name}（{row.eventKey}）的分錄設定</div>
            )}
          />
        </div>
      </div>

      {/* 新增/編輯 科目 */}
      <GlassModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title={editing ? '編輯科目' : '新增科目'}
        size="max-w-xl"
        maxHeight="max-h-[80vh]"
        contentMaxHeight="max-h-[calc(80vh-80px)]"
      >
        <div className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">代碼</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.code} onChange={e=>setForm(f=>({ ...f, code:e.target.value }))} disabled={!!editing} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">名稱</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.name} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">類別</label>
              <SearchableSelect
                options={coaManager.TYPES}
                value={form.type}
                onChange={(val)=> setForm(f=>({ ...f, type: val }))}
                placeholder="選擇類別"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">正常餘額</label>
              <SearchableSelect
                options={coaManager.NORMAL}
                value={form.normal}
                onChange={(val)=> setForm(f=>({ ...f, normal: val }))}
                placeholder="選擇正常餘額"
              />
            </div>
            <div className="col-span-2">
              <label className="inline-flex items-center text-sm text-gray-700">
                <input type="checkbox" className="mr-2" checked={!!form.active} onChange={e=>setForm(f=>({ ...f, active:e.target.checked }))} />啟用
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={()=>setEditOpen(false)}>取消</button>
            <button className="px-4 py-2 rounded-lg bg-[#cc824d] text-white hover:bg-[#b86c37]" onClick={onSave}>儲存</button>
          </div>
        </div>
      </GlassModal>

      {/* 新增/編輯 自動化規則 */}
      <GlassModal
        isOpen={autoEditOpen}
        onClose={() => setAutoEditOpen(false)}
        title={autoEditing ? '編輯自動化規則' : '新增自動化規則'}
        size="max-w-3xl"
        maxHeight="max-h-[80vh]"
        contentMaxHeight="max-h-[calc(80vh-80px)]"
      >
        <div className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">規則 ID</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={autoForm.id} onChange={e=>setAutoForm(f=>({ ...f, id:e.target.value }))} disabled={!!autoEditing} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">名稱</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={autoForm.name} onChange={e=>setAutoForm(f=>({ ...f, name:e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">事件鍵（選取）</label>
              {autoModalReady ? (
                <SearchableSelect
                  options={EVENT_OPTIONS}
                  value={autoForm.eventKey}
                  onChange={(val)=> setAutoForm(f=>({ ...f, eventKey: val, lines: (f.lines||[]).map(ln => ({ ...ln, amountSource: '' })) }))}
                  placeholder="請選擇事件"
                  allowClear
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 select-none">請選擇事件</div>
              )}
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center text-sm text-gray-700">
                <input type="checkbox" className="mr-2" checked={!!autoForm.active} onChange={e=>setAutoForm(f=>({ ...f, active:e.target.checked }))} />啟用
              </label>
            </div>
          </div>

          {/* 分錄明細編輯（簡化：以表格方式呈現，可增刪列） */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 font-medium">分錄明細</div>
              <button className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200" onClick={() => setAutoForm(f => ({ ...f, lines:[...(f.lines||[]), { accountCode:'', side:'借', amountSource:'', note:'' }] }))}>新增一列</button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">科目代碼</th>
                    <th className="px-3 py-2 text-left">借/貸</th>
                    <th className="px-3 py-2 text-left">金額來源（選取）</th>
                    <th className="px-3 py-2 text-left">說明</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {(autoForm.lines||[]).map((ln, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-3 py-1.5">
                        {autoModalReady ? (
                          <SearchableSelect
                            options={accountCodeOptions}
                            value={ln.accountCode || ''}
                            onChange={(val)=>{
                              setAutoForm(f=>{ const lines=[...f.lines]; lines[idx]={...lines[idx], accountCode:val}; return { ...f, lines }; });
                            }}
                            placeholder="選擇科目"
                            allowClear
                          />
                        ) : (
                          <div className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50 text-gray-400 select-none">選擇科目</div>
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        {autoModalReady ? (
                          <SearchableSelect
                            options={SIDE_OPTIONS}
                            value={ln.side || ''}
                            onChange={(val)=>{
                              setAutoForm(f=>{ const lines=[...f.lines]; lines[idx]={...lines[idx], side:val}; return { ...f, lines }; });
                            }}
                            placeholder="選擇借/貸"
                          />
                        ) : (
                          <div className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50 text-gray-400 select-none">選擇借/貸</div>
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        {autoModalReady ? (() => {
                          const opts = AMOUNT_SOURCE_OPTIONS[autoForm.eventKey] || [];
                          const withFallback = (ln.amountSource && !opts.includes(ln.amountSource)) ? [...opts, ln.amountSource] : opts;
                          return (
                            <SearchableSelect
                              options={withFallback}
                              value={ln.amountSource || ''}
                              onChange={(val)=>{
                                setAutoForm(f=>{ const lines=[...f.lines]; lines[idx]={...lines[idx], amountSource:val}; return { ...f, lines }; });
                              }}
                              placeholder="選擇金額來源"
                              allowClear
                            />
                          );
                        })() : (
                          <div className="w-full px-2 py-1 border border-gray-200 rounded bg-gray-50 text-gray-400 select-none">選擇金額來源</div>
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        <input className="w-full px-2 py-1 border border-gray-300 rounded" value={ln.note||''} onChange={e=>{
                          const v = e.target.value; setAutoForm(f=>{ const lines=[...f.lines]; lines[idx]={...lines[idx], note:v}; return { ...f, lines }; });
                        }} />
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        <button className="text-xs text-red-600 hover:underline" onClick={() => setAutoForm(f => ({ ...f, lines: (f.lines||[]).filter((_,i)=> i!==idx) }))}>刪除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={()=>setAutoEditOpen(false)}>取消</button>
            <button className="px-4 py-2 rounded-lg bg-[#cc824d] text-white hover:bg-[#b86c37]" onClick={onSaveAutomation}>儲存</button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
