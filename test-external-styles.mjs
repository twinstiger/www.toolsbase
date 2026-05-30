import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('http://localhost:3000/blog');
await page.waitForLoadState('networkidle');

// Check all stylesheets
const stylesheets = await page.evaluate(() => {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  return Array.from(links).map(l => l.href);
});
console.log('Stylesheets:', stylesheets);

// Check inline styles
const hasDataFilteredInStyles = await page.evaluate(async () => {
  // Check main stylesheet
  const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
  for (const link of styleLinks) {
    try {
      const resp = await fetch(link.href);
      const css = await resp.text();
      if (css.includes('data-filtered')) {
        return true;
      }
    } catch(e) {}
  }
  return false;
});
console.log(`data-filtered in stylesheets: ${hasDataFilteredInStyles}`);

// Check computed styles
const computedInfo = await page.evaluate(() => {
  const style = document.querySelector('style');
  return style ? style.textContent.substring(0, 500) : 'no inline style';
});
console.log(`\nInline style content:\n${computedInfo}`);

await browser.close();
