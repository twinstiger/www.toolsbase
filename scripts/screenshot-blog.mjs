// Screenshot blog post to verify structured content renders correctly
import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// Screenshot JWT post (light mode)
const page = await ctx.newPage();
await page.goto('http://localhost:8765/blog/jwt-authentication.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// Full page screenshot
await page.screenshot({ path: '/tmp/blog-jwt-full.png', fullPage: true });
console.log('Full page: /tmp/blog-jwt-full.png');

// Above-the-fold (TL;DR visible)
await page.screenshot({ path: '/tmp/blog-jwt-fold.png', fullPage: false });
console.log('Above fold: /tmp/blog-jwt-fold.png');

// Scroll to FAQ
await page.evaluate(() => {
  const faq = document.querySelector('.faq-block');
  if (faq) faq.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/blog-jwt-faq.png', fullPage: false });
console.log('FAQ: /tmp/blog-jwt-faq.png');

// Open a FAQ item to verify it works
await page.click('.faq-item summary');
await page.waitForTimeout(200);
await page.screenshot({ path: '/tmp/blog-jwt-faq-open.png', fullPage: false });
console.log('FAQ open: /tmp/blog-jwt-faq-open.png');

// Check JSON-LD validity
const jsonLdScripts = await page.$$eval('script[type="application/ld+json"]', scripts => {
  return scripts.map(s => {
    try {
      const data = JSON.parse(s.textContent);
      return { ok: true, type: data['@type'] };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
});
console.log('\nJSON-LD scripts:');
jsonLdScripts.forEach(s => console.log('  ', JSON.stringify(s)));

// Screenshot Key Takeaways
await page.evaluate(() => {
  const kt = document.querySelector('.key-takeaways');
  if (kt) kt.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/blog-jwt-takeaways.png', fullPage: false });
console.log('\nTakeaways: /tmp/blog-jwt-takeaways.png');

await page.close();
await browser.close();
console.log('\nDone! Check /tmp/blog-jwt-*.png');
