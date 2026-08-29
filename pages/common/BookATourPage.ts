import { expect, Locator, FrameLocator, Page, BrowserContext } from '@playwright/test';
import BasePage from '@pages/common/BasePage';
import { TIMEOUTS } from '@utils/constants';
import { AppPages } from '@utils/constants/app-pages.enum';
import { Helpers } from '@utils/helpers';
import { t } from '@utils/locale-utils/locale-manager';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';

const GOOGLE_CALENDAR_URL_RE = /calendar\.google\.com/i;

export class BookATourPage extends BasePage {
  readonly iframeElement: Locator;
  readonly iframe: FrameLocator;
  readonly dateRequiredFieldMessage: Locator;
  readonly timeRequiredFieldMessage: Locator;
  readonly letsDoThisBtn: Locator;
  readonly timeSlotMessage: Locator;
  readonly datePicker: Locator;
  readonly timePicker: Locator;
  readonly bookingConfirmationMessage: Locator;
  readonly appointmentDetails: Locator;
  readonly bookedGymName: Locator;
  readonly seeYouSoonLabel: Locator;
  readonly weGotItHeading: Locator;
  readonly bookingConfirmationHeading: Locator;
  readonly addToCalendarBtn: Locator;
  readonly addToCalendarAppleBtn: Locator;
  readonly addToCalendarGoogleBtn: Locator;
  readonly addToCalendarOutlookBtn: Locator;
  readonly reserveTimeBtn: Locator;
  readonly inviteAFriendSection: Locator;
  readonly inviteAFriendButton: Locator;
  readonly sendTrialPassBtn: Locator;

  constructor(page: Page, iframeId: string) {
    super(page);
    this.iframeElement = page.locator(`#${iframeId}`);
    this.iframe = this.getIframeById(iframeId);
    this.dateRequiredFieldMessage = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="class-schedule-day-error"]',
    );
    this.timeRequiredFieldMessage = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="class-schedule-time-error"]',
    );
    this.letsDoThisBtn = this.iframe.getByRole('button', { name: "LET'S DO THIS" });
    this.timeSlotMessage = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="available-time-slots-message"]',
    );
    // SIT now renders date/time options inside <fieldset aria-labelledby="..."> (was <div>).
    // Use attribute-only selectors so both markup variants resolve.
    this.datePicker = this.locateElementInsideIframe(
      this.iframe,
      '[aria-labelledby="date-selection-label"] button',
    );
    this.timePicker = this.locateElementInsideIframe(
      this.iframe,
      '[aria-labelledby="time-selection-label"] button',
    );
    this.bookingConfirmationMessage = this.locateElementInsideIframe(
      this.iframe,
      '#banner-title + p',
    );
    this.appointmentDetails = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="see-you-soon-datetime"]',
    );
    this.bookedGymName = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="location-address"]',
    );
    this.seeYouSoonLabel = this.iframe.getByRole('heading', { name: /SEE YOU SOON/i });
    this.weGotItHeading = this.iframe.getByRole('heading', { name: 'WE GOT IT' });
    // AFW-3811 Book a Visit: confirmation may keep SEE YOU SOON, or surface YOUR SPOT IS SAVED /
    // visit body / datetime / ADD TO CALENDAR without the legacy heading — accept all signals.
    this.bookingConfirmationHeading = this.iframe
      .locator('#banner-title')
      .filter({
        hasText: /SEE YOU SOON|WE GOT IT|YOUR SPOT IS SAVED|YOUR VISIT HAS BEEN SCHEDULED/i,
      })
      .or(this.seeYouSoonLabel)
      .or(this.weGotItHeading)
      .or(this.iframe.getByText(/your spot is saved/i))
      .or(this.iframe.locator('[data-testid="see-you-soon-datetime"]'))
      .or(this.iframe.getByRole('button', { name: 'ADD TO CALENDAR' }))
      .first();
    this.addToCalendarBtn = this.iframe.getByRole('button', { name: 'ADD TO CALENDAR' });
    this.addToCalendarAppleBtn = this.iframe.getByRole('button', { name: 'Apple' });
    this.addToCalendarGoogleBtn = this.iframe.getByRole('button', { name: 'Google' });
    this.addToCalendarOutlookBtn = this.iframe.getByRole('button', { name: 'Outlook' });
    this.reserveTimeBtn = this.iframe.getByRole('button', { name: 'RESERVE TIME' });
    this.inviteAFriendSection = this.locateElementInsideIframe(
      this.iframe,
      'section[aria-labelledby="invite-heading"]',
    );
    this.inviteAFriendButton = this.locateElementInsideIframe(
      this.iframe,
      '/html/body/div[2]/section[2]/div[1]/button',
    );
    const sendTrialPassLabel = t(TranslationKeys.Buttons.SeeYouSoonPage.SendTrialPass);
    this.sendTrialPassBtn = this.iframe
      .getByRole('button', {
        name: new RegExp(
          `${sendTrialPassLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|send invitation|share trial pass|send trial pass`,
          'i',
        ),
      })
      .first();
  }

  private getIframeScrollOptions() {
    return { parentLocator: this.iframeElement, maxAttempts: 8 };
  }

  async waitForBookingConfirmationScreen(timeout: number = TIMEOUTS.LONG): Promise<void> {
    await this.iframeElement.waitFor({ state: 'attached', timeout }).catch(() => {});
    await this.iframeElement.waitFor({ state: 'visible', timeout }).catch(() => {});
    // Prefer confirmation signals that survive Book a Visit copy drift (AFW-3811).
    try {
      await Promise.any([
        this.waitForVisible(this.bookingConfirmationHeading, timeout).then(() => true),
        this.waitForVisible(this.addToCalendarBtn, timeout).then(() => true),
        this.waitForVisible(
          this.iframe.locator('[data-testid="see-you-soon-datetime"]'),
          timeout,
        ).then(() => true),
        this.waitForVisible(this.iframe.getByText(/your spot is saved/i).first(), timeout).then(
          () => true,
        ),
      ]);
    } catch {
      throw new Error(
        `Booking confirmation screen not visible in #${await this.iframeElement
          .getAttribute('id')
          .catch(() => 'unknown-iframe')} (url=${this.page.url()})`,
      );
    }
  }

  async waitForSchedulePickerReady(timeout: number = TIMEOUTS.LONG): Promise<void> {
    await this.iframeElement.waitFor({ state: 'attached', timeout });
    await this.iframeElement.waitFor({ state: 'visible', timeout });
    await this.page.waitForTimeout(500);
    await this.waitForVisible(this.datePicker.first(), timeout);
  }

  async scrollSchedulePickerIntoView(): Promise<void> {
    await this.waitForSchedulePickerReady();
    const dateSection = this.iframe.locator('[aria-labelledby="date-selection-label"]');
    const timeSection = this.iframe.locator('[aria-labelledby="time-selection-label"]');

    // Do not center the whole #book-a-tour-iframe — on mobile it is taller than the
    // viewport, and WebKit evaluate-after-408 can hang forever trying to center it.
    await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});
    await dateSection.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    await this.ensureButtonInIframeViewport(this.datePicker.first()).catch(() => {});
    await this.scrollElementInFrame(dateSection).catch(() => {});
    await timeSection.waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT }).catch(() => {});
    await this.scrollElementInFrame(timeSection).catch(() => {});

    if (await Helpers.isMobileDevice(this.page).catch(() => false)) {
      await this.page.waitForTimeout(400);
    }
  }

  private async ensureButtonInIframeViewport(button: Locator): Promise<void> {
    await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.page.waitForTimeout(200);

    await button.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await this.waitForVisible(button, TIMEOUTS.MEDIUM);

    const scrollOptions = this.getIframeScrollOptions();
    await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});
    // Scroll the date/time control inside the iframe — never the tall host iframe itself.
    await this.scrollIntoViewWithRetry(button, scrollOptions);
    await this.scrollIntoViewIfWebkit(this.iframeElement, button);
    await button.scrollIntoViewIfNeeded({ timeout: TIMEOUTS.SHORT }).catch(() => {});

    await this.page.waitForTimeout(200);
  }

  async getClubIdFromCurrentUrl(page: Page): Promise<string> {
    const currentUrl = page.url();
    const urlObj = new URL(currentUrl);
    const clubId = urlObj.searchParams.get('location_id');

    if (!clubId) {
      throw new Error('location_id parameter not found in the current URL');
    }

    return clubId;
  }

  private resolveScheduleButton(pageName: string): Locator {
    const buttonMap: Record<string, Locator> = {
      [AppPages.TRY_US_FREE]: this.letsDoThisBtn,
      [AppPages.TRY_US_FREE_APPLE_FITNESS_FREE_TRIAL]: this.reserveTimeBtn,
      [AppPages.TRY_US_FREE_APPLE_FITNESS_PLUS_SUBSCRIBER]: this.reserveTimeBtn,
      [AppPages.BOOK_A_TOUR_STANDALONE]: this.letsDoThisBtn,
      [AppPages.LOCAL_OFFER]: this.letsDoThisBtn,
      [AppPages.GLOBAL_OFFER]: this.letsDoThisBtn,
      [AppPages.MEMBER_OFFER]: this.letsDoThisBtn,
      [AppPages.MEMBERSHIP_INQUIRY]: this.letsDoThisBtn,
      [AppPages.EVENTS_FREE_TRIAL_PASS]: this.letsDoThisBtn,
      [AppPages.EVENTS_TRAIN_FOR_YOUR_LIFE]: this.letsDoThisBtn,
      [AppPages.EVENTS_FIND_YOUR_FITPHORIA]: this.letsDoThisBtn,
      [AppPages.EVENTS_PROMO]: this.letsDoThisBtn,
      [AppPages.EVENTS_BOOK_A_TOUR]: this.letsDoThisBtn,
      [AppPages.INVITE_A_FRIEND]: this.letsDoThisBtn,
    };

    const button = buttonMap[pageName];
    if (!button) {
      throw new Error(`No button mapped for page: "${pageName}"`);
    }
    return button;
  }

  async isScheduleButtonVisible(
    pageName: string,
    timeout: number = TIMEOUTS.MEDIUM,
  ): Promise<boolean> {
    try {
      const button = this.resolveScheduleButton(pageName);
      await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
      await button.waitFor({ state: 'visible', timeout });
      return await button.isVisible();
    } catch {
      return false;
    }
  }

  async clickScheduleButton(
    pageName: string,
    options?: { allowDisabled?: boolean },
  ): Promise<void> {
    const button = this.resolveScheduleButton(pageName);

    await this.waitForSchedulePickerReady();

    if (!(await this.isScheduleButtonVisible(pageName, TIMEOUTS.LONG))) {
      throw new Error(`Schedule button is not visible for page: "${pageName}"`);
    }

    const isMobile = await Helpers.isMobileDevice(this.page);
    const needsForceClick = isMobile || this.getBrowserName() === 'webkit';
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.ensureButtonInIframeViewport(button);

      if (await button.isDisabled()) {
        if (options?.allowDisabled) {
          await this.forceClick(button);
          await this.page.waitForTimeout(TIMEOUTS.SHORT);
          return;
        }

        await this.page.waitForTimeout(1000);
        if (attempt === maxAttempts) {
          throw new Error(
            `Schedule button remained disabled for page: "${pageName}". Ensure date and time are selected.`,
          );
        }
        continue;
      }

      try {
        if (needsForceClick) {
          await this.forceClick(button);
        } else {
          await button.click({ timeout: TIMEOUTS.LONG });
        }
        await this.page.waitForTimeout(TIMEOUTS.SHORT);
        return;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        await this.page.waitForTimeout(500);
      }
    }
  }

  async selectDateTimeAndConfirm(
    pageName: string,
  ): Promise<{ dateText: string; timeText: string }> {
    const selection = await this.selectRandomDateAndTime();
    await this.clickScheduleButton(pageName);
    return selection;
  }

  private getQRLocators(qrLabel: string): { qrLocator: Locator; headingLocator: Locator } {
    return {
      qrLocator: this.locateElementInsideIframe(this.iframe, `svg[aria-label*="${qrLabel}"]`),
      headingLocator: this.locateElementInsideIframe(this.iframe, `h3:has-text("${qrLabel}")`),
    };
  }

  private async ensureElementInIframeViewport(element: Locator): Promise<void> {
    await element.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await this.waitForVisible(element, TIMEOUTS.LONG);

    const scrollOptions = this.getIframeScrollOptions();
    await this.scrollParentIntoViewOnPage(this.iframeElement);
    await this.scrollIntoViewWithRetry(this.iframeElement, { maxAttempts: 8 });
    await this.scrollIntoViewWithRetry(element, scrollOptions);
    await this.scrollIntoViewIfWebkit(this.iframeElement, element);
    await element.scrollIntoViewIfNeeded({ timeout: TIMEOUTS.MEDIUM }).catch(() => {});
  }

  private async ensureQRInIframeViewport(
    qrLabel: string,
  ): Promise<{ qrLocator: Locator; headingLocator: Locator }> {
    const { qrLocator, headingLocator } = this.getQRLocators(qrLabel);

    await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await this.page.waitForTimeout(500);

    await this.ensureElementInIframeViewport(qrLocator);
    await this.ensureElementInIframeViewport(headingLocator);
    await this.page.waitForTimeout(300);

    return { qrLocator, headingLocator };
  }

  async waitForQRCodeVisible(qrLabel: string): Promise<void> {
    const { qrLocator, headingLocator } = await this.ensureQRInIframeViewport(qrLabel);
    await qrLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await headingLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
  }

  async isQRDisplayed(qrLabel: string): Promise<boolean> {
    try {
      const { qrLocator } = await this.ensureQRInIframeViewport(qrLabel);
      return await qrLocator.isVisible();
    } catch {
      return false;
    }
  }

  async isQRTextVisible(qrLabel: string): Promise<boolean> {
    try {
      const { headingLocator } = await this.ensureQRInIframeViewport(qrLabel);
      return await headingLocator.isVisible();
    } catch {
      return false;
    }
  }

  async waitForButtonDisplayed(buttonLabel: string): Promise<Locator> {
    await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await this.page.waitForTimeout(500);

    const buttonLocator = this.iframe.getByRole('button', { name: buttonLabel });
    await this.ensureButtonInIframeViewport(buttonLocator);
    await buttonLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await this.page.waitForTimeout(300);

    return buttonLocator;
  }

  async isButtonDisplayed(buttonLabel: string): Promise<boolean> {
    try {
      const buttonLocator = await this.waitForButtonDisplayed(buttonLabel);
      return await buttonLocator.isVisible();
    } catch {
      return false;
    }
  }

  async getAllAvailableDates(): Promise<Locator[]> {
    const count = await this.datePicker.count();
    const visibleButtons: Locator[] = [];
    for (let i = 0; i < count; i++) {
      const btn = this.datePicker.nth(i);
      if (await btn.isVisible()) visibleButtons.push(btn);
    }
    return visibleButtons;
  }

  async getAllAvailableTimes(): Promise<Locator[]> {
    const count = await this.timePicker.count();
    const visibleButtons: Locator[] = [];
    for (let i = 0; i < count; i++) {
      const btn = this.timePicker.nth(i);
      if (await btn.isVisible()) visibleButtons.push(btn);
    }
    return visibleButtons;
  }

  async selectDate(button: Locator) {
    await this.selectSchedulePickerOption(button);
    await this.waitForVisible(this.timePicker.first(), TIMEOUTS.LONG);
  }

  async selectTime(button: Locator) {
    await this.selectSchedulePickerOption(button);
  }

  private async isScheduleOptionSelected(button: Locator): Promise<boolean> {
    return button.evaluate(el => {
      const ariaPressed = el.getAttribute('aria-pressed');
      const ariaChecked = el.getAttribute('aria-checked');
      const dataState = el.getAttribute('data-state');
      const ariaCurrent = el.getAttribute('aria-current');
      return (
        ariaPressed === 'true' ||
        ariaChecked === 'true' ||
        dataState === 'on' ||
        dataState === 'checked' ||
        ariaCurrent === 'true' ||
        ariaCurrent === 'date' ||
        el.classList.contains('Mui-selected') ||
        el.getAttribute('data-selected') === 'true'
      );
    });
  }

  async getSelectedScheduleOption(picker: Locator): Promise<Locator | null> {
    const count = await picker.count();
    for (let i = 0; i < count; i++) {
      const btn = picker.nth(i);
      if (!(await btn.isVisible().catch(() => false))) {
        continue;
      }
      if (await this.isScheduleOptionSelected(btn)) {
        return btn;
      }
    }
    return null;
  }

  async expectDateAndTimeSelected(expected?: {
    dateText?: string;
    timeText?: string;
  }): Promise<void> {
    await expect
      .poll(async () => (await this.getSelectedScheduleOption(this.datePicker)) !== null, {
        timeout: TIMEOUTS.MEDIUM,
      })
      .toBeTruthy();
    await expect
      .poll(async () => (await this.getSelectedScheduleOption(this.timePicker)) !== null, {
        timeout: TIMEOUTS.MEDIUM,
      })
      .toBeTruthy();

    const selectedDate = await this.getSelectedScheduleOption(this.datePicker);
    const selectedTime = await this.getSelectedScheduleOption(this.timePicker);
    if (!selectedDate || !selectedTime) {
      throw new Error('Date and/or time were not selected in the schedule picker');
    }

    if (expected?.dateText) {
      expect(Helpers.normalizeText(await this.getText(selectedDate))).toContain(
        Helpers.normalizeText(expected.dateText),
      );
    }
    if (expected?.timeText) {
      expect(Helpers.normalizeText(await this.getText(selectedTime))).toContain(
        Helpers.normalizeText(expected.timeText),
      );
    }
  }

  async selectRandomDateAndTime(): Promise<{ dateText: string; timeText: string }> {
    await this.waitForSchedulePickerReady();
    await this.scrollSchedulePickerIntoView();

    const availableDates = await this.getAllAvailableDates();
    if (!availableDates.length) {
      throw new Error('No available dates found');
    }

    const randomDate = Helpers.getRandomElement(availableDates);
    await this.selectDate(randomDate);

    const availableTimes = await this.getAllAvailableTimes();
    if (!availableTimes.length) {
      throw new Error('No available time slots found');
    }

    const randomTime = Helpers.getRandomElement(availableTimes);
    await this.selectTime(randomTime);

    return {
      dateText: await this.getText(randomDate),
      timeText: await this.getText(randomTime),
    };
  }

  private async selectSchedulePickerOption(button: Locator): Promise<void> {
    const isMobile = await Helpers.isMobileDevice(this.page);
    const needsForceClick = isMobile || this.getBrowserName() === 'webkit';
    const maxAttempts = 4;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.ensureButtonInIframeViewport(button);

      try {
        if (needsForceClick) {
          await this.forceClick(button);
        } else {
          await button.click({ timeout: TIMEOUTS.LONG });
        }
        return;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }

        await this.scrollElementInFrame(button);
        await this.page.waitForTimeout(400);
      }
    }
  }

  async isErrorMessageVisible(message: string): Promise<boolean> {
    const errorLocator = this.iframe.locator(`text=${message}`);
    return errorLocator.isVisible();
  }

  async clickSendTrialPass(): Promise<void> {
    await this.waitForVisible(this.sendTrialPassBtn, TIMEOUTS.LONG);
    await this.click(this.sendTrialPassBtn);
  }

  async clickAddToCalendarButton(): Promise<void> {
    const button = await this.waitForButtonDisplayed('ADD TO CALENDAR');
    const needsForceClick =
      (await Helpers.isMobileDevice(this.page)) || this.getBrowserName() === 'webkit';

    if (needsForceClick) {
      await this.forceClick(button);
      return;
    }

    await button.click({ timeout: TIMEOUTS.LONG });
  }

  /** Expand iframe + scroll calendar menu options into the host viewport (iPhone Safari). */
  async prepareCalendarOptionsForInteraction(): Promise<void> {
    await this.expandBookATourIframeHeight().catch(() => {});
    await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});
    await this.ensureButtonInIframeViewport(this.addToCalendarGoogleBtn).catch(() => {});
    await this.scrollElementInFrame(this.addToCalendarGoogleBtn).catch(() => {});
  }

  /**
   * Opens Google Calendar from the confirmation "Add to Calendar" menu.
   *
   * AddToCalendar (shared lib) calls `window.open(calendarUrl, "_blank")` with no href on the
   * Google button. iPhone Safari / WebKit often blocks iframe popups; page.mouse.click can also
   * miss the iframe control and trip the menu's mousedown-outside closer. Prefer DOM click inside
   * the iframe, capture the window.open URL, then open it via context.newPage().
   */
  async openGoogleCalendarInNewTab(context: BrowserContext): Promise<Page> {
    const googleBtn = this.addToCalendarGoogleBtn;
    const maxRetries = 3;
    const isMobile = await Helpers.isMobileDevice(this.page).catch(() => false);
    const isWebkit = this.getBrowserName() === 'webkit';
    const captureOnly = isMobile || isWebkit;

    await this.ensureGoogleCalendarOptionVisible();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const mainPage = this.page;
      const stalePages = context.pages().filter(openPage => openPage !== mainPage);
      for (const stalePage of stalePages) {
        await stalePage.close().catch(() => {});
      }

      await this.clearCapturedGoogleCalendarUrls().catch(() => {});
      await this.patchWindowOpenCapture(captureOnly).catch(() => {});
      await this.prepareCalendarOptionsForInteraction().catch(() => {});

      const popupTimeout = captureOnly ? 5000 : TIMEOUTS.LONG;
      const popupPromise = captureOnly
        ? Promise.resolve(null)
        : context.waitForEvent('page', { timeout: popupTimeout }).catch(() => null);

      await this.activateGoogleCalendarOption(googleBtn, captureOnly);
      await this.page.waitForTimeout(400);

      const popup = await popupPromise;
      if (popup) {
        await popup.waitForLoadState('domcontentloaded').catch(() => {});
        return popup;
      }

      if (GOOGLE_CALENDAR_URL_RE.test(mainPage.url())) {
        return mainPage;
      }

      const capturedUrl = await this.waitForCapturedGoogleCalendarUrl(captureOnly ? 2000 : 500);
      if (capturedUrl) {
        const newPage = await context.newPage();
        await newPage.goto(capturedUrl, { waitUntil: 'domcontentloaded' });
        return newPage;
      }

      const href =
        (await this.resolveGoogleCalendarHref()) || (await this.findGoogleCalendarAnchorHref());
      if (href) {
        const newPage = await context.newPage();
        await newPage.goto(href, { waitUntil: 'domcontentloaded' });
        return newPage;
      }

      if (attempt === maxRetries) {
        break;
      }

      // Re-open only if the menu closed — never toggle-close an already-open menu.
      await this.ensureGoogleCalendarOptionVisible();
    }

    throw new Error('Google Calendar did not open in a new tab after retries');
  }

  private async ensureGoogleCalendarOptionVisible(): Promise<void> {
    if (await this.addToCalendarGoogleBtn.isVisible().catch(() => false)) {
      return;
    }
    await this.clickAddToCalendarButton();
    await expect(this.addToCalendarGoogleBtn).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  private async expandBookATourIframeHeight(): Promise<void> {
    await this.iframeElement
      .evaluate(iframeEl => {
        const iframe = iframeEl as HTMLIFrameElement;
        const doc = iframe.contentDocument;
        if (!doc?.body) return;
        const height = Math.max(
          doc.body.scrollHeight,
          doc.documentElement?.scrollHeight ?? 0,
          doc.body.offsetHeight,
        );
        iframe.style.height = `${height + 48}px`;
      })
      .catch(() => {});
    await this.page.waitForTimeout(200);
  }

  private async activateGoogleCalendarOption(
    googleBtn: Locator,
    preferDomClick: boolean,
  ): Promise<void> {
    // DOM click inside the iframe fires React onClick → window.open. Avoid page.mouse.click:
    // AddToCalendar closes on mousedown outside its ref, and host-viewport coords are unreliable
    // for iframe menu items on iPhone Safari.
    if (preferDomClick) {
      await this.forceClick(googleBtn);
      return;
    }

    await googleBtn.click({ timeout: TIMEOUTS.MEDIUM });
  }

  /**
   * Patch window.open in the book-a-tour iframe (and siblings).
   * When captureOnly is true (mobile/WebKit), swallow the real popup and only record the URL.
   */
  private async patchWindowOpenCapture(captureOnly = false): Promise<void> {
    const patchFn = (...args: unknown[]) => {
      const onlyCapture = typeof args[0] === 'boolean' ? args[0] : Boolean(args[1]);
      const win = window as Window & {
        __afOpenedUrls?: string[];
        __afOpenPatched?: boolean;
        __afOpenCaptureOnly?: boolean;
      };
      win.__afOpenedUrls = win.__afOpenedUrls || [];

      // Re-patch when capture mode changes between desktop/mobile paths.
      if (win.__afOpenPatched && win.__afOpenCaptureOnly === onlyCapture) {
        return;
      }

      const record = (url: string) => {
        if (url && /calendar\.google\.com/i.test(url)) {
          win.__afOpenedUrls!.push(url);
        }
      };

      const originalOpen =
        (win as Window & { __afOriginalOpen?: typeof window.open }).__afOriginalOpen ||
        window.open.bind(window);
      (win as Window & { __afOriginalOpen?: typeof window.open }).__afOriginalOpen = originalOpen;

      window.open = ((...args: Parameters<typeof window.open>) => {
        record(String(args[0] ?? ''));
        if (onlyCapture) {
          return null;
        }
        return originalOpen(...args);
      }) as typeof window.open;

      win.__afOpenPatched = true;
      win.__afOpenCaptureOnly = onlyCapture;
    };

    // Prefer the BAT iframe body — guaranteed same document as the Google button.
    await this.iframe
      .locator('body')
      .evaluate(
        patchFn as (el: HTMLElement | SVGElement, onlyCapture: boolean) => void,
        captureOnly,
      )
      .catch(() => {});

    // Confirmation remounts can detach frames mid-loop (Android/WebKit AFP).
    for (const frame of this.page.frames()) {
      if (frame.isDetached()) continue;
      await frame.evaluate(patchFn as (onlyCapture: boolean) => void, captureOnly).catch(() => {});
    }
  }

  private async clearCapturedGoogleCalendarUrls(): Promise<void> {
    await this.iframe
      .locator('body')
      .evaluate(() => {
        (window as Window & { __afOpenedUrls?: string[] }).__afOpenedUrls = [];
      })
      .catch(() => {});
    for (const frame of this.page.frames()) {
      if (frame.isDetached()) continue;
      await frame
        .evaluate(() => {
          (window as Window & { __afOpenedUrls?: string[] }).__afOpenedUrls = [];
        })
        .catch(() => {});
    }
  }

  private async getCapturedGoogleCalendarUrl(): Promise<string | null> {
    const fromIframe = await this.iframe
      .locator('body')
      .evaluate(() => {
        const win = window as Window & { __afOpenedUrls?: string[] };
        return win.__afOpenedUrls ?? [];
      })
      .catch(() => [] as string[]);
    const iframeMatch = fromIframe.find(url => GOOGLE_CALENDAR_URL_RE.test(url));
    if (iframeMatch) return iframeMatch;

    for (const frame of this.page.frames()) {
      const urls = await frame
        .evaluate(() => {
          const win = window as Window & { __afOpenedUrls?: string[] };
          return win.__afOpenedUrls ?? [];
        })
        .catch(() => [] as string[]);
      const match = urls.find(url => GOOGLE_CALENDAR_URL_RE.test(url));
      if (match) return match;
    }
    return null;
  }

  private async waitForCapturedGoogleCalendarUrl(timeoutMs: number): Promise<string | null> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const url = await this.getCapturedGoogleCalendarUrl();
      if (url) return url;
      await this.page.waitForTimeout(100);
    }
    return this.getCapturedGoogleCalendarUrl();
  }

  private async resolveGoogleCalendarHref(): Promise<string | null> {
    const href = await this.addToCalendarGoogleBtn
      .evaluate(el => {
        const asEl = el as HTMLElement;
        const anchor =
          (asEl.closest('a') as HTMLAnchorElement | null) ||
          (asEl.tagName === 'A' ? (asEl as HTMLAnchorElement) : null) ||
          (asEl.querySelector('a') as HTMLAnchorElement | null);
        return (
          anchor?.getAttribute('href') ||
          asEl.getAttribute('href') ||
          asEl.getAttribute('data-url') ||
          asEl.getAttribute('data-href') ||
          ''
        );
      })
      .catch(() => '');

    if (GOOGLE_CALENDAR_URL_RE.test(href)) {
      return new URL(href, this.page.url()).href;
    }
    return null;
  }

  private async findGoogleCalendarAnchorHref(): Promise<string | null> {
    const href = await this.iframe
      .locator('a[href*="calendar.google.com"]')
      .first()
      .getAttribute('href', { timeout: 3000 })
      .catch(() => null);
    if (href && GOOGLE_CALENDAR_URL_RE.test(href)) {
      return new URL(href, this.page.url()).href;
    }
    return null;
  }
}
