import React, { useEffect, useMemo, useState } from 'react';
import { CalculatorIcon, EyeIcon, PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import StandardTable from '../../components/ui/StandardTable';
import accountingDataManager from '../../../../external_mock/accounting/accountingDataManager';
import GlassModal from '../../components/ui/GlassModal';
import { ADMIN_STYLES } from '../../Style/adminStyles';
import IconActionButton from '../../components/ui/IconActionButton';
import SearchableSelect from '../../components/ui/SearchableSelect';

const money = (n) => `NT$ ${Number(n || 0).toLocaleString()}`;
const statusLabel = (s) => ({
  draft: '草稿',
  submitted: '已送審',
  approved: '已核准',
  paid: '已付款',
  void: '作廢',
}[s] || s);

export default function AccountingManagement() {
  const [rows, setRows] = useState([]);
  const [detail, setDetail] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    docNo: '',
    type: '',
    date: '',
    partner: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'draft',
    note: '',
  });

  useEffect(() => {
    (async () => {
      const res = await accountingDataManager.list();
      if (res.success) setRows(res.data);
    })();
  }, []);

  // 狀態下拉選單（中文顯示、代碼儲存）
  const statusOptions = useMemo(() => (
    (accountingDataManager.STATUSES || []).map(s => ({ value: s, label: statusLabel(s) }))
  ), []);

  const columns = useMemo(() => ([
    { key: 'docNo', label: '單據編號', sortable: true, render: (v) => <span className="font-mono text-sm">{v}</span> },
    { key: 'type', label: '類型', sortable: true },
    { key: 'date', label: '日期', sortable: true },
    { key: 'partner', label: '往來對象', sortable: true },
    { key: 'subtotal', label: '未稅', sortable: true, render: (v) => <span>{money(v)}</span> },
    { key: 'tax', label: '稅額', sortable: true, render: (v) => <span>{money(v)}</span> },
    { key: 'total', label: '含稅', sortable: true, render: (v) => <strong>{money(v)}</strong> },
    { key: 'status', label: '狀態', sortable: true, render: (v) => (
      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-chinese ${
        v==='approved' ? 'bg-green-100 text-green-800' : v==='submitted' ? 'bg-blue-100 text-blue-800' : v==='paid' ? 'bg-purple-100 text-purple-800' : v==='void' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
      }`}>{statusLabel(v)}</span>
    ) },
    { key: 'actions', label: '操作', sortable: false, render: (_v, r) => (
      <div className="flex items-center gap-2">
  <IconActionButton Icon={EyeIcon} label="查看" variant="blue" onClick={() => { setEditOpen(false); setDetail(r); }} />
        <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => { setDetail(null); setEditing(r); setForm({ ...r }); setEditOpen(true); }} />
      </div>
    )},
  ]), []);

  return (
    <div className="min-h-screen bg-[#fdf8f2]">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalculatorIcon className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-bold text-gray-800 font-chinese">會計管理</h1>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 bg-[#cc824d] text-white text-sm rounded-lg hover:bg-[#b86c37] transition-all duration-200 shadow-sm font-chinese"
            onClick={() => { setDetail(null); setEditing(null); setForm({ docNo:'', type: accountingDataManager.TYPES?.[0] || '', date: '', partner:'', subtotal:0, tax:0, total:0, status:'draft', note:'' }); setEditOpen(true); }}
          >
            <PlusIcon className="w-4 h-4 mr-1" />新增日記帳
          </button>
        </div>

        <StandardTable title="單據列表" data={rows} columns={columns} exportFileName="會計單據" />

        <GlassModal isOpen={!!detail} onClose={() => setDetail(null)} title={`單據詳情：${detail?.docNo}`} size="max-w-3xl">
          {detail && (
            <div className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">類型</div><div className="text-sm mt-1">{detail.type}</div></div>
                <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">日期</div><div className="text-sm mt-1">{detail.date}</div></div>
                <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">往來對象</div><div className="text-sm mt-1">{detail.partner}</div></div>
                <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">狀態</div><div className="mt-1 inline-flex px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">{statusLabel(detail.status)}</div></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">未稅</div><div className="text-sm mt-1">{money(detail.subtotal)}</div></div>
                <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">稅額</div><div className="text-sm mt-1">{money(detail.tax)}</div></div>
                <div className="glass rounded-lg p-3"><div className="text-xs text-gray-500">含稅</div><div className="text-sm font-semibold mt-1">{money(detail.total)}</div></div>
              </div>
            </div>
          )}
        </GlassModal>

        {/* 新增/編輯 日記帳（移到詳情 Modal 外） */}
        <GlassModal isOpen={editOpen} onClose={() => setEditOpen(false)} title={editing ? '編輯日記帳' : '新增日記帳'} size="max-w-3xl">
          <div className="p-6 pt-0 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">單據編號</label>
                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.docNo||''} onChange={e=>setForm(f=>({ ...f, docNo:e.target.value }))} placeholder="留空自動產生" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">類型</label>
                <SearchableSelect options={accountingDataManager.TYPES || []} value={form.type||''} onChange={(val)=>setForm(f=>({ ...f, type: val }))} placeholder="選擇類型" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">日期</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.date||''} onChange={e=>setForm(f=>({ ...f, date:e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">往來對象</label>
                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.partner||''} onChange={e=>setForm(f=>({ ...f, partner:e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">未稅</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.subtotal||0} onChange={e=>{
                  const v = Number(e.target.value||0); const tax = Math.round(v*0.05); setForm(f=>({ ...f, subtotal:v, tax, total: v+tax }));
                }} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">稅額</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.tax||0} onChange={e=>{
                  const v = Number(e.target.value||0); setForm(f=>({ ...f, tax:v, total: (Number(f.subtotal||0)+v) }));
                }} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">含稅</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={form.total||0} onChange={e=>{
                  const v = Number(e.target.value||0); setForm(f=>({ ...f, total:v }));
                }} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">狀態</label>
                <SearchableSelect options={statusOptions} value={form.status||'draft'} onChange={(val)=>setForm(f=>({ ...f, status: val }))} placeholder="選擇狀態" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-700 mb-1">備註</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} value={form.note||''} onChange={e=>setForm(f=>({ ...f, note:e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={()=>setEditOpen(false)}>取消</button>
              <button className="px-4 py-2 rounded-lg bg-[#cc824d] text-white hover:bg-[#b86c37]" onClick={async()=>{
                if (editing) {
                  const res = await accountingDataManager.update(editing.id, form); if (res?.success) { setRows(r=> r.map(x=> x.id===editing.id? res.data : x)); }
                } else {
                  const res = await accountingDataManager.create(form); if (res?.success) { setRows(r=> [res.data, ...r]); }
                }
                setEditOpen(false); setEditing(null);
              }}>儲存</button>
            </div>
          </div>
        </GlassModal>
      </div>
    </div>
  );
}
