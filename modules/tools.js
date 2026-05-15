// ==================== All Other Tools Module ====================
// This file contains all remaining tool functions

// ==================== Regex Tester ====================
function testRegex() {
    const pattern = document.getElementById('regex-pattern').value;
    const flags = document.getElementById('regex-flags').value || 'g';
    const testString = document.getElementById('regex-test-string').value;
    
    try {
        const regex = new RegExp(pattern, flags);
        const matches = [];
        let match;
        
        while ((match = regex.exec(testString)) !== null) {
            matches.push({
                text: match[0],
                index: match.index,
                groups: match.slice(1)
            });
            if (!flags.includes('g')) break;
        }
        
        displayMatches(matches);
        const matchCount = document.getElementById('match-count');
        if (matchCount) {
            matchCount.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;
        }
    } catch (error) {
        const results = document.getElementById('regex-results');
        if (results) {
            results.innerHTML = `<p style="color: #ef5350;">Error: ${error.message}</p>`;
        }
    }
}

function displayMatches(matches) {
    const results = document.getElementById('regex-results');
    if (!results) return;
    
    if (matches.length === 0) {
        results.innerHTML = '<p>No matches found</p>';
        return;
    }
    
    let html = '';
    matches.forEach((match, i) => {
        html += `
            <div class="match-item">
                <strong>Match ${i + 1}:</strong> "${match.text}" at position ${match.index}
                ${match.groups.length > 0 ? '<br><small>Groups: ' + match.groups.join(', ') + '</small>' : ''}
            </div>
        `;
    });
    results.innerHTML = html;
}

function clearRegex() {
    document.getElementById('regex-pattern').value = '';
    document.getElementById('regex-flags').value = '';
    document.getElementById('regex-test-string').value = '';
    document.getElementById('regex-results').innerHTML = '';
    document.getElementById('match-count').textContent = '0 matches';
}

// ==================== Encode/Decode ====================
function encodeText() {
    const input = document.getElementById('encode-input').value;
    const type = document.getElementById('encode-type').value;
    let result = '';
    
    switch(type) {
        case 'base64':
            result = btoa(unescape(encodeURIComponent(input)));
            break;
        case 'url':
            result = encodeURIComponent(input);
            break;
        case 'html':
            result = input.replace(/[&<>"']/g, char => {
                const entities = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                };
                return entities[char];
            });
            break;
        case 'unicode':
            result = input.split('').map(char => {
                return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
            }).join('');
            break;
    }
    
    document.getElementById('encode-output').value = result;
}

function decodeText() {
    const input = document.getElementById('encode-input').value;
    const type = document.getElementById('encode-type').value;
    let result = '';
    
    try {
        switch(type) {
            case 'base64':
                result = decodeURIComponent(escape(atob(input)));
                break;
            case 'url':
                result = decodeURIComponent(input);
                break;
            case 'html':
                const textarea = document.createElement('textarea');
                textarea.innerHTML = input;
                result = textarea.value;
                break;
            case 'unicode':
                result = input.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
                    return String.fromCharCode(parseInt(grp, 16));
                });
                break;
        }
        document.getElementById('encode-output').value = result;
    } catch (error) {
        alert('Decode error: ' + error.message);
    }
}

function clearEncode() {
    document.getElementById('encode-input').value = '';
    document.getElementById('encode-output').value = '';
}

// ==================== Hash Generator ====================
async function generateHash() {
    const input = document.getElementById('hash-input').value;
    const algorithm = document.getElementById('hash-algorithm').value;
    
    if (!input) {
        alert('Please enter some text');
        return;
    }
    
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    let hashBuffer;
    if (algorithm === 'MD5') {
        // MD5 not natively supported by Web Crypto API
        document.getElementById('hash-output').value = await md5(input);
        return;
    } else {
        hashBuffer = await crypto.subtle.digest(algorithm, data);
    }
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    document.getElementById('hash-output').value = hashHex;
}

async function md5(string) {
    // Simple MD5 implementation would go here
    // For now, using a placeholder
    return 'MD5 requires external library';
}

function clearHash() {
    document.getElementById('hash-input').value = '';
    document.getElementById('hash-output').value = '';
}

// ==================== Generators ====================
function generateUUIDs() {
    const count = parseInt(document.getElementById('uuid-count').value) || 1;
    const uuids = [];
    
    for (let i = 0; i < count; i++) {
        uuids.push(generateUUID());
    }
    
    document.getElementById('uuid-output').value = uuids.join('\n');
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generatePassword() {
    const length = parseInt(document.getElementById('password-length').value) || 16;
    const useUppercase = document.getElementById('pwd-uppercase').checked;
    const useLowercase = document.getElementById('pwd-lowercase').checked;
    const useNumbers = document.getElementById('pwd-numbers').checked;
    const useSymbols = document.getElementById('pwd-symbols').checked;
    
    let charset = '';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!charset) {
        alert('Please select at least one character type');
        return;
    }
    
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }
    
    document.getElementById('password-output').value = password;
}

function generateRandomString() {
    const length = parseInt(document.getElementById('random-length').value) || 16;
    const chars = document.getElementById('random-chars').value;
    
    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
    }
    
    document.getElementById('random-output').value = result;
}

// ==================== Time & Cron ====================
function convertTimestamp() {
    const timestamp = document.getElementById('timestamp-input').value;
    const isMilliseconds = timestamp.length > 10;
    const date = new Date(isMilliseconds ? parseInt(timestamp) : parseInt(timestamp) * 1000);
    
    document.getElementById('timestamp-human').textContent = date.toString();
    document.getElementById('timestamp-iso').textContent = date.toISOString();
    document.getElementById('timestamp-utc').textContent = date.toUTCString();
}

function setCurrentTime() {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    document.getElementById('timestamp-input').value = timestamp;
    convertTimestamp();
}

function generateCron() {
    const minute = document.getElementById('cron-minute').value || '*';
    const hour = document.getElementById('cron-hour').value || '*';
    const day = document.getElementById('cron-day').value || '*';
    const month = document.getElementById('cron-month').value || '*';
    const weekday = document.getElementById('cron-weekday').value || '*';
    
    const expression = `${minute} ${hour} ${day} ${month} ${weekday}`;
    document.getElementById('cron-expression').textContent = expression;
    
    const description = describeCron(minute, hour, day, month, weekday);
    document.getElementById('cron-description').textContent = description;
}

function describeCron(minute, hour, day, month, weekday) {
    if (minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
        return 'Every minute';
    }
    if (minute === '0' && hour === '0' && day === '*' && month === '*' && weekday === '*') {
        return 'Every day at midnight';
    }
    if (minute === '0' && hour === '*/6' && day === '*' && month === '*' && weekday === '*') {
        return 'Every 6 hours';
    }
    if (minute === '*/15' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
        return 'Every 15 minutes';
    }
    if (minute === '0' && hour === '9' && day === '*' && month === '*' && weekday === '1') {
        return 'Monday at 9 AM';
    }
    return 'Custom schedule';
}

function setCronPreset(expression, description) {
    const [minute, hour, day, month, weekday] = expression.split(' ');
    document.getElementById('cron-minute').value = minute;
    document.getElementById('cron-hour').value = hour;
    document.getElementById('cron-day').value = day;
    document.getElementById('cron-month').value = month;
    document.getElementById('cron-weekday').value = weekday;
    generateCron();
}

// ==================== Utility Functions ====================
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value || element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}
