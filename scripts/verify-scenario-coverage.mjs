#!/usr/bin/env node
/**
 * Cross-checks feature-file Scenario titles against manifest.json flow tabs (TC coverage = YES).
 * Fails when scenarios are missing or counts diverge.
 *
 * Usage:
 *   node scripts/verify-scenario-coverage.mjs
 *   node scripts/verify-scenario-coverage.mjs --flow "Book A Tour"
 *   node scripts/verify-scenario-coverage.mjs --locale US --feature book-a-tour
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KB_DIR = join(ROOT, '.cursor', 'knowledge-base');
const MANIFEST_PATH = join(KB_DIR, 'manifest.json');

/**
 * Flow tab → feature file mapping.
 * One locale-agnostic feature file per flow — Supported Locales → scenario tags only.
 */
const FEATURE_MAPPINGS = {
  'book-a-tour': {
    flow: 'Book A Tour',
    featureFile: 'features/bookATourStandalone/book-a-tour.feature',
    softMatch: true,
    forbiddenTags: ['@BookATourStandaloneUSSmoke', '@BookATourStandaloneUS'],
    /** Locale-specific feature files must not be reintroduced for this flow. */
    forbiddenPaths: [
      'features/bookATourStandalone/book-a-tour-standalone-us.feature',
      'features/bookATourStandalone/book-a-tour-standalone-au.feature',
      'features/bookATourStandalone/book-a-tour-standalone-gb.feature',
    ],
  },
  'contact-us': {
    flow: 'Contact Us',
    featureFile: 'features/contactUs/contact-us.feature',
    softMatch: true,
  },
  'cancel-membership': {
    flow: 'Cancel Membership',
    featureFile: 'features/cancelMembership/cancel-membership.feature',
    softMatch: true,
  },
  'local-offer': {
    flow: 'Local Offer',
    featureFile: 'features/localOffer/local-offer.feature',
    softMatch: true,
  },
  'mco-offer': {
    flow: 'MCO Offer',
    featureFile: 'features/mcoOffer/mcoOffer.feature',
    softMatch: true,
  },
  'events-join-online': {
    flow: 'Events Join Online',
    featureFile: 'features/events/events-join-online.feature',
    softMatch: true,
  },
  'events-find-your-fitphoria': {
    flow: 'Events Find Your Fitphoria',
    featureFile: 'features/events/events-find-your-fitphoria.feature',
    softMatch: true,
  },
  'events-promo': {
    flow: 'Events Promo',
    featureFile: 'features/events/events-promo.feature',
    softMatch: true,
  },
  'events-free-trial-pass': {
    flow: 'Events Free Trial Pass',
    featureFile: 'features/events/events-free-trial-pass.feature',
    softMatch: true,
  },
  'events-book-a-tour': {
    flow: 'Event Book A Tour',
    featureFile: 'features/events/events-book-a-tour.feature',
    softMatch: true,
  },
  'events-train-for-your-life': {
    flow: 'Events Train For Your Life',
    featureFile: 'features/events/events-train-for-your-life.feature',
    softMatch: true,
  },
  'corporate-membership': {
    flow: 'Corporate Membership',
    featureFile: 'features/corporateMembership/corporate-membership.feature',
    softMatch: true,
  },
  'hsa-fsa-membership': {
    flow: 'Hsa Fsa Membership',
    featureFile: 'features/hsaFsaMembership/hsa-fsa-membership.feature',
    softMatch: true,
  },
  'own-a-gym': {
    flow: 'Own A Gym',
    featureFile: 'features/ownAGym/own-a-gym.feature',
    softMatch: true,
  },
  'member-offer': {
    flow: 'Member Offer',
    featureFile: 'features/memberOffer/member-offer.feature',
    softMatch: true,
  },
  'membership-inquiry': {
    flow: 'Membership Inquiry',
    featureFile: 'features/membershipInquiry/membership-inquiry.feature',
    softMatch: true,
  },
  'find-a-gym': {
    flow: 'Find A Gym',
    featureFile: 'features/findAGym/find-a-gym.feature',
    softMatch: true,
  },
  'try-us-free': {
    flow: 'Try Us Free',
    featureFile: 'features/tryUsFree/try-us-free.feature',
    softMatch: true,
  },
  'try-us-free-apple-fitness-free-trial-offer': {
    flow: 'Try Us Free Apple Fitness Free Trial Offer',
    featureFile: 'features/tryUsFree/try-us-free-apple-fitness-offer.feature',
    softMatch: true,
  },
  'try-us-free-apple-fitness-plus-subscriber': {
    flow: 'Try Us Free Apple Fitness Plus Subscriber',
    featureFile: 'features/tryUsFree/try-us-free-apple-fitness-subscriber.feature',
    softMatch: true,
  },
  'invite-a-friend': {
    flow: 'Invite a friend',
    featureFile: 'features/inviteAFriend/invite-a-friend.feature',
    softMatch: true,
  },
  'share-invitation-link-generation': {
    flow: 'Share Invitation Link Generation',
    featureFile: 'features/inviteAFriend/share-invitation-link-generation.feature',
    softMatch: true,
  },
  'location-search-on-static-pages': {
    flow: 'Location Search on static pages',
    featureFile:
      'features/locationSearchOnStaticPages/location-search-on-static-pages.feature',
    softMatch: true,
  },
};

function normalizeTitle(title) {
  return title
    .replace(/["""']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function tokenize(title) {
  return normalizeTitle(title)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !['the', 'that', 'with', 'from', 'and', 'for'].includes(t));
}

function parseArgs(argv) {
  const args = { locale: null, feature: null, flow: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--locale' && argv[i + 1]) {
      args.locale = argv[++i].toUpperCase();
    } else if (argv[i] === '--feature' && argv[i + 1]) {
      args.feature = argv[++i].toLowerCase();
    } else if (argv[i] === '--flow' && argv[i + 1]) {
      args.flow = argv[++i];
    }
  }
  return args;
}

function extractFeatureScenarios(featurePath) {
  const content = readFileSync(featurePath, 'utf-8');
  const scenarios = [];
  for (const line of content.split('\n')) {
    const match = line.match(/^\s*Scenario(?: Outline)?:\s*(.+)\s*$/);
    if (match) {
      scenarios.push(match[1].trim());
    }
  }
  return scenarios;
}

function softMatchScore(expected, actual) {
  const expTokens = tokenize(expected);
  const actTokens = new Set(tokenize(actual));
  if (expTokens.length === 0) return 0;
  const hits = expTokens.filter((t) => actTokens.has(t)).length;
  return hits / expTokens.length;
}

function matchScenario(expectedTitle, featureScenarios, usedIndices, softMatch) {
  const normalizedExpected = normalizeTitle(expectedTitle);

  for (let i = 0; i < featureScenarios.length; i++) {
    if (usedIndices.has(i)) continue;
    const featureTitle = featureScenarios[i];
    const normalizedFeature = normalizeTitle(featureTitle);

    if (
      normalizedFeature === normalizedExpected ||
      normalizedFeature.startsWith(`${normalizedExpected} `) ||
      normalizedFeature.includes(normalizedExpected) ||
      normalizedExpected.includes(normalizedFeature)
    ) {
      usedIndices.add(i);
      return featureTitle;
    }
  }

  if (softMatch) {
    let bestIdx = -1;
    let bestScore = 0;
    for (let i = 0; i < featureScenarios.length; i++) {
      if (usedIndices.has(i)) continue;
      const score = softMatchScore(expectedTitle, featureScenarios[i]);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    // Require strong overlap so we don't falsely match unrelated scenarios
    if (bestIdx >= 0 && bestScore >= 0.55) {
      usedIndices.add(bestIdx);
      return featureScenarios[bestIdx];
    }
  }

  return null;
}

function verifyMapping(key, mapping, flowData, localeFilter) {
  const featurePath = join(ROOT, mapping.featureFile);
  if (!existsSync(featurePath)) {
    return { key, ok: false, errors: [`Feature file not found: ${mapping.featureFile}`] };
  }

  let expectedRows = (flowData.automated ?? flowData.scenarios ?? []).filter(
    (s) => s.automate || s.tcCoverage === 'YES',
  );

  if (localeFilter) {
    expectedRows = expectedRows.filter(
      (s) =>
        !s.supportedLocales?.length ||
        s.supportedLocales.includes(localeFilter) ||
        s.supportedLocales.includes('ALL'),
    );
  }

  const featureScenarios = extractFeatureScenarios(featurePath);
  const usedIndices = new Set();
  const errors = [];

  const featureContent = readFileSync(featurePath, 'utf-8');
  // Ignore comment lines so docs can mention the banned tag by name.
  const nonCommentContent = featureContent
    .split('\n')
    .filter(line => !/^\s*#/.test(line))
    .join('\n');
  const forbiddenTags = mapping.forbiddenTags ?? [];
  for (const tag of forbiddenTags) {
    if (nonCommentContent.includes(tag)) {
      errors.push(
        `Forbidden tag ${tag} found in ${mapping.featureFile} — use locale tags from Supported Locales (@US, @AU, …) and @Smoke from Feature Tag only`,
      );
    }
  }

  for (const bannedPath of mapping.forbiddenPaths ?? []) {
    if (existsSync(join(ROOT, bannedPath))) {
      errors.push(
        `Forbidden locale-specific feature file exists: ${bannedPath} — reuse ${mapping.featureFile} and add locale tags on scenarios instead`,
      );
    }
  }

  for (const row of expectedRows) {
    const matched = matchScenario(
      row.scenario,
      featureScenarios,
      usedIndices,
      mapping.softMatch !== false,
    );

    if (!matched) {
      errors.push(
        `Missing in feature file: [${row.page}] ${row.scenario} (locales: ${(row.supportedLocales ?? []).join(', ') || 'N/A'})`,
      );
    }
  }

  if (featureScenarios.length < expectedRows.length) {
    errors.push(
      `Scenario count: sheet has ${expectedRows.length} TC=YES rows` +
        (localeFilter ? ` for ${localeFilter}` : '') +
        `, feature file has ${featureScenarios.length} Scenario blocks`,
    );
  }

  return {
    key,
    ok: errors.length === 0,
    errors,
    expected: expectedRows.length,
    actual: featureScenarios.length,
    matched: usedIndices.size,
    featureFile: mapping.featureFile,
    flow: mapping.flow,
  };
}

function main() {
  const args = parseArgs(process.argv);

  if (!existsSync(MANIFEST_PATH)) {
    console.error('manifest.json not found. Run: npm run sync:knowledge-base');
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));

  if (!Array.isArray(manifest.flows)) {
    console.error(
      'manifest.json has no flows[] — resync with updated scripts: npm run sync:knowledge-base',
    );
    process.exit(1);
  }

  const mappings = Object.entries(FEATURE_MAPPINGS).filter(([key, mapping]) => {
    if (args.feature && key !== args.feature) return false;
    if (args.flow && mapping.flow.toLowerCase() !== args.flow.toLowerCase()) return false;
    return true;
  });

  if (mappings.length === 0) {
    console.error('No feature mappings matched the given filters.');
    console.error('Available:', Object.keys(FEATURE_MAPPINGS).join(', '));
    process.exit(1);
  }

  let failed = false;

  for (const [key, mapping] of mappings) {
    const flowData = manifest.flows.find(
      (f) => f.flow.toLowerCase() === mapping.flow.toLowerCase(),
    );

    if (!flowData) {
      console.error(`No flow "${mapping.flow}" in manifest.flows`);
      failed = true;
      continue;
    }

    const result = verifyMapping(key, mapping, flowData, args.locale);

    if (result.ok) {
      console.log(
        `OK  ${mapping.featureFile}: ${result.matched}/${result.expected} scenarios match flow "${mapping.flow}"` +
          (args.locale ? ` (locale ${args.locale})` : ''),
      );
    } else {
      failed = true;
      console.error(`FAIL ${mapping.featureFile} (flow: ${mapping.flow})`);
      for (const error of result.errors) {
        console.error(`  - ${error}`);
      }
    }
  }

  if (failed) {
    console.error('\nScenario coverage verification failed.');
    console.error('Sync first: npm run sync:knowledge-base');
    console.error(
      'Then add every Flow-tab TC coverage = YES row (smoke, regression, and N/A) with correct Supported Locales tags.',
    );
    process.exit(1);
  }

  console.log('\nAll mapped feature files include every TC coverage = YES scenario from Flow tabs.');
}

main();
