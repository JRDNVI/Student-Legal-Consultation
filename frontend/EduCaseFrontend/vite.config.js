import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src/serviceWorker/',
      filename: 'service-worker.js',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // includeAssets: ['image.png', 'image2.png'],
      manifest: {
        name: 'EduCase: Student & Legal Consultation',
        short_name: 'EduCase',
        description: 'Student support and Legal Case Management System',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'image.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'image2.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    open: true
  },
});
