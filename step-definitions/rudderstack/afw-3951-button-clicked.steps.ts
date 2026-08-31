import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { ButtonClickedTrackingPage } from '@pages/modules/ButtonClickedTrackingPage';
import { UserFormPage } from '@pages/common/UserFormPage';
import { test } from '@fixtures/base.fixture';
import { TIMEOUTS } from '@utils/constants';
import { Helpers } from '@utils/helpers';
import { d } from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import {
  assertButtonClickedDidNotFireSince,
  assertButtonClickedPayload,
  BUTTON_CLICKED_EVENT,
  BUTTON_CLICKED_TEST_CLUB_ID,
  BUTTON_CLICKED_THANK_YOU_CLUB_ID,
  countButtonClickedEvents,
  enableButtonClickedRudderstackCapture,
  filterButtonClickedEvents,
  storeCalendarReferencePayload,
  waitForButtonClickedAfterClick,
  type ButtonClickedInventory,
  type ButtonClickedPayloadExpectations,
  type ButtonClickedRequest,
} from '@utils/tracking/button-clicked-rs-tracking';

/**
 * AFW-3951 — Button Clicked Rudderstack validation (Testpad 28427).
 * Scenarios must include @AFW-3951 so these steps bind across flows.
 */
const { Given, When, Then } = createBdd(test, { tags: '@AFW-3951' });

function trackingPage(page: import('@playwright/test').Page): ButtonClickedTrackingPage {
  return new ButtonClickedTrackingPage(page);
}

function getRequests(scenarioContext: {
  rudderstackCapturedRequests?: ButtonClickedRequest[];
}): ButtonClickedRequest[] {
  return (scenarioContext.rudderstackCapturedRequests ?? []) as ButtonClickedRequest[];
}

async function assertClickedPayload(
  requests: ButtonClickedRequest[],
  baselineCount: number,
  inventory: ButtonClickedInventory,
  extra: Partial<ButtonClickedPayloadExpectations> = {},
): Promise<ButtonClickedRequest> {
  const matched = await waitForButtonClickedAfterClick(requests, baselineCount);
  assertButtonClickedPayload(matched, {
    elementId: inventory.elementId ?? 'non-empty',
    placement: inventory.placement ?? 'non-empty',
    text: inventory.text ?? 'non-empty',
    locationId: inventory.locationId,
    requireStatus200: true,
    forbidPropertiesChannel: true,
    ...extra,
  });
  return matched;
}

Given(/^Rudderstack validation is enabled for AFW-3951$/, async ({ page, scenarioContext }) => {
  scenarioContext.rudderstackTestEnable = true;
  if (!scenarioContext.rudderstackCapturedRequests) {
    scenarioContext.rudderstackCapturedRequests = await enableButtonClickedRudderstackCapture(page);
  }
});

Given(/^The AFW-3951 Webflow home page is open with Rudderstack capture$/, async ({ page }) => {
  await trackingPage(page).openPath('/');
});

Given(/^The AFW-3951 training page is open with Rudderstack capture$/, async ({ page }) => {
  await trackingPage(page).openPath('/training');
});

Given(/^The AFW-3951 try-us-free logo-only navbar page is open with Rudderstack capture$/, async ({
  page,
}) => {
  await trackingPage(page).openPath('/try-us-free', { location_id: BUTTON_CLICKED_TEST_CLUB_ID });
});

Given(/^The AFW-3951 LLP page is open with Rudderstack capture$/, async ({ page }) => {
  await trackingPage(page).openLlp();
});

Given(/^The AFW-3951 why join page is open with Rudderstack capture$/, async ({ page }) => {
  await trackingPage(page).openWhyJoinPlanPath();
});

Given(/^The AFW-3951 locations search page is open with Rudderstack capture$/, async ({ page }) => {
  await trackingPage(page).openLocationsSearch();
});

Given(
  /^The AFW-3951 try-us-free lead form with location pre-selected is open with Rudderstack capture$/,
  async ({ page, scenarioContext }) => {
    scenarioContext.afw3951UserForm = await trackingPage(page).openTryUsFreeWithClub(
      BUTTON_CLICKED_TEST_CLUB_ID,
    );
  },
);

Given(
  /^The AFW-3951 local offer flow with LLP navigation is open with Rudderstack capture$/,
  async ({ page, scenarioContext }) => {
    scenarioContext.afw3951UserForm = await trackingPage(page).openLocalOfferWithClub(
      BUTTON_CLICKED_TEST_CLUB_ID,
    );
  },
);

Given(
  /^The AFW-3951 Book A Visit schedule picker is open with Rudderstack capture$/,
  async ({ page, scenarioContext }) => {
    await trackingPage(page).openPath('/schedule-an-appointment-online', {
      location_id: BUTTON_CLICKED_TEST_CLUB_ID,
      disable_captcha: 'true',
    });
    const userForm = new UserFormPage(page, 'book-a-tour-iframe');
    await userForm.firstName.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG }).catch(() => {});
    await userForm.fillAndSubmitForm(
      {
        firstName: Helpers.generateRandomString(6),
        lastName: Helpers.generateRandomString(6),
        email: Helpers.generateRandomEmail(),
        phone: d(TestDataKeys.PhoneNumber.Valid.Default),
      },
      false,
    );
    const bookATour = trackingPage(page).bookATour;
    await bookATour.datePicker.first().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    scenarioContext.afw3951SchedulePage = bookATour;
  },
);

Given(
  /^The AFW-3951 See You Soon Thank You page is reached with Rudderstack capture$/,
  async ({ page, scenarioContext, $testInfo }) => {
    $testInfo.setTimeout(Math.max($testInfo.timeout, TIMEOUTS.EXTRA_LONG));
    scenarioContext.afw3951SchedulePage = await trackingPage(page).completeBookVisitToThankYou(
      BUTTON_CLICKED_THANK_YOU_CLUB_ID,
    );
  },
);

When(/^The user clicks the Anytime Fitness navbar logo on AFW-3951 home$/, async ({ page, scenarioContext }) => {
  scenarioContext.afw3951BaselineCount = countButtonClickedEvents(getRequests(scenarioContext));
  await trackingPage(page).clickTrackedControl(trackingPage(page).navbarLogo());
});

When(
  /^The user clicks the blogs navbar menu item on AFW-3951 training$/,
  async ({ page, scenarioContext }) => {
    const pom = trackingPage(page);
    scenarioContext.afw3951BaselineCount = countButtonClickedEvents(getRequests(scenarioContext));
    scenarioContext.afw3951Inventory = await pom.clickTrackedControl(
      pom.navbarLinkByLabel(/^blogs$/i),
    );
  },
);

When(/^The user clicks the TRY US FREE navbar CTA on AFW-3951 home$/, async ({ page, scenarioContext }) => {
  scenarioContext.afw3951BaselineCount = countButtonClickedEvents(getRequests(scenarioContext));
  await trackingPage(page).clickTrackedControl(trackingPage(page).navbarTryUsFreeCta());
});

When(/^The user clicks the AF logo on the logo-only AFW-3951 navbar$/, async ({ page, scenarioContext }) => {
  scenarioContext.afw3951BaselineCount = countButtonClickedEvents(getRequests(scenarioContext));
  await trackingPage(page).clickTrackedControl(trackingPage(page).navbarLogo());
});

When(/^The user clicks each visible LLP navbar link on AFW-3951$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const links = pom.llpNavbarLinks();
  await pom.clickEachVisible(links, async item => {
    const baseline = countButtonClickedEvents(getRequests(scenarioContext));
    const inventory = await pom.clickTrackedControl(item);
    await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
      locationId: BUTTON_CLICKED_TEST_CLUB_ID,
      surface: 'webflow',
    });
  });
});

When(/^The user clicks the LLP navbar CTA on AFW-3951$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  const inventory = await pom.clickTrackedControl(pom.llpNavbarCta());
  await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
    locationId: BUTTON_CLICKED_TEST_CLUB_ID,
    surface: 'webflow',
  });
});

When(/^The user clicks each core page pill button on AFW-3951 "(.*)"$/, async ({ page, scenarioContext }, surface: string) => {
  const pom = trackingPage(page);
  const pills = pom.corePagePillButtons();
  await pom.clickEachVisible(pills, async item => {
    const baseline = countButtonClickedEvents(getRequests(scenarioContext));
    const inventory = await pom.clickTrackedControl(item);
    await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
      locationId: null,
      surface: surface.toLowerCase().includes('training') ? 'webflow' : 'webflow',
    });
  });
});

When(/^The user clicks each LLP CTA pill button on AFW-3951$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  await pom.clickEachVisible(pom.llpCtaPillButtons(), async item => {
    const baseline = countButtonClickedEvents(getRequests(scenarioContext));
    await pom.clickTrackedControl(item);
    await waitForButtonClickedAfterClick(getRequests(scenarioContext), baseline);
    const baselineRepeat = countButtonClickedEvents(getRequests(scenarioContext));
    await pom.clickTrackedControl(item);
    await waitForButtonClickedAfterClick(getRequests(scenarioContext), baselineRepeat);
    const latest = filterButtonClickedEvents(getRequests(scenarioContext)).pop()!;
    assertButtonClickedPayload(latest, {
      locationId: BUTTON_CLICKED_TEST_CLUB_ID,
      requireStatus200: true,
      forbidPropertiesChannel: true,
    });
  });
});

When(/^The user clicks each LLP hero banner link on AFW-3951$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  await pom.clickEachVisible(pom.llpHeroBannerLinks(), async item => {
    const baseline = countButtonClickedEvents(getRequests(scenarioContext));
    const inventory = await pom.clickTrackedControl(item);
    await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
      locationId: BUTTON_CLICKED_TEST_CLUB_ID,
    });
  });
});

When(/^The user clicks EXPLORE MEMBERSHIPS on the AFW-3951 LLP hero$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  await pom.clickTrackedControl(pom.llpExploreMembershipsLink());
  await assertClickedPayload(getRequests(scenarioContext), baseline, {
    elementId: 'llp-explore-membership',
    placement: 'non-empty',
    text: 'non-empty',
    locationId: BUTTON_CLICKED_TEST_CLUB_ID,
  });
});

When(/^The user clicks each LLP pre-footer link on AFW-3951$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  await pom.clickEachVisible(pom.llpPreFooterLinks(), async item => {
    const baseline = countButtonClickedEvents(getRequests(scenarioContext));
    const inventory = await pom.clickTrackedControl(item);
    await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
      locationId: BUTTON_CLICKED_TEST_CLUB_ID,
    });
  });
});

When(/^The user clicks TRY US FREE in the AFW-3951 LLP AF\+ section$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  await pom.clickTrackedControl(pom.llpAppleFitnessTryUsFree());
  await assertClickedPayload(getRequests(scenarioContext), baseline, {
    elementId: 'llp-apple-fitness-offer',
    placement: 'non-empty',
    text: 'non-empty',
    locationId: BUTTON_CLICKED_TEST_CLUB_ID,
  });
});

When(/^The user opens the SELECT COUNTRY dropdown on AFW-3951 locations search$/, async ({ page, scenarioContext }) => {
  const control = await trackingPage(page).countryDropdownControl();
  scenarioContext.afw3951BaselineCount = countButtonClickedEvents(getRequests(scenarioContext));
  await control.click();
  await assertButtonClickedDidNotFireSince(getRequests(scenarioContext), scenarioContext.afw3951BaselineCount);
});

When(/^The user selects a country option on AFW-3951 locations search$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const options = await pom.countryDropdownOptions();
  const option = options.filter({ hasText: /.+/ }).first();
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  const inventory = await pom.clickTrackedControl(option);
  await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
    locationId: null,
    surface: 'react',
  });
});

When(/^The user clicks Use my precise location on AFW-3951 locations search$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  const inventory = await pom.clickTrackedControl(await pom.preciseLocationControl());
  await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
    locationId: null,
    surface: 'react',
  });
});

When(/^The user runs a location search until map results render on AFW-3951$/, async ({ page }) => {
  await trackingPage(page).searchLocationsUntilResults();
});

When(/^The user clicks a map pin CTA on AFW-3951 locations search$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  const inventory = await pom.clickTrackedControl(await pom.mapPinCta());
  await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
    locationId: 'non-empty',
    surface: 'react',
  });
});

When(/^The user clicks the Join Card CTA on AFW-3951 locations search$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  const inventory = await pom.clickTrackedControl(pom.joinCardCta());
  await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
    locationId: 'non-empty',
    surface: 'react',
  });
});

When(/^The user clicks both pill CTAs on AFW-3951 locations results$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const pills = pom.locationsResultPillCtas();
  const count = Math.min(await pills.count(), 2);
  for (let i = 0; i < count; i++) {
    const baseline = countButtonClickedEvents(getRequests(scenarioContext));
    const inventory = await pom.clickTrackedControl(pills.nth(i));
    await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
      locationId: 'non-empty',
      surface: 'react',
    });
  }
});

When(/^The user clicks the edit location button on the AFW-3951 lead form$/, async ({ page, scenarioContext }) => {
  const userForm = scenarioContext.afw3951UserForm!;
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  const inventory = await trackingPage(page).clickTrackedControl(userForm.changeLocationButton);
  await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
    locationId: BUTTON_CLICKED_TEST_CLUB_ID,
    surface: 'react',
  });
});

When(/^The user clicks the visit LLP control on the AFW-3951 local offer flow$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const userForm = scenarioContext.afw3951UserForm!;
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  const inventory = await pom.clickTrackedControl(pom.visitLlpControl(userForm));
  await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
    locationId: BUTTON_CLICKED_TEST_CLUB_ID,
    surface: 'react',
  });
});

When(/^The user clicks the Join Now Card pill on the AFW-3951 local offer flow$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  const userForm = scenarioContext.afw3951UserForm!;
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  const inventory = await pom.clickTrackedControl(pom.joinNowCardPill(userForm));
  await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
    locationId: BUTTON_CLICKED_TEST_CLUB_ID,
    surface: 'react',
  });
});

When(/^The user clicks the Join Now Card pill on the AFW-3951 group offer flow$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  scenarioContext.afw3951UserForm = await pom.openGroupOfferWithClub(BUTTON_CLICKED_TEST_CLUB_ID);
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  const inventory = await pom.clickTrackedControl(pom.joinNowCardPill(scenarioContext.afw3951UserForm));
  await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
    locationId: BUTTON_CLICKED_TEST_CLUB_ID,
    surface: 'react',
  });
});

When(/^The user clicks the Join Now Card pill on the AFW-3951 member offer flow$/, async ({ page, scenarioContext }) => {
  const pom = trackingPage(page);
  scenarioContext.afw3951UserForm = await pom.openMemberOfferWithClub(BUTTON_CLICKED_TEST_CLUB_ID);
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  const inventory = await pom.clickTrackedControl(pom.joinNowCardPill(scenarioContext.afw3951UserForm));
  await assertClickedPayload(getRequests(scenarioContext), baseline, inventory, {
    locationId: BUTTON_CLICKED_TEST_CLUB_ID,
    surface: 'react',
  });
});

When(/^The user selects the first date button on the AFW-3951 schedule picker$/, async ({ scenarioContext }) => {
  const bookATour = scenarioContext.afw3951SchedulePage!;
  scenarioContext.afw3951BaselineCount = countButtonClickedEvents(getRequests(scenarioContext));
  const dates = await bookATour.getAllAvailableDates();
  expect(dates.length).toBeGreaterThan(0);
  scenarioContext.afw3951FirstDate = dates[0];
  await bookATour.selectDate(dates[0]);
});

When(/^The user selects a different date button on the AFW-3951 schedule picker$/, async ({ scenarioContext }) => {
  const bookATour = scenarioContext.afw3951SchedulePage!;
  const dates = await bookATour.getAllAvailableDates();
  const alternate = dates.find(d => d !== scenarioContext.afw3951FirstDate) ?? dates[1] ?? dates[0];
  await bookATour.selectDate(alternate);
});

When(/^The user selects the first time button on the AFW-3951 schedule picker$/, async ({ scenarioContext }) => {
  const bookATour = scenarioContext.afw3951SchedulePage!;
  scenarioContext.afw3951TimeBaselineCount = countButtonClickedEvents(getRequests(scenarioContext));
  const times = await bookATour.getAllAvailableTimes();
  expect(times.length).toBeGreaterThan(0);
  scenarioContext.afw3951FirstTime = times[0];
  await bookATour.selectTime(times[0]);
});

When(/^The user selects a different time button on the AFW-3951 schedule picker$/, async ({ scenarioContext }) => {
  const bookATour = scenarioContext.afw3951SchedulePage!;
  const times = await bookATour.getAllAvailableTimes();
  const alternate = times.find(t => t !== scenarioContext.afw3951FirstTime) ?? times[1] ?? times[0];
  await bookATour.selectTime(alternate);
});

When(/^The user opens Add to Calendar on the AFW-3951 Thank You page$/, async ({ scenarioContext }) => {
  const bookATour = scenarioContext.afw3951SchedulePage!;
  scenarioContext.afw3951CalendarBaseline = countButtonClickedEvents(getRequests(scenarioContext));
  await bookATour.clickAddToCalendarButton();
  await assertButtonClickedDidNotFireSince(
    getRequests(scenarioContext),
    scenarioContext.afw3951CalendarBaseline,
  );
});

When(
  /^The user selects the "(google|apple|outlook)" Add to Calendar option on AFW-3951$/,
  async ({ scenarioContext }, provider: string) => {
    const bookATour = scenarioContext.afw3951SchedulePage!;
    const baseline = countButtonClickedEvents(getRequests(scenarioContext));
    const option =
      provider === 'google'
        ? bookATour.addToCalendarGoogleBtn
        : provider === 'apple'
          ? bookATour.addToCalendarAppleBtn
          : bookATour.addToCalendarOutlookBtn;
    await option.click({ timeout: TIMEOUTS.MEDIUM });
    const matched = await waitForButtonClickedAfterClick(getRequests(scenarioContext), baseline);
    const reference = scenarioContext.buttonClickedCalendarReference;
    assertButtonClickedPayload(matched, {
      elementId: reference?.elementId ?? 'non-empty',
      placement: reference?.placement ?? 'non-empty',
      text: provider,
      locationId: BUTTON_CLICKED_THANK_YOU_CLUB_ID,
      requireStatus200: true,
      forbidPropertiesChannel: true,
    });
    if (!reference) {
      storeCalendarReferencePayload(scenarioContext, matched);
    } else {
      expect(matched.postDataJSON?.properties?.element_id).toBe(reference.elementId);
      expect(matched.postDataJSON?.properties?.placement).toBe(reference.placement);
    }
  },
);

When(/^The user clicks Send Trial Pass on the AFW-3951 Thank You page$/, async ({ scenarioContext }) => {
  const bookATour = scenarioContext.afw3951SchedulePage!;
  const baseline = countButtonClickedEvents(getRequests(scenarioContext));
  await bookATour.clickSendTrialPass();
  await waitForButtonClickedAfterClick(getRequests(scenarioContext), baseline);
});

When(/^The user clicks each other button on the AFW-3951 See You Soon Thank You page$/, async ({ scenarioContext }) => {
  const bookATour = scenarioContext.afw3951SchedulePage!;
  const buttons = bookATour.iframe.getByRole('button').filter({
    hasNotText: /ADD TO CALENDAR|SEND TRIAL PASS/i,
  });
  const count = Math.min(await buttons.count(), 6);
  for (let i = 0; i < count; i++) {
    const button = buttons.nth(i);
    if (!(await button.isVisible().catch(() => false))) continue;
    const baseline = countButtonClickedEvents(getRequests(scenarioContext));
    await button.click({ timeout: TIMEOUTS.SHORT }).catch(() => {});
    await waitForButtonClickedAfterClick(getRequests(scenarioContext), baseline);
    const latest = filterButtonClickedEvents(getRequests(scenarioContext)).pop()!;
    assertButtonClickedPayload(latest, {
      locationId: BUTTON_CLICKED_THANK_YOU_CLUB_ID,
      requireStatus200: true,
      forbidPropertiesChannel: true,
    });
  }
});

Then(/^The AFW-3951 navbar logo Button Clicked event is verified on home$/, async ({ scenarioContext }) => {
  const matched = await waitForButtonClickedAfterClick(
    getRequests(scenarioContext),
    scenarioContext.afw3951BaselineCount ?? 0,
  );
  assertButtonClickedPayload(matched, {
    elementId: 'non-empty',
    placement: 'non-empty',
    text: 'non-empty',
    locationId: null,
    surface: 'webflow',
    requireStatus200: true,
    forbidPropertiesChannel: true,
  });
});

Then(/^The AFW-3951 blogs navbar Button Clicked event is verified on training$/, async ({ scenarioContext }) => {
  const inventory = scenarioContext.afw3951Inventory as ButtonClickedInventory;
  await assertClickedPayload(
    getRequests(scenarioContext),
    scenarioContext.afw3951BaselineCount ?? 0,
    {
      ...inventory,
      placement: 'navbar',
      locationId: null,
    },
    { surface: 'webflow' },
  );
  expect(filterButtonClickedEvents(getRequests(scenarioContext)).length).toBe(
    (scenarioContext.afw3951BaselineCount ?? 0) + 1,
  );
});

Then(/^The AFW-3951 TRY US FREE navbar CTA Button Clicked event is verified$/, async ({ scenarioContext }) => {
  const matched = await waitForButtonClickedAfterClick(
    getRequests(scenarioContext),
    scenarioContext.afw3951BaselineCount ?? 0,
  );
  assertButtonClickedPayload(matched, {
    elementId: 'navbar-try-us-free',
    placement: 'navbar',
    text: 'TRY US FREE',
    locationId: null,
    surface: 'webflow',
    requireStatus200: true,
    forbidPropertiesChannel: true,
  });
});

Then(/^The AFW-3951 logo-only navbar Button Clicked event is verified$/, async ({ scenarioContext }) => {
  await waitForButtonClickedAfterClick(
    getRequests(scenarioContext),
    scenarioContext.afw3951BaselineCount ?? 0,
  );
});

Then(/^The AFW-3951 first schedule date Button Clicked event is verified$/, async ({ scenarioContext }) => {
  const matched = await waitForButtonClickedAfterClick(
    getRequests(scenarioContext),
    scenarioContext.afw3951BaselineCount ?? 0,
  );
  assertButtonClickedPayload(matched, {
    placement: 'non-empty',
    requireStatus200: true,
    forbidPropertiesChannel: true,
    surface: 'react',
  });
  expect(String(matched.postDataJSON?.properties?.placement ?? '')).not.toBe('');
});

Then(/^The AFW-3951 second schedule date does not fire Button Clicked again$/, async ({ scenarioContext }) => {
  await assertButtonClickedDidNotFireSince(
    getRequests(scenarioContext),
    (scenarioContext.afw3951BaselineCount ?? 0) + 1,
  );
});

Then(/^The AFW-3951 first schedule time Button Clicked event is verified$/, async ({ scenarioContext }) => {
  const matched = await waitForButtonClickedAfterClick(
    getRequests(scenarioContext),
    scenarioContext.afw3951TimeBaselineCount ?? 0,
  );
  assertButtonClickedPayload(matched, {
    placement: 'non-empty',
    requireStatus200: true,
    forbidPropertiesChannel: true,
    surface: 'react',
  });
});

Then(/^The AFW-3951 second schedule time does not fire Button Clicked again$/, async ({ scenarioContext }) => {
  await assertButtonClickedDidNotFireSince(
    getRequests(scenarioContext),
    (scenarioContext.afw3951TimeBaselineCount ?? 0) + 1,
  );
});

Then(
  /^The AFW-3951 payload consistency checks pass for "(webflow|react)" Button Clicked$/,
  async ({ scenarioContext }, surface: string) => {
    const events = filterButtonClickedEvents(getRequests(scenarioContext));
    expect(events.length, `${BUTTON_CLICKED_EVENT} events captured`).toBeGreaterThan(0);
    const latest = events[events.length - 1];
    assertButtonClickedPayload(latest, {
      surface: surface as 'webflow' | 'react',
      requireStatus200: true,
      forbidPropertiesChannel: true,
    });
  },
);
