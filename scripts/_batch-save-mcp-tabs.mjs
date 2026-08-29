/**
 * Batch-save MCP tab payloads from _mcp-raw/*.json via save-mcp-tab.mjs
 */
import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rawDir = join(root, '.cursor', 'knowledge-base', '_mcp-raw');
const saveScript = join(root, 'scripts', 'save-mcp-tab.mjs');

const files = readdirSync(rawDir).filter((f) => f.endsWith('.json')).sort();
if (files.length === 0) {
  throw new Error(`No raw JSON in ${rawDir}`);
}

for (const file of files) {
  const r = spawnSync(process.execPath, [saveScript, join(rawDir, file)], {
    encoding: 'utf-8',
  });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    process.exit(r.status ?? 1);
  }
  process.stdout.write(r.stdout);
}

console.log(`Saved ${files.length} tabs`);
