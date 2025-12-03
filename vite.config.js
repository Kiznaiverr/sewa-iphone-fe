import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  public: 'public',
  build: {
    target: 'ES2020',
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://backend.nekoyama.my.id',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
