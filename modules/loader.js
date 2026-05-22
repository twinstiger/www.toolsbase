"use strict";
/**
 * Module Loader - 懒加载系统
 * 按需加载模块，减少初始加载时间
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModule = loadModule;
exports.prefetchModule = prefetchModule;
exports.isLoaded = isLoaded;
// 模块映射表
const moduleMap = {
    'calculators': () => require('./calculators.js'),
    'converters': () => require('./converters.js'),
    'text-tools': () => require('./text-tools.js'),
    'utils': () => require('./utils.js')
};
// 已加载的模块缓存
const loadedModules = new Set();
/**
 * 动态加载模块
 */
function loadModule(name) {
    if (loadedModules.has(name)) {
        return Promise.resolve();
    }
    const loader = moduleMap[name];
    if (!loader) {
        console.warn('Module not found:', name);
        return Promise.reject(new Error('Module not found: ' + name));
    }
    return new Promise((resolve, reject) => {
        try {
            loader();
            loadedModules.add(name);
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}
/**
 * 预加载模块（用户在页面停留时）
 */
function prefetchModule(name) {
    // 提前加载，不阻塞
    loadModule(name).catch(() => { });
}
/**
 * 获取加载状态
 */
function isLoaded(name) {
    return loadedModules.has(name);
}
// ===== 导出到全局 =====
window.loadModule = loadModule;
window.prefetchModule = prefetchModule;
window.isLoaded = isLoaded;
