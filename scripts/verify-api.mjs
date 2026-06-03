import { chromium } from 'playwright';

const browser = await chromium.launch();

async function snap(page, name) {
  await page.screenshot({ path: `/tmp/${name}.png`, fullPage: false });
  console.log(`  → /tmp/${name}.png`);
}

async function inspect(page, label) {
  const info = await page.evaluate(() => {
    const get = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), l: Math.round(r.left) };
    };
    return {
      header: get('.api-page-header'),
      layout: get('.api-layout'),
      sidebar: get('.api-sidebar'),
      main: get('.api-main'),
      toc: get('.api-toc'),
      pills: get('.api-pills'),
      tabs: get('.api-tabs'),
      activePanel: document.querySelector('.api-panel.active')?.dataset.panel,
      pillsInActive: !!document.querySelector('.api-panel.active .api-pills')
    };
  });
  console.log(`  ${label}:`, JSON.stringify(info));
}

// === Light mode tests ===
console.log('=== LIGHT MODE ===');
let page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
await page.goto('http://localhost:3000/api/', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);

await inspect(page, 'Overview (default)');
await snap(page, 'v1-overview');

await page.click('button[data-tab="tryit"]');
await page.waitForTimeout(300);
await inspect(page, 'Try It tab');
await snap(page, 'v1-tryit');

await page.click('button[data-tab="code"]');
await page.waitForTimeout(300);
await inspect(page, 'Code tab');
await snap(page, 'v1-code');

await page.click('button[data-tab="overview"]');
await page.waitForTimeout(300);

// Collapsed state
await page.click('#collapseBtn');
await page.waitForTimeout(300);
await inspect(page, 'Collapsed');
await snap(page, 'v1-collapsed');

// Expand again
await page.click('#collapseBtn');
await page.waitForTimeout(300);
await inspect(page, 'Expanded again');

await page.close();

// === Dark mode tests ===
console.log('=== DARK MODE ===');
page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
await page.goto('http://localhost:3000/api/', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  localStorage.clear();
  localStorage.setItem('theme', 'dark');
});
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);

await inspect(page, 'Dark Overview');
await snap(page, 'v1-dark-overview');

await page.click('#collapseBtn');
await page.waitForTimeout(300);
await inspect(page, 'Dark Collapsed');
await snap(page, 'v1-dark-collapsed');

await page.close();
await browser.close();
console.log('Done.');
