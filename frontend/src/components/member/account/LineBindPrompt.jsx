import { useEffect, useState } from 'react'

export default function LineBindPrompt() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lineName, setLineName] = useState(null)
  const apiBase = (typeof window !== 'undefined' && window.__MARELLE_API_BASE__) || '/'
  const lineBindHref = `${apiBase.replace(/\/$/, '')}/frontend/account/line/start`

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/frontend/account/line/status', { credentials: 'include' })
        if (!mounted) return
        if (res.ok) {
          const data = await res.json()
          if (!data.is_bound) {
            setOpen(true)
          } else {
            setLineName(data.line_display_name || null)
          }
        }
      } catch {}
      finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) return null
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{background:'rgba(0,0,0,0.2)'}} onClick={() => setOpen(false)} />
      <div className="relative z-10 w-[90%] max-w-sm rounded-lg shadow-lg p-5" style={{background:'#FFFFFF', border:'1px solid #E5E7EB'}}>
        <h3 className="text-base font-chinese mb-2" style={{color:'#333333'}}>綁定 LINE 帳號</h3>
        <p className="text-sm mb-4" style={{color:'#666666'}}>為了接收重要通知與優惠，建議綁定 LINE。</p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setOpen(false)} className="text-sm px-3 py-1.5 rounded hover:bg-gray-50" style={{color:'#666666'}}>稍後再說</button>
          <a href={lineBindHref} className="text-sm px-3 py-1.5 rounded" style={{background:'#CC824D', color:'#FFFFFF'}}>立即綁定</a>
        </div>
      </div>
    </div>
  )
}
