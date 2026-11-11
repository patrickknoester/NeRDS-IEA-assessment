import { defineConfig } from 'vite';

export default defineConfig({
  // Relatieve paden: de site werkt dan in elke submap, zoals op GitHub Pages
  // (https://<gebruiker>.github.io/<repo>/). Routes gaan via de hash.
  base: './',
  build: {
    // De bundel met alle NLDD-componenten is groot; voor een POC is dat geen probleem.
    chunkSizeWarningLimit: 2500,
  },
});
