import { Page } from '@playwright/test';
import { BookATourPage } from '@pages/common/BookATourPage';
import { ConfirmationScreenPage } from '@pages/common/ConfirmationScreenPage';
import { LocalGymPage } from '@pages/common/LocalGymPage';
import { LocationSearchPage } from '@pages/common/LocationSearchPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { PATHS, TIMEOUTS } from '@utils/constants';

export class TryUsFreePage {
  readonly locationSearch: LocationSearchPage;
  readonly userForm: UserFormPage;
  /**
   * Schedule picker in the lead-form SPA iframe (`#try-us-free-iframe`).
   * Same iframe as location search / lead form for classic TUF flows.
   */
  readonly formSchedule: BookATourPage;
  /**
   * Schedule picker in the dedicated BAT iframe (`#book-a-tour-iframe`).
   * SIT/UAT Apple Fitness / TUF addon sometimes remounts schedule here after lead capture.
   */
  readonly batSchedule: BookATourPage;
  /**
   * Active schedule page object. Defaults to form iframe; updated by
   * {@link waitForScheduleReady} / {@link resolveSchedulePage}.
   */
  bookATour: BookATourPage;
  readonly localGym: LocalGymPage;
  readonly confirmationScreen: ConfirmationScreenPage;
  private readonly page: Page;
  private hostPath: string;

  constructor(page: Page, hostPath: string = PATHS.TRY_US_FREE) {
    this.page = page;
    this.hostPath = hostPath;
    // Host path enables ensureOnExpectedHostPage / locale-aware remount on search retry.
    // AFP Free Trial Offer must remount to /apple-fitness-offer (EN-AU /try-us-free is 404).
    this.locationSearch = new LocationSearchPage(page, 'try-us-free-iframe', hostPath);
    this.userForm = new UserFormPage(page, 'try-us-free-iframe');
    this.formSchedule = new BookATourPage(page, 'try-us-free-iframe');
    this.batSchedule = new BookATourPage(page, 'book-a-tour-iframe');
    this.bookATour = this.formSchedule;
    this.localGym = new LocalGymPage(page);
    this.confirmationScreen = new ConfirmationScreenPage(page);
  }

  /**
   * Rebinds location-search remount path when Background navigates to an AFP variant
   * or when `/try-us-free` permanently redirects to Book A Tour (EN-IE / EN-GB).
   * Call after landing on apple-fitness-offer / apple-fitness-plus-subscriber /
   * schedule-an-appointment-online.
   */
  useHostPath(hostPath: string): void {
    const iframeId =
      hostPath === PATHS.BOOK_TOUR_STANDALONE ? 'book-a-tour-iframe' : 'try-us-free-iframe';
    const currentIframeId =
      this.hostPath === PATHS.BOOK_TOUR_STANDALONE ? 'book-a-tour-iframe' : 'try-us-free-iframe';
    if (this.hostPath === hostPath && currentIframeId === iframeId) {
      return;
    }
    this.hostPath = hostPath;
    (this as { locationSearch: LocationSearchPage }).locationSearch = new LocationSearchPage(
      this.page,
      iframeId,
      hostPath,
    );
    (this as { userForm: UserFormPage }).userForm = new UserFormPage(this.page, iframeId);
    (this as { formSchedule: BookATourPage }).formSchedule = new BookATourPage(this.page, iframeId);
    this.bookATour = this.formSchedule;
  }

  /**
   * Wait until the schedule date picker is visible in either the TUF lead iframe
   * or the book-a-tour iframe (Events-style dual resolve).
   * Note: Playwright does not allow FrameLocator.or(FrameLocator).
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
          formAttached = await this.page.locator('#try-us-free-iframe').count();
          batAttached = await this.page.locator('#book-a-tour-iframe').count();
        }
      } catch {
        /* page may already be closed */
      }
      throw new Error(
        `Schedule date picker not visible in try-us-free-iframe or book-a-tour-iframe ` +
          `(try-us-free-iframe count=${formAttached}, book-a-tour-iframe count=${batAttached}, ` +
          `pageClosed=${this.page.isClosed()}, url=${this.page.isClosed() ? 'n/a' : this.page.url()})`,
      );
    }
  }

  /** Prefer whichever schedule date picker is already visible. */
  async resolveSchedulePage(): Promise<BookATourPage> {
    const formVisible = await this.formSchedule.datePicker
      .first()
      .isVisible()
      .catch(() => false);
    if (formVisible) {
      this.bookATour = this.formSchedule;
      return this.formSchedule;
    }
    const batVisible = await this.batSchedule.datePicker
      .first()
      .isVisible()
      .catch(() => false);
    if (batVisible) {
      this.bookATour = this.batSchedule;
      return this.batSchedule;
    }
    return this.waitForScheduleReady(TIMEOUTS.MEDIUM);
  }

  /**
   * See You Soon / WE GOT IT confirmation may render in either iframe after booking.
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
        `Booking confirmation not visible in try-us-free-iframe or book-a-tour-iframe (url=${this.page.url()})`,
      );
    }
  }
}
