import { Page } from '@playwright/test';
import { UserFormPage } from '@pages/common/UserFormPage';
import { EVENTS_IFRAME_MAP } from '@utils/constants/mapping.contants';

const USER_FORM_IFRAME_MAP: Record<string, string> = {
  'book a tour standalone': 'book-a-tour-iframe',
  'events book a tour': 'book-a-tour-iframe',
  'membership inquiry': 'membership-inquiry-iframe',
  'try us free': 'try-us-free-iframe',
  'try us free apple fitness free trial': 'try-us-free-iframe',
  'try us free apple fitness plus subscriber': 'try-us-free-iframe',
  'local offer': 'local-offer-iframe',
  'member offer': 'local-offer-iframe',
  'global offer': 'mco-offer-iframe',
};

export function getUserFormForScenario(page: Page, pageName: string): UserFormPage {
  const normalized = pageName.toLowerCase();
  const iframeId = USER_FORM_IFRAME_MAP[normalized] ?? EVENTS_IFRAME_MAP[normalized];

  if (!iframeId) {
    throw new Error(
      `Local resident disclaimer validation is not configured for page: ${pageName}`,
    );
  }

  return new UserFormPage(page, iframeId);
}
