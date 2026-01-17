import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/ui': path.resolve(__dirname, './src/components/ui'),
      '@/sections': path.resolve(__dirname, './src/components/sections'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/context': path.resolve(__dirname, './src/context'),
      '@/data': path.resolve(__dirname, './src/data'),
      '@/lib': path.resolve(__dirname, './src/lib'),
    },
  },
  define: {
    global: 'globalThis',
  },
})
