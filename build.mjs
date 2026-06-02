import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname; // build.mjs is at project root
const SRC = path.join(ROOT, 'src');
const COMPONENTS = path.join(SRC, 'components');
const DIST = path.join(ROOT, 'dist');

// Load components
const headerHTML = fs.readFileSync(path.join(COMPONENTS, 'header.html'), 'utf-8');
const footerHTML = fs.readFileSync(path.join(COMPONENTS, 'footer.html'), 'utf-8');

// Load blog structure data (TL;DR, key takeaways, FAQs for AEO/GEO)
const BLOG_STRUCTURE_PATH = path.join(SRC, 'blog-structure.json');
let BLOG_STRUCTURE = {};
if (fs.existsSync(BLOG_STRUCTURE_PATH)) {
  BLOG_STRUCTURE = JSON.parse(fs.readFileSync(BLOG_STRUCTURE_PATH, 'utf-8'));
}

// Build TL;DR block HTML
function tldrBlock(tldr) {
  if (!tldr) return '';
  return `<aside class="tldr" role="doc-tip" aria-label="Quick summary">
  <div class="tldr-label">TL;DR</div>
  <p class="tldr-text">${tldr}</p>
</aside>\n`;
}

// Build Key Takeaways block HTML
function takeawaysBlock(takeaways) {
  if (!takeaways || takeaways.length === 0) return '';
  const items = takeaways.map(t => `<li>${t}</li>`).join('\n          ');
  return `<aside class="key-takeaways" aria-label="Key takeaways">
  <h3 class="kt-heading">Key Takeaways</h3>
  <ul class="kt-list">
          ${items}
  </ul>
</aside>\n`;
}

// Build FAQ block HTML (semantic + accessible)
function faqBlock(faqs) {
  if (!faqs || faqs.length === 0) return '';
  const items = faqs.map(f =>
    `<details class="faq-item">
    <summary class="faq-q">${f.q}</summary>
    <div class="faq-a">
      <p>${f.a}</p>
    </div>
  </details>`
  ).join('\n  ');
  return `<section class="faq-block" aria-label="Frequently asked questions">
  <h2 class="faq-heading">Frequently Asked Questions</h2>
  ${items}
</section>\n`;
}

// Build JSON-LD structured data (TechArticle + FAQPage + BreadcrumbList)
function jsonLd(slug, meta) {
  const pageUrl = `https://toolsbase.net/blog/${slug}`;
  const schemas = [];

  // Article schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: meta.title,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified || meta.datePublished,
    author: { '@type': 'Organization', name: 'ToolsBase', url: 'https://toolsbase.net' },
    publisher: {
      '@type': 'Organization',
      name: 'ToolsBase',
      url: 'https://toolsbase.net',
      logo: { '@type': 'ImageObject', url: 'https://toolsbase.net/logo.svg' }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    image: `https://toolsbase.net/images/blog/${slug}.webp`,
    articleSection: meta.section || 'Developer Tools',
    keywords: meta.keywords || '',
    inLanguage: 'en',
    wordCount: meta.wordCount,
    timeRequired: `PT${meta.readMinutes || 5}M`,
    about: meta.about,
  });

  // FAQPage schema (if FAQs present)
  if (meta.faqs && meta.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: meta.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  // BreadcrumbList
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://toolsbase.net/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://toolsbase.net/blog/' },
      { '@type': 'ListItem', position: 3, name: meta.title },
    ],
  });

  return schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n');
}

// Extract metadata from a blog HTML file
function extractBlogMeta(html, slug) {
  const title = (html.match(/<h1>([^<]+)<\/h1>/) || [])[1] || slug;
  const description = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
  const date = (html.match(/<span>(\d{4}-\d{2}-\d{2}|May \d+, \d{4}|[A-Z][a-z]+ \d+, \d{4})<\/span>/) || [])[1]
    || (html.match(/<span class="blog-card-date">([^<]+)<\/span>/) || [])[1]
    || '2026-01-01';
  const section = (html.match(/<span>(Dev Tools|Security|DevOps|JavaScript|Database|Frontend|Fundamentals|Backend)<\/span>/) || [])[1] || 'Developer Tools';
  const minutes = (html.match(/(\d+) min read/) || [])[1] || '5';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  return {
    title,
    description,
    datePublished: date,
    section,
    readMinutes: minutes,
    wordCount,
  };
}

// Inject blog structure (TL;DR, takeaways, FAQ, JSON-LD) into a blog post HTML
function injectBlogStructure(html, slug) {
  const data = BLOG_STRUCTURE[slug];
  if (!data) return html;

  // Extract metadata
  const meta = extractBlogMeta(html, slug);
  meta.faqs = data.faqs;

  // 1. Inject TL;DR after the cover image (or after the lead paragraph if no cover)
  if (!html.includes('class="tldr"')) {
    const tldr = tldrBlock(data.tldr);
    const coverEndRegex = /<\/picture>\s*<\/div>/;
    const leadEndRegex = /<\/p>\s*(?=<h2>)/;
    if (coverEndRegex.test(html)) {
      html = html.replace(coverEndRegex, m => m + '\n        ' + tldr);
    } else if (leadEndRegex.test(html)) {
      // Fallback: insert after the lead paragraph, before the first H2
      html = html.replace(leadEndRegex, m => m + '\n        ' + tldr + '\n');
    }
  }

  // 2. Inject Key Takeaways + FAQ before the "back to blog" link
  if (!html.includes('class="faq-block"')) {
    // Match any back-to-blog div (3 known patterns)
    const backLinkRegex = /(\s*<div style="margin-top:3rem;padding-top:2rem;border-top:[^"]+">)/;
    if (backLinkRegex.test(html)) {
      const block = '\n        ' + takeawaysBlock(data.takeaways) + '\n        ' + faqBlock(data.faqs);
      html = html.replace(backLinkRegex, m => block + m);
    } else {
      // Fallback: inject before </main>
      const block = '\n        ' + takeawaysBlock(data.takeaways) + '\n        ' + faqBlock(data.faqs) + '\n      ';
      html = html.replace(/(<\/main>)/, block + '$1');
    }
  }

  // 3. Inject JSON-LD in <head>
  if (!html.includes('"@type": "TechArticle"')) {
    const jsonLdScripts = jsonLd(slug, meta);
    html = html.replace('</head>', '  ' + jsonLdScripts + '\n</head>');
  }

  return html;
}

// Get relative depth from root
function getDepth(filePath) {
  const rel = path.relative(ROOT, filePath);
  // Count directory parts before the filename
  // e.g. index.html -> 0, tools/index.html -> 1, tools/dev/index.html -> 2, tools/dev/json-formatter.html -> 2
  const parts = rel.split(path.sep).filter(p => p && p !== '');
  // Last part is the filename, rest are directories
  return Math.max(0, parts.length - 1);
}

// Generate relative path prefix
function assetPath(filePath, asset) {
  const depth = getDepth(filePath);
  const prefix = depth > 0 ? '../'.repeat(depth) : './';
  // For absolute paths starting with /, keep them
  if (asset.startsWith('/')) return asset;
  return prefix + asset;
}

// Google Ads script
const GOOGLE_ADS_SCRIPT = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9420599375364457" crossorigin="anonymous"></script>';

// Microsoft Clarity script
const CLARITY_SCRIPT = `<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "x0i1qkgvxk");
</script>`;

// Process a single HTML file
function processFile(filePath, outPath) {
  let html = fs.readFileSync(filePath, 'utf-8');

  // Get depth for this file
  const depth = getDepth(filePath);
  const prefix = depth > 0 ? '../'.repeat(depth) : './';

  // Inject blog structure (TL;DR, takeaways, FAQ, JSON-LD) for blog posts
  const relPath = path.relative(ROOT, filePath);
  const blogMatch = relPath.match(/^blog\/([a-z0-9-]+)\.html$/);
  if (blogMatch && blogMatch[1] !== 'index') {
    html = injectBlogStructure(html, blogMatch[1]);
  }

  // Extract SEO info from existing title and description
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  const pageTitle = titleMatch ? titleMatch[1] : 'ToolsBase';
  const pageDesc = descMatch ? descMatch[1] : 'Free online developer tools';
  const siteUrl = 'https://toolsbase.net';
  // Convert output path to web path (e.g., dist/tools/foo.html -> tools/foo.html)
  const webPath = outPath.replace(DIST, '').replace(/^\//, '').replace(/\\/g, '/');
  // Strip .html and index.html for clean URLs (e.g., /tools/dev/foo.html -> /tools/dev/foo,
  // /blog/index.html -> /blog, /index.html -> /)
  const cleanPath = ('/' + webPath)
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '');
  const pageUrl = siteUrl + cleanPath;

  // Detect if this is a blog post and use its own image
  const isBlogPost = blogMatch && blogMatch[1] !== 'index';
  const slug = blogMatch ? blogMatch[1] : null;
  // Blog posts use their own featured image; others use default OG image
  const ogImage = isBlogPost && slug
    ? `${siteUrl}/images/blog/${slug}.webp`
    : `${siteUrl}/og-image.png`;

  // Build dynamic SEO meta tags with per-post OG image
  const seoMeta = `<meta property="og:type" content="website">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDesc}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:site_name" content="ToolsBase">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${pageDesc}">
  <meta name="twitter:image" content="${ogImage}">`;

  // Replace header
  const headerMatch = html.match(/<header class="header">[\s\S]*?<\/header>\s*/);
  if (headerMatch) {
    html = html.replace(headerMatch[0], '<!-- HEADER -->\n');
  }

  // Replace footer
  const footerMatch = html.match(/<footer class="footer">[\s\S]*?<\/footer>\s*<div id="toast"[\s\S]*?<\/div>\s*<\/body>/);
  if (footerMatch) {
    html = html.replace(footerMatch[0], '<!-- FOOTER -->\n</body>');
  }

  // Insert components
  html = html.replace('<!-- HEADER -->', headerHTML);
  html = html.replace('<!-- FOOTER -->', footerHTML);

  // Add utils.js script before </body> (after footer scripts so TBUtils is available)
  if (!html.includes('src/utils.js')) {
    html = html.replace('</body>', '<script src="' + prefix + 'src/utils.js"></script>\n</body>');
  }

    html = html.replace(/href="\.+\/src\//g, 'href="/src/');
    html = html.replace(/src="\.+\/src\//g, 'src="/src/');
    html = html.replace(/href="\.\/src\//g, 'href="/src/');
    html = html.replace(/src="\.\/src\//g, 'src="/src/');
    html = html.replace(/href="\/src\//g, 'href="/src/');
    html = html.replace(/src="\/src\//g, 'src="/src/');

  // Always add tokens.css for dark mode support (must come before styles.css)
  if (!html.includes('tokens.css')) {
    html = html.replace('<link rel="stylesheet" href="/src/styles.css">', '<link rel="stylesheet" href="/src/tokens.css">\n  <link rel="stylesheet" href="/src/styles.css">');
  }

  // Add Google Ads script after <head> if not already present
  if (!html.includes('googlesyndication.com')) {
    html = html.replace('<head>', '<head>\n  ' + GOOGLE_ADS_SCRIPT);
  }

  // Add Microsoft Clarity script after <head> if not already present
  if (!html.includes('clarity.ms/tag/')) {
    html = html.replace('<head>', '<head>\n  ' + CLARITY_SCRIPT);
  }

  // Add SEO meta tags before </head> if og:type is missing
  if (!html.includes('property="og:type"')) {
    html = html.replace('</head>', '  ' + seoMeta + '\n</head>');
  } else {
    // og:type exists but might be missing og:image or twitter:image
    if (!html.includes('property="og:image"')) {
      const ogImgTag = `<meta property="og:image" content="${ogImage}">`;
      html = html.replace('</head>', '  ' + ogImgTag + '\n</head>');
    }
    if (!html.includes('name="twitter:image"')) {
      const twitterImgTag = `<meta name="twitter:image" content="${ogImage}">`;
      html = html.replace('</head>', '  ' + twitterImgTag + '\n</head>');
    }
  }

  // LCP optimization: preload the hero image (first /images/blog/{id}.webp)
  if (!html.includes('rel="preload" as="image"') && !html.includes("rel='preload' as='image'")) {
    const lcpMatch = html.match(/\/images\/blog\/([a-z0-9-]+)\.webp/);
    if (lcpMatch) {
      const heroHref = `/images/blog/${lcpMatch[1]}.webp`;
      const preloadTag = `<link rel="preload" as="image" href="${heroHref}" fetchpriority="high">`;
      html = html.replace('</head>', '  ' + preloadTag + '\n</head>');
    }
  }

  // HTML minification (conservative - only remove between tags)
  html = html
    .replace(/>\s+</g, '><')
    .replace(/\n\s*/g, '');

  return html;
}

// Get all HTML files recursively
function getHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'dist' && entry.name !== 'node_modules') {
      getHtmlFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Build all files
function build() {
  console.log('Building...');

  // Clear and create dist
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });

  // Copy static assets
  fs.mkdirSync(path.join(DIST, 'src'), { recursive: true });
  fs.cpSync(path.join(SRC, 'styles.css'), path.join(DIST, 'src', 'styles.css'));
  fs.cpSync(path.join(SRC, 'tokens.css'), path.join(DIST, 'src', 'tokens.css'));
  fs.cpSync(path.join(SRC, 'utils.js'), path.join(DIST, 'src', 'utils.js'));

  // Copy images directory if it exists (blog post images, etc.)
  const imagesSrc = path.join(SRC, 'images');
  if (fs.existsSync(imagesSrc)) {
    fs.cpSync(imagesSrc, path.join(DIST, 'images'), { recursive: true });
  }

  // Copy root static files
  if (fs.existsSync(path.join(ROOT, 'favicon.ico'))) {
    fs.cpSync(path.join(ROOT, 'favicon.ico'), path.join(DIST, 'favicon.ico'));
  }
  if (fs.existsSync(path.join(ROOT, 'logo.svg'))) {
    fs.cpSync(path.join(ROOT, 'logo.svg'), path.join(DIST, 'logo.svg'));
  }
  if (fs.existsSync(path.join(ROOT, 'og-image.png'))) {
    fs.cpSync(path.join(ROOT, 'og-image.png'), path.join(DIST, 'og-image.png'));
  }
  if (fs.existsSync(path.join(ROOT, '_redirects'))) {
    fs.cpSync(path.join(ROOT, '_redirects'), path.join(DIST, '_redirects'));
    console.log('  _redirects');
  }
  if (fs.existsSync(path.join(ROOT, '_headers'))) {
    fs.cpSync(path.join(ROOT, '_headers'), path.join(DIST, '_headers'));
    console.log('  _headers');
  }
  // Process HTML files
  const htmlFiles = getHtmlFiles(ROOT);

  for (const file of htmlFiles) {
    const relPath = path.relative(ROOT, file);
    const outputPath = path.join(DIST, relPath);

    // Create directory if needed
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Process and write
    const processed = processFile(file, outputPath);
    fs.writeFileSync(outputPath, processed);
    console.log(`  ${relPath}`);
  }

  // Generate ads.txt
  fs.writeFileSync(path.join(DIST, 'ads.txt'), 'google.com, pub-9420599375364457, DIRECT, f08c47fec0942fa0\n');
  console.log('  ads.txt');

  // Generate robots.txt
  const robotsTxt = 'User-agent: *\nAllow: /\n\nSitemap: https://toolsbase.net/sitemap.xml\n';
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robotsTxt);
  console.log('  robots.txt');

  // Generate sitemap.xml
  const siteUrl = 'https://toolsbase.net';
  const urls = ['index.html', 'about.html', 'contact.html', 'terms.html', 'privacy-policy.html'];
  const toolPages = [
    'tools/network/my-ip.html', 'tools/network/url-parser.html', 'tools/network/url-shortener.html',
    'tools/network/subnet.html', 'tools/network/ip-to-int.html', 'tools/network/dns-lookup.html',
    'tools/network/user-agent.html', 'tools/dev/json-formatter.html', 'tools/dev/base64-encoder.html',
    'tools/dev/hash-generator.html', 'tools/dev/regex-tester.html', 'tools/dev/sql-formatter.html',
    'tools/dev/url-encoder.html', 'tools/dev/html-minifier.html', 'tools/dev/css-minifier.html',
    'tools/dev/js-minifier.html', 'tools/dev/json-to-yaml.html', 'tools/dev/yaml-validator.html',
    'tools/dev/xml-formatter.html', 'tools/generators/password-generator.html', 'tools/generators/uuid-generator.html',
    'tools/generators/lorem-ipsum.html', 'tools/generators/slug-generator.html', 'tools/generators/random-string.html',
    'tools/generators/fake-json.html', 'tools/converters/timestamp-converter.html', 'tools/converters/number-base.html',
    'tools/converters/color-converter.html', 'tools/converters/unit-converter.html', 'tools/image/qr-code-generator.html',
    'tools/image/favicon-generator.html', 'tools/image/image-to-base64.html', 'tools/crypto/aes-encrypt.html',
    'tools/crypto/bcrypt.html', 'tools/crypto/htpasswd.html', 'tools/crypto/morse.html', 'tools/crypto/base32.html',
    'tools/text/case-converter.html', 'tools/text/diff-checker.html', 'tools/text/markdown-preview.html',
    'tools/text/text-diff.html', 'tools/text/word-counter.html', 'tools/finance/tip-calculator.html',
    'tools/finance/mortgage-calculator.html', 'tools/finance/compound-interest.html', 'tools/finance/discount-calculator.html',
    'tools/index.html'
  ];
  const blogPages = fs.readdirSync(path.join(ROOT, 'blog'))
    .filter(f => f.endsWith('.html'))
    .map(f => 'blog/' + f);

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const cleanPage = (p) => ('/' + p)
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '');
  const allPages = [...urls, ...toolPages, ...blogPages].forEach(page => {
    sitemap += '  <url><loc>' + siteUrl + cleanPage(page) + '</loc></url>\n';
  });
  sitemap += '</urlset>';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
  console.log('  sitemap.xml');

  console.log(`\nDone! Built ${htmlFiles.length} files to dist/`);
}

build();