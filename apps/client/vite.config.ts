import Terminal from 'vite-plugin-terminal';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    Terminal({
      console: 'terminal',
      output: ['terminal', 'console']
    })
  ],
  server: {
    proxy: {
      '/login': {
        target: "http://localhost:8787",
        changeOrigin: true,
        secure: false
      }
    }
  }
})