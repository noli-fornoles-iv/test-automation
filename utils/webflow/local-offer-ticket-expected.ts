/**
 * Expected Local Offer CMS values from Tickets → Testpad / JIRA (AF Automation Knowledge Base).
 * Source tickets: AFW-3198 / AFW-3213 / AFW-3215 / AFW-3989 (EN-CA), AFW-3210 (FR-CA),
 * AFW-3842–AFW-3847 (EN-PH).
 */
export type LocalOfferTicketExpected = {
  ticket: string;
  locale: string;
  offerKey: string;
  slug: string;
  name: string;
  displayOfferTitle: string;
  leadSourceCode: string;
  apiOfferTitle: string;
  apiWorkflowName: string;
  gymStatusRequirement: string;
  /** Omit / empty when live CMS Meta Title field is blank (host `<title>` may still be populated). */
  metaTitleIncludes?: string;
  /** Omit / empty when live CMS Meta Description is not localized yet (EN-CA offers leave it blank). */
  metaDescriptionIncludes?: string;
  openGraphTitleIncludes?: string;
  /** Optional — assert CMS h2-heading-override when the ticket specifies it. */
  h2HeadingOverrideIncludes?: string;
  bulletPoints: string[];
  /** Omit / empty when live CMS Terms (short) is not localized yet. */
  termsShortIncludes?: string;
  termsLongIncludes?: string;
  showJoinOnlineCard: boolean;
  siteIndexingOff: boolean;
};

export const LOCAL_OFFER_TICKET_EXPECTED: Record<string, LocalOfferTicketExpected> = {
  AFW_3198: {
    ticket: 'AFW-3198',
    locale: 'EN-CA',
    offerKey: 'free_training_session', // CMS slug: free-training-session
    slug: 'free-training-session',
    name: 'Free Training Session',
    displayOfferTitle: 'Free Training Session',
    leadSourceCode: 'Website-Local-TrainingSession',
    apiOfferTitle: 'Free Training Session',
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Open',
    metaTitleIncludes: 'Local Offer - Free Training Session',
    bulletPoints: [
      '24/7 access to 5,800+ locations',
      'Free fitness consultation',
      'Personal & group training',
    ],
    termsShortIncludes:
      'Offer available to local residents and new members only. Must be 18 years of age or older.',
    // EN-CA CMS: Terms (Long) is empty / not localized
    showJoinOnlineCard: true,
    siteIndexingOff: true,
  },
  AFW_3213: {
    ticket: 'AFW-3213',
    locale: 'EN-CA',
    offerKey: '21day_reboot', // CMS slug: 21day-reboot (ticket: 21 day reboot)
    slug: '21day-reboot',
    name: '21-Day Reboot',
    displayOfferTitle: '21-Day Reboot',
    leadSourceCode: 'Website-Local-21DayReboot',
    // Live CMS stores display title; Testpad also references slug in one row — accept CMS title.
    apiOfferTitle: '21-Day Reboot',
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Open',
    metaTitleIncludes: 'Local Offer - 21-Day Reboot',
    openGraphTitleIncludes: 'Local Offer - 21-Day Reboot',
    bulletPoints: [
      '24/7 access to 5,800+ locations',
      'Free fitness consultation',
      'Personal & group training',
    ],
    termsShortIncludes:
      'Offer available to local residents and new members only. Must be 18 years of age or older.',
    // EN-CA CMS: Terms (Long) is empty / not localized
    showJoinOnlineCard: true,
    siteIndexingOff: true,
  },
  AFW_3215: {
    ticket: 'AFW-3215',
    locale: 'EN-CA',
    offerKey: '6_week_challenge', // CMS slug: 6-week-challenge (ticket: 6-week challenge)
    slug: '6-week-challenge',
    name: '6-Week Challenge',
    displayOfferTitle: '6-Week Challenge',
    leadSourceCode: 'Website-Local-6WeekChallenge',
    apiOfferTitle: '6-Week Challenge',
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Open',
    metaTitleIncludes: 'Local Offer - 6-Week Challenge',
    openGraphTitleIncludes: 'Local Offer - 6-Week Challenge',
    bulletPoints: [
      '24/7 access to 5,800+ locations',
      'Free fitness consultation',
      'Personal & group training',
    ],
    termsShortIncludes:
      'Offer available to local residents and new members only. Must be 18 years of age or older.',
    // EN-CA CMS: Terms (Long) is empty / not localized
    showJoinOnlineCard: true,
    siteIndexingOff: true,
  },
  AFW_3210: {
    ticket: 'AFW-3210',
    locale: 'FR-CA',
    offerKey: 'free_training_experience_frca', // CMS slug: free-training-experience-frca
    slug: 'free-training-experience-frca',
    name: "Expérience d'entraînement gratuite",
    displayOfferTitle: "Expérience d'entraînement gratuite",
    leadSourceCode: 'Website-Local-ExperienceEntrainementGratuite',
    apiOfferTitle: "Expérience d'entraînement gratuite",
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Open',
    metaTitleIncludes: "Expérience d'entraînement gratuite",
    // Testpad AFW-3210 Meta Description (curly apostrophe normalized at assert time)
    metaDescriptionIncludes:
      "Essayez Anytime Fitness avec une expérience d'entraînement gratuite. Offre réservée aux nouveaux membres locaux.",
    openGraphTitleIncludes: "Expérience d'entraînement gratuite",
    // Live FR-CA CMS: Bullet Points Override empty (React iframe may still show defaults)
    bulletPoints: [],
    // Live FR-CA CMS: Terms (short) empty via API; host page may still render localized copy
    showJoinOnlineCard: false,
    siteIndexingOff: true,
  },
  /** AFW-3989 — Canada national Join for $1 Fall Membership (Local Offer). Tickets locale: EN-CA. */
  AFW_3989: {
    ticket: 'AFW-3989',
    locale: 'EN-CA',
    offerKey: 'join_1_dollar_fall_membership',
    slug: 'join-1-dollar-fall-membership',
    name: 'Join for $1 Fall Membership',
    displayOfferTitle: 'FALL MEMBERSHIP OFFER',
    leadSourceCode: 'Website-Local-JoinFor1DollarFallMembership',
    apiOfferTitle: '$0 Enrolment',
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Pre-sale + Open',
    // Live CMS Meta Title / OG Title fields blank; published host title still shows Local Offer - Join for $1 Fall Membership
    h2HeadingOverrideIncludes: 'Join for $1. Find Your Community.',
    bulletPoints: [
      '24/7 access to 6,000+ locations',
      'Free fitness consultation',
      'Personal & group training',
    ],
    termsShortIncludes:
      'New customers only. Limited to local residents only. Valid ID required. Valid at participating locations only.',
    showJoinOnlineCard: true,
    siteIndexingOff: true,
  },
  /** AFW-3842 — PH Student Membership. Tickets locale: PH → EN-PH. */
  AFW_3842: {
    ticket: 'AFW-3842',
    locale: 'EN-PH',
    offerKey: 'student_membership',
    slug: 'student-membership',
    name: 'Student Membership',
    displayOfferTitle: 'Student Membership',
    leadSourceCode: 'Website-Local-StudentMembership',
    apiOfferTitle: 'Student Membership',
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Pre-sale + Open',
    // Live CMS Meta Title blank (host <title> still populated) — same pattern as AFW-3989
    metaDescriptionIncludes:
      'Get exclusive student membership rates at Anytime Fitness. Enjoy 24/7 access to thousands of clubs worldwide. Present your valid student ID and join today!',
    h2HeadingOverrideIncludes: 'Exclusive Membership for Students',
    bulletPoints: [
      'Special membership rates for eligible full-time students',
      'Train 24/7 at Anytime Fitness',
      'Access hundreds of Anytime Fitness clubs nationwide and thousands worldwide',
      'Join a supportive community while balancing school and fitness',
    ],
    termsShortIncludes:
      'Available to full-time students only, up to a maximum age of 25 years at the time of sign-up or renewal',
    showJoinOnlineCard: true,
    siteIndexingOff: true,
  },
  /** AFW-3843 — PH Senior Citizen Membership. */
  AFW_3843: {
    ticket: 'AFW-3843',
    locale: 'EN-PH',
    offerKey: 'senior_citizen_membership',
    slug: 'senior-citizen-membership',
    name: 'Senior Citizen Membership',
    displayOfferTitle: 'Senior Citizen Membership',
    leadSourceCode: 'Website-Local-SeniorCitizenMembership',
    apiOfferTitle: 'Senior Citizen Membership',
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Pre-sale + Open',
    metaDescriptionIncludes:
      'Enjoy government-mandated senior rates at Anytime Fitness. Get 24/7 access in a supportive space. Present your Senior Citizen ID and join today!',
    // Live CMS Open Graph Title blank
    bulletPoints: [
      'Government-mandated senior membership rate',
      '24/7 access to Anytime Fitness clubs',
      'Train at your own pace in a supportive environment',
      'Improve strength, mobility and overall wellbeing',
    ],
    termsShortIncludes:
      'Available to eligible senior citizens upon presentation of a valid Senior Citizen ID',
    showJoinOnlineCard: true,
    siteIndexingOff: true,
  },
  /** AFW-3844 — PH PWD Membership. */
  AFW_3844: {
    ticket: 'AFW-3844',
    locale: 'EN-PH',
    offerKey: 'pwd_membership',
    slug: 'pwd-membership',
    name: 'PWD Membership',
    displayOfferTitle: 'PWD Membership',
    leadSourceCode: 'Website-Local-PWDMembership',
    apiOfferTitle: 'PWD Membership',
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Pre-sale + Open',
    metaDescriptionIncludes:
      'Enjoy government-mandated PWD rates at Anytime Fitness. Get 24/7 access in an inclusive environment. Present your valid PWD ID and join today!',
    h2HeadingOverrideIncludes: 'Fitness for Every Body',
    bulletPoints: [
      'Government-mandated PWD membership rate',
      '24/7 gym access',
      'Inclusive fitness environment',
      'Support your health with regular exercise',
    ],
    termsShortIncludes:
      'Available to persons with disabilities upon presentation of a valid PWD ID',
    showJoinOnlineCard: true,
    siteIndexingOff: true,
  },
  /** AFW-3845 — PH Pre-Sale Membership (presale gyms only). */
  AFW_3845: {
    ticket: 'AFW-3845',
    locale: 'EN-PH',
    offerKey: 'pre_sale_membership',
    slug: 'pre-sale-membership',
    name: 'Pre-Sale Membership',
    displayOfferTitle: 'Pre-Sale Membership',
    leadSourceCode: 'Website-Local-PreSaleMembership',
    apiOfferTitle: 'Pre-Sale Membership',
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Pre-sale',
    metaDescriptionIncludes:
      'Lock in exclusive pre-sale rates before our new club opens! Secure your Anytime Fitness membership early',
    h2HeadingOverrideIncludes: 'Join Early. Start Strong',
    bulletPoints: [
      'Exclusive rates during pre-sale',
      'Reserve your membership before opening',
      'Secure your place in the community',
      'Limited availability',
    ],
    termsShortIncludes: 'Available only during approved pre-sale periods',
    showJoinOnlineCard: true,
    siteIndexingOff: true,
  },
  /** AFW-3846 — PH Refresh Membership. */
  AFW_3846: {
    ticket: 'AFW-3846',
    locale: 'EN-PH',
    offerKey: 'refresh_membership',
    slug: 'refresh-membership',
    name: 'Refresh Membership',
    displayOfferTitle: 'Refresh Membership',
    leadSourceCode: 'Website-Local-RefreshMembership',
    apiOfferTitle: 'Refresh Membership',
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Pre-sale + Open',
    metaDescriptionIncludes:
      'Experience upgraded facilities with exclusive Refresh Membership rates at Anytime Fitness! Enjoy 24/7 access',
    h2HeadingOverrideIncludes: 'Celebrate Our Refreshed Club',
    bulletPoints: [
      'Exclusive refresh membership rates',
      'Upgraded facilities and equipment',
      '24/7 access',
      'Limited-time offer',
    ],
    termsShortIncludes: 'Available only during approved Refresh campaigns',
    showJoinOnlineCard: true,
    siteIndexingOff: true,
  },
  /** AFW-3847 — PH Welcome Pack. */
  AFW_3847: {
    ticket: 'AFW-3847',
    locale: 'EN-PH',
    offerKey: 'welcome_pack',
    slug: 'welcome-pack',
    name: 'Welcome Pack',
    displayOfferTitle: 'Welcome Pack',
    leadSourceCode: 'Website-Local-WelcomePack',
    apiOfferTitle: 'Welcome Pack',
    apiWorkflowName: 'local-offer-unified',
    gymStatusRequirement: 'Pre-sale + Open',
    metaDescriptionIncludes:
      'Kick-start your fitness journey with an Anytime Fitness Welcome Pack! Get exclusive perks like PT sessions, fitness assessments, and merch. Join today!',
    h2HeadingOverrideIncludes: 'Kick-Start Your Fitness Journey',
    bulletPoints: [
      'Receive exclusive welcome benefits when you join',
      'May include Fitness Assessment, Personal Training Session, or Anytime Fitness merchandise',
      'Designed to help you kick-start your fitness journey',
      'Available for a limited time at participating clubs',
    ],
    termsShortIncludes:
      'Available at participating Anytime Fitness clubs for a limited time. Welcome Pack contents may vary by club',
    showJoinOnlineCard: true,
    siteIndexingOff: true,
  },
};

export function getLocalOfferTicketExpected(ticket: string): LocalOfferTicketExpected {
  const key = ticket.trim().toUpperCase().replace(/-/g, '_');
  const expected = LOCAL_OFFER_TICKET_EXPECTED[key];
  if (!expected) {
    throw new Error(`No Testpad CMS expected data for ticket "${ticket}"`);
  }
  return expected;
}
