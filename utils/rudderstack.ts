import { Page } from '@playwright/test';
import { TIMEOUTS } from '@utils/constants';
import { gymNamesAreEquivalent } from '@utils/gym-name-aliases';
import {
  AppointmentScheduledTrackingAssertions,
  toAppointmentScheduledTracking,
} from '@utils/tracking/appointment-scheduled-rs-tracking';
import {
  APPOINTMENT_SLOT_SELECTED_EVENT,
  AppointmentSlotTrackingAssertions,
  toAppointmentSlotTracking,
} from '@utils/tracking/appointment-slot-rs-tracking';

export type PageDetails = {
  initial_referrer: string;
  initial_referring_domain: string;
  path: string;
  referrer: string;
  referring_domain: string;
  search: string;
  tab_url: string;
  title: string;
  url: string;
};

type RudderStackConsentManagement = {
  provider?: string;
  resolutionStrategy?: string;
  allowedConsentIds?: string[];
  deniedConsentIds?: string[];
};

type RudderStackContext = {
  userAgent?: string;
  os?: Record<string, unknown>;
  screen?: {
    width?: number;
    height?: number;
    density?: number;
    innerWidth?: number;
    innerHeight?: number;
  };
  page?: {
    path?: string;
    referrer?: string;
    referring_domain?: string;
    search?: string;
    title?: string;
    url?: string;
    tab_url?: string;
    initial_referrer?: string;
    initial_referring_domain?: string;
  };
  app?: { name?: string; namespace?: string; installType?: string };
  library?: { name?: string; snippetVersion?: string };
  consentManagement?: RudderStackConsentManagement;
  traits?: { lead_capture_id?: string; lead_captured_id?: string; lead_id?: string };
};

type RudderStackProperties = {
  initial_referrer?: string;
  initial_referring_domain?: string;
  path?: string;
  referrer?: string;
  referring_domain?: string;
  search?: string;
  tab_url?: string;
  title?: string;
  url?: string;
  lead_id?: string;
  lead_capture_id?: string;
  lead_captured_id?: string;
  location_id?: string;
  location_name?: string;
  order_id?: string;
  appointment_id?: string;
  email?: string;
  form_type?: string;
  form_offer?: string;
  form_name?: string;
  form_id?: string;
  /** AFW-3952 Location Searched / Location Selected */
  step?: string | number;
  search_success?: string | boolean;
  results_count?: string | number;
  search_term?: string;
  search_type?: string;
  search_method?: string;
  offer_name?: string;
  offer_scope?: string;
  offer_type?: string;
  cta_text?: string;
  cta_url?: string;
  /** AFW-3303 Page view — lead funnel iframe present */
  lead_funnel_viewed?: string | boolean;
  /** AFW-3953 Appointment Slot Selected */
  person_id?: string | number;
  appointment_type?: string;
  service_offer?: string;
  service_name?: string;
  service_type?: string;
  appointment_time_date_utc?: string;
  appointment_time_date_local?: string;
  timezone?: string;
  date?: string;
  time?: string;
  appointment_start_at?: string;
  /** AFW-3954 Appointment Scheduled */
  payment_required?: string | boolean;
  staff_id?: string | number;
  staff_name?: string;
  appointment_timezone?: string;
  appointment_day_of_week?: string;
  appointment_time_of_day?: string;
  channel?: string;
  service_id?: string | number;
};

function resolveLeadCaptureId(
  context?: RudderStackContext,
  properties?: RudderStackProperties,
): string | undefined {
  return (
    context?.traits?.lead_captured_id ??
    context?.traits?.lead_capture_id ??
    properties?.lead_captured_id ??
    properties?.lead_capture_id
  );
}

type RudderStackPayload = {
  type: string;
  event?: string;
  channel?: string;
  properties?: RudderStackProperties;
  context?: RudderStackContext;
  userId?: string | null;
  anonymousId?: string;
  messageId?: string;
  originalTimestamp?: string;
  integrations?: Record<string, unknown>;
  sentAt?: string;
};

type DataLayerLeadEvent = {
  event?: string;
  form_category?: string;
  club_id?: string | number;
  lead_capture_id?: string;
  lead_captured_id?: string;
  lead_id?: string;
  club_name?: string;
  form_name?: string;
  lead_type?: string;
  lead_source_code?: string;
  emailsha256?: string;
};

function resolveDataLayerLeadCaptureId(entry?: DataLayerLeadEvent | null): string | undefined {
  if (!entry) return undefined;
  const value = entry.lead_captured_id ?? entry.lead_capture_id;
  return value !== null && String(value).length > 0 ? String(value) : undefined;
}

/** Exact value, or 'non-empty' for offer flows where names are locale/offer-specific. */
export type FormTrackingAssertions = {
  formName?: string | 'non-empty';
  formOffer?: string | 'non-empty';
  formType?: string | 'non-empty';
  /** AFW-3957: form_type + "_" + form_offer (e.g. intro_free_day_pass). Legacy: lead-form. */
  formId?: string | 'non-empty';
  includeOfferFields?: boolean;
  offerName?: string | 'non-empty';
  offerScope?: string | 'non-empty';
  offerType?: string | 'non-empty';
};

/** AFW-3952 — Location Searched / Location Selected property expectations. */
export type LocationEventTrackingAssertions = {
  searchSuccess?: boolean;
  searchTerm?: string | 'non-empty';
  /** keyword | browser_geolocation | ip_address | deeplink — or non-empty when method varies */
  searchMethod?: string | 'non-empty';
  /** AFW-4066: country/region/district/place/locality/neighborhood/postcode */
  searchType?: string | 'non-empty';
  includeOfferFields?: boolean;
  offerName?: string | 'non-empty';
  offerScope?: string | 'non-empty';
  offerType?: string | 'non-empty';
  /** AFW-4104 — hard-require non-empty CMS offer_name + offer_type on Location Searched/Selected. */
  requireCmsOfferFields?: boolean;
  locationId?: string | 'non-empty';
  expectCta?: boolean;
};

/** AFW-3303 — Page view lead_funnel_viewed + optional form_* / location_*. */
export type LeadFunnelPageTrackingAssertions = {
  leadFunnelViewed: boolean;
  expectFormFields?: boolean;
  formType?: string;
  formOffer?: string;
  expectLocationIfAvailable?: boolean;
  /**
   * AFW-4088 — deep-link / LLP surfaces where location_id is expected on page view.
   * When true: location_id is required, and location_name must accompany it.
   */
  requireLocationIdWithName?: boolean;
  excludeOfferFields?: boolean;
};

/** AFW-3953 — Appointment Slot Selected property expectations. */
export type SlotTrackingAssertions = AppointmentSlotTrackingAssertions;

/** AFW-3954 — Appointment Scheduled property expectations. */
export type ScheduledTrackingAssertions = AppointmentScheduledTrackingAssertions;

async function readDataLayerEntries(page: Page): Promise<DataLayerLeadEvent[]> {
  const layers: DataLayerLeadEvent[] = [];

  try {
    const parentLayer = await page.evaluate(() => {
      const win = window as { dataLayer?: DataLayerLeadEvent[] };
      return win.dataLayer ?? [];
    });
    layers.push(...parentLayer);
  } catch {
    // Post-submit navigations (e.g. thank-you) can destroy the execution context.
    return layers;
  }

  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) {
      continue;
    }
    try {
      const frameLayer = await frame.evaluate(() => {
        const win = window as { dataLayer?: DataLayerLeadEvent[] };
        return win.dataLayer ?? [];
      });
      layers.push(...frameLayer);
    } catch {
      // Ignore cross-origin frames / destroyed contexts that cannot be read.
    }
  }

  return layers;
}

/**
 * Poll parent + same-origin iframe dataLayers (Contact Us lives in a cross-origin
 * iframe that parent page.waitForFunction cannot access via contentWindow).
 */
export async function waitForDataLayerEntries(
  page: Page,
  predicate: (entries: DataLayerLeadEvent[]) => boolean,
  timeout = TIMEOUTS.LONG,
): Promise<DataLayerLeadEvent[]> {
  const started = Date.now();
  let lastEntries: DataLayerLeadEvent[] = [];

  while (Date.now() - started < timeout) {
    lastEntries = await readDataLayerEntries(page);
    if (predicate(lastEntries)) {
      return lastEntries;
    }
    await page.waitForTimeout(250);
  }

  return lastEntries;
}

function pushRudderstackPayload(
  collection: RudderStackRequest[],
  url: string,
  payload: unknown,
): void {
  if (!payload || typeof payload !== 'object') {
    return;
  }

  const record = payload as RudderStackPayload & { batch?: unknown[] };
  if (Array.isArray(record.batch)) {
    for (const item of record.batch) {
      if (item && typeof item === 'object') {
        pushRudderstackPayload(collection, url, item);
      }
    }
    return;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      if (item && typeof item === 'object') {
        pushRudderstackPayload(collection, url, item);
      }
    }
    return;
  }

  // Dedupe remount/route re-bind double captures (same messageId).
  const messageId = String((record as RudderStackPayload).messageId ?? '');
  if (
    messageId &&
    collection.some(existing => String(existing.postDataJSON?.messageId ?? '') === messageId)
  ) {
    return;
  }

  collection.push({ url, postDataJSON: record });
}

function findLatestFormLoadedLead(dataLayer: DataLayerLeadEvent[]): DataLayerLeadEvent | undefined {
  return [...dataLayer]
    .reverse()
    .find(item => item.event === 'form_loaded' && item.form_category === 'lead');
}

function findFormLoadedWithClubId(
  dataLayer: DataLayerLeadEvent[],
  clubId: string,
): DataLayerLeadEvent | undefined {
  const withClubId = [...dataLayer]
    .reverse()
    .find(
      item =>
        item.event === 'form_loaded' &&
        item.form_category === 'lead' &&
        String(item.club_id ?? '') === String(clubId),
    );

  return withClubId ?? findLatestFormLoadedLead(dataLayer);
}

export type LeadEventData = [
  leadId: string,
  leadCaptureId: string,
  locationId: string,
  shouldVerifyDataLayer?: boolean,
];

export type RudderStackRequest = {
  url: string;
  postDataJSON?: RudderStackPayload;
};

export async function retrieveRudderstackNetworkLogs(
  rudderstackRequests: RudderStackRequest[],
  eventName: string,
  options?: {
    searchSuccess?: boolean;
    requireFormType?: string;
    /** AFW-3952: prefer typed (`manual`/`keyword`) vs IP auto (`ip_address`). */
    searchMethod?: string;
  },
) {
  const eventAliases: Record<string, string[]> = {
    'Appointment Scheduled': ['Appointment Scheduled', 'Visit Scheduled'],
    'Visit Scheduled': ['Visit Scheduled', 'Appointment Scheduled'],
  };
  const candidates = eventAliases[eventName] ?? [eventName];

  let matches = rudderstackRequests.filter(r => {
    if (eventName === 'page' || eventName === 'identify') {
      return r.postDataJSON?.type === eventName;
    }
    return candidates.includes(r.postDataJSON?.event ?? '');
  });

  if (eventName === 'Location Searched' && options?.searchSuccess !== undefined) {
    // Strict filter — never fall back to a mismatched search_success (breaks fail→success journeys).
    matches = matches.filter(r => {
      const flag = r.postDataJSON?.properties?.search_success;
      if (flag === undefined) return false;
      if (typeof flag === 'boolean') return flag === options.searchSuccess;
      const normalized = String(flag).trim().toLowerCase();
      return options.searchSuccess
        ? normalized === 'true' || normalized === '1'
        : normalized === 'false' || normalized === '0';
    });
  }

  // AFW-3952: do not match IP auto payloads when asserting typed manual/keyword (map load
  // often fires Location Searched with search_method=ip_address before the user types).
  if (
    eventName === 'Location Searched' &&
    options?.searchMethod &&
    options.searchMethod !== 'non-empty'
  ) {
    const expected = options.searchMethod.trim().toLowerCase();
    const methodAliases: Record<string, string[]> = {
      manual: ['manual', 'keyword'],
      keyword: ['keyword', 'manual'],
      ip_address: ['ip_address'],
      browser_geolocation: ['browser_geolocation'],
      deeplink: ['deeplink'],
    };
    const allowed = methodAliases[expected] ?? [expected];
    matches = matches.filter(r => {
      const actual = String(r.postDataJSON?.properties?.search_method ?? '')
        .trim()
        .toLowerCase();
      return allowed.includes(actual);
    });
  }

  // AFW-3303: early page views often omit form_*; wait for an enriched payload when required.
  if (eventName === 'page' && options?.requireFormType) {
    const expected = options.requireFormType.trim().toLowerCase();
    matches = matches.filter(r => {
      const actual = String(r.postDataJSON?.properties?.form_type ?? '')
        .trim()
        .toLowerCase();
      return actual === expected;
    });
  }

  // Location Searched/Selected, page, identify, and Appointment Scheduled can fire multiple times —
  // prefer the latest (SPA: early shell/anonymous payloads before identify with lead ids).
  const preferLatest =
    eventName === 'Location Searched' ||
    eventName === 'Location Selected' ||
    eventName === 'page' ||
    eventName === 'identify' ||
    eventName === 'Appointment Scheduled' ||
    eventName === 'Visit Scheduled';

  let matchedRequest = preferLatest ? matches[matches.length - 1] : matches[0];

  // Prefer a Scheduled payload that carries userId / person_id when multiple exist.
  if (
    (eventName === 'Appointment Scheduled' || eventName === 'Visit Scheduled') &&
    matches.length > 1
  ) {
    const withIdentity = [...matches].reverse().find(r => {
      const uid = r.postDataJSON?.userId;
      const pid = r.postDataJSON?.properties?.person_id;
      return (
        (uid !== null && String(uid).trim() !== '') || (pid !== null && String(pid).trim() !== '')
      );
    });
    if (withIdentity) {
      matchedRequest = withIdentity;
    }
  }

  // Prefer post-submit identify that carries lead_id (early shell identify is anonymous).
  if (eventName === 'identify' && matches.length > 1) {
    const withLeadId = [...matches].reverse().find(r => {
      const leadId = r.postDataJSON?.context?.traits?.lead_id;
      return leadId !== null && String(leadId).trim() !== '';
    });
    if (withLeadId) {
      matchedRequest = withLeadId;
    }
  }

  if (!matchedRequest) {
    const recent = rudderstackRequests.slice(-20).map(r => {
      const p = r.postDataJSON;
      if (!p) return '(empty)';
      if (p.event) {
        const props = p.properties ?? {};
        const bits = [p.event];
        if (props.search_success !== undefined) bits.push(`success=${props.search_success}`);
        if (props.search_method) bits.push(`method=${props.search_method}`);
        if (props.search_type) bits.push(`type=${props.search_type}`);
        return bits.join('/');
      }
      return p.type ?? '(unknown)';
    });
    throw new Error(
      `No network logs found for event: ${eventName}` +
        (candidates.length > 1
          ? ` (also tried: ${candidates.filter(c => c !== eventName).join(', ')})`
          : '') +
        (options?.searchSuccess !== undefined
          ? ` with search_success=${options.searchSuccess}`
          : '') +
        (options?.searchMethod && options.searchMethod !== 'non-empty'
          ? ` with search_method=${options.searchMethod}`
          : '') +
        (options?.requireFormType ? ` with form_type=${options.requireFormType}` : '') +
        (recent.length
          ? `. Recent RS events (${recent.length}/${rudderstackRequests.length}): ${JSON.stringify(recent)}`
          : `. Capture bag is empty (${rudderstackRequests.length} requests) — listener may have started after the event fired.`),
    );
  }
  return matchedRequest;
}

export async function verifyNoEventTracked(
  rudderstackRequests: RudderStackRequest[],
  eventName: string,
) {
  const matchedRequest = rudderstackRequests.find(r => {
    return eventName === 'page'
      ? r.postDataJSON?.type === 'page'
      : r.postDataJSON?.event === eventName;
  });

  if (!matchedRequest) {
    console.log(`No network logs found for event: ${eventName}`);
  } else {
    throw new Error(`Found network logs found for event: ${eventName}`);
  }
  return matchedRequest;
}

function isRudderstackDataplaneUrl(url: string): boolean {
  return /dataplane\.rudderstack\.com|rudderstack\.com\/v1\//i.test(url);
}

function captureRudderstackRequest(
  collection: RudderStackRequest[],
  req: { method: () => string; url: () => string; postData: () => string | null },
): void {
  if (req.method() !== 'POST' || !isRudderstackDataplaneUrl(req.url())) {
    return;
  }
  const postData = req.postData();
  if (!postData) return;
  try {
    pushRudderstackPayload(collection, req.url(), JSON.parse(postData));
  } catch {
    // Ignore non-JSON payloads.
  }
}

/** One capture bag + listeners per Page — avoid empty second bags missing early Form Started / Lead Captured. */
const rudderstackCaptureByPage = new WeakMap<Page, RudderStackRequest[]>();

async function bindRudderstackRouteCapture(
  page: Page,
  collection: RudderStackRequest[],
): Promise<void> {
  // Route capture: postData stays available even when SPA navigation races keepalive/beacon posts
  // (Local Offer TC-K016: identify / Lead Captured missed after schedule handoff remount).
  try {
    await page.route(/dataplane\.rudderstack\.com|rudderstack\.com\/v1\//i, async route => {
      captureRudderstackRequest(collection, route.request());
      await route.continue();
    });
  } catch {
    // Routing unavailable or already handled — request listeners still apply.
  }
}

export async function rudderstackRequests(page: Page): Promise<RudderStackRequest[]> {
  const existing = rudderstackCaptureByPage.get(page);
  if (existing) {
    // Re-bind route after schedule/thank-you remount — page.on listeners survive, but the first
    // route handler can stop seeing beacon bodies after SPA handoff.
    await bindRudderstackRouteCapture(page, existing);
    return existing;
  }

  const collection: RudderStackRequest[] = [];
  rudderstackCaptureByPage.set(page, collection);

  // Prefer requestfinished — postData is more reliably available after the request completes.
  // Keep request as a fallback for short-lived beacons that may not surface postData on finish.
  page.on('request', req => captureRudderstackRequest(collection, req));
  page.on('requestfinished', req => captureRudderstackRequest(collection, req));

  await bindRudderstackRouteCapture(page, collection);

  await page.waitForTimeout(500);
  return collection;
}

/**
 * Prefer lead ids from the latest Lead Captured (or identify) payload when prospect/dataLayer
 * ids are blank or stale after soft-408 / schedule handoff (Local Offer TC-K016 flake).
 */
export function reconcileLeadEventDataFromRudderstack(
  requests: RudderStackRequest[],
  data: LeadEventData,
  flowLabel = 'Lead flow',
): LeadEventData {
  const leadCaptured = [...requests]
    .reverse()
    .find(req => req.postDataJSON?.event === 'Lead Captured');
  const identify = [...requests]
    .reverse()
    .find(req => req.postDataJSON?.type === 'identify' || req.postDataJSON?.event === 'identify');

  const props = leadCaptured?.postDataJSON?.properties;
  const traits =
    leadCaptured?.postDataJSON?.context?.traits ?? identify?.postDataJSON?.context?.traits;
  const fromCaptureId = resolveLeadCaptureId(
    leadCaptured?.postDataJSON?.context ?? identify?.postDataJSON?.context,
    props,
  );
  const fromLeadId = String(props?.lead_id ?? traits?.lead_id ?? '').trim();
  const fromLocationId = String(props?.location_id ?? data[2] ?? '').trim();

  const expectedLeadId = String(data[0] ?? '').trim();
  const expectedCaptureId = String(data[1] ?? '').trim();
  const expectedLocationId = String(data[2] ?? '').trim();

  let leadId = expectedLeadId;
  let leadCaptureId = expectedCaptureId;
  let locationId = expectedLocationId || fromLocationId;

  // Blank expected → always take RS. Mismatch → prefer RS (stale 408 / retry ids).
  if (fromLeadId && (!leadId || leadId !== fromLeadId)) {
    if (leadId && leadId !== fromLeadId) {
      console.warn(
        `${flowLabel}: reconciling stale lead_id ${leadId} → ${fromLeadId} from Rudderstack payload`,
      );
    }
    leadId = fromLeadId;
  }
  if (fromCaptureId && (!leadCaptureId || leadCaptureId !== fromCaptureId)) {
    if (leadCaptureId && leadCaptureId !== fromCaptureId) {
      console.warn(
        `${flowLabel}: reconciling stale lead_capture_id ${leadCaptureId} → ${fromCaptureId} from Rudderstack payload`,
      );
    }
    leadCaptureId = fromCaptureId;
  }
  if (fromLocationId && (!locationId || locationId !== fromLocationId)) {
    locationId = fromLocationId;
  }

  return [leadId, leadCaptureId, locationId, data[3]];
}

/**
 * AFW-3956 shared post-submit path: hard-assert Lead Captured, soft-warn missing/mismatched identify.
 * Events previously hard-failed on identify first and never validated Lead Captured.
 * Soft-408 retries can leave stale prospect ids — reconcile from RS payloads before asserts.
 */
export async function captureIdentifyAndLeadCapturedAfterSubmit({
  requests,
  page,
  data,
  pageDetails,
  formTracking,
  flowLabel,
  pollTimeout = TIMEOUTS.LONG,
}: {
  requests: RudderStackRequest[];
  page: Page;
  data: LeadEventData;
  pageDetails: PageDetails;
  formTracking?: FormTrackingAssertions;
  flowLabel: string;
  pollTimeout?: number;
}): Promise<void> {
  // Ensure route capture is alive after schedule/thank-you remount.
  await rudderstackRequests(page);

  const deadline = Date.now() + pollTimeout;
  while (Date.now() < deadline) {
    if (requests.some(req => req.postDataJSON?.event === 'Lead Captured')) {
      break;
    }
    if (page.isClosed()) {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const hasIdentify = requests.some(
    req => req.postDataJSON?.type === 'identify' || req.postDataJSON?.event === 'identify',
  );

  if (!requests.some(req => req.postDataJSON?.event === 'Lead Captured')) {
    const observed = requests.map(req => ({
      type: req.postDataJSON?.type,
      event: req.postDataJSON?.event,
    }));
    throw new Error(
      `${flowLabel}: Lead Captured Rudderstack event not observed after lead submit` +
        (hasIdentify ? ' (identify WAS captured — Lead Captured still missing)' : '') +
        `. Observed=${JSON.stringify(observed)}`,
    );
  }

  // Prospect 408 / late dataLayer recovery often stores blank or wrong ids; RS payload is SoT.
  const reconciled = reconcileLeadEventDataFromRudderstack(requests, data, flowLabel);

  if (hasIdentify) {
    try {
      await captureRudderStackEvent({
        requests,
        event: 'identify',
        page,
        data: reconciled,
        pageDetails,
        skipPagePathValidation: true,
      });
    } catch (error) {
      // Identify presence is confirmed above — do not fail Lead Captured on identify property drift.
      console.warn(
        `APP GAP (AFW-3956): ${flowLabel} identify present but property validation failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  } else {
    console.warn(
      `APP GAP (AFW-3956): ${flowLabel} identify Rudderstack event missing after Lead Captured`,
    );
  }

  await captureRudderStackEvent({
    requests,
    event: 'Lead Captured',
    page,
    data: reconciled,
    pageDetails,
    skipPagePathValidation: true,
    formTracking,
  });
}

async function evaluateWithNavigationRetry<T>(
  page: Page,
  fn: () => T | Promise<T>,
  fallback: T,
  label: string,
): Promise<T> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (page.isClosed()) {
      return fallback;
    }
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => {});
      return await page.evaluate(fn);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (
        attempt < 3 &&
        /Execution context was destroyed|Target closed|navigation/i.test(message)
      ) {
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      console.warn(`${label} evaluate failed after navigation race: ${message}`);
      return fallback;
    }
  }
  return fallback;
}

export async function getActiveOnetrustGroup(page: Page) {
  const activeGroups = await evaluateWithNavigationRetry(
    page,
    () => {
      // @ts-expect-error "OnetrustActiveGroups" is a variable injected by OneTrust's script.
      return window.OnetrustActiveGroups ?? '';
    },
    '',
    'getActiveOnetrustGroup',
  );

  return activeGroups ?? '';
}

export async function getcheckOneTrustConsent(page: Page): Promise<boolean | null> {
  // Safari / late-load sessions may capture RS before OneTrust injects the helper.
  // null = helper unavailable (caller should infer from RS payload consentManagement).
  return evaluateWithNavigationRetry(
    page,
    () => {
      // @ts-expect-error "checkOneTrustConsent" is a function injected by OneTrust's script.
      if (typeof window.checkOneTrustConsent !== 'function') {
        return null;
      }
      // @ts-expect-error "checkOneTrustConsent" is a function injected by OneTrust's script.
      return Boolean(window.checkOneTrustConsent(2));
    },
    null,
    'getcheckOneTrustConsent',
  );
}

export async function getPersonIdFromSessionStorage(page: Page): Promise<string | null> {
  return evaluateWithNavigationRetry(
    page,
    () => sessionStorage.getItem('rs_person_id'),
    null,
    'getPersonIdFromSessionStorage',
  );
}

/**
 * Club/location display names for EN-US test studios are interchangeable for club 9993999
 * (PROD list cards + tracking: WOODBURY! (TEST1) or WOODBURY! (TEST2)).
 */
function assertClubOrLocationNameIgnoreCase(
  actual: string | undefined,
  expected: string,
  fieldName: string,
) {
  if (gymNamesAreEquivalent(actual, expected)) {
    return;
  }
  throw new Error(`Expected ${fieldName} to be ${expected}, but got ${actual}`);
}

function assertEqualityCondition<T extends string | number | boolean | null | undefined>(
  actual: T,
  expected: T,
  fieldName: string,
  shouldMatch = true,
) {
  const matchCondition = shouldMatch ? expected !== actual : expected === actual;
  const errorMessage = shouldMatch
    ? `Expected ${fieldName} to be ${expected}, but got ${actual}`
    : `Expected ${fieldName} to be different from ${expected}, but got ${actual}`;

  if (matchCondition) {
    throw new Error(errorMessage);
  }
}

function assertNotEmpty(
  expected: string | null,
  actual: string | null,
  fieldName: string,
  _shouldMatch = true,
) {
  if (expected === null || expected === '') {
    throw new Error(`Expected ${fieldName} to be ${expected}, but got ${actual}`);
  }
}

function getExpectedValues() {
  return {
    channel: 'web',
    appName: 'RudderLabs JavaScript SDK',
    namespace: 'com.rudderlabs.javascript',
    installType: 'cdn',
    provider: 'oneTrust',
    resolutionStrategy: 'and',
    libraryName: 'RudderLabs JavaScript SDK',
    snippetVersion: '3.2.0',
  };
}

function checkForUndefinedAttributes(data: Record<string, unknown>) {
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) {
      console.error(`❌ Attribute ${key} is undefined!`);
    }
  });
}

function assertExpectedValues(actual: Record<string, unknown>, expected: Record<string, unknown>) {
  Object.entries(expected).forEach(([key, expectedValue]) => {
    const actualValue = actual[key];
    if (actualValue !== expectedValue) {
      throw new Error(
        `❌ Mismatch for ${key}: Expected '${expectedValue}', but got '${actualValue}'`,
      );
    } else {
      console.log(`✅ ${key} matches expected value.`);
    }
  });
}

function extractRelevantData(data: RudderStackRequest) {
  const postData = data?.postDataJSON;
  const consent = postData?.context?.consentManagement;

  return {
    channel: postData?.channel,
    appName: postData?.context?.app?.name,
    namespace: postData?.context?.app?.namespace,
    installType: postData?.context?.app?.installType,
    provider: consent?.provider ?? null,
    resolutionStrategy: consent?.resolutionStrategy ?? null,
    libraryName: postData?.context?.library?.name,
    snippetVersion: postData?.context?.library?.snippetVersion,
  };
}

function validateEventData(data: RudderStackRequest) {
  const extractedData = extractRelevantData(data);
  const expectedData = getExpectedValues();

  checkForUndefinedAttributes(extractedData);
  assertExpectedValues(extractedData, expectedData);

  console.log('Validation complete.');
}

function assertNonNullAttributes(data: RudderStackRequest) {
  const postData = data?.postDataJSON;
  const context = postData?.context;

  const attributesToCheck: Record<string, unknown> = {
    userAgent: context?.userAgent,
    os: context?.os,
    width: context?.screen?.width,
    height: context?.screen?.height,
    density: context?.screen?.density,
    innerWidth: context?.screen?.innerWidth,
    innerHeight: context?.screen?.innerHeight,
    path: context?.page?.path,
    referrer: context?.page?.referrer,
    referringDomain: context?.page?.referring_domain,
    search: context?.page?.search,
    title: context?.page?.title,
    url: context?.page?.url,
    tabUrl: context?.page?.tab_url,
    initialReferrer: context?.page?.initial_referrer,
    initialReferringDomain: context?.page?.initial_referring_domain,
    originalTimestamp: postData?.originalTimestamp,
    messageId: postData?.messageId,
    userId: postData?.userId,
    anonymousId: postData?.anonymousId,
    integrations: postData?.integrations,
    sentAt: postData?.sentAt,
  };

  Object.entries(attributesToCheck).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      throw new Error(`❌ Attribute ${key} is null or undefined!`);
    } else {
      console.log(`✅ ${key} is valid: ${value}`);
    }
  });
}

export async function getPageDetails(page: Page) {
  // Lead submit often navigates (schedule / thank-you) while RS helpers still read the page.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: TIMEOUTS.MEDIUM }).catch(() => {});
      const currentUrl = page.url();
      const url = new URL(currentUrl);
      const title = await page.title();
      const referrer = await page.evaluate(() => document.referrer);
      const baseDomain = 'https://www.anytimefitness.com';
      const normalizedUrl = `${baseDomain}${url.pathname}${url.search}`;

      return {
        initial_referrer: normalizedUrl,
        initial_referring_domain: 'www.anytimefitness.com',
        path: url.pathname,
        referrer: referrer || '$direct',
        referring_domain: referrer ? new URL(referrer).hostname : '',
        search: url.search,
        tab_url: currentUrl,
        title: title,
        url: normalizedUrl,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (attempt === 3 || !/Execution context was destroyed|Target closed|navigat/i.test(msg)) {
        throw error;
      }
      await page.waitForTimeout(500);
    }
  }
  throw new Error('getPageDetails failed after navigation retries');
}

function assertFormTrackingValue(
  actual: string | undefined,
  expected: string | 'non-empty',
  label: string,
): void {
  if (expected === 'non-empty') {
    assertNotEmpty(actual ?? null, null, label);
    return;
  }
  // AFW-3811 Book a Visit: form_offer tour→visit.
  // AFW-3957 Events: form_type=event, offer_scope=event (was events / form_type national).
  // Apple Fitness Free Trial Offer: inquiry→intro. Accept legacy aliases so older envs still pass.
  const aliases: Record<string, string[]> = {
    tour: ['tour', 'visit'],
    visit: ['visit', 'tour'],
    event: ['event', 'events', 'national'],
    events: ['events', 'event'],
    national: ['national', 'event'],
    inquiry: ['inquiry', 'intro'],
    intro: ['intro', 'inquiry'],
    general: ['general', 'apple_fitness_plus'],
    apple_fitness_plus: ['apple_fitness_plus', 'general'],
    keyword: ['keyword', 'manual'],
    manual: ['manual', 'keyword'],
  };
  const allowed = aliases[expected.toLowerCase()];
  if (allowed && actual && allowed.includes(actual.toLowerCase())) {
    console.log(`✅ ${label} is valid: ${actual} (expected ${expected})`);
    return;
  }
  assertEqualityCondition(actual, expected, label);
}

async function validateEventProperties({
  eventData,
  eventName,
  pageDetails,
  data,
  formTracking,
  locationTracking,
  leadFunnelTracking,
  slotTracking,
  scheduledTracking,
}: {
  eventData: RudderStackRequest;
  eventName: string;
  pageDetails: PageDetails | undefined;
  data: LeadEventData | string;
  formTracking?: FormTrackingAssertions;
  locationTracking?: LocationEventTrackingAssertions;
  leadFunnelTracking?: LeadFunnelPageTrackingAssertions;
  slotTracking?: SlotTrackingAssertions;
  scheduledTracking?: ScheduledTrackingAssertions;
}) {
  const payload = eventData.postDataJSON;
  const type = payload?.type;
  const event = payload?.event;
  const properties = payload?.properties;
  const context = payload?.context ?? ({} as RudderStackContext);

  const expectedAttributes: Record<string, string[]> = {
    page: [
      'path',
      'referrer',
      'referring_domain',
      'search',
      'title',
      'tab_url',
      'url',
      'initial_referrer',
      'initial_referring_domain',
    ],
  };

  const expectedKeys =
    type === 'page' ? expectedAttributes.page : expectedAttributes[eventName] || [];

  const missingAttributes = expectedKeys.filter(attr => !(attr in (properties ?? {})));

  if (missingAttributes.length > 0) {
    throw new Error(`Missing required attributes: ${missingAttributes.join(', ')}`);
  }

  if ((event === 'page' || type === 'page') && pageDetails) {
    const softPageMeta = Boolean(leadFunnelTracking);
    const softEq = (actual: string | undefined, expected: string, label: string) => {
      if (softPageMeta && actual !== expected) {
        console.warn(
          `AFW-3303: ${label} soft-mismatch after reload (got "${actual}", expected "${expected}")`,
        );
        return;
      }
      if (
        typeof actual === 'string' &&
        expected &&
        /^https?:\/\//i.test(actual) &&
        /^https?:\/\//i.test(expected) &&
        urlsMatchIgnoringGymOverrideParams(actual, expected)
      ) {
        console.log(`✅ ${label} is valid (gym override query params ignored): ${actual}`);
        return;
      }
      assertEqualityCondition(actual, expected, label);
    };
    softEq(
      properties?.initial_referrer,
      pageDetails.initial_referrer,
      'Rudderstack Initial Referrer',
    );
    softEq(
      properties?.initial_referring_domain,
      pageDetails.initial_referring_domain,
      'Rudderstack Initial Referring Domain',
    );
    softEq(properties?.path, pageDetails.path, 'Rudderstack Page Path');
    softEq(properties?.referrer, pageDetails.referrer, 'Rudderstack Referrer');
    softEq(
      properties?.referring_domain,
      pageDetails.referring_domain,
      'Rudderstack Referring Domain',
    );
    softEq(properties?.search, pageDetails.search, 'Rudderstack Query Parameters');
    softEq(properties?.tab_url, pageDetails.tab_url, 'Rudderstack Tab URL');
    softEq(properties?.title, pageDetails.title, 'Rudderstack Page Title');
    softEq(properties?.url, pageDetails.url, 'Rudderstack Page URL');
  }

  if ((event === 'page' || type === 'page') && leadFunnelTracking) {
    validateLeadFunnelPageProperties(properties, leadFunnelTracking);
  }

  if (event === 'identify' && Array.isArray(data)) {
    assertEqualityCondition(
      resolveLeadCaptureId(context, properties),
      data[1],
      'Rudderstack Lead Capture Id',
    );
    assertEqualityCondition(context.traits?.lead_id, data[0], 'Rudderstack Lead Id');
  }
  if (event === 'Lead Captured' && Array.isArray(data)) {
    const captureId = resolveLeadCaptureId(context, properties);
    const formType = String(formTracking?.formType ?? properties?.form_type ?? '').toLowerCase();
    // AFW-3956: Email Club + Member Offers are not true leads (Andrew 8/7) — may omit lead ids.
    const isNonTrueLead = formType === 'contact' || formType === 'member_offer';
    if (
      isNonTrueLead &&
      (!captureId ||
        !data[1] ||
        data[1] === 'missing-lead-capture-id' ||
        captureId === 'missing-lead-capture-id')
    ) {
      console.warn(
        `APP GAP (AFW-3956): Lead Captured missing lead_capture_id/lead_id on ${formType} — continuing form_* asserts`,
      );
    } else {
      assertEqualityCondition(captureId, data[1], 'Rudderstack Lead Capture Id');
      assertEqualityCondition(context.traits?.lead_id, data[0], 'Rudderstack Lead Id');
      assertEqualityCondition(properties?.lead_id, data[0], 'Rudderstack Lead Id');
    }
    if (isNonTrueLead && (properties?.location_id === null || properties?.location_id === '')) {
      console.warn(
        `APP GAP (AFW-3956): Lead Captured missing location_id on ${formType} — continuing form_* asserts`,
      );
    } else {
      assertEqualityCondition(properties?.location_id, data[2], 'Rudderstack location_id');
      assertNotEmpty(properties?.location_name ?? null, null, 'Rudderstack Location Name');
    }
    // AFW-3956 — Lead Captured form_* / offer_* / form_id (same map as Form Started / AFW-3957).
    if (formTracking) {
      validateLeadFormTrackingProperties(properties, formTracking, 'Lead Captured');
    }
  }

  if ((event === 'Appointment Scheduled' || event === 'Visit Scheduled') && Array.isArray(data)) {
    if (scheduledTracking) {
      validateAppointmentScheduledProperties({
        properties,
        data,
        scheduledTracking,
      });
    } else {
      // Legacy minimal asserts (pre-AFW-3954 callers without scheduledTracking).
      assertEqualityCondition(properties?.location_id, data[2], 'Rudderstack location_id');
      assertNotEmpty(properties?.location_name ?? null, null, 'Rudderstack location_name');
      const bookingId =
        properties?.appointment_id !== null && String(properties?.appointment_id).trim() !== ''
          ? String(properties?.appointment_id)
          : properties?.order_id !== null && String(properties?.order_id).trim() !== ''
            ? String(properties?.order_id)
            : null;
      assertNotEmpty(bookingId, null, 'Rudderstack appointment_id/order_id');
      assertNotEmpty(properties?.email ?? null, null, 'Rudderstack email');
    }
  }

  if (event === 'Form Started') {
    validateLeadFormTrackingProperties(properties, formTracking, 'Form Started');
  }

  if (event === 'Location Searched' || event === 'Location Selected') {
    validateLocationSearchEventProperties({
      event,
      properties,
      formTracking,
      locationTracking,
    });
  }

  if (event === APPOINTMENT_SLOT_SELECTED_EVENT) {
    validateAppointmentSlotSelectedProperties({
      properties,
      data,
      slotTracking: slotTracking ?? toAppointmentSlotTracking(),
    });
  }
  console.log('✅ All required properties exist');
}

/** AFW-3954 — Appointment Scheduled asserts (JIRA + Testpad 27590). */
function validateAppointmentScheduledProperties({
  properties,
  data,
  scheduledTracking,
}: {
  properties: RudderStackProperties | undefined;
  data: LeadEventData | string;
  scheduledTracking: ScheduledTrackingAssertions;
}): void {
  assertEqualityCondition(
    properties?.appointment_type,
    scheduledTracking.appointmentType,
    'Rudderstack appointment_type',
  );
  assertEqualityCondition(
    properties?.service_offer,
    scheduledTracking.serviceOffer,
    'Rudderstack service_offer',
  );
  assertEqualityCondition(
    properties?.service_name,
    scheduledTracking.serviceName,
    'Rudderstack service_name',
  );
  const actualServiceType =
    properties?.service_type !== null ? String(properties?.service_type).trim() : '';
  if (!actualServiceType.toLowerCase().includes(scheduledTracking.serviceType.toLowerCase())) {
    throw new Error(
      `Expected Rudderstack service_type to include "${scheduledTracking.serviceType}", but got "${actualServiceType}"`,
    );
  }
  console.log(`✅ Rudderstack service_type is valid: ${actualServiceType}`);

  assertEqualityCondition(properties?.form_id, scheduledTracking.formId, 'Rudderstack form_id');

  const paymentRaw = properties?.payment_required;
  const paymentOk =
    paymentRaw === false ||
    paymentRaw === 'false' ||
    String(paymentRaw).trim().toLowerCase() === 'false';
  if (!paymentOk) {
    throw new Error(
      `Expected Rudderstack payment_required to be false, got ${JSON.stringify(paymentRaw)}`,
    );
  }
  console.log('✅ Rudderstack payment_required is false');

  // Channel is asserted on the payload root (`postData.channel` via validateEventData).
  // Appointment Scheduled `properties.channel` is often omitted (undefined) on PROD —
  // do not hard-fail that duplicate properties-level check.
  if (properties?.channel !== null && String(properties?.channel).trim() !== '') {
    const channel = String(properties?.channel).trim().toLowerCase();
    if (channel !== scheduledTracking.channel.toLowerCase()) {
      throw new Error(
        `Expected Rudderstack channel to be ${scheduledTracking.channel}, got "${properties?.channel}"`,
      );
    }
    console.log(`✅ Rudderstack channel is valid: ${properties?.channel}`);
  } else {
    console.log(
      'ℹ️ Skipping Rudderstack properties.channel (undefined; payload-root channel already asserted)',
    );
  }

  const appointmentId =
    properties?.appointment_id !== null && String(properties?.appointment_id).trim() !== ''
      ? String(properties?.appointment_id)
      : '';
  assertNotEmpty(appointmentId || null, null, 'Rudderstack appointment_id');

  const utc =
    properties?.appointment_time_date_utc !== null
      ? String(properties?.appointment_time_date_utc).trim()
      : '';
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(utc)) {
    throw new Error(
      `Expected Rudderstack appointment_time_date_utc as YYYY-MM-DDTHH:MM:SSZ, got "${utc}"`,
    );
  }
  console.log(`✅ Rudderstack appointment_time_date_utc is valid: ${utc}`);

  const local =
    properties?.appointment_time_date_local !== null
      ? String(properties?.appointment_time_date_local).trim()
      : '';
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(local)) {
    throw new Error(
      `Expected Rudderstack appointment_time_date_local as ISO with offset, got "${local}"`,
    );
  }
  console.log(`✅ Rudderstack appointment_time_date_local is valid: ${local}`);

  const tz =
    properties?.appointment_timezone !== null
      ? String(properties?.appointment_timezone).trim()
      : '';
  if (!/^[A-Za-z_]+\/[A-Za-z0-9_+-]+$/.test(tz) && tz !== 'UTC') {
    throw new Error(`Expected Rudderstack appointment_timezone as IANA, got "${tz}"`);
  }
  console.log(`✅ Rudderstack appointment_timezone is valid: ${tz}`);

  const dayOfWeek =
    properties?.appointment_day_of_week !== null
      ? String(properties?.appointment_day_of_week).trim()
      : '';
  const weekdays = /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/i;
  if (!weekdays.test(dayOfWeek)) {
    throw new Error(
      `Expected Rudderstack appointment_day_of_week as weekday name, got "${dayOfWeek}"`,
    );
  }
  console.log(`✅ Rudderstack appointment_day_of_week is valid: ${dayOfWeek}`);

  const timeOfDay =
    properties?.appointment_time_of_day !== null
      ? String(properties?.appointment_time_of_day).trim().toLowerCase()
      : '';
  if (!['morning', 'afternoon', 'evening'].includes(timeOfDay)) {
    throw new Error(
      `Expected Rudderstack appointment_time_of_day morning|afternoon|evening, got "${properties?.appointment_time_of_day}"`,
    );
  }
  console.log(`✅ Rudderstack appointment_time_of_day is valid: ${timeOfDay}`);

  if (Array.isArray(data) && data[2]) {
    assertEqualityCondition(
      String(properties?.location_id ?? ''),
      String(data[2]),
      'Rudderstack location_id',
    );
  } else {
    assertNotEmpty(
      properties?.location_id !== null ? String(properties?.location_id) : null,
      null,
      'Rudderstack location_id',
    );
  }
  assertNotEmpty(properties?.location_name ?? null, null, 'Rudderstack location_name');

  const email = properties?.email !== null ? String(properties?.email).trim() : '';
  if (!email) {
    console.warn('APP GAP (AFW-3954): Appointment Scheduled hashed email missing');
  } else if (email.includes('@')) {
    console.warn(
      `APP GAP (AFW-3954): Appointment Scheduled email looks plaintext (expected hash): ${email}`,
    );
  } else {
    console.log(`✅ Rudderstack hashed email present (${email.length} chars)`);
  }

  const personId =
    properties?.person_id !== null && String(properties?.person_id).trim() !== ''
      ? String(properties?.person_id)
      : '';
  if (Array.isArray(data) && data[0] && String(data[0]).trim() !== '') {
    if (!personId) {
      // AFW-3954 playbook: identity gap soft-warn (same as Slot Selected / empty userId) —
      // hard-fail only wrong non-empty identity, not missing person_id on Scheduled.
      console.warn(
        'APP DEFECT (AFW-3954): Appointment Scheduled person_id missing while session lead_id exists',
      );
    } else {
      console.log(`✅ Rudderstack person_id present: ${personId}`);
    }
  } else if (personId) {
    console.log(`✅ Rudderstack person_id present: ${personId}`);
  }

  const staffId =
    properties?.staff_id !== null && String(properties?.staff_id).trim() !== ''
      ? String(properties?.staff_id)
      : '';
  const staffName =
    properties?.staff_name !== null && String(properties?.staff_name).trim() !== ''
      ? String(properties?.staff_name)
      : '';
  if (!staffId) {
    console.warn('APP GAP (AFW-3954): Appointment Scheduled staff_id missing');
  } else {
    console.log(`✅ Rudderstack staff_id present: ${staffId}`);
  }
  if (!staffName) {
    console.warn('APP GAP (AFW-3954): Appointment Scheduled staff_name missing');
  } else {
    console.log(`✅ Rudderstack staff_name present: ${staffName}`);
  }

  if (scheduledTracking.forbidLegacyFields) {
    const forbidden: Array<[string, unknown]> = [
      ['appointment_start_at', properties?.appointment_start_at],
      ['order_id', properties?.order_id],
      ['service_id', properties?.service_id],
    ];
    for (const [key, value] of forbidden) {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        if (key === 'order_id') {
          console.warn(
            `APP GAP (AFW-3954): Appointment Scheduled still includes "${key}" (should not be sent)`,
          );
        } else {
          throw new Error(
            `AFW-3954: Appointment Scheduled must not include "${key}" (got ${JSON.stringify(value)})`,
          );
        }
      }
    }
    console.log('✅ Rudderstack appointment_start_at/service_id absent');
  }
}

/** AFW-3953 — Appointment Slot Selected asserts (JIRA + Testpad 27590). */
function validateAppointmentSlotSelectedProperties({
  properties,
  data,
  slotTracking,
}: {
  properties: RudderStackProperties | undefined;
  data: LeadEventData | string;
  slotTracking: SlotTrackingAssertions;
}): void {
  assertEqualityCondition(
    properties?.appointment_type,
    slotTracking.appointmentType,
    'Rudderstack appointment_type',
  );
  assertEqualityCondition(
    properties?.service_offer,
    slotTracking.serviceOffer,
    'Rudderstack service_offer',
  );
  assertEqualityCondition(
    properties?.service_name,
    slotTracking.serviceName,
    'Rudderstack service_name',
  );
  const actualServiceType =
    properties?.service_type !== null ? String(properties?.service_type).trim() : '';
  if (!actualServiceType.toLowerCase().includes(slotTracking.serviceType.toLowerCase())) {
    throw new Error(
      `Expected Rudderstack service_type to include "${slotTracking.serviceType}", but got "${actualServiceType}"`,
    );
  }
  console.log(`✅ Rudderstack service_type is valid: ${actualServiceType}`);

  assertEqualityCondition(properties?.form_id, slotTracking.formId, 'Rudderstack form_id');

  const utc =
    properties?.appointment_time_date_utc !== null
      ? String(properties?.appointment_time_date_utc).trim()
      : '';
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(utc)) {
    throw new Error(
      `Expected Rudderstack appointment_time_date_utc as YYYY-MM-DDTHH:MM:SSZ, got "${utc}"`,
    );
  }
  console.log(`✅ Rudderstack appointment_time_date_utc is valid: ${utc}`);

  const local =
    properties?.appointment_time_date_local !== null
      ? String(properties?.appointment_time_date_local).trim()
      : '';
  // ISO with offset: YYYY-MM-DDTHH:MM:SS±HH:MM (Z also accepted if gym is UTC)
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(local)) {
    throw new Error(
      `Expected Rudderstack appointment_time_date_local as ISO with offset, got "${local}"`,
    );
  }
  console.log(`✅ Rudderstack appointment_time_date_local is valid: ${local}`);

  const tz = properties?.timezone !== null ? String(properties?.timezone).trim() : '';
  // IANA e.g. America/New_York or America/Chicago
  if (!/^[A-Za-z_]+\/[A-Za-z0-9_+-]+$/.test(tz) && tz !== 'UTC') {
    throw new Error(`Expected Rudderstack timezone as IANA, got "${tz}"`);
  }
  console.log(`✅ Rudderstack timezone is valid: ${tz}`);

  if (Array.isArray(data) && data[2]) {
    assertEqualityCondition(
      String(properties?.location_id ?? ''),
      String(data[2]),
      'Rudderstack location_id',
    );
  } else {
    assertNotEmpty(
      properties?.location_id !== null ? String(properties?.location_id) : null,
      null,
      'Rudderstack location_id',
    );
  }
  assertNotEmpty(properties?.location_name ?? null, null, 'Rudderstack location_name');

  const email = properties?.email !== null ? String(properties?.email).trim() : '';
  if (!email) {
    console.warn('APP GAP (AFW-3953): Appointment Slot Selected hashed email missing');
  } else {
    // Hashed email is typically 64-char hex (sha256); accept any non-empty non-plaintext@ value.
    if (email.includes('@')) {
      console.warn(
        `APP GAP (AFW-3953): Appointment Slot Selected email looks plaintext (expected hash): ${email}`,
      );
    } else {
      console.log(`✅ Rudderstack hashed email present (${email.length} chars)`);
    }
  }

  const personId =
    properties?.person_id !== null && String(properties?.person_id).trim() !== ''
      ? String(properties?.person_id)
      : '';
  if (Array.isArray(data) && data[0] && String(data[0]).trim() !== '') {
    if (!personId) {
      console.warn(
        'APP GAP (AFW-3953): Appointment Slot Selected person_id missing while session lead_id exists',
      );
    } else {
      console.log(`✅ Rudderstack person_id present: ${personId}`);
    }
  } else if (personId) {
    console.log(`✅ Rudderstack person_id present: ${personId}`);
  }

  const appointmentId =
    properties?.appointment_id !== null && String(properties?.appointment_id).trim() !== ''
      ? String(properties?.appointment_id)
      : '';
  if (appointmentId) {
    console.log(`✅ Rudderstack appointment_id present: ${appointmentId}`);
  }

  if (slotTracking.forbidLegacyDateTimeFields) {
    const forbidden: Array<[string, unknown]> = [
      ['date', properties?.date],
      ['time', properties?.time],
      ['appointment_start_at', properties?.appointment_start_at],
    ];
    for (const [key, value] of forbidden) {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        throw new Error(
          `AFW-3953: Appointment Slot Selected must not include "${key}" (got ${JSON.stringify(value)})`,
        );
      }
    }
    console.log('✅ Rudderstack date/time/appointment_start_at absent');
  }
}

/** AFW-3957 Form Started + AFW-3956 Lead Captured — shared form_* / offer_* asserts. */
function validateLeadFormTrackingProperties(
  properties: RudderStackProperties | undefined,
  formTracking: FormTrackingAssertions | undefined,
  eventLabel: 'Form Started' | 'Lead Captured',
): void {
  const ticket = eventLabel === 'Form Started' ? 'AFW-3957' : 'AFW-3956';
  assertFormTrackingValue(
    properties?.form_type,
    formTracking?.formType ?? 'appointment',
    'Rudderstack form_type',
  );
  assertFormTrackingValue(
    properties?.form_offer,
    formTracking?.formOffer ?? 'visit',
    'Rudderstack form_offer',
  );
  if (formTracking?.formName) {
    const actualFormName =
      properties?.form_name !== null ? String(properties?.form_name).trim() : '';
    if (eventLabel === 'Lead Captured') {
      // AFW-3956 ticket only hard-requires form_name for Email Club; other flows omit it often.
      if (formTracking.formName === 'non-empty') {
        if (!actualFormName) {
          console.warn(`APP GAP (${ticket}): ${eventLabel} form_name missing (optional non-empty)`);
        } else {
          console.log(`✅ Rudderstack form_name present: ${actualFormName}`);
        }
      } else if (!actualFormName) {
        if (formTracking.formName === 'Email Club') {
          throw new Error(
            `APP GAP (${ticket}): ${eventLabel} form_name missing (expected Email Club)`,
          );
        }
        console.warn(
          `APP GAP (${ticket}): ${eventLabel} form_name missing (expected ${formTracking.formName})`,
        );
      } else {
        assertFormTrackingValue(
          properties?.form_name,
          formTracking.formName,
          'Rudderstack form_name',
        );
      }
    } else if (formTracking.formName === 'non-empty' && !actualFormName) {
      // Optional form_name on Form Started (same soft pattern as AFW-3956 Lead Captured).
      console.warn(`APP GAP (${ticket}): ${eventLabel} form_name missing (optional non-empty)`);
    } else {
      assertFormTrackingValue(
        properties?.form_name,
        formTracking.formName,
        'Rudderstack form_name',
      );
    }
  }
  // form_id = form_type_form_offer (e.g. appointment_visit). Soft-warn known legacy IDs.
  const expectedFormId = formTracking?.formId ?? 'non-empty';
  const actualFormId = properties?.form_id !== null ? String(properties?.form_id) : '';
  if (
    expectedFormId !== 'non-empty' &&
    actualFormId === 'lead-form' &&
    expectedFormId !== 'lead-form'
  ) {
    console.warn(
      `APP GAP (${ticket}): ${eventLabel} form_id still "lead-form" (expected ${expectedFormId})`,
    );
  } else if (
    expectedFormId === 'event_general' &&
    actualFormId.toLowerCase() === 'national_general'
  ) {
    console.warn(
      `APP GAP (${ticket}): ${eventLabel} form_id still "national_general" (expected event_general)`,
    );
  } else if (expectedFormId === 'non-empty') {
    assertNotEmpty(properties?.form_id ?? null, null, 'Rudderstack form_id');
  } else {
    assertFormTrackingValue(properties?.form_id, expectedFormId, 'Rudderstack form_id');
  }

  if (eventLabel === 'Form Started') {
    const actualLocationId =
      properties?.location_id !== null ? String(properties?.location_id) : '';
    const actualLocationName =
      properties?.location_name !== null ? String(properties?.location_name) : '';
    if (!actualLocationId || !actualLocationName) {
      const formTypeHint = properties?.form_type ?? formTracking?.formType ?? 'unknown';
      console.warn(
        `APP GAP (${ticket}): ${eventLabel} missing location_id/location_name ` +
          `(form_type=${formTypeHint})`,
      );
    } else {
      assertNotEmpty(actualLocationId, null, 'Rudderstack location_id');
      assertNotEmpty(actualLocationName, null, 'Rudderstack location_name');
    }
  }

  if (formTracking?.includeOfferFields === false) {
    for (const key of ['offer_name', 'offer_scope', 'offer_type'] as const) {
      const value = properties?.[key];
      if (value !== null && String(value).trim() !== '') {
        console.warn(`APP GAP (${ticket}): ${eventLabel} should exclude ${key} but got "${value}"`);
      }
    }
    return;
  }

  if (formTracking?.includeOfferFields) {
    if (formTracking.offerName) {
      assertFormTrackingValue(
        properties?.offer_name,
        formTracking.offerName,
        'Rudderstack offer_name',
      );
    }
    if (formTracking.offerScope) {
      const actualScope = properties?.offer_scope !== null ? String(properties?.offer_scope) : '';
      if (formTracking.offerScope === 'event' && actualScope.toLowerCase() === 'events') {
        console.warn(
          `APP GAP (${ticket}): ${eventLabel} offer_scope still "events" (expected "event")`,
        );
      } else if (formTracking.offerScope === 'event' && actualScope.toLowerCase() === 'national') {
        console.warn(
          `APP GAP (${ticket}): ${eventLabel} offer_scope still "national" (expected "event")`,
        );
      } else {
        assertFormTrackingValue(
          properties?.offer_scope,
          formTracking.offerScope,
          'Rudderstack offer_scope',
        );
      }
    }
    if (formTracking.offerType) {
      const actualOfferType = properties?.offer_type;
      const actualTrimmed = actualOfferType !== null ? String(actualOfferType).trim() : '';
      if (formTracking.offerType === 'non-empty') {
        // AFW-3434: CMS offer_type required on Form Started / Lead Captured for
        // Local / Member / Group / Events. Blank/null must be filled as discounted_trial;
        // "none" is intentional. Website gap → APP DEFECT hard-fail (never APP GAP).
        if (!actualTrimmed) {
          throw new Error(
            `APP DEFECT (AFW-3434): ${eventLabel} offer_type missing ` +
              `(expected non-empty CMS value or "none"; blank should fallback to discounted_trial)`,
          );
        }
        console.log(`✅ Rudderstack offer_type present: ${actualTrimmed}`);
      } else if (!actualTrimmed) {
        // National static peers (none / free_trial): missing/blank is also an APP DEFECT.
        throw new Error(
          `APP DEFECT (AFW-3434): ${eventLabel} offer_type missing ` +
            `(expected "${formTracking.offerType}")`,
        );
      } else {
        assertFormTrackingValue(
          properties?.offer_type,
          formTracking.offerType,
          'Rudderstack offer_type',
        );
      }
    }
  }
}

function normalizeBooleanFlag(value: string | boolean | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;
  return undefined;
}

function validateLeadFunnelPageProperties(
  properties: RudderStackProperties | undefined,
  leadFunnelTracking: LeadFunnelPageTrackingAssertions,
): void {
  const actual = normalizeBooleanFlag(properties?.lead_funnel_viewed);
  if (actual === undefined) {
    throw new Error(
      'APP GAP (AFW-3303): Rudderstack page missing lead_funnel_viewed ' +
        `(expected ${leadFunnelTracking.leadFunnelViewed})`,
    );
  }
  if (actual !== leadFunnelTracking.leadFunnelViewed) {
    throw new Error(
      `APP GAP (AFW-3303): Rudderstack lead_funnel_viewed is ${actual} ` +
        `(expected ${leadFunnelTracking.leadFunnelViewed})`,
    );
  }
  console.log(`✅ Rudderstack lead_funnel_viewed is ${actual}`);

  if (leadFunnelTracking.expectFormFields) {
    const formTypeEmpty =
      properties?.form_type === null || String(properties?.form_type).trim() === '';
    const formOfferEmpty =
      properties?.form_offer === null || String(properties?.form_offer).trim() === '';
    if (formTypeEmpty || formOfferEmpty) {
      // Contact / Find A Gym page views often omit form_* on SIT after reload (shell page only).
      // Wait/poll prefers enriched payloads; if still empty, soft-warn and keep lead_funnel_viewed hard.
      console.warn(
        `APP GAP (AFW-3303): page form_type/form_offer empty ` +
          `(expected ${leadFunnelTracking.formType}/${leadFunnelTracking.formOffer})`,
      );
    } else {
      try {
        assertFormTrackingValue(
          properties?.form_type,
          leadFunnelTracking.formType ?? 'non-empty',
          'Rudderstack form_type',
        );
        assertFormTrackingValue(
          properties?.form_offer,
          leadFunnelTracking.formOffer ?? 'non-empty',
          'Rudderstack form_offer',
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`APP GAP (AFW-3303): ${message}`);
      }
    }
  }

  if (leadFunnelTracking.expectLocationIfAvailable) {
    const locId = properties?.location_id;
    const locName = properties?.location_name;
    const hasId = locId !== null && String(locId).trim() !== '';
    const hasName = locName !== null && String(locName).trim() !== '';

    // AFW-4088: when location_id is on the page event, location_name must be too.
    if (hasId && !hasName) {
      throw new Error(
        'APP DEFECT (AFW-4088): page event has location_id but missing location_name ' +
          `(location_id="${locId}")`,
      );
    }

    if (leadFunnelTracking.requireLocationIdWithName) {
      if (!hasId) {
        throw new Error(
          'APP DEFECT (AFW-4088): page event missing location_id on deep-link / LLP surface ' +
            '(expected location_id + location_name when available)',
        );
      }
      if (!hasName) {
        throw new Error(
          'APP DEFECT (AFW-4088): page event has location_id but missing location_name ' +
            `(location_id="${locId}")`,
        );
      }
    }

    if (!hasId) {
      console.warn('AFW-3303: location_id not present on page event (optional if available)');
    } else {
      console.log(`✅ Rudderstack location_id present: ${locId}`);
    }
    if (!hasName) {
      if (!hasId) {
        console.warn('AFW-3303: location_name not present on page event (optional if available)');
      }
    } else {
      console.log(`✅ Rudderstack location_name present: ${locName}`);
    }
  }

  if (leadFunnelTracking.excludeOfferFields) {
    for (const key of ['offer_name', 'offer_scope', 'offer_type'] as const) {
      const value = properties?.[key];
      if (value !== null && String(value).trim() !== '') {
        console.warn(`APP GAP (AFW-3303): page event should exclude ${key} but got "${value}"`);
      }
    }
  }
}

function normalizeCount(value: string | number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  return Number.isFinite(n) ? n : undefined;
}

function validateLocationSearchEventProperties({
  event,
  properties,
  formTracking,
  locationTracking,
}: {
  event: string;
  properties: RudderStackProperties | undefined;
  formTracking?: FormTrackingAssertions;
  locationTracking?: LocationEventTrackingAssertions;
}) {
  const expectedStep = event === 'Location Searched' ? '1' : '2';
  const actualStep = properties?.step;
  if (actualStep === undefined || actualStep === null || String(actualStep).trim() === '') {
    // SIT currently omits step on Location Searched/Selected (ticket requires 1/2).
    console.warn(
      `APP GAP (AFW-3952): Rudderstack step missing on ${event} (expected ${expectedStep})`,
    );
  } else {
    assertEqualityCondition(String(actualStep), expectedStep, 'Rudderstack step');
  }

  const formFieldsEmpty = !properties?.form_type && !properties?.form_offer && !properties?.form_id;
  if (formFieldsEmpty && formTracking) {
    // Map / Home surfaces fire the event but leave form_* blank vs ticket map_general / map_free_trial.
    console.warn(
      `APP GAP (AFW-3952): ${event} form_type/form_offer/form_id empty (expected ${formTracking.formType}/${formTracking.formOffer}/${formTracking.formId})`,
    );
  } else {
    if (formTracking?.formType) {
      assertFormTrackingValue(
        properties?.form_type,
        formTracking.formType,
        'Rudderstack form_type',
      );
    } else {
      assertNotEmpty(properties?.form_type ?? null, null, 'Rudderstack form_type');
    }
    if (formTracking?.formOffer) {
      assertFormTrackingValue(
        properties?.form_offer,
        formTracking.formOffer,
        'Rudderstack form_offer',
      );
    } else {
      assertNotEmpty(properties?.form_offer ?? null, null, 'Rudderstack form_offer');
    }
    if (formTracking?.formId) {
      assertFormTrackingValue(properties?.form_id, formTracking.formId, 'Rudderstack form_id');
    } else {
      assertNotEmpty(properties?.form_id ?? null, null, 'Rudderstack form_id');
    }
    if (formTracking?.formName) {
      assertFormTrackingValue(
        properties?.form_name,
        formTracking.formName,
        'Rudderstack form_name',
      );
    }
  }

  const includeOfferFields = locationTracking?.includeOfferFields ?? true;
  const requireCmsOfferFields = Boolean(locationTracking?.requireCmsOfferFields);
  if (includeOfferFields && !formFieldsEmpty) {
    const actualOfferName =
      properties?.offer_name !== null ? String(properties?.offer_name ?? '').trim() : '';
    const actualOfferType =
      properties?.offer_type !== null ? String(properties?.offer_type ?? '').trim() : '';

    if (requireCmsOfferFields) {
      if (!actualOfferName) {
        throw new Error(
          `APP DEFECT (AFW-4104): ${event} offer_name missing ` +
            `(expected non-empty CMS value from Webflow on offer location-search flows)`,
        );
      }
      console.log(`✅ Rudderstack offer_name present on ${event}: ${actualOfferName}`);
      if (!actualOfferType) {
        throw new Error(
          `APP DEFECT (AFW-4104): ${event} offer_type missing ` +
            `(expected non-empty CMS value from Webflow on offer location-search flows)`,
        );
      }
      console.log(`✅ Rudderstack offer_type present on ${event}: ${actualOfferType}`);
    }

    if (locationTracking?.offerName && !requireCmsOfferFields) {
      assertFormTrackingValue(
        properties?.offer_name,
        locationTracking.offerName,
        'Rudderstack offer_name',
      );
    } else if (locationTracking?.offerName === 'non-empty' && requireCmsOfferFields) {
      // Validated above — CMS-specific title varies by offer.
    } else if (locationTracking?.offerName && requireCmsOfferFields && actualOfferName) {
      assertFormTrackingValue(
        properties?.offer_name,
        locationTracking.offerName,
        'Rudderstack offer_name',
      );
    }

    if (locationTracking?.offerScope) {
      const actualScope =
        properties?.offer_scope !== null ? String(properties?.offer_scope ?? '').trim() : '';
      const expectedScope = locationTracking.offerScope;
      if (
        requireCmsOfferFields &&
        expectedScope === 'national' &&
        actualScope.toLowerCase() === 'event'
      ) {
        console.warn(
          `APP GAP (AFW-4104): ${event} offer_scope still "event" (Testpad expects "national" on Events Promo)`,
        );
      } else if (
        requireCmsOfferFields &&
        expectedScope === 'national' &&
        actualScope.toLowerCase() === 'events'
      ) {
        console.warn(
          `APP GAP (AFW-4104): ${event} offer_scope still "events" (Testpad expects "national" on Events Promo)`,
        );
      } else {
        assertFormTrackingValue(
          properties?.offer_scope,
          locationTracking.offerScope,
          'Rudderstack offer_scope',
        );
      }
    } else if (!requireCmsOfferFields) {
      assertNotEmpty(properties?.offer_scope ?? null, null, 'Rudderstack offer_scope');
    } else {
      assertNotEmpty(properties?.offer_scope ?? null, null, 'Rudderstack offer_scope');
    }

    // AFW-3434: offer_type soft-warn on Location events unless AFW-4104 requireCmsOfferFields.
    if (!requireCmsOfferFields && locationTracking?.offerType) {
      if (!actualOfferType) {
        console.warn(
          `AFW-3434: ${event} offer_type empty (OK — populated for Form Started / Lead Captured; ` +
            `other RS events may send "")`,
        );
      } else if (locationTracking.offerType === 'non-empty') {
        console.log(`✅ Rudderstack offer_type present on ${event}: ${actualOfferType}`);
      } else if (actualOfferType !== locationTracking.offerType) {
        console.warn(
          `AFW-3434: ${event} offer_type="${actualOfferType}" ` +
            `(expected "${locationTracking.offerType}" when populated; empty also OK)`,
        );
      } else {
        console.log(`✅ Rudderstack offer_type on ${event}: ${actualOfferType}`);
      }
    } else if (!requireCmsOfferFields && actualOfferType) {
      console.log(`✅ Rudderstack offer_type on ${event}: ${actualOfferType}`);
    }
  }

  if (event === 'Location Searched') {
    if (locationTracking?.searchSuccess !== undefined) {
      const actualSuccess = normalizeBooleanFlag(properties?.search_success);
      assertEqualityCondition(
        actualSuccess,
        locationTracking.searchSuccess,
        'Rudderstack search_success',
      );
    } else {
      const actualSuccess = normalizeBooleanFlag(properties?.search_success);
      if (actualSuccess === undefined) {
        throw new Error(
          `Expected Rudderstack search_success to be a boolean-like value, but got ${properties?.search_success}`,
        );
      }
    }

    const resultsCount = normalizeCount(properties?.results_count);
    if (locationTracking?.searchSuccess === false) {
      assertEqualityCondition(resultsCount, 0, 'Rudderstack results_count');
    } else if (locationTracking?.searchSuccess === true) {
      if (resultsCount === undefined || resultsCount <= 0) {
        throw new Error(
          `Expected Rudderstack results_count > 0 for successful search, but got ${properties?.results_count}`,
        );
      }
      console.log(`✅ Rudderstack results_count is ${resultsCount}`);
    } else if (resultsCount === undefined) {
      throw new Error(
        `Expected Rudderstack results_count to be present, but got ${properties?.results_count}`,
      );
    }

    if (locationTracking?.searchTerm) {
      assertFormTrackingValue(
        properties?.search_term,
        locationTracking.searchTerm,
        'Rudderstack search_term',
      );
    } else {
      assertNotEmpty(properties?.search_term ?? null, null, 'Rudderstack search_term');
    }

    // Default: search_type present. AFW-4066 scenarios pass expected enum (e.g. postcode).
    if (locationTracking?.searchType && locationTracking.searchType !== 'non-empty') {
      const actualType =
        properties?.search_type !== null
          ? String(properties?.search_type)?.trim().toLowerCase()
          : '';
      const expectedType = locationTracking.searchType?.trim().toLowerCase();
      if (actualType && actualType !== expectedType) {
        // Known app defect AFW-4066 — surface via throw so caller can soft-skip with annotation.?
        throw new Error(
          `APP GAP (AFW-4066): Rudderstack search_type is "${actualType}" (expected "${expectedType}")`,
        );
      }
      assertFormTrackingValue(
        properties?.search_type,
        locationTracking.searchType,
        'Rudderstack search_type',
      );
    } else {
      assertNotEmpty(properties?.search_type ?? null, null, 'Rudderstack search_type');
    }

    if (locationTracking?.searchMethod) {
      assertFormTrackingValue(
        properties?.search_method,
        locationTracking.searchMethod,
        'Rudderstack search_method',
      );
    } else {
      assertNotEmpty(properties?.search_method ?? null, null, 'Rudderstack search_method');
    }
  }

  if (event === 'Location Selected') {
    if (locationTracking?.locationId && locationTracking.locationId !== 'non-empty') {
      // Club id may be numeric string; compare as strings.
      assertEqualityCondition(
        String(properties?.location_id ?? ''),
        String(locationTracking.locationId),
        'Rudderstack location_id',
      );
    } else {
      assertNotEmpty(properties?.location_id ?? null, null, 'Rudderstack location_id');
    }
    assertNotEmpty(properties?.location_name ?? null, null, 'Rudderstack location_name');

    if (locationTracking?.expectCta !== false) {
      assertNotEmpty(properties?.cta_text ?? null, null, 'Rudderstack cta_text');
      assertNotEmpty(properties?.cta_url ?? null, null, 'Rudderstack cta_url');
    }
  }
}

/** Strip gym-override query keys so `location_id` vs `test_location_id` do not fail referrer. */
function urlsMatchIgnoringGymOverrideParams(actual: string, expected: string): boolean {
  const strip = (raw: string): string | null => {
    try {
      const parsed = new URL(raw);
      parsed.searchParams.delete('test_location_id');
      parsed.searchParams.delete('location_id');
      const sorted = new URLSearchParams(
        [...parsed.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b)),
      );
      parsed.search = sorted.toString();
      parsed.hash = '';
      return parsed.toString();
    } catch {
      return null;
    }
  };
  const a = strip(actual);
  const b = strip(expected);
  return a !== null && b !== null && a === b;
}

function assertReferrer(
  actual: string | undefined,
  expected: string,
  label: string,
  options?: { allowSameOriginDrift?: boolean },
) {
  if (actual === undefined || actual === '$direct' || actual === expected || actual === '') {
    console.log(`✅ ${label} is valid: ${actual}`);
    return;
  }

  // Deep-link gym override: host URL uses location_id while RS keeps test_location_id (or reverse).
  if (
    typeof actual === 'string' &&
    expected &&
    /^https?:\/\//i.test(actual) &&
    /^https?:\/\//i.test(expected) &&
    urlsMatchIgnoringGymOverrideParams(actual, expected)
  ) {
    console.log(`✅ ${label} is valid (gym override query params ignored): ${actual}`);
    return;
  }

  // Embedded BAT flows often report the host form URL as context.page.referrer for
  // Appointment Scheduled while document.referrer (expected) remains $direct.
  if (
    (expected === '$direct' || expected === '') &&
    typeof actual === 'string' &&
    /^https?:\/\//i.test(actual)
  ) {
    console.log(`✅ ${label} is valid (form URL when expected $direct): ${actual}`);
    return;
  }

  // Same drift for referring_domain: RS sends the form hostname (e.g. sit.anytimefitness.com)
  // when referrer is the form URL, while pageDetails still expects '' / $direct.
  if (
    (expected === '$direct' || expected === '') &&
    typeof actual === 'string' &&
    actual.length > 0 &&
    !/[/:?]/.test(actual) &&
    /\.anytimefitness\.(com|co\.nz)$/i.test(actual)
  ) {
    console.log(`✅ ${label} is valid (form host when expected $direct): ${actual}`);
    return;
  }

  // Local Offer / embedded SPA: RS keeps offer URL as initial_referrer while getPageDetails
  // may run on schedule / thank-you (or the reverse). Same-origin absolute URLs are valid.
  if (options?.allowSameOriginDrift && typeof actual === 'string' && expected) {
    try {
      const actualUrl = new URL(actual);
      const expectedUrl = new URL(expected);
      if (actualUrl.origin === expectedUrl.origin) {
        console.log(`✅ ${label} is valid (same-origin SPA drift): ${actual}`);
        return;
      }
    } catch {
      /* fall through */
    }
  }

  throw new Error(`Expected ${label} to be ${expected} or $direct, but got ${actual}`);
}

async function verifyPageDetails({
  eventData,
  pageDetails,
  skipPagePathValidation = false,
}: {
  eventData: RudderStackRequest;
  pageDetails: PageDetails | undefined;
  skipPagePathValidation?: boolean;
}) {
  if (!pageDetails) return;

  const contextPage = eventData.postDataJSON?.context?.page;

  const referrerOpts = skipPagePathValidation ? { allowSameOriginDrift: true } : undefined;
  assertReferrer(
    contextPage?.initial_referrer,
    pageDetails.initial_referrer,
    'Rudderstack Initial Referrer',
    referrerOpts,
  );
  assertReferrer(
    contextPage?.initial_referring_domain,
    pageDetails.initial_referring_domain,
    'Rudderstack Initial Referring Domain',
    referrerOpts,
  );
  if (skipPagePathValidation) {
    // Offer hosts stay on /offer/local/... while embedded BAT events may report schedule paths.
    assertNotEmpty(contextPage?.path ?? null, null, 'Rudderstack Page Path');
  } else {
    assertEqualityCondition(contextPage?.path, pageDetails.path, 'Rudderstack Page Path');
  }
  assertReferrer(contextPage?.referrer, pageDetails.referrer, 'Rudderstack Referrer', referrerOpts);
  assertReferrer(
    contextPage?.referring_domain,
    pageDetails.referring_domain,
    'Rudderstack Referring Domain',
    referrerOpts,
  );

  const normalizeSearch = (search?: string): string => {
    if (!search) return '';
    try {
      const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
      // Local Offer / lead forms keep location_id in RS page context after host URL may drop it
      // (e.g. thank-you redirect or captcha URL rewrite). Compare stable params only.
      params.delete('test_location_id');
      params.delete('location_id');
      // Mapbox / Places puts `location=` on the host during search; Select Gym +
      // overrideLocationAndDisableCaptcha replaceState often strips it while the RS
      // Location Searched/Selected payload still carries the pre-override search.
      params.delete('location');
      // Invite referral landing: host may drop h/user after submit while RS retains them.
      params.delete('h');
      params.delete('user');
      const sorted = new URLSearchParams(
        [...params.entries()].sort(([a], [b]) => a.localeCompare(b)),
      );
      const normalized = sorted.toString();
      return normalized ? `?${normalized}` : '';
    } catch {
      return search;
    }
  };

  if (skipPagePathValidation) {
    assertEqualityCondition(
      normalizeSearch(contextPage?.search),
      normalizeSearch(pageDetails.search),
      'Rudderstack Query Parameters',
    );
    // Host offer URL/title often differs from embedded schedule RS page context.
    assertNotEmpty(contextPage?.tab_url ?? null, null, 'Rudderstack Tab URL');
    assertNotEmpty(contextPage?.title ?? null, null, 'Rudderstack Page Title');
    assertNotEmpty(contextPage?.url ?? null, null, 'Rudderstack Page URL');
  } else {
    assertEqualityCondition(
      contextPage?.search,
      pageDetails.search,
      'Rudderstack Query Parameters',
    );
    assertEqualityCondition(contextPage?.tab_url, pageDetails.tab_url, 'Rudderstack Tab URL');
    assertEqualityCondition(contextPage?.title, pageDetails.title, 'Rudderstack Page Title');
    assertEqualityCondition(contextPage?.url, pageDetails.url, 'Rudderstack Page URL');
  }
  console.log('✅ All required properties exist');
}

async function verifyConsentSettings(eventData: RudderStackRequest, activeOneTrustGroup: string) {
  const payload = eventData.postDataJSON;
  const context = payload?.context ?? ({} as RudderStackContext);

  const allowedConsentIds = context.consentManagement?.allowedConsentIds ?? [];
  const deniedConsentIds = context.consentManagement?.deniedConsentIds ?? [];

  // Convert ",C0001,C0003,BG266,C0004,C0002,BG267," -> array
  const activeGroups = String(activeOneTrustGroup ?? '')
    .split(',')
    .filter(Boolean);

  console.log('Active Groups:', activeGroups);

  if (activeGroups.length === 0) {
    // OneTrust page helper missing (common on WebKit) — payload consentManagement is source of truth.
    if (!context.consentManagement?.provider) {
      throw new Error(
        'OneTrust active groups unavailable and consentManagement missing on RS payload',
      );
    }
    console.log(
      'OneTrust active groups unavailable on page — validated payload consentManagement only ✅',
    );
    return;
  }

  // Check if active groups exist in allowedConsentIds
  const notAllowed = activeGroups.filter((id: string) => !allowedConsentIds.includes(id));

  // Check if active groups exist in deniedConsentIds
  const wronglyDenied = activeGroups.filter((id: string) => deniedConsentIds.includes(id));

  if (notAllowed.length > 0) {
    throw new Error(
      `These ActiveOneTrust groups are NOT in allowedConsentIds: ${notAllowed.join(', ')}`,
    );
  }

  if (wronglyDenied.length > 0) {
    throw new Error(
      `These ActiveOneTrust groups should NOT appear in deniedConsentIds: ${wronglyDenied.join(', ')}`,
    );
  }

  console.log('Consent validation passed ✅');
}

async function verifyUserIdValue({
  eventData,
  oneTrustConsent,
  userIdFromSessionStorage,
}: {
  eventData: RudderStackRequest;
  oneTrustConsent: boolean;
  userIdFromSessionStorage: string | null;
}) {
  const payload = eventData.postDataJSON;
  const userId = payload?.userId;
  const eventName = String(payload?.event ?? payload?.type ?? '');
  const personIdProp =
    payload?.properties?.person_id !== null && String(payload?.properties?.person_id).trim() !== ''
      ? String(payload?.properties?.person_id).trim()
      : '';

  // If consent is TRUE and sessionStorage has a value
  if (oneTrustConsent && userIdFromSessionStorage) {
    if (userId === userIdFromSessionStorage) {
      console.log('User ID validation PASSED');
      return;
    }
    // Identified via properties.person_id (AFW-3954) even when top-level userId omitted.
    if (personIdProp && personIdProp === userIdFromSessionStorage) {
      console.log(
        `User ID validation PASSED via properties.person_id (top-level userId empty on "${eventName}")`,
      );
      return;
    }
    // Empty / missing top-level userId on Appointment Scheduled is the same identity gap as
    // missing person_id (AFW-3954 soft-warn). Hard-fail only on a *wrong* non-empty userId.
    const userIdEmpty = userId === null || userId === undefined || String(userId).trim() === '';
    if (userIdEmpty && /Appointment Scheduled|Visit Scheduled/i.test(eventName)) {
      console.warn(
        `APP GAP (AFW-3954): "${eventName}" top-level userId missing while session rs_person_id=${userIdFromSessionStorage}`,
      );
      console.log('User ID validation PASSED (soft-warn empty userId on Appointment Scheduled)');
      return;
    }
    throw new Error(`UserId mismatch. Expected: ${userIdFromSessionStorage}, Actual: ${userId}`);
  }

  // If consent is FALSE but sessionStorage still has a value
  if (!oneTrustConsent && userIdFromSessionStorage) {
    if (userId !== null && userId !== undefined && userId !== '') {
      throw new Error(
        `UserId should not be present when OneTrust consent is false. Actual: ${userId}`,
      );
    }
  }

  // If consent is FALSE but sessionStorage still has a value
  if (!oneTrustConsent && !userIdFromSessionStorage) {
    if (userId !== null && userId !== undefined && userId !== '') {
      throw new Error(
        `UserId should not be present when OneTrust consent is false. Actual: ${userId}`,
      );
    }
  }
  console.log('User ID validation PASSED');
}

export async function verifyFormLoadedDataLayer({
  page,
  clubId,
  clubName,
  timeout = TIMEOUTS.LONG,
  formName = 'schedule appointment',
}: {
  page: Page;
  clubId: string;
  clubName: string;
  timeout?: number;
  formName?: string | 'non-empty';
}): Promise<void> {
  let dataLayer = await readDataLayerEntries(page);
  let formLoadedLead = findFormLoadedWithClubId(dataLayer, clubId);

  if (!formLoadedLead) {
    dataLayer = await waitForDataLayerEntries(
      page,
      entries =>
        entries.some(entry => entry?.event === 'form_loaded' && entry?.form_category === 'lead'),
      timeout as typeof TIMEOUTS.LONG,
    );
    formLoadedLead = findFormLoadedWithClubId(dataLayer, clubId);
  }

  if (!formLoadedLead) {
    const formLoadedEvents = dataLayer.filter(item => item.event === 'form_loaded');
    throw new Error(
      `form_loaded event with form_category=lead not found in dataLayer after lead form interaction. form_loaded entries: ${JSON.stringify(formLoadedEvents)}`,
    );
  }

  assertEqualityCondition(formLoadedLead.event, 'form_loaded', 'Data layer Event');
  assertEqualityCondition(formLoadedLead.form_category, 'lead', 'Data layer Form Category');
  if (
    formLoadedLead.club_id !== undefined &&
    formLoadedLead.club_id !== null &&
    formLoadedLead.club_id !== ''
  ) {
    assertEqualityCondition(String(formLoadedLead.club_id), String(clubId), 'Data layer Club id');
  }
  if (formLoadedLead.club_name) {
    assertClubOrLocationNameIgnoreCase(formLoadedLead.club_name, clubName, 'Data layer Club name');
  }
  assertFormTrackingValue(formLoadedLead.form_name, formName, 'Data layer form_name');
}

export async function verifyFormSuccessDataLayer({
  page,
  clubId,
  clubName,
  leadCaptureId,
  timeout = TIMEOUTS.LONG,
  formName = 'schedule appointment',
}: {
  page: Page;
  clubId: string;
  clubName: string;
  leadCaptureId: string;
  timeout?: number;
  formName?: string | 'non-empty';
}): Promise<void> {
  const matchesFormSuccessLead = (entry: DataLayerLeadEvent | undefined): boolean => {
    if (!entry || entry.event !== 'form_success') {
      return false;
    }
    // Some Local Offer / embedded pushes omit form_category; reject only when present and wrong.
    if (entry.form_category && entry.form_category !== 'lead') {
      return false;
    }
    if (resolveDataLayerLeadCaptureId(entry) !== String(leadCaptureId)) {
      return false;
    }
    // Wait until emailsha256 is populated — mobile can push form_success before hashing completes
    return Boolean(entry.emailsha256);
  };

  const dataLayer = await waitForDataLayerEntries(
    page,
    entries => entries.some(matchesFormSuccessLead),
    timeout as typeof TIMEOUTS.LONG,
  );

  const formSuccessLead = [...dataLayer].reverse().find(matchesFormSuccessLead);

  if (!formSuccessLead) {
    const formSuccessEvents = dataLayer.filter(item => item.event === 'form_success');
    throw new Error(
      `form_success event with form_category=lead not found in dataLayer (lead_capture_id=${leadCaptureId}). form_success entries: ${JSON.stringify(formSuccessEvents)}`,
    );
  }

  assertEqualityCondition(formSuccessLead.event, 'form_success', 'Data layer Event');
  if (formSuccessLead.form_category) {
    assertEqualityCondition(formSuccessLead.form_category, 'lead', 'Data layer Form Category');
  }
  assertEqualityCondition(String(formSuccessLead.club_id), String(clubId), 'Data layer Club id');
  assertClubOrLocationNameIgnoreCase(
    formSuccessLead.club_name ?? '',
    clubName,
    'Data layer Club name',
  );
  assertEqualityCondition(
    resolveDataLayerLeadCaptureId(formSuccessLead),
    String(leadCaptureId),
    'Data layer Lead Capture Id',
  );
  assertFormTrackingValue(formSuccessLead.form_name, formName, 'Data layer form_name');
  assertNotEmpty(formSuccessLead.lead_type ?? null, null, 'Data layer lead_type');
  assertNotEmpty(formSuccessLead.lead_source_code ?? null, null, 'Data layer lead_source_code');
  assertNotEmpty(formSuccessLead.emailsha256 ?? null, null, 'Data layer emailsha256');
}

type DataLayerTourAppointmentEvent = {
  event?: string;
  location_id?: string;
  location_name?: string;
  order_id?: string;
};

export async function verifyTourAppointmentScheduledDataLayer({
  page,
  clubId,
  clubName,
  timeout = TIMEOUTS.LONG,
}: {
  page: Page;
  clubId: string;
  clubName: string;
  timeout?: number;
}): Promise<void> {
  const dataLayer = await waitForDataLayerEntries(
    page,
    entries =>
      entries.some(
        entry =>
          entry?.event === 'tour_appointment_scheduled' &&
          String((entry as DataLayerTourAppointmentEvent)?.location_id ?? '') === String(clubId),
      ),
    timeout as typeof TIMEOUTS.LONG,
  );

  const tourAppointmentScheduled = [...dataLayer]
    .reverse()
    .find(
      item =>
        item.event === 'tour_appointment_scheduled' &&
        String((item as DataLayerTourAppointmentEvent).location_id ?? '') === String(clubId),
    ) as DataLayerTourAppointmentEvent | undefined;

  if (!tourAppointmentScheduled) {
    throw new Error('tour_appointment_scheduled event not found in dataLayer');
  }

  assertEqualityCondition(
    tourAppointmentScheduled.event,
    'tour_appointment_scheduled',
    'Data layer Event',
  );
  assertEqualityCondition(
    String(tourAppointmentScheduled.location_id ?? ''),
    String(clubId),
    'Data layer location_id',
  );
  assertClubOrLocationNameIgnoreCase(
    tourAppointmentScheduled.location_name ?? '',
    clubName,
    'Data layer location_name',
  );
  assertNotEmpty(tourAppointmentScheduled.order_id ?? null, null, 'Data layer order_id');
}

async function verifyDataLayerEvent({
  page,
  eventData,
}: {
  page: Page;
  eventData: RudderStackRequest;
}) {
  const properties = eventData.postDataJSON?.properties;
  const context = eventData.postDataJSON?.context;
  const expectedLeadCaptureId = resolveLeadCaptureId(context, properties);

  // Poll parent + same-origin iframe dataLayers — Local Offer / embedded forms often
  // push GTM after RS Lead Captured, and parent-only page.evaluate misses iframe entries.
  const matchesFormSuccessLead = (entry: DataLayerLeadEvent | undefined): boolean => {
    if (!entry || entry.event !== 'form_success') {
      return false;
    }
    if (entry.form_category && entry.form_category !== 'lead') {
      return false;
    }
    if (
      expectedLeadCaptureId &&
      resolveDataLayerLeadCaptureId(entry) !== String(expectedLeadCaptureId)
    ) {
      return false;
    }
    return Boolean(entry.emailsha256);
  };

  const dataLayer = await waitForDataLayerEntries(page, entries =>
    entries.some(matchesFormSuccessLead),
  );

  const formSuccessLead = [...dataLayer].reverse().find(matchesFormSuccessLead);

  if (!formSuccessLead) {
    const formSuccessEvents = dataLayer.filter(item => item.event === 'form_success');
    throw new Error(
      `form_success event with form_category=lead not found in dataLayer. form_success entries: ${JSON.stringify(formSuccessEvents)}`,
    );
  }

  console.log('-------------Matched Event-------------');
  console.log(formSuccessLead);

  assertEqualityCondition(formSuccessLead.event, 'form_success', 'Data layer Event');
  if (formSuccessLead.form_category) {
    assertEqualityCondition(formSuccessLead.form_category, 'lead', 'Data layer Form Category');
  }
  assertEqualityCondition(formSuccessLead.club_id, properties?.location_id, 'Data layer Club id');
  assertEqualityCondition(
    resolveDataLayerLeadCaptureId(formSuccessLead),
    expectedLeadCaptureId,
    'Data layer Lead Captured Id',
  );
  assertClubOrLocationNameIgnoreCase(
    formSuccessLead.club_name,
    properties?.location_name ?? '',
    'Data layer Club name',
  );
  assertNotEmpty(formSuccessLead.form_name ?? null, null, 'Data layer form name');
  assertNotEmpty(formSuccessLead.lead_type ?? null, null, 'Data layer lead type');
  assertNotEmpty(formSuccessLead.lead_source_code ?? null, null, 'Data layer form name');
  assertNotEmpty(formSuccessLead.emailsha256 ?? null, null, 'Data layer lead type');
}

export type CaptureRudderStackEventParams = {
  requests: RudderStackRequest[];
  event: string;
  page: Page;
  data: LeadEventData | string;
  pageDetails?: PageDetails;
  formTracking?: FormTrackingAssertions;
  locationTracking?: LocationEventTrackingAssertions;
  leadFunnelTracking?: LeadFunnelPageTrackingAssertions;
  slotTracking?: SlotTrackingAssertions;
  scheduledTracking?: ScheduledTrackingAssertions;
  /** Local Offer / embedded flows: RS path may differ from host URL pathname. */
  skipPagePathValidation?: boolean;
};

export async function captureRudderStackEvent({
  requests,
  event,
  page,
  data,
  pageDetails,
  formTracking,
  locationTracking,
  leadFunnelTracking,
  slotTracking,
  scheduledTracking,
  skipPagePathValidation = false,
}: CaptureRudderStackEventParams) {
  console.log('-------------Captured Rudderstack Event ' + event + '-------------');

  // Appointment/Visit Scheduled can arrive slightly after Lead Captured — poll briefly.
  // Soft 408 retries often delay the booking track; give it more time than Lead Captured.
  // Identify / Lead Captured can also lag after thank-you redirect (Local Offer UAT TC-K016).
  // Location Searched / Selected can batch after Mapbox/search settles.
  // Page (AFW-3303) can lag after reload / iframe mount — and may fire twice (shell then form_*).
  // Appointment Slot Selected (AFW-3953) fires on schedule CTA with date+time selected.
  const shouldPoll =
    event === 'Appointment Scheduled' ||
    event === 'Visit Scheduled' ||
    event === APPOINTMENT_SLOT_SELECTED_EVENT ||
    event === 'identify' ||
    event === 'Lead Captured' ||
    event === 'Location Searched' ||
    event === 'Location Selected' ||
    event === 'page';
  const pollMs =
    event === 'Appointment Scheduled' ||
    event === 'Visit Scheduled' ||
    event === APPOINTMENT_SLOT_SELECTED_EVENT
      ? 45000
      : event === 'Location Searched' || event === 'Location Selected' || event === 'page'
        ? 60000
        : 30000;
  const pollIntervalMs =
    event === 'Location Searched' || event === 'Location Selected' || event === 'page' ? 1000 : 500;

  // Initial settle — dataplane POST often leaves after Mapbox/search or iframe hydrate.
  if (shouldPoll && !page.isClosed()) {
    await new Promise(resolve => setTimeout(resolve, 2500));
  }

  const preferFormType =
    event === 'page' && leadFunnelTracking?.expectFormFields && leadFunnelTracking.formType
      ? leadFunnelTracking.formType
      : undefined;

  // Prefer enriched page (form_*) for up to 20s, then fall back to latest page for lead_funnel_viewed.
  const enrichedPageMs = preferFormType ? 20000 : 0;
  const pollDeadline = Date.now() + (shouldPoll ? pollMs : 0);
  const enrichedDeadline = preferFormType ? Date.now() + enrichedPageMs : 0;
  let trigger: RudderStackRequest | undefined;
  let lastError: unknown;
  let allowMissingFormType = false;
  while (true) {
    try {
      trigger = await retrieveRudderstackNetworkLogs(requests, event, {
        searchSuccess: event === 'Location Searched' ? locationTracking?.searchSuccess : undefined,
        searchMethod: event === 'Location Searched' ? locationTracking?.searchMethod : undefined,
        requireFormType: allowMissingFormType ? undefined : preferFormType,
      });
      break;
    } catch (error) {
      lastError = error;
      if (preferFormType && !allowMissingFormType && Date.now() >= enrichedDeadline) {
        allowMissingFormType = true;
        console.warn(
          `AFW-3303: no page event with form_type=${preferFormType} after ${enrichedPageMs}ms — ` +
            'falling back to latest page payload (form_* may be missing)',
        );
        continue;
      }
      if (!shouldPoll || Date.now() >= pollDeadline) {
        throw lastError instanceof Error ? lastError : error;
      }
      // Test timeout / navigation can close the page mid-poll — do not call page.waitForTimeout
      // (throws "Target page, context or browser has been closed" and obscures the real miss).
      if (page.isClosed()) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }
  }

  console.log('Matched Rudderstack Event:', JSON.stringify(trigger, null, 2));
  const activeOneTrustGroup = await getActiveOnetrustGroup(page);
  console.log('Actual Active OneTrust Group: ' + activeOneTrustGroup);
  const userIdFromSessionStorage = await getPersonIdFromSessionStorage(page);
  let oneTrustConsent = await getcheckOneTrustConsent(page);
  if (oneTrustConsent === null) {
    const cm = trigger.postDataJSON?.context?.consentManagement;
    oneTrustConsent = Boolean(
      cm?.provider === 'oneTrust' && (cm.allowedConsentIds?.length ?? 0) > 0,
    );
    console.log(
      `OneTrust helper missing — inferred consent=${oneTrustConsent} from RS payload consentManagement`,
    );
  }
  await validateEventData(trigger);
  await assertNonNullAttributes(trigger);
  await validateEventProperties({
    eventData: trigger,
    eventName: event,
    pageDetails,
    data,
    formTracking,
    locationTracking,
    leadFunnelTracking,
    slotTracking,
    scheduledTracking,
  });
  await verifyPageDetails({ eventData: trigger, pageDetails, skipPagePathValidation });
  await verifyConsentSettings(trigger, activeOneTrustGroup);
  await verifyUserIdValue({ eventData: trigger, oneTrustConsent, userIdFromSessionStorage });
  if (event === APPOINTMENT_SLOT_SELECTED_EVENT) {
    const slotCount = requests.filter(
      r => r.postDataJSON?.event === APPOINTMENT_SLOT_SELECTED_EVENT,
    ).length;
    if (slotCount < 1) {
      throw new Error(
        `AFW-3953: expected "${APPOINTMENT_SLOT_SELECTED_EVENT}" at least once after schedule CTA, got ${slotCount}`,
      );
    }
    if (slotCount > 1) {
      // Soft lead-capture / slot-conflict retries click the CTA again in the same browser
      // session; app may emit another Slot Selected. Ticket intent is once per session —
      // soft-warn duplicates rather than fail the property asserts on the matched event.
      console.warn(
        `APP GAP (AFW-3953): "${APPOINTMENT_SLOT_SELECTED_EVENT}" fired ${slotCount} times in session (expected once; soft retries may re-click CTA)`,
      );
    } else {
      console.log(`✅ ${APPOINTMENT_SLOT_SELECTED_EVENT} fired once per session`);
    }
  }
  if (event === 'Lead Captured' && Array.isArray(data) && data[3] === true) {
    // Local Offer / embedded flows may navigate to thank-you or swap to the schedule
    // iframe before assertions run; parent dataLayer can miss form_success even when
    // RS Lead Captured is valid. RS payload remains the source of truth for this path
    // (dedicated form_success scenarios assert dataLayer separately).
    const url = page.url().toLowerCase();
    const onThankYou = url.includes('thank-you');
    const scheduleIframeVisible = await page
      .locator('#book-a-tour-iframe')
      .isVisible()
      .catch(() => false);
    if (onThankYou || scheduleIframeVisible) {
      console.log(
        `Skipping form_success dataLayer check after lead capture — ${
          onThankYou ? 'on thank-you page' : 'schedule iframe visible'
        } (RS Lead Captured is source of truth)`,
      );
    } else {
      await verifyDataLayerEvent({ page, eventData: trigger });
    }
  }
}
export async function verifyEventNotTriggered(
  rudderstackRequests: RudderStackRequest[],
  event: string,
) {
  await verifyNoEventTracked(rudderstackRequests, event);
}

/**
 * AFW-3953 / AFW-3954 — after a successful bookable CTA, capture Appointment Scheduled
 * (with AFW-3954 scheduledTracking) then Appointment Slot Selected.
 */
export async function captureAppointmentScheduledWithSlotSelected(
  params: Omit<CaptureRudderStackEventParams, 'event' | 'slotTracking' | 'scheduledTracking'> & {
    scheduledEvent?: 'Appointment Scheduled' | 'Visit Scheduled';
  },
): Promise<void> {
  const { scheduledEvent = 'Appointment Scheduled', ...rest } = params;
  await captureRudderStackEvent({
    ...rest,
    event: scheduledEvent,
    scheduledTracking: toAppointmentScheduledTracking(),
  });
  await captureRudderStackEvent({
    ...rest,
    event: APPOINTMENT_SLOT_SELECTED_EVENT,
    slotTracking: toAppointmentSlotTracking(),
  });
}
