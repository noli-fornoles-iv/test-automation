import { createBdd } from 'playwright-bdd';
import environmentManager from '@config/environment';
import { test } from '@fixtures/base.fixture';
import { PATHS, TIMEOUTS } from '@utils/constants';
import { d } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import { captureRudderStackEvent, getPageDetails, rudderstackRequests } from '@utils/rudderstack';
import {
  getLeadFunnelPageRsExpectation,
  type LeadFunnelPageRsFlowKey,
} from '@utils/tracking/lead-funnel-page-rs-tracking';

/**
 * AFW-3303 — Page view lead_funnel_viewed (+ form_type / form_offer when applicable).
 * AFW-4088 — when location_id is present, location_name must accompany it (LLP / Member Offer / Email Club).
 * Scenarios must include @AFW-3303 (and @AFW-4088 for deep-link location pairing surfaces).
 */
const { Given, Then } = createBdd(test, { tags: '@AFW-3303' });

function hasTag($testInfo: { tags?: readonly string[] }, tag: string): boolean {
  const normalized = tag.replace(/^@/, '');
  return ($testInfo.tags ?? []).some(t => String(t).replace(/^@/, '') === normalized);
}

Given(/^Rudderstack validation is enabled for AFW-3303$/, async ({ page, scenarioContext }) => {
  scenarioContext.rudderstackTestEnable = true;
  if (!scenarioContext.rudderstackCapturedRequests) {
    scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
  }
});

/**
 * AFW-4088 Email Club evidence: /email-club?location_id={clubId}
 * Uses Local Config clubId (never invent). Remounts onto deep-link before page-view capture.
 */
Given(
  /^The user opens Contact Us with location_id deep-link$/,
  async ({ page, scenarioContext, $testInfo }) => {
    $testInfo.setTimeout(Math.max($testInfo.timeout, TIMEOUTS.EXTRA_LONG));
    scenarioContext.rudderstackTestEnable = true;
    if (!scenarioContext.rudderstackCapturedRequests) {
      scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    }
    const clubId = d(TestDataKeys.Locations.ClubId);
    if (!clubId) {
      throw new Error(
        'AFW-4088: Local Config locations.clubId missing — cannot open Email Club location_id deep-link',
      );
    }
    const baseUrl = String(environmentManager.get('BASE_URL')).replace(/\/$/, '');
    const next = new URL(`${baseUrl}${PATHS.CONTACT_US}`);
    next.searchParams.set('location_id', clubId);
    next.searchParams.set('disable_captcha', 'true');
    await page.goto(next.toString(), { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.LONG }).catch(() => {});
    await page.waitForTimeout(2000);
  },
);

/**
 * Attach RS listener (if needed), clear prior page captures, reload so a fresh page view fires.
 */
Given(
  /^The page is reloaded to capture the Rudderstack page view$/,
  async ({ page, scenarioContext, $testInfo }) => {
    $testInfo.setTimeout(Math.max($testInfo.timeout, TIMEOUTS.EXTRA_LONG));
    scenarioContext.rudderstackTestEnable = true;
    if (!scenarioContext.rudderstackCapturedRequests) {
      scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    }
    // Drop prior page payloads so we assert the post-reload page view.
    const requests = scenarioContext.rudderstackCapturedRequests;
    for (let i = requests.length - 1; i >= 0; i--) {
      if (requests[i]?.postDataJSON?.type === 'page') {
        requests.splice(i, 1);
      }
    }
    await page.reload({ waitUntil: 'domcontentloaded' });
    // Contact / Find A Gym iframes hydrate after shell page view — wait for network + RS settle.
    await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.LONG }).catch(() => {});
    await page.waitForTimeout(4000);
  },
);

Then(
  /^The page Rudderstack event is triggered for "(.*)" with lead_funnel_viewed "(true|false)"$/,
  async ({ page, scenarioContext, $testInfo }, flow: string, viewedFlag: string) => {
    $testInfo.setTimeout(Math.max($testInfo.timeout, TIMEOUTS.EXTRA_LONG));
    if (!scenarioContext.rudderstackTestEnable) {
      test.info().annotations.push({ type: 'skip-rs', description: 'Rudderstack not enabled' });
      return;
    }
    const expectation = getLeadFunnelPageRsExpectation(flow as LeadFunnelPageRsFlowKey);
    const expectedViewed = viewedFlag === 'true';
    if (expectation.leadFunnelViewed !== expectedViewed) {
      throw new Error(
        `AFW-3303 scenario mismatch: flow "${flow}" expects lead_funnel_viewed=${expectation.leadFunnelViewed} ` +
          `but step requested ${expectedViewed}`,
      );
    }
    const requests =
      scenarioContext.rudderstackCapturedRequests ?? (await rudderstackRequests(page));
    scenarioContext.rudderstackCapturedRequests = requests;
    const pageDetails = await getPageDetails(page);
    const requireLocationIdWithName = hasTag($testInfo, 'AFW-4088');
    try {
      await captureRudderStackEvent({
        requests,
        event: 'page',
        page,
        data: '',
        pageDetails,
        skipPagePathValidation: true,
        leadFunnelTracking: {
          leadFunnelViewed: expectedViewed,
          expectFormFields: expectation.expectFormFields,
          formType: expectation.formType,
          formOffer: expectation.formOffer,
          expectLocationIfAvailable: expectation.expectLocationIfAvailable,
          requireLocationIdWithName,
          excludeOfferFields: expectation.excludeOfferFields,
        },
      });
    } catch (error) {
      // Do not soft-skip — report as failure (app / payload gap vs Testpad / AFW-4088).
      const message = error instanceof Error ? error.message : String(error);
      const annotated =
        message.startsWith('APP DEFECT (AFW-4088)') || message.startsWith('APP GAP (AFW-3303)')
          ? message
          : message.includes('AFW-4088')
            ? message
            : `APP GAP (AFW-3303): ${message}`;
      $testInfo.annotations.push({ type: 'issue', description: annotated });
      throw new Error(annotated);
    }
  },
);
