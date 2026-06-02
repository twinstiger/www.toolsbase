// Emulate Cloudflare Pages _redirects matching logic and verify against expected outputs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const redirectsFile = path.join(ROOT, '_redirects');
const lines = fs.readFileSync(redirectsFile, 'utf-8').split('\n');

// Parse _redirects
const rules = [];
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) continue;
  const [from, to, code] = parts;
  rules.push({ from, to, code: parseInt(code, 10) || 301 });
}

// Cloudflare's matching: convert patterns to regex
//  /:a  ->  /([^/]+)
//  /:a/:b.html  ->  /([^/]+)/([^/]+)\.html
//  /base64  ->  literal /base64
function patternToRegex(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const paramRegex = escaped.replace(/:([a-z]+)/g, (_, name) => `(?<${name}>[^/]+)`);
  return new RegExp('^' + paramRegex + '$');
}

const compiled = rules.map(r => ({
  ...r,
  regex: patternToRegex(r.from),
  paramNames: (r.from.match(/:[a-z]+/g) || []).map(s => s.slice(1)),
}));

function resolve(urlPath) {
  for (const r of compiled) {
    const m = r.regex.exec(urlPath);
    if (m) {
      let target = r.to;
      for (const name of r.paramNames) {
        target = target.replace(':' + name, m.groups[name]);
      }
      return { code: r.code, target, matchedFrom: r.from };
    }
  }
  return null;
}

// Test cases: [input, expected code, expected target (or null for no redirect)]
const cases = [
  // index.html specials
  ['/index.html', 301, '/'],
  ['/tools/index.html', 301, '/tools'],
  ['/blog/index.html', 301, '/blog'],
  // Short aliases
  ['/base64', 200, '/tools/dev/base64-encoder'],
  ['/json', 200, '/tools/dev/json-formatter'],
  ['/css', 200, '/tools/dev/css-minifier'],
  ['/hash', 200, '/tools/dev/hash-generator'],
  ['/html', 200, '/tools/dev/html-minifier'],
  ['/js', 200, '/tools/dev/js-minifier'],
  ['/regex', 200, '/tools/dev/regex-tester'],
  ['/sql', 200, '/tools/dev/sql-formatter'],
  ['/xml', 200, '/tools/dev/xml-formatter'],
  ['/yaml', 200, '/tools/dev/yaml-validator'],
  ['/json-yaml', 200, '/tools/dev/json-to-yaml'],
  ['/url-encode', 200, '/tools/dev/url-encoder'],
  ['/dns', 200, '/tools/network/dns-lookup'],
  ['/ip', 200, '/tools/network/ip-to-int'],
  ['/myip', 200, '/tools/network/my-ip'],
  ['/subnet', 200, '/tools/network/subnet'],
  ['/url', 200, '/tools/network/url-parser'],
  ['/shorten', 200, '/tools/network/url-shortener'],
  ['/ua', 200, '/tools/network/user-agent'],
  ['/color', 200, '/tools/converters/color-converter'],
  ['/base', 200, '/tools/converters/number-base'],
  ['/timestamp', 200, '/tools/converters/timestamp-converter'],
  ['/units', 200, '/tools/converters/unit-converter'],
  ['/aes', 200, '/tools/crypto/aes-encrypt'],
  ['/base32', 200, '/tools/crypto/base32'],
  ['/bcrypt', 200, '/tools/crypto/bcrypt'],
  ['/htpasswd', 200, '/tools/crypto/htpasswd'],
  ['/morse', 200, '/tools/crypto/morse'],
  ['/fav', 200, '/tools/image/favicon-generator'],
  ['/img-base64', 200, '/tools/image/image-to-base64'],
  ['/qr', 200, '/tools/image/qr-code-generator'],
  ['/fake-json', 200, '/tools/generators/fake-json'],
  ['/lorem', 200, '/tools/generators/lorem-ipsum'],
  ['/password', 200, '/tools/generators/password-generator'],
  ['/random', 200, '/tools/generators/random-string'],
  ['/slug', 200, '/tools/generators/slug-generator'],
  ['/uuid', 200, '/tools/generators/uuid-generator'],
  ['/case', 200, '/tools/text/case-converter'],
  ['/diff', 200, '/tools/text/diff-checker'],
  ['/markdown', 200, '/tools/text/markdown-preview'],
  ['/text-diff', 200, '/tools/text/text-diff'],
  ['/words', 200, '/tools/text/word-counter'],
  ['/compound', 200, '/tools/finance/compound-interest'],
  ['/discount', 200, '/tools/finance/discount-calculator'],
  ['/mortgage', 200, '/tools/finance/mortgage-calculator'],
  ['/tip', 200, '/tools/finance/tip-calculator'],
  // Wildcard rules (2-level and 1-level)
  ['/about.html', 301, '/about'],
  ['/contact.html', 301, '/contact'],
  ['/terms.html', 301, '/terms'],
  ['/privacy-policy.html', 301, '/privacy-policy'],
  ['/tools/dev/base64-encoder.html', 301, '/tools/dev/base64-encoder'],
  ['/tools/network/ip-to-int.html', 301, '/tools/network/ip-to-int'],
  ['/blog/cron-job-guide.html', 301, '/blog/cron-job-guide'],
  // No redirect (clean URLs)
  ['/about', null, null],
  ['/blog/cron-job-guide', null, null],
  ['/tools/dev/base64-encoder', null, null],
  ['/', null, null],
  // /base64 should NOT match /base64/foo (and shouldn't, since :a requires [^/]+)
  ['/base64/foo', null, null],
];

let pass = 0, fail = 0;
for (const [input, expectedCode, expectedTarget] of cases) {
  const result = resolve(input);
  let ok;
  if (expectedCode === null) {
    ok = result === null;
  } else {
    ok = result && result.code === expectedCode && result.target === expectedTarget;
  }
  if (ok) {
    pass++;
    console.log(`  PASS  ${input}  ->  ${result ? `${result.code} ${result.target}` : 'no redirect'}`);
  } else {
    fail++;
    const got = result ? `${result.code} ${result.target}` : 'no redirect';
    const want = expectedCode === null ? 'no redirect' : `${expectedCode} ${expectedTarget}`;
    console.log(`  FAIL  ${input}\n        got:  ${got}\n        want: ${want}`);
  }
}
console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
