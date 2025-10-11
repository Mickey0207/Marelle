import React, { useState } from 'react'
import { ADMIN_STYLES } from '../../Style/adminStyles'

const OAuth = () => {
  const [linked, _setLinked] = useState(false)
  const [lineName, setLineName] = useState('')
  const [lineId, setLineId] = useState('')

  const handleBindLine = () => {
    // 待後端 API：導向 LINE 授權流程
    alert('LINE 綁定流程即將支援')
    // setLinked(true)
  }

  const handleUnbindLine = () => {
    alert('解除綁定即將支援')
    // setLinked(false)
  }

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>帳號設定 · 第三方登入</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理 LINE 等第三方綁定</p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between bg-white border border-[#e5ded6] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#00c300] text-white flex items-center justify-center font-bold">L</div>
              <div className="font-chinese text-sm text-[#2d1e0f]">LINE</div>
            </div>
            {linked ? (
              <button onClick={handleUnbindLine} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-chinese text-sm">解除綁定</button>
            ) : (
              <button onClick={handleBindLine} className="bg-[#00c300] text-white px-4 py-2 rounded-lg hover:bg-[#00b300] transition-colors font-chinese text-sm">綁定 LINE</button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">LINE 暱稱</label>
              <input
                type="text"
                value={lineName}
                onChange={(e) => setLineName(e.target.value)}
                disabled
                className="w-full p-3 border rounded-lg bg-white/50 backdrop-blur-sm text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">LINE ID</label>
              <input
                type="text"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                disabled
                className="w-full p-3 border rounded-lg bg-white/50 backdrop-blur-sm text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OAuth
