import { Page } from '@playwright/test';
import { BookATourPage } from '@pages/common/BookATourPage';
import { ConfirmationScreenPage } from '@pages/common/ConfirmationScreenPage';
import { LocalGymPage } from '@pages/common/LocalGymPage';
import { LocationSearchPage } from '@pages/common/LocationSearchPage';
import { UserFormPage } from '@pages/common/UserFormPage';

export class McoOfferPage {
  readonly locationSearch: LocationSearchPage;
  readonly userForm: UserFormPage;
  readonly bookATour: BookATourPage;
  readonly localGym: LocalGymPage;
  readonly confirmationScreen: ConfirmationScreenPage;

  constructor(page: Page) {
    this.locationSearch = new LocationSearchPage(page, 'mco-offer-iframe');
    this.userForm = new UserFormPage(page, 'mco-offer-iframe');
    this.bookATour = new BookATourPage(page, 'book-a-tour-iframe');
    this.localGym = new LocalGymPage(page);
    this.confirmationScreen = new ConfirmationScreenPage(page);
  }

  async gymDetailsRedirection(page: Page): Promise<string | null> {
    await page.waitForTimeout(1500);
    const currentUrl = page.url();
    if (!currentUrl.includes('/locations'))
      throw new Error(`Gym Details redirection is invalid. Actual URL: ${currentUrl}`);

    return currentUrl;
  }

  async joinNowRedirection(page: Page): Promise<string> {
    await page.waitForTimeout(1500);
    const currentUrl = page.url();
    const plansWithNumberRegex = /\/\d+\/plans/;

    if (!plansWithNumberRegex.test(currentUrl)) {
      throw new Error(`Join Now redirection is invalid. Actual URL: ${currentUrl}`);
    }

    return currentUrl;
  }

  async getClubIdFromCurrentUrl(page: Page): Promise<string> {
    const currentUrl = page.url();
    const urlObj = new URL(currentUrl);
    const clubId = urlObj.searchParams.get('test_location_id');

    if (!clubId) {
      throw new Error('location_id parameter not found in the current URL');
    }

    return clubId;
  }
}
