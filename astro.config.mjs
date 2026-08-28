import { defineConfig } from 'astro/config';

// Base path: GitHub Pages требует '/learn-roblox',
// Cloudflare Pages отдаёт сайт от корня (SITE_BASE=/)
const base = process.env.SITE_BASE ?? '/learn-roblox';

// Добавляет id="step-N" и data-step заголовкам ## Шаг N внутри фаз,
// чтобы боковой rail мог ссылаться на них якорями.
function rehypePhaseStepIds() {
  function textOf(node) {
    if (node.type === 'text') return node.value;
    if (node.children) return node.children.map(textOf).join('');
    return '';
  }
  function visit(node) {
    if (
      node.type === 'element' &&
      node.tagName === 'h2' &&
      node.children
    ) {
      const text = textOf(node);
      const m = text.match(/^Шаг\s+(\d+(?:\.\d+)?)\s*:?\s*(.*)$/);
      if (m) {
        const id = `step-${m[1].replace(/\./g, '-')}`;
        node.properties = node.properties || {};
        node.properties.id = id;
        node.properties['data-step'] = id;
      }
    }
    if (node.children) node.children.forEach(visit);
  }
  return (tree) => visit(tree);
}

export default defineConfig({
  site: 'https://phamap.github.io',
  base,
  markdown: {
    rehypePlugins: [rehypePhaseStepIds],
    shikiConfig: {
      theme: 'solarized-dark',
      langs: ['lua', 'bash', 'json'],
    },
  },
});
