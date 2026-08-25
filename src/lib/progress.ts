export type ProgressMap = Record<string, boolean>;

const STORAGE_KEY = 'course-progress:v1';

const listeners = new Set<() => void>();

function read(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as ProgressMap;
  } catch {
    return {};
  }
}

function write(map: ProgressMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function isEnabled(id: string): boolean {
  return read()[id] === true;
}

export function toggle(id: string): void {
  const map = read();
  if (map[id]) {
    delete map[id];
  } else {
    map[id] = true;
  }
  write(map);
  for (const notify of listeners) notify();
}

export function snapshot(): ProgressMap {
  return read();
}

export function countDone(phaseSlug: string, total: number): number {
  const map = read();
  let done = 0;
  for (let i = 1; i <= total; i++) {
    if (map[`${phaseSlug}:step-${i}`]) done++;
  }
  return done;
}

export function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  return () => listeners.delete(notify);
}
