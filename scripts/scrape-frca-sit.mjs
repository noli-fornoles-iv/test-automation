import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

async function afterSearch(label, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(5000);
  const frame = page.frameLocator('iframe').first();
  const input = frame.locator('input').first();
  await input.fill('Winnipeg').catch(() => {});
  await page.keyboard.press('Enter').catch(() => {});
  await page.waitForTimeout(5000);
  const select = frame.getByRole('button', { name: /sélectionner|select/i }).first();
  if ((await select.count()) > 0) {
    await select.click({ timeout: 8000 }).catch(() => {});
  }
  await page.waitForTimeout(4000);
  const texts = [];
  for (const sel of ['h1', 'h2', 'h3', 'button', 'label']) {
    const n = await frame.locator(sel).count().catch(() => 0);
    for (let i = 0; i < Math.min(n, 25); i++) {
      const t = String((await frame.locator(sel).nth(i).innerText().catch(() => '')) || '')
        .replace(/\s+/g, ' ')
        .trim();
      if (t && t.length < 200) texts.push(t);
    }
  }
  console.log('===', label, '===');
  console.log([...new Set(texts)].slice(0, 60).join('\n'));
}

await afterSearch(
  'email-club',
  'https://sit.anytimefitness.com/fr-ca/email-club/?use_prod_api=true&disable_captcha=true',
);
await afterSearch(
  'try-us-free',
  'https://sit.anytimefitness.com/fr-ca/try-us-free/?use_prod_api=true&disable_captcha=true',
);

for (const p of [
  '/fr-ca/book-a-tour/',
  '/fr-ca/book-a-tour-standalone/',
  '/fr-ca/reserver-une-visite/',
  '/fr-ca/own-a-gym/',
  '/fr-ca/find-gym/',
  '/fr-ca/locations/',
  '/fr-ca/apple-fitness-offer/',
  '/fr-ca/apple-fitness-plus-subscriber/',
  '/fr-ca/events/promo/',
]) {
  const r = await page
    .goto('https://sit.anytimefitness.com' + p, { waitUntil: 'domcontentloaded', timeout: 60000 })
    .catch(() => null);
  const h1 = await page
    .locator('h1')
    .first()
    .innerText()
    .catch(() => '?');
  console.log(p, r && r.status(), h1.slice(0, 80), 'iframes', await page.locator('iframe').count());
}

await browser.close();
