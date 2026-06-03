import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
// Clear localStorage to start fresh
await page.goto('http://localhost:3000/api/', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);

// Click the collapse button
await page.click('#collapseBtn');
await page.waitForTimeout(500);

const info = await page.evaluate(() => {
  const layout = document.querySelector('.api-layout');
  const main = document.querySelector('.api-main');
  const toc = document.querySelector('.api-toc');
  const sidebar = document.querySelector('.api-sidebar');
  const rect = (el) => el ? el.getBoundingClientRect() : null;
  return {
    layoutClasses: layout.className,
    layoutWidth: rect(layout)?.width,
    layoutCols: getComputedStyle(layout).gridTemplateColumns,
    mainWidth: rect(main)?.width,
    mainLeft: rect(main)?.left,
    tocWidth: rect(toc)?.width,
    tocLeft: rect(toc)?.left,
    sidebarWidth: rect(sidebar)?.width,
    sidebarDisplay: getComputedStyle(sidebar).display
  };
});
console.log('After collapse:', JSON.stringify(info, null, 2));
await page.screenshot({ path: '/tmp/api-collapsed-test.png' });
await browser.close();
