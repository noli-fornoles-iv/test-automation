import { Locator, Page, expect } from '@playwright/test';
import BasePage from '@pages/common/BasePage';
import { TIMEOUTS } from '@utils/constants';
import localeManager, { t } from '@utils/locale-utils/locale-manager';
import {
  detectThankYouSocialPlatform,
  expectedThankYouSocialPlatforms,
} from '@utils/locale-utils/thank-you-social-platforms';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';

export class ConfirmationScreenPage extends BasePage {
  readonly thankYouHeading: Locator;
  readonly thankYouText: Locator;
  readonly socialLinks: Locator;
  readonly socialButtons: Locator;
  readonly findAGymButton: Locator;

  constructor(page: Page) {
    super(page);
    this.thankYouHeading = page.locator('h1.thankyou-h1');
    this.thankYouText = page.locator('div.thankyou-legend-txt');
    this.socialLinks = page.locator('div.thankyou-social');
    this.socialButtons = this.socialLinks.locator('a.social-bt');
    this.findAGymButton = page
      .getByRole('link', { name: /find\s*a\s*gym/i })
      .or(page.getByRole('button', { name: /find\s*a\s*gym/i }))
      .or(page.locator('a[href*="find-gym"]'))
      .first();
  }
  async isThankYouTextVisible(): Promise<void> {
    const expectedHeading = t(TranslationKeys.Texts.Headings.ThankYouPage);
    // DE/AT CMS may render "DANKE" / "VIELEN DANK" while Local Config translations keep "Danke dir".
    // EN-CA/FR-CA may use MERCI / NOUS AVONS REÇU / YOU'RE IN without h1.thankyou-h1.
    const heading = this.thankYouHeading.or(
      this.page.getByRole('heading', {
        name: /danke(\s+dir)?|vielen dank|thank you|grazie|merci|nous avons|you.?re in|شكرا|ขอบคุณ|感謝/i,
      }),
    );
    await expect(heading.first()).toBeVisible({ timeout: TIMEOUTS.LONG });
    const headingText = (
      (await heading
        .first()
        .innerText()
        .catch(() => '')) || ''
    ).trim();
    expect(
      headingText,
      `Thank-you heading mismatch. expected~="${expectedHeading}", got="${headingText}"`,
    ).toMatch(
      new RegExp(
        `${escapeRegExp(expectedHeading)}|danke|vielen dank|thank you|grazie|merci|nous avons|you.?re in|ขอบคุณ|感謝`,
        'i',
      ),
    );

    const expectedBody = t(TranslationKeys.Texts.BookingConfirmation.ThankYouPage);
    const bodyVisible = await this.thankYouText
      .isVisible({ timeout: TIMEOUTS.MEDIUM })
      .catch(() => false);
    if (bodyVisible) {
      const actualBody = ((await this.thankYouText.innerText().catch(() => '')) || '').trim();
      const normalize = (value: string) =>
        value
          .replace(/[\u2018\u2019\u201A\u201B\u2032']/g, "'")
          // CJK fullwidth punctuation: ignore incidental spaces around 。！？；：
          .replace(/\s*([。！？；：、，])\s*/g, '$1')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
      const sameSpelling =
        normalize(actualBody) === normalize(expectedBody) ||
        (/we.?ve received your (enquiry|inquiry)/i.test(actualBody) &&
          /we.?ve received your (enquiry|inquiry)/i.test(expectedBody)) ||
        // FR-CA/EN-CA CMS often serves English thank-you body while translations keep French.
        (/we.?ve received your (enquiry|inquiry)/i.test(actualBody) &&
          /nous avons bien re[cç]u votre demande/i.test(expectedBody)) ||
        (/nous avons bien re[cç]u votre demande/i.test(actualBody) &&
          /we.?ve received your (enquiry|inquiry)/i.test(expectedBody)) ||
        // DE/AT: formal/informal (Ihre/deine) and "Anfrage erhalten" variants.
        (/wir haben (ihre|deine) anfrage erhalten/i.test(actualBody) &&
          /wir haben (ihre|deine) anfrage erhalten/i.test(expectedBody));
      if (!sameSpelling) {
        await expect(this.thankYouText).toContainText(expectedBody, {
          timeout: TIMEOUTS.LONG,
          ignoreCase: true,
        });
      }
    }
    // Webflow Country Onboarding Guide: locale social buttons belong on Footer + Thank-you page.
    await this.assertSocialMediaIconsDisplayed();
  }

  /**
   * Hard-assert CMS Thank You social icons for the current locale.
   * Platforms come from Resources Footer (SOCIAL) / onboarding docs — not invented URLs.
   */
  async assertSocialMediaIconsDisplayed(): Promise<void> {
    await expect(
      this.socialLinks,
      'Thank You page must display social media icons (div.thankyou-social)',
    ).toBeVisible({ timeout: TIMEOUTS.LONG });

    const buttons = this.socialButtons;
    const buttonCount = await buttons.count();
    expect(
      buttonCount,
      'Thank You page must render at least one social media icon link (a.social-bt)',
    ).toBeGreaterThan(0);

    const hrefs: string[] = [];
    for (let i = 0; i < buttonCount; i++) {
      const href = (await buttons.nth(i).getAttribute('href')) || '';
      if (/^https?:\/\//i.test(href)) {
        hrefs.push(href);
        await expect(buttons.nth(i)).toBeVisible({ timeout: TIMEOUTS.SHORT });
      }
    }
    expect(
      hrefs.length,
      `Thank You social icons must have external http(s) hrefs. Found: ${JSON.stringify(
        await Promise.all(
          Array.from({ length: buttonCount }, (_, i) => buttons.nth(i).getAttribute('href')),
        ),
      )}`,
    ).toBeGreaterThan(0);

    const locale = localeManager.getCurrentLocale().toLowerCase();
    const expected = expectedThankYouSocialPlatforms(locale);
    if (!expected?.length) {
      return;
    }

    const present = new Set(
      hrefs
        .map(href => detectThankYouSocialPlatform(href))
        .filter((platform): platform is NonNullable<typeof platform> => Boolean(platform)),
    );
    const missing = expected.filter(platform => !present.has(platform));
    expect(
      missing,
      `Thank You social icons missing for ${locale}: ${missing.join(', ')}. ` +
        `Expected [${expected.join(', ')}], found hrefs: ${JSON.stringify(hrefs)}`,
    ).toEqual([]);
  }

  async clickFindAGymButton(): Promise<void> {
    await expect(this.findAGymButton).toBeVisible({ timeout: TIMEOUTS.LONG });
    await this.findAGymButton.click();
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
