import { expect, FrameLocator, Locator, Page } from '@playwright/test';
import { ConfirmationScreenPage } from '@pages/common/ConfirmationScreenPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { TIMEOUTS } from '@utils/constants';

const FRANCONNECT_IFRAME =
  '#own-gym-iframe, iframe[title*="Own a Gym Lead Form"], iframe[title*="Request franchise information"], iframe.own-a-gym-iframe, iframe[src*="franconnect"]';

/** React franchise form — AE/IN/ZA/… use #franchise-leads-iframe; SA reuses #own-gym-iframe. */
const REACT_OWN_A_GYM_IFRAME = '#franchise-leads-iframe, #own-gym-iframe';

/**
 * Franconnect markers (AU/IE). React form also mounts #own-gym-iframe on SA with div#firstName
 * wrappers — do not treat iframe presence alone as Franconnect.
 */
const FRANCONNECT_FIELD_MARKERS =
  'input#emailID, input#mobile, input#submitButton, #submitButton[type="submit"], input#firstName';

export class OwnAGymPage {
  readonly page: Page;
  readonly userForm: UserFormPage;
  readonly confirmationScreen: ConfirmationScreenPage;
  readonly iframe: FrameLocator;
  readonly iframeElement: Locator;
  readonly investmentRange: Locator;
  readonly heardAboutUs: Locator;
  readonly desiredMarket: Locator;
  readonly messageTextArea: Locator;

  private readonly franconnectIframe: FrameLocator;
  private readonly franconnectIframeElement: Locator;
  private readonly franconnectFirstName: Locator;
  private readonly franconnectLastName: Locator;
  private readonly franconnectEmail: Locator;
  private readonly franconnectPhone: Locator;
  private readonly franconnectAddress: Locator;
  private readonly franconnectCity: Locator;
  private readonly franconnectState: Locator;
  private readonly franconnectCountry: Locator;
  private readonly franconnectZip: Locator;
  private readonly franconnectInvestment: Locator;
  private readonly franconnectHeardAboutUs: Locator;
  private readonly franconnectDesiredMarket: Locator;
  private readonly franconnectPreferredLocation: Locator;
  private readonly franconnectClubFormat: Locator;
  private readonly franconnectBeenInGym: Locator;
  private readonly franconnectKnowOwner: Locator;
  private readonly franconnectMessage: Locator;
  private readonly franconnectDisclaimer: Locator;
  private readonly franconnectSubmit: Locator;

  private lastFranconnectDialog: string | null = null;

  constructor(page: Page) {
    this.page = page;
    this.userForm = new UserFormPage(page, REACT_OWN_A_GYM_IFRAME);
    this.confirmationScreen = new ConfirmationScreenPage(page);
    this.iframe = page.frameLocator(REACT_OWN_A_GYM_IFRAME);
    this.iframeElement = page.locator(REACT_OWN_A_GYM_IFRAME).first();
    this.investmentRange = this.iframe.locator('#investmentRange');
    this.heardAboutUs = this.iframe.locator('#heardAboutUs');
    this.desiredMarket = this.iframe.locator('#desiredMarket');
    this.messageTextArea = this.iframe.locator('textarea[name="message"]');

    this.franconnectIframe = page.frameLocator(FRANCONNECT_IFRAME);
    this.franconnectIframeElement = page.locator(FRANCONNECT_IFRAME).first();
    // EN-IE: Own a Gym Lead Form IRELAND. EN-AU: Request franchise information (#own-gym-iframe).
    // Prefer input#… — SA React form also exposes div#firstName wrappers inside #own-gym-iframe.
    this.franconnectFirstName = this.franconnectIframe.locator('input#firstName');
    this.franconnectLastName = this.franconnectIframe.locator('input#lastName');
    this.franconnectEmail = this.franconnectIframe.locator('input#emailID');
    this.franconnectPhone = this.franconnectIframe.locator('input#mobile');
    this.franconnectAddress = this.franconnectIframe.locator('#address');
    this.franconnectCity = this.franconnectIframe.locator('#city');
    this.franconnectState = this.franconnectIframe.locator('#stateID');
    this.franconnectCountry = this.franconnectIframe.locator('#country');
    this.franconnectZip = this.franconnectIframe.locator('#zip');
    this.franconnectInvestment = this.franconnectIframe.locator(
      '#fsLeadPersonalProfile_0_howMuchAreYouLookingToInvest940660525, #_investmentAmount709438663, select[id*="howMuchAreYouLookingToInvest" i], select[id*="investment" i], select[id*="Invest" i]',
    );
    this.franconnectHeardAboutUs = this.franconnectIframe.locator(
      '#_howDidYouHearAboutUs257917130, select[id*="howDidYouHear" i], select[id*="HearAbout" i]',
    );
    this.franconnectDesiredMarket = this.franconnectIframe.locator(
      'select[id*="desiredMarket" i], #_desiredMarket869507120',
    );
    this.franconnectPreferredLocation = this.franconnectIframe.locator(
      'input[id*="preferredLocation" i], input[id*="PreferredLocation" i], input[id*="desiredLocation" i], input[id*="DesiredLocation" i], textarea[id*="desiredLocation" i]',
    );
    this.franconnectClubFormat = this.franconnectIframe.locator(
      'select[id*="RegularOrSmall" i], select[id*="regularOrSmall" i]',
    );
    this.franconnectBeenInGym = this.franconnectIframe.locator(
      'select[id*="BeenInAnAnytime" i], select[id*="beenInAnAnytime" i]',
    );
    this.franconnectKnowOwner = this.franconnectIframe.locator(
      'select[id*="OwnsOrHasOwned" i], select[id*="ownsOrHasOwned" i]',
    );
    this.franconnectMessage = this.franconnectIframe.locator('#_questionsComments327434806');
    this.franconnectDisclaimer = this.franconnectIframe.locator('#disclaimerField_1750136663');
    this.franconnectSubmit = this.franconnectIframe.locator('#submitButton');
  }

  /** True when a Franconnect text input is missing / blank (used to avoid overwriting scenario data). */
  async isFranconnectInputEmpty(locator: Locator): Promise<boolean> {
    if ((await locator.count()) === 0) {
      return true;
    }
    const value = ((await locator.inputValue().catch(() => '')) ?? '').trim();
    return value.length === 0;
  }

  async usesFranconnectForm(): Promise<boolean> {
    try {
      if ((await this.franconnectIframeElement.count()) === 0) {
        return false;
      }
      // #own-gym-iframe is shared: AU Franconnect vs SA React franchise form.
      return (await this.franconnectIframe.locator(FRANCONNECT_FIELD_MARKERS).count()) > 0;
    } catch {
      // Page may navigate away after successful submit (React thank-you flow).
      return false;
    }
  }

  getLastFranconnectDialog(): string | null {
    return this.lastFranconnectDialog;
  }

  async waitForOwnAGymFormReady(): Promise<void> {
    if (await this.usesFranconnectForm()) {
      await this.waitForFranconnectFormReady();
      return;
    }

    await this.userForm.waitForFormReady();
  }

  private async waitForFranconnectFormReady(): Promise<void> {
    await this.franconnectIframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await this.franconnectIframeElement.scrollIntoViewIfNeeded().catch(() => {});
    await this.franconnectFirstName.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
  }

  async typeFirstName(value: string): Promise<void> {
    await this.waitForOwnAGymFormReady();
    if (await this.usesFranconnectForm()) {
      await this.franconnectFirstName.fill(value);
      return;
    }
    await this.userForm.type(this.userForm.firstName, value);
  }

  async typeLastName(value: string): Promise<void> {
    await this.waitForOwnAGymFormReady();
    if (await this.usesFranconnectForm()) {
      await this.franconnectLastName.fill(value);
      return;
    }
    await this.userForm.type(this.userForm.lastName, value);
  }

  async typeEmail(value: string): Promise<void> {
    await this.waitForOwnAGymFormReady();
    if (await this.usesFranconnectForm()) {
      await this.franconnectEmail.fill(value);
      return;
    }
    await this.userForm.type(this.userForm.email, value);
  }

  async typePhone(value: string): Promise<void> {
    await this.waitForOwnAGymFormReady();
    if (await this.usesFranconnectForm()) {
      await this.franconnectPhone.fill(value);
      return;
    }
    await this.userForm.type(this.userForm.phone, value);
  }

  async autofillPhone(value: string): Promise<void> {
    await this.waitForOwnAGymFormReady();
    if (await this.usesFranconnectForm()) {
      await this.franconnectPhone.fill(value);
      return;
    }
    await this.userForm.autofillPhoneNumber(this.userForm.phone, value);
  }

  async copyPastePhone(value: string): Promise<void> {
    await this.waitForOwnAGymFormReady();
    if (await this.usesFranconnectForm()) {
      await this.franconnectPhone.fill(value);
      return;
    }
    await this.userForm.copyPastePhoneNumber(this.userForm.phone, value);
  }

  async clickSubmit(): Promise<void> {
    await this.waitForOwnAGymFormReady();
    if (await this.usesFranconnectForm()) {
      await this.clickFranconnectSubmitAndCaptureDialog();
      return;
    }
    await this.userForm.clickSubmitButton();
  }

  /**
   * Franconnect validates via window.alert — capture the message for assertions.
   */
  async clickFranconnectSubmitAndCaptureDialog(): Promise<string | null> {
    this.lastFranconnectDialog = null;
    const dialogPromise = new Promise<string | null>(resolve => {
      const timeout = setTimeout(() => {
        this.page.off('dialog', handler);
        resolve(null);
      }, TIMEOUTS.MEDIUM);

      const handler = async (dialog: { message: () => string; accept: () => Promise<void> }) => {
        clearTimeout(timeout);
        const message = dialog.message();
        this.lastFranconnectDialog = message;
        this.page.off('dialog', handler);
        await dialog.accept().catch(() => {});
        resolve(message);
      };

      this.page.on('dialog', handler);
    });

    await this.franconnectSubmit.scrollIntoViewIfNeeded().catch(() => {});
    await this.franconnectIframe
      .locator('#submitButton')
      .evaluate((el: HTMLInputElement) => {
        el.disabled = false;
        el.click();
      })
      .catch(async () => {
        await this.franconnectSubmit.click({ force: true });
      });

    return dialogPromise;
  }

  async expectFranconnectDialogMatching(pattern: RegExp): Promise<void> {
    const message =
      this.lastFranconnectDialog ?? (await this.clickFranconnectSubmitAndCaptureDialog());
    expect(message, 'Expected a Franconnect validation alert').toBeTruthy();
    expect(message!).toMatch(pattern);
  }

  async isThankYouVisible(): Promise<void> {
    // Prefer host confirmation screen first — successful React submit navigates away
    // and can destroy the iframe context mid-detection.
    try {
      await this.confirmationScreen.isThankYouTextVisible();
      return;
    } catch {
      /* fall through to Franconnect thank-you */
    }

    if (await this.usesFranconnectForm()) {
      const dialog = this.getLastFranconnectDialog();
      if (dialog) {
        throw new Error(
          `Franconnect Own A Gym submit showed a validation alert instead of thank you: "${dialog}"`,
        );
      }
      await expect(this.franconnectIframe.getByText(/thank you|confirmation/i).first()).toBeVisible(
        {
          timeout: TIMEOUTS.LONG,
        },
      );
    }
  }

  async selectInvestmentRange(value: string): Promise<string> {
    return this.selectDropdownOption(this.investmentRange, value);
  }

  async selectHeardAboutUs(value: string): Promise<string> {
    return this.selectDropdownOption(this.heardAboutUs, value);
  }

  async selectDesiredMarket(value: string): Promise<string> {
    return this.selectDropdownOption(this.desiredMarket, value);
  }

  private normalizeDropdownLabel(value: string): string {
    return value.replace(/[–—−]/g, '-').replace(/\s+/g, ' ').trim();
  }

  private async selectDropdownOption(locator: Locator, value: string): Promise<string> {
    await this.userForm.ensureLocatorInIframeViewport(locator);
    await locator.locator('option').nth(1).waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });

    const options = await locator.locator('option').all();
    const availableLabels = (
      await Promise.all(options.map(async option => ((await option.textContent()) ?? '').trim()))
    ).filter(label => label && !this.isDropdownPlaceholder(label));

    const normalizedValue = this.normalizeDropdownLabel(value);
    const matchedLabel = availableLabels.find(
      label => this.normalizeDropdownLabel(label).toLowerCase() === normalizedValue.toLowerCase(),
    );

    if (matchedLabel) {
      await locator.selectOption({ label: matchedLabel });
      return matchedLabel;
    }

    const partialMatch = availableLabels.find(label => {
      const normalizedLabel = this.normalizeDropdownLabel(label).toLowerCase();
      const preferred = normalizedValue.toLowerCase();
      return normalizedLabel.includes(preferred) || preferred.includes(normalizedLabel);
    });

    if (partialMatch) {
      await locator.selectOption({ label: partialMatch });
      return partialMatch;
    }

    try {
      await locator.selectOption({ label: value });
      return value;
    } catch {
      if (availableLabels.length > 0) {
        const fallback = availableLabels[0];
        await locator.selectOption({ label: fallback });
        return fallback;
      }

      throw new Error(
        `Dropdown option "${value}" not found. Available options: ${availableLabels.join(', ')}`,
      );
    }
  }

  private isDropdownPlaceholder(label: string): boolean {
    return /^(select(\s+one)?|wählen\s+sie\s+(eines|eine)\s+aus|seleziona|choisissez|اختر)\b/i.test(
      label.trim(),
    );
  }

  private async selectFranconnectInvestment(value: string): Promise<void> {
    if ((await this.franconnectInvestment.count()) === 0) {
      return;
    }

    const locator = this.franconnectInvestment.first();
    await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM }).catch(() => {});

    // EN-GB / IE Franconnect use #fsLeadPersonalProfile_0_howMuchAreYouLookingToInvest…
    // Prefer DOM select helper — Playwright selectOption can leave Franconnect on "-1",
    // and naive label matching must not treat the "Select" placeholder as a hit
    // (`"£170k".includes("")` is true after stripping "Select").
    await this.selectFranconnectSelectOption(locator, value);

    let selected = await locator.inputValue().catch(() => '-1');
    if (!selected || selected === '-1') {
      await this.selectFranconnectFirstRealOption(this.franconnectInvestment);
      selected = await locator.inputValue().catch(() => '-1');
    }

    // Franconnect custom validation sometimes ignores value-only assignment — also set selectedIndex.
    if (selected && selected !== '-1') {
      await locator.evaluate((el, val) => {
        const select = el as HTMLSelectElement;
        select.value = val;
        const idx = [...select.options].findIndex(o => o.value === val);
        if (idx >= 0) {
          select.selectedIndex = idx;
        }
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('blur', { bubbles: true }));
      }, selected);
    }

    selected = await locator.inputValue().catch(() => '-1');
    if (!selected || selected === '-1') {
      throw new Error(
        `Franconnect Own A Gym could not select investment range "${value}". Remaining value: "${selected}"`,
      );
    }
  }

  async fillCommentTextArea(value: string): Promise<void> {
    await this.userForm.ensureLocatorInIframeViewport(this.messageTextArea);
    await this.messageTextArea.fill(value);
  }

  async fillOwnAGymForm(data: OwnAGymFormData) {
    await this.waitForOwnAGymFormReady();

    if (await this.usesFranconnectForm()) {
      // Franconnect rejects `+` aliases in email addresses.
      const email = data.email?.includes('+') ? data.email.replace(/\+[^@]*/, '') : data.email;

      if (data.firstName) {
        await this.franconnectFirstName.fill(data.firstName);
      }
      if (data.lastName) {
        await this.franconnectLastName.fill(data.lastName);
      }
      if (email) {
        await this.franconnectEmail.fill(email);
      }
      if (data.phone) {
        await this.franconnectPhone.fill(data.phone);
      }
      // EN-AU Franconnect: address / suburb / country / postcode.
      // State is selected last — country change rebuilds #stateID options asynchronously.
      if (data.address && (await this.franconnectAddress.count()) > 0) {
        await this.franconnectAddress.fill(data.address);
      }
      if (data.city && (await this.franconnectCity.count()) > 0) {
        await this.franconnectCity.fill(data.city);
      }
      if (data.country && (await this.franconnectCountry.count()) > 0) {
        const currentCountry = await this.franconnectCountry
          .evaluate(el => {
            const select = el as HTMLSelectElement;
            return select.options[select.selectedIndex]?.textContent?.trim() ?? '';
          })
          .catch(() => '');
        const alreadySet =
          this.normalizeDropdownLabel(currentCountry).toLowerCase() ===
          this.normalizeDropdownLabel(data.country).toLowerCase();
        if (!alreadySet) {
          await this.selectFranconnectSelectOption(this.franconnectCountry, data.country);
          await this.franconnectState
            .locator('option')
            .nth(1)
            .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
            .catch(() => {});
          await this.page.waitForTimeout(500);
        }
      }
      if (data.zip && (await this.franconnectZip.count()) > 0) {
        await this.franconnectZip.fill(data.zip);
      }
      if (data.heardAboutUs && (await this.franconnectHeardAboutUs.count()) > 0) {
        await this.selectFranconnectSelectOption(
          this.franconnectHeardAboutUs.first(),
          data.heardAboutUs,
        );
      }
      // IE/GB Opportunity checkboxes (optional): New Build / Rebrand / Resale
      const opportunity = this.franconnectIframe.locator('#_opportunity139744156_0');
      if ((await opportunity.count()) > 0) {
        await opportunity.evaluate(el => (el as HTMLInputElement).click());
      }
      if (data.desiredMarket && (await this.franconnectDesiredMarket.count()) > 0) {
        await this.selectFranconnectSelectOption(
          this.franconnectDesiredMarket.first(),
          data.desiredMarket,
        );
      }
      // NZ Franconnect: Desired Location is a <select> (e.g. Auckland); Flexible Location is required radios.
      if (data.desiredMarket) {
        const desiredLocationField = this.franconnectIframe.locator(
          'select[id*="desiredLocation" i], input[id*="desiredLocation" i], textarea[id*="desiredLocation" i], #_desiredLocation1318679170',
        );
        if ((await desiredLocationField.count()) > 0) {
          const el = desiredLocationField.first();
          const tag = await el.evaluate(node => node.tagName.toLowerCase()).catch(() => 'input');
          if (tag === 'select') {
            await this.selectFranconnectSelectOption(el, data.desiredMarket);
            if (await this.isFranconnectInputEmpty(el).catch(() => true)) {
              await this.selectFranconnectFirstRealOption(el);
            }
          } else {
            await el.fill(data.desiredMarket);
          }
        } else if ((await this.franconnectPreferredLocation.count()) > 0) {
          await this.franconnectPreferredLocation.first().fill(data.desiredMarket);
        }
      }
      const flexibleLocationRadio = this.franconnectIframe.locator(
        'input[type="radio"][id*="areYouFlexibleWithLocation" i], input[type="radio"][name*="areYouFlexibleWithLocation" i]',
      );
      if ((await flexibleLocationRadio.count()) > 0) {
        // Prefer "Yes" (value=1 on NZ Franconnect); fall back to first radio.
        const yesByValue = this.franconnectIframe.locator(
          'input[type="radio"][id*="areYouFlexibleWithLocation" i][value="1"], input[type="radio"][name*="areYouFlexibleWithLocation" i][value="1"]',
        );
        if ((await yesByValue.count()) > 0) {
          await yesByValue
            .first()
            .check({ force: true })
            .catch(async () => {
              await yesByValue.first().evaluate(el => (el as HTMLInputElement).click());
            });
        } else {
          await flexibleLocationRadio
            .first()
            .check({ force: true })
            .catch(async () => {
              await flexibleLocationRadio.first().evaluate(el => (el as HTMLInputElement).click());
            });
        }
      }
      // EN-AU optional preference dropdowns — pick first real option when present
      await this.selectFranconnectFirstRealOption(this.franconnectClubFormat);
      await this.selectFranconnectFirstRealOption(this.franconnectBeenInGym);
      await this.selectFranconnectFirstRealOption(this.franconnectKnowOwner);
      if (data.message && (await this.franconnectMessage.count()) > 0) {
        await this.franconnectMessage.fill(data.message);
      }
      // Disclaimer checkbox is often visually hidden — click via label or JS.
      if ((await this.franconnectDisclaimer.count()) > 0) {
        await this.franconnectIframe
          .locator('label[for="disclaimerField_1750136663"]')
          .click({ force: true })
          .catch(async () => {
            await this.franconnectDisclaimer.evaluate(el => {
              (el as HTMLInputElement).checked = true;
              el.dispatchEvent(new Event('change', { bubbles: true }));
            });
          });
      }
      // Select state last so later field interactions cannot clear it.
      if (data.state && (await this.franconnectState.count()) > 0) {
        await this.selectFranconnectState(data.state);
      }
      // Investment last — opportunity / other Franconnect widgets can rebuild profile selects
      // and wipe an earlier choice (EN-GB: "How much are you looking to invest? is mandatory!").
      if (data.investmentRange && !/^n\/?a$/i.test(data.investmentRange)) {
        await this.selectFranconnectInvestment(data.investmentRange);
      }
      return;
    }

    if (data.firstName) {
      await this.userForm.ensureLocatorInIframeViewport(this.userForm.firstName);
      await this.userForm.type(this.userForm.firstName, data.firstName);
    }
    if (data.lastName) {
      await this.userForm.ensureLocatorInIframeViewport(this.userForm.lastName);
      await this.userForm.type(this.userForm.lastName, data.lastName);
    }
    if (data.email) {
      await this.userForm.ensureLocatorInIframeViewport(this.userForm.email);
      await this.userForm.type(this.userForm.email, data.email);
    }
    if (data.phone) {
      await this.userForm.ensureLocatorInIframeViewport(this.userForm.phone);
      await this.userForm.clearAndType(this.userForm.phone, data.phone);
    }
    if (data.investmentRange) {
      data.investmentRange = await this.selectInvestmentRange(data.investmentRange);
    }
    if (data.heardAboutUs) {
      data.heardAboutUs = await this.selectHeardAboutUs(data.heardAboutUs);
    }
    if (data.desiredMarket) {
      data.desiredMarket = await this.selectDesiredMarket(data.desiredMarket);
    }
    if (data.message) {
      await this.fillCommentTextArea(data.message);
    }
  }

  private async selectFranconnectState(state: string): Promise<void> {
    await this.selectFranconnectSelectOption(this.franconnectState, state);
    let stateValue = await this.franconnectState.inputValue().catch(() => '-1');
    if (!stateValue || stateValue === '-1') {
      // Prefer matching label via Playwright, then fall back to first real option.
      await this.franconnectState.selectOption({ label: state }).catch(() => {});
      stateValue = await this.franconnectState.inputValue().catch(() => '-1');
    }
    if (!stateValue || stateValue === '-1') {
      await this.franconnectState.evaluate(el => {
        const select = el as HTMLSelectElement;
        const real = [...select.options].find(o => o.value && o.value !== '-1');
        if (real) {
          select.value = real.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
    stateValue = await this.franconnectState.inputValue().catch(() => '-1');
    if (!stateValue || stateValue === '-1') {
      throw new Error(
        `Franconnect Own A Gym could not select state "${state}". Remaining value: "${stateValue}"`,
      );
    }
  }

  private isFranconnectOptionMatch(optionText: string, value: string): boolean {
    if (this.isDropdownPlaceholder(optionText)) {
      return false;
    }
    const normalizedValue = this.normalizeDropdownLabel(value).toLowerCase();
    const normalizedLabel = this.normalizeDropdownLabel(optionText).toLowerCase();
    if (!normalizedLabel || normalizedLabel === '-1') {
      return false;
    }
    const stripped = normalizedLabel.replace(/^select(\s+(state|country|one))?/i, '').trim();
    // Never match on empty string — `"any".includes("")` is always true.
    if (!stripped) {
      return false;
    }
    return (
      normalizedLabel === normalizedValue ||
      normalizedLabel.includes(normalizedValue) ||
      normalizedValue.includes(stripped)
    );
  }

  private async selectFranconnectSelectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
    const optionEls = locator.locator('option');
    await optionEls
      .nth(1)
      .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
      .catch(() => {});

    const options = await optionEls.evaluateAll(els =>
      els.map(el => ({
        text: (el.textContent ?? '').trim(),
        value: (el as HTMLOptionElement).value,
      })),
    );
    const match = options.find(
      option =>
        option.value && option.value !== '-1' && this.isFranconnectOptionMatch(option.text, value),
    );

    const applyValue = async (optionValue: string) => {
      // Prefer DOM assignment — Franconnect selects can ignore Playwright selectOption.
      await locator.evaluate((el, val) => {
        const select = el as HTMLSelectElement;
        select.value = val;
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }, optionValue);
    };

    if (match && match.value && match.value !== '-1') {
      await applyValue(match.value);
      const selected = await locator.inputValue().catch(() => '');
      if (selected !== match.value) {
        await locator.selectOption(match.value).catch(() => {});
        await applyValue(match.value);
      }
      return;
    }

    // Fallback: first real option when locale test-data label/currency differs.
    const fallback = options.find(
      o => o.value && o.value !== '-1' && !this.isDropdownPlaceholder(o.text),
    );
    if (fallback?.value) {
      await applyValue(fallback.value);
    }
  }

  private async selectFranconnectFirstRealOption(locator: Locator): Promise<void> {
    if ((await locator.count()) === 0) {
      return;
    }
    const select = locator.first();
    const options = await select.locator('option').evaluateAll(els =>
      els.map(el => ({
        text: (el.textContent ?? '').trim(),
        value: (el as HTMLOptionElement).value,
      })),
    );
    const real = options.find(
      o => o.value && o.value !== '-1' && !this.isDropdownPlaceholder(o.text),
    );
    if (!real?.value) {
      return;
    }
    await select.evaluate((el, val) => {
      const selectEl = el as HTMLSelectElement;
      selectEl.value = val;
      selectEl.dispatchEvent(new Event('input', { bubbles: true }));
      selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    }, real.value);
  }

  /** Fill Franconnect first/last name only when empty — preserves scenario-entered invalid values. */
  async fillFranconnectNamesIfEmpty(firstName: string, lastName: string): Promise<void> {
    if (await this.isFranconnectInputEmpty(this.franconnectFirstName)) {
      await this.franconnectFirstName.fill(firstName);
    }
    if (await this.isFranconnectInputEmpty(this.franconnectLastName)) {
      await this.franconnectLastName.fill(lastName);
    }
  }

  /** Fill Franconnect email only when empty — preserves scenario-entered invalid email. */
  async fillFranconnectEmailIfEmpty(email: string): Promise<void> {
    if (await this.isFranconnectInputEmpty(this.franconnectEmail)) {
      await this.franconnectEmail.fill(email);
    }
  }
}
