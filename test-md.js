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

// HTML to Markdown (simplified version from sync-devto.mjs)
function htmlToMarkdown(html) {
  let md = html;

  md = md.replace(/<script[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[\s\S]*?<\/style>/gi, '');
  md = md.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  md = md.replace(/<footer[\s\S]*?<\/footer>/gi, '');

  // Code blocks
  md = md.replace(/<pre><code(?: class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
    code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    return `\n\`\`\`${lang || ''}\n${code.trim()}\n\`\`\`\n`;
  });

  // Headers
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `# ${t.trim()}\n\n`);
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `## ${t.trim()}\n\n`);
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `### ${t.trim()}\n\n`);

  // Bold and italic
  md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em>([\s\S]*?)<\/em>/gi, '_$1_');
  md = md.replace(/<i>([\s\S]*?)<\/i>/gi, '_$1_');

  // Inline code
  md = md.replace(/<code>([\s\S]*?)<\/code>/g, '`$1`');

  // Links
  md = md.replace(/<a href="([^"]+)">([\s\S]*?)<\/a>/g, '[$2]($1)');

  // Images
  md = md.replace(/<img src="([^"]+)"(?:\s+alt="([^"]*)")?(?:\s+title="([^"]*)")?[^>]*>/g, '![$2]($1)');

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, items) => {
    let result = items.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
    return result + '\n';
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, items) => {
    let result = items.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '1. $1\n');
    return result + '\n';
  });

  // Paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/gi, '---\n');

  // HTML entities
  md = md.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  md = md.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Clean up
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.replace(/^[\s\n]+/g, '');
  md = md.replace(/[\s\n]+$/g, '');
  md = md.trim();

  return md;
}

const md = htmlToMarkdown(content);
console.log('Markdown length:', md.length);
console.log('First 3000 chars:');
console.log(md.substring(0, 3000));
