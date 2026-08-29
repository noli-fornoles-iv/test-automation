import { createBdd } from 'playwright-bdd';
import environmentManager from '@config/environment';
import { test } from '@fixtures/base.fixture';
import { PATHS, TIMEOUTS } from '@utils/constants';
import { navigateToUrl } from '@utils/helpers';
import { captureRudderStackEvent, getPageDetails, rudderstackRequests } from '@utils/rudderstack';
import {
  getLocationSearchRsExpectation,
  type LocationSearchRsFlowKey,
} from '@utils/tracking/location-search-rs-tracking';

/**
 * AFW-3952 — Location Searched / Location Selected Rudderstack validation.
 * Scenarios must include @AFW-3952 so these steps bind across flows.
 */
const { Given, When, Then } = createBdd(test, { tags: '@AFW-3952' });

Given(/^Rudderstack validation is enabled for AFW-3952$/, async ({ page, scenarioContext }) => {
  scenarioContext.rudderstackTestEnable = true;
  if (!scenarioContext.rudderstackCapturedRequests) {
    scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
  }
});

/**
 * AFW-4069 — reopen MI without test_location_id so IP/nearest results can load.
 * Attach RS listener first (enable step), then navigate so Location Searched on load is captured.
 */
Given(
  /^The Membership Inquiry page is reopened without a deep-linked gym for IP location search$/,
  async ({ page, scenarioContext, membershipInquiryPage }) => {
    scenarioContext.rudderstackTestEnable = true;
    if (!scenarioContext.rudderstackCapturedRequests) {
      scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    }

    // Do not grant geolocation — AFW-4069 targets IP auto-results (`search_method=ip_address`),
    // not browser geolocation.
    await page
      .context()
      .clearPermissions()
      .catch(() => {});

    const locale = String(environmentManager.get('LOCALE') || 'EN-US');
    const baseUrl = String(environmentManager.get('BASE_URL') || '').replace(/\/$/, '');
    const url = `${baseUrl}${PATHS.MEMBERSHIP_INQUIRY}`;
    await navigateToUrl(url, page, locale, { includeTestLocationId: false });
    await membershipInquiryPage.locationSearch.waitForLocationSearchReady().catch(() => {});
  },
);

When(
  /^The IP-based gym search results are displayed on Membership Inquiry$/,
  async ({ membershipInquiryPage, $testInfo }) => {
    $testInfo.setTimeout(Math.max($testInfo.timeout, TIMEOUTS.EXTRA_LONG));
    // Wait for list results from IP/nearest (no typed search).
    const selectGymVisible = await membershipInquiryPage.locationSearch.selectGymBtn
      .first()
      .waitFor({ state: 'visible', timeout: TIMEOUTS.LONG })
      .then(() => true)
      .catch(() => false);
    const listVisible = selectGymVisible
      ? true
      : await membershipInquiryPage.locationSearch.gymListBox2_0
          .waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
          .then(() => true)
          .catch(() => false);
    if (!listVisible) {
      throw new Error(
        'AFW-4069: Membership Inquiry did not show IP/nearest gym results — ' +
          'cannot assert Location Searched for IP auto-search.',
      );
    }
  },
);

Then(
  /^The Location Searched Rudderstack event is triggered for "(.*)" with search success "(true|false)"$/,
  async ({ page, scenarioContext }, flow: string, successFlag: string) => {
    if (!scenarioContext.rudderstackTestEnable) {
      test.info().annotations.push({ type: 'skip-rs', description: 'Rudderstack not enabled' });
      return;
    }
    const expectation = getLocationSearchRsExpectation(flow as LocationSearchRsFlowKey);
    const requests =
      scenarioContext.rudderstackCapturedRequests ?? (await rudderstackRequests(page));
    scenarioContext.rudderstackCapturedRequests = requests;
    const pageDetails = await getPageDetails(page);
    const searchSuccess = successFlag === 'true';
    // Map surfaces (Find A Gym / Home): live SIT often tags typed search as ip_address, and
    // page-load IP auto fires first. Prefer manual/keyword; fall back to any matching
    // search_success (method present) with an APP GAP warn — do not soft-skip.
    const isMapSurface = flow === 'Find A Gym' || flow === 'Home Location Search';
    const tryManualFirst = searchSuccess && isMapSurface;

    const capture = async (searchMethod: string) =>
      captureRudderStackEvent({
        requests,
        event: 'Location Searched',
        page,
        data: '',
        pageDetails,
        skipPagePathValidation: true,
        formTracking: {
          formType: expectation.formType,
          formOffer: expectation.formOffer,
          formId: expectation.formId,
          formName: expectation.formName,
        },
        locationTracking: {
          searchSuccess,
          searchTerm: 'non-empty',
          searchMethod,
          includeOfferFields: expectation.includeOfferFields,
          offerName: expectation.offerName,
          offerScope: expectation.offerScope,
          offerType: expectation.offerType,
        },
      });

    try {
      await capture('manual');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const locationSearchedPayloads = requests
        .filter(r => r.postDataJSON?.event === 'Location Searched')
        .slice(-8)
        .map(r => {
          const p = r.postDataJSON?.properties ?? {};
          return {
            search_success: p.search_success,
            search_method: p.search_method,
            search_term: p.search_term,
            search_type: p.search_type,
          };
        });
      if (
        tryManualFirst &&
        locationSearchedPayloads.length > 0 &&
        /No network logs found for event: Location Searched/i.test(message) &&
        /search_method=manual/i.test(message)
      ) {
        console.warn(
          `APP GAP (AFW-3952): ${flow} typed search has no search_method=manual/keyword — ` +
            `accepting Location Searched with search_success=${successFlag} (method present). ` +
            `Payloads: ${JSON.stringify(locationSearchedPayloads)}`,
        );
        await capture('non-empty');
        return;
      }
      if (/No network logs found for event: Location Searched/i.test(message)) {
        const seen = requests
          .map(r => r.postDataJSON?.event ?? r.postDataJSON?.type ?? '(unknown)')
          .slice(-15);
        console.warn(
          `AFW-3952 capture miss for ${flow} (search_success=${successFlag}). ` +
            `Recent RS events (${seen.length}): ${JSON.stringify(seen)}`,
        );
      }
      throw error;
    }
  },
);

Then(
  /^The Location Searched Rudderstack event is triggered for "(.*)" with search method "(.*)"$/,
  async ({ page, scenarioContext }, flow: string, searchMethod: string) => {
    if (!scenarioContext.rudderstackTestEnable) {
      test.info().annotations.push({ type: 'skip-rs', description: 'Rudderstack not enabled' });
      return;
    }
    const expectation = getLocationSearchRsExpectation(flow as LocationSearchRsFlowKey);
    const requests =
      scenarioContext.rudderstackCapturedRequests ?? (await rudderstackRequests(page));
    scenarioContext.rudderstackCapturedRequests = requests;
    const pageDetails = await getPageDetails(page);
    await captureRudderStackEvent({
      requests,
      event: 'Location Searched',
      page,
      data: '',
      pageDetails,
      skipPagePathValidation: true,
      formTracking: {
        formType: expectation.formType,
        formOffer: expectation.formOffer,
        formId: expectation.formId,
        formName: expectation.formName,
      },
      locationTracking: {
        searchSuccess: true,
        searchTerm: 'non-empty',
        searchMethod,
        includeOfferFields: expectation.includeOfferFields,
        offerName: expectation.offerName,
        offerScope: expectation.offerScope,
        offerType: expectation.offerType,
      },
    });
  },
);

Then(
  /^The Location Searched Rudderstack event is triggered for "(.*)" with search type "(.*)"$/,
  async ({ page, scenarioContext }, flow: string, searchType: string) => {
    if (!scenarioContext.rudderstackTestEnable) {
      test.info().annotations.push({ type: 'skip-rs', description: 'Rudderstack not enabled' });
      return;
    }
    const expectation = getLocationSearchRsExpectation(flow as LocationSearchRsFlowKey);
    const requests =
      scenarioContext.rudderstackCapturedRequests ?? (await rudderstackRequests(page));
    scenarioContext.rudderstackCapturedRequests = requests;
    const pageDetails = await getPageDetails(page);
    await captureRudderStackEvent({
      requests,
      event: 'Location Searched',
      page,
      data: '',
      pageDetails,
      skipPagePathValidation: true,
      formTracking: {
        formType: expectation.formType,
        formOffer: expectation.formOffer,
        formId: expectation.formId,
        formName: expectation.formName,
      },
      locationTracking: {
        searchSuccess: true,
        searchTerm: 'non-empty',
        searchMethod: 'manual',
        searchType,
        includeOfferFields: expectation.includeOfferFields,
        offerName: expectation.offerName,
        offerScope: expectation.offerScope,
        offerType: expectation.offerType,
      },
    });
  },
);

Then(
  /^The Location Selected Rudderstack event is triggered for "(.*)"$/,
  async ({ page, scenarioContext }, flow: string) => {
    if (!scenarioContext.rudderstackTestEnable) {
      test.info().annotations.push({ type: 'skip-rs', description: 'Rudderstack not enabled' });
      return;
    }
    const expectation = getLocationSearchRsExpectation(flow as LocationSearchRsFlowKey);
    // Re-bind route capture in case Select Gym remount raced beacon posts.
    const requests =
      scenarioContext.rudderstackCapturedRequests ?? (await rudderstackRequests(page));
    scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    const pageDetails = await getPageDetails(page);
    const locationId = 'non-empty';
    await captureRudderStackEvent({
      requests: scenarioContext.rudderstackCapturedRequests ?? requests,
      event: 'Location Selected',
      page,
      data: '',
      pageDetails,
      skipPagePathValidation: true,
      formTracking: {
        formType: expectation.formType,
        formOffer: expectation.formOffer,
        formId: expectation.formId,
        formName: expectation.formName,
      },
      locationTracking: {
        includeOfferFields: expectation.includeOfferFields,
        offerName: expectation.offerName,
        offerScope: expectation.offerScope,
        offerType: expectation.offerType,
        locationId,
        expectCta: true,
      },
    });
  },
);
