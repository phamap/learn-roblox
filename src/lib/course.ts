import type { CollectionEntry } from 'astro:content';

type Phase = CollectionEntry<'phases'>;

export function phaseOrder(slug: string): number {
  const match = slug.match(/^phase-(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : Number.MAX_SAFE_INTEGER;
}

export function sortPhases(phases: Phase[]): Phase[] {
  return [...phases].sort((a, b) => phaseOrder(a.id) - phaseOrder(b.id));
}

export function extractTitle(entry: { body?: string }): string | null {
  const match = entry.body?.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

export function countSteps(body: string): number {
  return (body.match(/^\s*[-*]\s+\[[ xX]\]/gm) ?? []).length;
}
