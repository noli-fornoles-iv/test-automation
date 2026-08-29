import { Page } from '@playwright/test';
import { ConfirmationScreenPage } from '@pages/common/ConfirmationScreenPage';
import { LocalGymPage } from '@pages/common/LocalGymPage';
import { LocationSearchPage } from '@pages/common/LocationSearchPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { PATHS } from '@utils/constants';

export class ContactUsPage {
  readonly locationSearch: LocationSearchPage;
  readonly userForm: UserFormPage;
  readonly localGym: LocalGymPage;
  readonly confirmationScreen: ConfirmationScreenPage;

  constructor(page: Page) {
    this.locationSearch = new LocationSearchPage(page, 'contact-us-iframe', PATHS.CONTACT_US);
    this.userForm = new UserFormPage(page, 'contact-us-iframe');
    this.localGym = new LocalGymPage(page);
    this.confirmationScreen = new ConfirmationScreenPage(page);
  }
}
