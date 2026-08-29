/**
 * One-shot builder: writes scripts/_tmp-mcp-fetch.mjs from per-tab JSON in scripts/_tmp-mcp-sheets/.
 * Run after populating _tmp-mcp-sheets/*.json from MCP get_sheet_data responses.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHEETS_DIR = join(__dirname, '_tmp-mcp-sheets');
const OUT = join(__dirname, '_tmp-mcp-fetch.mjs');

const data = {};
for (const file of readdirSync(SHEETS_DIR).filter((f) => f.endsWith('.json')).sort()) {
  data[file] = JSON.parse(readFileSync(join(SHEETS_DIR, file), 'utf8'));
}

writeFileSync(OUT, `export default ${JSON.stringify(data, null, 2)};\n`);
console.log('wrote', OUT, Object.keys(data).length, 'tabs');
