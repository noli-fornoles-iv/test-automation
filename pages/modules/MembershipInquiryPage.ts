import { Page } from '@playwright/test';
import { BookATourPage } from '@pages/common/BookATourPage';
import { ConfirmationScreenPage } from '@pages/common/ConfirmationScreenPage';
import { LocalGymPage } from '@pages/common/LocalGymPage';
import { LocationSearchPage } from '@pages/common/LocationSearchPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { PATHS, TIMEOUTS } from '@utils/constants';

export class MembershipInquiryPage {
  readonly locationSearch: LocationSearchPage;
  readonly userForm: UserFormPage;
  /**
   * Schedule picker in the MI lead-form SPA iframe (`#membership-inquiry-iframe`).
   * After lead capture (esp. iPhone Safari), date/time UI often stays here.
   */
  readonly formSchedule: BookATourPage;
  /**
   * Schedule picker in the dedicated BAT iframe (`#book-a-tour-iframe`).
   * Some SIT remounts put the picker here after lead-capture (same as TUF/Events).
   */
  readonly batSchedule: BookATourPage;
  /**
   * Active schedule page object. Defaults to BAT iframe; updated by
   * {@link waitForScheduleReady} / {@link resolveSchedulePage}.
   */
  bookATour: BookATourPage;
  readonly localGym: LocalGymPage;
  readonly confirmationScreen: ConfirmationScreenPage;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.locationSearch = new LocationSearchPage(
      page,
      'membership-inquiry-iframe',
      PATHS.MEMBERSHIP_INQUIRY,
    );
    this.userForm = new UserFormPage(page, 'membership-inquiry-iframe');
    this.formSchedule = new BookATourPage(page, 'membership-inquiry-iframe');
    this.batSchedule = new BookATourPage(page, 'book-a-tour-iframe');
    // Prefer BAT iframe by default (historical MI addon path); resolveScheduleReady may switch.
    this.bookATour = this.batSchedule;
    this.localGym = new LocalGymPage(page);
    this.confirmationScreen = new ConfirmationScreenPage(page);
  }

  /**
   * Wait until the schedule date picker is visible in either MI iframe
   * (`#membership-inquiry-iframe` or `#book-a-tour-iframe`). Same dual-resolve as TUF/Events.
   */
  async waitForScheduleReady(timeout: number = TIMEOUTS.LONG): Promise<BookATourPage> {
    try {
      const schedulePage = await Promise.any([
        this.formSchedule.datePicker
          .first()
          .waitFor({ state: 'visible', timeout })
          .then(() => this.formSchedule),
        this.batSchedule.datePicker
          .first()
          .waitFor({ state: 'visible', timeout })
          .then(() => this.batSchedule),
      ]);
      this.bookATour = schedulePage;
      await schedulePage.scrollSchedulePickerIntoView().catch(() => {});
      return schedulePage;
    } catch {
      let formAttached = 0;
      let batAttached = 0;
      try {
        if (!this.page.isClosed()) {
          formAttached = await this.page.locator('#membership-inquiry-iframe').count();
          batAttached = await this.page.locator('#book-a-tour-iframe').count();
        }
      } catch {
        /* page may already be closed */
      }
      throw new Error(
        `Schedule date picker not visible in membership-inquiry-iframe or book-a-tour-iframe ` +
          `(membership-inquiry-iframe count=${formAttached}, book-a-tour-iframe count=${batAttached}, ` +
          `pageClosed=${this.page.isClosed()}, url=${this.page.isClosed() ? 'n/a' : this.page.url()})`,
      );
    }
  }

  /** Prefer whichever schedule date picker is already visible (no long wait). */
  async isSchedulePickerVisible(): Promise<boolean> {
    const formVisible = await this.formSchedule.datePicker
      .first()
      .isVisible()
      .catch(() => false);
    if (formVisible) {
      this.bookATour = this.formSchedule;
      return true;
    }
    const batVisible = await this.batSchedule.datePicker
      .first()
      .isVisible()
      .catch(() => false);
    if (batVisible) {
      this.bookATour = this.batSchedule;
      return true;
    }
    return false;
  }

  /** Prefer whichever schedule date picker is already visible. */
  async resolveSchedulePage(): Promise<BookATourPage> {
    if (await this.isSchedulePickerVisible()) {
      return this.bookATour;
    }
    return this.waitForScheduleReady(TIMEOUTS.MEDIUM);
  }

  /**
   * See You Soon confirmation may render in either MI iframe after booking.
   */
  async waitForBookingConfirmationReady(timeout: number = TIMEOUTS.LONG): Promise<BookATourPage> {
    try {
      const schedulePage = await Promise.any([
        this.formSchedule
          .waitForBookingConfirmationScreen(timeout)
          .then(() => this.formSchedule),
        this.batSchedule
          .waitForBookingConfirmationScreen(timeout)
          .then(() => this.batSchedule),
      ]);
      this.bookATour = schedulePage;
      return schedulePage;
    } catch {
      throw new Error(
        `Booking confirmation not visible in membership-inquiry-iframe or book-a-tour-iframe ` +
          `(url=${this.page.isClosed() ? 'n/a' : this.page.url()})`,
      );
    }
  }
}
