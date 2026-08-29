import type { Page } from '@playwright/test';
import environmentManager from '@config/environment';
import { TIMEOUTS } from '@utils/constants';
import { d } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import { rudderstackRequests, type RudderStackRequest } from '@utils/rudderstack';

type RsScenarioContext = {
  rudderstackTestEnable?: boolean;
  rudderstackCapturedRequests?: RudderStackRequest[];
};

/**
 * AFW-3952: remount a search landing, re-bind RS capture, and wait for a post-remount
 * heartbeat (`page` / any track) before typing. Background deep-links can leave the
 * search UI ready while RS only posts `page` — Location Searched/Selected then miss.
 */
export async function remountSearchLandingForRs(options: {
  page: Page;
  scenarioContext: RsScenarioContext;
  path: string;
  waitReady: () => Promise<void>;
  keepTestLocationId?: boolean;
}): Promise<void> {
  const { page, scenarioContext, path, waitReady, keepTestLocationId } = options;
  if (!scenarioContext?.rudderstackTestEnable || page.isClosed()) {
    return;
  }

  scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
  const bag = scenarioContext.rudderstackCapturedRequests;
  const baselineCount = bag.length;

  const baseUrl = String(environmentManager.get('BASE_URL') || '').replace(/\/$/, '');
  const locale = String(environmentManager.get('LOCALE') || '');
  const next = new URL(`${baseUrl}${path}`);
  const current = new URL(page.url());
  for (const key of ['disable_captcha', 'use_prod_api', 'test_location_id'] as const) {
    const value = current.searchParams.get(key);
    if (value) {
      next.searchParams.set(key, value);
    }
  }
  if (!keepTestLocationId) {
    next.searchParams.delete('test_location_id');
    next.searchParams.delete('location_id');
  } else if (!next.searchParams.has('test_location_id')) {
    const clubId = d(TestDataKeys.Locations.ClubId);
    if (clubId) {
      next.searchParams.set('test_location_id', clubId);
    }
  }
  const isNonProd = ['//sit.', '//uat.', '//dev.'].some(env => next.href.includes(env));
  if (isNonProd && !locale.toUpperCase().includes('US') && !next.searchParams.has('use_prod_api')) {
    next.searchParams.set('use_prod_api', 'true');
  }
  if (!next.searchParams.has('disable_captcha')) {
    next.searchParams.set('disable_captcha', 'true');
  }

  await page.goto(next.toString(), { waitUntil: 'domcontentloaded' });
  await dismissOneTrustIfBlocking(page);
  await waitReady().catch(() => {});
  scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);

  const readyDeadline = Date.now() + TIMEOUTS.MEDIUM;
  while (Date.now() < readyDeadline && !page.isClosed()) {
    const sawPostRemountPage = bag.slice(baselineCount).some(r => {
      const type = r.postDataJSON?.type;
      const event = r.postDataJSON?.event;
      return type === 'page' || event === 'page' || Boolean(event);
    });
    if (sawPostRemountPage || bag.length > baselineCount) {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  await page.waitForTimeout(2000).catch(() => {});
}

/** Accept / close OneTrust without opening the footer preference center. */
async function dismissOneTrustIfBlocking(page: Page): Promise<void> {
  const allowAll = page.locator('.onetrust-banner-options #onetrust-accept-btn-handler');
  if (await allowAll.isVisible({ timeout: 2000 }).catch(() => false)) {
    await allowAll.click().catch(() => {});
  }
  const save = page.getByRole('button', { name: 'Save Settings' });
  if (await save.isVisible({ timeout: 1000 }).catch(() => false)) {
    await save.click().catch(() => {});
  }
  const close = page.locator('.ot-pc-header #close-pc-btn-handler');
  if (await close.isVisible({ timeout: 1000 }).catch(() => false)) {
    await close.click().catch(() => {});
  }
  await page
    .evaluate(() => {
      const root = document.querySelector('#onetrust-consent-sdk') as HTMLElement | null;
      if (root) {
        root.style.setProperty('pointer-events', 'none', 'important');
      }
    })
    .catch(() => {});
}
