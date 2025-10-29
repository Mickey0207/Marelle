import React, { useEffect, useState } from 'react'
import { ADMIN_STYLES } from '../../Style/adminStyles'

const OAuth = () => {
  const [linked, setLinked] = useState(false)
  const [lineName, setLineName] = useState('')
  const [lineId, setLineId] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    let ignore = false
    const params = new URLSearchParams(window.location.search)
    const bindStatus = params.get('bind')
    if (bindStatus === 'success') {
      setMessage('已成功綁定 LINE')
      // 清理 URL 上的 bind 參數
      const url = new URL(window.location.href)
      url.searchParams.delete('bind')
      window.history.replaceState({}, '', url.toString())
    } else if (bindStatus === 'error') {
      const reason = params.get('reason') || 'unknown'
      const map = {
        line_id_taken: '此 LINE 帳號已被其他管理員綁定',
        missing_service_key: '伺服器設定不足（缺少 Service Role Key）',
        update_failed: '更新資料失敗',
        not_logged_in_for_bind: '請先登入再進行綁定'
      }
      setMessage(`綁定失敗：${map[reason] || reason}`)
    }
    ;(async () => {
      try {
  const apiBase = (window && window.__MARELLE_API_BASE__) || '/'
  const res = await fetch(`${apiBase.replace(/\/$/, '')}/backend/account/line/profile`, { credentials: 'include' })
        if (!res.ok) throw new Error('載入失敗')
        const data = await res.json()
        if (!ignore) {
          setLinked(!!data.linked)
          setLineName(data.line_display_name || '')
          setLineId(data.line_user_id || '')
          setAvatar(data.line_picture_url || '')
        }
      } catch (e) {
        if (!ignore) setMessage('載入綁定資訊失敗')
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [])

  const handleBindLine = () => {
    // 透過後端啟動 LINE 授權，模式為 bind
    const next = window.location.pathname + window.location.search
    const apiBase = (window && window.__MARELLE_API_BASE__) || '/'
    const url = new URL('/backend/auth/line/start', apiBase)
    url.searchParams.set('mode', 'bind')
    url.searchParams.set('next', next)
    window.location.href = url.toString()
  }

  const handleUnbindLine = async () => {
    try {
      const apiBase = (window && window.__MARELLE_API_BASE__) || '/'
      const res = await fetch(`${apiBase.replace(/\/$/, '')}/backend/account/line/unbind`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      if (!res.ok) throw new Error('解除綁定失敗')
      setLinked(false)
      setLineName('')
      setLineId('')
      setMessage('已解除綁定')
    } catch (e) {
      setMessage('解除綁定失敗')
    }
  }

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>帳號設定 · 第三方登入</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理 LINE 等第三方綁定</p>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6 space-y-6">
          {message && (
            <div className="text-sm text-[#2d1e0f] bg-white/60 border border-[#e5ded6] rounded px-3 py-2">{message}</div>
          )}
          <div className="flex items-center justify-between bg-white border border-[#e5ded6] rounded-lg p-4">
            <div className="flex items-center gap-3">
              {avatar ? (
                <img src={avatar} alt="LINE Avatar" className="w-8 h-8 rounded object-cover" />
              ) : (
                <div className="w-8 h-8 rounded bg-[#00c300] text-white flex items-center justify-center font-bold">L</div>
              )}
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
