#!/usr/bin/env node
/**
 * Align @Smoke / @Regression tags in feature files with Flow-tab Feature Tag values.
 *
 * Source of truth (in order):
 *   1. .cursor/knowledge-base/.mcp-sheet-dump.json flow tabs
 *   2. .cursor/knowledge-base/manifest.json flows[].scenarios
 *
 * Mapping rules (from af-automation-agent SKILL.md):
 *   SMOKE, REGRESSION / REGRESSION, SMOKE → @Smoke @Regression
 *   SMOKE only                            → @Smoke
 *   REGRESSION only                       → @Regression
 *   N/A / empty / other without SMOKE|REGRESSION → remove both
 *
 * Usage:
 *   node scripts/align-feature-tags.mjs
 *   node scripts/align-feature-tags.mjs --dry-run
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KB_DIR = join(ROOT, '.cursor', 'knowledge-base');
const DUMP_PATH = join(KB_DIR, '.mcp-sheet-dump.json');
const MANIFEST_PATH = join(KB_DIR, 'manifest.json');
const MAP_PATH = join(KB_DIR, 'feature-tag-map.json');

const FEATURE_FILES = [
  'features/bookATourStandalone/book-a-tour.feature',
  'features/contactUs/contact-us.feature',
  'features/events/events-free-trial-pass.feature',
  'features/events/events-join-online.feature',
  'features/events/events-promo.feature',
  'features/events/events-find-your-fitphoria.feature',
  'features/events/events-book-a-tour.feature',
  'features/events/events-train-for-your-life.feature',
  'features/corporateMembership/corporate-membership.feature',
  'features/hsaFsaMembership/hsa-fsa-membership.feature',
  'features/localOffer/local-offer.feature',
  'features/mcoOffer/mcoOffer.feature',
  'features/ownAGym/own-a-gym.feature',
  'features/memberOffer/member-offer.feature',
  'features/membershipInquiry/membership-inquiry.feature',
  'features/tryUsFree/try-us-free-apple-fitness-offer.feature',
  'features/tryUsFree/try-us-free-apple-fitness-subscriber.feature',
  'features/tryUsFree/try-us-free.feature',
  'features/findAGym/find-a-gym.feature',
  'features/inviteAFriend/invite-a-friend.feature',
  'features/inviteAFriend/share-invitation-link-generation.feature',
  'features/locationSearchOnStaticPages/location-search-on-static-pages.feature',
  'features/cancelMembership/cancel-membership.feature',
];

const dryRun = process.argv.includes('--dry-run');

function featureTagsFromSheet(raw) {
  const upper = String(raw ?? '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
  if (!upper || upper === 'N/A' || upper === 'NA') {
    return { smoke: false, regression: false };
  }
  const parts = upper.split(/[,|/]+/).map((p) => p.trim()).filter(Boolean);
  const hasSmoke = parts.includes('SMOKE');
  const hasRegression = parts.includes('REGRESSION');
  return { smoke: hasSmoke, regression: hasRegression };
}

function tagsToGherkin({ smoke, regression }) {
  const tags = [];
  if (smoke) tags.push('@Smoke');
  if (regression) tags.push('@Regression');
  return tags;
}

function loadTcFeatureTagMap() {
  const map = new Map();

  // Explicit map from latest sheet Feature Tag sync (preferred when present)
  if (existsSync(MAP_PATH)) {
    const raw = JSON.parse(readFileSync(MAP_PATH, 'utf-8'));
    for (const [tcId, featureTag] of Object.entries(raw)) {
      if (!/^TC-[A-Z]\d+/i.test(tcId)) continue;
      map.set(tcId.toUpperCase(), featureTagsFromSheet(featureTag));
    }
    if (map.size > 0) return map;
  }

  if (existsSync(DUMP_PATH)) {
    const dump = JSON.parse(readFileSync(DUMP_PATH, 'utf-8'));
    for (const tab of dump.tabs ?? []) {
      const values = tab.values ?? [];
      if (values.length < 2) continue;
      // Find header row with "Test Case ID" and "Feature Tag"
      let headerIdx = -1;
      let idCol = -1;
      let tagCol = -1;
      for (let i = 0; i < Math.min(5, values.length); i++) {
        const row = values[i].map((c) => String(c ?? '').trim());
        const idI = row.findIndex((c) => /^test case id$/i.test(c));
        const tagI = row.findIndex((c) => /^feature tag$/i.test(c));
        if (idI >= 0 && tagI >= 0) {
          headerIdx = i;
          idCol = idI;
          tagCol = tagI;
          break;
        }
      }
      if (headerIdx < 0) continue;
      for (let r = headerIdx + 1; r < values.length; r++) {
        const row = values[r] ?? [];
        const tcId = String(row[idCol] ?? '').trim();
        if (!/^TC-[A-Z]\d+/i.test(tcId)) continue;
        const featureTag = String(row[tagCol] ?? '').trim();
        map.set(tcId.toUpperCase(), featureTagsFromSheet(featureTag));
      }
    }
  }

  if (map.size === 0 && existsSync(MANIFEST_PATH)) {
    const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
    for (const flow of manifest.flows ?? []) {
      for (const sc of flow.scenarios ?? []) {
        const tcId = String(sc.testCaseId ?? sc.id ?? '').trim();
        if (!tcId) continue;
        map.set(tcId.toUpperCase(), featureTagsFromSheet(sc.featureTag ?? sc.featureTags ?? ''));
      }
    }
  }

  // Fallback: scenario-checklist markdown files
  if (map.size === 0) {
    const files = existsSync(KB_DIR)
      ? readdirSync(KB_DIR).filter((f) => f.startsWith('scenario-checklist-') && f.endsWith('.md'))
      : [];
    for (const file of files) {
      const text = readFileSync(join(KB_DIR, file), 'utf-8');
      for (const line of text.split(/\r?\n/)) {
        // | TC-A001 | ... | REGRESSION, SMOKE | ...
        const m = line.match(/\|\s*(TC-[A-Z]\d+)\s*\|([^|]*)\|([^|]*)\|/i);
        if (!m) continue;
        // Checklists vary column order; look for Feature Tag column via header once
      }
    }
  }

  return map;
}

function rewriteTagLine(line, desired) {
  // Preserve indentation
  const indent = line.match(/^\s*/)[0];
  const body = line.trim();
  if (!body.startsWith('@')) return line;

  const tokens = body.split(/\s+/).filter(Boolean);
  const tcTags = tokens.filter((t) => /^@TC-/i.test(t));
  const localeAndOther = tokens.filter(
    (t) => !/^@TC-/i.test(t) && !/^@Smoke$/i.test(t) && !/^@Regression$/i.test(t),
  );

  const featureTags = tagsToGherkin(desired);
  // Canonical order: @TC-* then @Smoke/@Regression then locale/other
  const next = [...tcTags, ...featureTags, ...localeAndOther];
  return `${indent}${next.join(' ')}`;
}

function alignFile(relPath, tcMap) {
  const full = join(ROOT, relPath);
  if (!existsSync(full)) {
    return { path: relPath, skipped: true, reason: 'missing' };
  }
  const original = readFileSync(full, 'utf-8');
  const lines = original.split(/\r?\n/);
  const changes = [];
  let pendingTc = null;
  let pendingDesired = null;
  let pendingLineIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('@') && /@TC-[A-Z]\d+/i.test(trimmed)) {
      const tcMatch = trimmed.match(/@(TC-[A-Z]\d+)/i);
      const tcId = tcMatch[1].toUpperCase();
      if (tcMap.has(tcId)) {
        pendingTc = tcId;
        pendingDesired = tcMap.get(tcId);
        pendingLineIdx = i;
      } else {
        pendingTc = null;
        pendingDesired = null;
        pendingLineIdx = -1;
      }
      continue;
    }
    if (
      pendingDesired &&
      pendingLineIdx >= 0 &&
      /^(Scenario|Scenario Outline):/i.test(trimmed)
    ) {
      const before = lines[pendingLineIdx];
      const after = rewriteTagLine(before, pendingDesired);
      if (before !== after) {
        lines[pendingLineIdx] = after;
        changes.push({ tc: pendingTc, before: before.trim(), after: after.trim() });
      }
      pendingTc = null;
      pendingDesired = null;
      pendingLineIdx = -1;
    }
  }

  if (changes.length && !dryRun) {
    const nl = original.includes('\r\n') ? '\r\n' : '\n';
    writeFileSync(full, lines.join(nl), 'utf-8');
  }

  return { path: relPath, skipped: false, changes };
}

function main() {
  const tcMap = loadTcFeatureTagMap();
  if (tcMap.size === 0) {
    console.error(
      'No TC → Feature Tag map found. Sync KB first (MCP dump + npm run sync:knowledge-base).',
    );
    process.exit(1);
  }

  console.log(`Loaded ${tcMap.size} Test Case ID → Feature Tag mappings`);
  if (dryRun) console.log('DRY RUN — no files will be written\n');

  let totalChanges = 0;
  for (const file of FEATURE_FILES) {
    const result = alignFile(file, tcMap);
    if (result.skipped) {
      console.log(`SKIP ${file} (${result.reason})`);
      continue;
    }
    if (result.changes.length === 0) {
      console.log(`OK   ${file} (already aligned)`);
      continue;
    }
    totalChanges += result.changes.length;
    console.log(`${dryRun ? 'WOULD' : 'UPD '} ${file} (${result.changes.length} scenarios)`);
    for (const c of result.changes) {
      console.log(`  ${c.tc}`);
      console.log(`    - ${c.before}`);
      console.log(`    + ${c.after}`);
    }
  }

  console.log(`\n${dryRun ? 'Would update' : 'Updated'} ${totalChanges} scenario tag line(s)`);
}

main();
