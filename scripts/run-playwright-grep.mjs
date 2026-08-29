/**
 * Windows-safe Playwright runner (avoids cross-env-shell + Node 24 spawn ENOENT).
 *
 * Modes:
 *   node scripts/run-playwright-grep.mjs --vars=FEATURE,TAG [-- playwright-args...]
 *     Builds grep "(?=.*@${FEATURE}\\b)(?=.*@${TAG}\\b)" from env.
 *   node scripts/run-playwright-grep.mjs --vars=TAG --fixed=Regression [-- ...]
 *     Builds "(?=.*@Regression\\b)(?=.*@${TAG}\\b)" — fixed tokens first, then env vars.
 *   node scripts/run-playwright-grep.mjs "(?=.*@$FEATURE\\b)(?=.*@$TAG\\b)" [-- ...]
 *     Legacy template mode ($ENV expanded from process.env).
 */
import { spawnSync } from 'node:child_process';

const argv = process.argv.slice(2);
if (!argv.length) {
  console.error(
    'Usage: node scripts/run-playwright-grep.mjs --vars=FEATURE,TAG [--fixed=Smoke] [-- playwright-args...]',
  );
  process.exit(1);
}

let pattern = '';
let passthrough = [...argv];
const fixedTokens = [];
let envKeys = [];

while (passthrough.length && passthrough[0].startsWith('--')) {
  const arg = passthrough.shift();
  if (arg === '--') break;
  if (arg.startsWith('--vars=')) {
    envKeys = arg
      .slice('--vars='.length)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    continue;
  }
  if (arg.startsWith('--fixed=')) {
    fixedTokens.push(
      ...arg
        .slice('--fixed='.length)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    );
    continue;
  }
  // Unknown flag — treat as playwright arg
  passthrough.unshift(arg);
  break;
}

if (envKeys.length || fixedTokens.length) {
  const missing = envKeys.filter(k => !process.env[k]);
  if (missing.length) {
    console.error(`Missing required env var(s): ${[...new Set(missing)].join(', ')}`);
    process.exit(1);
  }
  const parts = [
    ...fixedTokens.map(t => `(?=.*@${t}\\b)`),
    ...envKeys.map(k => `(?=.*@${process.env[k]}\\b)`),
  ];
  pattern = parts.join('');
} else {
  pattern = passthrough.shift() ?? '';
  if (passthrough[0] === '--') passthrough.shift();
  const missing = [];
  pattern = pattern.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, key) => {
    const value = process.env[key];
    if (value == null || value === '') {
      missing.push(key);
      return '';
    }
    return value;
  });
  if (missing.length) {
    console.error(`Missing required env var(s): ${[...new Set(missing)].join(', ')}`);
    process.exit(1);
  }
}

if (!pattern) {
  console.error('Empty grep pattern');
  process.exit(1);
}

const isWin = process.platform === 'win32';
const npx = isWin ? 'npx.cmd' : 'npx';
// shell:true is required on Windows for npx.cmd. On Linux/macOS it must stay false —
// otherwise /bin/sh interprets the --grep lookahead (?=...) as a subshell and exits 2
// (this is what made every Jenkins locale fail in ~15s after bddgen).
const result = spawnSync(npx, ['playwright', 'test', '--grep', pattern, ...passthrough], {
  stdio: 'inherit',
  shell: isWin,
  env: process.env,
  windowsHide: true,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
