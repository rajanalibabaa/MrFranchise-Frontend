import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:'/',
  build:{
minify:'terser',
target:'esnext',
sourcemap:false,
chunkSizeWarningLimit: 500, // Increase the chunk size warning limit
  },
  plugins: [react()],
})
