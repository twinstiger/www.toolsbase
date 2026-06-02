// Local dev server: emulates Cloudflare Pages _redirects behavior
//   200 = rewrite (serve target's content, request URL stays in address bar)
//   301 = permanent redirect (browser follows, address bar updates)
// Auto-resolves .html and /index.html so clean URLs work locally.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = parseInt(process.env.PORT, 10) || 3000;

if (!fs.existsSync(DIST)) {
  console.error(`\n✘ dist/ not found. Run \`npm run build\` first.\n`);
  process.exit(1);
}

// Parse _redirects
const lines = fs.readFileSync(path.join(DIST, '_redirects'), 'utf-8').split('\n');
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
  return new RegExp('^' + escaped.replace(/:([a-z]+)/g, (_, name) => `(?<${name}>[^/]+)`) + '$');
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

// Find file for a URL path (auto-resolve .html, /index.html)
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

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain' };

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const rule = resolve(urlPath);

  if (rule) {
    if (rule.code === 301) {
      console.log(`  301  ${urlPath}  →  ${rule.target}`);
      res.writeHead(301, { Location: rule.target });
      res.end();
      return;
    }
    if (rule.code === 200) {
      const targetFile = findFile(rule.target);
      if (!targetFile) { res.writeHead(404); res.end('Not Found'); return; }
      console.log(`  200  ${urlPath}  ←  ${rule.target}  (rewrite)`);
      res.writeHead(200, { 'Content-Type': MIME[path.extname(targetFile)] || 'application/octet-stream' });
      fs.createReadStream(targetFile).pipe(res);
      return;
    }
  }

  const filePath = findFile(urlPath);
  if (!filePath) { res.writeHead(404); res.end('Not Found: ' + urlPath); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\nDev server (Cloudflare Pages emulation):\n  http://127.0.0.1:${PORT}/\n  http://localhost:${PORT}/\n`);
  console.log(`  dist/  ${DIST}\n  _redirects: ${rules.length} rules\n`);
});
