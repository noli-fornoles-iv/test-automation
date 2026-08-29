import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.context().grantPermissions(['geolocation']);
await page.context().setGeolocation({ latitude: 45.5017, longitude: -73.5673 });
await page.goto(
  'https://sit.anytimefitness.com/fr-ca/events/promo/?use_prod_api=true&disable_captcha=true&test_location_id=9993995',
  { waitUntil: 'domcontentloaded', timeout: 90000 },
);
await page.waitForTimeout(6000);
const frame = page.frameLocator('iframe').first();
const input = frame.locator('input').first();
await input.fill('H3Z 2Y7');
await page.keyboard.press('Enter');
await page.waitForTimeout(6000);
const text = await frame.locator('body').innerText();
console.log(text.slice(0, 2500));
await browser.close();
