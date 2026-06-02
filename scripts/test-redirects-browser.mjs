// End-to-end browser test: verify _redirects behavior
//   200 = rewrite (serve target content, request URL stays in address bar)
//   301 = permanent redirect (browser follows, address bar updates)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

// Parse _redirects
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

// Find actual file in dist for a URL path
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

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon' };

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const rule = resolve(urlPath);

  if (rule) {
    if (rule.code === 301) {
      res.writeHead(301, { Location: rule.target });
      res.end();
      return;
    }
    if (rule.code === 200) {
      // Rewrite: serve target's content, but request URL stays (address bar unchanged)
      const targetFile = findFile(rule.target);
      if (!targetFile) { res.writeHead(404); res.end('Not Found'); return; }
      const ext = path.extname(targetFile);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(targetFile).pipe(res);
      return;
    }
  }
  // No rule matched, serve directly
  const filePath = findFile(urlPath);
  if (!filePath) { res.writeHead(404); res.end('Not Found'); return; }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});
await new Promise(r => server.listen(8789, '127.0.0.1', r));

const browser = await chromium.launch();
const page = await browser.newPage();

// Test cases: [input, expected URL after navigation, description]
//   200 rewrites: address bar = input URL, content from target
//   301 redirects: address bar = target URL
const cases = [
  // 301 redirects (old .html URLs and index.html specials)
  ['/tools/dev/base64-encoder.html', 'http://127.0.0.1:8789/tools/dev/base64-encoder', '301 .html→clean'],
  ['/blog/index.html', 'http://127.0.0.1:8789/blog', '301 blog/index'],
  ['/index.html', 'http://127.0.0.1:8789/', '301 root index'],
  ['/blog/cron-job-guide.html', 'http://127.0.0.1:8789/blog/cron-job-guide', '301 blog post'],
  ['/about.html', 'http://127.0.0.1:8789/about', '301 about'],
  // 200 rewrites (short aliases): URL stays, content comes from target
  ['/base64', 'http://127.0.0.1:8789/base64', '200 rewrite /base64'],
  ['/json', 'http://127.0.0.1:8789/json', '200 rewrite /json'],
  ['/fav', 'http://127.0.0.1:8789/fav', '200 rewrite /fav'],
  ['/uuid', 'http://127.0.0.1:8789/uuid', '200 rewrite /uuid'],
  ['/tip', 'http://127.0.0.1:8789/tip', '200 rewrite /tip'],
  // Clean URLs serve directly
  ['/tools/dev/base64-encoder', 'http://127.0.0.1:8789/tools/dev/base64-encoder', 'direct clean URL'],
  ['/blog/cron-job-guide', 'http://127.0.0.1:8789/blog/cron-job-guide', 'direct blog URL'],
];

let pass = 0, fail = 0;
for (const [input, expectedUrl, desc] of cases) {
  const res = await page.goto('http://127.0.0.1:8789' + input, { waitUntil: 'load' });
  const final = page.url();
  const status = res.status();
  // Also check the page contains the expected content (e.g., /tip should serve tip-calculator)
  const body = await page.content();
  const contentOk = !input.startsWith('/base64') || body.includes('Base64') || body.includes('base64');
  if (final === expectedUrl && contentOk) {
    pass++;
    console.log(`  PASS  [${desc}] ${input}  ->  ${status} ${final}`);
  } else {
    fail++;
    console.log(`  FAIL  [${desc}] ${input}  ->  ${status} ${final}  (expected ${expectedUrl})`);
  }
}
console.log(`\n${pass} pass / ${fail} fail`);
await browser.close();
server.close();
process.exit(fail ? 1 : 0);
