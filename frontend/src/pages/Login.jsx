import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 使用 Workers API 進行登入
      const response = await fetch('http://localhost:8787/api/front/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // 儲存 token
        localStorage.setItem('frontToken', result.data.token);
        localStorage.setItem('frontUser', JSON.stringify(result.data.user));
        toast.success('登入成功！')
        navigate('/')
      } else {
        toast.error(result.error || '登入失敗')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('登入失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf8f2] to-[#f3e8d7] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* 標題 */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            歡迎回來
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            登入您的帳號
          </motion.p>
        </div>

        {/* 登入表單 */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                電子郵件
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-all duration-200"
                placeholder="電子郵件"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                密碼
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc824d] focus:border-transparent transition-all duration-200"
                placeholder="密碼"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#cc824d] hover:bg-[#b3723f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cc824d] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? '登入中...' : '登入'}
            </motion.button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              還沒有帳號？{' '}
              <Link
                to="/register"
                className="font-medium text-[#cc824d] hover:text-[#b3723f] transition-colors duration-200"
              >
                立即註冊
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}