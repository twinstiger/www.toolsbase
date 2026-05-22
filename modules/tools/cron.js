"use strict";
/**
 * Cron Expression Generator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCron = generateCron;
exports.describeCron = describeCron;
exports.setCronPreset = setCronPreset;
/**
 * Generate cron expression from form inputs
 */
function generateCron() {
    const minute = document.getElementById('cron-minute')?.value || '*';
    const hour = document.getElementById('cron-hour')?.value || '*';
    const day = document.getElementById('cron-day')?.value || '*';
    const month = document.getElementById('cron-month')?.value || '*';
    const weekday = document.getElementById('cron-weekday')?.value || '*';
    const expression = `${minute} ${hour} ${day} ${month} ${weekday}`;
    const exprEl = document.getElementById('cron-expression');
    const descEl = document.getElementById('cron-description');
    if (exprEl)
        exprEl.textContent = expression;
    if (descEl)
        descEl.textContent = describeCron(minute, hour, day, month, weekday);
}
/**
 * Describe what a cron expression does
 */
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
/**
 * Set cron preset
 */
function setCronPreset(expression, _description) {
    const parts = expression.split(' ');
    if (parts.length < 5)
        return;
    const minuteEl = document.getElementById('cron-minute');
    const hourEl = document.getElementById('cron-hour');
    const dayEl = document.getElementById('cron-day');
    const monthEl = document.getElementById('cron-month');
    const weekdayEl = document.getElementById('cron-weekday');
    if (minuteEl)
        minuteEl.value = parts[0];
    if (hourEl)
        hourEl.value = parts[1];
    if (dayEl)
        dayEl.value = parts[2];
    if (monthEl)
        monthEl.value = parts[3];
    if (weekdayEl)
        weekdayEl.value = parts[4];
    generateCron();
}
// Backward compatibility
window.generateCron = generateCron;
window.describeCron = describeCron;
window.setCronPreset = setCronPreset;
