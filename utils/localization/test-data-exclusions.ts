import * as fs from 'fs';
import * as path from 'path';
import environmentManager from '@config/environment';
import testStudio from '@resources/locationTestStudio';

/**
 * Flatten all string values from the current locale's test-data.json,
 * AF Test Gyms / locationTestStudio, search API gym payloads, and any
 * runtime form/scenario values so the language scan ignores them.
 */
export function collectLocaleTestDataExclusions(extraTexts?: Iterable<string>): Set<string> {
  const out = new Set<string>();

  try {
    const locale = environmentManager.get('LOCALE').toLowerCase();
    const filePath = path.resolve(`resources/${locale}/test-data.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as unknown;
    walkAndAdd(data, out);
  } catch {
    // Locale test-data missing — still apply gym / pattern / extra exclusions.
  }

  addTestGymCatalogExclusions(out);

  if (extraTexts) {
    for (const value of extraTexts) {
      addExclusion(out, value);
    }
  }

  return out;
}

/** Pull name / address / phone / club-id strings from location API payloads. */
export function extractGymDataTexts(payload: unknown): string[] {
  const out = new Set<string>();
  walkGymPayload(payload, out);
  return [...out];
}

export function isTestDataOrUserInput(text: string, exclusions: Set<string>): boolean {
  const t = text.trim();
  if (!t) return true;

  const lower = t.toLowerCase().replace(/\s+/g, ' ');
  if (exclusions.has(lower)) return true;

  // Explicit AF test-gym labels (SIT often shows "asdf (Test Club)")
  if (/\btest\s+club\b/i.test(t)) return true;
  if (/\(test\s+club\)/i.test(t)) return true;

  // "123 Test", "Test Gym", "Anytime Fitness Test" — street / card lines built from gym labels
  if (isTestGymPlaceLine(lower, exclusions)) return true;

  // Text that is only the gym name prefixed with brand (e.g. "Anytime Fitness Test")
  // or starts with an excluded gym/search token (e.g. "asdf (Test Club)", "ASDF Berlin")
  for (const excl of exclusions) {
    if (excl.length < 2) continue;
    if (excl.length >= 3 || /^\d/.test(excl) || /-/.test(excl)) {
      if (
        lower === excl ||
        lower.startsWith(`${excl} `) ||
        lower.startsWith(`${excl}(`) ||
        lower.startsWith(`${excl}-`) ||
        lower.endsWith(` ${excl}`) ||
        lower.includes(` ${excl} `)
      ) {
        if (
          /^anytime\s+fitness\b/i.test(t) ||
          /^af\s+/i.test(t) ||
          lower === excl ||
          lower.startsWith(excl) ||
          lower.startsWith(`${excl},`) ||
          lower.endsWith(`, ${excl}`)
        ) {
          return true;
        }
      }
    }
  }

  const digits = t.replace(/\D/g, '');
  if (digits.length >= 7 && exclusions.has(digits)) return true;

  // Emails (filled or echoed)
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(t)) return true;
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(t) && t.split(/\s+/).length <= 3) {
    return true;
  }

  // Phone / mostly-numeric contact values
  if (/^[\d\s+().-]{7,}$/.test(t) && digits.length >= 7) return true;

  // Club IDs / studio codes (AF Test Gyms + locationTestStudio)
  if (/^[A-Z]{2}-\d{3,5}$/i.test(t)) return true;
  if (/^\d{7}$/.test(t)) return true; // US/CA numeric club ids e.g. 9993999
  if (/^[a-z]{2}-test-studio$/i.test(t)) return true;
  if (/\btest[-\s]?studio\b/i.test(t)) return true;
  // Explicit AF test-gym address / title patterns (TH card shows "123 Test")
  if (/^\d+\s+test\b/i.test(t)) return true;
  if (/^test(\s+studio|\s+town|\s+gym)?$/i.test(t)) return true;

  // Postal / zip style
  if (/^\d{4,6}(-\d{1,5})?$/.test(t)) return true;
  if (/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(t)) return true; // UK-ish

  // Map distance chip on gym cards (not copy to translate)
  if (/^\d+([.,]\d+)?\s*(km|mi|m)$/i.test(t)) return true;

  // Street / gym address lines (data, not UI chrome)
  if (looksLikeAddress(t)) return true;

  // OneTrust / CookiePro host chrome (often left in English on localized pages)
  if (isConsentManagerChrome(t)) return true;

  // QA emails used by Helpers.generateRandomEmail
  if (/@ignitevisibility\.com$/i.test(t)) return true;

  return false;
}

/**
 * Gym card / form header lines composed from Local Config / AF Test Gyms values
 * (e.g. "123 Test", "Test, Bangkok", club id + name).
 */
function isTestGymPlaceLine(lower: string, exclusions: Set<string>): boolean {
  // Strip leading house numbers / unit markers → leftover should be an excluded gym label
  const withoutLeadingNumber = lower.replace(/^\d+[a-z]?\s+/, '').trim();
  if (withoutLeadingNumber && exclusions.has(withoutLeadingNumber)) return true;

  // Strip all digit runs and punctuation; if remaining words are only exclusion tokens → gym data
  const words = lower
    .replace(/[\d#]+/g, ' ')
    .replace(/[.,/|;()[\]{}]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  if (words.length === 0) return true;
  if (
    words.length <= 4 &&
    words.every(w => exclusions.has(w) || /^(st|rd|ave|blvd|soi|km|mi)$/i.test(w))
  ) {
    return words.some(w => exclusions.has(w));
  }

  // Contains "test" gym token plus a number (address / title on results cards)
  if (/\btest\b/.test(lower) && /\d/.test(lower) && exclusions.has('test')) return true;

  return false;
}

function addTestGymCatalogExclusions(out: Set<string>): void {
  // locationTestStudio.ts — every locale's automation club id
  for (const clubId of Object.values(testStudio)) {
    addExclusion(out, clubId);
  }

  // Common AF Test Gym display / slug labels used across locales
  for (const label of [
    'Test',
    'Test Studio',
    'Test Town',
    'Test Club',
    'Test Street',
    'test strret',
    'test strret 2',
    'AF Test',
    'Anytime Fitness Test',
    'th-test-studio',
    'Woodbury',
    'Saint Paul',
    'Crows Nest',
    'Arjan',
    'ASDF',
    'Wels',
    'Wels (Test Diff)',
  ]) {
    addExclusion(out, label);
  }

  // Synced AF Test Gyms sheet (club ids + phones + city fragments)
  try {
    const csvPath = path.resolve('.cursor/knowledge-base/links/test-gyms.csv');
    if (!fs.existsSync(csvPath)) return;
    const csv = fs.readFileSync(csvPath, 'utf-8');
    for (const match of csv.matchAll(/\b([A-Z]{2}-\d{3,5}|9{2,}\d{4,5})\b/g)) {
      addExclusion(out, match[1]);
    }
    for (const match of csv.matchAll(/\b(\d{8,15})\b/g)) {
      addExclusion(out, match[1]);
    }
    // "City, State" style snippets in quotes
    for (const match of csv.matchAll(/"([^"]+,\s*[A-Z]{2,})"/g)) {
      addExclusion(out, match[1]);
      for (const part of match[1].split(',')) {
        addExclusion(out, part);
      }
    }
  } catch {
    // KB csv optional
  }
}

function walkGymPayload(value: unknown, out: Set<string>): void {
  if (value === null) return;
  if (typeof value === 'string' || typeof value === 'number') {
    addExclusion(out, String(value));
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walkGymPayload(item, out);
    return;
  }
  if (typeof value !== 'object') return;

  const obj = value as Record<string, unknown>;
  const gymKeys = new Set([
    'name',
    'id',
    'location_number',
    'locationNumber',
    'location_id',
    'locationId',
    'phone_number',
    'phoneNumber',
    'address1',
    'address2',
    'city',
    'state',
    'country',
    'state_abbr',
    'country_abbr',
    'postal_code',
    'postalCode',
    'slug',
    'geo_code_short',
    'club-id',
    'clubId',
    'address-city',
    'address-state-province',
    'address-post-code',
    'address-street',
    'address-country',
    'phone-2',
    'localGym',
    'localGymSlug',
  ]);

  for (const [key, child] of Object.entries(obj)) {
    if (key === 'address' || key === 'items' || gymKeys.has(key)) {
      walkGymPayload(child, out);
    } else if (typeof child === 'object' && child !== null) {
      // Still walk nested location-shaped objects
      if ('location_number' in (child as object) || 'locationNumber' in (child as object)) {
        walkGymPayload(child, out);
      }
    }
  }
}

function walkAndAdd(value: unknown, out: Set<string>): void {
  if (typeof value === 'string') {
    addExclusion(out, value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walkAndAdd(item, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const child of Object.values(value as Record<string, unknown>)) {
      walkAndAdd(child, out);
    }
  }
}

function addExclusion(out: Set<string>, raw: string): void {
  const t = String(raw).trim();
  if (t.length < 2) return;
  if (/^n\/?a$/i.test(t)) return;
  out.add(t.toLowerCase().replace(/\s+/g, ' '));
  const digits = t.replace(/\D/g, '');
  if (digits.length >= 7) out.add(digits);
  // Slug-like Local Config values (e.g. asdf-berlin-de-0004) → also exclude tokens
  if (/-/.test(t) && t.length >= 5) {
    for (const part of t.split(/[-_/]/)) {
      const p = part.trim().toLowerCase();
      if (
        p.length >= 3 &&
        !/^\d+$/.test(p) &&
        !/^(de|at|th|en|us|gb|ie|za|ca|au|nz|sg|ph|id|ae|in|sa|it|fr)$/i.test(p)
      ) {
        out.add(p);
      }
    }
  }
}

function looksLikeAddress(text: string): boolean {
  const t = text.trim();
  if (t.length < 5 || t.length > 200) return false;

  // "123 Test" / "123 Something" house-number + short label (AF test gym cards)
  if (/^\d{1,5}\s+[A-Za-z\u0E00-\u0E7F][\w\u0E00-\u0E7F' -]{1,40}$/i.test(t)) return true;

  // "Test Street" / "Main Road" — street-type token without a leading house number (AF test gyms)
  if (
    /^(test\s+)?[\w' -]{2,40}\s+(st|street|rd|road|ave|avenue|blvd|boulevard|ln|lane|dr|drive|way|court|ct|strasse|straße|strret)\.?$/i.test(
      t,
    )
  ) {
    return true;
  }

  // "123 Something Road/St/Ave..." or Thai ถนน / ซอย
  if (
    /\d{1,5}\s+.+/i.test(t) &&
    /\b(st|street|rd|road|ave|avenue|blvd|boulevard|ln|lane|dr|drive|way|court|ct|plaza|suite|unit|floor|soi|road|strasse|straße|strret)\b/i.test(
      t,
    )
  ) {
    return true;
  }
  if (/ถนน|ซอย|แขวง|เขต|จังหวัด/.test(t) && /\d/.test(t)) return true;

  // Comma-separated city/region lines with a postal code
  if (/,/.test(t) && /\d{4,6}/.test(t) && t.split(',').length >= 2) return true;

  return false;
}

/** OneTrust / CookiePro floating UI often remains English on non-EN locales. */
function isConsentManagerChrome(text: string): boolean {
  const t = text.trim().toLowerCase().replace(/\s+/g, ' ');
  return (
    /^(cookie settings|cookies settings|manage cookies|cookie preferences|privacy settings|onetrust|cookiepro)$/i.test(
      t,
    ) || /^(allow all|reject all|confirm my choices|accept all cookies)$/i.test(t)
  );
}
