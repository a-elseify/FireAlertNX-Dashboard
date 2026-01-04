import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/FireAlertNX-Dashboard",
  server: {
    host: true,
    port: 5173,
    // --- THIS IS THE MISSING BRIDGE ---
    proxy: {
      '/api': {
        target: 'https://thingsboard.cloud',
        changeOrigin: true,
        secure: false,
      },
    }
  },
});