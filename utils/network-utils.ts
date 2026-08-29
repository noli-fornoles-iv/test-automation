import { Page, Request, Response } from '@playwright/test';
import environmentManager from '@config/environment';
import {
  ActiveProspectData,
  ClubAddressResponse,
  GymAddress,
  ProspectSessionStorage,
  ReferralLookupResponse,
  ReferralResponse,
} from '@type/api.types';
import { API_PATHS, SESSION_STORAGE_KEYS, TIMEOUTS } from '@utils/constants/index';
import { Helpers } from './helpers';
import { logger } from './logger';

export class NetworkUtils {
  static async abortRequest(page: Page, urlPath: string): Promise<void> {
    try {
      await page.route('**/*', route => {
        if (route.request().url().includes(urlPath)) {
          return route.abort();
        }
        return route.continue();
      });
    } catch (error) {
      throw new Error(`Failed to abort request for [${urlPath}]: ${error}`);
    }
  }

  private static matchesApiResource(url: string, resourceName: string): boolean {
    if (!url.includes(resourceName)) {
      return false;
    }

    // Exclude subpaths like /api/bookings/availabilities but allow POST /api/bookings and /api/bookings/.
    if (
      resourceName === API_PATHS.CONFIRM_APPOINTMENT_REQUEST &&
      /\/api\/bookings\/[^/?#]+/.test(url)
    ) {
      return false;
    }

    // Match the locations list endpoint only, not /api/locations/{clubId}.
    if (resourceName === API_PATHS.LOCATIONS_REQUEST && /\/api\/locations\/[^/?]+/.test(url)) {
      return false;
    }

    return true;
  }

  /**
   * Availabilities are served from the React embed host (sit-react / uat-react / …).
   * The Webflow host and third-party widgets (e.g. Medallia) often mirror the same path
   * with 404/403 HTML/XML — those must not win page.waitForResponse.
   */
  private static isReliableAvailabilitiesResponse(resp: Response): boolean {
    if (resp.status() !== 200) {
      return false;
    }
    const url = resp.url();
    if (!/anytimefitness\.com/i.test(url)) {
      return false;
    }
    // Prefer React embed host; still allow same-path 200 on any AF host as a fallback.
    return true;
  }

  private static resolveWaitMethod(resourceName: string): string | undefined {
    const postOnlyResources = new Set<string>([
      API_PATHS.PROSPECTS_REQUEST,
      API_PATHS.CONFIRM_APPOINTMENT_REQUEST,
      API_PATHS.CONTACT_REQUEST,
      API_PATHS.INQUIRIES_REQUEST,
    ]);

    return postOnlyResources.has(resourceName) ? 'POST' : undefined;
  }

  private static async waitForMatchingResponse(
    page: Page,
    resourceName: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ): Promise<Response> {
    const method = this.resolveWaitMethod(resourceName);
    const availabilitiesPath = API_PATHS.SCHEDULING_AVAILABILITIES_REQUEST();
    const requireAvailabilitiesOk = resourceName.includes(availabilitiesPath);

    try {
      const response = await page.waitForResponse(
        resp => {
          if (!this.matchesApiResource(resp.url(), resourceName)) {
            return false;
          }
          if (method && resp.request().method() !== method) {
            return false;
          }
          if (requireAvailabilitiesOk && !this.isReliableAvailabilitiesResponse(resp)) {
            return false;
          }
          return true;
        },
        { timeout },
      );
      return response;
    } catch {
      throw new Error(`Response for [${resourceName}] not received within ${timeout}ms.`);
    }
  }

  private static async waitForMatchingRequest(
    page: Page,
    resourceName: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ): Promise<Request> {
    const method = this.resolveWaitMethod(resourceName);

    try {
      const request = await page.waitForRequest(
        req => {
          if (!this.matchesApiResource(req.url(), resourceName)) {
            return false;
          }
          return !method || req.method() === method;
        },
        { timeout },
      );
      return request;
    } catch {
      throw new Error(`Request for [${resourceName}] not received within ${timeout}ms.`);
    }
  }

  static async getStatusCode(
    page: Page,
    resourceName: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ): Promise<number> {
    const response = await this.waitForMatchingResponse(page, resourceName, timeout);
    return response.status();
  }

  static async getRequestHeaders(
    page: Page,
    resourceName: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ): Promise<Record<string, string>> {
    const request = await this.waitForMatchingRequest(page, resourceName, timeout);
    return request.headers();
  }

  static async getResponseHeaders(
    page: Page,
    resourceName: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ): Promise<Record<string, string>> {
    const response = await this.waitForMatchingResponse(page, resourceName, timeout);
    return response.headers();
  }

  static async getResponseBody<T>(
    page: Page,
    resourceName: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ): Promise<T> {
    const response = await this.waitForMatchingResponse(page, resourceName, timeout);
    try {
      const contentType = response.headers()['content-type'];
      if (!contentType?.includes('application/json')) {
        throw new Error('Expected JSON response');
      }
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // Remount / navigation after Select Gym can invalidate the body mid-read
      // ("No resource with given identifier found"). Soft-return empty so callers
      // that soft-catch staff_id do not hard-fail the step.
      if (/No resource with given identifier found/i.test(message)) {
        logger.warn(
          `[NetworkUtils] Could not read JSON body for [${resourceName}] after navigation: ${message}`,
        );
        return {} as T;
      }
      throw new Error(`Failed to parse response body: ${error}`);
    }
  }

  static getRefererDomain(): string {
    const environments: Record<string, string> = {
      PROD: 'react.anytimefitness.com',
      UAT: 'uat-react.anytimefitness.com',
      SIT: 'sit-react.anytimefitness.com',
    };
    const envKey = (process.env.NODE_ENV || 'sit').toUpperCase();
    const env = environments[envKey];

    if (!env) throw new Error(`Unsupported or undefined NODE_ENV: ${env}`);

    return env;
  }

  private static getGaCollectUrlParts(): string[] {
    return process.env.NODE_ENV === 'PROD'
      ? ['analytics.google.com/g/collect', 'google-analytics.com/g/collect']
      : ['google-analytics.com/g/collect'];
  }

  private static matchesGaCollectEvent(url: string, eventName: string): boolean {
    const decodedUrl = decodeURIComponent(url).toLowerCase();
    const normalizedEvent = eventName.toLowerCase();

    if (!this.getGaCollectUrlParts().some(part => decodedUrl.includes(part))) {
      return false;
    }

    return (
      decodedUrl.includes(`en=${normalizedEvent}`) ||
      decodedUrl.includes(`ep.event_name=${normalizedEvent}`) ||
      decodedUrl.includes(`ep.event=${normalizedEvent}`) ||
      decodedUrl.includes(`epn.event_name=${normalizedEvent}`)
    );
  }

  private static async isGTMEventInDataLayer(page: Page, eventName: string): Promise<boolean> {
    if (page.isClosed()) {
      return false;
    }

    try {
      const parentHasEvent = await page.evaluate(name => {
        const dl = (window as { dataLayer?: { event?: string }[] }).dataLayer;
        if (!Array.isArray(dl)) {
          return false;
        }
        return dl.some(entry => entry?.event === name);
      }, eventName);
      if (parentHasEvent) {
        return true;
      }

      for (const frame of page.frames()) {
        if (frame === page.mainFrame()) {
          continue;
        }
        try {
          const frameHasEvent = await frame.evaluate(name => {
            const dl = (window as { dataLayer?: { event?: string }[] }).dataLayer;
            if (!Array.isArray(dl)) {
              return false;
            }
            return dl.some(entry => entry?.event === name);
          }, eventName);
          if (frameHasEvent) {
            return true;
          }
        } catch {
          // Ignore cross-origin frames that cannot be read.
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  static async isGTMEventFired(
    page: Page,
    eventName: string,
    timeout: number = TIMEOUTS.MEDIUM,
  ): Promise<boolean> {
    // dataLayer is the SoT (same surface as GTM Tag Assistant). GA collect is a parallel
    // signal only — never let a GA timeout/false settle Promise.race and cancel the poll.
    if (await this.isGTMEventInDataLayer(page, eventName)) {
      return true;
    }

    const waitForGaCollectEvent = async (): Promise<boolean> => {
      try {
        await page.waitForRequest(req => this.matchesGaCollectEvent(req.url(), eventName), {
          timeout,
        });
        return true;
      } catch {
        return false;
      }
    };

    const waitForDataLayerEvent = async (): Promise<boolean> => {
      const started = Date.now();
      while (Date.now() - started < timeout) {
        if (page.isClosed()) {
          return false;
        }
        if (await this.isGTMEventInDataLayer(page, eventName)) {
          return true;
        }
        await page.waitForTimeout(250);
      }
      return this.isGTMEventInDataLayer(page, eventName);
    };

    const found = await Promise.any([
      waitForDataLayerEvent().then(v => (v ? true : Promise.reject(new Error('dl-miss')))),
      waitForGaCollectEvent().then(v => (v ? true : Promise.reject(new Error('ga-miss')))),
    ]).catch(() => false);

    if (found) {
      return true;
    }

    if (page.isClosed()) {
      return false;
    }

    return this.isGTMEventInDataLayer(page, eventName);
  }

  static async isBookATourVariantFired(
    page: Page,
    pageName: string,
    timeout: number = TIMEOUTS.LONG,
  ): Promise<boolean> {
    try {
      const expectedVariant = Helpers.getBookATourVariant(pageName);
      const request = await page.waitForRequest(
        req =>
          req.url().includes('/book-a-tour/') && req.url().includes(`variant=${expectedVariant}`),
        { timeout },
      );
      return request !== null && request !== undefined;
    } catch {
      return false;
    }
  }

  static async isTryUsFreeVariantFired(
    page: Page,
    pageName: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ): Promise<boolean> {
    try {
      const expectedVariant = Helpers.getTryUsFreeVariant(pageName);
      const request = await page.waitForRequest(
        req =>
          req.url().includes('/try-us-free/') && req.url().includes(`variant=${expectedVariant}`),
        { timeout },
      );
      return request !== null && request !== undefined;
    } catch {
      return false;
    }
  }

  private static async resolveResponse(
    responsePromise: Promise<Response>,
    resourceName: string,
  ): Promise<Response> {
    const response = await responsePromise;
    if (!response) {
      throw new Error(`No response received for [${resourceName}]`);
    }
    return response;
  }

  static waitForStatusCodeAndHeaders(
    page: Page,
    url: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ) {
    const responsePromise = this.waitForMatchingResponse(page, url, timeout);

    return {
      statusCodePromise: responsePromise.then(response =>
        this.resolveResponse(Promise.resolve(response), url).then(res => res.status()),
      ),
      requestHeadersPromise: responsePromise.then(response =>
        this.resolveResponse(Promise.resolve(response), url).then(res => res.request().headers()),
      ),
    };
  }

  static waitForStatusCodeHeadersAndBody<TResponse, TRequest = unknown>(
    page: Page,
    url: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ) {
    const responsePromise = this.waitForMatchingResponse(page, url, timeout);
    let requestBodyPromiseRef: Promise<TRequest> | undefined;
    const resolveResponse = NetworkUtils.resolveResponse.bind(NetworkUtils);

    // Eagerly read JSON as soon as the response arrives. Local Offer (and similar)
    // may navigate to /thank-you immediately after lead-capture; deferred response.json()
    // then fails with "No resource with given identifier found".
    const capturedPromise = responsePromise.then(async response => {
      const resolved = await resolveResponse(Promise.resolve(response), url);
      const status = resolved.status();
      const headers = resolved.headers();
      const requestHeaders = resolved.request().headers();
      const contentType = headers['content-type'] ?? '';
      let body = {} as TResponse;
      if (contentType.includes('application/json') || contentType.includes('text/plain')) {
        try {
          body = (await resolved.json()) as TResponse;
        } catch (error) {
          // Navigation / iframe teardown can invalidate the body mid-read
          // ("No resource with given identifier found"). Prefer empty body so
          // callers can recover from dataLayer / UI handoff instead of failing hard.
          const message = error instanceof Error ? error.message : String(error);
          if (status < 400 && !/No resource with given identifier found/i.test(message)) {
            try {
              const text = await resolved.text();
              body = JSON.parse(text) as TResponse;
            } catch {
              if (status < 400) {
                logger.warn(
                  `[NetworkUtils] Could not read JSON body for [${url}] (status=${status}): ${message}`,
                );
              }
            }
          } else if (status < 400) {
            logger.warn(
              `[NetworkUtils] Response body unavailable for [${url}] after navigation (status=${status})`,
            );
          }
        }
      } else if (status < 400) {
        throw new Error(`Expected JSON response for [${url}]`);
      }

      let requestBody: TRequest | undefined;
      const request = resolved.request();
      if (request.method() === 'POST') {
        const postData = request.postData();
        if (postData) {
          requestBody = JSON.parse(postData) as TRequest;
        }
      }

      return { status, requestHeaders, body, requestBody, requestMethod: request.method() };
    });

    return {
      statusCodePromise: capturedPromise.then(captured => captured.status),
      requestHeadersPromise: capturedPromise.then(captured => captured.requestHeaders),
      responseBodyPromise: capturedPromise.then(captured => captured.body),
      get requestBodyPromise(): Promise<TRequest> {
        if (!requestBodyPromiseRef) {
          requestBodyPromiseRef = capturedPromise.then(captured => {
            if (captured.requestMethod !== 'POST') {
              throw new Error(
                `Expected POST request for [${url}], but got ${captured.requestMethod}`,
              );
            }
            if (captured.requestBody === undefined) {
              throw new Error(`No postData found for [${url}] request`);
            }
            return captured.requestBody;
          });
        }
        return requestBodyPromiseRef;
      },
    };
  }

  static async getRequestBody<T>(
    page: Page,
    resourceName: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ): Promise<T> {
    try {
      const request = await this.waitForMatchingRequest(page, resourceName, timeout);

      if (request.method() !== 'POST') {
        throw new Error(`Expected POST request for [${resourceName}], but got ${request.method()}`);
      }

      const postData = request.postData();
      if (!postData) {
        throw new Error(`No postData found for [${resourceName}] request`);
      }

      const contentType = request.headers()['content-type'];
      if (contentType && !contentType.includes('application/json')) {
        throw new Error(`Expected JSON request for [${resourceName}], got ${contentType}`);
      }

      return JSON.parse(postData) as T;
    } catch (error) {
      throw new Error(`Failed to parse request body for [${resourceName}]: ${error}`);
    }
  }

  static isReferralsResponse(url: string, status: number): boolean {
    return url.includes(API_PATHS.REFERRALS_REQUEST) && (status === 200 || status === 201);
  }

  static isReferralLookupResponse(url: string, status: number): boolean {
    if (!url.includes(API_PATHS.REFERRALS_REQUEST) || (status !== 200 && status !== 201)) {
      return false;
    }
    // Lookup may use code=, h=, or hash= depending on locale / client version.
    return /[?&](code|h|hash)=/i.test(url);
  }

  static extractRedeemUrlFromReferralsBody(
    body: ReferralResponse | Record<string, unknown>,
  ): string | undefined {
    const payload = body as Record<string, unknown>;
    const redeemUrl =
      payload.reddeem_url ?? payload.redeem_url ?? payload.redeemUrl ?? payload.redeemURL;

    return typeof redeemUrl === 'string' && redeemUrl.length > 0 ? redeemUrl : undefined;
  }

  static async waitForReferralsResponse(
    page: Page,
    timeout: number = TIMEOUTS.LONG,
  ): Promise<{ code: string; redeemUrl: string }> {
    const response = await page.waitForResponse(
      res =>
        this.isReferralsResponse(res.url(), res.status()) && !/[?&](code|h|hash)=/i.test(res.url()),
      { timeout },
    );
    const body = (await response.json()) as Record<string, unknown>;
    const code = body.code;

    if (typeof code !== 'string' || code.length === 0) {
      throw new Error('referral code not found in /referrals response');
    }

    const redeemUrl = this.extractRedeemUrlFromReferralsBody(body);
    if (!redeemUrl) {
      throw new Error('redeem URL not found in /referrals response');
    }

    return { code, redeemUrl };
  }

  static async waitForReferralLookupResponse(
    page: Page,
    timeout: number = TIMEOUTS.LONG,
  ): Promise<ReferralLookupResponse> {
    const response = await page.waitForResponse(
      res => this.isReferralLookupResponse(res.url(), res.status()),
      { timeout },
    );
    const body = (await response.json()) as ReferralLookupResponse;

    if (!body.referral_code) {
      throw new Error('referral_code not found in referral lookup response');
    }

    // Connected-member invites include referrer + gym details; anonymous invites only need the code.
    if (!body.is_anonymous) {
      if (!body.member_name || !body.location_name) {
        throw new Error(
          'member_name or location_name not found in connected-member referral lookup response',
        );
      }
    }

    return body;
  }

  static async waitForReferralsRedeemUrl(
    page: Page,
    timeout: number = TIMEOUTS.LONG,
  ): Promise<string> {
    const captured: ReferralResponse[] = [];

    const onResponse = async (response: Response) => {
      if (!this.isReferralsResponse(response.url(), response.status())) {
        return;
      }
      try {
        captured.push((await response.json()) as ReferralResponse);
      } catch {
        // ignore malformed referrals payloads
      }
    };

    page.on('response', onResponse);

    try {
      const deadline = Date.now() + timeout;
      while (Date.now() < deadline) {
        for (let i = captured.length - 1; i >= 0; i--) {
          const redeemUrl = this.extractRedeemUrlFromReferralsBody(captured[i]);
          if (redeemUrl) {
            return redeemUrl;
          }
        }
        await page.waitForTimeout(250);
      }

      const response = await page.waitForResponse(
        res => this.isReferralsResponse(res.url(), res.status()),
        { timeout: TIMEOUTS.MEDIUM },
      );
      const redeemUrl = this.extractRedeemUrlFromReferralsBody(
        (await response.json()) as ReferralResponse,
      );
      if (!redeemUrl) {
        throw new Error('redeem URL not found in /referrals response');
      }
      return redeemUrl;
    } finally {
      page.off('response', onResponse);
    }
  }

  static async getReferralCode(page: Page, timeout: number = TIMEOUTS.LONG): Promise<string> {
    try {
      const responseBody = await this.getResponseBody<ReferralResponse>(
        page,
        API_PATHS.REFERRALS_REQUEST,
        timeout,
      );

      if (!responseBody.code) {
        throw new Error('referral code not found in /referrals response');
      }

      return responseBody.code;
    } catch (error) {
      throw new Error(`Failed to get referral code: ${error}`);
    }
  }

  private static extractStaffIdFromAvailabilitiesBody(body: {
    staff_availabilities?: { staff?: { id?: string | number } }[];
  }): string {
    const staffId = body.staff_availabilities?.[0]?.staff?.id;

    if (!staffId) {
      throw new Error('staffId not found in /api/bookings/availabilities response');
    }

    return String(staffId);
  }

  /** Parse staff id from /api/bookings/availabilities response (fires on form load after gym select). */
  static parseStaffIdFromAvailabilitiesBody(body: {
    staff_availabilities?: { staff?: { id?: string | number } }[];
  }): string {
    return this.extractStaffIdFromAvailabilitiesBody(body);
  }

  private static resolveClubId(page: Page, clubId?: string | number): string {
    if (clubId !== undefined && clubId !== null && String(clubId).length > 0) {
      return String(clubId);
    }

    const locationId = new URL(page.url()).searchParams.get('location_id');
    if (!locationId) {
      throw new Error('location_id parameter not found in the current URL');
    }

    return locationId;
  }

  /**
   * In-page fetch of availabilities (React embed origin). Useful when
   * `page.request.get` against the Webflow host returns 404 for some SIT clubs.
   * Must run in a sit-react / uat-react iframe — parent Webflow origin 404s the same path.
   */
  static async fetchStaffIdViaPageContext(page: Page, clubId: string | number): Promise<string> {
    const resolvedClubId = this.resolveClubId(page, clubId);
    const apiPath = API_PATHS.SCHEDULING_AVAILABILITIES_REQUEST();
    const useProdApi = page.url().includes('use_prod_api=true');
    const reactOrigin = `https://${this.getRefererDomain()}`;
    const queryParamVariants: Array<Record<string, string>> = [
      { locationNumber: resolvedClubId },
      { location_id: resolvedClubId },
    ];
    let lastError: unknown;

    const reactFrame =
      page.frames().find(f => /(?:sit-|uat-)?react\.anytimefitness\.com/i.test(f.url())) ??
      page
        .frames()
        .find(
          f =>
            /anytimefitness\.com/i.test(f.url()) &&
            /book-a-tour|try-us-free|schedule/i.test(f.url()),
        );

    const fetchArgs = {
      path: apiPath.endsWith('/') ? apiPath : `${apiPath}/`,
      useProd: useProdApi,
      reactOrigin,
    };

    const fetchInContext = async (query: Record<string, string>) => {
      const payload = { ...fetchArgs, query };
      const evaluator = async ({
        path,
        query: q,
        useProd,
        reactOrigin: originFallback,
      }: {
        path: string;
        query: Record<string, string>;
        useProd: boolean;
        reactOrigin: string;
      }) => {
        const origin = /react\.anytimefitness\.com/i.test(window.location.origin)
          ? window.location.origin
          : originFallback;
        const url = new URL(path, origin);
        for (const [key, value] of Object.entries(q)) {
          url.searchParams.set(key, value);
        }
        if (useProd) {
          url.searchParams.set('use_prod_api', 'true');
        }
        const res = await fetch(url.toString(), { credentials: 'same-origin' });
        if (!res.ok) {
          throw new Error(`Availabilities in-page fetch returned ${res.status}`);
        }
        return (await res.json()) as {
          staff_availabilities?: { staff?: { id?: string | number } }[];
        };
      };

      if (reactFrame) {
        return reactFrame.evaluate(evaluator, payload);
      }
      return page.evaluate(evaluator, payload);
    };

    for (const params of queryParamVariants) {
      try {
        const responseBody = await fetchInContext(params);
        return this.extractStaffIdFromAvailabilitiesBody(responseBody);
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      `Failed to fetch staff ID via page context for [${resolvedClubId}]: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`,
    );
  }

  private static async fetchStaffId(page: Page, clubId: string | number): Promise<string> {
    const resolvedClubId = this.resolveClubId(page, clubId);
    const apiPath = API_PATHS.SCHEDULING_AVAILABILITIES_REQUEST();
    // App uses locationNumber; some embeds also accept location_id.
    const queryParamVariants: Array<Record<string, string>> = [
      { locationNumber: resolvedClubId },
      { location_id: resolvedClubId },
    ];
    const maxAttempts = 3;
    let lastError: unknown;
    // Availabilities API lives on the React embed host, not the Webflow marketing host.
    const reactOrigin = `https://${this.getRefererDomain()}`;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      for (const params of queryParamVariants) {
        try {
          const apiUrl = new URL(
            `${reactOrigin}${apiPath.endsWith('/') ? apiPath : `${apiPath}/`}`,
          );
          for (const [key, value] of Object.entries(params)) {
            apiUrl.searchParams.set(key, value);
          }
          if (page.url().includes('use_prod_api=true')) {
            apiUrl.searchParams.set('use_prod_api', 'true');
          }
          // Bound the request — an unbounded hang previously burned the full test timeout.
          const response = await page.request.get(apiUrl.toString(), {
            timeout: TIMEOUTS.MEDIUM,
          });

          if (!response.ok()) {
            throw new Error(`Availabilities API returned ${response.status()}`);
          }

          const responseBody = (await response.json()) as {
            staff_availabilities?: { staff?: { id?: string } }[];
          };

          return this.extractStaffIdFromAvailabilitiesBody(responseBody);
        } catch (error) {
          lastError = error;
        }
      }

      if (attempt === maxAttempts || page.isClosed()) {
        break;
      }

      await page.waitForLoadState('domcontentloaded', { timeout: TIMEOUTS.SHORT }).catch(() => {});
      await page.waitForTimeout(300).catch(() => {});
    }

    try {
      return await this.fetchStaffIdViaPageContext(page, resolvedClubId);
    } catch (inPageError) {
      lastError = inPageError;
    }

    throw new Error(
      `Failed to fetch staff ID for [${resolvedClubId}]: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`,
    );
  }

  static async getStaffId(
    page: Page,
    clubId: string | number,
    timeout: number = TIMEOUTS.LONG,
  ): Promise<string> {
    try {
      const responseBody = await this.getResponseBody<{
        staff_availabilities: { staff: { id: string } }[];
      }>(page, API_PATHS.SCHEDULING_AVAILABILITIES_REQUEST(), Math.min(timeout, TIMEOUTS.MEDIUM));

      return this.extractStaffIdFromAvailabilitiesBody(responseBody);
    } catch (networkError) {
      logger.warn(
        `Staff ID not captured from network for [${clubId}] within ${timeout}ms: ${networkError}. Fetching via API.`,
      );
      return this.fetchStaffId(page, clubId);
    }
  }

  static async getParsedRequestBody<T>(
    page: Page,
    resourceName: string,
    timeout: number = TIMEOUTS.EXTRA_LONG,
  ): Promise<T | string> {
    try {
      const request = await this.waitForMatchingRequest(page, resourceName, timeout);

      if (request.method() !== 'POST') {
        throw new Error(`Expected POST request for [${resourceName}], but got ${request.method()}`);
      }

      const postData = request.postData();
      if (!postData) {
        throw new Error(`No postData found for [${resourceName}] request`);
      }

      // Attempt to parse the text into JSON
      try {
        const parsedJson = JSON.parse(postData);
        logger.info(
          `[NetworkUtils] Parsed text/plain body successfully as JSON for [${resourceName}]`,
        );
        return parsedJson as T;
      } catch {
        logger.warn(
          `[NetworkUtils] Request body for [${resourceName}] is not JSON. Returning raw string.`,
        );
        return postData;
      }
    } catch (error) {
      throw new Error(`Failed to get text/plain request body for [${resourceName}]: ${error}`);
    }
  }

  static async getProspectIdFromSessionStorage(page: Page): Promise<string | null> {
    try {
      // Get environment-specific React domain and prepend https://
      const reactDomain = `https://${this.getRefererDomain()}`;

      // Navigate to React domain if not already there
      if (!page.url().includes(reactDomain)) {
        await page.goto(reactDomain);
      }

      // Get PROSPECT_ID from session storage
      const prospectId = await page.evaluate(
        key => sessionStorage.getItem(key),
        SESSION_STORAGE_KEYS.PROSPECT_ID,
      );

      if (!prospectId) {
        throw new Error('PROSPECT_ID not found in session storage');
      }
      return prospectId;
    } catch (error) {
      throw new Error(`Failed to get PROSPECT_ID from session storage: ${error}`);
    }
  }

  static async getProspectDataFromReactSessionStorage(page: Page): Promise<ProspectSessionStorage> {
    try {
      const originalUrl = page.url();
      const reactDomain = `https://${this.getRefererDomain()}`;

      if (!originalUrl.includes(reactDomain)) {
        await page.goto(reactDomain);
      }

      const data = await page.evaluate(
        key => sessionStorage.getItem(key),
        SESSION_STORAGE_KEYS.PROSPECT_DATA,
      );
      if (!data) {
        throw new Error('PROSPECT_DATA not found in React session storage');
      }

      const parsedData = JSON.parse(data);

      if (!originalUrl.includes(reactDomain)) {
        await page.goto(originalUrl, { waitUntil: 'load' });
      }
      return parsedData;
    } catch (error) {
      throw new Error(`Failed to get PROSPECT_DATA from React session storage: ${error}`);
    }
  }

  static async getActiveProspectDataFromSessionStorage(page: Page): Promise<ActiveProspectData> {
    try {
      const data = await page.evaluate(
        key => sessionStorage.getItem(key),
        SESSION_STORAGE_KEYS.ACTIVE_PROSPECT_DATA,
      );
      if (!data) {
        throw new Error('ACTIVE_PROSPECT_DATA not found in session storage');
      }

      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      throw new Error(`Failed to get ACTIVE_PROSPECT_DATA from session storage: ${error}`);
    }
  }

  static async isSessionStorageDataCleared(page: Page, keys: string[]): Promise<boolean> {
    const results = await page.evaluate(keys => {
      return keys.map(key => sessionStorage.getItem(key));
    }, keys);

    // If every key returns null or undefined, return true
    return results.every(value => value === null || value === undefined);
  }

  static async waitForSessionStorageDataCleared(
    page: Page,
    keys: string[],
    timeout: number = TIMEOUTS.MEDIUM,
    pollInterval: number = 500,
  ): Promise<boolean> {
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
      if (page.isClosed()) {
        return false;
      }
      if (await this.isSessionStorageDataCleared(page, keys)) {
        return true;
      }
      await page.waitForTimeout(pollInterval).catch(() => {});
    }

    if (page.isClosed()) {
      return false;
    }

    return this.isSessionStorageDataCleared(page, keys);
  }

  private static resolvePageOrigin(page: Page): string {
    const pageUrl = page.url();
    if (pageUrl && !pageUrl.startsWith('about:')) {
      try {
        return new URL(pageUrl).origin;
      } catch {
        // fall through to configured base URL
      }
    }

    return new URL(environmentManager.get('BASE_URL')).origin;
  }

  static mapGymAddressToClubAddress(gym: GymAddress): ClubAddressResponse['address'] {
    return {
      address1: gym.address1,
      address2: gym.address2,
      city: gym.city,
      state: gym.state,
      postal_code: gym.postal_code,
      country: gym.country,
      state_abbr: gym.state_abbr,
      country_abbr: gym.country_abbr,
    };
  }

  private static buildApiUrl(page: Page, apiPath: string): string {
    const url = new URL(`${this.resolvePageOrigin(page)}${apiPath}`);
    if (page.url().includes('use_prod_api=true')) {
      url.searchParams.set('use_prod_api', 'true');
    }
    return url.toString();
  }

  static async getClubAddress(
    page: Page,
    clubId: string | number,
    listenTimeout: number = TIMEOUTS.SHORT,
    fallbackAddress?: GymAddress,
  ): Promise<ClubAddressResponse['address']> {
    const apiPath = API_PATHS.CLUB_BY_ID_REQUEST(clubId);

    try {
      const responseBody = await this.getResponseBody<ClubAddressResponse>(
        page,
        apiPath,
        listenTimeout,
      );

      if (!responseBody?.address) {
        throw new Error(`Address not found in ${apiPath} response`);
      }

      return responseBody.address;
    } catch (networkError) {
      logger.warn(
        `Club address not captured from network for [${clubId}] within ${listenTimeout}ms: ${networkError}. Fetching via API.`,
      );
    }

    try {
      return await this.fetchClubAddress(page, clubId);
    } catch (apiError) {
      if (fallbackAddress) {
        logger.warn(
          `Club address API failed for [${clubId}]: ${apiError}. Using search-result fallback address.`,
        );
        return this.mapGymAddressToClubAddress(fallbackAddress);
      }
      throw apiError;
    }
  }

  /**
   * @deprecated Use getClubAddress — it now falls back to a direct API fetch automatically.
   */
  static async getClubAddressResilient(
    page: Page,
    clubId: string | number,
    listenTimeout: number = TIMEOUTS.SHORT,
    fallbackAddress?: GymAddress,
  ): Promise<ClubAddressResponse['address']> {
    return this.getClubAddress(page, clubId, listenTimeout, fallbackAddress);
  }

  private static async fetchClubAddress(
    page: Page,
    clubId: string | number,
  ): Promise<ClubAddressResponse['address']> {
    const apiPath = API_PATHS.CLUB_BY_ID_REQUEST(clubId);
    const maxAttempts = 3;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const apiUrl = this.buildApiUrl(page, apiPath);
        const response = await page.request.get(apiUrl);

        if (!response.ok()) {
          throw new Error(`Club API returned ${response.status()}`);
        }

        const responseBody = (await response.json()) as ClubAddressResponse;
        if (!responseBody?.address) {
          throw new Error(`Address not found in ${apiPath} response`);
        }

        return responseBody.address;
      } catch (error) {
        lastError = error;
        if (attempt === maxAttempts || page.isClosed()) {
          break;
        }
        await page
          .waitForLoadState('domcontentloaded', { timeout: TIMEOUTS.SHORT })
          .catch(() => {});
        await page.waitForTimeout(300).catch(() => {});
      }
    }

    throw new Error(
      `Failed to fetch club address for [${clubId}]: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`,
    );
  }

  static async isEmailSha256Found(
    page: Page,
    hashedEmail: string,
    timeout: number = TIMEOUTS.LONG,
  ): Promise<boolean> {
    const expectedHash = hashedEmail.trim().toLowerCase();

    const isHashInDataLayer = (): Promise<boolean> =>
      page.evaluate(hash => {
        const dl = (window as { dataLayer?: { event?: string; emailsha256?: string }[] }).dataLayer;
        if (!Array.isArray(dl)) return false;
        return dl.some(
          entry =>
            entry?.event === 'form_success' &&
            typeof entry.emailsha256 === 'string' &&
            entry.emailsha256.trim().toLowerCase() === hash,
        );
      }, expectedHash);

    const waitForHashInDataLayer = async (): Promise<boolean> => {
      try {
        await page.waitForFunction(
          hash => {
            const dl = (window as { dataLayer?: { event?: string; emailsha256?: string }[] })
              .dataLayer;
            if (!Array.isArray(dl)) return false;
            return dl.some(
              entry =>
                entry?.event === 'form_success' &&
                typeof entry.emailsha256 === 'string' &&
                entry.emailsha256.trim().toLowerCase() === hash,
            );
          },
          expectedHash,
          { timeout },
        );
        return true;
      } catch {
        return false;
      }
    };

    const waitForHashInGaCollect = async (): Promise<boolean> => {
      try {
        const gaCollectUrlPart =
          process.env.NODE_ENV === 'PROD'
            ? 'analytics.google.com/g/collect'
            : 'google-analytics.com/g/collect';

        await page.waitForRequest(
          req => {
            const decodedUrl = decodeURIComponent(req.url()).toLowerCase();
            return (
              decodedUrl.includes(gaCollectUrlPart) &&
              decodedUrl.includes(`ep.email_address=${expectedHash}`)
            );
          },
          { timeout },
        );
        return true;
      } catch {
        return false;
      }
    };

    if (await isHashInDataLayer()) {
      return true;
    }

    const foundViaListener = await Promise.race([
      waitForHashInDataLayer().then(
        found => found || Promise.reject(new Error('Hash not found in data layer')),
      ),
      waitForHashInGaCollect().then(
        found => found || Promise.reject(new Error('Hash not found in ga collect')),
      ),
    ])
      .then(() => true)
      .catch(() => false);

    if (foundViaListener) {
      return true;
    }

    return isHashInDataLayer();
  }

  static async isReactSessionStorageDataFound(page: Page, key: string): Promise<boolean> {
    // Get environment-specific domain and prepend https://
    const originalUrl = page.url();
    const reactDomain = `https://${this.getRefererDomain()}`;

    // Navigate to React domain if not already there
    if (!originalUrl.includes(reactDomain)) {
      await page.goto(reactDomain);
    }

    // Check if the session storage key exists
    const value = await page.evaluate(key => {
      return sessionStorage.getItem(key);
    }, key);

    if (!originalUrl.includes(reactDomain)) {
      await page.goto(originalUrl, { waitUntil: 'load' });
    }
    // Return true if key exists (not null/undefined), false otherwise
    return value !== null && value !== undefined;
  }

  static async isWebflowSessionStorageDataFound(page: Page, key: string): Promise<boolean> {
    const value = await page.evaluate(key => {
      return sessionStorage.getItem(key);
    }, key);

    // Return true if key exists (not null/undefined), false otherwise
    return value !== null && value !== undefined;
  }

  static async getBATVariantFromSessionStorage(page: Page): Promise<string | null> {
    try {
      const batVariant = await page.evaluate(
        key => sessionStorage.getItem(key),
        SESSION_STORAGE_KEYS.BAT_VARIANT,
      );
      if (!batVariant) {
        throw new Error('BAT_VARIANT not found in session storage');
      }
      return batVariant;
    } catch (error) {
      throw new Error(`Failed to get BAT_VARIANT from session storage: ${error}`);
    }
  }
}
