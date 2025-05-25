import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/api': {
        target: 'http://caleido-hope-ai.byfcbwdcazc9caey.eastus.azurecontainer.io:8080',
        changeOrigin: true,
        secure : false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
