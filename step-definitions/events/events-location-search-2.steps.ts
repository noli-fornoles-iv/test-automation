import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/base.fixture';
import { SearchLocationsResponse, LocationsResponse } from '@type/api.types';
import { TIMEOUTS } from '@utils/constants';
import { Helpers } from '@utils/helpers';
import localeManager, { d, eventsLocationSearch20Placeholder, t } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';

const { When, Then } = createBdd(test, { tags: '@EventsLocationSearch20' });

function resolveEventsGymName(
  scenarioContext: {
    searchLocationsResponseBody?: SearchLocationsResponse;
    locationsResponseBody?: LocationsResponse;
  },
  gymName: string,
): string {
  const clubId = d(TestDataKeys.Locations.ClubId);

  const byClub =
    (scenarioContext.searchLocationsResponseBody &&
      Helpers.getGymNameByClubId(scenarioContext.searchLocationsResponseBody, clubId)) ||
    (scenarioContext.locationsResponseBody &&
      Helpers.getGymNameByClubId(scenarioContext.locationsResponseBody, clubId));

  if (byClub) {
    const locale = localeManager.getCurrentLocale().toLowerCase();
    const firstSearchName = scenarioContext.searchLocationsResponseBody?.items?.[0]?.name?.trim();
    if (locale === 'zh-hk' && firstSearchName) {
      return firstSearchName;
    }
    if (
      locale === 'fr-ca' &&
      firstSearchName &&
      !firstSearchName.toLowerCase().includes(byClub.toLowerCase()) &&
      !byClub.toLowerCase().includes(firstSearchName.toLowerCase())
    ) {
      return firstSearchName;
    }
    return byClub;
  }

  const firstSearchName = scenarioContext.searchLocationsResponseBody?.items?.[0]?.name?.trim();
  if (firstSearchName) {
    return firstSearchName;
  }

  return gymName;
}

function eventsLocationSearch20Text(key: keyof typeof TranslationKeys.Texts.Headings.LocationSearch.EventsLocationSearch20): string {
  try {
    return t(TranslationKeys.Texts.Headings.LocationSearch.EventsLocationSearch20[key]);
  } catch {
    return '';
  }
}

When(
  /^The user selects Join Now for the "(.*)" gym from the Events Location Search 2\.0 results$/,
  async ({ eventsPage, scenarioContext, page }, region: string) => {
    let gymName = d(TestDataKeys.Locations.Gyms.Default1);
    if (region.toLowerCase() !== 'locale based' && region.toLowerCase() !== 'other states') {
      gymName = d(TestDataKeys.Locations.Gyms.Default);
    }
    if (!scenarioContext.locationsResponseBody) {
      throw new Error('locationsResponseBody was not captured before selecting Join Now');
    }

    const resolvedGymName = resolveEventsGymName(scenarioContext, gymName);
    scenarioContext.selectedGymName = resolvedGymName;
    scenarioContext.selectedGymDisplayName = resolvedGymName;
    scenarioContext.expectedGymAddress =
      Helpers.getGymAddressByName(scenarioContext.locationsResponseBody, resolvedGymName) ??
      Helpers.getGymAddressByClubId(
        scenarioContext.locationsResponseBody,
        d(TestDataKeys.Locations.ClubId),
      );

    const eventsUrlBefore = page.url();
    await eventsPage.locationSearch.clickButtonInSearchResult(
      resolvedGymName,
      t(TranslationKeys.Buttons.LocationSearch.JoinNow),
    );
    await eventsPage.activeUserForm.waitForFormReady();
    expect(
      page.url(),
      'Events Location Search 2.0 lead form must open in-page without leaving the Events URL',
    ).toMatch(/\/events\//);
    expect(page.url()).toContain(eventsUrlBefore.split('?')[0]);
  },
);

Then(
  /^The Events Location Search 2\.0 search field title is displayed correctly$/,
  async ({ eventsPage }) => {
    await eventsPage.locationSearch.prepareForHeadingAssertions();
    const expected = eventsLocationSearch20Text('FindGymText') || 'Find your gym';
    await expect(
      eventsPage.locationSearch.iframe.getByText(expected, { exact: true }).locator('visible=true').first(),
    ).toBeVisible({ timeout: TIMEOUTS.LONG });
  },
);

Then(
  /^The Events Location Search 2\.0 search field placeholder is displayed correctly$/,
  async ({ eventsPage }) => {
    await eventsPage.locationSearch.prepareForHeadingAssertions();
    const actualText = await eventsPage.locationSearch.getText(
      eventsPage.locationSearch.searchBoxPlaceholder,
    );
    const expectedOptions = [
      eventsLocationSearch20Placeholder(),
      t(TranslationKeys.Labels.LocationSearch.SearchBoxPlaceHolder.CityStateOrZipCode),
      t(TranslationKeys.Labels.LocationSearch.SearchBoxPlaceHolder.CityOrZipCode),
    ].filter(Boolean);
    expect(
      expectedOptions,
      `Events LS 2.0 placeholder mismatch. Actual: "${actualText}"`,
    ).toContain(actualText);
  },
);

Then(
  /^The Events Location Search 2\.0 Join Now and Gym Details buttons are displayed in search results$/,
  async ({ eventsPage, scenarioContext }) => {
    const gymName = resolveEventsGymName(
      scenarioContext,
      d(TestDataKeys.Locations.Gyms.Default1),
    );
    const joinNowLabel = t(TranslationKeys.Buttons.LocationSearch.JoinNow);
    const gymDetailsLabel = t(TranslationKeys.Buttons.LocationSearch.GymDetailsTitleCase);
    await eventsPage.locationSearch.expectGymButtonsVisible(gymName, [joinNowLabel, gymDetailsLabel]);
  },
);

Then(/^The Events Location Search 2\.0 in-page lead form is displayed$/, async ({ eventsPage, page }) => {
  await eventsPage.activeUserForm.waitForFormReady();
  await expect(eventsPage.activeUserForm.firstName).toBeVisible({ timeout: TIMEOUTS.LONG });
  expect(page.url(), 'Lead form must remain on an Events page URL').toMatch(/\/events\//);
});

Then(
  /^The Events Location Search 2\.0 lead form copy is displayed correctly$/,
  async ({ eventsPage }) => {
    await eventsPage.activeUserForm.waitForFormReady();
    const iframe = eventsPage.activeUserForm.iframe;
    const title = eventsLocationSearch20Text('TellUsAboutYou') || 'Tell Us About You';
    const selectedGym = eventsLocationSearch20Text('SelectedGym') || 'Selected gym';
    const description = eventsLocationSearch20Text('AllFieldsRequired') || 'All fields are required';
    const submitCta = eventsLocationSearch20Text('SubmitCta') || 'Submit';

    await expect(iframe.getByText(title, { exact: true }).first()).toBeVisible({
      timeout: TIMEOUTS.LONG,
    });
    await expect(iframe.getByText(selectedGym, { exact: true }).first()).toBeVisible({
      timeout: TIMEOUTS.LONG,
    });
    await expect(iframe.getByText(description, { exact: true }).first()).toBeVisible({
      timeout: TIMEOUTS.LONG,
    });
    await expect(
      iframe.getByRole('button', { name: new RegExp(`^${submitCta}$`, 'i') }).first(),
    ).toBeVisible({ timeout: TIMEOUTS.LONG });
  },
);

Then(/^The Events Location Search 2\.0 lead form submission is successful$/, async ({ scenarioContext }) => {
  if (!scenarioContext.leadCaptureSuccessful) {
    throw new Error('Events Location Search 2.0 lead form submission was not successful');
  }
});
