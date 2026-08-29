import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(
  'https://sit.anytimefitness.com/fr-ca/try-us-free/?use_prod_api=true&disable_captcha=true&test_location_id=9993995',
  { waitUntil: 'domcontentloaded', timeout: 90000 },
);
await page.waitForTimeout(5000);
await page.context().setGeolocation({ latitude: 45.5017, longitude: -73.5673 });
const frame = page.frameLocator('iframe').first();
await frame.locator('input').first().fill('Montreal');
await page.keyboard.press('Enter');
await page.waitForTimeout(5000);
const select = frame.getByRole('button', { name: /SÉLECTIONNER/i }).first();
await select.click({ timeout: 15000 }).catch(() => {});
await page.waitForTimeout(4000);
const btns = await frame.locator('button[type="submit"], button').allInnerTexts();
console.log(btns.map((b) => b.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 20));
const privacy = await frame.locator('text=/cliquant|Commencer|Envoyer|GET STARTED|SUBMIT/i').allInnerTexts().catch(() => []);
console.log('privacy snippets', privacy.slice(0, 5).map((p) => p.slice(0, 120)));
await browser.close();
