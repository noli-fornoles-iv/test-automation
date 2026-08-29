/**
 * Additive @FR-CA tagging for Coverage YES flows (mirror @EN-CA).
 * Does NOT touch Invite / Share (Coverage NO for FR-CA).
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('features');

const FILES = [
  'bookATourStandalone/book-a-tour.feature',
  'contactUs/contact-us.feature',
  'events/events-promo.feature',
  'membershipInquiry/membership-inquiry.feature',
  'ownAGym/own-a-gym.feature',
  'tryUsFree/try-us-free.feature',
  'tryUsFree/try-us-free-apple-fitness-offer.feature',
  'tryUsFree/try-us-free-apple-fitness-subscriber.feature',
  'locationSearchOnStaticPages/location-search-on-static-pages.feature',
  'findAGym/find-a-gym.feature',
  // local-offer: Examples already handled; still add @FR-CA on any scenario tag lines with @EN-CA
  'localOffer/local-offer.feature',
];

function tagScenarioLines(content) {
  return content
    .split(/\r?\n/)
    .map((line) => {
      if (!line.includes('@EN-CA') || line.includes('@FR-CA')) return line;
      // Only tag lines (start with optional spaces + @)
      if (!/^[ \t]*@/.test(line)) return line;
      // Insert @FR-CA immediately after @EN-CA
      return line.replace(/@EN-CA\b/, '@EN-CA @FR-CA');
    })
    .join('\n');
}

let changed = 0;
for (const rel of FILES) {
  const fp = path.join(ROOT, rel);
  const before = fs.readFileSync(fp, 'utf8');
  const after = tagScenarioLines(before);
  if (after !== before.replace(/\r\n/g, '\n') && after !== before) {
    // normalize to \n if file had \r\n — preserve if only tags changed
    const normalizedBefore = before.replace(/\r\n/g, '\n');
    if (after === normalizedBefore) {
      console.log('no change', rel);
      continue;
    }
    fs.writeFileSync(fp, after.endsWith('\n') ? after : after + '\n');
    changed++;
    const added = (after.match(/@FR-CA/g) || []).length - (before.match(/@FR-CA/g) || []).length;
    console.log('updated', rel, '+@FR-CA lines ~', added);
  } else {
    const normalizedBefore = before.replace(/\r\n/g, '\n');
    if (after !== normalizedBefore) {
      fs.writeFileSync(fp, after.endsWith('\n') ? after : after + '\n');
      changed++;
      console.log('updated', rel);
    } else {
      console.log('no change', rel);
    }
  }
}
console.log('files changed', changed);
