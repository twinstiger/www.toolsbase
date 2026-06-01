// LCP measurement test using Playwright
// Measures Largest Contentful Paint on a blog post and the blog index

import { chromium } from 'playwright';

const PAGES = [
  { name: 'Blog index',  url: 'http://localhost:8765/blog/index.html' },
  { name: 'Cron guide',  url: 'http://localhost:8765/blog/cron-job-guide.html' },
  { name: 'SQL guide',   url: 'http://localhost:8765/blog/sql-injection-prevention.html' },
  { name: 'JWT guide',   url: 'http://localhost:8765/blog/jwt-authentication.html' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  // Simulate a fast 4G connection (closer to real users)
  viewport: { width: 1280, height: 800 },
});

for (const { name, url } of PAGES) {
  const page = await ctx.newPage();

  // Collect performance entries
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait briefly for LCP to settle
  await page.waitForTimeout(500);

  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        resolve({
          lcp: last ? last.startTime : null,
          element: last ? last.element?.tagName : null,
          size: last ? last.size : null,
          url: last ? last.url : null,
        });
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve({ lcp: null }), 200);
    });
  });

  // Also measure image load time directly
  const imgTimings = await page.evaluate(() => {
    return performance.getEntriesByType('resource')
      .filter(r => r.name.match(/\.(webp|svg|png|jpg|jpeg)$/i))
      .map(r => ({
        name: r.name.split('/').pop(),
        type: r.name.match(/\.(\w+)$/)?.[1],
        size: r.transferSize,
        duration: r.duration.toFixed(0),
        startTime: r.startTime.toFixed(0),
      }));
  });

  // Count network requests
  const totalReqs = imgTimings.length;

  console.log(`\n=== ${name} ===`);
  console.log(`URL: ${url}`);
  console.log(`LCP: ${lcp.lcp?.toFixed(0)}ms (element: ${lcp.element}, size: ${lcp.size})`);
  if (lcp.url) {
    console.log(`LCP image: ${lcp.url.split('/').pop()}`);
  }
  console.log(`Image requests: ${totalReqs}`);
  const totalImgSize = imgTimings.reduce((a, b) => a + b.size, 0);
  console.log(`Total image bytes: ${(totalImgSize/1024).toFixed(1)}KB`);
  console.log(`First 3 images:`);
  imgTimings.slice(0, 3).forEach(i => {
    console.log(`  ${i.name} (${i.type}, ${(i.size/1024).toFixed(1)}KB) loaded in ${i.duration}ms`);
  });

  await page.close();
}

await browser.close();
console.log('\n=== LCP Rating Guide ===');
console.log('Good:      < 2500ms');
console.log('Needs work: 2500-4000ms');
console.log('Poor:      > 4000ms');
