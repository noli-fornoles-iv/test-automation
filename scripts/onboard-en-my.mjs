/**
 * One-shot EN-MY onboarding: patch maps/Jenkins/docs and add @EN-MY on Coverage YES flows.
 * Safe additive only — does not remove existing locale tags.
 *
 * Coverage YES: Contact Us, Corporate Membership, Events Promo, Local Offer (leave untagged —
 * no Available-on-Prod offers, same as ID/PH/SG/NZ), Membership Inquiry, Own A Gym, Try Us Free,
 * Location Search, Find a gym, Membership (Why Join static LS).
 * Coverage NO: Book A Tour, Events Join Online, Invite/Share, Apple Fitness, etc.
 *
 * Sources: AFW-3659 + AFW-3629 (dual disclaimer) + Local Config EN-MY
 * (Kuala Lumpur / MY-0019 / 60 / postal 50000).
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
  if (s.includes("'en-my':")) return s;
  return s.replace(
    `  // ZH-HK: AFW-3663 — no postal codes. AFW-3731 dual disclaimer (terms + marketing) —
  // no US-style Local Resident checkbox / why-this-matters modal on SIT.
  'zh-hk': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: false,
    zipCodeField: false,
    sendConfirmationEmails: true,
  },
};`,
    `  // ZH-HK: AFW-3663 — no postal codes. AFW-3731 dual disclaimer (terms + marketing) —
  // no US-style Local Resident checkbox / why-this-matters modal on SIT.
  'zh-hk': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: false,
    zipCodeField: false,
    sendConfirmationEmails: true,
  },
  // MY: AFW-3659 — postal from Local Config; AFW-3629 dual disclaimer (CB1 pre-checked + CB2 optional)
  'en-my': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};`,
  );
});

patchFile('utils/locale-utils/locale-keys-skip.ts', s => {
  if (s.includes("'en-my':")) return s;
  return s.replace(
    `'zh-hk': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],`,
    `'zh-hk': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],
  'en-my': [
    TranslationKeys.Texts.BookingConfirmation.EventsFindYourFitphoria,
    TranslationKeys.Texts.BookingConfirmation.EventsBookATour,
  ],`,
  );
});

patchFile('resources/locationTestStudio.ts', s => {
  if (s.includes("'EN-MY'") || s.includes('"EN-MY"')) return s;
  return s.replace(
    `'ZH-HK': 'HK-0011',
};`,
    `'ZH-HK': 'HK-0011',
  'EN-MY': 'MY-0019',
};`,
  );
});

patchFile('utils/helpers.ts', s => {
  if (s.includes("'en-my':")) return s;
  return s.replace(`'zh-hk': 'HK',`, `'zh-hk': 'HK',\n      'en-my': 'MY',`);
});

patchFile('utils/localization/locale.ts', s => {
  if (s.includes("'en-my':")) return s;
  return s.replace(`'zh-hk': 'Chinese',`, `'zh-hk': 'Chinese',\n  'en-my': 'English',`);
});

patchFile('utils/locale-utils/thank-you-social-platforms.ts', s => {
  if (s.includes("'en-my':")) return s;
  return s.replace(
    `'zh-hk': ['facebook', 'instagram', 'youtube', 'linkedin'],`,
    `'zh-hk': ['facebook', 'instagram', 'youtube', 'linkedin'],\n  'en-my': ['facebook', 'instagram', 'youtube', 'linkedin'],`,
  );
});

patchFile('Jenkinsfile', s => {
  let out = s;
  if (!out.includes('LOCALE_EN_MY')) {
    out = out.replace(
      `booleanParam(name: 'LOCALE_ZH_HK', defaultValue: false, description: 'ZH-HK — Hong Kong (Traditional Chinese)')`,
      `booleanParam(name: 'LOCALE_ZH_HK', defaultValue: false, description: 'ZH-HK — Hong Kong (Traditional Chinese)')\n        booleanParam(name: 'LOCALE_EN_MY', defaultValue: false, description: 'EN-MY — Malaysia')`,
    );
  }
  if (!out.includes("'EN-MY': 'EN-MY'")) {
    out = out.replace(`'ZH-HK': 'ZH-HK'`, `'ZH-HK': 'ZH-HK',\n        'EN-MY': 'EN-MY'`);
  }
  if (!out.includes("'EN-MY': params.LOCALE_EN_MY")) {
    out = out.replace(
      `'ZH-HK': params.LOCALE_ZH_HK`,
      `'ZH-HK': params.LOCALE_ZH_HK,\n        'EN-MY': params.LOCALE_EN_MY`,
    );
  }
  return out;
});

patchFile('scripts/sync-knowledge-base.mjs', s => {
  if (s.includes("'EN-MY':")) return s;
  return s.replace(
    `  'ZH-HK': { locale: 'ZH-HK', folder: 'zh-hk', tag: 'ZH-HK' },
};`,
    `  'ZH-HK': { locale: 'ZH-HK', folder: 'zh-hk', tag: 'ZH-HK' },
  'EN-MY': { locale: 'EN-MY', folder: 'en-my', tag: 'EN-MY' },
};`,
  );
});

for (const rel of [
  'AGENTS.md',
  '.cursor/skills/onboard-locale/SKILL.md',
  '.cursor/skills/af-automation-agent/SKILL.md',
]) {
  patchFile(rel, s => {
    if (s.includes('| EN-MY |')) return s;
    return s.replace(
      `| ZH-HK | zh-hk | @ZH-HK | ZH-HK |`,
      `| ZH-HK | zh-hk | @ZH-HK | ZH-HK |\n| EN-MY | en-my | @EN-MY | EN-MY |`,
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
  'features/events/events-promo.feature',
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
          out = addTagAfter(out, '@ZH-HK', '@EN-MY');
          return out;
        }
        out = addTagAfter(out, '@ZH-HK', '@EN-MY');
        if (!/\b@EN-MY\b/.test(out)) out = addTagAfter(out, '@ID', '@EN-MY');
        if (!/\b@EN-MY\b/.test(out)) out = addTagAfter(out, '@SG', '@EN-MY');
        if (!/\b@EN-MY\b/.test(out)) out = addTagAfter(out, '@FR-CA', '@EN-MY');
        return out;
      })
      .join('\n'),
  );
}

// Own A Gym — Coverage YES (peers use EN-CA/FR-CA; PH/SG/ID are NO)
patchFile('features/ownAGym/own-a-gym.feature', s =>
  s
    .split('\n')
    .map(line => {
      let out = line;
      out = addTagAfter(out, '@FR-CA', '@EN-MY');
      if (!/\b@EN-MY\b/.test(out)) out = addTagAfter(out, '@EN-CA', '@EN-MY');
      return out;
    })
    .join('\n'),
);

function hasTag(line, tag) {
  return new RegExp(`(^|\\s)${tag}(\\s|$)`).test(line);
}

// Ticket tags AFW-3659 (spin-up) + AFW-3629 (disclaimer) on EN-MY lines
for (const rel of [...sharedYes, 'features/ownAGym/own-a-gym.feature']) {
  patchFile(rel, s =>
    s
      .split('\n')
      .map(line => {
        if (!hasTag(line, '@EN-MY')) return line;
        let out = line;
        if (!hasTag(out, '@AFW-3659')) {
          if (hasTag(out, '@AFW-3663')) {
            out = out.replace('@AFW-3663', '@AFW-3663 @AFW-3659');
          } else if (hasTag(out, '@AFW-3657')) {
            out = out.replace('@AFW-3657', '@AFW-3657 @AFW-3659');
          } else if (/ConsolidatedPass|@TC-/.test(out)) {
            out = out.replace(/(@\w+ConsolidatedPass|@TC-\S+)/, '$1 @AFW-3659');
          }
        }
        // Dual-disclaimer scenarios (same PH/SG/TH/ZH-HK pattern)
        const isDisclaimer =
          hasTag(out, '@AFW-3628') ||
          hasTag(out, '@AFW-3705') ||
          hasTag(out, '@AFW-3731') ||
          hasTag(out, '@AFW-3722');
        if (isDisclaimer && !hasTag(out, '@AFW-3629')) {
          if (hasTag(out, '@AFW-3659')) {
            out = out.replace('@AFW-3659', '@AFW-3659 @AFW-3629');
          } else if (hasTag(out, '@AFW-3628')) {
            out = out.replace('@AFW-3628', '@AFW-3628 @AFW-3629');
          }
        }
        return out;
      })
      .join('\n'),
  );
}

console.log('done');
