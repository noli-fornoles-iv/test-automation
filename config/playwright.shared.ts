import os from 'os';
import { defineBddConfig } from 'playwright-bdd';

const DEFAULT_BROWSERSTACK_PARALLELS = 5;

export const bddTestDir = defineBddConfig({
  importTestFrom: './fixtures/base.fixture.ts',
  paths: ['./features'],
  require: ['./step-definitions/**/*.ts'],
});

export function resolveWorkers(isBrowserStack = false): number {
  const fromEnv = process.env.PLAYWRIGHT_WORKERS;
  if (fromEnv) {
    const parsed = Number.parseInt(fromEnv, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  if (isBrowserStack) {
    return DEFAULT_BROWSERSTACK_PARALLELS;
  }

  if (process.env.CI) {
    return 8;
  }

  return Math.max(2, Math.floor(os.cpus().length / 2));
}
