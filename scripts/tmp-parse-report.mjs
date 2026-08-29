import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const htmlPath = 'playwright-report copy 2/index.html';
const html = readFileSync(htmlPath, 'utf8');
const idx = html.indexOf('playwrightReportBase64');
console.log('idx', idx);
const m = html.match(/playwrightReportBase64\s*=\s*`([^`]+)`/)
  || html.match(/playwrightReportBase64\s*=\s*"([^"]+)"/)
  || html.match(/playwrightReportBase64\s*=\s*'([^']+)'/);
if (!m) {
  // try without window.
  const snippet = html.slice(Math.max(0, idx - 20), idx + 80);
  console.log('snippet', snippet);
  process.exit(1);
}
let b64 = m[1];
if (b64.startsWith('data:')) b64 = b64.split(',').pop();
const raw = Buffer.from(b64, 'base64');
writeFileSync('tmp-report.zip', raw);
console.log('zip header', raw.slice(0, 4).toString('hex'), 'len', raw.length);
mkdirSync('tmp-report-extract', { recursive: true });
execSync('tar -xf tmp-report.zip -C tmp-report-extract', { stdio: 'inherit' });
function walk(dir, acc = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}
const files = walk('tmp-report-extract');
console.log('files', files.slice(0, 30));
const reportJson = files.find(f => f.endsWith('report.json') || f.endsWith('test-results.json'));
if (reportJson) {
  const data = JSON.parse(readFileSync(reportJson, 'utf8'));
  console.log(JSON.stringify(data, null, 2).slice(0, 2000));
}
