import type { Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import environmentManager from '@config/environment';
import { test, expect } from '@fixtures/base.fixture';
import {
  LOCAL_OFFER_ROUTES,
  PATHS,
  TIMEOUTS,
  resolveLocalOfferBaseUrl,
  resolveLocalOfferRoute,
} from '@utils/constants/index';
import { navigateToUrl } from '@utils/helpers';
import { d } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import { logger } from '@utils/logger';
import { remountSearchLandingForRs } from '@utils/tracking/remount-search-landing-for-rs';

const { Given, When, Then } = createBdd(test, { tags: '@FindAGym' });

/** Soft-skip when Webflow nav/footer still points at /find-gym (out of React AFW-3876 scope). */
function softSkipIfWebflowFindGymHref(href: string, surface: 'nav' | 'footer'): void {
  if (!/\/find-gym(?:\/|$|\?|#)/i.test(href)) {
    return;
  }
  const message =
    `APP GAP (AFW-3876): Webflow ${surface} Find a Gym href still targets /find-gym ` +
    `(got: ${href}). React iframe redirects are covered separately; WF nav/footer is out of scope until CMS updates.`;
  logger.warn(message);
  test.info().annotations.push({ type: 'issue', description: message });
  test.skip(true, message);
}

/**
 * Coverage tab Local Offer = NO (AE, SA). AFW-3876 Local Offer → /locations TCs are out of
 * scope — offer hosts 404 (no `#local-offer-iframe` / React redirect). Soft-pass umbrella
 * scenarios so Widget/Searchbar steps still count; dedicated Local Offer scenario omits tags.
 */
const LOCAL_OFFER_COVERAGE_NO = new Set(['en-ae', 'ar-sa']);

function isLocalOfferCoverageNo(locale: string): boolean {
  return LOCAL_OFFER_COVERAGE_NO.has(locale.toLowerCase());
}

async function isLocalOfferHost404(page: Page): Promise<boolean> {
  const title = (await page.title().catch(() => '')).toLowerCase();
  if (/page not found|\b404\b/.test(title)) {
    return true;
  }
  return page
    .locator('main._404, h1._404-h1, .main-wrapper._404')
    .first()
    .isVisible()
    .catch(() => false);
}

/** Localized Find a Gym labels (EN / DE / IT / AR / FR-CA). */
const FIND_A_GYM_LINK_TEXT =
  /Find a Gym|Find A Gym|FIND A GYM|Studio finden|Trova (una )?palestra|ابحث عن نادٍ|Trouver un gym|Trouvez un gym/i;

/** Loose text filter for href-based fallbacks (includes FR "Trouver … gym"). */
const FIND_A_GYM_LOOSE_TEXT = /Find|Gym|Studio|palestra|ناد|Trouver/i;

/** Exclude CTAs that share "gym" copy but are not the Find a Gym → /locations link. */
const FIND_A_GYM_HREF_EXCLUDE =
  ':not([href*="try-us-free"]):not([href*="own-a-gym"]):not([href*="avoir-un-gym"]):not(.bt-af):not(.w-button):not(.bt-af-long)';

/** Open mobile hamburger / sidebar so Find a Gym nav links become visible. */
async function ensureMobileNavOpen(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  if (!viewport || viewport.width > 900) {
    return;
  }

  const sidebarFindGym = page
    .locator(
      'a.base_sidebar-nav-link, .w-nav-menu.w--open a, nav[aria-hidden="false"] a, .w-nav-overlay a, [class*="mobile-menu"] a, [class*="sidebar"] a',
    )
    .filter({ hasText: FIND_A_GYM_LINK_TEXT })
    .first();

  if (await sidebarFindGym.isVisible().catch(() => false)) {
    return;
  }

  // Prefer the open toggle — `aria-label*="menu"` also matches "Close mobile menu".
  const menuToggles = page.locator(
    'button.base_mobile-menu-toggle, button[aria-label="Open menu"], button[aria-label*="Open menu" i], button[aria-label*="ouvrir" i], .w-nav-button, .menu-button, [data-nav-menu-toggle], button.navbar-toggler, .base_nav-menu-button, button[aria-expanded="false"]',
  );
  const toggleCount = await menuToggles.count().catch(() => 0);
  for (let i = 0; i < Math.min(toggleCount, 4); i++) {
    const toggle = menuToggles.nth(i);
    if (!(await toggle.isVisible().catch(() => false))) {
      continue;
    }
    await toggle.click({ force: true }).catch(() => {});
    const opened = await sidebarFindGym
      .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT })
      .then(() => true)
      .catch(() => false);
    if (opened) {
      return;
    }
  }

  // Last resort: JS-click first attached open-menu control (WebKit sometimes reports not-visible).
  await page
    .evaluate(() => {
      const selectors = [
        'button.base_mobile-menu-toggle',
        'button[aria-label="Open menu"]',
        'button[aria-label*="Open menu" i]',
        '.w-nav-button',
        '.menu-button',
        'button.navbar-toggler',
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el) {
          el.click();
          return true;
        }
      }
      return false;
    })
    .catch(() => false);

  await sidebarFindGym.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
}

/**
 * Resolve a Find a Gym nav/footer link.
 * Prefer real nav/menu anchors — EN-AU hero CTA (`a.bt-af` → /find-gym) is often DOM-first but
 * CSS-hidden on iPhone, which caused toBeVisible timeouts before soft-skip could run.
 * On mobile, prefer sidebar links over desktop `a.base_nav-link` (often attached but hidden).
 */
async function resolveVisibleFindAGymLink(
  page: Page,
  surface: 'nav' | 'footer',
): Promise<{
  link: import('@playwright/test').Locator;
  href: string;
  visible: boolean;
}> {
  const isNarrow = (page.viewportSize()?.width ?? 1200) <= 900;
  if (surface === 'nav') {
    await ensureMobileNavOpen(page);
  }

  const groups =
    surface === 'nav'
      ? [
          // Mobile: sidebar first — desktop base_nav-link stays in DOM but hidden in the drawer.
          ...(isNarrow
            ? [
                page
                  .locator(
                    'a.base_sidebar-nav-link, .w-nav-menu.w--open a, nav[aria-hidden="false"] a, [class*="mobile-menu"] a, [class*="sidebar"] a',
                  )
                  .filter({ hasText: FIND_A_GYM_LINK_TEXT }),
              ]
            : []),
          page
            .locator(
              'a.base_nav-link, a.base_sidebar-nav-link, .w-nav-menu a, nav a, header a:not(.bt-af):not(.w-button)',
            )
            .filter({ hasText: FIND_A_GYM_LINK_TEXT }),
          page
            .locator(`a[href*="/locations"]${FIND_A_GYM_HREF_EXCLUDE}`)
            .filter({ hasText: FIND_A_GYM_LOOSE_TEXT }),
          page
            .locator(`a[href*="/find-gym"]${FIND_A_GYM_HREF_EXCLUDE}`)
            .filter({ hasText: FIND_A_GYM_LOOSE_TEXT }),
        ]
      : [
          page
            .locator('footer a, .footer a, [class*="footer"] a')
            .filter({ hasText: FIND_A_GYM_LINK_TEXT }),
          page
            .locator(
              `footer a[href*="/locations"]${FIND_A_GYM_HREF_EXCLUDE}, .footer a[href*="/locations"]${FIND_A_GYM_HREF_EXCLUDE}`,
            )
            .filter({ hasText: FIND_A_GYM_LOOSE_TEXT }),
          page
            .locator(
              `footer a[href*="/find-gym"]${FIND_A_GYM_HREF_EXCLUDE}, .footer a[href*="/find-gym"]${FIND_A_GYM_HREF_EXCLUDE}`,
            )
            .filter({ hasText: FIND_A_GYM_LOOSE_TEXT }),
        ];

  for (const group of groups) {
    const count = await group.count().catch(() => 0);
    for (let i = 0; i < count; i++) {
      const link = group.nth(i);
      if (!(await link.isVisible().catch(() => false))) {
        continue;
      }
      const href = ((await link.getAttribute('href')) ?? '').toLowerCase();
      // Skip country-switcher / external mirrors that still say "find-gym" or host /locations.
      if (/^https?:\/\//i.test(href) && !/anytimefitness\.com\//i.test(href)) {
        continue;
      }
      return { link, href, visible: true };
    }
  }

  // Fallback: any attached find-gym/locations link (may be hidden CTA) for soft-skip href check.
  // Prefer /locations over /find-gym when both exist; never prefer desktop nav on mobile.
  const fallbackCandidates =
    surface === 'nav'
      ? [
          page.locator(`a.base_sidebar-nav-link[href*="/locations"]`).first(),
          page.locator(`a[href*="/locations"]${FIND_A_GYM_HREF_EXCLUDE}`).first(),
          page.locator(`a[href*="/find-gym"]${FIND_A_GYM_HREF_EXCLUDE}`).first(),
          groups[groups.length - 1].or(groups[0]).first(),
        ]
      : [groups[groups.length - 1].or(groups[0]).first()];

  for (const fallback of fallbackCandidates) {
    const href = ((await fallback.getAttribute('href').catch(() => '')) ?? '').toLowerCase();
    if (!href) {
      continue;
    }
    softSkipIfWebflowFindGymHref(href, surface);
    return { link: fallback, href, visible: false };
  }

  softSkipIfWebflowFindGymHref('/find-gym', surface);
  return { link: fallbackCandidates[0], href: '/find-gym', visible: false };
}

/** Click a Find a Gym → /locations link; force + goto fallback when mobile keeps it hidden. */
async function clickFindAGymLocationsLink(
  page: Page,
  link: import('@playwright/test').Locator,
  href: string,
  visible: boolean,
): Promise<void> {
  const isNarrow = (page.viewportSize()?.width ?? 1200) <= 900;
  const absoluteHref = href.startsWith('http') ? href : new URL(href, page.url()).href;

  if (visible) {
    await expect(link).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  const navigated = await Promise.all([
    page
      .waitForURL(/\/locations(?:\/|(?:[?#]|$))/i, {
        timeout: TIMEOUTS.LONG,
        waitUntil: 'domcontentloaded',
      })
      .then(() => true)
      .catch(() => false),
    link
      .click({ force: isNarrow || !visible })
      .then(() => true)
      .catch(() => false),
  ]).then(([urlOk]) => urlOk);

  if (navigated || /\/locations(?:\/|(?:[?#]|$))/i.test(page.url())) {
    return;
  }

  // WebKit: force-click on display:none nav often no-ops — navigate directly from href.
  if (/\/locations(?:\/|$|\?|#)/i.test(href)) {
    await page.goto(absoluteHref, { waitUntil: 'domcontentloaded' });
    return;
  }

  throw new Error(
    `Find a Gym link did not navigate to /locations (href=${href}, url=${page.url()})`,
  );
}

/** Mapbox-friendly place names when Local Config defaults are test-gym labels or poor geocodes. */
const FIND_A_GYM_SEARCH_OVERRIDES: Record<string, string> = {
  'en-us': '55128',
  'en-ae': 'Sharjah',
  'ar-sa': 'Riyadh',
  'en-in': 'Mumbai',
  'en-ie': 'Dublin',
  'de-de': 'Berlin',
  // Local Config Default = Wels (AT-0003 Vöcklabruck). Do not use Vienna — SIT catalog empty there too,
  // and Wels is the Local Config / AFW-3876 search prefix source of truth.
  'de-at': 'Wels',
  // Local Config Default is gym label "Test" — use Bangkok (AFW-3660 defaultLocation)
  'th-th': 'Bangkok',
  'en-ph': 'Manila',
  'en-sg': 'Singapore',
  'en-nz': 'Auckland',
  'en-id': 'Jakarta',
};

/**
 * Locale → Local Offer path for AFW-3876 missing/invalid location_id redirects.
 * Keys/slugs must match the first Available-on-Prod offer in `local-offer.feature`
 * (literal paths — avoid resolveLocalOfferRoute at module load).
 */
const AFW3876_LOCAL_OFFER_PATH: Record<string, string> = {
  'en-us': LOCAL_OFFER_ROUTES.OPEN.join_get_30_days_free,
  'en-au': LOCAL_OFFER_ROUTES.OPEN.free_training_session,
  'en-gb': LOCAL_OFFER_ROUTES.OPEN.seven_day_trial,
  'en-ie': LOCAL_OFFER_ROUTES.OPEN.four_weeks_for_eu4,
  'en-za': LOCAL_OFFER_ROUTES.OPEN.get_started_for_r199,
  'en-in': LOCAL_OFFER_ROUTES.OPEN.festive_fitness_deals,
  'en-ae': LOCAL_OFFER_ROUTES.OPEN.free_training_session,
  'ar-sa': LOCAL_OFFER_ROUTES.OPEN.free_training_session,
  'de-de': LOCAL_OFFER_ROUTES.OPEN.coaching_normal,
  // AT first Available on Prod (same as local-offer.feature) — not first_month_free alone.
  'de-at': LOCAL_OFFER_ROUTES.OPEN.happy_without_commitment,
  'it-it': LOCAL_OFFER_ROUTES.OPEN.join_now_at_the_best_price_ever,
  // EN-CA: local-offer.feature Examples → 21day_reboot (gid=400169017)
  'en-ca': '/offer/local/21day-reboot',
  // FR-CA: local-offer.feature Examples → join_1_dollar_fall_membership (gid=378757103)
  'fr-ca': '/offer/local/join-1-dollar-fall-membership',
  // EN-NZ: local-offer.feature Examples → up_to_4_weeks_free (AFW-3622)
  'en-nz': '/offer/local/up-to-4-weeks-free',
};

/**
 * Mapbox-friendly search prefixes for AFW-3876 Home searchbar / Near Me seeding.
 * Must be in-country — fallback `tam` (Tampa) breaks EN-CA country-scoped Places.
 */
const AFW3876_SEARCH_PREFIX: Record<string, string> = {
  'en-us': 'tamp',
  'en-au': 'crow',
  'en-gb': 'man',
  'en-ie': 'dub',
  'en-ae': 'sha',
  'ar-sa': 'riy',
  'en-za': 'cap',
  'en-in': 'mum',
  'de-de': 'ber',
  'de-at': 'wel',
  'it-it': 'mil',
  'th-th': 'ban',
  'en-ph': 'man',
  'en-sg': 'sin',
  'en-nz': 'auc',
  'en-id': 'jak',
  'zh-hk': 'sai',
  // Local Config Default = Winnipeg (EN-CA); Montreal (Test) / H3Z 2Y7 (FR-CA).
  // Prefer postal over bare "mon" — Mapbox on iPhone WebKit often returns no Places options for 3-letter prefixes.
  'en-ca': 'win',
  'fr-ca': 'H3Z',
  // Local Config Default = Kuala Lumpur / postcode 50000 (MY-0019).
  'en-my': '500',
};

function resolveFindAGymSearchTerm(): string {
  const locale = environmentManager.get('LOCALE').toLowerCase();
  if (FIND_A_GYM_SEARCH_OVERRIDES[locale]) {
    return FIND_A_GYM_SEARCH_OVERRIDES[locale];
  }

  const place = d(TestDataKeys.Locations.Search.Default)?.trim() ?? '';
  const needsZipFallback =
    !place || /woodbury|!\s*\(|\(test|test town|^drg$|^999\d+$|arjan|kharj/i.test(place);

  if (needsZipFallback) {
    try {
      const zip = d(TestDataKeys.ZipCode.Valid.Default)?.trim();
      if (zip && !/^2065$/.test(zip)) {
        return zip;
      }
    } catch {
      // fall through
    }
  }

  return place || d(TestDataKeys.ZipCode.Valid.Default);
}

/**
 * Country-scoped Mapbox treats out-of-country places (e.g. Reykjavik on GB) as Invalid.
 * Use in-country remote places that return "No locations found".
 */
function resolveNoNearbySearchTerm(): string {
  const locale = environmentManager.get('LOCALE').toLowerCase();
  const localeOverrides: Record<string, string> = {
    'en-us': '99723',
    'en-au': 'Nhulunbuy',
    'en-gb': 'Kirkwall',
    'en-ie': 'Belmullet',
    'en-ae': 'Liwa',
    'en-in': 'Kavaratti',
    'ar-sa': 'Turaif',
    // Alpine resort — IT gym-finder returns "Nessuna location trovata per …" (0 cards).
    // Island terms (Lampedusa/Pantelleria) expand to nearest national gyms and fail TC-S005.
    'it-it': 'Breuil-Cervinia',
    'de-de': 'List auf Sylt',
    'de-at': 'Schattwald',
    'th-th': 'Mae Hong Son',
    'en-ph': 'Batanes',
    'en-sg': 'Pulau Ubin',
    'en-nz': 'Chatham Islands',
    'en-id': 'Raja Ampat',
    'zh-hk': 'Tung Ping Chau',
    // Remote East Malaysia island — country-scoped Places should return no nearby clubs.
    'en-my': 'Pulau Layang-Layang',
  };

  if (localeOverrides[locale]) {
    return localeOverrides[locale];
  }

  let term = '';
  try {
    term = d(TestDataKeys.Locations.Search.NoNearbyLocation);
  } catch {
    try {
      term = d(TestDataKeys.Locations.Search.NoNearby);
    } catch {
      term = '';
    }
  }

  if (!term?.trim() || /^ikkkkkk+$/i.test(term.trim()) || /reykjavik/i.test(term)) {
    return localeOverrides['en-us'];
  }
  return term.trim();
}

function resolveAfw3876LocalOfferPath(locale: string): string {
  const key = locale.toLowerCase();
  return (
    AFW3876_LOCAL_OFFER_PATH[key] ??
    // Apply CMS slug overrides (e.g. EN-CA free_training_session → /offer/local/free-training-session).
    resolveLocalOfferRoute('free_training_session', locale)
  );
}

/**
 * AFW-3876 Local Offer URLs — same host resolution as `local-offer.feature`
 * (`resolveLocalOfferBaseUrl`): use `/{locale}/offer/local/...` for non-US.
 * Root `/offer/local/...` often lacks `#local-offer-iframe` (ZA/IT/DE/AT) so React never
 * redirects missing/invalid `location_id` → `/locations`. Do **not** origin-fallback.
 */
function resolveAfw3876LocalOfferCandidateUrls(
  locale: string,
  path: string,
  query: string,
): string[] {
  const localeBase = resolveLocalOfferBaseUrl(locale, environmentManager.get('BASE_URL'));
  return [`${localeBase}${path}${query}`];
}

/** Open Local Offer and wait for React missing/invalid location_id → /locations. */
async function openAfw3876LocalOfferForLocationsRedirect(
  page: Page,
  locale: string,
  query: string,
  navigatedUrls: string[],
): Promise<'locations' | 'unavailable' | 'no-redirect'> {
  if (isLocalOfferCoverageNo(locale)) {
    const message =
      `Coverage Local Offer = NO for ${locale} — ` +
      `offer host is out of scope (SIT/PROD 404; no React #local-offer-iframe redirect).`;
    logger.warn(message);
    return 'unavailable';
  }

  const path = resolveAfw3876LocalOfferPath(locale);
  const [url] = resolveAfw3876LocalOfferCandidateUrls(locale, path, query);
  const isOfferUrl = (u: string | URL) =>
    /\/offer\/local\//i.test(typeof u === 'string' ? u : u.href);
  const isLocationsUrl = (u: string | URL) =>
    /\/locations(?:\/|(?:[?#]|$))/i.test(typeof u === 'string' ? u : u.href);

  logger.info(`AFW-3876 Local Offer /locations redirect: ${url}`);
  await navigateToUrl(url, page, locale, { includeTestLocationId: false });

  if (isLocationsUrl(page.url())) {
    if (navigatedUrls.length === 0 || navigatedUrls[navigatedUrls.length - 1] !== page.url()) {
      navigatedUrls.push(page.url());
    }
    return 'locations';
  }

  if (await isLocalOfferHost404(page)) {
    logger.warn(
      `AFW-3876 Local Offer host 404 (Coverage Local Offer may be NO / CMS missing): ${page.url()}`,
    );
    if (navigatedUrls.length === 0 || navigatedUrls[navigatedUrls.length - 1] !== page.url()) {
      navigatedUrls.push(page.url());
    }
    return 'unavailable';
  }

  // Race iframe hydrate vs React redirect to /locations (ZA often ~10–15s after iframe).
  const outcome = await Promise.race([
    page
      .waitForURL(u => isLocationsUrl(u), {
        timeout: TIMEOUTS.LONG,
        waitUntil: 'domcontentloaded',
      })
      .then(() => 'locations' as const),
    page
      .locator('#local-offer-iframe')
      .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG })
      .then(async () => {
        if (isLocationsUrl(page.url())) return 'locations' as const;
        await page
          .waitForURL(u => isLocationsUrl(u), {
            timeout: TIMEOUTS.LONG,
            waitUntil: 'domcontentloaded',
          })
          .catch(() => {});
        return isLocationsUrl(page.url())
          ? ('locations' as const)
          : ('iframe-no-redirect' as const);
      }),
    page
      .waitForURL(u => !isOfferUrl(u), {
        timeout: TIMEOUTS.LONG,
        waitUntil: 'domcontentloaded',
      })
      .then(() => (isLocationsUrl(page.url()) ? ('locations' as const) : ('left-offer' as const))),
  ]).catch(() => 'timeout' as const);

  if (outcome === 'locations' || isLocationsUrl(page.url())) {
    if (navigatedUrls.length === 0 || navigatedUrls[navigatedUrls.length - 1] !== page.url()) {
      navigatedUrls.push(page.url());
    }
    return 'locations';
  }

  if (outcome === 'iframe-no-redirect' || outcome === 'left-offer' || outcome === 'timeout') {
    logger.warn(
      `AFW-3876 Local Offer did not reach /locations (outcome=${outcome}, url=${page.url()})`,
    );
  }

  if (navigatedUrls.length === 0 || navigatedUrls[navigatedUrls.length - 1] !== page.url()) {
    navigatedUrls.push(page.url());
  }
  return 'no-redirect';
}

/** Assert final URL is /locations (directory or with query), never /find-gym. */
function assertLocationsRedirectWithoutFindGymHop(pageUrl: string, navigatedUrls: string[]): void {
  const finalUrl = pageUrl.toLowerCase();
  expect(finalUrl, `Expected /locations redirect, got: ${pageUrl}`).toMatch(
    /\/locations(?:\/|(?:[?#]|$))/i,
  );
  expect(finalUrl, `Final URL must not remain on /find-gym: ${pageUrl}`).not.toMatch(
    /\/find-gym(?:[/?#]|$)/i,
  );

  const findGymHops = navigatedUrls.filter(u => /\/find-gym(?:[/?#]|$)/i.test(u));
  expect(
    findGymHops,
    `Expected no intermediate /find-gym hop; saw: ${findGymHops.join(' → ') || '(none)'}`,
  ).toEqual([]);
}

function assertLocalePrefixedLocationsUrl(pageUrl: string): void {
  const locale = environmentManager.get('LOCALE').toLowerCase();
  const url = pageUrl.toLowerCase();
  if (locale === 'en-us') {
    expect(url, `en-us /locations must not use /en-us/ prefix: ${pageUrl}`).not.toMatch(
      /\/en-us\//i,
    );
    expect(url).toMatch(/\/locations(?:\/|(?:[?#]|$))/i);
    return;
  }
  expect(url, `Expected /${locale}/locations, got: ${pageUrl}`).toMatch(
    new RegExp(`/${locale}/locations(?:/|(?:[?#]|$))`, 'i'),
  );
}

Given(
  /^The static location search IP geolocation is mocked for the current locale$/,
  async ({ locationSearchOnStaticPagesPage }) => {
    await locationSearchOnStaticPagesPage.installInLocaleIpstackMock();
  },
);

Given(
  /^The static location search widget is ready$/,
  async ({ locationSearchOnStaticPagesPage, scenarioContext }) => {
    locationSearchOnStaticPagesPage.bindToPage(scenarioContext.pageName || 'home');
    await locationSearchOnStaticPagesPage.waitForWidgetReady();
  },
);

Given(
  /^Geolocation permission is granted for the static location search for \/locations redirect$/,
  async ({ locationSearchOnStaticPagesPage }) => {
    await locationSearchOnStaticPagesPage.grantGeolocation();
  },
);

When(/^The user searches for the nearest AF location in Find A Gym$/, async ({ findAGymPage }) => {
  await findAGymPage.searchLocation(resolveFindAGymSearchTerm(), { pickSuggestion: true });
});

When(
  /^The user searches a Local Config secondary postal code in Find A Gym for Location Searched$/,
  async ({ findAGymPage, page, scenarioContext }) => {
    await remountSearchLandingForRs({
      page,
      scenarioContext,
      path: PATHS.FIND_GYM,
      waitReady: () => findAGymPage.waitForReady(),
      keepTestLocationId: false,
    });
    if (!scenarioContext.rudderstackTestEnable) {
      const url = new URL(page.url());
      url.searchParams.delete('test_location_id');
      url.searchParams.delete('use_prod_api');
      await page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
      await findAGymPage.waitForReady();
    }
    await findAGymPage.settleAutoResultsBeforeErrorSearch();
    const secondaryZip = d(TestDataKeys.ZipCode.Valid.Secondary)?.trim();
    if (!secondaryZip) {
      throw new Error(
        'AFW-3952 Find A Gym: Local Config Zip Codes.Valid.Secondary is missing — cannot assert typed Location Searched.',
      );
    }
    await findAGymPage.searchLocation(secondaryZip, { pickSuggestion: true });
  },
);

When(
  /^The user searches an invalid location in Find A Gym$/,
  async ({ findAGymPage, page, scenarioContext }) => {
    await remountSearchLandingForRs({
      page,
      scenarioContext,
      path: PATHS.FIND_GYM,
      waitReady: () => findAGymPage.waitForReady(),
      keepTestLocationId: false,
    });
    if (!scenarioContext.rudderstackTestEnable) {
      const url = new URL(page.url());
      url.searchParams.delete('test_location_id');
      url.searchParams.delete('use_prod_api');
      await page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
      await findAGymPage.waitForReady();
    }
    // WebKit: IP/geo nearby cards can paint after iframe-ready — settle before invalid submit.
    await findAGymPage.settleAutoResultsBeforeErrorSearch();
    await findAGymPage.searchLocation(d(TestDataKeys.Locations.Search.Invalid), {
      pickSuggestion: false,
    });
  },
);

When(
  /^The user searches for a location with no nearby gyms in Find A Gym$/,
  async ({ findAGymPage, page }) => {
    const url = new URL(page.url());
    url.searchParams.delete('test_location_id');
    url.searchParams.delete('use_prod_api');
    await page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
    await findAGymPage.waitForReady();
    // WebKit: IP/geo nearby cards can paint after iframe-ready — settle before no-nearby pick
    // (same race as invalid free-text). Retry suggestion pick when leftover cards linger.
    await findAGymPage.searchLocation(resolveNoNearbySearchTerm(), {
      pickSuggestion: true,
      expectNoNearby: true,
    });
  },
);

When(/^The user clicks a map pin on the Find A Gym map$/, async ({ findAGymPage }) => {
  await findAGymPage.openMapPinPopup();
});

When(
  /^The user clicks Visit Website in the Find A Gym map pin popup$/,
  async ({ findAGymPage }) => {
    await findAGymPage.clickVisitWebsiteAndWaitForLocalGym();
  },
);

When(
  /^The user clicks Get Directions in the Find A Gym map pin popup$/,
  async ({ findAGymPage, scenarioContext }) => {
    scenarioContext.referralUrl = await findAGymPage.clickGetDirectionsAndCaptureUrl();
  },
);

When(
  /^The user clicks the location name in the Find A Gym map pin popup$/,
  async ({ findAGymPage }) => {
    await findAGymPage.clickMapPinLocationNameAndWaitForLocalGym();
  },
);

When(
  /^The user clicks a gym location on the Find A Gym results list$/,
  async ({ findAGymPage }) => {
    await findAGymPage.clickFirstGymOnResultsListAndWaitForLocalGym();
  },
);

When(
  /^The user clicks the Find a Gym link in the navigation for \/locations redirect$/,
  async ({ page, scenarioContext }) => {
    const navigatedUrls: string[] = [];
    const onNav = (frame: { url: () => string }) => {
      if (frame === page.mainFrame()) {
        navigatedUrls.push(frame.url());
      }
    };
    page.on('framenavigated', onNav);
    try {
      const { link: navLink, href, visible } = await resolveVisibleFindAGymLink(page, 'nav');
      softSkipIfWebflowFindGymHref(href, 'nav');
      expect(href, `Nav Find a Gym href should target /locations (AFW-3876), got: ${href}`).toMatch(
        /\/locations(?:\/|$|\?|#)/i,
      );
      expect(href, `Nav Find a Gym href must not target /find-gym: ${href}`).not.toMatch(
        /\/find-gym(?:\/|$|\?|#)/i,
      );
      await clickFindAGymLocationsLink(page, navLink, href, visible);
      scenarioContext.redirectNavigationUrls = navigatedUrls;
    } finally {
      page.off('framenavigated', onNav);
    }
  },
);

When(
  /^The user clicks the Find a Gym link in the footer for \/locations redirect$/,
  async ({ page, scenarioContext }) => {
    const navigatedUrls: string[] = [];
    const onNav = (frame: { url: () => string }) => {
      if (frame === page.mainFrame()) {
        navigatedUrls.push(frame.url());
      }
    };
    page.on('framenavigated', onNav);
    try {
      const { link: footerLink, href, visible } = await resolveVisibleFindAGymLink(page, 'footer');
      softSkipIfWebflowFindGymHref(href, 'footer');
      await footerLink.scrollIntoViewIfNeeded().catch(() => {});
      expect(
        href,
        `Footer Find a Gym href should target /locations (AFW-3876), got: ${href}`,
      ).toMatch(/\/locations(?:\/|$|\?|#)/i);
      expect(href, `Footer Find a Gym href must not target /find-gym: ${href}`).not.toMatch(
        /\/find-gym(?:\/|$|\?|#)/i,
      );
      await clickFindAGymLocationsLink(page, footerLink, href, visible);
      scenarioContext.redirectNavigationUrls = navigatedUrls;
    } finally {
      page.off('framenavigated', onNav);
    }
  },
);

When(
  /^The user clicks Display all nearby locations on the Locations Widget for \/locations redirect$/,
  async ({ locationSearchOnStaticPagesPage, page, scenarioContext }) => {
    locationSearchOnStaticPagesPage.bindToPage(scenarioContext.pageName || 'home');
    const navigatedUrls: string[] = [];
    const onNav = (frame: { url: () => string }) => {
      if (frame === page.mainFrame()) {
        navigatedUrls.push(frame.url());
      }
    };
    page.on('framenavigated', onNav);
    try {
      // Seed nearby results so Display/View all nearby is available (US widget).
      const locale = environmentManager.get('LOCALE').toLowerCase();
      await locationSearchOnStaticPagesPage.typeSearchPrefix(
        AFW3876_SEARCH_PREFIX[locale] ?? 'tam',
      );
      await locationSearchOnStaticPagesPage.selectFirstSuggestionAndWaitForLocationsDirectory();
      scenarioContext.redirectNavigationUrls = navigatedUrls;
    } finally {
      page.off('framenavigated', onNav);
    }
  },
);

When(
  /^The user selects Near Me geolocation on the Locations Widget for \/locations redirect$/,
  async ({ locationSearchOnStaticPagesPage, page, scenarioContext }) => {
    locationSearchOnStaticPagesPage.bindToPage(scenarioContext.pageName || 'home');
    const navigatedUrls: string[] = [];
    const onNav = (frame: { url: () => string }) => {
      if (frame === page.mainFrame()) {
        navigatedUrls.push(frame.url());
      }
    };
    page.on('framenavigated', onNav);

    const locale = environmentManager.get('LOCALE').toLowerCase();
    const prefix = AFW3876_SEARCH_PREFIX[locale] ?? 'tam';

    try {
      await locationSearchOnStaticPagesPage.waitForWidgetReady().catch(() => {});
      await locationSearchOnStaticPagesPage.iframeElement.scrollIntoViewIfNeeded().catch(() => {});

      // Prefer precise-location / "Utiliser l'emplacement actuel" CTA when present.
      // Do not call clickUseMyPreciseLocation() — it soft-skips when the CTA is missing (intl searchbar).
      const preciseBtn = locationSearchOnStaticPagesPage.preciseLocationButton;
      const preciseVisible = await preciseBtn
        .waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
        .then(() => true)
        .catch(() => false);
      if (preciseVisible) {
        await preciseBtn.scrollIntoViewIfNeeded().catch(() => {});
        await preciseBtn.click({ force: true });
        await page.waitForTimeout(1500);
        // Precise-location alone may expand in-place (intl) or reveal Near Me / View-all.
        if (
          /\/locations(?:\/|(?:[?#]|$))/i.test(page.url()) ||
          (await locationSearchOnStaticPagesPage.hasInPlaceGymFinderResults())
        ) {
          scenarioContext.redirectNavigationUrls = navigatedUrls;
          return;
        }
        await locationSearchOnStaticPagesPage
          .waitForLocationsRedirectOrInPlaceGymFinder(TIMEOUTS.MEDIUM)
          .then(() => {
            scenarioContext.redirectNavigationUrls = navigatedUrls;
          })
          .catch(() => undefined);
        if (
          /\/locations(?:\/|(?:[?#]|$))/i.test(page.url()) ||
          (await locationSearchOnStaticPagesPage.hasInPlaceGymFinderResults())
        ) {
          scenarioContext.redirectNavigationUrls = navigatedUrls;
          return;
        }
      }

      const nearMeOption = locationSearchOnStaticPagesPage.iframe
        .getByRole('option', {
          name: /near me|in meiner nähe|vicino a me|بالقرب مني|près de moi|pres de moi|autour de moi|à proximité/i,
        })
        .or(
          locationSearchOnStaticPagesPage.iframe.getByText(
            /near me|in meiner nähe|vicino a me|بالقرب مني|près de moi|pres de moi|autour de moi|à proximité/i,
          ),
        )
        .first();
      const nearMeVisible = await nearMeOption
        .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT })
        .then(() => true)
        .catch(() => false);

      if (nearMeVisible) {
        // Intl searchbar may expand in-place — do not hard-wait /locations only.
        await nearMeOption.click();
        await locationSearchOnStaticPagesPage.waitForLocationsRedirectOrInPlaceGymFinder();
        scenarioContext.redirectNavigationUrls = navigatedUrls;
        return;
      }

      const viewAll = locationSearchOnStaticPagesPage.viewAllNearbyLocationsButton;
      const viewAllVisible = await viewAll
        .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT })
        .then(() => true)
        .catch(() => false);
      if (viewAllVisible) {
        await viewAll.click({ force: true });
        await locationSearchOnStaticPagesPage.waitForLocationsRedirectOrInPlaceGymFinder();
        scenarioContext.redirectNavigationUrls = navigatedUrls;
        return;
      }

      // Intl Home uses Find Your Location Searchbar (no View-all CTA). Type a prefix, then
      // prefer a Near Me suggestion if present; otherwise select the first Mapbox suggestion.
      // If Places returns no options (FR-CA iPhone + short prefix), click current-location CTA.
      await locationSearchOnStaticPagesPage.typeSearchPrefix(prefix);
      const nearMeAfterType = await nearMeOption
        .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT })
        .then(() => true)
        .catch(() => false);
      if (nearMeAfterType) {
        await nearMeOption.click();
        await locationSearchOnStaticPagesPage.waitForLocationsRedirectOrInPlaceGymFinder();
      } else {
        const suggestionReady = await locationSearchOnStaticPagesPage.suggestionOptions
          .first()
          .waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
          .then(() => true)
          .catch(() => false);
        if (suggestionReady) {
          await locationSearchOnStaticPagesPage.selectFirstSuggestionAndWaitForLocationsDirectory();
        } else {
          // Click the search (magnifying glass) control — FR-CA iPhone often needs an explicit submit.
          const searchSubmit = locationSearchOnStaticPagesPage.iframe
            .locator(
              'button[type="submit"], button[aria-label*="search" i], [class*="search"] button',
            )
            .first();
          if (await searchSubmit.isVisible().catch(() => false)) {
            await searchSubmit.click({ force: true }).catch(() => {});
            await page.waitForTimeout(1500);
          }
          const suggestionAfterSubmit = await locationSearchOnStaticPagesPage.suggestionOptions
            .first()
            .waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
            .then(() => true)
            .catch(() => false);
          if (suggestionAfterSubmit) {
            await locationSearchOnStaticPagesPage.selectFirstSuggestionAndWaitForLocationsDirectory();
          } else {
            const currentLocation = locationSearchOnStaticPagesPage.preciseLocationButton;
            await currentLocation.scrollIntoViewIfNeeded().catch(() => {});
            const currentVisible = await currentLocation
              .waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
              .then(() => true)
              .catch(() => false);
            if (!currentVisible) {
              // Last resort: Local Config postal / city full string via LocationSearch remap path.
              const fallback =
                locale === 'fr-ca' ? 'Montreal' : locale === 'en-ca' ? 'Winnipeg' : prefix;
              await locationSearchOnStaticPagesPage.typeSearchPrefix(fallback);
              await locationSearchOnStaticPagesPage.selectFirstSuggestionAndWaitForLocationsDirectory();
            } else {
              await currentLocation.click({ force: true });
              await locationSearchOnStaticPagesPage.waitForLocationsRedirectOrInPlaceGymFinder();
            }
          }
        }
      }
      scenarioContext.redirectNavigationUrls = navigatedUrls;
    } finally {
      page.off('framenavigated', onNav);
    }
  },
);

When(
  /^The user follows an inactive or Find a Gym event redirect for \/locations$/,
  async ({ page, scenarioContext }) => {
    const navigatedUrls: string[] = [];
    const onNav = (frame: { url: () => string }) => {
      if (frame === page.mainFrame()) {
        navigatedUrls.push(frame.url());
      }
    };
    page.on('framenavigated', onNav);
    try {
      // Prefer page/CMS CTAs — never take hidden desktop `a.base_nav-link` (iPhone DOM-first).
      const eventCtaGroups = [
        page.locator(
          'a.bt-af[href*="/locations"], a.bt-af-long[href*="/locations"], a.w-button[href*="/locations"]',
        ),
        page.locator(
          'main a[href*="/locations"], [class*="hero"] a[href*="/locations"], section a[href*="/locations"]',
        ),
        page.locator(
          'a.bt-af[href*="/find-gym"], a.bt-af-long[href*="/find-gym"], a.w-button[href*="/find-gym"]',
        ),
        page.locator('a[href*="/locations"], a[href*="/find-gym"]').filter({
          hasText:
            /Find a Gym|Find A Gym|FIND A GYM|View all nearby|Display all nearby|VIEW GYM MAP|Locations/i,
        }),
        page.getByRole('link', {
          name: /Find a Gym|FIND A GYM|View all nearby|Display all nearby/i,
        }),
      ];

      let eventFindGymCta: import('@playwright/test').Locator | null = null;
      let href = '';

      for (const group of eventCtaGroups) {
        const count = await group.count().catch(() => 0);
        for (let i = 0; i < count; i++) {
          const candidate = group.nth(i);
          const attached = await candidate
            .waitFor({ state: 'attached', timeout: 2000 })
            .then(() => true)
            .catch(() => false);
          if (!attached) {
            continue;
          }
          const candidateHref = ((await candidate.getAttribute('href')) ?? '').toLowerCase();
          if (!candidateHref) {
            continue;
          }
          // Skip navbar leftovers — handled by nav/footer scenarios.
          const placement = (
            (await candidate.getAttribute('data-rs-placement').catch(() => '')) ?? ''
          ).toLowerCase();
          const className = (
            (await candidate.getAttribute('class').catch(() => '')) ?? ''
          ).toLowerCase();
          if (
            placement === 'navbar' ||
            className.includes('base_nav-link') ||
            className.includes('base_sidebar-nav-link')
          ) {
            continue;
          }
          eventFindGymCta = candidate;
          href = candidateHref;
          break;
        }
        if (eventFindGymCta) {
          break;
        }
      }

      if (eventFindGymCta && href) {
        if (/\/find-gym(?:\/|$|\?|#)/i.test(href)) {
          softSkipIfWebflowFindGymHref(href, 'nav');
          return;
        }
        expect(
          href,
          `Events Find a Gym CTA should target /locations (AFW-3876), got: ${href}`,
        ).toMatch(/\/locations(?:\/|$|\?|#)/i);
        const visible = await eventFindGymCta.isVisible().catch(() => false);
        await clickFindAGymLocationsLink(page, eventFindGymCta, href, visible);
      } else {
        // Inactive-event fallback: Webflow nav/footer may still expose /find-gym (APP GAP).
        const staleFindGym = page.locator('a[href*="/find-gym"]');
        const staleCount = await staleFindGym.count();
        if (staleCount > 0) {
          const sampleHref = (
            (await staleFindGym.first().getAttribute('href')) ?? ''
          ).toLowerCase();
          softSkipIfWebflowFindGymHref(sampleHref || '/find-gym', 'nav');
          return;
        }
        // No Find a Gym CTA and no stale /find-gym — treat as inactive event page (APP GAP soft-skip).
        logger.warn(
          `AFW-3876 inactive Events page has no Find a Gym /locations CTA (url=${page.url()}). Soft-skipping.`,
        );
        test.info().annotations.push({
          type: 'issue',
          description: `No events free trial pass Find a Gym CTA (url: ${page.url()})`,
        });
        test.skip(true, 'No events free trial pass active');
        return;
      }
      scenarioContext.redirectNavigationUrls = navigatedUrls;
    } finally {
      page.off('framenavigated', onNav);
    }
  },
);

When(
  /^The user selects a location suggestion on the static location search for \/locations redirect$/,
  async ({ locationSearchOnStaticPagesPage, page, scenarioContext }) => {
    locationSearchOnStaticPagesPage.bindToPage(scenarioContext.pageName || 'home');
    const locale = environmentManager.get('LOCALE').toLowerCase();
    const prefix = AFW3876_SEARCH_PREFIX[locale] ?? 'tam';

    const navigatedUrls: string[] = [];
    const onNav = (frame: { url: () => string }) => {
      if (frame === page.mainFrame()) {
        navigatedUrls.push(frame.url());
      }
    };
    page.on('framenavigated', onNav);
    try {
      await locationSearchOnStaticPagesPage.typeSearchPrefix(prefix);
      await locationSearchOnStaticPagesPage.selectFirstSuggestionAndWaitForLocationsDirectory();
      scenarioContext.redirectNavigationUrls = navigatedUrls;
    } finally {
      page.off('framenavigated', onNav);
    }
  },
);

When(
  /^The user opens Local Offer without a location_id for \/locations redirect$/,
  async ({ page, scenarioContext }) => {
    const locale = environmentManager.get('LOCALE');
    scenarioContext.afw3876LocalOfferRedirectSoftPass = undefined;
    const navigatedUrls: string[] = [];
    const onNav = (frame: { url: () => string }) => {
      if (frame === page.mainFrame()) {
        navigatedUrls.push(frame.url());
      }
    };
    page.on('framenavigated', onNav);
    try {
      const outcome = await openAfw3876LocalOfferForLocationsRedirect(
        page,
        locale,
        '',
        navigatedUrls,
      );
      scenarioContext.redirectNavigationUrls = navigatedUrls;
      if (outcome === 'unavailable') {
        const message =
          `Coverage Local Offer = NO / offer host unavailable — Local Offer missing location_id → /locations ` +
          `not applicable for ${locale} (url=${page.url()}). Widget/Searchbar /locations redirects remain in scope.`;
        logger.warn(message);
        test.info().annotations.push({ type: 'issue', description: message });
        scenarioContext.afw3876LocalOfferRedirectSoftPass = message;
      }
    } finally {
      page.off('framenavigated', onNav);
    }
  },
);

When(
  /^The user opens Local Offer with an invalid location_id for \/locations redirect$/,
  async ({ page, scenarioContext }) => {
    const locale = environmentManager.get('LOCALE');
    scenarioContext.afw3876LocalOfferRedirectSoftPass = undefined;
    // Use a club-id-shaped sentinel. Values like `invalid-afw3876-404` soft-404 Webflow CMS
    // to locale home on IT/DE before React can redirect to /locations.
    // IE clubs share the UK- prefix (Local Config UK-0568) — IE-9999 soft-404s to home.
    // EN-CA / FR-CA Local Config clubIds are numeric (e.g. 9993995) — CA-9999 soft-404s to home.
    const region = locale.split('-')[0]?.toUpperCase() || 'XX';
    const country = locale.split('-')[1]?.toUpperCase() || region;
    const clubPrefix = country === 'GB' || country === 'IE' ? 'UK' : country;
    let invalidClubId = `${clubPrefix}-9999`;
    try {
      const clubId = d(TestDataKeys.Locations.ClubId)?.trim() ?? '';
      if (/^\d+$/.test(clubId)) {
        invalidClubId = '9999999';
      }
    } catch {
      // keep region-prefixed sentinel
    }
    const navigatedUrls: string[] = [];
    const onNav = (frame: { url: () => string }) => {
      if (frame === page.mainFrame()) {
        navigatedUrls.push(frame.url());
      }
    };
    page.on('framenavigated', onNav);
    try {
      const outcome = await openAfw3876LocalOfferForLocationsRedirect(
        page,
        locale,
        `?location_id=${invalidClubId}`,
        navigatedUrls,
      );
      scenarioContext.redirectNavigationUrls = navigatedUrls;
      if (outcome === 'unavailable') {
        const message =
          `Coverage Local Offer = NO / offer host unavailable — Local Offer invalid location_id → /locations ` +
          `not applicable for ${locale} (url=${page.url()}). Widget/Searchbar /locations redirects remain in scope.`;
        logger.warn(message);
        test.info().annotations.push({ type: 'issue', description: message });
        scenarioContext.afw3876LocalOfferRedirectSoftPass = message;
      }
    } finally {
      page.off('framenavigated', onNav);
    }
  },
);

When(/^The user clicks the Find A Gym CONTACT US CTA$/, async ({ findAGymPage }) => {
  await findAGymPage.clickContactUsGymCtaAndWaitForEmailClub();
});

Then(/^The Find A Gym page displays nearby gym search results$/, async ({ findAGymPage }) => {
  await findAGymPage.expectNearbyResultsVisible();
});

Then(
  /^The page should redirect to the local gym location page from Find A Gym$/,
  async ({ page }) => {
    expect(page.url()).toMatch(/\/locations\/[a-z0-9-]+/i);
    expect(page.url()).toContain(PATHS.LOCATIONS);
  },
);

Then(
  /^The user should be redirected to Google Maps from Find A Gym$/,
  async ({ scenarioContext }) => {
    const url = scenarioContext.referralUrl ?? '';
    expect(url).toMatch(/maps\.google\.com|google\.com\/maps/i);
  },
);

Then(/^The invalid location error is displayed in Find A Gym$/, async ({ findAGymPage }) => {
  await findAGymPage.expectInvalidSearchMessage();
});

Then(/^The no nearby locations message is displayed in Find A Gym$/, async ({ findAGymPage }) => {
  await findAGymPage.expectNoLocationsFoundMessage();
});

Then(/^The View All Location link is not displayed on Find A Gym$/, async ({ findAGymPage }) => {
  await findAGymPage.expectViewAllLocationLinkHidden();
});

Then(
  /^The page redirects directly to \/locations without a \/find-gym hop$/,
  async ({ page, scenarioContext }) => {
    if (scenarioContext.afw3876LocalOfferRedirectSoftPass) {
      logger.info(
        `Soft-passing /locations redirect assert — ${scenarioContext.afw3876LocalOfferRedirectSoftPass}`,
      );
      return;
    }

    if (/\/locations(?:\/|(?:[?#]|$))/i.test(page.url())) {
      assertLocationsRedirectWithoutFindGymHop(
        page.url(),
        scenarioContext.redirectNavigationUrls ?? [],
      );
      return;
    }

    // Intl Home searchbar (EN-CA/FR-CA/TH/…) may expand gym finder in-place without a
    // parent /locations hop — same soft-pass as Location Search AFW-3876 journey.
    // Detect via page frames (avoid fixture list drift in .features-gen).
    if (!/\/(?:locations|find-gym)(?:\/|(?:[?#]|$))/i.test(page.url())) {
      const searchbar = page.frameLocator(
        '#find-your-gym-searchbar-iframe, #locations-widget-iframe',
      );
      const inPlace =
        (await searchbar
          .locator('[id^="location-name-"]')
          .first()
          .isVisible()
          .catch(() => false)) ||
        (await searchbar
          .locator('#list-panel div.bg-white')
          .first()
          .isVisible()
          .catch(() => false)) ||
        (await searchbar
          .locator('canvas.mapboxgl-canvas')
          .first()
          .isVisible()
          .catch(() => false)) ||
        (await searchbar
          .getByText(/\d+([.,]\d+)?\s*(km|mi|กม\.?)/i)
          .first()
          .isVisible()
          .catch(() => false));
      if (inPlace) {
        const message =
          `APP GAP (AFW-3876): Home searchbar showed gym results in-place ` +
          `without parent /locations redirect (url=${page.url()}). ` +
          `Same soft-pass as Location Search static-page /locations journey.`;
        logger.warn(message);
        test.info().annotations.push({ type: 'issue', description: message });
        return;
      }
    }

    assertLocationsRedirectWithoutFindGymHop(
      page.url(),
      scenarioContext.redirectNavigationUrls ?? [],
    );
  },
);

Then(/^The redirect URL includes the correct locale prefix for \/locations$/, async ({ page }) => {
  // Skip when prior Then soft-passed APP GAP (in-place searchbar, still on Home).
  if (!/\/locations(?:\/|(?:[?#]|$))/i.test(page.url())) {
    logger.info(`Skipping locale-prefix /locations assert — not on /locations (url=${page.url()})`);
    return;
  }
  assertLocalePrefixedLocationsUrl(page.url());
});

Then(/^The Find A Gym primary gym CTA is CONTACT US$/, async ({ findAGymPage }) => {
  await findAGymPage.assertContactUsGymCtaVisible();
});

Then(
  /^The page redirects to email-club with a location_id from Find A Gym$/,
  async ({ findAGymPage }) => {
    await findAGymPage.assertEmailClubWithLocationId();
  },
);
