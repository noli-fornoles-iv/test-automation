import { Locator, Page } from '@playwright/test';
import BasePage from '@pages/common/BasePage';
import { t } from '@utils/locale-utils/locale-manager';
import TranslationKeys from '@utils/locale-utils/translations-keys.constants';

export class LocalGymPage extends BasePage {
  readonly tryUsFreeNavbarBtn: Locator;
  readonly scheduleAnAppointmentBtn: Locator;
  readonly scheduleAnAppointmentBtn2_0: Locator;
  readonly membershipInquiryBtn: Locator;
  readonly heroSection: Locator;
  readonly contactUsBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.tryUsFreeNavbarBtn = this.page
      .getByRole('banner')
      .getByRole('link', { name: 'TRY US FREE' });
    this.scheduleAnAppointmentBtn = this.page.getByRole('link', {
      name: 'SCHEDULE AN APPOINTMENT',
    });
    this.scheduleAnAppointmentBtn2_0 = this.page.locator(
      '//*[@id="main-content"]/section[9]/div/div[2]/div[1]/a',
    );
    this.membershipInquiryBtn = this.page
      .getByRole('link', {
        name: t(TranslationKeys.Buttons.LocalGymPage.MembershipInquiryBtn),
      })
      .first();
    this.heroSection = this.page.locator('.gym-hero-content');
    this.contactUsBtn = this.page
      .getByRole('link', {
        name: t(TranslationKeys.Buttons.LocalGymPage.ContactUsBtn),
      })
      .first();
  }

  async clickScheduleAnAppointment(): Promise<void> {
    await this.waitForVisible(this.scheduleAnAppointmentBtn);
    await this.click(this.scheduleAnAppointmentBtn);
  }

  async clickScheduleAnAppointment2_0(): Promise<void> {
    await this.waitForVisible(this.scheduleAnAppointmentBtn2_0);
    await this.click(this.scheduleAnAppointmentBtn2_0);
  }

  async clickMembershipInquiry(): Promise<void> {
    await this.waitForVisible(this.membershipInquiryBtn);
    await this.click(this.membershipInquiryBtn);
  }

  async clickContactUs(): Promise<void> {
    await this.waitForVisible(this.contactUsBtn);
    await this.scrollIntoView(this.contactUsBtn);
    await this.click(this.contactUsBtn);
  }
}
