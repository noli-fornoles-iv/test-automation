import { Locator, Page } from '@playwright/test';
import BasePage from '@pages/common/BasePage';

export class CaliforniaNoticePage extends BasePage {
  readonly californiaResidentsSection: Locator;

  constructor(page: Page) {
    super(page);
    this.californiaResidentsSection = page.locator('section#california-residents .privacy-h2');
  }
}
