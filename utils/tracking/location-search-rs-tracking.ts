/**
 * AFW-3952 — Location Searched / Location Selected form tracking by flow.
 * Source: https://purposebrands.atlassian.net/browse/AFW-3952
 *
 * AFW-3434: offer_type is only required on Form Started / Lead Captured.
 * Location events may send offer_type as "" — validators soft-warn, never hard-fail.
 */
export type LocationSearchRsFlowKey =
  | 'Try Us Free'
  | 'Membership Inquiry'
  | 'Book A Tour Standalone'
  | 'Contact Us'
  | 'Find A Gym'
  | 'Find A Gym Free Trial'
  | 'Home Location Search'
  | 'Invite a Friend'
  | 'Apple Fitness Free Trial Offer'
  | 'Apple Fitness Plus Subscriber'
  | 'Events';

export type LocationSearchRsExpectation = {
  formType: string;
  formOffer: string;
  formId: string;
  formName?: string | 'non-empty';
  offerName?: string | 'non-empty';
  offerScope?: string | 'non-empty';
  offerType?: string | 'non-empty';
  /** map_general / contact exclude offer_* from payload */
  includeOfferFields: boolean;
};

const FLOW_MAP: Record<LocationSearchRsFlowKey, LocationSearchRsExpectation> = {
  'Try Us Free': {
    formType: 'intro',
    formOffer: 'free_day_pass',
    formId: 'intro_free_day_pass',
    offerName: 'Try Us Free',
    offerScope: 'national',
    offerType: 'free_trial',
    includeOfferFields: true,
  },
  'Membership Inquiry': {
    formType: 'inquiry',
    formOffer: 'general',
    formId: 'inquiry_general',
    offerName: 'Membership Inquiry',
    offerScope: 'national',
    offerType: 'none',
    includeOfferFields: true,
  },
  'Book A Tour Standalone': {
    formType: 'appointment',
    formOffer: 'visit',
    formId: 'appointment_visit',
    offerName: 'Book a Visit',
    offerScope: 'national',
    offerType: 'none',
    includeOfferFields: true,
  },
  'Contact Us': {
    formType: 'contact',
    formOffer: 'general',
    formId: 'contact_general',
    // Live Location Searched omits form_name even though ticket lists Email Club for Contact.
    includeOfferFields: false,
  },
  'Find A Gym': {
    formType: 'map',
    formOffer: 'general',
    formId: 'map_general',
    includeOfferFields: false,
  },
  'Find A Gym Free Trial': {
    formType: 'map',
    formOffer: 'free_trial',
    formId: 'map_free_trial',
    offerScope: 'national',
    offerType: 'free_trial',
    includeOfferFields: true,
  },
  'Home Location Search': {
    formType: 'map',
    formOffer: 'general',
    formId: 'map_general',
    includeOfferFields: false,
  },
  'Invite a Friend': {
    formType: 'invite',
    formOffer: 'free_day_pass',
    formId: 'invite_free_day_pass',
    offerName: 'Invite a Friend',
    offerScope: 'national',
    offerType: 'free_trial',
    includeOfferFields: true,
  },
  'Apple Fitness Free Trial Offer': {
    formType: 'intro',
    formOffer: 'apple_fitness_plus',
    formId: 'intro_apple_fitness_plus',
    offerName: 'Apple Fitness Prospect',
    offerScope: 'national',
    offerType: 'free_trial',
    includeOfferFields: true,
  },
  'Apple Fitness Plus Subscriber': {
    formType: 'intro',
    formOffer: 'apple_fitness_plus',
    formId: 'intro_apple_fitness_plus',
    offerName: 'Apple Fitness Subscriber',
    offerScope: 'national',
    offerType: 'free_trial',
    includeOfferFields: true,
  },
  Events: {
    formType: 'event',
    formOffer: 'general',
    formId: 'event_general',
    offerName: 'non-empty',
    // AFW-3957: offer_scope = event (was events / national on some surfaces).
    offerScope: 'event',
    offerType: 'non-empty',
    includeOfferFields: true,
  },
};

export function getLocationSearchRsExpectation(
  flow: LocationSearchRsFlowKey,
): LocationSearchRsExpectation {
  const expectation = FLOW_MAP[flow];
  if (!expectation) {
    throw new Error(`No Location Search RS expectation mapped for flow: ${flow}`);
  }
  return expectation;
}
