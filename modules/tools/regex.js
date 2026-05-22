"use strict";
/**
 * Regex Tester with ReDoS protection
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRegex = testRegex;
exports.testRegexLegacy = testRegexLegacy;
exports.clearRegex = clearRegex;
const REGEX_TIMEOUT_MS = 2000;
const MAX_MATCHES = 1000;
/**
 * Test if pattern is potentially dangerous (simplified)
 */
function isDangerousRegex(pattern) {
    // Simple detection for problematic patterns
    if (pattern.includes('(*)') && pattern.includes('+'))
        return true;
    if (pattern.includes('(.') && pattern.includes('+)'))
        return true;
    return false;
}
/**
 * Show regex error in results area
 */
function showRegexError(message) {
    const results = document.getElementById('regex-results');
    if (results) {
        results.innerHTML = '<p style="color: #ef5350;">Error: ' + message + '</p>';
    }
    const matchCount = document.getElementById('match-count');
    if (matchCount)
        matchCount.textContent = '0 matches';
}
/**
 * Display matches in results area
 */
function displayMatches(matches) {
    const results = document.getElementById('regex-results');
    if (!results)
        return;
    if (matches.length === 0) {
        results.innerHTML = '<p>No matches found</p>';
        return;
    }
    let html = '';
    matches.forEach((match, i) => {
        html +=
            '<div class="match-item">' +
                '<strong>Match ' + (i + 1) + ':</strong> "' + match.text + '" at position ' + match.index +
                (match.groups.length > 0 ? '<br><small>Groups: ' + match.groups.join(', ') + '</small>' : '') +
                '</div>';
    });
    results.innerHTML = html;
}
/**
 * Main regex test function
 */
function testRegex(pattern, flags, testString) {
    if (!pattern) {
        showRegexError('Pattern is required');
        return;
    }
    const startTime = Date.now();
    const matches = [];
    let regex;
    try {
        regex = new RegExp(pattern, flags || 'g');
    }
    catch (error) {
        showRegexError(error.message);
        return;
    }
    if (isDangerousRegex(pattern)) {
        showRegexError('This regex pattern may cause performance issues');
        return;
    }
    try {
        let match;
        let lastIndex = -1;
        while ((match = regex.exec(testString)) !== null) {
            // Timeout protection
            if (Date.now() - startTime > REGEX_TIMEOUT_MS) {
                showRegexError('Regex execution timed out (>2s)');
                return;
            }
            // Match limit
            if (matches.length >= MAX_MATCHES) {
                showRegexError('More than ' + MAX_MATCHES + ' matches found, stopped');
                return;
            }
            // Prevent infinite loop
            if (match.index === lastIndex) {
                regex.lastIndex++;
                continue;
            }
            lastIndex = match.index;
            matches.push({
                text: match[0],
                index: match.index,
                groups: match.slice(1)
            });
            if (!flags?.includes('g'))
                break;
        }
        displayMatches(matches);
        const matchCount = document.getElementById('match-count');
        if (matchCount) {
            matchCount.textContent = matches.length + ' match' + (matches.length !== 1 ? 'es' : '');
        }
    }
    catch (error) {
        showRegexError(error.message);
    }
}
/**
 * Legacy wrapper for HTML onclick
 */
function testRegexLegacy() {
    const patternInput = document.getElementById('regex-pattern');
    const flagsInput = document.getElementById('regex-flags');
    const testStringInput = document.getElementById('regex-test-string');
    const pattern = patternInput?.value || '';
    const flags = flagsInput?.value || 'g';
    const testString = testStringInput?.value || '';
    testRegex(pattern, flags, testString);
}
/**
 * Clear regex inputs and results
 */
function clearRegex() {
    const patternInput = document.getElementById('regex-pattern');
    const flagsInput = document.getElementById('regex-flags');
    const testStringInput = document.getElementById('regex-test-string');
    const results = document.getElementById('regex-results');
    const matchCount = document.getElementById('match-count');
    if (patternInput)
        patternInput.value = '';
    if (flagsInput)
        flagsInput.value = '';
    if (testStringInput)
        testStringInput.value = '';
    if (results)
        results.innerHTML = '';
    if (matchCount)
        matchCount.textContent = '0 matches';
}
// Backward compatibility
window.testRegex = testRegexLegacy;
window.clearRegex = clearRegex;
