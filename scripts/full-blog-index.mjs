import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

// Capture all image loads
const imageLoads = [];
page.on('response', async (resp) => {
  const url = resp.url();
  if (url.match(/\.(webp|svg|png|jpg|jpeg)$/i)) {
    imageLoads.push({ url: url.split('/').pop(), status: resp.status(), size: (await resp.body().catch(() => Buffer.alloc(0))).length });
  }
});

await page.goto('http://localhost:8765/blog/index.html?bust=' + Date.now(), { waitUntil: 'networkidle' });

// Scroll all the way down to trigger lazy loads
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let total = 0;
    const step = 200;
    const timer = setInterval(() => {
      window.scrollBy(0, step);
      total += step;
      if (total >= document.body.scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, 50);
  });
});
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

// Take full page screenshot
await page.screenshot({ path: '/tmp/blog-index-FULL.png', fullPage: true });
console.log('Full screenshot: /tmp/blog-index-FULL.png');

// Take the visible viewport at the start
await page.screenshot({ path: '/tmp/blog-index-top.png', fullPage: false });
console.log('Top screenshot: /tmp/blog-index-top.png');

console.log(`\n${imageLoads.length} image requests:`);
imageLoads.forEach(l => console.log(`  ${l.status} ${l.size}B ${l.url}`));

const failed = imageLoads.filter(l => l.status >= 400);
console.log(`\n${failed.length} failed`);

await browser.close();
