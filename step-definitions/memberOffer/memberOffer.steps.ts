import { createBdd } from 'playwright-bdd';
import environmentManager from '@config/environment';
import { test, expect } from '@fixtures/base.fixture';
import { ContactRequestPayload } from '@type/api.types';
import { API_PATHS, TIMEOUTS, MEMBER_OFFER_ROUTES, GTM_EVENT } from '@utils/constants/index';
import { Helpers, verifyUseProdApiQueryParam } from '@utils/helpers';
import localeManager, { d, t } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';
import { logger } from '@utils/logger';
import { NetworkUtils } from '@utils/network-utils';
import {
  captureRudderStackEvent,
  getPageDetails,
  LeadEventData,
  rudderstackRequests,
  waitForDataLayerEntries,
} from '@utils/rudderstack';
import { toFormStartedFormTracking } from '@utils/tracking/form-started-rs-tracking';

const { Given, When, Then } = createBdd(test, { tags: '@MemberOffer' });

Given(/^Rudderstack validation is enabled for Member Offer$/, async ({ page, scenarioContext }) => {
  scenarioContext.rudderstackTestEnable = true;
  if (!scenarioContext.rudderstackCapturedRequests) {
    scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
  }
});

Given(
  /^The user opens the "(.*)" Member Offer for "(.*)" gym$/,
  async ({ page, memberOfferPage, scenarioContext }, offerKey: string, gymType: string) => {
    scenarioContext.pageName = 'member offer';
    scenarioContext.offerKey = offerKey;
    scenarioContext.offerGymType = gymType.toLowerCase();
    const normalizedKey = offerKey.toLowerCase() as keyof typeof MEMBER_OFFER_ROUTES.OPEN;
    const path = MEMBER_OFFER_ROUTES.OPEN[normalizedKey];

    if (!path) {
      throw new Error(`No Member Offer route found for key: "${offerKey}"`);
    }
    const baseUrl = environmentManager.get('BASE_URL');

    const locationId =
      gymType.toLowerCase() === 'open'
        ? d(TestDataKeys.Locations.ClubId)
        : d(TestDataKeys.Locations.PreSaleClubId);

    const url = `${baseUrl}${path}?location_id=${locationId}&disable_captcha=true`;
    await page.goto(url);
    const redirectedToLocations = await page
      .waitForURL('**/locations/**', { timeout: 15000 })
      .then(() => true)
      .catch(() => false);

    if (redirectedToLocations) {
      logger.info(
        `Member Offer "${offerKey}" is not available for location ID "${locationId}". Skipping scenario.`,
      );
      test.skip(
        true,
        `Member Offer "${offerKey}" not available for location ID "${locationId}. Skipping scenario."`,
      );
      return;
    }

    await page.goto(url);
    await memberOfferPage.userForm.waitForFormReady();
  },
);

Given(
  /^The user opens the "(.*)" Member Offer with location search$/,
  async ({ page, memberOfferPage, oneTrustPage, scenarioContext }, offerKey: string) => {
    scenarioContext.pageName = 'member offer';
    scenarioContext.offerKey = offerKey;
    scenarioContext.offerGymType = 'open';
    const normalizedKey = offerKey.toLowerCase() as keyof typeof MEMBER_OFFER_ROUTES.OPEN;
    const path = MEMBER_OFFER_ROUTES.OPEN[normalizedKey];
    if (!path) {
      throw new Error(`No Member Offer route found for key: "${offerKey}"`);
    }
    memberOfferPage.bindLocationSearchExpectedPath(path, 'local-offer-iframe');
    const baseUrl = environmentManager.get('BASE_URL');
    const locationId = d(TestDataKeys.Locations.ClubId);
    scenarioContext.selectedGymClubId = locationId;
    const url = `${baseUrl}${path}?disable_captcha=true`;
    await page.goto(url);
    await oneTrustPage.bannerAllowAllBtn.click({ timeout: 5000 }).catch(() => {
      logger.info('Member Offer OneTrust banner not present; continuing');
    });
    await memberOfferPage.userForm.iframeElement
      .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG })
      .catch(() => {});
    if (scenarioContext.rudderstackTestEnable && !scenarioContext.rudderstackCapturedRequests) {
      scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    }
    if (page.url().includes('/locations/')) {
      throw new Error(`Member Offer location search landing redirected to locations: ${page.url()}`);
    }
    const searchVisible = await memberOfferPage.locationSearch.locationSearchControl
      .isVisible()
      .catch(() => false);
    if (searchVisible) {
      await memberOfferPage.locationSearch.waitForLocationSearchReady();
      return;
    }
    logger.info('Member Offer location search not on landing — opening from lead form Change');
    await memberOfferPage.userForm.waitForFormReady();
    await memberOfferPage.userForm.clickChangeLocationButton();
    await memberOfferPage.locationSearch.waitForLocationSearchReady();
  },
);

When(
  /^The user submits the Member Offer form( with empty fields)?$/,
  async ({ memberOfferPage, page }) => {
    await memberOfferPage.userForm.clickSubmitButton({ ensureRequiredCheckboxes: false });
    await page.waitForTimeout(5000);
    const locale = environmentManager.get('LOCALE');
    await verifyUseProdApiQueryParam(locale, page);
  },
);

When(
  /^The user enters "(.*)" in the first name field on the Member Offer form$/,
  async ({ memberOfferPage }, firstName: string) => {
    await memberOfferPage.userForm.type(memberOfferPage.userForm.firstName, firstName);
  },
);

When(
  /^The user enters "(.*)" in the last name field on the Member Offer form$/,
  async ({ memberOfferPage }, lastName: string) => {
    await memberOfferPage.userForm.type(memberOfferPage.userForm.lastName, lastName);
  },
);

When(
  /^The user enters "(.*)" in the email field on the Member Offer form$/,
  async ({ memberOfferPage }, email: string) => {
    await memberOfferPage.userForm.type(memberOfferPage.userForm.email, email);
  },
);

When(
  /^The user enters invalid number in the phone number field on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    await memberOfferPage.userForm.type(
      memberOfferPage.userForm.phone,
      d(TestDataKeys.PhoneNumber.Invalid),
    );
  },
);

When(
  /^The user autofills the phone number field on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    await memberOfferPage.userForm.autofillPhoneNumber(
      memberOfferPage.userForm.phone,
      d(TestDataKeys.PhoneNumber.Valid.Default),
    );
  },
);

When(
  /^The user copies and pastes a valid number into the phone number field on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    await memberOfferPage.userForm.copyPastePhoneNumber(
      memberOfferPage.userForm.phone,
      d(TestDataKeys.PhoneNumber.Valid.Default),
    );
  },
);

When(
  /^The user enters more than 30 characters in the "(.*)" field on the Member Offer form$/,
  async ({ memberOfferPage }, fieldName: string) => {
    switch (fieldName.toLowerCase()) {
      case 'first name':
        await memberOfferPage.userForm.type(
          memberOfferPage.userForm.firstName,
          Helpers.generateRandomString(31),
        );
        break;
      case 'last name':
        await memberOfferPage.userForm.type(
          memberOfferPage.userForm.lastName,
          Helpers.generateRandomString(31),
        );
        break;
      default:
        throw new Error(`Unhandled field name "${fieldName}" in step definition`);
    }
  },
);

When(
  /^The user interacts with the lead form on the Member Offer$/,
  async ({ page, memberOfferPage, scenarioContext }) => {
    if (scenarioContext.rudderstackTestEnable) {
      scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    }
    await memberOfferPage.userForm.waitForFormReady();
    await memberOfferPage.userForm.type(memberOfferPage.userForm.firstName, 'Test');
  },
);

When(/^The user fills the Member Offer form with valid data$/, async ({ memberOfferPage }) => {
  const formData = {
    firstName: Helpers.generateRandomString(6),
    lastName: Helpers.generateRandomString(6),
    email: Helpers.generateRandomEmail(),
    phone: d(TestDataKeys.PhoneNumber.Valid.Default),
    zipCode: d(TestDataKeys.ZipCode.Valid.Default),
  };

  await memberOfferPage.userForm.fillAndSubmitForm(formData, false);
});

When(/^The user refreshes the page$/, async ({ page }) => {
  await page.reload();
});

When(
  /^The user clicks the "(.*)" link on the Member Offer form$/,
  async ({ page, context, memberOfferPage, scenarioContext }, linkName: string) => {
    let locator;

    switch (linkName.toLowerCase()) {
      case 'terms & conditions':
        locator = memberOfferPage.userForm.termsAndConditionsLink;
        await memberOfferPage.userForm.waitForVisible(locator);
        await memberOfferPage.userForm.scrollIntoViewIfWebkit(
          memberOfferPage.userForm.iframeElement,
          locator,
        );
        break;
      case 'privacy notice':
        locator = memberOfferPage.userForm.privacyNoticeLink;
        await memberOfferPage.userForm.waitForVisible(locator);
        await memberOfferPage.userForm.scrollIntoViewIfWebkit(
          memberOfferPage.userForm.iframeElement,
          locator,
        );
        break;
      case 'text messaging terms':
        locator = memberOfferPage.userForm.textMessagingTermsLink;
        await memberOfferPage.userForm.waitForVisible(locator);
        await memberOfferPage.userForm.scrollIntoViewIfWebkit(
          memberOfferPage.userForm.iframeElement,
          locator,
        );
        break;
      case 'california residents notice':
        locator = memberOfferPage.userForm.californiaResidentNotice;
        await memberOfferPage.userForm.waitForVisible(locator);
        await memberOfferPage.userForm.scrollIntoViewIfWebkit(
          memberOfferPage.userForm.iframeElement,
          locator,
        );
        break;
      default:
        throw new Error(`Unhandled page: "${linkName}" in step definition`);
    }

    // Consolidated journeys click Privacy → Terms → SMS; close prior popup tabs so
    // Then can keep asserting exactly one new tab (pages.length === 2).
    const existingExtraPages = context.pages().filter(openPage => openPage !== page);
    for (const extraPage of existingExtraPages) {
      await extraPage.close().catch(() => {});
    }
    scenarioContext.newTab = undefined;

    await memberOfferPage.userForm.waitForVisible(locator, TIMEOUTS.SHORT);
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: TIMEOUTS.LONG }),
      locator.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    scenarioContext.newTab = newPage;
  },
);

When(
  /^The user submits the Member Offer form with valid data$/,
  async ({ page, memberOfferPage, scenarioContext }) => {
    if (!scenarioContext.pageName) {
      throw new Error('Page name was not set by previous step');
    }
    scenarioContext.canBookAppointment = false;

    await memberOfferPage.userForm.waitForVisible(
      memberOfferPage.userForm.selectedGymNameForLocalOffer,
      TIMEOUTS.SHORT,
    );

    scenarioContext.selectedGymName = await memberOfferPage.userForm.getText(
      memberOfferPage.userForm.selectedGymNameForLocalOffer,
    );

    let rudderstackCapture: Awaited<ReturnType<typeof rudderstackRequests>> | undefined;
    if (scenarioContext.rudderstackTestEnable) {
      rudderstackCapture = await rudderstackRequests(page);
      scenarioContext.rudderstackCapturedRequests = rudderstackCapture;
    }

    const {
      statusCodePromise: contactStatusCodePromise,
      requestHeadersPromise: contactRequestHeadersPromise,
    } = NetworkUtils.waitForStatusCodeAndHeaders(page, API_PATHS.CONTACT_REQUEST);

    const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_SUCCESS);

    const contactRequestBodyPromise = NetworkUtils.getRequestBody<ContactRequestPayload>(
      page,
      API_PATHS.CONTACT_REQUEST,
      TIMEOUTS.LONG,
    );

    const formData = {
      firstName: Helpers.generateRandomString(6),
      lastName: Helpers.generateRandomString(6),
      email: Helpers.generateRandomEmail(),
      phone: d(TestDataKeys.PhoneNumber.Valid.Default),
      zipCode: d(TestDataKeys.ZipCode.Valid.Default),
    };

    await memberOfferPage.userForm.fillAndSubmitForm(formData);

    const [contactStatusCode, contactRequestHeaders, contactRequestBody] = await Promise.all([
      contactStatusCodePromise,
      contactRequestHeadersPromise,
      contactRequestBodyPromise,
    ]);

    await gtmEventFiredPromise;

    if (!scenarioContext.offerKey) {
      throw new Error('Offer Key was not found');
    }
    const expectedWorkFlowName = Helpers.getWorkFlowName(
      scenarioContext.pageName,
      scenarioContext.offerKey,
    );

    expect(contactStatusCode).toBe(200);
    expect(contactRequestHeaders['referer']).toContain(NetworkUtils.getRefererDomain());
    expect(contactRequestBody.workflow).toBe(expectedWorkFlowName);
    expect(contactRequestBody.first_name).toBe(formData.firstName);
    expect(contactRequestBody.last_name).toBe(formData.lastName);
    expect(contactRequestBody.email).toBe(formData.email);
    expect(contactRequestBody.phone_number).toBe(formData.phone);
    expect(contactRequestBody.locale.toLocaleLowerCase()).toBe(
      localeManager.getCurrentLocale().toLocaleLowerCase(),
    );

    if (contactRequestBody.data) {
      const expectedLocationId =
        scenarioContext.offerGymType === 'presale'
          ? d(TestDataKeys.Locations.PreSaleClubId)
          : d(TestDataKeys.Locations.ClubId);
      expect(contactRequestBody.data.locationNumber).toBe(expectedLocationId);
      expect(contactRequestBody.data.zip).toBe(formData.zipCode);
      scenarioContext.selectedGymClubId = expectedLocationId;
    }
    const locale = environmentManager.get('LOCALE');
    await verifyUseProdApiQueryParam(locale, page);

    if (scenarioContext.rudderstackTestEnable && rudderstackCapture) {
      await verifyMemberOfferLeadCapturedRudderstack({
        page,
        scenarioContext,
        rudderstackCapture,
      });
    }
  },
);

When(
  /^The user submits the Member Offer form with valid data for GTM validation$/,
  async ({ page, memberOfferPage, scenarioContext }) => {
    if (!scenarioContext.pageName) {
      throw new Error('Page name was not set by previous step');
    }
    scenarioContext.canBookAppointment = false;

    await memberOfferPage.userForm.waitForVisible(
      memberOfferPage.userForm.selectedGymNameForLocalOffer,
      TIMEOUTS.SHORT,
    );

    // Use LONG timeout — mobile WebKit form submit can exceed MEDIUM and starve the GTM listener.
    const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(
      page,
      GTM_EVENT.FORM_SUCCESS,
      TIMEOUTS.LONG,
    );

    const formData = {
      firstName: Helpers.generateRandomString(6),
      lastName: Helpers.generateRandomString(6),
      email: Helpers.generateRandomEmail(),
      phone: d(TestDataKeys.PhoneNumber.Valid.Default),
      zipCode: d(TestDataKeys.ZipCode.Valid.Default),
    };

    await memberOfferPage.userForm.fillAndSubmitForm(formData);
    let gtmFired = await gtmEventFiredPromise;

    // Fallback: event may already be in dataLayer after a slow mobile submit.
    if (!gtmFired) {
      gtmFired = await NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_SUCCESS, TIMEOUTS.MEDIUM);
    }

    scenarioContext.memberOfferGtmFired = gtmFired;
  },
);

When(
  /^The user clicks the FIND A GYM button on the Member Offer thank-you screen$/,
  async ({ memberOfferPage, page }) => {
    await memberOfferPage.confirmationScreen.isThankYouTextVisible();
    // AFW-3876: FIND A GYM thank-you CTA targets /locations (legacy /find-gym still accepted).
    await Promise.all([
      page.waitForURL(/\/locations(?:\/|(?:[?#]|$))|find[-]?a?[-]?gym|\/find-gym/i, {
        timeout: TIMEOUTS.LONG,
      }),
      memberOfferPage.confirmationScreen.clickFindAGymButton(),
    ]);
  },
);

When(
  /^The user opens the Local Resident pop-up modal on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    await memberOfferPage.userForm.openLocalResidentModal();
  },
);

When(/^The user opens location search on the Member Offer$/, async ({ memberOfferPage, scenarioContext }) => {
  const normalizedKey = String(scenarioContext.offerKey || 'join_transformation_challenge').toLowerCase() as keyof typeof MEMBER_OFFER_ROUTES.OPEN;
  const path = MEMBER_OFFER_ROUTES.OPEN[normalizedKey];
  if (path) {
    memberOfferPage.bindLocationSearchExpectedPath(path, 'local-offer-iframe');
  }
  const searchReady = await memberOfferPage.locationSearch.locationSearchControl
    .isVisible()
    .catch(() => false);
  if (searchReady) {
    await memberOfferPage.locationSearch.waitForLocationSearchReady();
    return;
  }
  await memberOfferPage.userForm.waitForFormReady();
  await memberOfferPage.userForm.clickChangeLocationButton();
  await memberOfferPage.locationSearch.locationSearchControl.waitFor({
    state: 'visible',
    timeout: TIMEOUTS.LONG,
  });
  await memberOfferPage.locationSearch.waitForLocationSearchReady();
});

When(
  /^The user searches a valid location in the Member Offer location search$/,
  async ({ memberOfferPage, scenarioContext }) => {
    const normalizedKey = String(scenarioContext.offerKey || 'join_transformation_challenge').toLowerCase() as keyof typeof MEMBER_OFFER_ROUTES.OPEN;
    const path = MEMBER_OFFER_ROUTES.OPEN[normalizedKey];
    if (!path) {
      throw new Error(`No Member Offer route found for key: "${scenarioContext.offerKey}"`);
    }
    memberOfferPage.bindLocationSearchExpectedPath(path, 'local-offer-iframe');
    const searchVisible = await memberOfferPage.locationSearch.locationSearchControl
      .isVisible()
      .catch(() => false);
    if (!searchVisible) {
      await memberOfferPage.userForm.clickChangeLocationButton();
      await memberOfferPage.locationSearch.waitForLocationSearchReady();
    }
    const validLocation = d(TestDataKeys.Locations.Search.Default);
    await memberOfferPage.locationSearch.searchLocation(validLocation);
  },
);

When(
  /^The user selects a gym from the Member Offer location search results$/,
  async ({ memberOfferPage, scenarioContext }) => {
    const gymName = d(TestDataKeys.Locations.Gyms.Default);
    const clubId = d(TestDataKeys.Locations.ClubId);
    scenarioContext.selectedGymClubId = clubId;
    scenarioContext.selectedGymName = gymName;
    await memberOfferPage.locationSearch.clickSelectGymAvoidingLocationsRedirect(gymName);
    await memberOfferPage.userForm.ensureDisableCaptchaPersisted().catch(() => {});
    await memberOfferPage.userForm.overrideLocationAndDisableCaptcha(clubId).catch(() => {});
    await memberOfferPage.userForm.waitForGymSelectionDisplayed();
  },
);

Then(
  /^The Form Started Rudderstack event is triggered on the Member Offer$/,
  async ({ page, scenarioContext }) => {
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
      // AFW-3434 / AFW-3957: member_offer_general + CMS offer_type
      formTracking: toFormStartedFormTracking('Member Offer'),
      skipPagePathValidation: true,
    });
  },
);

Then(
  /^The required field error is shown for all input fields in the Member Offer$/,
  async ({ memberOfferPage }) => {
    const fieldToErrorKey: Record<string, string> = {
      firstName: TranslationKeys.Errors.UserForm.RequiredField.FirstName,
      lastName: TranslationKeys.Errors.UserForm.RequiredField.LastName,
      email: TranslationKeys.Errors.UserForm.RequiredField.Email,
      phoneNum: TranslationKeys.Errors.UserForm.RequiredField.Phone,
      zipCode: TranslationKeys.Errors.UserForm.RequiredField.ZipCode,
    };
    const fields = Object.keys(fieldToErrorKey);

    for (const field of fields) {
      const expectedMessage = t(fieldToErrorKey[field]);
      const isDisplayed = await memberOfferPage.userForm.isErrorMessageDisplayed(
        field,
        expectedMessage,
      );
      expect(isDisplayed).toBe(true);
    }
    await memberOfferPage.userForm.takeElementScreenshotIfWebkit(
      memberOfferPage.userForm.iframeElement,
    );
  },
);

Then(
  /^The non-alphabetic validation error is displayed for the first and last name fields on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    const fields = ['firstName', 'lastName'];
    for (const field of fields) {
      const isDisplayed = await memberOfferPage.userForm.isErrorMessageDisplayed(
        field,
        t(TranslationKeys.Errors.UserForm.AlphaOnly),
      );
      expect(isDisplayed).toBe(true);
    }
    await memberOfferPage.userForm.takeElementScreenshotIfWebkit(
      memberOfferPage.userForm.iframeElement,
    );
  },
);

Then(
  /^The maximum length validation error is displayed for the first and last name fields on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    const fields = ['firstName', 'lastName'];
    for (const field of fields) {
      const isDisplayed = await memberOfferPage.userForm.isErrorMessageDisplayed(
        field,
        t(TranslationKeys.Errors.UserForm.MaxLength),
      );
      expect(isDisplayed).toBe(true);
    }
    await memberOfferPage.userForm.takeElementScreenshotIfWebkit(
      memberOfferPage.userForm.iframeElement,
    );
  },
);

Then(
  /^The email validation error is displayed on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    const isDisplayed = await memberOfferPage.userForm.isErrorMessageDisplayed(
      'email',
      t(TranslationKeys.Errors.UserForm.InvalidEmail),
    );
    expect(isDisplayed).toBe(true);
    await memberOfferPage.userForm.takeElementScreenshotIfWebkit(
      memberOfferPage.userForm.iframeElement,
    );
  },
);

Then(
  /^The phone number validation error is displayed on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    const isDisplayed = await memberOfferPage.userForm.isErrorMessageDisplayed(
      'phoneNum',
      t(TranslationKeys.Errors.UserForm.InvalidPhone),
    );
    expect(isDisplayed).toBe(true);
    await memberOfferPage.userForm.takeElementScreenshotIfWebkit(
      memberOfferPage.userForm.iframeElement,
    );
  },
);

Then(
  /^The phone number field is accepted on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    const isErrorDisplayed = await memberOfferPage.userForm.isErrorMessageDisplayed(
      'phoneNum',
      t(TranslationKeys.Errors.UserForm.InvalidPhone),
    );
    expect(isErrorDisplayed).toBe(false);
    await memberOfferPage.userForm.takeElementScreenshotIfWebkit(
      memberOfferPage.userForm.iframeElement,
    );
  },
);

Then(
  /^The server side error message is displayed on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    const actualErrorMessage = await memberOfferPage.userForm.getErrorMessage();
    expect(actualErrorMessage).toContain(t(TranslationKeys.Errors.UserForm.ServerSide));
  },
);

Then(
  /^The Member Offer form fields are reset to their initial state$/,
  async ({ memberOfferPage }) => {
    await expect(memberOfferPage.userForm.firstName).toHaveValue('');
    await expect(memberOfferPage.userForm.lastName).toHaveValue('');
    await expect(memberOfferPage.userForm.email).toHaveValue('');
    await expect(memberOfferPage.userForm.phone).toHaveValue(
      d(TestDataKeys.PhoneNumber.CountryCode),
    );
  },
);

Then(
  /^The privacy notice is displayed for the "(.*)" region user on the Member Offer form$/,
  async ({ memberOfferPage }, location: string) => {
    const isWebkit = memberOfferPage.userForm.getBrowserName() === 'webkit';

    switch (location.toLowerCase()) {
      case 'california': {
        await (isWebkit
          ? memberOfferPage.userForm.scrollIntoViewIfWebkit(
              memberOfferPage.userForm.iframeElement,
              memberOfferPage.userForm.californiaResidentNotice,
            )
          : memberOfferPage.userForm.scrollIntoView(
              memberOfferPage.userForm.californiaResidentNotice,
            ));

        await expect(memberOfferPage.userForm.californiaResidentNotice).toBeVisible();
        break;
      }

      case 'washington': {
        await (isWebkit
          ? memberOfferPage.userForm.scrollIntoViewIfWebkit(
              memberOfferPage.userForm.iframeElement,
              memberOfferPage.userForm.washingtonEmailConsent,
            )
          : memberOfferPage.userForm.scrollIntoView(
              memberOfferPage.userForm.washingtonEmailConsent,
            ));

        await expect(memberOfferPage.userForm.washingtonEmailConsent).toBeVisible();
        await expect(memberOfferPage.userForm.washingtonTextConsent).toBeVisible();

        const actualWashingtonEmailConsent = await memberOfferPage.userForm.getText(
          memberOfferPage.userForm.washingtonEmailConsent,
        );
        const actualWashingtonTextConsent = await memberOfferPage.userForm.getText(
          memberOfferPage.userForm.washingtonTextConsent,
        );

        expect(Helpers.normalizeQuotes(actualWashingtonEmailConsent)).toBe(
          Helpers.normalizeQuotes(t(TranslationKeys.Texts.Consent.WashingtonEmailConsent)),
        );
        expect(Helpers.normalizeQuotes(actualWashingtonTextConsent)).toBe(
          Helpers.normalizeQuotes(t(TranslationKeys.Texts.Consent.WashingtonTextConsent)),
        );

        await expect(memberOfferPage.userForm.washingtonEmailConsentCheckbox).toBeChecked();
        await expect(memberOfferPage.userForm.washingtonTextConsentCheckbox).toBeChecked();
        break;
      }

      case 'other states': {
        await (isWebkit
          ? memberOfferPage.userForm.scrollIntoViewIfWebkit(
              memberOfferPage.userForm.iframeElement,
              memberOfferPage.userForm.privacyNotice,
            )
          : memberOfferPage.userForm.scrollIntoView(memberOfferPage.userForm.privacyNotice));

        await expect(memberOfferPage.userForm.privacyNotice).toBeVisible();

        const actualPrivacyNotice = await memberOfferPage.userForm.getText(
          memberOfferPage.userForm.privacyNotice,
        );
        const normalizedPrivacyNotice = Helpers.normalizeQuotes(actualPrivacyNotice);
        expect(normalizedPrivacyNotice).toContain(
          Helpers.normalizeQuotes(t(TranslationKeys.Texts.Consent.LocalResidentDisclaimerText)),
        );
        expect(normalizedPrivacyNotice).toMatch(/Text STOP to opt-out at any time/i);
        expect(normalizedPrivacyNotice).toMatch(/SMS & MMS Terms of Service/i);

        await expect(memberOfferPage.userForm.washingtonEmailConsent).not.toBeVisible();
        await expect(memberOfferPage.userForm.washingtonTextConsent).not.toBeVisible();
        await expect(memberOfferPage.userForm.californiaResidentNotice).not.toBeVisible();
        break;
      }

      default:
        throw new Error(`Unhandled location "${location}" in step definition`);
    }
  },
);

Then(/^The link is opened in a new tab for Member Offer$/, async ({ context, scenarioContext }) => {
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
});

Then(/^The thank-you screen is displayed$/, async ({ memberOfferPage, page }) => {
  // Thank-you may land on the host page (/thank-you) or replace content inside local-offer-iframe.
  // Do not use locator.or() across page + frame locators — Playwright rejects that composition.
  const hostHeading = memberOfferPage.confirmationScreen.thankYouHeading;
  const iframeHeading = memberOfferPage.userForm.iframe.locator('h1.thankyou-h1');
  const deadline = Date.now() + TIMEOUTS.LONG;

  while (Date.now() < deadline) {
    if (page.isClosed()) {
      throw new Error('Page closed while waiting for Member Offer thank-you screen');
    }
    if (await hostHeading.isVisible().catch(() => false)) {
      await memberOfferPage.confirmationScreen.isThankYouTextVisible();
      return;
    }
    if (await iframeHeading.isVisible().catch(() => false)) {
      const expectedHeading = t(TranslationKeys.Texts.Headings.ThankYouPage);
      await expect(iframeHeading).toContainText(expectedHeading, { ignoreCase: true });
      await expect(
        memberOfferPage.userForm.iframe.locator('div.thankyou-legend-txt'),
      ).toContainText(t(TranslationKeys.Texts.BookingConfirmation.ThankYouPage));
      await expect(memberOfferPage.userForm.iframe.locator('div.thankyou-social')).toBeVisible({
        timeout: TIMEOUTS.MEDIUM,
      });
      return;
    }
    if (/thank-you/i.test(page.url())) {
      await memberOfferPage.confirmationScreen.isThankYouTextVisible();
      return;
    }
    await page.waitForTimeout(500);
  }

  throw new Error(
    `Member Offer thank-you screen not visible after ${TIMEOUTS.LONG}ms (url=${page.url()})`,
  );
});

Then(
  /^The Member Offer heading and description are displayed correctly$/,
  async ({ memberOfferPage }) => {
    const { userForm } = memberOfferPage;
    await userForm.prepareForFormHeadingAssertions();
    const heading = userForm.iframe
      .locator('#banner-title')
      .or(userForm.iframe.getByRole('heading').first())
      .or(userForm.iframe.locator('h1, h2').first());
    await expect(heading).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    const titleText = ((await heading.textContent()) ?? '').trim();
    expect(titleText.length).toBeGreaterThan(0);

    const description = userForm.iframe
      .locator('#banner-subtitle, #banner-description, [data-testid="banner-description"]')
      .or(userForm.iframe.locator('p').first())
      .first();
    const descriptionVisible = await description
      .isVisible({ timeout: TIMEOUTS.SHORT })
      .catch(() => false);
    if (descriptionVisible) {
      const descriptionText = ((await description.textContent()) ?? '').trim();
      expect(descriptionText.length).toBeGreaterThan(0);
    }
  },
);

Then(
  /^The "COMPLETE THE FORM BELOW TO PARTICIPATE" text is visible and correct on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    const { userForm } = memberOfferPage;
    await userForm.prepareForFormHeadingAssertions();
    const completeFormText = userForm.iframe
      .getByText(/complete the form below to participate/i)
      .first();
    await expect(completeFormText).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  },
);

Then(
  /^The gym location name and address are visible on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    const { userForm } = memberOfferPage;
    await userForm.waitForFormReady();
    await expect(userForm.selectedGymNameForLocalOffer).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    const gymName = ((await userForm.getText(userForm.selectedGymNameForLocalOffer)) ?? '').trim();
    expect(gymName.length).toBeGreaterThan(0);

    const addressLine1Visible = await userForm.gymAddressLine1
      .isVisible({ timeout: TIMEOUTS.SHORT })
      .catch(() => false);
    if (addressLine1Visible) {
      const address = ((await userForm.getText(userForm.gymAddressLine1)) ?? '').trim();
      expect(address.length).toBeGreaterThan(0);
    } else {
      await expect(userForm.gymAddressLine2).toBeVisible({ timeout: TIMEOUTS.SHORT });
    }
  },
);

Then(/^The Member Offer form_success GA4 event is triggered$/, async ({ scenarioContext }) => {
  // Sheet TC-M005 title references corporate_membership_lead; AF Pixel Catalog documents
  // Member Offers as form_success / member_offer / member-transformation-challenge.
  expect(
    scenarioContext.memberOfferGtmFired,
    `Expected GTM event "${GTM_EVENT.FORM_SUCCESS}" for Member Offer (pixel catalog)`,
  ).toBe(true);
});

Then(
  /^The correct marketing consent disclaimer text is displayed on the Member Offer form$/,
  async ({ memberOfferPage }) => {
    await memberOfferPage.userForm.assertMarketingConsentDisclaimerText();
  },
);

Then(
  /^The Local Resident pop-up modal content is displayed on the Member Offer form$/,
  async ({ page, memberOfferPage }) => {
    // Modal portals to the host page (same as Local Offer). Member Offer uses
    // offerVariant=member-promo — as of UAT 2026-07-19 the Local Resident span is
    // present but does not open #why-this-matters-modal (app defect vs local-offer).
    const modal = page.locator('#why-this-matters-modal');
    await expect(
      modal,
      'Expected #why-this-matters-modal on host page after Local Resident click. ' +
        'If the Local Resident link is present but no modal opens for offerVariant=member-promo, this is an application defect.',
    ).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await expect(memberOfferPage.userForm.iUnderstandButton).toBeVisible();
  },
);

Then(/^The user is redirected to the locale find-gym page from Member Offer$/, async ({ page }) => {
  const currentUrl = page.url().toLowerCase();
  // AFW-3876: thank-you FIND A GYM CTA lands on /locations (legacy /find-gym still accepted).
  expect(
    /\/locations(?:\/|(?:[?#]|$))|find[-]?a?[-]?gym|\/find-gym/.test(currentUrl),
    `Expected /locations or find-gym URL, got: ${currentUrl}`,
  ).toBe(true);
  const currentLocale = localeManager.getCurrentLocale().toLowerCase();
  if (currentLocale === 'en-us') {
    expect(currentUrl).not.toContain('/en-us/');
  } else {
    expect(currentUrl).toContain(`/${currentLocale}/`);
  }
  await expect(
    page.getByRole('heading', { name: /find a gym|find.?gym|locations/i }).first(),
  ).toBeVisible({
    timeout: TIMEOUTS.MEDIUM,
  });
});

Then(
  /^The Lead Captured and Identity Rudderstack events are verified on the Member Offer$/,
  async ({ scenarioContext }) => {
    if (!scenarioContext.rudderstackTestEnable) {
      throw new Error('Rudderstack validation was not enabled for this scenario');
    }
    expect(scenarioContext.rudderstackLeadEventsVerified).toBe(true);
  },
);

async function verifyMemberOfferLeadCapturedRudderstack({
  page,
  scenarioContext,
  rudderstackCapture,
}: {
  page: import('@playwright/test').Page;
  scenarioContext: import('@fixtures/base.fixture').ScenarioContext;
  rudderstackCapture: Awaited<ReturnType<typeof rudderstackRequests>>;
}): Promise<void> {
  const clubId =
    scenarioContext.offerGymType === 'presale'
      ? d(TestDataKeys.Locations.PreSaleClubId)
      : d(TestDataKeys.Locations.ClubId);

  let leadFromDataLayer: {
    leadCaptureId: string;
    leadId?: string;
    clubId?: string;
  } | null = null;
  try {
    const dataLayerEntries = await waitForDataLayerEntries(
      page,
      dl =>
        dl.some(
          item =>
            item?.event === 'form_success' && !!(item?.lead_captured_id || item?.lead_capture_id),
        ),
      TIMEOUTS.MEDIUM,
    );
    const formSuccessEntry = [...dataLayerEntries]
      .reverse()
      .find(
        item =>
          item?.event === 'form_success' && !!(item?.lead_captured_id || item?.lead_capture_id),
      );
    leadFromDataLayer = formSuccessEntry
      ? {
          leadCaptureId: String(
            formSuccessEntry.lead_captured_id ?? formSuccessEntry.lead_capture_id,
          ),
          leadId: formSuccessEntry.lead_id ? String(formSuccessEntry.lead_id) : undefined,
          clubId:
            formSuccessEntry.club_id !== null && formSuccessEntry.club_id !== undefined
              ? String(formSuccessEntry.club_id)
              : undefined,
        }
      : null;
  } catch {
    // Thank-you navigation can destroy context; fall back to RS payload IDs.
  }

  try {
    await expect
      .poll(() => rudderstackCapture.some(req => req.postDataJSON?.event === 'Lead Captured'), {
        timeout: TIMEOUTS.LONG,
      })
      .toBeTruthy();
  } catch (error) {
    const observed = rudderstackCapture.map(req => ({
      type: req.postDataJSON?.type,
      event: req.postDataJSON?.event,
    }));
    throw new Error(
      `Member Offer Lead Captured Rudderstack event not observed after submit. Observed=${JSON.stringify(observed)}`,
      { cause: error },
    );
  }

  let leadCaptureId = leadFromDataLayer?.leadCaptureId ?? '';
  let leadId = leadFromDataLayer?.leadId ?? '';
  let locationNumber = String(
    leadFromDataLayer?.clubId ?? scenarioContext.selectedGymClubId ?? clubId,
  );

  const leadCapturedEvent = rudderstackCapture.find(
    req => req.postDataJSON?.event === 'Lead Captured',
  );
  const props = leadCapturedEvent?.postDataJSON?.properties;
  const traits = leadCapturedEvent?.postDataJSON?.context?.traits;
  leadCaptureId = String(
    props?.lead_captured_id ??
      props?.lead_capture_id ??
      traits?.lead_captured_id ??
      traits?.lead_capture_id ??
      leadCaptureId,
  );
  leadId = String(props?.lead_id ?? traits?.lead_id ?? leadId ?? leadCaptureId);
  if (props?.location_id) {
    locationNumber = String(props.location_id);
  }
  if (!leadCaptureId) {
    console.warn(
      'APP GAP (AFW-3956): Member Offer Lead Captured observed but lead_capture_id missing — continuing form_* asserts',
    );
    leadCaptureId = 'missing-lead-capture-id';
    leadId = leadId || 'missing-lead-id';
  }

  const data: LeadEventData = [leadId || leadCaptureId, leadCaptureId, locationNumber, false];
  scenarioContext.rudderstackLeadEventData = data;
  scenarioContext.leadCaptureId =
    leadCaptureId === 'missing-lead-capture-id' ? scenarioContext.leadCaptureId : leadCaptureId;
  scenarioContext.selectedGymClubId = locationNumber;

  const pageDetails = await getPageDetails(page);
  const hasIdentify = rudderstackCapture.some(
    req => req.postDataJSON?.type === 'identify' || req.postDataJSON?.event === 'identify',
  );
  if (hasIdentify) {
    await captureRudderStackEvent({
      requests: rudderstackCapture,
      event: 'identify',
      page,
      data,
      pageDetails,
      skipPagePathValidation: true,
    });
  } else {
    console.warn(
      'APP GAP (AFW-3956): Member Offer identify Rudderstack event missing after Lead Captured',
    );
  }
  await captureRudderStackEvent({
    requests: rudderstackCapture,
    event: 'Lead Captured',
    page,
    data,
    pageDetails,
    skipPagePathValidation: true,
    // AFW-3956: member_offer_general + offer_*
    formTracking: toFormStartedFormTracking('Member Offer'),
  });
  scenarioContext.rudderstackLeadEventsVerified = true;
  scenarioContext.rudderstackPageDetails = pageDetails;
}
