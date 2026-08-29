import { Locator, Page } from '@playwright/test';

export class StaticPage {
  readonly locationWidget: Locator;

  constructor(page: Page) {
    this.locationWidget = page.locator('xpath=//*[@id="locations-widget-iframe"]');
  }
}
