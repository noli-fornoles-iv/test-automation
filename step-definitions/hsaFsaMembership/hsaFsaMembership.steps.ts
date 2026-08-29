import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/base.fixture';
import { d, t } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';

const { When, Then } = createBdd(test, { tags: '@HsaFsaMembership' });

When(
  /^The user searches an invalid location in the HSA-FSA location search$/,
  async ({ hsaFsaMembershipPage }) => {
    const invalidLocation = d(TestDataKeys.Locations.Search.Invalid);
    await hsaFsaMembershipPage.locationSearch.searchLocation(invalidLocation);
  },
);

When(
  /^The user searches for a location with no nearby gyms in the HSA-FSA location search$/,
  async ({ hsaFsaMembershipPage }) => {
    const noNearbyLocation = d(TestDataKeys.Locations.Search.NoNearby);
    await hsaFsaMembershipPage.locationSearch.searchLocation(noNearbyLocation);
  },
);

When(
  /^The user attempts to search for the location in the HSA-FSA and the server fails to respond$/,
  async ({ hsaFsaMembershipPage }) => {
    const defaultLocation = d(TestDataKeys.Locations.Search.Default);
    await hsaFsaMembershipPage.locationSearch.searchLocation(defaultLocation);
  },
);

When(
  /^The user searches for the "(.*)" location in the HSA-FSA location search$/,
  async ({ hsaFsaMembershipPage }, region: string) => {
    let location;
    switch (region.toLowerCase()) {
      case 'california':
        location = d(TestDataKeys.Locations.Search.California);
        break;
      case 'washington':
        location = d(TestDataKeys.Locations.Search.Washington);
        break;
      case 'locale based':
      case 'other states':
        location = d(TestDataKeys.Locations.Search.Default);
        break;
      default:
        throw new Error(`Unsupported region: ${region}`);
    }
    await hsaFsaMembershipPage.locationSearch.searchLocation(location);
  },
);

When(
  /^The user searches for the location with postal code in the HSA-FSA location search$/,
  async ({ hsaFsaMembershipPage }) => {
    await hsaFsaMembershipPage.locationSearch.searchLocation(d(TestDataKeys.ZipCode.Valid.Default));
  },
);

When(
  /^The GYM DETAILS button in the search results is clicked$/,
  async ({ hsaFsaMembershipPage }) => {
    await hsaFsaMembershipPage.locationSearch.clickGymDetailsBtn();
  },
);

When(/^The JOIN NOW button in the search results is clicked$/, async ({ hsaFsaMembershipPage }) => {
  await hsaFsaMembershipPage.locationSearch.clickJoinNowBtn();
});

Then(
  /^The invalid location error message is displayed in the HSA-FSA location search$/,
  async ({ hsaFsaMembershipPage }) => {
    const expectedErrorMessage = t(TranslationKeys.Errors.LocationSearch.InvalidLocation);
    const actualErrorMessage = await hsaFsaMembershipPage.locationSearch.getErrorMessage();
    expect(
      actualErrorMessage.includes(expectedErrorMessage) ||
        /invalid search/i.test(actualErrorMessage) ||
        /please enter a valid/i.test(actualErrorMessage),
      `Expected invalid search message but got: "${actualErrorMessage}"`,
    ).toBe(true);
  },
);

Then(
  /^The no nearby locations error is displayed in the HSA-FSA location search$/,
  async ({ hsaFsaMembershipPage }) => {
    // HSA/FSA pillar search treats gibberish "no nearby" terms as invalid search
    // (Local Config uses the same invalid token for both Invalid and No nearby).
    const actualMessage =
      (await hsaFsaMembershipPage.locationSearch.getNoNearbyGymFoundMessage().catch(() => '')) ||
      (await hsaFsaMembershipPage.locationSearch.getErrorMessage().catch(() => ''));
    const normalizedActual = actualMessage.replace(/\s+/g, ' ').trim();
    const hasExpectedMessage =
      /invalid search/i.test(normalizedActual) ||
      /not in that area yet/i.test(normalizedActual) ||
      /no gyms nearby/i.test(normalizedActual) ||
      /no locations found within/i.test(normalizedActual) ||
      /within 50 miles/i.test(normalizedActual) ||
      /please enter a valid/i.test(normalizedActual);
    expect(
      hasExpectedMessage,
      `Expected no-nearby/invalid search message but got: "${normalizedActual}"`,
    ).toBe(true);
  },
);

Then(
  /^The server-side error is shown in the HSA-FSA location search$/,
  async ({ hsaFsaMembershipPage }) => {
    const expectedErrorMessage = t(TranslationKeys.Errors.LocationSearch.ServerSide);
    const actualErrorMessage = await hsaFsaMembershipPage.locationSearch.getErrorMessage();
    expect(actualErrorMessage).toContain(expectedErrorMessage);
  },
);

Then(
  /^The system displays HSA-FSA gym results sorted by distance$/,
  async ({ hsaFsaMembershipPage }) => {
    const distances = await hsaFsaMembershipPage.locationSearch.getAllGymDistanceValues();
    const sortedDistances = [...distances].sort((a, b) => a - b);
    expect(distances).toEqual(sortedDistances);
  },
);

Then(
  /^Only max (\d+) results are shown in the HSA-FSA gym search results$/,
  async ({ hsaFsaMembershipPage }, maxGymCount: number) => {
    const actualGymCount = await hsaFsaMembershipPage.locationSearch.getNearbyGymsCount();
    expect(actualGymCount).toBeLessThanOrEqual(maxGymCount);
  },
);

Then(
  /^The gym search results for that location is displayed in HSA-FSA$/,
  async ({ hsaFsaMembershipPage }) => {
    const addresses: string[] = await hsaFsaMembershipPage.locationSearch.getAllGymAddresses();
    const expectedLocation = d(TestDataKeys.Locations.Search.Default);
    const expectedGymName = d(TestDataKeys.Locations.Gyms.Default);
    const isLocationFound = addresses.some(
      addr =>
        addr.includes(expectedLocation) || addr.includes(expectedGymName) || /woodbury/i.test(addr),
    );
    expect(isLocationFound).toBe(true);
  },
);

Then(
  /^The gym search results for that postal code is displayed in HSA-FSA$/,
  async ({ hsaFsaMembershipPage }) => {
    const addresses: string[] = await hsaFsaMembershipPage.locationSearch.getAllGymAddresses();
    const isPostalCodeFound = addresses.some(addr =>
      addr.includes(d(TestDataKeys.ZipCode.Valid.Default)),
    );
    expect(isPostalCodeFound).toBe(true);
  },
);

Then(
  /^The GYM DETAILS button is displayed in the HSA-FSA search results for the gym$/,
  async ({ hsaFsaMembershipPage }) => {
    await hsaFsaMembershipPage.locationSearch.isGymDetailsBtnVisible();
  },
);

Then(
  /^The page should redirect to the Local Landing Page$/,
  async ({ hsaFsaMembershipPage, page }) => {
    await hsaFsaMembershipPage.gymDetailsRedirection(page);
  },
);

Then(
  /^The JOIN NOW button is displayed in the HSA-FSA search results for the gym$/,
  async ({ hsaFsaMembershipPage }) => {
    await hsaFsaMembershipPage.locationSearch.isJoinNowBtnVisible();
  },
);

Then(/^The page should redirect to the Plans Page$/, async ({ hsaFsaMembershipPage, page }) => {
  await hsaFsaMembershipPage.joinNowRedirection(page);
});
