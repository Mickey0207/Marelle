import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { CartProvider } from '../external_mock/state/cart.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/layout/Navbar'
import ScrollManager from './components/layout/ScrollManager.jsx'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Products from './pages/products/Products.jsx'
import ProductDetail from './pages/products/ProductDetail.jsx'
import Cart from './pages/check/Cart.jsx'
import Checkout from './pages/check/Checkout.jsx'
import FrontLogin from './pages/auth/FrontLogin.jsx'
import FrontRegister from './pages/auth/FrontRegister.jsx'
import Profile from './pages/member/account/Profile.jsx'
import OrdersCenter from './pages/member/order/OrdersCenter.jsx'
import VipArea from './pages/member/vip/VipArea.jsx'
import Favorites from './pages/favorites.jsx'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    gsap.fromTo(
      '.animate-on-load',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
    )
  }, [])

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50 to-apricot-50">
        <ScrollManager />
        <Routes>
          <Route path="/*" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/*" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<FrontLogin />} />
                  <Route path="/register" element={<FrontRegister />} />
                  <Route path="/account" element={<Profile />} />
                  <Route path="/orders" element={<OrdersCenter />} />
                  <Route path="/vip" element={<VipArea />} />
                  <Route path="/favorites" element={<Favorites />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

// 前台專用應用 - 直接載入 App 組件
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
)