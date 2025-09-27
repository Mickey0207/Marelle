import React, { useMemo, useState } from 'react';
import { 
  UsersIcon, PlusIcon, PencilIcon, KeyIcon, TrashIcon, CheckCircleIcon, XCircleIcon, AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from '../../../lib/ui/adminStyles';
import StandardTable from '../../components/ui/StandardTable';
import GlassModal from '../../components/ui/GlassModal';
import SearchableSelect from '../../components/ui/SearchableSelect';
import IconActionButton from '../../components/ui/IconActionButton.jsx';
import { MODULE_OPTIONS, ROLE_PRESETS } from '../../../lib/data/admin/modules';
import { initialAdmins as INITIAL_ADMINS } from '../../../lib/data/admin/admins';

// 模擬資料移至 /data：模組、角色預設與管理員清單

const badge = (text, cls) => (
  <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${cls}`}>{text}</span>
);

const AdminManagement = () => {
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');

  // Modal 控制
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showPerms, setShowPerms] = useState(false);
  const [current, setCurrent] = useState(null); // 正在編輯/設定權限的管理員

  const filteredAdmins = useMemo(() => {
    return admins.filter(a => {
      const text = `${a.username} ${a.name} ${a.email}`.toLowerCase();
      const okText = text.includes(search.trim().toLowerCase());
      const okRole = roleFilter === '全部' || a.role === roleFilter;
      const okStatus = statusFilter === '全部' || a.status === statusFilter;
      return okText && okRole && okStatus;
    });
  }, [admins, search, roleFilter, statusFilter]);

  const getRowId = (row) => row.id;

  // 權限切換
  const toggleModule = (adminId, moduleKey, enabled) => {
    setAdmins(prev => prev.map(u => {
      if (u.id !== adminId) return u;
      const has = u.modules.includes(moduleKey);
      if (enabled && !has) return { ...u, modules: [...u.modules, moduleKey] };
      if (!enabled && has) return { ...u, modules: u.modules.filter(k => k !== moduleKey) };
      return u;
    }));
  };

  const setAllModules = (adminId, keys) => {
    setAdmins(prev => prev.map(u => u.id === adminId ? { ...u, modules: [...new Set(keys)] } : u));
  };

  const columns = [
    { key: 'username', label: '帳號', sortable: true, render: (v) => <span className="font-mono">{v}</span> },
    { key: 'name', label: '姓名', sortable: true, render: (v) => <span className="font-chinese font-medium">{v}</span> },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'role', label: '角色', sortable: true,
      render: (v) => {
        const map = {
          'Super Admin': 'bg-purple-100 text-purple-700',
          'Manager': 'bg-blue-100 text-blue-700',
          'Staff': 'bg-gray-100 text-gray-700'
        };
        return badge(v, map[v] || 'bg-gray-100 text-gray-700');
      }
    },
    { 
      key: 'status', label: '狀態', sortable: true,
      render: (v) => v === 'active' 
        ? badge('啟用中', 'bg-green-100 text-green-700') 
        : badge('停用', 'bg-red-100 text-red-700')
    },
    {
      key: 'modules', label: '模組', sortable: false,
      render: (value = [], row) => {
        const shown = value.slice(0, 3);
        const extra = value.length - shown.length;
        return (
          <div className="flex items-center flex-wrap gap-1">
            {shown.map((k) => {
              const m = MODULE_OPTIONS.find(x => x.key === k);
              return <span key={k} className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">{m?.label || k}</span>
            })}
            {extra > 0 && <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">+{extra}</span>}
          </div>
        );
      }
    },
    { key: 'lastLogin', label: '最後登入', sortable: true },
    {
      key: 'actions', label: '操作', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => { setCurrent(row); setShowEdit(true); }} />
          <IconActionButton Icon={AdjustmentsHorizontalIcon} label="權限設定" variant="blue" onClick={() => { setCurrent(row); setShowPerms(true); }} />
          <IconActionButton Icon={KeyIcon} label="重設密碼" variant="gray" />
        </div>
      )
    }
  ];

  // 子表格：每位管理員的模組權限（可快速切換）
  const getSubRows = (row) => MODULE_OPTIONS.map(m => ({ id: `${row.id}-${m.key}`, moduleKey: m.key, moduleLabel: m.label, granted: row.modules.includes(m.key) }));

  const subColumns = [
    { key: 'moduleLabel', label: '模組', sortable: true },
    { key: 'granted', label: '可用', sortable: true, render: (v, subRow, _idx, parent) => (
      <div className="flex items-center gap-2">
        {v ? badge('啟用', 'bg-green-100 text-green-700') : badge('停用', 'bg-gray-100 text-gray-700')}
        <button
          className={`${v ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'} p-1 rounded`}
          onClick={() => toggleModule(parent.id, subRow.moduleKey, !v)}
        >
          {v ? <XCircleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
        </button>
      </div>
    ) }
  ];

  const renderSubHeader = (row) => (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700 font-chinese">快速調整「{row.name}」的模組權限</div>
      <div className="flex items-center gap-2">
        <button className={ADMIN_STYLES.btnSecondary} onClick={() => setAllModules(row.id, [])}>清除</button>
        <button className={ADMIN_STYLES.btnSecondary} onClick={() => setAllModules(row.id, MODULE_OPTIONS.map(m => m.key))}>全選</button>
        <button className={ADMIN_STYLES.btnPrimary} onClick={() => setAllModules(row.id, ROLE_PRESETS[row.role] || [])}>依角色預設</button>
      </div>
    </div>
  );

  // 批次操作
  const batchActions = [
    { label: '批次啟用', onClick: (ids) => setAdmins(prev => prev.map(u => ids.includes(u.id) ? { ...u, status: 'active' } : u)) },
    { label: '批次停用', onClick: (ids) => setAdmins(prev => prev.map(u => ids.includes(u.id) ? { ...u, status: 'inactive' } : u)) },
    { label: '批次刪除', variant: 'danger', onClick: (ids) => setAdmins(prev => prev.filter(u => !ids.includes(u.id))) }
  ];

  // 建立管理員表單狀態
  const [createForm, setCreateForm] = useState({ username: '', name: '', email: '', password: '', role: 'Staff', modules: ROLE_PRESETS['Staff'] });
  const handleCreate = () => {
    if (!createForm.username || !createForm.email || !createForm.password) return;
    const id = `u${Date.now()}`;
    setAdmins(prev => [{
      id,
      username: createForm.username,
      name: createForm.name || createForm.username,
      email: createForm.email,
      role: createForm.role,
      status: 'active',
      lastLogin: '-',
      modules: [...new Set(createForm.modules)]
    }, ...prev]);
    setShowCreate(false);
    setCreateForm({ username: '', name: '', email: '', password: '', role: 'Staff', modules: ROLE_PRESETS['Staff'] });
  };

  // 編輯管理員
  const [editForm, setEditForm] = useState({ id: '', username: '', name: '', email: '', role: 'Staff', status: 'active' });
  const openEdit = (u) => {
    setEditForm({ id: u.id, username: u.username, name: u.name, email: u.email, role: u.role, status: u.status });
    setShowEdit(true);
  };
  const saveEdit = () => {
    setAdmins(prev => prev.map(u => u.id === editForm.id ? { ...u, username: editForm.username, name: editForm.name, email: editForm.email, role: editForm.role, status: editForm.status } : u));
    // 角色變更時可選：同步套用預設模組
    const preset = ROLE_PRESETS[editForm.role];
    if (preset) setAllModules(editForm.id, preset);
    setShowEdit(false);
  };

  // 權限設定 Modal
  const [permsDraft, setPermsDraft] = useState([]);
  const openPerms = (u) => {
    setCurrent(u);
    setPermsDraft(u.modules);
    setShowPerms(true);
  };
  const commitPerms = () => {
    if (!current) return;
    setAllModules(current.id, permsDraft);
    setShowPerms(false);
  };

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 text-amber-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 font-chinese">管理員管理</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className={ADMIN_STYLES.btnPrimary} onClick={() => setShowCreate(true)}>
              <span className="inline-flex items-center"><PlusIcon className="w-5 h-5 mr-2" />新增管理員</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`${ADMIN_STYLES.glassCard} mb-6`}>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">搜尋</label>
              <input className={ADMIN_STYLES.input} placeholder="帳號/姓名/Email"
                     value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">角色</label>
              <SearchableSelect
                options={['全部', 'Super Admin', 'Manager', 'Staff']}
                value={roleFilter}
                onChange={(val) => setRoleFilter(val)}
                placeholder="選擇角色"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">狀態</label>
              <SearchableSelect
                options={['全部', 'active', 'inactive']}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                placeholder="選擇狀態"
              />
            </div>
          </div>
        </div>

        {/* Admins table */}
        <StandardTable
          data={filteredAdmins}
          columns={columns}
          title="管理員清單"
          exportFileName="管理員清單"
          enableBatchSelection
          selectedItems={selectedIds}
          onSelectedItemsChange={setSelectedIds}
          batchActions={batchActions}
          getRowId={getRowId}
          enableRowExpansion
          getSubRows={(row) => getSubRows(row)}
          subColumns={subColumns}
          renderSubtableHeader={renderSubHeader}
          subtableClassName="rounded-lg"
        />

        {/* Create Admin Modal */}
        <GlassModal isOpen={showCreate} onClose={() => setShowCreate(false)} title="新增管理員" size="max-w-3xl">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">帳號</label>
                <input className={ADMIN_STYLES.input} value={createForm.username} onChange={(e) => setCreateForm(p => ({...p, username: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">姓名</label>
                <input className={ADMIN_STYLES.input} value={createForm.name} onChange={(e) => setCreateForm(p => ({...p, name: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">Email</label>
                <input className={ADMIN_STYLES.input} type="email" value={createForm.email} onChange={(e) => setCreateForm(p => ({...p, email: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">密碼</label>
                <input className={ADMIN_STYLES.input} type="password" value={createForm.password} onChange={(e) => setCreateForm(p => ({...p, password: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">角色</label>
                <SearchableSelect
                  options={['Super Admin','Manager','Staff']}
                  value={createForm.role}
                  onChange={(val) => setCreateForm(p => ({...p, role: val, modules: ROLE_PRESETS[val] || []}))}
                  placeholder="選擇角色"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold font-chinese">模組權限</h3>
                <div className="flex items-center gap-2">
                  <button className={ADMIN_STYLES.btnSecondary} onClick={() => setCreateForm(p => ({...p, modules: []}))}>清除</button>
                  <button className={ADMIN_STYLES.btnSecondary} onClick={() => setCreateForm(p => ({...p, modules: MODULE_OPTIONS.map(m => m.key)}))}>全選</button>
                  <button className={ADMIN_STYLES.btnPrimary} onClick={() => setCreateForm(p => ({...p, modules: ROLE_PRESETS[p.role] || []}))}>依角色預設</button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {MODULE_OPTIONS.map(m => {
                  const checked = createForm.modules.includes(m.key);
                  return (
                    <label key={m.key} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={checked} onChange={(e) => {
                        const on = e.target.checked;
                        setCreateForm(p => ({
                          ...p,
                          modules: on ? [...new Set([...p.modules, m.key])] : p.modules.filter(k => k !== m.key)
                        }));
                      }} />
                      <span>{m.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button className={ADMIN_STYLES.btnSecondary} onClick={() => setShowCreate(false)}>取消</button>
              <button className={ADMIN_STYLES.btnPrimary} onClick={handleCreate}>建立</button>
            </div>
          </div>
        </GlassModal>

        {/* Edit Admin Modal */}
        <GlassModal isOpen={showEdit} onClose={() => setShowEdit(false)} title="編輯管理員" size="max-w-2xl">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">帳號</label>
                <input className={ADMIN_STYLES.input} value={editForm.username} onChange={(e) => setEditForm(p => ({...p, username: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">姓名</label>
                <input className={ADMIN_STYLES.input} value={editForm.name} onChange={(e) => setEditForm(p => ({...p, name: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">Email</label>
                <input className={ADMIN_STYLES.input} type="email" value={editForm.email} onChange={(e) => setEditForm(p => ({...p, email: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">角色</label>
                <SearchableSelect
                  options={['Super Admin','Manager','Staff']}
                  value={editForm.role}
                  onChange={(val) => setEditForm(p => ({...p, role: val}))}
                  placeholder="選擇角色"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">狀態</label>
                <SearchableSelect
                  options={['active','inactive']}
                  value={editForm.status}
                  onChange={(val) => setEditForm(p => ({...p, status: val}))}
                  placeholder="選擇狀態"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button className={ADMIN_STYLES.btnSecondary} onClick={() => setShowEdit(false)}>取消</button>
              <button className={ADMIN_STYLES.btnPrimary} onClick={saveEdit}>儲存</button>
            </div>
          </div>
        </GlassModal>

        {/* Permissions Modal */}
        <GlassModal isOpen={showPerms} onClose={() => setShowPerms(false)} title="權限設定" size="max-w-3xl" contentMaxHeight="max-h-[calc(85vh-80px)]">
          <div className="p-6 space-y-4">
            {current && (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">為 <span className="font-bold">{current.name}</span> 調整模組權限</div>
                  <div className="flex items-center gap-2">
                    <button className={ADMIN_STYLES.btnSecondary} onClick={() => setPermsDraft([])}>清除</button>
                    <button className={ADMIN_STYLES.btnSecondary} onClick={() => setPermsDraft(MODULE_OPTIONS.map(m => m.key))}>全選</button>
                    <button className={ADMIN_STYLES.btnPrimary} onClick={() => setPermsDraft(ROLE_PRESETS[current.role] || [])}>依角色預設</button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {MODULE_OPTIONS.map(m => {
                    const checked = permsDraft.includes(m.key);
                    return (
                      <label key={m.key} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={checked} onChange={(e) => {
                          const on = e.target.checked;
                          setPermsDraft(p => on ? [...new Set([...p, m.key])] : p.filter(k => k !== m.key));
                        }} />
                        <span>{m.label}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="flex justify-end gap-3">
                  <button className={ADMIN_STYLES.btnSecondary} onClick={() => setShowPerms(false)}>取消</button>
                  <button className={ADMIN_STYLES.btnPrimary} onClick={commitPerms}>套用</button>
                </div>
              </>
            )}
          </div>
        </GlassModal>
      </div>
    </div>
  );
};

export default AdminManagement;
