import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { existsSync, readFileSync } from 'node:fs'
import path from 'path'

const cnamePath = path.resolve(import.meta.dirname, 'public/CNAME')
const customDomain = existsSync(cnamePath) ? readFileSync(cnamePath, 'utf-8').trim() : ''

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: customDomain ? '/' : '/still-here/',
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase/app')) {
            return 'firebase-core'
          }
          if (id.includes('node_modules/firebase/auth')) {
            return 'firebase-auth'
          }
          if (id.includes('node_modules/firebase/firestore')) {
            return 'firebase-firestore'
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor'
          }
        },
      },
    },
  },
})
