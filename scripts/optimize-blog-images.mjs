#!/usr/bin/env node
// Replace picsum.photos images in blog HTML files with optimized local images.
// Adds srcset (WebP hero/thumb), loading="lazy", fetchpriority="high", and SVG source.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');

// Map picsum seed -> local image id
// From the HTML files I saw, every blog post uses its slug as the seed
// (e.g. /seed/sql/ -> sql-injection-prevention.html)
const SEED_TO_ID = {
  'sql': 'sql-injection-prevention',
  'cron': 'cron-job-guide',
  'restapi': 'rest-api-design',
  'jsperf': 'javascript-performance',
  'yaml': 'yaml-beginners-guide',
  'jsonxml': 'xml-json-comparison',
  'binaryhex': 'binary-hex-guide',
  'markdown': 'markdown-syntax-guide',
  'jwt': 'jwt-authentication',
  'uuid': 'uuid-guide',
  'security': 'web-security-headers',
  'regex': 'regex-common-patterns',
  'docker': 'docker-commands',
  'git': 'git-commands',
  'http': 'http-status-codes',
  'api': 'api-design',
  'css': 'css-grid-flexbox',
  'javascript': 'javascript-es6',
  'terminal': 'command-line',
  'auth': 'api-authentication',
  'debug': 'javascript-debugging',
  'codequality': 'code-quality',
  'password': 'password-security',
  'base64': 'base64-guide',
  'urlencoding': 'url-encoding-guide',
  'json': 'json-formatter-guide',
};

// Build the new <picture> tag for a given image id + alt + isLCP flag
function pictureTag(id, alt, isLCP, isThumb) {
  // blog/index.html cards use the smaller 600x280 thumb
  // blog/*.html pages use the larger 800x400 hero
  const webp = isThumb ? `${id}-thumb.webp` : `${id}.webp`;
  const w = isThumb ? 600 : 800;
  const h = isThumb ? 280 : 400;
  const altEsc = alt.replace(/"/g, '&quot;');
  const fetchpriority = isLCP ? ' fetchpriority="high"' : '';
  const loading = isLCP ? 'eager' : 'lazy';
  // Picture element: WebP primary, SVG fallback (vector, scales perfectly)
  return `<picture>
  <source type="image/webp" srcset="/images/blog/${webp}" sizes="${isThumb ? '(max-width: 600px) 100vw, 600px' : '(max-width: 800px) 100vw, 800px'}">
  <img src="/images/blog/${id}.svg" alt="${altEsc}" width="${w}" height="${h}" loading="${loading}" decoding="async"${fetchpriority}>
</picture>`;
}

let totalReplacements = 0;
let filesModified = 0;

// Process blog/index.html: thumbnail cards
const indexPath = path.join(BLOG, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf-8');
  let count = 0;
  html = html.replace(
    /<img src="https:\/\/picsum\.photos\/seed\/([^/]+)\/600\/280" alt="([^"]*)"[^>]*>/g,
    (m, seed, alt) => {
      const id = SEED_TO_ID[seed];
      if (!id) return m; // unknown seed, leave as-is
      count++;
      // First 2 cards on index are above the fold -> LCP candidates
      const isLCP = count <= 2;
      return pictureTag(id, alt, isLCP, true);
    }
  );
  if (count > 0) {
    fs.writeFileSync(indexPath, html);
    console.log(`blog/index.html: ${count} images replaced`);
    totalReplacements += count;
    filesModified++;
  }
}

// Process individual blog post HTML files
const files = fs.readdirSync(BLOG).filter(f => f.endsWith('.html') && f !== 'index.html');
for (const file of files) {
  const filePath = path.join(BLOG, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  let count = 0;

  // Match the cover image pattern: picsum.photos/seed/{seed}/800/400
  html = html.replace(
    /<img src="https:\/\/picsum\.photos\/seed\/([^/]+)\/800\/400" alt="([^"]*)" style="width:100%;height:100%;object-fit:cover;">/g,
    (m, seed, alt) => {
      const id = SEED_TO_ID[seed];
      if (!id) return m;
      count++;
      // Cover image is always the LCP element on a blog post
      return pictureTag(id, alt, true, false);
    }
  );

  if (count > 0) {
    fs.writeFileSync(filePath, html);
    console.log(`blog/${file}: ${count} image replaced`);
    totalReplacements += count;
    filesModified++;
  }
}

console.log(`\nTotal: ${totalReplacements} images across ${filesModified} files`);
