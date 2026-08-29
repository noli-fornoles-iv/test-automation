import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import MCP from './_tmp-mcp-fetch.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

for (const [file, { name, values }] of Object.entries(MCP)) {
  const out = { name, values };
  writeFileSync(
    join(__dirname, '..', '.cursor', 'knowledge-base', 'mcp-tabs', file),
    JSON.stringify(out, null, 2) + '\n',
  );
  console.log('wrote', file, `(${values.length} rows)`);
}
