/**
 * ZH-HK onboarding: patch maps/Jenkins/docs and add @ZH-HK on Coverage YES flows.
 * Safe additive only — does not remove existing locale tags.
 *
 * Coverage YES: Contact Us, Corporate Membership, Local Offer (leave untagged —
 * no Available-on-Prod offers), Membership Inquiry, Try Us Free, Location Search,
 * Find a gym, Membership (Why Join static LS).
 * Coverage NO: Book A Tour, Own A Gym, Events Promo, Events Join Online, Invite/Share, Apple Fitness.
 *
 * Sources: AFW-3663 + Local Config ZH-HK (Sai / HK-0011 / 852). Zip not used (AFW-3663).
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

patchFile('utils/locale-utils/locale-element-map.ts', s => {
  if (s.includes("'zh-hk':")) return s;
  return s.replace(
    `  // ID: AFW-3661 — postal from Local Config; legal disclaimer AFW-3718 (separate)
  'en-id': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`,
    `  // ID: AFW-3661 — postal from Local Config; legal disclaimer AFW-3718 (separate)
  'en-id': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // ZH-HK: AFW-3663 — no postal codes (isZipCodeRequired false). Dual disclaimer AFW-3731.
  'zh-hk': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: false,
    sendConfirmationEmails: true,
  },
};`,
  );
});

patchFile('utils/locale-utils/locale-keys-skip.ts', s => {
  if (s.includes("'zh-hk':")) return s;
  return s.replace(
    `'en-id': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],`,
    `'en-id': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],
  'zh-hk': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],`,
  );
});

patchFile('resources/locationTestStudio.ts', s => {
  if (s.includes('"ZH-HK"')) return s;
  return s.replace(`"EN-ID":"ID-0001",`, `"EN-ID":"ID-0001",\n  "ZH-HK":"HK-0011",`);
});

patchFile('utils/helpers.ts', s => {
  if (s.includes("'zh-hk':")) return s;
  return s.replace(`'en-id': 'ID',`, `'en-id': 'ID',\n      'zh-hk': 'HK',`);
});

patchFile('utils/localization/locale.ts', s => {
  let out = s;
  if (!out.includes("'zh-hk':")) {
    out = out.replace(
      `'th-th': 'Thai',`,
      `'th-th': 'Thai',\n  'zh-hk': 'Chinese',\n  zh: 'Chinese',`,
    );
  }
  if (!out.includes("'zh-hk'")) {
    out = out.replace(
      `  'fr-ca',
]);`,
      `  'fr-ca',
  'zh-hk',
]);`,
    );
  }
  return out;
});

patchFile('Jenkinsfile', s => {
  let out = s;
  if (!out.includes('LOCALE_ZH_HK')) {
    out = out.replace(
      `booleanParam(name: 'LOCALE_EN_ID', defaultValue: false, description: 'EN-ID — Indonesia')`,
      `booleanParam(name: 'LOCALE_EN_ID', defaultValue: false, description: 'EN-ID — Indonesia')\n        booleanParam(name: 'LOCALE_ZH_HK', defaultValue: false, description: 'ZH-HK — Hong Kong (Traditional Chinese)')`,
    );
  }
  if (!out.includes("'ZH-HK': 'ZH-HK'")) {
    out = out.replace(`'EN-ID': 'ID'`, `'EN-ID': 'ID',\n        'ZH-HK': 'ZH-HK'`);
  }
  if (!out.includes("'ZH-HK': params.LOCALE_ZH_HK")) {
    out = out.replace(
      `'EN-ID': params.LOCALE_EN_ID`,
      `'EN-ID': params.LOCALE_EN_ID,\n        'ZH-HK': params.LOCALE_ZH_HK`,
    );
  }
  return out;
});

patchFile('scripts/sync-knowledge-base.mjs', s => {
  if (s.includes("'ZH-HK':")) return s;
  return s.replace(
    `  ID: { locale: 'EN-ID', folder: 'en-id', tag: 'ID' },
};`,
    `  ID: { locale: 'EN-ID', folder: 'en-id', tag: 'ID' },
  'ZH-HK': { locale: 'ZH-HK', folder: 'zh-hk', tag: 'ZH-HK' },
};`,
  );
});

for (const rel of [
  'AGENTS.md',
  '.cursor/skills/onboard-locale/SKILL.md',
  '.cursor/skills/af-automation-agent/SKILL.md',
]) {
  patchFile(rel, s => {
    if (s.includes('| ZH-HK |')) return s;
    return s.replace(
      `| EN-ID | en-id | @ID | ID |`,
      `| EN-ID | en-id | @ID | ID |\n| ZH-HK | zh-hk | @ZH-HK | ZH-HK |`,
    );
  });
}

function addTagAfter(line, afterTag, newTag) {
  if (new RegExp(`(^|\\s)${newTag}(\\s|$)`).test(line)) return line;
  if (!new RegExp(`(^|\\s)${afterTag}(\\s|$)`).test(line)) return line;
  return line.replace(new RegExp(`(^|\\s)${afterTag}(\\s|$)`), `$1${afterTag} ${newTag}$2`);
}

const sharedYes = [
  'features/contactUs/contact-us.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/tryUsFree/try-us-free.feature',
  'features/findAGym/find-a-gym.feature',
  'features/locationSearchOnStaticPages/location-search-on-static-pages.feature',
  'features/corporateMembership/corporate-membership.feature',
];

for (const rel of sharedYes) {
  patchFile(rel, s =>
    s
      .split('\n')
      .map(line => {
        let out = line;
        if (/@UntranslatedTextScan/.test(out)) {
          out = addTagAfter(out, '@TH', '@ZH-HK');
          return out;
        }
        out = addTagAfter(out, '@ID', '@ZH-HK');
        if (!/\b@ZH-HK\b/.test(out)) out = addTagAfter(out, '@FR-CA', '@ZH-HK');
        if (!/\b@ZH-HK\b/.test(out) && /(^|\s)@TH(\s|$)/.test(out) && /(^|\s)@PH(\s|$)/.test(out)) {
          out = addTagAfter(out, '@TH', '@ZH-HK');
        }
        return out;
      })
      .join('\n'),
  );
}

for (const rel of sharedYes) {
  patchFile(rel, s =>
    s
      .split('\n')
      .map(line => {
        if (!/\b@ZH-HK\b/.test(line)) return line;
        if (/\b@AFW-3663\b/.test(line)) return line;
        if (/\b@AFW-3661\b/.test(line)) {
          return line.replace('@AFW-3661', '@AFW-3661 @AFW-3663');
        }
        if (/\b@AFW-3660\b/.test(line)) {
          return line.replace('@AFW-3660', '@AFW-3660 @AFW-3663');
        }
        if (/\b@AFW-3658\b/.test(line)) {
          return line.replace('@AFW-3658', '@AFW-3658 @AFW-3663');
        }
        if (/ConsolidatedPass|@TC-/.test(line)) {
          return line.replace(/(@\w+ConsolidatedPass|@TC-\S+)/, '$1 @AFW-3663');
        }
        return line;
      })
      .join('\n'),
  );
}

// Dual-disclaimer TCs (AFW-3731) — same PH/TH/SG pattern
for (const rel of [
  'features/membershipInquiry/membership-inquiry.feature',
  'features/tryUsFree/try-us-free.feature',
]) {
  patchFile(rel, s =>
    s
      .split('\n')
      .map(line => {
        if (!/\b@ZH-HK\b/.test(line)) return line;
        if (!/\b@AFW-3722\b/.test(line) && !/\b@AFW-3705\b/.test(line)) return line;
        if (/\b@AFW-3731\b/.test(line)) return line;
        return line.replace('@AFW-3722', '@AFW-3722 @AFW-3731');
      })
      .join('\n'),
  );
}

console.log('done');
