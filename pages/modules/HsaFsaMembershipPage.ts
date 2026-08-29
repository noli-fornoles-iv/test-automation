import { Page } from '@playwright/test';
import { BookATourPage } from '@pages/common/BookATourPage';
import { ConfirmationScreenPage } from '@pages/common/ConfirmationScreenPage';
import { LocalGymPage } from '@pages/common/LocalGymPage';
import { LocationSearchPage } from '@pages/common/LocationSearchPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { PATHS, TIMEOUTS } from '@utils/constants';
export class HsaFsaMembershipPage {
  readonly locationSearch: LocationSearchPage;
  readonly userForm: UserFormPage;
  readonly bookATour: BookATourPage;
  readonly localGym: LocalGymPage;
  readonly confirmationScreen: ConfirmationScreenPage;

  constructor(page: Page) {
    this.locationSearch = new LocationSearchPage(page, 'tuf-hsa-fsa-event-iframe', PATHS.HSA_FSA);
    this.userForm = new UserFormPage(page, 'tuf-hsa-fsa-event-iframe');
    this.bookATour = new BookATourPage(page, 'book-a-tour-iframe');
    this.localGym = new LocalGymPage(page);
    this.confirmationScreen = new ConfirmationScreenPage(page);
  }

  async gymDetailsRedirection(page: Page): Promise<string | null> {
    await page.waitForURL(/\/locations\//, { timeout: TIMEOUTS.LONG });
    const currentUrl = page.url();
    if (!currentUrl.includes('/locations')) {
      throw new Error(`Gym Details redirection is invalid. Actual URL: ${currentUrl}`);
    }

    return currentUrl;
  }

  async joinNowRedirection(page: Page): Promise<string> {
    await page.waitForURL(/\/\d+\/plans|join\.anytimefitness\.com/, { timeout: TIMEOUTS.LONG });
    const currentUrl = page.url();
    const plansWithNumberRegex = /\/\d+\/plans/;

    if (!plansWithNumberRegex.test(currentUrl)) {
      throw new Error(`Join Now redirection is invalid. Actual URL: ${currentUrl}`);
    }

    return currentUrl;
  }
}
