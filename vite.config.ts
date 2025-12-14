import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React vendor
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            
            // GSAP vendor
            if (id.includes('gsap')) {
              return 'gsap-vendor';
            }
            
            // Radix UI vendor
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            
            // Tiptap vendor (but exclude @tiptap/pm to avoid resolution issues)
            if (id.includes('@tiptap') && !id.includes('@tiptap/pm')) {
              return 'editor-vendor';
            }
            
            // Other node_modules go to vendor chunk
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
