import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // root path (for AWS this is usually correct)
  plugins: [react()],
  build: {
    target: 'es2015', // ensures broader browser compatibility
    minify: 'terser',
   
    cssCodeSplit: true,
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
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 200000, // 200KB per chunk
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      
    },
  },
})
