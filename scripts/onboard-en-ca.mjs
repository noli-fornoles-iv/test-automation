/**
 * EN-CA onboarding: Local Config test-data, English translations merge,
 * AFW-3993 GET STARTED CTA copy, and additive @EN-CA tags on Coverage YES flows.
 * Does not remove or rewrite other locale tags.
 *
 * Coverage YES: Book A Tour, Contact Us, Events Promo, Local Offer, Membership Inquiry,
 * Own A Gym, TUF, TUF Apple Fitness Offer, TUF Apple Fitness Subscriber, Invite a friend,
 * Share Invitation Link, Location Search static, Find a gym.
 * Coverage NO: Corporate, Events BAT/Fitphoria/FTP/JoinOnline/TFYL, HSA, MCO, Member Offer, Cancel.
 *
 * Sources: Local Config EN-CA + AFW-3993 + Flow Supported Locales (EN-CA / EN_CA).
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
    return false;
  }
  fs.writeFileSync(p, after);
  console.log(`patched: ${rel}`);
  return true;
}

function addTagAfter(line, afterTag, newTag) {
  if (new RegExp(`(^|\\s)${newTag}(\\s|$)`).test(line)) return line;
  if (!new RegExp(`(^|\\s)${afterTag}(\\s|$)`).test(line)) return line;
  if (/@UntranslatedTextScan/.test(line)) return line;
  return line.replace(new RegExp(`(^|\\s)${afterTag}(\\s|$)`), `$1${afterTag} ${newTag}$2`);
}

function isUsOnlyTagLine(line) {
  const tags = line.match(/@[A-Za-z0-9_-]+/g) || [];
  const localeish = tags.filter((t) =>
    [
      '@US',
      '@AU',
      '@AE',
      '@SA',
      '@ZA',
      '@GB',
      '@IE',
      '@IN',
      '@AT',
      '@DE',
      '@IT',
      '@TH',
      '@PH',
      '@SG',
      '@NZ',
      '@ID',
      '@EN-CA',
      '@FR-CA',
    ].includes(t),
  );
  return localeish.length === 1 && localeish[0] === '@US';
}

// --- test-data from Local Config EN-CA ---
{
  const rel = 'resources/en-ca/test-data.json';
  const data = {
    locations: {
      search: {
        invalid: 'ikkkkkkk',
        noNearby: 'ikkkkkkk',
        default: 'Winnipeg',
        default1: 'Winnipeg',
      },
      gyms: {
        default: '9993995',
        default1: '9993995',
      },
      clubId: '9993995',
      preSaleClubId: '9993995',
      secondaryClubId: '9993995',
      localGym: 'winnipeg-manitoba-9993995',
    },
    zipCodes: {
      valid: {
        default: 'M5V 3L9',
        secondary: 'T2P 1J9',
      },
      invalid: {
        alpha: 'Z1Z 1Z1',
        short: 'M5V3L',
        long: 'M5V33L9',
      },
    },
    phoneNumber: {
      valid: {
        default: '14165550187',
        secondary: '13802669012',
      },
      invalid: '0165551234',
      countryCode: '1',
    },
  };
  fs.writeFileSync(path.join(root, rel), JSON.stringify(data, null, 2) + '\n');
  console.log(`wrote: ${rel}`);
}

// --- translations: merge missing YES-flow keys from en-us + AFW-3993 Get Started legal ---
{
  const us = JSON.parse(fs.readFileSync(path.join(root, 'resources/en-us/translations.json'), 'utf8'));
  const caPath = path.join(root, 'resources/en-ca/translations.json');
  const ca = JSON.parse(fs.readFileSync(caPath, 'utf8'));

  function mergeMissing(target, source) {
    for (const [k, v] of Object.entries(source)) {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        if (!target[k] || typeof target[k] !== 'object') target[k] = {};
        mergeMissing(target[k], v);
      } else if (target[k] === undefined) {
        target[k] = v;
      }
    }
  }
  mergeMissing(ca, us);

  // AFW-3993: lead-form CTA is GET STARTED; legal copy must say Get Started (not Submit).
  // Includes Membership Inquiry (live SIT/UAT MI uses Get Started + matching legal).
  // buttons.userForm.submit stays SUBMIT for Contact Us / non–Get Started forms.
  ca.buttons.userForm.getStarted = 'GET STARTED';
  ca.buttons.userForm.submit = 'SUBMIT';
  ca.texts.consent.privacyNotice =
    'By clicking “Get Started” below, I consent to receive marketing texts and other communications that may be automated and/or placed with artificial voice, placed by or on behalf of Anytime Fitness Franchisor LLC (“Anytime”) and/or Anytime-brand franchisees, even if my phone number is on a state or national Do Not Call list. Anytime will not share my phone or text information with other affiliates. Further, in clicking “Get Started”, I agree to accept the Terms & Conditions, Privacy Notice, and Text Messaging Terms, and attest that I am 18 years of age or older. My consent to receive communications is not a condition of purchase, and I can withdraw my consent at any time. Recurring communications. Message and data rates apply. Text STOP to stop. Add Text HELP for assistance.';

  // Canada postal / province terminology (React Components: Postal Code + Province).
  ca.labels.locationSearch.searchBoxPlaceholder.cityOrZipCode =
    'Search by city & province or postal code';
  ca.labels.locationSearch.searchBoxPlaceholder.cityStateOrZipCode =
    'Search by city & province or postal code';
  ca.labels.userForm.zipCode = 'Postal Code';
  ca.errors.userForm.invalidZipCode = 'Invalid postal code';
  ca.errors.userForm.invalidPostCode = 'Invalid postal code';
  ca.errors.locationSearch.invalidLocation =
    'Invalid search. Please enter a valid postal code, city, country, or province/state. Ensure your input is correctly formatted and try again!';

  // Drop Coverage-NO event heading blocks if merge pulled them — keep bookingConfirmation keys
  // (locale-keys-skip already skips Fitphoria / Events BAT / Corporate for en-ca).

  fs.writeFileSync(caPath, JSON.stringify(ca, null, 2) + '\n');
  console.log('wrote: resources/en-ca/translations.json');
}

// --- thank-you social platforms (Footer en-CA) ---
patchFile('utils/locale-utils/thank-you-social-platforms.ts', (s) => {
  if (s.includes("'en-ca':")) return s;
  return s.replace(
    `  'en-us': ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'youtube', 'tiktok'],`,
    `  'en-us': ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'youtube', 'tiktok'],
  'en-ca': ['facebook', 'instagram', 'linkedin', 'youtube', 'tiktok'],`,
  );
});

// --- Feature tagging (additive only) ---
const addCaBesideId = [
  'features/contactUs/contact-us.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/tryUsFree/try-us-free.feature',
  'features/events/events-promo.feature',
  'features/findAGym/find-a-gym.feature',
  'features/locationSearchOnStaticPages/location-search-on-static-pages.feature',
];

for (const rel of addCaBesideId) {
  patchFile(rel, (s) =>
    s
      .split('\n')
      .map((line) => {
        let out = line;
        out = addTagAfter(out, '@ID', '@EN-CA');
        if (!/\b@EN-CA\b/.test(out)) out = addTagAfter(out, '@NZ', '@EN-CA');
        if (!/\b@EN-CA\b/.test(out)) out = addTagAfter(out, '@SG', '@EN-CA');
        if (!/\b@EN-CA\b/.test(out)) out = addTagAfter(out, '@PH', '@EN-CA');
        if (!/\b@EN-CA\b/.test(out)) out = addTagAfter(out, '@TH', '@EN-CA');
        // TUF / MI multi-locale peers without APAC tags
        if (!/\b@EN-CA\b/.test(out) && !isUsOnlyTagLine(out)) {
          out = addTagAfter(out, '@IE', '@EN-CA');
        }
        if (!/\b@EN-CA\b/.test(out) && !isUsOnlyTagLine(out)) {
          out = addTagAfter(out, '@GB', '@EN-CA');
        }
        if (!/\b@EN-CA\b/.test(out) && !isUsOnlyTagLine(out)) {
          out = addTagAfter(out, '@IT', '@EN-CA');
        }
        return out;
      })
      .join('\n'),
  );
}

// Book A Tour + Invite / Share — EN-CA with US/AU/GB/IE peers
for (const rel of [
  'features/bookATourStandalone/book-a-tour.feature',
  'features/inviteAFriend/invite-a-friend.feature',
  'features/inviteAFriend/share-invitation-link-generation.feature',
]) {
  patchFile(rel, (s) =>
    s
      .split('\n')
      .map((line) => {
        let out = line;
        out = addTagAfter(out, '@IE', '@EN-CA');
        if (!/\b@EN-CA\b/.test(out)) out = addTagAfter(out, '@GB', '@EN-CA');
        if (!/\b@EN-CA\b/.test(out) && !isUsOnlyTagLine(out)) out = addTagAfter(out, '@AU', '@EN-CA');
        return out;
      })
      .join('\n'),
  );
}

// Own A Gym — peer intl set (no US)
patchFile('features/ownAGym/own-a-gym.feature', (s) =>
  s
    .split('\n')
    .map((line) => {
      let out = line;
      out = addTagAfter(out, '@IT', '@EN-CA');
      if (!/\b@EN-CA\b/.test(out)) out = addTagAfter(out, '@AU', '@EN-CA');
      return out;
    })
    .join('\n'),
);

// Apple Fitness Offer — Coverage YES for EN-CA (US/AU peers)
patchFile('features/tryUsFree/try-us-free-apple-fitness-offer.feature', (s) =>
  s
    .split('\n')
    .map((line) => {
      let out = line;
      out = addTagAfter(out, '@AU', '@EN-CA');
      if (!/\b@EN-CA\b/.test(out) && !isUsOnlyTagLine(out)) out = addTagAfter(out, '@US', '@EN-CA');
      return out;
    })
    .join('\n'),
);

// Apple Fitness Subscriber — Coverage YES for EN-CA; skip pure US tracking-only lines
patchFile('features/tryUsFree/try-us-free-apple-fitness-subscriber.feature', (s) =>
  s
    .split('\n')
    .map((line) => {
      if (isUsOnlyTagLine(line) && /Rudderstack|data layer|form_loaded|form_success|Identity/i.test(line)) {
        return line;
      }
      // Tag lines: add @EN-CA after @US when scenario is not US-only RS/GTM in title on same line
      let out = line;
      if (/^\s*@/.test(line) && /\b@US\b/.test(line) && !isUsOnlyTagLine(line)) {
        out = addTagAfter(out, '@US', '@EN-CA');
      } else if (/^\s*@/.test(line) && /\b@US\b/.test(line) && !/\b@EN-CA\b/.test(line)) {
        // Regular functional TCs are often @US alone — tag consolidations + non-tracking titles via next Scenario line check is hard;
        // add @EN-CA for ConsolidPass / Smoke / REGULAR multi-tag lines only when not US-only.
        if (/\b@(TryUsFree|ConsolidatedPass|Smoke|Regression|batch-|AFW-|TC-Q)/.test(line) && !isUsOnlyTagLine(line)) {
          out = addTagAfter(out, '@US', '@EN-CA');
        } else if (/\b@TC-Q/.test(line) && !/Rudderstack|data.?layer|form_loaded|form_success/i.test(line)) {
          // Functional TC tags that are US-only in sheet historically — EN-CA Coverage YES for subscriber;
          // only add when line also has Smoke/Regression/batch (shared runners), keep pure @US @TC for RS.
          if (/\b@(Smoke|Regression|batch-|desktop|REGULAR)\b/.test(line)) {
            out = addTagAfter(out, '@US', '@EN-CA');
          }
        }
      }
      return out;
    })
    .join('\n'),
);

// Local Offer — add @EN-CA on Example rows that already have intl peers / AFW Canada tickets
patchFile('features/localOffer/local-offer.feature', (s) =>
  s
    .split('\n')
    .map((line) => {
      let out = line;
      if (/\b@AFW-3198\b|\b@AFW-3213\b|\b@AFW-3215\b/.test(out)) {
        out = addTagAfter(out, '@EN-CA', '@EN-CA'); // already present
        return out;
      }
      out = addTagAfter(out, '@GB', '@EN-CA');
      if (!/\b@EN-CA\b/.test(out)) out = addTagAfter(out, '@IE', '@EN-CA');
      if (!/\b@EN-CA\b/.test(out) && !isUsOnlyTagLine(out)) out = addTagAfter(out, '@AU', '@EN-CA');
      if (!/\b@EN-CA\b/.test(out) && !isUsOnlyTagLine(out)) out = addTagAfter(out, '@NZ', '@EN-CA');
      return out;
    })
    .join('\n'),
);

// Ticket tags on consolidations
const ticketFiles = [
  'features/tryUsFree/try-us-free.feature',
  'features/contactUs/contact-us.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/events/events-promo.feature',
  'features/bookATourStandalone/book-a-tour.feature',
  'features/localOffer/local-offer.feature',
  'features/inviteAFriend/invite-a-friend.feature',
];
for (const rel of ticketFiles) {
  patchFile(rel, (s) =>
    s
      .split('\n')
      .map((line) => {
        if (!/\b@EN-CA\b/.test(line)) return line;
        if (/\b@AFW-3993\b/.test(line)) return line;
        if (!/ConsolidatedPass|Consolidated —|@Smoke|@Regression/.test(line) && !/@TryUsFreeConsolidatedPass|@ContactUsConsolidatedPass|@MembershipInquiryConsolidatedPass|@EventsPromoConsolidatedPass|@BookATourStandaloneConsolidatedPass/.test(line)) {
          return line;
        }
        return line.replace(/^(\s*)/, `$1@AFW-3993 `).replace(/@AFW-3993 @AFW-3993 /, '@AFW-3993 ');
      })
      .join('\n'),
  );
}

console.log('EN-CA onboarding script complete.');
