#!/usr/bin/env python3
"""Batch insert tool-intro sections into tool pages that don't have them yet."""

import os, re

TOOLS = os.path.dirname(os.path.abspath(__file__)) + "/tools"

# All intros keyed by relative path from tools/
INTROS = {

# ===== DEV TOOLS =====
"dev/yaml-validator.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is YAML and Why Validate It?</h2>
        <p>YAML (YAML Ain't Markup Language) is a human-readable data serialization format used everywhere: Docker Compose, Kubernetes manifests, GitHub Actions workflows, Ansible playbooks, and configuration files across languages. Its whitespace-sensitive syntax looks simple but hides traps: a misplaced space, a tab instead of spaces, or an inconsistent indentation level will silently break your config at runtime.</p>
        <p>YAML validators catch these errors before you deploy. A good validator points you directly to the line and character causing the problem, rather than letting your tool fail with a cryptic "found undefined alias" error hours later.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🐳</div>
            <div><strong>Docker Compose and Kubernetes</strong> — Every docker-compose.yml and k8s manifest is YAML. Validate before running <code>docker compose up</code> or applying a deployment — catch missing colons, bad indentation, and invalid keys before they cause a pod crash.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚙️</div>
            <div><strong>CI/CD pipeline configuration</strong> — GitHub Actions, GitLab CI, and CircleCI all use YAML for pipeline definitions. A single syntax error can disable your entire CI pipeline. Validate before pushing to avoid broken builds.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📦</div>
            <div><strong>Package and dependency configs</strong> — Many tools use YAML for metadata files. Validate generated YAML to ensure it parses correctly before committing to source control.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Debugging indentation errors</strong> — YAML's reliance on whitespace makes it easy to miscount indentation levels. A validator that shows exact line numbers turns a 30-minute debugging session into a 30-second fix.</div>
          </div>
        </div>
      </div>
    </div>
""",

"dev/xml-formatter.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Format XML?</h2>
        <p>XML (eXtensible Markup Language) is still the backbone of enterprise data exchange: SOAP APIs, Microsoft Office documents (.docx, .xlsx), RSS feeds, SVG graphics, and countless legacy systems. Raw XML from an API response or log file is usually minified — a single unreadable line — which makes debugging as painful as reading obfuscated JavaScript.</p>
        <p>Formatting XML does more than prettify it. A formatter that preserves line numbers lets you match parser error messages directly to source locations. For deeply nested XML — like a 20-level SOAP response — visual indentation reveals the actual data hierarchy in seconds.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔌</div>
            <div><strong>Debugging SOAP APIs</strong> — SOAP services return XML envelopes with namespaces, headers, and bodies. Formatting reveals the structure so you can extract the specific field you need without manual string searching.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📊</div>
            <div><strong>Inspecting RSS and sitemap feeds</strong> — RSS feeds, XML sitemaps for SEO, and Atom feeds are often delivered minified. Formatting helps verify the feed structure is valid and contains all expected entries.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📁</div>
            <div><strong>Office document debugging</strong> — .docx and .xlsx files are ZIP archives containing XML. If you're building a document processor or troubleshooting a malformed Word file, extracting and formatting the XML inside reveals the raw structure.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎨</div>
            <div><strong>SVG markup debugging</strong> — Scalable Vector Graphics are XML under the hood. A formatted SVG makes it easy to understand the element hierarchy, viewBox coordinates, and attribute structure when building or debugging graphics.</div>
          </div>
        </div>
      </div>
    </div>
""",

"dev/sql-formatter.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Format SQL?</h2>
        <p>SQL queries are written once but read dozens of times — by teammates reviewing pull requests, by DBAs optimizing performance, by future-you debugging a production issue at 2am. A query that fits on one 200-character line is an antisocial act toward everyone who follows. SQL formatters turn chaotic, auto-generated queries into readable documents that communicate intent.</p>
        <p>Beyond readability, formatting helps you catch logical errors. When each clause is on its own line with consistent indentation, it's obvious when a WHERE clause is missing, when JOINs are in the wrong order, or when a subquery is nested deeper than expected.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">👥</div>
            <div><strong>Code review and collaboration</strong> — Formatted SQL in pull requests is easier to review, comment on, and approve. A well-formatted query shows the reviewer exactly what tables are involved and what filtering logic is applied, reducing review time.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🐢</div>
            <div><strong>Debugging slow queries</strong> — When a query runs slowly, being able to clearly see the JOIN order, WHERE clause selectivity, and subquery structure is essential for identifying missing indexes or suboptimal execution plans.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Converting between SQL dialects</strong> — MySQL, PostgreSQL, SQLite, and SQL Server each have slightly different syntax. A formatter that highlights dialect-specific keywords helps you spot incompatibilities when migrating.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔧</div>
            <div><strong>Cleaning ORM-generated SQL</strong> — Object-Relational Mappers often produce verbose, inefficient SQL. Format it, identify the bloat, then write a cleaner query by hand or optimize the ORM mapping instead.</div>
          </div>
        </div>
      </div>
    </div>
""",

"dev/js-minifier.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Does a JS Minifier Do?</h2>
        <p>A JavaScript minifier rewrites your code to be functionally identical but smaller in file size. It removes all whitespace and comments, shortens variable names (renaming <code>userAuthenticationToken</code> to <code>a</code>), replaces simple expressions with more compact equivalents, and removes dead code branches. The result is a file that's nearly unreadable to humans but executes exactly the same in the browser.</p>
        <p>Minification is the final step before deploying JavaScript to production. A 200KB JavaScript bundle might compress to 70KB after minification — that's meaningful on mobile networks where every kilobyte affects load time and Time to Interactive.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🚀</div>
            <div><strong>Production build optimization</strong> — Every major frontend framework (React, Vue, Angular) includes a minification step in its production build. Use this tool to minify standalone scripts or snippets before adding them to a production page.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📦</div>
            <div><strong>Third-party script compression</strong> — When embedding analytics, tracking pixels, or third-party widgets, every KB affects page performance. Minifying a 50KB script to 30KB directly reduces the blocking impact on page render.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚡</div>
            <div><strong>Testing production-like bundles</strong> — Before running a full webpack or Vite build, quickly minify a script to verify it still works. This catches obvious minification issues early.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>When not to minify</strong> — Never minify code you're actively developing. Minification destroys readability and makes debugging nearly impossible. Only minify code that's passing through a proper build pipeline with source maps for production.</div>
          </div>
        </div>
      </div>
    </div>
""",

"dev/css-minifier.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Does a CSS Minifier Do?</h2>
        <p>A CSS minifier removes every byte that doesn't affect how the browser renders your page: whitespace, newlines, comments, and sometimes even redundant semicolons or default property values. A 30KB CSS file can often shrink to 15KB — meaningful savings on mobile networks where CSS render-blocking directly delays First Contentful Paint.</p>
        <p>CSS minifiers also perform optimizations like merging identical selectors, collapsing shorthand properties, and removing duplicate rules. Some advanced minifiers can even tree-shake unused CSS when integrated with a build tool like PurgeCSS.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🚀</div>
            <div><strong>Production CSS optimization</strong> — Production deployments should always use minified CSS. Even a simple website with a 20KB stylesheet saves ~10KB after minification — roughly a 25% reduction that directly improves page load time.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📦</div>
            <div><strong>Third-party widget styling</strong> — When embedding widgets, iframes, or web components with their own CSS, minifying the inline or linked stylesheet reduces the performance footprint of the embedded content.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Identifying bloated selectors</strong> — Before reaching for a full CSS framework replacement, minify your current CSS and measure the before/after size. Often a few hundred lines of custom CSS can replace a 50KB framework.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Debugging minification issues</strong> — When a production page looks wrong but the development CSS is fine, a minification issue might be the cause. Knowing what your minified CSS looks like helps diagnose these edge cases.</div>
          </div>
        </div>
      </div>
    </div>
""",

"dev/html-minifier.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Does an HTML Minifier Do?</h2>
        <p>An HTML minifier removes non-essential characters from HTML markup: whitespace between tags, HTML comments (which browsers ignore anyway), optional closing tags (like <code>&lt;/li&gt;</code> or <code>&lt;/p&gt;</code>), and default attribute values. The result is smaller HTML that still renders identically in every browser.</p>
        <p>HTML minification typically reduces file size by 10–30%. On high-traffic pages serving millions of requests, this compounds into significant bandwidth savings. It also slightly reduces parse time since there's less markup for the browser to process.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📄</div>
            <div><strong>Static site optimization</strong> — Static HTML pages (Jekyll, Hugo, 11ty) benefit from minification after the build step. Every HTML page served to users should be minified, especially on content-heavy sites where the same layout repeats across hundreds of pages.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚡</div>
            <div><strong>Email HTML optimization</strong> — Email clients have strict size limits and poor HTML support. Minified, table-based HTML email renders more reliably across Gmail, Outlook, and Apple Mail, while staying within attachment size limits.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔧</div>
            <div><strong>CMS output cleanup</strong> — Many content management systems generate bloated HTML with excessive class names, inline styles, and unnecessary attributes. Minifying the output reduces page size while preserving functional markup.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Where not to minify</strong> — Never minify HTML during development. Also be cautious with HTML that contains <code>&lt;pre&gt;</code> blocks, <code>&lt;textarea&gt;</code> elements, or JavaScript templates that rely on whitespace — minifiers will collapse that whitespace and break the output.</div>
          </div>
        </div>
      </div>
    </div>
""",

"dev/json-to-yaml.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Convert Between JSON and YAML?</h2>
        <p>JSON and YAML represent the same data in different formats. JSON is machine-friendly — fast to parse, universal across languages, and the default for web APIs. YAML is human-friendly — easier to read, supports comments, and flows naturally in configuration files. Converting between them lets you take a machine-generated data structure and make it human-readable, or take a human-written config and use it as an API payload.</p>
        <p>The catch: JSON and YAML have subtle differences. JSON has no comments, requires quotes on strings with special characters, and distinguishes between strings and numbers. YAML's type inference can silently convert "yes" to true or "123" to a number. A proper converter handles these edge cases correctly.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔄</div>
            <div><strong>API to config migration</strong> — You have a JSON response from an API and want to create a configuration file from it. Convert to YAML, add comments explaining each field, and you have documentation that doubles as a working config.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🐳</div>
            <div><strong>Kubernetes manifest generation</strong> — Many K8s tools output JSON but the standard manifest format is YAML. Convert JSON output to YAML to create a manifest you can commit to source control and edit by hand.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📤</div>
            <div><strong>Exporting config for readability</strong> — Export a JSON config from a tool, convert to YAML, and share it with teammates. The YAML version is easier to review in a pull request because of inline comments and cleaner syntax.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Debugging type coercion issues</strong> — YAML's automatic type conversion sometimes produces unexpected results. Converting YAML back to JSON shows you exactly what types the YAML parser inferred, helping you catch silent data mutations.</div>
          </div>
        </div>
      </div>
    </div>
""",

"dev/url-encoder.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is URL Encoding?</h2>
        <p>URLs are designed to transmit a limited set of characters (letters, digits, and a small set of symbols). Every other character — spaces, Chinese characters, emoji, <code>&amp;</code>, <code>#</code>, <code>/</code> — must be percent-encoded before it can appear in a URL. A space becomes <code>%20</code>, a Chinese character becomes multiple <code>%XX</code> bytes in UTF-8, and an ampersand becomes <code>%26</code>. This encoding is called percent-encoding or URL encoding.</p>
        <p>The confusion arises because URLs have different components with different rules. The query string (after the <code>?</code>) uses <code>&amp;</code> as a separator, so literal ampersands in search terms must be encoded. The path (before the <code>?</code>) encodes <code>/</code> differently than the query string. Understanding which component you're encoding determines the correct output.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔗</div>
            <div><strong>Building URLs with query parameters</strong> — When constructing a URL with user input (a search term, a name, a description), every special character must be encoded. Failing to do this produces broken links that either don't work or create security vulnerabilities.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Debugging 404 errors</strong> — A URL with an unencoded special character might work in your browser's address bar (browsers auto-encode) but break when pasted into an API tool, email, or printed document. Encoding reveals the actual URL being requested.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🛡️</div>
            <div><strong>Preventing injection attacks</strong> — Unsanitized URL parameters are a vector for XSS and header injection attacks. Always encode user input before inserting it into a URL, especially when reflecting it back in the page.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🌐</div>
            <div><strong>Working with non-ASCII URLs</strong> — Internationalized domain names and URLs containing non-English text need to be encoded to their Punycode or percent-encoded representation for the browser to process them correctly.</div>
          </div>
        </div>
      </div>
    </div>
""",

# ===== CODE RUNNERS =====
"run/lua.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Run Lua in the Browser?</h2>
        <p>Lua is a lightweight, fast scripting language popular in game development (Roblox, World of Warcraft addons), embedded systems, and configuration-driven applications. It's designed to be small and embeddable — which makes a browser-based runner a natural fit. This tool uses Fengari, a Lua interpreter written in pure JavaScript, to run Lua 5.3 entirely client-side with no server required.</p>
        <p>Lua's simplicity is deceptive: it has coroutines (lightweight threads), first-class functions, and a powerful table data structure that serves as both arrays and dictionaries. But it omits many things by design — no classes, no built-in regex, no standard OOP patterns — which keeps it small but requires a different mental model than Python or JavaScript.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎮</div>
            <div><strong>Learning Lua for game development</strong> — Roblox uses Lua as its scripting language. This runner is a zero-setup way to practice Lua syntax, data structures, and coroutines before touching the Roblox Studio environment.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📚</div>
            <div><strong>Understanding scripting basics</strong> — Lua's minimal design makes it excellent for learning programming concepts: variables, functions, tables, loops, and coroutines. There's less syntax to memorize than Python, letting you focus on logic.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚙️</div>
            <div><strong>Configuration language exploration</strong> — Nginx's OpenResty, Redis modules, and many embedded systems use Lua for configuration scripting. Understanding Lua helps you customize these systems beyond static config files.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>What doesn't work in the browser</strong> — Fengari doesn't implement Lua's standard library I/O and OS modules (no file access, no system calls). Scripts relying on <code>io.open</code>, <code>os.execute</code>, or <code>require</code> will fail or do nothing.</div>
          </div>
        </div>
      </div>
    </div>
""",

"run/brainfuck.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is Brainfuck?</h2>
        <p>Brainfuck is an esoteric programming language with just 8 commands: <code>&gt; &lt; + - . , [ ]</code>. It operates on a tape of memory cells using pointer movement and increment/decrement operations. Despite its extreme minimalism, Brainfuck is Turing-complete — anything computable can be expressed in it.</p>
        <p>Brainfuck's value isn't in writing real programs — it's in understanding what computation fundamentally is. Every variable is a memory cell, every operation is pointer manipulation, and every loop is a conditional jump. Writing a Brainfuck program forces you to think about computation at its most primitive level.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🧠</div>
            <div><strong>Understanding computer fundamentals</strong> — Brainfuck makes you think about memory as a tape, operations as cell manipulation, and loops as conditional jumps. This low-level mental model deepens your understanding of how any language actually runs.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🏆</div>
            <div><strong>Programming language design learning</strong> — Building an interpreter for Brainfuck is a classic systems programming exercise. Once you've implemented one, implementing other languages (even toy ones) becomes much less mysterious.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎮</div>
            <div><strong>Code golf challenges</strong> — Brainfuck programs can be extremely compact. In code golf competitions, Brainfuck solutions often win by sheer shortness of character count, even if they're completely unreadable.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Debugging interpreter implementations</strong> — If you're building a Brainfuck interpreter (in any language), this tool serves as a reference implementation — test your interpreter's output against it on known programs.</div>
          </div>
        </div>
      </div>
    </div>
""",

"run/sql.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Run SQL in the Browser?</h2>
        <p>This tool runs SQLite entirely in your browser using WebAssembly — no server, no database installation, no account required. SQLite is the most widely deployed database engine in the world (in your phone, your browser, your OS, every aircraft, and countless applications). It supports a full SQL dialect including JOINs, subqueries, transactions, and window functions.</p>
        <p>The WASM build includes the full SQLite engine with standard SQL features. You can create tables, insert data, run complex queries, and export results — all in a sandboxed browser environment that processes everything locally.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📊</div>
            <div><strong>Practice SQL interactively</strong> — No setup, no installation. Write CREATE TABLE, INSERT, SELECT, JOIN — practice SQL concepts by doing, not by reading documentation. The environment resets on each run so you start fresh.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Prototyping queries before writing application code</strong> — Draft and test a complex JOIN or aggregation query here before copying it into your application code. Iterating on SQL in a REPL is faster than the edit-run-debug cycle of a full application.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📁</div>
            <div><strong>Analyzing CSV data with SQL</strong> — Import a CSV file, create a table from it with a CREATE TABLE statement, and query it with SQL. This gives you the full power of SQL for data exploration without needing Python or pandas.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Limitations</strong> — This is SQLite, not PostgreSQL or MySQL. Advanced features like stored procedures, advisory locks, or server-specific syntax (PostgreSQL's <code>ON CONFLICT</code>, MySQL's <code>INSERT IGNORE</code>) are not available.</div>
          </div>
        </div>
      </div>
    </div>
""",

"run/regex-runner.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is RegexRunner?</h2>
        <p>RegexRunner executes regular expressions against text using the JavaScript RegExp engine. It shows all matches highlighted in the test text, displays capture groups, and supports global, case-insensitive, and multiline flags. This is the operational tool — it's built for executing and testing patterns against real text, not for learning regex from scratch.</p>
        <p>JavaScript regex syntax is slightly different from PCRE (PHP, Python <code>re</code>) and Python's <code>regex</code> library — notably in how it handles lookaheads and backreferences. If you've written a pattern in Python that doesn't work here, check for <code>(?=)</code> lookahead syntax differences.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📁</div>
            <div><strong>Processing log files</strong> — Extract IPs, timestamps, error codes, or user IDs from a server log. Write the regex to match the format, run it against the full log, and copy out just the data you need.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔄</div>
            <div><strong>Find and replace in bulk</strong> — Use regex capture groups (<code>(...)</code>) to pull structured data from unstructured text, then transform and reassemble it. Useful for renaming files, reformatting data exports, or cleaning up text.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Data extraction from reports</strong> — Pull specific values from formatted text reports, emails, or documents. If the data follows a consistent pattern, regex can extract it programmatically.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Validating structured input</strong> — Test whether an input string matches an expected format: an order ID, a phone number, an email domain. Write the pattern, test it against valid and invalid examples.</div>
          </div>
        </div>
      </div>
    </div>
""",

# ===== GENERATORS =====
"generators/uuid-generator.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is a UUID and Why Does It Matter?</h2>
        <p>A UUID (Universally Unique Identifier) is a 128-bit number formatted as a 36-character string like <code>550e8400-e29b-41d4-a716-446655440000</code>. UUIDs are designed to be unique across space and time — even if two systems generate UUIDs independently, they'll never produce the same identifier. This makes them ideal for distributed systems where there's no central authority issuing sequential IDs.</p>
        <p>UUID v4 (the most common version) is generated randomly. The odds of generating the same UUID twice are effectively zero: there are 2<sup>122</sup> possible UUIDs. If you generated a billion UUIDs per second, you'd need to run for centuries before a collision became statistically possible.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🗄️</div>
            <div><strong>Database primary keys</strong> — UUIDs let multiple systems generate IDs without coordinating through a central server. Each service can insert into the same table without conflicts — essential for microservices and offline-first applications.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔗</div>
            <div><strong>Distributed resource identifiers</strong> — In distributed databases, message queues, and event streams, every entity needs a unique ID before it can be referenced. UUIDs provide this without a coordination round-trip.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📁</div>
            <div><strong>Session and token IDs</strong> — Generate unique session identifiers, activation tokens, or one-time-use codes. Random UUIDs can't be predicted, which makes them suitable for security-sensitive identifiers.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>UUIDs vs auto-increment</strong> — UUIDs have downsides: they're 4x larger than a 32-bit integer, they don't sort chronologically (unless using UUID v7), and they worsen index compression. For single-node applications with simple writes, a sequential integer ID is often better.</div>
          </div>
        </div>
      </div>
    </div>
""",

"generators/password-generator.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Makes a Password Strong?</h2>
        <p>A strong password resists two types of attacks: brute-force (trying every combination) and dictionary attacks (trying common words and variations). The math is simple — each character in your character set multiplies the search space exponentially. A 16-character password from all printable ASCII has ~95<sup>16</sup> possible combinations, which is computationally infeasible to crack by brute force even with specialized hardware.</p>
        <p>Length is more important than complexity. A 20-character password made of random words (like "correct horse battery staple") is far stronger than an 8-character complex one (like "Tr0ub4dor&3") because the search space is astronomically larger, even though it "looks" simpler.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔐</div>
            <div><strong>Account registration</strong> — Generate unique, strong passwords for new accounts. Never reuse passwords across sites — each account gets its own randomly generated string that can't be inferred from your other credentials.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔑</div>
            <div><strong>Password manager seeding</strong> — Most password managers can generate passwords, but a dedicated generator with more customization options (specific length, excluded characters, specific character set) gives you more control.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>WiFi and network credentials</strong> — WPA2/WPA3 WiFi passwords benefit from high entropy. A 20+ character random password for your router is far stronger than a memorable word or phrase.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>What this tool doesn't do</strong> — This generates random passwords but doesn't check if they've been exposed in data breaches. For that, use Have I Been Pwned's password checker. A strong password that's already in a breach list is still compromised.</div>
          </div>
        </div>
      </div>
    </div>
""",

"generators/random-string.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is a Random String Generator?</h2>
        <p>A random string generator produces strings of arbitrary length from a configurable character set. Unlike passwords (which prioritize memorability and security), random strings prioritize entropy — the number of possible outputs. Every position in the string multiplies the total combinations by the character set size, making the output unpredictable even if the generator's seed is partially known.</p>
        <p>This tool uses JavaScript's <code>crypto.getRandomValues()</code> API, which pulls from the OS's secure random number generator — the same source used for cryptographic key generation. Strings produced here are suitable for tokens, API keys, and non-guessable identifiers.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎫</div>
            <div><strong>API key and token generation</strong> — Generate random strings for API authentication tokens, OAuth state parameters, or CSRF tokens. The cryptographic randomness ensures tokens can't be predicted by attackers.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🆔</div>
            <div><strong>Temporary identifiers</strong> — Generate short-term IDs for tracking, referral codes, coupon codes, or temporary file names. The randomness ensures collisions are statistically negligible.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🧪</div>
            <div><strong>Test data generation</strong> — Generate realistic-looking but fake identifiers, reference numbers, or codes for testing database schemas, UI layouts, or data processing pipelines.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Salt generation</strong> — Cryptographic salts for password hashing need to be unique and unpredictable. Generate a random string per user to ensure identical passwords produce different hashes.</div>
          </div>
        </div>
      </div>
    </div>
""",

"generators/slug-generator.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is a URL Slug?</h2>
        <p>A URL slug is the human-readable part of a URL that identifies a specific page: <code>/blog/my-post-title</code> instead of <code>/blog/12345</code>. Slugs are used in blogs, e-commerce sites, and documentation to make URLs memorable and SEO-friendly. The slug is derived from the page title but transformed to be URL-safe and readable.</p>
        <p>Creating a slug isn't just lowercasing and removing spaces. A robust slug generator also handles Unicode normalization, strips diacritics (converting "café" to "cafe"), removes special characters entirely, collapses multiple hyphens into one, and optionally removes stop words ("a", "the", "in") for cleaner URLs.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📝</div>
            <div><strong>Blog and CMS publishing</strong> — When publishing a post, derive its URL slug from the title. A well-crafted slug includes the key topic words so both search engines and users understand what the page is about.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🛒</div>
            <div><strong>E-commerce product URLs</strong> — Product pages benefit from descriptive slugs: <code>/product/iphone-15-pro-256gb-space-black</code> rather than <code>/product/8842</code>. This improves click-through rates from search results.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📚</div>
            <div><strong>Documentation and wikis</strong> — Auto-generate slugs from section headings. A documentation site with slugs matching heading text makes URLs self-documenting and easier to link to directly.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔄</div>
            <div><strong>Slug sanitization</strong> — If you have existing slugs with encoding issues, Unicode problems, or double hyphens, paste them here and regenerate a clean version. This is useful for cleaning up migrated content.</div>
          </div>
        </div>
      </div>
    </div>
""",

"generators/fake-json.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Generate Fake JSON Data?</h2>
        <p>Software development requires test data, and manually creating realistic JSON structures is tedious. Fake JSON generators produce structured, realistic-looking data — names, addresses, emails, dates, product descriptions — without sensitive real-world information. This lets you test UI components, API integrations, and database schemas without risking exposure of real user data (which is also an GDPR/security concern in development environments).</p>
        <p>The key advantage over screenshot-based test data or "test123" strings is realistic data shapes: arrays of objects with consistent field types, proper date formats, valid-looking email addresses, and nested structures that mirror production API responses.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🧪</div>
            <div><strong>Frontend development</strong> — Build UI components that consume API data without waiting for the backend to be ready. Realistic data shapes let you catch layout issues, null handling bugs, and type errors early.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📊</div>
            <div><strong>Database schema testing</strong> — Generate thousands of fake records to test query performance, index efficiency, and pagination. Realistic data volumes reveal issues that small test datasets miss.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔌</div>
            <div><strong>API contract testing</strong> — Simulate API responses with specific data shapes to test your client's parsing logic, error handling, and edge case behavior without setting up a test server.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Never use fake data in production</strong> — Fake JSON generators produce data that looks real but isn't. Don't use it in public demos, marketing materials, or anywhere real people might see it. It's clearly fake when you look closely.</div>
          </div>
        </div>
      </div>
    </div>
""",

"generators/lorem-ipsum.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is Lorem Ipsum?</h2>
        <p>Lorem ipsum is placeholder text derived from a 1st-century BC Roman text by Cicero, scrambled and mixed with insertions from later Latin works. The advantage of lorem ipsum over "asdfasdf" or "test" is that it's visually convincing as real text — it has word length variation, punctuation patterns, and paragraph structure that matches natural language — without being actual readable content that distracts from the design.</p>
        <p>Designers use lorem ipsum because it lets them evaluate typography, line length, whitespace, and layout without the cognitive interference of real words. When a designer sees "Lorem ipsum dolor sit amet", the Latin appearance signals "ignore this, focus on the layout." Real content triggers reading mode and distracts from visual evaluation.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎨</div>
            <div><strong>Wireframe and mockup development</strong> — When building UI templates, populate text areas with lorem ipsum to see how the layout handles realistic content volumes before real copy is available.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>Responsive design testing</strong> — Lorem ipsum paragraphs of varying lengths help test how text reflows across breakpoints, how truncation and line clamping behave, and whether the type scale works at all sizes.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📝</div>
            <div><strong>Content management system setup</strong> — Configure CMS templates and typography settings with lorem ipsum before importing real content. This lets developers and designers work in parallel.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Don't ship lorem ipsum to production</strong> — Always replace placeholder text with real content before launch. Lorem ipsum in a live product looks unprofessional and incomplete. Use this only in development and design stages.</div>
          </div>
        </div>
      </div>
    </div>
""",

# ===== CONVERTERS =====
"converters/timestamp-converter.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is a Unix Timestamp?</h2>
        <p>A Unix timestamp is the number of seconds (or milliseconds) elapsed since January 1, 1970 00:00:00 UTC — the Unix epoch. Timestamps are how computers represent dates internally: as a single integer that can be sorted, compared, and stored efficiently. <code>1717200000</code> means "this moment in time" regardless of timezone — it's absolute, not relative.</p>
        <p>The confusion arises because humans think in local time, leap years, and calendar quirks. A timestamp encodes UTC, and your local time is just a presentation layer on top of it. The same timestamp displays differently in Tokyo (<code>2024-06-01 09:00:00</code>) than in New York (<code>2024-05-31 20:00:00</code>), but they represent the exact same instant.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔧</div>
            <div><strong>API debugging</strong> — Many APIs (especially Stripe, Twilio, and financial services) use Unix timestamps in request and response fields. Converting to human-readable dates lets you verify whether a timestamp is in the past, future, or within an expected range.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📅</div>
            <div><strong>Log file analysis</strong> — Server logs, database audit trails, and system events often use timestamps as their primary ordering mechanism. Converting a Unix timestamp reveals when an event actually occurred in your local timezone.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔄</div>
            <div><strong>Timezone conversion</strong> — A timestamp represents a single point in time. Converting the same timestamp to multiple timezone formats shows you what time it was in different regions simultaneously — essential for coordinating across time zones.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⏱️</div>
            <div><strong>Cron job scheduling</strong> — Cron jobs run at scheduled times, but distributed systems may log in UTC. Converting between human-readable times and timestamps helps verify whether a cron expression is correct for the intended schedule.</div>
          </div>
        </div>
      </div>
    </div>
""",

"converters/color-converter.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Convert Between Color Formats?</h2>
        <p>Colors are represented differently depending on context: CSS uses HEX (<code>#ff6b6b</code>) and RGB (<code>rgb(255, 107, 107)</code>), designers think in HSL (<code>hsl(0, 100%, 71%)</code>), and some hardware uses HSV or integer formats. A color converter lets you switch between representations to work in whichever format is most convenient for your current task.</p>
        <p>HEX is compact and familiar for the web. RGB is explicit about the red/green/blue channels. HSL is intuitive for humans — H is the hue (color), S is saturation (vibrancy), L is lightness — making it the easiest format for creating color variations and harmonious palettes.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎨</div>
            <div><strong>Building color palettes</strong> — Take a base color and convert it to HSL to easily find complementary, analogous, or triadic colors by adjusting the H value. This is the basis of most color theory tools.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎭</div>
            <div><strong>Dark mode theming</strong> — When implementing dark mode, you often need to shift multiple colors. Converting a palette to HSL makes it easy to adjust the L (lightness) value uniformly across all colors.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📐</div>
            <div><strong>CSS-in-JS and design systems</strong> — Design tokens often need to be in multiple formats for different frameworks. Converting between HEX, RGB, and HSL generates the right format for CSS variables, Tailwind config, or Flutter color classes.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Debugging unexpected colors</strong> — When a color looks wrong in the browser, converting it to all formats can reveal the issue: a CSS preprocessor might be misinterpreting a value, or a value might be getting clamped to sRGB incorrectly.</div>
          </div>
        </div>
      </div>
    </div>
""",

"converters/number-base.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Are Number Bases?</h2>
        <p>A number base (radix) is the system used to represent numbers. Humans use base-10 (decimal) — 10 digits, each position worth 10x the previous. Computers use base-2 (binary) — 2 digits. Programmers frequently encounter base-16 (hexadecimal) — 16 symbols representing 4 binary digits per hex digit. Understanding bases is essential for low-level programming, network addresses, and color codes.</p>
        <p>The same number looks completely different in each base: <code>255</code> (decimal) = <code>11111111</code> (binary) = <code>FF</code> (hex). They're all the same quantity, just written differently. A converter between bases shows you the equivalence instantly.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🌐</div>
            <div><strong>IPv6 address manipulation</strong> — IPv6 addresses are written in hex (base 16), split into 8 groups of 4 hex digits. Converting between hex and decimal helps when working with address masks, subnets, and range calculations.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎨</div>
            <div><strong>Color code conversion</strong> — CSS hex colors (<code>#a1b2c3</code>) are base-16 numbers. Converting to decimal gives you the RGB value; converting the decimal back to binary shows you exactly how the color is encoded in memory.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔢</div>
            <div><strong>Understanding binary data</strong> — When inspecting binary file formats, network packets, or database BLOBs, hex is the standard representation. Converting between hex and binary helps you see the actual bit patterns.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">💾</div>
            <div><strong>Memory address debugging</strong> — Memory addresses in debuggers are shown in hex. Being able to convert between hex and decimal helps you correlate debugger output with log file addresses and offsets.</div>
          </div>
        </div>
      </div>
    </div>
""",

"converters/unit-converter.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Use a Unit Converter?</h2>
        <p>Unit conversion seems simple — multiply by a conversion factor — until you're dealing with historical systems (imperial), scientific notation (nanometers), mixed unit arithmetic (adding meters to kilometers), or domain-specific units (桶 for oil, 点 for electricity). A good unit converter handles not just the math but the edge cases: overflow, precision loss, and rounding errors that compound across calculations.</p>
        <p>More importantly, unit errors have caused real-world disasters: the Mars Climate Orbiter crashed because one team used newton-seconds and another used pound-force seconds. A converter won't catch all unit mismatches, but it makes the conversion explicit and auditable.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">✈️</div>
            <div><strong>International and imperial conversions</strong> — Miles vs kilometers, pounds vs kilograms, Fahrenheit vs Celsius. When working with international data or legacy systems, converting between metric and imperial is a daily need.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🧪</div>
            <div><strong>Science and engineering calculations</strong> — Convert between length, mass, pressure, temperature, and energy units. Scientific notation support handles everything from nanometers to light-years without precision loss.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">💻</div>
            <div><strong>Data size and time conversions</strong> — Bits, bytes, megabytes, gigabytes — and milliseconds, seconds, minutes. Programming often requires converting between these to calculate timeouts, buffer sizes, and bandwidth.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🍳</div>
            <div><strong>Cooking and baking conversions</strong> — Convert between volume (cups, tablespoons, ml) and weight (ounces, grams) when following recipes from different countries. Baking especially requires precision since ratios matter.</div>
          </div>
        </div>
      </div>
    </div>
""",

# ===== TEXT TOOLS =====
"text/case-converter.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Convert Text Case?</h2>
        <p>Text case conventions exist for good reasons: <code>snake_case</code> is the Python and Rails convention; <code>camelCase</code> is JavaScript's default; <code>PascalCase</code> is used for class names in most OOP languages; <code>kebab-case</code> appears in CSS custom properties and some URL slugs. Mixing these conventions in a codebase is not just ugly — it breaks tooling (imports, linters) and makes code reviews harder to parse.</p>
        <p>A case converter does more than change capitalization. The best converters handle acronyms correctly (converting "HTML parser" to camelCase should give "HTMLParser", not "hTMLParser"), strip non-alphanumeric characters, and handle edge cases like numbers embedded in identifiers.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🐍</div>
            <div><strong>Programming variable naming</strong> — Paste a phrase, get the correct snake_case or camelCase version for your language. This is especially useful when creating variables from user-facing labels or database column names.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎨</div>
            <div><strong>CSS class name generation</strong> — Generate kebab-case class names from component names. BEM methodology (<code>block__element--modifier</code>) benefits from consistent case conversion when building design systems.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Database column naming</strong> — Many databases use snake_case by convention. When designing a schema from scratch, converting your entity names to snake_case ensures consistent column naming.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔧</div>
            <div><strong>Refactoring identifier names</strong> — When renaming a variable across a codebase, generating the correct case variant for each naming convention prevents inconsistency in generated code, tests, and documentation.</div>
          </div>
        </div>
      </div>
    </div>
""",

"text/word-counter.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Count Words?</h2>
        <p>Word count matters beyond academic essays. Writing for the web has optimal length ranges: blog posts targeting 1,500–2,500 words perform best for SEO; meta descriptions need to stay under 160 characters; tweet-length copy has a 280-character limit; reading time estimates (at ~200 words per minute) help readers budget their time. A word counter reveals these metrics at a glance.</p>
        <p>Beyond simple counts, understanding word frequency, sentence length, and readability (Flesch-Kincaid grade level) helps you write for your audience. Short sentences and common words score lower on readability indexes — appropriate for broad audiences but potentially too simple for technical documentation.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">✍️</div>
            <div><strong>Meeting writing requirements</strong> — College essays, professional reports, and submission forms often have minimum or maximum word counts. A live counter helps you write to the target rather than guessing and overwriting.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📝</div>
            <div><strong>SEO content optimization</strong> — Search engines favor comprehensive content. Knowing your word count helps you ensure articles are long enough to be thorough without being unfocused and padded.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>Social media writing</strong> — Twitter (280 chars), LinkedIn (professional tone), and Instagram captions each have different optimal lengths. Character and word counts help you write within platform constraints.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📖</div>
            <div><strong>Readability assessment</strong> — Sentence length and word complexity metrics reveal whether your writing is accessible to your intended audience. Technical documentation for experts can use complex language; consumer-facing copy should score lower on readability indexes.</div>
          </div>
        </div>
      </div>
    </div>
""",

"text/text-diff.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is a Text Diff?</h2>
        <p>A text diff (difference) shows exactly what changed between two versions of text, line by line. The core algorithm — the Longest Common Subsequence (LCS) problem — finds the minimal set of insertions and deletions needed to transform one text into another. A good diff tool highlights these changes in context so you can see not just what changed, but what was there before.</p>
        <p>Diffs are the foundation of version control: every git commit is a diff. Understanding how diffs work helps you read git blame, resolve merge conflicts, and write meaningful commit messages that document intent rather than just listing changes.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📝</div>
            <div><strong>Comparing document versions</strong> — Paste a before and after version of a contract, essay, or article. Instantly see what was added, removed, or changed — useful for editors reviewing revisions or lawyers tracking redlines.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Debugging generated text</strong> — When a script or AI generates text, comparing its output against an expected version shows exactly where they diverge. This is much faster than reading both versions manually.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔄</div>
            <div><strong>Reviewing code changes</strong> — In environments without git, paste two versions of a configuration file or script. The diff shows what changed — essential for auditing changes to critical system files.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">✅</div>
            <div><strong>Validating transformation output</strong> — When processing text through a transformation (a formatter, a preprocessor, a AI rewrite), comparing input to output ensures the transformation did exactly what you expected and nothing more.</div>
          </div>
        </div>
      </div>
    </div>
""",

"text/diff-checker.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is a Diff Checker?</h2>
        <p>A diff checker reveals the exact differences between two pieces of text by showing additions (what's in text B but not A), deletions (what's in text A but not B), and unchanged content. The key challenge is doing this efficiently — naive algorithms are O(n²), while modern diff tools use Myers' algorithm (O(nd)) to handle documents thousands of lines long in milliseconds.</p>
        <p>Line-by-line diffs work well for code and structured text. Character-by-character diffs are better for prose where the changes are subtle word substitutions or punctuation adjustments. This tool shows both views.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📄</div>
            <div><strong>Legal document review</strong> — Track exactly what changed between contract drafts. Each revision's diff tells you precisely what terms were added, removed, or modified — critical for redlining and compliance auditing.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🤖</div>
            <div><strong>Comparing AI outputs</strong> — When testing different AI models or prompts, comparing their outputs side-by-side reveals which one produces better results for your specific use case. The diff shows exactly where they differ.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔧</div>
            <div><strong>Configuration file audits</strong> — After a system update, compare the new config to the previous version. Diffs expose undocumented changes that could affect system behavior.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📚</div>
            <div><strong>Translation quality assurance</strong> — Compare original text to a translation to verify that nothing was omitted, added, or meaningfully changed beyond language. Character-level diff is especially useful here.</div>
          </div>
        </div>
      </div>
    </div>
""",

"text/markdown-preview.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is Markdown?</h2>
        <p>Markdown is a lightweight plain-text formatting syntax that converts to HTML. It was designed to be readable as plain text — <code>**bold**</code> shows the asterisks, <code>## Heading</code> shows the hash marks — so a Markdown file makes sense even without rendering. This simplicity is why Markdown became the dominant format for documentation, READMEs, wikis, and blogging platforms.</p>
        <p>GitHub Flavored Markdown (GFM) extends basic Markdown with tables, task lists, strikethrough, and autolinks — features that match what developers need for technical documentation. Most Markdown preview tools support GFM, including this one.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📝</div>
            <div><strong>Writing documentation</strong> — GitHub, GitLab, Notion, Obsidian, and most developer tools use Markdown. Write once, render anywhere. A live preview lets you see the final output as you write.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Creating README files</strong> — Every open-source project needs a README. Markdown's code fences, table support, and checkbox lists make it ideal for documenting installation steps, feature lists, and contribution guidelines.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">✍️</div>
            <div><strong>Blog post drafting</strong> — Many blogging platforms (Ghost, Medium via import, Jekyll) accept Markdown. A preview tool lets you format and preview your post before publishing.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎓</div>
            <div><strong>Technical writing and note-taking</strong> — Obsidian, Logseq, and Notion use Markdown as their native format. A standalone preview tool is useful when you're writing in an environment without live preview.</div>
          </div>
        </div>
      </div>
    </div>
""",

# ===== IMAGE TOOLS =====
"image/qr-code-generator.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">How Do QR Codes Work?</h2>
        <p>A QR code (Quick Response code) is a 2D barcode that stores data in both horizontal and vertical directions — unlike a 1D barcode that only stores data in one direction. QR codes can store up to 4,296 alphanumeric characters, multiple encoding modes (numeric, alphanumeric, byte, kanji), and built-in error correction (Reed-Solomon codes) that lets them remain scannable even when 7–30% of the code is damaged or obscured.</p>
        <p>The QR code you scan is interpreted by your phone's camera, which finds the three corner finder patterns, samples the timing patterns to determine cell size, reads the data and error correction words, and corrects any errors before outputting the decoded content.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>Mobile app deep linking</strong> — A URL-encoded QR code takes users directly to a specific page in your app (using a custom URL scheme or universal link). Print it on packaging, posters, or receipts to bridge physical and digital.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔗</div>
            <div><strong>WiFi sharing</strong> — Encode WiFi credentials in a QR code: <code>WIFI:T:WPA;S:networkName;P:password;;</code>. Guests can scan it to connect without typing a complex password — standard in iOS and Android.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎫</div>
            <div><strong>Event tickets and passes</strong> — Encode a unique ticket ID or validation code in a QR code. When scanned at entry, the code is verified against a backend — simpler than NFC and works with any smartphone camera.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>URL shortener risks</strong> — Shortened URLs in QR codes are a security concern: users can't see where the code goes before scanning. Always use a meaningful URL or display the destination before the code is scanned.</div>
          </div>
        </div>
      </div>
    </div>
""",

"image/favicon-generator.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is a Favicon?</h2>
        <p>A favicon (favorite icon) is the small icon browsers display in tabs, bookmarks bar, and address bar. Despite being just 16×16 pixels at minimum, it carries significant branding weight and UX value. A well-designed favicon is recognizable at tiny sizes, works in both light and dark browser themes, and is immediately associated with your site.</p>
        <p>Modern browsers also use favicons for progressive web apps (PWAs), home screen shortcuts, and rich link previews on social platforms. The <code>&lt;link rel="icon"&gt;</code> in your HTML's <code>&lt;head&gt;</code> determines which image file the browser uses and at what size.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎨</div>
            <div><strong>Brand identity at small sizes</strong> — Favicons must be recognizable at 16px, 32px, and 180px (Apple touch icon). Design with simplicity: a single letter, a simplified logo mark, or a distinctive color shape works better than complex designs at tiny sizes.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>PWA home screen icons</strong> — Progressive Web Apps require multiple icon sizes (72, 96, 128, 144, 152, 192, 384, 512px) for different devices. Generating from a source image creates all required sizes automatically.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔗</div>
            <div><strong>Social media link previews</strong> — When sharing a link on LinkedIn, Twitter, or Discord, the favicon often appears alongside the page title. A high-quality favicon improves link click-through rates by signaling professionalism.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Format considerations</strong> — SVG favicons are modern and scale perfectly, but older browsers need PNG fallbacks. ICO format (multi-resolution in one file) is still the format that works across all browsers automatically.</div>
          </div>
        </div>
      </div>
    </div>
""",

"image/image-to-base64.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is Image-to-Base64?</h2>
        <p>Image-to-Base64 converts a binary image file (JPEG, PNG, WebP, SVG) into a Base64-encoded text string that can be embedded directly in HTML, CSS, or JSON. Instead of loading an external image with <code>&lt;img src="photo.jpg"&gt;</code>, you can use <code>&lt;img src="data:image/jpeg;base64,/9j/4AAQ..."&gt;</code>. The browser decodes the Base64 back to binary and renders the image.</p>
        <p>The advantage is reducing HTTP requests — one fewer round trip for each embedded image. The disadvantage is a ~33% size increase (Base64 is less dense than binary), and no browser caching. This tradeoff makes sense for small, critical images like logos or icons, not for large photos.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📧</div>
            <div><strong>Email HTML images</strong> — Email clients often block external images by default. Embedding images as Base64 in email HTML ensures they display without requiring the recipient to "load images" — important for email marketing and transactional emails.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📄</div>
            <div><strong>Single-file HTML reports</strong> — Embed chart images, logos, and icons directly in an HTML report. The file is self-contained and can be shared, archived, or printed without missing assets.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔌</div>
            <div><strong>Embedding in JSON API responses</strong> — When an API needs to return both data and a small image (a user avatar, a product thumbnail), embedding as Base64 avoids a separate image fetch and simplifies the API contract.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Don't use for large images</strong> — A 500KB photo becomes ~670KB of Base64. This bloats page size, can't be cached by the browser, and delays First Contentful Paint. Only use this for small images under 5–10KB.</div>
          </div>
        </div>
      </div>
    </div>
""",

# ===== NETWORK TOOLS =====
"network/url-parser.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Does a URL Parser Do?</h2>
        <p>A URL is not just a string — it's a structured identifier with six components: scheme (<code>https</code>), username/password (<code>user:pass@</code>), host (<code>example.com</code>), port (<code>:8080</code>), path (<code>/api/users</code>), query string (<code>?id=123&amp;sort=name</code>), and fragment (<code>#section</code>). A parser extracts these components from a URL string so you can inspect or modify them individually.</p>
        <p>Many security vulnerabilities arise from mishandling URL components. A URL that looks like <code>https://google.com/@evil.com</code> has <code>google.com</code> as the host? No — the parser sees the <code>@</code> before it, so <code>evil.com</code> is the host and <code>google.com</code> is the username. This is why you must always use a proper URL parser, never string splitting.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Inspecting shortened URLs</strong> — Before clicking a shortened link (bit.ly, t.co), paste it to see the full URL the redirect points to. The expanded URL reveals where you actually land.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🛡️</div>
            <div><strong>Phishing URL analysis</strong> — Attackers use URL encoding, subdomain tricks, and lookalike characters to make malicious URLs appear legitimate. A parser reveals the true domain and path regardless of visual tricks.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔧</div>
            <div><strong>Debugging redirect chains</strong> — When a URL redirects through multiple hops, use the parser to inspect each intermediate URL and understand where traffic is flowing and why certain parameters are being added or stripped.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Extracting query parameters</strong> — Pull individual parameters from a URL's query string. Useful for debugging analytics UTM parameters, API pagination, or form submission data embedded in URLs.</div>
          </div>
        </div>
      </div>
    </div>
""",

"network/my-ip.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is My IP Address?</h2>
        <p>Your IP address is your device's identifier on the internet — the address other computers use to send data back to you. There are two types: IPv4 (like <code>203.0.113.42</code> — a 32-bit number, almost exhausted globally) and IPv6 (like <code>2001:0db8:85a3:0000:0000:8a2e:0370:7334</code> — a 128-bit address space so large every device can have a unique address forever). Your public IP is assigned by your ISP and hides behind carrier-grade NAT; your device's local IP (usually in the <code>192.168.x.x</code> range) is assigned by your router.</p>
        <p>The IP address you see from this tool is your public IP — the one the outside world sees when you make requests. It might be shared by thousands of households if you're on CGNAT, or it might be a static IP if you pay for one.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🌐</div>
            <div><strong>Checking VPN effectiveness</strong> — After connecting to a VPN, your public IP changes. Checking it confirms whether your VPN is working, leaking DNS, or disconnecting silently.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🛡️</div>
            <div><strong>Firewall and access list configuration</strong> — Many services (databases, admin panels, cloud VMs) restrict access by IP address. Knowing your public IP lets you add it to allowlists without trial and error.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🌍</div>
            <div><strong>Checking geo-location</strong> — Your IP determines what content you see: local search results, regional pricing, blacked-out sports games. Checking your IP confirms what geo-location services see about you.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Troubleshooting connectivity issues</strong> — When a service blocks you, knowing your IP helps determine if it's a general block (everyone), an IP range block, or something specific to your connection.</div>
          </div>
        </div>
      </div>
    </div>
""",

"network/subnet.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is Subnet Calculation?</h2>
        <p>A subnet (subnetwork) is a logical division of an IP network. When you subnet a network, you split one IP range into smaller blocks. Subnetting is fundamental to network design: it isolates network segments, improves performance by reducing broadcast traffic, and enables security policies to be applied to network boundaries.</p>
        <p>The key numbers in subnetting: a subnet mask (like <code>255.255.255.0</code>) determines how many addresses are in each subnet. CIDR notation (<code>/24</code>) is shorthand for the same thing — <code>/24</code> means the first 24 bits are the network portion, leaving 8 bits for hosts (254 usable addresses in a /24).</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🖥️</div>
            <div><strong>Network design and segmentation</strong> — When setting up a network, decide how many subnets you need and how many hosts per subnet. A /24 (254 hosts) is common for office networks; a /30 (2 hosts) is used for point-to-point links.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">☁️</div>
            <div><strong>Cloud VPC planning</strong> — AWS VPCs, Azure Virtual Networks, and GCP VPCs all require you to specify CIDR blocks. A subnet calculator helps you plan how to divide your VPC into usable subnets for different tiers (public, private, database).</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔒</div>
            <div><strong>Firewall rule planning</strong> — Access control lists operate at network boundaries. Knowing the exact IP ranges in each subnet lets you write precise firewall rules that allow or block the right traffic.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📚</div>
            <div><strong>CCNA and network certification prep</strong> — Subnetting calculations (VLSM, CIDR aggregation, finding the network and broadcast address) are core exam topics. A subnet calculator is essential for verification during exam preparation.</div>
          </div>
        </div>
      </div>
    </div>
""",

"network/dns-lookup.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is DNS?</h2>
        <p>DNS (Domain Name System) is the internet's phone book — it translates human-readable domain names (<code>google.com</code>) into IP addresses (<code>142.250.80.46</code>). Without DNS, you'd have to memorize <code>142.250.80.46</code> instead of google.com. DNS queries happen billions of times per day globally, and a single DNS lookup takes 10–100 milliseconds depending on whether the answer is cached.</p>
        <p>DNS has multiple record types: A records (domain → IPv4), AAAA records (domain → IPv6), CNAME records (alias one domain to another), MX records (mail servers), TXT records (SPF, DKIM, domain verification), and NS records (authoritative nameservers). Each serves a different purpose in the DNS ecosystem.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Troubleshooting site accessibility</strong> — When a site doesn't load, DNS issues are often the culprit. A DNS lookup shows whether the domain resolves correctly and which IP it's pointing to, isolating whether the problem is DNS or something else.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🛡️</div>
            <div><strong>Verifying DNS changes before going live</strong> — After changing DNS records (pointing a domain to a new server), use a DNS lookup to verify propagation. Results vary by which DNS resolver you're using — some cache aggressively.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📧</div>
            <div><strong>Email deliverability troubleshooting</strong> — MX record lookups reveal which mail servers handle email for a domain. When emails bounce, checking the MX records confirms whether the domain is configured correctly for email receiving.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔐</div>
            <div><strong>SPF and DKIM verification</strong> — TXT records hold SPF (which mail servers can send for your domain) and DKIM (email authentication keys). A DNS lookup of the TXT records shows your current email security configuration.</div>
          </div>
        </div>
      </div>
    </div>
""",

"network/user-agent.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is a User Agent?</h2>
        <p>A User-Agent string is a header your browser sends with every HTTP request, identifying itself to web servers: <code>Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36</code>. This tells the server "I'm Chrome on macOS" so it can serve the appropriate version of the site — desktop vs mobile, modern vs legacy.</p>
        <p>User-Agent strings are notoriously messy — browsers impersonate each other (Mozilla, AppleWebKit, Safari all appear in Chrome's UA for compatibility). Modern alternatives include the User-Agent Client Hints API, which sends structured headers instead of a messy string, and is gradually replacing UA strings for privacy-sensitive information.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Browser identification</strong> — See exactly what your current browser sends as its User-Agent. Useful for verifying whether your browser is configured correctly or if an extension is modifying it.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🕵️</div>
            <div><strong>Debugging browser-specific issues</strong> — When a site works in one browser but not another, comparing User-Agent strings helps confirm you're testing in the expected environment — especially important for cross-browser QA.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>Testing responsive design</strong> — Some sites serve different HTML based on the User-Agent (though this is declining). Spoofing a mobile User-Agent lets you see the mobile version of a site on your desktop.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>User-Agent sniffing pitfalls</strong> — Many sites use User-Agent to detect browsers and serve workarounds for old versions. This is fragile — a more robust approach is feature detection (checking if an API exists) rather than browser detection.</div>
          </div>
        </div>
      </div>
    </div>
""",

"network/url-shortener.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is URL Shortening?</h2>
        <p>A URL shortener takes a long URL and creates a compact redirect — <code>https://yourlongdomain.com/api/v1/users/123/profile/settings</code> becomes <code>https://yoursho.rt/abc123</code>. The short URL redirects (via HTTP 301 or 302) to the original URL when visited. Shorteners serve two purposes: convenience (shorter links are easier to share, especially on platforms with character limits) and tracking (each short link can record clicks, referrers, geographic locations, and devices).</p>
        <p>The tradeoff is introducing a third party into your link chain — if the shortener service goes down or bans your domain, all your links break. This is why using a custom domain with your own shortener (or a reputable service) is more reliable than generic shorteners for business use.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>Social media sharing</strong> — Twitter's 280-character limit and SMS links benefit from short URLs. QR codes generated from short URLs are also cleaner and easier to scan than long URLs.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📊</div>
            <div><strong>Marketing campaign tracking</strong> — Each campaign (email blast, Twitter post, print ad) gets its own short link with unique analytics. Measure which channels drive the most clicks without asking users to use different URLs.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔗</div>
            <div><strong>Masking affiliate and referral links</strong> — Replace long affiliate IDs or referral parameters with clean short links that redirect to the destination with the right tracking parameters attached.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Phishing and trust</strong> — Shortened links hide the destination, which makes them a common phishing vector. Users are right to be suspicious of short links. Consider displaying the destination before redirecting, especially in business communications.</div>
          </div>
        </div>
      </div>
    </div>
""",

"network/ip-to-int.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is IP-to-Integer Conversion?</h2>
        <p>An IPv4 address is a 32-bit number expressed in dotted-decimal notation: <code>192.168.1.1</code> is actually the integer <code>3232235777</code>. Each octet (0–255) represents 8 bits. IP-to-integer conversion is the mathematical operation that converts between these two representations: <code>192×256³ + 168×256² + 1×256 + 1 = 3232235777</code>.</p>
        <p>Some legacy database schemas store IP addresses as integers for compactness and faster comparison (no string parsing). Network equipment and certain APIs also use integer representation. Converting between formats is essential when working with these systems.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🗄️</div>
            <div><strong>IP-based database queries</strong> — Some databases (especially older ones or specific applications like Redis Geospatial) store IPs as integers. Converting to integer lets you query IP ranges efficiently with SQL BETWEEN clauses.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🌐</div>
            <div><strong>CIDR range calculations</strong> — When calculating IP ranges from CIDR notation, integer math is simpler: convert start and end IPs to integers, add/subtract 1 for network and broadcast addresses, then convert back.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔢</div>
            <div><strong>IP address arithmetic</strong> — Finding the next IP, the previous IP, or counting how many IPs are between two addresses is trivial with integer representation but tedious with string manipulation.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📊</div>
            <div><strong>MaxMind GeoIP databases</strong> — The MaxMind GeoLite2 database uses integer IP ranges. Converting an IP to integer lets you look up the range that contains it and retrieve the corresponding geographic data.</div>
          </div>
        </div>
      </div>
    </div>
""",

# ===== CRYPTO TOOLS =====
"crypto/bcrypt.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is BCrypt?</h2>
        <p>BCrypt is a password hashing algorithm designed for security rather than speed. Unlike MD5 or SHA-256 (which were designed to be fast — useful for checksums, harmful for passwords), BCrypt is intentionally slow and memory-intensive, making brute-force attacks exponentially more expensive. It also uses a salt automatically — each hash of the same password produces a different output, defeating rainbow table attacks.</p>
        <p>The cost factor (work factor) in BCrypt controls how slow the hash is. As hardware gets faster, you increase the cost factor to keep brute-force attacks infeasible. A cost of 10 (2^10 iterations) is a common default; cost 12 is considered stronger for sensitive applications.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔐</div>
            <div><strong>Password storage</strong> — BCrypt is the recommended algorithm for storing user passwords. Hash the password on registration, store the hash, and on login hash the provided password and compare. Never store plaintext passwords.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔄</div>
            <div><strong>Password migration</strong> — When migrating from an old hashing scheme (MD5, SHA-1) to BCrypt, use this tool to verify that BCrypt produces correct hashes for known test vectors before updating your application.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Generating test hashes</strong> — When building authentication systems, generate BCrypt test vectors with known passwords so you can verify your hashing and comparison logic works correctly.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Not for checksums</strong> — BCrypt is designed for passwords, not data integrity. Don't use it to verify file integrity or as a general hash function — use SHA-256 or BLAKE3 for that purpose. BCrypt's slowness is a feature for passwords, a bug for checksums.</div>
          </div>
        </div>
      </div>
    </div>
""",

"crypto/aes-encrypt.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is AES Encryption?</h2>
        <p>AES (Advanced Encryption Standard) is the gold standard symmetric encryption algorithm — the same key encrypts and decrypts. It was selected by NIST after a 5-year public competition and is approved by the US government for classified information up to Top Secret. AES-256 (256-bit key) is the strongest variant, used by most security-conscious applications.</p>
        <p>AES is a block cipher — it encrypts data in fixed-size blocks (128 bits). For data larger than one block, a mode of operation (CBC, GCM, etc.) chains blocks together. GCM additionally provides authentication — the recipient can verify the ciphertext wasn't tampered with, not just that it was encrypted with the right key.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📦</div>
            <div><strong>Encrypting sensitive data at rest</strong> — Database fields containing SSNs, financial data, or health information should be encrypted. AES-256 in GCM mode is the standard choice for field-level encryption in modern applications.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔗</div>
            <div><strong>Encrypting data in transit</strong> — TLS (SSL) uses AES for encrypting data sent over HTTPS. The same algorithm protects your banking login and this website's data simultaneously.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📁</div>
            <div><strong>File and disk encryption</strong> — AES underlies most file encryption tools and full-disk encryption (BitLocker, FileVault, dm-crypt). It operates at the block level, making it suitable for encrypting entire drives efficiently.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Key management is the hard part</strong> — AES itself is unbreakable with a 256-bit key. The vulnerability is almost always in how keys are stored, transmitted, or derived. Never hardcode keys in source code or transmit them over the same channel as the ciphertext.</div>
          </div>
        </div>
      </div>
    </div>
""",

"crypto/base32.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is Base32?</h2>
        <p>Base32 is a binary-to-text encoding like Base64, but using only uppercase A–Z and digits 2–7 — 32 ASCII characters. It was designed for case-insensitive传输 (all uppercase), making it safe for systems that may alter case (some legacy databases, URL paths on case-insensitive file systems). The tradeoff is larger output: every 5 bytes become 8 characters (40% overhead, vs Base64's 33%).</p>
        <p>Base32 is the encoding used by Google Authenticator and similar TOTP (Time-based One-Time Password) apps. The secret key is encoded in Base32, displayed as a string like <code>JBSWY3DPEHPK3PXP</code> that you type into your authenticator app.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔑</div>
            <div><strong>TOTP secret keys</strong> — When setting up two-factor authentication, your authenticator app asks you to enter a secret key. This key is displayed in Base32 and encoded in Base32 in the authenticator's storage.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📡</div>
            <div><strong>DNS record values</strong> — Some DNSSEC records use Base32 encoding for cryptographic keys and signatures. Converting between Base32 and binary is needed when manually verifying DNSSEC chains.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔒</div>
            <div><strong>Case-insensitive data encoding</strong> — When encoding data that will pass through systems known to alter case (some mainframe integrations, case-insensitive file systems, certain protocols), Base32 ensures the encoded data survives unchanged.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔍</div>
            <div><strong>Debugging TOTP implementations</strong> — If you're building a TOTP authenticator or integrating 2FA into an application, encoding and decoding Base32 secrets is a required step in generating the HMAC-based codes.</div>
          </div>
        </div>
      </div>
    </div>
""",

"crypto/htpasswd.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is htpasswd?</h2>
        <p>htpasswd is a file format and utility for HTTP Basic Authentication, used to password-protect web directories served by Apache, Nginx, and other web servers. The file contains username:password pairs, where the password is hashed (not stored in plaintext). When a user visits a protected page, the browser prompts for credentials and sends them base64-encoded — over HTTPS only, please.</p>
        <p>htpasswd supports multiple hash algorithms: bcrypt (recommended), MD5 (APR variant with salting), SHA-1 (deprecated), and plaintext (never use). Nginx uses a slightly different syntax than Apache for some algorithms, though both read the same format.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔒</div>
            <div><strong>Protecting development and staging environments</strong> — Add Basic Auth in front of dev sites to prevent accidental public exposure. A bcrypt htpasswd entry is the standard way to configure this in both Apache and Nginx.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📁</div>
            <div><strong>API key management</strong> — Some APIs use htpasswd-style files for credential management. The file serves as a simple credential store that's easier to manage than a database for low-volume authentication.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🖥️</div>
            <div><strong>Reverse proxy authentication</strong> — When using Nginx as a reverse proxy, htpasswd authentication adds a basic layer of access control in front of backend services without modifying the backend itself.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Basic Auth is not secure alone</strong> — Credentials are sent base64-encoded (not encrypted) on every request. Always use HTTPS when using Basic Auth — otherwise credentials are sent in cleartext over the network. For better security, use OAuth or JWT-based authentication.</div>
          </div>
        </div>
      </div>
    </div>
""",

"crypto/morse.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is Morse Code?</h2>
        <p>Morse code represents letters and numbers as sequences of dots (短) and dashes (长), standardized by Alfred Vail and Samuel Morse in the 1830s–1840s for the telegraph system. Each character has a unique pattern — <code>E</code> is a single dot, <code>T</code> is a single dash, <code>O</code> is three dashes (<code>---</code> — the SOS distress signal). The duration of a dash is three times a dot; gaps between dots/dashes within a character, between characters, and between words create the rhythm of transmission.</p>
        <p>While no longer required for radio operators, Morse code remains relevant: it's still used in aviation (VOR beacons), amateur radio (the only wireless transmission method that doesn't require a license in many countries), and as a cognitive exercise that reinforces pattern recognition and attention to timing.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📡</div>
            <div><strong>Amateur radio (ham radio)</strong> — Morse code proficiency (at 5 words per minute) is still an entry license requirement in many countries. The ability to copy Morse by ear is a valued skill in the amateur radio community.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎓</div>
            <div><strong>Learning and cognitive training</strong> — Decoding Morse by hand reinforces pattern recognition, working memory, and attention to sequential patterns — skills that transfer to other domains like music and programming.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">✈️</div>
            <div><strong>Aviation navigation aids</strong> — VOR (VHF Omnidirectional Range) aviation beacons continuously transmit their identity in Morse code. Pilots learn to recognize these codes to verify they're navigating to the correct beacon.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎮</div>
            <div><strong>Puzzle and escape room challenges</strong> — Morse code appears in puzzles, escape rooms, and CTF (Capture The Flag) challenges. Encoding/decoding text to Morse is a useful skill for anyone building or solving puzzles.</div>
          </div>
        </div>
      </div>
    </div>
""",

# ===== FINANCE TOOLS =====
"finance/tip-calculator.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Calculate Tips Carefully?</h2>
        <p>Tipping is customary in some countries (US, where 15–20% is standard) and uncommon in others (Japan, where it can be offensive). In the US, service workers often earn below minimum wage, with the expectation that tips will make up the difference. But the math of percentages and splitting bills between multiple people gets complicated quickly — a 20% tip on a $127.50 bill split three ways requires mental arithmetic most people get wrong.</p>
        <p>The tip percentage itself matters: 15% signals acceptable service, 20% signals good service, and 25%+ signals exceptional service. Some restaurants include auto-gratuity for large parties (usually 18–20%), which you shouldn't feel obligated to top up.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🍽️</div>
            <div><strong>Restaurant bill splitting</strong> — Split the bill and tip among multiple people. Calculate exactly what each person owes, including their share of the tip, so no one pays more or less than they should.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">💰</div>
            <div><strong>Verifying server tips</strong> — Some POS systems calculate tips incorrectly or add an automatic gratuity you weren't expecting. A quick verification catches these discrepancies before you leave.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🚗</div>
            <div><strong>Rideshare and delivery tips</strong> — Calculate tips for Uber, Lyft, DoorDash, or Instacart based on the pre-tip subtotal to ensure you're tipping fairly relative to the service quality and distance.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">💡</div>
            <div><strong>Understanding service industry economics</strong> — Seeing the actual dollar amount your tip represents (not just the percentage) helps calibrate tip amounts. 20% on a $200 dinner is $40 — more than some people's hourly wage.</div>
          </div>
        </div>
      </div>
    </div>
""",

"finance/mortgage-calculator.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">How Does a Mortgage Work?</h2>
        <p>A mortgage is a loan for buying property, typically 15–30 years at a fixed or variable interest rate. The monthly payment is calculated using amortization — each payment splits between interest (the bank's fee for lending) and principal (repaying the balance). In early payments, most goes to interest; by the end, most goes to principal. This schedule is called an amortization table.</p>
        <p>The annual interest rate (APR) is different from the monthly rate: a 6% annual rate is 0.5% per month (6% ÷ 12). The loan amount, interest rate, and term determine the payment — use this calculator to see the full payment schedule and understand the true cost of homeownership.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🏠</div>
            <div><strong>House affordability assessment</strong> — Before house hunting, calculate what monthly payment you can afford given your income, down payment, and current interest rates. A common rule: your mortgage payment should be no more than 28% of gross monthly income.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📊</div>
            <div><strong>Comparing loan offers</strong> — Two lenders may offer the same interest rate but different fees, or the same fees but different rates. Run both scenarios through the calculator to see which produces a lower total cost over the life of the loan.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔄</div>
            <div><strong>Refinancing analysis</strong> — When considering refinancing, compare your current payment schedule to a new one. The break-even point (when refinancing fees are recovered through lower payments) determines whether refinancing makes sense.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📈</div>
            <div><strong>Extra payment impact</strong> — Making one extra mortgage payment per year (or adding $100/month) dramatically reduces total interest paid and the loan term. The amortization table shows exactly when you'll be debt-free.</div>
          </div>
        </div>
      </div>
    </div>
""",

"finance/compound-interest.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is Compound Interest?</h2>
        <p>Compound interest is interest on interest — the returns you earn are reinvested and generate their own returns. This is distinct from simple interest, where you earn a fixed percentage only on the original principal. Albert Einstein allegedly called compound interest "the eighth wonder of the world" — whether or not he said it, the math is extraordinary: at 7% annual return, your money doubles every ~10 years with no additional deposits.</p>
        <p>The key variables are: principal (starting amount), rate (annual percentage), time (years), and compounding frequency (annually, monthly, daily). More frequent compounding produces slightly more returns — daily compounding on a high-yield savings account matters; monthly vs daily on a mortgage less so.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">💰</div>
            <div><strong>Investment growth projection</strong> — See how a retirement account or index fund investment grows over decades. The difference between starting at 25 vs 35 is enormous — 10 extra years of compounding can double your final balance.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🏦</div>
            <div><strong>Savings account evaluation</strong> — High-yield savings accounts compound daily. Compare different APYs to see how much extra interest $10,000 earns over a year at 4% vs 4.5% APY.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">💳</div>
            <div><strong>Understanding debt interest</strong> — Compound interest works against you on credit card debt. A $5,000 balance at 24% APR with minimum payments takes decades to pay off and costs multiples of the original debt. The calculator makes this painfully clear.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎯</div>
            <div><strong>Financial goal planning</strong> — Work backwards from a financial goal: how much do I need to save monthly at X% return to reach $1M by age 60? The calculator gives you the forward projection and the backward calculation.</div>
          </div>
        </div>
      </div>
    </div>
""",

"finance/discount-calculator.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">How Do Discounts Work?</h2>
        <p>Discounts seem simple — take 20% off — but cascading discounts (40% off, then an additional 30% off) and misleading "was/now" pricing make the actual savings confusing. The key distinction is whether discounts are applied to the original price or the current price: a 20% discount followed by a 30% discount gives either 44% off (if both off original) or 50% off (if 30% off the reduced price).</p>
        <p>Understanding discounts also matters for markup vs markdown pricing: a 50% markup followed by a 50% discount doesn't return you to the original price — it puts you 25% below it. Retailers exploit this confusion; understanding the math ensures you recognize when a "deal" isn't actually a deal.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🛒</div>
            <div><strong>Comparing discount deals</strong> — When a store advertises "30% off, plus an extra 20% at checkout", calculate the actual discount to compare fairly against a competitor's flat 40% off.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">💼</div>
            <div><strong>Business pricing calculations</strong> — Set discounts for sales, bulk orders, or promotional pricing. Calculate the exact sale price, the discount amount, and verify margins are still acceptable after the discount.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>Evaluating subscription offers</strong> — "Save 40% when you pay annually" vs "Save 25% on monthly" — calculate the dollar amounts to understand which subscription model actually saves more.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Sales tax interaction</strong> — Discounts are typically applied before sales tax. Verify that the price you calculated (including your discount) is what the register shows, since some systems apply tax to the original price before the discount.</div>
          </div>
        </div>
      </div>
    </div>
""",

# ===== PDF TOOLS =====
"pdf/merge.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Merge PDFs?</h2>
        <p>PDF (Portable Document Format) files are self-contained documents that preserve formatting across devices and operating systems. But when you have multiple PDFs — a cover page, chapters, appendices, receipts — managing them as separate files is cumbersome. Merging combines them into a single document that can be shared, sent, printed, or archived as one file.</p>
        <p>PDF merging is a structural operation — it concatenates the PDF page streams without re-rendering the content. This means merged PDFs retain all original quality (no generation loss from re-encoding) and maintain hyperlinks, bookmarks, and form fields if those existed in the source files.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📄</div>
            <div><strong>Combining a presentation</strong> — Merge individual slide PDFs into one presentation deck, or combine slides from multiple presenters into a single file to share before or after a meeting.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Consolidating documents</strong> — Merging signed contracts, receipts, and related documents into one PDF for record-keeping. A single file is easier to archive, find, and send than a folder of loose documents.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📚</div>
            <div><strong>Creating a thesis or report</strong> — Combine individual chapter PDFs, bibliography, appendices, and cover pages into one final document. Much easier to manage during writing when each chapter is a separate file.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Locked PDFs</strong> — Password-protected PDFs cannot be merged without the password. Some PDFs have printing or copying restrictions that may interfere with merging in certain tools.</div>
          </div>
        </div>
      </div>
    </div>
""",

"pdf/split.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Split a PDF?</h2>
        <p>Splitting a PDF separates one document into multiple files — extracting specific pages, separating chapters, or creating a sample from a larger document. The inverse of merging, splitting is essential when you need to share only part of a document, extract a single receipt from a scanned statement, or divide a large PDF for easier handling.</p>
        <p>PDF splitting is non-destructive — the original file remains unchanged. You can extract pages by range (pages 1–5, then 6–10), extract every page as an individual file, or remove specific pages and save the remainder as a new document.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🧾</div>
            <div><strong>Extracting invoices from statements</strong> — A bank statement PDF contains 30 transactions; you need to share just one invoice page. Split out the specific page and send only that receipt.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📖</div>
            <div><strong>Creating a preview document</strong> — Extract the first 10 pages of a long report to share as a preview or sample. Recipients get a taste without receiving the full 200-page document.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📚</div>
            <div><strong>Separating chapters for review</strong> — A book manuscript in one PDF, but reviewers only want specific chapters. Split by page ranges and send each reviewer only the chapters relevant to them.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔒</div>
            <div><strong>Removing sensitive pages</strong> — A legal document contains sensitive information on specific pages. Remove those pages, save the sanitized version, and keep the original intact for records.</div>
          </div>
        </div>
      </div>
    </div>
""",

"pdf/compress.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">How Does PDF Compression Work?</h2>
        <p>PDF compression reduces file size through two main techniques: lossy compression (particularly for images embedded in the PDF — JPEG quality reduction, downsampling high-resolution scans to screen resolution) and lossless compression (re-encoding text and vector graphics more efficiently using DEFLATE or LZW algorithms). The goal is smaller files without making the PDF unreadable.</p>
        <p>The most effective compression comes from reducing image resolution: a scanned document at 300 DPI produces a 10MB PDF; compressing it to 72 DPI for screen viewing might produce a 200KB file that's visually identical on a monitor. The right compression level depends on the PDF's intended use.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📧</div>
            <div><strong>Email attachment limits</strong> — Many email providers cap attachments at 10–25MB. Compressing a 15MB proposal to 5MB makes it sendable via email instead of requiring a file transfer service.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>Mobile and web viewing</strong> — High-resolution PDFs are unnecessarily large for mobile viewing. A compressed version loads faster, uses less data, and scrolls more smoothly on phones and tablets.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">💾</div>
            <div><strong>Archive storage optimization</strong> — Storing thousands of PDFs in cloud storage (S3, Google Drive) has direct cost implications. Compressing archived documents reduces storage costs with minimal quality loss for text-heavy documents.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Don't over-compress for print</strong> — PDFs intended for professional printing should retain high resolution. Compression artifacts (blurry text, pixelated images) are unacceptable in print-ready files — use minimum 300 DPI and lossless Flate compression.</div>
          </div>
        </div>
      </div>
    </div>
""",

"pdf/rotate.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Rotate PDF Pages?</h2>
        <p>Scanned documents often arrive with pages in the wrong orientation — some scanned upside down, others sideways. PDF pages have an inherent rotation attribute that can be 0°, 90°, 180°, or 270°. Rotating a PDF sets this attribute; it doesn't reprocess the underlying content, which means there's no quality loss from rotating.</p>
        <p>The tricky part is that PDFs remember their rotation: if you rotate a page and reopen it in a different viewer, it might not display the rotation correctly if the viewer doesn't honor the PDF's page rotation metadata. A well-designed rotation tool permanently re-encodes the content so the rotation displays consistently everywhere.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📠</div>
            <div><strong>Fixing scan orientation</strong> — A duplex scan job produces a batch where alternating pages are upside down. Batch-rotate every other page to fix the entire document in one operation.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📄</div>
            <div><strong>Correcting received documents</strong> — Someone emails you a PDF with all pages rotated 90°. Rotate it back before printing or archiving — no need to re-scan or request a replacement.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🖨️</div>
            <div><strong>Preparing for book printing</strong> — Print-on-demand books may require pages in a specific orientation. Rotate landscape pages to portrait or vice versa to meet the printer's requirements.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>Mobile reading optimization</strong> — PDFs designed for landscape viewing on tablets may be uncomfortable to read on a phone. Rotate portrait-oriented pages for better viewing on small screens.</div>
          </div>
        </div>
      </div>
    </div>
""",

"pdf/watermark.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is PDF Watermarking?</h2>
        <p>A PDF watermark is a visible overlay (usually text like "CONFIDENTIAL" or "DRAFT", or a semi-transparent logo) placed on each page of a PDF. Unlike a simple text overlay added as a comment, a proper watermark is baked into the page content layer — it appears in the same position on every page and moves with the content when pages are reordered.</p>
        <p>Watermarks serve two purposes: branding (a company logo on every page reinforces brand identity in distributed documents) and legal/protection (a "CONFIDENTIAL" watermark makes it clear the document isn't meant for public distribution and signals that distributing it is intentional, not accidental).</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📄</div>
            <div><strong>Document classification</strong> — Add "DRAFT", "REVIEW COPY", "CONFIDENTIAL", or "FINAL" watermarks to make document status immediately clear to anyone who sees or receives the file.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🏢</div>
            <div><strong>Brand reinforcement</strong> — A company logo watermark on all对外 documents maintains brand presence even after the PDF is downloaded, printed, or forwarded.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📚</div>
            <div><strong>Academic paper submission</strong> — Many journals and conferences require PDFs to include author watermarks or submission IDs. A text watermark makes your document easy to identify if it's separated from the submission metadata.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>Watermarks don't protect against copying</strong> — A watermark doesn't prevent someone from copying text from your PDF. For legal protection, combine watermarks with print/ copy restrictions (which require an encrypted PDF).</div>
          </div>
        </div>
      </div>
    </div>
""",

"pdf/image-to-pdf.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Convert Images to PDF?</h2>
        <p>PDF is a document format, not an image format. Converting images to PDF packages them in a document container that preserves quality (no further JPEG compression), supports multiple images per page (contact sheets, illustrated documents), and enables features images can't: annotations, text extraction (OCR), hyperlinks, and password protection.</p>
        <p>The key difference from just renaming a .jpg to .pdf: a proper image-to-PDF conversion embeds the image correctly so it fills the page at a defined size (A4, Letter, custom), sets the correct color space, and maintains resolution. A renamed file often renders incorrectly in PDF viewers.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Archiving photos and receipts</strong> — Convert a receipt scan to PDF for easier archiving. PDFs are searchable by filename, can be attached to accounting software, and don't degrade over time the way JPEGs do with repeated saves.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📄</div>
            <div><strong>Creating a photo album PDF</strong> — Combine multiple images into a single PDF document with one image per page, or a grid layout. Share as one file instead of a ZIP of JPEGs.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🖨️</div>
            <div><strong>Standardizing document formats</strong> — A client sends PNG screenshots you need to insert into a proposal. Converting them to PDF ensures consistent sizing and quality when inserted into your final document.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📧</div>
            <div><strong>Emailing multiple images</strong> — Converting multiple images to a single PDF reduces the number of attachments. The recipient gets one file that's easier to save and organize than a batch of separate images.</div>
          </div>
        </div>
      </div>
    </div>
""",

"pdf/pdf-to-image.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Why Convert PDF to Images?</h2>
        <p>Converting a PDF to images (PNG, JPEG) extracts each page as a raster image. This is the opposite of most workflows — normally you create a PDF from source documents. But there are legitimate reasons to rasterize a PDF: creating image previews for platforms that don't support PDFs, extracting a page visually when you don't have the original source, or creating a thumbnail for a document viewer.</p>
        <p>The conversion quality depends on the DPI setting: 72 DPI is good for screen previews, 150 DPI for web display, and 300+ DPI for print-quality output. Higher DPI means larger files — a 300 DPI page from an A4 document is about 8.2×11 inches × 300 pixels/inch = roughly 3500×2475 pixels, or about 8-10MB as PNG.</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📱</div>
            <div><strong>Social media and web previews</strong> — Convert the first page of a document to an image for sharing on LinkedIn, Twitter, or as a website preview. PDFs can't be directly embedded in most web pages or social posts.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📋</div>
            <div><strong>Document thumbnail generation</strong> — Build a document viewer that shows page thumbnails. Convert each page to a small JPEG or PNG and display them as clickable previews.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🔓</div>
            <div><strong>Extracting from protected PDFs</strong> — When a PDF allows printing but not text extraction, converting to an image bypasses the text layer. This is legally questionable for copyrighted material but legitimate for extracting data from your own documents.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">🎨</div>
            <div><strong>Editing in image software</strong> — Convert a PDF page to an image and open it in Photoshop or GIMP for editing. Useful for retouching scanned documents or adding annotations that go beyond what PDF editors support.</div>
          </div>
        </div>
      </div>
    </div>
""",

"pdf/html-to-pdf.html": """
    <div class="tool-intro">
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">What Is HTML-to-PDF Conversion?</h2>
        <p>HTML-to-PDF converts a webpage or HTML content into a fixed-layout PDF document. Unlike exporting from a browser's print dialog, a programmatic HTML-to-PDF tool can handle batch conversions, apply consistent page settings, add headers/footers/page numbers, and produce consistent results across hundreds of documents. The conversion renders the HTML/CSS as a browser would, then rasterizes to PDF.</p>
        <p>This tool uses a headless browser rendering engine to faithfully reproduce how the HTML would display in a real browser — including CSS layout, web fonts, images, and interactive elements (if configured to capture them as static elements).</p>
      </div>
      <div class="tool-intro-section">
        <h2 class="tool-intro-title">Common Use Cases</h2>
        <div class="tool-use-cases">
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📊</div>
            <div><strong>Report generation</strong> — Generate PDFs from web-based reporting dashboards. The HTML is rendered with live data, then converted to a PDF for sharing or archiving — no manual screenshot stitching required.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📄</div>
            <div><strong>Invoice and receipt PDF creation</strong> — Build HTML invoice templates styled with CSS, then convert to PDF for delivery to customers. More flexible than PDF template libraries, since any HTML/CSS design works.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">📰</div>
            <div><strong>Archiving web pages</strong> — Convert a news article, blog post, or documentation page to PDF for offline reading or legal archiving. The rendered HTML captures the content as it appeared at that moment.</div>
          </div>
          <div class="tool-use-case">
            <div class="tool-use-case-icon">⚠️</div>
            <div><strong>JavaScript-dependent content</strong> — If the page loads data via JavaScript (client-side rendering, AJAX), the converter needs to wait for JS execution to complete. Static HTML pages render most reliably.</div>
          </div>
        </div>
      </div>
    </div>
""",

}


def get_insertion_point(content, tool_path):
    """Find where to insert the tool-intro section."""
    # Most tools: after </div> closing tool-page-header, before \n\n    <div class="tool-layout">
    # Code runners: before <div class="code-runner">
    # PDF tools: before <!-- Upload Zone -->

    if 'class="code-runner"' in content:
        # Insert before code-runner div
        marker = '\n    <div class="code-runner">'
        before, after = content.split(marker, 1)
        return before + '\n    </div>\n\n' + marker, after, 'code-runner'

    if '<!-- Upload Zone -->' in content:
        marker = '<!-- Upload Zone -->'
        before, after = content.split(marker, 1)
        return before + '    </div>\n\n    ' + marker, after, 'pdf'

    if 'class="pdf-upload"' in content:
        marker = '\n    <label class="pdf-upload"'
        before, after = content.split(marker, 1)
        return before + '    </div>\n\n    ' + marker, after, 'pdf2'

    if 'tool-layout' in content:
        marker = '\n    <div class="tool-layout">'
        if marker in content:
            before, after = content.split(marker, 1)
            return before + '    </div>\n\n    ' + marker, after, 'tool-layout'
        # Try without leading spaces
        marker2 = '<div class="tool-layout">'
        if marker2 in content:
            idx = content.index(marker2)
            before = content[:idx]
            after = content[idx:]
            return before + '\n\n' + marker2, after, 'tool-layout2'

    return None, None, None


def insert_intro(tool_path, intro_html):
    """Insert tool-intro into a tool page."""
    full_path = os.path.join(TOOLS, tool_path)
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'tool-intro' in content:
        print(f"SKIP (already has intro): {tool_path}")
        return 'skipped'

    before, after, itype = get_insertion_point(content, tool_path)
    if before is None:
        print(f"ERROR (no insertion point): {tool_path}")
        return 'error'

    new_content = before + intro_html + after

    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"INSERTED ({itype}): {tool_path}")
    return 'inserted'


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    results = {'inserted': 0, 'skipped': 0, 'error': 0}
    for path, intro in INTROS.items():
        result = insert_intro(path, intro)
        results[result] = results.get(result, 0) + 1

    print(f"\nResults: {results}")
    print(f"Total intros in dict: {len(INTROS)}")

if __name__ == '__main__':
    main()
