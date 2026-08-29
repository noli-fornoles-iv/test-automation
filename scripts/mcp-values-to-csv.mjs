/**
 * Convert MCP get_sheet_data values (or a tab JSON file) to CSV in knowledge-base/links.
 *
 * Usage:
 *   node scripts/mcp-values-to-csv.mjs --name "Phone Number Teast Data" --input path/to/tab.json
 *   node scripts/mcp-values-to-csv.mjs --name "Foo" --stdin   # JSON: { "values": [[...]] }
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LINKS_DIR = join(__dirname, '..', '.cursor', 'knowledge-base', 'links');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function csvEscape(cell) {
  const s = cell == null ? '' : String(cell);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function valuesToCsv(values) {
  return (values ?? [])
    .map((row) => (row ?? []).map(csvEscape).join(','))
    .join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const nameIdx = args.indexOf('--name');
  const inputIdx = args.indexOf('--input');
  const useStdin = args.includes('--stdin');
  const name = nameIdx >= 0 ? args[nameIdx + 1] : null;
  if (!name) {
    console.error('Missing --name');
    process.exit(1);
  }

  let raw;
  if (useStdin) {
    raw = JSON.parse(readFileSync(0, 'utf-8'));
  } else if (inputIdx >= 0) {
    raw = JSON.parse(readFileSync(args[inputIdx + 1], 'utf-8'));
  } else {
    console.error('Provide --input <file> or --stdin');
    process.exit(1);
  }

  const values = raw.values ?? raw.rows ?? raw.valueRanges?.[0]?.values;
  if (!Array.isArray(values)) {
    console.error('No values array found');
    process.exit(1);
  }

  mkdirSync(LINKS_DIR, { recursive: true });
  const filename = `${slugify(name)}.csv`;
  const path = join(LINKS_DIR, filename);
  writeFileSync(path, valuesToCsv(values), 'utf-8');
  console.log(`Wrote ${path} (${values.length} rows)`);
}

main();
