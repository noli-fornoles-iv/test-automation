import fs from 'fs';

const raw = fs.readFileSync(
  'C:/Users/NOLI/.cursor/projects/c-Users-NOLI-Documents-Github-Ignite-Visibility-af-automation-test/agent-tools/b65fffc5-e8ea-4669-b20e-cd0cf449cddb.txt',
  'utf8',
);

const issues = [];
const re = /"key":\s*"(AFW-\d+)"[\s\S]*?"summary":\s*"([^"]*)"/g;
let m;
while ((m = re.exec(raw))) {
  issues.push({ key: m[1], summary: m[2] });
}
const uniq = [];
const seen = new Set();
for (const i of issues) {
  if (seen.has(i.key)) continue;
  seen.add(i.key);
  uniq.push(i);
}
console.log('total', uniq.length);
for (const i of uniq) {
  if (/french|français|quebec|fr-ca|cta|get started|local offer|disclaimer|3993|3210|translation|crowdin/i.test(i.summary)) {
    console.log(i.key, i.summary);
  }
}
console.log('--- all ---');
for (const i of uniq.slice(0, 80)) console.log(i.key, i.summary);
