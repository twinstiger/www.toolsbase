"use strict";
/**
 * Hash Generator - 使用 CryptoJS 库的 MD5 实现
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = generateHash;
exports.clearHash = clearHash;
function generateHash() {
    const input = document.getElementById('hash-input');
    const algorithmSelect = document.getElementById('hash-algorithm');
    const output = document.getElementById('hash-output');
    if (!input?.value) {
        alert('Please enter some text');
        return;
    }
    try {
        const algorithm = algorithmSelect?.value || 'SHA256';
        if (typeof CryptoJS === 'undefined') {
            // 回退到简单实现
            throw new Error('CryptoJS not loaded');
        }
        const hash = CryptoJS[algorithm](input.value).toString();
        if (output) {
            output.value = hash;
        }
    }
    catch (error) {
        alert('Hash generation failed: ' + error.message);
    }
}
function clearHash() {
    const input = document.getElementById('hash-input');
    const output = document.getElementById('hash-output');
    if (input)
        input.value = '';
    if (output)
        output.value = '';
}
// Export to global
window.generateHash = generateHash;
window.clearHash = clearHash;
