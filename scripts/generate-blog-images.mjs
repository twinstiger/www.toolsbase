#!/usr/bin/env node
// Generate branded SVG + WebP illustrations for blog posts
// Replaces picsum.photos placeholders for LCP optimization
//
// Output:
//   - {id}.svg          (primary, 1.2KB, vector)
//   - {id}.webp         (800x400 hero fallback, ~10-15KB)
//   - {id}-thumb.webp   (600x280 thumbnail, ~5-8KB)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'images', 'blog');

fs.mkdirSync(OUT, { recursive: true });

// Brand color palette (matches tokens.css)
const C = {
  primary: '#0ea5e9', accent: '#8b5cf6', warm: '#f97316',
  cool: '#06b6d4', hot: '#ec4899', green: '#10b981',
  red: '#ef4444', yellow: '#eab308', dark: '#0f172a',
  light: '#f8fafc', muted: '#64748b',
};

function xmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function svgFor({ label, icon, gradient }) {
  const [c1, c2, c3] = gradient;
  const safeLabel = xmlEscape(label);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="50%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="400" fill="url(#g)"/>
  <circle cx="700" cy="80" r="180" fill="url(#glow)"/>
  <circle cx="120" cy="340" r="140" fill="url(#glow)" opacity="0.6"/>
  <g transform="translate(400 200)" fill="#fff" opacity="0.95">${icon}</g>
  <text x="400" y="340" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Inter,sans-serif" font-size="32" font-weight="700" fill="#fff" letter-spacing="-0.5">${safeLabel}</text>
  <text x="400" y="372" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Inter,sans-serif" font-size="14" font-weight="500" fill="#fff" opacity="0.7" letter-spacing="2">TOOLSBASE</text>
</svg>`;
}

// Icon library (Lucide-inspired)
const ICONS = {
  clock:   '<circle cx="0" cy="0" r="48" fill="none" stroke="#fff" stroke-width="6"/><path d="M0 -28 L0 0 L20 14" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
  code:    '<path d="M-44 -16 L-72 0 L-44 16 M44 -16 L72 0 L44 16 M-20 24 L20 -40" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>',
  shield:  '<path d="M0 -56 L48 -32 L48 12 Q48 48 0 60 Q-48 48 -48 12 L-48 -32 Z M-20 0 L-6 14 L24 -18" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>',
  key:     '<circle cx="-28" cy="0" r="20" fill="none" stroke="#fff" stroke-width="6"/><path d="M-8 0 L52 0 L52 16 M28 0 L28 12" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
  database:'<ellipse cx="0" cy="-40" rx="44" ry="14" fill="none" stroke="#fff" stroke-width="6"/><path d="M-44 -40 L-44 40 Q0 54 44 40 L44 -40 M-44 0 Q0 14 44 0" fill="none" stroke="#fff" stroke-width="6"/>',
  globe:   '<circle cx="0" cy="0" r="48" fill="none" stroke="#fff" stroke-width="6"/><ellipse cx="0" cy="0" rx="20" ry="48" fill="none" stroke="#fff" stroke-width="6"/><path d="M-48 0 L48 0 M-42 -24 Q0 -8 42 -24 M-42 24 Q0 8 42 24" fill="none" stroke="#fff" stroke-width="6"/>',
  book:    '<path d="M-48 -40 L-8 -32 L-8 44 L-48 36 Z M48 -40 L8 -32 L8 44 L48 36 Z M-8 -32 L8 -32" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>',
  lock:    '<rect x="-32" y="-8" width="64" height="48" rx="6" fill="none" stroke="#fff" stroke-width="6"/><path d="M-20 -8 L-20 -28 Q-20 -48 0 -48 Q20 -48 20 -28 L20 -8" fill="none" stroke="#fff" stroke-width="6"/><circle cx="0" cy="16" r="6" fill="#fff"/>',
  bolt:    '<path d="M-8 -48 L-28 8 L-4 8 L-12 48 L28 -8 L4 -8 L12 -48 Z" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>',
  hash:    '<path d="M-24 -48 L-32 48 M8 -48 L0 48 M-44 -16 L36 -16 M-40 16 L40 16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
  brackets:'<path d="M-16 -32 L-44 0 L-16 32 M16 -32 L44 0 L16 32" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>',
  terminal:'<rect x="-52" y="-36" width="104" height="72" rx="6" fill="none" stroke="#fff" stroke-width="6"/><path d="M-36 -12 L-20 0 L-36 12 M-8 16 L20 16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  list:    '<circle cx="-32" cy="-24" r="5" fill="#fff"/><circle cx="-32" cy="0" r="5" fill="#fff"/><circle cx="-32" cy="24" r="5" fill="#fff"/><path d="M-12 -24 L40 -24 M-12 0 L40 0 M-12 24 L40 24" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
  link:    '<path d="M-20 -8 L-32 4 Q-44 16 -32 28 L-20 40 M20 8 L32 -4 Q44 -16 32 -28 L20 -40 M-4 -20 L4 20" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  cube:    '<path d="M-40 -24 L0 -44 L40 -24 L40 24 L0 44 L-40 24 Z M-40 -24 L0 -4 L40 -24 M0 -4 L0 44" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>',
  cog:     '<circle cx="0" cy="0" r="20" fill="none" stroke="#fff" stroke-width="5"/><path d="M0 -50 L0 -36 M0 50 L0 36 M-50 0 L-36 0 M50 0 L36 0 M-36 -36 L-26 -26 M36 36 L26 26 M-36 36 L-26 26 M36 -36 L26 -26" stroke="#fff" stroke-width="8" stroke-linecap="round"/>',
  bug:     '<rect x="-22" y="-16" width="44" height="44" rx="22" fill="none" stroke="#fff" stroke-width="5"/><path d="M-22 -8 L-42 -16 M22 -8 L42 -16 M-22 0 L-44 0 M22 0 L44 0 M-22 12 L-42 24 M22 12 L42 24 M0 -16 L0 -36 M-12 -36 L12 -36" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
  binary:  '<text x="-32" y="14" font-family="ui-monospace,monospace" font-size="44" font-weight="800" fill="#fff">01</text><text x="0" y="14" font-family="ui-monospace,monospace" font-size="44" font-weight="800" fill="#fff" opacity="0.5">10</text>',
  json:    '<text x="0" y="16" text-anchor="middle" font-family="ui-monospace,monospace" font-size="36" font-weight="800" fill="#fff">{}</text>',
  password:'<rect x="-36" y="-12" width="72" height="40" rx="6" fill="none" stroke="#fff" stroke-width="5"/><circle cx="-18" cy="8" r="4" fill="#fff"/><circle cx="0" cy="8" r="4" fill="#fff"/><circle cx="18" cy="8" r="4" fill="#fff"/><path d="M-20 -12 L-20 -28 Q-20 -36 -12 -36 L-4 -36" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
  branches:'<circle cx="-28" cy="-20" r="6" fill="#fff"/><circle cx="28" cy="-20" r="6" fill="#fff"/><circle cx="0" cy="24" r="6" fill="#fff"/><path d="M-28 -14 Q-28 24 0 18 M28 -14 Q28 24 0 18" fill="none" stroke="#fff" stroke-width="5"/>',
};

const POSTS = {
  'cron-job-guide':           { label: 'Cron Jobs',        icon: 'clock',    gradient: [C.primary, C.accent,  C.cool]   },
  'yaml-beginners-guide':     { label: 'YAML',            icon: 'list',     gradient: [C.cool,    C.primary, C.accent] },
  'xml-json-comparison':      { label: 'XML vs JSON',     icon: 'brackets', gradient: [C.accent,  C.hot,    C.primary] },
  'binary-hex-guide':         { label: 'Binary & Hex',    icon: 'binary',   gradient: [C.warm,    C.red,    C.accent] },
  'markdown-syntax-guide':    { label: 'Markdown',        icon: 'book',     gradient: [C.primary, C.cool,   C.green]  },
  'jwt-authentication':       { label: 'JWT',             icon: 'lock',     gradient: [C.hot,     C.accent, C.primary] },
  'uuid-guide':               { label: 'UUID',            icon: 'hash',     gradient: [C.green,   C.cool,   C.primary] },
  'web-security-headers':     { label: 'Security Headers',icon: 'shield',   gradient: [C.red,     C.warm,   C.accent] },
  'sql-injection-prevention': { label: 'SQL Injection',   icon: 'database', gradient: [C.red,     C.accent, C.hot]    },
  'regex-common-patterns':    { label: 'Regex',           icon: 'code',     gradient: [C.accent,  C.primary,C.cool]   },
  'docker-commands':          { label: 'Docker',          icon: 'cube',     gradient: [C.primary, C.cool,   C.green]  },
  'git-commands':             { label: 'Git',             icon: 'branches', gradient: [C.warm,    C.red,    C.accent] },
  'http-status-codes':        { label: 'HTTP Status',     icon: 'globe',    gradient: [C.green,   C.cool,   C.primary] },
  'sql-basics':               { label: 'SQL Basics',      icon: 'database', gradient: [C.primary, C.accent, C.cool]   },
  'api-design':               { label: 'API Design',      icon: 'cog',      gradient: [C.hot,     C.accent, C.primary] },
  'css-grid-flexbox':         { label: 'CSS Grid & Flex', icon: 'list',     gradient: [C.cool,    C.primary,C.accent] },
  'javascript-es6':           { label: 'JavaScript ES6',  icon: 'brackets', gradient: [C.yellow,  C.warm,   C.accent] },
  'command-line':             { label: 'Command Line',    icon: 'terminal', gradient: [C.muted,   C.dark,   C.primary] },
  'api-authentication':       { label: 'API Auth',        icon: 'key',      gradient: [C.accent,  C.hot,    C.red]    },
  'javascript-debugging':     { label: 'JS Debugging',    icon: 'bug',      gradient: [C.red,     C.warm,   C.accent] },
  'code-quality':             { label: 'Code Quality',    icon: 'cog',      gradient: [C.green,   C.cool,   C.primary] },
  'password-security':        { label: 'Passwords',       icon: 'password', gradient: [C.red,     C.accent, C.hot]    },
  'regex-cheatsheet':         { label: 'Regex Cheatsheet',icon: 'code',     gradient: [C.accent,  C.primary,C.cool]   },
  'base64-guide':             { label: 'Base64',          icon: 'binary',   gradient: [C.cool,    C.green,  C.primary] },
  'url-encoding-guide':       { label: 'URL Encoding',    icon: 'link',     gradient: [C.primary, C.accent, C.cool]   },
  'json-formatter-guide':     { label: 'JSON Formatter',  icon: 'json',     gradient: [C.yellow,  C.warm,   C.accent] },
  'rest-api-design':          { label: 'REST API',        icon: 'globe',    gradient: [C.hot,     C.accent, C.primary] },
  'javascript-performance':   { label: 'JS Performance',  icon: 'bolt',     gradient: [C.warm,    C.red,    C.accent] },
};

// Generate
const results = [];
for (const [id, def] of Object.entries(POSTS)) {
  const svg = svgFor({ ...def });
  const svgPath = path.join(OUT, `${id}.svg`);
  fs.writeFileSync(svgPath, svg);
  const svgBuf = Buffer.from(svg);

  // WebP hero (800x400) - max-width display size
  const heroPath = path.join(OUT, `${id}.webp`);
  await sharp(svgBuf).resize(800, 400).webp({ quality: 82, effort: 4 }).toFile(heroPath);

  // WebP thumb (600x280) - card thumbnail
  const thumbPath = path.join(OUT, `${id}-thumb.webp`);
  await sharp(svgBuf).resize(600, 280).webp({ quality: 80, effort: 4 }).toFile(thumbPath);

  results.push({
    id,
    svg: fs.statSync(svgPath).size,
    hero: fs.statSync(heroPath).size,
    thumb: fs.statSync(thumbPath).size,
  });
}

// Report
console.log('Generated blog images:');
console.log('-'.repeat(60));
let totalSvg = 0, totalHero = 0, totalThumb = 0;
for (const r of results) {
  totalSvg += r.svg;
  totalHero += r.hero;
  totalThumb += r.thumb;
  console.log(`  ${r.id.padEnd(28)} ${String(r.svg).padStart(4)}B  hero ${(r.hero/1024).toFixed(1).padStart(5)}KB  thumb ${(r.thumb/1024).toFixed(1).padStart(5)}KB`);
}
console.log('-'.repeat(60));
console.log(`  ${'TOTAL'.padEnd(28)} ${(totalSvg/1024).toFixed(1).padStart(5)}KB ${(totalHero/1024).toFixed(1).padStart(7)}KB  ${(totalThumb/1024).toFixed(1).padStart(7)}KB`);
console.log(`  ${'Combined'.padEnd(28)} ${((totalSvg+totalHero+totalThumb)/1024).toFixed(1)}KB for ${results.length} posts`);
