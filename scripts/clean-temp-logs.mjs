/**
 * Removes ephemeral run artifacts from the repo root, .cursor/, and logs/.
 * Keep artifacts with KEEP_TEST_LOGS=1 (or true).
 *
 * Cleans: *.log, ftp-*.txt, tmp-*.{txt,zip,log}, debug-output.txt, gitActions.zip, etc.
 *
 * Usage:
 *   node scripts/clean-temp-logs.mjs
 *   node scripts/clean-temp-logs.mjs --skip-runtime   # root + .cursor only (safe while Winston is open)
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const keep = /^(1|true|yes)$/i.test(String(process.env.KEEP_TEST_LOGS || ''));
const skipRuntime = process.argv.includes('--skip-runtime');

if (keep) {
  console.log('KEEP_TEST_LOGS set — skipping artifact cleanup');
  process.exit(0);
}

const removed = [];

/** Root / .cursor scratch files from agent redirects and one-off runs */
const ROOT_SCRATCH_RE =
  /^(ftp-.+\.txt|\.?tmp-.+\.(txt|log|zip)|tmp-.+\.(txt|log|zip)|debug-output\.txt|gitActions\.zip|h\d{3}(-.*)?\.(txt|log)|mobile-tc-.+\.(txt|log))$/i;

function safeUnlink(filePath) {
  try {
    fs.unlinkSync(filePath);
    removed.push(path.relative(root, filePath));
  } catch (err) {
    if (err && err.code !== 'ENOENT') {
      console.warn(`Could not remove ${filePath}: ${err.message}`);
    }
  }
}

function removeMatchingFiles(dirPath, predicate) {
  if (!fs.existsSync(dirPath)) return;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (predicate(entry.name)) {
      safeUnlink(path.join(dirPath, entry.name));
    }
  }
}

function isLogFile(name) {
  return name.toLowerCase().endsWith('.log');
}

function isScratchArtifact(name) {
  return isLogFile(name) || ROOT_SCRATCH_RE.test(name);
}

// Root-level ad-hoc / redirected run artifacts
removeMatchingFiles(root, isScratchArtifact);

// Agent / local scratch under .cursor
removeMatchingFiles(path.join(root, '.cursor'), isScratchArtifact);

// Winston runtime logs (skip while a run is in progress)
if (!skipRuntime) {
  removeMatchingFiles(path.join(root, 'logs'), isLogFile);
  removeMatchingFiles(path.join(root, 'log'), isLogFile);
}

if (removed.length > 0) {
  console.log(`Cleaned ${removed.length} temp artifact(s):`);
  for (const file of removed) {
    console.log(`  - ${file}`);
  }
} else {
  console.log('No temporary artifacts to clean');
}
