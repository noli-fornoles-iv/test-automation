import { expect, Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { BookATourStandalonePage } from '@pages/modules/BookATourStandalonePage';
import { CancelMembershipPage } from '@pages/modules/CancelMembershipPage';
import { ContactUsPage } from '@pages/modules/ContactUsPage';
import { CorporateMembershipPage } from '@pages/modules/CorporateMembershipPage';
import { EventsPage } from '@pages/modules/EventsPage';
import { FindAGymPage } from '@pages/modules/FindAGymPage';
import { HsaFsaMembershipPage } from '@pages/modules/HsaFsaMembershipPage';
import { InviteAFriendPage } from '@pages/modules/InviteAFriendPage';
import { LocalOfferPage } from '@pages/modules/LocalOfferPage';
import { LocationSearchOnStaticPagesPage } from '@pages/modules/LocationSearchOnStaticPagesPage';
import { McoOfferPage } from '@pages/modules/McoOfferPage';
import { MemberOfferPage } from '@pages/modules/MemberOfferPage';
import { MembershipInquiryPage } from '@pages/modules/MembershipInquiryPage';
import { OneTrustPage } from '@pages/modules/OneTrustPage';
import { OwnAGymPage } from '@pages/modules/OwnAGymPage';
import { ReferralLandingPage } from '@pages/modules/ReferralLandingPage';
import { StaticPage } from '@pages/modules/StaticPage';
import { TryUsFreePage } from '@pages/modules/TryUsFreePage';
import {
  GymAddress,
  LocationsResponse,
  ReferralLookupResponse,
  SearchLocationsResponse,
  BookAppointmentRequest,
  ProspectRequest,
  ContactRequestPayload,
  CancelMembershipRequestPayload,
} from '@type/api.types';
import { Helpers, registerDisableCaptchaPersistence } from '@utils/helpers';
import { LeadEventData, PageDetails, RudderStackRequest } from '@utils/rudderstack';
import type { LocalOfferCmsFieldData } from '@utils/webflow/local-offer-cms';
import type { LocalOfferTicketExpected } from '@utils/webflow/local-offer-ticket-expected';
export type ScenarioContext = {
  selectedGymName?: string;
  selectedGymClubId?: string;
  selectedGymDisplayName?: string;
  leadCaptureId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  expectedGymAddress?: GymAddress;
  locationsResponseBody?: LocationsResponse;
  searchLocationsResponseBody?: SearchLocationsResponse;
  newTab?: Page;
  /** Events Join Online — join.anytimefitness page (same tab or popup). */
  joinOnlinePage?: Page;
  pageName: string;
  offerKey?: string;
  offerGymType?: string;
  memberOfferGtmFired?: boolean;
  referralCode?: string;
  staffId?: string;
  prospectId?: string;
  formData?: Record<string, string>;
  /** True when the invite referral landing page is unavailable (404 / CMS off). */
  inviteLandingUnavailable?: boolean;
  /** Optional phone override for lead-form submit (member vs non-member invite generation). */
  preferredPhone?: string;
  gymZipCode?: string;
  canBookAppointment?: boolean;
  scheduleBookingSkipped?: boolean;
  /**
   * True when BAT Select Gym redirected to `/membership-inquiry` because the Local Config
   * test gym has no ClubTour time availabilities. Soft-skip BAT schedule / form validations.
   */
  batRedirectedToMembershipInquiry?: boolean;
  /**
   * True when Local Resident / Why this matter(s) trigger is missing on the lead form
   * (e.g. EN-ZA Membership Inquiry SIT — POPIA disclaimer only). Soft-skip modal asserts.
   */
  localResidentModalUnavailable?: boolean;
  /**
   * True when an Events legal link (e.g. Terms) is absent from PH AFW-3705 disclaimer copy
   * that only exposes Privacy Policy. Soft-skip new-tab asserts for that link.
   */
  eventsLegalLinkSkipped?: boolean;
  /**
   * True when an MI legal link (Terms / SMS) is absent from PH AFW-3705 disclaimer copy
   * that only exposes Privacy Policy. Soft-skip new-tab asserts for that link.
   */
  membershipInquiryLegalLinkSkipped?: boolean;
  /**
   * True when a Try Us Free legal link (Terms / SMS) is absent from PH AFW-3705 disclaimer
   * copy that only exposes Privacy Policy. Soft-skip new-tab asserts for that link.
   */
  tryUsFreeLegalLinkSkipped?: boolean;
  /** True when invitee landing is unavailable (e.g. DE/AT SIT invite pages 404 / lookup never returns). */
  skipInviteLanding?: boolean;
  isThankYouPage?: boolean;
  isEmailShaFound?: boolean;
  referralUrl?: string;
  /** Main-frame URLs observed during an AFW-3876 redirect (no /find-gym hop checks). */
  redirectNavigationUrls?: string[];
  /**
   * AFW-3876 Local Offer → /locations soft-pass reason (Coverage Local Offer = NO,
   * or offer host 404 / no React iframe). Then step soft-passes instead of hard-fail.
   */
  afw3876LocalOfferRedirectSoftPass?: string;
  /** True when Mapbox/location search failed; Select Gym may recover via deep-link. */
  locationSearchFailed?: boolean;
  referralLandingResponse?: ReferralLookupResponse;
  leadCaptureSuccessful?: boolean;
  formSuccessVerifiedAtLeadCapture?: boolean;
  /** True when GTM/GA reported form_success during Local Offer lead submit (may be outside readable dataLayer). */
  formSuccessFired?: boolean;
  /** True when form_loaded was observed during MCO Offer lead-form interaction. */
  mcoFormLoadedObserved?: boolean;
  /** True when form_loaded was observed during BAT Standalone lead-form interaction. */
  formLoadedObserved?: boolean;
  tourAppointmentScheduledVerified?: boolean;
  rudderstackLeadEventsVerified?: boolean;
  rudderstackAppointmentScheduledVerified?: boolean;
  rudderstackLeadEventData?: LeadEventData;
  rudderstackPageDetails?: PageDetails;
  isCookieAccepted?: boolean;
  rudderstackTestEnable?: boolean;
  rudderstackCapturedRequests?: RudderStackRequest[];
  /** AFW-3951 — Button Clicked lead form for edit location / offer flows. */
  afw3951UserForm?: import('@pages/common/UserFormPage').UserFormPage;
  /** AFW-3951 — Book A Tour schedule / thank-you page for BAT flows. */
  afw3951SchedulePage?: import('@pages/common/BookATourPage').BookATourPage;
  afw3951BaselineCount?: number;
  afw3951Inventory?: import('@utils/tracking/button-clicked-rs-tracking').ButtonClickedInventory;
  afw3951FirstDate?: import('@playwright/test').Locator;
  afw3951FirstTime?: import('@playwright/test').Locator;
  afw3951TimeBaselineCount?: number;
  afw3951CalendarBaseline?: number;
  buttonClickedCalendarReference?: import('@utils/tracking/button-clicked-rs-tracking').ButtonClickedPayloadExpectations;
  bookAppointmentRequestBody?: BookAppointmentRequest;
  localOfferTicket?: string;
  localOfferCmsExpected?: LocalOfferTicketExpected;
  localOfferCmsData?: LocalOfferCmsFieldData;
  prospectRequestData?: ProspectRequest;
  /** AFW-3440: expected origin_source after CMS lead-source override + React normalize. */
  afw3440ExpectedOriginSource?: string;
  contactRequestBody?: ContactRequestPayload;
  cancelRequestBody?: CancelMembershipRequestPayload;
  /** Collected UI strings for @UntranslatedTextScan one-pass journeys. */
  untranslatedScanTexts?: import('@utils/localization').ExtractedFlowText[];
};

type TestFixtures = {
  scenarioContext: ScenarioContext;
  oneTrustPage: OneTrustPage;
  tryUsFreePage: TryUsFreePage;
  bookATourStandalonePage: BookATourStandalonePage;
  localOfferPage: LocalOfferPage;
  mcoOfferPage: McoOfferPage;
  memberOfferPage: MemberOfferPage;
  membershipInquiryPage: MembershipInquiryPage;
  hsaFsaMembershipPage: HsaFsaMembershipPage;
  eventsPage: EventsPage;
  contactUsPage: ContactUsPage;
  corporateMembershipPage: CorporateMembershipPage;
  findAGymPage: FindAGymPage;
  ownAGymPage: OwnAGymPage;
  inviteAFriendPage: InviteAFriendPage;
  referralLandingPage: ReferralLandingPage;
  staticPage: StaticPage;
  locationSearchOnStaticPagesPage: LocationSearchOnStaticPagesPage;
  cancelMembershipPage: CancelMembershipPage;
};

export const test = base.extend<TestFixtures>({
  oneTrustPage: async ({ page }, use) => {
    await use(new OneTrustPage(page));
  },
  tryUsFreePage: async ({ page }, use) => {
    await use(new TryUsFreePage(page));
  },
  bookATourStandalonePage: async ({ page }, use) => {
    await use(new BookATourStandalonePage(page));
  },
  localOfferPage: async ({ page }, use) => {
    await use(new LocalOfferPage(page));
  },
  mcoOfferPage: async ({ page }, use) => {
    await use(new McoOfferPage(page));
  },
  memberOfferPage: async ({ page }, use) => {
    await use(new MemberOfferPage(page));
  },
  membershipInquiryPage: async ({ page }, use) => {
    await use(new MembershipInquiryPage(page));
  },
  hsaFsaMembershipPage: async ({ page }, use) => {
    await use(new HsaFsaMembershipPage(page));
  },
  eventsPage: async ({ page, scenarioContext }, use) => {
    if (!scenarioContext.pageName) {
      throw new Error('Page name is not set in scenario context');
    }
    const iframeId = Helpers.getEventIframeId(scenarioContext.pageName);
    const expectedPagePath = Helpers.getEventPagePath(scenarioContext.pageName);
    await use(new EventsPage(page, iframeId, expectedPagePath));
  },
  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },
  corporateMembershipPage: async ({ page }, use) => {
    await use(new CorporateMembershipPage(page));
  },
  findAGymPage: async ({ page }, use) => {
    const pom = new FindAGymPage(page);
    await pom.ensureInCountryIpstackMock();
    await use(pom);
  },
  ownAGymPage: async ({ page }, use) => {
    await use(new OwnAGymPage(page));
  },
  inviteAFriendPage: async ({ page }, use) => {
    await use(new InviteAFriendPage(page));
  },
  referralLandingPage: async ({ page }, use) => {
    await use(new ReferralLandingPage(page));
  },
  staticPage: async ({ page }, use) => {
    await use(new StaticPage(page));
  },
  locationSearchOnStaticPagesPage: async ({ page }, use) => {
    const pom = new LocationSearchOnStaticPagesPage(page);
    await pom.installInLocaleIpstackMock();
    await use(pom);
  },
  cancelMembershipPage: async ({ page }, use) => {
    const pom = new CancelMembershipPage(page);
    await pom.installInLocaleIpstackMock();
    await use(pom);
  },
  // eslint-disable-next-line no-empty-pattern
  scenarioContext: async ({}, use) => {
    await use({ pageName: '' });
  },
  page: async ({ page }, use) => {
    await page.context().clearCookies();
    await registerDisableCaptchaPersistence(page);
    await use(page);
  },
});

export { expect };
