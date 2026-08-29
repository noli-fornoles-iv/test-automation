import { expect, FrameLocator, Locator, Page } from '@playwright/test';
import { BookATourPage } from '@pages/common/BookATourPage';
import { LocationSearchPage } from '@pages/common/LocationSearchPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { TIMEOUTS } from '@utils/constants';
import { Helpers } from '@utils/helpers';
import { t } from '@utils/locale-utils/locale-manager';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';

export class ReferralLandingPage {
  readonly page: Page;
  readonly locationSearch: LocationSearchPage;
  readonly userForm: UserFormPage;
  /**
   * Schedule picker in the invite lead-form SPA iframe (`#try-us-free-iframe`).
   * Connected/non-member invite landings often keep the date picker here after submit.
   */
  readonly formSchedule: BookATourPage;
  /**
   * Schedule picker in the dedicated BAT iframe (`#book-a-tour-iframe`).
   * Some SIT remounts put the picker here after lead-capture (same as TUF/Events).
   */
  readonly batSchedule: BookATourPage;
  /**
   * Active schedule page object. Defaults to form iframe; updated by
   * {@link waitForScheduleReady} / {@link resolveSchedulePage}.
   */
  bookATour: BookATourPage;
  readonly iframe: FrameLocator;
  readonly iframeElement: Locator;
  readonly hero: Locator;
  readonly formHeading: Locator;
  readonly formDescription: Locator;
  readonly mobilePhone: Locator;
  readonly termsAcceptedCheckbox: Locator;
  readonly gymName: Locator;
  readonly gymAddressLine1: Locator;
  readonly locationLinkIcon: Locator;
  readonly benefitLocators: Locator[];

  constructor(page: Page) {
    this.page = page;
    this.locationSearch = new LocationSearchPage(page, 'try-us-free-iframe');
    this.userForm = new UserFormPage(page, 'try-us-free-iframe');
    this.formSchedule = new BookATourPage(page, 'try-us-free-iframe');
    this.batSchedule = new BookATourPage(page, 'book-a-tour-iframe');
    this.bookATour = this.formSchedule;
    this.iframe = page.frameLocator('#try-us-free-iframe');
    this.iframeElement = page.locator('#try-us-free-iframe');
    this.hero = page.getByText(
      new RegExp(`${this.escapeRegExp(t(TranslationKeys.Texts.ReferralLanding.Hero))}\\.?`, 'i'),
    );
    this.formHeading = this.iframe.getByText(t(TranslationKeys.Texts.ReferralLanding.FormHeading), {
      exact: true,
    });
    this.formDescription = this.iframe.getByText(
      t(TranslationKeys.Texts.ReferralLanding.FormDescription),
    );
    this.mobilePhone = this.iframe.getByRole('textbox', { name: /mobile phone|phone/i });
    this.termsAcceptedCheckbox = this.userForm.consentCheckbox;
    this.gymName = this.iframe.locator('[data-testid="location-name"]');
    this.gymAddressLine1 = this.iframe.locator('[data-testid="location-address-line-1"]');
    this.locationLinkIcon = this.iframe
      .locator(
        '[data-testid="location-name"] a, [data-testid="location-link"], a[href*="/gym"], a[aria-label*="location" i], a[aria-label*="gym" i]',
      )
      .or(this.iframe.locator('a').filter({ has: this.gymName }).first())
      .first();
    this.benefitLocators = [
      TranslationKeys.Texts.ReferralLanding.Benefits.UnlimitedAccess,
      TranslationKeys.Texts.ReferralLanding.Benefits.PersonalizedPlan,
      TranslationKeys.Texts.ReferralLanding.Benefits.Community,
      TranslationKeys.Texts.ReferralLanding.Benefits.GymAccess,
      TranslationKeys.Texts.ReferralLanding.Benefits.Training,
    ].map(key => this.iframe.getByText(this.getBenefitPattern(t(key))));
  }

  private getBenefitPattern(benefitText: string): RegExp {
    if (/5,?000/.test(benefitText)) {
      return /5[,.]?000.*gym/i;
    }

    return new RegExp(this.escapeRegExp(benefitText), 'i');
  }

  getMemberInvitationHeading(memberName: string): Locator {
    const invitationHeading = t(TranslationKeys.Texts.ReferralLanding.InvitationHeading);
    return this.iframe.getByText(
      new RegExp(`${this.escapeRegExp(memberName)}.*${this.escapeRegExp(invitationHeading)}`, 'i'),
    );
  }

  getInvitationDescription(memberName: string): Locator {
    return this.iframe.getByText(
      new RegExp(`${this.escapeRegExp(memberName)}.*invited you`, 'i'),
    );
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async resolveMarketingConsentCheckbox(): Promise<Locator> {
    const candidates = [
      this.userForm.consentCheckbox,
      this.userForm.washingtonTextConsentCheckbox,
      this.userForm.washingtonEmailConsentCheckbox,
      this.iframe.locator('input[type="checkbox"][name="termsAccepted"]'),
    ];

    for (const candidate of candidates) {
      if ((await candidate.count()) > 0 && (await candidate.isVisible().catch(() => false))) {
        return candidate;
      }
    }

    return this.userForm.consentCheckbox;
  }

  private async setCheckboxState(checkbox: Locator, checked: boolean): Promise<void> {
    await this.userForm.scrollConsentIntoView(checkbox);
    await this.userForm.ensureLocatorInIframeViewport(checkbox);

    if ((await checkbox.isChecked()) === checked) {
      return;
    }

    const needsForce =
      (await Helpers.isMobileDevice(this.page)) || this.userForm.getBrowserName() === 'webkit';
    const strategies: Array<() => Promise<void>> = checked
      ? [
          async () => {
            await checkbox.check({ force: needsForce, timeout: TIMEOUTS.LONG });
          },
          async () => {
            await checkbox.evaluate((el: HTMLInputElement) => el.click());
          },
        ]
      : [
          async () => {
            await checkbox.uncheck({ force: needsForce, timeout: TIMEOUTS.LONG });
          },
          async () => {
            await checkbox.evaluate((el: HTMLInputElement) => {
              el.checked = false;
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            });
          },
        ];

    for (const strategy of strategies) {
      try {
        await strategy();
      } catch {
        // try next strategy
      }

      if ((await checkbox.isChecked()) === checked) {
        return;
      }
    }
  }

  async waitForPageReady(): Promise<void> {
    await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await this.userForm.waitForFormReady();
  }

  /**
   * Wait until the schedule date picker is visible in either invite iframe
   * (`#try-us-free-iframe` or `#book-a-tour-iframe`). Same dual-resolve as TUF.
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
   * See You Soon confirmation may render in either invite iframe after booking.
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

  async ensureBenefitsInViewport(): Promise<void> {
    await this.userForm.scrollIntoView(this.iframeElement);
    await this.userForm.scrollIntoViewIfWebkit(this.iframeElement, this.benefitLocators[0]);
  }

  async checkTermsAcceptedCheckbox(): Promise<void> {
    await this.userForm.checkLocalResidentCheckbox();

    const marketingCheckbox = await this.resolveMarketingConsentCheckbox();
    if (await marketingCheckbox.isVisible().catch(() => false)) {
      await this.setCheckboxState(marketingCheckbox, true);
    }
  }

  async uncheckTermsAcceptedCheckbox(): Promise<void> {
    await this.waitForPageReady();

    if ((await this.userForm.localResidentCheckbox.count()) > 0) {
      await this.userForm.uncheckLocalResidentCheckbox();
      return;
    }

    await this.setCheckboxState(await this.resolveMarketingConsentCheckbox(), false);
  }

  async fillReferralForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    zipCode: string;
  }): Promise<void> {
    await this.waitForPageReady();
    // Reuse UserForm filler so intl-tel-input gets national digits (not raw E.164).
    await this.userForm.fillAndSubmitForm(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        zipCode: formData.zipCode,
      },
      false,
      { skipWaitForReady: true },
    );
  }

  async submitForm(): Promise<void> {
    await this.userForm.scrollConsentIntoView(this.userForm.submitBtn);
    await this.userForm.ensureLocatorInIframeViewport(this.userForm.submitBtn);
    await this.userForm.clickSubmitButton({ ensureRequiredCheckboxes: false });
  }

  async isTermsAcceptedErrorDisplayed(): Promise<boolean> {
    const consentMessage = t(TranslationKeys.Errors.UserForm.RequiredField.Consent);
    const localResidentMessage = t(TranslationKeys.Errors.UserForm.RequiredField.LocalResident);
    const expectedMessages = [consentMessage, localResidentMessage];

    if (await this.userForm.isErrorMessageDisplayed('isLocalResident', localResidentMessage)) {
      return true;
    }

    const marketingFields = ['termsAccepted', 'promotionalOffersText', 'marketingEmails'];
    for (const field of marketingFields) {
      for (const message of expectedMessages) {
        if (await this.userForm.isErrorMessageDisplayed(field, message)) {
          return true;
        }
      }
    }

    const errorLocators = [
      this.iframe.locator('#isLocalResident-error'),
      this.iframe.locator('#termsAccepted-error'),
      this.iframe.locator('#promotionalOffersText-error'),
      this.iframe.locator('#marketingEmails-error'),
    ];

    for (const locator of errorLocators) {
      if (!(await locator.isVisible().catch(() => false))) {
        continue;
      }

      const text = (await locator.textContent())?.trim() ?? '';
      if (expectedMessages.some(message => text.includes(message))) {
        return true;
      }
    }

    for (const message of expectedMessages) {
      if (await this.iframe.getByText(message).isVisible().catch(() => false)) {
        return true;
      }
    }

    return false;
  }

  async waitForServerSideError(timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    const expectedMessage = t(TranslationKeys.Errors.UserForm.ServerSide);
    const errorLocators = [
      this.iframe.locator('[data-testid="location-search-error"]'),
      this.iframe.getByText(expectedMessage),
    ];

    await Promise.any(
      errorLocators.map(async locator => {
        await locator.waitFor({ state: 'visible', timeout });
        const text = (await locator.textContent())?.trim() ?? '';
        if (!text.includes(expectedMessage)) {
          throw new Error('A different error message was displayed');
        }
      }),
    );
  }

  async waitForLocationSearchReady(): Promise<void> {
    await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await this.locationSearch.locationSearchInput.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
  }

  async openLocationLocalGymInNewTab(): Promise<Page> {
    await this.waitForPageReady();
    await this.userForm.ensureLocatorInIframeViewport(this.gymName);
    const popupPromise = this.page.waitForEvent('popup', { timeout: TIMEOUTS.LONG });
    await this.locationLinkIcon.click({ timeout: TIMEOUTS.MEDIUM }).catch(async () => {
      await this.gymName.click({ timeout: TIMEOUTS.MEDIUM });
    });
    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded').catch(() => {});
    return popup;
  }

  async assertGymDetailsVisible(): Promise<void> {
    await this.waitForPageReady();
    await expect(this.gymName).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await expect(this.gymAddressLine1).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await expect(this.gymName).not.toBeEmpty();
    await expect(this.gymAddressLine1).not.toBeEmpty();
  }
}
