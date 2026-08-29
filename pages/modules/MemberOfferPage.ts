import { Page } from '@playwright/test';
import { ConfirmationScreenPage } from '@pages/common/ConfirmationScreenPage';
import { UserFormPage } from '@pages/common/UserFormPage';

export class MemberOfferPage {
  readonly userForm: UserFormPage;
  readonly confirmationScreen: ConfirmationScreenPage;

  constructor(page: Page) {
    this.userForm = new UserFormPage(page, 'local-offer-iframe');
    this.confirmationScreen = new ConfirmationScreenPage(page);
  }
}
