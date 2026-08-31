import { expect, FrameLocator, Locator, Page } from '@playwright/test';
import environmentManager from '@config/environment';
import { BookATourPage } from '@pages/common/BookATourPage';
import { LocalGymPage } from '@pages/common/LocalGymPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { FindAGymPage } from '@pages/modules/FindAGymPage';
import { PATHS, TIMEOUTS } from '@utils/constants';
import { appendDisableCaptchaParam, Helpers, navigateToUrl } from '@utils/helpers';
import { d } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import { readButtonClickedInventoryFromLocator } from '@utils/tracking/button-clicked-rs-tracking';
import { AppPages } from '@utils/constants/app-pages.enum';
import testStudio from '@resources/locationTestStudio';

/**
 * AFW-3951 — Webflow + React surfaces for Button Clicked Rudderstack validation.
 */
export class ButtonClickedTrackingPage {
  readonly page: Page;
  readonly localGymPage: LocalGymPage;
  readonly findAGymPage: FindAGymPage;
  readonly bookATour: BookATourPage;

  constructor(page: Page) {
    this.page = page;
    this.localGymPage = new LocalGymPage(page);
    this.findAGymPage = new FindAGymPage(page);
    this.bookATour = new BookATourPage(page, 'book-a-tour-iframe');
  }

  testClubId(): string {
    return testStudio['EN-US'] ?? '9993999';
  }

  async openPath(path: string, query?: Record<string, string>): Promise<void> {
    const locale = environmentManager.get('LOCALE');
    const baseUrl = String(environmentManager.get('BASE_URL')).replace(/\/$/, '');
    const url = new URL(`${baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        url.searchParams.set(key, value);
      }
    }
    await navigateToUrl(url.toString(), this.page, locale, { includeTestLocationId: false });
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  }

  async openLlp(): Promise<void> {
    await this.openPath(PATHS.LOCAL_GYM_PAGE);
  }

  async openWhyJoinPlanPath(): Promise<void> {
    // Approved Testpad plan names /why-join (distinct from PATHS.WHY_JOIN /membership).
    await this.openPath('/why-join');
  }

  navbar(): Locator {
    return this.page.getByRole('banner');
  }

  navbarLogo(): Locator {
    return this.navbar()
      .getByRole('link', { name: /anytime fitness/i })
      .first();
  }

  navbarLinkByLabel(label: string | RegExp): Locator {
    return this.navbar().getByRole('link', { name: label }).first();
  }

  navbarTryUsFreeCta(): Locator {
    return this.navbar().getByRole('link', { name: /^TRY US FREE$/i }).first();
  }

  llpNavbarLinks(): Locator {
    return this.navbar().getByRole('link');
  }

  llpNavbarCta(): Locator {
    return this.navbar()
      .locator('a.bt-af, a.bt-af-long, a.w-button')
      .filter({ hasNotText: /anytime fitness/i })
      .first();
  }

  corePagePillButtons(): Locator {
    return this.page.locator(
      'main a.bt-af, main a.bt-af-long, section a.bt-af, section a.bt-af-long',
    );
  }

  llpCtaPillButtons(): Locator {
    return this.page.locator(
      'main a.bt-af, main a.bt-af-long, .gym-hero-content a.bt-af, .gym-hero-content a.bt-af-long',
    );
  }

  llpHeroBannerLinks(): Locator {
    return this.localGymPage.heroSection.getByRole('link');
  }

  llpPreFooterLinks(): Locator {
    return this.page
      .locator('[class*="pre-footer"], [class*="prefooter"], section')
      .filter({ hasText: /Virtual Tour|Club Schedule|Address/i })
      .first()
      .getByRole('link');
  }

  llpExploreMembershipsLink(): Locator {
    return this.page.getByRole('link', { name: /^EXPLORE MEMBERSHIPS$/i }).first();
  }

  llpAppleFitnessTryUsFree(): Locator {
    return this.page
      .locator('section')
      .filter({ hasText: /TRY US FREE|Apple Fitness/i })
      .getByRole('link', { name: /^TRY US FREE$/i })
      .first();
  }

  private async locationsSearchFrame(): Promise<FrameLocator> {
    if (await this.page.locator('#find-gym-iframe').count()) {
      return this.page.frameLocator('#find-gym-iframe');
    }
    if (await this.page.locator('#locations-widget-iframe').count()) {
      return this.page.frameLocator('#locations-widget-iframe');
    }
    return this.findAGymPage.iframe;
  }

  async openLocationsSearch(): Promise<void> {
    await this.findAGymPage.ensureInCountryIpstackMock();
    await this.openPath(PATHS.LOCATIONS);
    await this.findAGymPage.waitForReady().catch(async () => {
      const frame = await this.locationsSearchFrame();
      await frame
        .locator('#location-search-input, [id^="react-select-"][id$="-control"]')
        .first()
        .waitFor({ state: 'visible', timeout: TIMEOUTS.LONG })
        .catch(() => {});
    });
  }

  async countryDropdownControl(): Promise<Locator> {
    const frame = await this.locationsSearchFrame();
    return frame
      .getByRole('button', { name: /SELECT COUNTRY|select country/i })
      .or(frame.getByText(/SELECT COUNTRY|select country/i))
      .first();
  }

  async countryDropdownOptions(): Promise<Locator> {
    const frame = await this.locationsSearchFrame();
    return frame.locator('[role="option"], [role="menuitem"], li[role="option"]');
  }

  async preciseLocationControl(): Promise<Locator> {
    const frame = await this.locationsSearchFrame();
    return frame
      .getByRole('button', { name: /precise location|Use my precise location|Use Current Location/i })
      .or(frame.getByText(/Use my precise location|Use Current Location/i))
      .first();
  }

  async searchLocationsUntilResults(): Promise<void> {
    const term =
      d(TestDataKeys.ZipCode.Valid.Secondary)?.trim() ||
      d(TestDataKeys.ZipCode.Valid.Default)?.trim() ||
      '55128';
    await this.findAGymPage.searchLocation(term, { pickSuggestion: true });
    await this.findAGymPage.expectNearbyResultsVisible();
  }

  async mapPinCta(): Promise<Locator> {
    await this.findAGymPage.openMapPinPopup();
    return this.findAGymPage.visitWebsiteLink;
  }

  joinCardCta(): Locator {
    return this.findAGymPage.iframe
      .locator('#list-panel')
      .getByRole('button', { name: /JOIN NOW|TRY US FREE|SELECT GYM|GYM DETAILS/i })
      .first();
  }

  locationsResultPillCtas(): Locator {
    return this.findAGymPage.iframe.locator('#list-panel a.bt-af, #list-panel a.bt-af-long, #list-panel button');
  }

  async userFormForPath(path: string): Promise<UserFormPage> {
    if (path.includes('/offer/')) {
      return new UserFormPage(this.page, 'local-offer-iframe');
    }
    return new UserFormPage(this.page, 'book-a-tour-iframe');
  }

  async openTryUsFreeWithClub(clubId: string): Promise<UserFormPage> {
    await this.openPath(PATHS.TRY_US_FREE, {
      location_id: clubId,
      disable_captcha: 'true',
    });
    return new UserFormPage(this.page, 'book-a-tour-iframe');
  }

  async openLocalOfferWithClub(clubId: string): Promise<UserFormPage> {
    const url = appendDisableCaptchaParam(
      `${environmentManager.get('BASE_URL')}/offer/local/1-day-pass?location_id=${clubId}`,
    );
    const locale = environmentManager.get('LOCALE');
    await navigateToUrl(url, this.page, locale, { includeTestLocationId: false });
    return new UserFormPage(this.page, 'local-offer-iframe');
  }

  async openGroupOfferWithClub(clubId: string): Promise<UserFormPage> {
    const url = appendDisableCaptchaParam(
      `${environmentManager.get('BASE_URL')}/offer/group/join-for-one-dollar-offer?test_location_id=${clubId}`,
    );
    const locale = environmentManager.get('LOCALE');
    await navigateToUrl(url, this.page, locale, { includeTestLocationId: false });
    return new UserFormPage(this.page, 'local-offer-iframe');
  }

  async openMemberOfferWithClub(clubId: string): Promise<UserFormPage> {
    const url = `${environmentManager.get('BASE_URL')}/offer/members/join-transformation-challenge?location_id=${clubId}&disable_captcha=true`;
    const locale = environmentManager.get('LOCALE');
    await navigateToUrl(url, this.page, locale, { includeTestLocationId: false });
    return new UserFormPage(this.page, 'local-offer-iframe');
  }

  visitLlpControl(userForm: UserFormPage): Locator {
    return userForm.iframe
      .getByRole('link', { name: /visit.*gym|gym details|local gym|view gym/i })
      .or(userForm.iframe.getByRole('button', { name: /visit.*gym|gym details|local gym|view gym/i }))
      .first();
  }

  joinNowCardPill(userForm: UserFormPage): Locator {
    return userForm.iframe
      .locator('a.bt-af, a.bt-af-long, button')
      .filter({ hasText: /JOIN NOW|Join Now/i })
      .first();
  }

  async clickTrackedControl(locator: Locator): Promise<ReturnType<typeof readButtonClickedInventoryFromLocator>> {
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    await expect(locator).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    const inventory = await readButtonClickedInventoryFromLocator(locator);
    await locator.click({ timeout: TIMEOUTS.MEDIUM });
    await this.page.waitForTimeout(300);
    return inventory;
  }

  async clickEachVisible(
    locator: Locator,
    handler: (item: Locator, index: number) => Promise<void>,
    max = 12,
  ): Promise<number> {
    const count = Math.min(await locator.count(), max);
    for (let i = 0; i < count; i++) {
      const item = locator.nth(i);
      if (!(await item.isVisible().catch(() => false))) {
        continue;
      }
      await handler(item, i);
    }
    return count;
  }

  async completeBookVisitToThankYou(clubId: string): Promise<BookATourPage> {
    await this.openPath(PATHS.BOOK_TOUR_STANDALONE, {
      location_id: clubId,
      disable_captcha: 'true',
    });
    const userForm = new UserFormPage(this.page, 'book-a-tour-iframe');
    await userForm.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG }).catch(() => {});
    await userForm.fillAndSubmitForm(
      {
        firstName: Helpers.generateRandomString(6),
        lastName: Helpers.generateRandomString(6),
        email: Helpers.generateRandomEmail(),
        phone: d(TestDataKeys.PhoneNumber.Valid.Default),
      },
      false,
    );
    await this.bookATour.waitForVisible(this.bookATour.datePicker.first(), TIMEOUTS.LONG);
    const dates = await this.bookATour.getAllAvailableDates();
    expect(dates.length, 'bookable dates on schedule picker').toBeGreaterThan(0);
    const firstDate = Helpers.getRandomElement(dates);
    await this.bookATour.selectDate(firstDate);
    const times = await this.bookATour.getAllAvailableTimes();
    expect(times.length, 'bookable times on schedule picker').toBeGreaterThan(0);
    const firstTime = Helpers.getRandomElement(times);
    await this.bookATour.selectTime(firstTime);
    await this.bookATour.clickScheduleButton(AppPages.BOOK_A_TOUR_STANDALONE);
    await this.bookATour.seeYouSoonLabel.or(this.bookATour.addToCalendarBtn).first().waitFor({
      state: 'visible',
      timeout: TIMEOUTS.LONG,
    });
    return this.bookATour;
  }
}
