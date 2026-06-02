// Replace all internal tool hrefs with short aliases (when available) or clean URLs
//   href="tools/dev/base64-encoder.html"  →  href="/base64"
//   href="/tools/dev/css-minifier.html"   →  href="/css"
//   href="/tools/dev/some-tool.html"      →  href="/tools/dev/some-tool"  (no alias)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Build reverse map: long URL → short alias
// Read _redirects (which has short → long)
const lines = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf-8').split('\n');
const longToShort = new Map();
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const parts = trimmed.split(/\s+/);
  if (parts.length < 3) continue;
  const [from, to, code] = parts;
  if (code !== '200') continue; // only short aliases (200 rewrite)
  // Skip wildcards
  if (from.includes(':')) continue;
  // Skip index.html specials (they're 301)
  if (from.endsWith('.html')) continue;
  // Skip the "index → /" type rules
  if (to === '/') continue;
  // from = /short, to = /long
  longToShort.set(to, from);
}

console.log(`Loaded ${longToShort.size} short alias mappings\n`);

// Walk source files
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['dist', 'node_modules', '_drafts', 'src/components'].includes(entry.name)) continue;
      walk(full, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

let totalFiles = 0;
let totalHrefs = 0;
const hrefPattern = /href="((?:\.\.\/|\.\/|\/)?tools\/(dev|network|converters|crypto|image|generators|text|finance)\/([a-z0-9-]+))\.html"/g;

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  let html = fs.readFileSync(file, 'utf-8');
  const orig = html;
  let fileChanges = 0;

  html = html.replace(hrefPattern, (match, _path, category, slug) => {
    const longUrl = `/tools/${category}/${slug}`;
    const shortAlias = longToShort.get(longUrl);
    const newHref = shortAlias || longUrl;
    fileChanges++;
    totalHrefs++;
    return `href="${newHref}"`;
  });

  if (html !== orig) {
    fs.writeFileSync(file, html);
    totalFiles++;
    if (fileChanges > 0) console.log(`  ${rel}: ${fileChanges} hrefs updated`);
  }
}

console.log(`\n${totalHrefs} hrefs updated in ${totalFiles} files`);
