import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://phamap.github.io',
  base: '/learn-roblox',
  markdown: {
    shikiConfig: {
      langs: ['lua', 'bash', 'json'],
    },
  },
});
