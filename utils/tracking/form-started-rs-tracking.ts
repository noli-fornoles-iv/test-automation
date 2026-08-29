/**
 * AFW-3957 Form Started + AFW-3956 Lead Captured — form_* / offer_* by flow.
 * AFW-3434: CMS offer_type required (non-empty) on Form Started + Lead Captured for
 *   Local / Member / Group / Events (incl. Promo); blank CMS → discounted_trial;
 *   intentional "none" must not be replaced. Other RS events may send offer_type "".
 *   National flows keep static offer_type (none / free_trial). Email Club excludes offer_*.
 * Sources: https://purposebrands.atlassian.net/browse/AFW-3957
 *          https://purposebrands.atlassian.net/browse/AFW-3956
 *          https://purposebrands.atlassian.net/browse/AFW-3434
 * Events offer_scope = "event" (Andrew refinement; was "events").
 * form_id = form_type + "_" + form_offer (BAT: appointment_visit).
 */
export type FormStartedRsFlowKey =
  | 'Try Us Free'
  | 'Membership Inquiry'
  | 'Book A Tour Standalone'
  | 'Contact Us'
  | 'Local Offer'
  | 'Member Offer'
  | 'MCO Offer'
  | 'Events'
  | 'Invite a Friend'
  | 'Apple Fitness Free Trial Offer'
  | 'Apple Fitness Plus Subscriber'
  | 'Corporate Membership'
  | 'Own A Gym';

export type FormStartedRsExpectation = {
  formType: string;
  formOffer: string;
  formId: string;
  formName?: string | 'non-empty';
  offerName?: string | 'non-empty';
  offerScope?: string | 'non-empty';
  offerType?: string | 'non-empty';
  /** Email Club / contact exclude offer_* from payload */
  includeOfferFields: boolean;
};

const FLOW_MAP: Record<FormStartedRsFlowKey, FormStartedRsExpectation> = {
  'Try Us Free': {
    formType: 'intro',
    formOffer: 'free_day_pass',
    formId: 'intro_free_day_pass',
    formName: 'free trial',
    offerName: 'Try Us Free',
    offerScope: 'national',
    offerType: 'free_trial',
    includeOfferFields: true,
  },
  'Membership Inquiry': {
    formType: 'inquiry',
    formOffer: 'general',
    formId: 'inquiry_general',
    formName: 'non-empty',
    offerName: 'Membership Inquiry',
    offerScope: 'national',
    offerType: 'none',
    includeOfferFields: true,
  },
  'Book A Tour Standalone': {
    formType: 'appointment',
    formOffer: 'visit',
    formId: 'appointment_visit',
    formName: 'schedule appointment',
    offerName: 'Book a Visit',
    offerScope: 'national',
    offerType: 'none',
    includeOfferFields: true,
  },
  'Contact Us': {
    formType: 'contact',
    formOffer: 'general',
    formId: 'contact_general',
    formName: 'Email Club',
    includeOfferFields: false,
  },
  'Local Offer': {
    formType: 'local_offer',
    formOffer: 'general',
    formId: 'local_offer_general',
    formName: 'non-empty',
    offerName: 'non-empty',
    offerScope: 'local',
    offerType: 'non-empty',
    includeOfferFields: true,
  },
  'Member Offer': {
    formType: 'member_offer',
    formOffer: 'general',
    formId: 'member_offer_general',
    formName: 'non-empty',
    offerName: 'non-empty',
    offerScope: 'local',
    offerType: 'non-empty',
    includeOfferFields: true,
  },
  'MCO Offer': {
    formType: 'group_offer',
    formOffer: 'general',
    formId: 'group_offer_general',
    formName: 'non-empty',
    offerName: 'non-empty',
    offerScope: 'local',
    offerType: 'non-empty',
    includeOfferFields: true,
  },
  Events: {
    formType: 'event',
    formOffer: 'general',
    formId: 'event_general',
    formName: 'non-empty',
    offerName: 'non-empty',
    // Andrew 8/6: offer_scope = event (was events). Ticket map "national" superseded.
    offerScope: 'event',
    offerType: 'non-empty',
    includeOfferFields: true,
  },
  'Invite a Friend': {
    formType: 'invite',
    formOffer: 'free_day_pass',
    formId: 'invite_free_day_pass',
    formName: 'non-empty',
    offerName: 'Invite a Friend',
    offerScope: 'national',
    offerType: 'free_trial',
    includeOfferFields: true,
  },
  'Apple Fitness Free Trial Offer': {
    formType: 'intro',
    formOffer: 'apple_fitness_plus',
    formId: 'intro_apple_fitness_plus',
    formName: 'non-empty',
    offerName: 'Apple Fitness Prospect',
    offerScope: 'national',
    offerType: 'free_trial',
    includeOfferFields: true,
  },
  'Apple Fitness Plus Subscriber': {
    formType: 'intro',
    formOffer: 'apple_fitness_plus',
    formId: 'intro_apple_fitness_plus',
    formName: 'non-empty',
    offerName: 'Apple Fitness Subscriber',
    offerScope: 'national',
    offerType: 'free_trial',
    includeOfferFields: true,
  },
  'Corporate Membership': {
    formType: 'corporate_membership',
    formOffer: 'general',
    formId: 'corporate_membership_general',
    formName: 'non-empty',
    offerName: 'Corporate Membership',
    offerScope: 'national',
    offerType: 'none',
    includeOfferFields: true,
  },
  'Own A Gym': {
    formType: 'franchise',
    formOffer: 'general',
    formId: 'franchise_general',
    formName: 'non-empty',
    offerName: 'Franchise Lead',
    offerScope: 'national',
    offerType: 'none',
    includeOfferFields: true,
  },
};

export function getFormStartedRsExpectation(
  flow: FormStartedRsFlowKey,
): FormStartedRsExpectation {
  const expectation = FLOW_MAP[flow];
  if (!expectation) {
    throw new Error(`AFW-3957: no Form Started RS expectation for flow "${flow}"`);
  }
  return expectation;
}

/** Shape accepted by captureRudderStackEvent formTracking. */
export function toFormStartedFormTracking(flow: FormStartedRsFlowKey) {
  const e = getFormStartedRsExpectation(flow);
  return {
    formType: e.formType,
    formOffer: e.formOffer,
    formId: e.formId,
    formName: e.formName,
    includeOfferFields: e.includeOfferFields,
    offerName: e.offerName,
    offerScope: e.offerScope,
    offerType: e.offerType,
  };
}

/** AFW-3956 Lead Captured — same form_* / offer_* map as Form Started (AFW-3957). */
export const toLeadCapturedFormTracking = toFormStartedFormTracking;
