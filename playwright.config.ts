import { defineConfig, devices } from '@playwright/test';
import { TIMEOUTS } from '@utils/constants/index';
import environmentManager from './config/environment';
import { bddTestDir, resolveWorkers } from './config/playwright.shared';

export default defineConfig({
  testDir: bddTestDir,
  globalSetup: './config/global-setup.ts',
  globalTeardown: './config/global-teardown.ts',
  timeout: process.env.PLAYWRIGHT_TEST_TIMEOUT
    ? Number.parseInt(process.env.PLAYWRIGHT_TEST_TIMEOUT, 10)
    : TIMEOUTS.EXTRA_LONG,
  expect: { timeout: TIMEOUTS.LONG },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
  workers: resolveWorkers(false),
  reporter: [
    ['html', { open: process.env.CI ? 'never' : 'on' }],
    ['json', { outputFile: 'reports/playwright-report.json' }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: false, // Important: disable auto suite title
        environmentInfo: {
          ENV: process.env.NODE_ENV || 'unknown',
          URL: environmentManager.get('BASE_URL'),
          LOCALE: environmentManager.get('LOCALE'),
        },
        categories: [
          {
            name: 'Product Defects',
            messageRegex: /.*AssertionError.*/,
            matchedStatuses: ['failed'],
            description: 'Test failures caused by a bug in the application under test.',
          },
          {
            name: 'Test Script Issues (Timeouts)',
            traceRegex: /.*Test timeout of \d+ms exceeded.*/,
            matchedStatuses: ['broken', 'failed'],
            description:
              'Test failures caused by test code timing out (Playwright config issue, script slowness, etc.).',
          },
          {
            name: 'Infrastructure/Environment Issues',
            messageRegex: /.*browserType\.launch failed|Timeout \d+ms exceeded while connecting.*/,
            matchedStatuses: ['broken'],
            description:
              'Issues like failed browser launch, network errors, or environment setup problems.',
          },
          {
            name: 'Skipped tests',
            matchedStatuses: ['skipped'],
            description: 'Tests that were explicitly skipped using test.skip() or test.fixme().',
          },
          {
            name: 'Flaky tests',
            flaky: true,
            description:
              'Tests that were unstable (failed then passed on retry) or match specific flakiness patterns.',
          },
          {
            name: 'Passed Tests',
            matchedStatuses: ['passed'],
            description:
              'All tests that executed successfully and passed all assertions and validations.',
          },
        ],
      },
    ],
  ],
  use: {
    actionTimeout: TIMEOUTS.MEDIUM,
    navigationTimeout: TIMEOUTS.LONG,
    // Tracing on Windows can throw ENOENT for missing .network/.trace files during teardown.
    // Keep traces in CI only; use screenshots + npx playwright show-report locally.
    trace: process.env.CI ? 'retain-on-failure' : 'off',
    baseURL: environmentManager.get('BASE_URL'),
    headless: true,
    screenshot: 'on',
  },
  projects: [
    {
      name: 'Device: Desktop Chrome',
      use: {
        ...devices['Desktop chrome'],
        // Local fallback when Playwright browser cache is missing (AF_USE_SYSTEM_CHROME=1).
        ...(process.env.AF_USE_SYSTEM_CHROME === '1' ? { channel: 'chrome' as const } : {}),
      },
      grep: /@desktop|^((?!@iphone)(?!@android).)*$/,
    },
    {
      name: 'Device: Samsung Galaxy S22',
      use: {
        viewport: {
          width: 360,
          height: 780,
        },
        deviceScaleFactor: 2.625,
        isMobile: true,
        hasTouch: true,
        userAgent:
          'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
      },
      // Location Search on static pages Feature is @desktop @android; AFW-3952 RS scenarios are
      // desktop-only (Home inherits @android from the Feature tag otherwise).
      grep: /@android/,
      grepInvert: /@AFW-3952/,
    },
    {
      name: 'Device: iPhone 13 (Safari)',
      use: {
        ...devices['iPhone 13'],
      },
      grep: /@iphone|^((?!@android)(?!@desktop).)*$/,
    },
  ],
});
