import type { Frame, Page } from '@playwright/test';
import type { ExtractedFlowText } from './types';

/**
 * Collect only painted, on-screen UI copy (innerText / placeholders / button labels).
 * Skips aria-label / title / alt and any element (or ancestor) that is hidden,
 * aria-hidden, off-screen, or zero-sized.
 */
const EXTRACT_VISIBLE_SCRIPT = `(() => {
  const results = [];
  const seen = new Set();

  function isHiddenByAttr(el) {
    if (!el || !(el instanceof Element)) return true;
    if (el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') return true;
    if (el.getAttribute('type') === 'hidden') return true;
    return false;
  }

  function visible(el) {
    if (!el || !(el instanceof Element)) return false;
    if (isHiddenByAttr(el)) return false;
    let node = el;
    while (node && node instanceof Element) {
      if (isHiddenByAttr(node)) return false;
      const style = window.getComputedStyle(node);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.visibility === 'collapse' ||
        Number(style.opacity) === 0
      ) {
        return false;
      }
      node = node.parentElement;
    }
    if (typeof el.checkVisibility === 'function') {
      try {
        if (
          !el.checkVisibility({
            checkOpacity: true,
            checkVisibilityCSS: true,
            contentVisibilityAuto: true,
          })
        ) {
          return false;
        }
      } catch (_) {
        /* older engines */
      }
    }
    const rect = el.getBoundingClientRect();
    // Require a laid-out box (scroll-off content still counts — user can scroll to it).
    return rect.width >= 1 && rect.height >= 1;
  }

  /** Visible painted text only — never aria/title/alt. */
  function paintedText(el) {
    if (!el) return '';
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.type === 'submit' || el.type === 'button') return (el.value || '').trim();
      return '';
    }
    const raw = (el.innerText || '').replace(/\\s+/g, ' ').trim();
    return raw;
  }

  function push(kind, text, el) {
    const t = (text || '').replace(/\\s+/g, ' ').trim();
    if (!t || t.length < 2) return;
    // Skip pure punctuation / symbols.
    if (!/[\\p{L}\\p{N}]/u.test(t)) return;
    const key = kind + '|' + t.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    const id = el.id ? '#' + el.id : '';
    results.push({
      kind: kind,
      text: t,
      selector: (tag + id).slice(0, 120),
      tagName: tag,
    });
  }

  const root = document.body;
  if (!root) return results;

  root.querySelectorAll('h1,h2,h3,h4,h5,h6,[role="heading"]').forEach(function (el) {
    if (!visible(el)) return;
    push('heading', paintedText(el), el);
  });

  root
    .querySelectorAll('button, [role="button"], a.btn, input[type="submit"], input[type="button"]')
    .forEach(function (el) {
      if (!visible(el)) return;
      push('button', paintedText(el), el);
    });

  // Leaf-ish copy containers — use painted text; skip containers that only wrap other scanned nodes.
  root.querySelectorAll('label, legend, p, li, td, th, span, div[data-testid], [data-testid]').forEach(function (el) {
    if (!visible(el)) return;
    if (el.matches('button, [role="button"], a.btn, input, textarea, select')) return;
    // Prefer shallow nodes so we do not re-scan whole sections.
    if (el.children && el.children.length > 3) return;
    const t = paintedText(el);
    if (t.length < 2 || t.length > 280) return;
    // Skip if this text is only an aggregation of nested headings/buttons already captured.
    if (el.querySelector('h1,h2,h3,h4,h5,h6,button,[role="button"]')) return;
    push('visible', t, el);
  });

  root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function (el) {
    if (!visible(el)) return;
    // Placeholders only — never the typed value.
    push('placeholder', el.getAttribute('placeholder') || '', el);
  });

  return results;
})()`;

export interface ExtractVisibleOptions {
  iframeSelectors?: string[];
  stage?: string;
  /**
   * When true (default for Contact Us), only scan lead-form iframes / sit-react frames —
   * skip host Webflow chrome (nav/footer/cookie) that is not the flow UI under test.
   */
  iframeOnly?: boolean;
}

/**
 * Extract visible UI strings from Contact Us / Email Club iframes (and optionally the host).
 */
export async function extractVisibleFlowTexts(
  page: Page,
  options?: ExtractVisibleOptions,
): Promise<ExtractedFlowText[]> {
  const stage = options?.stage;
  const iframeOnly = options?.iframeOnly !== false;
  const collected: ExtractedFlowText[] = [];

  const iframeSelectors = options?.iframeSelectors ?? [
    '#email-club-iframe',
    '#contact-us-iframe',
    '#tuf-train-for-your-life-event-iframe',
    '#events-promo-iframe',
    'iframe[src*="contact-us"]',
    'iframe[src*="email-club"]',
    'iframe[src*="promo"]',
    'iframe[src*="event"]',
  ];

  let scrapedIframe = false;

  for (const sel of iframeSelectors) {
    const count = await page.locator(sel).first().count().catch(() => 0);
    if (!count) continue;
    const frame = await resolveFrame(page, sel);
    if (!frame) continue;
    const iframeTexts = (await frame.evaluate(EXTRACT_VISIBLE_SCRIPT).catch(() => [])) as ExtractedFlowText[];
    for (const item of iframeTexts) {
      collected.push({ ...item, stage });
    }
    if (iframeTexts.length) {
      scrapedIframe = true;
      break;
    }
  }

  // React sit-react / events frames (may not match host iframe id).
  if (!scrapedIframe) {
    for (const frame of page.frames()) {
      const url = frame.url();
      if (!/contact-us|email-club|sit-react|promo|event|lead|trial/i.test(url)) continue;
      const iframeTexts = (await frame
        .evaluate(EXTRACT_VISIBLE_SCRIPT)
        .catch(() => [])) as ExtractedFlowText[];
      for (const item of iframeTexts) {
        collected.push({ ...item, stage });
      }
      if (iframeTexts.length) {
        scrapedIframe = true;
        break;
      }
    }
  }

  // Host page only when explicitly allowed or no iframe UI was found.
  if (!iframeOnly || !scrapedIframe) {
    const hostTexts = (await page.evaluate(EXTRACT_VISIBLE_SCRIPT).catch(() => [])) as ExtractedFlowText[];
    for (const item of hostTexts) {
      collected.push({ ...item, stage });
    }
  }

  return dedupe(collected);
}

async function resolveFrame(page: Page, selector: string): Promise<Frame | null> {
  const handle = await page.locator(selector).first().elementHandle().catch(() => null);
  if (!handle) return null;
  return handle.contentFrame().catch(() => null);
}

function dedupe(items: ExtractedFlowText[]): ExtractedFlowText[] {
  const seen = new Set<string>();
  const out: ExtractedFlowText[] = [];
  for (const item of items) {
    const key = `${item.stage ?? ''}|${item.kind}|${item.text.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
