"use strict";
/**
 * Common Utilities - 共享的工具函数
 * 减少重复代码，统一错误处理
 */
const Utils = {
    /**
     * 安全获取 DOM 元素的值
     */
    getValue(id) {
        const el = document.getElementById(id);
        return el?.value?.trim() || '';
    },
    /**
     * 安全设置 DOM 元素的值
     */
    setValue(id, value) {
        const el = document.getElementById(id);
        if (el)
            el.value = value;
    },
    /**
     * 安全获取元素文本
     */
    getText(id) {
        const el = document.getElementById(id);
        return el?.textContent?.trim() || '';
    },
    /**
     * 安全设置元素文本
     */
    setText(id, text) {
        const el = document.getElementById(id);
        if (el)
            el.textContent = text;
    },
    /**
     * 显示错误消息（更好的人类工程学方式）
     */
    showError(message) {
        console.error(message);
        // 使用 toast 通知而非 alert
        this.showToast(message, 'error');
    },
    /**
     * 显示成功消息
     */
    showSuccess(message) {
        this.showToast(message, 'success');
    },
    /**
     * Toast 通知（简单的实现）
     */
    showToast(message, type = 'success') {
        // 如果页面中有 toast 容器
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = 'toast toast-' + type;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
        else {
            // 回退到 alert
            alert(message);
        }
    },
    /**
     * 验证必填字段
     */
    require(value, fieldName) {
        if (!value) {
            this.showError('Please enter ' + fieldName);
            return false;
        }
        return true;
    },
    /**
     * 复制到剪贴板
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        }
        catch (err) {
            console.error('Copy failed:', err);
            return false;
        }
    },
    /**
     * 生成 UUID v4
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    /**
     * 防抖函数
     */
    debounce(fn, delay = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    },
    /**
     * 节流函数
     */
    throttle(fn, limit = 100) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
// 导出到全局
window.Utils = Utils;
