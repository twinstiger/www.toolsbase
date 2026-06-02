// Debug blog index images
import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

// Listen for image errors
const failedRequests = [];
page.on('response', async (resp) => {
  const url = resp.url();
  if (url.match(/\.(webp|svg|png|jpg|jpeg)$/i) && resp.status() >= 400) {
    failedRequests.push({ url, status: resp.status() });
  }
});
page.on('requestfailed', (req) => {
  if (req.url().match(/\.(webp|svg|png|jpg|jpeg)$/i)) {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
  }
});

await page.goto('http://localhost:8765/blog/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

console.log('Failed image requests:', failedRequests.length);
failedRequests.forEach(r => console.log(' ', JSON.stringify(r)));

// Check actual rendered image dimensions
const imageInfo = await page.evaluate(() => {
  const cards = document.querySelectorAll('.blog-card-image-link img');
  return Array.from(cards).slice(0, 5).map(img => ({
    src: img.currentSrc || img.src,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    displayWidth: img.offsetWidth,
    displayHeight: img.offsetHeight,
    complete: img.complete,
    alt: img.alt,
  }));
});

console.log('\nImage elements (first 5):');
imageInfo.forEach(info => console.log(' ', JSON.stringify(info)));

// Screenshot
await page.screenshot({ path: '/tmp/blog-index-debug.png', fullPage: false });
console.log('\nScreenshot: /tmp/blog-index-debug.png');

// Scroll to the list
await page.evaluate(() => {
  const list = document.getElementById('blogList');
  if (list) list.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/blog-index-list.png', fullPage: false });
console.log('List screenshot: /tmp/blog-index-list.png');

await browser.close();
