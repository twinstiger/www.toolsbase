#!/usr/bin/env node
// Download real images from picsum.photos and convert to WebP
// Replaces generated gradient SVGs with real photos

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'images', 'blog');

fs.mkdirSync(OUT, { recursive: true });

// Blog posts with their picsum.photos seeds
// Format: { seed: imageID for picsum, width: height: }
const POSTS = [
  { id: 'cron-job-guide',           seed: 'cron' },
  { id: 'yaml-beginners-guide',     seed: 'yaml' },
  { id: 'xml-json-comparison',      seed: 'jsonxml' },
  { id: 'binary-hex-guide',         seed: 'binaryhex' },
  { id: 'markdown-syntax-guide',    seed: 'markdown' },
  { id: 'jwt-authentication',       seed: 'jwt' },
  { id: 'uuid-guide',               seed: 'uuid' },
  { id: 'web-security-headers',      seed: 'security' },
  { id: 'sql-injection-prevention', seed: 'sql' },
  { id: 'regex-common-patterns',     seed: 'regex' },
  { id: 'docker-commands',          seed: 'docker' },
  { id: 'git-commands',             seed: 'git' },
  { id: 'http-status-codes',        seed: 'http' },
  { id: 'sql-basics',               seed: 'database' },
  { id: 'api-design',               seed: 'api' },
  { id: 'css-grid-flexbox',         seed: 'css' },
  { id: 'javascript-es6',           seed: 'javascript' },
  { id: 'command-line',             seed: 'terminal' },
  { id: 'api-authentication',       seed: 'apikey' },
  { id: 'javascript-debugging',     seed: 'debug' },
  { id: 'code-quality',             seed: 'code' },
  { id: 'password-security',        seed: 'password' },
  { id: 'regex-cheatsheet',         seed: 'regex2' },
  { id: 'base64-guide',             seed: 'base64' },
  { id: 'url-encoding-guide',       seed: 'url' },
  { id: 'json-formatter-guide',     seed: 'json' },
  { id: 'rest-api-design',         seed: 'restapi' },
  { id: 'javascript-performance',   seed: 'jsperf' },
  { id: 'http-headers-guide',     seed: 'headers' },
];

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        https.get(res.headers.location, (res2) => {
          const chunks = [];
          res2.on('data', chunk => chunks.push(chunk));
          res2.on('end', () => resolve(Buffer.concat(chunks)));
          res2.on('error', reject);
        }).on('error', reject);
      } else {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }
    }).on('error', reject);
  });
}

async function processPost(post) {
  console.log(`Processing ${post.id}...`);

  try {
    // Download hero image (800x400)
    const heroUrl = `https://picsum.photos/seed/${post.seed}/800/400`;
    const heroBuf = await downloadImage(heroUrl);
    const heroPath = path.join(OUT, `${post.id}.webp`);
    await sharp(heroBuf).resize(800, 400).webp({ quality: 80 }).toFile(heroPath);

    // Download thumbnail (600x280)
    const thumbUrl = `https://picsum.photos/seed/${post.seed}/600/280`;
    const thumbBuf = await downloadImage(thumbUrl);
    const thumbPath = path.join(OUT, `${post.id}-thumb.webp`);
    await sharp(thumbBuf).resize(600, 280).webp({ quality: 80 }).toFile(thumbPath);

    // Remove old SVG
    const svgPath = path.join(OUT, `${post.id}.svg`);
    if (fs.existsSync(svgPath)) {
      fs.unlinkSync(svgPath);
    }

    const heroSize = fs.statSync(heroPath).size;
    const thumbSize = fs.statSync(thumbPath).size;
    console.log(`  ✓ hero: ${(heroSize/1024).toFixed(1)}KB, thumb: ${(thumbSize/1024).toFixed(1)}KB`);

    return { id: post.id, hero: heroSize, thumb: thumbSize };
  } catch (err) {
    console.error(`  ✗ Error: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('Downloading real images from picsum.photos and converting to WebP...\n');

  const results = [];
  for (const post of POSTS) {
    const result = await processPost(post);
    if (result) results.push(result);
    // Small delay to be nice to picsum.photos
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n--- Summary ---');
  let totalHero = 0, totalThumb = 0;
  for (const r of results) {
    totalHero += r.hero;
    totalThumb += r.thumb;
  }
  console.log(`Processed ${results.length} images`);
  console.log(`Total hero: ${(totalHero/1024).toFixed(1)}KB`);
  console.log(`Total thumb: ${(totalThumb/1024).toFixed(1)}KB`);
  console.log(`Total: ${((totalHero+totalThumb)/1024).toFixed(1)}KB`);
}

main();
