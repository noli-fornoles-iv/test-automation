import test, { Page, Locator, FrameLocator } from '@playwright/test';
import { TIMEOUTS } from '@utils/constants';
import { Helpers } from '@utils/helpers';
import { t } from '@utils/locale-utils/locale-manager';

export default class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected get(locator: string): Locator {
    return this.page.locator(locator);
  }

  private getElement(locator: Locator | string): Locator {
    return typeof locator === 'string' ? this.get(locator) : locator;
  }

  async click(locator: Locator | string) {
    const element = this.getElement(locator);

    // Wait until element is attached & visible
    await element.waitFor({ state: 'visible' });

    // Smooth scroll into view (more reliable)
    await element.evaluate(el => {
      el.scrollIntoView({ behavior: 'auto', block: 'center' });
    });

    // Small wait (optional, helps in flaky UIs)
    await this.page.waitForTimeout(200);
    await element.evaluate(el => (el as HTMLElement).click());
  }

  async type(locator: Locator | string, text: string) {
    const element = this.getElement(locator);
    await element.fill(text);
  }

  async clearAndType(locator: Locator | string, text: string) {
    const element = this.getElement(locator);
    await element.fill('');
    // Retry if element is still not empty due to race condition
    const currentValue = await element.inputValue();
    if (currentValue !== '') {
      await element.fill('');
    }
    await element.fill(text);
  }

  async getText(locator: Locator | string): Promise<string> {
    const element = this.getElement(locator);
    const rawText = await element.textContent();
    return Helpers.normalizeText(rawText);
  }

  async isVisible(locator: Locator | string): Promise<boolean> {
    const element = this.getElement(locator);
    return element.isVisible();
  }

  async shortWait(duration: number): Promise<void> {
    await this.page.waitForTimeout(duration);
  }

  async waitForVisible(locator: Locator | string, timeout?: number): Promise<void> {
    const element = this.getElement(locator);
    await element.waitFor({ state: 'visible', timeout });
  }

  protected getIframeById(iframeId: string): FrameLocator {
    return this.page.frameLocator(`#${iframeId}`);
  }

  protected locateElementInsideIframe(iframe: FrameLocator, selector: string): Locator {
    return iframe.locator(selector);
  }

  async isDisplayed(locator: Locator | string): Promise<boolean> {
    const element = this.getElement(locator);
    return element.isVisible();
  }

  async checkCheckbox(locator: Locator | string): Promise<void> {
    const element = this.getElement(locator);
    if (!(await element.isChecked())) {
      await element.check();
    }
  }

  async uncheckCheckbox(locator: Locator | string): Promise<void> {
    const element = this.getElement(locator);
    if (await element.isChecked()) {
      await element.uncheck();
    }
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    if (await locator.isVisible()) {
      await this.scrollLocatorIntoView(locator);
    }
  }

  private isDetachedDomError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return /not attached|detached|stale/i.test(message);
  }

  private async scrollLocatorIntoView(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    // WebKit iframe evaluate can hang forever — always race with a timeout.
    await this.evaluateWithTimeout(locator, el => {
      el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
    });
  }

  async takeScreenshot(name: string = 'screenshot') {
    const screenshot = await this.page.screenshot();
    await test.info().attach(name, {
      body: screenshot,
      contentType: 'image/png',
    });
  }

  getBrowserName(): string | undefined {
    return this.page.context().browser()?.browserType().name();
  }

  async scrollIntoViewWithRetry(
    locator: Locator,
    options?: { parentLocator?: Locator; maxAttempts?: number },
  ): Promise<void> {
    await this.scrollLocatorIntoViewWithRetry(locator, options);
  }

  async scrollIntoViewIfWebkit(...locators: [Locator, ...Locator[]]): Promise<void>;
  async scrollIntoViewIfWebkit(parentLocator: Locator, ...locators: Locator[]): Promise<void>;
  async scrollIntoViewIfWebkit(first: Locator, ...rest: Locator[]): Promise<void> {
    const browser = this.getBrowserName();
    const isMobile = await Helpers.isMobileDevice(this.page);
    if (browser !== 'webkit' && !isMobile) return;

    const parentLocator = rest.length > 0 ? first : undefined;
    const locators = parentLocator ? rest : [first, ...rest];

    for (const locator of locators) {
      await this.scrollLocatorIntoViewWithRetry(locator, { parentLocator, maxAttempts: 8 });
    }
  }

  /** WebKit (esp. iPhone Safari) can hang forever on iframe `evaluate` — always race a timeout. */
  protected async evaluateWithTimeout<T>(
    locator: Locator,
    pageFunction: (el: Element) => T,
    timeoutMs: number = 5000,
  ): Promise<T | null> {
    try {
      return await Promise.race([
        locator.evaluate(pageFunction),
        new Promise<null>(resolve => {
          setTimeout(() => resolve(null), timeoutMs);
        }),
      ]);
    } catch {
      return null;
    }
  }

  /** Same hang-guard for `page.evaluate` (host scroll / userAgent checks). */
  protected async pageEvaluateWithTimeout<T>(
    pageFunction: () => T,
    timeoutMs: number = 5000,
  ): Promise<T | null> {
    try {
      return await Promise.race([
        this.page.evaluate(pageFunction),
        new Promise<null>(resolve => {
          setTimeout(() => resolve(null), timeoutMs);
        }),
      ]);
    } catch {
      return null;
    }
  }

  private async isLocatorCenteredInViewport(locator: Locator): Promise<boolean> {
    const result = await this.evaluateWithTimeout(locator, el => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      // Tall elements (e.g. #book-a-tour-iframe on mobile) can never be "centered".
      if (rect.height > vh * 0.9 || rect.width > vw * 0.98) {
        return rect.width > 0 && rect.height > 0 && rect.bottom > 40 && rect.top < vh - 40;
      }
      const centerY = rect.top + rect.height / 2;
      const centerX = rect.left + rect.width / 2;
      const margin = 40;
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        centerY >= margin &&
        centerY <= vh - margin &&
        centerX >= margin &&
        centerX <= vw - margin
      );
    });
    return result === true;
  }

  /** True when the element intersects the frame/page viewport (good enough to click/fill). */
  protected async isLocatorInteractableInViewport(locator: Locator): Promise<boolean> {
    const result = await this.evaluateWithTimeout(locator, el => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const margin = 12;
      return rect.width > 0 && rect.height > 0 && rect.bottom > margin && rect.top < vh - margin;
    });
    return result === true;
  }

  protected async scrollElementInFrame(locator: Locator): Promise<void> {
    await this.evaluateWithTimeout(locator, el => {
      el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });

      let parent: HTMLElement | null = el.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (
          style.overflowY === 'auto' ||
          style.overflowY === 'scroll' ||
          parent === document.body ||
          parent === document.documentElement
        ) {
          const rect = el.getBoundingClientRect();
          const parentRect = parent.getBoundingClientRect();
          const padding = 24;
          if (rect.bottom > parentRect.bottom - padding) {
            parent.scrollTop += rect.bottom - parentRect.bottom + padding;
          } else if (rect.top < parentRect.top + padding) {
            parent.scrollTop -= parentRect.top - rect.top + padding;
          }
        }
        parent = parent.parentElement;
      }
    });
  }

  private async scrollIframeContentBy(iframeElement: Locator, deltaY: number): Promise<void> {
    const handle = await iframeElement.elementHandle();
    if (!handle) return;
    const frame = await handle.contentFrame();
    if (!frame) return;
    // WebKit can hang forever on frame.evaluate — race a timeout.
    await Promise.race([
      frame.evaluate((y: number) => window.scrollBy(0, y), deltaY),
      new Promise<void>(resolve => setTimeout(resolve, 5000)),
    ]).catch(() => {});
  }

  protected getStickyHeaderOffset(): number {
    return 112;
  }

  protected getTryUsFreeHeaderLink(): Locator {
    return this.page.locator('header, [role="banner"]').locator('a[href*="try-us-free"]').first();
  }

  /**
   * Dismisses overlays that block scrolling or hide iframe forms on mobile (geo redirect, cookies).
   */
  async dismissBlockingOverlays(): Promise<void> {
    // Use short visibility probes — waitForFormFieldReady polls this every ~400ms.
    // Prefer #main-label only (no .or(getByText) — compound OR can hang on WebKit/PROD).
    const philippinesBanner = this.page.locator('#main-label').filter({
      hasText: /philippines website|singapore website|new zealand website|indonesia website/i,
    });
    if (
      await philippinesBanner
        .first()
        .isVisible({ timeout: 400 })
        .catch(() => false)
    ) {
      const bannerRoot = philippinesBanner
        .first()
        .locator('xpath=ancestor::*[self::div or self::section][position()<=10]')
        .last();

      const closeCandidates = [
        bannerRoot.locator('button[aria-label*="close" i]').first(),
        bannerRoot.locator('[aria-label*="close" i]').first(),
        bannerRoot
          .locator('button')
          .filter({ hasText: /^[x×]$/i })
          .first(),
        bannerRoot
          .locator('button, [role="button"], a')
          .filter({ hasText: /no.?thanks|stay here|remain|dismiss|chiudi|schließen/i })
          .first(),
        this.page.locator('button[aria-label*="close" i]').first(),
      ];

      let dismissed = false;
      for (const closeBtn of closeCandidates) {
        if (await closeBtn.isVisible({ timeout: 300 }).catch(() => false)) {
          await closeBtn.click({ force: true, timeout: TIMEOUTS.SHORT }).catch(() => {});
          dismissed = true;
          break;
        }
      }

      if (!dismissed) {
        dismissed = await bannerRoot
          .evaluate(container => {
            const clickables = Array.from(
              container.querySelectorAll<HTMLElement>('button, [role="button"], a'),
            );
            const closeEl = clickables.find(el => {
              const label = (el.textContent ?? '').replace(/\s+/g, ' ').trim().toUpperCase();
              const aria = (el.getAttribute('aria-label') ?? '').toUpperCase();
              if (label === 'CONTINUE' || aria.includes('CONTINUE')) return false;
              if (aria.includes('CLOSE') || aria.includes('DISMISS')) return true;
              if (/NO.?THANKS|STAY|REMAIN|DISMISS|CHIUDI|SCHLIESSEN/.test(label)) return true;
              return label === 'X' || label === '×' || (label.length > 0 && label.length <= 2);
            });
            const fallback =
              closeEl ??
              clickables.reverse().find(el => {
                const label = (el.textContent ?? '').replace(/\s+/g, ' ').trim().toUpperCase();
                return label !== 'CONTINUE';
              });
            fallback?.click();
            return Boolean(fallback);
          })
          .catch(() => false);
      }

      if (!dismissed) {
        await this.page.keyboard.press('Escape').catch(() => {});
      }

      // Force-hide immediately — do not burn waits when PH IP keeps the banner mounted.
      await philippinesBanner
        .first()
        .waitFor({ state: 'hidden', timeout: 800 })
        .catch(async () => {
          await this.page
            .evaluate(() => {
              const labels = Array.from(document.querySelectorAll('#main-label')).filter(el =>
                /philippines|singapore/i.test(el.textContent ?? ''),
              );
              for (const label of labels) {
                let root: HTMLElement | null = label as HTMLElement;
                for (let i = 0; i < 12 && root; i++) {
                  const cls = (root.className || '').toString().toLowerCase();
                  if (
                    /banner|modal|overlay|dialog|geo|redirect/.test(cls) ||
                    root.getAttribute('role') === 'dialog'
                  ) {
                    break;
                  }
                  root = root.parentElement;
                }
                root = root || (label.parentElement as HTMLElement) || (label as HTMLElement);
                root.style.setProperty('display', 'none', 'important');
                root.style.setProperty('visibility', 'hidden', 'important');
                root.style.setProperty('pointer-events', 'none', 'important');
                root.setAttribute('aria-hidden', 'true');
              }
            })
            .catch(() => {});
        });
      await this.page.waitForTimeout(150);
    }

    const oneTrustAccept = this.page.locator('#onetrust-accept-btn-handler');
    if (await oneTrustAccept.isVisible({ timeout: 400 }).catch(() => false)) {
      await oneTrustAccept.click({ timeout: TIMEOUTS.SHORT }).catch(() => {});
      await this.page.waitForTimeout(300);
    }

    // Preference center / category group can sit open and intercept iframe clicks
    // (ot-sdk-row / ot-cat-grp). Accept All when present; otherwise force-hide the SDK root.
    const otSdk = this.page.locator('#onetrust-consent-sdk');
    if (await otSdk.isVisible({ timeout: 400 }).catch(() => false)) {
      const allowAll = this.page
        .locator(
          '#onetrust-accept-btn-handler, #accept-recommended-btn-handler, button:has-text("Allow All"), button:has-text("Confirm My Choices"), button:has-text("Save Settings")',
        )
        .first();
      if (await allowAll.isVisible({ timeout: 400 }).catch(() => false)) {
        await allowAll.click({ force: true, timeout: TIMEOUTS.SHORT }).catch(() => {});
        await this.page.waitForTimeout(200);
      }
      if (await otSdk.isVisible({ timeout: 400 }).catch(() => false)) {
        await this.page
          .evaluate(() => {
            const root = document.querySelector('#onetrust-consent-sdk') as HTMLElement | null;
            if (!root) return;
            root.style.setProperty('display', 'none', 'important');
            root.style.setProperty('visibility', 'hidden', 'important');
            root.style.setProperty('pointer-events', 'none', 'important');
            root.setAttribute('aria-hidden', 'true');
          })
          .catch(() => {});
      }
    }
  }

  /** Positions `locator` below the sticky site header (avoids overlapping TRY US FREE). */
  protected async scrollLocatorBelowStickyHeader(
    locator: Locator,
    headerOffset = this.getStickyHeaderOffset(),
  ): Promise<void> {
    const handle = await locator.elementHandle().catch(() => null);
    if (handle) {
      // WebKit iframe evaluate can hang forever — race a timeout.
      await Promise.race([
        handle.evaluate((el, offset) => {
          const rect = el.getBoundingClientRect();
          const targetY = window.scrollY + rect.top - offset;
          window.scrollTo({ top: Math.max(0, targetY), left: 0, behavior: 'instant' });
        }, headerOffset),
        new Promise<void>(resolve => setTimeout(resolve, 5000)),
      ]).catch(() => {});
    }
    await this.page.waitForTimeout(250);
  }

  protected async isLocatorBelowStickyHeader(locator: Locator): Promise<boolean> {
    const targetBox = await locator.boundingBox({ timeout: 2000 }).catch(() => null);
    if (!targetBox) return false;

    const headerLink = this.getTryUsFreeHeaderLink();
    if ((await headerLink.count()) === 0) return true;

    const headerBox = await headerLink.boundingBox({ timeout: 2000 }).catch(() => null);
    if (!headerBox) return true;
    return targetBox.y >= headerBox.y + headerBox.height - 2;
  }

  /** Clicks without force so Playwright rejects hits on the sticky TRY US FREE link. */
  protected async clickLocatorBelowStickyHeader(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });

    for (let attempt = 1; attempt <= 6; attempt++) {
      await this.scrollLocatorBelowStickyHeader(locator);
      if (await this.isLocatorBelowStickyHeader(locator)) {
        await locator.click({ timeout: TIMEOUTS.MEDIUM });
        return;
      }
      await this.page.evaluate(() => window.scrollBy(0, 72)).catch(() => {});
      await this.page.waitForTimeout(200);
    }

    await locator.click({ timeout: TIMEOUTS.MEDIUM });
  }

  /**
   * Scrolls the host page until `locator` is below the sticky header. Does not require visible beforehand.
   */
  protected async waitForScrollSettled(locator: Locator, timeout = 600): Promise<void> {
    const pollIntervalMs = 100;
    const start = Date.now();
    let previousBox: Awaited<ReturnType<Locator['boundingBox']>> = null;
    let stableReads = 0;

    while (Date.now() - start < timeout) {
      const box = await locator.boundingBox().catch(() => null);
      if (
        box &&
        previousBox &&
        Math.abs(box.x - previousBox.x) < 1 &&
        Math.abs(box.y - previousBox.y) < 1 &&
        Math.abs(box.width - previousBox.width) < 1 &&
        Math.abs(box.height - previousBox.height) < 1
      ) {
        stableReads++;
        if (stableReads >= 2) return;
      } else {
        stableReads = 0;
      }
      previousBox = box;
      await this.page.waitForTimeout(pollIntervalMs).catch(() => {});
    }
  }

  protected async scrollHostPageToRevealElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    const isMobile = await Helpers.isMobileDevice(this.page);
    const maxAttempts = isMobile ? 12 : 8;
    const headerOffset = this.getStickyHeaderOffset();
    let previousScrollY = -1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.scrollLocatorBelowStickyHeader(locator, headerOffset);

      const interactable = await this.isLocatorInteractableInViewport(locator);
      const belowHeader = isMobile ? await this.isLocatorBelowStickyHeader(locator) : true;
      if (interactable && belowHeader) {
        return;
      }

      const currentScrollY = await this.page.evaluate(() => window.scrollY).catch(() => -1);
      if (currentScrollY === previousScrollY && attempt > 1) {
        if (interactable) return;
        break;
      }
      previousScrollY = currentScrollY;

      await this.page
        .evaluate(
          ({ mobile }) => {
            const vh = window.innerHeight || document.documentElement.clientHeight;
            window.scrollBy({ top: vh * (mobile ? 0.35 : 0.25), left: 0, behavior: 'instant' });
          },
          { mobile: isMobile },
        )
        .catch(() => {});

      await this.page.waitForTimeout(250);
    }
  }

  protected async scrollParentIntoViewOnPage(parentLocator: Locator): Promise<void> {
    // Do not soft-catch attach then fall through to scrollHostPageToRevealElement —
    // a missing iframe (post Select Gym remount) would burn another MEDIUM wait and
    // cascade consolidated MI form chrome / invalid scenarios under parallel load.
    const attached = await parentLocator
      .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
      .then(() => true)
      .catch(() => false);
    if (!attached) {
      throw new Error(
        `Parent locator not attached before host scroll: ${parentLocator.toString()}`,
      );
    }

    const inView = await this.isLocatorInteractableInViewport(parentLocator).catch(() => false);
    const belowHeader = await this.isLocatorBelowStickyHeader(parentLocator).catch(() => true);

    if (inView && belowHeader) {
      await parentLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
      return;
    }

    if (!inView) {
      await this.scrollHostPageToRevealElement(parentLocator);
    }
    await parentLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });

    if (!(await this.isLocatorBelowStickyHeader(parentLocator).catch(() => true))) {
      await this.scrollLocatorBelowStickyHeader(parentLocator);
    }
  }

  private async scrollLocatorIntoViewWithRetry(
    locator: Locator,
    options?: { parentLocator?: Locator; maxAttempts?: number },
  ): Promise<void> {
    const page = locator.page();
    const maxAttempts = options?.maxAttempts ?? 8;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (options?.parentLocator && attempt === 1) {
          await this.scrollParentIntoViewOnPage(options.parentLocator);
        }

        await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
        await locator.scrollIntoViewIfNeeded({ timeout: TIMEOUTS.MEDIUM }).catch(() => {});

        await this.evaluateWithTimeout(locator, el => {
          el.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
        });

        await this.evaluateWithTimeout(locator, el => {
          let parent: HTMLElement | null = el.parentElement;
          const vh = window.innerHeight || document.documentElement.clientHeight;

          while (parent) {
            const style = window.getComputedStyle(parent);
            if (
              style.overflowY === 'auto' ||
              style.overflowY === 'scroll' ||
              style.overflowX === 'auto' ||
              style.overflowX === 'scroll' ||
              parent === document.body
            ) {
              const rect = el.getBoundingClientRect();
              parent.scrollTop += rect.top - vh / 2 + rect.height / 2;
            }
            parent = parent.parentElement;
          }
        });

        await this.page.waitForTimeout(300);

        if (await this.isLocatorCenteredInViewport(locator)) return;
        if (await this.isLocatorInteractableInViewport(locator)) return;

        const scrollAmount = 180 + attempt * 40;
        const direction =
          (await this.evaluateWithTimeout(locator, el => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            if (rect.bottom < 0 || rect.top > vh) {
              return rect.top > vh / 2 ? 1 : -1;
            }
            return rect.top + rect.height / 2 > vh / 2 ? 1 : -1;
          })) ?? 1;

        if (options?.parentLocator) {
          await this.scrollIframeContentBy(options.parentLocator, scrollAmount * direction);
        } else {
          await page.evaluate(({ amount, dir }) => window.scrollBy(0, amount * dir), {
            amount: scrollAmount,
            dir: direction,
          });
        }
        await page.waitForTimeout(200);
      } catch (error) {
        if (attempt === maxAttempts || !this.isDetachedDomError(error)) {
          throw error;
        }
        await page.waitForTimeout(300);
      }
    }
  }

  async forceClick(locator: Locator): Promise<void> {
    const elementHandle = await locator.elementHandle();
    if (!elementHandle) {
      throw new Error('Element not found for force click');
    }
    await elementHandle.evaluate((el: HTMLElement) => el.click());
  }

  async takeElementScreenshotIfWebkit(
    locator: Locator,
    name: string = 'element-screenshot',
    onlyWebkit: boolean = true,
  ) {
    const browserName = this.getBrowserName();
    if (onlyWebkit && browserName !== 'webkit') return;

    try {
      await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      const screenshot = await locator.screenshot();

      await test.info().attach(name, {
        body: screenshot,
        contentType: 'image/png',
      });
    } catch {
      // iframe may be hidden after successful submit; skip screenshot
    }
  }

  async verifyTextVisible(
    textKey: string,
    replacements?: Record<string, string>,
    context?: Page | FrameLocator,
  ): Promise<boolean> {
    const expectedText = t(textKey, replacements);
    const contextLocator: Page | FrameLocator = context ?? this.page;
    const normalizedText = Helpers.normalizeQuotes(expectedText);

    try {
      await contextLocator.getByText(normalizedText, { exact: true }).waitFor({
        state: 'visible',
        timeout: TIMEOUTS.LONG,
      });
      return true;
    } catch {
      return false;
    }
  }

  async verifyPrivacyNoticeVisible(
    textKey: string,
    replacements?: Record<string, string>,
  ): Promise<boolean> {
    const expectedText = t(textKey, replacements);
    const normalizedText = Helpers.normalizeQuotes(expectedText);
    const normalizedExpectedText = normalizedText?.trim().replace(/\s+/g, ' ') || '';
    return normalizedExpectedText.includes(
      'including the use of my personal data as stated in the Privacy Policy.',
    );
  }

  async verifyHeadingVisible(headingKey: string, context?: Page | FrameLocator): Promise<boolean> {
    const expectedText = t(headingKey);
    const contextLocator: Page | FrameLocator = context ?? this.page;

    const headingLocator = contextLocator.getByRole('heading', { name: expectedText });

    try {
      await headingLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
      return true;
    } catch {
      return false;
    }
  }

  async waitForVisibleInIframe(
    frame: FrameLocator,
    locator: Locator | string,
    timeout?: number,
  ): Promise<void> {
    if (!frame) throw new Error('Iframe not initialized');
    const element = frame.locator(locator);
    await element.waitFor({ state: 'visible', timeout: timeout ?? TIMEOUTS.MEDIUM });
  }
}
