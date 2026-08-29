/**
 * One-shot EN-NZ onboarding: patch maps/Jenkins/docs and add @NZ on Coverage YES flows.
 * Safe additive only — does not remove existing locale tags.
 * Coverage YES: Contact Us, Events Join Online, Events Promo, Membership Inquiry,
 * Own A Gym, Try Us Free, Location Search, Find a gym.
 * Coverage NO: Corporate, Book A Tour, Invite/Share, Apple Fitness, most other Events.
 * Local Offer: Coverage YES but leave untagged (same as TH/PH — no guaranteed prod offer).
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

// --- locale-element-map (US-like dual disclaimer without CA — AFW-3657) ---
patchFile('utils/locale-utils/locale-element-map.ts', (s) => {
  if (s.includes("'en-nz':")) return s;
  return s.replace(
    `  'en-sg': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`,
    `  'en-sg': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // NZ: AFW-3657 — US-style legal without California disclaimer; postcode from Local Config
  'en-nz': {
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
  if (s.includes("'en-nz':")) return s;
  return s.replace(
    `'en-sg': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],`,
    `'en-sg': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],
  'en-nz': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],`,
  );
});

// --- locationTestStudio ---
patchFile('resources/locationTestStudio.ts', (s) => {
  if (s.includes('"EN-NZ"')) return s;
  return s.replace(`"EN-SG":"SG-0053",`, `"EN-SG":"SG-0053",\n  "EN-NZ":"NZ-1042",`);
});

// --- helpers phone region ---
patchFile('utils/helpers.ts', (s) => {
  if (s.includes("'en-nz':")) return s;
  return s.replace(`'en-sg': 'SG',`, `'en-sg': 'SG',\n      'en-nz': 'NZ',`);
});

// --- localization language ---
patchFile('utils/localization/locale.ts', (s) => {
  if (s.includes("'en-nz':")) return s;
  return s.replace(`'en-sg': 'English',`, `'en-sg': 'English',\n  'en-nz': 'English',`);
});

// --- Jenkins ---
patchFile('Jenkinsfile', (s) => {
  let out = s;
  if (!out.includes("LOCALE_EN_NZ")) {
    out = out.replace(
      `booleanParam(name: 'LOCALE_EN_SG', defaultValue: false, description: 'EN-SG — Singapore')`,
      `booleanParam(name: 'LOCALE_EN_SG', defaultValue: false, description: 'EN-SG — Singapore')\n        booleanParam(name: 'LOCALE_EN_NZ', defaultValue: false, description: 'EN-NZ — New Zealand')`,
    );
  }
  if (!out.includes("'EN-NZ': 'NZ'")) {
    out = out.replace(`'EN-SG': 'SG'`, `'EN-SG': 'SG',\n        'EN-NZ': 'NZ'`);
  }
  if (!out.includes("'EN-NZ': params.LOCALE_EN_NZ")) {
    out = out.replace(
      `'EN-SG': params.LOCALE_EN_SG`,
      `'EN-SG': params.LOCALE_EN_SG,\n        'EN-NZ': params.LOCALE_EN_NZ`,
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
    if (s.includes('| EN-NZ |')) return s;
    return s.replace(
      `| EN-SG | en-sg | @SG | SG |`,
      `| EN-SG | en-sg | @SG | SG |\n| EN-NZ | en-nz | @NZ | NZ |`,
    );
  });
}

function addTagAfter(line, afterTag, newTag) {
  if (new RegExp(`\\b${newTag}\\b`).test(line)) return line;
  if (!new RegExp(`(^|\\s)${afterTag}(\\s|$)`).test(line)) return line;
  if (/@UntranslatedTextScan/.test(line)) return line;
  return line.replace(new RegExp(`(^|\\s)${afterTag}(\\s|$)`), `$1${afterTag} ${newTag}$2`);
}

// Contact Us / MI / TUF / Events Promo / Find A Gym / Location Search — add @NZ beside @SG or @PH or @AU
const sharedWithSg = [
  'features/contactUs/contact-us.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/tryUsFree/try-us-free.feature',
  'features/events/events-promo.feature',
  'features/findAGym/find-a-gym.feature',
  'features/locationSearchOnStaticPages/location-search-on-static-pages.feature',
];

for (const rel of sharedWithSg) {
  patchFile(rel, (s) =>
    s
      .split('\n')
      .map((line) => {
        let out = line;
        out = addTagAfter(out, '@SG', '@NZ');
        // Lines with @PH but no @SG (shouldn't happen often)
        if (!/\b@NZ\b/.test(out) && /(^|\s)@PH(\s|$)/.test(out)) {
          out = addTagAfter(out, '@PH', '@NZ');
        }
        return out;
      })
      .join('\n'),
  );
}

// Own A Gym — Coverage YES for NZ; add beside @AU
patchFile('features/ownAGym/own-a-gym.feature', (s) =>
  s
    .split('\n')
    .map((line) => addTagAfter(line, '@AU', '@NZ'))
    .join('\n'),
);

// Events Join Online — Coverage YES for NZ (and US); add @NZ beside @US
patchFile('features/events/events-join-online.feature', (s) =>
  s
    .split('\n')
    .map((line) => {
      if (/\b@NZ\b/.test(line)) return line;
      if (!/(^|\s)@US(\s|$)/.test(line)) return line;
      if (/@UntranslatedTextScan/.test(line)) return line;
      return line.replace(/(^|\s)@US(\s|$)/, '$1@US @NZ$2');
    })
    .join('\n'),
);

// Ticket tag AFW-3657 on NZ consolidations that already carry AFW-3660 / AFW-3658
for (const rel of [
  'features/contactUs/contact-us.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/tryUsFree/try-us-free.feature',
  'features/events/events-promo.feature',
  'features/ownAGym/own-a-gym.feature',
  'features/events/events-join-online.feature',
]) {
  patchFile(rel, (s) =>
    s
      .split('\n')
      .map((line) => {
        if (!/\b@NZ\b/.test(line)) return line;
        if (/\b@AFW-3657\b/.test(line)) return line;
        if (/\b@AFW-3660\b/.test(line)) {
          return line.replace('@AFW-3660', '@AFW-3660 @AFW-3657');
        }
        if (/\b@AFW-3658\b/.test(line)) {
          return line.replace('@AFW-3658', '@AFW-3658 @AFW-3657');
        }
        // Join Online / Own A Gym consolidations without those tickets — add near feature tag
        if (/@EventsJoinOnlineConsolidatedPass|@OwnAGymConsolidatedPass|@TC-/.test(line)) {
          return line.replace(/(@EventsJoinOnline|@OwnAGym|@TC-\S+)/, '$1 @AFW-3657');
        }
        return line;
      })
      .join('\n'),
  );
}

console.log('done');
