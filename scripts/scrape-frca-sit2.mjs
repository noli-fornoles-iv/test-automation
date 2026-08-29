import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

async function dump(label, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(6000);
  const frame = page.frameLocator('iframe').first();
  const input = frame.locator('input').first();
  await input.click().catch(() => {});
  await input.fill('Winnipeg').catch(() => {});
  await page.waitForTimeout(1500);
  // pick suggestion if any
  const suggestion = frame.locator('[role="option"], li, button').filter({ hasText: /Winnipeg/i }).first();
  if ((await suggestion.count()) > 0) await suggestion.click().catch(() => {});
  else await page.keyboard.press('Enter').catch(() => {});
  await page.waitForTimeout(5000);
  const btn = frame.getByRole('button', { name: /SÉLECTIONNER|SELECT|GYM/i }).first();
  console.log(label, 'select visible', await btn.isVisible().catch(() => false));
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(4000);
  }
  const texts = [];
  for (const sel of ['h1', 'h2', 'h3', 'button', 'label', 'p']) {
    const n = await frame.locator(sel).count().catch(() => 0);
    for (let i = 0; i < Math.min(n, 30); i++) {
      const t = String((await frame.locator(sel).nth(i).innerText().catch(() => '')) || '')
        .replace(/\s+/g, ' ')
        .trim();
      if (t && t.length < 220) texts.push(t);
    }
  }
  console.log('===', label, '===');
  console.log([...new Set(texts)].slice(0, 80).join('\n'));
}

await dump(
  'email-club',
  'https://sit.anytimefitness.com/fr-ca/email-club/?use_prod_api=true&disable_captcha=true',
);
await dump(
  'schedule',
  'https://sit.anytimefitness.com/fr-ca/schedule-an-appointment-online/?use_prod_api=true&disable_captcha=true',
);
await dump(
  'events-promo',
  'https://sit.anytimefitness.com/fr-ca/events/promo/?use_prod_api=true&disable_captcha=true',
);

await browser.close();
