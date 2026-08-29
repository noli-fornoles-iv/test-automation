import { Page } from '@playwright/test';
import { BookATourPage } from '@pages/common/BookATourPage';
import { ConfirmationScreenPage } from '@pages/common/ConfirmationScreenPage';
import { LocalGymPage } from '@pages/common/LocalGymPage';
import { LocationSearchPage } from '@pages/common/LocationSearchPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { PATHS, TIMEOUTS } from '@utils/constants';
import { logger } from '@utils/logger';

export class EventsPage {
  private readonly page: Page;
  readonly locationSearch: LocationSearchPage;
  /** Contact form inside the events iframe (location search → enquire / book a tour). */
  readonly userForm: UserFormPage;
  /** Contact form inside the dedicated book-a-tour iframe (BAT addon after reload/override). */
  readonly batUserForm: UserFormPage;
  /** Contact form when Events BAT CTA navigates to Membership Inquiry (SIT IE/AU/GB). */
  readonly membershipInquiryUserForm: UserFormPage;
  /**
   * Active contact form for the current events flow. Defaults to the events iframe;
   * switches after BOOK A TOUR (in-iframe or post-navigation MI/BAT standalone).
   */
  activeUserForm: UserFormPage;
  /** Schedule picker in the dedicated book-a-tour iframe (Events Book A Tour addon). */
  readonly bookATour: BookATourPage;
  /**
   * Schedule picker inside the events lead iframe (Free Trial Pass / Promo / Fitphoria / TFYL).
   * After lead capture with can_book_appointment=true, date/time UI stays in this iframe.
   */
  readonly eventsSchedule: BookATourPage;
  /** Schedule picker when lead capture stays on membership-inquiry-iframe. */
  readonly membershipInquirySchedule: BookATourPage;
  readonly localGym: LocalGymPage;
  readonly confirmationScreen: ConfirmationScreenPage;

  constructor(page: Page, iframeId: string, expectedPagePath?: string) {
    this.page = page;
    this.locationSearch = new LocationSearchPage(page, iframeId, expectedPagePath);
    this.userForm = new UserFormPage(page, iframeId);
    this.batUserForm = new UserFormPage(page, 'book-a-tour-iframe');
    this.membershipInquiryUserForm = new UserFormPage(page, 'membership-inquiry-iframe');
    this.activeUserForm = this.userForm;
    this.bookATour = new BookATourPage(page, 'book-a-tour-iframe');
    this.eventsSchedule = new BookATourPage(page, iframeId);
    this.membershipInquirySchedule = new BookATourPage(page, 'membership-inquiry-iframe');
    this.localGym = new LocalGymPage(page);
    this.confirmationScreen = new ConfirmationScreenPage(page);
  }

  switchToBookATourForm(): void {
    this.activeUserForm = this.batUserForm;
  }

  switchToEventsForm(): void {
    this.activeUserForm = this.userForm;
  }

  switchToMembershipInquiryForm(): void {
    this.activeUserForm = this.membershipInquiryUserForm;
  }

  private isStandaloneLeadUrl(url: string = this.page.url()): boolean {
    return (
      url.includes(PATHS.BOOK_TOUR_STANDALONE) || url.includes(PATHS.MEMBERSHIP_INQUIRY)
    );
  }

  /**
   * Events Book A Tour CMS has lead_form.enabled=false; BOOK A TOUR navigates to
   * /schedule-an-appointment-online and SIT often lands on /membership-inquiry.
   */
  async waitForLeadFormAfterBookATour(timeout: number = TIMEOUTS.LONG): Promise<UserFormPage> {
    if (!this.isStandaloneLeadUrl()) {
      await Promise.race([
        this.page.waitForURL(
          (url) =>
            url.pathname.includes(PATHS.BOOK_TOUR_STANDALONE) ||
            url.pathname.includes(PATHS.MEMBERSHIP_INQUIRY),
          { timeout, waitUntil: 'domcontentloaded' },
        ),
        this.userForm.firstName.waitFor({ state: 'visible', timeout }).catch(() => undefined),
        this.batUserForm.firstName.waitFor({ state: 'visible', timeout }).catch(() => undefined),
        this.membershipInquiryUserForm.firstName
          .waitFor({ state: 'visible', timeout })
          .catch(() => undefined),
      ]).catch(() => undefined);
    }

    if (this.isStandaloneLeadUrl()) {
      logger.info(`Events Book A Tour CTA navigated to standalone form: ${this.page.url()}`);
      return this.bindStandaloneLeadForm(timeout);
    }

    // URL may still be Events while MI iframe already mounted (client redirect in flight).
    if ((await this.page.locator('#membership-inquiry-iframe').count()) > 0) {
      return this.bindStandaloneLeadForm(timeout);
    }

    try {
      return await Promise.any([
        this.userForm.firstName
          .waitFor({ state: 'visible', timeout })
          .then(() => {
            this.switchToEventsForm();
            return this.userForm;
          }),
        this.batUserForm.firstName
          .waitFor({ state: 'visible', timeout })
          .then(() => {
            this.switchToBookATourForm();
            return this.batUserForm;
          }),
        this.membershipInquiryUserForm.firstName
          .waitFor({ state: 'visible', timeout })
          .then(() => {
            this.switchToMembershipInquiryForm();
            return this.membershipInquiryUserForm;
          }),
      ]);
    } catch {
      throw new Error(
        `Lead form firstName not visible after BOOK A TOUR. URL: ${this.page.url()}`,
      );
    }
  }

  private async bindStandaloneLeadForm(timeout: number): Promise<UserFormPage> {
    const membershipIframe = this.page.locator('#membership-inquiry-iframe');
    const bookTourIframe = this.page.locator('#book-a-tour-iframe');

    // SIT often client-redirects schedule-an-appointment-online → membership-inquiry (~8s).
    await this.page
      .waitForURL(
        (url) =>
          url.pathname.includes(PATHS.MEMBERSHIP_INQUIRY) ||
          url.pathname.includes(PATHS.BOOK_TOUR_STANDALONE),
        { timeout, waitUntil: 'domcontentloaded' },
      )
      .catch(() => undefined);

    await Promise.race([
      membershipIframe.waitFor({ state: 'attached', timeout }),
      bookTourIframe.waitFor({ state: 'attached', timeout }),
      this.membershipInquiryUserForm.firstName.waitFor({ state: 'visible', timeout }),
      this.batUserForm.firstName.waitFor({ state: 'visible', timeout }),
    ]).catch(() => undefined);

    // Extra settle for client-side MI redirect after BAT standalone load.
    if (
      this.page.url().includes(PATHS.BOOK_TOUR_STANDALONE) &&
      (await membershipIframe.count()) === 0 &&
      (await bookTourIframe.count()) === 0
    ) {
      await this.page
        .waitForURL((url) => url.pathname.includes(PATHS.MEMBERSHIP_INQUIRY), {
          timeout: TIMEOUTS.MEDIUM,
          waitUntil: 'domcontentloaded',
        })
        .catch(() => undefined);
      await membershipIframe
        .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
        .catch(() => undefined);
      await bookTourIframe
        .waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT })
        .catch(() => undefined);
    }

    const hasMembership = (await membershipIframe.count()) > 0;
    const hasBookTour = (await bookTourIframe.count()) > 0;
    const miFirstNameVisible = await this.membershipInquiryUserForm.firstName
      .isVisible()
      .catch(() => false);

    if (
      miFirstNameVisible ||
      (hasMembership && (!hasBookTour || this.page.url().includes(PATHS.MEMBERSHIP_INQUIRY)))
    ) {
      this.switchToMembershipInquiryForm();
    } else if (hasBookTour) {
      this.switchToBookATourForm();
    } else {
      throw new Error(
        `No lead form iframe after BOOK A TOUR navigation. URL: ${this.page.url()}`,
      );
    }

    await this.activeUserForm.waitForFormReady();
    return this.activeUserForm;
  }

  /**
   * Wait until the schedule date picker is visible in events, book-a-tour, or
   * membership-inquiry iframe (Events BAT CTA often lands on MI on SIT).
   * Note: Playwright does not allow FrameLocator.or(FrameLocator).
   */
  async waitForScheduleReady(timeout: number = TIMEOUTS.LONG): Promise<BookATourPage> {
    try {
      return await Promise.any([
        this.eventsSchedule.datePicker
          .first()
          .waitFor({ state: 'visible', timeout })
          .then(() => this.eventsSchedule),
        this.bookATour.datePicker
          .first()
          .waitFor({ state: 'visible', timeout })
          .then(() => this.bookATour),
        this.membershipInquirySchedule.datePicker
          .first()
          .waitFor({ state: 'visible', timeout })
          .then(() => this.membershipInquirySchedule),
      ]);
    } catch {
      throw new Error(
        `Schedule date picker not visible after Events lead capture. URL: ${this.page.url()}`,
      );
    }
  }

  /**
   * Prefer a visible schedule iframe: events → membership-inquiry → book-a-tour.
   */
  async resolveSchedulePage(): Promise<BookATourPage> {
    const eventsDateVisible = await this.eventsSchedule.datePicker
      .first()
      .isVisible()
      .catch(() => false);
    if (eventsDateVisible) {
      return this.eventsSchedule;
    }
    const miDateVisible = await this.membershipInquirySchedule.datePicker
      .first()
      .isVisible()
      .catch(() => false);
    if (miDateVisible) {
      return this.membershipInquirySchedule;
    }
    return this.bookATour;
  }

  /**
   * See You Soon confirmation may render in events, book-a-tour, or MI iframe.
   */
  async waitForBookingConfirmationReady(timeout: number = TIMEOUTS.LONG): Promise<BookATourPage> {
    try {
      return await Promise.any([
        this.eventsSchedule
          .waitForBookingConfirmationScreen(timeout)
          .then(() => this.eventsSchedule),
        this.bookATour.waitForBookingConfirmationScreen(timeout).then(() => this.bookATour),
        this.membershipInquirySchedule
          .waitForBookingConfirmationScreen(timeout)
          .then(() => this.membershipInquirySchedule),
      ]);
    } catch {
      throw new Error(
        `Booking confirmation not visible in events / book-a-tour / membership-inquiry iframe (url=${this.page.url()})`,
      );
    }
  }
}
