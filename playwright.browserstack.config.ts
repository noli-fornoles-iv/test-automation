import { defineConfig } from '@playwright/test';
import environmentManager from './config/environment';
import { bddTestDir, resolveWorkers } from './config/playwright.shared';
import { TIMEOUTS } from './utils/constants';

export default defineConfig({
  testDir: bddTestDir,
  grepInvert: /@iphone|@android/,
  globalSetup: './config/global-setup.ts',
  globalTeardown: './config/global-teardown.ts',
  timeout: TIMEOUTS.LONG,
  expect: { timeout: TIMEOUTS.LONG },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: resolveWorkers(true),
  reporter: [
    ['html', { open: 'on' }],
    ['json', { outputFile: 'reports/playwright-report.json' }],
    ['allure-playwright'],
  ],
  use: {
    actionTimeout: TIMEOUTS.LONG,
    navigationTimeout: TIMEOUTS.LONG,
    trace: process.env.CI ? 'retain-on-failure' : 'off',
    baseURL: environmentManager.get('BASE_URL'),
    headless: false,
    screenshot: 'on',
  },
  // No projects section - BrowserStack handles browser configuration
  // The browser, OS, and other settings come from browserstack.yml
});
