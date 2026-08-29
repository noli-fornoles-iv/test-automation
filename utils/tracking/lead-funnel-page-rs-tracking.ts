/**
 * AFW-3303 — Page view Rudderstack `lead_funnel_viewed` + form_* when a lead funnel iframe is present.
 * SoT: https://purposebrands.atlassian.net/browse/AFW-3303
 * Testpad 27590 + Arbaz QA notes (true on lead forms; false on Email Club / Find A Gym / franchise / corporate / cancel).
 */
export type LeadFunnelPageRsFlowKey =
  | 'Try Us Free'
  | 'Membership Inquiry'
  | 'Book A Tour Standalone'
  | 'Contact Us'
  | 'Find A Gym'
  | 'Local Gym'
  | 'Local Offer'
  | 'MCO Offer'
  | 'Member Offer'
  | 'Events'
  | 'Events Promo'
  | 'Invite a Friend'
  | 'Apple Fitness Free Trial Offer'
  | 'Apple Fitness Plus Subscriber'
  | 'Own A Gym'
  | 'Corporate Membership'
  | 'Cancel Membership';

export type LeadFunnelPageRsExpectation = {
  leadFunnelViewed: boolean;
  /** When true, assert form_type / form_offer (Testpad includes them even when lead_funnel_viewed=false for contact/map). */
  expectFormFields: boolean;
  formType?: string;
  formOffer?: string;
  /** Soft: location_* if available (deep-link / selected gym). */
  expectLocationIfAvailable: boolean;
  /** Find A Gym / map: exclude offer_* from page payload. */
  excludeOfferFields: boolean;
};

const FLOW_MAP: Record<LeadFunnelPageRsFlowKey, LeadFunnelPageRsExpectation> = {
  'Try Us Free': {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'intro',
    formOffer: 'free_day_pass',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'Membership Inquiry': {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'inquiry',
    formOffer: 'general',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'Book A Tour Standalone': {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'appointment',
    formOffer: 'visit',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'Contact Us': {
    leadFunnelViewed: false,
    expectFormFields: true,
    formType: 'contact',
    formOffer: 'general',
    expectLocationIfAvailable: true,
    excludeOfferFields: true,
  },
  'Find A Gym': {
    leadFunnelViewed: false,
    expectFormFields: true,
    formType: 'map',
    formOffer: 'general',
    expectLocationIfAvailable: false,
    excludeOfferFields: true,
  },
  // AFW-4088 LLP (/locations/{slug}) — location context expected; form_* not required for pairing.
  'Local Gym': {
    leadFunnelViewed: false,
    expectFormFields: false,
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'Local Offer': {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'local_offer',
    formOffer: 'general',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'MCO Offer': {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'group_offer',
    formOffer: 'general',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'Member Offer': {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'member_offer',
    formOffer: 'general',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  Events: {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'event',
    formOffer: 'general',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'Events Promo': {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'event',
    formOffer: 'general',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'Invite a Friend': {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'invite',
    formOffer: 'free_day_pass',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'Apple Fitness Free Trial Offer': {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'intro',
    formOffer: 'apple_fitness_plus',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'Apple Fitness Plus Subscriber': {
    leadFunnelViewed: true,
    expectFormFields: true,
    formType: 'intro',
    formOffer: 'apple_fitness_plus',
    expectLocationIfAvailable: true,
    excludeOfferFields: false,
  },
  'Own A Gym': {
    leadFunnelViewed: false,
    expectFormFields: false,
    expectLocationIfAvailable: false,
    excludeOfferFields: true,
  },
  'Corporate Membership': {
    leadFunnelViewed: false,
    expectFormFields: false,
    expectLocationIfAvailable: false,
    excludeOfferFields: true,
  },
  'Cancel Membership': {
    leadFunnelViewed: false,
    expectFormFields: false,
    expectLocationIfAvailable: false,
    excludeOfferFields: true,
  },
};

export function getLeadFunnelPageRsExpectation(
  flow: LeadFunnelPageRsFlowKey,
): LeadFunnelPageRsExpectation {
  const expectation = FLOW_MAP[flow];
  if (!expectation) {
    throw new Error(`AFW-3303: no Page lead-funnel RS expectation for flow "${flow}"`);
  }
  return expectation;
}
