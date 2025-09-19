import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 導入頁面組件
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminDashboard from './admin/Dashboard'
import AdminLogin from "./admin/modules/auth/pages/AdminLogin";
import Register from "./admin/modules/auth/pages/Register";
import FrontLogin from './pages/FrontLogin'
import FrontRegister from './pages/FrontRegister'

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