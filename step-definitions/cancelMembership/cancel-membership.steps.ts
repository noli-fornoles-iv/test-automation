import { Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import environmentManager from '@config/environment';
import { test, expect } from '@fixtures/base.fixture';
import {
  CancelMembershipPage,
  CANCEL_MEMBERSHIP_EMAIL_TEST_CLUB_ID,
  germanFutureCancellationDate,
} from '@pages/modules/CancelMembershipPage';
import { CancelMembershipRequestPayload, SearchLocationsResponse } from '@type/api.types';
import { API_PATHS, PATHS, TIMEOUTS } from '@utils/constants';
import { Helpers, verifyUseProdApiQueryParam } from '@utils/helpers';
import { t, d } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';
import { NetworkUtils } from '@utils/network-utils';

const { Given, When, Then } = createBdd(test, { tags: '@CancelMembership' });

async function searchCancelMembershipLocation(
  cancelMembershipPage: CancelMembershipPage,
  page: Page,
  scenarioContext: { searchLocationsResponseBody?: SearchLocationsResponse },
  location: string,
): Promise<void> {
  const gymName = d(TestDataKeys.Locations.Gyms.Default);
  const maxAttempts = 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const searchResponsePromise = NetworkUtils.getResponseBody<SearchLocationsResponse>(
      page,
      API_PATHS.SEARCH_LOCATIONS_REQUEST,
      TIMEOUTS.LONG,
    ).catch(() => undefined);

    try {
      await cancelMembershipPage.locationSearch.searchLocation(location);
      const searchResponse = await searchResponsePromise;
      if (searchResponse) {
        scenarioContext.searchLocationsResponseBody = searchResponse;
      }
      await cancelMembershipPage.locationSearch.ensureGymSearchResultReady(gymName);
      return;
    } catch (error) {
      lastError = error;
      if (page.isClosed() || attempt >= maxAttempts) break;
      await cancelMembershipPage.openLocationSearchPage().catch(() => {});
      await page.waitForTimeout(1500);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Cancel Membership location search failed for "${location}"`);
}

Given(
  /^Cancel Membership IP geolocation is mocked for the current locale$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.installInLocaleIpstackMock();
  },
);

Given(
  /^Geolocation permission is granted for Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.grantGeolocation();
  },
);

Given(
  /^Geolocation permission is denied for Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.denyGeolocation();
  },
);

Given(/^Cancel Membership geolocation is blocked$/, async ({ cancelMembershipPage }) => {
  await cancelMembershipPage.denyGeolocation();
  await cancelMembershipPage.setOutsideLocaleGeolocation();
});

Given(
  /^Cancel Membership browser geolocation is set outside the locale$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.setOutsideLocaleGeolocation();
  },
);

Given(
  /^The user is on the Cancel Membership form for the default gym$/,
  async ({ cancelMembershipPage, scenarioContext }) => {
    const clubId = d(TestDataKeys.Locations.ClubId);
    await cancelMembershipPage.openFormForClub(clubId);
    scenarioContext.selectedGymClubId = clubId;
  },
);

Given(
  /^The user is on the Cancel Membership email test gym form$/,
  async ({ cancelMembershipPage, scenarioContext }) => {
    await cancelMembershipPage.openFormForEmailTestClub();
    scenarioContext.selectedGymClubId = CANCEL_MEMBERSHIP_EMAIL_TEST_CLUB_ID;
  },
);

When(
  /^The user opens Cancel Membership location search without a preselected gym$/,
  async ({ cancelMembershipPage, page }) => {
    const url = cancelMembershipPage.buildCancelMembershipUrl();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.LONG });
    await cancelMembershipPage.locationSearch.locationSearchInput.waitFor({
      state: 'visible',
      timeout: TIMEOUTS.LONG,
    });
  },
);

When(
  /^The user searches for the "(.*)" location in the Cancel Membership location search$/,
  async ({ cancelMembershipPage, page, scenarioContext }, region: string) => {
    let location: string;
    switch (region.toLowerCase()) {
      case 'locale based':
        location = d(TestDataKeys.Locations.Search.Default);
        break;
      default:
        throw new Error(`Unsupported region: ${region}`);
    }
    await searchCancelMembershipLocation(cancelMembershipPage, page, scenarioContext, location);
  },
);

When(
  /^The user searches an invalid location in the Cancel Membership location search$/,
  async ({ cancelMembershipPage, page }) => {
    const invalidLocation = d(TestDataKeys.Locations.Search.Invalid);
    await cancelMembershipPage.locationSearch.dismissLocationSuggestions().catch(() => {});
    await cancelMembershipPage.locationSearch.locationSearchInput.waitFor({
      state: 'visible',
      timeout: TIMEOUTS.LONG,
    });
    const input = cancelMembershipPage.locationSearch.locationSearchInput;
    await input.click({ force: true }).catch(() => input.tap({ force: true }));
    await input.fill(invalidLocation);
    const searchBtn = cancelMembershipPage.iframe
      .getByRole('button', { name: /search location|suchen|cerca|search/i })
      .first();
    if (await searchBtn.isVisible().catch(() => false)) {
      await searchBtn.click({ force: true });
    } else {
      await input.press('Enter');
    }
    await page.waitForTimeout(5000);
  },
);

When(
  /^The user searches for a location with no nearby gyms in the Cancel Membership location search$/,
  async ({ cancelMembershipPage, page }) => {
    const noNearbyLocation = d(TestDataKeys.Locations.Search.NoNearby);
    await cancelMembershipPage.locationSearch.dismissLocationSuggestions().catch(() => {});
    await cancelMembershipPage.locationSearch.locationSearchInput.waitFor({
      state: 'visible',
      timeout: TIMEOUTS.LONG,
    });
    const input = cancelMembershipPage.locationSearch.locationSearchInput;
    await input.click({ force: true }).catch(() => input.tap({ force: true }));
    await input.fill(noNearbyLocation);
    const searchBtn = cancelMembershipPage.iframe
      .getByRole('button', { name: /search location|suchen|cerca|search/i })
      .first();
    if (await searchBtn.isVisible().catch(() => false)) {
      await searchBtn.click({ force: true });
    } else {
      await input.press('Enter');
    }
    await page.waitForTimeout(5000);
  },
);

When(
  /^The user submits an empty Cancel Membership location search$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.submitEmptyLocationSearch();
  },
);

When(
  /^The user clicks Use Current Location in Cancel Membership location search$/,
  async ({ cancelMembershipPage, page }) => {
    const searchPromise = NetworkUtils.getResponseBody<SearchLocationsResponse>(
      page,
      API_PATHS.SEARCH_LOCATIONS_REQUEST,
      TIMEOUTS.LONG,
    ).catch(() => undefined);
    await cancelMembershipPage.clickUseCurrentLocation();
    await searchPromise;
    await page.waitForTimeout(2000);
  },
);

When(
  /^The user selects a gym from the Cancel Membership map pin$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.clickMapPinAndSelectGym();
  },
);

When(
  /^The user enters "(.*)" in the phone number field in Cancel Membership$/,
  async ({ cancelMembershipPage }, phone: string) => {
    await cancelMembershipPage.userForm.type(cancelMembershipPage.userForm.phone, phone);
  },
);

When(
  /^The user fills the remaining Cancel Membership required fields without submitting$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.userForm.type(cancelMembershipPage.userForm.firstName, 'Test');
    await cancelMembershipPage.userForm.type(cancelMembershipPage.userForm.lastName, 'User');
    await cancelMembershipPage.userForm.type(
      cancelMembershipPage.userForm.email,
      Helpers.generateRandomEmail(),
    );
    await cancelMembershipPage.fillContractNumber('CN-PHONE-TEST');
    await cancelMembershipPage.fillCancellationReason('Phone validation test');
    await cancelMembershipPage.acceptLegalDisclaimer();
  },
);

When(
  /^The user enters invalid data in the Cancel Membership form$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.userForm.type(cancelMembershipPage.userForm.firstName, '123$');
    await cancelMembershipPage.userForm.type(cancelMembershipPage.userForm.lastName, 'Test456');
    await cancelMembershipPage.userForm.type(
      cancelMembershipPage.userForm.email,
      'john.doe@example',
    );
    await cancelMembershipPage.userForm.type(
      cancelMembershipPage.userForm.phone,
      d(TestDataKeys.PhoneNumber.Invalid),
    );
  },
);

When(
  /^The user enters a contract number with 101 characters in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.fillValidCancelMembershipForm({ acceptLegal: false });
    await cancelMembershipPage.fillContractNumber('X'.repeat(101));
  },
);

When(
  /^The user enters a cancellation reason with 5001 characters in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.fillValidCancelMembershipForm({ acceptLegal: false });
    await cancelMembershipPage.fillCancellationReason('R'.repeat(5001));
  },
);

When(/^The user submits the Cancel Membership form$/, async ({ cancelMembershipPage, page }) => {
  const locale = environmentManager.get('LOCALE');
  const isNonProd = ['//sit.', '//uat.', '//dev.'].some(env => page.url().includes(env));
  if (isNonProd && !String(locale).toUpperCase().includes('US')) {
    await page.evaluate(() => {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('use_prod_api')) {
        url.searchParams.set('use_prod_api', 'true');
        window.history.replaceState({}, '', url.toString());
      }
    });
  }
  await cancelMembershipPage.submitCancellationForm();
  await page.waitForTimeout(3000);
  await verifyUseProdApiQueryParam(locale, page);
});

When(
  /^The user fills and submits the Cancel Membership form with "(earliest|specific)" cancellation date$/,
  async ({ cancelMembershipPage, page, scenarioContext }, dateType: string) => {
    const isSpecific = dateType.toLowerCase() === 'specific';
    const cancellationDate = germanFutureCancellationDate();
    const formData = {
      firstName: Helpers.generateRandomString(6),
      lastName: Helpers.generateRandomString(6),
      email: Helpers.generateRandomEmail(),
      phone: d(TestDataKeys.PhoneNumber.Valid.Default),
      contractNumber: 'CN-EMAIL-TEST',
      cancellationReason: Helpers.generateRandomString(12),
      dateType: dateType.toLowerCase(),
      cancellationDate,
    };
    scenarioContext.formData = { ...formData };

    await cancelMembershipPage.userForm.type(
      cancelMembershipPage.userForm.firstName,
      formData.firstName,
    );
    await cancelMembershipPage.userForm.type(
      cancelMembershipPage.userForm.lastName,
      formData.lastName,
    );
    await cancelMembershipPage.userForm.type(cancelMembershipPage.userForm.email, formData.email);
    await cancelMembershipPage.userForm.autofillPhoneNumber(
      cancelMembershipPage.userForm.phone,
      formData.phone,
    );
    await cancelMembershipPage.fillContractNumber(formData.contractNumber);
    await cancelMembershipPage.selectCancellationDateType(isSpecific ? 'SPECIFIC' : 'EARLIEST');
    if (isSpecific) {
      await cancelMembershipPage.fillCancellationDate(cancellationDate);
    }
    await cancelMembershipPage.fillCancellationReason(formData.cancellationReason);
    await cancelMembershipPage.acceptLegalDisclaimer();

    const locale = environmentManager.get('LOCALE');
    const isNonProd = ['//sit.', '//uat.', '//dev.'].some(env => page.url().includes(env));
    if (isNonProd && !String(locale).toUpperCase().includes('US')) {
      await page.evaluate(() => {
        const url = new URL(window.location.href);
        if (!url.searchParams.has('use_prod_api')) {
          url.searchParams.set('use_prod_api', 'true');
          window.history.replaceState({}, '', url.toString());
        }
      });
    }

    const {
      statusCodePromise: contactStatusCodePromise,
      requestHeadersPromise: contactRequestHeadersPromise,
    } = NetworkUtils.waitForStatusCodeAndHeaders(page, API_PATHS.CONTACT_REQUEST, TIMEOUTS.LONG);

    const contactRequestBodyPromise = NetworkUtils.getRequestBody<CancelMembershipRequestPayload>(
      page,
      API_PATHS.CONTACT_REQUEST,
      TIMEOUTS.LONG,
    );

    await cancelMembershipPage.submitCancellationForm();

    let contactStatusCode: number;
    let contactRequestHeaders: Record<string, string>;
    let contactRequestBody: CancelMembershipRequestPayload;
    try {
      [contactStatusCode, contactRequestHeaders, contactRequestBody] = await Helpers.runWithTimeout(
        Promise.all([
          contactStatusCodePromise,
          contactRequestHeadersPromise,
          contactRequestBodyPromise,
        ]),
        TIMEOUTS.LONG,
        'CancelMembershipCommunicationsResponse',
      );
    } catch (error) {
      const dateError = await cancelMembershipPage.iframe
        .locator('#cancellationDate-error, [id*="cancellationDate"][id$="-error"]')
        .first()
        .textContent()
        .catch(() => '');
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Cancel Membership /api/communications missed after ${dateType} submit` +
          (dateError ? ` (cancellation date error: ${dateError.trim()})` : '') +
          `. Date used: ${cancellationDate}. ${message}`,
      );
    }

    expect(contactStatusCode).toBe(200);
    expect(contactRequestHeaders['referer']).toContain(NetworkUtils.getRefererDomain());
    expect(contactRequestBody.workflow).toBe('cancel-membership');
    scenarioContext.cancelRequestBody = contactRequestBody;
    scenarioContext.selectedGymClubId = CANCEL_MEMBERSHIP_EMAIL_TEST_CLUB_ID;
    await verifyUseProdApiQueryParam(locale, page);
  },
);

Then(
  /^The gym search results for that location are displayed in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    const gymName = d(TestDataKeys.Locations.Gyms.Default);
    await cancelMembershipPage.locationSearch.ensureGymSearchResultReady(gymName);
    await expect(
      cancelMembershipPage.locationSearch.iframe
        .getByRole('button', {
          name: t(TranslationKeys.Buttons.LocationSearch.SelectGym),
        })
        .first(),
    ).toBeVisible();
  },
);

Then(
  /^Cancel Membership location search shows results after geolocation$/,
  async ({ cancelMembershipPage, page }) => {
    await page.waitForTimeout(2000);
    const gymName = d(TestDataKeys.Locations.Gyms.Default);
    const hasResults = await cancelMembershipPage.locationSearch
      .ensureGymSearchResultReady(gymName)
      .then(() => true)
      .catch(() => false);
    if (hasResults) return;

    const searchValue = (
      (await cancelMembershipPage.locationSearch.locationSearchInput
        .inputValue()
        .catch(() => '')) || ''
    ).trim();
    if (searchValue.length > 0) return;

    // Fallback: geo may still settle on list results without autofilled search text.
    const anyGymButton = await cancelMembershipPage.iframe
      .getByRole('button', { name: /WÄHLE GYM|STUDIO WÄHLEN|SELECT GYM|GYM AUSWÄHLEN/i })
      .first()
      .isVisible({ timeout: TIMEOUTS.MEDIUM })
      .catch(() => false);
    expect(anyGymButton || searchValue.length > 0 || hasResults).toBeTruthy();
  },
);

Then(
  /^The invalid location error message is displayed in the Cancel Membership location search$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.locationSearch.expectNoNearbyOrOutsideCountryEmptyState({
      classicTitle: t(TranslationKeys.Errors.LocationSearch.NoGymsNearbyHeading),
    });
  },
);

Then(
  /^The no nearby locations error is displayed in the Cancel Membership location search$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.locationSearch.expectNoNearbyOrOutsideCountryEmptyState({
      classicTitle: t(TranslationKeys.Errors.LocationSearch.NoGymsNearbyHeading),
    });
  },
);

Then(
  /^The empty location search error is displayed in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectEmptySearchFocusWithoutResultsChange();
  },
);

Then(
  /^The unable to detect location error is displayed in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectUnableToDetectLocationError();
  },
);

Then(
  /^Cancel Membership shows outside locale IP location message$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectOutsideLocaleIpMessage();
  },
);

Then(
  /^Cancel Membership retains approximate location after geolocation deny$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectLocationAccessErrorOrApproximateResults();
  },
);

Then(
  /^The user should be redirected to the Cancel Membership form for that gym$/,
  async ({ page, cancelMembershipPage }) => {
    await cancelMembershipPage.formHeading.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    expect(page.url()).toContain(PATHS.CANCEL_MEMBERSHIP);
    expect(page.url()).toMatch(/location_id=/i);
    await expect(cancelMembershipPage.userForm.firstName).toBeVisible();
  },
);

Then(
  /^The cancellation date type radio buttons are displayed in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectCancellationDateTypeRadiosVisible();
  },
);

Then(
  /^The contract number field is displayed in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectContractNumberFieldVisible();
  },
);

Then(
  /^The cancellation date field is displayed when specific date is selected in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectCancellationDateFieldWhenSpecificSelected();
  },
);

Then(
  /^The cancellation reason field is displayed in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectCancellationReasonFieldVisible();
  },
);

Then(
  /^The legal disclaimer checkbox is displayed in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectLegalDisclaimerVisible();
  },
);

Then(
  /^The Cancel Membership form validation errors are displayed$/,
  async ({ cancelMembershipPage }) => {
    const fields = ['firstName', 'lastName', 'email', 'phoneNum'] as const;
    for (const field of fields) {
      const key =
        field === 'phoneNum'
          ? TranslationKeys.Errors.UserForm.InvalidPhone
          : field === 'email'
            ? TranslationKeys.Errors.UserForm.InvalidEmail
            : TranslationKeys.Errors.UserForm.AlphaOnly;
      const displayed = await cancelMembershipPage.userForm.isErrorMessageDisplayed(field, t(key));
      expect(displayed).toBe(true);
    }
  },
);

Then(
  /^The phone number field is accepted in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    const isErrorDisplayed = await cancelMembershipPage.userForm.isErrorMessageDisplayed(
      'phoneNum',
      t(TranslationKeys.Errors.UserForm.InvalidPhone),
      { timeout: 3000 },
    );
    expect(isErrorDisplayed).toBe(false);
  },
);

Then(
  /^The contract number max length validation error is displayed in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectMaxLengthValidationOrTruncation('contractNumber', 100);
  },
);

Then(
  /^The cancellation reason max length validation error is displayed in Cancel Membership$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.expectMaxLengthValidationOrTruncation('cancellationReason', 5000);
  },
);

Then(
  /^The thank you page is displayed after successful Cancel Membership submission$/,
  async ({ cancelMembershipPage }) => {
    await cancelMembershipPage.confirmationScreen.isThankYouTextVisible();
  },
);

Then(
  /^The \/communications API payload reflects Cancel Membership "(earliest|specific)" cancellation data$/,
  async ({ scenarioContext }, dateType: string) => {
    const formData = scenarioContext.formData as
      | {
          firstName: string;
          lastName: string;
          email: string;
          phone: string;
          contractNumber: string;
          cancellationReason: string;
          cancellationDate?: string;
        }
      | undefined;
    const body = scenarioContext.cancelRequestBody as CancelMembershipRequestPayload | undefined;
    if (!formData || !body) {
      throw new Error('Cancel Membership payload was not captured during submission');
    }

    expect(body.workflow).toBe('cancel-membership');
    expect(body.first_name).toBe(formData.firstName);
    expect(body.last_name).toBe(formData.lastName);
    expect(body.email).toBe(formData.email);
    expect(body.phone_number.replace(/\D/g, '')).toBe(formData.phone.replace(/\D/g, ''));
    expect(body.message).toBe(formData.cancellationReason);
    expect(body.data?.location_number).toBe(CANCEL_MEMBERSHIP_EMAIL_TEST_CLUB_ID);
    expect(body.data?.contract_number).toBe(formData.contractNumber);

    if (dateType.toLowerCase() === 'earliest') {
      expect(body.data?.termination_date).toBe('Nächstmöglicher Zeitpunkt');
      expect(body.data?.is_termination_date_exact).toBe(false);
    } else {
      expect(body.data?.termination_date).toBe(
        formData.cancellationDate ?? germanFutureCancellationDate(),
      );
      expect(body.data?.is_termination_date_exact).toBe(true);
    }
  },
);

Then(
  /^The Cancel Membership communications payload termination_date uses German dd.mm.yyyy format$/,
  async ({ scenarioContext }) => {
    const body = scenarioContext.cancelRequestBody as CancelMembershipRequestPayload | undefined;
    if (!body?.data?.termination_date) {
      throw new Error('Cancel Membership termination_date was not captured');
    }
    expect(body.data.termination_date).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    expect(body.data.is_termination_date_exact).toBe(true);
  },
);
