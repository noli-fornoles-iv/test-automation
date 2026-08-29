/**
 * Save a Guru card JSON (from MCP guru_get_card_by_id) to knowledge-base/links.
 *
 * Usage:
 *   node scripts/save-guru-card.mjs --name "Card Title" --input path/to/card.json
 *   node scripts/save-guru-card.mjs --input path/to/card.json   # title from card JSON
 *
 * Writes:
 *   .cursor/knowledge-base/links/<slug>.txt  — title + HTML stripped to plain text
 *   .cursor/knowledge-base/links/<slug>.html — when content includes HTML (optional --text-only)
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

function parseArgs(argv) {
  const args = argv.slice(2);
  const nameIdx = args.indexOf('--name');
  const inputIdx = args.indexOf('--input');
  return {
    name: nameIdx >= 0 ? args[nameIdx + 1] : null,
    input: inputIdx >= 0 ? args[inputIdx + 1] : null,
    textOnly: args.includes('--text-only'),
  };
}

function pickTitle(raw, cliName) {
  if (cliName?.trim()) return cliName.trim();
  const card = raw.card ?? raw.data ?? raw;
  const title =
    card.preferredPhrase ??
    card.title ??
    card.name ??
    raw.preferredPhrase ??
    raw.title ??
    raw.name;
  if (!title?.trim()) {
    throw new Error('Missing title: pass --name or include preferredPhrase/title in JSON');
  }
  return String(title).trim();
}

function pickContentHtml(raw) {
  const card = raw.card ?? raw.data ?? raw;
  const content =
    card.content ??
    card.body ??
    card.html ??
    raw.content ??
    raw.body ??
    raw.html;
  if (content === null) return '';
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content.body) return String(content.body);
  return String(content);
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function htmlToPlainText(html) {
  if (!html?.trim()) return '';
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/p>/gi, '\n\n');
  s = s.replace(/<\/h[1-6]>/gi, '\n\n');
  s = s.replace(/<\/li>/gi, '\n');
  s = s.replace(/<li[^>]*>/gi, '- ');
  s = s.replace(/<[^>]+>/g, '');
  s = decodeHtmlEntities(s);
  s = s.replace(/\r\n/g, '\n');
  s = s.replace(/[ \t]+\n/g, '\n');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

function looksLikeHtml(text) {
  return /<[a-z][\s\S]*>/i.test(text);
}

function main() {
  const { name: cliName, input, textOnly } = parseArgs(process.argv);
  if (!input) {
    console.error('Missing --input <path/to/card.json>');
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(input, 'utf-8'));
  const title = pickTitle(raw, cliName);
  const html = pickContentHtml(raw);
  const plain = htmlToPlainText(html);

  mkdirSync(LINKS_DIR, { recursive: true });
  const slug = slugify(title);
  const txtPath = join(LINKS_DIR, `${slug}.txt`);
  const txtBody = `${title}\n${'='.repeat(Math.min(title.length, 72))}\n\n${plain}\n`;
  writeFileSync(txtPath, txtBody, 'utf-8');
  console.log(`Wrote ${txtPath}`);

  if (!textOnly && html.trim() && looksLikeHtml(html)) {
    const htmlPath = join(LINKS_DIR, `${slug}.html`);
    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</title></head>
<body>
<h1>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</h1>
${html}
</body>
</html>
`;
    writeFileSync(htmlPath, htmlDoc, 'utf-8');
    console.log(`Wrote ${htmlPath}`);
  }
}

main();
