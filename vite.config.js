import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    vue(),
    basicSsl()
  ],
  define: {
    'process.env': {
      BACKEND_URL: process.env.BACKEND_URL,
      SITE_URL: process.env.SITE_URL
    }
  },
  base: '/',
  publicDir: 'public',
  server: {
    host: process.env.HOST,
    port: 8080,
  },
  css: {
    preprocessorOptions:
    {
      scss:
        {
          charset: false,
        },
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
});
