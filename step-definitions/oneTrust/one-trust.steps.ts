import { createBdd } from 'playwright-bdd';
import environmentManager from '@config/environment';
import { test, expect } from '@fixtures/base.fixture';
import messages from '@resources/en-us.json';
import { PATHS, TIMEOUTS } from '@utils/constants';
import { Helpers } from '@utils/helpers';
import { logger } from '@utils/logger';

const { Given, When, Then } = createBdd(test);

Given('User IP is located within {string}', async ({ page: _ }, location: string) => {
  const configuredLocation = environmentManager.get('GEO_LOCATION').toUpperCase();
  const expectedLocation = Helpers.getLocationNameFromISO(configuredLocation);

  if (expectedLocation !== location.toLowerCase()) {
    logger.info(
      `Scenario for "${location}" skipped: Only "${expectedLocation}" scenarios are executed in this run.`,
    );
    test.skip(
      true,
      `Scenario for "${location}" skipped: Only "${expectedLocation}" scenarios are executed in this run.`,
    );
  }
});

When(
  'the user accesses the {string} page in {string} region',
  async ({ page, oneTrustPage }, pageName: string, location: string) => {
    switch (pageName.toLowerCase()) {
      case 'home':
        await page.goto(environmentManager.get('BASE_URL'));
        break;
      case 'try us free':
        await page.goto(environmentManager.get('BASE_URL') + PATHS.TRY_US_FREE);
        break;
      case 'find gym':
        await page.goto(environmentManager.get('BASE_URL') + PATHS.FIND_GYM);
        break;
      default:
        throw new Error(`Unhandled page: "${pageName}" in step definition`);
    }
    await oneTrustPage.shortWait(TIMEOUTS.SHORT);
    const defaultActiveGroups = (await oneTrustPage.getActiveGroupNames()).map(s => s.trim());

    switch (location.trim().toLowerCase()) {
      case 'california':
        expect(defaultActiveGroups).toEqual(
          expect.arrayContaining([
            'Strictly Necessary Cookies',
            'Functional Cookies',
            'Organization & Service Providers',
          ]),
        );
        expect(defaultActiveGroups).not.toEqual(
          expect.arrayContaining([
            'Performance Cookies',
            'Targeting Cookies',
            'Other Organizations',
          ]),
        );
        break;
      case 'washington':
        expect(defaultActiveGroups).toEqual(
          expect.arrayContaining([
            'Strictly Necessary Cookies',
            'Functional Cookies',
            'Organization and Service Provider',
            'Performance Cookies',
            'Targeting Cookies',
            'Other Organizations',
          ]),
        );
        break;
      case 'connecticut':
        expect(defaultActiveGroups).toEqual(
          expect.arrayContaining([
            'Strictly Necessary Cookies',
            'Functional Cookies',
            'Organization and Service Provider',
            'Performance Cookies',
            'Targeting Cookies',
            'Other Organizations',
          ]),
        );
        break;

      default:
        throw new Error(`Unhandled location "${location}" in step definition`);
    }
  },
);

When('The user accepts the cookies in the consent banner', async ({ oneTrustPage }) => {
  await oneTrustPage.acceptAllCookies();
});

When('The user rejects the cookies in the consent banner', async ({ oneTrustPage }) => {
  await oneTrustPage.rejectAllCookies();
});

Then(
  'the consent banner is {string} for {string} users',
  async ({ oneTrustPage }, visibilityStatus: string, location: string) => {
    if (visibilityStatus.toLowerCase() === 'displayed') {
      await expect(oneTrustPage.consentBanner).toBeVisible();
      await expect(oneTrustPage.consentBannerText).toBeVisible();

      let expectedText = '';
      if (location.toLowerCase() === 'california') {
        expectedText = messages.californiaConsentBanner;
      }
      const actualText = await oneTrustPage.consentBannerText.textContent();
      expect(Helpers.normalizeText(actualText)).toBe(expectedText);
    } else if (visibilityStatus.toLowerCase() === 'not displayed') {
      await expect(oneTrustPage.consentBanner).not.toBeVisible();
      await expect(oneTrustPage.consentBannerText).not.toBeVisible();
    }
  },
);

Then(
  'The {string} and {string} groups are enabled in OneTrust active groups',
  async ({ oneTrustPage }, performanceCookies: string, targetingCookies: string) => {
    const consentedCookies = (await oneTrustPage.getActiveGroupNames()).map(s => s.trim());
    expect(consentedCookies).toEqual(
      expect.arrayContaining([performanceCookies, targetingCookies, 'Other Organizations']),
    );
  },
);

Then(
  'The "Other Organizations" toggle is switched {string} in Cookie Settings',
  async ({ oneTrustPage }, toggleState: string) => {
    await oneTrustPage.cookieSettingsFooterLink.click();
    await expect(oneTrustPage.alwaysActiveGroupHeader).toContainText('Always Active');

    if (toggleState.toUpperCase() === 'ON') {
      await expect(oneTrustPage.otherOrganizationsToggle).toBeChecked();
    } else if (toggleState.toUpperCase() === 'OFF') {
      await expect(oneTrustPage.otherOrganizationsToggle).not.toBeChecked();
    } else {
      throw new Error(`Invalid toggle state "${toggleState}" provided. Expected "ON" or "OFF".`);
    }
  },
);

Then(
  'The {string} and {string} groups are not enabled in OneTrust active groups',
  async ({ oneTrustPage }, performanceCookies: string, targetingCookies: string) => {
    const consentedCookies = (await oneTrustPage.getActiveGroupNames()).map(s => s.trim());
    expect(consentedCookies).not.toEqual(
      expect.arrayContaining([performanceCookies, targetingCookies, 'Other Organizations']),
    );
  },
);
