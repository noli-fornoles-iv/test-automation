/**
 * One-shot: write all MCP-fetched tabs to mcp-tabs/*.json (2026-07-19 sync)
 */
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const tabsDir = join(dirname(fileURLToPath(import.meta.url)), '..', '.cursor', 'knowledge-base', 'mcp-tabs');
mkdirSync(tabsDir, { recursive: true });

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function save(name, values) {
  const out = join(tabsDir, `${slug(name)}.json`);
  writeFileSync(out, JSON.stringify({ name, values }), 'utf-8');
  console.log(`Wrote ${slug(name)}.json (${values.length} rows)`);
}

// Load tab payloads from companion data file
const dataPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.cursor', 'knowledge-base', '_sync-tabs-data.json');
const tabs = JSON.parse(await import('fs').then((fs) => fs.readFileSync(dataPath, 'utf-8')));
for (const { name, values } of tabs) save(name, values);
