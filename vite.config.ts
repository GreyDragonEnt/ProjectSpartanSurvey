import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    historyApiFallback: true,  // ⬅️ Add this for localhost routing to work!
  },
  build: {
    outDir: 'dist',
    assetsDir: '',
    emptyOutDir: true,         // ⬅️ Good practice to clear dist before build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});