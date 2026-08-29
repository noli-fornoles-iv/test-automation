import { execFileSync } from 'child_process';
import path from 'path';

/**
 * After Playwright finishes, remove ephemeral run logs so they do not clutter the repo.
 * Set KEEP_TEST_LOGS=1 to retain logs for debugging.
 */
async function globalTeardown() {
  const script = path.resolve(process.cwd(), 'scripts/clean-temp-logs.mjs');
  try {
    execFileSync(process.execPath, [script], {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: process.env,
    });
  } catch (error) {
    // Cleanup must never fail the test run
    console.warn('Log cleanup after test run failed:', error);
  }
}

export default globalTeardown;
