import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0', // CRITICAL: Binds to all network interfaces for container access
        strictPort: true,
        
        // -----------------------------------------------------------------------
        // CLOUD & TUNNELING CONFIGURATION
        // -----------------------------------------------------------------------
        // Allows the server to respond to requests from *.loca.lt or ngrok domains
        allowedHosts: true, 
        
        // Enables CORS to prevent browser security blocks when accessing via Tunnel
        cors: true,         
        
        // Fixes the "Black Screen" / Infinite Loading loop
        // Tells the browser to connect to the HMR socket via HTTPS (Port 443)
        // instead of trying to hit localhost:3000 directly
        hmr: {
          clientPort: 443, 
        },
        
        // Ensures file changes are detected in virtualized environments (Colab/Docker)
        watch: {
          usePolling: true,
          interval: 100,
        }
      },
      
      plugins: [react()],
      
      define: {
        // Preserves your existing env injection logic
        'process.env.VITE_AI_API_KEY': JSON.stringify(env.VITE_AI_API_KEY),
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
      },
      
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
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