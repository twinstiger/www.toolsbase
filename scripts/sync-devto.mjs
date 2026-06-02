#!/usr/bin/env node
// Sync blog posts to Dev.to
// Usage: node scripts/sync-devto.mjs [blog-slug]
//   - No args: sync all posts
//   - With slug: sync specific post

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');

// Dev.to API
const API_KEY = process.env.DEVTO_API_KEY;
if (!API_KEY) {
  console.error('❌ DEVTO_API_KEY environment variable is required');
  console.error('   Run: export DEVTO_API_KEY=your_key');
  process.exit(1);
}
const API_URL = 'https://dev.to/api';

// Check API key
async function verifyApiKey() {
  const res = await fetch(API_URL + '/users/me', {
    headers: { 'api-key': API_KEY }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`API key invalid: ${JSON.stringify(err)}`);
  }
  return res.json();
}

// Turndown for HTML → Markdown
function htmlToMarkdown(html) {
  // Simple regex-based converter for code blocks, headers, lists
  let md = html
    // Code blocks
    .replace(/<pre><code(?: class="language-(\w+)")?>/g, '```$1\n')
    .replace(/<\/code><\/pre>/g, '\n```\n')
    // Inline code
    .replace(/<code>([^<]+)<\/code>/g, '`$1`')
    // Headers
    .replace(/<h1>([^<]+)<\/h1>/g, '# $1\n\n')
    .replace(/<h2>([^<]+)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>([^<]+)<\/h3>/g, '### $1\n\n')
    // Bold/italic
    .replace(/<strong>([^<]+)<\/strong>/g, '**$1**')
    .replace(/<em>([^<]+)<\/em>/g, '_$1_')
    // Links
    .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '[$2]($1)')
    // Lists
    .replace(/<li>([^<]+)<\/li>/g, '- $1\n')
    // Paragraphs
    .replace(/<p>([^<]+)<\/p>/g, '$1\n\n')
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Clean up
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return md;
}

// Extract frontmatter from blog HTML
function extractMeta(html, slug) {
  const title = (html.match(/<h1>([^<]+)<\/h1>/) || [])[1] || slug;
  const description = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
  const date = (html.match(/<span>📅 ([A-Za-z]+ \d+, \d{4})<\/span>/) || [])[1] || '';
  const section = (html.match(/<span>([^<]+)<\/span>\s*<\/div>\s*<\/header>/) || [])[1] || '';

  // Tags based on section
  const sectionTags = {
    'Backend': ['backend', 'webdev'],
    'Frontend': ['frontend', 'webdev'],
    'DevOps': ['devops', 'docker'],
    'Security': ['security', 'webdev'],
    'JavaScript': ['javascript', 'webdev'],
    'Database': ['database', 'webdev'],
  };
  const tags = sectionTags[section] || ['webdev', 'programming'];

  return { title, description, date, section, tags };
}

// Extract article body (main content)
function extractBody(html) {
  // Get content between <article> tags, excluding header
  const articleMatch = html.match(/<article class="blog-article">([\s\S]*?)<div style="margin-top:3rem;padding-top:2rem;border-top:/);
  if (!articleMatch) return '';
  return articleMatch[1];
}

// Publish single article
async function publishArticle(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.html`);
  if (!fs.existsSync(filePath)) {
    console.log(`  ✗ File not found: ${slug}.html`);
    return null;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const meta = extractMeta(html, slug);
  const body = extractBody(html);
  const markdown = htmlToMarkdown(body);

  // Check if already published (look for dev.to URL in source)
  const existingUrl = html.match(/dev\.to\/([^"'>\s]+)/);
  if (existingUrl) {
    console.log(`  ↩ Already published: https://dev.to/${existingUrl[1]}`);
    return existingUrl[1];
  }

  console.log(`  Publishing: ${meta.title}`);

  const res = await fetch(API_URL + '/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY
    },
    body: JSON.stringify({
      article: {
        title: meta.title,
        body_markdown: markdown,
        tags: meta.tags,
        canonical_url: `https://toolsbase.net/blog/${slug}.html`,
        description: meta.description,
        published: true,
        series: meta.section || null
      }
    })
  });

  if (!res.ok) {
    const err = await res.json();
    console.log(`  ✗ Error: ${JSON.stringify(err)}`);
    return null;
  }

  const article = await res.json();
  console.log(`  ✓ Published: https://dev.to/${article.user.username}/${article.slug}`);
  return article.id;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const targetSlug = args[0];

  console.log('🔄 Syncing to Dev.to...\n');

  // Verify API key
  try {
    const user = await verifyApiKey();
    console.log(`Logged in as: ${user.name} (@${user.username})\n`);
  } catch (err) {
    console.error('❌ API key verification failed:', err.message);
    process.exit(1);
  }

  if (targetSlug) {
    // Sync single post
    await publishArticle(targetSlug);
  } else {
    // Sync all blog posts
    const files = fs.readdirSync(BLOG_DIR)
      .filter(f => f.endsWith('.html') && f !== 'index.html');

    console.log(`Found ${files.length} posts\n`);

    for (const file of files) {
      const slug = file.replace('.html', '');
      await publishArticle(slug);
      // Rate limit: 10 req/min, wait 6s between posts
      await new Promise(r => setTimeout(r, 6000));
    }
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
