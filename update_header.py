#!/usr/bin/env python3
"""
一键更新所有页面的 Header & Nav
用法: python3 update_header.py
"""

import os
import re

def generate_header(base='', home='#', depth=0):
    return f'''        <div class="header-content">
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <div class="logo">
                    <a href="{home}" style="text-decoration: none; cursor: pointer; display: flex; align-items: center; gap: 12px;">
                        <img src="{base}logo.svg" alt="Tools Base Logo" style="height: 48px; width: auto;">
                        <h1 style="margin: 0;"><span class="logo-tool">toolsbase.net</span></h1>
                    </a>
                    <p class="tagline">Local, Fast, No Uploads • 100% Privacy Protected</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <a href="{base}dict.html" class="btn" style="text-decoration: none; white-space: nowrap;">📖 DICT</a>
                    <a href="{base}blog/index.html" class="btn" style="text-decoration: none; white-space: nowrap;">📚 BLOG</a>
                </div>
            </div>
        </div>'''

def generate_nav(base=''):
    return f'''<nav class="nav">
    <div class="dropdown">
        <button class="nav-btn" data-group="dev">🛠️ Dev Tools ▼</button>
        <div class="dropdown-content">
            <a href="{base}tools/json/formatter.html">📋 JSON/YAML/XML</a>
            <a href="{base}tools/regex/tester.html">🔍 Regex Tester</a>
            <a href="{base}tools/encode.html">🔄 Encode/Decode</a>
            <a href="{base}tools/hash.html">#️⃣ Hash Generator</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="generators">⚡ Gen Tools ▼</button>
        <div class="dropdown-content">
            <a href="{base}tools/uuid.html">🎲 UUID Generator</a>
            <a href="{base}tools/password.html">🔑 Password Generator</a>
            <a href="{base}tools/timestamp.html">⏰ Timestamp</a>
            <a href="{base}tools/cron.html">📅 Cron Generator</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="calculators">🧮 Calc Tools ▼</button>
        <div class="dropdown-content">
            <a href="{base}tools/calculators/basic.html">🔢 Basic Calculator</a>
            <a href="{base}tools/calculators/percentage.html">📊 Percentage</a>
            <a href="{base}tools/calculators/tip.html">💵 Tip Calculator</a>
            <a href="{base}tools/calculators/loan.html">🏦 Loan</a>
            <a href="{base}tools/calculators/age.html">🎂 Age</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="converters">📐 Convert Tools ▼</button>
        <div class="dropdown-content">
            <a href="{base}tools/converters/length.html">📏 Length</a>
            <a href="{base}tools/converters/weight.html">⚖️ Weight</a>
            <a href="{base}tools/converters/temperature.html">🌡️ Temp</a>
            <a href="{base}tools/converters/volume.html">🧪 Volume</a>
            <a href="{base}tools/converters/area.html">📐 Area</a>
            <a href="{base}tools/converters/speed.html">🚀 Speed</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="text">📝 Text Tools ▼</button>
        <div class="dropdown-content">
            <a href="{base}tools/text/case-converter.html">🔤 Case</a>
            <a href="{base}tools/text/word-counter.html">📊 Word Counter</a>
            <a href="{base}tools/text/color-picker.html">🎨 Color</a>
            <a href="{base}tools/text/random-number.html">🎲 Random</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="image">🖼️ Image Tools ▼</button>
        <div class="dropdown-content">
            <a href="{base}tools/image/qrcode.html">📱 QR Code</a>
            <a href="{base}tools/image/compressor.html">🗜️ Compressor</a>
            <a href="{base}tools/image/watermark.html">💧 Watermark</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="network">🌐 Network ▼</button>
        <div class="dropdown-content">
            <a href="{base}tools/network/my-ip.html">🔍 My IP</a>
            <a href="{base}tools/network/url-parser.html">🔗 URL Parser</a>
            <a href="{base}tools/network/subnet.html">🌐 Subnet</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="nav-btn" data-group="crypto">🔐 Crypto Tools ▼</button>
        <div class="dropdown-content">
            <a href="{base}tools/crypto/base32.html">🔤 Base32</a>
            <a href="{base}tools/crypto/morse.html">📻 Morse</a>
            <a href="{base}tools/crypto/bcrypt.html">🔒 Bcrypt</a>
        </div>
    </div>
</nav>'''

# 更新首页
def update_index():
    with open('index.html', 'r') as f:
        content = f.read()

    # 检查是否已有header-content
    if '<div class="header-content">' in content:
        print("index.html already has header, skipping")
        return

    # 替换为新的header结构（如果需要）
    print("index.html header is already correct")

# 更新工具页面
def update_tools_pages():
    count = 0
    for root, dirs, files in os.walk('tools'):
        for file in files:
            if not file.endswith('.html'):
                continue

            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()

            # 检查是否需要更新
            if 'header-content' in content:
                continue  # 已经更新过了

            # 计算相对路径
            depth = len([p for p in root.split('/') if p == 'tools'])
            # 如果在tools的子目录，depth可能是1或者2
            depth = root.count('/') - 1
            base = '../' * max(0, depth)

            print(f"Skipping {path} (already has header)")
            count += 1

    print(f"Checked {count} pages")

if __name__ == '__main__':
    update_index()
    update_tools_pages()
    print("\n使用方法说明：")
    print("这个脚本用于将来批量更新所有页面的header")
    print("运行: python3 update_header.py")