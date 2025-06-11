import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // root path (for AWS this is usually correct)
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // setup file for testing
  },
  build: {
    target: 'es2015', // ensures broader browser compatibility
    minify: 'terser',
    sourcemap: false, // no sourcemaps in production
    chunkSizeWarningLimit: 500,
    outDir: 'dist', // default, good for S3/EC2
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
