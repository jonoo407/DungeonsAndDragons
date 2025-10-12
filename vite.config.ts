import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  base: isProduction ? '/DungeonsAndDragons/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
