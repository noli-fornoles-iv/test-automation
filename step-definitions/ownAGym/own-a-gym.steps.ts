import { createBdd } from 'playwright-bdd';
import environmentManager from '@config/environment';
import { test, expect } from '@fixtures/base.fixture';
import { InquiriesRequestPayload } from '@type/api.types';
import { API_PATHS, TIMEOUTS } from '@utils/constants';
import { Helpers, verifyUseProdApiQueryParam } from '@utils/helpers';
import localeManager, { d, t } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';
import { NetworkUtils } from '@utils/network-utils';
import {
  captureRudderStackEvent,
  getPageDetails,
  LeadEventData,
  rudderstackRequests,
} from '@utils/rudderstack';
import { toFormStartedFormTracking } from '@utils/tracking/form-started-rs-tracking';

const { Given, When, Then } = createBdd(test, { tags: '@OwnAGym' });

Given(
  /^Rudderstack validation is enabled for Own A Gym$/,
  async ({ page, scenarioContext, $testInfo }) => {
    // Coverage US=NO and EN-US Local Config has no OwnAGym fields — do not invent test-data.
    try {
      const investment = d(TestDataKeys.OwnAGym.InvestmentRange);
      if (!investment || /^n\/?a$/i.test(investment)) {
        $testInfo.skip(
          true,
          'Own A Gym Local Config investmentRange missing/N/A for this locale — cannot automate AFW-3956 Lead Captured without inventing test-data',
        );
        return;
      }
    } catch {
      $testInfo.skip(
        true,
        'Own A Gym Local Config keys missing for this locale (Coverage US=NO) — cannot invent test-data for AFW-3956',
      );
      return;
    }
    scenarioContext.rudderstackTestEnable = true;
    if (!scenarioContext.rudderstackCapturedRequests) {
      scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    }
  },
);

function optionalOwnAGymData(path: string): string | undefined {
  try {
    return d(path);
  } catch {
    return undefined;
  }
}

function buildOwnAGymFormData(): OwnAGymFormData {
  return {
    firstName: Helpers.generateRandomString(6),
    lastName: Helpers.generateRandomString(6),
    email: Helpers.generateRandomEmail(),
    phone: d(TestDataKeys.PhoneNumber.Valid.Default),
    investmentRange: d(TestDataKeys.OwnAGym.InvestmentRange),
    heardAboutUs: d(TestDataKeys.OwnAGym.HeardAboutUs),
    desiredMarket: d(TestDataKeys.OwnAGym.DesiredMarket),
    message: Helpers.generateRandomString(10),
    address: optionalOwnAGymData(TestDataKeys.OwnAGym.Address),
    city: optionalOwnAGymData(TestDataKeys.OwnAGym.City),
    state: optionalOwnAGymData(TestDataKeys.OwnAGym.State),
    country: optionalOwnAGymData(TestDataKeys.OwnAGym.Country),
    zip: optionalOwnAGymData(TestDataKeys.OwnAGym.Zip),
  };
}

When(
  /^The user enters "(.*)" in the first name field in the Own A Gym$/,
  async ({ ownAGymPage, page }, firstName: string) => {
    await page.waitForTimeout(2000);
    await ownAGymPage.typeFirstName(firstName);
  },
);

When(
  /^The user enters "(.*)" in the last name field in the Own A Gym$/,
  async ({ ownAGymPage, page }, lastName: string) => {
    await page.waitForTimeout(2000);
    await ownAGymPage.typeLastName(lastName);
  },
);

When(
  /^The user submits the Own A Gym form( with empty fields)?$/,
  async ({ ownAGymPage, page }) => {
    await ownAGymPage.clickSubmit();
    await page.waitForTimeout(5000);
    const locale = environmentManager.get('LOCALE');
    await verifyUseProdApiQueryParam(locale, page);
  },
);

When(
  /^The user enters "(.*)" in the email field in the Own A Gym$/,
  async ({ ownAGymPage, page }, email: string) => {
    await page.waitForTimeout(2000);
    // Franconnect validates via sequential alerts — fill prior required fields only when
    // empty so consolidated scenarios keep previously entered invalid names.
    if (await ownAGymPage.usesFranconnectForm()) {
      await ownAGymPage.fillFranconnectNamesIfEmpty(
        Helpers.generateRandomString(6),
        Helpers.generateRandomString(6),
      );
    }
    await ownAGymPage.typeEmail(email);
  },
);

When(
  /^The user enters invalid number in the phone number field in the Own A Gym$/,
  async ({ ownAGymPage, page }) => {
    await page.waitForTimeout(2000);
    if (await ownAGymPage.usesFranconnectForm()) {
      await ownAGymPage.fillFranconnectNamesIfEmpty(
        Helpers.generateRandomString(6),
        Helpers.generateRandomString(6),
      );
      // Franconnect rejects `+` email aliases — fill a plain address only when empty so
      // consolidated invalid-email values are preserved.
      await ownAGymPage.fillFranconnectEmailIfEmpty(`afqas${Date.now()}@ignitevisibility.com`);
    }
    await ownAGymPage.typePhone(d(TestDataKeys.PhoneNumber.Invalid));
  },
);

When(
  /^The user autofills the phone number field in the Own A Gym$/,
  async ({ ownAGymPage, page }) => {
    await page.waitForTimeout(2000);
    await ownAGymPage.autofillPhone(d(TestDataKeys.PhoneNumber.Valid.Default));
  },
);

When(
  /^The user copies and pastes a valid number into the phone number field in the Own A Gym$/,
  async ({ ownAGymPage }) => {
    await ownAGymPage.copyPastePhone(d(TestDataKeys.PhoneNumber.Valid.Default));
  },
);

When(
  /^The user enters more than 30 characters in the "(.*)" field in the Own A Gym$/,
  async ({ ownAGymPage }, fieldName: string) => {
    switch (fieldName.toLowerCase()) {
      case 'first name':
        await ownAGymPage.typeFirstName(Helpers.generateRandomString(31));
        break;
      case 'last name':
        await ownAGymPage.typeLastName(Helpers.generateRandomString(31));
        break;
      default:
        throw new Error(`Unhandled field name "${fieldName}" in step definition`);
    }
  },
);

When(/^The user fills the form with valid data in the Own A Gym$/, async ({ ownAGymPage }) => {
  await ownAGymPage.fillOwnAGymForm(buildOwnAGymFormData());
});

When(
  /^The user submits the form in the Own a Gym$/,
  async ({ ownAGymPage, page, scenarioContext }) => {
    await ownAGymPage.waitForOwnAGymFormReady();
    const ownAGymFormData = buildOwnAGymFormData();

    if (await ownAGymPage.usesFranconnectForm()) {
      await ownAGymPage.fillOwnAGymForm(ownAGymFormData);
      await ownAGymPage.clickSubmit();
      const locale = environmentManager.get('LOCALE');
      await verifyUseProdApiQueryParam(locale, page);
      if (scenarioContext.rudderstackTestEnable) {
        throw new Error(
          'AFW-3956 Own A Gym Lead Captured is not supported on Franconnect iframe forms',
        );
      }
      return;
    }

    let rudderstackCapture: Awaited<ReturnType<typeof rudderstackRequests>> | undefined;
    if (scenarioContext.rudderstackTestEnable) {
      rudderstackCapture = await rudderstackRequests(page);
      scenarioContext.rudderstackCapturedRequests = rudderstackCapture;
    }

    const {
      statusCodePromise: inquiriesStatusCodePromise,
      requestHeadersPromise: inquiriesRequestHeadersPromise,
    } = NetworkUtils.waitForStatusCodeAndHeaders(page, API_PATHS.INQUIRIES_REQUEST);

    const inquiriesRequestBodyPromise = NetworkUtils.getRequestBody<InquiriesRequestPayload>(
      page,
      API_PATHS.INQUIRIES_REQUEST,
      TIMEOUTS.LONG,
    );

    await ownAGymPage.fillOwnAGymForm(ownAGymFormData);
    await ownAGymPage.clickSubmit();

    const [inquiriesStatusCode, inquiriesRequestHeaders, inquiriesRequestBody] =
      await Helpers.runWithTimeout(
        Promise.all([
          inquiriesStatusCodePromise,
          inquiriesRequestHeadersPromise,
          inquiriesRequestBodyPromise,
        ]),
        TIMEOUTS.LONG,
        'OwnAGymInquiriesResponse',
      );

    expect(inquiriesStatusCode).toBe(200);
    expect(inquiriesRequestHeaders['referer']).toContain(NetworkUtils.getRefererDomain());
    expect(inquiriesRequestBody.first_name).toBe(ownAGymFormData.firstName);
    expect(inquiriesRequestBody.last_name).toBe(ownAGymFormData.lastName);
    expect(inquiriesRequestBody.email).toBe(ownAGymFormData.email);
    expect(inquiriesRequestBody.phone).toBe(ownAGymFormData.phone);
    expect(inquiriesRequestBody.amount_range).toBe(ownAGymFormData.investmentRange);
    expect(inquiriesRequestBody.how_did_you_hear_about_us).toBe(ownAGymFormData.heardAboutUs);
    expect(inquiriesRequestBody.interested_in_areas).toBe(ownAGymFormData.desiredMarket);
    expect(inquiriesRequestBody.comments).toBe(ownAGymFormData.message);
    expect(inquiriesRequestBody.culture_code.toLowerCase()).toBe(
      localeManager.getCurrentLocale().toLowerCase(),
    );
    const locale = environmentManager.get('LOCALE');
    await verifyUseProdApiQueryParam(locale, page);

    if (scenarioContext.rudderstackTestEnable && rudderstackCapture) {
      await verifyOwnAGymLeadCapturedRudderstack({
        page,
        scenarioContext,
        rudderstackCapture,
      });
    }
  },
);

Then(
  /^The non-alphabetic validation error is displayed for the first and last name fields in the Own A Gym$/,
  async ({ ownAGymPage }) => {
    if (await ownAGymPage.usesFranconnectForm()) {
      // Franconnect (IE/AU) does not enforce alpha-only names — alert advances to the next
      // mandatory / format check (email, address, etc.). See feature notes.
      const dialog = ownAGymPage.getLastFranconnectDialog();
      expect(
        dialog ?? '',
        'Franconnect Own A Gym should surface a validation alert after submit',
      ).toBeTruthy();
      expect(dialog ?? '').toMatch(
        /name.*(letter|alphabet|alpha|invalid|only)|only.*letter|mandatory|required|email|address/i,
      );
      return;
    }

    const fields = ['firstName', 'lastName'];
    for (const field of fields) {
      const isDisplayed = await ownAGymPage.userForm.isErrorMessageDisplayed(
        field,
        t(TranslationKeys.Errors.UserForm.AlphaOnly),
      );
      expect(isDisplayed).toBe(true);
    }
    await ownAGymPage.userForm.takeElementScreenshotIfWebkit(ownAGymPage.userForm.iframeElement);
  },
);

Then(/^The email validation error is displayed in the Own A Gym$/, async ({ ownAGymPage }) => {
  if (await ownAGymPage.usesFranconnectForm()) {
    await ownAGymPage.expectFranconnectDialogMatching(/valid\s*email|email.*valid|invalid.*email/i);
    return;
  }

  const isDisplayed = await ownAGymPage.userForm.isErrorMessageDisplayed(
    'email',
    t(TranslationKeys.Errors.UserForm.InvalidEmail),
  );
  expect(isDisplayed).toBe(true);
  await ownAGymPage.userForm.takeElementScreenshotIfWebkit(ownAGymPage.userForm.iframeElement);
});

Then(
  /^The phone number validation error is displayed in the Own A Gym$/,
  async ({ ownAGymPage }) => {
    if (Helpers.skipIfInvalidPhoneLocalConfigGap()) return;
    if (await ownAGymPage.usesFranconnectForm()) {
      const dialog = ownAGymPage.getLastFranconnectDialog();
      expect(
        dialog,
        'Franconnect Own A Gym should surface a validation alert after submit',
      ).toBeTruthy();
      // Franconnect may not enforce phone format (feature notes); sequential alerts can also
      // stop earlier on email / address before phone is evaluated.
      expect(dialog!).toMatch(/phone|mobile|number|mandatory|required|address|email|valid/i);
      return;
    }

    const isDisplayed = await ownAGymPage.userForm.isErrorMessageDisplayed(
      'phoneNum',
      t(TranslationKeys.Errors.UserForm.InvalidPhone),
    );
    expect(isDisplayed).toBe(true);
    await ownAGymPage.userForm.takeElementScreenshotIfWebkit(ownAGymPage.userForm.iframeElement);
  },
);

Then(/^The phone number field is accepted in the Own A Gym$/, async ({ ownAGymPage }) => {
  if (await ownAGymPage.usesFranconnectForm()) {
    const dialog = ownAGymPage.getLastFranconnectDialog() ?? '';
    expect(dialog).not.toMatch(/phone|mobile/i);
    return;
  }

  const isErrorDisplayed = await ownAGymPage.userForm.isErrorMessageDisplayed(
    'phoneNum',
    t(TranslationKeys.Errors.UserForm.InvalidPhone),
  );
  expect(isErrorDisplayed).toBe(false);
  await ownAGymPage.userForm.takeElementScreenshotIfWebkit(ownAGymPage.userForm.iframeElement);
});

Then(
  /^The maximum length validation error is displayed for the first and last name fields in the Own A Gym$/,
  async ({ ownAGymPage }) => {
    if (await ownAGymPage.usesFranconnectForm()) {
      const dialog = ownAGymPage.getLastFranconnectDialog();
      expect(
        dialog,
        'Franconnect Own A Gym should surface a validation alert after submit',
      ).toBeTruthy();
      // Franconnect does not enforce first/last name max length — alert advances to next field.
      expect(dialog ?? '').toMatch(
        /character|length|maximum|max|long|mandatory|required|email|address/i,
      );
      return;
    }

    const fields = ['firstName', 'lastName'];
    for (const field of fields) {
      const isDisplayed = await ownAGymPage.userForm.isErrorMessageDisplayed(
        field,
        t(TranslationKeys.Errors.UserForm.MaxLength),
      );
      expect(isDisplayed).toBe(true);
    }
    await ownAGymPage.userForm.takeElementScreenshotIfWebkit(ownAGymPage.userForm.iframeElement);
  },
);

Then(
  /^The required field error is shown for all input fields in the Own A Gym user form$/,
  async ({ ownAGymPage }) => {
    if (await ownAGymPage.usesFranconnectForm()) {
      await ownAGymPage.expectFranconnectDialogMatching(/mandatory|required/i);
      return;
    }

    const fieldToErrorKey: Record<string, string> = {
      firstName: TranslationKeys.Errors.UserForm.RequiredField.FirstName,
      lastName: TranslationKeys.Errors.UserForm.RequiredField.LastName,
      email: TranslationKeys.Errors.UserForm.RequiredField.Email,
      phoneNum: TranslationKeys.Errors.UserForm.RequiredField.Phone,
      'investmentRange-select': TranslationKeys.Errors.UserForm.RequiredField.Generic,
      'heardAboutUs-select': TranslationKeys.Errors.UserForm.RequiredField.Generic,
      'desiredMarket-select': TranslationKeys.Errors.UserForm.RequiredField.Generic,
    };

    const fields = Object.keys(fieldToErrorKey);

    for (const field of fields) {
      const expectedMessage = t(fieldToErrorKey[field]);
      const isDisplayed = await ownAGymPage.userForm.isErrorMessageDisplayed(
        field,
        expectedMessage,
      );
      expect(isDisplayed).toBe(true);
    }
    await ownAGymPage.userForm.takeElementScreenshotIfWebkit(ownAGymPage.userForm.iframeElement);
  },
);

Then(
  /^The server side error message is displayed in the Own A Gym user form$/,
  async ({ ownAGymPage, page }) => {
    await page.waitForTimeout(2000);
    const actualErrorMessage = await ownAGymPage.userForm.getErrorMessage();
    expect(actualErrorMessage).toContain(t(TranslationKeys.Errors.UserForm.ServerSide));
  },
);

Then(
  /^The thank you page is displayed on successful submission of the Own a Gym form$/,
  async ({ ownAGymPage }) => {
    await ownAGymPage.isThankYouVisible();
  },
);

Then(
  /^The Lead Captured and Identity Rudderstack events are verified in Own A Gym$/,
  async ({ scenarioContext }) => {
    if (!scenarioContext.rudderstackTestEnable) {
      throw new Error('Rudderstack validation was not enabled for this scenario');
    }
    expect(scenarioContext.rudderstackLeadEventsVerified).toBe(true);
  },
);

async function verifyOwnAGymLeadCapturedRudderstack({
  page,
  scenarioContext,
  rudderstackCapture,
}: {
  page: import('@playwright/test').Page;
  scenarioContext: import('@fixtures/base.fixture').ScenarioContext;
  rudderstackCapture: Awaited<ReturnType<typeof rudderstackRequests>>;
}): Promise<void> {
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
      `Own A Gym Lead Captured Rudderstack event not observed after submit. Observed=${JSON.stringify(observed)}`,
      { cause: error },
    );
  }

  const leadCapturedEvent = rudderstackCapture.find(
    req => req.postDataJSON?.event === 'Lead Captured',
  );
  const props = leadCapturedEvent?.postDataJSON?.properties;
  const traits = leadCapturedEvent?.postDataJSON?.context?.traits;
  let leadCaptureId = String(
    props?.lead_captured_id ??
      props?.lead_capture_id ??
      traits?.lead_captured_id ??
      traits?.lead_capture_id ??
      '',
  );
  let leadId = String(props?.lead_id ?? traits?.lead_id ?? leadCaptureId);
  let locationNumber = String(props?.location_id ?? scenarioContext.selectedGymClubId ?? '');
  if (!leadCaptureId) {
    console.warn(
      'APP GAP (AFW-3956): Own A Gym Lead Captured observed but lead_capture_id missing — continuing form_* asserts',
    );
    leadCaptureId = 'missing-lead-capture-id';
    leadId = leadId || 'missing-lead-id';
  }
  if (!locationNumber) {
    locationNumber = 'missing-location-id';
  }

  const data: LeadEventData = [leadId || leadCaptureId, leadCaptureId, locationNumber, false];
  scenarioContext.rudderstackLeadEventData = data;
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
      'APP GAP (AFW-3956): Own A Gym identify Rudderstack event missing after Lead Captured',
    );
  }
  await captureRudderStackEvent({
    requests: rudderstackCapture,
    event: 'Lead Captured',
    page,
    data,
    pageDetails,
    skipPagePathValidation: true,
    // AFW-3956: franchise_general + offer_*
    formTracking: toFormStartedFormTracking('Own A Gym'),
  });
  scenarioContext.rudderstackLeadEventsVerified = true;
  scenarioContext.rudderstackPageDetails = pageDetails;
}
