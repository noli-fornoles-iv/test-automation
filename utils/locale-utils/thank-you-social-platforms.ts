/**
 * Expected Thank You page social platforms per locale.
 * Source: Resources → Footer sheet (SOCIAL column) + Webflow Country Onboarding Guide
 * (social buttons must be updated on Footer + Thank-you page per locale).
 * TH / NZ / ID are not fully listed in the Footer sheet export — platforms match
 * live CMS thank-you pages (aligned with APAC footer pattern).
 */
export type ThankYouSocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'pinterest'
  | 'tiktok';

export const THANK_YOU_SOCIAL_HREF_PATTERNS: Record<ThankYouSocialPlatform, RegExp> = {
  facebook: /facebook\.com/i,
  instagram: /instagram\.com/i,
  twitter: /(twitter\.com|x\.com)/i,
  linkedin: /linkedin\.com/i,
  youtube: /(youtube\.com|youtu\.be)/i,
  pinterest: /pinterest\./i,
  tiktok: /tiktok\.com/i,
};

/** Locale → required platforms that must appear in `div.thankyou-social`. */
export const THANK_YOU_SOCIAL_PLATFORMS_BY_LOCALE: Record<string, ThankYouSocialPlatform[]> = {
  'en-us': ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'youtube', 'tiktok'],
  'en-ca': ['facebook', 'instagram', 'linkedin', 'youtube', 'tiktok'],
  // FR-CA Quebec thank-you footer (SIT): facebook, instagram, youtube only
  'fr-ca': ['facebook', 'instagram', 'youtube'],
  'en-au': ['facebook', 'instagram', 'linkedin', 'youtube', 'tiktok'],
  'en-ae': ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'youtube', 'tiktok'],
  'ar-sa': ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'youtube', 'tiktok'],
  'en-za': ['facebook', 'instagram', 'twitter', 'linkedin'],
  'en-gb': ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'],
  'en-ie': ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'],
  'en-in': ['facebook', 'instagram', 'twitter', 'pinterest', 'youtube'],
  'de-de': ['instagram', 'linkedin', 'youtube'],
  'de-at': ['facebook', 'instagram'],
  'it-it': ['facebook', 'instagram', 'linkedin', 'youtube', 'tiktok'],
  'en-ph': ['facebook', 'instagram', 'linkedin', 'youtube', 'twitter'],
  'en-sg': ['facebook', 'instagram', 'youtube', 'tiktok'],
  'th-th': ['facebook', 'instagram', 'youtube', 'linkedin'],
  'en-nz': ['facebook', 'instagram', 'youtube', 'linkedin'],
  'en-id': ['facebook', 'instagram', 'youtube', 'linkedin'],
  'zh-hk': ['facebook', 'instagram', 'youtube', 'linkedin'],
  'en-my': ['facebook', 'instagram', 'youtube', 'linkedin'],
};

export function expectedThankYouSocialPlatforms(
  locale: string,
): ThankYouSocialPlatform[] | undefined {
  return THANK_YOU_SOCIAL_PLATFORMS_BY_LOCALE[locale.toLowerCase()];
}

export function detectThankYouSocialPlatform(href: string): ThankYouSocialPlatform | undefined {
  const entry = (
    Object.entries(THANK_YOU_SOCIAL_HREF_PATTERNS) as [ThankYouSocialPlatform, RegExp][]
  ).find(([, pattern]) => pattern.test(href));
  return entry?.[0];
}
