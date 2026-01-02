import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa'; // Commented out to force deploy
import path from 'path';
import { fileURLToPath } from 'url';

// --- FIX FOR __dirname IN ES MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({...}) // Commented out to prevent build error
  ],
  // --- EXPLICIT BUILD CONFIGURATION ---
  build: {
    rollupOptions: {
      input: {
        // Forces Vite to look for index.html in the current folder
        main: path.resolve(__dirname, 'index.html'), 
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://thingsboard.cloud',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});