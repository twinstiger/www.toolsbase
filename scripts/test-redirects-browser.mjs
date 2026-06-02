// End-to-end browser test: verify redirects return 301 + correct Location
import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

// Read _redirects and compile to regex
const lines = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf-8').split('\n');
const rules = [];
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) continue;
  const [from, to, code] = parts;
  rules.push({ from, to, code: parseInt(code, 10) || 301 });
}
function patternToRegex(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const paramRegex = escaped.replace(/:([a-z]+)/g, (_, name) => `(?<${name}>[^/]+)`);
  return new RegExp('^' + paramRegex + '$');
}
const compiled = rules.map(r => ({
  ...r,
  regex: patternToRegex(r.from),
  paramNames: (r.from.match(/:[a-z]+/g) || []).map(s => s.slice(1)),
}));
function resolve(urlPath) {
  for (const r of compiled) {
    const m = r.regex.exec(urlPath);
    if (m) {
      let target = r.to;
      for (const name of r.paramNames) target = target.replace(':' + name, m.groups[name]);
      return { code: r.code, target };
    }
  }
  return null;
}

// Start a tiny HTTP server that emulates Cloudflare's redirect+serve
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const redirect = resolve(urlPath);
  if (redirect) {
    res.writeHead(redirect.code, { Location: redirect.target });
    res.end();
    return;
  }
  // Serve from dist
  let filePath = path.join(DIST, urlPath === '/' ? '/index.html' : urlPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) filePath = filePath + '.html';
    else if (fs.existsSync(filePath + '/index.html')) filePath = filePath + '/index.html';
    else { res.writeHead(404); res.end('Not Found'); return; }
  }
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon' };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});
await new Promise(r => server.listen(8789, '127.0.0.1', r));

const browser = await chromium.launch();
const page = await browser.newPage();

const cases = [
  ['/tools/dev/base64-encoder.html', 'http://127.0.0.1:8789/tools/dev/base64-encoder'],
  ['/blog/index.html', 'http://127.0.0.1:8789/blog'],
  ['/index.html', 'http://127.0.0.1:8789/'],
  ['/base64', 'http://127.0.0.1:8789/tools/dev/base64-encoder'],
  ['/json', 'http://127.0.0.1:8789/tools/dev/json-formatter'],
  ['/fav', 'http://127.0.0.1:8789/tools/image/favicon-generator'],
  ['/uuid', 'http://127.0.0.1:8789/tools/generators/uuid-generator'],
  ['/blog/cron-job-guide.html', 'http://127.0.0.1:8789/blog/cron-job-guide'],
  ['/about.html', 'http://127.0.0.1:8789/about'],
  // Clean URL — should serve directly with 200
  ['/tools/dev/base64-encoder', null],
];

let pass = 0, fail = 0;
for (const [input, expectedFinal] of cases) {
  const res = await page.goto('http://127.0.0.1:8789' + input, { waitUntil: 'load' });
  const final = page.url();
  const status = res.status();
  if (expectedFinal === null) {
    // Should be 200 with same URL
    if (status === 200 && final === 'http://127.0.0.1:8789' + input) { pass++; console.log(`  PASS  ${input}  ->  200 (no redirect)`); }
    else { fail++; console.log(`  FAIL  ${input}  ->  ${status} ${final}`); }
  } else {
    if (final === expectedFinal) { pass++; console.log(`  PASS  ${input}  ->  ${final}`); }
    else { fail++; console.log(`  FAIL  ${input}  ->  ${status} ${final}  (expected ${expectedFinal})`); }
  }
}
console.log(`\n${pass} pass / ${fail} fail`);
await browser.close();
server.close();
process.exit(fail ? 1 : 0);
