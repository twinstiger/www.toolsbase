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

// Check code blocks
let codeBlocks = content.match(/<pre><code[\s\S]*?<\/code><\/pre>/g);
console.log('Code blocks found:', codeBlocks ? codeBlocks.length : 0);

if (codeBlocks && codeBlocks.length > 0) {
  console.log('\nFirst code block:');
  console.log(codeBlocks[0].substring(0, 500));
}
