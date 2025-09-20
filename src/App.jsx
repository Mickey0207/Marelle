import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LogtoProvider } from '@logto/react'
import { adminLogtoConfig, validateAdminLogtoConfig } from './config/adminLogto'

// 導入頁面組件
import AdminDashboard from './admin/Dashboard'
import AdminCallback from './admin/components/AdminCallback'
import AuthGuard from './admin/components/AuthGuard'


// 註冊 GSAP 插件
gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // 檢查 Logto 配置
    if (!validateAdminLogtoConfig()) {
      console.error('後台 Logto 配置不完整，請檢查 .env 文件');
    }
    
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

  // 如果 Logto 配置不完整，顯示錯誤訊息
  if (!validateAdminLogtoConfig()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-apricot-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">配置錯誤</h1>
          <p className="text-gray-600">後台 Logto 配置不完整，請檢查 .env 文件中的相關設定。</p>
        </div>
      </div>
    )
  }

  return (
    <LogtoProvider config={adminLogtoConfig}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50 to-apricot-50">
          <Routes>
            {/* Logto 回調處理 */}
            <Route path="/callback" element={<AdminCallback />} />
            {/* 後台主要路由 - 使用 AuthGuard 進行認證保護 */}
            <Route 
              path="/*" 
              element={
                <AuthGuard>
                  <AdminDashboard />
                </AuthGuard>
              } 
            />
          </Routes>
        </div>
      </Router>
    </LogtoProvider>
  )
}

export default App