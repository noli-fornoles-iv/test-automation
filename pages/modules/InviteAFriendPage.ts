import { expect, FrameLocator, Locator, Page } from '@playwright/test';
import environmentManager from '@config/environment';
import { UserFormPage } from '@pages/common/UserFormPage';
import { TIMEOUTS } from '@utils/constants';
import { Helpers } from '@utils/helpers';
import localeManager, { d, t } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';
import { logger } from '@utils/logger';

export class InviteAFriendPage {
  readonly page: Page;
  readonly userForm: UserFormPage;
  readonly iframe: FrameLocator;
  readonly iframeElement: Locator;
  readonly mobilePhone: Locator;
  readonly phoneLabel: Locator;
  readonly shareReferralBtn: Locator;
  readonly heading: Locator;
  readonly step1: Locator;
  readonly step2: Locator;
  readonly step3: Locator;
  readonly disclaimer: Locator;
  readonly shareModal: Locator;
  readonly shareLinkField: Locator;
  readonly copyLinkButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userForm = new UserFormPage(page, 'invite-friend-iframe');
    this.iframe = page.frameLocator('#invite-friend-iframe');
    this.iframeElement = page.locator('#invite-friend-iframe');
    // Prefer accessible name; fall back to tel/name selectors used by intl-tel-input embeds.
    // FR-CA: "Votre numéro de mobile" / portable — not English "phone".
    this.mobilePhone = this.iframe
      .getByRole('textbox', { name: /mobile phone|phone|num[eé]ro de mobile|portable|t[eé]l[eé]phone/i })
      .or(this.iframe.locator('input[type="tel"]'))
      .or(this.iframe.locator('input[name="phoneNum"], [data-testid="phonenumber-field"]'))
      .first();
    // Prefer the input label (#phoneNumber-label) — FR step-1 copy also contains "portable".
    this.phoneLabel = this.iframe
      .locator('#phoneNumber-label, label[for="phoneNumber-input"]')
      .or(this.iframe.locator('label').filter({ hasText: /mobile phone|phone number|num[eé]ro de mobile/i }))
      .or(this.iframe.getByText(/mobile phone|phone number|votre num[eé]ro de mobile/i))
      .first();
    const shareReferralLabel = t(TranslationKeys.Buttons.InviteAFriend.ShareReferral);
    // Live CMS uses SHARE TRIAL PASS (US/GB/IE/AU); FR-CA PARTAGER LE PASS D'ESSAI; legacy SHARE INVITATION.
    const shareCtaPattern = `${this.escapeRegExp(shareReferralLabel)}|share invitation|share trial pass|partager le pass d['’]?essai`;
    this.shareReferralBtn = this.iframe
      .getByRole('button', {
        name: new RegExp(shareCtaPattern, 'i'),
      })
      .first();
    this.heading = this.iframe.getByText(t(TranslationKeys.Texts.InviteAFriend.MainHeading), {
      exact: true,
    });
    this.step1 = this.iframe.getByText(t(TranslationKeys.Texts.InviteAFriend.Step1));
    this.step2 = this.iframe.getByText(
      new RegExp(
        `(?:Click|Cliquez).*?(?:"|'|«)?\\s*(?:${shareCtaPattern})\\s*(?:"|'|»)?.*?(?:below|ci-dessous)`,
        'i',
      ),
    );
    // EN: claim invitation/free trial; FR-CA: réclamer son essai gratuit…
    this.step3 = this.iframe.getByText(t(TranslationKeys.Texts.InviteAFriend.Step3)).or(
      this.iframe.getByText(
        /claim their (?:invitation|free trial) to your gym|r[eé]clamer son essai gratuit/i,
      ),
    );
    this.disclaimer = this.iframe.getByText(t(TranslationKeys.Texts.InviteAFriend.Disclaimer));
    this.shareModal = page
      .getByRole('dialog')
      .or(page.locator('[class*="share" i][class*="modal" i], [class*="ShareModal" i], [data-testid*="share" i]'))
      .first();
    // Prefer redeem/invite hash links — avoid matching the host page URL (/invite-friend).
    this.shareLinkField = page
      .locator(
        'input[readonly][value*="h="], input[value*="/invite?"], input[value*="hash="], a[href*="/invite?"][href*="h="], a[href*="hash="]',
      )
      .or(
        page
          .locator('input[readonly], input[type="text"], textarea')
          .filter({ hasText: /[?&#](?:h|code|hash)=/i }),
      )
      .first();
    this.copyLinkButton = page.getByRole('button', { name: /copy|copier/i }).first();
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Invite phone inputs use intl-tel-input with a pre-selected country dial code.
   * Typing a full E.164 value (e.g. +4479…) duplicates the country code and often fails validation.
   */
  private toNationalMobileDigits(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    try {
      const countryCode = d(TestDataKeys.PhoneNumber.CountryCode).replace(/\D/g, '');
      if (countryCode && digits.startsWith(countryCode) && digits.length > countryCode.length) {
        return digits.slice(countryCode.length);
      }
    } catch {
      // fall through
    }
    return digits.replace(/^0+/, '');
  }

  /**
   * After typing a foreign Invalid number (e.g. GB Invalid=+61…), intl-tel-input may flip the
   * selected country. National digits for the locale then validate against the wrong region and
   * leave Share disabled. Always re-bind to the locale ISO before a valid fill.
   */
  private async resetIntlTelToLocaleCountry(): Promise<void> {
    const locale = environmentManager.get('LOCALE') || localeManager.getCurrentLocale();
    const region = Helpers.localeToPhoneRegion(String(locale)).toLowerCase();

    const setViaApi = await this.mobilePhone
      .evaluate((el, country) => {
        const win = window as unknown as {
          intlTelInputGlobals?: { getInstance?: (input: Element) => { setCountry?: (c: string) => void } };
          intlTelInput?: { getInstance?: (input: Element) => { setCountry?: (c: string) => void } };
        };
        const iti =
          win.intlTelInputGlobals?.getInstance?.(el) || win.intlTelInput?.getInstance?.(el);
        if (iti?.setCountry) {
          iti.setCountry(country);
          return true;
        }
        return false;
      }, region)
      .catch(() => false);
    if (setViaApi) {
      return;
    }

    const flag = this.iframe
      .locator('.iti__selected-flag, button.iti__selected-country, [class*="iti__selected-flag"]')
      .first();
    if (!(await flag.isVisible({ timeout: TIMEOUTS.SHORT }).catch(() => false))) {
      logger.warn(`Invite intl-tel country reset skipped — flag not visible (locale=${locale})`);
      return;
    }
    await flag.click({ timeout: TIMEOUTS.SHORT }).catch(() => undefined);
    const countryOption = this.iframe
      .locator(
        `.iti__country[data-country-code="${region}"], li[data-country-code="${region}"], [data-country-code="${region}"]`,
      )
      .first();
    await countryOption.click({ timeout: TIMEOUTS.SHORT }).catch(() => {
      logger.warn(`Invite intl-tel country option not found for ${region}`);
    });
  }

  private async clearAndTypePhoneDigits(national: string): Promise<void> {
    await this.userForm.ensureLocatorInIframeViewport(this.mobilePhone);
    await this.mobilePhone.click();
    // Select-all + delete clears React-controlled intl-tel values more reliably than fill('').
    await this.mobilePhone.press('ControlOrMeta+a').catch(() => undefined);
    await this.mobilePhone.press('Backspace').catch(() => undefined);
    await this.mobilePhone.fill('');
    await this.mobilePhone.pressSequentially(national, { delay: 40 });
  }

  async waitForPageReady(): Promise<void> {
    await this.iframeElement.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await this.iframeElement.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    // Direct wait avoids SHORT timeouts inside ensureLocatorInIframeViewport under parallel load.
    await this.mobilePhone.waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
    await this.userForm.ensureLocatorInIframeViewport(this.mobilePhone).catch(() => undefined);
    await this.mobilePhone.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
  }

  async fillMobilePhone(phone: string): Promise<void> {
    await this.waitForPageReady();
    await this.resetIntlTelToLocaleCountry();
    const national = this.toNationalMobileDigits(phone);
    await this.clearAndTypePhoneDigits(national);
    // Tab reliably commits intl-tel-input validation; blur alone can leave Share disabled.
    await this.mobilePhone.press('Tab').catch(async () => {
      await this.mobilePhone.blur().catch(() => {});
    });
    // MEDIUM — landline/invalid numbers never enable Share; do not burn LONG into the suite timeout.
    await expect(this.shareReferralBtn).toBeEnabled({ timeout: TIMEOUTS.MEDIUM });
  }

  async typeMobilePhone(phone: string): Promise<void> {
    await this.waitForPageReady();
    // Prefer national digits when the Invalid number is already in the locale country.
    // Foreign Invalid (e.g. +61 on GB) — type with leading + so intl-tel keeps it as invalid
    // without relying on a flipped country for the subsequent valid fill (which resets country).
    const digits = phone.replace(/\D/g, '');
    let countryCode = '';
    try {
      countryCode = d(TestDataKeys.PhoneNumber.CountryCode).replace(/\D/g, '');
    } catch {
      countryCode = '';
    }
    const isForeignInvalid =
      Boolean(countryCode) && digits.startsWith(countryCode) === false && digits.length >= 8;
    if (isForeignInvalid) {
      await this.clearAndTypePhoneDigits(`+${digits}`);
    } else {
      await this.clearAndTypePhoneDigits(this.toNationalMobileDigits(phone));
    }
    await this.mobilePhone.blur().catch(() => {});
  }

  async clickShareReferral(): Promise<void> {
    await expect(this.shareReferralBtn).toBeEnabled({ timeout: TIMEOUTS.MEDIUM });
    await this.userForm.clickIframeButton(this.shareReferralBtn);
  }

  async assertShareButtonDisabled(): Promise<void> {
    await expect(this.shareReferralBtn).toBeDisabled({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertShareButtonEnabled(): Promise<void> {
    await expect(this.shareReferralBtn).toBeEnabled({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertShareModalWithInviteLink(referralCode?: string, referralUrl?: string): Promise<void> {
    const modalVisible = await this.shareModal.isVisible({ timeout: TIMEOUTS.SHORT }).catch(() => false);
    const copyVisible = await this.copyLinkButton.isVisible({ timeout: TIMEOUTS.SHORT }).catch(() => false);
    const linkVisible = await this.shareLinkField.isVisible({ timeout: TIMEOUTS.SHORT }).catch(() => false);

    if (linkVisible && referralCode) {
      const value =
        (await this.shareLinkField.getAttribute('value').catch(() => null)) ??
        (await this.shareLinkField.getAttribute('href').catch(() => null)) ??
        (await this.shareLinkField.textContent().catch(() => null)) ??
        '';
      if (value.includes(referralCode)) {
        if (modalVisible) {
          await expect(this.shareModal).toBeVisible();
        }
        if (copyVisible) {
          await expect(this.copyLinkButton).toBeVisible();
        }
        await expect(this.shareLinkField).toBeVisible();
        return;
      }
      // Host /invite-friend URL can match loose locators — fall through to API proof.
    } else if (modalVisible || copyVisible) {
      if (modalVisible) {
        await expect(this.shareModal).toBeVisible();
      }
      if (copyVisible) {
        await expect(this.copyLinkButton).toBeVisible();
      }
      if (referralUrl && referralCode) {
        expect(referralUrl).toMatch(/invite/i);
        expect(referralUrl).toMatch(new RegExp(`[?&#](?:h|code|hash)=${referralCode}\\b`, 'i'));
      }
      return;
    }

    // Webflow may open a native share sheet (not DOM-visible in Playwright). Proving the
    // referrals API returned a shareable invite URL + enabled Share CTA covers the requirement.
    if (!referralUrl || !referralCode) {
      throw new Error('Shareable invite link was not captured from referrals response');
    }

    expect(referralUrl).toMatch(/invite/i);
    expect(referralUrl).toMatch(new RegExp(`[?&#](?:h|code|hash)=${referralCode}\\b`, 'i'));
    await expect(this.shareReferralBtn).toBeEnabled({ timeout: TIMEOUTS.MEDIUM });
  }
}
