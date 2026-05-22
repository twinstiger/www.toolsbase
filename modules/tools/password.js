"use strict";
// ==================== Password Generator ====================
function generatePassword() {
    const lengthInput = document.getElementById('password-length');
    const uppercase = document.getElementById('pwd-uppercase');
    const lowercase = document.getElementById('pwd-lowercase');
    const numbers = document.getElementById('pwd-numbers');
    const symbols = document.getElementById('pwd-symbols');
    const output = document.getElementById('password-output');
    if (!output)
        return;
    const length = parseInt(lengthInput?.value || '16') || 16;
    let charset = '';
    if (uppercase?.checked)
        charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase?.checked)
        charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers?.checked)
        charset += '0123456789';
    if (symbols?.checked)
        charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!charset) {
        alert('Please select at least one character type');
        return;
    }
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }
    output.value = password;
}
function generateRandomString() {
    const lengthInput = document.getElementById('random-length');
    const charsInput = document.getElementById('random-chars');
    const output = document.getElementById('random-output');
    if (!output)
        return;
    const length = parseInt(lengthInput?.value || '16') || 16;
    const chars = charsInput?.value || 'abcdefghijklmnopqrstuvwxyz';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
    }
    output.value = result;
}
// Export to global
window.generatePassword = generatePassword;
window.generateRandomString = generateRandomString;
