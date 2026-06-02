// Quick verification of multiple posts + dark mode
import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// Test a few different posts
const slugs = ['sql-injection-prevention', 'docker-commands', 'yaml-beginners-guide', 'api-authentication'];
for (const slug of slugs) {
  const page = await ctx.newPage();
  await page.goto(`http://localhost:8765/blog/${slug}.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  // Verify TL;DR + Key Takeaways + FAQ present
  const counts = await page.evaluate(() => ({
    tldr: document.querySelectorAll('.tldr').length,
    takeaways: document.querySelectorAll('.key-takeaways').length,
    faqItems: document.querySelectorAll('.faq-item').length,
    jsonld: document.querySelectorAll('script[type="application/ld+json"]').length,
  }));
  console.log(`${slug}:`, JSON.stringify(counts));

  await page.close();
}

// Test dark mode
const darkPage = await ctx.newPage();
await darkPage.goto('http://localhost:8765/blog/jwt-authentication.html', { waitUntil: 'networkidle' });
await darkPage.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
await darkPage.waitForTimeout(200);

// Scroll to TL;DR
await darkPage.evaluate(() => {
  const tldr = document.querySelector('.tldr');
  if (tldr) tldr.scrollIntoView({ block: 'center' });
});
await darkPage.waitForTimeout(200);
await darkPage.screenshot({ path: '/tmp/blog-jwt-dark-tldr.png' });

await darkPage.evaluate(() => {
  const faq = document.querySelector('.faq-block');
  if (faq) faq.scrollIntoView({ block: 'start' });
});
await darkPage.waitForTimeout(200);
await darkPage.screenshot({ path: '/tmp/blog-jwt-dark-faq.png' });

await darkPage.close();
await browser.close();
console.log('\nDark mode screenshots saved');
