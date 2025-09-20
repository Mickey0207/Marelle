import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true, // 強制使用指定端口，如果被佔用則報錯而不是切換端口
  },
  preview: {
    port: 3000,
    strictPort: true,
  }
})