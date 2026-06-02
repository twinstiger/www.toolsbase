#!/usr/bin/env node
const fs = require('fs');

const html = fs.readFileSync('blog/api-design.html', 'utf-8');

// Extract body
let articleMatch = html.match(/<article[^>]*class="blog-article"[^>]*>([\s\S]*?)<\/article>/);
if (!articleMatch) {
  articleMatch = html.match(/<div[^>]*class="blog-article"[^>]*>([\s\S]*?)<\/div>/);
}

if (!articleMatch) {
  console.log('No article found');
  process.exit(1);
}

let content = articleMatch[1];
content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/, '');
content = content.replace(/<div style="margin-top:3rem;[\s\S]*?<\/div>\s*<\/main>/, '');

console.log('Content length:', content.length);
console.log('First 3000 chars:');
console.log(content.substring(0, 3000));
