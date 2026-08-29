/**
 * Maps AF locales to expected natural language for untranslated-text scans.
 */

const LOCALE_LANGUAGE: Record<string, string> = {
  en: 'English',
  'en-us': 'English',
  'en-ca': 'English',
  'en-gb': 'English',
  'en-au': 'English',
  'en-nz': 'English',
  'en-id': 'English',
  'en-ie': 'English',
  'en-za': 'English',
  'en-ae': 'English',
  'en-in': 'English',
  fr: 'French',
  'fr-ca': 'French',
  de: 'German',
  'de-de': 'German',
  'de-at': 'German',
  it: 'Italian',
  'it-it': 'Italian',
  ar: 'Arabic',
  'ar-sa': 'Arabic',
  'ar-ae': 'Arabic',
  th: 'Thai',
  'th-th': 'Thai',
  'zh-hk': 'Chinese',
  zh: 'Chinese',
  'en-ph': 'English',
  'en-sg': 'English',
  'en-my': 'English',
};

/** Locales that should run the untranslated-text scan (non-English primary). */
export const NON_ENGLISH_SCAN_LOCALES = new Set([
  'ar-sa',
  'de-de',
  'de-at',
  'it-it',
  'th-th',
  'fr-ca',
  'zh-hk',
]);

export function expectedLanguageForLocale(locale: string): string {
  const normalized = locale.trim().toLowerCase().replace(/_/g, '-');
  if (LOCALE_LANGUAGE[normalized]) {
    return LOCALE_LANGUAGE[normalized];
  }
  const primary = normalized.split('-')[0];
  if (LOCALE_LANGUAGE[primary]) {
    return LOCALE_LANGUAGE[primary];
  }
  throw new Error(
    `Unsupported locale "${locale}" for untranslated-text scan. Add it to LOCALE_LANGUAGE.`,
  );
}

export function isNonEnglishScanLocale(locale: string): boolean {
  const normalized = locale.trim().toLowerCase().replace(/_/g, '-');
  if (NON_ENGLISH_SCAN_LOCALES.has(normalized)) return true;
  const lang = expectedLanguageForLocale(normalized);
  return lang !== 'English';
}
