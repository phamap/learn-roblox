import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const plan = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/plan' }),
  schema: z.object({}),
});

const phases = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/phases' }),
  schema: z.object({}),
});

const cheatsheets = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/cheatsheets' }),
  schema: z.object({}),
});

export const collections = { plan, phases, cheatsheets };
