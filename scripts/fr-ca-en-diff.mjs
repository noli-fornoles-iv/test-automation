import fs from 'fs';

const fr = JSON.parse(fs.readFileSync('resources/fr-ca/translations.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('resources/en-us/translations.json', 'utf8'));

function walk(o, p = '') {
  const out = [];
  for (const [k, v] of Object.entries(o || {})) {
    const np = p ? `${p}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...walk(v, np));
    else out.push([np, String(v ?? '')]);
  }
  return out;
}

const enMap = Object.fromEntries(walk(en));
const same = [];
for (const [k, v] of walk(fr)) {
  if (v && enMap[k] && v === enMap[k] && v.length > 3) same.push(k);
}
console.log('identical-to-en-us count', same.length);
console.log(same.join('\n'));
