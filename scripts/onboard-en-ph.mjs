/**
 * One-shot EN-PH wiring helper: locale maps, Jenkins, geo/search overrides, @PH tags.
 * Idempotent — safe to re-run.
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, c) => fs.writeFileSync(path.join(root, p), c, 'utf8');

function insertAfter(haystack, needle, insertion) {
  if (haystack.includes(insertion.trim()) || haystack.includes(insertion)) return haystack;
  const i = haystack.indexOf(needle);
  if (i < 0) throw new Error(`Needle not found: ${needle.slice(0, 80)}`);
  return haystack.slice(0, i + needle.length) + insertion + haystack.slice(i + needle.length);
}

function replaceOnce(haystack, from, to) {
  if (haystack.includes(to.trim()) && !haystack.includes(from)) return haystack;
  if (!haystack.includes(from)) throw new Error(`Replace target missing: ${from.slice(0, 80)}`);
  return haystack.replace(from, to);
}

// --- locale-element-map ---
{
  let s = read('utils/locale-utils/locale-element-map.ts');
  if (!s.includes("'en-ph'")) {
    s = insertAfter(
      s,
      `  'th-th': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`,
      `
  // PH: AFW-3705 dual disclaimer (CB1 pre-checked required + CB2 optional); zip from Local Config; Corporate YES
  'en-ph': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`.replace(
        `  'th-th': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`,
        '',
      ),
    );
    // The insertAbove approach was wrong — do a clean replace of the closing th-th block
  }
  s = read('utils/locale-utils/locale-element-map.ts');
  if (!s.includes("'en-ph'")) {
    s = s.replace(
      `  'th-th': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`,
      `  'th-th': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // PH: AFW-3705 dual disclaimer (CB1 pre-checked required + CB2 optional); zip from Local Config; Corporate YES
  'en-ph': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`,
    );
    write('utils/locale-utils/locale-element-map.ts', s);
  }
}

// --- locale-keys-skip ---
{
  let s = read('utils/locale-utils/locale-keys-skip.ts');
  if (!s.includes("'en-ph'")) {
    s = s.replace(
      `  'th-th': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],
};`,
      `  'th-th': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],
  // PH Coverage: Corporate Membership YES — keep corporate keys. Skip unavailable event BAT/Fitphoria only.
  'en-ph': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],
};`,
    );
    write('utils/locale-utils/locale-keys-skip.ts', s);
  }
}

// --- locationTestStudio ---
{
  let s = read('resources/locationTestStudio.ts');
  if (!s.includes('"EN-PH"')) {
    s = s.replace(`  "TH-TH":"TH-0003",\n};`, `  "TH-TH":"TH-0003",\n  "EN-PH":"PH-0083",\n};`);
    write('resources/locationTestStudio.ts', s);
  }
}

// --- locale-manager stateVariantLocales ---
{
  let s = read('utils/locale-utils/locale-manager.ts');
  if (!s.includes("'en-ph'")) {
    s = s.replace(
      `const stateVariantLocales = new Set(['en-us', 'en-gb', 'en-in', 'en-au', 'de-de', 'de-at', 'th-th']);`,
      `const stateVariantLocales = new Set(['en-us', 'en-gb', 'en-in', 'en-au', 'de-de', 'de-at', 'th-th', 'en-ph']);`,
    );
    write('utils/locale-utils/locale-manager.ts', s);
  }
}

// --- helpers country map ---
{
  let s = read('utils/helpers.ts');
  if (!s.includes("'en-ph'")) {
    s = s.replace(`      'th-th': 'TH',`, `      'th-th': 'TH',\n      'en-ph': 'PH',`);
    write('utils/helpers.ts', s);
  }
}

// --- localization locale language map (English — do NOT add to NON_ENGLISH_SCAN) ---
{
  let s = read('utils/localization/locale.ts');
  if (!s.includes("'en-ph'")) {
    s = s.replace(`  'th-th': 'Thai',`, `  'th-th': 'Thai',\n  'en-ph': 'English',`);
    write('utils/localization/locale.ts', s);
  }
}

// --- LocationSearchOnStaticPages geo ---
{
  let s = read('pages/modules/LocationSearchOnStaticPagesPage.ts');
  if (!s.includes("'en-ph'")) {
    s = s.replace(
      `  'th-th': { latitude: 13.7563, longitude: 100.5018 }, // Bangkok (AFW-3660 / TH-0003)
};`,
      `  'th-th': { latitude: 13.7563, longitude: 100.5018 }, // Bangkok (AFW-3660 / TH-0003)
  'en-ph': { latitude: 14.5995, longitude: 120.9842 }, // Manila (AFW-3658 / PH-0083)
};`,
    );
    s = s.replace(`  'th-th': 'TH',\n};`, `  'th-th': 'TH',\n  'en-ph': 'PH',\n};`);
    write('pages/modules/LocationSearchOnStaticPagesPage.ts', s);
  }
}

// --- LocationSearchPage SEARCH_LOCALE_GEO + Test→Manila remap ---
{
  let s = read('pages/common/LocationSearchPage.ts');
  if (!s.includes("'en-ph'")) {
    s = s.replace(
      `  'th-th': { latitude: 13.7563, longitude: 100.5018 },`,
      `  'th-th': { latitude: 13.7563, longitude: 100.5018 },\n  'en-ph': { latitude: 14.5995, longitude: 120.9842 },`,
    );
    const thRemap = `    if (locale.toLowerCase() === 'th-th' && !location.toLowerCase().includes('ikkkkkkk')) {
      const defaultSearch = d(TestDataKeys.Locations.Search.Default).trim();
      if (location.trim().toLowerCase() === defaultSearch.toLowerCase() || location.trim().toLowerCase() === 'test') {
        location = 'Bangkok';
        await this.page.context()
          .setGeolocation({ latitude: 13.7563, longitude: 100.5018 })
          .catch(() => {});
      }
    }`;
    const phRemap = `${thRemap}
    // EN-PH Local Config Default Search is gym label "Test" (PH-0083). Mapbox Places does not
    // resolve that studio label — use Manila (AFW-3658) and keep test_location_id.
    if (locale.toLowerCase() === 'en-ph' && !location.toLowerCase().includes('ikkkkkkk')) {
      const defaultSearch = d(TestDataKeys.Locations.Search.Default).trim();
      if (location.trim().toLowerCase() === defaultSearch.toLowerCase() || location.trim().toLowerCase() === 'test') {
        location = 'Manila';
        await this.page.context()
          .setGeolocation({ latitude: 14.5995, longitude: 120.9842 })
          .catch(() => {});
      }
    }`;
    if (!s.includes("locale.toLowerCase() === 'en-ph'")) {
      s = s.replace(thRemap, phRemap);
    }
    write('pages/common/LocationSearchPage.ts', s);
  }
}

// --- static LS steps search prefix/term ---
{
  let s = read('step-definitions/locationSearchOnStaticPages/location-search-on-static-pages.steps.ts');
  if (!s.includes("'en-ph'")) {
    s = s.replace(`  'th-th': 'ban',\n};`, `  'th-th': 'ban',\n  'en-ph': 'man',\n};`);
    s = s.replace(
      `  'th-th': 'Bangkok',\n};`,
      `  'th-th': 'Bangkok',\n  'en-ph': 'Manila',\n};`,
    );
    write('step-definitions/locationSearchOnStaticPages/location-search-on-static-pages.steps.ts', s);
  }
}

// --- find-a-gym steps overrides ---
{
  let s = read('step-definitions/findAGym/find-a-gym.steps.ts');
  if (!s.includes("'en-ph'")) {
    s = s.replace(`  'th-th': 'Bangkok',`, `  'th-th': 'Bangkok',\n  'en-ph': 'Manila',`);
    s = s.replace(`    'th-th': 'Mae Hong Son',`, `    'th-th': 'Mae Hong Son',\n    'en-ph': 'Batanes',`);
    s = s.replaceAll(`        'th-th': 'ban',`, `        'th-th': 'ban',\n        'en-ph': 'man',`);
    s = s.replaceAll(`      'th-th': 'ban',`, `      'th-th': 'ban',\n      'en-ph': 'man',`);
    write('step-definitions/findAGym/find-a-gym.steps.ts', s);
  }
}

// --- Jenkinsfile ---
{
  let s = read('Jenkinsfile');
  if (!s.includes('LOCALE_EN_PH')) {
    s = s.replace(
      `        booleanParam(name: 'LOCALE_TH_TH', defaultValue: false, description: 'TH-TH — Thailand')`,
      `        booleanParam(name: 'LOCALE_TH_TH', defaultValue: false, description: 'TH-TH — Thailand')
        booleanParam(name: 'LOCALE_EN_PH', defaultValue: false, description: 'EN-PH — Philippines')`,
    );
    s = s.replace(`        'TH-TH': 'TH'\n    ]`, `        'TH-TH': 'TH',\n        'EN-PH': 'PH'\n    ]`);
    s = s.replace(
      `        'TH-TH': params.LOCALE_TH_TH\n    ]`,
      `        'TH-TH': params.LOCALE_TH_TH,\n        'EN-PH': params.LOCALE_EN_PH\n    ]`,
    );
    write('Jenkinsfile', s);
  }
}

// --- AGENTS.md + skill locale tables ---
for (const file of [
  'AGENTS.md',
  '.cursor/skills/af-automation-agent/SKILL.md',
  '.cursor/skills/onboard-locale/SKILL.md',
]) {
  let s = read(file);
  if (!s.includes('| EN-PH |')) {
    s = s.replace(
      `| TH-TH | th-th | @TH | TH |`,
      `| TH-TH | th-th | @TH | TH |\n| EN-PH | en-ph | @PH | PH |`,
    );
    write(file, s);
  }
}

// --- Feature tags: add @PH next to @TH on Coverage-YES flows only ---
const yesFeatures = [
  'features/contactUs/contact-us.feature',
  'features/corporateMembership/corporate-membership.feature',
  'features/events/events-promo.feature',
  'features/localOffer/local-offer.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/tryUsFree/try-us-free.feature',
  'features/locationSearchOnStaticPages/location-search-on-static-pages.feature',
  'features/findAGym/find-a-gym.feature',
];

let taggedLines = 0;
for (const file of yesFeatures) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  let s = read(file);
  const lines = s.split(/\r?\n/);
  const out = lines.map(line => {
    // Only tag lines that already have @TH and not yet @PH
    if (!line.includes('@TH') || line.includes('@PH')) return line;
    // Skip pure comment lines without scenario tags
    if (/^\s*#/.test(line) && !/@TC-|@AFW-|@Regression|@Smoke|@REGULAR/.test(line)) return line;
    taggedLines += 1;
    // Insert @PH after @TH
    let next = line.replace(/@TH\b/, '@TH @PH');
    // Spin-up / legal disclaimer consolidations: also stamp AFW-3658 / AFW-3705 when AFW-3660/3722 present
    if (/\b@AFW-3660\b/.test(next) && !/\b@AFW-3658\b/.test(next)) {
      next = next.replace(/@AFW-3660\b/, '@AFW-3660 @AFW-3658');
    }
    if (/\b@AFW-3722\b/.test(next) && !/\b@AFW-3705\b/.test(next)) {
      next = next.replace(/@AFW-3722\b/, '@AFW-3722 @AFW-3705');
    }
    return next;
  });
  write(file, out.join('\n'));
}

console.log(JSON.stringify({ taggedLines, ok: true }, null, 2));
