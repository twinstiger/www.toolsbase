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
  ['/base64', 301, '/tools/dev/base64-encoder'],
  ['/json', 301, '/tools/dev/json-formatter'],
  ['/css', 301, '/tools/dev/css-minifier'],
  ['/hash', 301, '/tools/dev/hash-generator'],
  ['/html', 301, '/tools/dev/html-minifier'],
  ['/js', 301, '/tools/dev/js-minifier'],
  ['/regex', 301, '/tools/dev/regex-tester'],
  ['/sql', 301, '/tools/dev/sql-formatter'],
  ['/xml', 301, '/tools/dev/xml-formatter'],
  ['/yaml', 301, '/tools/dev/yaml-validator'],
  ['/json-yaml', 301, '/tools/dev/json-to-yaml'],
  ['/url-encode', 301, '/tools/dev/url-encoder'],
  ['/dns', 301, '/tools/network/dns-lookup'],
  ['/ip', 301, '/tools/network/ip-to-int'],
  ['/myip', 301, '/tools/network/my-ip'],
  ['/subnet', 301, '/tools/network/subnet'],
  ['/url', 301, '/tools/network/url-parser'],
  ['/shorten', 301, '/tools/network/url-shortener'],
  ['/ua', 301, '/tools/network/user-agent'],
  ['/color', 301, '/tools/converters/color-converter'],
  ['/base', 301, '/tools/converters/number-base'],
  ['/timestamp', 301, '/tools/converters/timestamp-converter'],
  ['/units', 301, '/tools/converters/unit-converter'],
  ['/aes', 301, '/tools/crypto/aes-encrypt'],
  ['/base32', 301, '/tools/crypto/base32'],
  ['/bcrypt', 301, '/tools/crypto/bcrypt'],
  ['/htpasswd', 301, '/tools/crypto/htpasswd'],
  ['/morse', 301, '/tools/crypto/morse'],
  ['/fav', 301, '/tools/image/favicon-generator'],
  ['/img-base64', 301, '/tools/image/image-to-base64'],
  ['/qr', 301, '/tools/image/qr-code-generator'],
  ['/fake-json', 301, '/tools/generators/fake-json'],
  ['/lorem', 301, '/tools/generators/lorem-ipsum'],
  ['/password', 301, '/tools/generators/password-generator'],
  ['/random', 301, '/tools/generators/random-string'],
  ['/slug', 301, '/tools/generators/slug-generator'],
  ['/uuid', 301, '/tools/generators/uuid-generator'],
  ['/case', 301, '/tools/text/case-converter'],
  ['/diff', 301, '/tools/text/diff-checker'],
  ['/markdown', 301, '/tools/text/markdown-preview'],
  ['/text-diff', 301, '/tools/text/text-diff'],
  ['/words', 301, '/tools/text/word-counter'],
  ['/compound', 301, '/tools/finance/compound-interest'],
  ['/discount', 301, '/tools/finance/discount-calculator'],
  ['/mortgage', 301, '/tools/finance/mortgage-calculator'],
  ['/tip', 301, '/tools/finance/tip-calculator'],
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
