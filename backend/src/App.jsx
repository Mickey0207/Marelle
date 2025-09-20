import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 導入後台組件
import AdminDashboard from './admin/Dashboard'
import AdminLogin from "./admin/modules/auth/pages/AdminLogin";
import Register from "./admin/modules/auth/pages/Register";

// 導入 AuthProvider
import { AuthProvider } from './admin/shared/components/AuthComponents'

// 註冊 GSAP 插件
gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // 初始化頁面載入動畫
    gsap.fromTo(
      '.animate-on-load',
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      }
    )
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50 to-apricot-50">
          <Routes>
            {/* 後台路由 - 移除 /admin 前綴 */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App