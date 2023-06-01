import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import relay from 'vite-plugin-relay';
import path from 'path';

export default defineConfig({
  plugins: [react(), relay],
  resolve: {
    alias: {
      '@/components/': path.join(__dirname, 'src/components/'),
      '@/hooks/': path.join(__dirname, 'src/hooks/'),
      '@/utils/': path.join(__dirname, 'src/utils/'),
    }
  }
})
