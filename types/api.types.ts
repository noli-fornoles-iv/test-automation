export interface ProspectResponse {
  prospect: {
    person_id?: string;
    lead_id?: string;
    lead_capture_id?: string;
    external_id?: string;
    deep_link_uri?: string;
    tracking_id?: string;
    fitness_correlation_id?: string;
    user_origin?: string;
    location_number?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile_phone?: string;
    home_phone?: string | null;
    seb_user_id?: string;
    origin_source?: string;
    can_book_appointment?: boolean;
    zipCode?: string;
    email_opt_out?: boolean;
    sms_opt_out?: boolean;
    externalSystemId?: {
      externalSystemIdType: {
        id: number;
        name: string;
      };
      id: string;
    };
  };
}

export interface GymAddress {
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  state_abbr: string;
  country_abbr: string;
  postal_code: string;
}

export interface GymLocation {
  id: string;
  name: string;
  status: string;
  address: GymAddress;
  latitude: number;
  longitude: number;
  location_number: string;
  locationNumber: string;
  phone_number: string;
}

export interface SearchLocationsResponse {
  items: GymLocation[];
}

export interface WebflowItem<FieldData extends Record<string, unknown>> {
  id: string;
  cmsLocaleId: string;
  fieldData: FieldData;
  lastPublished: string;
  lastUpdated: string;
  createdOn: string;
  isArchived: boolean;
  isDraft: boolean;
}

export type WebflowLocationItem = WebflowItem<{
  'club-id': string;
  'open-24-hours': boolean;
  'working-hours---show-message': boolean;
  'link--facebook': string;
  'link---instagram': string;
  'link---pinterest': string;
  'link---twitter': string;
  'link---youtube': string;
  'has-online-join': boolean;
  'is-fitness-plan-enabled': boolean;
  'hero-photos': unknown[];
  'location-id': string;
  differentiator: string;
  'phone-2': string;
  email: string;
  'address-city': string;
  'address-state-province': string;
  'address-post-code': string;
  'address-street': string;
  'address-country': string;
  'coordinates-latitude': string;
  'coordinates-longitude': string;
  'about-us': string;
  timezone: string;
  'working-hours---message': string;
  'membership-starting-cost': string;
  'membership-starting-time-frame': string;
  localoffers: string;
  name: string;
  status: string;
  team: unknown[];
  amenities: string[];
  'hero-photos-ref': string;
  state: string;
  slug: string;
  country: string;
  'social-links'?: string;
}>;

export interface LocationsResponse {
  items: Array<{
    id: string;
    name: string;
    status: 'OPEN' | 'CLOSED' | string; // extend if needed
    address: {
      address1: string;
      address2: string;
      city: string;
      state: string;
      country: string;
      state_abbr: string;
      country_abbr: string;
      postal_code: string;
    };
    latitude: number;
    longitude: number;
    location_id: string;
    location_number: string;
    time_zone: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    geo_code_short: string;
    phone_number: string;
    email: string;
    show_on_map: boolean;
    filter_tags: string[];
    webflowData?: Pick<WebflowLocationItem['fieldData'], 'has-online-join' | 'localoffers'>;
  }>;
}

export interface ProspectRequest {
  workflow_name: string;
  prospectData: {
    origin_source: string;
    user_origin?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile_phone?: string;
    home_phone?: string;
    address_data?: {
      city?: string;
      state_province?: string;
      country?: string;
      zip?: string;
      address?: string;
      address2?: string;
    };
    lead_properties?: {
      location_id?: string;
      channelmix_conv_id?: string;
      referral_code?: string;
    };
    isLocalResident?: boolean;
    note?: string;
    send_confirmation_emails?: boolean;
  };
  website_url?: string;
  locale?: string;
  send_confirmation_emails?: boolean;
  location_number?: string;
  locationNumber: string;
  referral_code?: string;
}

export interface ReferralResponse {
  redeemUrl: string;
  code: string;
}

export interface ReferralLookupResponse {
  member_id?: string;
  referral_code: string;
  location_number?: string;
  location_name?: string;
  member_name?: string;
  is_anonymous: boolean;
}

export interface BookAppointmentRequest {
  workflow_name: string;
  website_url: string;
  deep_link_url: string;
  external_system_id: string;
  location_number: string;
  locationNumber: string;
  start_time_utc: string;
  end_time_utc: string;
  notes: string;
  subject: string;
  remind_attendee: boolean;
  staff_id: string;
}

export interface ProspectData {
  externalSystemId: {
    externalSystemIdType: {
      id: number;
      name: string;
    };
    id: string;
  };
  fitnessCorrelationId: string;
  deepLinkUri: string;
  userOrigin: string;
  afNumber: string;
  first_name: string;
  last_name: string;
  email: string;
  mobilePhone: string;
  homePhone: string | null;
  sebUserId: string;
  originSource: string;
  canBookAppointment: boolean;
  zipCode: string;
}

export interface ClubAddressResponse {
  address: {
    city: string;
    state: string;
    postal_code: string;
    address1: string;
    address2?: string;
    country: string;
    state_abbr: string;
    country_abbr: string;
  };
}

export interface ActiveProspectData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNum: string;
  zipCode: string;
}

export interface ContactRequestPayload {
  workflow: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  locale: string;
  message?: string;
  location_number?: string;
  lead_capture_id?: string;
  lead_id?: string;
  locationNumber: string;
  data?: {
    location_number?: string;
    locationNumber: string;
    zip?: string;
  };
}

export interface CancelMembershipRequestPayload {
  workflow: string;
  subject?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message?: string;
  marketing_opt_in?: boolean;
  locale: string;
  data?: {
    location_number?: string;
    location_email?: string;
    location_phone?: string;
    termination_date?: string;
    is_termination_date_exact?: boolean;
    contract_number?: string;
  };
}

export interface ProspectSessionStorage {
  prospect: ProspectData;
  error: string;
  mobilePhone: string;
}

export interface InquiriesRequestPayload {
  amount_range: string;
  comments: string;
  culture_code: string;
  email: string;
  first_name: string;
  how_did_you_hear_about_us: string;
  interested_in_areas: string;
  last_name: string;
  phone: string;
}
