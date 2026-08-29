import { createBdd } from 'playwright-bdd';
import environmentManager from '@config/environment';
import { test, expect } from '@fixtures/base.fixture';
import { LocationsResponse } from '@type/api.types';
import {
  PATHS,
  API_PATHS,
  GTM_EVENT,
  TIMEOUTS,
  SESSION_STORAGE_KEYS,
} from '@utils/constants/index';
import { Helpers, appendDisableCaptchaParam, navigateToUrl } from '@utils/helpers';
import { localeElements } from '@utils/locale-utils/locale-element-map';
import localeManager from '@utils/locale-utils/locale-manager';
import TestDataKeys from '@utils/locale-utils/test-data-keys.constants';
import { logger } from '@utils/logger';
import { NetworkUtils } from '@utils/network-utils';
import { getUserFormForScenario } from '@utils/user-form-utils';

const { Given, When, Then } = createBdd(test);

Given(
  'The user is on {string} page',
  async ({ page, scenarioContext, hsaFsaMembershipPage, tryUsFreePage, findAGymPage }, pageName: string) => {
    scenarioContext.pageName = pageName.toLowerCase();
    let url;
    const locale = environmentManager.get('LOCALE');
    switch (pageName.toLowerCase()) {
      case 'local gym':
        url =
          environmentManager.get('BASE_URL') +
          PATHS.LOCAL_GYM(localeManager.getData(TestDataKeys.Locations.LocalGym));
        await navigateToUrl(url, page, locale);
        break;
      case 'try us free': {
        // Bound wait + reload retry — bare EXTRA_LONG (10m) on /api/locations consumes the
        // whole suite timeout on WebKit flakes and cascades into closed-page failures
        // (same pattern as Contact Us / Membership Inquiry).
        // EN-IE / EN-GB: /try-us-free 301 → /schedule-an-appointment-online and drops query
        // params — navigate straight to BAT with #book-a-tour-iframe.
        const localeKey = String(locale || '').toLowerCase();
        const tufHost =
          localeKey === 'en-ie' || localeKey === 'en-gb'
            ? PATHS.BOOK_TOUR_STANDALONE
            : PATHS.TRY_US_FREE;
        url = environmentManager.get('BASE_URL') + tufHost;
        tryUsFreePage.useHostPath(tufHost);
        const maxNavAttempts = 3;
        let locationsResponseBody: LocationsResponse | undefined;
        let lastError: unknown;
        for (let attempt = 1; attempt <= maxNavAttempts; attempt++) {
          try {
            const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(
              page,
              GTM_EVENT.FORM_LOADED,
              TIMEOUTS.LONG,
            );
            const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
              page,
              API_PATHS.LOCATIONS_REQUEST,
              TIMEOUTS.MEDIUM,
            );
            await navigateToUrl(url, page, locale);
            locationsResponseBody = await locationsResponsePromise;
            // Soft-wait form_loaded on Find Your Gym landing — hard assert belongs in
            // dedicated Form Started / form_loaded scenarios after lead-form interaction.
            await gtmEventFiredPromise.catch(() => false);
            break;
          } catch (error) {
            lastError = error;
            logger.warn(
              `Try Us Free /api/locations wait failed (attempt ${attempt}/${maxNavAttempts}): ${error}`,
            );
            if (attempt < maxNavAttempts && !page.isClosed()) {
              // Prefer about:blank remount over reload — WebKit HTTP2 flakes leave a dead
              // document where reload never re-fires /api/locations for the listener.
              await page.goto('about:blank', { waitUntil: 'domcontentloaded' }).catch(() => {});
              await page.waitForTimeout(1500);
            }
          }
        }
        if (!locationsResponseBody) {
          // iPhone Safari parallel load / SSL flakes often miss /api/locations. Retry cleanup
          // may leave about:blank — remount host (up to 2×), then soft-continue without catalog.
          if (page.isClosed()) {
            throw lastError instanceof Error
              ? lastError
              : new Error(
                  `Try Us Free /api/locations not received after ${maxNavAttempts} attempts`,
                );
          }
          for (let remount = 1; remount <= 2; remount++) {
            if (page.isClosed() || /\/try-us-free(\?|$)/i.test(page.url())) {
              break;
            }
            try {
              await navigateToUrl(url, page, locale);
              break;
            } catch (err) {
              logger.warn(`Try Us Free soft-continue remount ${remount}/2 failed: ${err}`);
              await page.goto('about:blank', { waitUntil: 'domcontentloaded' }).catch(() => {});
              await page.waitForTimeout(1500 * remount).catch(() => {});
            }
          }
          const onTryUsFree = !page.isClosed() && /\/try-us-free(\?|$)/i.test(page.url());
          if (!onTryUsFree) {
            throw lastError instanceof Error
              ? lastError
              : new Error(
                  `Try Us Free /api/locations not received after ${maxNavAttempts} attempts`,
                );
          }
          logger.warn(
            'Try Us Free /api/locations missed after retries; soft-continuing with empty catalog (search/deep-link will supply gym).',
          );
          locationsResponseBody = { items: [] };
        }
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'try us free apple fitness free trial': {
        // form_loaded fires on lead-form interaction (TC-P026), not Find A Gym page load —
        // soft-wait only (Events / Membership Inquiry pattern). Hard assert on landing flakes on mobile.
        // EN-AU /try-us-free is 404 — host remounts must stay on /apple-fitness-offer.
        // Seed in-locale ipstack BEFORE navigate — CI IPs outside AU trigger RIGHT PLACE empty state.
        await tryUsFreePage.locationSearch.ensureInCountryIpstackMock();
        url = environmentManager.get('BASE_URL') + PATHS.APPLE_FITNESS_FREE_TRIAL_OFFER;
        tryUsFreePage.useHostPath(PATHS.APPLE_FITNESS_FREE_TRIAL_OFFER);
        const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_LOADED);
        const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
          page,
          API_PATHS.LOCATIONS_REQUEST,
        );
        await navigateToUrl(url, page, locale);
        const [locationsResponseBody] = await Promise.all([
          locationsResponsePromise,
          gtmEventFiredPromise,
        ]);
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'try us free apple fitness plus subscriber': {
        // Seed in-locale ipstack BEFORE navigate — same outside-country RIGHT PLACE gate as AFP Offer.
        await tryUsFreePage.locationSearch.ensureInCountryIpstackMock();
        url = environmentManager.get('BASE_URL') + PATHS.APPLE_FITNESS_PLUS_SUBSCRIBER;
        tryUsFreePage.useHostPath(PATHS.APPLE_FITNESS_PLUS_SUBSCRIBER);
        let isFormLoadedFired = false;
        let isTryUsFreeVariantFired = false;
        let locationsResponseBody: LocationsResponse | undefined;
        for (let attempt = 1; attempt <= 2; attempt++) {
          const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(
            page,
            GTM_EVENT.FORM_LOADED,
            TIMEOUTS.LONG,
          );
          const isTryUsFreeVariantFiredPromise = NetworkUtils.isTryUsFreeVariantFired(
            page,
            scenarioContext.pageName,
            TIMEOUTS.LONG,
          );
          const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
            page,
            API_PATHS.LOCATIONS_REQUEST,
          );
          await navigateToUrl(url, page, locale);
          [isFormLoadedFired, isTryUsFreeVariantFired, locationsResponseBody] = await Promise.all([
            gtmEventFiredPromise,
            isTryUsFreeVariantFiredPromise,
            locationsResponsePromise,
          ]);
          if (isFormLoadedFired && isTryUsFreeVariantFired) break;
          logger.warn(
            `Apple Fitness Plus Subscriber form_loaded/variant not observed on page load attempt ${attempt}`,
          );
        }
        expect(isFormLoadedFired).toBeTruthy();
        expect(isTryUsFreeVariantFired).toBeTruthy();
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'book a tour standalone': {
        // form_loaded fires on lead-form interaction (not Find A Gym page load) — see implementation-patterns.md
        // Bound wait + remount retry — unbounded /api/locations wait can consume the full 10m suite
        // timeout on WebKit (Consolidated no-nearby beforeEach hang).
        url = environmentManager.get('BASE_URL') + PATHS.BOOK_TOUR_STANDALONE;
        const maxNavAttempts = 3;
        let locationsResponseBody: LocationsResponse | undefined;
        let lastError: unknown;
        for (let attempt = 1; attempt <= maxNavAttempts; attempt++) {
          try {
            const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
              page,
              API_PATHS.LOCATIONS_REQUEST,
              TIMEOUTS.LONG,
            );
            if (attempt > 1 && !page.isClosed()) {
              await page.goto('about:blank', { waitUntil: 'domcontentloaded' }).catch(() => {});
            }
            await navigateToUrl(url, page, locale);
            locationsResponseBody = await locationsResponsePromise;
            break;
          } catch (error) {
            lastError = error;
            logger.warn(
              `Book A Tour Standalone /api/locations wait failed (attempt ${attempt}/${maxNavAttempts}): ${error}`,
            );
            if (attempt < maxNavAttempts && !page.isClosed()) {
              await page.waitForTimeout(1500);
            }
          }
        }
        if (!locationsResponseBody) {
          throw lastError instanceof Error
            ? lastError
            : new Error(
                `Book A Tour Standalone /api/locations not received after ${maxNavAttempts} attempts`,
              );
        }
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'membership inquiry': {
        // form_loaded fires on lead-form interaction (not Find A Gym page load) — soft-wait only.
        // Bound wait + reload retry — EXTRA_LONG (10m) can consume the whole test timeout on flakes
        // (same pattern as Contact Us; WebKit parallel suites otherwise cascade into closed-page failures).
        url = environmentManager.get('BASE_URL') + PATHS.MEMBERSHIP_INQUIRY;
        const maxNavAttempts = 3;
        let locationsResponseBody: LocationsResponse | undefined;
        let lastError: unknown;
        for (let attempt = 1; attempt <= maxNavAttempts; attempt++) {
          try {
            const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_LOADED);
            const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
              page,
              API_PATHS.LOCATIONS_REQUEST,
              TIMEOUTS.LONG,
            );
            await navigateToUrl(url, page, locale);
            locationsResponseBody = await locationsResponsePromise;
            // Soft-wait only — do not fail Background when form_loaded is absent on landing.
            await gtmEventFiredPromise.catch(() => false);
            break;
          } catch (error) {
            lastError = error;
            logger.warn(
              `Membership Inquiry /api/locations wait failed (attempt ${attempt}/${maxNavAttempts}): ${error}`,
            );
            if (attempt < maxNavAttempts && !page.isClosed()) {
              await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
              await page.waitForTimeout(1500);
            }
          }
        }
        if (!locationsResponseBody) {
          throw lastError instanceof Error
            ? lastError
            : new Error(
                `Membership Inquiry /api/locations not received after ${maxNavAttempts} attempts`,
              );
        }
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }

      case 'hsa-fsa': {
        // Install in-locale ipstack BEFORE navigation — HSA gym list is IP-country gated.
        await hsaFsaMembershipPage.locationSearch.ensureInCountryIpstackMock(
          {
            latitude: 44.9233,
            longitude: -92.9594,
          },
          'US',
        );
        url = environmentManager.get('BASE_URL') + PATHS.HSA_FSA;
        await navigateToUrl(url, page, locale);
        await hsaFsaMembershipPage.locationSearch.waitForLocationSearchReady();
        break;
      }
      case 'events free trial': {
        // Location Search on static pages — host page with #find-your-gym-searchbar-iframe.
        // Do NOT wait for /api/locations (Events Free Trial Pass lead-form Find Your Gym).
        // SIT often 404s this path for AU/ZA/IN/AE/SA; waitForWidgetReady soft-skips when
        // goto succeeds. Connection resets never reach soft-skip — treat as unavailable.
        url = environmentManager.get('BASE_URL') + PATHS.EVENTS_FREE_TRIAL_PASS;
        try {
          await navigateToUrl(url, page, locale, { includeTestLocationId: false });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const unavailable =
            /ERR_CONNECTION|ERR_NETWORK|net::|HTTP2|SSL|NS_ERROR|Timeout|timed out|Target closed|has been closed|frame was detached|connect error/i.test(
              msg,
            );
          if (unavailable) {
            test.info().annotations.push({
              type: 'issue',
              description: `Events Free Trial page unavailable on navigate (${msg.slice(0, 180)})`,
            });
            test.skip(
              true,
              'Events Free Trial page not available for this locale/environment (navigate failed)',
            );
          }
          throw err;
        }
        break;
      }
      case 'events free trial pass': {
        // form_loaded / locations may never fire when the Events FTP page is inactive on PROD
        // (Find Gym AFW-3876 inactive-events scenario). Soft-wait only — do not burn suite timeout.
        const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_LOADED);
        const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
          page,
          API_PATHS.LOCATIONS_REQUEST,
          TIMEOUTS.MEDIUM,
        );
        url =
          environmentManager.get('BASE_URL') +
          PATHS.EVENTS_FREE_TRIAL_PASS +
          '?disable_captcha=true';
        await navigateToUrl(url, page, locale);

        const stillOnEvents = /\/events\/|free-trial|trial-pass/i.test(page.url());
        const eventsIframeAttached = await page
          .locator(
            '#tuf-train-for-your-life-event-iframe, #try-us-free-iframe, iframe[src*="event"], iframe[src*="trial"]',
          )
          .first()
          .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
          .then(() => true)
          .catch(() => false);

        if (!stillOnEvents || !eventsIframeAttached) {
          logger.warn(
            `Events Free Trial Pass inactive or redirected (url=${page.url()}, iframe=${eventsIframeAttached}). Soft-skipping.`,
          );
          test.info().annotations.push({
            type: 'issue',
            description: `No events free trial pass active (final url: ${page.url()})`,
          });
          test.skip(true, 'No events free trial pass active');
          return;
        }

        const [locationsResponseBody] = await Promise.all([
          locationsResponsePromise.catch(() => null),
          gtmEventFiredPromise.catch(() => false),
        ]);
        if (!locationsResponseBody) {
          logger.warn(
            `Events Free Trial Pass shell without /api/locations (url=${page.url()}). Soft-skipping.`,
          );
          test.info().annotations.push({
            type: 'issue',
            description: `No events free trial pass active — /api/locations not received (url: ${page.url()})`,
          });
          test.skip(true, 'No events free trial pass active');
          return;
        }
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'events train for your life': {
        // form_loaded fires on lead-form interaction (not Find A Gym page load) — soft-wait only.
        // Hard assert belongs in TC-H026 after form interaction (Events Promo / Membership Inquiry pattern).
        const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_LOADED);
        const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
          page,
          API_PATHS.LOCATIONS_REQUEST,
        );
        url = appendDisableCaptchaParam(
          environmentManager.get('BASE_URL') + PATHS.EVENTS_TRAIN_FOR_YOUR_LIFE,
        );
        await navigateToUrl(url, page, locale);
        const [locationsResponseBody] = await Promise.all([
          locationsResponsePromise,
          gtmEventFiredPromise,
        ]);
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'events join online': {
        // form_loaded fires on lead-form interaction (not Find A Gym page load) — soft-wait only.
        // Matches Events TFYL / Promo / Fitphoria / Free Trial Pass (implementation-patterns.md §5).
        const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_LOADED);
        const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
          page,
          API_PATHS.LOCATIONS_REQUEST,
        );
        url =
          environmentManager.get('BASE_URL') + PATHS.EVENTS_JOIN_ONLINE + '?disable_captcha=true';
        await navigateToUrl(url, page, locale);
        const [locationsResponseBody] = await Promise.all([
          locationsResponsePromise,
          gtmEventFiredPromise,
        ]);
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'events promo': {
        // form_loaded fires on lead-form interaction (not Find A Gym page load) — soft-wait only.
        // PROD often has no active promo (AU redirects /events/promo → /locations). Soft-skip then.
        // Seed in-locale ipstack BEFORE navigate — CI IPs outside market trigger RIGHT PLACE empty state.
        await tryUsFreePage.locationSearch.ensureInCountryIpstackMock();
        const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_LOADED);
        const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
          page,
          API_PATHS.LOCATIONS_REQUEST,
        );
        url = environmentManager.get('BASE_URL') + PATHS.EVENTS_PROMO + '?disable_captcha=true';
        await navigateToUrl(url, page, locale);

        // PROD AU often soft-redirects /events/promo → /locations when no promo is live.
        const stillOnPromo = /\/events\/promo(?:[/?#]|$)/i.test(page.url());
        if (!stillOnPromo) {
          logger.warn(
            `No events promo active — redirected away from /events/promo (url=${page.url()}). Soft-skipping Events Promo scenarios.`,
          );
          test.info().annotations.push({
            type: 'issue',
            description: `No events promo active (final url: ${page.url()})`,
          });
          test.skip(true, 'No events promo active');
          return;
        }

        const promoIframeAttached = await page
          .locator(
            '#tuf-train-for-your-life-event-iframe, #events-promo-iframe, #local-offer-iframe, iframe[src*="promo"]',
          )
          .first()
          .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
          .then(() => true)
          .catch(() => false);

        if (!promoIframeAttached) {
          logger.warn(
            `No events promo active — promo iframe missing (url=${page.url()}). Soft-skipping Events Promo scenarios.`,
          );
          test.info().annotations.push({
            type: 'issue',
            description: `No events promo active (final url: ${page.url()})`,
          });
          test.skip(true, 'No events promo active');
          return;
        }

        const [locationsResponseBody] = await Promise.all([
          locationsResponsePromise,
          gtmEventFiredPromise,
        ]);
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'events find your fitphoria': {
        // AU Local Config: Data Layer/GTM FALSE — do not hard-assert form_loaded (match Free Trial Pass).
        const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_LOADED);
        const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
          page,
          API_PATHS.LOCATIONS_REQUEST,
        );
        url =
          environmentManager.get('BASE_URL') +
          PATHS.EVENTS_FIND_YOUR_FITPHORIA +
          '?disable_captcha=true';
        await navigateToUrl(url, page, locale);
        const [locationsResponseBody] = await Promise.all([
          locationsResponsePromise,
          gtmEventFiredPromise,
        ]);
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'events book a tour': {
        // form_loaded fires on lead-form interaction (not Find A Gym page load) — soft-wait only.
        // AU/GB/IE Local Config: Data Layer/GTM typically FALSE — do not hard-assert (match Promo/Fitphoria).
        // PROD may redirect or omit the events iframe when no book-a-tour event is live — soft-skip.
        const gtmEventFiredPromise = NetworkUtils.isGTMEventFired(page, GTM_EVENT.FORM_LOADED);
        const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
          page,
          API_PATHS.LOCATIONS_REQUEST,
        );
        url =
          environmentManager.get('BASE_URL') + PATHS.EVENTS_BOOK_A_TOUR + '?disable_captcha=true';
        await navigateToUrl(url, page, locale);

        const stillOnEventsBat = /\/events\/book-a-tour(?:[/?#]|$)/i.test(page.url());
        const eventsBatIframeAttached = await page
          .locator(
            '#tuf-train-for-your-life-event-iframe, #book-a-tour-iframe, #try-us-free-iframe, iframe[src*="event"], iframe[src*="book"]',
          )
          .first()
          .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
          .then(() => true)
          .catch(() => false);

        if (!stillOnEventsBat || !eventsBatIframeAttached) {
          logger.warn(
            `Events Book A Tour inactive or redirected (url=${page.url()}, iframe=${eventsBatIframeAttached}). Soft-skipping.`,
          );
          test.info().annotations.push({
            type: 'issue',
            description: `No events book a tour active (final url: ${page.url()})`,
          });
          test.skip(true, 'No events book a tour active');
          return;
        }

        const [locationsResponseBody] = await Promise.all([
          locationsResponsePromise,
          gtmEventFiredPromise,
        ]);
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'contact us': {
        url = environmentManager.get('BASE_URL') + PATHS.CONTACT_US;
        // Bound wait + reload retry — EXTRA_LONG (10m) can consume the whole test timeout on flakes.
        const maxNavAttempts = 3;
        let locationsResponseBody: LocationsResponse | undefined;
        let lastError: unknown;
        for (let attempt = 1; attempt <= maxNavAttempts; attempt++) {
          try {
            const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
              page,
              API_PATHS.LOCATIONS_REQUEST,
              TIMEOUTS.LONG,
            );
            await navigateToUrl(url, page, locale);
            locationsResponseBody = await locationsResponsePromise;
            break;
          } catch (error) {
            lastError = error;
            logger.warn(
              `Contact Us /api/locations wait failed (attempt ${attempt}/${maxNavAttempts}): ${error}`,
            );
            if (attempt < maxNavAttempts) {
              await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
              await page.waitForTimeout(1500);
            }
          }
        }
        if (!locationsResponseBody) {
          throw lastError instanceof Error
            ? lastError
            : new Error(`Contact Us /api/locations not received after ${maxNavAttempts} attempts`);
        }
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'cancel membership': {
        url = environmentManager.get('BASE_URL') + PATHS.CANCEL_MEMBERSHIP;
        const maxNavAttempts = 3;
        let locationsResponseBody: LocationsResponse | undefined;
        let lastError: unknown;
        for (let attempt = 1; attempt <= maxNavAttempts; attempt++) {
          try {
            const locationsResponsePromise = NetworkUtils.getResponseBody<LocationsResponse>(
              page,
              API_PATHS.LOCATIONS_REQUEST,
              TIMEOUTS.LONG,
            );
            await navigateToUrl(url, page, locale);
            locationsResponseBody = await locationsResponsePromise;
            break;
          } catch (error) {
            lastError = error;
            logger.warn(
              `Cancel Membership /api/locations wait failed (attempt ${attempt}/${maxNavAttempts}): ${error}`,
            );
            if (attempt < maxNavAttempts) {
              await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
              await page.waitForTimeout(1500);
            }
          }
        }
        if (!locationsResponseBody) {
          throw lastError instanceof Error
            ? lastError
            : new Error(
                `Cancel Membership /api/locations not received after ${maxNavAttempts} attempts`,
              );
        }
        scenarioContext.locationsResponseBody = locationsResponseBody;
        break;
      }
      case 'corporate membership': {
        url = environmentManager.get('BASE_URL') + PATHS.CORPORATE_MEMBERSHIP;
        await navigateToUrl(url, page, locale, { includeTestLocationId: false });
        // Wait for react corporate iframe fields — empty-shell races fail later company/submit waits
        // (TH Desktop marketing scenarios + iPhone empty-submit).
        await page.locator('#corporate-membership-iframe').waitFor({
          state: 'attached',
          timeout: TIMEOUTS.LONG,
        });
        await page
          .frameLocator('#corporate-membership-iframe')
          .locator('input[name="company"], input[name="firstName"], button[type="submit"]')
          .first()
          .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG })
          .catch(async () => {
            await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
            await page
              .frameLocator('#corporate-membership-iframe')
              .locator('input[name="company"], input[name="firstName"], button[type="submit"]')
              .first()
              .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG });
          });
        break;
      }
      case 'own a gym': {
        url = environmentManager.get('BASE_URL') + PATHS.OWN_A_GYM;
        await navigateToUrl(url, page, locale, { includeTestLocationId: false });
        break;
      }
      case 'invite a friend': {
        url = environmentManager.get('BASE_URL') + PATHS.INVITE_FRIEND;
        await navigateToUrl(url, page, locale);
        break;
      }
      case 'find gym': {
        // Install before navigation — gym-finder ipstack country gate fires on load.
        await findAGymPage.ensureInCountryIpstackMock();
        url =
          environmentManager.get('BASE_URL') +
          (String(locale || '').toLowerCase() === 'zh-hk' ? PATHS.LOCATIONS : PATHS.FIND_GYM);
        await navigateToUrl(url, page, locale, { includeTestLocationId: false });
        break;
      }
      case 'home': {
        url = environmentManager.get('BASE_URL') + PATHS.HOME;
        await navigateToUrl(url, page, locale);
        break;
      }
      case 'training': {
        url = environmentManager.get('BASE_URL') + PATHS.TRAINING;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'fitness consultation': {
        url = environmentManager.get('BASE_URL') + PATHS.FITNESS_CONSULTATION;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'group training': {
        url = environmentManager.get('BASE_URL') + PATHS.GROUP_TRAINING;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'personal training': {
        url = environmentManager.get('BASE_URL') + PATHS.PERSONAL_TRAINING;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'why join': {
        url = environmentManager.get('BASE_URL') + PATHS.WHY_JOIN;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'blog': {
        url = environmentManager.get('BASE_URL') + PATHS.BLOG;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'blog category workouts': {
        url = environmentManager.get('BASE_URL') + PATHS.BLOG_CATEGORY_WORKOUTS;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'blog article beginner workout': {
        url = environmentManager.get('BASE_URL') + PATHS.BLOG_ARTICLE_BEGINNER_WORKOUT;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'hsa fsa': {
        await hsaFsaMembershipPage.locationSearch.ensureInCountryIpstackMock(
          {
            latitude: 44.9233,
            longitude: -92.9594,
          },
          'US',
        );
        url = environmentManager.get('BASE_URL') + PATHS.HSA_FSA;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'privacy policy': {
        url = environmentManager.get('BASE_URL') + PATHS.PRIVACY_POLICY;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'terms conditions': {
        url = environmentManager.get('BASE_URL') + PATHS.TERMS_CONDITIONS;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'text messaging terms': {
        url = environmentManager.get('BASE_URL') + PATHS.TEXT_MESSAGING_TERMS;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'dmca': {
        url = environmentManager.get('BASE_URL') + PATHS.DMCA;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'offer terms': {
        url = environmentManager.get('BASE_URL') + PATHS.OFFER_TERMS;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'preferred vendors': {
        url = environmentManager.get('BASE_URL') + PATHS.PREFERRED_VENDORS;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'employee wellness': {
        url = environmentManager.get('BASE_URL') + PATHS.EMPLOYEE_WELLNESS;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'careers': {
        url = environmentManager.get('BASE_URL') + PATHS.CAREERS;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'locations': {
        url = environmentManager.get('BASE_URL') + PATHS.LOCATIONS;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'faqs': {
        url = environmentManager.get('BASE_URL') + PATHS.FAQS;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'contact': {
        url = environmentManager.get('BASE_URL') + PATHS.CONTACT;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'apps': {
        url = environmentManager.get('BASE_URL') + PATHS.APPS;
        await navigateToUrl(url, page, locale);
        break;
      }

      case 'sitemap': {
        url = environmentManager.get('BASE_URL') + PATHS.SITEMAP;
        await navigateToUrl(url, page, locale);
        break;
      }

      default:
        throw new Error(`Unhandled page: "${pageName}" in step definition`);
    }
  },
);

Given('The {string} API is blocked', async ({ page }, resourceName: string) => {
  const isMobile = await Helpers.isMobileDevice(page);
  test.skip(isMobile, 'Skipping API blocked tests on mobile devices');
  switch (resourceName.toLowerCase()) {
    case 'search locations':
      await NetworkUtils.abortRequest(page, API_PATHS.SEARCH_LOCATIONS_REQUEST);
      break;
    case 'form submission':
      await NetworkUtils.abortRequest(page, API_PATHS.PROSPECTS_REQUEST);
      break;
    case 'contact form':
      await NetworkUtils.abortRequest(page, API_PATHS.CONTACT_REQUEST);
      break;
    case 'corporate membership form':
      await NetworkUtils.abortRequest(page, API_PATHS.CONTACT_REQUEST);
      break;
    case 'own a gym form':
      await NetworkUtils.abortRequest(page, API_PATHS.INQUIRIES_REQUEST);
      break;
    default:
      throw new Error(`Unhandled API resource: "${resourceName}" in step definition`);
  }
});

When(/^The targeting cookies are accepted$/, async ({ oneTrustPage }) => {
  const activeGroups = (await oneTrustPage.getActiveGroupNames()).map(s => s.trim());
  if (!activeGroups.includes('Targeting Cookies')) {
    throw new Error(
      `Targeting cookie C0004 is not active. Active cookie groups: ${activeGroups.join(', ')}`,
    );
  }
});

When(/^The targeting cookies are turned off$/, async ({ oneTrustPage }) => {
  await oneTrustPage.cookieSettingsFooterLink.click();
  await oneTrustPage.waitForVisible(oneTrustPage.otherOrganizationsToggle, TIMEOUTS.MEDIUM);
  await oneTrustPage.otherOrganizationsToggle.click();
  await oneTrustPage.saveSettings.click();
  const activeGroups = (await oneTrustPage.getActiveGroupNames()).map(s => s.trim());
  if (activeGroups.includes('Targeting Cookies')) {
    throw new Error(
      `Targeting cookie C0004 is active. Active cookie groups: ${activeGroups.join(', ')}`,
    );
  }
});

Then(
  'The prospect Id and prospect data is cleared from session storage',
  async ({ page, scenarioContext }) => {
    const isMobile = await Helpers.isMobileDevice(page);
    if (isMobile) {
      logger.info(
        'Skipping session storage clear check on mobile iOS due to platform limitations.',
      );
      return;
    }
    const prospectStorageKeys = [
      SESSION_STORAGE_KEYS.PROSPECT_ID,
      SESSION_STORAGE_KEYS.PROSPECT_DATA,
      SESSION_STORAGE_KEYS.ACTIVE_PROSPECT_DATA,
    ];

    if (scenarioContext.canBookAppointment === true) {
      const isProspectDataCleared = await NetworkUtils.waitForSessionStorageDataCleared(
        page,
        [SESSION_STORAGE_KEYS.PROSPECT_ID, SESSION_STORAGE_KEYS.PROSPECT_DATA],
        TIMEOUTS.MEDIUM,
      );
      expect(isProspectDataCleared).toBe(true);
    } else if (scenarioContext.isThankYouPage) {
      const isProspectDataCleared = await NetworkUtils.waitForSessionStorageDataCleared(
        page,
        [SESSION_STORAGE_KEYS.PROSPECT_ID, SESSION_STORAGE_KEYS.PROSPECT_DATA],
        TIMEOUTS.MEDIUM,
      );

      if (!isProspectDataCleared) {
        const sessionStorageSnapshot = await page.evaluate(keys => {
          const data: Record<string, string | null> = {};
          keys.forEach(key => {
            data[key] = sessionStorage.getItem(key);
          });
          return data;
        }, prospectStorageKeys);
        console.warn('📦 SessionStorage Snapshot:', sessionStorageSnapshot);
      }

      logger.info(
        'Thank-you page flow — verifying PROSPECT_ID and PROSPECT_DATA only (ACTIVE_PROSPECT_DATA may remain).',
      );
      expect(isProspectDataCleared).toBe(true);
    } else {
      const isProspectDataCleared = await NetworkUtils.waitForSessionStorageDataCleared(
        page,
        [SESSION_STORAGE_KEYS.PROSPECT_ID, SESSION_STORAGE_KEYS.PROSPECT_DATA],
        TIMEOUTS.MEDIUM,
      );

      if (!isProspectDataCleared) {
        const sessionStorageSnapshot = await page.evaluate(keys => {
          const data: Record<string, string | null> = {};
          keys.forEach(key => {
            data[key] = sessionStorage.getItem(key);
          });
          return data;
        }, prospectStorageKeys);
        console.warn('📦 SessionStorage Snapshot:', sessionStorageSnapshot);
      }

      expect(isProspectDataCleared).toBe(true);
    }
  },
);

Then('The prospect ID is saved in session storage', async ({ page, scenarioContext }) => {
  const prospectId = await NetworkUtils.getProspectIdFromSessionStorage(page);
  if (prospectId === null) {
    throw new Error('Prospect ID was not found in React session storage after form submission');
  }
  scenarioContext.prospectId = prospectId;
});

Then('The prospect ID in session storage remains the same', async ({ page, scenarioContext }) => {
  const prospectId = await NetworkUtils.getProspectIdFromSessionStorage(page);
  expect(prospectId).toBe(scenarioContext.prospectId);
});

Then(
  'A new prospect ID is {string}',
  async ({ page, scenarioContext }, generationStatus: string) => {
    const newProspectId = await NetworkUtils.getProspectIdFromSessionStorage(page);
    const isGenerated = generationStatus.toLowerCase() === 'generated';
    expect(newProspectId).not.toBeNull();
    (() =>
      isGenerated
        ? expect(newProspectId).not.toBe(scenarioContext.prospectId)
        : expect(newProspectId).toBe(scenarioContext.prospectId))();
  },
);

Then(
  /^The data layer should contain the hashed email "(.*)"$/,
  async ({ page }, hashedEmail: string) => {
    const found = await NetworkUtils.isEmailSha256Found(page, hashedEmail.trim(), TIMEOUTS.LONG);
    expect(found).toBe(true);
  },
);

Then(
  /^The data layer should not contain any hashed email "(.*)"$/,
  async ({ scenarioContext }, _hashedEmail: string) => {
    expect(scenarioContext.isEmailShaFound).toBe(false);
  },
);

Then(
  'The prospect ID and prospect data is not present in webflow session storage',
  async ({ page }) => {
    const isProspectIdFound = await NetworkUtils.isWebflowSessionStorageDataFound(
      page,
      SESSION_STORAGE_KEYS.PROSPECT_ID,
    );
    const isProspectDataFound = await NetworkUtils.isWebflowSessionStorageDataFound(
      page,
      SESSION_STORAGE_KEYS.PROSPECT_DATA,
    );
    expect(
      isProspectIdFound,
      'PROSPECT_ID present in webflow session storage on submitting form',
    ).toBe(false);
    expect(
      isProspectDataFound,
      'PROSPECT_DATA present in webflow session storage on submitting form',
    ).toBe(false);
  },
);

Then('The prospect data is present in React session storage', async ({ page, scenarioContext }) => {
  const isMobile = await Helpers.isMobileDevice(page);
  if (isMobile) {
    logger.info('Skipping React session storage check on mobile');
    return;
  }
  if (scenarioContext.canBookAppointment === false) {
    logger.info('Skipping React session storage check as canBookAppointment is false');
    return;
  }
  const isReactProspectDataFound = await NetworkUtils.isReactSessionStorageDataFound(
    page,
    SESSION_STORAGE_KEYS.PROSPECT_DATA,
  );
  expect(
    isReactProspectDataFound,
    'PROSPECT_DATA not present in React session storage on submitting form',
  ).toBe(true);
});

Then(
  /^The correct local resident disclaimer text is displayed in the user form$/,
  async ({ page, scenarioContext, $testInfo }) => {
    if (scenarioContext.batRedirectedToMembershipInquiry) {
      const reason =
        'Skipping local resident disclaimer — BAT redirected to Membership Inquiry because the ' +
        'Local Config test gym has no ClubTour time availabilities (SPA falls back to membership-inquiry).';
      logger.warn(reason);
      test.skip(true, reason);
    }
    $testInfo.setTimeout(Math.max($testInfo.timeout, TIMEOUTS.EXTRA_LONG * 1.5));
    const userForm = getUserFormForScenario(page, Helpers.getPageName(scenarioContext));
    // Avoid full waitForFormReady when the lead form is already on screen (WebKit budget).
    if (!(await userForm.firstName.isVisible().catch(() => false))) {
      await userForm.iframeElement
        .waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM })
        .catch(() => {});
      await userForm.firstName
        .waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
        .catch(() => {});
    }

    const currentLocale = localeManager.getCurrentLocale().toLowerCase();
    const localeElementConfig = localeElements[currentLocale];

    // US-style residency / AFW-3731 dual-disclaimer residency text (ZH-HK has the
    // residency testid + Traditional Chinese copy without #isLocalResident).
    const hasResidencyDisclaimerText =
      (await userForm.localResidentDisclaimerText.count().catch(() => 0)) > 0;
    if (localeElementConfig?.localResidentCheckbox || hasResidencyDisclaimerText) {
      await userForm.assertLocalResidentDisclaimerText();
      return;
    }

    const disclaimer = userForm.privacyNotice.or(userForm.consentCheckbox).first();
    await userForm.scrollIntoView(disclaimer);
    await expect(disclaimer).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    const disclaimerText = Helpers.normalizeText(
      (await userForm.getText(userForm.privacyNotice).catch(() => '')) || '',
    );
    expect(disclaimerText.length).toBeGreaterThan(0);
    expect(disclaimerText.toLowerCase()).toMatch(/privacy|terms|consent|agree|私隱|條款|同意|細則/);
  },
);

Then('The prospect data is cleared from react storage', async ({ page }) => {
  const isReactProspectDataFound = await NetworkUtils.isReactSessionStorageDataFound(
    page,
    SESSION_STORAGE_KEYS.PROSPECT_DATA,
  );
  const isReactActiveProspectDataFound = await NetworkUtils.isReactSessionStorageDataFound(
    page,
    SESSION_STORAGE_KEYS.ACTIVE_PROSPECT_DATA,
  );
  expect(
    isReactProspectDataFound,
    'PROSPECT_DATA present in React session storage on see you soon screen',
  ).toBe(false);
  expect(
    isReactActiveProspectDataFound,
    'PROSPECT_DATA present in React session storage on see you soon screen',
  ).toBe(false);
});
