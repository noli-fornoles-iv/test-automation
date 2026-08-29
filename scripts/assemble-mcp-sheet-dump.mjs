/**
 * Assemble `.cursor/knowledge-base/.mcp-sheet-dump.json` from per-tab JSON files.
 *
 * Agent workflow:
 * 1. MCP get_sheet_data for each tab
 * 2. Write `.cursor/knowledge-base/mcp-tabs/<slug>.json` as:
 *    { "name": "Coverage", "values": [ ... ] }
 * 3. node scripts/assemble-mcp-sheet-dump.mjs
 * 4. npm run sync:knowledge-base
 *
 * Or pass a single combined dump path already written by the agent.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KB_DIR = join(ROOT, '.cursor', 'knowledge-base');
const TABS_DIR = join(KB_DIR, 'mcp-tabs');
const DUMP_PATH = join(KB_DIR, '.mcp-sheet-dump.json');
const SHEET_ID = '1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg';

function main() {
  mkdirSync(TABS_DIR, { recursive: true });

  if (!existsSync(TABS_DIR)) {
    throw new Error(`Missing ${TABS_DIR}`);
  }

  const files = readdirSync(TABS_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    throw new Error(
      `No tab JSON files in ${TABS_DIR}. Write one file per sheet tab, then re-run.`,
    );
  }

  const tabs = files.map((file) => {
    const raw = JSON.parse(readFileSync(join(TABS_DIR, file), 'utf-8'));
    const name = (raw.name ?? raw.title ?? '').trim();
    const values = raw.values ?? raw.rows;
    if (!name || !Array.isArray(values)) {
      throw new Error(`${file}: expected { name, values }`);
    }
    return {
      name,
      gid: raw.gid != null ? String(raw.gid) : undefined,
      values,
    };
  });

  const dump = {
    spreadsheetId: SHEET_ID,
    syncedVia: 'mcp',
    fetchedAt: new Date().toISOString(),
    tabs,
  };

  writeFileSync(DUMP_PATH, JSON.stringify(dump), 'utf-8');
  console.log(`Wrote ${DUMP_PATH} (${tabs.length} tabs)`);
  console.log(tabs.map((t) => t.name).join(', '));
}

main();
