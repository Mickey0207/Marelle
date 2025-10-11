import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// 目前 config 位於 Package/，apps/web 與 Package 為同層級 -> 使用 ../apps/web
const rootDir = path.resolve(__dirname, '../apps/web')
// 中央化的 PostCSS 設定檔案路徑
const postcssConfigPath = path.resolve(__dirname, 'postcss.config.cjs')

export default defineConfig({
  root: rootDir,
  plugins: [react()],
  css: {
    // 指向集中式 postcss 設定（包含 tailwind + autoprefixer）
    postcss: postcssConfigPath
  },
  server: {
    host: true,
    port: 3001,
    strictPort: false,
    fs: {
      // 允許從 root 之外載入（apps/API 與整個 backend/apps）
      allow: [
        rootDir,
        path.resolve(__dirname, '../apps'),
        path.resolve(__dirname, '..')
      ]
    },
    // 啟動開發伺服器時預設開啟登入頁，避免瀏覽器保留舊路徑造成混淆
    open: '/login',
    proxy: {
      // 讓前端可透過同源路徑呼叫 Workers API（本地開發）
      '/backend': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: { port: 3001, strictPort: false }
})
