import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { CartProvider } from '../external_mock/state/cart.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import FrontLogin from './pages/FrontLogin'
import FrontRegister from './pages/FrontRegister'

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