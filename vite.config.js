import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根據模式決定端口：前台 3000，後台 3001
  const port = mode === 'admin' ? 3001 : 3000;
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, './src/admin/shared'),
      },
    },
    server: {
      host: true,
      port: port,
      strictPort: true, // 強制使用指定端口，如果被佔用則報錯而不是切換端口
    },
    preview: {
      port: port,
      strictPort: true,
    }
  }
})