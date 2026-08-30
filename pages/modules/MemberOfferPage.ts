import { Page } from '@playwright/test';
import { ConfirmationScreenPage } from '@pages/common/ConfirmationScreenPage';
import { LocationSearchPage } from '@pages/common/LocationSearchPage';
import { UserFormPage } from '@pages/common/UserFormPage';

export class MemberOfferPage {
  readonly page: Page;
  locationSearch: LocationSearchPage;
  readonly userForm: UserFormPage;
  readonly confirmationScreen: ConfirmationScreenPage;

  constructor(page: Page) {
    this.page = page;
    this.locationSearch = new LocationSearchPage(page, 'local-offer-iframe');
    this.userForm = new UserFormPage(page, 'local-offer-iframe');
    this.confirmationScreen = new ConfirmationScreenPage(page);
  }

  bindLocationSearchExpectedPath(
    offerPath: string,
    iframeId: 'local-offer-iframe' | 'find-gym-iframe' = 'local-offer-iframe',
  ): void {
    this.locationSearch = new LocationSearchPage(this.page, iframeId, offerPath);
  }
}
