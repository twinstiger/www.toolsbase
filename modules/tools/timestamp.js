"use strict";
/**
 * Timestamp Converter
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTimestamp = convertTimestamp;
exports.setCurrentTime = setCurrentTime;
/**
 * Convert timestamp to human readable format
 */
function convertTimestamp() {
    const input = document.getElementById('timestamp-input');
    const human = document.getElementById('timestamp-human');
    const iso = document.getElementById('timestamp-iso');
    const utc = document.getElementById('timestamp-utc');
    if (!input?.value)
        return;
    const timestamp = input.value;
    const isMilliseconds = timestamp.length > 10;
    const date = new Date(isMilliseconds ? parseInt(timestamp) : parseInt(timestamp) * 1000);
    if (human)
        human.textContent = date.toString();
    if (iso)
        iso.textContent = date.toISOString();
    if (utc)
        utc.textContent = date.toUTCString();
}
/**
 * Set current timestamp
 */
function setCurrentTime() {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    const input = document.getElementById('timestamp-input');
    if (input) {
        input.value = timestamp.toString();
        convertTimestamp();
    }
}
// Backward compatibility
window.convertTimestamp = convertTimestamp;
window.setCurrentTime = setCurrentTime;
