/**
 * One-shot EN-ID onboarding: patch maps/Jenkins/docs and add @ID on Coverage YES flows.
 * Safe additive only — does not remove existing locale tags.
 *
 * Coverage YES: Contact Us, Corporate Membership, Events Promo, Membership Inquiry,
 * Try Us Free, Location Search, Find a gym.
 * Coverage NO: Book A Tour, Own A Gym, Events Join Online, Invite/Share, Apple Fitness, etc.
 * Local Offer: Coverage YES but leave untagged (same as TH/PH/SG/NZ — no guaranteed prod offer).
 *
 * Sources: AFW-3661 + Local Config ID (Jakarta / ID-0001 / +62).
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

// --- locale-element-map (dual residency/marketing like SG/PH until AFW-3718) ---
patchFile('utils/locale-utils/locale-element-map.ts', (s) => {
  if (s.includes("'en-id':")) return s;
  return s.replace(
    `  // NZ: AFW-3657 — US-style legal without California disclaimer; postcode from Local Config
  'en-nz': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`,
    `  // NZ: AFW-3657 — US-style legal without California disclaimer; postcode from Local Config
  'en-nz': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // ID: AFW-3661 — postal from Local Config; legal disclaimer AFW-3718 (separate)
  'en-id': {
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
  if (s.includes("'en-id':")) return s;
  return s.replace(
    `'en-nz': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],`,
    `'en-nz': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],
  'en-id': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],`,
  );
});

// --- locationTestStudio ---
patchFile('resources/locationTestStudio.ts', (s) => {
  if (s.includes('"EN-ID"')) return s;
  return s.replace(`"EN-NZ":"NZ-1042",`, `"EN-NZ":"NZ-1042",\n  "EN-ID":"ID-0001",`);
});

// --- helpers phone region ---
patchFile('utils/helpers.ts', (s) => {
  if (s.includes("'en-id':")) return s;
  return s.replace(`'en-nz': 'NZ',`, `'en-nz': 'NZ',\n      'en-id': 'ID',`);
});

// --- localization language ---
patchFile('utils/localization/locale.ts', (s) => {
  if (s.includes("'en-id':")) return s;
  return s.replace(`'en-nz': 'English',`, `'en-nz': 'English',\n  'en-id': 'English',`);
});

// --- Jenkins ---
patchFile('Jenkinsfile', (s) => {
  let out = s;
  if (!out.includes("LOCALE_EN_ID")) {
    out = out.replace(
      `booleanParam(name: 'LOCALE_EN_NZ', defaultValue: false, description: 'EN-NZ — New Zealand')`,
      `booleanParam(name: 'LOCALE_EN_NZ', defaultValue: false, description: 'EN-NZ — New Zealand')\n        booleanParam(name: 'LOCALE_EN_ID', defaultValue: false, description: 'EN-ID — Indonesia')`,
    );
  }
  if (!out.includes("'EN-ID': 'ID'")) {
    out = out.replace(`'EN-NZ': 'NZ'`, `'EN-NZ': 'NZ',\n        'EN-ID': 'ID'`);
  }
  if (!out.includes("'EN-ID': params.LOCALE_EN_ID")) {
    out = out.replace(
      `'EN-NZ': params.LOCALE_EN_NZ`,
      `'EN-NZ': params.LOCALE_EN_NZ,\n        'EN-ID': params.LOCALE_EN_ID`,
    );
  }
  return out;
});

// --- sync LOCALE_TAG_MAP ---
patchFile('scripts/sync-knowledge-base.mjs', (s) => {
  if (s.includes("ID: { locale: 'EN-ID'")) return s;
  let out = s;
  if (!out.includes("TH: { locale: 'TH-TH'")) return out;
  // Extend map with APAC spin-ups missing from sync
  if (!out.includes("PH: {")) {
    out = out.replace(
      `  TH: { locale: 'TH-TH', folder: 'th-th', tag: 'TH' },
};`,
      `  TH: { locale: 'TH-TH', folder: 'th-th', tag: 'TH' },
  PH: { locale: 'EN-PH', folder: 'en-ph', tag: 'PH' },
  SG: { locale: 'EN-SG', folder: 'en-sg', tag: 'SG' },
  NZ: { locale: 'EN-NZ', folder: 'en-nz', tag: 'NZ' },
  ID: { locale: 'EN-ID', folder: 'en-id', tag: 'ID' },
};`,
    );
  } else if (!out.includes("ID: {")) {
    out = out.replace(
      /NZ: \{ locale: 'EN-NZ', folder: 'en-nz', tag: 'NZ' \},?\n/,
      `NZ: { locale: 'EN-NZ', folder: 'en-nz', tag: 'NZ' },\n  ID: { locale: 'EN-ID', folder: 'en-id', tag: 'ID' },\n`,
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
    if (s.includes('| EN-ID |')) return s;
    return s.replace(
      `| EN-NZ | en-nz | @NZ | NZ |`,
      `| EN-NZ | en-nz | @NZ | NZ |\n| EN-ID | en-id | @ID | ID |`,
    );
  });
}

function addTagAfter(line, afterTag, newTag) {
  if (new RegExp(`(^|\\s)${newTag}(\\s|$)`).test(line)) return line;
  if (!new RegExp(`(^|\\s)${afterTag}(\\s|$)`).test(line)) return line;
  if (/@UntranslatedTextScan/.test(line)) return line;
  return line.replace(new RegExp(`(^|\\s)${afterTag}(\\s|$)`), `$1${afterTag} ${newTag}$2`);
}

// Shared YES flows — add @ID beside @SG / @PH / @NZ / @TH
const sharedYes = [
  'features/contactUs/contact-us.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/tryUsFree/try-us-free.feature',
  'features/events/events-promo.feature',
  'features/findAGym/find-a-gym.feature',
  'features/locationSearchOnStaticPages/location-search-on-static-pages.feature',
  'features/corporateMembership/corporate-membership.feature',
];

for (const rel of sharedYes) {
  patchFile(rel, (s) =>
    s
      .split('\n')
      .map((line) => {
        let out = line;
        out = addTagAfter(out, '@SG', '@ID');
        if (!/\b@ID\b/.test(out)) out = addTagAfter(out, '@NZ', '@ID');
        if (!/\b@ID\b/.test(out)) out = addTagAfter(out, '@PH', '@ID');
        if (!/\b@ID\b/.test(out) && /(^|\s)@TH(\s|$)/.test(out) && /(^|\s)@PH(\s|$)/.test(out)) {
          out = addTagAfter(out, '@TH', '@ID');
        }
        return out;
      })
      .join('\n'),
  );
}

// Ticket tag AFW-3661 on ID consolidations
for (const rel of sharedYes) {
  patchFile(rel, (s) =>
    s
      .split('\n')
      .map((line) => {
        if (!/\b@ID\b/.test(line)) return line;
        if (/\b@AFW-3661\b/.test(line)) return line;
        if (/\b@AFW-3660\b/.test(line)) {
          return line.replace('@AFW-3660', '@AFW-3660 @AFW-3661');
        }
        if (/\b@AFW-3658\b/.test(line)) {
          return line.replace('@AFW-3658', '@AFW-3658 @AFW-3661');
        }
        if (/\b@AFW-3657\b/.test(line)) {
          return line.replace('@AFW-3657', '@AFW-3657 @AFW-3661');
        }
        if (/ConsolidatedPass|@TC-/.test(line)) {
          return line.replace(/(@\w+ConsolidatedPass|@TC-\S+)/, '$1 @AFW-3661');
        }
        return line;
      })
      .join('\n'),
  );
}

console.log('done');
