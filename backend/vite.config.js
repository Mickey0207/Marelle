import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/admin/shared'),
    },
  },
  server: {
    host: true,
    port: 3001, // 後台固定使用 3001 端口
    strictPort: true, // 強制使用指定端口，如果被佔用則報錯而不是切換端口
  },
  preview: {
    port: 3001,
    strictPort: true,
  }
})