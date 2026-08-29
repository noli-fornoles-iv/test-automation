import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LINKS = join(__dirname, '..', '.cursor', 'knowledge-base', 'links');
mkdirSync(LINKS, { recursive: true });

function csvEscape(cell) {
  const s = cell == null ? '' : String(cell);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(values) {
  return values.map((row) => (row ?? []).map(csvEscape).join(',')).join('\n');
}

const localized = [
  [
    'Component/text with different content implementations',
    'US',
    'en-AU',
    'en-AE',
    'ar-SA',
    'en-ZA',
    'en-GB',
    'en-IE',
    'en-IN',
    'ar-KW',
    'en-CA',
    'fr-CA',
    'de-DE',
  ],
  [
    'Location search context (placeholder, SEO texts, paragraph text)',
    'Search by city & state or zipe code',
    '',
    'Search by city and emirate',
    '',
    '',
    '',
    'Search by city & province or eircode',
    '',
    '',
    '',
    'Recherchez par ville et province ou code postal',
  ],
  [
    'Zip Code Term for Input Labels & Error Messages',
    'zip code',
    'postcode',
    'N/A',
    'zip code',
    'postal code',
    'postcode',
    'Zip codes are OFF for this locale',
    'PIN code',
    '',
    'Postal code',
    'code postal',
  ],
  [
    'Own A Gym Phone Numbers',
    'N/A',
    '',
    '+1-800-704-5004',
    '',
    '',
    'N/A',
    'N/A',
    '',
    '',
    '',
    ' 1 (613) 656-0122 #103',
  ],
  [
    'Inquire/Inquiry term on Membership Inquiry, Events Pages, Thank You page, and Membership page accordion',
    'Inquiry/Inquire',
    'Enquire/Enquiry',
    'Inquiry/Inquire',
    '',
    '',
    'Enquire/Enquiry',
    'Enquire/Enquiry',
    '',
    '',
    'Inquiry/Inquire',
    'N/A',
  ],
  [
    'CTA on Apple Fitness+ Section on LLP',
    'Try Us Free',
    'Get Started',
    'Not enabled',
    'Not enabled',
    'Not enabled',
    '',
    '',
    'Not enabled',
    'Not enabled',
    '',
    '',
    'Not enabled',
  ],
  [
    'Global Gym Count',
    '5,800+',
    '5,800+',
    '5,800+',
    '5,800+',
    '5,800+',
    '5,800+',
    '5,800+',
    '5,800+',
    '5,800+',
    '',
    '5,800+',
  ],
  ['National Gym Count', 'N/A', '600+'],
  [
    'Invite A Friend CTA in /invite-friend & thank you page',
    'SHARE TRIAL PASS',
    'SHARE INVITATION',
    'Not enabled',
    'Not enabled',
    'Not enabled',
    'SHARE TRIAL PASS',
    'SHARE TRIAL PASS',
    'Not enabled',
    'Not enabled',
    'SHARE TRIAL PASS',
    'SHARE TRIAL PASS (translated to French)',
  ],
];

const formStarted = [
  ['Flows', 'form_type', 'form_offer', 'form_id', 'form_name', 'campaign_name'],
  ['BAT Standalone', '', '"tour"', '"lead-form"', '"schedule appointment"'],
  ['Membership Inquiry', '', 'general', '', '"membership inquiry"'],
  ['Try Us Free', '', 'free_day_pass'],
  ['Apple Fitness Offer', '', 'apple_fitness_plus', '', '"fitness plus free trial"'],
  ['Apple Fitness Plus Subscriber', '', 'apple_fitness_plus'],
  ['Invite A Friend Flows', '', 'free_day_pass', '', '"free trial"'],
  ['Local Offers', '', 'general', '', '', 'depending on the local offer title'],
  ['MCO/Group Offers', '', 'general', '', '', 'depending on the mco offer title'],
  ['Member Offers', '', 'general', '', '', 'depending on the member offer title'],
  ['Events - Free Trial', '', 'general', '', '"Events Free Trial"'],
  ['Events - Train For Your Life', '', 'general', '', '"Events Train For Your Life"'],
  ['Events - Promo', '', 'general', '', '"Events Promo"'],
  ['Email Club', '', 'general'],
  ['Own A Gym', '', 'general'],
  ['Corporate Membership', '', 'general'],
];

writeFileSync(join(LINKS, 'localized-content-implementations.csv'), toCsv(localized));
writeFileSync(join(LINKS, 'form-started-flows-values-rudderstack.csv'), toCsv(formStarted));
writeFileSync(
  join(LINKS, 'github-af-resources.txt'),
  [
    '# Github (AF Resources)',
    'Repo: https://github.com/noli-fornoles-iv/af-website-resources',
    'Synced via: GitHub MCP get_file_contents',
    '',
    '## Root contents',
    '- af-webapp-iframes/',
    '- pb-webflow-shared-library/',
    '',
  ].join('\n'),
);

console.log('Wrote localized-content, form-started, github-af-resources');
