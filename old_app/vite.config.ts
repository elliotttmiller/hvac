import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    // Server-level options driven by env when present. Only expose
    // non-sensitive build-time flags to the client; do NOT inject
    // secret API keys into the client bundle here.
    const devPort = env.PORT ? Number(env.PORT) : (env.VITE_PORT ? Number(env.VITE_PORT) : 3000);
    const hmrClientPort = env.VITE_HMR_CLIENT_PORT ? Number(env.VITE_HMR_CLIENT_PORT) : 443;
    const allowedHosts = env.VITE_ALLOWED_HOSTS ? env.VITE_ALLOWED_HOSTS === 'true' : true;
    const corsEnabled = env.VITE_CORS ? env.VITE_CORS === 'true' : true;

    return {
      root: 'frontend',
      
      server: {
        port: devPort,
        host: '0.0.0.0', // CRITICAL: Binds to all network interfaces for container access
        strictPort: true,

        // Proxy API requests to the backend server
        proxy: {
          '/api': {
            target: 'http://localhost:4000',
            changeOrigin: true,
          }
        },

        // -----------------------------------------------------------------------
        // CLOUD & TUNNELING CONFIGURATION
        // -----------------------------------------------------------------------
  // Allows the server to respond to requests from *.loca.lt or ngrok domains
  // Vite expects `allowedHosts` to be `true` or a string[]; coerce accordingly.
  allowedHosts: allowedHosts ? true : [],

        // Enables CORS to prevent browser security blocks when accessing via Tunnel
        cors: corsEnabled,

        // HMR client port - prefer VITE_HMR_CLIENT_PORT when present
        hmr: {
          clientPort: hmrClientPort,
        },

        // Ensures file changes are detected in virtualized environments (Colab/Docker)
        watch: {
          usePolling: true,
          interval: 100,
        }
      },

      plugins: [react()],
      
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'frontend'),
        }
      },
      
      build: {
        // Preserves your existing chunk splitting strategy
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom')) return 'vendor.react';
                if (id.includes('lucide-react') || id.includes('recharts')) return 'vendor.ui';
                if (id.includes('@google/genai')) return 'vendor.ai';
                return 'vendor';
              }
            }
          }
        }
      }
    };
});