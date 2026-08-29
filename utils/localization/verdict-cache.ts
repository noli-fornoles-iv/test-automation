import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface CachedVerdict {
  detectedLanguage: string;
  matches: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  source: 'deterministic' | 'cld3' | 'lexicon' | 'cursor-ai';
}

const CACHE_PATH = resolve(process.env.LANG_CACHE_PATH ?? '.cache/lang-verdicts.json');
const CACHE_VERSION = 2;

interface CacheFile {
  version: number;
  entries: Record<string, CachedVerdict>;
}

let cache: Map<string, CachedVerdict> | null = null;
let dirty = false;

export function isCacheDisabled(): boolean {
  const raw = process.env.DISABLE_LANG_CACHE?.trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
}

function keyFor(expectedLanguage: string, text: string): string {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
  return `${expectedLanguage}\u0000${normalized}`;
}

function ensureLoaded(): Map<string, CachedVerdict> {
  if (cache) return cache;
  cache = new Map();
  if (isCacheDisabled()) return cache;
  try {
    if (existsSync(CACHE_PATH)) {
      const parsed = JSON.parse(readFileSync(CACHE_PATH, 'utf8')) as CacheFile;
      if (parsed?.version === CACHE_VERSION && parsed.entries) {
        for (const [k, v] of Object.entries(parsed.entries)) cache.set(k, v);
      }
    }
  } catch {
    cache = new Map();
  }
  return cache;
}

export function getCachedVerdict(
  expectedLanguage: string,
  text: string,
): CachedVerdict | undefined {
  if (isCacheDisabled()) return undefined;
  return ensureLoaded().get(keyFor(expectedLanguage, text));
}

export function setCachedVerdict(
  expectedLanguage: string,
  text: string,
  verdict: CachedVerdict,
): void {
  if (isCacheDisabled()) return;
  ensureLoaded().set(keyFor(expectedLanguage, text), verdict);
  dirty = true;
}

export function flushCache(): void {
  if (isCacheDisabled() || !cache || !dirty) return;
  try {
    mkdirSync(dirname(CACHE_PATH), { recursive: true });
    const entries: Record<string, CachedVerdict> = {};
    for (const [k, v] of cache) entries[k] = v;
    writeFileSync(CACHE_PATH, JSON.stringify({ version: CACHE_VERSION, entries }), 'utf8');
    dirty = false;
  } catch {
    // best-effort
  }
}
