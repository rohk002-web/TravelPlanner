import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/create-users': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/login-user': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/travel-plan':{
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    },
  },
})
