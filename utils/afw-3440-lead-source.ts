/**
 * AFW-3440 — Lead source code normalization for Events Promo / Local Offer / MCO (group) offers.
 *
 * Product rule (JIRA AFW-3440):
 * - Events: Website-Event-{uniqueId}_DC (Local→Event, append _DC, sanitize unique id)
 * - Local / MCO: Website-Local-{uniqueId} (Event→Local, strip _DC, sanitize unique id)
 * - Unknown / empty / null / wrong-case prefix → send original unchanged (fallback)
 *
 * Expected outputs match the ticket SIT/UAT matrix:
 * https://docs.google.com/spreadsheets/d/1FoKzz7bJ4hZ4yQgJFU46hPciaShXCuoMmqckvgr2edo
 */
import type { Page } from '@playwright/test';
import { TIMEOUTS } from '@utils/constants';

export type Afw3440Surface = 'events' | 'local' | 'mco';

const EVENTS_IFRAME_IDS = [
  'tuf-train-for-your-life-event-iframe',
  'events-promo-iframe',
  'events-iframe',
];

const LOCAL_IFRAME_IDS = ['local-offer-iframe'];
const MCO_IFRAME_IDS = ['mco-offer-iframe', 'local-offer-iframe'];

/** Drop spaces and symbols from the unique-id segment (SIT matrix). */
function sanitizeUniqueId(id: string): string {
  return id.replace(/[^A-Za-z0-9-]/g, '');
}

/**
 * Expected origin_source after React normalizes a CMS lead source on submit.
 * Prefer Example-table Expected values in Gherkin; this mirrors the SIT matrix for helpers.
 */
export function expectedAfw3440LeadSource(surface: Afw3440Surface, input: string): string {
  if (!input || /^(empty|null)$/i.test(input)) {
    return input;
  }

  const isEvents = surface === 'events';

  // Case-sensitive known prefixes only — lowercase prefixes fall through unchanged (SIT).
  const hasLocal = rawStarts(input, 'Website-Local-');
  const hasEvent = rawStarts(input, 'Website-Event-');
  if (!hasLocal && !hasEvent) {
    return input;
  }

  if (isEvents) {
    let code = hasLocal ? `Website-Event-${input.slice('Website-Local-'.length)}` : input;
    if (code.endsWith('_DC')) {
      code = code.slice(0, -'_DC'.length);
    }
    if (!rawStarts(code, 'Website-Event-')) {
      return input;
    }
    const unique = sanitizeUniqueId(code.slice('Website-Event-'.length));
    return `Website-Event-${unique}_DC`;
  }

  // Local / MCO
  let code = hasEvent ? `Website-Local-${input.slice('Website-Event-'.length)}` : input;
  while (code.endsWith('_DC')) {
    code = code.slice(0, -'_DC'.length);
  }
  if (!rawStarts(code, 'Website-Local-')) {
    return input;
  }
  const unique = sanitizeUniqueId(code.slice('Website-Local-'.length));
  return `Website-Local-${unique}`;
}

function rawStarts(value: string, prefix: string): boolean {
  return value.startsWith(prefix);
}

async function findIframeId(page: Page, candidates: string[]): Promise<string | null> {
  for (const id of candidates) {
    if (
      (await page
        .locator(`#${id}`)
        .count()
        .catch(() => 0)) > 0
    )
      return id;
  }
  return null;
}

/**
 * Arm MCO lead-source override before the offer page loads.
 * MCO embeds rebuild iframe src from `window.sharedData.leadSourceCode` (mco-offer/index.js),
 * so post-load URL remounts are overwritten — init script + leadSourceCode route keep the override.
 * Call this before navigating to the group offer page.
 */
export async function armMcoLeadSourceOverride(page: Page, leadSourceCode: string): Promise<void> {
  await page.addInitScript(code => {
    const apply = () => {
      const w = window as unknown as { sharedData?: Record<string, unknown> };
      const next = { ...(w.sharedData || {}), leadSourceCode: code, lead_source_code: code };
      w.sharedData = next;
      try {
        Object.defineProperty(w.sharedData, 'leadSourceCode', {
          get: () => code,
          set: () => undefined,
          configurable: true,
          enumerable: true,
        });
      } catch {
        w.sharedData.leadSourceCode = code;
      }
      document.querySelectorAll('[data-lead-form-source-code]').forEach(el => {
        el.setAttribute('data-lead-form-source-code', code);
      });
    };
    apply();
    document.addEventListener('DOMContentLoaded', apply);
    const timer = window.setInterval(apply, 100);
    window.setTimeout(() => window.clearInterval(timer), 20000);
  }, leadSourceCode);

  // Rewrite any iframe/document request that carries leadSourceCode (MCO uses mco-offer or local-offer).
  await page.route(
    url => {
      const s = url.toString();
      return /leadSourceCode=/i.test(s) || /\/mco-offer/i.test(s);
    },
    async route => {
      const u = new URL(route.request().url());
      u.searchParams.set('leadSourceCode', leadSourceCode);
      await route.continue({ url: u.toString() });
    },
  );
}

/** After MCO host load, force iframe remount if embed still has CMS default. */
export async function ensureMcoIframeLeadSource(page: Page, leadSourceCode: string): Promise<void> {
  const iframeId = await findIframeId(page, MCO_IFRAME_IDS);
  if (!iframeId) {
    throw new Error(`AFW-3440: MCO offer iframe not found (${MCO_IFRAME_IDS.join(', ')})`);
  }
  await page.evaluate(
    ({ iframeId, leadSourceCode }) => {
      const shared = ((window as unknown as { sharedData?: Record<string, unknown> }).sharedData ??=
        {});
      shared.leadSourceCode = leadSourceCode;
      shared.lead_source_code = leadSourceCode;
      document.querySelectorAll('[data-lead-form-source-code]').forEach(el => {
        el.setAttribute('data-lead-form-source-code', leadSourceCode);
      });
      const iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
      if (!iframe?.src) throw new Error(`iframe #${iframeId} has no src`);
      const u = new URL(iframe.src);
      u.searchParams.set('leadSourceCode', leadSourceCode);
      iframe.src = `${u.toString()}&_afw3440=${Date.now()}`;
    },
    { iframeId, leadSourceCode },
  );
  await page.waitForTimeout(3500);
  await page
    .locator(`#${iframeId}`)
    .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG })
    .catch(() => {});
}

/** Override Local / MCO iframe `leadSourceCode` query param and remount. */
export async function overrideOfferIframeLeadSourceCode(
  page: Page,
  surface: 'local' | 'mco',
  leadSourceCode: string,
): Promise<void> {
  if (surface === 'mco') {
    await ensureMcoIframeLeadSource(page, leadSourceCode);
    return;
  }

  const ids = LOCAL_IFRAME_IDS;
  const iframeId = await findIframeId(page, ids);
  if (!iframeId) {
    throw new Error(`AFW-3440: ${surface} offer iframe not found (${ids.join(', ')})`);
  }
  await page.evaluate(
    ({ iframeId, leadSourceCode }) => {
      const shared = ((window as unknown as { sharedData?: Record<string, unknown> }).sharedData ??=
        {});
      shared.leadSourceCode = leadSourceCode;
      shared.lead_source_code = leadSourceCode;

      document.querySelectorAll('[data-lead-form-source-code]').forEach(el => {
        el.setAttribute('data-lead-form-source-code', leadSourceCode);
      });

      const iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
      if (!iframe?.src) throw new Error(`iframe #${iframeId} has no src`);
      const u = new URL(iframe.src);
      u.searchParams.set('leadSourceCode', leadSourceCode);
      iframe.src = u.toString();
    },
    { iframeId, leadSourceCode },
  );
  await page.waitForTimeout(3000);
  await page
    .locator(`#${iframeId}`)
    .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG })
    .catch(() => {});
}

/**
 * Override Events Promo lead source before gym selection.
 * Updates host `data-lead-form-source-code` and remounts the events iframe eventProps.
 */
export async function overrideEventsPromoLeadSourceCode(
  page: Page,
  leadSourceCode: string,
): Promise<void> {
  const iframeId = await findIframeId(page, EVENTS_IFRAME_IDS);
  if (!iframeId) {
    throw new Error(`AFW-3440: Events Promo iframe not found (${EVENTS_IFRAME_IDS.join(', ')})`);
  }
  await page.evaluate(
    ({ iframeId, leadSourceCode }) => {
      document.querySelectorAll('[data-lead-form-source-code]').forEach(el => {
        el.setAttribute('data-lead-form-source-code', leadSourceCode);
      });
      const iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
      if (!iframe?.src) throw new Error(`iframe #${iframeId} has no src`);
      const u = new URL(iframe.src);
      const raw = u.searchParams.get('eventProps');
      if (!raw) throw new Error('Events iframe missing eventProps');
      const props = JSON.parse(raw) as {
        lead_form?: { lead_source_code?: string; [k: string]: unknown };
        [k: string]: unknown;
      };
      props.lead_form = { ...(props.lead_form || {}), lead_source_code: leadSourceCode };
      u.searchParams.set('eventProps', JSON.stringify(props));
      iframe.src = u.toString();
    },
    { iframeId, leadSourceCode },
  );
  await page.waitForTimeout(3000);
  await page
    .locator(`#${iframeId}`)
    .waitFor({ state: 'attached', timeout: TIMEOUTS.LONG })
    .catch(() => {});
}
