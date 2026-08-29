import { Locator, Page } from '@playwright/test';
import BasePage from '@pages/common/BasePage';
import { logger } from '@utils/logger';

export class OneTrustPage extends BasePage {
  readonly consentBanner: Locator;
  readonly bannerAllowAllBtn: Locator;
  readonly rejectAllBtn: Locator;
  readonly consentBannerText: Locator;
  readonly cookieSettingsFooterLink: Locator;
  readonly dialogAllowAllButton: Locator;
  readonly otherOrganizationsToggle: Locator;
  readonly alwaysActiveGroupHeader: Locator;
  readonly dialogCloseButton: Locator;
  readonly saveSettings: Locator;
  readonly bannerCloseIcon: Locator;
  readonly footerCookieSetting: Locator;
  readonly otherOrganizationButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.consentBanner = this.get('.ot-sdk-row #onetrust-group-container');
    this.bannerAllowAllBtn = this.get('.onetrust-banner-options #onetrust-accept-btn-handler');
    this.rejectAllBtn = page.getByRole('button', { name: 'Reject All' });
    this.consentBannerText = this.get('#onetrust-policy #onetrust-policy-text');
    this.cookieSettingsFooterLink = this.get('button.footer-cookie');
    this.dialogAllowAllButton = this.get('#ot-pc-content #accept-recommended-btn-handler');
    this.otherOrganizationsToggle = this.get('span[class="ot-switch-nob"]');
    this.alwaysActiveGroupHeader = this.get('.ot-acc-hdr.ot-always-active-group');
    this.dialogCloseButton = this.get('.ot-pc-header #close-pc-btn-handler');
    this.saveSettings = this.get('.ot-btn-container .save-preference-btn-handler');
    this.bannerCloseIcon = this.get('#onetrust-close-btn-container .ot-close-icon');
    this.footerCookieSetting = this.page.getByRole('button', {
      name: 'Open cookie settings modal',
    });
    this.otherOrganizationButton = this.page
      .locator('label')
      .filter({ hasText: 'Other Organizations' })
      .locator('span')
      .first();
    this.saveButton = this.page.getByRole('button', { name: 'Save Settings' });
  }

  async rejectAllCookies(): Promise<void> {
    logger.info('Rejecting all cookies');
    await this.rejectAllBtn.click();
  }

  async acceptAllCookies(): Promise<void> {
    logger.info('Accepting all cookies');
    await this.bannerAllowAllBtn.click();
  }

  async rejectCookies(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.footerCookieSetting.click();
    await this.page
      .locator('label')
      .filter({ hasText: 'Other Organizations' })
      .locator('span')
      .first()
      .click();
    await this.page.getByRole('button', { name: 'Save Settings' }).click();
  }

  async acceptCookies(): Promise<void> {
    // Banner Allow All is preferred when present (Local Offer and other direct-offer URLs
    // often omit the footer "Open cookie settings modal" control).
    const bannerVisible = await this.bannerAllowAllBtn
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (bannerVisible) {
      await this.bannerAllowAllBtn.click().catch(() => {});
      logger.info('Accepted cookies via OneTrust banner Allow All');
      // Preference center can remain mounted after Accept All and intercept clicks.
      await this.page
        .evaluate(() => {
          const root = document.querySelector('#onetrust-consent-sdk') as HTMLElement | null;
          if (!root) return;
          root.style.setProperty('pointer-events', 'none', 'important');
        })
        .catch(() => {});
      return;
    }

    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const footerVisible = await this.footerCookieSetting
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    if (!footerVisible) {
      logger.info('Cookie preference controls not found; continuing without explicit accept');
      return;
    }

    await this.footerCookieSetting.click();
    try {
      const checkbox = this.page.locator('#ot-group-id-BG342');

      // wait for checkbox to exist (OneTrust loads async) — short probe; do not burn 5s+
      await checkbox.waitFor({ state: 'attached', timeout: 2000 }).catch(() => null);

      // check if element exists first
      if (await checkbox.count()) {
        const isChecked = await checkbox.isChecked().catch(() => false);

        if (!isChecked) {
          await this.page
            .locator('label:has-text("Organization and Service") span')
            .first()
            .click();

          await this.page.locator('label:has-text("Other Organizations") span').first().click();

          await this.page.getByRole('button', { name: 'Save Settings' }).click();
        }
      }

      logger.info('Accepted cookies');
    } catch {
      const checkbox = this.page.locator('#ot-group-id-BG264');

      if (await checkbox.isVisible().catch(() => false)) {
        const isChecked = await checkbox.isChecked().catch(() => false);

        if (!isChecked) {
          await this.page
            .locator('label')
            .filter({ hasText: 'Other Organizations' })
            .locator('span')
            .first()
            .click();

          await this.page.getByRole('button', { name: 'Save Settings' }).click();
        }
      }
    }

    // Always clear pointer-events on the SDK shell so leftover preference UI cannot block gym select.
    await this.page
      .evaluate(() => {
        const root = document.querySelector('#onetrust-consent-sdk') as HTMLElement | null;
        if (!root) return;
        root.style.setProperty('pointer-events', 'none', 'important');
      })
      .catch(() => {});
  }

  async getActiveGroupNames(): Promise<string[]> {
    try {
      return await this.page.evaluate(() => {
        const activeIds = window.OptanonActiveGroups || '';
        const idList = activeIds.split(',').filter(Boolean);
        const allGroups = window.OneTrust?.GetDomainData?.().Groups || [];
        return allGroups
          .filter(
            (group): group is CookieGroup =>
              !!group &&
              (idList.includes(group.CustomGroupId) || idList.includes(group.OptanonGroupId)),
          )
          .map(group => group.GroupName);
      });
    } catch (error) {
      logger.error(`Failed to retrieve active cookie group names: ${error}`);
      return [];
    }
  }
}
