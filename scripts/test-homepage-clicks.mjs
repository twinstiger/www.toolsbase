// Verify that clicking tool cards on the homepage navigates to the short URL
// (so the address bar shows the short URL, not the long canonical URL)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon' };
function findFile(urlPath) {
  let filePath = path.join(DIST, urlPath === '/' ? '/index.html' : urlPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) filePath = filePath + '.html';
    else if (fs.existsSync(filePath + '/index.html')) filePath = filePath + '/index.html';
    else return null;
  }
  return filePath;
}
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const filePath = findFile(urlPath);
  if (!filePath) { res.writeHead(404); res.end('Not Found'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});
await new Promise(r => server.listen(8790, '127.0.0.1', r));

const browser = await chromium.launch();
const page = await browser.newPage();

// Load homepage
await page.goto('http://127.0.0.1:8790/', { waitUntil: 'load' });

// Find the first "Tip Calculator" link and click it
const tipLink = page.locator('a[href="/tip"]').first();
const exists = await tipLink.count();
if (exists === 0) {
  console.log('FAIL: no link with href="/tip" found on homepage');
  process.exit(1);
}

// Click it
await tipLink.click();
await page.waitForLoadState('load');

const finalUrl = page.url();
console.log(`Clicked /tip link -> final URL: ${finalUrl}`);
if (finalUrl === 'http://127.0.0.1:8790/tip') {
  console.log('PASS: short URL stays in address bar');
  process.exitCode = 0;
} else {
  console.log(`FAIL: expected http://127.0.0.1:8790/tip, got ${finalUrl}`);
  process.exitCode = 1;
}

await browser.close();
server.close();
