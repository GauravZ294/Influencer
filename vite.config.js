import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: '127.0.0.1' },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        room1: resolve(process.cwd(), 'room1.html'),
        room2: resolve(process.cwd(), 'room2.html'),
        room3: resolve(process.cwd(), 'room3.html'),
      },
    },
  },
});
