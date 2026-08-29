import { readFileSync } from 'node:fs';

const r = JSON.parse(readFileSync('tmp-lo-report/report.json', 'utf8'));
const f = r.files.find(x => /local/i.test(x.fileName));

function decodeBody(a) {
  if (!a.body) return null;
  return Buffer.from(a.body, 'base64').toString('utf8');
}

for (const t of f.tests.filter(t => !t.ok)) {
  const title = [...(t.path || []), t.title].join(' › ');
  console.log('\n====', t.projectName);
  console.log(title);
  for (const res of t.results || []) {
    for (const a of res.attachments || []) {
      const text = decodeBody(a);
      if (!text) continue;
      if (a.name === 'stdout' || a.name === 'stderr' || /error/i.test(a.name)) {
        // Prefer lines with Error/Timeout/expect
        const lines = text.split(/\r?\n/);
        const interesting = lines.filter(l =>
          /Error|Timeout|expect|Expected|failed|toBeVisible|toBeTruthy|Locator|strict mode|banner|Form Started|Lead Captured|referral|form_loaded|why-this|SEE YOU|Thank you|leadCapture/i.test(
            l,
          ),
        );
        console.log(
          interesting.length
            ? interesting.slice(0, 25).join('\n')
            : text.slice(0, 800),
        );
      }
    }
  }
}
