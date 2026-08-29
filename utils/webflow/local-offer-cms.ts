import { WEBFLOW_CMS_LOCALE_IDS, WEBFLOW_LOCAL_OFFER_COLLECTION_ID } from '@utils/constants/index';
import { logger } from '@utils/logger';

export type LocalOfferCmsFieldData = {
  name: string;
  slug: string;
  displayOfferTitle: string;
  offerImageUrl: string;
  urgencyText: string;
  leadSourceCode: string;
  apiOfferTitle: string;
  apiWorkflowName: string;
  promoType: string;
  gymStatusRequirement: string;
  termsShort: string;
  termsLong: string;
  metaTitle: string;
  metaDescription: string;
  openGraphTitle: string;
  h2HeadingOverride: string;
  bulletPoints: string[];
  openGraphImageUrl: string;
  showJoinOnlineCard: boolean;
  /** Webflow CMS locale that owned this item variant */
  cmsLocaleId: string;
  locale: string;
  ticket?: string;
  offerKey?: string;
};

type WebflowCollectionField = {
  slug?: string;
  type?: string;
  validations?: { options?: { id: string; name: string }[] };
};

type WebflowItem = {
  id: string;
  fieldData?: Record<string, unknown>;
  cmsLocaleId?: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseBullets(richText: unknown): string[] {
  if (typeof richText !== 'string' || !richText.trim()) return [];
  const liMatches = [...richText.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => stripHtml(m[1]));
  if (liMatches.length) return liMatches.filter(Boolean);
  return stripHtml(richText)
    .split(/\n|•|-/)
    .map(s => s.trim())
    .filter(Boolean);
}

function resolveOptionLabel(
  value: unknown,
  options: { id: string; name: string }[] | undefined,
): string {
  if (value === null || value === '') return '';
  const raw = String(value);
  const match = options?.find(o => o.id === raw);
  return match?.name ?? raw;
}

function imageUrl(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const url = (value as { url?: string }).url;
  return typeof url === 'string' ? url : '';
}

function getToken(): string {
  const token =
    process.env.WEBFLOW_API_TOKEN || process.env.WEBFLOW_API_KEY || process.env.WEBFLOW_TOKEN;
  if (!token) {
    throw new Error(
      'Webflow API token missing. Set WEBFLOW_API_TOKEN in .env.<NODE_ENV> (CMS:read scope).',
    );
  }
  return token;
}

async function fetchCollectionOptionMaps(
  token: string,
): Promise<Record<string, { id: string; name: string }[]>> {
  const res = await fetch(
    `https://api.webflow.com/v2/collections/${WEBFLOW_LOCAL_OFFER_COLLECTION_ID}`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    },
  );
  if (!res.ok) {
    throw new Error(`Webflow collection schema HTTP ${res.status}`);
  }
  const body = (await res.json()) as { fields?: WebflowCollectionField[] };
  const map: Record<string, { id: string; name: string }[]> = {};
  for (const field of body.fields ?? []) {
    if (field.slug && field.validations?.options?.length) {
      map[field.slug] = field.validations.options;
    }
  }
  return map;
}

/**
 * List published CMS items for a locale.
 * Uses /items/live so values match the Designer “Published” locale view.
 */
async function listItemsForLocale(token: string, cmsLocaleId: string): Promise<WebflowItem[]> {
  const items: WebflowItem[] = [];
  let offset = 0;
  for (;;) {
    const url = new URL(
      `https://api.webflow.com/v2/collections/${WEBFLOW_LOCAL_OFFER_COLLECTION_ID}/items/live`,
    );
    url.searchParams.set('limit', '100');
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('cmsLocaleId', cmsLocaleId);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Webflow list live items HTTP ${res.status} for cmsLocaleId=${cmsLocaleId}`);
    }
    const body = (await res.json()) as {
      items?: WebflowItem[];
      pagination?: { total?: number };
    };
    const page = body.items ?? [];
    items.push(...page);
    const total = body.pagination?.total ?? items.length;
    if (items.length >= total || page.length === 0) break;
    offset += page.length;
  }
  return items;
}

function normalizeItem(
  item: WebflowItem,
  optionMaps: Record<string, { id: string; name: string }[]>,
  locale: string,
  expectedCmsLocaleId: string,
): LocalOfferCmsFieldData {
  const f = item.fieldData ?? {};
  const itemLocaleId = String(item.cmsLocaleId ?? '');
  if (itemLocaleId && itemLocaleId !== expectedCmsLocaleId) {
    throw new Error(
      `Webflow returned item for wrong CMS locale. expected cmsLocaleId=${expectedCmsLocaleId} (${locale}), got ${itemLocaleId}`,
    );
  }
  return {
    name: String(f.name ?? ''),
    slug: String(f.slug ?? ''),
    displayOfferTitle: String(f['display-offer-title'] ?? ''),
    offerImageUrl: imageUrl(f['offer-image']),
    urgencyText: resolveOptionLabel(f['urgency-text-2'], optionMaps['urgency-text-2']),
    leadSourceCode: String(f['lead-source-code'] ?? ''),
    apiOfferTitle: String(f['api-offer-title'] ?? ''),
    apiWorkflowName: String(f['api-workflowname'] ?? ''),
    promoType: String(f['promo-type'] ?? ''),
    gymStatusRequirement: resolveOptionLabel(
      f['gym-status-requirement'],
      optionMaps['gym-status-requirement'],
    ),
    termsShort: stripHtml(String(f['terms-and-conditions'] ?? '')),
    termsLong: stripHtml(String(f['terms-and-conditions-long'] ?? '')),
    metaTitle: String(f['meta-title'] ?? ''),
    metaDescription: String(f['meta-description'] ?? ''),
    openGraphTitle: String(f['open-graph-title'] ?? ''),
    h2HeadingOverride: String(f['h2-heading-override'] ?? ''),
    bulletPoints: parseBullets(f['bullet-points-override']),
    openGraphImageUrl: imageUrl(f['open-graph-image']),
    showJoinOnlineCard: Boolean(f['show-join-online-card']),
    cmsLocaleId: itemLocaleId || expectedCmsLocaleId,
    locale: locale.toUpperCase(),
  };
}

/** Resolve Webflow cmsLocaleId from LOCALE env (e.g. EN-CA). */
export function resolveWebflowCmsLocaleId(locale: string): string {
  const key = locale.trim().toUpperCase();
  const id = WEBFLOW_CMS_LOCALE_IDS[key];
  if (!id) {
    throw new Error(
      `No WEBFLOW_CMS_LOCALE_IDS entry for locale "${locale}". Add it in utils/constants/index.ts.`,
    );
  }
  return id;
}

/**
 * Pull a Local Offer CMS item for a locale (filtered by cmsLocaleId) and normalize field values.
 * Always pass the ticket/site locale (e.g. EN-CA) — primary/en-US content differs per locale.
 */
export async function fetchLocalOfferCmsItemBySlug(
  locale: string,
  slug: string,
): Promise<LocalOfferCmsFieldData> {
  const token = getToken();
  const localeKey = locale.trim().toUpperCase();
  const cmsLocaleId = resolveWebflowCmsLocaleId(localeKey);
  logger.info(
    `Fetching Webflow Local Offer CMS LIVE item slug="${slug}" locale=${localeKey} cmsLocaleId=${cmsLocaleId}`,
  );
  const [optionMaps, items] = await Promise.all([
    fetchCollectionOptionMaps(token),
    listItemsForLocale(token, cmsLocaleId),
  ]);
  const match = items.find(
    i =>
      String(i.fieldData?.slug ?? '') === slug && (!i.cmsLocaleId || i.cmsLocaleId === cmsLocaleId),
  );
  if (!match) {
    const available = items
      .map(i => `${i.fieldData?.slug ?? '?'}[cmsLocaleId=${i.cmsLocaleId ?? 'n/a'}]`)
      .filter(Boolean);
    throw new Error(
      `CMS item not found for slug="${slug}" locale=${localeKey} (cmsLocaleId=${cmsLocaleId}). Available: ${available.join(', ')}`,
    );
  }
  logger.info(
    `Fetched CMS item "${String(match.fieldData?.name ?? '')}" display="${String(match.fieldData?.['display-offer-title'] ?? '')}" cmsLocaleId=${match.cmsLocaleId}`,
  );
  return normalizeItem(match, optionMaps, localeKey, cmsLocaleId);
}
