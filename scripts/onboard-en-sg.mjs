/**
 * One-shot EN-SG onboarding: patch maps/Jenkins/docs and add @SG beside @PH on Coverage YES flows.
 * Safe additive only — does not remove existing locale tags.
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();

function patchFile(rel, replacer) {
  const p = path.join(root, rel);
  const before = fs.readFileSync(p, 'utf8');
  const after = replacer(before);
  if (after === before) {
    console.log(`no-change: ${rel}`);
    return;
  }
  fs.writeFileSync(p, after);
  console.log(`patched: ${rel}`);
}

// --- locale-element-map ---
patchFile('utils/locale-utils/locale-element-map.ts', (s) => {
  if (s.includes("'en-sg':")) return s;
  return s.replace(
    `'en-ph': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`,
    `'en-ph': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // SG: AFW-3628 PDPA dual disclaimer (CB1 pre-checked required + CB2 optional); postal from Local Config; Corporate YES
  'en-sg': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`,
  );
});

// --- locale-keys-skip ---
patchFile('utils/locale-utils/locale-keys-skip.ts', (s) => {
  if (s.includes("'en-sg':")) return s;
  return s.replace(
    `'en-ph': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],`,
    `'en-ph': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],
  'en-sg': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],`,
  );
});

// --- locationTestStudio ---
patchFile('resources/locationTestStudio.ts', (s) => {
  if (s.includes('"EN-SG"')) return s;
  return s.replace(`"EN-PH":"PH-0083",`, `"EN-PH":"PH-0083",\n  "EN-SG":"SG-0053",`);
});

// --- helpers phone region ---
patchFile('utils/helpers.ts', (s) => {
  if (s.includes("'en-sg':")) return s;
  return s.replace(`'en-ph': 'PH',`, `'en-ph': 'PH',\n      'en-sg': 'SG',`);
});

// --- localization language ---
patchFile('utils/localization/locale.ts', (s) => {
  if (s.includes("'en-sg':")) return s;
  return s.replace(`'en-ph': 'English',`, `'en-ph': 'English',\n  'en-sg': 'English',`);
});

// --- Jenkins ---
patchFile('Jenkinsfile', (s) => {
  let out = s;
  if (!out.includes("LOCALE_EN_SG")) {
    out = out.replace(
      `booleanParam(name: 'LOCALE_EN_PH', defaultValue: false, description: 'EN-PH — Philippines')`,
      `booleanParam(name: 'LOCALE_EN_PH', defaultValue: false, description: 'EN-PH — Philippines')\n        booleanParam(name: 'LOCALE_EN_SG', defaultValue: false, description: 'EN-SG — Singapore')`,
    );
  }
  if (!out.includes("'EN-SG': 'SG'")) {
    out = out.replace(`'EN-PH': 'PH'`, `'EN-PH': 'PH',\n        'EN-SG': 'SG'`);
  }
  if (!out.includes("'EN-SG': params.LOCALE_EN_SG")) {
    out = out.replace(
      `'EN-PH': params.LOCALE_EN_PH`,
      `'EN-PH': params.LOCALE_EN_PH,\n        'EN-SG': params.LOCALE_EN_SG`,
    );
  }
  return out;
});

// --- docs tables ---
for (const rel of [
  'AGENTS.md',
  '.cursor/skills/onboard-locale/SKILL.md',
  '.cursor/skills/af-automation-agent/SKILL.md',
]) {
  patchFile(rel, (s) => {
    if (s.includes('| EN-SG |')) return s;
    return s.replace(
      `| EN-PH | en-ph | @PH | PH |`,
      `| EN-PH | en-ph | @PH | PH |\n| EN-SG | en-sg | @SG | SG |`,
    );
  });
}

// --- Feature tags: add @SG next to @PH on Coverage YES flows (not UntranslatedTextScan) ---
const featureFiles = [
  'features/contactUs/contact-us.feature',
  'features/corporateMembership/corporate-membership.feature',
  'features/events/events-promo.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/tryUsFree/try-us-free.feature',
  'features/findAGym/find-a-gym.feature',
  'features/locationSearchOnStaticPages/location-search-on-static-pages.feature',
];

for (const rel of featureFiles) {
  patchFile(rel, (s) => {
    // Add @SG after @PH when @PH present and @SG missing on same tag line.
    // Avoid @PhoneNumber false positives — only match standalone @PH token.
    return s
      .split('\n')
      .map((line) => {
        if (/\b@SG\b/.test(line)) return line;
        if (!/(^|\s)@PH(\s|$)/.test(line)) return line;
        // Skip untranslated scan lines
        if (/@UntranslatedTextScan/.test(line)) return line;
        return line.replace(/(^|\s)@PH(\s|$)/, '$1@PH @SG$2');
      })
      .join('\n');
  });
}

// Add @AFW-3628 beside @AFW-3705 on SG-tagged disclaimer consolidations (PDPA)
for (const rel of [
  'features/corporateMembership/corporate-membership.feature',
  'features/events/events-promo.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/tryUsFree/try-us-free.feature',
  'features/contactUs/contact-us.feature',
]) {
  patchFile(rel, (s) => {
    return s
      .split('\n')
      .map((line) => {
        if (!/\b@AFW-3705\b/.test(line) || !/\b@SG\b/.test(line)) return line;
        if (/\b@AFW-3628\b/.test(line)) return line;
        return line.replace('@AFW-3705', '@AFW-3705 @AFW-3628');
      })
      .join('\n');
  });
}

console.log('done');
