import React from 'react'
import { UsersIcon, PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { ADMIN_STYLES } from '../../Style/adminStyles.js'
import StandardTable from '../../components/ui/StandardTable'
import GlassModal from '../../components/ui/GlassModal'
import SearchableSelect from '../../components/ui/SearchableSelect'
import { listModules as apiListModules, listRoles as apiListRoles, getRoleModules as apiGetRoleModules, setRoleModules as apiSetRoleModules, createRole as apiCreateRole } from '../../../../API/admin/index.ts'

const badge = (text, cls) => (
  <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded font-chinese ${cls}`}>{text}</span>
)

export default function AdminRoleManagement() {
  const [roles, setRoles] = React.useState([])
  const [modules, setModules] = React.useState([]) // [{ key, label }]
  const [roleModules, setRoleModules] = React.useState({}) // { [roleName]: string[] }
  const [loading, setLoading] = React.useState(false)
  const [showCreate, setShowCreate] = React.useState(false)
  const [newRoleName, setNewRoleName] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const [mods, roleList] = await Promise.all([
          apiListModules(),
          apiListRoles(),
        ])
        if (!mounted) return
  setModules((mods || []).map(m => ({ key: m.key || m.name, label: m.label || m.key || m.name })))
        setRoles(roleList || [])
        const names = (roleList || []).map(r => r.name)
        const entries = await Promise.all(names.map(async (n) => [n, await apiGetRoleModules(n)]))
        if (mounted) setRoleModules(Object.fromEntries(entries))
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const columns = [
    { key: 'name', label: '角色', sortable: true, render: (v) => <span className="font-chinese font-medium">{v}</span> },
    { key: 'modulesCount', label: '啟用模組數', sortable: true, render: (_, row) => (roleModules[row.name]?.length || 0) }
  ]

  const getRowId = (row) => row.id || row.name
  const getSubRows = (row) => {
    const enabled = new Set(roleModules[row.name] || [])
    return modules.map(m => ({ id: `${row.name}-${m.key}`, moduleKey: m.key, moduleLabel: m.label, granted: enabled.has(m.key), roleName: row.name }))
  }
  const subColumns = [
    { key: 'moduleLabel', label: '模組', sortable: true },
    { key: 'granted', label: '可用', sortable: true, render: (v, subRow) => (
      <div className="flex items-center gap-2">
        {v ? badge('啟用', 'bg-green-100 text-green-700') : badge('停用', 'bg-gray-100 text-gray-700')}
        <button
          className={`${v ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'} p-1 rounded`}
          onClick={async () => {
            const current = roleModules[subRow.roleName] || []
            const next = v ? current.filter(k => k !== subRow.moduleKey) : [...new Set([...current, subRow.moduleKey])]
            try {
              await apiSetRoleModules(subRow.roleName, next)
              setRoleModules(prev => ({ ...prev, [subRow.roleName]: next }))
            } catch (e) {
              alert(e?.message || '更新角色模組失敗')
            }
          }}
        >
          {v ? <XCircleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
        </button>
      </div>
    ) }
  ]

  const handleCreateRole = async () => {
    const name = (newRoleName || '').trim()
    if (!name) return
    try {
      const created = await apiCreateRole(name)
      setRoles(prev => [{ id: created.id, name }, ...prev])
      setRoleModules(prev => ({ ...prev, [name]: [] }))
      setShowCreate(false)
      setNewRoleName('')
    } catch (e) {
      alert(e?.message || '新增角色失敗')
    }
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen">
      <div className={ADMIN_STYLES.contentContainerFluid}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 text-amber-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 font-chinese">角色管理</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className={ADMIN_STYLES.btnPrimary} onClick={() => setShowCreate(true)}>
              <span className="inline-flex items-center"><PlusIcon className="w-5 h-5 mr-2" />新增角色</span>
            </button>
          </div>
        </div>

        <StandardTable
          data={roles}
          columns={columns}
          title="角色清單"
          exportFileName="角色清單"
          getRowId={getRowId}
          enableRowExpansion
          getSubRows={getSubRows}
          subColumns={subColumns}
          subtableClassName="rounded-lg"
        />

        <GlassModal isOpen={showCreate} onClose={() => setShowCreate(false)} title="新增角色" size="max-w-md">
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 font-chinese mb-1">角色名稱</label>
              <input className={ADMIN_STYLES.input} value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="例如：Auditor" />
            </div>
            <div className="flex justify-end gap-3">
              <button className={ADMIN_STYLES.btnSecondary} onClick={() => setShowCreate(false)}>取消</button>
              <button className={ADMIN_STYLES.btnPrimary} onClick={handleCreateRole}>建立</button>
            </div>
          </div>
        </GlassModal>
      </div>
    </div>
  )
}
