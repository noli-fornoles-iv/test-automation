import { classifyWithCld3, isCld3Disabled } from './cld3-prefilter';
import {
  classifyWithCursorAi,
  isCursorAiAvailable,
  type ClassifyItem,
} from './language-checker-ai';
import { classifyWithLexicon, isLexiconDisabled } from './lexicon-filter';
import { collectLocaleTestDataExclusions, isTestDataOrUserInput } from './test-data-exclusions';
import type { ExtractedFlowText, LanguageCheckResult, UntranslatedScanIssue } from './types';
import { flushCache, getCachedVerdict, setCachedVerdict } from './verdict-cache';

const AF_BRAND_PATTERN =
  /\b(anytime\s*fitness|purpose\s*brands|orangetheory|the\s*bar\s*method|waxing\s*the\s*city|google\s*play|app\s*store|feedback|one\s*trust|cookiepro)\b/gi;

/** AF product English nouns kept on localized CTAs (e.g. DE "WÄHLE GYM"). */
const AF_PRODUCT_ENGLISH = new Set(['gym', 'fitness', 'tour', 'pass', 'club']);

/** Strong German UI tokens (umlaut / lead-flow verbs) for product-English mixes. */
const GERMAN_UI_HINT =
  /[äöüß]|^(lass|uns|dich|den|dem|der|die|das|wähle|waehle|finde|dein|deine|studio|standort|richtigen|ort|bringen|senden|nachricht|vorname|nachname|telefon|absenden)$/i;

export interface CheckFlowTranslationsOptions {
  /** Extra runtime values to skip (form fills, scenarioContext.formData, etc.). */
  excludeTexts?: Iterable<string>;
}

/**
 * CLD3 → lexicon → optional Cursor AI language check for lead-flow visible copy.
 */
export async function checkFlowTranslations(
  texts: ExtractedFlowText[],
  expectedLanguage: string,
  options?: CheckFlowTranslationsOptions,
): Promise<Map<string, LanguageCheckResult>> {
  const results = new Map<string, LanguageCheckResult>();
  const uniqueByText = new Map<string, { kind: string; ids: string[]; stage?: string }>();
  const exclusions = collectLocaleTestDataExclusions(options?.excludeTexts);

  for (let i = 0; i < texts.length; i++) {
    const item = texts[i];
    const id = String(i);
    const text = item.text.trim();

    if (!shouldLanguageCheck(text)) continue;
    if (isTestDataOrUserInput(text, exclusions)) continue;
    if (isBrandOnly(text)) {
      results.set(id, pass(text, expectedLanguage, 'n/a (brand)', 'Brand/proper noun only', item));
      continue;
    }
    if (isLocaleCopyWithAllowedProductEnglish(text, expectedLanguage)) {
      results.set(
        id,
        pass(
          text,
          expectedLanguage,
          expectedLanguage,
          'Locale UI + allowed AF product English (e.g. GYM)',
          item,
        ),
      );
      continue;
    }

    const key = text.toLowerCase().replace(/\s+/g, ' ');
    const existing = uniqueByText.get(key);
    if (existing) existing.ids.push(id);
    else uniqueByText.set(key, { kind: item.kind, ids: [id], stage: item.stage });
  }

  const items: ClassifyItem[] = [...uniqueByText.values()].map((entry, index) => {
    const firstId = entry.ids[0];
    return {
      id: String(index),
      kind: entry.kind,
      text: texts[Number(firstId)].text.trim(),
    };
  });
  const indexToAttrIds = [...uniqueByText.values()].map(e => e.ids);

  const applyVerdict = (
    uniqueId: string,
    verdict: {
      detectedLanguage: string;
      matches: boolean;
      confidence: LanguageCheckResult['confidence'];
      reason: string;
      source: NonNullable<LanguageCheckResult['source']>;
    },
  ) => {
    for (const attrId of indexToAttrIds[Number(uniqueId)] ?? []) {
      const src = texts[Number(attrId)];
      results.set(attrId, {
        text: src?.text.trim() ?? '',
        expectedLanguage,
        detectedLanguage: verdict.detectedLanguage,
        matches: verdict.matches,
        confidence: verdict.confidence,
        reason: verdict.reason,
        source: verdict.source,
        stage: src?.stage,
        kind: src?.kind,
      });
    }
  };

  let cacheHits = 0;
  const afterCache: ClassifyItem[] = [];
  for (const item of items) {
    const cached = getCachedVerdict(expectedLanguage, item.text);
    if (cached) {
      applyVerdict(item.id, cached);
      cacheHits++;
    } else {
      afterCache.push(item);
    }
  }

  const cld3Verdicts = isCld3Disabled()
    ? new Map()
    : await classifyWithCld3(afterCache, expectedLanguage);

  const afterCld3: ClassifyItem[] = [];
  for (const item of afterCache) {
    const verdict = cld3Verdicts.get(item.id);
    if (!verdict) {
      afterCld3.push(item);
      continue;
    }
    const resolved = { ...verdict, source: 'cld3' as const };
    applyVerdict(item.id, resolved);
    setCachedVerdict(expectedLanguage, item.text, resolved);
  }

  const lexiconVerdicts = isLexiconDisabled()
    ? new Map()
    : classifyWithLexicon(afterCld3, expectedLanguage);

  const afterLexicon: ClassifyItem[] = [];
  for (const item of afterCld3) {
    const verdict = lexiconVerdicts.get(item.id);
    if (!verdict) {
      afterLexicon.push(item);
      continue;
    }
    const resolved = { ...verdict, source: 'lexicon' as const };
    applyVerdict(item.id, resolved);
    setCachedVerdict(expectedLanguage, item.text, resolved);
  }

  // Offline heuristic: non-Latin locale + clear English Latin UI → mismatch without AI.
  const aiItems: ClassifyItem[] = [];
  for (const item of afterLexicon) {
    const latinEnglish = detectLatinEnglishOnNonLatinPage(item.text, expectedLanguage);
    if (latinEnglish) {
      const resolved = { ...latinEnglish, source: 'deterministic' as const };
      applyVerdict(item.id, resolved);
      setCachedVerdict(expectedLanguage, item.text, resolved);
      continue;
    }
    aiItems.push(item);
  }

  const useAi = isCursorAiAvailable() && process.env.UNTRANSLATED_TEXT_SKIP_AI !== '1';
  if (useAi && aiItems.length) {
    const aiResults = await classifyWithCursorAi(aiItems, expectedLanguage);
    for (const [uniqueId, verdict] of aiResults) {
      const resolved = {
        detectedLanguage: verdict.detectedLanguage,
        matches: verdict.matches,
        confidence: verdict.confidence,
        reason: verdict.reason,
        source: verdict.source ?? ('cursor-ai' as const),
      };
      applyVerdict(uniqueId, resolved);
      const text = aiItems.find(i => i.id === uniqueId)?.text;
      if (text) setCachedVerdict(expectedLanguage, text, resolved);
    }
    for (const item of aiItems) {
      if (aiResults.has(item.id)) continue;
      applyVerdict(item.id, {
        detectedLanguage: 'unknown',
        matches: true,
        confidence: 'low',
        reason: '[Cursor AI] Missing verdict — review only',
        source: 'cursor-ai',
      });
    }
  } else {
    // Without AI: leave unresolved Latin-script strings as soft review (do not fail CI).
    for (const item of aiItems) {
      applyVerdict(item.id, {
        detectedLanguage: 'unknown',
        matches: true,
        confidence: 'low',
        reason: useAi
          ? '[Cursor AI] skipped'
          : '[offline] Ambiguous without CURSOR_API_KEY — review only (set CURSOR_API_KEY for AI layer)',
        source: 'deterministic',
      });
    }
  }

  console.log(
    `    → Language check: ${items.length} unique · cache ${cacheHits}, CLD3 ${cld3Verdicts.size}, lexicon ${lexiconVerdicts.size}, AI candidates ${aiItems.length}${useAi ? '' : ' (AI off)'}`,
  );

  flushCache();
  return results;
}

export function resultsToIssues(
  results: Map<string, LanguageCheckResult>,
): UntranslatedScanIssue[] {
  const issues: UntranslatedScanIssue[] = [];
  const seen = new Set<string>();

  for (const r of results.values()) {
    if (r.matches && r.confidence !== 'low') continue;
    const key = `${r.text}|${r.matches}|${r.confidence}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const failsCi = !r.matches && r.confidence === 'high';
    if (r.matches && r.confidence === 'low') {
      issues.push({
        type: 'needs_review',
        text: r.text,
        expectedLanguage: r.expectedLanguage,
        detectedLanguage: r.detectedLanguage,
        confidence: r.confidence,
        source: r.source,
        stage: r.stage,
        kind: r.kind,
        failsCi: false,
        message: r.reason,
      });
      continue;
    }
    if (!r.matches) {
      issues.push({
        type: 'language_mismatch',
        text: r.text,
        expectedLanguage: r.expectedLanguage,
        detectedLanguage: r.detectedLanguage,
        confidence: r.confidence,
        source: r.source,
        stage: r.stage,
        kind: r.kind,
        failsCi,
        message: r.reason,
      });
    }
  }
  return issues;
}

function pass(
  text: string,
  expectedLanguage: string,
  detectedLanguage: string,
  reason: string,
  item?: ExtractedFlowText,
): LanguageCheckResult {
  return {
    text,
    expectedLanguage,
    detectedLanguage,
    matches: true,
    confidence: 'high',
    reason,
    source: 'deterministic',
    stage: item?.stage,
    kind: item?.kind,
  };
}

function shouldLanguageCheck(text: string): boolean {
  const t = text.trim();
  if (!t || t.length < 2) return false;
  if (/^[\d\s.,:;!?\-_/\\|@#%&+=*()'"`]+$/.test(t)) return false;
  if (/^https?:\/\//i.test(t)) return false;
  if (/^(list|map|km|mi|©|\*)$/i.test(t)) return false;
  // Club IDs / postal codes
  if (/^[A-Z]{2}-\d{4}$/i.test(t)) return false;
  if (/^\d{4,6}(-\d+)?$/.test(t)) return false;
  return true;
}

function isBrandOnly(text: string): boolean {
  const stripped = text
    .replace(AF_BRAND_PATTERN, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!stripped) return true;
  const words = stripped.split(/\s+/).filter(Boolean);
  // Multi-word leftovers are almost never brand-only (e.g. "Find Your Gym").
  if (words.length !== 1) return false;
  return /^[A-Z0-9][\w'-]*$/i.test(words[0]);
}

/**
 * Localized CTA that keeps AF product English ("WÄHLE GYM", "FIND YOUR GYM" on mixed pages).
 * Non-product tokens must look like the expected language.
 */
function isLocaleCopyWithAllowedProductEnglish(text: string, expectedLanguage: string): boolean {
  const tokens = text.toLowerCase().match(/[\p{L}][\p{L}'’-]*/gu) ?? [];
  if (tokens.length < 2) return false;
  const product = tokens.filter(tok => AF_PRODUCT_ENGLISH.has(tok));
  if (product.length === 0) return false;
  const nonProduct = tokens.filter(tok => !AF_PRODUCT_ENGLISH.has(tok));
  if (nonProduct.length === 0) return true;

  if (expectedLanguage === 'German') {
    return nonProduct.every(tok => GERMAN_UI_HINT.test(tok));
  }
  if (expectedLanguage === 'Italian') {
    return nonProduct.every(tok =>
      /^(il|lo|la|gli|le|un|uno|una|di|del|della|con|per|in|nel|tuo|tua|scegli|trova|palestra|invia|nome|cognome)$/i.test(
        tok,
      ),
    );
  }
  return false;
}

const ENGLISH_UI_WORDS = new Set([
  'the',
  'and',
  'or',
  'of',
  'to',
  'for',
  'in',
  'on',
  'at',
  'with',
  'your',
  'our',
  'find',
  'gym',
  'search',
  'submit',
  'send',
  'required',
  'invalid',
  'please',
  'enter',
  'valid',
  'email',
  'address',
  'phone',
  'message',
  'first',
  'last',
  'name',
  'get',
  'started',
  'today',
  'select',
  'location',
  'current',
  'use',
  'map',
  'list',
  'results',
  'thank',
  'you',
  'success',
  'contact',
  'us',
  'form',
  'free',
  'try',
  'book',
  'tour',
  'visit',
]);

const NON_LATIN_EXPECTED = new Set(['Thai', 'Arabic', 'Japanese', 'Korean', 'Chinese', 'Hebrew']);

/** Clear English Latin UI on Thai/Arabic pages — high-confidence offline mismatch. */
function detectLatinEnglishOnNonLatinPage(
  text: string,
  expectedLanguage: string,
): {
  detectedLanguage: string;
  matches: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
} | null {
  if (!NON_LATIN_EXPECTED.has(expectedLanguage)) return null;
  const t = text.trim();
  // Must be Latin-script dominant (no Thai/Arabic chars).
  if (/[\u0E00-\u0E7F\u0600-\u06FF]/.test(t)) return null;
  if (!/^[A-Za-z0-9\s.,:;!?'"\-_/&()]+$/.test(t)) return null;
  const words = t.toLowerCase().match(/[a-z]{2,}/g) ?? [];
  if (words.length < 2) return null;
  const englishHits = words.filter(w => ENGLISH_UI_WORDS.has(w)).length;
  if (englishHits < 1 && words.length < 3) return null;
  if (englishHits === 0) return null;
  return {
    detectedLanguage: 'English',
    matches: false,
    confidence: 'high',
    reason: `[heuristic] Latin English UI words on ${expectedLanguage} page`,
  };
}
