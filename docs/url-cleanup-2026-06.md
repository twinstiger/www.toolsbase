# URL Cleanup — Drop `.html`, Add Short Aliases

> **Status**: ✅ Implemented (commit pending)
> **Date**: 2026-06-02
> **Author**: twinstiger

## Summary

Shortened all public URLs to remove the `.html` extension and added 46 short aliases for popular tools. Old URLs return `301` redirects to preserve SEO equity.

## URL changes (81 pages)

### Before → After

| Type | Before | After |
|------|--------|-------|
| Tool page | `toolsbase.net/tools/dev/base64-encoder.html` | `toolsbase.net/tools/dev/base64-encoder` |
| Tools index | `toolsbase.net/tools/index.html` | `toolsbase.net/tools` |
| Blog post | `toolsbase.net/blog/cron-job-guide.html` | `toolsbase.net/blog/cron-job-guide` |
| Blog index | `toolsbase.net/blog/index.html` | `toolsbase.net/blog` |
| Static page | `toolsbase.net/about.html` | `toolsbase.net/about` |
| Root | `toolsbase.net/index.html` | `toolsbase.net` |

## Short aliases (46)

Users can now access popular tools via short paths. All 301 to the canonical long URL.

### `dev/` (12)
| Short | Long |
|-------|------|
| `/base64` | `/tools/dev/base64-encoder` |
| `/css` | `/tools/dev/css-minifier` |
| `/hash` | `/tools/dev/hash-generator` |
| `/html` | `/tools/dev/html-minifier` |
| `/js` | `/tools/dev/js-minifier` |
| `/json` | `/tools/dev/json-formatter` |
| `/json-yaml` | `/tools/dev/json-to-yaml` |
| `/regex` | `/tools/dev/regex-tester` |
| `/sql` | `/tools/dev/sql-formatter` |
| `/url-encode` | `/tools/dev/url-encoder` |
| `/xml` | `/tools/dev/xml-formatter` |
| `/yaml` | `/tools/dev/yaml-validator` |

### `network/` (7)
| Short | Long |
|-------|------|
| `/dns` | `/tools/network/dns-lookup` |
| `/ip` | `/tools/network/ip-to-int` |
| `/myip` | `/tools/network/my-ip` |
| `/subnet` | `/tools/network/subnet` |
| `/url` | `/tools/network/url-parser` |
| `/shorten` | `/tools/network/url-shortener` |
| `/ua` | `/tools/network/user-agent` |

### `converters/` (4)
| Short | Long |
|-------|------|
| `/color` | `/tools/converters/color-converter` |
| `/base` | `/tools/converters/number-base` |
| `/timestamp` | `/tools/converters/timestamp-converter` |
| `/units` | `/tools/converters/unit-converter` |

### `crypto/` (5)
| Short | Long |
|-------|------|
| `/aes` | `/tools/crypto/aes-encrypt` |
| `/base32` | `/tools/crypto/base32` |
| `/bcrypt` | `/tools/crypto/bcrypt` |
| `/htpasswd` | `/tools/crypto/htpasswd` |
| `/morse` | `/tools/crypto/morse` |

### `image/` (3)
| Short | Long |
|-------|------|
| `/fav` | `/tools/image/favicon-generator` |
| `/img-base64` | `/tools/image/image-to-base64` |
| `/qr` | `/tools/image/qr-code-generator` |

### `generators/` (6)
| Short | Long |
|-------|------|
| `/fake-json` | `/tools/generators/fake-json` |
| `/lorem` | `/tools/generators/lorem-ipsum` |
| `/password` | `/tools/generators/password-generator` |
| `/random` | `/tools/generators/random-string` |
| `/slug` | `/tools/generators/slug-generator` |
| `/uuid` | `/tools/generators/uuid-generator` |

### `text/` (5)
| Short | Long |
|-------|------|
| `/case` | `/tools/text/case-converter` |
| `/diff` | `/tools/text/diff-checker` |
| `/markdown` | `/tools/text/markdown-preview` |
| `/text-diff` | `/tools/text/text-diff` |
| `/words` | `/tools/text/word-counter` |

### `finance/` (4)
| Short | Long |
|-------|------|
| `/compound` | `/tools/finance/compound-interest` |
| `/discount` | `/tools/finance/discount-calculator` |
| `/mortgage` | `/tools/finance/mortgage-calculator` |
| `/tip` | `/tools/finance/tip-calculator` |

## What changed

| File | Change |
|------|--------|
| `_redirects` (new) | 81 wildcard redirects + 46 short aliases + 3 special `index.html` cases |
| `build.mjs` | (1) `pageUrl` calc strips `.html` and `index.html`; (2) `sitemap.xml` URLs cleaned; (3) blog JSON-LD `pageUrl` cleaned; (4) copies `_redirects` to `dist/` |
| 47 non-blog source files | Hardcoded `og:url` updated (`.html` removed) |
| 14 blog source files | Added missing `og:url` (had `og:type="article"` but no `og:url`) |
| `dist/_redirects` (generated) | New file published with site |
| `dist/sitemap.xml` (generated) | All 81 URLs use clean form |
| `dist/**/og:url` (generated) | All pages now have correct canonical URL |

## Bug fixed

14 blog source files had `<meta property="og:type" content="article">` but were **missing** `<meta property="og:url">`. The build's `if (!html.includes('og:type'))` check skipped injection, leaving these pages with no `og:url` in production. Now fixed by adding the missing tag.

## Verification

- 61/61 redirect logic tests pass (`scripts/test-redirects.mjs`)
- 10/10 browser end-to-end tests pass (`scripts/test-redirects-browser.mjs`)
- Build produces 83 dist files; `dist/_redirects` is included
- `dist/sitemap.xml` shows clean URLs only
- All `og:url` values verified (no `.html`)

## Risks

- **CDN cache** — old URLs may be cached. **Action required after deploy**: Cloudflare Dashboard → Caching → Purge Everything
- **External backlinks** — 301 redirects will consolidate SEO weight; no action needed
- **Short alias conflicts** — none with existing top-level paths (`/blog`, `/tools`, `/about`, `/contact`, `/terms`, `/privacy-policy`, `/images`, `/src`)
- **Order matters** — explicit rules in `_redirects` come BEFORE wildcards; `index.html` specials come first to avoid being captured by `/:a.html`

## Rollback

If something breaks, revert the commit and re-deploy. The old URLs continue to work via the redirect rules, so rollback is low-risk.

---

**Issue body** (paste this into the GitHub Issue if creating one):

```markdown
## What

Shorten all public URLs by removing `.html` and add short aliases for popular tools.

## Why

Current URLs (e.g. `/tools/dev/base64-encoder.html`) are longer than necessary, look dated, and miss SEO opportunities. Short aliases (e.g. `/base64`) improve shareability and align with how users search for tools.

## How

- Add Cloudflare Pages `_redirects` file with 81 + 46 = 127 rules
- Update `build.mjs` to generate clean URLs in `og:url`, `sitemap.xml`, and JSON-LD
- Update 47 source files' hardcoded `og:url`
- Fix 14 blog files that were missing `og:url` (regression fix)

All changes preserve 301 redirects from old URLs. Verified with 71 automated tests.

See `docs/url-cleanup-2026-06.md` for full details.
```
