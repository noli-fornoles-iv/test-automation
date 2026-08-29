/**
 * Build a filtered Allure results folder for one ticket/tag and locale run.
 *
 * Allure accumulates every local run in `allure-results`, so a ticket report needs
 * the relevant run window only. Same scenario re-run per locale shares a historyId,
 * so `--locale` stamps a LOCALE parameter and suffixes historyId to keep both visible.
 *
 * Usage:
 *   node scripts/filter-allure-results.mjs --tag=AFW-3440 \
 *     --since=2026-08-18T03:49:10Z --until=2026-08-18T04:04:20Z \
 *     --locale=EN-US --out=allure-results-AFW-3440 [--append] [--skip-status=skipped]
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const args = new Map(
  process.argv
    .slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, ...v] = a.slice(2).split('=');
      return [k, v.join('=') || 'true'];
    }),
);

const tag = args.get('tag');
if (!tag) {
  console.error('Missing --tag=<TICKET or tag>');
  process.exit(1);
}
const source = args.get('source') ?? 'allure-results';
const out = args.get('out') ?? `allure-results-${tag}`;
const locale = args.get('locale');
const append = args.get('append') === 'true';
const since = args.get('since') ? Date.parse(args.get('since')) : 0;
const until = args.get('until') ? Date.parse(args.get('until')) : Number.POSITIVE_INFINITY;
const excluded = new Set((args.get('skip-status') ?? '').split(',').filter(Boolean));

if (!existsSync(source)) {
  console.error(`Source folder not found: ${source}`);
  process.exit(1);
}

if (!append) rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const attachments = new Set();
const latestByTest = new Map();
let dropped = 0;

for (const file of readdirSync(source)) {
  if (!file.endsWith('-result.json')) continue;
  const path = join(source, file);
  const mtime = statSync(path).mtimeMs;
  if (mtime < since || mtime > until) continue;

  const raw = readFileSync(path, 'utf8');
  if (!raw.includes(tag)) continue;

  const result = JSON.parse(raw);
  if (excluded.has(result.status)) {
    dropped += 1;
    continue;
  }

  const key = `${result.historyId ?? result.fullName ?? file}`;
  const previous = latestByTest.get(key);
  if (previous && previous.start >= (result.start ?? 0)) continue;
  latestByTest.set(key, { file, start: result.start ?? 0, result });
}

for (const { file, result } of latestByTest.values()) {
  const collect = node => {
    for (const a of node.attachments ?? []) if (a.source) attachments.add(a.source);
    for (const child of [...(node.steps ?? []), ...(node.befores ?? []), ...(node.afters ?? [])]) {
      collect(child);
    }
  };
  collect(result);

  if (locale) {
    result.historyId = `${result.historyId ?? result.fullName ?? file}-${locale}`;
    result.name = `[${locale}] ${result.name}`;
    result.parameters = [
      ...(result.parameters ?? []).filter(p => p.name !== 'LOCALE'),
      { name: 'LOCALE', value: locale },
    ];
  }
  writeFileSync(join(out, file), JSON.stringify(result));
}

for (const name of attachments) {
  const path = join(source, name);
  if (existsSync(path)) copyFileSync(path, join(out, name));
}

for (const meta of ['categories.json', 'environment.properties', 'executor.json']) {
  const path = join(source, meta);
  if (existsSync(path) && !existsSync(join(out, meta))) copyFileSync(path, join(out, meta));
}

console.log(
  `${out}: ${latestByTest.size} result(s) kept${locale ? ` as ${locale}` : ''}, ${dropped} excluded by status, ${attachments.size} attachment(s)`,
);
