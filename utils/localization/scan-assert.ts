import type { Page, TestInfo } from '@playwright/test';
import { expect } from '@fixtures/base.fixture';
import type { ScenarioContext } from '@fixtures/base.fixture';
import localeManager from '@utils/locale-utils/locale-manager';
import {
  checkFlowTranslations,
  expectedLanguageForLocale,
  extractGymDataTexts,
  extractVisibleFlowTexts,
  isNonEnglishScanLocale,
  resultsToIssues,
} from '@utils/localization';

const EVENTS_PROMO_IFRAME_SELECTORS = [
  '#tuf-train-for-your-life-event-iframe',
  '#events-promo-iframe',
  '#local-offer-iframe',
  'iframe[src*="promo"]',
  'iframe[src*="event"]',
  'iframe[src*="sit-react"]',
];

const MEMBERSHIP_INQUIRY_IFRAME_SELECTORS = [
  '#membership-inquiry-iframe',
  '#book-a-tour-iframe',
  'iframe[src*="membership"]',
  'iframe[src*="inquiry"]',
  'iframe[src*="sit-react"]',
];

const TRY_US_FREE_IFRAME_SELECTORS = [
  '#try-us-free-iframe',
  '#book-a-tour-iframe',
  'iframe[src*="try-us-free"]',
  'iframe[src*="tryusfree"]',
  'iframe[src*="sit-react"]',
];

const CORPORATE_MEMBERSHIP_IFRAME_SELECTORS = [
  '#corporate-membership-iframe',
  'iframe[src*="corporate"]',
  'iframe[src*="sit-react"]',
];

const CONTACT_US_IFRAME_SELECTORS = [
  '#contact-us-iframe',
  'iframe[src*="contact"]',
  'iframe[src*="sit-react"]',
];

export async function collectUntranslatedScanTexts(
  page: Page,
  scenarioContext: ScenarioContext,
  stage: string,
  options?: { iframeSelectors?: string[]; waitLocator?: { waitFor: (o: object) => Promise<unknown> } },
): Promise<void> {
  if (options?.waitLocator) {
    await options.waitLocator.waitFor({ state: 'attached', timeout: 120_000 }).catch(() => {});
  }
  const texts = await extractVisibleFlowTexts(page, {
    stage,
    iframeSelectors: options?.iframeSelectors,
    iframeOnly: true,
  });
  scenarioContext.untranslatedScanTexts = [
    ...(scenarioContext.untranslatedScanTexts ?? []),
    ...texts,
  ];
}

export async function assertCollectedCopyMatchesLocale(
  scenarioContext: ScenarioContext,
  testInfo: TestInfo,
): Promise<void> {
  const locale = localeManager.getCurrentLocale();
  if (!isNonEnglishScanLocale(locale)) {
    testInfo.annotations.push({
      type: 'skip',
      description: `Untranslated-text scan skipped for English locale ${locale}`,
    });
    return;
  }

  const texts = scenarioContext.untranslatedScanTexts ?? [];
  expect(texts.length, 'Expected collected UI strings for untranslated-text scan').toBeGreaterThan(0);

  const expectedLanguage = expectedLanguageForLocale(locale);
  const excludeTexts = [
    ...Object.values(scenarioContext.formData ?? {}),
    scenarioContext.selectedGymName,
    scenarioContext.selectedGymDisplayName,
    scenarioContext.selectedGymClubId,
    ...extractGymDataTexts(scenarioContext.searchLocationsResponseBody),
    ...extractGymDataTexts(scenarioContext.locationsResponseBody),
  ].filter((v): v is string => typeof v === 'string' && v.trim().length > 0);

  const results = await checkFlowTranslations(texts, expectedLanguage, { excludeTexts });
  const issues = resultsToIssues(results);
  const failing = issues.filter(i => i.failsCi);
  const review = issues.filter(i => !i.failsCi);

  const summary = {
    locale,
    expectedLanguage,
    scannedAt: new Date().toISOString(),
    stringsChecked: texts.length,
    uniqueStrings: results.size,
    failingCount: failing.length,
    reviewCount: review.length,
    issues,
  };

  await testInfo.attach('untranslated-text-scan.json', {
    body: Buffer.from(JSON.stringify(summary, null, 2), 'utf8'),
    contentType: 'application/json',
  });

  const reportLines = [
    `Locale: ${locale} (expected ${expectedLanguage})`,
    `Checked: ${texts.length} strings (${results.size} unique)`,
    `High-confidence mismatches: ${failing.length}`,
    `Needs review: ${review.length}`,
    '',
    ...failing.map(
      i =>
        `FAIL [${i.stage ?? '?'}] "${i.text.slice(0, 120)}" → ${i.detectedLanguage} (${i.source}, ${i.confidence})`,
    ),
    ...review.slice(0, 40).map(
      i =>
        `REVIEW [${i.stage ?? '?'}] "${i.text.slice(0, 120)}" → ${i.detectedLanguage} (${i.source}, ${i.confidence})`,
    ),
  ];
  await testInfo.attach('untranslated-text-scan.txt', {
    body: Buffer.from(reportLines.join('\n'), 'utf8'),
    contentType: 'text/plain',
  });

  const hardFail =
    process.env.UNTRANSLATED_TEXT_FAIL === '1' ||
    process.env.UNTRANSLATED_TEXT_FAIL?.toLowerCase() === 'true';

  if (failing.length === 0) return;

  const message = failing
    .slice(0, 15)
    .map(i => `[${i.stage}] "${i.text.slice(0, 80)}" detected as ${i.detectedLanguage}`)
    .join('\n');

  if (hardFail) {
    expect(failing, `Untranslated / wrong-language copy:\n${message}`).toHaveLength(0);
  } else {
    // Soft mode: attach + annotate only — do not fail the scenario (set UNTRANSLATED_TEXT_FAIL=1 to hard-fail).
    testInfo.annotations.push({
      type: 'warning',
      description: `Untranslated / wrong-language copy (soft):\n${message}`,
    });
  }
}

export {
  EVENTS_PROMO_IFRAME_SELECTORS,
  MEMBERSHIP_INQUIRY_IFRAME_SELECTORS,
  TRY_US_FREE_IFRAME_SELECTORS,
  CORPORATE_MEMBERSHIP_IFRAME_SELECTORS,
  CONTACT_US_IFRAME_SELECTORS,
};
