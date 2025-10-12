import React, { useMemo, useState } from 'react';
import { 
  UsersIcon, PlusIcon, PencilIcon, KeyIcon
} from '@heroicons/react/24/outline';
import { ADMIN_STYLES } from '../../Style/adminStyles.js';
import StandardTable from '../../components/ui/StandardTable';
import GlassModal from '../../components/ui/GlassModal';
import SearchableSelect from '../../components/ui/SearchableSelect';
import IconActionButton from '../../components/ui/IconActionButton.jsx';
import { listAdmins as apiListAdmins, updateAdmin as apiUpdateAdmin, listRoles as apiListRoles, getRoleModules as apiGetRoleModules, listModules as apiListModules, createAdmin as apiCreateAdmin, sendResetEmail as apiSendResetEmail } from '../../../../API/admin/index.ts'

// 模擬資料移至 /data：模組、角色預設與管理員清單

const badge = (text, cls) => (
  <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${cls}`}>{text}</span>
);

const AdminManagement = () => {
  const [admins, setAdmins] = useState([])
  const [roles, setRoles] = useState([]) // [{ id, name }]
  const [_loading, setLoading] = useState(false)
  const [_error, setError] = useState(null)
  const [moduleOptions, setModuleOptions] = useState([]) // [{ key, label }]
  const [roleModulesMap, setRoleModulesMap] = useState({}) // { [roleName]: string[] }

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        // 先載入模組清單/角色清單
        const [mods, roleList, list] = await Promise.all([
          apiListModules(),
          apiListRoles(),
          apiListAdmins()
        ])
  if (mounted) setModuleOptions((mods || []).map((m) => ({ key: m.key || m.name, label: m.label || m.key || m.name })))
        if (mounted) setRoles(roleList || [])
        if (!mounted) return
        // Map API shape to UI shape
        const mapped = list.map((a) => ({
          id: a.id,
          department: a.department || '',
          name: a.display_name || a.email,
          email: a.email,
          role: a.role || 'Staff',
          status: a.is_active ? 'active' : 'inactive',
          lastLogin: '-',
          line_display_name: a.line_display_name || null,
          line_user_id: a.line_user_id || null,
          line_picture_url: a.line_picture_url || null,
        }))
        setAdmins(mapped)

        // 載入各角色的模組矩陣
        const roleNames = Array.from(new Set([...(roleList || []).map(r => r.name), ...mapped.map(a => a.role)].filter(Boolean)))
        const entries = await Promise.all(roleNames.map(async (rn) => [rn, await apiGetRoleModules(rn)]))
        if (mounted) setRoleModulesMap(Object.fromEntries(entries))
      } catch (e) {
        setError(e?.message || '載入管理員失敗')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])
  // 角色過濾選項（合併資料源）
  const roleOptions = useMemo(() => {
    const base = new Set(['全部'])
    roles.forEach(r => base.add(r.name))
    admins.forEach(a => { if (a.role) base.add(a.role) })
    return Array.from(base)
  }, [admins, roles])

  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('全部')
  const [statusFilter, setStatusFilter] = useState('全部')

  // Modal 控制
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [current, setCurrent] = useState(null) // 正在編輯的管理員
  const [resetModal, setResetModal] = useState({ open: false, message: '' })

  const filteredAdmins = useMemo(() => {
    return admins.filter(a => {
      const text = `${a.department || ''} ${a.name} ${a.email}`.toLowerCase();
      const okText = text.includes(search.trim().toLowerCase());
      const okRole = roleFilter === '全部' || a.role === roleFilter;
      const okStatus = statusFilter === '全部' || a.status === statusFilter;
      return okText && okRole && okStatus;
    });
  }, [admins, search, roleFilter, statusFilter]);

  const getRowId = (row) => row.id;

  // 無 per-admin 模組調整；僅依角色矩陣呈現

  const columns = [
    { key: 'department', label: '部門', sortable: true, render: (v) => <span className="font-chinese font-medium">{v || '-'}</span> },
    { key: 'name', label: '暱稱', sortable: true, render: (v) => <span className="font-chinese font-medium">{v}</span> },
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
      key: 'line_display_name', label: 'LINE 暱稱', sortable: true,
      render: (v) => v ? <span className="font-chinese">{v}</span> : <span className="text-gray-400">-</span>
    },
    {
      key: 'line_user_id', label: 'LINE 綁定', sortable: true,
      render: (v) => v ? badge('已綁定', 'bg-green-100 text-green-700') : badge('未綁定', 'bg-gray-100 text-gray-700')
    },
    {
      key: 'line_picture_url', label: 'LINE 頭像', sortable: false,
      render: (v) => v ? <img src={v} alt="avatar" className="w-8 h-8 rounded-full object-cover border" /> : <div className="w-8 h-8 rounded-full bg-gray-100 border" />
    },
    { 
      key: 'status', label: '狀態', sortable: true,
      render: (v) => v === 'active' 
        ? badge('啟用中', 'bg-green-100 text-green-700') 
        : badge('停用', 'bg-red-100 text-red-700')
    },
    { key: 'lastLogin', label: '最後登入', sortable: true },
    {
      key: 'actions', label: '操作', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <IconActionButton Icon={PencilIcon} label="編輯" variant="amber" onClick={() => openEdit(row)} />
          <IconActionButton Icon={KeyIcon} label="寄送重設密碼信" variant="gray" onClick={async () => {
            try {
              await apiSendResetEmail(row.id)
              setResetModal({ open: true, message: '已寄出重設密碼信，請提醒對方至信箱收信。' })
            } catch (e) {
              setResetModal({ open: true, message: e?.message || '寄送失敗' })
            }
          }} />
        </div>
      )
    }
  ];

  // 子表格：每位管理員的模組（只讀，依角色）
  const getAdminSubRows = (row) => {
    const roleMods = roleModulesMap[row.role] || []
    return moduleOptions.map(m => ({ id: `${row.id}-${m.key}`, moduleKey: m.key, moduleLabel: m.label, granted: roleMods.includes(m.key) }))
  }

  const adminSubColumns = [
    { key: 'moduleLabel', label: '模組', sortable: true },
    { key: 'granted', label: '可用', sortable: true, render: (v) => (
      <div className="flex items-center gap-2">
        {v ? badge('啟用', 'bg-green-100 text-green-700') : badge('停用', 'bg-gray-100 text-gray-700')}
      </div>
    ) }
  ];

  // 批次操作
  const batchActions = [
    { label: '批次啟用', onClick: (ids) => setAdmins(prev => prev.map(u => ids.includes(u.id) ? { ...u, status: 'active' } : u)) },
    { label: '批次停用', onClick: (ids) => setAdmins(prev => prev.map(u => ids.includes(u.id) ? { ...u, status: 'inactive' } : u)) },
    { label: '批次刪除', variant: 'danger', onClick: (ids) => setAdmins(prev => prev.filter(u => !ids.includes(u.id))) }
  ];

  // 建立管理員表單狀態
  const [createForm, setCreateForm] = useState({ department: '', name: '', email: '', password: '', role: 'Staff' });
  const handleCreate = async () => {
    if (!createForm.email || !createForm.password) return;
    try {
  // 呼叫後端建立 admin（以 email+password 為主；name 作 display_name；含部門）
  const created = await apiCreateAdmin({ email: createForm.email, password: createForm.password, display_name: createForm.name, role: createForm.role, department: createForm.department })
  const id = created?.id
      setAdmins(prev => [{
        id,
        department: createForm.department,
        name: createForm.name,
        email: createForm.email,
        role: createForm.role,
        status: 'active',
        lastLogin: '-',
        line_display_name: null,
        line_user_id: null,
        line_picture_url: null
      }, ...prev])
      setShowCreate(false)
      setCreateForm({ department: '', name: '', email: '', password: '', role: 'Staff' })
    } catch (e) {
      alert(e?.message || '建立管理員失敗')
    }
  };

  // 編輯管理員
  const [editForm, setEditForm] = useState({ id: '', department: '', name: '', email: '', role: 'Staff', status: 'active' });
  const openEdit = (u) => {
    setEditForm({ id: u.id, department: u.department || '', name: u.name, email: u.email, role: u.role, status: u.status });
    setShowEdit(true);
  };
  const saveEdit = async () => {
    try {
      // 後端支持 display_name/department/is_active/role
  await apiUpdateAdmin(editForm.id, { display_name: editForm.name, department: editForm.department, role: editForm.role, is_active: editForm.status === 'active' })
    } catch (e) {
      // 即便後端更新失敗，仍維持 UI 修改? 這裡選擇僅提示錯誤
      alert(e?.message || '更新管理員失敗')
      return
    }
  setAdmins(prev => prev.map(u => u.id === editForm.id ? { ...u, department: editForm.department, name: editForm.name, email: editForm.email, role: editForm.role, status: editForm.status } : u));
    setShowEdit(false);
  };

  // 角色管理相關 UI 已移至 /admin/roles 頁面

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
    <input className={ADMIN_STYLES.input} placeholder="部門/暱稱/Email"
                     value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">角色</label>
              <SearchableSelect
                options={roleOptions}
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
            getSubRows={(row) => getAdminSubRows(row)}
            subColumns={adminSubColumns}
            subtableClassName="rounded-lg"
          />

        {/* Create Admin Modal */}
        <GlassModal isOpen={showCreate} onClose={() => setShowCreate(false)} title="新增管理員" size="max-w-3xl">
          <div className="pt-0 px-6 pb-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">暱稱</label>
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
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">部門</label>
                <input className={ADMIN_STYLES.input} value={createForm.department} onChange={(e) => setCreateForm(p => ({...p, department: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">角色</label>
                <SearchableSelect
                  options={roleOptions.filter(r => r !== '全部')}
                  value={createForm.role}
                  onChange={(val) => setCreateForm(p => ({...p, role: val}))}
                  placeholder="選擇角色"
                />
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
          <div className="pt-0 px-6 pb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">部門</label>
                <input className={ADMIN_STYLES.input} value={editForm.department} onChange={(e) => setEditForm(p => ({...p, department: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">暱稱</label>
                <input className={ADMIN_STYLES.input} value={editForm.name} onChange={(e) => setEditForm(p => ({...p, name: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">Email</label>
                <input className={ADMIN_STYLES.input} type="email" value={editForm.email} onChange={(e) => setEditForm(p => ({...p, email: e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">角色</label>
                <SearchableSelect
                  options={roleOptions.filter(r => r !== '全部')}
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

        {/* 寄送重設密碼信 Result Modal */}
        <GlassModal isOpen={resetModal.open} onClose={() => setResetModal({ open: false, message: '' })} title="通知" size="max-w-md">
          <div className="pt-0 px-6 pb-6 space-y-4">
            <p className="text-gray-700 font-chinese">{resetModal.message}</p>
            <div className="flex justify-end">
              <button className={ADMIN_STYLES.btnPrimary} onClick={() => setResetModal({ open: false, message: '' })}>關閉</button>
            </div>
          </div>
        </GlassModal>

        {/* 移除個人權限設定 Modal：權限僅能由角色管理 */}
      </div>
    </div>
  );
};

export default AdminManagement;
 
