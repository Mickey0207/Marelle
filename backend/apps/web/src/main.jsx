import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './Style/index.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AppRouter from './components/core/AppRouter'

// 註冊 GSAP 插件（模組層執行一次）
gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // 初始化頁面載入動畫
    const targets = document.querySelectorAll('.animate-on-load')
    if (targets.length > 0) {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
      )
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50 to-cream-100">
      <AppRouter />
    </div>
  )
}

// 後台專用應用 - 直接載入 App 組件（管理介面）
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)