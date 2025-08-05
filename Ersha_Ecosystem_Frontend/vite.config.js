import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const port = process.env.PORT || '3000';
  const wsUrl = process.env.VITE_WS_URL || 'ws://localhost:8000';
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(port),
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
        PORT: port,
        VITE_WS_URL: wsUrl,
      },
      'import.meta.env.VITE_PORT': JSON.stringify(port),
      'import.meta.env.VITE_WS_URL': JSON.stringify(wsUrl),
    },
    envPrefix: 'VITE_',
  };
});
