import { chromium } from 'playwright';

const BASE = process.env.DISCOVER_BASE || 'https://uat.anytimefitness.com';
const pages = [
  ['home', '/'],
  ['training', '/training'],
  ['fitness-consultation', '/training/fitness-consultation'],
  ['group-training', '/training/group-training'],
  ['personal-training', '/training/personal-training'],
  ['why-join', '/membership'],
  ['events-free-trial', '/events/free-trial'],
];

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const [name, path] of pages) {
    try {
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(6000);
      const iframes = await page.evaluate(() =>
        Array.from(document.querySelectorAll('iframe')).map((f) => ({
          id: f.id || null,
          src: (f.getAttribute('src') || '').slice(0, 80),
          title: f.getAttribute('title') || null,
        })),
      );
      const buttons = await page.evaluate(() => {
        const txt = document.body.innerText || '';
        const found = [];
        for (const kw of ['precise location', 'Approximate', 'Locations Near You', 'Nearest', 'Gym Details', 'Free Trial Pass', 'Visit Website']) {
          if (new RegExp(kw, 'i').test(txt)) found.push(kw);
        }
        return found;
      });
      console.log(`\n=== ${name} (${path}) ===`);
      console.log('iframes:', JSON.stringify(iframes));
      console.log('page-text-keywords:', JSON.stringify(buttons));
    } catch (err) {
      console.log(`\n=== ${name} (${path}) ERROR: ${err.message}`);
    }
  }

  await browser.close();
};

run();
