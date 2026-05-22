"use strict";
/**
 * Encode/Decode functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeText = encodeText;
exports.decodeText = decodeText;
exports.clearEncode = clearEncode;
/**
 * Encode text with selected encoding
 */
function encodeText() {
    const input = document.getElementById('encode-input');
    const typeSelect = document.getElementById('encode-type');
    const output = document.getElementById('encode-output');
    if (!input?.value || !output)
        return;
    const type = typeSelect?.value || 'base64';
    let result = '';
    switch (type) {
        case 'base64':
            try {
                const encoder = new TextEncoder();
                const bytes = encoder.encode(input.value);
                let binary = '';
                for (let i = 0; i < bytes.length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                result = btoa(binary);
            }
            catch {
                result = 'Encoding error';
            }
            break;
        case 'url':
            result = encodeURIComponent(input.value);
            break;
        case 'html':
            result = input.value.replace(/[&<>"']/g, (char) => {
                const entities = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                };
                return entities[char] || char;
            });
            break;
        case 'unicode':
            result = input.value.split('').map(char => {
                return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
            }).join('');
            break;
    }
    output.value = result;
}
/**
 * Decode text with selected encoding
 */
function decodeText() {
    const input = document.getElementById('encode-input');
    const typeSelect = document.getElementById('encode-type');
    const output = document.getElementById('encode-output');
    if (!input?.value || !output)
        return;
    const type = typeSelect?.value || 'base64';
    let result = '';
    try {
        switch (type) {
            case 'base64':
                try {
                    const binary = atob(input.value);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) {
                        bytes[i] = binary.charCodeAt(i);
                    }
                    const decoder = new TextDecoder();
                    result = decoder.decode(bytes);
                }
                catch {
                    throw new Error('Invalid Base64 string');
                }
                break;
            case 'url':
                result = decodeURIComponent(input.value);
                break;
            case 'html':
                const textarea = document.createElement('textarea');
                textarea.innerHTML = input.value;
                result = textarea.value;
                break;
            case 'unicode':
                result = input.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, grp) => {
                    return String.fromCharCode(parseInt(grp, 16));
                });
                break;
        }
        output.value = result;
    }
    catch (error) {
        alert('Decode error: ' + error.message);
    }
}
/**
 * Clear encode input/output
 */
function clearEncode() {
    const input = document.getElementById('encode-input');
    const output = document.getElementById('encode-output');
    if (input)
        input.value = '';
    if (output)
        output.value = '';
}
// Backward compatibility
window.encodeText = encodeText;
window.decodeText = decodeText;
window.clearEncode = clearEncode;
