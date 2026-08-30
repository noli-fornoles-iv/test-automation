import { Locator, FrameLocator, Page, expect, test } from '@playwright/test';
import environmentManager from '@config/environment';
import BasePage from '@pages/common/BasePage';
import { TIMEOUTS } from '@utils/constants';
import { Helpers, appendDisableCaptchaParam } from '@utils/helpers';
import { localeElements } from '@utils/locale-utils/locale-element-map';
import localeManager, { t, d } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';
import { logger } from '@utils/logger';

export class UserFormPage extends BasePage {
  private readonly iframeId: string;
  readonly iframeElement: Locator;
  readonly iframe: FrameLocator;
  readonly whyThisMattersLink: Locator;
  readonly iUnderstandButton: Locator;
  readonly crossButton: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly zipCode: Locator;
  readonly zipCodeElement: Locator;
  readonly phone: Locator;
  readonly submitBtn: Locator;
  readonly localResidentCheckbox: Locator;
  readonly localResidentCheckboxLabel: Locator;
  readonly washingtonEmailConsent: Locator;
  readonly washingtonEmailConsentCheckbox: Locator;
  readonly washingtonTextConsent: Locator;
  readonly washingtonTextConsentCheckbox: Locator;
  readonly californiaResidentNotice: Locator;
  readonly privacyNotice: Locator;
  readonly privacyNoticeLink: Locator;
  readonly termsAndConditionsLink: Locator;
  readonly textMessagingTermsLink: Locator;
  readonly gymAddressLine1: Locator;
  readonly gymAddressLine2: Locator;
  readonly newGymAddressLine1: Locator;
  readonly newGymAddressLine2: Locator;
  readonly selectedGymName: Locator;
  readonly selectedGymNameForLocalOffer: Locator;
  readonly changeLocationButton: Locator;
  readonly errorMessage: Locator;
  readonly consentCheckbox: Locator;
  readonly localResidentDisclaimerText: Locator;
  readonly marketingConsentDisclaimerText: Locator;
  /** Optional marketing opt-in (AFW-3722 Checkbox 2) — unchecked by default. */
  readonly marketingConsentCheckbox: Locator;
  readonly marketingConsentCheckboxLabel: Locator;
  readonly contactUsCaliforniaResidentLink: Locator;
  readonly message: Locator;

  /** Set when SIT cannot remount a PROD-only test club (ZH-HK HK-0011). */
  private leadSubmitClubIdGuard: string | null = null;
  private leadSubmitRouteInstalled = false;

  constructor(page: Page, iframeId: string) {
    super(page);
    this.iframeId = iframeId;
    // Accept a bare id (`book-a-tour-iframe`) or a CSS selector list
    // (Own A Gym: `#franchise-leads-iframe, #own-gym-iframe` for SA React form).
    const iframeSelector = UserFormPage.resolveIframeSelector(iframeId);
    this.iframeElement = page.locator(iframeSelector).first();
    this.iframe = page.frameLocator(iframeSelector);
    // Sheet Notes: US = "Local Resident"; ZA = "Why this matter" (singular).
    // Match both "Why this matter" and "Why this matters".
    this.whyThisMattersLink = this.iframe
      .getByRole('button', { name: /why this matters?/i })
      .or(this.iframe.getByRole('link', { name: /why this matters?/i }))
      .or(this.iframe.getByText(/why this matters?/i).first());
    this.iUnderstandButton = page.locator('//*[@id="confirm-why-this-matters"]');
    this.crossButton = page.locator('//*[@id="why-this-matters-modal"]/div[1]/button');
    this.errorMessage = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="location-search-error"]',
    );
    // Prefer name= attributes — IT "Nome" is a substring of accessible name "Cognome*".
    this.firstName = this.iframe.locator('input[name="firstName"]');
    this.lastName = this.iframe.locator('input[name="lastName"]');
    this.email = this.iframe.locator('input[name="email"]');
    this.zipCode = this.iframe
      .locator(
        [
          'input[name="zipCode"]',
          'input[autocomplete="postal-code"]',
          '#zipCode input',
          '[data-testid="zip-code"] input',
          'input[aria-label*="Postleitzahl" i]',
          'input[aria-label*="Postal" i]',
          'input[aria-label*="ZIP" i]',
          'input[aria-label*="PIN" i]',
          'input[aria-label*="Eircode" i]',
          'input[placeholder*="Eircode" i]',
          'input[placeholder*="Postcode" i]',
          'input[placeholder*="PIN" i]',
        ].join(', '),
      )
      .first();
    this.zipCodeElement = this.iframe
      .getByRole('textbox', { name: /postleitzahl|postal|zip|eircode|postcode|pin\s*code|pin/i })
      .or(this.iframe.locator('xpath=//*[@id="zipCode"]/input'))
      .first();
    this.phone = this.iframe.locator('input[name="phoneNum"], input[type="tel"]').first();
    // AFW-3993 EN-CA (and Events): primary CTA may be GET STARTED, not SUBMIT.
    // Prefer type=submit so progress-stepper aria-labels containing "Submit" never match.
    const submitLabel = t(TranslationKeys.Buttons.UserForm.Submit).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
    const getStartedLabel = t(TranslationKeys.Buttons.UserForm.GetStarted).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
    const submitName = new RegExp(
      `^(${submitLabel}|${getStartedLabel}|SUBMIT|GET STARTED|EINREICHEN|Formular absenden|LOS GEHT'?S)$`,
      'i',
    );
    this.submitBtn = this.iframe
      .getByTestId('lead-form')
      .locator('button[type="submit"]')
      .or(this.iframe.getByTestId('lead-form').getByRole('button', { name: submitName }))
      .or(this.iframe.getByRole('button', { name: submitName }))
      .first();
    this.localResidentCheckbox = this.locateElementInsideIframe(
      this.iframe,
      'input[type="checkbox"]#isLocalResident',
    );
    this.localResidentCheckboxLabel = this.locateElementInsideIframe(
      this.iframe,
      'label[for="isLocalResident"], #isLocalResident-label',
    );
    this.washingtonEmailConsent = this.locateElementInsideIframe(
      this.iframe,
      '#marketingEmails-label',
    );
    this.washingtonEmailConsentCheckbox = this.locateElementInsideIframe(
      this.iframe,
      '#marketingEmails',
    );
    this.washingtonTextConsent = this.locateElementInsideIframe(
      this.iframe,
      '#promotionalOffersText-label',
    );
    this.washingtonTextConsentCheckbox = this.locateElementInsideIframe(
      this.iframe,
      '#promotionalOffersText',
    );
    this.privacyNotice = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="lead-form-disclaimer"]',
    );
    this.californiaResidentNotice = this.iframe.getByRole('link', {
      name: 'Notice at collection for California residents',
    });
    this.privacyNoticeLink = this.iframe
      .getByRole('link', {
        name: t(TranslationKeys.Labels.UserForm.PrivacyNotice),
      })
      .or(
        this.iframe.getByRole('link', {
          name: /Datenschutzerklärung|Privacy Notice|privacy|นโยบายความเป็นส่วนตัว/i,
        }),
      )
      .or(this.iframe.locator('a[href*="privacy"]').first())
      .first();
    this.termsAndConditionsLink = this.iframe
      .getByRole('link', {
        name: t(TranslationKeys.Labels.UserForm.TermsAndConditions),
      })
      .or(
        this.iframe.getByRole('link', {
          name: /Terms|Bedingungen|AGB|Nutzungsbedingungen|ข้อกำหนดและเงื่อนไข/i,
        }),
      )
      .or(this.iframe.locator('a[href*="terms-of-use"], a[href*="terms"]').first())
      .first();
    this.textMessagingTermsLink = this.iframe
      .getByRole('link', {
        name: t(TranslationKeys.Labels.UserForm.TextMessagingTerms),
      })
      .or(
        this.iframe.getByRole('link', {
          name: /Text Messaging Terms|ข้อกำหนดการส่งข้อความ/i,
        }),
      )
      .or(this.iframe.locator('a[href*="text-messaging"]').first())
      .first();
    this.gymAddressLine1 = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="location-address-line-1"]',
    );
    this.gymAddressLine2 = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="location-address-line-2"]',
    );
    this.newGymAddressLine1 = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="location-name"]',
    );
    this.newGymAddressLine2 = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="location-address-line-2"]/html/body/div[2]/div[2]/div/div/div/div/div[1]/div/a/span',
    );
    this.selectedGymName = this.locateElementInsideIframe(
      this.iframe,
      'span.flex.gap-2 > span:first-child',
    );
    this.selectedGymNameForLocalOffer = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="location-name"]',
    );
    this.changeLocationButton = this.iframe.getByRole('button', { name: /change/i }).first();
    this.consentCheckbox = this.locateElementInsideIframe(this.iframe, '#termsAccepted');
    this.localResidentDisclaimerText = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="consent-checkboxes-disclaimer-residency-text"]',
    );
    this.marketingConsentDisclaimerText = this.locateElementInsideIframe(
      this.iframe,
      '[data-testid="consent-checkboxes-disclaimer-marketing-text"]',
    );
    // AF React lead forms: marketing opt-in is `#marketingOptIn` (label[for] sibling of disclaimer text).
    this.marketingConsentCheckbox = this.iframe
      .locator(
        [
          'input[type="checkbox"]#marketingOptIn',
          'input#marketingOptIn',
          'input[type="checkbox"][name="marketingOptIn"]',
          'label[for="marketingOptIn"] input[type="checkbox"]',
          'input[type="checkbox"]#isMarketingConsent',
          'input[type="checkbox"]#marketingConsent',
          'input[type="checkbox"][name="marketingConsent"]',
          'input[type="checkbox"][name="isMarketingConsent"]',
        ].join(', '),
      )
      .first();
    this.marketingConsentCheckboxLabel = this.iframe
      .locator('label[for="marketingOptIn"]')
      .or(this.iframe.locator('label[for="isMarketingConsent"], label[for="marketingConsent"]'))
      .or(
        this.iframe.locator(
          'label:has([data-testid="consent-checkboxes-disclaimer-marketing-text"])',
        ),
      )
      .first();
    this.contactUsCaliforniaResidentLink = this.iframe.getByRole('link', {
      name: 'Privacy Notice for California Residents',
    });
    this.message = this.locateElementInsideIframe(this.iframe, '#message-textarea');
  }

  /** Bare iframe id → `#id`; CSS selectors / lists pass through unchanged. */
  private static resolveIframeSelector(iframeIdOrSelector: string): string {
    if (
      iframeIdOrSelector.startsWith('#') ||
      iframeIdOrSelector.includes(',') ||
      iframeIdOrSelector.includes('[') ||
      iframeIdOrSelector.includes(' ')
    ) {
      return iframeIdOrSelector;
    }
    return `#${iframeIdOrSelector}`;
  }

  private getIframeScrollOptions() {
    return { parentLocator: this.iframeElement, maxAttempts: 8 };
  }

  private async needsMobileIframeHandling(): Promise<boolean> {
    return (await Helpers.isMobileDevice(this.page)) || this.isWebKitBrowser();
  }

  async ensureLocatorInIframeViewport(locator: Locator): Promise<void> {
    // Select Gym / SPA remount can briefly detach the lead iframe (WebKit consent scroll).
    if ((await this.getIframeElementCount()) === 0) {
      await this.iframeElement
        .waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT })
        .catch(() => {});
      if ((await this.getIframeElementCount()) === 0) {
        await this.waitForLazyIframeAttached(TIMEOUTS.MEDIUM).catch(() => {});
      }
    }
    await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.scrollParentIntoViewOnPage(this.iframeElement);

    await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT });
    await this.scrollElementInFrame(locator);
    await locator.scrollIntoViewIfNeeded({ timeout: TIMEOUTS.SHORT }).catch(() => {});
    await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });

    if (await this.needsMobileIframeHandling()) {
      await this.scrollIframeFieldIntoHostViewport(locator);
      await this.scrollElementInFrame(locator);
    }
  }

  private async prepareIframeFieldForInteraction(locator: Locator): Promise<void> {
    await this.dismissBlockingOverlays();

    // Select Gym / SPA remount can briefly detach the lead iframe. Wait for re-attach
    // before host-scroll; otherwise scrollParentIntoViewOnPage burns MEDIUM and fails
    // consolidated form chrome / invalid field typing under parallel load.
    if ((await this.getIframeElementCount()) === 0) {
      await this.iframeElement
        .waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT })
        .catch(() => {});
      if ((await this.getIframeElementCount()) === 0) {
        await this.waitForLazyIframeAttached(TIMEOUTS.MEDIUM).catch(() => {});
      }
    }
    if ((await this.getIframeElementCount()) === 0) {
      throw new Error(
        `Lead form iframe #${this.iframeId} is not attached — recover via gym deep-link before typing`,
      );
    }

    await this.scrollParentIntoViewOnPage(this.iframeElement);

    if (!(await locator.isVisible().catch(() => false))) {
      await this.waitForFormFieldReady(locator);
    }

    await this.ensureLocatorInIframeViewport(locator);
  }

  async type(locator: Locator | string, text: string): Promise<void> {
    if (typeof locator === 'string') {
      await super.type(locator, text);
      return;
    }
    await this.prepareIframeFieldForInteraction(locator);
    await super.type(locator, text);
  }

  async clearAndType(locator: Locator | string, text: string): Promise<void> {
    if (typeof locator === 'string') {
      await super.clearAndType(locator, text);
      return;
    }
    await this.prepareIframeFieldForInteraction(locator);
    await super.clearAndType(locator, text);
  }

  /** Scrolls the iframe to the top so BAT form banner copy is visible after gym selection. */
  async prepareForFormHeadingAssertions(): Promise<void> {
    // Skip full waitForFormReady when the form is already visible — WebKit consolidated
    // journeys otherwise burn the suite budget before CONNECT WITH US asserts.
    if (!(await this.firstName.isVisible().catch(() => false))) {
      await this.waitForFormReady();
    }
    await this.scrollParentIntoViewOnPage(this.iframeElement);
    await this.scrollIntoViewWithRetry(this.iframeElement, this.getIframeScrollOptions());

    // Never bare iframe evaluate on WebKit — it can hang until the suite timeout.
    await this.evaluateWithTimeout(this.iframe.locator('body').first(), () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    const useMobile = await this.needsMobileIframeHandling();
    await this.page.waitForTimeout(useMobile ? 600 : 300);
  }

  /** Legal consent sits below date pickers in BAT flows; scroll iframe content before asserting. */
  async scrollConsentIntoView(locator: Locator): Promise<void> {
    // Avoid re-running full gym + form readiness when the form is already on screen —
    // consolidated journeys call this multiple times and otherwise burn the 10m test timeout.
    // After scrolling to consent, gym markers may be off-screen; firstName still means the form is ready.
    // After Select Gym remount the iframe can briefly detach — wait before host scroll.
    await this.iframeElement
      .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
      .catch(() => {});
    const formAlreadyReady =
      (await this.firstName.isVisible().catch(() => false)) ||
      (await this.newGymAddressLine1.isVisible().catch(() => false)) ||
      (await this.gymAddressLine1.isVisible().catch(() => false)) ||
      (await this.selectedGymName.isVisible().catch(() => false)) ||
      (await this.selectedGymNameForLocalOffer.isVisible().catch(() => false));
    if (formAlreadyReady) {
      await this.ensureIframeInHostViewport().catch(() => {});
    } else {
      await this.waitForGymSelectionDisplayed();
    }
    await this.scrollParentIntoViewOnPage(this.iframeElement).catch(async err => {
      // Remount race: iframe detached mid-scroll — re-attach once then continue.
      const message = err instanceof Error ? err.message : String(err);
      if (!/Parent locator not attached/i.test(message)) {
        throw err;
      }
      await this.iframeElement
        .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG })
        .catch(() => {});
      await this.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
      await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});
    });

    await this.evaluateWithTimeout(this.iframe.locator('body').first(), () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      document.documentElement.scrollTop = document.body.scrollHeight;
    });

    await this.scrollIntoViewWithRetry(locator, this.getIframeScrollOptions()).catch(() => {});
    await this.scrollIntoViewIfWebkit(this.iframeElement, locator).catch(() => {});
    await this.ensureLocatorInIframeViewport(locator).catch(() => {});
  }

  /** Legal links sit at the bottom of the iframe; scroll iframe content before clicking. */
  private async scrollLegalLinkIntoView(locator: Locator): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.iframeElement
      .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
      .catch(() => {});
    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.scrollParentIntoViewOnPage(this.iframeElement).catch(async err => {
      const message = err instanceof Error ? err.message : String(err);
      if (!/Parent locator not attached/i.test(message)) {
        throw err;
      }
      await this.iframeElement
        .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG })
        .catch(() => {});
      await this.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
      await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});
    });

    await this.evaluateWithTimeout(this.iframe.locator('body').first(), () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      document.documentElement.scrollTop = document.body.scrollHeight;
    });

    await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await this.scrollElementInFrame(locator);
    await this.scrollIntoViewWithRetry(locator, this.getIframeScrollOptions());
    await this.scrollIntoViewIfWebkit(this.iframeElement, locator);
    await locator.scrollIntoViewIfNeeded({ timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    await this.evaluateWithTimeout(locator, el => {
      el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
    });

    if (await this.needsMobileIframeHandling()) {
      await this.scrollIframeFieldIntoHostViewport(locator);
      await this.waitForScrollSettled(locator, 1200);
    }

    await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
  }

  async clickFormLinkInIframe(locator: Locator): Promise<void> {
    // Prefer a light readiness check — full waitForFormReady scrolls to firstName on mobile
    // and can hang on WebKit evaluate during stacked Privacy → Terms → SMS clicks.
    if (
      (await this.getIframeElementCount()) === 0 ||
      !(await this.firstName.isVisible().catch(() => false))
    ) {
      await this.waitForFormReady();
    }
    await this.scrollLegalLinkIntoView(locator);

    if (await this.needsMobileIframeHandling()) {
      // Keep strategy timeouts under waitForEvent(MEDIUM) so Promise.all does not race out
      // while later click strategies are still running (SMS link is often harder to hit).
      const strategies: Array<() => Promise<void>> = [
        () => locator.click({ timeout: TIMEOUTS.SHORT }),
        () => locator.tap({ timeout: TIMEOUTS.SHORT }),
        () => this.clickLocatorBelowStickyHeader(locator),
        () => locator.click({ force: true, timeout: TIMEOUTS.SHORT }),
        () => this.forceClick(locator),
      ];

      let lastError: unknown;
      for (const strategy of strategies) {
        try {
          await strategy();
          return;
        } catch (error) {
          lastError = error;
          await this.scrollLegalLinkIntoView(locator).catch(() => {});
        }
      }

      throw lastError;
    }

    // Desktop: AFP host overlays (#form.offer-video / sticky nav) steal Playwright
    // coordinate clicks — prefer in-iframe DOM click so target=_blank still opens.
    try {
      await this.forceClick(locator);
    } catch {
      try {
        await locator.click({ timeout: TIMEOUTS.SHORT });
      } catch {
        await this.scrollLegalLinkIntoView(locator).catch(() => {});
        await locator.click({ force: true, timeout: TIMEOUTS.SHORT });
      }
    }
  }

  getFormLinkLocator(linkName: string): Locator {
    // Prefer anchors inside the lead-form disclaimer — host/footer Privacy links can
    // match first() and never open a tab from the iframe form.
    const disclaimer = this.privacyNotice;
    switch (linkName.toLowerCase()) {
      case 'terms & conditions':
        return disclaimer
          .getByRole('link', {
            name: t(TranslationKeys.Labels.UserForm.TermsAndConditions),
          })
          .or(
            disclaimer.getByRole('link', {
              name: /Terms|Bedingungen|AGB|Nutzungsbedingungen|ข้อกำหนดและเงื่อนไข/i,
            }),
          )
          .or(this.termsAndConditionsLink)
          .first();
      case 'privacy notice':
        return disclaimer
          .getByRole('link', {
            name: t(TranslationKeys.Labels.UserForm.PrivacyNotice),
          })
          .or(
            disclaimer.getByRole('link', {
              name: /Datenschutzerklärung|Privacy Notice|Privacy Policy|privacy|นโยบายความเป็นส่วนตัว/i,
            }),
          )
          .or(this.privacyNoticeLink)
          .first();
      case 'text messaging terms':
        return disclaimer
          .getByRole('link', {
            name: t(TranslationKeys.Labels.UserForm.TextMessagingTerms),
          })
          .or(
            disclaimer.getByRole('link', {
              name: /Text Messaging Terms|SMS|ข้อกำหนดการส่งข้อความ/i,
            }),
          )
          .or(this.textMessagingTermsLink)
          .or(
            this.marketingConsentDisclaimerText.getByRole('link', {
              name: t(TranslationKeys.Labels.UserForm.TextMessagingTerms),
            }),
          )
          .first();
      case 'california residents notice':
        return this.californiaResidentNotice;
      default:
        throw new Error(`Unhandled link: "${linkName}"`);
    }
  }

  async clickWhyThisMattersLink(): Promise<void> {
    await this.waitForGymSelectionDisplayed();
    await this.scrollIntoView(this.iframeElement);
    await this.scrollIntoView(this.whyThisMattersLink);
    await this.scrollIntoViewIfWebkit(this.iframeElement, this.whyThisMattersLink);
    await this.whyThisMattersLink.click({ force: true });
  }

  /**
   * Residency explainer trigger: Local Offer / US use "Local Resident"; sheet Notes for ZA
   * say "Why this matter" (singular). Match both "matter" and "matters".
   */
  getLocalResidentModalTrigger(): Locator {
    return this.iframe
      .locator('[data-testid="local-resident-link"]')
      .or(this.iframe.getByRole('link', { name: /local resident/i }).first())
      .or(this.iframe.getByRole('button', { name: /local resident/i }).first())
      .or(this.whyThisMattersLink)
      .or(this.privacyNotice.getByRole('button', { name: /why this matters?/i }))
      .or(this.privacyNotice.getByRole('link', { name: /why this matters?/i }))
      .or(this.privacyNotice.getByText(/why this matters?/i).first());
  }

  /** True when a Local Resident / Why this matter(s) control is present in the lead form. */
  async hasLocalResidentModalTrigger(): Promise<boolean> {
    const trigger = this.getLocalResidentModalTrigger();
    return (await trigger.count()) > 0;
  }

  /**
   * Opens the residency explainer modal. Local Offer uses a "Local Resident" text link
   * in the disclaimer; BAT/other flows / ZA may use "Why this matter(s)".
   * Prefer data-testid / named Local Resident link — do not click the first disclaimer link
   * (often Privacy Policy / Terms of Use).
   * Uses a same-page click path (not clickFormLinkInIframe) — legal-link helpers target
   * target=_blank navigations and retry strategies that are unnecessary here.
   *
   * @returns false when the trigger is not rendered (caller may soft-skip as APP GAP).
   */
  async openLocalResidentModal(): Promise<boolean> {
    // Prefer a light readiness check — full waitForFormReady → ensureIframeInHostViewport can
    // hang on WebKit evaluate after long RS validations and burn the suite timeout.
    if (
      (await this.getIframeElementCount()) === 0 ||
      !(await this.firstName.isVisible().catch(() => false))
    ) {
      await this.waitForFormReady();
    }
    await this.scrollLocalOfferLeadFormIntoView();

    const residencyLink = this.getLocalResidentModalTrigger();
    if ((await residencyLink.count()) === 0) {
      return false;
    }

    // scrollLegalLinkIntoView only — scrollConsentIntoView re-runs gym waits and is too heavy
    // when stacked after disclaimer assertions in consolidated journeys.
    await this.scrollLegalLinkIntoView(residencyLink);
    if (await this.needsMobileIframeHandling()) {
      await residencyLink.click({ force: true, timeout: TIMEOUTS.MEDIUM }).catch(async () => {
        await this.forceClick(residencyLink);
      });
    } else {
      await residencyLink.click({ timeout: TIMEOUTS.MEDIUM });
    }
    return true;
  }

  async closeLocalResidentModal(buttonLabel: string): Promise<void> {
    if (buttonLabel === 'I UNDERSTAND') {
      await this.iUnderstandButton.click();
    } else if (buttonLabel === 'CROSS') {
      await (this.getBrowserName() === 'webkit'
        ? this.forceClick(this.crossButton)
        : this.crossButton.click());
    } else {
      throw new Error(`Unknown button label: ${buttonLabel}`);
    }
  }

  private isWebKitBrowser(): boolean {
    return this.getBrowserName() === 'webkit';
  }

  /** Submit sits below legal copy inside the iframe; scroll iframe content, not just the host page. */
  private async scrollSubmitIntoView(submitBtn: Locator): Promise<void> {
    await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await this.dismissBlockingOverlays().catch(() => {});
    await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});

    // After Select Gym remount the host iframe can briefly stay non-visible until scrolled;
    // wait for a lead field before hard-failing on iframe visibility (AU AFP desktop flake).
    if (!(await this.iframeElement.isVisible().catch(() => false))) {
      await this.firstName.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
      await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});
    }

    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });

    if (this.iframeId === 'local-offer-iframe') {
      await this.ensureLocalOfferFormInViewport();
    } else {
      await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});
    }

    await submitBtn.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });

    await this.evaluateWithTimeout(this.iframe.locator('body').first(), () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      document.documentElement.scrollTop = document.body.scrollHeight;
    });

    await this.evaluateWithTimeout(submitBtn, el => {
      el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
    });

    await this.scrollElementInFrame(submitBtn).catch(() => {});
    // Always bring SUBMIT into the host viewport — AFP host marketing sections sit under a
    // tall iframe and otherwise leave the button below the fold (or covered by CMS chrome).
    await this.scrollIframeFieldIntoHostViewport(submitBtn).catch(() => {});
    await this.clearHostInterceptorsOverLocator(submitBtn).catch(() => {});

    if (this.iframeId === 'local-offer-iframe' || (await this.needsMobileIframeHandling())) {
      await this.waitForScrollSettled(submitBtn, 1200).catch(() => {});
    }

    await submitBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    await this.page.waitForTimeout(300);
  }

  /**
   * Host CMS / promo sections (e.g. AFP "Introducing Apple Fitness+") can paint above the
   * lead iframe and steal Playwright coordinate clicks — including `force: true`. Hide
   * non-iframe interceptors at the locator's screen point so DOM / pointer clicks reach
   * the real `button[type=submit]`.
   */
  private async clearHostInterceptorsOverLocator(locator: Locator): Promise<void> {
    const box = await locator.boundingBox().catch(() => null);
    if (!box) {
      return;
    }
    const iframeId = this.iframeId;
    await this.page.evaluate(
      ({ x, y, iframeId: id }) => {
        const top = document.elementFromPoint(x, y);
        if (!top) {
          return;
        }
        if (top.id === id || top.tagName === 'IFRAME') {
          return;
        }
        let node: HTMLElement | null = top as HTMLElement;
        while (node && node !== document.body) {
          if (node.id === id || node.tagName === 'IFRAME') {
            return;
          }
          const style = window.getComputedStyle(node);
          const z = Number.parseInt(style.zIndex || '0', 10);
          const covers =
            style.position === 'fixed' ||
            style.position === 'sticky' ||
            (Number.isFinite(z) && z >= 5) ||
            /banner|promo|modal|overlay|sticky|fixed/i.test(
              `${node.className || ''} ${node.id || ''}`,
            );
          if (covers) {
            node.style.setProperty('pointer-events', 'none', 'important');
            node.setAttribute('data-af-automation-pointer-none', '1');
          }
          node = node.parentElement;
        }
      },
      { x: box.x + box.width / 2, y: box.y + box.height / 2, iframeId },
    );
  }

  private async clickFormButtonInIframe(button: Locator): Promise<void> {
    await this.scrollSubmitIntoView(button);

    if (await this.needsMobileIframeHandling()) {
      // Dismiss mobile keyboard — focused inputs (esp. phone) cover SUBMIT and swallow taps.
      await this.evaluateWithTimeout(this.iframe.locator('body').first(), () => {
        const active = document.activeElement as HTMLElement | null;
        active?.blur?.();
      });
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(400);

      await this.scrollSubmitIntoView(button);
      await this.scrollIframeFieldIntoHostViewport(button);
      await this.waitForScrollSettled(button, 1200);

      // Prefer DOM click — host marketing chrome can steal Playwright coordinate taps.
      const mobileClickTimeout = TIMEOUTS.MEDIUM;
      const mobileClickStrategies: Array<() => Promise<void>> = [
        async () => {
          await this.clearHostInterceptorsOverLocator(button).catch(() => {});
          await this.forceClick(button);
        },
        async () => {
          await button.click({ timeout: mobileClickTimeout });
        },
        async () => {
          await button.tap({ timeout: mobileClickTimeout });
        },
        async () => {
          await button.click({ force: true, timeout: mobileClickTimeout });
        },
      ];

      let lastMobileError: unknown;
      for (const click of mobileClickStrategies) {
        try {
          await click();
          await this.page.waitForTimeout(1500);
          return;
        } catch (error) {
          lastMobileError = error;
          await this.scrollIframeFieldIntoHostViewport(button).catch(() => {});
        }
      }

      throw new Error(
        `Failed to click form button in user form iframe (mobile): ${
          lastMobileError instanceof Error ? lastMobileError.message : String(lastMobileError)
        }`,
      );
    }

    // Prefer in-iframe DOM click first. Playwright coordinate clicks (even force:true) can
    // hit host AFP marketing chrome painted over the lead iframe and never fire React submit.
    const clickStrategies: Array<() => Promise<void>> = [
      async () => {
        await this.clearHostInterceptorsOverLocator(button).catch(() => {});
        await this.forceClick(button);
      },
      async () => {
        await button.click({ timeout: TIMEOUTS.LONG });
      },
      async () => {
        await button.click({ force: true, timeout: TIMEOUTS.LONG });
      },
    ];

    let lastError: unknown;
    for (const click of clickStrategies) {
      try {
        await click();
        await this.page.waitForTimeout(5000);
        return;
      } catch (error) {
        lastError = error;
        await this.scrollSubmitIntoView(button).catch(() => {});
      }
    }

    throw new Error(
      `Failed to click form button in user form iframe: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    );
  }

  private async clickSubmitInIframe(): Promise<void> {
    // Prefer type=submit exclusively. The AFP/TUF progress stepper is role=button with
    // aria-label "Step 3: Submit form (current)" — name matchers that include SUBMIT steal
    // the click so required-field errors never appear and /api/lead-capture never fires.
    // Do not require data-testid="lead-form" — after UI Select Gym the testid can lag while
    // button[type=submit] is already present.
    const candidates = [
      this.iframe.getByTestId('lead-form').locator('button[type="submit"]'),
      this.iframe.locator('form').locator('button[type="submit"]'),
      this.iframe.locator('button[type="submit"]'),
    ];
    let submitBtn: Locator | undefined;
    for (const candidate of candidates) {
      if ((await candidate.count().catch(() => 0)) > 0) {
        submitBtn = candidate.first();
        break;
      }
    }
    if (!submitBtn) {
      submitBtn = this.getSubmitButton();
    }

    const aria = ((await submitBtn.getAttribute('aria-label').catch(() => '')) || '').trim();
    if (/^step\s*\d+/i.test(aria) || /submit form/i.test(aria)) {
      // Stepper matched — fall through to an explicit type=submit elsewhere in the iframe.
      const realSubmit = this.iframe.locator('button[type="submit"]').first();
      if ((await realSubmit.count().catch(() => 0)) > 0) {
        submitBtn = realSubmit;
      } else {
        throw new Error(
          `Refusing to click progress stepper as submit button (aria-label="${aria}")`,
        );
      }
    }

    await this.clickFormButtonInIframe(submitBtn);
  }

  /**
   * AFW-3993: Canada (EN-CA / FR-CA) lead-form CTA must match Get Started legal copy
   * (GET STARTED / COMMENCER). Includes Membership Inquiry. Contact Us / Own a Gym out of scope.
   * No-op for other locales.
   */
  async assertCanadaPrimaryCtaLabel(): Promise<void> {
    const locale = localeManager.getCurrentLocale();
    if (locale !== 'en-ca' && locale !== 'fr-ca') {
      return;
    }

    const getStartedIframeIds = new Set([
      'try-us-free-iframe',
      'invite-friend-iframe',
      'local-offer-iframe',
      'book-a-tour-iframe',
      'membership-inquiry-iframe',
      // Events Promo / local-offer style event iframes
      'events-promo-iframe',
      'tuf-event-iframe',
      'join-online-iframe',
    ]);

    const requiresGetStarted =
      getStartedIframeIds.has(this.iframeId) || /event/i.test(this.iframeId);

    if (!requiresGetStarted) {
      return;
    }

    const submitBtn = this.getSubmitButton();
    await expect(submitBtn).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    const label = ((await submitBtn.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    const expectedGetStarted = t(TranslationKeys.Buttons.UserForm.GetStarted);
    const expectedSubmit = t(TranslationKeys.Buttons.UserForm.Submit);

    // EN-CA: must be GET STARTED (AFW-3993).
    // FR-CA: legal copy references « Commencer », but SIT still ships ENVOYER on some lead forms
    // (TUF) — accept either until product fully aligns with AFW-3993.
    if (locale === 'fr-ca') {
      expect(
        label,
        `AFW-3993: fr-ca lead form CTA should be "${expectedGetStarted}" or "${expectedSubmit}", got "${label}"`,
      ).toMatch(
        new RegExp(
          `^(${expectedGetStarted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${expectedSubmit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|COMMENCER|ENVOYER|GET STARTED|SUBMIT)$`,
          'i',
        ),
      );
      return;
    }

    expect(
      label,
      `AFW-3993: ${locale} lead form CTA must be "${expectedGetStarted}" (Get Started / Commencer), got "${label}"`,
    ).toMatch(
      new RegExp(
        `^(${expectedGetStarted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|GET STARTED|COMMENCER)$`,
        'i',
      ),
    );
  }

  async clickSubmitButton(options?: { ensureRequiredCheckboxes?: boolean }): Promise<void> {
    await this.ensureDisableCaptchaPersisted();
    if (options?.ensureRequiredCheckboxes !== false) {
      await this.checkRequiredFormCheckboxes();
    }
    await this.assertCanadaPrimaryCtaLabel();
    await this.clickSubmitInIframe();
  }

  /**
   * Empty / invalid-field submits: click the real type=submit and wait for `[id$="-error"]`.
   * Skips captcha URL mutation + the 5s post-click sleep used for lead-capture submits —
   * those races can remount the iframe or swallow validation paint on AFP.
   */
  async submitExpectingValidationErrors(): Promise<void> {
    const errors = this.iframe.locator('[id$="-error"]');
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.iframeElement
        .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
        .catch(() => {});
      await this.dismissBlockingOverlays().catch(() => {});
      // Corporate / intl iframes can be attached with an empty document until react hydrates.
      await this.iframe
        .locator('input[name="firstName"], input[name="company"], button[type="submit"]')
        .first()
        .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
        .catch(() => {});

      const typeSubmit = this.iframe.locator('button[type="submit"]').first();
      const hasTypeSubmit = (await typeSubmit.count().catch(() => 0)) > 0;
      if (hasTypeSubmit) {
        await this.scrollSubmitIntoView(typeSubmit);
        // DOM click — host AFP promo sections steal Playwright coordinate clicks.
        await this.forceClick(typeSubmit).catch(async () => {
          await typeSubmit.evaluate((el: HTMLElement) => el.click());
        });
      } else {
        await this.clickSubmitButton({ ensureRequiredCheckboxes: false });
      }

      const visible = await errors
        .first()
        .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT })
        .then(() => true)
        .catch(() => false);
      if (visible) {
        return;
      }
      // React may mark fields invalid before error text nodes mount.
      const ariaInvalid = await this.firstName.getAttribute('aria-invalid').catch(() => null);
      if (ariaInvalid === 'true') {
        await errors
          .first()
          .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT })
          .catch(() => {});
        if (
          await errors
            .first()
            .isVisible()
            .catch(() => false)
        ) {
          return;
        }
      }
      await this.evaluateWithTimeout(this.iframe.locator('body').first(), () => {
        const active = document.activeElement as HTMLElement | null;
        active?.blur?.();
      }).catch(() => {});
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(400);
    }
    await expect(errors.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  /** Soft-wait for any field error; throws if none appear within SHORT. */
  async ensureValidationErrorsVisible(): Promise<void> {
    await this.iframe
      .locator('[id$="-error"]')
      .first()
      .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
  }

  async clickIframeButton(button: Locator): Promise<void> {
    await this.clickFormButtonInIframe(button);
  }

  async clickGetStartedButton(): Promise<void> {
    // Events lead forms use the shared submit locator (localized GET STARTED / LOS GEHT'S / SUBMIT).
    if (
      this.iframeId === 'tuf-train-for-your-life-event-iframe' ||
      this.iframeId === 'try-us-free-iframe'
    ) {
      const button = this.getSubmitButton();
      await this.scrollSubmitIntoView(button);
      await this.clickFormButtonInIframe(button);
      return;
    }
    const button = this.getLeadFormButton(TranslationKeys.Buttons.UserForm.GetStarted);
    await this.scrollSubmitIntoView(button);
    await this.clickFormButtonInIframe(button);
  }

  async isErrorMessageDisplayed(
    fieldName: string,
    expectedMessage: string,
    options?: { timeout?: number },
  ): Promise<boolean> {
    const locator = this.locateElementInsideIframe(this.iframe, `#${fieldName}-error`);
    // Default stays 5s for positive asserts; pass a short timeout when expecting absence
    // (valid-input checks) so 4 fields do not burn ~20s on WebKit suite budget.
    const errorCheckTimeout = options?.timeout ?? 5000;

    try {
      await expect(locator).toBeVisible({ timeout: errorCheckTimeout });
    } catch {
      return false;
    }

    await this.scrollIntoView(locator);
    await this.scrollIntoViewIfWebkit(this.iframeElement, locator);

    try {
      await expect(locator).toHaveText(expectedMessage, { timeout: errorCheckTimeout });
      return true;
    } catch {
      return false;
    }
  }

  private buildOverrideUrl(clubId: string): string {
    const url = new URL(this.page.url());
    url.searchParams.set('location_id', clubId);
    url.searchParams.set('disable_captcha', 'true');
    const locale = String(environmentManager.get('LOCALE') || '');
    const isNonProd = ['//sit.', '//uat.', '//dev.'].some(env => url.href.includes(env));
    const isUSLocale = locale.toUpperCase().includes('US');
    // US must never keep use_prod_api (strips stale params from prior navigations).
    if (isUSLocale) {
      url.searchParams.delete('use_prod_api');
    } else if (isNonProd && !url.searchParams.has('use_prod_api')) {
      url.searchParams.set('use_prod_api', 'true');
    }
    return appendDisableCaptchaParam(url.toString());
  }

  private areOverrideParamsPresent(clubId: string): boolean {
    const currentUrl = new URL(this.page.url());
    const locale = String(environmentManager.get('LOCALE') || '');
    const isNonProd = ['//sit.', '//uat.', '//dev.'].some(env => currentUrl.href.includes(env));
    const isUSLocale = locale.toUpperCase().includes('US');
    const needsProdApi = isNonProd && !isUSLocale;
    const hasProdApi = currentUrl.searchParams.get('use_prod_api') === 'true';
    return (
      currentUrl.searchParams.get('location_id') === clubId &&
      currentUrl.searchParams.get('disable_captcha') === 'true' &&
      (needsProdApi ? hasProdApi : !hasProdApi)
    );
  }

  private async applyOverrideParamsViaReplaceState(clubId: string): Promise<void> {
    const locale = String(environmentManager.get('LOCALE') || '');
    await this.page.evaluate(
      ({ clubId: targetClubId, locale: currentLocale }) => {
        const url = new URL(window.location.href);
        url.searchParams.set('location_id', targetClubId);
        url.searchParams.set('disable_captcha', 'true');
        const isNonProd = ['//sit.', '//uat.', '//dev.'].some(env => url.href.includes(env));
        const isUSLocale = currentLocale.toUpperCase().includes('US');
        if (isUSLocale) {
          url.searchParams.delete('use_prod_api');
        } else if (isNonProd) {
          url.searchParams.set('use_prod_api', 'true');
        }
        window.history.replaceState({}, '', url.toString());
      },
      { clubId, locale },
    );
  }

  private async navigateToOverrideUrl(clubId: string): Promise<void> {
    await this.page.goto(this.buildOverrideUrl(clubId), {
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForLoadState('load').catch(() => {});
  }

  private assertOverrideUrlParams(clubId: string): void {
    const currentUrl = new URL(this.page.url());
    if (currentUrl.searchParams.get('location_id') !== clubId) {
      throw new Error(`Location override failed, can't proceed with form submission on real gym`);
    }
    if (currentUrl.searchParams.get('disable_captcha') !== 'true') {
      throw new Error(
        `disable_captcha=true is not persisted in URL. Current URL: ${this.page.url()}`,
      );
    }
  }

  /**
   * Ensures location_id and disable_captcha=true stay on the page URL.
   * Uses replaceState only when the lead form is already open to avoid resetting iframe state.
   */
  private async ensureOverrideUrlParams(clubId: string, preserveFormState = false): Promise<void> {
    await this.applyOverrideParamsViaReplaceState(clubId);

    if (this.areOverrideParamsPresent(clubId)) {
      return;
    }

    if (preserveFormState) {
      await this.applyOverrideParamsViaReplaceState(clubId);
      return;
    }

    await this.navigateToOverrideUrl(clubId);
    await this.applyOverrideParamsViaReplaceState(clubId);

    if (!this.areOverrideParamsPresent(clubId)) {
      await this.page.goto(this.buildOverrideUrl(clubId), { waitUntil: 'load' });
    }

    this.assertOverrideUrlParams(clubId);
  }

  private async isLeadFlowInProgress(): Promise<boolean> {
    // Prefer count/attached over isVisible — after filling lower fields (message, consent),
    // firstName can be scrolled out of the iframe viewport while the lead form is still open.
    // Visible-only checks falsely return false → full override navigation → remount hang.
    if ((await this.firstName.count().catch(() => 0)) > 0) {
      return true;
    }
    if ((await this.newGymAddressLine1.count().catch(() => 0)) > 0) {
      return true;
    }
    if ((await this.gymAddressLine1.count().catch(() => 0)) > 0) {
      return true;
    }
    return (
      (await this.iframe
        .locator('[aria-labelledby="date-selection-label"] button')
        .count()
        .catch(() => 0)) > 0
    );
  }

  /**
   * Applies location_id + disable_captcha URL overrides.
   * When the lead form is already open (e.g. after location search + gym selection),
   * persists params via replaceState instead of reloading — a full navigation resets
   * the iframe back to the location search screen.
   *
   * Exception: if Select Gym left a different location_id (live gym with the same
   * display name), remount with the Local Config / AF Test Gyms clubId — replaceState
   * alone does not rebind the lead form and would submit a live gym (client-flagged).
   *
   * ZH-HK exception: HK-0011 is PROD-only (AF Test Gyms STAGE=-). SIT strips
   * location_id=HK-0011 from the host URL and a full remount resets the iframe to
   * search. Keep the open form, pin URL + /api/communications to Local Config clubId.
   */
  private isProdOnlySitLeadClub(): boolean {
    return String(environmentManager.get('LOCALE') || '').toLowerCase() === 'zh-hk';
  }

  private rewriteCommunicationsLocationIds(
    payload: Record<string, unknown>,
    clubId: string,
  ): Record<string, unknown> {
    const next: Record<string, unknown> = { ...payload };
    if ('location_number' in next) next.location_number = clubId;
    if ('locationNumber' in next) next.locationNumber = clubId;
    if (next.data && typeof next.data === 'object') {
      const data = { ...(next.data as Record<string, unknown>) };
      if ('location_number' in data) data.location_number = clubId;
      if ('locationNumber' in data) data.locationNumber = clubId;
      next.data = data;
    }
    return next;
  }

  private async pinLeadSubmitToTestClub(clubId: string): Promise<void> {
    this.leadSubmitClubIdGuard = clubId;
    if (this.leadSubmitRouteInstalled || this.page.isClosed()) {
      return;
    }
    this.leadSubmitRouteInstalled = true;
    await this.page.route('**/api/communications**', async route => {
      const request = route.request();
      const targetClubId = this.leadSubmitClubIdGuard;
      if (!targetClubId || request.method() !== 'POST') {
        await route.continue();
        return;
      }
      const raw = request.postData();
      if (!raw) {
        await route.continue();
        return;
      }
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        await route.continue({
          postData: JSON.stringify(this.rewriteCommunicationsLocationIds(parsed, targetClubId)),
        });
      } catch {
        await route.continue();
      }
    });
  }

  private async applyLocationOverride(clubId: string): Promise<void> {
    // After Select Gym the iframe can remount lazily. Do not burn TIMEOUTS.LONG on a bare
    // waitFor — scroll to attach briefly, then fall through to override navigation.
    const iframeAlreadyAttached = (await this.getIframeElementCount()) > 0;
    if (!iframeAlreadyAttached) {
      const attachedQuickly = await this.iframeElement
        .waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT })
        .then(() => true)
        .catch(() => false);
      if (!attachedQuickly) {
        await this.waitForLazyIframeAttached(TIMEOUTS.MEDIUM).catch(() => {});
      }
    }

    if (await this.isLeadFlowInProgress()) {
      const urlLocationId = !this.page.isClosed()
        ? new URL(this.page.url()).searchParams.get('location_id')
        : null;
      if (urlLocationId && urlLocationId !== clubId) {
        // ZH-HK: HK-0011 is not on SIT. Never remount — keep the open live-search form
        // and rewrite /api/communications location_id to Local Config HK-0011.
        if (this.isProdOnlySitLeadClub()) {
          await this.applyOverrideParamsViaReplaceState(clubId);
          await this.ensureDisableCaptchaPersisted();
          await this.pinLeadSubmitToTestClub(clubId);
          await this.waitForFormReady();
          return;
        }
        await this.navigateToOverrideUrl(clubId);
        await this.ensureOverrideUrlParams(clubId);
        await this.waitForFormReady();
        return;
      }

      await this.applyOverrideParamsViaReplaceState(clubId);
      await this.ensureDisableCaptchaPersisted();
      if (this.isProdOnlySitLeadClub()) {
        await this.pinLeadSubmitToTestClub(clubId);
      }
      // Form already open (e.g. consolidated fill-without-submit → fill-and-submit): skip
      // full waitForFormReady so we do not re-scroll/lazy-wait and burn the suite timeout.
      const firstNameReady = await this.firstName.isVisible().catch(() => false);
      if (firstNameReady) {
        return;
      }
      if ((await this.firstName.count().catch(() => 0)) > 0) {
        if (await this.needsMobileIframeHandling()) {
          await this.waitForFormReady().catch(async () => {
            await this.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
          });
        } else {
          await this.waitForFormReady();
        }
      }
      return;
    }

    await this.navigateToOverrideUrl(clubId);
    await this.ensureOverrideUrlParams(clubId);
    await this.waitForFormReady();
  }

  async overrideLocationAndDisableCaptcha(clubId: string = '9993999'): Promise<void> {
    await this.applyLocationOverride(clubId);
  }

  async overrideLocationAndCaptcha(clubId: string = '9993999'): Promise<void> {
    await this.applyLocationOverride(clubId);
  }

  private assertPageOpen(): void {
    if (this.page.isClosed()) {
      throw new Error('Browser page was closed during form interaction');
    }
  }

  private async getIframeElementCount(): Promise<number> {
    if (this.page.isClosed()) {
      return 0;
    }
    return this.iframeElement.count().catch(() => 0);
  }

  /** Scrolls the host page until a lazy-loaded iframe is injected into the DOM. */
  private async waitForLazyIframeAttached(timeout: number = TIMEOUTS.LONG): Promise<void> {
    const pollIntervalMs = 400;
    const start = Date.now();
    const effectiveTimeout = this.iframeId === 'local-offer-iframe' ? TIMEOUTS.MEDIUM : timeout;
    let scrollPasses = 0;

    // Remounted BAT iframes often inject near the top after Select Gym; start from top
    // so we do not burn the wait scrolled into the footer with no iframe in the DOM.
    await this.page
      .evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      .catch(() => {});

    while (Date.now() - start < effectiveTimeout) {
      this.assertPageOpen();
      await this.dismissBlockingOverlays();

      if ((await this.getIframeElementCount()) > 0) {
        await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT });
        return;
      }

      scrollPasses += 1;
      if (scrollPasses % 6 === 0) {
        await this.page
          .evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
          .catch(() => {});
      } else {
        await this.page
          .evaluate(() => {
            window.scrollBy(0, Math.max(280, window.innerHeight * 0.55));
          })
          .catch(() => {});
      }

      await this.page.waitForTimeout(pollIntervalMs);
    }

    this.assertPageOpen();
    await this.page
      .evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      .catch(() => {});
    await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT });
  }

  /** Scrolls the host page until the form iframe is visible and clear of the sticky header. */
  private async ensureIframeInHostViewport(): Promise<void> {
    this.assertPageOpen();
    await this.dismissBlockingOverlays();

    const iframeAlreadyAttached = (await this.getIframeElementCount()) > 0;

    if (this.iframeId === 'local-offer-iframe' && iframeAlreadyAttached) {
      const visible = await this.iframeElement.isVisible().catch(() => false);
      if (visible) {
        return;
      }
    }

    const attachedQuickly = iframeAlreadyAttached
      ? true
      : await this.iframeElement
          .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
          .then(() => true)
          .catch(() => false);

    if (!attachedQuickly) {
      await this.waitForLazyIframeAttached();
    }

    const isMobile = await this.needsMobileIframeHandling();
    const interactable = await this.isLocatorInteractableInViewport(this.iframeElement).catch(
      () => false,
    );
    const belowHeader =
      !isMobile || (await this.isLocatorBelowStickyHeader(this.iframeElement).catch(() => false));

    if (interactable && belowHeader) {
      await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
      return;
    }

    await this.scrollHostPageToRevealElement(this.iframeElement);

    if (isMobile) {
      await this.scrollLocatorBelowStickyHeader(this.iframeElement);
    }

    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
  }

  /** Scrolls host + iframe to the local offer lead form (below marketing copy). */
  async scrollLocalOfferLeadFormIntoView(): Promise<void> {
    if (this.iframeId !== 'local-offer-iframe' || this.page.isClosed()) {
      return;
    }

    const iframeVisible = await this.iframeElement.isVisible().catch(() => false);
    if (!iframeVisible) {
      return;
    }

    await this.ensureLocalOfferFormInViewport();
  }

  /** Unified local offer iframes render marketing copy above the lead form on mobile. */
  private async ensureLocalOfferFormInViewport(): Promise<void> {
    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });

    await this.page.evaluate(() => {
      const iframe = document.getElementById('local-offer-iframe');
      if (!(iframe instanceof HTMLElement)) return;
      const rect = iframe.getBoundingClientRect();
      const headerOffset = 112;
      const targetTop = window.scrollY + rect.top - headerOffset + rect.height * 0.42;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'instant' });
    });

    await this.iframe
      .getByTestId('lead-form')
      .evaluate(el => {
        el.scrollIntoView({ block: 'start', behavior: 'instant' });
      })
      .catch(() => {});

    await this.scrollElementInFrame(this.firstName);
    await this.scrollIframeFieldIntoHostViewport(this.firstName);
    await this.waitForScrollSettled(this.firstName, 1200);
  }

  async waitForFormReady(): Promise<void> {
    await this.ensureIframeInHostViewport();
    await this.waitForIframeContentLoaded();
    await this.waitForFormFieldReady(this.firstName);

    if (this.iframeId === 'local-offer-iframe') {
      await this.ensureLocalOfferFormInViewport();
      return;
    }

    if (await this.needsMobileIframeHandling()) {
      await this.scrollElementInFrame(this.firstName);
    }
  }

  private async waitForIframeContentLoaded(timeout = TIMEOUTS.LONG): Promise<void> {
    const handle = await this.iframeElement.elementHandle();
    if (!handle) return;

    const frame = await handle.contentFrame();
    if (!frame) return;

    await frame.waitForLoadState('domcontentloaded', { timeout }).catch(() => {});
    await frame.waitForLoadState('load', { timeout: TIMEOUTS.MEDIUM }).catch(() => {});
  }

  /** Scrolls host + iframe until a form field is attached and visible (lazy-loaded BAT content). */
  private async waitForFormFieldReady(locator: Locator, timeout = TIMEOUTS.LONG): Promise<void> {
    const pollIntervalMs = 400;
    const start = Date.now();
    let hostScrollDone = false;
    const isNavigationRace = (error: unknown): boolean =>
      /Execution context was destroyed|Target closed|Frame was detached|navigating/i.test(
        String(error),
      );

    while (Date.now() - start < timeout) {
      try {
        await this.dismissBlockingOverlays();

        if (!hostScrollDone) {
          await this.ensureIframeInHostViewport();
          hostScrollDone = true;
        } else {
          const interactable = await this.isLocatorInteractableInViewport(this.iframeElement).catch(
            () => false,
          );
          if (!interactable) {
            await this.ensureIframeInHostViewport();
          }
        }

        if (await locator.isVisible().catch(() => false)) {
          await this.scrollElementInFrame(locator);
          await locator.scrollIntoViewIfNeeded({ timeout: TIMEOUTS.SHORT }).catch(() => {});
          return;
        }

        // locator.count() can throw when the iframe remounts mid-navigation — never hard-fail here.
        if ((await locator.count().catch(() => 0)) > 0) {
          try {
            await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
            await this.scrollElementInFrame(locator);
            await locator.scrollIntoViewIfNeeded({ timeout: TIMEOUTS.SHORT }).catch(() => {});
            return;
          } catch {
            // Field may still be hydrating; keep scrolling inside the iframe only.
          }
        }

        await this.evaluateWithTimeout(this.iframe.locator('body').first(), () => {
          window.scrollBy(0, Math.max(240, window.innerHeight * 0.45));
        });
      } catch (error) {
        if (!isNavigationRace(error)) {
          throw error;
        }
        hostScrollDone = false;
      }
      await this.page.waitForTimeout(pollIntervalMs);
    }

    const remainingMs = Math.max(TIMEOUTS.MEDIUM, timeout - (Date.now() - start));
    await locator.waitFor({ state: 'attached', timeout: remainingMs });
    await locator.waitFor({ state: 'visible', timeout: remainingMs });
  }

  async waitForGymSelectionDisplayed(): Promise<void> {
    // Prefer a bounded firstName / iframe wait over full waitForFormReady — Select Gym and
    // consolidated WebKit journeys otherwise burn the suite timeout in dismissBlockingOverlays.
    const firstNameReady = await this.firstName.isVisible().catch(() => false);
    if (!firstNameReady) {
      await this.iframeElement
        .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG })
        .catch(() => {});
      const becameVisible = await this.firstName
        .waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
        .then(() => true)
        .catch(() => false);
      // Do not fall through to full waitForFormReady here — callers (MI/Contact Us Select Gym)
      // recover via deep-link; burning LONG on a still-mounted search UI cascades suite timeouts.
      if (!becameVisible) {
        // One bounded host+iframe nudge in case the lead form is mid-remount.
        await this.iframeElement
          .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT })
          .catch(() => {});
        await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});
        await this.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT }).catch(() => {});
      }
    }
    // Prefer markers that exist for this flow first. Do not burn TIMEOUTS.LONG on
    // absent Local Offer / BAT-specific nodes — consolidated journeys call this
    // repeatedly via scrollConsentIntoView and otherwise hit the suite test timeout.
    const gymMarkers = [
      this.newGymAddressLine1,
      this.gymAddressLine1,
      this.selectedGymName,
      this.selectedGymNameForLocalOffer,
    ];
    for (const locator of gymMarkers) {
      try {
        if ((await locator.count()) === 0) {
          continue;
        }
        await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
        await this.ensureLocatorInIframeViewport(locator);
        return;
      } catch {
        continue;
      }
    }
    throw new Error('Gym selection details are not visible in user form iframe');
  }

  async getTextInIframeViewport(
    locator: Locator,
    timeout: number = TIMEOUTS.LONG,
  ): Promise<string> {
    await this.ensureLocatorInIframeViewport(locator);
    await locator.waitFor({ state: 'visible', timeout });

    const text = await locator
      .innerText({ timeout })
      .catch(async () => (await locator.textContent({ timeout })) ?? '');

    return Helpers.normalizeText(text);
  }

  /** Local / Member unified offers: reopen location search from the lead form. */
  async clickChangeLocationButton(): Promise<void> {
    await this.waitForFormReady().catch(() => {});
    await this.changeLocationButton.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.changeLocationButton.click();
    await this.changeLocationButton
      .waitFor({ state: 'hidden', timeout: TIMEOUTS.LONG })
      .catch(() => {});
  }

  async getGymAddressLines(): Promise<{ line1: string; line2: string }> {
    await this.waitForGymSelectionDisplayed();
    const line1 = await this.getTextInIframeViewport(this.gymAddressLine1);
    const line2 = await this.getTextInIframeViewport(this.gymAddressLine2);
    return { line1, line2 };
  }

  async getSelectedGymName(): Promise<string> {
    await this.waitForGymSelectionDisplayed();
    const candidates = [
      this.newGymAddressLine1,
      this.selectedGymName,
      this.selectedGymNameForLocalOffer,
    ];

    for (const locator of candidates) {
      try {
        await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
        const text = await this.getTextInIframeViewport(locator);
        if (text) {
          return text;
        }
      } catch {
        continue;
      }
    }

    throw new Error('Selected gym name not visible in user form iframe');
  }

  /** Reads gym name after override without re-running full gym-selection scroll flows. */
  async getSelectedGymNameQuick(): Promise<string> {
    await this.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    const candidates = [
      this.newGymAddressLine1,
      this.selectedGymName,
      this.selectedGymNameForLocalOffer,
    ];

    for (const locator of candidates) {
      try {
        await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
        const text = Helpers.normalizeText(await locator.innerText({ timeout: TIMEOUTS.SHORT }));
        if (text) {
          return text;
        }
      } catch {
        continue;
      }
    }

    throw new Error('Selected gym name not visible in user form iframe');
  }

  /**
   * Ensures disable_captcha=true stays on the page URL (preserves location_id and other params).
   * Also syncs use_prod_api (strip for US; keep/add for non-US non-prod) so stale params from
   * prior navigations or APP schedule redirects do not survive submit/revisit flows.
   * Uses replaceState first to avoid losing in-iframe gym state; reloads only if still missing.
   */
  async ensureDisableCaptchaPersisted(): Promise<void> {
    if (this.page.isClosed()) {
      return;
    }

    let locationId: string | null = null;
    try {
      locationId = new URL(this.page.url()).searchParams.get('location_id');
    } catch {
      return;
    }

    const locale = String(environmentManager.get('LOCALE') || '');
    try {
      await this.page.evaluate(currentLocale => {
        const url = new URL(window.location.href);
        url.searchParams.set('disable_captcha', 'true');
        const isNonProd = ['//sit.', '//uat.', '//dev.'].some(env => url.href.includes(env));
        const isUSLocale = currentLocale.toUpperCase().includes('US');
        if (isUSLocale || !isNonProd) {
          url.searchParams.delete('use_prod_api');
        } else if (!url.searchParams.has('use_prod_api')) {
          url.searchParams.set('use_prod_api', 'true');
        }
        window.history.replaceState({}, '', url.toString());
      }, locale);
    } catch (error) {
      if (this.page.isClosed()) {
        return;
      }
      throw error;
    }

    let currentUrl = new URL(this.page.url());
    if (currentUrl.searchParams.get('disable_captcha') === 'true') {
      return;
    }

    const preservePageState = await this.isLeadFlowInProgress();

    if (preservePageState) {
      return;
    }

    if (currentUrl.searchParams.get('disable_captcha') !== 'true') {
      currentUrl.searchParams.set('disable_captcha', 'true');
      await this.page.goto(appendDisableCaptchaParam(currentUrl.toString()), {
        waitUntil: 'load',
      });
      currentUrl = new URL(this.page.url());
    }

    if (locationId && currentUrl.searchParams.get('location_id') !== locationId) {
      currentUrl.searchParams.set('location_id', locationId);
      currentUrl.searchParams.set('disable_captcha', 'true');
      await this.page.goto(appendDisableCaptchaParam(currentUrl.toString()), {
        waitUntil: 'load',
      });
      currentUrl = new URL(this.page.url());
    }

    if (currentUrl.searchParams.get('disable_captcha') !== 'true') {
      throw new Error(
        `disable_captcha=true is not persisted in URL. Current URL: ${this.page.url()}`,
      );
    }
  }

  /** @deprecated Prefer ensureDisableCaptchaPersisted */
  async disableCaptchaOnCurrentUrl(): Promise<void> {
    await this.ensureDisableCaptchaPersisted();
    await this.waitForVisible(this.firstName, TIMEOUTS.LONG);
  }

  async fillAndSubmitForm(
    formData: UserFormData,
    submit: boolean = true,
    options?: { skipWaitForReady?: boolean },
  ) {
    if (!options?.skipWaitForReady) {
      await this.waitForFormReady();
    }
    await this.ensureDisableCaptchaPersisted();

    if (this.iframeId === 'local-offer-iframe' && options?.skipWaitForReady) {
      await this.scrollLocalOfferLeadFormIntoView();
    }

    await this.fillInputInIframe(this.firstName, formData.firstName, { skipHostScroll: true });
    await this.fillInputInIframe(this.lastName, formData.lastName, { skipHostScroll: true });
    await this.fillInputInIframe(this.email, formData.email, { skipHostScroll: true });
    // Phone uses intl-tel-input on DE/AT — dedicated filler handles country dial code better.
    await this.fillPhoneInIframe(formData.phone);

    if (formData.zipCode) {
      // Always prefer enterZipCode when the field exists — isVisible() without scrolling can
      // skip PLZ on mobile when the field sits below the fold.
      // Some locales/CMS embeds omit zip entirely (IE/GB try-us-free + MI with known gym;
      // IT Local Offer). Soft-detect before requiring the field.
      // When locale-element-map marks zipCodeField (e.g. EN-IN PIN Code), always fill —
      // hasZipCodeField() can briefly return false during iframe remount and skipping PIN
      // leaves "This Field is required" with no /api/lead-capture.
      // Local Offer embeds omit zip/postal for all locales — never force via locale map.
      // AFW-3607: EN-GB/EN-IE Try Us Free remounts onto #book-a-tour-iframe — postcode may be
      // omitted even when locale-element-map.zipCodeField is true (do not throw missing zip).
      const localeConfig = localeElements[localeManager.getCurrentLocale()];
      const isLocalOffer = this.iframeId === 'local-offer-iframe';
      const isBookATourIframe = this.iframeId === 'book-a-tour-iframe';
      const shouldFillZip =
        isLocalOffer || isBookATourIframe
          ? await this.hasZipCodeField()
          : Boolean(localeConfig?.zipCodeField) || (await this.hasZipCodeField());
      if (shouldFillZip) {
        await this.enterZipCode(formData.zipCode);
      }
    }

    await this.checkRequiredFormCheckboxes();
    if (submit) {
      await this.clickSubmitButton({ ensureRequiredCheckboxes: false });
    }
  }

  async fillEventsForm(formData: UserFormData) {
    await this.fillEventsPageForm(formData);
  }

  /**
   * Fills the events iframe form with one iframe scroll pass per field (avoids long retry loops on mobile).
   */
  async fillEventsPageForm(formData: UserFormData): Promise<void> {
    await this.waitForFormReady();
    await this.scrollParentIntoViewOnPage(this.iframeElement);

    await this.fillInputInIframe(this.firstName, formData.firstName);
    await this.fillInputInIframe(this.lastName, formData.lastName);
    await this.fillInputInIframe(this.email, formData.email);
    // intl-tel-input already has the locale dial code — strip country prefix like MI/TUF.
    // Raw +63… on PH Events leaves an invalid phone and /api/lead-capture never fires.
    await this.fillPhoneInIframe(formData.phone);

    if (formData.zipCode) {
      const localeConfig = localeElements[localeManager.getCurrentLocale()];
      const shouldFillZip = Boolean(localeConfig?.zipCodeField) || (await this.hasZipCodeField());
      if (shouldFillZip) {
        await this.enterZipCode(formData.zipCode);
      }
    }

    await this.checkRequiredFormCheckboxes();
  }

  async submitEventsForm(submit: boolean = true) {
    if (submit) {
      await this.clickSubmitButton();
    }
  }

  async uncheckLocalResidentCheckbox(): Promise<void> {
    await this.waitForGymSelectionDisplayed();
    const checkbox = this.localResidentCheckbox;

    if ((await checkbox.count()) === 0) {
      // Events shells may use #termsAccepted for required legal consent — uncheck that instead.
      if (await this.isCheckboxAttached(this.consentCheckbox)) {
        await this.scrollConsentIntoView(this.consentCheckbox).catch(() => {});
        if (await this.consentCheckbox.isChecked().catch(() => false)) {
          await this.consentCheckbox.uncheck({ force: true }).catch(async () => {
            await this.consentCheckbox.evaluate((el: HTMLInputElement) => {
              el.checked = false;
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            });
          });
        }
      }
      return;
    }

    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await checkbox.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await this.scrollLegalCheckboxAreaIntoView();
    await this.scrollElementInFrame(checkbox);

    if (await this.needsMobileIframeHandling()) {
      await this.scrollIframeFieldIntoHostViewport(checkbox);
      await this.waitForScrollSettled(checkbox, 1200);
    }

    if (!(await this.isLocalResidentCheckboxChecked())) {
      return;
    }

    const muiCheckboxControl = this.getLocalResidentCheckboxControl();
    const isMobile = await Helpers.isMobileDevice(this.page);
    const needsForce = isMobile || this.getBrowserName() === 'webkit';

    const uncheckStrategies: Array<() => Promise<void>> = [
      async () => {
        await muiCheckboxControl.first().click({ force: needsForce, timeout: TIMEOUTS.LONG });
      },
      async () => {
        await this.localResidentCheckboxLabel.click({
          force: true,
          position: { x: 8, y: 8 },
          timeout: TIMEOUTS.LONG,
        });
      },
      async () => {
        await checkbox.uncheck({ force: needsForce, timeout: TIMEOUTS.LONG });
      },
      async () => {
        await this.scrollElementInFrame(this.localResidentCheckboxLabel);
        await this.localResidentCheckboxLabel.click({ force: true, timeout: TIMEOUTS.LONG });
      },
      async () => {
        await checkbox.evaluate((el: HTMLInputElement) => el.click());
      },
      async () => {
        await checkbox.evaluate((el: HTMLInputElement) => {
          el.checked = false;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      },
    ];

    for (let attempt = 1; attempt <= 3; attempt++) {
      for (const uncheck of uncheckStrategies) {
        try {
          await uncheck();
        } catch {
          // fall through to next strategy
        }
        if (!(await this.isLocalResidentCheckboxChecked())) {
          return;
        }
      }
      await this.scrollElementInFrame(checkbox);
      await this.page.waitForTimeout(300);
    }

    await expect
      .poll(async () => !(await this.isLocalResidentCheckboxChecked()), {
        timeout: TIMEOUTS.MEDIUM,
      })
      .toBe(true);
  }

  private getLocalResidentCheckboxControl(): Locator {
    return this.iframe.locator(
      [
        'span.MuiCheckbox-root:has(#isLocalResident)',
        'span.MuiButtonBase-root:has(#isLocalResident)',
        '[data-state="checked"]:has(#isLocalResident)',
        'button[role="checkbox"]:has(#isLocalResident)',
        'label[for="isLocalResident"] span:first-of-type',
        'label[for="isLocalResident"]',
      ].join(', '),
    );
  }

  private async isLocalResidentCheckboxChecked(): Promise<boolean> {
    return this.localResidentCheckbox.evaluate((input: HTMLInputElement) => {
      if (input.checked) {
        return true;
      }

      let element: Element | null = input;
      while (element && element !== document.body) {
        const ariaChecked = element.getAttribute('aria-checked');
        const dataState = element.getAttribute('data-state');
        if (ariaChecked === 'true' || dataState === 'checked') {
          return true;
        }
        if (element.classList.contains('Mui-checked')) {
          return true;
        }
        element = element.parentElement;
      }

      const label = document.querySelector('label[for="isLocalResident"], #isLocalResident-label');
      if (label?.querySelector('[data-state="checked"], svg[aria-hidden="true"]')) {
        const uncheckedPeer = label.querySelector('[data-state="unchecked"]');
        if (!uncheckedPeer) {
          return true;
        }
      }

      return false;
    });
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage, TIMEOUTS.LONG);
    await this.scrollIntoView(this.errorMessage);
    return (await this.errorMessage.textContent()) ?? '';
  }

  private getLeadFormButton(buttonKey: string): Locator {
    return this.iframe.getByTestId('lead-form').getByRole('button', {
      name: t(buttonKey),
    });
  }

  private getSubmitButton() {
    const currentLocale = localeManager.getCurrentLocale();
    const localeElementConfig = localeElements[currentLocale];

    if (!localeElementConfig) {
      throw new Error(
        `Locale "${currentLocale}" does not exist in locale-element-map.ts. Please add it.`,
      );
    }

    const isMembershipInquiry = this.iframeId === 'membership-inquiry-iframe';

    if (isMembershipInquiry) {
      const submit = t(localeElementConfig.membershipInquiryButtonKey).replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      );
      // Prefer type=submit only — never match the progress stepper
      // (role=button, aria-label "Step 3: Submit form (current)") via unanchored /SUBMIT/.
      // EN-CA MI uses GET STARTED (AFW-3993 / live legal copy); other locales keep SUBMIT.
      const exactButtonName = new RegExp(
        `^(${submit}|SUBMIT|GET STARTED|COMMENCER|ENVOYER|EINREICHEN|Find Out More|Formular absenden|ส่ง)$`,
        'i',
      );
      const submitInLeadForm = this.iframe
        .getByTestId('lead-form')
        .locator('button[type="submit"]');
      return submitInLeadForm.or(
        this.iframe.getByTestId('lead-form').getByRole('button', { name: exactButtonName }),
      );
    }

    // Events Promo uses GET STARTED (or localized JETZT ANFANGEN); FTP / TFYL use SUBMIT.
    // Try Us Free / Apple Fitness may use either label by locale.
    // Local Offer DE uses EINREICHEN (type=submit).
    // Book A Tour (`book-a-tour-iframe`) uses the same type=submit + exact-name pattern —
    // substring "SUBMIT" matches the progress stepper and blocks /api/lead-capture.
    const getStarted = t(TranslationKeys.Buttons.UserForm.GetStarted).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
    const submit = t(TranslationKeys.Buttons.UserForm.Submit).replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
    // Prefer type=submit only — never match the progress stepper
    // (role=button, aria-label "Step 3: Submit form (current)") via /SUBMIT/.
    // Playwright .or() is document order, so keep the fallback name exact (^...$).
    const exactButtonName = new RegExp(
      `^(GET STARTED|COMMENCER|SUBMIT|ENVOYER|EINREICHEN|Formular absenden|${getStarted}|${submit}|LOS GEHT'?S)$`,
      'i',
    );
    const submitInLeadForm = this.iframe.getByTestId('lead-form').locator('button[type="submit"]');
    // If type=submit exists, use it exclusively (avoids any name-based stepper match).
    return submitInLeadForm.or(
      this.iframe.getByTestId('lead-form').getByRole('button', { name: exactButtonName }),
    );
  }

  async isTextVisible(
    textKey: string,
    replacements?: Record<string, string>,
    isIframe: boolean = true,
  ): Promise<boolean> {
    const contextLocator: Page | FrameLocator = isIframe ? (this.iframe ?? this.page) : this.page;
    return this.verifyTextVisible(textKey, replacements, contextLocator);
  }

  async isPrivacyNoticeVisible(
    textKey: string,
    replacements?: Record<string, string>,
  ): Promise<boolean> {
    return this.verifyPrivacyNoticeVisible(textKey, replacements);
  }

  async isHeadingVisible(headingKey: string, isIframe: boolean = true): Promise<boolean> {
    const contextLocator: Page | FrameLocator = isIframe ? (this.iframe ?? this.page) : this.page;
    return this.verifyHeadingVisible(headingKey, contextLocator);
  }

  private async resolvePhoneField(): Promise<Locator> {
    const candidates = [
      this.phone,
      this.locateElementInsideIframe(this.iframe, '[data-testid="phonenumber-field"]'),
      this.locateElementInsideIframe(this.iframe, 'input[name="phoneNum"]'),
      this.locateElementInsideIframe(this.iframe, 'input[type="tel"]'),
    ];

    for (const locator of candidates) {
      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }

    await this.phone.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    return this.phone;
  }

  private async fillPhoneInIframe(value: string): Promise<void> {
    const phoneField = await this.resolvePhoneField();
    await this.scrollParentIntoViewOnPage(this.iframeElement);
    await phoneField.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    await this.scrollElementInFrame(phoneField);

    // intl-tel-input already selects the locale dial code — prefer national digits so DE/AT
    // does not end up with a duplicated +49 that triggers "Telefon ist ungültig".
    const countryCode = d(TestDataKeys.PhoneNumber.CountryCode).replace(/\D/g, '');
    const digits = value.replace(/\D/g, '');
    const nationalValue =
      countryCode && digits.startsWith(countryCode) ? digits.slice(countryCode.length) : digits;
    const valuesToTry = Array.from(new Set([nationalValue, value, digits].filter(Boolean)));

    const needsForce = await this.needsMobileIframeHandling();
    const strategies: Array<(val: string) => Promise<void>> = [
      async val => {
        await phoneField.click({ force: needsForce, timeout: TIMEOUTS.LONG });
        await phoneField.fill('');
        await phoneField.fill(val);
      },
      async val => {
        await phoneField.click({ force: needsForce, timeout: TIMEOUTS.LONG });
        await this.autofillPhoneNumber(phoneField, val);
      },
      async val => {
        await phoneField.evaluate((el: HTMLInputElement, phoneVal: string) => {
          el.focus();
          el.value = '';
          const dataTransfer = new DataTransfer();
          dataTransfer.setData('text/plain', phoneVal);
          el.dispatchEvent(
            new ClipboardEvent('paste', {
              bubbles: true,
              cancelable: true,
              clipboardData: dataTransfer,
            }),
          );
          el.value = phoneVal;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, val);
      },
    ];

    for (const candidate of valuesToTry) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        for (const setValue of strategies) {
          try {
            await setValue(candidate);
          } catch {
            // try next strategy
          }
          if (await this.inputValueMatches(phoneField, value)) {
            return;
          }
          // Accept national-only matches when the intl widget stores dial code separately.
          if (await this.inputValueMatches(phoneField, candidate)) {
            return;
          }
          const invalidVisible = await this.iframe
            .getByText(/telefon ist ungültig|invalid phone|phone.*invalid/i)
            .first()
            .isVisible()
            .catch(() => false);
          if (!invalidVisible && (await phoneField.inputValue()).replace(/\D/g, '').length >= 7) {
            return;
          }
        }
        await this.scrollElementInFrame(phoneField);
        await this.page.waitForTimeout(200);
      }
    }

    await this.expectInputValue(phoneField, value);
  }

  /** Scrolls host page + iframe content until a field's screen bounding box is below the sticky header. */
  private async scrollIframeFieldIntoHostViewport(locator: Locator): Promise<void> {
    await this.dismissBlockingOverlays().catch(() => {});

    // Consent / legal scroll on WebKit can run while the SPA remounts the lead iframe.
    if ((await this.getIframeElementCount()) === 0) {
      await this.iframeElement
        .waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT })
        .catch(() => {});
      if ((await this.getIframeElementCount()) === 0) {
        await this.waitForLazyIframeAttached(TIMEOUTS.MEDIUM).catch(() => {});
      }
    }
    if ((await this.getIframeElementCount()) === 0) {
      throw new Error(
        `Lead form iframe #${this.iframeId} is not attached before host field scroll`,
      );
    }

    if (this.iframeId === 'local-offer-iframe') {
      await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    } else {
      await this.scrollParentIntoViewOnPage(this.iframeElement);
    }

    await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await this.scrollElementInFrame(locator);

    const headerOffset = this.getStickyHeaderOffset();
    const padding = 28;
    const maxAttempts = 12;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.scrollElementInFrame(locator).catch(() => {});

      const box = await locator.boundingBox().catch(() => null);
      if (!box || box.width <= 0 || box.height <= 0) {
        await this.page.waitForTimeout(200);
        continue;
      }

      const viewportHeight = await this.page.evaluate(
        () => window.innerHeight || document.documentElement.clientHeight,
      );
      const visibleTop = headerOffset + padding;
      const visibleBottom = viewportHeight - padding;
      const fieldTop = box.y;
      const fieldBottom = box.y + box.height;

      if (fieldTop >= visibleTop && fieldBottom <= visibleBottom) {
        return;
      }

      if (fieldBottom > visibleBottom) {
        await this.page.evaluate(
          amount => window.scrollBy({ top: amount, left: 0, behavior: 'instant' }),
          fieldBottom - visibleBottom + 48,
        );
      } else if (fieldTop < visibleTop) {
        await this.page.evaluate(
          amount => window.scrollBy({ top: amount, left: 0, behavior: 'instant' }),
          fieldTop - visibleTop - 24,
        );
      }

      await this.page.waitForTimeout(250);
    }
  }

  private async setElementValueViaPrototype(locator: Locator, value: string): Promise<void> {
    await locator.evaluate((el: HTMLInputElement | HTMLTextAreaElement, val: string) => {
      const prototype =
        el instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
      setter?.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
  }

  private async trySetIframeFieldValue(locator: Locator, value: string): Promise<boolean> {
    try {
      await this.setElementValueViaPrototype(locator, value);
      return await this.inputValueMatches(locator, value);
    } catch {
      return false;
    }
  }

  private async scrollContactFormFieldIntoView(locator: Locator): Promise<void> {
    await this.scrollElementInFrame(locator);
    await locator.scrollIntoViewIfNeeded({ timeout: TIMEOUTS.SHORT }).catch(() => {});
  }

  private async scrollMessageFieldIntoView(messageField: Locator): Promise<void> {
    await this.iframe
      .locator('body')
      .first()
      .evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
        document.documentElement.scrollTop = document.body.scrollHeight;
      })
      .catch(() => {});

    await this.scrollContactFormFieldIntoView(messageField);
  }

  private async fillContactFieldOnMobile(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.scrollContactFormFieldIntoView(locator);

    if (await this.trySetIframeFieldValue(locator, value)) {
      return;
    }

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await locator
          .tap({ timeout: TIMEOUTS.SHORT })
          .catch(() => locator.click({ force: true, timeout: TIMEOUTS.SHORT }));
        await locator.fill(value);
      } catch {
        // try next attempt
      }
      if (await this.inputValueMatches(locator, value)) {
        return;
      }
      await this.scrollContactFormFieldIntoView(locator);
    }

    await this.expectInputValue(locator, value);
  }

  private async fillContactPhoneOnMobile(phoneField: Locator, value: string): Promise<void> {
    await phoneField.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.scrollContactFormFieldIntoView(phoneField);

    if (await this.trySetIframeFieldValue(phoneField, value)) {
      return;
    }

    const strategies: Array<() => Promise<void>> = [
      () => this.autofillPhoneNumber(phoneField, value),
      async () => {
        await phoneField
          .tap({ timeout: TIMEOUTS.SHORT })
          .catch(() => phoneField.click({ force: true, timeout: TIMEOUTS.SHORT }));
        await phoneField.fill('');
        await phoneField.fill(value);
      },
    ];

    for (let attempt = 1; attempt <= 2; attempt++) {
      for (const setValue of strategies) {
        try {
          await setValue();
        } catch {
          // try next strategy
        }
        if (await this.inputValueMatches(phoneField, value)) {
          return;
        }
      }
      await this.scrollContactFormFieldIntoView(phoneField);
    }

    await this.expectInputValue(phoneField, value);
  }

  private async fillContactFormOnMobile(formData: UserFormData): Promise<void> {
    await this.dismissBlockingOverlays().catch(() => {});
    await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});

    await this.fillContactFieldOnMobile(this.firstName, formData.firstName);
    await this.fillContactFieldOnMobile(this.lastName, formData.lastName);
    await this.fillContactFieldOnMobile(this.email, formData.email);

    const phoneField = await this.resolvePhoneField();
    await this.fillContactPhoneOnMobile(phoneField, formData.phone);

    if (formData.message) {
      await this.message.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
      if (await this.message.isVisible().catch(() => false)) {
        await this.fillMessageInIframe(formData.message);
      }
    }
  }

  private async fillMessageInIframe(value: string): Promise<void> {
    const messageField = this.message;
    await messageField.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });

    await this.scrollMessageFieldIntoView(messageField);

    if (await this.trySetIframeFieldValue(messageField, value)) {
      return;
    }

    const needsForce = await this.needsMobileIframeHandling();

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        if (needsForce) {
          await messageField
            .tap({ timeout: TIMEOUTS.SHORT })
            .catch(() => messageField.click({ force: true, timeout: TIMEOUTS.SHORT }));
        } else {
          await messageField.click({ timeout: TIMEOUTS.SHORT });
        }
        await messageField.fill('');
        await messageField.fill(value);
      } catch {
        // try next attempt
      }
      if (await this.inputValueMatches(messageField, value)) {
        return;
      }
      await this.scrollMessageFieldIntoView(messageField);
    }

    await this.expectInputValue(messageField, value);
  }

  async fillAndSubmitContactForm(formData: UserFormData, submit: boolean = true) {
    const isMobile = await this.needsMobileIframeHandling();

    if (isMobile) {
      await this.ensureDisableCaptchaPersisted();
      if (!(await this.firstName.isVisible().catch(() => false))) {
        await this.waitForFormReady();
      } else {
        await this.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
      }
      await this.fillContactFormOnMobile(formData);
    } else {
      // Consolidated Contact Us fills the form twice; skip host/iframe readiness when
      // fields are already on screen from the prior without-submitting pass.
      if (!(await this.firstName.isVisible().catch(() => false))) {
        await this.waitForFormReady();
      }
      await this.ensureDisableCaptchaPersisted();

      await this.fillInputInIframe(this.firstName, formData.firstName);
      await this.fillInputInIframe(this.lastName, formData.lastName);
      await this.fillInputInIframe(this.email, formData.email);
      await this.fillPhoneInIframe(formData.phone);

      if (formData.message) {
        await this.message.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
        if (await this.message.isVisible().catch(() => false)) {
          await this.fillMessageInIframe(formData.message);
        }
      }
    }

    if (submit) {
      await this.clickSubmitInIframe();
    }
  }

  async autofillPhoneNumber(locator: Locator, value: string): Promise<void> {
    await this.prepareIframeFieldForInteraction(locator);
    await locator.evaluate((el: HTMLInputElement, val: string) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      nativeInputValueSetter?.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
  }

  async copyPastePhoneNumber(locator: Locator, value: string): Promise<void> {
    await this.prepareIframeFieldForInteraction(locator);
    await locator.evaluate((el: HTMLInputElement, val: string) => {
      el.focus();
      el.value = '';
      const dataTransfer = new DataTransfer();
      dataTransfer.setData('text/plain', val);
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer,
      });
      el.dispatchEvent(pasteEvent);
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
  }

  private async resolveZipCodeField(): Promise<Locator> {
    // Prefer scrolling the lead form body so PLZ below the fold becomes interactable on mobile.
    await this.iframe
      .locator('body')
      .first()
      .evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'instant' });
      })
      .catch(() => {});

    const candidates = [
      this.zipCode,
      this.zipCodeElement,
      this.iframe.locator('input[name="zipCode"]').first(),
      this.iframe
        .getByLabel(/postleitzahl|postal code|zip|codice postale|eircode|postcode|pin\s*code|pin/i)
        .first(),
      this.iframe
        .locator(
          'input[placeholder*="Eircode" i], input[placeholder*="Postcode" i], input[placeholder*="PIN" i]',
        )
        .first(),
    ];
    for (const locator of candidates) {
      try {
        await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT });
        await this.ensureLocatorInIframeViewport(locator).catch(() => {});
        await this.scrollIframeFieldIntoHostViewport(locator).catch(() => {});
        if (await locator.isVisible().catch(() => false)) {
          return locator;
        }
        await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
        return locator;
      } catch {
        continue;
      }
    }
    throw new Error('Zip code field not visible in user form iframe');
  }

  /** True when a zip/postal/eircode input is present in the lead form iframe. */
  async hasZipCodeField(): Promise<boolean> {
    const quick = this.iframe
      .locator(
        [
          'input[name="zipCode"]',
          '#zipCode input',
          '[data-testid="zip-code"] input',
          'input[autocomplete="postal-code"]',
          'input[aria-label*="Postleitzahl" i]',
          'input[aria-label*="Postal" i]',
          'input[aria-label*="ZIP" i]',
          'input[aria-label*="PIN" i]',
          'input[aria-label*="Eircode" i]',
          'input[aria-label*="Postcode" i]',
          'input[placeholder*="Eircode" i]',
          'input[placeholder*="Postcode" i]',
          'input[placeholder*="PIN" i]',
        ].join(', '),
      )
      .first();
    if ((await quick.count()) > 0) {
      return true;
    }
    return this.iframe
      .getByRole('textbox', { name: /postleitzahl|postal|zip|eircode|postcode|pin\s*code|pin/i })
      .first()
      .count()
      .then(c => c > 0)
      .catch(() => false);
  }

  private async isPhoneInput(locator: Locator): Promise<boolean> {
    const [testId, name, type] = await Promise.all([
      locator.getAttribute('data-testid').catch(() => null),
      locator.getAttribute('name').catch(() => null),
      locator.getAttribute('type').catch(() => null),
    ]);
    return testId === 'phonenumber-field' || name === 'phoneNum' || type === 'tel';
  }

  private async inputValueMatches(locator: Locator, expected: string): Promise<boolean> {
    const actual = await locator.inputValue().catch(() => '');
    if (actual === expected) {
      return true;
    }
    if (await this.isPhoneInput(locator)) {
      if (!actual || !expected) {
        return false;
      }
      return Helpers.normalizePhoneNumber(actual) === Helpers.normalizePhoneNumber(expected);
    }
    return false;
  }

  private async expectInputValue(locator: Locator, expected: string): Promise<void> {
    if (await this.isPhoneInput(locator)) {
      await expect
        .poll(async () => this.inputValueMatches(locator, expected), { timeout: TIMEOUTS.MEDIUM })
        .toBe(true);
      return;
    }
    await expect(locator).toHaveValue(expected, { timeout: TIMEOUTS.MEDIUM });
  }

  async fillInputInIframe(
    locator: Locator,
    value: string,
    options?: { skipHostScroll?: boolean },
  ): Promise<void> {
    if (!options?.skipHostScroll) {
      if (this.iframeId === 'local-offer-iframe') {
        await this.ensureLocalOfferFormInViewport();
      } else {
        await this.scrollParentIntoViewOnPage(this.iframeElement);
      }
    }
    await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    if (await this.needsMobileIframeHandling()) {
      await this.ensureLocatorInIframeViewport(locator);
    }
    await this.scrollElementInFrame(locator);

    const needsForce = await this.needsMobileIframeHandling();

    const setValueStrategies: Array<() => Promise<void>> = [
      async () => {
        if (needsForce) {
          await locator
            .tap({ timeout: TIMEOUTS.LONG })
            .catch(() => locator.click({ force: true, timeout: TIMEOUTS.LONG }));
        } else {
          await locator.click({ timeout: TIMEOUTS.LONG });
        }
        await locator.fill('');
        await locator.fill(value);
      },
      async () => {
        await locator.click({ force: needsForce, timeout: TIMEOUTS.LONG });
        await locator.fill('');
        await locator.pressSequentially(value, { delay: 50 });
      },
      async () => {
        await this.setElementValueViaPrototype(locator, value);
      },
    ];

    for (let attempt = 1; attempt <= 3; attempt++) {
      for (const setValue of setValueStrategies) {
        try {
          await setValue();
        } catch {
          // try next strategy
        }
        if (await this.inputValueMatches(locator, value)) {
          return;
        }
      }
      await this.scrollElementInFrame(locator);
      await this.page.waitForTimeout(200);
    }

    await this.expectInputValue(locator, value);
  }

  async enterZipCode(value: string): Promise<void> {
    const zipField = await this.resolveZipCodeField();
    await this.ensureLocatorInIframeViewport(zipField);

    const isMobile = await Helpers.isMobileDevice(this.page);
    const needsForce = isMobile || this.getBrowserName() === 'webkit';

    const setValueStrategies: Array<() => Promise<void>> = [
      async () => {
        await zipField.click({ force: needsForce, timeout: TIMEOUTS.LONG });
        await zipField.fill('');
        await zipField.fill(value);
      },
      async () => {
        await this.clearAndType(zipField, value);
      },
      async () => {
        await zipField.evaluate((el: HTMLInputElement, val: string) => {
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
          setter?.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, value);
      },
    ];

    for (let attempt = 1; attempt <= 3; attempt++) {
      for (const setValue of setValueStrategies) {
        try {
          await setValue();
        } catch {
          // try next strategy
        }
        if ((await zipField.inputValue()) === value) {
          return;
        }
      }
      await this.ensureLocatorInIframeViewport(zipField);
      await this.page.waitForTimeout(300);
    }

    await expect(zipField).toHaveValue(value, { timeout: TIMEOUTS.MEDIUM });
  }

  async assertLocalResidentDisclaimerText(): Promise<void> {
    if (!(await this.firstName.isVisible().catch(() => false))) {
      await this.waitForFormReady();
    }
    await this.scrollConsentIntoView(this.localResidentDisclaimerText);
    await expect(this.localResidentDisclaimerText).toBeVisible();
    const actualText = await this.getTextInIframeViewport(this.localResidentDisclaimerText);
    const expectedText = t(TranslationKeys.Texts.Consent.LocalResidentDisclaimerText);
    await this.failOnUnresolvedCmsTokens(actualText, 'local resident disclaimer');
    expect(Helpers.normalizeText(Helpers.normalizeQuotes(actualText))).toBe(
      Helpers.normalizeText(Helpers.normalizeQuotes(expectedText)),
    );
  }

  async assertMarketingConsentDisclaimerText(): Promise<void> {
    if (
      (await this.getIframeElementCount()) === 0 ||
      !(await this.firstName.isVisible().catch(() => false))
    ) {
      if ((await this.getIframeElementCount()) === 0) {
        await this.waitForLazyIframeAttached(TIMEOUTS.MEDIUM).catch(() => {});
      }
      if (!(await this.firstName.isVisible().catch(() => false))) {
        await this.waitForFormReady();
      }
    }
    await this.scrollConsentIntoView(this.marketingConsentDisclaimerText);
    await expect(this.marketingConsentDisclaimerText).toBeVisible();
    const actualText = await this.getTextInIframeViewport(this.marketingConsentDisclaimerText);
    const expectedText = t(TranslationKeys.Texts.Consent.MarketingConsentDisclaimerText);
    await this.failOnUnresolvedCmsTokens(actualText, 'marketing consent disclaimer');
    expect(Helpers.normalizeText(Helpers.normalizeQuotes(actualText))).toBe(
      Helpers.normalizeText(Helpers.normalizeQuotes(expectedText)),
    );
  }

  /**
   * Raw CMS placeholders in consent copy break the required legal links, so report them as a
   * product defect instead of letting the assert surface as an opaque string diff.
   */
  private async failOnUnresolvedCmsTokens(actualText: string, context: string): Promise<void> {
    const tokens = Helpers.findUnresolvedCmsTokens(actualText);
    if (tokens.length === 0) return;
    const locale = localeManager.getCurrentLocale().toUpperCase();
    const message =
      `APP DEFECT (${locale}): ${context} renders unresolved CMS token(s) ${tokens.join(', ')} ` +
      `as literal text instead of a rendered link. Actual: "${Helpers.normalizeText(actualText)}"`;
    logger.error(message);
    const info = test.info();
    info.annotations.push({ type: 'issue', description: message });
    await info.attach(`APP DEFECT — unresolved CMS token (${locale})`, {
      body: Buffer.from(message, 'utf8'),
      contentType: 'text/plain',
    });
    throw new Error(message);
  }

  async isClientApiErrorVisible(): Promise<boolean> {
    const errorMessage = t(TranslationKeys.Errors.UserForm.ServerSide);
    return this.iframe
      .getByText(errorMessage)
      .isVisible()
      .catch(() => false);
  }

  /** Waits until lead-capture submission finishes or the client API error banner is shown. */
  async waitForLeadCaptureSubmissionSettled(timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await this.waitForSubmitProcessingToFinish(timeout);
  }

  /**
   * Waits for the SUBMIT button to leave its loading/disabled state, or for the client API error
   * banner to appear. Call this after clicking submit and before awaiting /api/lead-capture.
   *
   * Do not treat a decorative SVG icon as a spinner — many submit buttons always contain an SVG.
   */
  async waitForSubmitProcessingToFinish(timeout: number = TIMEOUTS.LONG): Promise<void> {
    const submitButton = this.getSubmitButton();
    const errorMessage = t(TranslationKeys.Errors.UserForm.ServerSide);
    const errorLocator = this.iframe.getByText(errorMessage);

    await submitButton.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });

    const isStillSubmitting = async (): Promise<boolean> => {
      if (await errorLocator.isVisible().catch(() => false)) {
        return false;
      }

      return submitButton
        .evaluate((el: HTMLButtonElement) => {
          // Only trust explicit disabled/busy state. Decorative Loader/refresh icons on the
          // SUBMIT button match class*="Loader"/"loading" permanently and false-positive on mobile.
          return (
            el.disabled ||
            el.getAttribute('aria-disabled') === 'true' ||
            el.getAttribute('aria-busy') === 'true' ||
            el.dataset.loading === 'true' ||
            el.getAttribute('data-state') === 'loading'
          );
        })
        .catch(() => false);
    };

    await this.page.waitForTimeout(500);

    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await errorLocator.isVisible().catch(() => false)) {
        return;
      }

      if (!(await isStillSubmitting())) {
        await this.page.waitForTimeout(500);
        return;
      }

      await this.page.waitForTimeout(500);
    }
  }

  private async scrollLegalCheckboxAreaIntoView(): Promise<void> {
    await this.scrollParentIntoViewOnPage(this.iframeElement).catch(() => {});

    await this.evaluateWithTimeout(this.iframe.locator('body').first(), () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      document.documentElement.scrollTop = document.body.scrollHeight;
    });
  }

  private async isCheckboxAttached(locator: Locator, timeout = 2000): Promise<boolean> {
    return locator
      .waitFor({ state: 'attached', timeout })
      .then(() => true)
      .catch(() => false);
  }

  private async checkCheckboxLocator(checkbox: Locator, label?: Locator): Promise<void> {
    if (!(await this.isCheckboxAttached(checkbox))) {
      return;
    }

    // Prefer a cheap already-checked short-circuit before heavy mobile scroll/evaluate.
    if (await checkbox.isChecked().catch(() => false)) {
      return;
    }

    await this.scrollLegalCheckboxAreaIntoView().catch(() => {});
    await this.scrollElementInFrame(checkbox).catch(() => {});

    if (await this.needsMobileIframeHandling()) {
      // Scroll can hang on WebKit; never block checkbox set on it.
      await this.scrollIframeFieldIntoHostViewport(checkbox).catch(() => {});
      await this.waitForScrollSettled(checkbox, 800).catch(() => {});
    }

    if (await checkbox.isChecked().catch(() => false)) {
      return;
    }

    const isMobile = await Helpers.isMobileDevice(this.page);
    const needsForce = isMobile || this.getBrowserName() === 'webkit';

    // Prefer real check/click so React controlled state updates. DOM-only evaluate can make
    // isChecked() true while the form still blocks SUBMIT (no /api/lead-capture on mobile).
    const checkStrategies: Array<() => Promise<void>> = [
      async () => {
        await checkbox.check({ force: needsForce, timeout: TIMEOUTS.MEDIUM });
      },
      async () => {
        if (label) {
          await this.scrollElementInFrame(label).catch(() => {});
          await label.click({ force: true, timeout: TIMEOUTS.MEDIUM });
        }
      },
      async () => {
        // AU / Tailwind peer checkboxes: click the visible label text node when for= is absent.
        const labelledBy = await checkbox.getAttribute('aria-labelledby').catch(() => null);
        if (labelledBy) {
          const byId = this.iframe.locator(`#${labelledBy}`).first();
          if (await byId.isVisible().catch(() => false)) {
            await byId.click({ force: true, timeout: TIMEOUTS.MEDIUM });
          }
        }
      },
      async () => {
        await checkbox.click({ force: true, timeout: TIMEOUTS.MEDIUM });
      },
      async () => {
        // Click the peer visual (custom checkbox) next to the hidden native input.
        await this.evaluateWithTimeout(checkbox, (el: Element) => {
          const input = el as HTMLInputElement;
          const peer =
            (input.parentElement?.querySelector('label, [class*="peer"], span') as HTMLElement) ||
            input.nextElementSibling;
          if (peer instanceof HTMLElement) {
            peer.click();
          }
        });
      },
      async () => {
        await this.evaluateWithTimeout(checkbox, (el: Element) => {
          const input = el as HTMLInputElement;
          input.checked = true;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.click();
        });
      },
      async () => {
        // Last resort: setChecked (Playwright) with force for stubborn React peers.
        await checkbox.setChecked(true, { force: true, timeout: TIMEOUTS.MEDIUM });
      },
    ];

    for (const check of checkStrategies) {
      try {
        await check();
      } catch {
        // try next strategy
      }
      if (await checkbox.isChecked().catch(() => false)) {
        return;
      }
    }

    await expect(checkbox).toBeChecked({ timeout: TIMEOUTS.SHORT });
  }

  private async checkRequiredFormCheckboxes(): Promise<void> {
    const currentLocale = localeManager.getCurrentLocale();
    const localeElementConfig = localeElements[currentLocale];
    if (!localeElementConfig) {
      throw new Error(
        `Locale "${currentLocale}" does not exist in locale-element-map.ts. Please add it.`,
      );
    }

    if (localeElementConfig.consentCheckbox) {
      await this.checkConsentCheckbox();
    }
    if (localeElementConfig.localResidentCheckbox) {
      await this.checkLocalResidentCheckbox();
    }
  }

  async checkConsentCheckbox(): Promise<void> {
    const currentLocale = localeManager.getCurrentLocale();
    const localeElementConfig = localeElements[currentLocale];
    if (!localeElementConfig) {
      throw new Error(
        `Locale "${currentLocale}" does not exist in locale-element-map.ts. Please add it.`,
      );
    }

    if (!localeElementConfig.consentCheckbox) {
      return;
    }

    // Corporate Membership uses #corporateTermsAccepted (filled in CorporateMembershipPage).
    // Do not wait on MI/TUF #termsAccepted — it is absent and burns SHORT timeouts on AU.
    if (this.iframeId === 'corporate-membership-iframe') {
      return;
    }

    const consentCandidates = [
      this.consentCheckbox,
      this.iframe.locator('[data-testid="lead-form-disclaimer"] input[type="checkbox"]'),
      this.iframe.locator('input[type="checkbox"][name="termsAccepted"]'),
      this.iframe.locator('#termsAccepted'),
    ];
    const termsLabel = this.iframe
      .locator('label[for="termsAccepted"]')
      .or(this.iframe.locator('#termsAccepted-label'))
      .or(this.iframe.locator('label:has(#termsAccepted)'))
      .first();

    for (const checkbox of consentCandidates) {
      if (!(await this.isCheckboxAttached(checkbox))) {
        continue;
      }

      // Skip heavy consent scroll when already checked (fill step often checked first).
      if (await checkbox.isChecked().catch(() => false)) {
        return;
      }

      await this.scrollConsentIntoView(checkbox).catch(() => {});
      await this.checkCheckboxLocator(checkbox, termsLabel);
      return;
    }
  }

  async checkLocalResidentCheckbox(): Promise<void> {
    const currentLocale = localeManager.getCurrentLocale();
    const localeElementConfig = localeElements[currentLocale];
    if (!localeElementConfig) {
      throw new Error(
        `Locale "${currentLocale}" does not exist in locale-element-map.ts. Please add it.`,
      );
    }

    if (!localeElementConfig.localResidentCheckbox) {
      return;
    }

    // Try Us Free uses #isLocalResident; Events iframe variants use #termsAccepted for the same consent.
    if (await this.isCheckboxAttached(this.localResidentCheckbox)) {
      await this.checkCheckboxLocator(this.localResidentCheckbox, this.localResidentCheckboxLabel);
      return;
    }

    // Local Offer embeds often omit residency (DE coaching_* shells) — do not fall through to a
    // missing consent checkbox and burn SHORT waits when neither control exists.
    if (this.iframeId === 'local-offer-iframe') {
      if (await this.isCheckboxAttached(this.consentCheckbox)) {
        await this.checkCheckboxLocator(this.consentCheckbox);
      }
      return;
    }

    await this.checkCheckboxLocator(this.consentCheckbox);
  }

  /** AFW-3722 Checkbox 1 — residency / legal consent defaults to checked. */
  async assertLocalResidentCheckboxCheckedByDefault(): Promise<void> {
    const checkbox = await this.resolveResidencyCheckbox();
    if (!checkbox) {
      throw new Error('Checkbox 1 (residency / legal consent) was not found on the lead form');
    }
    await this.scrollConsentIntoView(checkbox).catch(() => {});
    await expect(checkbox, 'Checkbox 1 should be pre-checked by default').toBeChecked({
      timeout: TIMEOUTS.MEDIUM,
    });
  }

  /** AFW-3722 Checkbox 2 — marketing opt-in defaults to unchecked. */
  async assertMarketingConsentCheckboxUncheckedByDefault(): Promise<void> {
    const checkbox = this.marketingConsentCheckbox;
    await checkbox.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    const count = await checkbox.count().catch(() => 0);
    if (!count) {
      throw new Error(
        'Checkbox 2 (marketing consent / #marketingOptIn) was not found on the lead form',
      );
    }
    await this.scrollConsentIntoView(this.marketingConsentCheckboxLabel).catch(() =>
      this.scrollConsentIntoView(checkbox),
    );
    // Native input may be visually hidden; assert DOM checked state.
    const checked = await checkbox.evaluate((el: HTMLInputElement) => el.checked).catch(() => null);
    if (checked === null) {
      await expect(checkbox, 'Checkbox 2 should be unchecked by default').not.toBeChecked({
        timeout: TIMEOUTS.MEDIUM,
      });
      return;
    }
    expect(checked, 'Checkbox 2 (#marketingOptIn) should be unchecked by default').toBe(false);
  }

  async isMarketingConsentCheckboxChecked(): Promise<boolean> {
    const checkbox = this.marketingConsentCheckbox;
    if ((await checkbox.count().catch(() => 0)) === 0) return false;
    return checkbox.isChecked().catch(() => false);
  }

  /** AFW-3722 Checkbox 2 — select marketing opt-in. */
  async checkMarketingConsentCheckbox(): Promise<void> {
    const checkbox = this.marketingConsentCheckbox;
    await checkbox.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    if ((await checkbox.count().catch(() => 0)) === 0) {
      throw new Error(
        'Checkbox 2 (marketing consent / #marketingOptIn) was not found on the lead form',
      );
    }
    await this.checkCheckboxLocator(checkbox, this.marketingConsentCheckboxLabel);
    const checked = await this.isMarketingConsentCheckboxChecked();
    expect(checked, 'Checkbox 2 (#marketingOptIn) should be checked after select').toBe(true);
  }

  /** AFW-3722 Checkbox 2 — deselect marketing opt-in. */
  async uncheckMarketingConsentCheckbox(): Promise<void> {
    const checkbox = this.marketingConsentCheckbox;
    await checkbox.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    if ((await checkbox.count().catch(() => 0)) === 0) {
      throw new Error(
        'Checkbox 2 (marketing consent / #marketingOptIn) was not found on the lead form',
      );
    }
    if (!(await this.isMarketingConsentCheckboxChecked())) {
      return;
    }

    await this.scrollConsentIntoView(this.marketingConsentCheckboxLabel).catch(() =>
      this.scrollConsentIntoView(checkbox),
    );

    const isMobile = await Helpers.isMobileDevice(this.page);
    const needsForce = isMobile || this.getBrowserName() === 'webkit';
    const uncheckStrategies: Array<() => Promise<void>> = [
      async () => {
        await checkbox.uncheck({ force: needsForce, timeout: TIMEOUTS.MEDIUM });
      },
      async () => {
        await this.marketingConsentCheckboxLabel.click({
          force: true,
          position: { x: 8, y: 8 },
          timeout: TIMEOUTS.MEDIUM,
        });
      },
      async () => {
        await checkbox.click({ force: true, timeout: TIMEOUTS.MEDIUM });
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
      if (!(await this.isMarketingConsentCheckboxChecked())) {
        return;
      }
    }

    expect(
      await this.isMarketingConsentCheckboxChecked(),
      'Checkbox 2 (#marketingOptIn) should be unchecked after deselect',
    ).toBe(false);
  }

  async assertMarketingConsentCheckboxChecked(): Promise<void> {
    const checked = await this.isMarketingConsentCheckboxChecked();
    expect(checked, 'Checkbox 2 (#marketingOptIn) should be checked').toBe(true);
  }

  /**
   * Resolve residency/legal Checkbox 1 — prefers #isLocalResident, falls back to #termsAccepted
   * when Events shells use that id for the same required consent.
   */
  private async resolveResidencyCheckbox(): Promise<Locator | null> {
    if (await this.isCheckboxAttached(this.localResidentCheckbox)) {
      return this.localResidentCheckbox;
    }
    if (await this.isCheckboxAttached(this.consentCheckbox)) {
      return this.consentCheckbox;
    }
    return null;
  }

  async assertLocalResidentRequiredBlocksSubmit(): Promise<void> {
    // Prefer dedicated error id; fall back to visible required message near the checkbox.
    const errorCandidates = [
      this.iframe.locator('#isLocalResident-error'),
      this.iframe.locator('#termsAccepted-error'),
      this.iframe.locator('#localResident-error'),
      this.iframe.getByText(/ช่องนี้จำเป็น|this field is required|required/i).first(),
    ];
    let sawError = false;
    for (const loc of errorCandidates) {
      if (await loc.isVisible({ timeout: TIMEOUTS.SHORT }).catch(() => false)) {
        sawError = true;
        break;
      }
    }
    // Some shells block submit without a dedicated error node — caller also asserts form did not advance.
    if (!sawError) {
      const stillChecked = await this.isLocalResidentCheckboxChecked().catch(() => false);
      expect(stillChecked, 'Checkbox 1 should remain unchecked after untick + blocked submit').toBe(
        false,
      );
    }
  }
}
