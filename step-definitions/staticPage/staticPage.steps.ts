import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/base.fixture';
import {
  captureRudderStackEvent,
  rudderstackRequests,
  verifyEventNotTriggered,
  getPageDetails,
} from '@utils/rudderstack';

const { When, Then } = createBdd(test, { tags: '@StaticPage' });

When(/^The page correctly access and loaded$/, async ({ staticPage }) => {
  await staticPage.locationWidget.isVisible();
});

When(
  'The user accepts the cookies in the consent banner',
  async ({ oneTrustPage, scenarioContext }) => {
    await oneTrustPage.acceptCookies();
    scenarioContext.isCookieAccepted = true;
    scenarioContext.rudderstackTestEnable = true;
  },
);

When(
  'The user rejects the cookies in the consent banner',
  async ({ oneTrustPage, scenarioContext }) => {
    await oneTrustPage.rejectCookies();
    scenarioContext.isCookieAccepted = false;
    scenarioContext.rudderstackTestEnable = true;
  },
);

Then(/^The rudderstack page view value is correct$/, async ({ page }) => {
  const pageDetails = await getPageDetails(page);
  const request = await rudderstackRequests(page);
  await page.reload();
  await page.waitForTimeout(30000);
  await captureRudderStackEvent({
    requests: request,
    event: 'page',
    page,
    data: '',
    pageDetails,
  });
});

Then(/^The rudderstack page view should not trigger$/, async ({ page }) => {
  const request = await rudderstackRequests(page);
  await page.reload();
  await page.waitForTimeout(15000);
  await verifyEventNotTriggered(request, 'page');
});
