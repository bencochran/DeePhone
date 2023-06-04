import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import relay from 'vite-plugin-relay';
import path from 'path';

export default defineConfig({
  plugins: [react(), relay],
  server: {
    proxy: {
      '/api/graphql/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
      '/api': {
        target: 'http://localhost:8080',
      }
    },
    sourcemapIgnoreList: false,
  },
  resolve: {
    alias: {
      '@/components/': path.join(__dirname, 'src/components/'),
      '@/hooks/': path.join(__dirname, 'src/hooks/'),
      '@/utils/': path.join(__dirname, 'src/utils/'),
    }
  }
})
