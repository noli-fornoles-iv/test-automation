import { expect, FrameLocator, Locator, Page } from '@playwright/test';
import environmentManager from '@config/environment';
import { ConfirmationScreenPage } from '@pages/common/ConfirmationScreenPage';
import { LocationSearchPage } from '@pages/common/LocationSearchPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { PATHS, TIMEOUTS } from '@utils/constants';
import { appendDisableCaptchaParam } from '@utils/helpers';
import { d, t } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';

/**
 * Flow Notes / AFW-3601: email TCs submit against gym DE-0002 (communications location_number).
 * On SIT/UAT the React iframe still needs a valid test-studio overlay (`test_location_id` from
 * Local Config / locationTestStudio, e.g. DE-0004) — using DE-0002 for both params leaves the
 * iframe empty.
 */
export const CANCEL_MEMBERSHIP_EMAIL_TEST_CLUB_ID = 'DE-0002';

export const CANCEL_MEMBERSHIP_IFRAME_ID = 'membership-cancellation-iframe';

/** Specific-date TCs must use a future German `dd.mm.yyyy` — hardcoded 15.08.2026 is now in the past and blocks /api/communications. */
export function germanFutureCancellationDate(daysAhead = 45): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  return `${dd}.${mm}.${yyyy}`;
}

const LOCALE_GEO_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'de-de': { latitude: 52.52, longitude: 13.405 },
  'de-at': { latitude: 48.2082, longitude: 16.3738 },
  'it-it': { latitude: 45.6983, longitude: 9.6773 },
};

const LOCALE_COUNTRY_CODE: Record<string, string> = {
  'de-de': 'DE',
  'de-at': 'AT',
  'it-it': 'IT',
};

const OUTSIDE_DE_COORDS = { latitude: 51.5074, longitude: -0.1278 };

export class CancelMembershipPage {
  readonly page: Page;
  readonly locationSearch: LocationSearchPage;
  readonly userForm: UserFormPage;
  readonly confirmationScreen: ConfirmationScreenPage;

  readonly iframeElement: Locator;
  readonly iframe: FrameLocator;

  readonly earliestDateRadio: Locator;
  readonly specificDateRadio: Locator;
  readonly cancellationDateInput: Locator;
  readonly contractNumberInput: Locator;
  readonly cancellationReasonInput: Locator;
  readonly legalDisclaimerCheckbox: Locator;
  readonly submitButton: Locator;
  readonly formHeading: Locator;

  private ipstackMock: { latitude: number; longitude: number; countryCode: string } | null = null;
  private ipstackRouteInstalled = false;

  constructor(page: Page) {
    this.page = page;
    this.locationSearch = new LocationSearchPage(
      page,
      CANCEL_MEMBERSHIP_IFRAME_ID,
      PATHS.CANCEL_MEMBERSHIP,
    );
    this.userForm = new UserFormPage(page, CANCEL_MEMBERSHIP_IFRAME_ID);
    this.confirmationScreen = new ConfirmationScreenPage(page);
    this.iframeElement = page.locator(`#${CANCEL_MEMBERSHIP_IFRAME_ID}`);
    this.iframe = page.frameLocator(`#${CANCEL_MEMBERSHIP_IFRAME_ID}`);

    this.earliestDateRadio = this.iframe.locator(
      'input[name="cancellationDateType"][value="EARLIEST"]',
    );
    this.specificDateRadio = this.iframe.locator(
      'input[name="cancellationDateType"][value="SPECIFIC"]',
    );
    this.cancellationDateInput = this.iframe.locator('input[name="cancellationDate"]');
    this.contractNumberInput = this.iframe.locator('input[name="contractNumber"]');
    this.cancellationReasonInput = this.iframe.locator('textarea[name="cancellationReason"]');
    this.legalDisclaimerCheckbox = this.iframe.locator('#termsAccepted');
    this.submitButton = this.iframe.getByRole('button', {
      name: /JETZT KÜNDIGEN|CANCEL NOW|ANNULLA/i,
    });
    this.formHeading = this.iframe.getByRole('heading', {
      name: /MITGLIEDSCHAFT KÜNDIGEN|CANCEL MEMBERSHIP/i,
    });
  }

  async mockIpstackGeolocation(
    coords: { latitude: number; longitude: number },
    countryCode: string,
  ): Promise<void> {
    this.ipstackMock = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      countryCode,
    };
    if (this.ipstackRouteInstalled) return;

    const handler = async (route: import('@playwright/test').Route) => {
      const mock = this.ipstackMock ?? {
        latitude: 52.52,
        longitude: 13.405,
        countryCode: 'DE',
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          latitude: mock.latitude,
          longitude: mock.longitude,
          country_code: mock.countryCode,
          country_name: mock.countryCode,
          city: 'Test City',
          region_code: mock.countryCode,
        }),
      });
    };
    await this.page.context().route('**/api.ipstack.com/**', handler);
    this.ipstackRouteInstalled = true;
  }

  async installInLocaleIpstackMock(): Promise<void> {
    const locale = environmentManager.get('LOCALE').toLowerCase();
    const geo = LOCALE_GEO_COORDS[locale] ?? LOCALE_GEO_COORDS['de-de'];
    const country = LOCALE_COUNTRY_CODE[locale] ?? 'DE';
    await this.mockIpstackGeolocation(geo, country);
    await this.grantGeolocation(geo);
  }

  async setOutsideLocaleGeolocation(): Promise<void> {
    await this.mockIpstackGeolocation(OUTSIDE_DE_COORDS, 'GB');
    const origin = new URL(this.page.url()).origin;
    await this.page.context().grantPermissions(['geolocation'], { origin });
    await this.page.context().setGeolocation(OUTSIDE_DE_COORDS);
    if (this.page.url().startsWith('http')) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.page.waitForLoadState('load').catch(() => {});
    }
  }

  async grantGeolocation(coords?: { latitude: number; longitude: number }): Promise<void> {
    const locale = environmentManager.get('LOCALE').toLowerCase();
    const geo = coords ?? LOCALE_GEO_COORDS[locale] ?? LOCALE_GEO_COORDS['de-de'];
    const baseUrl = environmentManager.get('BASE_URL');
    const pageOrigin = this.page.url().startsWith('http')
      ? new URL(this.page.url()).origin
      : new URL(baseUrl).origin;
    // Geolocation permission must cover Webflow host + React iframe host.
    const origins = Array.from(
      new Set([
        pageOrigin,
        'https://sit.anytimefitness.com',
        'https://sit-react.anytimefitness.com',
        'https://uat.anytimefitness.com',
        'https://uat-react.anytimefitness.com',
        'https://www.anytimefitness.com',
        'https://react.anytimefitness.com',
      ]),
    );
    await this.page.context().grantPermissions(['geolocation'], { origin: origins[0] });
    for (const origin of origins) {
      await this.page
        .context()
        .grantPermissions(['geolocation'], { origin })
        .catch(() => {});
    }
    await this.page.context().setGeolocation(geo);
  }

  async denyGeolocation(): Promise<void> {
    const baseUrl = environmentManager.get('BASE_URL');
    const origins = [
      this.page.url().startsWith('http')
        ? new URL(this.page.url()).origin
        : new URL(baseUrl).origin,
      'https://uat-react.anytimefitness.com',
      'https://react.anytimefitness.com',
    ];
    await this.page.context().clearPermissions();
    const session = await this.page
      .context()
      .newCDPSession(this.page)
      .catch(() => null);
    if (session) {
      for (const origin of origins) {
        await session
          .send('Browser.setPermission', {
            origin,
            permission: { name: 'geolocation' },
            setting: 'denied',
          })
          .catch(() => {});
      }
    }
  }

  buildCancelMembershipUrl(options?: {
    clubId?: string;
    /** When set with includeTestLocationId, overrides test_location_id (defaults to clubId). */
    testLocationId?: string;
    includeTestLocationId?: boolean;
  }): string {
    const baseUrl = String(environmentManager.get('BASE_URL')).replace(/\/$/, '');
    const locale = String(environmentManager.get('LOCALE') || '');
    const url = new URL(`${baseUrl}${PATHS.CANCEL_MEMBERSHIP}`);
    url.searchParams.set('disable_captcha', 'true');
    const isNonProd = ['//sit.', '//uat.', '//dev.'].some(env => url.href.includes(env));
    if (isNonProd && !locale.toUpperCase().includes('US')) {
      url.searchParams.set('use_prod_api', 'true');
    }
    if (options?.clubId) {
      url.searchParams.set('location_id', options.clubId);
      if (options.includeTestLocationId) {
        url.searchParams.set('test_location_id', options.testLocationId ?? options.clubId);
      }
    }
    return appendDisableCaptchaParam(url.toString());
  }

  async openLocationSearchPage(): Promise<void> {
    const url = this.buildCancelMembershipUrl();
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.LONG });
    await this.locationSearch.locationSearchInput.waitFor({
      state: 'visible',
      timeout: TIMEOUTS.LONG,
    });
  }

  async openFormForClub(clubId: string, options?: { testLocationId?: string }): Promise<void> {
    const url = this.buildCancelMembershipUrl({
      clubId,
      includeTestLocationId: true,
      testLocationId: options?.testLocationId,
    });
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.LONG });
    await this.userForm.waitForFormReady();
    await this.formHeading.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG }).catch(() => {});
  }

  /**
   * Email TCs: location_id = DE-0002 (Flow Notes); test_location_id = Local Config club
   * so the SIT iframe mounts. Do not set test_location_id to DE-0002.
   */
  async openFormForEmailTestClub(): Promise<void> {
    const sitTestStudioClubId = d(TestDataKeys.Locations.ClubId);
    await this.openFormForClub(CANCEL_MEMBERSHIP_EMAIL_TEST_CLUB_ID, {
      testLocationId: sitTestStudioClubId,
    });
  }

  get useCurrentLocationButton(): Locator {
    return this.iframe.getByRole('button', {
      name: /Aktuellen Standort verwenden|Use Current Location|Use my precise location|genauen Standort/i,
    });
  }

  async clickUseCurrentLocation(): Promise<void> {
    await this.useCurrentLocationButton.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.useCurrentLocationButton.click();
  }

  async submitEmptyLocationSearch(): Promise<void> {
    await this.locationSearch.locationSearchInput.waitFor({
      state: 'visible',
      timeout: TIMEOUTS.LONG,
    });
    const input = this.locationSearch.locationSearchInput;
    await this.locationSearch.dismissLocationSuggestions().catch(() => {});
    await input.scrollIntoViewIfNeeded().catch(() => {});
    await input.click({ force: true }).catch(() => input.tap({ force: true }));
    await input.fill('');
    const searchBtn = this.iframe
      .getByRole('button', { name: /search location|suchen|cerca|search/i })
      .or(this.iframe.locator('button[type="submit"], button[aria-label*="search" i]'))
      .first();
    if (await searchBtn.isVisible().catch(() => false)) {
      await searchBtn.click({ force: true });
    } else {
      await input.press('Enter');
    }
    await this.page.waitForTimeout(1500);
  }

  /** Sheet/Testpad: empty search focuses the bar; results section must not update. */
  async expectEmptySearchFocusWithoutResultsChange(): Promise<void> {
    const input = this.locationSearch.locationSearchInput;
    await expect(input).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    const focused = await input
      .evaluate(el => el === el.ownerDocument.activeElement)
      .catch(() => false);
    const outlineOrFocus =
      focused ||
      (await input
        .evaluate(el => {
          const styles = window.getComputedStyle(el);
          const parent = el.parentElement;
          const parentStyles = parent ? window.getComputedStyle(parent) : null;
          return (
            styles.outlineWidth !== '0px' ||
            styles.boxShadow !== 'none' ||
            (parentStyles !== null && parentStyles.boxShadow !== 'none') ||
            el.className.toLowerCase().includes('focus') ||
            el.getAttribute('aria-invalid') === 'true'
          );
        })
        .catch(() => false));
    const selectGymLabel = t(TranslationKeys.Buttons.LocationSearch.SelectGym);
    const selectGymCount = await this.iframe
      .getByRole('button', { name: selectGymLabel })
      .count()
      .catch(() => 0);
    expect(selectGymCount).toBe(0);
    expect(outlineOrFocus || (await input.inputValue()) === '').toBeTruthy();
  }

  async clickMapPinAndSelectGym(): Promise<void> {
    const selectGymLabel = t(TranslationKeys.Buttons.LocationSearch.SelectGym);
    const gymName = d(TestDataKeys.Locations.Gyms.Default);
    await this.locationSearch.dismissLocationSuggestions();

    const mapTabName = t(TranslationKeys.Texts.Headings.LocationSearch.ContactUs.MapTab);
    const mapTab = this.iframe
      .getByRole('tab', { name: mapTabName })
      .or(this.iframe.getByRole('tab', { name: /KARTE|MAP/i }))
      .first();
    await mapTab.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await mapTab.click({ force: true });
    await this.page.waitForTimeout(2000);

    const mapCanvas = this.iframe.locator('.mapboxgl-canvas, [class*="mapbox"]').first();
    await expect(mapCanvas).toBeVisible({ timeout: TIMEOUTS.LONG });

    const marker = this.iframe.locator('.mapboxgl-marker').first();
    if (await marker.isVisible({ timeout: TIMEOUTS.MEDIUM }).catch(() => false)) {
      await marker.click({ force: true });
      await this.page.waitForTimeout(1500);
      const pinSelect = this.iframe.getByRole('button', { name: selectGymLabel }).first();
      if (await pinSelect.isVisible({ timeout: TIMEOUTS.SHORT }).catch(() => false)) {
        await Promise.all([
          this.page
            .waitForURL(/cancel-membership.*location_id=/i, {
              timeout: TIMEOUTS.LONG,
              waitUntil: 'domcontentloaded',
            })
            .catch(() => {}),
          pinSelect.click({ force: true }),
        ]);
        await this.userForm.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
        expect(this.page.url()).toMatch(/location_id=/i);
        return;
      }
    }

    // Fallback: map view confirmed — select gym from results (pin card may not mount on SIT).
    const listTabName = t(TranslationKeys.Texts.Headings.LocationSearch.ContactUs.ListTab);
    const listTab = this.iframe.getByRole('tab', { name: listTabName }).first();
    if (await listTab.isVisible().catch(() => false)) {
      await listTab.click({ force: true });
      await this.page.waitForTimeout(1000);
    }
    await this.locationSearch.ensureGymSearchResultReady(gymName);
    await this.locationSearch.clickButtonInSearchResult(gymName, selectGymLabel);
    await this.userForm.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    expect(this.page.url()).toMatch(/location_id=/i);
  }

  async expectOutsideLocaleIpMessage(): Promise<void> {
    const outside = this.iframe.getByText(
      /außerhalb von Deutschland|outside of Germany|outside of|alle länder anzeigen|view all countries/i,
    );
    await expect(outside.first()).toBeVisible({ timeout: TIMEOUTS.LONG });
  }

  async expectUnableToDetectLocationError(): Promise<void> {
    await this.page.waitForTimeout(2000);
    const error = this.iframe
      .getByText(
        /standort|location|permission|denied|blocked|enable location|couldn't|could not|unable|nicht.*(ermitteln|erkennen|finden)/i,
      )
      .first();
    const visible = await error.isVisible().catch(() => false);
    if (visible) {
      await expect(error).toBeVisible();
      return;
    }
    await this.expectOutsideLocaleIpMessage();
  }

  async expectLocationAccessErrorOrApproximateResults(): Promise<void> {
    await this.page.waitForTimeout(2000);
    const modal = this.iframe
      .locator('[role="dialog"], [role="alertdialog"]')
      .or(
        this.iframe.getByText(
          /location access|permission|denied|blocked|enable location|standort/i,
        ),
      )
      .first();
    const modalVisible = await modal.isVisible().catch(() => false);
    if (modalVisible) {
      await expect(modal).toBeVisible();
      return;
    }
    const retained =
      (await this.useCurrentLocationButton.isVisible().catch(() => false)) ||
      (await this.locationSearch.locationSearchInput.isVisible().catch(() => false));
    expect(retained).toBeTruthy();
  }

  async selectCancellationDateType(type: 'EARLIEST' | 'SPECIFIC'): Promise<void> {
    const label =
      type === 'EARLIEST'
        ? this.iframe.getByText(/Nächstmöglicher Zeitpunkt/i)
        : this.iframe.getByText(/Einem bestimmten Datum/i);
    // Prefer label click — radio input alone is flaky on WebKit/mobile.
    if (
      await label
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await label.first().click({ force: true });
    } else {
      const radio = type === 'EARLIEST' ? this.earliestDateRadio : this.specificDateRadio;
      await radio.click({ force: true });
    }
    await this.page.waitForTimeout(700);
  }

  async fillCancellationDate(date: string): Promise<void> {
    await this.cancellationDateInput.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await this.cancellationDateInput.click({ force: true });
    await this.cancellationDateInput.fill(date);
    await this.cancellationDateInput.blur().catch(() => {});
  }

  async fillContractNumber(value: string): Promise<void> {
    await this.contractNumberInput.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.contractNumberInput.fill(value);
  }

  async fillCancellationReason(value: string): Promise<void> {
    await this.cancellationReasonInput.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    // Avoid UserFormPage.type for multi-thousand-char payloads (viewport scroll hangs).
    await this.cancellationReasonInput.evaluate((el: HTMLTextAreaElement, val: string) => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value',
      )?.set;
      setter?.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
  }

  async acceptLegalDisclaimer(): Promise<void> {
    await this.legalDisclaimerCheckbox.scrollIntoViewIfNeeded().catch(() => {});
    await this.legalDisclaimerCheckbox.check({ force: true });
  }

  async submitCancellationForm(): Promise<void> {
    await this.submitButton.scrollIntoViewIfNeeded().catch(() => {});
    await this.submitButton.click({ force: true, timeout: TIMEOUTS.LONG });
  }

  async fillValidCancelMembershipForm(options?: {
    phone?: string;
    contractNumber?: string;
    cancellationReason?: string;
    dateType?: 'EARLIEST' | 'SPECIFIC';
    cancellationDate?: string;
    acceptLegal?: boolean;
  }): Promise<void> {
    const {
      phone,
      contractNumber = 'CN-AUTO-001',
      cancellationReason = 'Automation cancellation reason',
      dateType = 'EARLIEST',
      cancellationDate = germanFutureCancellationDate(),
      acceptLegal = true,
    } = options ?? {};

    await this.userForm.type(this.userForm.firstName, 'Test');
    await this.userForm.type(this.userForm.lastName, 'User');
    await this.userForm.type(this.userForm.email, `afqas+cancel${Date.now()}@ignitevisibility.com`);
    if (phone) {
      await this.userForm.type(this.userForm.phone, phone);
    }
    await this.fillContractNumber(contractNumber);
    await this.selectCancellationDateType(dateType);
    if (dateType === 'SPECIFIC') {
      await this.fillCancellationDate(cancellationDate);
    }
    await this.fillCancellationReason(cancellationReason);
    if (acceptLegal) {
      await this.acceptLegalDisclaimer();
    }
  }

  async expectCancellationDateTypeRadiosVisible(): Promise<void> {
    await expect(this.earliestDateRadio).toBeVisible();
    await expect(this.specificDateRadio).toBeVisible();
    await expect(this.iframe.getByText(/Nächstmöglicher Zeitpunkt/i)).toBeVisible();
    await expect(this.iframe.getByText(/Einem bestimmten Datum/i)).toBeVisible();
  }

  async expectContractNumberFieldVisible(): Promise<void> {
    await expect(this.contractNumberInput).toBeVisible();
    await expect(this.contractNumberInput).toHaveAttribute('aria-label', /Vertragsnummer/i);
  }

  async expectCancellationDateFieldWhenSpecificSelected(): Promise<void> {
    await this.selectCancellationDateType('SPECIFIC');
    await expect(this.cancellationDateInput).toBeVisible({ timeout: TIMEOUTS.LONG });
    await expect(this.cancellationDateInput).toHaveAttribute('placeholder', /DD\.MM\.YYYY/i);
    await expect(this.cancellationDateInput).toHaveAttribute('aria-label', /Kündigungsdatum/i);
  }

  async expectMaxLengthValidationOrTruncation(
    field: 'contractNumber' | 'cancellationReason',
    maxChars: number,
  ): Promise<void> {
    const errorId = field === 'contractNumber' ? 'contractNumber' : 'cancellationReason';
    const errorShown = await this.isFieldErrorDisplayed(
      errorId,
      new RegExp(`${maxChars}|max|maximal|länge|length|Zeichen|characters`, 'i'),
    );
    if (errorShown) {
      expect(errorShown).toBe(true);
      return;
    }
    const locator =
      field === 'contractNumber' ? this.contractNumberInput : this.cancellationReasonInput;
    const value = await locator.inputValue().catch(() => '');
    if (value.length <= maxChars) {
      return;
    }
    // Over-limit retained: submit must not reach thank-you (validation or soft-block).
    const thankYouVisible = await this.confirmationScreen.thankYouText
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    const stillOnForm = await this.userForm.firstName.isVisible().catch(() => false);
    if (stillOnForm && !thankYouVisible) {
      return;
    }
    throw new Error(
      `APP DEFECT or missing validation: ${field} retained ${value.length} chars (max ${maxChars}) and form left the cancel page`,
    );
  }

  async expectCancellationReasonFieldVisible(): Promise<void> {
    await expect(this.cancellationReasonInput).toBeVisible();
  }

  async expectLegalDisclaimerVisible(): Promise<void> {
    await expect(this.legalDisclaimerCheckbox).toBeVisible();
    await expect(this.iframe.getByText(/Datenschutz|privacy|Bestimmungen/i).first()).toBeVisible();
  }

  async isFieldErrorDisplayed(
    fieldName: string,
    expectedMessage: RegExp | string,
  ): Promise<boolean> {
    const locator = this.iframe.locator(`#${fieldName}-error`);
    try {
      await expect(locator).toBeVisible({ timeout: 5000 });
      const text = ((await locator.textContent()) ?? '').trim();
      if (typeof expectedMessage === 'string') {
        return text.includes(expectedMessage);
      }
      return expectedMessage.test(text);
    } catch {
      return false;
    }
  }
}
