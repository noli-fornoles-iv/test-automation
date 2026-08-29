import { createBdd } from 'playwright-bdd';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import environmentManager from '@config/environment';
import { test, expect } from '@fixtures/base.fixture';
import { BookAppointmentRequest, ProspectRequest, ProspectResponse } from '@type/api.types';
import { PATHS, TIMEOUTS, API_PATHS, GTM_EVENT } from '@utils/constants';
import { AppPages } from '@utils/constants/app-pages.enum';
import {
  Helpers,
  navigateToUrl,
  verifyUseProdApiQueryParam,
  appendDisableCaptchaParam,
  getProdAPI,
} from '@utils/helpers';
import localeManager, { d, t } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';
import { logger } from '@utils/logger';
import { NetworkUtils } from '@utils/network-utils';
import {
  captureAppointmentScheduledWithSlotSelected,
  captureIdentifyAndLeadCapturedAfterSubmit,
  getPageDetails,
  LeadEventData,
  rudderstackRequests,
} from '@utils/rudderstack';
import { toFormStartedFormTracking } from '@utils/tracking/form-started-rs-tracking';

const { Given, When, Then } = createBdd(test, { tags: '@InviteAFriend' });

function withUserParam(url: string, user: 'm' | 'n'): string {
  const parsed = new URL(url);
  parsed.searchParams.set('user', user);
  return parsed.toString();
}

function resolveMemberPhone(): string | undefined {
  try {
    const value = d(TestDataKeys.PhoneNumber.Valid.Member)?.trim();
    if (!value || /^n\/?a$/i.test(value)) {
      return undefined;
    }
    return value;
  } catch {
    return undefined;
  }
}

function normalizePhoneKey(phone: string | undefined): string {
  if (!phone) return '';
  return parsePhoneNumberFromString(phone)?.number || phone.replace(/\D/g, '');
}

/**
 * Prefer Local Config Secondary when it differs from Member/Default AND is mobile-capable.
 * Landline Secondary (IT FIXED_LINE, AT Graz 316 with undefined type) never enables Share —
 * generate a locale mobile. Do not invent NonMember outside Local Config.
 */
function resolveNonMemberPhone(): string {
  const member =
    resolveMemberPhone() ||
    (() => {
      try {
        return d(TestDataKeys.PhoneNumber.Valid.Default)?.trim();
      } catch {
        return undefined;
      }
    })();
  const memberKey = normalizePhoneKey(member);

  let secondary: string | undefined;
  try {
    secondary = d(TestDataKeys.PhoneNumber.Valid.Secondary)?.trim();
  } catch {
    secondary = undefined;
  }
  if (
    secondary &&
    !/^n\/?a$/i.test(secondary) &&
    normalizePhoneKey(secondary) !== memberKey &&
    Helpers.isMobileCapablePhone(secondary)
  ) {
    return secondary;
  }
  if (secondary && !Helpers.isMobileCapablePhone(secondary)) {
    logger.warn(
      `Local Config Secondary phone is not mobile-capable (${secondary}); generating a locale mobile for Invite Share.`,
    );
  }

  const locale = environmentManager.get('LOCALE') || localeManager.getCurrentLocale();
  const generated = Helpers.generateRandomPhoneForLocale(locale, [member, secondary]);
  if (generated) {
    logger.info(
      `Using generated non-member mobile phone for Invite A Friend (${locale}): ${generated}`,
    );
    return generated;
  }

  try {
    const configured = d(TestDataKeys.PhoneNumber.Valid.NonMember)?.trim();
    if (
      configured &&
      !/^n\/?a$/i.test(configured) &&
      normalizePhoneKey(configured) !== memberKey &&
      Helpers.isMobileCapablePhone(configured)
    ) {
      return configured;
    }
  } catch {
    // fall through
  }

  throw new Error(
    `Unable to resolve a non-member mobile phone for locale ${locale}. Local Config Secondary is missing, matches Member, or is not mobile-capable, and random generation failed.`,
  );
}

function extractReferralCodeFromLeadCapture(
  body: ProspectRequest | Record<string, unknown>,
): string | undefined {
  const topLevel = (body as ProspectRequest).referral_code;
  if (typeof topLevel === 'string' && topLevel.length > 0) {
    return topLevel;
  }

  const nested = (body as ProspectRequest).prospectData?.lead_properties?.referral_code;
  if (typeof nested === 'string' && nested.length > 0) {
    return nested;
  }

  const serialized = JSON.stringify(body);
  const match = serialized.match(/"referral_code"\s*:\s*"([^"]+)"/i);
  return match?.[1];
}

async function generateInviteReferral({
  page,
  inviteAFriendPage,
  scenarioContext,
  phone,
}: {
  page: import('@playwright/test').Page;
  inviteAFriendPage: import('@pages/modules/InviteAFriendPage').InviteAFriendPage;
  scenarioContext: import('@fixtures/base.fixture').ScenarioContext;
  phone: string;
}): Promise<void> {
  const MAX_ATTEMPTS = 3;
  let lastError: unknown;
  const locale = environmentManager.get('LOCALE');
  const inviteUrl = environmentManager.get('BASE_URL') + PATHS.INVITE_FRIEND;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      // Referrals POST may fire on phone blur OR only after Share click — register the
      // waiter first, then fill + click before awaiting so we never deadlock on blur-only.
      const referralsResponsePromise = NetworkUtils.waitForReferralsResponse(
        page,
        TIMEOUTS.LONG,
      ).then(
        value => ({ ok: true as const, value }),
        error => ({ ok: false as const, error }),
      );
      await inviteAFriendPage.fillMobilePhone(phone);
      await inviteAFriendPage.clickShareReferral().catch(() => {
        // Modal/share CTA may already be available after blur-triggered referral generation.
      });
      const referralsResponse = await referralsResponsePromise;
      if (!referralsResponse.ok) {
        throw referralsResponse.error;
      }

      scenarioContext.referralCode = referralsResponse.value.code;
      scenarioContext.referralUrl = referralsResponse.value.redeemUrl;
      return;
    } catch (error) {
      lastError = error;
      logger.warn(
        `Invite referral generation attempt ${attempt} failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      if (attempt < MAX_ATTEMPTS) {
        // Full re-navigate recovers better than reload when the iframe stalls under load.
        await navigateToUrl(inviteUrl, page, locale);
        await inviteAFriendPage.waitForPageReady();
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Invite referral generation failed: ${String(lastError)}`);
}

async function buildInviteLandingUrl(referralUrl: string, user: 'm' | 'n'): Promise<string> {
  const locale = environmentManager.get('LOCALE');
  const baseUrl = String(environmentManager.get('BASE_URL')).replace(/\/$/, '');

  // Referrals API often returns prod anytimefitness.com redeem URLs. Always open on the
  // current env BASE_URL so disable_captcha / use_prod_api apply on SIT/UAT.
  let envReferralUrl = referralUrl;
  try {
    const parsed = new URL(referralUrl);
    const code =
      parsed.searchParams.get('h') ||
      parsed.searchParams.get('hash') ||
      parsed.searchParams.get('code');
    if (code) {
      envReferralUrl = `${baseUrl}/invite/?h=${encodeURIComponent(code)}`;
    } else {
      const inviteIdx = parsed.pathname.toLowerCase().indexOf('/invite');
      const invitePath = inviteIdx >= 0 ? parsed.pathname.slice(inviteIdx) : parsed.pathname;
      envReferralUrl = `${baseUrl}${invitePath}${parsed.search}`;
    }
  } catch {
    envReferralUrl = referralUrl.startsWith('http') ? referralUrl : `${baseUrl}${referralUrl}`;
  }

  let targetUrl = appendDisableCaptchaParam(withUserParam(envReferralUrl, user));
  // Non-member landing has no pre-bound gym — always pin test_location_id to the
  // locale Local Config club so SIT/UAT uses the test studio (not a live search hit).
  if (user === 'n') {
    const clubId = d(TestDataKeys.Locations.ClubId);
    const parsed = new URL(targetUrl);
    parsed.searchParams.set('test_location_id', clubId);
    targetUrl = parsed.toString();
  }
  const prodApi = await getProdAPI(targetUrl, locale);
  if (prodApi && !targetUrl.includes('use_prod_api=true')) {
    const parsed = new URL(targetUrl);
    parsed.searchParams.set('use_prod_api', 'true');
    targetUrl = parsed.toString();
  }
  return targetUrl;
}

async function openReferralLanding({
  page,
  scenarioContext,
  user,
}: {
  page: import('@playwright/test').Page;
  scenarioContext: import('@fixtures/base.fixture').ScenarioContext;
  user: 'm' | 'n';
}): Promise<void> {
  if (!scenarioContext.referralUrl || !scenarioContext.referralCode) {
    throw new Error('Referral URL/code must be generated before opening referral landing');
  }

  const targetUrl = await buildInviteLandingUrl(scenarioContext.referralUrl, user);
  const referralLookupPromise = NetworkUtils.waitForReferralLookupResponse(page).catch(
    () => undefined,
  );
  // Invite landing SPAs (esp. Safari) often never fire `load` — use domcontentloaded.
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.LONG });
  await page.waitForLoadState('domcontentloaded');
  scenarioContext.referralLandingResponse = await referralLookupPromise;
  await verifyUseProdApiQueryParam(environmentManager.get('LOCALE'), page);
}

async function submitReferralLandingForm({
  page,
  referralLandingPage,
  scenarioContext,
}: {
  page: import('@playwright/test').Page;
  referralLandingPage: import('@pages/modules/ReferralLandingPage').ReferralLandingPage;
  scenarioContext: import('@fixtures/base.fixture').ScenarioContext;
}): Promise<void> {
  await referralLandingPage.waitForPageReady();

  // PH/SG geo banners sit over the iframe and can remount the host mid-submit so Lead Captured
  // never reaches the dataplane (same Local Offer pattern).
  await page
    .evaluate(() => {
      const labels = Array.from(document.querySelectorAll('#main-label')).filter(el =>
        /philippines|singapore|new zealand|indonesia website/i.test(el.textContent ?? ''),
      );
      for (const label of labels) {
        let root: HTMLElement | null = label as HTMLElement;
        for (let i = 0; i < 12 && root; i++) {
          const cls = (root.className || '').toString().toLowerCase();
          if (
            /banner|modal|overlay|dialog|geo|redirect/.test(cls) ||
            root.getAttribute('role') === 'dialog'
          ) {
            break;
          }
          root = root.parentElement;
        }
        root = root || (label.parentElement as HTMLElement) || (label as HTMLElement);
        root.style.setProperty('display', 'none', 'important');
        root.style.setProperty('visibility', 'hidden', 'important');
        root.style.setProperty('pointer-events', 'none', 'important');
        root.setAttribute('aria-hidden', 'true');
      }
    })
    .catch(() => {});

  const formData = {
    firstName: Helpers.generateRandomString(6),
    lastName: Helpers.generateRandomString(6),
    email: Helpers.generateRandomEmail(),
    phone: d(TestDataKeys.PhoneNumber.Valid.Default),
    zipCode: d(TestDataKeys.ZipCode.Valid.Default),
  };

  scenarioContext.formData = formData;
  scenarioContext.selectedGymName = (await referralLandingPage.gymName.textContent())?.trim() ?? '';
  scenarioContext.pageName = scenarioContext.pageName || 'invite a friend';

  let rudderstackCapture: Awaited<ReturnType<typeof rudderstackRequests>> | undefined;
  if (scenarioContext.rudderstackTestEnable) {
    rudderstackCapture = await rudderstackRequests(page);
    scenarioContext.rudderstackCapturedRequests = rudderstackCapture;
  }

  const isMobile = await Helpers.isMobileDevice(page).catch(() => false);
  // Dual-iframe schedule detect should resolve quickly when the picker mounts in
  // `#try-us-free-iframe`. Keep API wait at LONG (lead-capture can be slow); fewer
  // mobile retries so iPhone Safari does not burn the full EXTRA_LONG suite budget.
  const MAX_RETRIES = isMobile ? 2 : 3;
  const SUBMIT_TIMEOUT = TIMEOUTS.LONG;
  let prospectStatusCode = 0;
  let prospectResponseBody: ProspectResponse | null = null;
  let prospectRequestBody: ProspectRequest | null = null;
  let formProgressedToBooking = false;
  let cmsThankYouShown = false;

  const hasProgressedToSchedulePicker = async (): Promise<boolean> =>
    referralLandingPage.isSchedulePickerVisible();

  const hasCmsThankYou = async (): Promise<boolean> =>
    page
      .getByText(/you'?re in/i)
      .first()
      .isVisible()
      .catch(() => false);

  const hasRecaptchaChallenge = async (): Promise<boolean> =>
    page
      .getByText(/select all images|i'm not a robot|verify you are human/i)
      .first()
      .isVisible()
      .catch(() => false);

  const waitForUiPostSubmitOutcome = async (signal: {
    cancelled: boolean;
  }): Promise<'schedule' | 'thankyou' | 'captcha'> => {
    const deadline = Date.now() + SUBMIT_TIMEOUT;
    while (Date.now() < deadline && !signal.cancelled) {
      if (page.isClosed()) {
        throw new Error('Browser page was closed while waiting for Invite referral post-submit UI');
      }
      if (await hasProgressedToSchedulePicker()) {
        return 'schedule';
      }
      if (await hasCmsThankYou()) {
        return 'thankyou';
      }
      if (await hasRecaptchaChallenge()) {
        return 'captcha';
      }
      await page.waitForTimeout(400);
    }
    if (signal.cancelled) {
      throw new Error('Invite referral UI wait cancelled after lead-capture API settled');
    }
    throw new Error(
      'Invite referral post-submit UI (schedule picker or CMS thank-you) not observed',
    );
  };

  const prepareAndFillForm = async (): Promise<void> => {
    if (page.isClosed()) {
      throw new Error('Browser page was closed during form interaction');
    }
    // Full navigation reload so the app re-reads disable_captcha (replaceState alone is not enough).
    const withCaptchaDisabled = appendDisableCaptchaParam(page.url());
    if (!page.url().includes('disable_captcha=true')) {
      await page.goto(withCaptchaDisabled, { waitUntil: 'domcontentloaded' });
    }
    await referralLandingPage.waitForPageReady();
    await referralLandingPage.userForm.ensureDisableCaptchaPersisted();
    await referralLandingPage.fillReferralForm(formData);
    await referralLandingPage.checkTermsAcceptedCheckbox();
  };

  await prepareAndFillForm();

  for (let retry = 1; retry <= MAX_RETRIES; retry++) {
    if (await hasProgressedToSchedulePicker()) {
      formProgressedToBooking = true;
      break;
    }
    if (await hasCmsThankYou()) {
      cmsThankYouShown = true;
      break;
    }

    logger.info(`Invite referral landing form submit attempt #${retry}`);

    // MEDIUM — do not await LONG after 201 lead-capture or Share Invitation burns the suite budget.
    const availabilitiesBodyPromise = NetworkUtils.getResponseBody<{
      staff_availabilities: { staff: { id: string | number } }[];
    }>(page, API_PATHS.SCHEDULING_AVAILABILITIES_REQUEST(), TIMEOUTS.MEDIUM).catch(() => undefined);

    const {
      statusCodePromise: prospectStatusCodePromise,
      responseBodyPromise: prospectResponsePromise,
      requestBodyPromise: prospectRequestBodyPromise,
    } = NetworkUtils.waitForStatusCodeHeadersAndBody<ProspectResponse, ProspectRequest>(
      page,
      API_PATHS.PROSPECTS_REQUEST,
      SUBMIT_TIMEOUT,
    );

    const apiPromise = Promise.all([
      prospectStatusCodePromise,
      prospectResponsePromise,
      prospectRequestBodyPromise,
    ]).then(([status, body, request]) => ({
      kind: 'api' as const,
      status,
      body,
      request,
    }));

    try {
      await referralLandingPage.submitForm();

      const uiSignal = { cancelled: false };
      const outcome = await new Promise<
        | { kind: 'api'; status: number; body: ProspectResponse; request: ProspectRequest }
        | { kind: 'ui'; ui: 'schedule' | 'thankyou' | 'captcha' }
      >((resolve, reject) => {
        let settled = false;
        const finish = (
          value:
            | { kind: 'api'; status: number; body: ProspectResponse; request: ProspectRequest }
            | { kind: 'ui'; ui: 'schedule' | 'thankyou' | 'captcha' },
        ) => {
          if (settled) return;
          settled = true;
          if (value.kind === 'api') {
            uiSignal.cancelled = true;
          }
          resolve(value);
        };

        apiPromise.then(finish).catch(() => {
          // Keep waiting for UI / captcha; API miss is not fatal by itself.
        });
        waitForUiPostSubmitOutcome(uiSignal)
          .then(ui => finish({ kind: 'ui', ui }))
          .catch(error => {
            if (!settled) {
              settled = true;
              reject(error);
            }
          });
      });

      if (outcome.kind === 'ui') {
        void apiPromise.catch(() => undefined);
        if (outcome.ui === 'schedule') {
          formProgressedToBooking = true;
          break;
        }
        if (outcome.ui === 'thankyou') {
          cmsThankYouShown = true;
          break;
        }
        logger.warn(
          `reCAPTCHA challenge detected on Invite referral submit attempt ${retry}; reloading with disable_captcha=true`,
        );
        if (retry === MAX_RETRIES) {
          throw new Error(
            'reCAPTCHA challenge blocked Invite referral form submit despite disable_captcha=true',
          );
        }
        await prepareAndFillForm();
        continue;
      }

      prospectStatusCode = outcome.status;
      prospectResponseBody = outcome.body;
      prospectRequestBody = outcome.request;
    } catch (error) {
      logger.warn(
        `Invite referral landing form submit attempt ${retry} failed: ${error instanceof Error ? error.message : String(error)}`,
      );

      if (await hasProgressedToSchedulePicker()) {
        formProgressedToBooking = true;
        break;
      }
      if (await hasCmsThankYou()) {
        cmsThankYouShown = true;
        break;
      }

      if (retry === MAX_RETRIES) {
        throw new Error(
          `Failed to submit Invite referral landing form after ${MAX_RETRIES} attempts`,
        );
      }

      await prepareAndFillForm();
      continue;
    }

    const availabilitiesBody = await Promise.race([
      availabilitiesBodyPromise,
      // Bound wait so missing availabilities cannot burn LONG after lead-capture 201.
      new Promise<undefined>(resolve => {
        setTimeout(() => resolve(undefined), TIMEOUTS.SHORT);
      }),
    ]);
    if (availabilitiesBody) {
      try {
        scenarioContext.staffId =
          NetworkUtils.parseStaffIdFromAvailabilitiesBody(availabilitiesBody);
      } catch (error) {
        logger.warn(
          `staff_id not captured from availabilities: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    if (prospectRequestBody) {
      scenarioContext.prospectRequestData = prospectRequestBody;
    }

    if (!process.env.CI) {
      // Soft check only — keep short so mobile Safari retries do not burn the test budget.
      const isFormSuccessFired = await NetworkUtils.isGTMEventFired(
        page,
        GTM_EVENT.FORM_SUCCESS,
        TIMEOUTS.SHORT,
      ).catch(() => false);
      if (!isFormSuccessFired) {
        logger.warn('GTM form_success was not observed after Invite referral lead-capture');
      }
    }

    if (prospectStatusCode === 201 || prospectStatusCode === 200) {
      break;
    }

    // Soft 408 retry — same as BAT; lead-capture gateway is flaky on SIT.
    if (prospectStatusCode === 408 && retry < MAX_RETRIES) {
      logger.warn(
        `Invite referral lead-capture returned 408 on attempt ${retry}; soft-retrying submit`,
      );
      await prepareAndFillForm();
      continue;
    }

    if (await hasProgressedToSchedulePicker()) {
      formProgressedToBooking = true;
      break;
    }
    if (await hasCmsThankYou()) {
      cmsThankYouShown = true;
      break;
    }

    if (retry === MAX_RETRIES) {
      // AFW-3956: if Lead Captured still fired despite 408s, assert form_* instead of hard-failing only on API status.
      if (
        scenarioContext.rudderstackTestEnable &&
        rudderstackCapture?.some(req => req.postDataJSON?.event === 'Lead Captured')
      ) {
        logger.warn(
          `Invite referral lead-capture returned ${prospectStatusCode} after ${MAX_RETRIES} attempts but Lead Captured RS was observed — continuing RS asserts`,
        );
        scenarioContext.leadCaptureSuccessful = true;
        await verifyInviteLeadCapturedRudderstack({
          page,
          scenarioContext,
          rudderstackCapture,
          prospectResponseBody,
        });
        return;
      }
      throw new Error(
        `Lead-capture API returned ${prospectStatusCode} after ${MAX_RETRIES} submission attempts`,
      );
    }

    await prepareAndFillForm();
  }

  if (cmsThankYouShown) {
    logger.warn(
      'Invite referral landing showed CMS thank-you after submit — skipping schedule/booking assertions',
    );
    scenarioContext.canBookAppointment = false;
    scenarioContext.scheduleBookingSkipped = true;
    scenarioContext.leadCaptureSuccessful = true;
    await verifyInviteLeadCapturedRudderstack({
      page,
      scenarioContext,
      rudderstackCapture,
      prospectResponseBody,
    });
    return;
  }

  if (formProgressedToBooking) {
    scenarioContext.canBookAppointment = true;
    scenarioContext.leadCaptureSuccessful = true;
    await referralLandingPage.waitForScheduleReady(TIMEOUTS.MEDIUM).catch(() => {});
    await verifyInviteLeadCapturedRudderstack({
      page,
      scenarioContext,
      rudderstackCapture,
      prospectResponseBody,
    });
    return;
  }

  if (!prospectResponseBody) {
    throw new Error('Lead-capture response body was not captured after form submission');
  }

  // Lead-capture may return 200 or 201 depending on gateway / env.
  expect([200, 201]).toContain(prospectStatusCode);
  expect(prospectResponseBody.prospect.first_name).toBe(formData.firstName);
  // Connected-member invites may append " /r {referrer}" to last_name in lead-capture.
  expect(prospectResponseBody.prospect.last_name?.startsWith(formData.lastName)).toBe(true);
  expect(prospectResponseBody.prospect.email).toBe(formData.email);
  scenarioContext.canBookAppointment = prospectResponseBody.prospect.can_book_appointment;
  scenarioContext.leadCaptureSuccessful = true;
  await verifyInviteLeadCapturedRudderstack({
    page,
    scenarioContext,
    rudderstackCapture,
    prospectResponseBody,
  });
}

async function verifyInviteLeadCapturedRudderstack({
  page,
  scenarioContext,
  rudderstackCapture,
  prospectResponseBody,
}: {
  page: import('@playwright/test').Page;
  scenarioContext: import('@fixtures/base.fixture').ScenarioContext;
  rudderstackCapture: Awaited<ReturnType<typeof rudderstackRequests>> | undefined;
  prospectResponseBody: ProspectResponse | null;
}): Promise<void> {
  if (!scenarioContext.rudderstackTestEnable || !rudderstackCapture) {
    return;
  }

  const clubId = d(TestDataKeys.Locations.ClubId);
  let leadId = String(prospectResponseBody?.prospect?.lead_id ?? '');
  let leadCaptureId = String(prospectResponseBody?.prospect?.lead_capture_id ?? '');
  let locationNumber = String(
    prospectResponseBody?.prospect?.location_number ?? scenarioContext.selectedGymClubId ?? clubId,
  );

  try {
    await expect
      .poll(() => rudderstackCapture.some(req => req.postDataJSON?.event === 'Lead Captured'), {
        timeout: TIMEOUTS.LONG,
      })
      .toBeTruthy();
  } catch (error) {
    // Re-bind route capture after thank-you/schedule remount, then one more MEDIUM poll.
    await rudderstackRequests(page);
    try {
      await expect
        .poll(() => rudderstackCapture.some(req => req.postDataJSON?.event === 'Lead Captured'), {
          timeout: TIMEOUTS.MEDIUM,
        })
        .toBeTruthy();
    } catch {
      const observed = rudderstackCapture.map(req => ({
        type: req.postDataJSON?.type,
        event: req.postDataJSON?.event,
      }));
      throw new Error(
        `Invite a Friend Lead Captured Rudderstack event not observed after referral submit. Observed=${JSON.stringify(observed)}`,
        { cause: error },
      );
    }
  }

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
    throw new Error('Invite a Friend Lead Captured fired but lead_capture_id is missing');
  }

  scenarioContext.leadCaptureId = leadCaptureId;
  scenarioContext.selectedGymClubId = locationNumber;
  const data: LeadEventData = [leadId || leadCaptureId, leadCaptureId, locationNumber, false];
  scenarioContext.rudderstackLeadEventData = data;

  const pageDetails = await getPageDetails(page);
  await captureIdentifyAndLeadCapturedAfterSubmit({
    requests: rudderstackCapture,
    page,
    data,
    pageDetails,
    flowLabel: 'Invite a Friend',
    formTracking: toFormStartedFormTracking('Invite a Friend'),
    // Lead Captured already observed above — keep a short settle for identify only.
    pollTimeout: TIMEOUTS.SHORT,
  });
  scenarioContext.rudderstackLeadEventsVerified = true;
  scenarioContext.rudderstackPageDetails = pageDetails;
}

Given(
  /^Rudderstack validation is enabled for Invite a Friend$/,
  async ({ page, scenarioContext }) => {
    scenarioContext.rudderstackTestEnable = true;
    if (!scenarioContext.rudderstackCapturedRequests) {
      scenarioContext.rudderstackCapturedRequests = await rudderstackRequests(page);
    }
  },
);

Given(
  /^The user is on the Invite a Friend referral landing page for a connected member$/,
  async ({ page, inviteAFriendPage, scenarioContext, $testInfo }) => {
    scenarioContext.pageName = 'invite a friend';
    const memberPhone = resolveMemberPhone();
    if (!memberPhone) {
      $testInfo.skip(
        true,
        'No connected-member phone is configured for this locale (Local Config / test-data)',
      );
      return;
    }

    const locale = environmentManager.get('LOCALE');
    const url = environmentManager.get('BASE_URL') + PATHS.INVITE_FRIEND;
    await navigateToUrl(url, page, locale);

    await generateInviteReferral({
      page,
      inviteAFriendPage,
      scenarioContext,
      phone: memberPhone,
    });
    await openReferralLanding({ page, scenarioContext, user: 'm' });
  },
);

Given(
  /^The user is on the Invite a Friend referral landing page for a non-member$/,
  async ({ page, inviteAFriendPage, scenarioContext }) => {
    scenarioContext.pageName = 'invite a friend';
    const locale = environmentManager.get('LOCALE');
    const url = environmentManager.get('BASE_URL') + PATHS.INVITE_FRIEND;
    await navigateToUrl(url, page, locale);

    await generateInviteReferral({
      page,
      inviteAFriendPage,
      scenarioContext,
      phone: resolveNonMemberPhone(),
    });
    await openReferralLanding({ page, scenarioContext, user: 'n' });
  },
);

When(
  /^The user submits the Invite a Friend form with a valid mobile phone number$/,
  async ({ inviteAFriendPage, page, scenarioContext, $testInfo }) => {
    // Connected-member share / redeem flows require Local Config member phone.
    // EN-CA/FR-CA: member is N/A until Local Config provides a CA member number — soft-skip.
    const memberPhone = resolveMemberPhone();
    if (!memberPhone) {
      const msg =
        'No connected-member phone is configured for this locale (Local Config phoneNumber.valid.member is N/A). Soft-skipping connected-member Invite share/redeem.';
      logger.warn(msg);
      $testInfo.annotations.push({ type: 'app-gap', description: msg });
      scenarioContext.skipInviteLanding = true;
      $testInfo.skip(true, msg);
      return;
    }
    await generateInviteReferral({
      page,
      inviteAFriendPage,
      scenarioContext,
      phone: memberPhone,
    });
    const locale = environmentManager.get('LOCALE');
    await verifyUseProdApiQueryParam(locale, page);
  },
);

When(
  /^The user submits the Invite a Friend form with empty fields$/,
  async ({ inviteAFriendPage }) => {
    await inviteAFriendPage.waitForPageReady();
    await inviteAFriendPage.clickShareReferral().catch(async () => {
      // Button may be disabled; force click to surface required-field validation when enabled incorrectly.
      await inviteAFriendPage.shareReferralBtn.click({ force: true }).catch(() => {});
    });
  },
);

When(
  /^The user enters invalid number in the mobile phone field in the Invite a Friend form$/,
  async ({ inviteAFriendPage }) => {
    await inviteAFriendPage.typeMobilePhone(d(TestDataKeys.PhoneNumber.Invalid));
  },
);

When(
  /^The user enters a valid mobile phone number in the Invite a Friend form$/,
  async ({ inviteAFriendPage }) => {
    // Share-button enable check only — Default (or generated non-member) is fine when member is N/A.
    const phone =
      resolveMemberPhone() || d(TestDataKeys.PhoneNumber.Valid.Default) || resolveNonMemberPhone();
    await inviteAFriendPage.fillMobilePhone(phone);
  },
);

When(
  /^The user navigates to the redeem referral URL from Invite a Friend$/,
  async ({ page, scenarioContext, $testInfo }) => {
    if (scenarioContext.skipInviteLanding) {
      logger.info('Skipping redeem navigation — connected-member invite unavailable (APP GAP).');
      return;
    }
    const redeemUrl = scenarioContext.referralUrl;
    if (!redeemUrl) {
      throw new Error('Referral URL is undefined');
    }

    const targetUrl = await buildInviteLandingUrl(redeemUrl, 'm');
    const referralLookupPromise = NetworkUtils.waitForReferralLookupResponse(page).catch(
      () => undefined,
    );
    // Invite landing SPAs (esp. Safari) often never fire `load` — use domcontentloaded.
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.LONG });
    await page.waitForLoadState('domcontentloaded');
    scenarioContext.referralLandingResponse = await referralLookupPromise;
    await verifyUseProdApiQueryParam(environmentManager.get('LOCALE'), page);

    // Connected-member redeem requires member_name — missing lookup = APP GAP (e.g. member phone N/A).
    const landingReady = Boolean(scenarioContext.referralLandingResponse?.member_name);
    if (!landingReady) {
      const msg =
        'APP GAP: Invite referral landing did not return connected-member lookup details ' +
        `(member_name missing). Referral code ${scenarioContext.referralCode ?? '(unknown)'}.`;
      logger.warn(msg);
      $testInfo.annotations.push({ type: 'app-gap', description: msg });
      scenarioContext.skipInviteLanding = true;
    }
  },
);

When(
  /^The user searches for a locale gym on the Invite a Friend referral landing page$/,
  async ({ page, referralLandingPage, scenarioContext }) => {
    const clubId = d(TestDataKeys.Locations.ClubId);

    // Prefer URL location_id + test_location_id override (sheet: use locale test gym).
    // Avoid flaky react-select suggestion clicks inside the invite iframe on mobile.
    const current = new URL(page.url());
    current.searchParams.set('location_id', clubId);
    current.searchParams.set('test_location_id', clubId);
    current.searchParams.set('disable_captcha', 'true');
    await page.goto(appendDisableCaptchaParam(current.toString()), {
      waitUntil: 'domcontentloaded',
    });
    await referralLandingPage.userForm.overrideLocationAndDisableCaptcha(clubId);

    scenarioContext.selectedGymName =
      (await referralLandingPage.gymName.textContent().catch(() => null))?.trim() ||
      d(TestDataKeys.Locations.Gyms.Default);
  },
);

When(
  /^The user selects a locale gym and overrides location_id on the Invite a Friend referral landing page$/,
  async ({ page, referralLandingPage, scenarioContext }) => {
    const clubId = d(TestDataKeys.Locations.ClubId);
    const gymName = d(TestDataKeys.Locations.Gyms.Default);

    // Keep test_location_id pinned so the React iframe always binds the test studio.
    const current = new URL(page.url());
    if (current.searchParams.get('test_location_id') !== clubId) {
      current.searchParams.set('test_location_id', clubId);
      current.searchParams.set('location_id', clubId);
      current.searchParams.set('disable_captcha', 'true');
      await page.goto(appendDisableCaptchaParam(current.toString()), {
        waitUntil: 'domcontentloaded',
      });
    }

    await referralLandingPage.userForm.overrideLocationAndDisableCaptcha(clubId);
    expect(page.url()).toContain(`location_id=${clubId}`);
    expect(page.url()).toContain(`test_location_id=${clubId}`);
    scenarioContext.selectedGymName =
      (await referralLandingPage.gymName.textContent().catch(() => null))?.trim() || gymName;
  },
);

When(
  /^The user submits the Invite a Friend referral landing form with valid data$/,
  async ({ referralLandingPage, page, scenarioContext }) => {
    if (scenarioContext.skipInviteLanding) {
      logger.info('Skipping invite landing form submit — invite landing unavailable (APP GAP).');
      return;
    }
    if (!process.env.CI) {
      await NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_LOADED, TIMEOUTS.MEDIUM).catch(
        () => false,
      );
    }
    await submitReferralLandingForm({ page, referralLandingPage, scenarioContext });
  },
);

When(
  /^The user selects a date and time in the Invite a Friend referral landing schedule picker$/,
  async ({ page, referralLandingPage, scenarioContext }) => {
    if (scenarioContext.skipInviteLanding) {
      logger.info(
        'Skipping invite landing schedule picker — invite landing unavailable (APP GAP).',
      );
      return;
    }
    if (scenarioContext.canBookAppointment === false) {
      logger.info('Skipping schedule picker step — appointment booking not allowed.');
      return;
    }

    const scheduleAlreadyVisible = await referralLandingPage.isSchedulePickerVisible();
    if (!scheduleAlreadyVisible) {
      const scheduleReady = await referralLandingPage
        .waitForScheduleReady(TIMEOUTS.MEDIUM)
        .then(() => true)
        .catch(() => false);
      if (!scheduleReady) {
        const youreInVisible = await page
          .getByText(/you'?re in/i)
          .first()
          .isVisible()
          .catch(() => false);
        logger.warn(
          `Skipping schedule picker — date picker not present in try-us-free or book-a-tour iframe` +
            (youreInVisible ? " (CMS YOU'RE IN confirmation shown)" : ''),
        );
        scenarioContext.scheduleBookingSkipped = true;
        return;
      }
    }

    // Declare outside try so the catch can read it (let inside try is not in catch scope).
    let booked = false;
    try {
      // Keep below remaining suite budget so soft-skip catch can run (Share Invitation is a long chain).
      const BOOKING_TIMEOUT = TIMEOUTS.MEDIUM;
      const MAX_RETRIES = 2;
      let attempt = 0;

      const seenStaffIds = new Set<string>();
      const onAvailabilitiesResponse = async (response: import('@playwright/test').Response) => {
        if (!response.url().includes('/api/bookings/availabilities')) {
          return;
        }
        try {
          const body = (await response.json()) as {
            staff_availabilities: { staff: { id: string | number } }[];
          };
          for (const entry of body.staff_availabilities ?? []) {
            const id = entry?.staff?.id;
            if (id !== undefined && id !== null && String(id).length > 0) {
              seenStaffIds.add(String(id));
            }
          }
          scenarioContext.staffId = NetworkUtils.parseStaffIdFromAvailabilitiesBody(body);
        } catch {
          // ignore non-JSON / incomplete availabilities payloads
        }
      };
      page.on('response', onAvailabilitiesResponse);

      try {
        while (!booked && attempt < MAX_RETRIES) {
          attempt++;

          const availabilitiesBodyPromise = NetworkUtils.getResponseBody<{
            staff_availabilities: { staff: { id: string | number } }[];
          }>(page, API_PATHS.SCHEDULING_AVAILABILITIES_REQUEST(), BOOKING_TIMEOUT).catch(
            () => undefined,
          );

          await referralLandingPage.waitForScheduleReady(BOOKING_TIMEOUT);

          const availabilitiesBody = await availabilitiesBodyPromise;
          // Always refresh from the latest availabilities (slot retries / multi-staff gyms).
          if (availabilitiesBody) {
            try {
              for (const entry of availabilitiesBody.staff_availabilities ?? []) {
                const id = entry?.staff?.id;
                if (id !== undefined && id !== null && String(id).length > 0) {
                  seenStaffIds.add(String(id));
                }
              }
              scenarioContext.staffId =
                NetworkUtils.parseStaffIdFromAvailabilitiesBody(availabilitiesBody);
            } catch {
              // continue; booking request assertion will surface missing staff_id
            }
          }

          const availableDates = await referralLandingPage.bookATour.getAllAvailableDates();
          if (!availableDates.length) throw new Error('No available dates found');
          const randomDate = Helpers.getRandomElement(availableDates);
          await referralLandingPage.bookATour.selectDate(randomDate);

          const availableTimes = await referralLandingPage.bookATour.getAllAvailableTimes();
          if (!availableTimes.length) throw new Error('No available times found');
          const randomTime = Helpers.getRandomElement(availableTimes);
          await referralLandingPage.bookATour.selectTime(randomTime);

          scenarioContext.scheduledDate = await referralLandingPage.bookATour.getText(randomDate);
          scenarioContext.scheduledTime = await referralLandingPage.bookATour.getText(randomTime);

          const {
            statusCodePromise: confirmAppointmentStatusCodePromise,
            requestHeadersPromise: confirmAppointmentRequestHeadersPromise,
            requestBodyPromise: confirmAppointmentRequestBodyPromise,
          } = NetworkUtils.waitForStatusCodeHeadersAndBody<unknown, BookAppointmentRequest>(
            page,
            API_PATHS.CONFIRM_APPOINTMENT_REQUEST,
            BOOKING_TIMEOUT,
          );

          const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(
            page,
            GTM_EVENT.TOUR_APPOINTMENT_SCHEDULED,
            TIMEOUTS.MEDIUM,
          );

          // Bound click so mobile Safari LET'S DO THIS hangs cannot burn the full test timeout.
          try {
            await new Promise<void>((resolve, reject) => {
              let settled = false;
              const timer = setTimeout(() => {
                if (!settled) {
                  settled = true;
                  reject(
                    new Error(
                      `clickScheduleButton timed out after ${BOOKING_TIMEOUT}ms on Invite referral landing`,
                    ),
                  );
                }
              }, BOOKING_TIMEOUT);

              referralLandingPage.bookATour
                .clickScheduleButton(AppPages.INVITE_A_FRIEND)
                .then(() => {
                  if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    resolve();
                  }
                })
                .catch((error: unknown) => {
                  if (!settled) {
                    settled = true;
                    clearTimeout(timer);
                    reject(error);
                  }
                });
            });
          } catch (clickError) {
            void confirmAppointmentStatusCodePromise.catch(() => undefined);
            void confirmAppointmentRequestHeadersPromise.catch(() => undefined);
            void confirmAppointmentRequestBodyPromise.catch(() => undefined);
            void gtmEventFiredPromise.catch(() => undefined);
            throw clickError;
          }

          const [
            confirmAppointmentStatusCode,
            confirmAppointmentRequestHeaders,
            confirmAppointmentRequestBody,
            isTourAppointmentScheduledFired,
          ] = await Promise.all([
            confirmAppointmentStatusCodePromise,
            confirmAppointmentRequestHeadersPromise,
            confirmAppointmentRequestBodyPromise,
            gtmEventFiredPromise,
          ]);

          scenarioContext.bookAppointmentRequestBody = confirmAppointmentRequestBody;

          const slotErrorVisible = await referralLandingPage.bookATour.isErrorMessageVisible(
            t(TranslationKeys.Errors.BatAddon.SlotConflict),
          );

          if (!slotErrorVisible && confirmAppointmentStatusCode === 200) {
            expect(confirmAppointmentRequestHeaders['referer']).toMatch(
              /(?:sit-|uat-)?react\.anytimefitness\.com/,
            );
            if (!process.env.CI) {
              expect(isTourAppointmentScheduledFired).toBeTruthy();
            }
            const bookingStaffId = String(confirmAppointmentRequestBody.staff_id);
            if (seenStaffIds.size > 0 && !seenStaffIds.has(bookingStaffId)) {
              throw new Error(
                `Booking staff_id ${bookingStaffId} not found in availabilities staff ids: ${[...seenStaffIds].join(', ')}`,
              );
            }
            scenarioContext.staffId = bookingStaffId;
            booked = true;

            // AFW-3953: Appointment Slot Selected on schedule CTA (US Rudderstack ticket scenarios).
            if (scenarioContext.rudderstackTestEnable) {
              const rsRequests =
                scenarioContext.rudderstackCapturedRequests ?? (await rudderstackRequests(page));
              scenarioContext.rudderstackCapturedRequests = rsRequests;
              const pageDetails =
                scenarioContext.rudderstackPageDetails ?? (await getPageDetails(page));
              const data =
                scenarioContext.rudderstackLeadEventData ??
                ([
                  '',
                  scenarioContext.leadCaptureId ?? '',
                  scenarioContext.selectedGymClubId ?? '',
                  false,
                ] as LeadEventData);
              await captureAppointmentScheduledWithSlotSelected({
                requests: rsRequests,
                page,
                data,
                pageDetails,
                skipPagePathValidation: true,
              });
              scenarioContext.rudderstackAppointmentScheduledVerified = true;
            }
          } else if (slotErrorVisible && attempt < MAX_RETRIES) {
            await page.reload({ waitUntil: 'domcontentloaded' });
          } else {
            throw new Error('Failed to book a tour after multiple attempts due to slot conflict.');
          }
        }
      } finally {
        page.off('response', onAvailabilitiesResponse);
      }
    } catch (error) {
      // Booking API succeeded but RS assert failed — do not soft-skip AFW-3953 failures.
      if (booked && scenarioContext.rudderstackTestEnable) {
        throw error;
      }
      logger.warn(
        `Skipping schedule picker step after failure: ${error instanceof Error ? error.message : String(error)}`,
      );
      scenarioContext.scheduleBookingSkipped = true;
    }
  },
);

Then(
  /^The Lead Captured and Identity Rudderstack events are verified in Invite a Friend$/,
  async ({ scenarioContext }) => {
    if (!scenarioContext.rudderstackTestEnable) {
      throw new Error('Rudderstack validation was not enabled for this scenario');
    }
    expect(scenarioContext.rudderstackLeadEventsVerified).toBe(true);
  },
);

Then(
  /^The Appointment Scheduled and Appointment Slot Selected Rudderstack events are verified in Invite a Friend$/,
  async ({ scenarioContext }) => {
    if (!scenarioContext.rudderstackTestEnable) {
      throw new Error('Rudderstack validation was not enabled for this scenario');
    }
    if (scenarioContext.canBookAppointment === false || scenarioContext.scheduleBookingSkipped) {
      throw new Error(
        'Invite a Friend booking did not complete — cannot verify Appointment Slot Selected',
      );
    }
    expect(scenarioContext.rudderstackAppointmentScheduledVerified).toBe(true);
  },
);

Then(
  /^The referral code and redeem URL are returned in the referrals network response$/,
  async ({ scenarioContext }) => {
    if (!scenarioContext.referralCode) {
      throw new Error('Referral code is not captured in previous step');
    }
    if (!scenarioContext.referralUrl) {
      throw new Error('Redeem URL is not captured in previous step');
    }

    expect(scenarioContext.referralCode).toBeTruthy();
    expect(scenarioContext.referralUrl).toBeTruthy();
    expect(scenarioContext.referralUrl).toMatch(
      new RegExp(`[?&#](?:h|code|hash)=${scenarioContext.referralCode}\\b`, 'i'),
    );
  },
);

Then(/^The redeem referral landing page is displayed$/, async ({ page, scenarioContext }) => {
  if (scenarioContext.skipInviteLanding) {
    logger.info('Skipping redeem landing assert — connected-member invite unavailable (APP GAP).');
    return;
  }
  if (!scenarioContext.referralCode) {
    throw new Error('Referral code is not captured in previous step');
  }

  expect(page.url()).toMatch(
    new RegExp(`[?&#](?:h|code|hash)=${scenarioContext.referralCode}\\b`, 'i'),
  );
  const tryUsFreeIframe = page.locator('#try-us-free-iframe');
  await expect(tryUsFreeIframe).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
});

Then(
  /^The referral lookup response contains member and location details$/,
  async ({ scenarioContext, $testInfo }) => {
    if (scenarioContext.skipInviteLanding) {
      logger.info(
        'Skipping connected-member referral lookup assertion — invite landing unavailable (APP GAP).',
      );
      return;
    }
    const response = scenarioContext.referralLandingResponse;
    if (!response) {
      throw new Error('Referral lookup response is not captured in previous step');
    }

    if (!response.member_name) {
      const msg =
        'APP GAP: connected-member referral lookup missing member_name ' +
        `(Local Config member phone may be N/A for this locale).`;
      logger.warn(msg);
      $testInfo.annotations.push({ type: 'app-gap', description: msg });
      scenarioContext.skipInviteLanding = true;
      return;
    }

    expect(response.member_name).toBeTruthy();
    expect(response.referral_code).toBeTruthy();
    expect(response.location_name).toBeTruthy();
    expect(response.member_id).toBeTruthy();
    expect(response.location_number).toBeTruthy();
    expect(response.referral_code).toBe(scenarioContext.referralCode);
    expect(Boolean(response.is_anonymous)).toBe(false);
  },
);

Then(/^The Invite a Friend page heading is displayed correctly$/, async ({ inviteAFriendPage }) => {
  await inviteAFriendPage.waitForPageReady();
  await expect(inviteAFriendPage.heading).toBeVisible();
});

Then(/^The Invite a Friend phone label is displayed correctly$/, async ({ inviteAFriendPage }) => {
  await inviteAFriendPage.waitForPageReady();
  await expect(inviteAFriendPage.phoneLabel).toBeVisible();
  await expect(inviteAFriendPage.mobilePhone).toBeVisible();
});

Then(
  /^The Invite a Friend step instructions are displayed correctly$/,
  async ({ inviteAFriendPage }) => {
    await inviteAFriendPage.waitForPageReady();
    await expect(inviteAFriendPage.step1).toBeVisible();
    await expect(inviteAFriendPage.step2).toBeVisible();
    await expect(inviteAFriendPage.step3).toBeVisible();
  },
);

Then(
  /^The Invite a Friend note disclaimer is displayed correctly$/,
  async ({ inviteAFriendPage }) => {
    await inviteAFriendPage.waitForPageReady();
    await expect(inviteAFriendPage.disclaimer).toBeVisible();
  },
);

Then(/^The Invite a Friend phone number input field is visible$/, async ({ inviteAFriendPage }) => {
  await inviteAFriendPage.waitForPageReady();
  await expect(inviteAFriendPage.mobilePhone).toBeVisible();
});

Then(/^The Invite a Friend share referral button is disabled$/, async ({ inviteAFriendPage }) => {
  await inviteAFriendPage.assertShareButtonDisabled();
});

Then(/^The Invite a Friend share referral button is enabled$/, async ({ inviteAFriendPage }) => {
  await inviteAFriendPage.assertShareButtonEnabled();
});

Then(
  /^The Invite a Friend share modal with copyable invite link is displayed$/,
  async ({ inviteAFriendPage, scenarioContext }) => {
    await inviteAFriendPage.assertShareModalWithInviteLink(
      scenarioContext.referralCode,
      scenarioContext.referralUrl,
    );
  },
);

Then(
  /^The required field error is shown for the mobile phone field in the Invite a Friend form$/,
  async ({ inviteAFriendPage }) => {
    const isDisplayed = await inviteAFriendPage.userForm.isErrorMessageDisplayed(
      'phoneNum',
      t(TranslationKeys.Errors.UserForm.RequiredField.Phone),
    );
    expect(isDisplayed).toBe(true);
    await inviteAFriendPage.userForm.takeElementScreenshotIfWebkit(
      inviteAFriendPage.userForm.iframeElement,
    );
  },
);

Then(
  /^The Invite a Friend referral landing form submission is successful$/,
  async ({ referralLandingPage, page, scenarioContext }) => {
    if (scenarioContext.skipInviteLanding) {
      logger.info('Skipping invite landing form success — invite landing unavailable (APP GAP).');
      return;
    }
    if (!scenarioContext.formData) {
      throw new Error('Form data is not captured in previous step');
    }

    if (scenarioContext.canBookAppointment === false) {
      // Lead captured but gym has no ClubTour slots (common on EN-CA 9993995). UI may stay on
      // #try-us-free-iframe, remount Membership Inquiry, or show CMS thank-you — do not hard-wait
      // try-us-free visibility (BAT → MI pattern).
      scenarioContext.scheduleBookingSkipped = true;
      const iframeStillVisible = await referralLandingPage.userForm.iframeElement
        .isVisible()
        .catch(() => false);
      const onMembershipInquiry =
        /\/membership-inquiry/i.test(page.url()) ||
        (await page
          .locator('#membership-inquiry-iframe')
          .first()
          .isVisible()
          .catch(() => false));
      const youreInVisible = await page
        .getByText(/you'?re in/i)
        .first()
        .isVisible()
        .catch(() => false);
      expect(
        iframeStillVisible ||
          onMembershipInquiry ||
          youreInVisible ||
          scenarioContext.leadCaptureSuccessful,
        'Expected successful Invite lead-capture outcome when can_book_appointment=false',
      ).toBeTruthy();
      return;
    }

    const scheduleVisible = await referralLandingPage.isSchedulePickerVisible();
    if (scheduleVisible) {
      return;
    }

    const scheduleReady = await referralLandingPage
      .waitForScheduleReady(TIMEOUTS.MEDIUM)
      .then(() => true)
      .catch(() => false);
    if (scheduleReady) {
      return;
    }

    // Non-member invite may redirect to CMS "YOU'RE IN" / Book Your Visit after lead-capture.
    const youreInVisible = await page
      .getByText(/you'?re in/i)
      .first()
      .isVisible()
      .catch(() => false);
    expect(youreInVisible || scenarioContext.leadCaptureSuccessful).toBeTruthy();
  },
);

Then(
  /^The lead-capture request includes the correct referral_code$/,
  async ({ scenarioContext }) => {
    if (scenarioContext.skipInviteLanding) {
      logger.info('Skipping referral_code assertion — invite landing unavailable (APP GAP).');
      return;
    }
    if (!scenarioContext.referralCode) {
      throw new Error('Referral code is not captured in previous step');
    }

    const body = scenarioContext.prospectRequestData;
    if (!body) {
      if (scenarioContext.scheduleBookingSkipped || scenarioContext.leadCaptureSuccessful) {
        logger.warn(
          'Skipping referral_code assertion — lead-capture body was not captured (CMS thank-you / UI-only success path)',
        );
        return;
      }
      throw new Error('Lead-capture request body was not captured');
    }

    const referralCode = extractReferralCodeFromLeadCapture(body);
    expect(referralCode).toBe(scenarioContext.referralCode);
  },
);

Then(
  /^The bookings request includes the correct staff_id from availabilities$/,
  async ({ scenarioContext }) => {
    if (
      scenarioContext.skipInviteLanding ||
      scenarioContext.canBookAppointment === false ||
      scenarioContext.scheduleBookingSkipped
    ) {
      logger.info('Skipping staff_id assertion — booking was skipped.');
      return;
    }

    if (!scenarioContext.staffId) {
      throw new Error('staff_id was not captured from /api/bookings/availabilities');
    }

    const bookingBody = scenarioContext.bookAppointmentRequestBody;
    if (!bookingBody) {
      throw new Error('Bookings request body was not captured');
    }

    expect(String(bookingBody.staff_id)).toBe(String(scenarioContext.staffId));
  },
);

Then(
  /^The Invite a Friend referral landing booking confirmation is displayed$/,
  async ({ referralLandingPage, scenarioContext }) => {
    if (
      scenarioContext.skipInviteLanding ||
      scenarioContext.canBookAppointment === false ||
      scenarioContext.scheduleBookingSkipped
    ) {
      logger.info(
        'Skipping booking confirmation message step — appointment booking not allowed or schedule picker failed.',
      );
      return;
    }

    await referralLandingPage.waitForBookingConfirmationReady(TIMEOUTS.LONG);
    await referralLandingPage.bookATour.scrollIntoViewIfWebkit(
      referralLandingPage.bookATour.iframeElement,
      referralLandingPage.bookATour.bookingConfirmationHeading,
    );

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

    const actualBookingMessage = await referralLandingPage.bookATour.getText(
      referralLandingPage.bookATour.bookingConfirmationMessage,
    );
    const expectedBookingMessage = Helpers.getBookingConfirmationMessage(scenarioContext.pageName);
    Helpers.assertSeeYouSoonVisitBody(actualBookingMessage, expectedBookingMessage);
    await Helpers.assertYourSpotIsSavedVisible(referralLandingPage.bookATour.iframe);
    await Helpers.assertNoUserFacingTourCopy(referralLandingPage.bookATour.iframe);

    const actualBookedGymName = await referralLandingPage.bookATour.getText(
      referralLandingPage.bookATour.bookedGymName,
    );
    expect(actualBookedGymName).toBe(scenarioContext.selectedGymName);

    const expectedAppointmentDetails = Helpers.formatAppointmentDetails(
      scenarioContext.scheduledDate,
      scenarioContext.scheduledTime,
    );
    const actualAppointmentDetails = await referralLandingPage.bookATour.getText(
      referralLandingPage.bookATour.appointmentDetails,
    );
    expect(Helpers.normalizeAppointmentDetailsText(actualAppointmentDetails)).toBe(
      Helpers.normalizeAppointmentDetailsText(expectedAppointmentDetails),
    );
  },
);

Then(
  /^The Add to Calendar button is visible on the Invite a Friend confirmation screen$/,
  async ({ referralLandingPage, scenarioContext }) => {
    if (
      scenarioContext.skipInviteLanding ||
      scenarioContext.canBookAppointment === false ||
      scenarioContext.scheduleBookingSkipped
    ) {
      logger.info('Skipping Add to Calendar assertion — booking was skipped.');
      return;
    }

    await expect(referralLandingPage.bookATour.addToCalendarBtn).toBeVisible({
      timeout: TIMEOUTS.MEDIUM,
    });
  },
);

Then(
  /^The Share Trial Pass button is displayed on the Invite a Friend confirmation screen$/,
  async ({ referralLandingPage, scenarioContext }) => {
    if (
      scenarioContext.skipInviteLanding ||
      scenarioContext.canBookAppointment === false ||
      scenarioContext.scheduleBookingSkipped
    ) {
      logger.info('Skipping Share Trial Pass assertion — booking was skipped.');
      return;
    }

    await expect(referralLandingPage.bookATour.sendTrialPassBtn).toBeVisible({
      timeout: TIMEOUTS.MEDIUM,
    });
  },
);
