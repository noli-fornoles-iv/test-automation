/**
 * Rename Gherkin/TAG FRCA → FR-CA (align with @EN-CA).
 * Does not change LOCALE=FR-CA or folder fr-ca.
 */
import fs from 'fs';
import path from 'path';

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'test-results',
  '.features-gen',
  '.cache',
  'playwright-report',
]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name) || e.name.startsWith('.tmp-')) continue;
      walk(p, out);
    } else if (
      /\.(feature|md|mjs|ts|js|json)$/.test(e.name) ||
      e.name === 'Jenkinsfile' ||
      e.name === 'AGENTS.md'
    ) {
      out.push(p);
    }
  }
  return out;
}

const root = process.cwd();
const files = walk(root).filter((f) => {
  try {
    return fs.readFileSync(f, 'utf8').includes('FR-CA');
  } catch {
    return false;
  }
});

let n = 0;
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const before = c;
  c = c.replace(/@FR-CA\b/g, '@FR-CA');
  c = c.replace(/TAG=FR-CA\b/g, 'TAG=FR-CA');
  c = c.replace(/'FR-CA'/g, "'FR-CA'");
  c = c.replace(/"FR-CA"/g, '"FR-CA"');
  c = c.replace(/\| FRCA \|/g, '| FR-CA |');
  c = c.replace(/→ FR-CA/g, '→ FR-CA');
  c = c.replace(/\(FRCA\)/g, '(FR-CA)');
  c = c.replace(/"tag": "FR-CA"/g, '"tag": "FR-CA"');
  c = c.replace(/'FR-CA': 'FR-CA'/g, "'FR-CA': 'FR-CA'");
  // sync-knowledge-base localeTagMap key
  c = c.replace(
    /FRCA:\s*\{\s*locale:\s*'FR-CA',\s*folder:\s*'fr-ca',\s*tag:\s*'FR-CA'\s*\}/g,
    "'FR-CA': { locale: 'FR-CA', folder: 'fr-ca', tag: 'FR-CA' }",
  );
  c = c.replace(
    /FRCA:\s*\{\s*locale:\s*'FR-CA',\s*folder:\s*'fr-ca',\s*tag:\s*'FR-CA'\s*\}/g,
    "'FR-CA': { locale: 'FR-CA', folder: 'fr-ca', tag: 'FR-CA' }",
  );
  // manifest localeTagMap key "FR-CA":
  c = c.replace(/"FR-CA":\s*\{\s*"locale":\s*"FR-CA"/g, '"FR-CA": { "locale": "FR-CA"');
  if (c !== before) {
    fs.writeFileSync(f, c);
    n++;
    console.log('updated', path.relative(root, f));
  }
}
console.log('files', n);
