import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/base.fixture';
import { captureRudderStackEvent, getPageDetails, rudderstackRequests } from '@utils/rudderstack';
import {
  getLocationSearchRsExpectation,
  type LocationSearchRsFlowKey,
} from '@utils/tracking/location-search-rs-tracking';

/**
 * AFW-4104 — Location Searched / Location Selected must carry CMS offer_name + offer_type
 * on offer flows with location search (Local / Group / Member / Events Promo).
 * Scenarios must include @AFW-4104.
 */
const { Given, Then } = createBdd(test, { tags: '@AFW-4104' });

Given(/^Rudderstack validation is enabled for AFW-4104$/, async ({ page, scenarioContext }) => {
  scenarioContext.rudderstackTestEnable = true;
  scenarioContext.afw4104RequireCmsOfferFields = true;
  if (!scenarioContext.rudderstackCapturedRequests) {
    scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
  }
});

function buildLocationTracking(flow: LocationSearchRsFlowKey, requireCmsOfferFields: boolean) {
  const expectation = getLocationSearchRsExpectation(flow);
  return {
    includeOfferFields: expectation.includeOfferFields,
    offerName: expectation.offerName,
    offerScope: expectation.offerScope,
    offerType: expectation.offerType,
    requireCmsOfferFields,
  };
}

function buildFormTracking(flow: LocationSearchRsFlowKey) {
  const expectation = getLocationSearchRsExpectation(flow);
  return {
    formType: expectation.formType,
    formOffer: expectation.formOffer,
    formId: expectation.formId,
    formName: expectation.formName,
  };
}

Then(
  /^The Location Searched Rudderstack event is triggered for "(.*)" with CMS offer fields and search success "(true|false)"$/,
  async ({ page, scenarioContext }, flow: string, successFlag: string) => {
    if (!scenarioContext.rudderstackTestEnable) {
      test.info().annotations.push({ type: 'skip-rs', description: 'Rudderstack not enabled' });
      return;
    }
    const flowKey = flow as LocationSearchRsFlowKey;
    const requests =
      scenarioContext.rudderstackCapturedRequests ?? (await rudderstackRequests(page));
    scenarioContext.rudderstackCapturedRequests = requests;
    const pageDetails = await getPageDetails(page);
    const searchSuccess = successFlag === 'true';
    const requireCms = Boolean(scenarioContext.afw4104RequireCmsOfferFields);

    await captureRudderStackEvent({
      requests,
      event: 'Location Searched',
      page,
      data: '',
      pageDetails,
      skipPagePathValidation: true,
      formTracking: buildFormTracking(flowKey),
      locationTracking: {
        ...buildLocationTracking(flowKey, requireCms),
        searchSuccess,
        searchTerm: 'non-empty',
        searchMethod: 'manual',
      },
    });
  },
);

Then(
  /^The Location Selected Rudderstack event is triggered for "(.*)" with CMS offer fields$/,
  async ({ page, scenarioContext }, flow: string) => {
    if (!scenarioContext.rudderstackTestEnable) {
      test.info().annotations.push({ type: 'skip-rs', description: 'Rudderstack not enabled' });
      return;
    }
    const flowKey = flow as LocationSearchRsFlowKey;
    scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    const requests = scenarioContext.rudderstackCapturedRequests;
    const pageDetails = await getPageDetails(page);
    const requireCms = Boolean(scenarioContext.afw4104RequireCmsOfferFields);

    await captureRudderStackEvent({
      requests,
      event: 'Location Selected',
      page,
      data: '',
      pageDetails,
      skipPagePathValidation: true,
      formTracking: buildFormTracking(flowKey),
      locationTracking: {
        ...buildLocationTracking(flowKey, requireCms),
        locationId: 'non-empty',
        expectCta: true,
      },
    });
  },
);
