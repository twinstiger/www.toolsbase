"use strict";
/**
 * UUID Generator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = generateUUID;
exports.generateUUIDs = generateUUIDs;
exports.generateUUIDsLegacy = generateUUIDsLegacy;
exports.copyToClipboard = copyToClipboard;
/**
 * Generate a single UUID v4
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * Generate multiple UUIDs
 */
function generateUUIDs() {
    const countInput = document.getElementById('uuid-count');
    const output = document.getElementById('uuid-output');
    if (!output)
        return;
    const count = parseInt(countInput?.value || '1') || 1;
    const uuids = [];
    for (let i = 0; i < count; i++) {
        uuids.push(generateUUID());
    }
    output.value = uuids.join('\n');
}
/**
 * Legacy wrapper
 */
function generateUUIDsLegacy() {
    const input = document.getElementById('uuid-count');
    const output = document.getElementById('uuid-output');
    if (!output)
        return;
    const count = parseInt(input?.value || '1') || 1;
    const uuids = [];
    for (let i = 0; i < count; i++) {
        uuids.push(generateUUID());
    }
    output.value = uuids.join('\n');
}
/**
 * Copy to clipboard
 */
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element?.value || '';
    navigator.clipboard.writeText(text).then(() => {
        const btn = window.event?.target;
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    }).catch((err) => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}
// Backward compatibility
window.generateUUIDs = generateUUIDsLegacy;
window.generateUUID = generateUUID;
window.copyToClipboard = copyToClipboard;
