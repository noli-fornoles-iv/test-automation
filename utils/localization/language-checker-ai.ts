import type { LanguageCheckResult } from './types';

const DEFAULT_MODEL = process.env.CURSOR_MODEL ?? 'composer-2.5';
const BATCH_SIZE = 15;

export interface ClassifyItem {
  id: string;
  kind: string;
  text: string;
}

interface ModelVerdict {
  id: string;
  detectedLanguage: string;
  matches: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

let aiChain: Promise<unknown> = Promise.resolve();

function withAiLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = aiChain.then(fn, fn);
  aiChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function isCursorAiAvailable(): boolean {
  return Boolean(process.env.CURSOR_API_KEY?.trim());
}

/**
 * Optional Cursor AI classifier. Returns empty map when API key is missing.
 */
export async function classifyWithCursorAi(
  items: ClassifyItem[],
  expectedLanguage: string,
): Promise<Map<string, LanguageCheckResult>> {
  const results = new Map<string, LanguageCheckResult>();
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey || items.length === 0) return results;

  // Dynamic import — @cursor/sdk is ESM-friendly.
  const { Agent } = await import('@cursor/sdk');

  const totalBatches = Math.ceil(items.length / BATCH_SIZE);
  for (let offset = 0; offset < items.length; offset += BATCH_SIZE) {
    const slice = items.slice(offset, offset + BATCH_SIZE);
    const batchNo = Math.floor(offset / BATCH_SIZE) + 1;

    console.log(
      `    → Cursor AI batch ${batchNo}/${totalBatches} (${slice.length} unique string(s))`,
    );

    const verdicts = await withAiLock(() => classifyBatch(Agent, slice, expectedLanguage, apiKey));

    for (const verdict of verdicts) {
      const item = slice.find(b => b.id === verdict.id);
      if (!item) continue;
      results.set(verdict.id, {
        text: item.text,
        expectedLanguage,
        detectedLanguage: verdict.detectedLanguage,
        matches: verdict.matches,
        confidence: verdict.confidence,
        reason: `[Cursor AI] ${verdict.reason}`,
        source: 'cursor-ai',
      });
    }
  }

  return results;
}

async function classifyBatch(
  Agent: typeof import('@cursor/sdk').Agent,
  batch: ClassifyItem[],
  expectedLanguage: string,
  apiKey: string,
): Promise<ModelVerdict[]> {
  const prompt = buildPrompt(batch, expectedLanguage);
  try {
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: DEFAULT_MODEL },
      local: { cwd: process.cwd(), settingSources: [] },
    });
    if (result.status === 'error') {
      throw new Error(`Cursor agent run failed (run id: ${result.id})`);
    }
    return parseVerdicts(result.result ?? '', batch, expectedLanguage);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Infra/runtime gaps (e.g. missing node:sqlite for @cursor/sdk local store) must not
    // hard-fail UntranslatedTextScan — fall back to offline heuristics / soft review.
    if (
      /node:sqlite|local agent storage|CURSOR_API_KEY|ECONNREFUSED|ENOTFOUND|fetch failed/i.test(
        message,
      )
    ) {
      console.warn(`    → Cursor AI unavailable (${message.split('\n')[0]}); soft-review only`);
      return [];
    }
    throw new Error(`Cursor AI language check failed: ${message}`);
  }
}

function buildPrompt(batch: ClassifyItem[], expectedLanguage: string): string {
  return `You are a careful localization QA classifier for Anytime Fitness lead-form UI copy.

TASK
Decide for EACH item whether the text is written in the page's expected language: **${expectedLanguage}**.

DECISION RULES
1. matches=true when wording is in ${expectedLanguage}.
2. matches=true when text is ONLY a brand/proper noun (Anytime Fitness, Purpose Brands, club names, city names).
3. matches=false when wording is clearly English (or another language) on a ${expectedLanguage} page.
4. Brand words mixed with language: judge by non-brand words.
5. AF product English nouns (Gym, Fitness, Tour, Pass, Club) mixed with ${expectedLanguage} verbs/UI (e.g. German "WÄHLE GYM", "FIND YOUR GYM" brand CTA kept on purpose) → matches=true, detectedLanguage=${expectedLanguage}.
6. Short English UI on non-English pages ("Search", "Submit", "Find Your Gym" when ALL words are English, "Required") → matches=false, detectedLanguage=English.
7. Test gym / QA labels ("asdf (Test Club)", "Test Studio", club IDs) → matches=true (ignore as data, not UI copy).
8. Street / address lines from test gyms ("Test Street", "123 Main Rd", gym city/postal lines) → matches=true (data, not UI chrome).
9. Consent-manager chrome left in English on localized pages ("Cookie Settings", "Allow All", OneTrust/CookiePro) → matches=true.
10. If unsure → matches=true, confidence="low".

Return ONLY a JSON array:
[{"id":"0","detectedLanguage":"English","matches":false,"confidence":"high","reason":"English UI on ${expectedLanguage} page"}]

Items:
${JSON.stringify(batch, null, 2)}
`;
}

function parseVerdicts(
  raw: string,
  batch: ClassifyItem[],
  expectedLanguage: string,
): ModelVerdict[] {
  const jsonText = extractJsonArray(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return batch.map(item => ({
      id: item.id,
      detectedLanguage: 'unknown',
      matches: true,
      confidence: 'low' as const,
      reason: 'AI response could not be parsed — review only',
    }));
  }
  if (!Array.isArray(parsed)) {
    return batch.map(item => ({
      id: item.id,
      detectedLanguage: 'unknown',
      matches: true,
      confidence: 'low' as const,
      reason: 'AI response was not an array — review only',
    }));
  }

  const byId = new Map<string, ModelVerdict>();
  for (const row of parsed) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    const id = String(r.id ?? '');
    if (!id) continue;
    byId.set(id, {
      id,
      detectedLanguage: normalizeLanguageName(String(r.detectedLanguage ?? 'unknown')),
      matches: Boolean(r.matches),
      confidence: normalizeConfidence(r.confidence),
      reason: String(r.reason ?? ''),
    });
  }

  return batch.map(item => {
    const existing = byId.get(item.id);
    if (existing) return existing;
    return {
      id: item.id,
      detectedLanguage: expectedLanguage,
      matches: true,
      confidence: 'low' as const,
      reason: 'Missing from AI response — review only',
    };
  });
}

function normalizeLanguageName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'unknown';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function extractJsonArray(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('[')) return trimmed;
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) return fence[1].trim();
  const start = trimmed.indexOf('[');
  const end = trimmed.lastIndexOf(']');
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

function normalizeConfidence(value: unknown): 'high' | 'medium' | 'low' {
  const v = String(value ?? 'medium').toLowerCase();
  if (v === 'high' || v === 'medium' || v === 'low') return v;
  return 'medium';
}
