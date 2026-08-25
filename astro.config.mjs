import { defineConfig } from 'astro/config';

// Base path: GitHub Pages требует '/learn-roblox',
// Cloudflare Pages отдаёт сайт от корня (SITE_BASE=/)
const base = process.env.SITE_BASE ?? '/learn-roblox';

export default defineConfig({
  site: 'https://phamap.github.io',
  base,
  markdown: {
    shikiConfig: {
      langs: ['lua', 'bash', 'json'],
    },
  },
});
