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

// Verify API key
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

// Delete all user's articles (for re-publishing)
async function deleteAllArticles() {
  const user = await verifyApiKey();
  console.log(`Fetching articles for @${user.username}...`);

  // Get all articles
  const res = await fetch(`${API_URL}/articles?per_page=100&username=${user.username}`, {
    headers: { 'api-key': API_KEY }
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('Failed to fetch articles:', JSON.stringify(err));
    return;
  }

  const articles = await res.json();
  console.log(`Found ${articles.length} articles\n`);
  console.log('First article sample:', JSON.stringify(articles[0], null, 2).substring(0, 300));

  for (const article of articles) {
    console.log(`Deleting: ${article.title} (ID: ${article.id})`);
    const deleteRes = await fetch(`${API_URL}/articles/${article.id}`, {
      method: 'DELETE',
      headers: { 'api-key': API_KEY }
    });

    console.log(`  Status: ${deleteRes.status}`);
    if (deleteRes.status !== 204) {
      const err = await deleteRes.text();
      console.log(`  Error: ${err}`);
    } else {
      console.log(`  ✓ Deleted`);
    }

    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n✅ All articles deleted!');
}

// Turndown for HTML → Markdown
function htmlToMarkdown(html) {
  let md = html;

  // Remove scripts, styles, nav, footer
  md = md.replace(/<script[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[\s\S]*?<\/style>/gi, '');
  md = md.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  md = md.replace(/<footer[\s\S]*?<\/footer>/gi, '');

  // Code blocks (must be before inline code)
  md = md.replace(/<pre><code(?: class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
    code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    return `\n\`\`\`${lang || ''}\n${code.trim()}\n\`\`\`\n`;
  });

  // Headers
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `# ${t.trim()}\n\n`);
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `## ${t.trim()}\n\n`);
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `### ${t.trim()}\n\n`);
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `#### ${t.trim()}\n\n`);

  // Bold and italic
  md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em>([\s\S]*?)<\/em>/gi, '_$1_');
  md = md.replace(/<i>([\s\S]*?)<\/i>/gi, '_$1_');

  // Inline code (after code blocks)
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

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.replace(/^[\s\n]+/g, '');
  md = md.replace(/[\s\n]+$/g, '');
  md = md.trim();

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
  // Try article tag first, then div
  let articleMatch = html.match(/<article[^>]*class="blog-article"[^>]*>([\s\S]*?)<\/article>/);

  if (!articleMatch) {
    articleMatch = html.match(/<div[^>]*class="blog-article"[^>]*>([\s\S]*?)<\/div>/);
  }

  if (!articleMatch) {
    console.log('  No blog-article tag found');
    return '';
  }

  let content = articleMatch[1];

  // Remove header section (h1 + meta)
  content = content.replace(/<header class="blog-article-header">[\s\S]*?<\/header>/, '');
  content = content.replace(/<div class="blog-article-header">[\s\S]*?<\/div>/, '');

  // Remove back to blog div
  content = content.replace(/<div style="margin-top:3rem;[\s\S]*?<\/div>\s*<\/main>/, '');

  return content.trim();
}

// Wait between requests (Dev.to rate limit: 10/min, so 6s is safe)
const WAIT_MS = 6000;

// Publish single article
async function publishArticle(slug, retries = 3) {
  const filePath = path.join(BLOG_DIR, `${slug}.html`);
  if (!fs.existsSync(filePath)) {
    console.log(`  ✗ File not found: ${slug}.html`);
    return null;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const meta = extractMeta(html, slug);
  const body = extractBody(html);
  const markdown = htmlToMarkdown(body);

  // Debug: show first 500 chars of markdown
  console.log(`  Body HTML length: ${body.length}`);
  console.log(`  Markdown preview:\n${markdown.substring(0, 500)}...`);

  // Force re-publish (remove canonical check for testing)
  // const existingUrl = html.match(/dev\.to\/([^"'>\s]+)/);
  // if (existingUrl) {
  //   console.log(`  ↩ Already published: https://dev.to/${existingUrl[1]}`);
  //   return existingUrl[1];
  // }

  console.log(`  Publishing: ${meta.title}`);
  console.log(`  Body HTML length: ${body.length}`);
  if (body.length > 0) {
    console.log(`  Markdown preview:\n${markdown.substring(0, 800)}...`);
  } else {
    console.log(`  ❌ Body is empty, skipping...`);
    return null;
  }

  let res;
  try {
    res = await fetch(API_URL + '/articles', {
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
      }),
      signal: AbortSignal.timeout(30000) // 30s timeout
    });
  } catch (err) {
    if (err.name === 'TimeoutError' || err.code === 'UND_ERR_CONNECT_TIMEOUT') {
      if (retries > 0) {
        console.log(`  ⏳ Connection timeout, retrying... (${retries} left)`);
        await new Promise(r => setTimeout(r, 10000));
        return publishArticle(slug, retries - 1);
      }
      console.log(`  ✗ Connection failed after retries`);
      return null;
    }
    throw err;
  }

  // Handle specific errors
  if (res.status === 422) {
    const err = await res.json();
    if (err.error && err.error.includes('Canonical url has already been taken')) {
      console.log(`  ↩ Already published (canonical URL exists)`);
      return 'already-published';
    }
    if (err.error && err.error.includes('Title has already been used')) {
      console.log(`  ↩ Title used recently, skipping`);
      return null;
    }
    console.log(`  ✗ Validation error: ${JSON.stringify(err)}`);
    return null;
  }

  if (res.status === 429) {
    if (retries > 0) {
      const retryAfter = res.headers.get('retry-after') || 30;
      console.log(`  ⏳ Rate limited, waiting ${retryAfter}s... (${retries} retries left)`);
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      return publishArticle(slug, retries - 1);
    }
    const err = await res.json();
    console.log(`  ✗ Rate limit exceeded after retries`);
    return null;
  }

  if (!res.ok) {
    const err = await res.json();
    console.log(`  ✗ Error: ${JSON.stringify(err)}`);
    return null;
  }

  const article = await res.json();
  console.log(`  ✓ Published: https://dev.to/${article.user.username}/${article.slug}`);
  console.log(`  Response body preview: ${JSON.stringify(article).substring(0, 500)}`);
  return article.id;
}

// Main
async function main() {
  const args = process.argv.slice(2);

  console.log('🔄 Syncing to Dev.to...\n');

  // Verify API key first
  try {
    const user = await verifyApiKey();
    console.log(`Logged in as: ${user.name} (@${user.username})\n`);
  } catch (err) {
    console.error('❌ API key verification failed:', err.message);
    process.exit(1);
  }

  // Delete mode
  if (args[0] === '--delete-all') {
    await deleteAllArticles();
    return;
  }

  const targetSlug = args[0];
  const forceMode = args[1] === '--force';

  // Check if this slug was previously published (canonical exists)
  if (targetSlug && !forceMode) {
    const filePath = path.join(BLOG_DIR, `${targetSlug}.html`);
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, 'utf-8');
      const existingUrl = html.match(/dev\.to\/([^"'>\s]+)/);
      if (existingUrl) {
        console.log(`Slug already has dev.to URL in source. Use --force to re-publish.`);
        return;
      }
    }
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
      // Wait between posts
      await new Promise(r => setTimeout(r, WAIT_MS));
    }
  }

  console.log('\n✅ Done!');
}
main().catch(console.error);
