import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Define paths manually since we are in a module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react() 
    // PWA is completely gone. It cannot fail.
  ],
  build: {
    rollupOptions: {
      input: {
        // This forces Vercel to find index.html right here
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