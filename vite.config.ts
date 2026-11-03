import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'node:fs';
import zlib from 'node:zlib';

function precompressPlugin() {
  return {
    name: 'vite-plugin-precompress',
    apply: 'build' as const,
    closeBundle() {
      const distDir = path.resolve(__dirname, './dist');
      if (!fs.existsSync(distDir)) return;

      const processDir = (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            processDir(fullPath);
          } else if (/\.(js|css|html|svg|json)$/.test(file) && !file.endsWith('.gz') && !file.endsWith('.br')) {
            const content = fs.readFileSync(fullPath);
            if (content.length > 1024) {
              const gzipped = zlib.gzipSync(content, { level: 9 });
              fs.writeFileSync(`${fullPath}.gz`, gzipped);
              const brotlied = zlib.brotliCompressSync(content, {
                params: {
                  [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
              });
              fs.writeFileSync(`${fullPath}.br`, brotlied);
            }
          }
        }
      };

      processDir(distDir);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), precompressPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'axios'],
  },
  build: {
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('xlsx')) {
              return 'vendor-excel';
            }
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
              return 'vendor-pdf';
            }
            if (id.includes('ogl') || id.includes('gsap')) {
              return 'vendor-graphics';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        },
      },
    },
  },
});
