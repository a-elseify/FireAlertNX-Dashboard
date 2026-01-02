import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path'; // Import path to be precise

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'FireAlert NX Safety Monitor',
        short_name: 'FireAlertNX',
        description: 'Industrial IoT Safety Dashboard',
        theme_color: '#1f2937',
        background_color: '#1f2937',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  // --- EXPLICIT BUILD CONFIGURATION ---
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // <--- FORCE THIS PATH
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