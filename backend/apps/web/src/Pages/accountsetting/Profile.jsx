import React, { useEffect, useState } from 'react'
import { useAuth } from '../../components/auth/AuthComponents'
import { ADMIN_STYLES } from '../../Style/adminStyles'
import GlassModal from '../../components/ui/GlassModal'
import { listAdmins as apiListAdmins, updateAdmin as apiUpdateAdmin, sendResetEmail as apiSendResetEmail } from '../../../../API/admin/index.ts'

const Profile = () => {
  const { currentUser } = useAuth()
  const [nickname, setNickname] = useState('')
  const [department, setDepartment] = useState('')
  const [phone, setPhone] = useState('') // 目前僅顯示，等待後端 API 支援再開放儲存
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ open: false, message: '' })

  // 初始化載入目前管理員的個人資料（暱稱、部門等）
  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!currentUser?.id) return
      try {
        setLoading(true)
        const list = await apiListAdmins()
        const me = (list || []).find(a => a.id === currentUser.id || a.email === currentUser.email)
        if (mounted && me) {
          setNickname(me.display_name || '')
          setDepartment(me.department || '')
          // phone 欄位目前後端未回傳，保留佔位
        }
      } catch (e) {
        setModal({ open: true, message: e?.message || '載入個人資料失敗' })
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [currentUser])

  const handleSaveBasic = async (e) => {
    e.preventDefault()
    if (!currentUser?.id) return
    try {
      setLoading(true)
      await apiUpdateAdmin(currentUser.id, { display_name: nickname, department })
      setModal({ open: true, message: '已儲存變更' })
    } catch (err) {
      setModal({ open: true, message: err?.message || '儲存失敗' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentUser?.id) return
    try {
      setLoading(true)
      await apiSendResetEmail(currentUser.id)
      setModal({ open: true, message: '已寄出重設密碼信，請至信箱收信完成變更。' })
    } catch (err) {
      setModal({ open: true, message: err?.message || '寄送失敗' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>帳號設定 · 個人資料</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理您的基本資訊與安全設定</p>
        </div>

        <form onSubmit={handleSaveBasic} className="bg-white/40 backdrop-blur-sm rounded-lg p-6 space-y-8">
          {/* 帳號資訊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-chinese">帳號資訊</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">E-mail</label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full p-3 border rounded-lg bg-white/50 backdrop-blur-sm text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* 安全設定 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-chinese">安全設定</h3>
            <div className="grid grid-cols-2 gap-6 items-end">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">密碼</label>
                <div className="flex items-center gap-3 flex-nowrap">
                  <input
                    type="password"
                    value="********"
                    disabled
                    className="flex-1 min-w-0 p-3 border rounded-lg bg-white/50 backdrop-blur-sm text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className="bg-[#cc824d] text-white px-4 py-2 rounded-lg hover:bg-[#b86c37] transition-colors font-chinese shrink-0"
                  >
                    更改密碼
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 個人資訊 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-chinese">個人資訊</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">部門</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="輸入部門"
                  className="w-full p-3 border rounded-lg bg-white/50 backdrop-blur-sm placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">暱稱</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="輸入暱稱"
                  className="w-full p-3 border rounded-lg bg-white/50 backdrop-blur-sm placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">電話</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="輸入電話"
                  className="w-full p-3 border rounded-lg bg-white/50 backdrop-blur-sm placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#cc824d] text-white px-6 py-3 rounded-lg hover:bg-[#b86c37] transition-colors font-chinese"
            >
              {loading ? '儲存中…' : '儲存變更'}
            </button>
          </div>
        </form>

        {/* 統一訊息模態框 */}
        <GlassModal isOpen={modal.open} onClose={() => setModal({ open: false, message: '' })} title="通知" size="max-w-md">
          <div className="pt-0 px-6 pb-6 space-y-4">
            <p className="text-gray-700 font-chinese">{modal.message}</p>
            <div className="flex justify-end">
              <button className={ADMIN_STYLES.btnPrimary} onClick={() => setModal({ open: false, message: '' })}>關閉</button>
            </div>
          </div>
        </GlassModal>
      </div>
    </div>
  )
}

export default Profile
