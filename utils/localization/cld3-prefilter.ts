import { loadModule, type CldFactory, type LanguageIdentifier } from 'cld3-asm';

export interface Cld3Verdict {
  detectedLanguage: string;
  matches: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

const NAME_TO_CODE: Record<string, string> = {
  English: 'en',
  French: 'fr',
  German: 'de',
  Italian: 'it',
  Arabic: 'ar',
  Thai: 'th',
};

const CODE_TO_NAME: Record<string, string> = {
  en: 'English',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  ar: 'Arabic',
  th: 'Thai',
};

const MATCH_MIN_PROB = numEnv('CLD3_MATCH_MIN_PROB', 0.8);
const MISMATCH_MIN_PROB = numEnv('CLD3_MISMATCH_MIN_PROB', 0.9);
const LATIN_MISMATCH_MIN_WORDS = numEnv('CLD3_LATIN_MIN_WORDS', 6);
const LATIN_MISMATCH_MIN_CHARS = numEnv('CLD3_LATIN_MIN_CHARS', 30);

const NON_LATIN_LANGS = new Set(['ar', 'th', 'ja', 'ko', 'zh', 'hi', 'iw', 'he']);

/**
 * CLD3 routinely confuses short/ALL-CAPS Germanic UI with neighboring codes
 * (German ↔ Luxembourgish is the most common AF false positive).
 * Treat these as matches for the expected language instead of hard mismatches.
 */
const RELATED_LANGUAGE_CODES: Record<string, Set<string>> = {
  // Short ALL-CAPS DE UI is often misread as Danish / Scandinavian / Lux / Dutch.
  de: new Set(['lb', 'nds', 'gsw', 'bar', 'af', 'nl', 'fy', 'da', 'sv', 'no', 'nn', 'nb']),
  it: new Set(['co', 'sc', 'nap', 'scn']),
  fr: new Set(['oc', 'ca', 'wa', 'ht']),
};

/* eslint-disable no-misleading-character-class */
const NON_LATIN_SCRIPT = new RegExp(
  '[' +
    '\\u0370-\\u03FF\\u0400-\\u04FF\\u0590-\\u05FF\\u0600-\\u06FF' +
    '\\u0900-\\u097F\\u0E00-\\u0E7F\\u1100-\\u11FF\\u3040-\\u30FF' +
    '\\u3400-\\u9FFF\\uAC00-\\uD7AF\\uF900-\\uFAFF' +
    ']',
);
/* eslint-enable no-misleading-character-class */

let factoryPromise: Promise<CldFactory> | null = null;
let identifierPromise: Promise<LanguageIdentifier> | null = null;

function numEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function textHasNonLatinScript(text: string): boolean {
  return NON_LATIN_SCRIPT.test(text);
}

function getIdentifier(): Promise<LanguageIdentifier> {
  if (!identifierPromise) {
    if (!factoryPromise) factoryPromise = loadModule();
    identifierPromise = factoryPromise.then(factory => factory.create(1, 2000));
  }
  return identifierPromise;
}

export function isCld3Disabled(): boolean {
  const raw = process.env.DISABLE_CLD3_PREFILTER?.trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
}

function baseCode(code: string): string {
  return code.split('-')[0].toLowerCase();
}

export async function classifyWithCld3(
  items: { id: string; text: string }[],
  expectedLanguage: string,
): Promise<Map<string, Cld3Verdict>> {
  const resolved = new Map<string, Cld3Verdict>();
  if (items.length === 0) return resolved;
  const expectedCode = NAME_TO_CODE[expectedLanguage];
  if (!expectedCode) return resolved;

  const id = await getIdentifier();
  for (const item of items) {
    const verdict = classifyOne(id, item.text, expectedCode, expectedLanguage);
    if (verdict) resolved.set(item.id, verdict);
  }
  return resolved;
}

function classifyOne(
  id: LanguageIdentifier,
  rawText: string,
  expectedCode: string,
  expectedLanguage: string,
): Cld3Verdict | null {
  const text = rawText.trim();
  if (!text) return null;

  let result: ReturnType<LanguageIdentifier['findLanguage']>;
  try {
    result = id.findLanguage(text);
  } catch {
    return null;
  }

  const detectedCode = baseCode(result.language);
  if (!detectedCode || detectedCode === 'und' || !result.is_reliable) return null;

  const prob = result.probability;
  if (detectedCode === expectedCode) {
    if (prob >= MATCH_MIN_PROB) {
      return {
        detectedLanguage: expectedLanguage,
        matches: true,
        confidence: 'high',
        reason: `[cld3] Detected ${expectedLanguage} (p=${prob.toFixed(2)}) — matches page locale`,
      };
    }
    return null;
  }

  // Closely-related language codes → accept as expected locale (CLD3 false positives).
  if (RELATED_LANGUAGE_CODES[expectedCode]?.has(detectedCode) && prob >= MATCH_MIN_PROB) {
    return {
      detectedLanguage: expectedLanguage,
      matches: true,
      confidence: 'high',
      reason: `[cld3] Detected ${detectedCode} (p=${prob.toFixed(2)}) — related to ${expectedLanguage}; treated as match`,
    };
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const strongScriptSignal = textHasNonLatinScript(text) || NON_LATIN_LANGS.has(expectedCode);
  const substantialLatin =
    wordCount >= LATIN_MISMATCH_MIN_WORDS && text.length >= LATIN_MISMATCH_MIN_CHARS;

  if (prob >= MISMATCH_MIN_PROB && (strongScriptSignal || substantialLatin)) {
    return {
      detectedLanguage: CODE_TO_NAME[detectedCode] ?? detectedCode,
      matches: false,
      confidence: 'high',
      reason: `[cld3] Detected ${CODE_TO_NAME[detectedCode] ?? detectedCode} (p=${prob.toFixed(2)}) on ${expectedLanguage} page`,
    };
  }
  return null;
}
