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

// Get relative depth from root
function getDepth(filePath) {
  const rel = path.relative(ROOT, filePath);
  const parts = rel.split(path.sep);
  // depth is number of directories before the filename
  // e.g., index.html -> 0, tools/index.html -> 1, tools/dev/file.html -> 2
  if (parts.includes('index.html')) {
    return parts.slice(0, parts.indexOf('index.html')).filter(p => p && p !== '').length - 1;
  }
  return parts.filter(p => p && p !== '').length - 1;
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

// Process a single HTML file
function processFile(filePath, outPath) {
  let html = fs.readFileSync(filePath, 'utf-8');

  // Get depth for this file
  const depth = getDepth(filePath);
  const prefix = depth > 0 ? '../'.repeat(depth) : './';

  // Extract SEO info from existing title and description
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  const pageTitle = titleMatch ? titleMatch[1] : 'ToolsBase';
  const pageDesc = descMatch ? descMatch[1] : 'Free online developer tools';
  const siteUrl = 'https://toolsbase.net';
  // Convert output path to web path (e.g., dist/tools/foo.html -> tools/foo.html)
  const webPath = outPath.replace(DIST, '').replace(/^\//, '').replace(/\\/g, '/');
  const pageUrl = siteUrl + '/' + webPath;

  // Build dynamic SEO meta tags
  const seoMeta = `<meta property="og:type" content="website">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDesc}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:site_name" content="ToolsBase">
  <meta property="og:image" content="${siteUrl}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${pageDesc}">`;

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
  html = html.replace('</body>', '<script src="' + prefix + 'src/utils.js"></script>\n</body>');

  // Fix asset paths (CSS, JS, images) - must be done BEFORE tokens.css fix to avoid double replacement
  html = html.replace(/href="\/src\//g, `href="${prefix}src/`);
  html = html.replace(/src="\/src\//g, `src="${prefix}src/`);
  html = html.replace(/src="\//g, `src="${prefix}`);
  html = html.replace(/href="\//g, `href="${prefix}`);

  // Always add tokens.css for dark mode support (must come before styles.css)
  if (!html.includes('tokens.css')) {
    html = html.replace('<link rel="stylesheet" href="' + prefix + 'src/styles.css">', '<link rel="stylesheet" href="' + prefix + 'src/tokens.css">\n  <link rel="stylesheet" href="' + prefix + 'src/styles.css">');
  }

  // Add Google Ads script after <head> if not already present
  if (!html.includes('googlesyndication.com')) {
    html = html.replace('<head>', '<head>\n  ' + GOOGLE_ADS_SCRIPT);
  }

  // Add SEO meta tags before </head> if og:type is missing
  if (!html.includes('property="og:type"')) {
    html = html.replace('</head>', '  ' + seoMeta + '\n</head>');
  }

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
    'tools/text/text-diff.html', 'tools/text/word-counter.html', 'tools/index.html'
  ];
  const blogPages = fs.readdirSync(path.join(ROOT, 'blog'))
    .filter(f => f.endsWith('.html'))
    .map(f => 'blog/' + f);

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const allPages = [...urls, ...toolPages, ...blogPages].forEach(page => {
    sitemap += '  <url><loc>' + siteUrl + '/' + page + '</loc></url>\n';
  });
  sitemap += '</urlset>';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
  console.log('  sitemap.xml');

  console.log(`\nDone! Built ${htmlFiles.length} files to dist/`);
}

build();