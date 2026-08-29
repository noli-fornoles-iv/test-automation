/**
 * Trim @EN-CA from scenarios whose Flow-tab Supported Locales do not include EN-CA / EN_CA / CA.
 * Additive onboard can over-tag when peers like @ID/@NZ are present on US/APAC-only rows.
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();

/** TC IDs that must NOT have @EN-CA (from Flow tabs — EN-CA absent). */
const deny = new Set([
  // Try Us Free
  'TC-R016',
  'TC-R017',
  'TC-R022',
  'TC-R024',
  'TC-R025',
  'TC-R026',
  'TC-R033',
  'TC-R034',
  'TC-R038',
  'TC-R039',
  'TC-R040',
  'TC-R041',
  // Membership Inquiry
  'TC-O013',
  'TC-O016',
  'TC-O017',
  'TC-O019',
  'TC-O021', // Privacy Policy — sheet list without EN-CA
  'TC-O023',
  'TC-O025',
  'TC-O026',
  'TC-O027',
  'TC-O031',
  'TC-O032',
  // Contact Us — US-only tracking
  'TC-B016',
  'TC-B019',
  'TC-B020',
  // Book A Tour — US-only
  'TC-A010',
  'TC-A015',
  'TC-A017',
  'TC-A021',
  'TC-A023',
  'TC-A024',
  'TC-A026',
  'TC-A027',
]);

const files = [
  'features/tryUsFree/try-us-free.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/contactUs/contact-us.feature',
  'features/bookATourStandalone/book-a-tour.feature',
  'features/events/events-promo.feature',
];

function stripCaFromDenied(content) {
  const lines = content.split('\n');
  return lines
    .map((line) => {
      const tc = (line.match(/@(TC-[A-Z]\d+)/) || [])[1];
      if (!tc || !deny.has(tc)) return line;
      if (!/\b@EN-CA\b/.test(line)) return line;
      return line.replace(/\s*@EN-CA\b/g, '').replace(/\s{2,}/g, ' ');
    })
    .join('\n');
}

for (const rel of files) {
  const p = path.join(root, rel);
  const before = fs.readFileSync(p, 'utf8');
  const after = stripCaFromDenied(before);
  if (after !== before) {
    fs.writeFileSync(p, after);
    console.log(`trimmed: ${rel}`);
  } else {
    console.log(`no-change: ${rel}`);
  }
}

// Apple Fitness Plus Subscriber — Coverage YES for EN-CA; feature was US-only tagged.
{
  const rel = 'features/tryUsFree/try-us-free-apple-fitness-subscriber.feature';
  const p = path.join(root, rel);
  let s = fs.readFileSync(p, 'utf8');
  const usOnlyDeny = new Set([
    // Keep RS/data-layer US-only if present — heuristic by scenario title
  ]);
  s = s
    .split('\n')
    .map((line, idx, arr) => {
      if (!/^\s*@/.test(line) || !/\b@US\b/.test(line) || /\b@EN-CA\b/.test(line)) return line;
      // Look ahead for scenario title
      let title = '';
      for (let i = idx + 1; i < Math.min(idx + 4, arr.length); i++) {
        if (/^\s*Scenario/.test(arr[i])) {
          title = arr[i];
          break;
        }
      }
      if (/Rudderstack|data layer|form_loaded|form_success|Identity/i.test(title)) return line;
      return line.replace(/(^|\s)@US(\s|$)/, '$1@US @EN-CA$2');
    })
    .join('\n');
  // Header comment
  s = s.replace(
    /# Coverage: YES for US only/,
    '# Coverage: YES for US, EN-CA (AF Automation Coverage tab)',
  );
  fs.writeFileSync(p, s);
  console.log(`tagged subscriber: ${rel}`);
}

// Ensure Lead Form Disclaimer TCs that include EN-CA have @EN-CA
function ensureCaOnTc(rel, tcId) {
  const p = path.join(root, rel);
  let s = fs.readFileSync(p, 'utf8');
  const lines = s.split('\n');
  let changed = false;
  const out = lines.map((line) => {
    if (!line.includes(`@${tcId}`)) return line;
    if (/\b@EN-CA\b/.test(line)) return line;
    changed = true;
    if (/\b@IE\b/.test(line)) return line.replace(/(^|\s)@IE(\s|$)/, '$1@IE @EN-CA$2');
    if (/\b@GB\b/.test(line)) return line.replace(/(^|\s)@GB(\s|$)/, '$1@GB @EN-CA$2');
    if (/\b@US\b/.test(line)) return line.replace(/(^|\s)@US(\s|$)/, '$1@US @EN-CA$2');
    return `${line} @EN-CA`;
  });
  if (changed) {
    fs.writeFileSync(p, out.join('\n'));
    console.log(`ensured @EN-CA on ${tcId} in ${rel}`);
  }
}

ensureCaOnTc('features/tryUsFree/try-us-free.feature', 'TC-R018');
ensureCaOnTc('features/tryUsFree/try-us-free.feature', 'TC-R019');
ensureCaOnTc('features/membershipInquiry/membership-inquiry.feature', 'TC-O018');
ensureCaOnTc('features/membershipInquiry/membership-inquiry.feature', 'TC-O020');
ensureCaOnTc('features/bookATourStandalone/book-a-tour.feature', 'TC-A016');
ensureCaOnTc('features/bookATourStandalone/book-a-tour.feature', 'TC-A018');

console.log('CA tag cleanup complete.');
