import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(
  'https://sit.anytimefitness.com/fr-ca/email-club/?use_prod_api=true&disable_captcha=true&test_location_id=9993995',
  { waitUntil: 'domcontentloaded', timeout: 90000 },
);
await page.waitForTimeout(5000);
const frame = page.frameLocator('iframe').first();
await frame.locator('input').first().fill('Winnipeg');
await page.keyboard.press('Enter');
await page.waitForTimeout(6000);
const html = await frame.locator('body').innerHTML();
const snippet = html.match(/MONTREAL[\s\S]{0,800}/i);
console.log(snippet ? snippet[0].slice(0, 800) : 'no montreal');
const text = await frame.locator('body').innerText();
console.log('---TEXT---');
console.log(text.slice(0, 1800));
await browser.close();
