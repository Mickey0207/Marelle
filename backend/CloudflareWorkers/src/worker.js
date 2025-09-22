// Marelle Cloudflare Workers 主要入口文件
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// 創建 Hono 應用程式實例
const app = new Hono()

// 中間件
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'], // Vite 開發伺服器
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// 健康檢查端點
app.get('/', (c) => {
  return c.json({
    message: 'Marelle API is running!',
    environment: c.env.ENVIRONMENT || 'development',
    timestamp: new Date().toISOString()
  })
})

// API 路由
app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    database: c.env.DB ? 'connected' : 'not configured',
    timestamp: new Date().toISOString()
  })
})

// 資料庫測試端點
app.get('/api/db/test', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: 'Database not configured' }, 500)
    }

    // 簡單的資料庫查詢測試
    const result = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first()
    
    return c.json({
      message: 'Database connection successful',
      userCount: result.count,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return c.json({
      error: 'Database connection failed',
      details: error.message
    }, 500)
  }
})

// 404 處理
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404)
})

// 錯誤處理
app.onError((err, c) => {
  console.error(`Error: ${err.message}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app