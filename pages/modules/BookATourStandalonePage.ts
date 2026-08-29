import { Page } from '@playwright/test';
import environmentManager from '@config/environment';
import { BookATourPage } from '@pages/common/BookATourPage';
import { LocalGymPage } from '@pages/common/LocalGymPage';
import { LocationSearchPage } from '@pages/common/LocationSearchPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { PATHS, TIMEOUTS } from '@utils/constants';
import { appendDisableCaptchaParam } from '@utils/helpers';
import { d } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import { logger } from '@utils/logger';

export class BookATourStandalonePage {
  private readonly page: Page;
  readonly locationSearch: LocationSearchPage;
  readonly userForm: UserFormPage;
  readonly membershipInquiryUserForm: UserFormPage;
  readonly bookATour: BookATourPage;
  readonly localGym: LocalGymPage;

  constructor(page: Page) {
    this.page = page;
    this.locationSearch = new LocationSearchPage(
      page,
      'book-a-tour-iframe',
      PATHS.BOOK_TOUR_STANDALONE,
    );
    this.userForm = new UserFormPage(page, 'book-a-tour-iframe');
    this.membershipInquiryUserForm = new UserFormPage(page, 'membership-inquiry-iframe');
    this.bookATour = new BookATourPage(page, 'book-a-tour-iframe');
    this.localGym = new LocalGymPage(page);
  }

  /** GB locale override can land on membership-inquiry while other locales keep book-a-tour-iframe.
   * When the Local Config test gym has no ClubTour slots, any locale may redirect to MI. */
  async getActiveUserForm(): Promise<UserFormPage> {
    if (this.page.url().includes('/membership-inquiry')) {
      return this.membershipInquiryUserForm;
    }

    const [hasMembershipIframe, hasBookTourIframe] = await Promise.all([
      this.page.locator('#membership-inquiry-iframe').count(),
      this.page.locator('#book-a-tour-iframe').count(),
    ]);

    if (hasMembershipIframe > 0 && hasBookTourIframe === 0) {
      return this.membershipInquiryUserForm;
    }

    return this.userForm;
  }

  /**
   * After Select Gym, ensure the BAT form is usable (fast path).
   *
   * Prefer Select Gym UI + replaceState (`overrideLocationAndDisableCaptcha`) when
   * `#book-a-tour-iframe` firstName is already visible — always remounting can race a
   * client redirect to `/membership-inquiry` (club 9993999 on SIT/UAT). Remount only when
   * the form is missing. Prefer bounded firstName waits over waitForFormReady (WebKit).
   * Do not change test-data.json.
   */
  async ensureFormReadyAfterGymSelect(clubId: string): Promise<UserFormPage> {
    // Let Select Gym client redirects finish before remounting — otherwise goto(BAT)
    // races client → membership-inquiry and fails with "interrupted by another navigation".
    await this.page
      .waitForURL(
        url =>
          (url.pathname.includes(PATHS.BOOK_TOUR_STANDALONE) ||
            url.pathname.includes(PATHS.MEMBERSHIP_INQUIRY)) &&
          url.searchParams.has('location_id'),
        { timeout: TIMEOUTS.MEDIUM, waitUntil: 'domcontentloaded' },
      )
      .catch(() => {
        logger.warn(
          `BAT Standalone Select Gym did not set location_id; current: ${this.page.url()}`,
        );
      });
    await this.page.waitForTimeout(800);

    // Fast path (TUF pattern): UI Select Gym already mounted BAT lead form — keep it only when
    // the schedule date picker is also present. Otherwise remount (primary often has no slots).
    if (this.page.url().includes(PATHS.BOOK_TOUR_STANDALONE)) {
      const uiReady = await this.userForm.firstName
        .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT })
        .then(() => true)
        .catch(() => false);
      if (uiReady && !this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY)) {
        const scheduleReady = await this.bookATour.datePicker
          .first()
          .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT })
          .then(() => true)
          .catch(() => false);
        if (scheduleReady) {
          await this.userForm.overrideLocationAndDisableCaptcha(clubId).catch(() => {});
          await this.userForm.ensureDisableCaptchaPersisted().catch(() => {});
          if (
            (await this.userForm.firstName.isVisible().catch(() => false)) &&
            this.page.url().includes(PATHS.BOOK_TOUR_STANDALONE)
          ) {
            logger.info(
              `BAT Standalone keeping Select Gym UI form with schedule picker for club ${clubId}`,
            );
            return this.userForm;
          }
        } else {
          logger.warn(
            `BAT Standalone Select Gym UI has lead fields but no schedule picker for club ${clubId}; remounting`,
          );
        }
      }
    }

    if (this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY)) {
      logger.warn(
        `BAT Standalone Select Gym landed on Membership Inquiry for club ${clubId}; remounting BAT. URL: ${this.page.url()}`,
      );
    }

    // Remount BAT when UI form was missing. Race firstName vs MI redirect so we retry
    // instead of burning MEDIUM on the wrong iframe after a client hop.
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        if (attempt > 1 && !this.page.isClosed()) {
          await this.page.goto('about:blank', { waitUntil: 'domcontentloaded' }).catch(() => {});
        }
        await this.navigateToStandaloneForm(clubId);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (
          attempt < 3 &&
          /Target crashed|has been closed|interrupted by another navigation/i.test(msg)
        ) {
          logger.warn(`BAT Standalone remount attempt ${attempt} failed; retrying: ${msg}`);
          continue;
        }
        throw error;
      }

      const remountOutcome = await this.waitForBatOrMembershipInquiryOutcome(TIMEOUTS.MEDIUM);

      if (remountOutcome === 'bat') {
        await this.userForm.ensureDisableCaptchaPersisted().catch(() => {});
        return this.userForm;
      }

      if (remountOutcome === 'mi') {
        if (attempt < 3) {
          logger.warn(
            `BAT Standalone remount landed on MI for club ${clubId}; retrying remount attempt ${attempt + 1}. URL: ${this.page.url()}`,
          );
          continue;
        }
        // No ClubTour slots on Local Config test gym → SPA redirects BAT → MI.
        // Return MI form; steps soft-skip schedule / BAT-only validations.
        logger.warn(
          `BAT Standalone remount exhausted; accepting Membership Inquiry for club ${clubId} ` +
            `(no time availabilities on test gym). URL: ${this.page.url()}`,
        );
        await this.navigateToMembershipInquiryForm(clubId);
        const miForm = this.membershipInquiryUserForm;
        await this.waitForLeadFormReadyBounded(miForm);
        return miForm;
      }
    }

    if (this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY)) {
      logger.warn(
        `BAT Standalone accepting Membership Inquiry for club ${clubId} ` +
          `(no time availabilities on test gym). URL: ${this.page.url()}`,
      );
      const miForm = this.membershipInquiryUserForm;
      await this.waitForLeadFormReadyBounded(miForm);
      return miForm;
    }

    const userForm = this.userForm;
    await this.waitForLeadFormReadyBounded(userForm);

    if (this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY)) {
      logger.warn(
        `BAT Standalone redirected to Membership Inquiry after load for club ${clubId} ` +
          `(no time availabilities on test gym). URL: ${this.page.url()}`,
      );
      const miForm = this.membershipInquiryUserForm;
      await this.waitForLeadFormReadyBounded(miForm);
      return miForm;
    }

    return userForm;
  }

  /**
   * After BAT remount: win on book-a-tour firstName, or detect MI client redirect quickly.
   */
  private async waitForBatOrMembershipInquiryOutcome(
    timeout: number,
  ): Promise<'bat' | 'mi' | 'none'> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (this.page.isClosed()) {
        return 'none';
      }
      if (this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY)) {
        return 'mi';
      }
      if (
        this.page.url().includes(PATHS.BOOK_TOUR_STANDALONE) &&
        (await this.userForm.firstName.isVisible().catch(() => false))
      ) {
        return 'bat';
      }
      await this.page.waitForTimeout(250).catch(() => {});
    }
    if (this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY)) {
      return 'mi';
    }
    if (
      this.page.url().includes(PATHS.BOOK_TOUR_STANDALONE) &&
      (await this.userForm.firstName.isVisible().catch(() => false))
    ) {
      return 'bat';
    }
    return 'none';
  }

  /** Bounded firstName wait — do not run full waitForFormReady lazy scrolls on WebKit. */
  private async waitForLeadFormReadyBounded(userForm: UserFormPage): Promise<void> {
    await userForm.ensureDisableCaptchaPersisted();
    await this.page
      .locator(
        userForm === this.membershipInquiryUserForm
          ? '#membership-inquiry-iframe'
          : '#book-a-tour-iframe',
      )
      .first()
      .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
      .catch(() => {});
    await userForm.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
  }

  async navigateToStandaloneForm(clubId: string): Promise<void> {
    // BASE_URL already includes locale segment (e.g. .../en-gb). Concatenate path —
    // do not assign url.pathname or the locale prefix is stripped (US-only URL).
    const baseUrl = String(environmentManager.get('BASE_URL')).replace(/\/$/, '');
    const url = new URL(`${baseUrl}${PATHS.BOOK_TOUR_STANDALONE}`);
    url.searchParams.set('location_id', String(clubId));
    url.searchParams.set('test_location_id', String(clubId));
    url.searchParams.set('disable_captcha', 'true');

    const locale = String(environmentManager.get('LOCALE') || '');
    const isNonProd = ['//sit.', '//uat.', '//dev.'].some(env => url.href.includes(env));
    const isUSLocale = locale.toUpperCase().includes('US');
    if (isUSLocale) {
      url.searchParams.delete('use_prod_api');
    } else if (isNonProd) {
      url.searchParams.set('use_prod_api', 'true');
    }

    const target = appendDisableCaptchaParam(url.toString());
    console.log(`BAT Standalone navigateToStandaloneForm -> ${target}`);
    logger.warn(`BAT Standalone navigateToStandaloneForm -> ${target}`);
    if (this.page.isClosed()) {
      throw new Error('Cannot navigate to BAT form — page is already closed');
    }
    await this.gotoWithNavigationRace(target);
    console.log(`BAT Standalone navigateToStandaloneForm settled at: ${this.page.url()}`);
  }

  private async navigateToMembershipInquiryForm(clubId: string): Promise<void> {
    const baseUrl = String(environmentManager.get('BASE_URL')).replace(/\/$/, '');
    const url = new URL(`${baseUrl}${PATHS.MEMBERSHIP_INQUIRY}`);
    url.searchParams.set('location_id', String(clubId));
    url.searchParams.set('test_location_id', String(clubId));
    url.searchParams.set('disable_captcha', 'true');

    const locale = String(environmentManager.get('LOCALE') || '');
    const isNonProd = ['//sit.', '//uat.', '//dev.'].some(env => url.href.includes(env));
    if (isNonProd && !locale.toUpperCase().includes('US')) {
      url.searchParams.set('use_prod_api', 'true');
    }

    const target = appendDisableCaptchaParam(url.toString());
    console.log(`BAT Standalone navigateToMembershipInquiryForm -> ${target}`);
    if (this.page.isClosed()) {
      throw new Error('Cannot navigate to MI form — page is already closed');
    }
    await this.gotoWithNavigationRace(target);
  }

  /**
   * page.goto can lose a race with Select Gym client redirects (esp. EN-GB → MI).
   * Soft-accept interrupted navigations when we land on a usable lead-form URL.
   */
  private async gotoWithNavigationRace(target: string): Promise<void> {
    try {
      await this.page.goto(target, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.LONG });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      const interrupted = /interrupted by another navigation|Navigation.*interrupted/i.test(msg);
      if (!interrupted) {
        throw error;
      }
      logger.warn(`BAT Standalone goto interrupted; waiting for final URL: ${msg}`);
      await this.page
        .waitForURL(
          url =>
            url.pathname.includes(PATHS.BOOK_TOUR_STANDALONE) ||
            url.pathname.includes(PATHS.MEMBERSHIP_INQUIRY),
          { timeout: TIMEOUTS.MEDIUM, waitUntil: 'domcontentloaded' },
        )
        .catch(() => {});
    }
    await this.page.waitForTimeout(500).catch(() => {});
  }

  /**
   * Ensure BAT schedule date picker is ready for booking/submit.
   * Club `9993999` (Local Config primary) often has empty ClubTour availabilities — Select Gym
   * can leave firstName visible without a date picker. Remount with Local Config Secondary Club
   * Id when needed (do not invent IDs; do not soft-skip).
   * @returns club id actually loaded (primary or secondary)
   */
  async ensureScheduleFormReady(clubId: string): Promise<string> {
    let effectiveClubId = String(clubId);

    const remountBat = async (targetClubId: string) => {
      await this.navigateToStandaloneForm(targetClubId);
      await this.userForm.ensureDisableCaptchaPersisted();
      await this.userForm.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    };

    if (
      this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY) ||
      (await this.page
        .locator('#book-a-tour-iframe')
        .count()
        .catch(() => 0)) === 0
    ) {
      await remountBat(effectiveClubId);
    }

    if (
      this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY) ||
      (await this.page
        .locator('#book-a-tour-iframe')
        .count()
        .catch(() => 0)) === 0
    ) {
      const secondary = d(TestDataKeys.Locations.SecondaryClubId);
      if (secondary && secondary !== effectiveClubId) {
        logger.warn(
          `BAT schedule surface unavailable for ${effectiveClubId}; remounting Secondary Club Id ${secondary}`,
        );
        effectiveClubId = secondary;
        await remountBat(effectiveClubId);
      }
    }

    if (
      this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY) ||
      (await this.page
        .locator('#book-a-tour-iframe')
        .count()
        .catch(() => 0)) === 0
    ) {
      throw new Error(
        `BAT schedule surface unavailable (Membership Inquiry or missing #book-a-tour-iframe) ` +
          `for club ${effectiveClubId}. URL: ${this.page.url()}`,
      );
    }

    await this.userForm.ensureDisableCaptchaPersisted();
    await this.userForm.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });

    const scheduleReady = await this.bookATour
      .waitForSchedulePickerReady(TIMEOUTS.MEDIUM)
      .then(() => true)
      .catch(() => false);

    if (!scheduleReady) {
      const secondary = d(TestDataKeys.Locations.SecondaryClubId);
      if (secondary && secondary !== effectiveClubId) {
        logger.warn(
          `BAT schedule date picker missing for club ${effectiveClubId}; ` +
            `remounting Local Config Secondary Club Id ${secondary}`,
        );
        effectiveClubId = secondary;
        await remountBat(effectiveClubId);
        await this.bookATour.waitForSchedulePickerReady(TIMEOUTS.LONG);
      } else {
        await this.bookATour.waitForSchedulePickerReady(TIMEOUTS.LONG);
      }
    }

    if (this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY)) {
      throw new Error(
        `BAT redirected to Membership Inquiry while waiting for schedule. URL: ${this.page.url()}`,
      );
    }

    return effectiveClubId;
  }
}
