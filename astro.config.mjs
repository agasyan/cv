// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Set SITE_URL in the shell that runs `npm run deploy` once a custom domain is attached.
  site: process.env.SITE_URL ?? 'https://agasyan.pages.dev',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
    // Lets the PDF renderer find src/pdf/fonts wherever the build is started from.
    define: { __PROJECT_ROOT__: JSON.stringify(projectRoot) },
    // pdfmake/pdfkit read font metrics from their own package folders at runtime.
    ssr: { external: ['pdfmake'] },
  },
});
