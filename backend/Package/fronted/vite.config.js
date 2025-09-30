import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../apps/web')
const tailwindConfigPath = path.resolve(__dirname, 'tailwind.config.cjs')

export default defineConfig({
  root: rootDir,
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss({ config: tailwindConfigPath }), autoprefixer()]
    }
  },
  server: { host: true, port: 3001, strictPort: false },
  preview: { port: 3001, strictPort: false }
})
