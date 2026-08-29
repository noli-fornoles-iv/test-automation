import { chromium } from '@playwright/test';

const url =
  'https://uat.anytimefitness.com/ar-sa/email-club?test_location_id=SA-1004&use_prod_api=true';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const logApi = async response => {
  const u = response.url();
  if (!u.includes('/api/')) return;
  console.log('API', response.status(), u);
  if (u.includes('/api/mapbox-search') || u.includes('/api/locations')) {
    try {
      const body = await response.json();
      console.log(JSON.stringify(body, null, 2).slice(0, 2000));
    } catch {}
  }
};

page.on('response', logApi);

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(25000);

const frame = page.locator('#contact-us-iframe').contentFrame();
const input = frame.locator('#react-select-2-input');
await input.click({ timeout: 60000 });
await input.fill('');
await input.pressSequentially('Jiddah (TestDifferentiator)', { delay: 200 });
await page.waitForTimeout(5000);
console.log('--- submitting search ---');
await input.press('Enter');
await page.waitForTimeout(15000);

await browser.close();
