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
            {/* 後台路由 - 必須放在前面以優先匹配 */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            
            {/* 前台登錄註冊 */}
            <Route path="/login" element={<FrontLogin />} />
            <Route path="/register" element={<FrontRegister />} />
            
            {/* 前台路由 */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App