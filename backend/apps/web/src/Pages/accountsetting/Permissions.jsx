import React from 'react'
import { useAuth } from '../../components/auth/AuthComponents'
import { ADMIN_STYLES } from '../../Style/adminStyles'
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  CubeIcon,
  UsersIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  BellIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  StarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const Permissions = () => {
  const { currentUser } = useAuth()
  const modules = Array.isArray(currentUser?.permissions) ? currentUser.permissions : []

  // 角色：目前無實際 API，先以 placeholder 呈現
  const roles = ['Admin']

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>帳號設定 · 權限管理</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>檢視您目前擁有的後台模組與角色</p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6 space-y-8">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-[#8b5e34]" />
            <h3 className="text-base font-semibold text-[#2d1e0f] font-chinese">權限總覽</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* 模組卡片 */}
            <div className="bg-white border border-[#e5ded6] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Squares2X2Icon className="w-4 h-4 text-[#8b5e34]" />
                  <h4 className="text-sm font-semibold text-gray-800 font-chinese">擁有的模組</h4>
                </div>
                {modules.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#2d1e0f] bg-[#f7f2e8] border border-[#e5ded6] rounded px-2 py-0.5">
                    <CheckCircleIcon className="w-3 h-3 text-[#4caf50]" />
                    {modules.length}
                  </span>
                )}
              </div>
              {modules.length === 0 ? (
                <div className="text-sm text-gray-500 font-chinese">尚未授權任何模組</div>
              ) : (
                <ul className="divide-y divide-[#f0e9df]">
                  {modules.map((m) => (
                    <li key={m} className="py-2 flex items-center gap-2 text-sm text-gray-700 font-chinese">
                      {iconForModule(m)}
                      <span>{moduleLabel(m)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 角色卡片 */}
            <div className="bg-white border border-[#e5ded6] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <UsersIcon className="w-4 h-4 text-[#8b5e34]" />
                <h4 className="text-sm font-semibold text-gray-800 font-chinese">角色</h4>
              </div>
              {roles.length === 0 ? (
                <div className="text-sm text-gray-500 font-chinese">尚無角色</div>
              ) : (
                <ul className="divide-y divide-[#f0e9df]">
                  {roles.map((r) => (
                    <li key={r} className="py-2 flex items-center gap-2 text-sm text-gray-700 font-chinese">
                      <CheckCircleIcon className="w-4 h-4 text-[#4caf50]" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Permissions

// 小工具：根據模組名稱回傳對應 icon
function iconForModule(name) {
  const key = String(name).toLowerCase()
  if (key.includes('dashboard') || key.includes('overview')) return <HomeIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('product') || key.includes('catalog')) return <ShoppingBagIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('inventory') || key.includes('stock')) return <CubeIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('order')) return <ClipboardDocumentListIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('logistics') || key.includes('shipping') || key.includes('delivery')) return <MapPinIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('notification')) return <BellIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('marketing') || key.includes('campaign')) return <ChartBarIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('user') || key.includes('member')) return <UsersIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('procurement') || key.includes('purchase') || key.includes('supplier')) return <ShoppingCartIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('accounting') || key.includes('finance') || key.includes('billing')) return <CurrencyDollarIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('review') || key.includes('rating')) return <StarIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('form') || key.includes('sign')) return <DocumentTextIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('admin') || key.includes('security')) return <ShieldCheckIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('analytics') || key.includes('report')) return <ChartBarIcon className="w-4 h-4 text-[#8b5e34]" />
  if (key.includes('setting') || key.includes('config') || key.includes('system')) return <Cog6ToothIcon className="w-4 h-4 text-[#8b5e34]" />
  return <Squares2X2Icon className="w-4 h-4 text-[#8b5e34]" />
}

// 小工具：將模組鍵轉為中文顯示名稱
function moduleLabel(name) {
  const key = String(name).toLowerCase()
  if (key.includes('dashboard') || key.includes('overview')) return '總覽'
  if (key.includes('product') || key.includes('catalog')) return '商品管理'
  if (key.includes('inventory') || key.includes('stock')) return '庫存管理'
  if (key.includes('order')) return '訂單管理'
  if (key.includes('logistics') || key.includes('shipping') || key.includes('delivery')) return '物流管理'
  if (key.includes('notification')) return '通知管理'
  if (key.includes('marketing') || key.includes('campaign')) return '行銷管理'
  if (key.includes('user') || key.includes('member')) return '會員管理'
  if (key.includes('procurement') || key.includes('purchase') || key.includes('supplier')) return '採購管理'
  if (key.includes('accounting') || key.includes('finance') || key.includes('billing')) return '會計管理'
  if (key.includes('review') || key.includes('rating')) return '評價管理'
  if (key.includes('form') || key.includes('sign')) return '表單審批'
  if (key.includes('analytics') || key.includes('report')) return '數據分析'
  if (key.includes('admin') || key.includes('security')) return '管理員管理'
  if (key.includes('setting') || key.includes('config') || key.includes('system')) return '系統設定'
  return name
}
