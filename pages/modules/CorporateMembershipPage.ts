import { expect, FrameLocator, Locator, Page } from '@playwright/test';
import { UserFormPage } from '@pages/common/UserFormPage';
import { TIMEOUTS } from '@utils/constants';
import { Helpers } from '@utils/helpers';
import { t } from '@utils/locale-utils/locale-manager';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';

export class CorporateMembershipPage {
  readonly page: Page;
  readonly userForm: UserFormPage;
  readonly company: Locator;
  readonly iframe: FrameLocator;
  readonly iframeElement: Locator;
  readonly title: Locator;
  readonly department: Locator;
  readonly companyAddress: Locator;
  readonly corporateAuthorityCheckbox: Locator;
  readonly corporateUnderstandingCheckbox: Locator;
  readonly termsAndConditionsCheckbox: Locator;
  readonly corporateAuthorityText: Locator;
  readonly corporateUnderstandingText: Locator;
  readonly termsAndConditionsText: Locator;
  readonly corporateMarketingOptInCheckbox: Locator;
  readonly corporateMarketingOptInText: Locator;
  readonly thankYouHeading: Locator;
  readonly thankYouText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userForm = new UserFormPage(page, 'corporate-membership-iframe');
    this.iframe = page.frameLocator('#corporate-membership-iframe');
    this.iframeElement = page.locator(`#corporate-membership-iframe`);
    // Prefer name= — aria-labels are localized (e.g. TH "บริษัท*" vs EN "Company*").
    this.company = this.iframe.locator('input[name="company"]');
    this.title = this.iframe.locator('input[name="title"]');
    this.department = this.iframe.locator('input[name="department"]');
    this.companyAddress = this.iframe.locator('input[name="companyAddress"]');
    this.corporateAuthorityCheckbox = this.iframe.locator('#corporateAuthority');
    this.corporateUnderstandingCheckbox = this.iframe.locator('#corporateUnderstanding');
    this.termsAndConditionsCheckbox = this.iframe.locator('#corporateTermsAccepted');
    this.corporateAuthorityText = this.iframe.locator('#corporateAuthority-label p');
    this.corporateUnderstandingText = this.iframe.locator('#corporateUnderstanding-label p');
    this.termsAndConditionsText = this.iframe.locator('#corporateTermsAccepted-label p');
    this.corporateMarketingOptInCheckbox = this.iframe.locator('#corporateMarketingOptIn');
    this.corporateMarketingOptInText = this.iframe.locator('#corporateMarketingOptIn-label p');
    // TH thank-you uses "ขอบคุณ!" — English /thank you/ alone misses it.
    this.thankYouHeading = page
      .locator('h1, h2, h3, [role="heading"]')
      .filter({ hasText: /thank\s*you|ขอบคุณ/i })
      .first();
    this.thankYouText = page.locator('#main-content').or(page.locator('main')).first();
  }

  async waitForThankYouPageNavigation(): Promise<void> {
    await this.page.waitForURL(/thank-you/i, { timeout: TIMEOUTS.LONG });
  }

  async waitForCorporateMembershipFormReady(): Promise<void> {
    // Do not use UserFormPage.waitForFormReady() — on tall TH corporate iframes Playwright
    // often reports firstName as attached-but-hidden and burns the suite timeout.
    const readySignals = () =>
      this.company
        .or(this.userForm.firstName)
        .or(this.iframe.locator('button[type="submit"]'))
        .first();

    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.iframeElement
        .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG })
        .catch(() => {});
      await this.page
        .locator('#onetrust-accept-btn-handler')
        .click({ timeout: 3000 })
        .catch(() => {});
      await this.userForm.dismissBlockingOverlays().catch(() => {});
      await this.userForm.scrollIntoView(this.iframeElement).catch(() => {});

      const ready = await readySignals()
        .waitFor({ state: 'attached', timeout: attempt === 3 ? TIMEOUTS.LONG : TIMEOUTS.MEDIUM })
        .then(() => true)
        .catch(() => false);

      if (ready) {
        await this.company
          .or(this.userForm.firstName)
          .first()
          .evaluate((el: HTMLElement) =>
            el.scrollIntoView({ block: 'center', behavior: 'instant' }),
          )
          .catch(() => {});
        // Prefer company when present (corporate-specific field).
        if ((await this.company.count().catch(() => 0)) > 0) {
          await this.company
            .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
            .catch(() => {});
        }
        return;
      }

      // Parallel UAT/SIT loads sometimes leave an empty react iframe shell — remount once.
      if (attempt < 3 && !this.page.isClosed()) {
        await this.page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
        await this.page.waitForTimeout(1500);
      }
    }

    await this.company.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
  }

  /**
   * Type into first/last name without requiring an exact value match (maxlength may truncate).
   * Retries when the iframe remounts mid-fill so long values actually stick before submit.
   */
  async typeIntoNameField(
    field: 'firstName' | 'lastName',
    value: string,
    options?: { skipReadyWait?: boolean },
  ): Promise<void> {
    if (!options?.skipReadyWait) {
      await this.waitForCorporateMembershipFormReady();
    }
    const locator = field === 'firstName' ? this.userForm.firstName : this.userForm.lastName;
    await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await locator
      .evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
      .catch(() => {});

    const setStrategies: Array<() => Promise<void>> = [
      async () => {
        await locator.click({ force: true, timeout: TIMEOUTS.MEDIUM });
        await locator.fill('');
        await locator.fill(value, { force: true });
      },
      async () => {
        await locator.click({ force: true, timeout: TIMEOUTS.MEDIUM });
        await locator.fill('');
        await locator.pressSequentially(value, { delay: 15 });
      },
      async () => {
        await locator.evaluate((el, v) => {
          const input = el as HTMLInputElement;
          const proto = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value',
          )?.set;
          proto?.call(input, v);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }, value);
      },
    ];

    let lastError: unknown;
    for (let attempt = 1; attempt <= 3; attempt++) {
      for (const setValue of setStrategies) {
        try {
          await setValue();
          const current = (await locator.inputValue().catch(() => '')).trim();
          // Max-length scenarios need the oversized value to remain; do not treat truncated/empty as success.
          if (current.length >= value.length || current === value) {
            await locator.blur().catch(() => {});
            return;
          }
        } catch (error) {
          lastError = error;
          if (
            !/Execution context was destroyed|Target closed|Frame was detached|navigating/i.test(
              String(error),
            )
          ) {
            // keep trying other strategies
          }
        }
      }
      await this.page.waitForTimeout(250);
      if (!options?.skipReadyWait) {
        await this.waitForCorporateMembershipFormReady();
      }
    }

    const finalValue = (await locator.inputValue().catch(() => '')).trim();
    throw (
      lastError ??
      new Error(
        `Corporate Membership ${field} did not keep oversized value (len=${finalValue.length}, expected>=${value.length})`,
      )
    );
  }

  private async fillFieldInIframe(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await locator
      .evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
      .catch(() => {});

    const setStrategies: Array<() => Promise<void>> = [
      async () => {
        await locator.click({ force: true, timeout: TIMEOUTS.MEDIUM });
        await locator.fill('');
        await locator.fill(value, { force: true });
      },
      async () => {
        await locator.click({ force: true, timeout: TIMEOUTS.MEDIUM });
        await locator.fill('');
        await locator.pressSequentially(value, { delay: 30 });
      },
      async () => {
        await locator.evaluate((el, v) => {
          const input = el as HTMLInputElement;
          const proto = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value',
          )?.set;
          proto?.call(input, v);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }, value);
      },
    ];

    for (let attempt = 1; attempt <= 3; attempt++) {
      for (const setValue of setStrategies) {
        try {
          await setValue();
        } catch {
          // try next
        }
        if (await this.inputValueMatches(locator, value)) {
          return;
        }
      }
      await this.page.waitForTimeout(150);
    }

    await expect(locator).toHaveValue(value, { timeout: TIMEOUTS.MEDIUM });
  }

  private async inputValueMatches(locator: Locator, value: string): Promise<boolean> {
    const current = (await locator.inputValue().catch(() => '')).trim();
    if (current === value) {
      return true;
    }

    // Phone inputs reformat the value (country code, spaces), so compare digits only.
    const expectedDigits = value.replace(/\D/g, '');
    if (!expectedDigits) {
      return false;
    }
    return current.replace(/\D/g, '').endsWith(expectedDigits);
  }

  private async scrollCheckboxIntoView(checkbox: Locator): Promise<void> {
    await this.userForm.scrollIntoView(this.iframeElement);
    await this.userForm.scrollIntoViewIfWebkit(this.iframeElement, checkbox);

    await this.iframe
      .locator('body')
      .first()
      .evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
        document.documentElement.scrollTop = document.body.scrollHeight;
      })
      .catch(() => {});

    await this.userForm.scrollIntoViewWithRetry(checkbox, {
      parentLocator: this.iframeElement,
      maxAttempts: 8,
    });
    await this.userForm.scrollIntoViewIfWebkit(this.iframeElement, checkbox);
    await this.userForm.ensureLocatorInIframeViewport(checkbox);
  }

  private async clickCheckboxInIframe(checkbox: Locator): Promise<void> {
    await this.scrollCheckboxIntoView(checkbox);

    if (await checkbox.isChecked()) {
      return;
    }

    const isMobile = await Helpers.isMobileDevice(this.page);
    const browser = this.page.context().browser()?.browserType().name();
    const needsForce = isMobile || browser === 'webkit';

    const checkStrategies: Array<() => Promise<void>> = [
      async () => {
        await checkbox.check({ force: needsForce, timeout: TIMEOUTS.LONG });
      },
      async () => {
        if (needsForce) {
          await checkbox
            .tap({ timeout: TIMEOUTS.LONG })
            .catch(() => checkbox.click({ force: true, timeout: TIMEOUTS.LONG }));
        } else {
          await checkbox.click({ timeout: TIMEOUTS.LONG });
        }
      },
      async () => {
        await checkbox.evaluate((el: HTMLInputElement) => el.click());
      },
    ];

    for (const check of checkStrategies) {
      try {
        await check();
      } catch {
        // try next strategy
      }
      if (await checkbox.isChecked()) {
        return;
      }
    }

    await expect(checkbox).toBeChecked({ timeout: TIMEOUTS.MEDIUM });
  }

  private async uncheckCheckboxInIframe(checkbox: Locator): Promise<void> {
    await this.scrollCheckboxIntoView(checkbox);
    if (!(await checkbox.isChecked().catch(() => false))) {
      return;
    }

    const isMobile = await Helpers.isMobileDevice(this.page);
    const browser = this.page.context().browser()?.browserType().name();
    const needsForce = isMobile || browser === 'webkit';

    const uncheckStrategies: Array<() => Promise<void>> = [
      async () => {
        await checkbox.uncheck({ force: needsForce, timeout: TIMEOUTS.LONG });
      },
      async () => {
        await checkbox.click({ force: true, timeout: TIMEOUTS.LONG });
      },
      async () => {
        await checkbox.evaluate((el: HTMLInputElement) => {
          el.checked = false;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      },
      async () => {
        await checkbox.setChecked(false, { force: true, timeout: TIMEOUTS.MEDIUM });
      },
    ];

    for (const uncheck of uncheckStrategies) {
      try {
        await uncheck();
      } catch {
        // try next
      }
      if (!(await checkbox.isChecked().catch(() => false))) {
        return;
      }
    }

    await expect(checkbox, 'Expected corporate checkbox to be unchecked').not.toBeChecked();
  }

  /** AFW-3722-style: required corporate checkboxes default unchecked; marketing optional unchecked. */
  async assertRequiredCheckboxesUncheckedByDefault(): Promise<void> {
    await this.waitForCorporateMembershipFormReady();
    for (const [name, checkbox] of [
      ['corporateAuthority', this.corporateAuthorityCheckbox],
      ['corporateUnderstanding', this.corporateUnderstandingCheckbox],
      ['corporateTermsAccepted', this.termsAndConditionsCheckbox],
    ] as const) {
      await this.scrollCheckboxIntoView(checkbox);
      const checked = await checkbox.isChecked().catch(() => true);
      expect(checked, `${name} should be unchecked by default`).toBe(false);
    }
  }

  async assertMarketingOptInUncheckedByDefault(): Promise<void> {
    await this.waitForCorporateMembershipFormReady();
    const checkbox = this.corporateMarketingOptInCheckbox;
    await checkbox.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await this.scrollCheckboxIntoView(checkbox);
    const checked = await checkbox.isChecked().catch(() => true);
    expect(
      checked,
      'Marketing opt-in (#corporateMarketingOptIn) should be unchecked by default',
    ).toBe(false);
  }

  async checkMarketingOptInCheckbox(): Promise<void> {
    await this.clickCheckboxInIframe(this.corporateMarketingOptInCheckbox);
    await expect(this.corporateMarketingOptInCheckbox).toBeChecked();
  }

  async uncheckMarketingOptInCheckbox(): Promise<void> {
    await this.uncheckCheckboxInIframe(this.corporateMarketingOptInCheckbox);
  }

  async assertMarketingOptInChecked(): Promise<void> {
    await expect(this.corporateMarketingOptInCheckbox).toBeChecked();
  }

  /** Untick a required checkbox after fill — form must not advance. */
  async uncheckRequiredTermsCheckbox(): Promise<void> {
    await this.uncheckCheckboxInIframe(this.termsAndConditionsCheckbox);
  }

  async assertRequiredCheckboxBlocksSubmit(): Promise<void> {
    const errorCandidates = [
      this.iframe.locator('#corporateTermsAccepted-error'),
      this.iframe.locator('#corporateAuthority-error'),
      this.iframe.locator('#corporateUnderstanding-error'),
      this.iframe.getByText(/ช่องนี้จำเป็น|this field is required|required/i).first(),
    ];
    let sawError = false;
    for (const loc of errorCandidates) {
      if (await loc.isVisible({ timeout: TIMEOUTS.SHORT }).catch(() => false)) {
        sawError = true;
        break;
      }
    }
    if (!sawError) {
      expect(
        await this.termsAndConditionsCheckbox.isChecked().catch(() => true),
        'Terms checkbox should remain unchecked after blocked submit',
      ).toBe(false);
    }
    await expect(this.userForm.firstName).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    expect(this.page.url(), 'Should remain on corporate membership form').not.toMatch(/thank-you/i);
  }

  async fillCorporateMembershipForm(
    data: CorporateMembershipFormData,
    options?: { checkMarketing?: boolean },
  ) {
    if (data.firstName) {
      await this.fillFieldInIframe(this.userForm.firstName, data.firstName);
    }
    if (data.lastName) {
      await this.fillFieldInIframe(this.userForm.lastName, data.lastName);
    }
    if (data.email) {
      await this.fillFieldInIframe(this.userForm.email, data.email);
    }
    if (data.phone) {
      // Intl phone inputs often ignore plain fill — use the shared phone helper.
      await this.userForm.phone.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
      await this.userForm.phone
        .evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
        .catch(() => {});
      await this.userForm.autofillPhoneNumber(this.userForm.phone, data.phone).catch(async () => {
        await this.fillFieldInIframe(this.userForm.phone, data.phone!);
      });
    }
    if (data.company) {
      await this.fillFieldInIframe(this.company, data.company);
    }
    if (data.title) {
      await this.fillFieldInIframe(this.title, data.title);
    }
    if (data.department) {
      await this.fillFieldInIframe(this.department, data.department);
    }
    if (data.companyAddress) {
      await this.fillFieldInIframe(this.companyAddress, data.companyAddress);
    }

    await this.verifyFilledFields(data);

    await this.clickCheckboxInIframe(this.corporateAuthorityCheckbox);
    await this.clickCheckboxInIframe(this.corporateUnderstandingCheckbox);
    await this.clickCheckboxInIframe(this.termsAndConditionsCheckbox);

    const checkMarketing = options?.checkMarketing === true;
    if (
      checkMarketing &&
      (await this.corporateMarketingOptInCheckbox.isVisible().catch(() => false))
    ) {
      await this.clickCheckboxInIframe(this.corporateMarketingOptInCheckbox);
    }
  }

  /** Fail before submit with the offending field name instead of timing out on the API request. */
  private async verifyFilledFields(data: CorporateMembershipFormData): Promise<void> {
    const filled: Array<[string, Locator, string | undefined]> = [
      ['firstName', this.userForm.firstName, data.firstName],
      ['lastName', this.userForm.lastName, data.lastName],
      ['email', this.userForm.email, data.email],
      ['phone', this.userForm.phone, data.phone],
      ['company', this.company, data.company],
      ['title', this.title, data.title],
      ['department', this.department, data.department],
      ['companyAddress', this.companyAddress, data.companyAddress],
    ];

    for (const [name, locator, value] of filled) {
      if (!value) {
        continue;
      }
      if (await this.inputValueMatches(locator, value)) {
        continue;
      }
      await this.fillFieldInIframe(locator, value);
      expect(
        await this.inputValueMatches(locator, value),
        `Corporate Membership field "${name}" was not filled with "${value}"`,
      ).toBe(true);
    }
  }

  async isThankYouSectionVisible(): Promise<boolean> {
    if (!/thank-you/i.test(this.page.url())) {
      await this.waitForThankYouPageNavigation();
    }
    const expectedHeading = t(TranslationKeys.Texts.Headings.ThankYouPage);
    const expectedBody = t(TranslationKeys.Texts.BookingConfirmation.CorporateMembership);
    // Prefer URL + body copy — heading markup varies by Webflow locale templates.
    await expect(this.page).toHaveURL(/thank-you/i, { timeout: TIMEOUTS.MEDIUM });
    const headingVisible = await this.thankYouHeading.isVisible().catch(() => false);
    if (headingVisible) {
      await expect(this.thankYouHeading).toContainText(expectedHeading, { ignoreCase: true });
    } else {
      await expect(this.page.getByText(new RegExp(expectedHeading, 'i')).first()).toBeVisible({
        timeout: TIMEOUTS.MEDIUM,
      });
    }
    // Live CMS may use EN or localized body; also tolerate trailing punctuation drift.
    const bodyPattern = new RegExp(
      `(${expectedBody.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Someone from our team will contact you to discuss next steps|มีคนจากทีมของเราจะติดต่อคุณเพื่อพูดคุยเกี่ยวกับขั้นตอนถัดไป)\\.?`,
      'i',
    );
    const bodyText = ((await this.thankYouText.innerText().catch(() => '')) || '').replace(
      /\s+/g,
      ' ',
    );
    expect(
      bodyPattern.test(bodyText),
      `Corporate Membership thank-you body missing expected copy. Got: ${bodyText.slice(0, 240)}`,
    ).toBe(true);
    return true;
  }

  async getCorporateAuthorityText(): Promise<string | null> {
    try {
      await this.corporateAuthorityText.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return normalizeCorporateCopy(await this.corporateAuthorityText.textContent());
    } catch {
      return null;
    }
  }

  async getCorporateUnderstandingText(): Promise<string | null> {
    try {
      await this.corporateUnderstandingText.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return normalizeCorporateCopy(await this.corporateUnderstandingText.textContent());
    } catch {
      return null;
    }
  }

  async getTermsAndConditionsText(): Promise<string | null> {
    try {
      await this.termsAndConditionsText.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return normalizeCorporateCopy(await this.termsAndConditionsText.textContent());
    } catch {
      return null;
    }
  }

  async getCorporateMarketingOptInText(): Promise<string | null> {
    try {
      await this.corporateMarketingOptInText.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return normalizeCorporateCopy(await this.corporateMarketingOptInText.textContent());
    } catch {
      return null;
    }
  }
}

function normalizeCorporateCopy(value: string | null): string | null {
  if (value === null) return null;
  return value.replace(/\s+/g, ' ').trim() || null;
}
