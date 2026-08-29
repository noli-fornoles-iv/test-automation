const isCI = !!process.env.CI;

export const TIMEOUTS: {
  SHORT: number;
  MEDIUM: number;
  LONG: number;
  EXTRA_LONG: number;
} = {
  SHORT: isCI ? 20000 : 15000,
  MEDIUM: isCI ? 40000 : 30000,
  LONG: isCI ? 180000 : 120000,
  // Mobile E2E flows (location search + form + schedule picker) can exceed 6 min locally and in CI.
  EXTRA_LONG: 600000,
};

export const PATHS = {
  BOOK_TOUR_STANDALONE: '/schedule-an-appointment-online',
  TRY_US_FREE: '/try-us-free',
  FIND_GYM: '/find-gym',
  APPLE_FITNESS_FREE_TRIAL_OFFER: '/apple-fitness-offer',
  LOCAL_GYM: (locationId: string) => `/locations/${locationId}`,
  APPLE_FITNESS_PLUS_SUBSCRIBER: '/apple-fitness-plus-subscriber',
  MEMBERSHIP_INQUIRY: '/membership-inquiry',
  HSA_FSA: '/resources/hsa-and-fsa-for-gym-membership',
  EVENTS_FREE_TRIAL_PASS: '/events/free-trial',
  EVENTS_TRAIN_FOR_YOUR_LIFE: '/events/train-for-your-life',
  EVENTS_JOIN_ONLINE: '/events/join-online',
  EVENTS_PROMO: '/events/promo',
  EVENTS_FIND_YOUR_FITPHORIA: '/events/find-your-fitphoria',
  EVENTS_BOOK_A_TOUR: '/events/book-a-tour',
  CONTACT_US: '/email-club',
  CANCEL_MEMBERSHIP: '/cancel-membership',
  CORPORATE_MEMBERSHIP: '/corporate-membership',
  CORPORATE_MEMBERSHIP_THANK_YOU: '/corporate-membership/thank-you',
  OWN_A_GYM: '/own-a-gym',
  INVITE_FRIEND: '/invite-friend',
  HOME: '/',
  TRAINING: '/training',
  FITNESS_CONSULTATION: '/training/fitness-consultation',
  GROUP_TRAINING: '/training/group-training',
  PERSONAL_TRAINING: '/training/personal-training',

  // Why Join
  WHY_JOIN: '/membership',

  // Blog Related Pages
  BLOG: '/blog',
  BLOG_CATEGORY_WORKOUTS: '/blog-categories/workouts',
  BLOG_ARTICLE_BEGINNER_WORKOUT: '/blog/beginner-workout-routine',

  // Legal Pages
  PRIVACY_POLICY: '/privacy',
  TERMS_CONDITIONS: '/terms-of-use',
  TEXT_MESSAGING_TERMS: '/text-messaging-terms',
  DMCA: '/dmca',
  OFFER_TERMS: '/offer-terms',

  // Other Pages
  PREFERRED_VENDORS: '/preferred-vendors',
  EMPLOYEE_WELLNESS: '/employee-wellness',
  CAREERS: '/employment',
  LOCATIONS: '/locations',
  FAQS: '/faqs',
  CONTACT: '/contact',
  APPS: '/apps',
  SITEMAP: '/sitemap',

  // Local Gym Pages
  LOCAL_GYM_PAGE: '/locations/woodbury-minnesota-9993999',
} as const;

export const API_PATHS = {
  LOCATIONS_REQUEST: '/api/locations',
  SEARCH_LOCATIONS_REQUEST: '/api/search-locations',
  CLUB_PROFILE_REQUEST: '/api/clubs',
  PROSPECTS_REQUEST: '/api/lead-capture',
  CONFIRM_APPOINTMENT_REQUEST: '/api/bookings',
  SCHEDULING_AVAILABILITIES_REQUEST: () => `/api/bookings/availabilities`,
  REFERRALS_REQUEST: '/api/leads/referrals',
  CLUB_BY_ID_REQUEST: (clubId: string | number) => `/api/locations/${clubId}`,
  CONTACT_REQUEST: '/api/communications',
  INQUIRIES_REQUEST: '/api/investors/inquiries/',
} as const;

export const GTM_EVENT = {
  FORM_SUCCESS: 'form_success',
  TOUR_APPOINTMENT_SCHEDULED: 'tour_appointment_scheduled',
  FORM_LOADED: 'form_loaded',
  CORPORATE_MEMBERSHIP_LEAD: 'corporate_membership_lead',
} as const;

/** Webflow CMS — Anytime Fitness site + Local Offer Pages collection */
export const WEBFLOW_SITE_ID = '66aa8fe9dc4db68f448a978f';
/** Visible on Local Offer pages as data-wf-collection */
export const WEBFLOW_LOCAL_OFFER_COLLECTION_ID = '67c07b5c4eb7a58de23e37fb';

/**
 * Webflow CMS locale IDs (`cmsLocaleId`) for List Items filtering.
 * Pass as `?cmsLocaleId=` — omitting it defaults to the site primary locale (en-US).
 * Source: GET /v2/sites/{siteId} → locales.primary / locales.secondary
 */
export const WEBFLOW_CMS_LOCALE_IDS: Record<string, string> = {
  'EN-US': '66c501d753ae2a8c705375b4',
  'EN-AU': '685bb3f7d2a7f5e02510ed6a',
  'EN-AE': '68d3c9b89f6d98716d807d94',
  'AR-SA': '690097ed12a9ffeab77c3b8c',
  'EN-ZA': '6984a7aa47beb52670aa1f20',
  'EN-GB': '698b2b79751e9500e1b03baf',
  'EN-IE': '699444243198f251ac37219a',
  'EN-IN': '69d659899f0f433bd6564332',
  'EN-CA': '6a1009bdd363ef861ca647dd',
  'FR-CA': '6a1051b70b4d4d84326a0021',
  'DE-DE': '6a1942f68e89f3b118de93be',
  'DE-AT': '6a200e88457d8b75367b1700',
  'IT-IT': '6a22b8de0850ca722351747a',
  'EN-NZ': '6a4227b5de9e05215480fe82',
  'EN-PH': '6a4cfe41bf16c00f38cd6655',
  'EN-SG': '6a5107a14adbb5f62c006433',
  'EN-ID': '6a54f0579b172653ced30ca3',
  'TH-TH': '6a55d7d895307bdacbc4098a',
  'AR-KW': '69d57dbe252e2bd47991c0e5',
};

export const LOCAL_OFFER_ROUTES = {
  OPEN: {
    join_get_30_days_free: '/offer/local/30-days-free',
    free_training_session: '/offer/local/training-session',
    fifty_dollars_off_training: '/offer/local/50-off-training',
    seven_day_group_training_pass: '/offer/local/7-day-group-training-pass',
    join_get_rest_of_year_free: '/offer/local/join-get-rest-year-free',
    free_7_day_pass: '/offer/local/free-7-day-pass',
    twenty_one_day_reboot: '/offer/local/21-day-reboot',
    free_month_training: '/offer/local/1-month-training',
    join_get_summer_free: '/offer/local/join-get-summer-free',
    six_week_challenge: '/offer/local/6-week-challenge',
    free_training_experience: '/offer/local/free-training-experience',
    join_for_1_dollar: '/offer/local/join-for-1-dollar',
    join_for_1_dollar_transformation_challenge:
      '/offer/local/join-get-transformation-challenge-free',
    five_day_free_trial: '/offer/local/5-day-free-trial',
    seven_day_free_trial: '/offer/local/7-day-free-trial',
    three_day_free_trial: '/offer/local/3-day-free-trial',
    dollar_349_club_voucher: '/offer/local/349-club-voucher',
    six_for_six_weeks: '/offer/local/6-for-6-weeks',
    buddy_bundle: '/offer/local/buddy-bundle',
    four_weeks_free: '/offer/local/4-weeks-free',
    open_week: '/offer/local/open-week',
    two_months_free: '/offer/local/2-months-free',
    foundation_membership: '/offer/local/foundation-membership',
    one_day_pass: '/offer/local/1-day-pass',
    join_get_40_offer: '/offer/local/join-get-40-offer',
    fourteen_day_pass: '/offer/local/14-day-pass',
    /** SG — AFW-3440 / UAT matrix (welcome-pack) */
    welcome_pack: '/offer/local/welcome-pack',
    /** IN — Available on Prod */
    festive_fitness_deals: '/offer/local/festive-fitness-deals',
    anniversary_special_offers: '/offer/local/anniversary-special-offers',
    exclusive_recovery_experience: '/offer/local/exclusive-recovery-experience',
    complimentary_body_composition_analysis: '/offer/local/complimentary-body-composition-analysis',
    free_expert_fitness_consultation: '/offer/local/free-expert-fitness-consultation',
    refer_earn_rewards: '/offer/local/refer-earn-rewards',
    /** ZA — Available on Prod */
    refer_new_member_get_a_month_free: '/offer/local/refer-new-member-get-a-month-free',
    get_started_for_r199: '/offer/local/get-started-for-r199',
    /** DE — Available on Prod (sheet tab DE / gid=1124409558) */
    coaching_normal: '/offer/local/coaching-normal',
    coaching_plus: '/offer/local/coaching-plus',
    coaching_special: '/offer/local/coaching-special',
    coaching_advanced: '/offer/local/coaching-advanced',
    early_bird: '/offer/local/early-bird',
    basic: '/offer/local/basic',
    /** IT — Available on Prod (sheet tab IT) */
    join_now_at_the_best_price_ever: '/offer/local/join-now-at-the-best-price-ever',
    join_for_1_euro_next_month_is_free: '/offer/local/join-for-1-euro-next-month-is-free',
    pro_rated_free_month: '/offer/local/pro-rated-free-month',
    join_for_1_get_the_rest_of_the_year_free:
      '/offer/local/join-for-1-get-the-rest-of-the-year-free',
    join_for_1_and_starter_pack_included: '/offer/local/join-for-1-and-starter-pack-included',
    prorated_promotion: '/offer/local/prorated-promotion',
    /** IE — Available on Prod */
    four_weeks_for_eu4: '/offer/local/4-weeks-for-eu4',
    /** GB — Available on Prod */
    first_month_free_for_you_and_a_friend: '/offer/local/first-month-free-for-you-and-a-friend',
    seven_day_trial: '/offer/local/7-day-trial',
    one_day_free_trial: '/offer/local/1-day-free-trial',
    one_month_free: '/offer/local/1-month-free',
    /** AT — Available on Prod */
    happy_without_commitment: '/offer/local/happy-without-commitment',
    refer_a_friend_both_1_month_free: '/offer/local/refer-a-friend-both-1-month-free',
    free_care_package: '/offer/local/free-care-package',
    three_months_for_99: '/offer/local/3-months-for-99',
    first_month_free: '/offer/local/first-month-free',
    opening_offer: '/offer/local/opening-offer',
  },
  PRESALE: {
    zero_dollar_enrollment: '/offer/local/0-enrollment',
    founders_rate: '/offer/local/founders-rate',
    free_training_experience: '/offer/local/free-training-experience',
    join_for_1_dollar: '/offer/local/join-for-1-dollar',
  },
} as const;

/** Locale-specific Local Offer CMS slugs (Webflow) when they differ from the default map. */
export const LOCAL_OFFER_ROUTE_OVERRIDES: Record<string, Partial<Record<string, string>>> = {
  'EN-CA': {
    // Available on Prod — sheet tab EN-CA (gid=400169017)
    // AFW-3989 — national Join for $1 Fall Membership
    join_1_dollar_fall_membership: '/offer/local/join-1-dollar-fall-membership',
    free_training_session: '/offer/local/free-training-session',
    '21day_reboot': '/offer/local/21day-reboot',
    '6_week_challenge': '/offer/local/6-week-challenge',
    join_for_1_transformation_challenge: '/offer/local/join-for-1-transformation-challenge',
    join_get_the_rest_of_the_year_free: '/offer/local/join-get-the-rest-of-the-year-free',
    '0_enrollment_offer': '/offer/local/0-enrollment-offer',
    join_for_1: '/offer/local/join-for-1',
    join_get_the_summer_free: '/offer/local/join-get-the-summer-free',
    join_get_30_days_free: '/offer/local/join-get-30-days-free',
    free_month_training: '/offer/local/free-month-training',
    '7_day_group_training': '/offer/local/7-day-group-training',
    '50_off_training_offer': '/offer/local/50-off-training-offer',
    free_training_experience_enca: '/offer/local/free-training-experience-enca',
    free_7_daypass: '/offer/local/free-7-daypass',
    // Legacy aliases
    twenty_one_day_reboot: '/offer/local/21day-reboot',
    six_week_challenge: '/offer/local/6-week-challenge',
  },
  'FR-CA': {
    // Available on Prod — sheet tab FR-CA (gid=378757103)
    // Exclude: 7-day-group-training-pass-frca (Not available)
    join_1_dollar_fall_membership: '/offer/local/join-1-dollar-fall-membership',
    '0_enrollment_frca': '/offer/local/0-enrollment-frca',
    join_get_rest_year_free_frca: '/offer/local/join-get-rest-year-free-frca',
    refer_friend_get_registration_transformation_challenge:
      '/offer/local/refer-friend-get-registration-transformation-challenge',
    '6_week_challenge_frca': '/offer/local/6-week-challenge-frca',
    '21_day_reboot_frca': '/offer/local/21-day-reboot-frca',
    free_7_day_pass_frca: '/offer/local/free-7-day-pass-frca',
    free_training_experience_frca: '/offer/local/free-training-experience-frca',
    '50_off_training_frca': '/offer/local/50-off-training-frca',
    '1_month_training_frca': '/offer/local/1-month-training-frca',
    training_session_frca: '/offer/local/training-session-frca',
    '30_days_free_frca': '/offer/local/30-days-free-frca',
    join_get_summer_free_frca: '/offer/local/join-get-summer-free-frca',
    join_for_1_frca: '/offer/local/join-for-1-frca',
  },
  /** EN-PH — AFW-3842–AFW-3847 Local Offers (Cohort 7 Philippines). */
  'EN-PH': {
    student_membership: '/offer/local/student-membership',
    senior_citizen_membership: '/offer/local/senior-citizen-membership',
    pwd_membership: '/offer/local/pwd-membership',
    pre_sale_membership: '/offer/local/pre-sale-membership',
    refresh_membership: '/offer/local/refresh-membership',
    welcome_pack: '/offer/local/welcome-pack',
  },
};

/**
 * Host base for Local Offer CMS pages — same resolution as `local-offer.feature`.
 * Non-US locales use `/{locale}/offer/local/...` (e.g. IT `/it-it/offer/local/...`).
 * Root `/offer/local/...` 404s for IT on SIT/PROD while the locale-prefixed path serves
 * `#local-offer-iframe`. Callers may fall back to origin when the locale path lacks the iframe.
 */
export function resolveLocalOfferBaseUrl(locale: string, configuredBaseUrl?: string): string {
  const configured = (configuredBaseUrl ?? process.env.BASE_URL ?? '').replace(/\/$/, '');
  const localeLower = locale.trim().toLowerCase();
  if (!localeLower || localeLower === 'en-us') {
    return configured.replace(/\/(en|ar|fr|de|it|th)-[a-z]{2}$/i, '');
  }
  if (configured.toLowerCase().endsWith(`/${localeLower}`)) {
    return configured;
  }
  const origin = configured.replace(/\/(en|ar|fr|de|it|th)-[a-z]{2}$/i, '');
  return `${origin}/${localeLower}`;
}

/** Resolve Local Offer path for the current locale (supports CMS slug overrides). */
export function resolveLocalOfferRoute(offerKey: string, locale?: string): string {
  const normalizedKey = offerKey.toLowerCase();
  const localeKey = (locale ?? process.env.LOCALE ?? 'EN-US').toUpperCase();
  const override = LOCAL_OFFER_ROUTE_OVERRIDES[localeKey]?.[normalizedKey];
  if (override) return override;

  const path =
    LOCAL_OFFER_ROUTES.OPEN[normalizedKey as keyof typeof LOCAL_OFFER_ROUTES.OPEN] ||
    LOCAL_OFFER_ROUTES.PRESALE[normalizedKey as keyof typeof LOCAL_OFFER_ROUTES.PRESALE];
  if (!path) {
    throw new Error(`No Local Offer route found for key: "${offerKey}" (locale=${localeKey})`);
  }
  return path;
}

export const MCO_OFFER_ROUTES = {
  OPEN: {
    real_af_reboot: '/offer/group/real-af-reboot',
    free_training_experience_offer: '/offer/group/free-training-experience-offer',
    free_7_day_group_training_offer: '/offer/group/free-7-day-group-training-offer',
    get_30_days_free_offer: '/offer/group/get-30-days-free-offer',
    join_for_one_dollar_offer: '/offer/group/join-for-one-dollar-offer',
    free_7_day_pass_offer: '/offer/group/free-7-day-pass-offer',
    free_training_session: '/offer/group/free-training-session',
    one_month_free_training: '/offer/group/one-month-free-training',
    fifty_dollars_off_training_package: '/offer/group/50-dollars-off-training-package',
    six_week_challenge: '/offer/group/6-week-challenge',
    join_get_rest_year_free: '/offer/group/join-get-rest-year-free',
    join_for_one_dollar_offer_bfg: '/offer/group/join-for-one-dollar-offer-bfg',
    free_7_day_pass_offer_bfg: '/offer/group/free-7-day-pass-offer-bfg',
    join_get_summer_free: '/offer/group/join-get-summer-free',
    join_for_one_dollar_transformation_challenge_offer:
      '/offer/group/join-for-one-dollar-transformation-challenge-offer',
    join_for_one_dollar_transformation_challenge_offer_bfg:
      '/offer/group/join-for-one-dollar-transformation-challenge-offer-bfg',
    one_day_pass: '/offer/group/1-day-pass',
    join_get_40_offer_bfg: '/offer/group/join-get-40-offer-bfg',
    join_get_40_offer_of: '/offer/group/join-get-40-offer-of',
    join_get_40_offer_jw: '/offer/group/join-get-40-offer-jw',
    fourteen_day_pass_jo: '/offer/group/14-day-pass-jo',
    fourteen_day_pass_eh: '/offer/group/14-day-pass-eh',
    fourteen_day_pass_jw: '/offer/group/14-day-pass-jw',
  },
  TEST_LOCATION_ID: {
    real_af_reboot: '9993999',
    free_training_experience_offer: '9993999',
    free_7_day_group_training_offer: '9993999',
    get_30_days_free_offer: '9993999',
    join_for_one_dollar_offer: '9993999',
    free_7_day_pass_offer: '9993999',
    free_training_session: '9993999',
    one_month_free_training: '9993999',
    fifty_dollars_off_training_package: '9993999',
    six_week_challenge: '9993999',
    join_get_rest_year_free: '9993999',
    join_for_one_dollar_offer_bfg: '9993999',
    free_7_day_pass_offer_bfg: '9993999',
    join_get_summer_free: '9993999',
    join_for_one_dollar_transformation_challenge_offer: '9993999',
    join_for_one_dollar_transformation_challenge_offer_bfg: '9993999',
    one_day_pass: '9993999',
    join_get_40_offer_bfg: '9993999',
    join_get_40_offer_of: '9993999',
    join_get_40_offer_jw: '9993999',
    fourteen_day_pass_jo: '9993999',
    fourteen_day_pass_eh: '9993999',
    fourteen_day_pass_jw: '9993999',
  },
} as const;

export const MEMBER_OFFER_ROUTES = {
  OPEN: {
    join_transformation_challenge: '/offer/members/join-transformation-challenge',
  },
} as const;

export const SESSION_STORAGE_KEYS = {
  PROSPECT_ID: 'PROSPECT_ID',
  PROSPECT_DATA: 'PROSPECT_DATA',
  ACTIVE_PROSPECT_DATA: 'ACTIVE_PROSPECT_DATA',
  BAT_VARIANT: 'BAT_VARIANT',
} as const;
