import React, { useState } from 'react'
import { useAuth } from '../../components/auth/AuthComponents'
import { ADMIN_STYLES } from '../../Style/adminStyles'

const Profile = () => {
  const { currentUser } = useAuth()
  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')

  const handleSaveBasic = (e) => {
    e.preventDefault()
    // 待後端 API：更新暱稱（例如 /backend/account/profile）
    alert('暱稱儲存功能即將支援')
  }

  const handleChangePassword = () => {
    // 待後端 API：觸發變更密碼流程（寄送重設信或開啟變更密碼模態）
    alert('變更密碼功能即將支援')
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
              儲存變更
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
