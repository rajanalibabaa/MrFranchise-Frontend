import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {visualizer} from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression';
export default defineConfig({
  base: '/', // root path (for AWS this is usually correct)
  plugins: [react(),
    visualizer(),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false
    }) ],
  build: {
    target: 'es2015', // ensures broader browser compatibility
    minify: 'terser',
   
    cssCodeSplit: true,
    sourcemap: false, // no sourcemaps in production
    chunkSizeWarningLimit: 1500, 
    outDir: 'dist', // default, good for S3/EC2
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      treeshake: true, // tree-shaking to remove unused code
      output: {
        manualChunks:{
           react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          redux: ['redux', 'react-redux'],
          vendor: ['axios'],
          lottie: ['lottie-react']
        },
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
