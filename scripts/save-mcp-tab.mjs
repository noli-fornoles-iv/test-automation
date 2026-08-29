/**
 * Save one MCP get_sheet_data response (or {name,values}) to mcp-tabs/<slug>.json
 * Usage: node scripts/save-mcp-tab.mjs < path-to-raw.json
 *    or: node scripts/save-mcp-tab.mjs path-to-raw.json
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tabsDir = join(root, '.cursor', 'knowledge-base', 'mcp-tabs');
mkdirSync(tabsDir, { recursive: true });

const arg = process.argv[2];
const rawText = arg ? readFileSync(arg, 'utf-8') : readFileSync(0, 'utf-8');
const raw = JSON.parse(rawText);

let name;
let values;
if (Array.isArray(raw.valueRanges) && raw.valueRanges[0]) {
  name = String(raw.valueRanges[0].range ?? '')
    .replace(/!.*$/, '')
    .trim();
  values = raw.valueRanges[0].values ?? [];
} else {
  name = String(raw.name ?? raw.title ?? '').trim();
  values = raw.values ?? raw.rows ?? [];
}

if (!name || !Array.isArray(values)) {
  throw new Error('Expected MCP get_sheet_data shape or { name, values }');
}

const slug = name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const out = join(tabsDir, `${slug}.json`);
writeFileSync(out, JSON.stringify({ name, values }), 'utf-8');
console.log(`Wrote ${slug}.json (${values.length} rows)`);
