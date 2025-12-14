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
          // Vendor chunks - simplified to avoid circular dependencies
          if (id.includes('node_modules')) {
            // Large libraries that can be split
            if (id.includes('gsap')) {
              return 'gsap-vendor';
            }
            
            // Keep React together to avoid circular deps
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            
            // Radix UI
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            
            // Tiptap (exclude problematic packages)
            if (id.includes('@tiptap') && !id.includes('@tiptap/pm')) {
              return 'editor-vendor';
            }
            
            // Let Vite handle the rest automatically
            return null;
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
