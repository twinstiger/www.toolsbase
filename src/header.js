(function() {
  var toggle = document.getElementById('themeToggle');
  var saved = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || (prefersDark ? 'dark' : 'light');

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    document.body.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    updateThemeToggleLabel(t);
  }

  function updateThemeToggleLabel(t) {
    // icon-only button — no label needed
  }

  if (theme === 'dark') {
    applyTheme('dark');
  }

  if (toggle) {
    toggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Recently used dropdown
  var recentBtn = document.getElementById('recentBtn');
  var recentMenu = document.getElementById('recentMenu');
  var recentMenuList = document.getElementById('recentMenuList');

  if (recentBtn && recentMenu) {
    recentBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      recentMenu.classList.toggle('show');
      if (recentMenu.classList.contains('show')) {
        loadRecentItems();
      }
    });

    document.addEventListener('click', function(e) {
      if (!recentMenu.contains(e.target)) {
        recentMenu.classList.remove('show');
      }
    });
  }

  function loadRecentItems() {
    if (!recentMenuList) return;
    var history = [];
    try {
      history = JSON.parse(localStorage.getItem('tb_history') || '[]');
    } catch(e) {}

    if (history.length === 0) {
      recentMenuList.innerHTML = '<div class="recent-empty">No recent tools</div>';
      return;
    }

    var html = '';
    history.slice(0, 8).forEach(function(item) {
      var toolUrl = '/tools/' + getToolUrl(item.id);
      html += '<a href="' + toolUrl + '" class="recent-item">' +
        '<span class="recent-item-name">' + item.name + '</span>' +
        '<span class="recent-item-time">' + formatTime(item.time) + '</span>' +
        '</a>';
    });
    recentMenuList.innerHTML = html;
  }

  function getToolUrl(toolId) {
    var map = {
      'my-ip': 'network/my-ip',
      'url-parser': 'network/url-parser',
      'url-shortener': 'network/url-shortener',
      'subnet': 'network/subnet',
      'ip-to-int': 'network/ip-to-int',
      'dns-lookup': 'network/dns-lookup',
      'user-agent': 'network/user-agent',
      'json-formatter': 'dev/json-formatter',
      'base64-encoder': 'dev/base64-encoder',
      'hash-generator': 'dev/hash-generator',
      'regex-tester': 'dev/regex-tester',
      'sql-formatter': 'dev/sql-formatter',
      'url-encoder': 'dev/url-encoder',
      'html-minifier': 'dev/html-minifier',
      'css-minifier': 'dev/css-minifier',
      'js-minifier': 'dev/js-minifier',
      'json-to-yaml': 'dev/json-to-yaml',
      'yaml-validator': 'dev/yaml-validator',
      'xml-formatter': 'dev/xml-formatter',
      'password-generator': 'generators/password-generator',
      'uuid-generator': 'generators/uuid-generator',
      'lorem-ipsum': 'generators/lorem-ipsum',
      'slug-generator': 'generators/slug-generator',
      'random-string': 'generators/random-string',
      'fake-json': 'generators/fake-json',
      'case-converter': 'text/case-converter',
      'diff-checker': 'text/diff-checker',
      'markdown-preview': 'text/markdown-preview',
      'text-diff': 'text/text-diff',
      'word-counter': 'text/word-counter',
      'timestamp-converter': 'converters/timestamp-converter',
      'number-base': 'converters/number-base',
      'color-converter': 'converters/color-converter',
      'unit-converter': 'converters/unit-converter',
      'qr-code-generator': 'image/qr-code-generator',
      'favicon-generator': 'image/favicon-generator',
      'image-to-base64': 'image/image-to-base64',
      'aes-encrypt': 'crypto/aes-encrypt',
      'bcrypt': 'crypto/bcrypt',
      'htpasswd': 'crypto/htpasswd',
      'morse': 'crypto/morse',
      'base32': 'crypto/base32',
      'tip-calculator': 'finance/tip-calculator',
      'mortgage-calculator': 'finance/mortgage-calculator',
      'compound-interest': 'finance/compound-interest',
      'discount-calculator': 'finance/discount-calculator'
    };
    return map[toolId] || 'index.html';
  }

  function formatTime(timestamp) {
    var diff = Date.now() - timestamp;
    var mins = Math.floor(diff / 60000);
    var hours = Math.floor(diff / 3600000);
    var days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    if (hours < 24) return hours + 'h ago';
    if (days < 7) return days + 'd ago';
    return Math.floor(days / 7) + 'w ago';
  }

  // Header search
  var searchBtn = document.getElementById('headerSearchBtn');
  var searchWrap = document.getElementById('headerSearchWrap');
  var searchDropdown = document.getElementById('headerSearchDropdown');
  var searchInput = document.getElementById('headerSearchInput');
  var searchResults = document.getElementById('headerSearchResults');

  var allTools = [
    { title: 'Python Runner', desc: 'Execute Python code in your browser. Powered by Pyodide (Python 3.11 in WebAssembly).', href: '/tools/run/python.html', cat: 'Run' },
    { title: 'JavaScript Runner', desc: 'Run JavaScript code instantly in a sandboxed Web Worker.', href: '/tools/run/javascript.html', cat: 'Run' },
    { title: 'Lua Runner', desc: 'Execute Lua 5.3 code in your browser. Powered by Fengari (pure JavaScript).', href: '/tools/run/lua.html', cat: 'Run' },
    { title: 'SQL Runner', desc: 'Run SQL queries against a pre-loaded SQLite database. Powered by sql.js (SQLite in WebAssembly).', href: '/tools/run/sql.html', cat: 'Run' },
    { title: 'Regex Playground', desc: 'Test regular expressions with live match highlighting and group details. Built-in JavaScript RegExp engine.', href: '/tools/run/regex-runner.html', cat: 'Run' },
    { title: 'Brainfuck Runner', desc: 'Execute Brainfuck code with a pure JavaScript interpreter.', href: '/tools/run/brainfuck.html', cat: 'Run' },
    { title: 'Tip Calculator', desc: 'Calculate tip amount and split bills.', href: '/tip', cat: 'Finance' },
    { title: 'Mortgage Calculator', desc: 'Calculate monthly mortgage payments.', href: '/mortgage', cat: 'Finance' },
    { title: 'Compound Interest Calculator', desc: 'Calculate compound interest over time.', href: '/compound', cat: 'Finance' },
    { title: 'Discount Calculator', desc: 'Calculate sale price and savings.', href: '/discount', cat: 'Finance' },
    { title: 'JSON Formatter', desc: 'Format and validate JSON data.', href: '/tools/dev/json-formatter.html', cat: 'Dev' },
    { title: 'Regex Tester', desc: 'Test regex patterns with live highlighting.', href: '/tools/dev/regex-tester.html', cat: 'Dev' },
    { title: 'Base64 Encoder / Decoder', desc: 'Encode or decode Base64 strings.', href: '/tools/dev/base64-encoder.html', cat: 'Dev' },
    { title: 'Hash Generator', desc: 'Generate MD5, SHA-1, SHA-256 hashes.', href: '/tools/dev/hash-generator.html', cat: 'Dev' },
    { title: 'URL Encoder', desc: 'Encode special characters for URLs.', href: '/tools/dev/url-encoder.html', cat: 'Dev' },
    { title: 'SQL Formatter', desc: 'Format and prettify SQL queries.', href: '/tools/dev/sql-formatter.html', cat: 'Dev' },
    { title: 'HTML Minifier', desc: 'Minify HTML to reduce file size.', href: '/tools/dev/html-minifier.html', cat: 'Dev' },
    { title: 'CSS Minifier', desc: 'Minify CSS stylesheets.', href: '/tools/dev/css-minifier.html', cat: 'Dev' },
    { title: 'JavaScript Minifier', desc: 'Minify JavaScript code.', href: '/tools/dev/js-minifier.html', cat: 'Dev' },
    { title: 'JSON to YAML', desc: 'Convert JSON to YAML format.', href: '/tools/dev/json-to-yaml.html', cat: 'Dev' },
    { title: 'YAML Validator', desc: 'Validate YAML syntax.', href: '/tools/dev/yaml-validator.html', cat: 'Dev' },
    { title: 'XML Formatter', desc: 'Format and prettify XML.', href: '/tools/dev/xml-formatter.html', cat: 'Dev' },
    { title: 'Password Generator', desc: 'Generate strong random passwords.', href: '/tools/generators/password-generator.html', cat: 'Generate' },
    { title: 'UUID Generator', desc: 'Generate UUIDs / GUIDs instantly.', href: '/tools/generators/uuid-generator.html', cat: 'Generate' },
    { title: 'Lorem Ipsum', desc: 'Generate placeholder text.', href: '/tools/generators/lorem-ipsum.html', cat: 'Generate' },
    { title: 'Slug Generator', desc: 'Convert text to URL-friendly slugs.', href: '/tools/generators/slug-generator.html', cat: 'Generate' },
    { title: 'Random String', desc: 'Generate random alphanumeric strings.', href: '/tools/generators/random-string.html', cat: 'Generate' },
    { title: 'Fake JSON Generator', desc: 'Generate realistic fake JSON data.', href: '/tools/generators/fake-json.html', cat: 'Generate' },
    { title: 'Timestamp Converter', desc: 'Convert between Unix timestamps and dates.', href: '/tools/converters/timestamp-converter.html', cat: 'Convert' },
    { title: 'Number Base Converter', desc: 'Convert between binary, decimal, hex.', href: '/tools/converters/number-base.html', cat: 'Convert' },
    { title: 'Color Converter', desc: 'Convert between HEX, RGB, HSL.', href: '/tools/converters/color-converter.html', cat: 'Convert' },
    { title: 'Unit Converter', desc: 'Convert length, weight, temperature units.', href: '/tools/converters/unit-converter.html', cat: 'Convert' },
    { title: 'Word Counter', desc: 'Count words, characters, sentences.', href: '/tools/text/word-counter.html', cat: 'Text' },
    { title: 'Case Converter', desc: 'Convert text to UPPER/lower/Title Case.', href: '/tools/text/case-converter.html', cat: 'Text' },
    { title: 'Diff Checker', desc: 'Compare two text files side by side.', href: '/tools/text/diff-checker.html', cat: 'Text' },
    { title: 'Markdown Preview', desc: 'Live preview markdown as you type.', href: '/tools/text/markdown-preview.html', cat: 'Text' },
    { title: 'Text Diff', desc: 'Highlight differences between two texts.', href: '/tools/text/text-diff.html', cat: 'Text' },
    { title: 'QR Code Generator', desc: 'Generate QR codes from any text or URL.', href: '/tools/image/qr-code-generator.html', cat: 'Image' },
    { title: 'Favicon Generator', desc: 'Generate a favicon from emoji or image.', href: '/tools/image/favicon-generator.html', cat: 'Image' },
    { title: 'Image to Base64', desc: 'Convert images to Base64 data URLs.', href: '/tools/image/image-to-base64.html', cat: 'Image' },
    { title: 'My IP Address', desc: 'See your public IP address instantly.', href: '/tools/network/my-ip.html', cat: 'Network' },
    { title: 'URL Parser', desc: 'Parse and inspect URL components.', href: '/tools/network/url-parser.html', cat: 'Network' },
    { title: 'URL Shortener', desc: 'Shorten URLs with CleanURL API.', href: '/tools/network/url-shortener.html', cat: 'Network' },
    { title: 'Subnet Calculator', desc: 'Calculate subnets and IP ranges.', href: '/tools/network/subnet.html', cat: 'Network' },
    { title: 'IP to Integer', desc: 'Convert IP addresses to integers.', href: '/tools/network/ip-to-int.html', cat: 'Network' },
    { title: 'DNS Lookup', desc: 'Query DNS records for a domain.', href: '/tools/network/dns-lookup.html', cat: 'Network' },
    { title: 'User Agent Parser', desc: 'Parse and identify user agent strings.', href: '/tools/network/user-agent.html', cat: 'Network' },
    { title: 'AES Encrypt / Decrypt', desc: 'Encrypt and decrypt text with AES-256.', href: '/tools/crypto/aes-encrypt.html', cat: 'Crypto' },
    { title: 'Bcrypt Hash', desc: 'Generate and verify bcrypt hashes.', href: '/tools/crypto/bcrypt.html', cat: 'Crypto' },
    { title: 'htpasswd Generator', desc: 'Generate Apache htpasswd files.', href: '/tools/crypto/htpasswd.html', cat: 'Crypto' },
    { title: 'Morse Code', desc: 'Encode and decode Morse code.', href: '/tools/crypto/morse.html', cat: 'Crypto' },
    { title: 'Base32 Encoder', desc: 'Encode and decode Base32.', href: '/tools/crypto/base32.html', cat: 'Crypto' },
  ];

  function renderHeaderSearch(q) {
    if (!q) {
      searchResults.innerHTML = '';
      searchDropdown.classList.remove('show');
      return;
    }
    var qlow = q.toLowerCase();
    var results = allTools.filter(function(t) {
      return t.title.toLowerCase().includes(qlow) || t.desc.toLowerCase().includes(qlow);
    });
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="hsr-empty">No tools found for "' + escHtml(q) + '"</div>';
      searchDropdown.classList.add('show');
      return;
    }
    searchResults.innerHTML = results.slice(0, 8).map(function(t) {
      return '<a href="' + t.href + '" class="hsr-item">' +
        '<span class="hsr-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>' +
        '<span class="hsr-body"><span class="hsr-title">' + t.title + '</span>' +
        '<span class="hsr-desc">' + t.desc + '</span></span>' +
        '<span class="hsr-cat">' + t.cat + '</span></a>';
    }).join('');
    searchDropdown.classList.add('show');
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  if (searchDropdown) {
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        renderHeaderSearch(searchInput.value);
      });

      searchInput.addEventListener('keydown', function(e) {
        var items = searchResults.querySelectorAll('.hsr-item');
        var active = searchResults.querySelector('.hsr-item:focus, .hsr-item.hsr-active');
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (!active && items.length > 0) { items[0].classList.add('hsr-active'); }
          else { var idx = Array.from(items).indexOf(active); if (idx < items.length - 1) { active.classList.remove('hsr-active'); items[idx + 1].classList.add('hsr-active'); items[idx + 1].scrollIntoView({ block: 'nearest' }); } }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          var idx = Array.from(items).indexOf(active);
          if (idx > 0) { active.classList.remove('hsr-active'); items[idx - 1].classList.add('hsr-active'); items[idx - 1].scrollIntoView({ block: 'nearest' }); }
        } else if (e.key === 'Enter') {
          if (active) { active.click(); }
        } else if (e.key === 'Escape') {
          searchDropdown.classList.remove('show');
        }
      });
    }

    document.addEventListener('click', function(e) {
      if (!searchWrap.contains(e.target)) {
        searchDropdown.classList.remove('show');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchDropdown.classList.contains('show')) {
        searchDropdown.classList.remove('show');
      }
    });
  }
  // Active cat-nav item
  (function() {
    var path = window.location.pathname;
    var catItems = document.querySelectorAll('.cat-nav-item');
    catItems.forEach(function(item) {
      var href = item.getAttribute('href');
      if (href && path.startsWith(href.replace(/^https?:\/\/[^/]+/, ''))) {
        item.classList.add('active');
      }
    });
  })();
})();
