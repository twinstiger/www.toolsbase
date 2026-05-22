/**
 * Header & Navigation Component
 * 可以在任意HTML页面使用，只需一行引入
 */

const HeaderConfig = {
    basePath: '../../',  // 根据页面深度自动调整
    theme: 'toolsbase.net'
};

function getBasePath(depth) {
    const levels = depth || 0;
    return '../'.repeat(levels);
}

function detectDepth() {
    const path = window.location.pathname;
    // 计算路径深度
    const parts = path.split('/').filter(p => p && !p.endsWith('.html'));
    // tools/calculators/basic.html -> 2层
    // tools/converters/ -> 2层
    // index.html -> 0层
    let depth = 0;
    if (path.includes('/tools/')) {
        depth = 2;
    }
    return depth;
}

function getNavLinks(depth) {
    const base = '../'.repeat(depth);
    return {
        home: depth === 0 ? 'index.html' : base + 'index.html',
        tools: base + 'tools/',
        dict: depth === 0 ? 'dict.html' : base + 'dict.html',
        blog: depth === 0 ? 'blog/index.html' : base + 'blog/index.html'
    };
}

function generateHeader(config) {
    const depth = detectDepth();
    const base = '../'.repeat(depth);
    const links = getNavLinks(depth);

    return `
<div class="header-content">
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <div class="logo">
            <a href="${links.home}" style="text-decoration: none; cursor: pointer; display: flex; align-items: center; gap: 12px;">
                <img src="${base}logo.svg" alt="Tools Base Logo" style="height: 48px; width: auto;">
                <h1 style="margin: 0;"><span class="logo-tool">${config?.theme || 'toolsbase.net'}</span></h1>
            </a>
            <p class="tagline">Local, Fast, No Uploads • 100% Privacy Protected</p>
        </div>
        <div style="display: flex; gap: 10px;">
            <a href="${links.dict}" class="btn" style="text-decoration: none; white-space: nowrap;">📖 DICT</a>
            <a href="${links.blog}" class="btn" style="text-decoration: none; white-space: nowrap;">📚 BLOG</a>
        </div>
    </div>
</div>`;
}

function generateNav(depth) {
    const base = '../'.repeat(depth);
    const tools = base + 'tools/';

    return `
<nav class="nav">
    <div class="dropdown">
        <button class="nav-btn" data-group="dev">🛠️ Dev Tools ▼</button>
        <div class="dropdown-content">
            <a href="${tools}json/formatter.html">📋 JSON/YAML/XML</a>
            <a href="${tools}regex/tester.html">🔍 Regex Tester</a>
            <a href="${tools}encode.html">🔄 Encode/Decode</a>
            <a href="${tools}hash.html">#️⃣ Hash Generator</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="generators">⚡ Gen Tools ▼</button>
        <div class="dropdown-content">
            <a href="${tools}uuid.html">🎲 UUID Generator</a>
            <a href="${tools}password.html">🔑 Password Generator</a>
            <a href="${tools}timestamp.html">⏰ Timestamp</a>
            <a href="${tools}cron.html">📅 Cron Generator</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="calculators">🧮 Calc Tools ▼</button>
        <div class="dropdown-content">
            <a href="${tools}calculators/basic.html">🔢 Basic Calculator</a>
            <a href="${tools}calculators/percentage.html">📊 Percentage</a>
            <a href="${tools}calculators/tip.html">💵 Tip Calculator</a>
            <a href="${tools}calculators/loan.html">🏦 Loan</a>
            <a href="${tools}calculators/age.html">🎂 Age</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="converters">📐 Convert Tools ▼</button>
        <div class="dropdown-content">
            <a href="${tools}converters/length.html">📏 Length</a>
            <a href="${tools}converters/weight.html">⚖️ Weight</a>
            <a href="${tools}converters/temperature.html">🌡️ Temp</a>
            <a href="${tools}converters/volume.html">🧪 Volume</a>
            <a href="${tools}converters/area.html">📐 Area</a>
            <a href="${tools}converters/speed.html">🚀 Speed</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="text">📝 Text Tools ▼</button>
        <div class="dropdown-content">
            <a href="${tools}text/case-converter.html">🔤 Case</a>
            <a href="${tools}text/word-counter.html">📊 Word Counter</a>
            <a href="${tools}text/color-picker.html">🎨 Color</a>
            <a href="${tools}text/random-number.html">🎲 Random</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="image">🖼️ Image Tools ▼</button>
        <div class="dropdown-content">
            <a href="${tools}image/qrcode.html">📱 QR Code</a>
            <a href="${tools}image/compressor.html">🗜️ Compressor</a>
            <a href="${tools}image/exif.html">📷 EXIF</a>
            <a href="${tools}image/watermark.html">💧 Watermark</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="network">🌐 Network ▼</button>
        <div class="dropdown-content">
            <a href="${tools}network/my-ip.html">🔍 My IP</a>
            <a href="${tools}network/url-parser.html">🔗 URL Parser</a>
            <a href="${tools}network/subnet.html">🌐 Subnet</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="crypto">🔐 Crypto Tools ▼</button>
        <div class="dropdown-content">
            <a href="${tools}crypto/base32.html">🔤 Base32</a>
            <a href="${tools}crypto/morse.html">📻 Morse</a>
            <a href="${tools}crypto/bcrypt.html">🔒 Bcrypt</a>
            <a href="${tools}crypto/htpasswd.html">🔑 htpasswd</a>
        </div>
    </div>
</nav>`;
}

/**
 * 初始化 header 和 nav
 * 调用方式: initHeaderNav()
 */
function initHeaderNav(targetSelector, config) {
    const depth = detectDepth();
    const container = document.querySelector(targetSelector || 'header .container');

    if (!container) {
        console.error('Header container not found');
        return;
    }

    // 生成 header
    const headerDiv = document.createElement('div');
    headerDiv.innerHTML = generateHeader(config);
    container.appendChild(headerDiv.firstElementChild);

    // 生成 nav
    const navDiv = document.createElement('div');
    navDiv.innerHTML = generateNav(depth);
    container.appendChild(navDiv.firstElementChild);

    console.log('Header & Nav initialized, depth:', depth);
}

/**
 * 简化的初始化 - 只替换现有的占位符
 */
function replaceHeaderNav(selector, config) {
    const existingHeader = document.querySelector(selector);
    if (existingHeader) {
        const depth = detectDepth();
        existingHeader.innerHTML = generateHeader(config) + generateNav(depth);
        console.log('Replaced header, depth:', depth);
    }
}

// 导出到全局
window.HeaderComponent = {
    init: initHeaderNav,
    replace: replaceHeaderNav,
    config: HeaderConfig,
    detectDepth: detectDepth
};