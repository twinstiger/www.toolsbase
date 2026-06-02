#!/usr/bin/env node
const fs = require('fs');

const html = fs.readFileSync('blog/api-design.html', 'utf-8');

// Extract body
let articleMatch = html.match(/<article[^>]*class="blog-article"[^>]*>([\s\S]*?)<\/article>/);
if (!articleMatch) {
  articleMatch = html.match(/<div[^>]*class="blog-article"[^>]*>([\s\S]*?)<\/div>/);
}

let content = articleMatch[1];
content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/, '');
content = content.replace(/<div style="margin-top:3rem;[\s\S]*?<\/div>\s*<\/main>/, '');

// Check for the code block pattern
let idx = content.indexOf('<pre><code>');
console.log('First code block position:', idx);
console.log('Content around it:');
console.log(content.substring(idx, idx + 500));
