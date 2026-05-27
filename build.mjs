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

// Process a single HTML file
function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');

  // Get depth for this file
  const depth = getDepth(filePath);
  const prefix = depth > 0 ? '../'.repeat(depth) : './';

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
    const processed = processFile(file);
    fs.writeFileSync(outputPath, processed);
    console.log(`  ${relPath}`);
  }

  console.log(`\nDone! Built ${htmlFiles.length} files to dist/`);
}

build();