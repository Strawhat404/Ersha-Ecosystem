import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: parseInt(import.meta.env.VITE_PORT || '3000'),
    strictPort: true,
    host: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  build: {
    sourcemap: mode !== 'production',
  },
  define: {
    'process.env': {
      PORT: import.meta.env.VITE_PORT || '3000',
      VITE_WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
    },
    'import.meta.env.VITE_PORT': JSON.stringify(import.meta.env.VITE_PORT || '3000'),
    'import.meta.env.VITE_WS_URL': JSON.stringify(import.meta.env.VITE_WS_URL || 'ws://localhost:8000'),
  },
  envPrefix: 'VITE_',
}));
