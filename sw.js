/**
 * Service Worker - 离线缓存
 * 用于 PWA 离线支持
 */

const CACHE_NAME = 'toolsbase-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/modules/module-loader.js',
    '/modules/utils.js',
    '/logo.svg'
];

// 安装事件
self.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    (self as any).skipWaiting();
});

// 激活事件
self.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    (self as any).clients.claim();
});

// 请求拦截
self.addEventListener('fetch', (event: FetchEvent) => {
    const url = new URL(event.request.url);

    // 只缓存同源请求
    if (url.origin !== location.origin) return;

    // API 请求不缓存
    if (url.pathname.startsWith('/api/')) return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            // 返回缓存或网络请求
            const response = cached || fetch(event.request).then((network) => {
                // 克隆响应并缓存
                const clone = network.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return network;
            });

            // 网络失败返回离线页面
            return response.catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});

// 类型声明
declare const self: ServiceWorkerGlobalScope;
interface ExtendableEvent extends Event {
    waitUntil(promise: Promise<any>): void;
}
interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): void;
}