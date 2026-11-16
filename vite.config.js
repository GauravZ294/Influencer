import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

function absoluteSocialPreview() {
  return {
    name: 'absolute-social-preview-url',
    transformIndexHtml(html) {
      const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.SITE_URL;
      if (!host) return html;
      const origin = `https://${host.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
      return html
        .replaceAll('content="/social-preview.jpg"', `content="${origin}/social-preview.jpg"`)
        .replace('content="/"', `content="${origin}/"`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), absoluteSocialPreview()],
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
