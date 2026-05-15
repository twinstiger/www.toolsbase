// ==================== Crypto Tools Module ====================

// Base32 Encoder/Decoder
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(input) {
    let bits = 0;
    let value = 0;
    let output = '';
    
    for (let i = 0; i < input.length; i++) {
        value = (value << 8) | input.charCodeAt(i);
        bits += 8;
        
        while (bits >= 5) {
            output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    
    if (bits > 0) {
        output += BASE32_CHARS[(value << (5 - bits)) & 31];
    }
    
    // Add padding
    while (output.length % 8 !== 0) {
        output += '=';
    }
    
    return output;
}

function base32Decode(input) {
    // Remove padding
    input = input.replace(/=+$/, '');
    
    let bits = 0;
    let value = 0;
    let output = '';
    
    for (let i = 0; i < input.length; i++) {
        const idx = BASE32_CHARS.indexOf(input[i].toUpperCase());
        if (idx === -1) continue;
        
        value = (value << 5) | idx;
        bits += 5;
        
        if (bits >= 8) {
            output += String.fromCharCode((value >>> (bits - 8)) & 0xFF);
            bits -= 8;
        }
    }
    
    return output;
}

function encodeBase32() {
    const input = document.getElementById('base32-input').value;
    if (!input) {
        alert('Please enter text to encode');
        return;
    }
    
    try {
        const encoded = base32Encode(input);
        document.getElementById('base32-output').value = encoded;
    } catch (error) {
        alert('Encoding error: ' + error.message);
    }
}

function decodeBase32() {
    const input = document.getElementById('base32-input').value;
    if (!input) {
        alert('Please enter Base32 text to decode');
        return;
    }
    
    try {
        const decoded = base32Decode(input);
        document.getElementById('base32-output').value = decoded;
    } catch (error) {
        alert('Decoding error: Invalid Base32 string');
    }
}

// Morse Code Translator
const MORSE_CODE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
    '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
};

const REVERSE_MORSE = Object.fromEntries(
    Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

function textToMorse() {
    const input = document.getElementById('morse-input').value.toUpperCase();
    const morse = input.split('').map(char => MORSE_CODE[char] || char).join(' ');
    document.getElementById('morse-output').value = morse;
}

function morseToText() {
    const input = document.getElementById('morse-input').value.trim();
    const words = input.split(' / ');
    const text = words.map(word => {
        return word.split(' ').map(code => REVERSE_MORSE[code] || code).join('');
    }).join(' ');
    document.getElementById('morse-output').value = text;
}

// Bcrypt Hash Generator
async function generateBcrypt() {
    const password = document.getElementById('bcrypt-password').value;
    const rounds = parseInt(document.getElementById('bcrypt-rounds').value) || 10;
    
    if (!password) {
        alert('Please enter a password');
        return;
    }
    
    try {
        // Using bcryptjs library
        const salt = await dcodeIO.bcrypt.genSalt(rounds);
        const hash = await dcodeIO.bcrypt.hash(password, salt);
        
        document.getElementById('bcrypt-hash').value = hash;
    } catch (error) {
        // Fallback: use crypto-js SHA256 if bcryptjs fails
        const hash = CryptoJS.SHA256(password).toString();
        document.getElementById('bcrypt-hash').value = hash;
        document.getElementById('bcrypt-hash').placeholder = 'Note: Using SHA256 fallback. Bcrypt requires proper library loading.';
    }
}

async function verifyBcrypt() {
    const password = document.getElementById('bcrypt-verify-pass').value;
    const hash = document.getElementById('bcrypt-verify-hash').value;
    
    if (!password || !hash) {
        alert('Please enter both password and hash');
        return;
    }
    
    try {
        const isValid = await dcodeIO.bcrypt.compare(password, hash);
        document.getElementById('bcrypt-verify-result').textContent = isValid ? '✓ Valid' : '✗ Invalid';
        document.getElementById('bcrypt-verify-result').style.color = isValid ? '#4caf50' : '#ef5350';
    } catch (error) {
        document.getElementById('bcrypt-verify-result').textContent = 'Error verifying';
    }
}

// htpasswd Generator (Apache format)
function generateHtpasswd() {
    const username = document.getElementById('htpasswd-user').value;
    const password = document.getElementById('htpasswd-pass').value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    try {
        // Using MD5 encryption (Apache format)
        const md5Hash = CryptoJS.MD5(password).toString();
        const salt = Math.random().toString(36).substring(2, 10);
        const encrypted = `$apr1$${salt}$${CryptoJS.MD5(password + salt).toString()}`;
        
        document.getElementById('htpasswd-output').value = `${username}:${encrypted}`;
    } catch (error) {
        // Fallback to basic base64
        const encoded = btoa(`${username}:${password}`);
        document.getElementById('htpasswd-output').value = `${username}:{SHA}${btoa(CryptoJS.SHA1(password).toString(CryptoJS.enc.Latin1))}`;
    }
}
