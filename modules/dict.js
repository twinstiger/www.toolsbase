/**
 * Dict Module - Dictionary & Language Tools
 * Contains: Dictionary lookup, synonyms, spell check, word level, abbreviations, US/UK converter, frequency counter
 */

// Local cache for offline support
const DictCache = {
    words: JSON.parse(localStorage.getItem('dict_cache') || '{}'),
    abbrs: JSON.parse(localStorage.getItem('dict_abbr_cache') || '{}'),

    save() {
        try {
            localStorage.setItem('dict_cache', JSON.stringify(this.words));
            localStorage.setItem('dict_abbr_cache', JSON.stringify(this.abbrs));
        } catch (e) {
            console.warn('Dict cache save failed:', e);
        }
    },

    get(key) {
        return this.words[key] || null;
    },

    set(key, value) {
        this.words[key] = value;
        this.save();
    }
};

// Tab switching
function showTab(tabName, event) {
    // Hide all panels
    document.querySelectorAll('.dict-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    // Deactivate all tabs
    document.querySelectorAll('.dict-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    // Activate selected panel
    const panel = document.getElementById('tab-' + tabName);
    if (panel) panel.classList.add('active');
    // Activate selected tab button
    if (event) {
        (event.currentTarget || event.target).classList.add('active');
    } else {
        // Fallback: find the button with this onclick
        const btns = document.querySelectorAll('.dict-tab');
        btns.forEach(btn => {
            if (btn.getAttribute('onclick')?.includes(tabName)) {
                btn.classList.add('active');
            }
        });
    }
}

// 1. Dictionary Lookup
async function lookupWord() {
    const word = document.getElementById('lookup-input')?.value?.trim();
    const resultDiv = document.getElementById('lookup-result');

    if (!word) {
        alert('Please enter a word');
        return;
    }

    if (!resultDiv) return;
    resultDiv.innerHTML = '<div class="loading">Looking up...</div>';

    // Check cache first
    const cached = DictCache.get(word.toLowerCase());
    if (cached) {
        resultDiv.innerHTML = cached + '<p style="font-size:12px;color:#999">(cached)</p>';
        return;
    }

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (!response.ok) {
            throw new Error('Word not found');
        }

        const data = await response.json();
        const entry = data[0];

        let html = `<div class="word-header"><h2 class="word-title">${entry.word}</h2>`;
        html += entry.phonetic ? `<p class="phonetic">${entry.phonetic}</p>` : '';
        html += '</div>';

        entry.meanings.forEach(meaning => {
            html += `<div class="definition-section"><span class="pos-tag">${meaning.partOfSpeech}</span><ul class="definition-list">`;
            meaning.definitions.slice(0, 5).forEach(def => {
                html += `<li class="definition-item"><strong>${def.definition}</strong>${def.example ? `<p class="example">"${def.example}"</p>` : ''}</li>`;
            });
            html += '</ul></div>';
        });

        resultDiv.innerHTML = html;
        DictCache.set(word.toLowerCase(), html);

    } catch (error) {
        resultDiv.innerHTML = `<div class="error-message"><strong>Word not found:</strong> ${error.message}<br>Please check the spelling and try again.</div>`;
    }
}

// 2. Synonyms & Antonyms
async function findSynonyms() {
    const word = document.getElementById('synonym-input')?.value?.trim();
    const resultDiv = document.getElementById('synonym-result');

    if (!word) {
        alert('Please enter a word');
        return;
    }

    if (!resultDiv) return;
    resultDiv.innerHTML = '<div class="loading">Searching...</div>';

    try {
        const response = await fetch(`https://api.datamuse.com/?sl=${word}`);
        const data = await response.json();

        let synonyms = [], antonyms = [];

        if (data && Array.isArray(data)) {
            data.forEach(item => {
                if (item.word && item.relationshipTypes) {
                    if (item.relationshipTypes.includes('synonym')) synonyms.push(item.word);
                    if (item.relationshipTypes.includes('antonym')) antonyms.push(item.word);
                }
            });
        }

        let html = `<h3 style="margin-bottom:20px;">Results for "${word}"</h3>`;

        if (synonyms.length > 0) {
            html += '<h4 style="margin:20px 0 10px 0;">Synonyms:</h4><div>';
            synonyms.slice(0, 20).forEach(syn => html += `<span class="synonym-tag">${syn}</span>`);
            html += '</div>';
        }

        if (antonyms.length > 0) {
            html += '<h4 style="margin:20px 0 10px 0;">Antonyms:</h4><div>';
            antonyms.slice(0, 20).forEach(ant => html += `<span class="antonym-tag">${ant}</span>`);
            html += '</div>';
        }

        if (synonyms.length === 0 && antonyms.length === 0) {
            html += '<p>No synonyms or antonyms found.</p>';
        }

        resultDiv.innerHTML = html;

    } catch (error) {
        resultDiv.innerHTML = `<div class="error-message"><strong>Error:</strong> Failed to fetch synonyms - check your internet connection.<br>Try again later.</div>`;
    }
}

// 3. Spell Checker
async function checkSpelling() {
    const text = document.getElementById('spell-input')?.value?.trim();
    const resultDiv = document.getElementById('spell-result');

    if (!text) {
        alert('Please enter text to check');
        return;
    }

    if (!resultDiv) return;
    resultDiv.innerHTML = '<div class="loading">Checking spelling...</div>';

    try {
        const response = await fetch(`https://api.languagetool.org/v2/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `text=${encodeURIComponent(text)}&language=en-US`
        });

        const data = await response.json();

        if (!data.matches || data.matches.length === 0) {
            resultDiv.innerHTML = '<div class="spell-correct">✓ No spelling errors found! Your text looks good.</div>';
        } else {
            let html = '<h4>Found Issues:</h4>';
            data.matches.forEach(match => {
                html += `<div class="spell-wrong" style="margin-bottom:15px;"><strong>Issue:</strong> "${match.context?.text || ''}"<br><strong>Message:</strong> ${match.message}${
                    match.replacements?.length > 0 ? `<br><strong>Suggestions:</strong> ${match.replacements.slice(0, 5).map(r =>
                        `<button class="suggestion-btn" onclick="document.getElementById('spell-input').value='${r.value}'; checkSpelling()">${r.value}</button>`
                    ).join('')}` : ''
                }</div>`;
            });
            resultDiv.innerHTML = html;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error-message"><strong>Error:</strong> Failed to check spelling - you may be offline.<br>Please try again later.</div>`;
    }
}

// 4. Word Level Check (CEFR)
function checkWordLevel() {
    const input = document.getElementById('level-input')?.value?.trim();
    const resultDiv = document.getElementById('level-result');

    if (!input || !resultDiv) return;

    const words = input.split(',').map(w => w.trim()).filter(w => w);

    // CEFR word levels (sample)
    const wordLevels = {
        'hello': 'A1', 'goodbye': 'A1', 'please': 'A1', 'thank': 'A1', 'yes': 'A1', 'no': 'A1',
        'water': 'A1', 'food': 'A1', 'house': 'A1', 'book': 'A1', 'time': 'A1', 'work': 'A1',
        'learn': 'A2', 'study': 'A2', 'write': 'A2', 'read': 'A2', 'speak': 'A2', 'listen': 'A2',
        'understand': 'B1', 'explain': 'B1', 'describe': 'B1', 'develop': 'B1', 'organize': 'B1',
        'calculate': 'B2', 'determine': 'B2', 'establish': 'B2', 'communicate': 'B2', 'demonstrate': 'B2',
        'acknowledge': 'C1', 'appropriate': 'C1', 'circumstances': 'C1', 'consequently': 'C1', 'fundamental': 'C1',
        'abandon': 'C2', 'aberration': 'C2', 'accommodate': 'C2', 'acquiesce': 'C2', 'admonish': 'C2'
    };

    let html = '<h4>Word Levels (CEFR):</h4>';
    words.forEach(word => {
        const level = wordLevels[word.toLowerCase()] || 'Unknown';
        const levelClass = 'level-' + level.toLowerCase();
        html += `<div style="margin:10px 0;padding:10px;background:white;border-radius:8px;"><strong>${word}</strong>: <span class="level-badge ${levelClass}">${level}</span></div>`;
    });

    html += `<div style="margin-top:20px;padding:15px;background:#f5f5f5;border-radius:8px;"><h5 style="margin:0 0 10px 0;">CEFR Levels:</h5>
        <span class="level-badge level-a1">A1</span> <span class="level-badge level-a2">A2</span>
        <span class="level-badge level-b1">B1</span> <span class="level-badge level-b2">B2</span>
        <span class="level-badge level-c1">C1</span> <span class="level-badge level-c2">C2</span></div>`;

    resultDiv.innerHTML = html;
}

// 5. Tech Abbreviation Dictionary
function searchAbbreviation() {
    const query = document.getElementById('abbr-input')?.value?.trim()?.toUpperCase();
    const resultDiv = document.getElementById('abbr-result');

    if (!query) {
        alert('Please enter an abbreviation to search');
        return;
    }

    if (!resultDiv) return;

    const techAbbrs = {
        'API': { full: 'Application Programming Interface', desc: 'A set of protocols for building software' },
        'HTML': { full: 'HyperText Markup Language', desc: 'Standard markup for web pages' },
        'CSS': { full: 'Cascading Style Sheets', desc: 'Style sheet language for presentation' },
        'JSON': { full: 'JavaScript Object Notation', desc: 'Lightweight data-interchange format' },
        'XML': { full: 'eXtensible Markup Language', desc: 'Markup language for documents' },
        'HTTP': { full: 'HyperText Transfer Protocol', desc: 'Foundation of WWW data communication' },
        'HTTPS': { full: 'HTTP Secure', desc: 'HTTP with security features' },
        'URL': { full: 'Uniform Resource Locator', desc: 'Web resource reference' },
        'DNS': { full: 'Domain Name System', desc: 'Hierarchical naming system' },
        'IP': { full: 'Internet Protocol', desc: 'Communications protocol' },
        'TCP': { full: 'Transmission Control Protocol', desc: 'Network conversation establishment' },
        'UDP': { full: 'User Datagram Protocol', desc: 'Messages exchange protocol' },
        'FTP': { full: 'File Transfer Protocol', desc: 'File transfer network protocol' },
        'SSH': { full: 'Secure Shell', desc: 'Cryptographic network protocol' },
        'SSL': { full: 'Secure Sockets Layer', desc: 'Encrypted link technology' },
        'TLS': { full: 'Transport Layer Security', desc: 'Communications security protocol' },
        'REST': { full: 'Representational State Transfer', desc: 'Software architectural style' },
        'SQL': { full: 'Structured Query Language', desc: 'Data management language' },
        'NoSQL': { full: 'Not Only SQL', desc: 'Non-relational database approach' },
        'DOM': { full: 'Document Object Model', desc: 'Cross-platform interface' },
        'AJAX': { full: 'Asynchronous JavaScript and XML', desc: 'Web development techniques' },
        'PWA': { full: 'Progressive Web App', desc: 'Software delivered through web' },
        'CDN': { full: 'Content Delivery Network', desc: 'Distributed proxy servers' },
        'VPN': { full: 'Virtual Private Network', desc: 'Network tunneling' },
        'CPU': { full: 'Central Processing Unit', desc: 'Computer processor' },
        'GPU': { full: 'Graphics Processing Unit', desc: 'Graphics rendering circuit' },
        'RAM': { full: 'Random Access Memory', desc: 'Computer data storage' },
        'OS': { full: 'Operating System', desc: 'System software' },
        'SDK': { full: 'Software Development Kit', desc: 'Development tools package' },
        'AI': { full: 'Artificial Intelligence', desc: 'Machine intelligence' },
        'ML': { full: 'Machine Learning', desc: 'AI subset' },
        'IoT': { full: 'Internet of Things', desc: 'Physical devices with electronics' }
    };

    let results = [];
    for (const [abbr, info] of Object.entries(techAbbrs)) {
        if (abbr.includes(query) || query.includes(abbr)) {
            results.push({ abbr, ...info });
        }
    }

    let html = '';
    if (results.length > 0) {
        results.forEach(item => {
            html += `<div class="abbr-item"><div class="abbr-term">${item.abbr}</div><div style="color:#4caf50;font-weight:600;margin:5px 0;">${item.full}</div><div class="abbr-meaning">${item.desc}</div></div>`;
        });
    } else {
        html = `<div class="error-message">No abbreviations found for "${query}".<br>Try common terms like API, HTML, CSS, etc.</div>`;
    }

    resultDiv.innerHTML = html;
}

// 6. US/UK English Converter
function convertEnglish() {
    const text = document.getElementById('converter-input')?.value?.trim();
    const resultDiv = document.getElementById('converter-result');

    if (!text) {
        alert('Please enter text to convert');
        return;
    }

    if (!resultDiv) return;

    const direction = document.querySelector('input[name="convert-direction"]:checked')?.value || 'us-to-uk';

    const conversions = {
        'us-to-uk': {
            'color':'colour','honor':'honour','favor':'favour','labor':'labour','neighbor':'neighbour','behavior':'behaviour',
            'center':'centre','meter':'metre','liter':'litre','theater':'theatre','organize':'organise','realize':'realise',
            'defense':'defence','offense':'offence','license':'licence','practice':'practise','traveling':'travelling'
        },
        'uk-to-us': {
            'colour':'color','honour':'honor','favour':'favor','labour':'labor','neighbour':'neighbor','behaviour':'behavior',
            'centre':'center','metre':'meter','litre':'liter','theatre':'theater','organise':'organize','realise':'realize',
            'defence':'defense','offence':'offense','licence':'license','practise':'practice','travelling':'traveling'
        }
    };

    const map = conversions[direction];
    let converted = text;
    let replacements = [];

    for (const [from, to] of Object.entries(map)) {
        const regex = new RegExp(`\\b${from}\\b`, 'gi');
        if (converted.match(regex)) {
            converted = converted.replace(regex, to);
            replacements.push(`${from} → ${to}`);
        }
    }

    let html = `<h4>Converted Text:</h4><div style="background:white;padding:15px;border-radius:8px;margin-bottom:20px;">${converted}</div>`;

    if (replacements.length > 0) {
        html += `<h4>Replacements Made:</h4><div style="background:#e8f5e9;padding:15px;border-radius:8px;">${replacements.map(r => `<div style="margin:5px 0;">✓ ${r}</div>`).join('')}</div>`;
    } else {
        html += '<div class="spell-correct">✓ No conversions needed.</div>';
    }

    resultDiv.innerHTML = html;
}

// 7. Word Frequency Counter
function countFrequency() {
    const text = document.getElementById('frequency-input')?.value?.trim();
    const resultDiv = document.getElementById('frequency-result');

    if (!text) {
        alert('Please enter text to analyze');
        return;
    }

    if (!resultDiv) return;

    const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
    const wordCount = {};

    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const sorted = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
    const total = words.length;
    const unique = Object.keys(wordCount).length;

    let html = `<div style="background:white;padding:15px;border-radius:8px;margin-bottom:20px;"><h4 style="margin:0 0 10px 0;">Statistics:</h4><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;"><div><strong>Total Words:</strong> ${total}</div><div><strong>Unique Words:</strong> ${unique}</div></div></div><h4>Top Words by Frequency:</h4>`;

    sorted.slice(0, 30).forEach(([word, count]) => {
        const pct = ((count / total) * 100).toFixed(1);
        const barWidth = Math.max(pct * 3, 30);
        html += `<div style="margin:8px 0;"><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><strong>${word}</strong><span>${count} (${pct}%)</span></div><div class="freq-bar" style="width:${barWidth}px;">${count}</div></div>`;
    });

    resultDiv.innerHTML = html;
}

// Export to global
window.DictModule = {
    showTab,
    lookupWord,
    findSynonyms,
    checkSpelling,
    checkWordLevel,
    searchAbbreviation,
    convertEnglish,
    countFrequency
};

// Backward compatibility - mount individual functions
window.showTab = showTab;
window.lookupWord = lookupWord;
window.findSynonyms = findSynonyms;
window.checkSpelling = checkSpelling;
window.checkWordLevel = checkWordLevel;
window.searchAbbreviation = searchAbbreviation;
window.convertEnglish = convertEnglish;
window.countFrequency = countFrequency;

console.log('Dict module loaded');