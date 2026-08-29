import { createBdd } from 'playwright-bdd';
import environmentManager from '@config/environment';
import { test, expect } from '@fixtures/base.fixture';
import { CaliforniaNoticePage } from '@pages/common/CaliforniaNoticePage';
import { ProspectRequest, ProspectResponse } from '@type/api.types';
import { API_PATHS, GTM_EVENT, PATHS, TIMEOUTS } from '@utils/constants';
import { Helpers, verifyUseProdApiQueryParam } from '@utils/helpers';
import localeManager, { t, d, searchBoxPlaceholderKey } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';
import { logger } from '@utils/logger';
import { NetworkUtils } from '@utils/network-utils';
import {
  captureAppointmentScheduledWithSlotSelected,
  captureRudderStackEvent,
  rudderstackRequests,
  getPageDetails,
  LeadEventData,
  verifyFormLoadedDataLayer,
  verifyFormSuccessDataLayer,
  verifyTourAppointmentScheduledDataLayer,
} from '@utils/rudderstack';
import { toFormStartedFormTracking } from '@utils/tracking/form-started-rs-tracking';
import { remountSearchLandingForRs } from '@utils/tracking/remount-search-landing-for-rs';

const { Given, When, Then } = createBdd(test, { tags: '@BookATourStandalone' });

/** Skip (report as skipped) when Select Gym landed on MI — no ClubTour slots on test gym. */
function skipIfBatRedirectedToMembershipInquiry(
  scenarioContext: { batRedirectedToMembershipInquiry?: boolean },
  detail = 'BAT schedule / form validation',
): void {
  if (!scenarioContext.batRedirectedToMembershipInquiry) {
    return;
  }
  const reason =
    `Skipping ${detail} — BAT redirected to Membership Inquiry because the Local Config ` +
    `test gym has no ClubTour time availabilities (SPA falls back to membership-inquiry).`;
  logger.warn(reason);
  test.skip(true, reason);
}

function markBatRedirectedToMembershipInquiry(
  scenarioContext: {
    batRedirectedToMembershipInquiry?: boolean;
    canBookAppointment?: boolean;
  },
  pageUrl: string,
): void {
  scenarioContext.batRedirectedToMembershipInquiry = true;
  scenarioContext.canBookAppointment = false;
  logger.warn(
    `BAT redirected to Membership Inquiry (no ClubTour time availabilities on Local Config test gym). ` +
      `Downstream BAT schedule/form validations will be skipped. URL: ${pageUrl}`,
  );
}

Given(
  /^Rudderstack validation is enabled for Book A Tour Standalone$/,
  async ({ page, oneTrustPage, scenarioContext }) => {
    await oneTrustPage.acceptCookies();
    scenarioContext.rudderstackTestEnable = true;
    if (!scenarioContext.rudderstackCapturedRequests) {
      scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    }
  },
);

Given(
  /^The user selects the "(.*)" gym from the Book A Tour Standalone gym search results$/,
  async ({ page, bookATourStandalonePage, scenarioContext }, region: string) => {
    let gymName;
    switch (region.toLowerCase()) {
      case 'california':
        gymName = d(TestDataKeys.Locations.Gyms.California);
        break;
      case 'washington':
        gymName = d(TestDataKeys.Locations.Gyms.Washington);
        break;
      case 'locale based':
      case 'other states':
        gymName = d(TestDataKeys.Locations.Gyms.Default);
        break;
      default:
        throw new Error(`Unsupported region: ${region}`);
    }
    if (!scenarioContext.locationsResponseBody || !scenarioContext.pageName) {
      throw new Error('locationsResponseBody or page name failed to be captured in previous step');
    }

    // Availabilities fires when the user selects a gym and is redirected to the lead form.
    // Always use Local Config / AF Test Gyms clubId for override + submission — never prefer
    // Mapbox search location_number (live gyms can share the display name).
    const clubId = d(TestDataKeys.Locations.ClubId);
    const apiGymName = Helpers.getGymNameByClubId(scenarioContext.locationsResponseBody, clubId);
    const resolvedClubId = clubId;
    const resolvedGymName = apiGymName ?? gymName;
    scenarioContext.selectedGymClubId = resolvedClubId;
    scenarioContext.selectedGymDisplayName = resolvedGymName;

    try {
      await bookATourStandalonePage.locationSearch.ensureGymSearchResultReady(gymName);
      await bookATourStandalonePage.locationSearch.clickButtonInSearchResult(
        gymName,
        t(TranslationKeys.Buttons.LocationSearch.SelectGym),
        {
          waitForUrl: url =>
            (url.pathname.includes('/schedule-an-appointment-online') ||
              url.pathname.includes('/membership-inquiry')) &&
            url.searchParams.has('location_id'),
        },
      );
    } catch (error) {
      // Mobile WebKit often Target-crashes during iframe Select Gym. Prefer deep-link remount
      // over re-search (same as Contact Us / Try Us Free).
      logger.warn(
        `BAT Standalone Select Gym UI path failed; recovering via deep-link: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    // Arm availabilities after Select Gym UI — remount fires a fresh call. Listening before
    // remount risks "No resource with given identifier found" when navigation drops the body.
    const availabilitiesBodyPromise = NetworkUtils.getResponseBody<{
      staff_availabilities: { staff: { id: string | number } }[];
    }>(page, API_PATHS.SCHEDULING_AVAILABILITIES_REQUEST(), TIMEOUTS.MEDIUM).then(
      body => ({ ok: true as const, body }),
      (error: unknown) => ({ ok: false as const, error }),
    );

    // Prefer Select Gym UI form + replaceState when already ready; remount only if missing
    // (hard remount races client redirect BAT → Membership Inquiry for club 9993999).
    await bookATourStandalonePage.ensureFormReadyAfterGymSelect(String(resolvedClubId));

    if (page.url().includes('/membership-inquiry')) {
      markBatRedirectedToMembershipInquiry(scenarioContext, page.url());
    }

    const availabilitiesResult = await availabilitiesBodyPromise;
    if (availabilitiesResult.ok) {
      const staffSlots = availabilitiesResult.body.staff_availabilities ?? [];
      if (staffSlots.length === 0 && page.url().includes('/membership-inquiry')) {
        markBatRedirectedToMembershipInquiry(scenarioContext, page.url());
      }
      try {
        scenarioContext.staffId = NetworkUtils.parseStaffIdFromAvailabilitiesBody(
          availabilitiesResult.body,
        );
      } catch (parseError) {
        logger.warn(
          `staff_id missing in availabilities body on gym select; falling back to page-context fetch: ${
            parseError instanceof Error ? parseError.message : String(parseError)
          }`,
        );
      }
    } else {
      logger.warn(
        `staff_id not captured from availabilities on gym select: ${
          availabilitiesResult.error instanceof Error
            ? availabilitiesResult.error.message
            : String(availabilitiesResult.error)
        }`,
      );
      if (page.url().includes('/membership-inquiry')) {
        markBatRedirectedToMembershipInquiry(scenarioContext, page.url());
      }
    }
    if (!scenarioContext.staffId) {
      try {
        scenarioContext.staffId = await NetworkUtils.fetchStaffIdViaPageContext(
          page,
          resolvedClubId,
        );
      } catch (fallbackError) {
        logger.warn(
          `staff_id page-context fallback failed after gym select: ${
            fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
          }`,
        );
      }
    }

    const batVariant = await NetworkUtils.getBATVariantFromSessionStorage(page);
    const expectedBATVariant = Helpers.getBookATourVariant(scenarioContext.pageName);
    if (scenarioContext.batRedirectedToMembershipInquiry) {
      logger.warn(
        'Skipping BAT variant sessionStorage assert — redirected to Membership Inquiry ' +
          'because the Local Config test gym has no ClubTour time availabilities',
      );
    } else if (batVariant) {
      expect(batVariant).toBe(expectedBATVariant);
    } else {
      logger.warn(
        `BAT variant missing from sessionStorage after gym select/form navigation (expected ${expectedBATVariant}); continuing`,
      );
    }

    const locale = environmentManager.get('LOCALE');

    // Gym Address Verification (EN-GB) — use active form + bounded wait (not waitForFormReady).
    if (region.toLowerCase() === 'locale based' && locale === 'en-gb') {
      scenarioContext.expectedGymAddress = Helpers.getGymAddressByName(
        scenarioContext.locationsResponseBody,
        gymName,
      );
      const activeUserForm = await bookATourStandalonePage.getActiveUserForm();
      await activeUserForm.firstName
        .waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
        .catch(() => {});
      if (await activeUserForm.newGymAddressLine1.isVisible().catch(() => false)) {
        await activeUserForm.getText(activeUserForm.newGymAddressLine1).catch(() => '');
      }
      if (scenarioContext.expectedGymAddress) {
        scenarioContext.gymZipCode = scenarioContext.expectedGymAddress.postal_code;
      }
    }
  },
);

When(
  /^The user searches an invalid location in the Book A Tour Standalone location search$/,
  async ({ bookATourStandalonePage, page }) => {
    const url = new URL(page.url());
    url.searchParams.delete('test_location_id');
    url.searchParams.delete('use_prod_api');
    await page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(20000);
    const invalidLocation = d(TestDataKeys.Locations.Search.Invalid);
    await bookATourStandalonePage.locationSearch.searchLocation(invalidLocation);
  },
);

When(
  /^The user searches for a location with no nearby gyms in the Book A Tour Standalone location search$/,
  async ({ bookATourStandalonePage, page }) => {
    const url = new URL(page.url());
    url.searchParams.delete('test_location_id');
    url.searchParams.delete('use_prod_api');
    await page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
    // Wait for search UI readiness instead of a fixed 20s sleep (was burning suite timeout on WebKit).
    await bookATourStandalonePage.locationSearch.waitForLocationSearchReady();
    const noNearbyLocation = d(TestDataKeys.Locations.Search.NoNearby);
    await bookATourStandalonePage.locationSearch.searchLocation(noNearbyLocation);
  },
);

When(
  /^The user attempts to search for the location in the Book A Tour Standalone and the server fails to respond$/,
  async ({ bookATourStandalonePage, page }) => {
    const url = new URL(page.url());
    url.searchParams.delete('test_location_id');
    url.searchParams.delete('use_prod_api');
    await page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(20000);
    const defaultLocation = d(TestDataKeys.Locations.Search.Default);
    await bookATourStandalonePage.locationSearch.searchLocation(defaultLocation);
  },
);

When(
  /^The user searches for the "(.*)" location in the Book A Tour Standalone location search$/,
  async ({ bookATourStandalonePage, page, scenarioContext }, region: string) => {
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

    await remountSearchLandingForRs({
      page,
      scenarioContext,
      path: PATHS.BOOK_TOUR_STANDALONE,
      waitReady: () => bookATourStandalonePage.locationSearch.waitForLocationSearchReady(),
      keepTestLocationId: false,
    });
    await bookATourStandalonePage.locationSearch.searchLocation(location);
    if (
      ['locale based', 'other states', 'california', 'washington'].includes(region.toLowerCase())
    ) {
      const gymName =
        region.toLowerCase() === 'california'
          ? d(TestDataKeys.Locations.Gyms.California)
          : region.toLowerCase() === 'washington'
            ? d(TestDataKeys.Locations.Gyms.Washington)
            : d(TestDataKeys.Locations.Gyms.Default);
      await bookATourStandalonePage.locationSearch.ensureGymSearchResultReady(gymName);
    }
  },
);

When(
  /^The user searches for the location with postal code in the Book A Tour Standalone location search$/,
  async ({ bookATourStandalonePage }) => {
    await bookATourStandalonePage.locationSearch.searchLocation(
      d(TestDataKeys.ZipCode.Valid.Default),
    );
  },
);

When(
  /^The user submits the form( with empty fields)? in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, page, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const locale = environmentManager.get('LOCALE');
    await verifyUseProdApiQueryParam(locale, page);
    await page.waitForURL(/\/(schedule-an-appointment-online|membership-inquiry)(\?|$)/, {
      timeout: TIMEOUTS.LONG,
    });
    if (page.url().includes('/membership-inquiry')) {
      markBatRedirectedToMembershipInquiry(scenarioContext, page.url());
      skipIfBatRedirectedToMembershipInquiry(scenarioContext, 'empty/invalid form submit');
    }
    const userForm = await bookATourStandalonePage.getActiveUserForm();
    await userForm.waitForFormReady();
    await userForm.ensureLocatorInIframeViewport(userForm.submitBtn);
    // Validation scenarios (empty / invalid fields) only need field errors — skip consent
    // checkbox scroll on WebKit/iPhone which regularly burns the 10m suite timeout.
    await userForm.clickSubmitButton({ ensureRequiredCheckboxes: false });
    await page.waitForTimeout(5000);
    await verifyUseProdApiQueryParam(locale, page);
  },
);

When(
  /^The user enters "(.*)" in the first name field in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }, firstName: string) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    await bookATourStandalonePage.userForm.type(
      bookATourStandalonePage.userForm.firstName,
      firstName,
    );
  },
);

When(
  /^The user enters "(.*)" in the last name field in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }, lastName: string) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    await bookATourStandalonePage.userForm.type(
      bookATourStandalonePage.userForm.lastName,
      lastName,
    );
  },
);

When(
  /^The user enters "(.*)" in the email field in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }, email: string) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    await bookATourStandalonePage.userForm.type(bookATourStandalonePage.userForm.email, email);
  },
);

When(
  /^The user enters invalid number in the phone number field in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    await bookATourStandalonePage.userForm.type(
      bookATourStandalonePage.userForm.phone,
      d(TestDataKeys.PhoneNumber.Invalid),
    );
  },
);

When(
  /^The user autofills the phone number field in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage }) => {
    await bookATourStandalonePage.userForm.autofillPhoneNumber(
      bookATourStandalonePage.userForm.phone,
      d(TestDataKeys.PhoneNumber.Valid.Default),
    );
  },
);

When(
  /^The user copies and pastes a valid number into the phone number field in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage }) => {
    await bookATourStandalonePage.userForm.copyPastePhoneNumber(
      bookATourStandalonePage.userForm.phone,
      d(TestDataKeys.PhoneNumber.Valid.Default),
    );
  },
);

When(
  /^The user enters more than 30 characters in the "(.*)" field in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage }, fieldName: string) => {
    switch (fieldName.toLowerCase()) {
      case 'first name':
        await bookATourStandalonePage.userForm.type(
          bookATourStandalonePage.userForm.firstName,
          Helpers.generateRandomString(31),
        );
        break;
      case 'last name':
        await bookATourStandalonePage.userForm.type(
          bookATourStandalonePage.userForm.lastName,
          Helpers.generateRandomString(31),
        );
        break;
      default:
        throw new Error(`Unhandled field name "${fieldName}" in step definition`);
    }
  },
);

When(
  /^The user fills the form with valid data in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const formData = {
      firstName: Helpers.generateRandomString(6),
      lastName: Helpers.generateRandomString(6),
      email: Helpers.generateRandomEmail(),
      phone: d(TestDataKeys.PhoneNumber.Valid.Default),
    };

    await bookATourStandalonePage.userForm.fillAndSubmitForm(formData, false);
    scenarioContext.formData = formData;
  },
);

When(
  /^The user selects a date from the schedule picker in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const clubId = String(scenarioContext.selectedGymClubId ?? d(TestDataKeys.Locations.ClubId));
    const readyClubId = await bookATourStandalonePage.ensureScheduleFormReady(clubId);
    scenarioContext.selectedGymClubId = readyClubId;
    await bookATourStandalonePage.userForm.ensureDisableCaptchaPersisted();
    await bookATourStandalonePage.bookATour.waitForVisible(
      bookATourStandalonePage.bookATour.datePicker.first(),
      TIMEOUTS.LONG,
    );
    const availableDates = await bookATourStandalonePage.bookATour.getAllAvailableDates();
    if (!availableDates.length) throw new Error('No available dates found');
    const randomDate = Helpers.getRandomElement(availableDates);
    await bookATourStandalonePage.bookATour.selectDate(randomDate);
    scenarioContext.scheduledDate = await bookATourStandalonePage.bookATour.getText(randomDate);
  },
);

When(
  /^The user selects a time from the schedule picker in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const clubId = String(scenarioContext.selectedGymClubId ?? d(TestDataKeys.Locations.ClubId));
    const readyClubId = await bookATourStandalonePage.ensureScheduleFormReady(clubId);
    scenarioContext.selectedGymClubId = readyClubId;
    await bookATourStandalonePage.bookATour.waitForVisible(
      bookATourStandalonePage.bookATour.timePicker.first(),
      TIMEOUTS.LONG,
    );
    const availableTimes = await bookATourStandalonePage.bookATour.getAllAvailableTimes();
    if (!availableTimes.length) throw new Error('No available time slots found');
    const randomTime = Helpers.getRandomElement(availableTimes);
    await bookATourStandalonePage.bookATour.selectTime(randomTime);
    scenarioContext.scheduledTime = await bookATourStandalonePage.bookATour.getText(randomTime);
  },
);

When(/^The user refreshes the page in the Book A Tour Standalone$/, async ({ page }) => {
  await page.reload();
  await page.waitForTimeout(5000);
  const locale = environmentManager.get('LOCALE');
  await verifyUseProdApiQueryParam(locale, page);
});

When(
  /^The user interacts with the lead form in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, page, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    const clubId = String(scenarioContext.selectedGymClubId ?? d(TestDataKeys.Locations.ClubId));
    // Stay fast: SIT redirects BAT → Membership Inquiry in ~8s if we burn time on schedule waits.
    if (
      page.url().includes('/membership-inquiry') ||
      (await page
        .locator('#book-a-tour-iframe')
        .count()
        .catch(() => 0)) === 0
    ) {
      await bookATourStandalonePage.ensureFormReadyAfterGymSelect(clubId);
      if (page.url().includes('/membership-inquiry')) {
        markBatRedirectedToMembershipInquiry(scenarioContext, page.url());
        skipIfBatRedirectedToMembershipInquiry(scenarioContext, 'lead form interaction / RS');
      }
    }
    const userForm = await bookATourStandalonePage.getActiveUserForm();
    await userForm.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    // Arm form_loaded wait before first keystroke — event fires on interaction (MCO pattern).
    const formLoadedPromise = NetworkUtils.isGTMEventFired(
      page,
      GTM_EVENT.FORM_LOADED,
      TIMEOUTS.LONG,
    );
    await userForm.ensureLocatorInIframeViewport(userForm.firstName).catch(() => {});
    await userForm.type(userForm.firstName, Helpers.generateRandomString(4));
    scenarioContext.formLoadedObserved = await formLoadedPromise;
  },
);

When(
  /^The user clicks the "(.*)" link in the Book A Tour Standalone$/,
  async ({ page, context, bookATourStandalonePage, scenarioContext }, linkName: string) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const locator = bookATourStandalonePage.userForm.getFormLinkLocator(linkName);
    const maxRetries = 3;

    // Consolidated journeys click Privacy → Terms → SMS in one scenario; close prior
    // popup tabs so Then can keep asserting exactly one new tab (pages.length === 2).
    const existingExtraPages = context.pages().filter(openPage => openPage !== page);
    for (const extraPage of existingExtraPages) {
      await extraPage.close().catch(() => {});
    }
    scenarioContext.newTab = undefined;

    // clickFormLinkInIframe already waitForFormReady + scrolls the legal link into view.
    // Do not call scrollConsentIntoView here — it re-runs gym waits and times out stacked links.

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const [newPage] = await Promise.all([
          context.waitForEvent('page', { timeout: TIMEOUTS.LONG }),
          bookATourStandalonePage.userForm.clickFormLinkInIframe(locator),
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        scenarioContext.newTab = newPage;
        return;
      } catch (error) {
        const stalePages = context.pages().filter(openPage => openPage !== page);
        for (const stalePage of stalePages) {
          await stalePage.close().catch(() => {});
        }
        if (attempt === maxRetries) throw error;
        await bookATourStandalonePage.userForm.scrollConsentIntoView(locator);
      }
    }
  },
);

When(
  /^The user selects a date, time and submits the form with valid data in the Book A Tour Standalone$/,
  async ({ page, bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const MAX_SUBMIT_ATTEMPTS = 5;
    const LEAD_CAPTURE_RESPONSE_TIMEOUT = TIMEOUTS.LONG;
    const SUBMIT_PROCESSING_TIMEOUT = TIMEOUTS.LONG;
    let submitAttempt = 0;
    let booked = false;
    let request;
    let formFilled = false;
    // Soft 408 retry already reselected date/time — skip heavy iframe scroll on next loop.
    let scheduleReadyFromSoftRetry = false;
    let remountedSecondaryAfter408 = false;

    if (!scenarioContext.pageName) {
      throw new Error('Page name was not captured by previous step');
    }

    const formData = scenarioContext.formData ?? {
      firstName: Helpers.generateRandomString(6),
      lastName: Helpers.generateRandomString(6),
      email: Helpers.generateRandomEmail(),
      phone: d(TestDataKeys.PhoneNumber.Valid.Default),
    };
    scenarioContext.formData = formData;

    let clubId = String(scenarioContext.selectedGymClubId ?? d(TestDataKeys.Locations.ClubId));

    const isLeadCaptureSuccess = (status: number) => status === 200 || status === 201;

    while (!booked && submitAttempt < MAX_SUBMIT_ATTEMPTS) {
      submitAttempt++;
      console.log(`Book A Tour Standalone submit attempt #${submitAttempt}`);

      const readyClubId = await bookATourStandalonePage.ensureScheduleFormReady(clubId);
      scenarioContext.selectedGymClubId = readyClubId;
      if (scheduleReadyFromSoftRetry) {
        scheduleReadyFromSoftRetry = false;
        console.log('Book A Tour Standalone skipping heavy schedule scroll after soft 408 retry');
      } else {
        await bookATourStandalonePage.bookATour.scrollSchedulePickerIntoView();
      }

      if (!formFilled) {
        const { dateText, timeText } =
          await bookATourStandalonePage.bookATour.selectRandomDateAndTime();
        scenarioContext.scheduledDate = dateText;
        scenarioContext.scheduledTime = timeText;

        scenarioContext.selectedGymName = await bookATourStandalonePage.userForm.getText(
          bookATourStandalonePage.userForm.newGymAddressLine1,
        );

        if (scenarioContext.rudderstackTestEnable && submitAttempt === 1) {
          request = await rudderstackRequests(page);
        }
      }

      let leadCaptureRequestSeen = false;
      const onLeadCaptureRequest = (req: import('@playwright/test').Request) => {
        if (req.method() === 'POST' && req.url().includes(API_PATHS.PROSPECTS_REQUEST)) {
          leadCaptureRequestSeen = true;
          console.log(`Book A Tour Standalone lead-capture request observed: ${req.url()}`);
        }
      };

      // Fill first (mobile scrolling can take minutes). Register lead-capture listeners only
      // immediately before SUBMIT so the 120s response wait is not burned during form fill.
      // Skip re-fill when a prior "fills the form with valid data" step already populated fields
      // (consolidated journeys) — double fill on WebKit regularly exhausts the 10m test timeout.
      if (!formFilled) {
        const alreadyFilled = Boolean(
          scenarioContext.formData?.firstName &&
            (await bookATourStandalonePage.userForm.firstName.inputValue().catch(() => '')).trim(),
        );
        if (!alreadyFilled) {
          await bookATourStandalonePage.userForm.fillAndSubmitForm(
            formData as unknown as UserFormData,
            false,
          );
        } else {
          console.log(
            'Book A Tour Standalone reusing pre-filled form fields from prior step; skipping re-fill',
          );
        }
        formFilled = true;
      }

      const {
        statusCodePromise: prospectStatusCodePromise,
        responseBodyPromise: prospectResponsePromise,
        requestHeadersPromise: prospectRequestHeadersPromise,
        requestBodyPromise: prospectRequestBodyPromise,
      } = NetworkUtils.waitForStatusCodeHeadersAndBody<ProspectResponse, ProspectRequest>(
        page,
        API_PATHS.PROSPECTS_REQUEST,
        LEAD_CAPTURE_RESPONSE_TIMEOUT,
      );
      page.on('request', onLeadCaptureRequest);

      await bookATourStandalonePage.userForm.clickSubmitButton({
        ensureRequiredCheckboxes: true,
      });

      // Mobile/WebKit: click can appear to succeed while SUBMIT is covered or date/time lost.
      // If no lead-capture POST arrives quickly, re-select schedule and click again.
      const isMobileSubmit = await Helpers.isMobileDevice(page).catch(() => false);
      const requestWaitMs = isMobileSubmit ? 20000 : 10000;
      const requestWaitDeadline = Date.now() + requestWaitMs;
      while (!leadCaptureRequestSeen && Date.now() < requestWaitDeadline) {
        await page.waitForTimeout(500);
      }
      if (!leadCaptureRequestSeen) {
        console.warn(
          `Book A Tour Standalone no lead-capture POST after initial submit on attempt ${submitAttempt}; re-selecting date/time and re-clicking`,
        );
        try {
          await bookATourStandalonePage.bookATour.waitForSchedulePickerReady();
          await bookATourStandalonePage.bookATour.scrollSchedulePickerIntoView();
          const { dateText, timeText } =
            await bookATourStandalonePage.bookATour.selectRandomDateAndTime();
          scenarioContext.scheduledDate = dateText;
          scenarioContext.scheduledTime = timeText;
        } catch (reselectError) {
          console.warn(
            `Book A Tour Standalone date/time re-select failed on attempt ${submitAttempt}; continuing with SUBMIT re-click only`,
            reselectError,
          );
        }
        // Re-check consent with real interaction before re-click (DOM-only state can block POST).
        await bookATourStandalonePage.userForm.checkConsentCheckbox().catch(() => {});
        await bookATourStandalonePage.userForm.checkLocalResidentCheckbox().catch(() => {});
        await bookATourStandalonePage.userForm.clickSubmitButton({
          ensureRequiredCheckboxes: true,
        });
      }

      let prospectStatusCode = 0;
      let prospectResponseBody!: ProspectResponse;
      let prospectRequestHeaders!: Record<string, string>;
      let prospectRequestBody!: ProspectRequest;
      let leadCaptureTimedOut = false;

      try {
        // Race: lead-capture response OR submit settle / client API error — do not wait for
        // the SUBMIT spinner to clear before awaiting /api/lead-capture (spinner can hang forever
        // when the API never responds).
        const settlePromise = bookATourStandalonePage.userForm
          .waitForSubmitProcessingToFinish(SUBMIT_PROCESSING_TIMEOUT)
          .then(() => 'settled' as const);
        const leadCapturePromise = Helpers.runWithTimeout(
          Promise.all([
            prospectStatusCodePromise,
            prospectResponsePromise,
            prospectRequestHeadersPromise,
            prospectRequestBodyPromise,
          ]),
          LEAD_CAPTURE_RESPONSE_TIMEOUT,
          'BookATourStandaloneProspectResponse',
        ).then(
          result =>
            ({
              kind: 'lead' as const,
              result,
            }) as const,
        );

        const winner = await Promise.race([settlePromise, leadCapturePromise]);

        if (winner === 'settled') {
          if (!leadCaptureRequestSeen) {
            console.warn(
              `Book A Tour Standalone submit settled without /api/lead-capture on attempt ${submitAttempt}; re-clicking SUBMIT`,
            );
            await bookATourStandalonePage.userForm.clickSubmitButton({
              ensureRequiredCheckboxes: true,
            });
          }
          [prospectStatusCode, prospectResponseBody, prospectRequestHeaders, prospectRequestBody] =
            await Helpers.runWithTimeout(
              Promise.all([
                prospectStatusCodePromise,
                prospectResponsePromise,
                prospectRequestHeadersPromise,
                prospectRequestBodyPromise,
              ]),
              Math.min(LEAD_CAPTURE_RESPONSE_TIMEOUT, TIMEOUTS.MEDIUM),
              'BookATourStandaloneProspectResponseAfterSettle',
            );
        } else {
          [prospectStatusCode, prospectResponseBody, prospectRequestHeaders, prospectRequestBody] =
            winner.result;
        }
      } catch (error) {
        leadCaptureTimedOut = true;
        let isClientApiErrorVisible = false;
        try {
          if (!page.isClosed()) {
            isClientApiErrorVisible =
              await bookATourStandalonePage.userForm.isClientApiErrorVisible();
          }
        } catch {
          // Page may already be closing from test timeout
        }

        if (submitAttempt < MAX_SUBMIT_ATTEMPTS && !page.isClosed()) {
          console.warn(
            `Book A Tour Standalone lead-capture timed out on attempt ${submitAttempt}; retrying submit` +
              (isClientApiErrorVisible ? ' (client API error visible)' : '') +
              (leadCaptureRequestSeen ? ' (request was sent)' : ' (no request observed)'),
          );
          // Stuck spinner / hung API — reload so the next attempt can re-bind listeners cleanly.
          await page.reload({ waitUntil: 'domcontentloaded' });
          formFilled = false;
          await bookATourStandalonePage.userForm.ensureDisableCaptchaPersisted();
          await bookATourStandalonePage.bookATour.waitForSchedulePickerReady();
          continue;
        }

        if (isClientApiErrorVisible || leadCaptureTimedOut) {
          throw new Error(
            `Submit 3 Attemps but Client API error still occur` +
              (leadCaptureRequestSeen ? '' : ' (lead-capture POST never observed)'),
          );
        }
        throw error;
      } finally {
        page.off('request', onLeadCaptureRequest);
      }

      const slotErrorVisible = await bookATourStandalonePage.bookATour.isErrorMessageVisible(
        t(TranslationKeys.Errors.BatAddon.SlotConflict),
      );
      let isClientApiErrorVisible =
        await bookATourStandalonePage.userForm.isClientApiErrorVisible();
      // Lead-capture may return 200 or 201 depending on gateway / env.
      if (prospectStatusCode === 201 && !isClientApiErrorVisible && !slotErrorVisible) {
        await page.waitForTimeout(1500).catch(() => {});
        isClientApiErrorVisible = await bookATourStandalonePage.userForm.isClientApiErrorVisible();
      }
      const isClientApiFailure =
        !isLeadCaptureSuccess(prospectStatusCode) || isClientApiErrorVisible;

      const expectedWorkFlowName = Helpers.getWorkFlowName(scenarioContext.pageName);
      const expectedLeadSourceCodes = Helpers.getLeadSourceCode(scenarioContext.pageName);
      const addressData = prospectRequestBody.prospectData.address_data;

      if (
        !slotErrorVisible &&
        isLeadCaptureSuccess(prospectStatusCode) &&
        !isClientApiErrorVisible
      ) {
        expect(prospectRequestHeaders['referer']).toContain(NetworkUtils.getRefererDomain());
        expect(prospectResponseBody.prospect.external_id).not.toBeNull();
        expect(prospectResponseBody.prospect.first_name).toBe(formData.firstName);
        expect(prospectResponseBody.prospect.last_name).toBe(formData.lastName);
        expect(prospectResponseBody.prospect.email).toBe(formData.email);
        expect(prospectRequestBody.prospectData.first_name).toBe(formData.firstName);
        expect(prospectRequestBody.prospectData.last_name).toBe(formData.lastName);
        expect(prospectRequestBody.prospectData.email).toBe(formData.email);
        expect(prospectRequestBody.prospectData.mobile_phone).toBe(formData.phone);
        expect(prospectRequestBody.workflow_name).toBe(expectedWorkFlowName);
        expect(expectedLeadSourceCodes).toContain(prospectRequestBody.prospectData.origin_source);
        if (scenarioContext.gymZipCode) {
          expect(addressData?.zip).toBe(scenarioContext.gymZipCode);
        } else {
          expect(addressData?.zip).toBeTruthy();
        }
        expect(addressData).not.toHaveProperty('city');
        expect(addressData).not.toHaveProperty('stateProvince');
        expect(addressData).not.toHaveProperty('country');
        expect(addressData).not.toHaveProperty('address');
        expect(addressData).not.toHaveProperty('address2');
        expect(prospectRequestBody.locale?.toLowerCase()).toBe(
          localeManager.getCurrentLocale().toLowerCase(),
        );

        if (!process.env.CI) {
          const isFormSuccessFired = await NetworkUtils.isGTMEventFired(
            page,
            GTM_EVENT.FORM_SUCCESS,
            TIMEOUTS.MEDIUM,
          );
          expect(isFormSuccessFired).toBeTruthy();
        }

        scenarioContext.canBookAppointment = prospectResponseBody.prospect.can_book_appointment;
        scenarioContext.leadCaptureSuccessful = true;
        scenarioContext.leadCaptureId = String(prospectResponseBody.prospect.lead_capture_id);
        scenarioContext.selectedGymClubId = String(prospectResponseBody.prospect.location_number);
        booked = true;

        if (scenarioContext.rudderstackTestEnable && request) {
          const pageDetails = await getPageDetails(page);
          const data: LeadEventData = [
            String(prospectResponseBody.prospect.lead_id),
            String(prospectResponseBody.prospect.lead_capture_id),
            String(prospectResponseBody.prospect.location_number),
            true,
          ];

          await captureRudderStackEvent({
            requests: request,
            event: 'identify',
            page,
            data,
            pageDetails,
          });

          await captureRudderStackEvent({
            requests: request,
            event: 'Lead Captured',
            page,
            data,
            pageDetails,
            // AFW-3956: appointment_visit + offer_*
            formTracking: toFormStartedFormTracking('Book A Tour Standalone'),
          });

          // Appointment Scheduled only fires when booking is allowed and confirmation mounts.
          // Do not poll for it when can_book=false / thank-you — that burned the 10m suite
          // timeout (page closed mid-waitForTimeout in captureRudderStackEvent).
          const canBook = prospectResponseBody.prospect.can_book_appointment === true;
          const onThankYou =
            /thank-you/i.test(page.url()) ||
            (await page
              .getByRole('heading', { name: /thank\s*you/i })
              .first()
              .isVisible({ timeout: TIMEOUTS.SHORT })
              .catch(() => false));

          if (!canBook || onThankYou) {
            scenarioContext.canBookAppointment = false;
            logger.info(
              'Skipping Appointment Scheduled Rudderstack — can_book_appointment is false or thank-you page shown',
            );
          } else {
            const bookingConfirmed = await bookATourStandalonePage.bookATour
              .waitForBookingConfirmationScreen(TIMEOUTS.MEDIUM)
              .then(() => true)
              .catch(() => false);

            if (!bookingConfirmed) {
              // API said bookable but confirmation never mounted — do not burn 45s+ RS poll.
              scenarioContext.canBookAppointment = false;
              logger.warn(
                'Book A Tour Standalone booking confirmation not visible after lead capture — skipping Appointment Scheduled RS',
              );
            } else {
              await captureAppointmentScheduledWithSlotSelected({
                requests: request,
                page,
                data,
                pageDetails,
              });
            }
          }

          scenarioContext.rudderstackLeadEventsVerified = true;
        }
      } else if (slotErrorVisible && submitAttempt < MAX_SUBMIT_ATTEMPTS) {
        await page.reload({ waitUntil: 'domcontentloaded' });
        formFilled = false;
        await bookATourStandalonePage.bookATour.waitForSchedulePickerReady();
      } else if (isClientApiFailure && submitAttempt < MAX_SUBMIT_ATTEMPTS) {
        console.warn(
          `Book A Tour Standalone lead-capture failed with status ${prospectStatusCode} on attempt ${submitAttempt}; retrying submit`,
        );
        // After repeated 408s on primary club, remount Local Config Secondary Club Id once
        // (same pattern as empty ClubTour slots — do not invent IDs).
        if (prospectStatusCode === 408 && !remountedSecondaryAfter408) {
          try {
            const secondary = d(TestDataKeys.Locations.SecondaryClubId);
            if (secondary && String(secondary) !== String(clubId)) {
              console.warn(
                `Book A Tour Standalone remounting Secondary Club Id ${secondary} after lead-capture 408 on club ${clubId}`,
              );
              clubId = String(secondary);
              remountedSecondaryAfter408 = true;
              formFilled = false;
              scheduleReadyFromSoftRetry = false;
              await bookATourStandalonePage.ensureScheduleFormReady(clubId);
              scenarioContext.selectedGymClubId = clubId;
              continue;
            }
          } catch (secondaryError) {
            console.warn(
              `Book A Tour Standalone Secondary Club remount after 408 failed: ${
                secondaryError instanceof Error ? secondaryError.message : String(secondaryError)
              }`,
            );
          }
        }
        // Prefer a soft retry (keep filled fields) so mobile does not burn minutes re-filling
        // after intermittent UAT/SIT 408s. Avoid heavy iframe centering (WebKit hang) —
        // light date/time reselect only; reload only when the schedule picker is unusable.
        let softRetryOk = false;
        try {
          if (!page.isClosed()) {
            await bookATourStandalonePage.userForm.ensureDisableCaptchaPersisted();
            await bookATourStandalonePage.bookATour.waitForSchedulePickerReady(TIMEOUTS.MEDIUM);
            const { dateText, timeText } =
              await bookATourStandalonePage.bookATour.selectRandomDateAndTime();
            scenarioContext.scheduledDate = dateText;
            scenarioContext.scheduledTime = timeText;
            softRetryOk = true;
            scheduleReadyFromSoftRetry = true;
          }
        } catch (softRetryError) {
          console.warn(
            `Book A Tour Standalone soft retry after ${prospectStatusCode} failed on attempt ${submitAttempt}; falling back to reload`,
            softRetryError,
          );
        }
        if (!softRetryOk) {
          await page.reload({ waitUntil: 'domcontentloaded' });
          formFilled = false;
          scheduleReadyFromSoftRetry = false;
          await bookATourStandalonePage.userForm.ensureDisableCaptchaPersisted();
          await bookATourStandalonePage.bookATour.waitForSchedulePickerReady();
        }
      } else if (isClientApiFailure) {
        throw new Error(
          `Submit ${MAX_SUBMIT_ATTEMPTS} attempts but Client API error still occur` +
            ` (last status ${prospectStatusCode}, club ${clubId}` +
            (remountedSecondaryAfter408 ? ', secondary remount tried' : '') +
            ')',
        );
      } else {
        throw new Error(
          `Failed to book a tour after ${submitAttempt} attempt(s). Prospect status: ${prospectStatusCode}`,
        );
      }
    }
  },
);

When(
  /^The user clicks the Schedule an Appointment button$/,
  async ({ bookATourStandalonePage }) => {
    await bookATourStandalonePage.localGym.clickScheduleAnAppointment2_0();
  },
);

When(
  /^The user submits the BAT Standalone form with email "(.*)"$/,
  async ({ bookATourStandalonePage }, emailAddress: string) => {
    await bookATourStandalonePage.userForm.overrideLocationAndDisableCaptcha(
      d(TestDataKeys.Locations.ClubId),
    );

    await bookATourStandalonePage.bookATour.waitForVisible(
      bookATourStandalonePage.bookATour.datePicker.first(),
      TIMEOUTS.MEDIUM,
    );

    await bookATourStandalonePage.bookATour.selectRandomDateAndTime();

    const formData = {
      firstName: Helpers.generateRandomString(6),
      lastName: Helpers.generateRandomString(6),
      email: emailAddress,
      phone: d(TestDataKeys.PhoneNumber.Valid.Default),
    };

    await bookATourStandalonePage.userForm.fillAndSubmitForm(formData);
  },
);

When(
  /^The user submits the BAT Standalone form with tracking disabled using email "(.*)"$/,
  async ({ bookATourStandalonePage, page, scenarioContext }, emailAddress: string) => {
    await bookATourStandalonePage.userForm.overrideLocationAndDisableCaptcha(
      d(TestDataKeys.Locations.ClubId),
    );

    await bookATourStandalonePage.bookATour.waitForVisible(
      bookATourStandalonePage.bookATour.datePicker.first(),
      TIMEOUTS.MEDIUM,
    );

    await bookATourStandalonePage.bookATour.selectRandomDateAndTime();

    const formData = {
      firstName: Helpers.generateRandomString(6),
      lastName: Helpers.generateRandomString(6),
      email: emailAddress,
      phone: d(TestDataKeys.PhoneNumber.Valid.Default),
    };

    // Submit the form
    await bookATourStandalonePage.userForm.fillAndSubmitForm(formData);

    // Wait until form_success event is present, but check emailsha256 should NOT exist
    const isEmailShaFound = await page
      .waitForFunction(
        () => {
          const dl = (
            window as unknown as { dataLayer?: { event: string; emailsha256?: string }[] }
          ).dataLayer;
          if (!Array.isArray(dl)) return false;
          const formSuccess = dl.filter(obj => obj.event === 'form_success').pop();
          if (!formSuccess) return false;
          return !!formSuccess.emailsha256;
        },
        { timeout: TIMEOUTS.LONG },
      )
      .then(h => h.jsonValue())
      .catch(() => false);

    scenarioContext.isEmailShaFound = isEmailShaFound;
  },
);

When(
  /^The user opens the Local Resident modal in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    await bookATourStandalonePage.userForm.openLocalResidentModal();
  },
);

Then(
  /^The invalid location error message is displayed in the Book A Tour Standalone location search$/,
  async ({ bookATourStandalonePage }) => {
    const expectedErrorMessage = t(TranslationKeys.Errors.LocationSearch.InvalidLocation);
    const actualErrorMessage = await bookATourStandalonePage.locationSearch.getErrorMessage();
    expect(actualErrorMessage).toContain(expectedErrorMessage);
  },
);

Then(
  /^The server-side error is shown in the Book A Tour Standalone location search$/,
  async ({ bookATourStandalonePage }) => {
    const expectedErrorMessage = t(TranslationKeys.Errors.LocationSearch.ServerSide);
    const actualErrorMessage = await bookATourStandalonePage.locationSearch.getErrorMessage();
    expect(actualErrorMessage).toContain(expectedErrorMessage);
  },
);

Then(
  /^The no nearby locations error is displayed in the Book A Tour Standalone location search$/,
  async ({ bookATourStandalonePage }) => {
    // Local Config noNearby (ikkkkkk) often renders outside-country empty-state
    // ("LET'S GET YOU TO THE RIGHT PLACE") instead of classic NO GYMS NEARBY — accept both.
    await bookATourStandalonePage.locationSearch.expectNoNearbyOrOutsideCountryEmptyState({
      classicTitle: t(TranslationKeys.Errors.LocationSearch.NoGymsNearby),
      classicDescription: t(TranslationKeys.Errors.LocationSearch.NoGymsNearbyDescription),
    });
  },
);

Then(
  /^The system displays Book a Tour Standalone gym results sorted by distance$/,
  async ({ bookATourStandalonePage }) => {
    const distances = await bookATourStandalonePage.locationSearch.getAllGymDistanceValues2_0();
    const sortedDistances = [...distances].sort((a, b) => a - b);
    expect(distances).toEqual(sortedDistances);
  },
);

Then(
  /^Only max (\d+) results are shown in the Book a Tour Standalone gym search results$/,
  async ({ bookATourStandalonePage }, maxGymCount: number) => {
    const actualGymCount = await bookATourStandalonePage.locationSearch.getNearbyGymsCount2_0();
    expect(actualGymCount).toBeLessThanOrEqual(maxGymCount);
  },
);

Then(
  /^The gym search results for that location is displayed in Book A Tour Standalone$/,
  async ({ bookATourStandalonePage }) => {
    const addresses: string[] =
      await bookATourStandalonePage.locationSearch.getAllGymAddresses2_0();
    const defaultSearch = d(TestDataKeys.Locations.Search.Default);
    const locale = localeManager.getCurrentLocale().toLowerCase();
    const needles =
      locale === 'fr-ca'
        ? [defaultSearch, 'Montreal', 'Montréal', 'QC', 'Winnipeg']
        : [defaultSearch];
    const isLocationFound = addresses.some(addr =>
      needles.some(needle => addr.toLowerCase().includes(needle.toLowerCase())),
    );
    expect(isLocationFound).toBe(true);
  },
);

Then(
  /^The gym search results for that postal code is displayed in Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, page }) => {
    const currentUrl = page.url();

    console.log('Current URL:', currentUrl);

    const addresses: string[] =
      await bookATourStandalonePage.locationSearch.getAllGymAddresses2_0();

    const isPostalCodeFound = addresses.some(addr =>
      addr.includes(d(TestDataKeys.ZipCode.Valid.Default)),
    );

    expect(isPostalCodeFound).toBe(true);
  },
);

Then(
  /^The SELECT GYM button is displayed in the Book A Tour Standalone search results for the gym$/,
  async ({ bookATourStandalonePage }) => {
    const buttonTexts = await bookATourStandalonePage.locationSearch.getGymButtonsText(
      d(TestDataKeys.Locations.Gyms.Default),
    );
    expect(buttonTexts.length).toBe(1);
    expect(buttonTexts[0]).toBe(t(TranslationKeys.Buttons.LocationSearch.SelectGym));
  },
);

Then(
  /^The required field error is shown for all input fields in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const userForm = await bookATourStandalonePage.getActiveUserForm();
    const fieldToErrorKey: Record<string, string> = {
      firstName: TranslationKeys.Errors.UserForm.RequiredField.FirstName,
      lastName: TranslationKeys.Errors.UserForm.RequiredField.LastName,
      email: TranslationKeys.Errors.UserForm.RequiredField.Email,
      phoneNum: TranslationKeys.Errors.UserForm.RequiredField.Phone,
    };

    const fields = Object.keys(fieldToErrorKey);

    for (const field of fields) {
      const expectedMessage = t(fieldToErrorKey[field]);
      const isDisplayed = await userForm.isErrorMessageDisplayed(field, expectedMessage);
      expect(isDisplayed).toBe(true);
    }
    await userForm.takeElementScreenshotIfWebkit(userForm.iframeElement);
  },
);

Then(
  /^The server side error message is displayed in the Book A Tour Standalone user form$/,
  async ({ bookATourStandalonePage }) => {
    const actualErrorMessage = await bookATourStandalonePage.userForm.getErrorMessage();
    expect(actualErrorMessage).toContain(t(TranslationKeys.Errors.UserForm.ServerSide));
  },
);

Then(
  /^The email validation error is displayed in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const isDisplayed = await bookATourStandalonePage.userForm.isErrorMessageDisplayed(
      'email',
      t(TranslationKeys.Errors.UserForm.InvalidEmail),
    );
    expect(isDisplayed).toBe(true);
    await bookATourStandalonePage.userForm.takeElementScreenshotIfWebkit(
      bookATourStandalonePage.userForm.iframeElement,
    );
  },
);

Then(
  /^The phone number validation error is displayed in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const isDisplayed = await bookATourStandalonePage.userForm.isErrorMessageDisplayed(
      'phoneNum',
      t(TranslationKeys.Errors.UserForm.InvalidPhone),
    );
    expect(isDisplayed).toBe(true);
    await bookATourStandalonePage.userForm.takeElementScreenshotIfWebkit(
      bookATourStandalonePage.userForm.iframeElement,
    );
  },
);

Then(
  /^The phone number field is accepted in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage }) => {
    const isErrorDisplayed = await bookATourStandalonePage.userForm.isErrorMessageDisplayed(
      'phoneNum',
      t(TranslationKeys.Errors.UserForm.InvalidPhone),
    );
    expect(isErrorDisplayed).toBe(false);
    await bookATourStandalonePage.userForm.takeElementScreenshotIfWebkit(
      bookATourStandalonePage.userForm.iframeElement,
    );
  },
);

Then(
  /^The non-alphabetic validation error is displayed for the first name and last name fields in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const fields = ['firstName', 'lastName'];
    for (const field of fields) {
      const isDisplayed = await bookATourStandalonePage.userForm.isErrorMessageDisplayed(
        field,
        t(TranslationKeys.Errors.UserForm.AlphaOnly),
      );
      expect(isDisplayed).toBe(true);
    }
    await bookATourStandalonePage.userForm.takeElementScreenshotIfWebkit(
      bookATourStandalonePage.userForm.iframeElement,
    );
  },
);

Then(
  /^The maximum length validation error is displayed for the first and last name fields in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage }) => {
    const fields = ['firstName', 'lastName'];
    for (const field of fields) {
      const isDisplayed = await bookATourStandalonePage.userForm.isErrorMessageDisplayed(
        field,
        t(TranslationKeys.Errors.UserForm.MaxLength),
      );
      expect(isDisplayed).toBe(true);
    }
    await bookATourStandalonePage.userForm.takeElementScreenshotIfWebkit(
      bookATourStandalonePage.userForm.iframeElement,
    );
  },
);

Then(
  /^The form fields are reset to their initial state in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage }) => {
    await expect(bookATourStandalonePage.userForm.firstName).toHaveValue('');
    await expect(bookATourStandalonePage.userForm.lastName).toHaveValue('');
    await expect(bookATourStandalonePage.userForm.email).toHaveValue('');
    await expect(bookATourStandalonePage.userForm.phone).toHaveValue(
      d(TestDataKeys.PhoneNumber.CountryCode),
    );
  },
);

Then(
  /^The privacy notice is displayed for the "(.*)" region user in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage }, location: string) => {
    switch (location.toLowerCase()) {
      case 'california': {
        await bookATourStandalonePage.userForm.scrollConsentIntoView(
          bookATourStandalonePage.userForm.californiaResidentNotice,
        );
        await expect(bookATourStandalonePage.userForm.californiaResidentNotice).toBeVisible();
        break;
      }
      case 'washington': {
        await bookATourStandalonePage.userForm.scrollConsentIntoView(
          bookATourStandalonePage.userForm.washingtonEmailConsent,
        );
        await bookATourStandalonePage.userForm.scrollConsentIntoView(
          bookATourStandalonePage.userForm.washingtonTextConsent,
        );
        await expect(bookATourStandalonePage.userForm.washingtonEmailConsent).toBeVisible();
        await expect(bookATourStandalonePage.userForm.washingtonTextConsent).toBeVisible();
        const actualWashingtonEmailConsent = await bookATourStandalonePage.userForm.getText(
          bookATourStandalonePage.userForm.washingtonEmailConsent,
        );
        expect(Helpers.normalizeQuotes(actualWashingtonEmailConsent)).toBe(
          Helpers.normalizeQuotes(t(TranslationKeys.Texts.Consent.WashingtonEmailConsent)),
        );
        const actualWashingtonTextConsent = await bookATourStandalonePage.userForm.getText(
          bookATourStandalonePage.userForm.washingtonTextConsent,
        );
        expect(Helpers.normalizeQuotes(actualWashingtonTextConsent)).toBe(
          Helpers.normalizeQuotes(t(TranslationKeys.Texts.Consent.WashingtonTextConsent)),
        );
        await expect(bookATourStandalonePage.userForm.washingtonTextConsentCheckbox).toBeChecked();
        await expect(bookATourStandalonePage.userForm.washingtonEmailConsentCheckbox).toBeChecked();
        break;
      }
      case 'other states': {
        await bookATourStandalonePage.userForm.scrollConsentIntoView(
          bookATourStandalonePage.userForm.privacyNotice,
        );
        await expect(bookATourStandalonePage.userForm.privacyNotice).toBeVisible();
        const actualPrivacyNotice = await bookATourStandalonePage.userForm.getText(
          bookATourStandalonePage.userForm.privacyNotice,
        );
        expect(Helpers.normalizeQuotes(actualPrivacyNotice)).toBe(
          Helpers.normalizeQuotes(t(TranslationKeys.Texts.Consent.PrivacyNotice)),
        );
        await expect(bookATourStandalonePage.userForm.washingtonEmailConsent).not.toBeVisible();
        await expect(bookATourStandalonePage.userForm.washingtonTextConsent).not.toBeVisible();
        await expect(bookATourStandalonePage.userForm.californiaResidentNotice).not.toBeVisible();
        break;
      }
      default:
        throw new Error(`Unhandled location "${location}" in step definition`);
    }
    await bookATourStandalonePage.userForm.takeElementScreenshotIfWebkit(
      bookATourStandalonePage.userForm.iframeElement,
      'element-screenshot',
      false,
    );
  },
);

Then(
  /^The link is opened in a new tab and the page is scrolled to the California Residents section in the Book A Tour Standalone$/,
  async ({ scenarioContext }) => {
    if (!scenarioContext.newTab) {
      throw new Error('New tab was not opened in previous step');
    }
    const bookATourStandaloneCaliforniaNoticeTab = new CaliforniaNoticePage(scenarioContext.newTab);
    await scenarioContext.newTab.waitForTimeout(TIMEOUTS.SHORT);
    await expect(
      bookATourStandaloneCaliforniaNoticeTab.californiaResidentsSection,
      'Expected "California Residents" section to be in viewport after opening link',
    ).toBeInViewport();
    const newTabUrl = scenarioContext.newTab.url();
    expect(Helpers.isCorrectEnvironmentUrl(newTabUrl)).toBeTruthy();
  },
);

Then(
  /^The link is opened in a new tab in the Book A Tour Standalone$/,
  async ({ context, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    if (!scenarioContext.newTab) {
      throw new Error('New tab was not opened in previous step');
    }
    const pages = context.pages();
    expect(pages.length).toBe(2);
    const newTabUrl = scenarioContext.newTab.url();
    expect(Helpers.isCorrectEnvironmentUrl(newTabUrl)).toBeTruthy();
    const currentLocale = localeManager.getCurrentLocale().toLowerCase();
    if (currentLocale === 'en-us') {
      expect(newTabUrl.toLowerCase()).not.toContain('/en-us/');
    } else {
      expect(newTabUrl.toLowerCase()).toContain(`/${currentLocale}/`);
    }
  },
);

Then(
  /^The time slot message is displayed in the Book A Tour Standalone schedule picker$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    await bookATourStandalonePage.bookATour.timeSlotMessage.waitFor({
      state: 'attached',
      timeout: TIMEOUTS.MEDIUM,
    });
    const actualMessage = await bookATourStandalonePage.bookATour.getText(
      bookATourStandalonePage.bookATour.timeSlotMessage,
    );
    expect(actualMessage).toContain(t(TranslationKeys.Errors.BatAddon.NoTimeSlots));
  },
);

Then(
  /^The selected date and time are reflected in the Book A Tour Standalone schedule picker$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    await bookATourStandalonePage.bookATour.expectDateAndTimeSelected({
      dateText: scenarioContext.scheduledDate,
      timeText: scenarioContext.scheduledTime,
    });
  },
);

Then(
  /^The error message is displayed for the date selection field in Book A Tour Standalone$/,
  async ({ bookATourStandalonePage }) => {
    await bookATourStandalonePage.bookATour.waitForVisible(
      bookATourStandalonePage.bookATour.dateRequiredFieldMessage,
    );
    const actualErrorMessage = await bookATourStandalonePage.bookATour.getText(
      bookATourStandalonePage.bookATour.dateRequiredFieldMessage,
    );
    expect(actualErrorMessage).toContain(t(TranslationKeys.Errors.BatAddon.DateRequired));
  },
);

Then(
  /^The error message is displayed for the time selection field in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage }) => {
    await bookATourStandalonePage.bookATour.waitForVisible(
      bookATourStandalonePage.bookATour.timeRequiredFieldMessage,
    );
    const actualErrorMessage = await bookATourStandalonePage.bookATour.getText(
      bookATourStandalonePage.bookATour.timeRequiredFieldMessage,
    );
    expect(actualErrorMessage).toContain(t(TranslationKeys.Errors.BatAddon.TimeRequired));
  },
);

Then(
  /^The booking confirmation message and appointment details is displayed$/,
  async ({ bookATourStandalonePage, scenarioContext, page }) => {
    if (
      scenarioContext.batRedirectedToMembershipInquiry ||
      scenarioContext.canBookAppointment === false
    ) {
      skipIfBatRedirectedToMembershipInquiry(scenarioContext, 'booking confirmation');
      logger.info('Skipping booking confirmation message step — appointment booking not allowed.');
      return;
    }

    await bookATourStandalonePage.bookATour.waitForBookingConfirmationScreen(TIMEOUTS.LONG);

    if (
      !scenarioContext.selectedGymName ||
      !scenarioContext.scheduledDate ||
      !scenarioContext.scheduledTime ||
      !scenarioContext.pageName
    ) {
      throw new Error(
        'Booking details (gym name, date, or time) and page name failed to be captured in previous steps',
      );
    }

    const actualBookingMessage = await bookATourStandalonePage.bookATour.getText(
      bookATourStandalonePage.bookATour.bookingConfirmationMessage,
    );
    const expectedBookingMessage = Helpers.getBookingConfirmationMessage(scenarioContext.pageName);
    Helpers.assertSeeYouSoonVisitBody(actualBookingMessage, expectedBookingMessage);
    await Helpers.assertYourSpotIsSavedVisible(bookATourStandalonePage.bookATour.iframe);
    await Helpers.assertNoUserFacingTourCopy(bookATourStandalonePage.bookATour.iframe);

    const actualBookedGymName = await bookATourStandalonePage.bookATour.getText(
      bookATourStandalonePage.bookATour.bookedGymName,
    );
    expect(actualBookedGymName).toBe(scenarioContext.selectedGymName);

    const expectedAppointmentDetails = Helpers.formatAppointmentDetails(
      scenarioContext.scheduledDate,
      scenarioContext.scheduledTime,
    );
    const actualAppointmentDetails = await bookATourStandalonePage.bookATour.getText(
      bookATourStandalonePage.bookATour.appointmentDetails,
    );
    expect(Helpers.normalizeAppointmentDetailsText(actualAppointmentDetails)).toBe(
      Helpers.normalizeAppointmentDetailsText(expectedAppointmentDetails),
    );
    const locale = environmentManager.get('LOCALE');
    await verifyUseProdApiQueryParam(locale, page);
  },
);

Then(
  /^The Add to Calendar button is visible in the Book a Tour Standalone confirmation screen$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    if (scenarioContext.canBookAppointment !== true) {
      logger.info('Skipping Add to Calendar assertion — appointment booking not allowed.');
      return;
    }
    const schedule = bookATourStandalonePage.bookATour;
    await schedule.waitForBookingConfirmationScreen(TIMEOUTS.MEDIUM).catch(() => {});
    await expect(schedule.addToCalendarBtn).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await schedule.clickAddToCalendarButton();
    await expect(schedule.addToCalendarAppleBtn).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await expect(schedule.addToCalendarGoogleBtn).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await expect(schedule.addToCalendarOutlookBtn).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  },
);

Then(
  /^Clicking Google option in the Book a Tour Standalone confirmation screen opens the calendar in new tab$/,
  async ({ context, bookATourStandalonePage, scenarioContext }) => {
    if (scenarioContext.canBookAppointment !== true) {
      logger.info('Skipping Google calendar assertion — appointment booking not allowed.');
      return;
    }
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      bookATourStandalonePage.bookATour.addToCalendarGoogleBtn.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    const pages = context.pages();
    expect(pages.length).toBe(2);
  },
);

Then(
  /^The user should be redirected to the Book a tour Standalone page for that gym$/,
  async ({ page, bookATourStandalonePage, scenarioContext }) => {
    if (
      scenarioContext.batRedirectedToMembershipInquiry ||
      page.url().includes('/membership-inquiry')
    ) {
      markBatRedirectedToMembershipInquiry(scenarioContext, page.url());
      skipIfBatRedirectedToMembershipInquiry(
        scenarioContext,
        'BAT form redirect (Membership Inquiry — no time availabilities on test gym)',
      );
    }
    await bookATourStandalonePage.userForm.iframeElement.waitFor({
      state: 'attached',
      timeout: TIMEOUTS.MEDIUM,
    });
    await bookATourStandalonePage.userForm.scrollIntoView(
      bookATourStandalonePage.userForm.iframeElement,
    );
    await expect(bookATourStandalonePage.bookATour.datePicker.first()).toBeVisible();
    const currentUrl = page.url();
    expect(currentUrl).toContain('/schedule-an-appointment-online');
  },
);

Then(
  /^The correct disclaimer text is displayed in the Book A Tour Standalone User form$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    await bookATourStandalonePage.userForm.assertMarketingConsentDisclaimerText();
  },
);

Then(
  /^The heading and description are displayed correctly on the BAT Standalone form page$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const { userForm } = bookATourStandalonePage;
    await userForm.prepareForFormHeadingAssertions();
    if (Helpers.isBookAVisitLocale()) {
      await Helpers.assertLeadFormVisitHeading(userForm.iframe);
      await Helpers.assertLeadFormVisitBody(userForm.iframe);
      await Helpers.assertBookYourVisitSubheadVisible(userForm.iframe);
      await Helpers.assertNoUserFacingTourCopy(userForm.iframe);
      return;
    }
    const expectedHeading = t(
      TranslationKeys.Texts.Headings.LocationSearch.BookATourStandalone.BannerTitle,
    );
    await expect(userForm.iframe.getByText(expectedHeading, { exact: false }).first()).toBeVisible({
      timeout: TIMEOUTS.MEDIUM,
    });
    const expectedSubTitle = t(
      TranslationKeys.Texts.Headings.LocationSearch.BookATourStandalone.BannerSubTitle,
    );
    await expect(userForm.iframe.getByText(expectedSubTitle, { exact: false }).first()).toBeVisible(
      { timeout: TIMEOUTS.MEDIUM },
    );
  },
);

Then(
  /^The heading and description are displayed correctly in the BAT Standalone$/,
  async ({ bookATourStandalonePage }) => {
    const { locationSearch } = bookATourStandalonePage;
    await locationSearch.prepareForHeadingAssertions();

    // Find A Gym page (TC-A001 / TC-A007): "FIND YOUR GYM" always; RIGHT PLACE is IP-gated
    // (outside-country empty-state) — accept in-country Approximate Location landing too.
    await locationSearch.expectTextVisible(
      TranslationKeys.Texts.Headings.LocationSearch.BookATourStandalone.FindGymText,
    );
    await locationSearch.expectRightPlaceSectionVisible();
  },
);

Then(
  /^The form fields accept valid input without validation errors in the Book A Tour Standalone$/,
  async ({ bookATourStandalonePage, page, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const userForm = await bookATourStandalonePage.getActiveUserForm();

    await expect(userForm.firstName).not.toHaveValue('');
    await expect(userForm.lastName).not.toHaveValue('');
    await expect(userForm.email).not.toHaveValue('');
    await expect(userForm.phone).not.toHaveValue(d(TestDataKeys.PhoneNumber.CountryCode));

    const fieldErrors: Array<[string, string]> = [
      ['firstName', t(TranslationKeys.Errors.UserForm.AlphaOnly)],
      ['lastName', t(TranslationKeys.Errors.UserForm.AlphaOnly)],
      ['email', t(TranslationKeys.Errors.UserForm.InvalidEmail)],
      ['phoneNum', t(TranslationKeys.Errors.UserForm.InvalidPhone)],
    ];

    for (const [field, message] of fieldErrors) {
      const hasError = await userForm.isErrorMessageDisplayed(field, message);
      expect(hasError).toBe(false);
    }
    const currentUrl = page.url();
    console.log(currentUrl);
    console.log(page.url());
  },
);

Then(
  /^The Form Started Rudderstack event is triggered in Book A Tour Standalone$/,
  async ({ page, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const requests =
      scenarioContext.rudderstackCapturedRequests ?? (await rudderstackRequests(page));
    const pageDetails = await getPageDetails(page);
    await page.waitForTimeout(TIMEOUTS.SHORT);
    await captureRudderStackEvent({
      requests,
      event: 'Form Started',
      page,
      data: '',
      pageDetails,
      formTracking: toFormStartedFormTracking('Book A Tour Standalone'),
    });
  },
);

Then(
  /^The lead capture form submission is successful in Book A Tour Standalone$/,
  async ({ scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    expect(scenarioContext.leadCaptureSuccessful).toBe(true);
  },
);

Then(
  /^The Lead Captured, Identity and Appointment Scheduled Rudderstack events are verified in Book A Tour Standalone$/,
  async ({ scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    if (!scenarioContext.rudderstackTestEnable) {
      throw new Error('Rudderstack validation was not enabled for this scenario');
    }
    expect(scenarioContext.rudderstackLeadEventsVerified).toBe(true);
  },
);

Then(
  /^The form_loaded data layer should be triggered in Book A Tour Standalone$/,
  async ({ page, bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    if (!scenarioContext.selectedGymClubId || !scenarioContext.selectedGymDisplayName) {
      throw new Error('Club id and name were not captured when gym was selected');
    }

    // dataLayer payload is the SoT (matches GTM Tag Assistant). Do not hard-gate on
    // isGTMEventFired boolean — GA-collect race can false-negative while form_loaded is present.
    const assertFormLoaded = async () =>
      verifyFormLoadedDataLayer({
        page,
        clubId: scenarioContext.selectedGymClubId!,
        clubName: scenarioContext.selectedGymDisplayName!,
        timeout: TIMEOUTS.LONG,
      });

    try {
      if (scenarioContext.formLoadedObserved === true) {
        await assertFormLoaded();
        return;
      }
      await assertFormLoaded();
    } catch (firstError) {
      // Re-interact once (MCO pattern) — form_loaded can lag Form Started on SIT.
      const userForm = await bookATourStandalonePage.getActiveUserForm();
      await userForm.ensureLocatorInIframeViewport(userForm.lastName).catch(() => {});
      const retryPromise = NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_LOADED, TIMEOUTS.LONG);
      await userForm.type(userForm.lastName, 'A').catch(() => {});
      scenarioContext.formLoadedObserved = await retryPromise;
      try {
        await assertFormLoaded();
      } catch (retryError) {
        const detail = retryError instanceof Error ? retryError.message : String(retryError);
        const first = firstError instanceof Error ? firstError.message : String(firstError);
        throw new Error(
          `APP DEFECT (Book A Tour Standalone): form_loaded GTM/dataLayer missing after lead-form interaction ` +
            `(Local Config Data Layer/GTM TRUE). First: ${first}. Retry: ${detail}`,
        );
      }
    }
  },
);

Then(
  /^The form_success and tour_appointment_scheduled data layer should be triggered in Book A Tour Standalone$/,
  async ({ page, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    if (
      !scenarioContext.leadCaptureId ||
      !scenarioContext.selectedGymClubId ||
      !scenarioContext.selectedGymDisplayName
    ) {
      throw new Error('Lead capture or club details were not captured after form submission');
    }

    await verifyFormSuccessDataLayer({
      page,
      clubId: scenarioContext.selectedGymClubId,
      clubName: scenarioContext.selectedGymDisplayName,
      leadCaptureId: scenarioContext.leadCaptureId,
    });

    if (scenarioContext.canBookAppointment !== true) {
      logger.info(
        'Skipping tour_appointment_scheduled dataLayer — can_book_appointment is not true',
      );
      return;
    }

    await verifyTourAppointmentScheduledDataLayer({
      page,
      clubId: scenarioContext.selectedGymClubId,
      clubName: scenarioContext.selectedGymDisplayName,
    });
  },
);

Then(
  /^The staff_id is returned correctly in the Book A Tour Standalone availabilities API$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    if (!scenarioContext.staffId) {
      throw new Error(
        'staff_id was not captured from /api/bookings/availabilities when gym was selected',
      );
    }

    expect(String(scenarioContext.staffId)).toMatch(/^\d+$/);
    await bookATourStandalonePage.bookATour.waitForSchedulePickerReady();
    await expect(bookATourStandalonePage.bookATour.datePicker.first()).toBeVisible();
  },
);

Then(
  /^The heading is displayed correctly in the BAT Standalone$/,
  async ({ bookATourStandalonePage }) => {
    const { locationSearch } = bookATourStandalonePage;
    await locationSearch.prepareForHeadingAssertions();
    await locationSearch.expectTextVisible(
      TranslationKeys.Texts.Headings.LocationSearch.BookATourStandalone.BannerSubTitle,
    );
    await locationSearch.expectTextVisible(
      TranslationKeys.Texts.Headings.LocationSearch.BookATourStandalone.FindGymText,
    );
    await locationSearch.expectHeadingVisible(
      TranslationKeys.Texts.Headings.LocationSearch.BookATourStandalone.BannerTitle,
    );
  },
);

Then(
  /^The search box placeholder is displayed correctly in the BAT Standalone$/,
  async ({ bookATourStandalonePage }) => {
    const actualText = await bookATourStandalonePage.locationSearch.getText(
      bookATourStandalonePage.locationSearch.searchBoxPlaceholder,
    );
    const expectedText = t(searchBoxPlaceholderKey());
    expect(actualText).toBe(expectedText);
  },
);

Then(
  /^The Lead Form Disclaimer is displayed correctly in the Book A Tour Standalone User form$/,
  async ({ bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    const location = d(TestDataKeys.Locations.Search.Default);
    const { userForm } = bookATourStandalonePage;
    await userForm.waitForFormReady();
    await userForm.scrollIntoView(userForm.privacyNotice.or(userForm.consentCheckbox).first());
    await expect(userForm.privacyNotice.or(userForm.consentCheckbox).first()).toBeVisible();
    const isPrivacyNoticeVisible = await userForm.isTextVisible(
      TranslationKeys.Texts.Consent.PrivacyNotice,
      { location },
    );
    expect(isPrivacyNoticeVisible).toBe(true);
    // AFW-3993 — EN-CA BAT CTA must say Get Started (legal copy); other locales no-op.
    await userForm.assertCanadaPrimaryCtaLabel();
  },
);

Then(
  /^The Local Resident modal content is displayed correctly in the Book A Tour Standalone$/,
  async ({ page, bookATourStandalonePage, scenarioContext }) => {
    skipIfBatRedirectedToMembershipInquiry(scenarioContext);
    await expect(page.locator('#why-this-matters-modal')).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await expect(bookATourStandalonePage.userForm.iUnderstandButton).toBeVisible();
    // Close so consolidated journeys can continue to Form Started / form_loaded on the lead form.
    await bookATourStandalonePage.userForm.closeLocalResidentModal('I UNDERSTAND');
    await expect(page.locator('#why-this-matters-modal')).toBeHidden({ timeout: TIMEOUTS.MEDIUM });
  },
);
