import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true, // 強制使用指定端口，如果被佔用則報錯而不是切換端口
    proxy: {
      // 將前台/後台 API 代理到 Workers 本機埠（wrangler dev 預設 8787）
      '/frontend': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
        // 不改寫路徑，維持 /frontend/auth/*
      },
      '/backend': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      }
    }
  },
  preview: {
    port: 3000,
    strictPort: true,
  }
})