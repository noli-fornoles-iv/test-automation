import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/base.fixture';
import {
  armMcoLeadSourceOverride,
  expectedAfw3440LeadSource,
  overrideEventsPromoLeadSourceCode,
  overrideOfferIframeLeadSourceCode,
} from '@utils/afw-3440-lead-source';
import { TIMEOUTS } from '@utils/constants';

const { Given, When, Then } = createBdd(test, { tags: '@AFW-3440' });

Given(
  /^The AFW-3440 MCO Offer lead source code override "(.*)" is armed$/,
  async ({ page, scenarioContext }, input: string) => {
    scenarioContext.afw3440ExpectedOriginSource = expectedAfw3440LeadSource('mco', input);
    await armMcoLeadSourceOverride(page, input);
  },
);

Given(/^The AFW-3440 Events Promo widget is ready for lead-source override$/, async ({ page }) => {
  await page
    .locator(
      '#tuf-train-for-your-life-event-iframe, #events-promo-iframe, [data-lead-form-source-code]',
    )
    .first()
    .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
});

When(
  /^The AFW-3440 Events Promo lead source code is overridden to "(.*)"$/,
  async ({ page, scenarioContext }, input: string) => {
    scenarioContext.afw3440ExpectedOriginSource = expectedAfw3440LeadSource('events', input);
    await overrideEventsPromoLeadSourceCode(page, input);
  },
);

When(
  /^The AFW-3440 Local Offer lead source code is overridden to "(.*)"$/,
  async ({ page, scenarioContext }, input: string) => {
    scenarioContext.afw3440ExpectedOriginSource = expectedAfw3440LeadSource('local', input);
    await overrideOfferIframeLeadSourceCode(page, 'local', input);
  },
);

When(
  /^The AFW-3440 MCO Offer lead source code is overridden to "(.*)"$/,
  async ({ page, scenarioContext }, input: string) => {
    scenarioContext.afw3440ExpectedOriginSource = expectedAfw3440LeadSource('mco', input);
    await overrideOfferIframeLeadSourceCode(page, 'mco', input);
  },
);

Then(
  /^The AFW-3440 prospect origin_source equals "(.*)"$/,
  async ({ scenarioContext }, expected: string) => {
    const prospect = scenarioContext.prospectRequestData;
    if (!prospect) {
      throw new Error(
        'AFW-3440: prospect request body missing — submit the lead form with valid data first',
      );
    }
    expect(
      prospect.prospectData.origin_source,
      `AFW-3440 origin_source (got "${prospect.prospectData.origin_source}")`,
    ).toBe(expected);
  },
);

Then(
  /^The AFW-3440 prospect origin_source matches the overridden normalization$/,
  async ({ scenarioContext }) => {
    const prospect = scenarioContext.prospectRequestData;
    const expected = scenarioContext.afw3440ExpectedOriginSource;
    if (!prospect) {
      throw new Error(
        'AFW-3440: prospect request body missing — submit the lead form with valid data first',
      );
    }
    if (!expected) {
      throw new Error(
        'AFW-3440: expected origin_source not set — run the override When step first',
      );
    }
    expect(
      prospect.prospectData.origin_source,
      `AFW-3440 origin_source (got "${prospect.prospectData.origin_source}")`,
    ).toBe(expected);
  },
);
