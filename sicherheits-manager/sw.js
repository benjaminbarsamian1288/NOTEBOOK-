/**
 * Sicherheits-Manager Service Worker
 * Offline-Support und Caching
 */
const CACHE_NAME = 'sima-v2';

const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './css/ai.css',
    './js/storage.js',
    './js/data.js',
    './js/search.js',
    './js/ai.js',
    './js/ui.js',
    './js/app.js',
    './data/index.json',
    './data/dguv-v1.json',
    './data/dguv-v23.json',
    './data/bewachv.json',
    './data/din-77200.json',
    './icons/icon-72.png',
    './icons/icon-96.png',
    './icons/icon-128.png',
    './icons/icon-144.png',
    './icons/icon-152.png',
    './icons/icon-192.png',
    './icons/icon-384.png',
    './icons/icon-512.png'
];

const EXTERNAL = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // Local assets - alle pflicht
            await cache.addAll(ASSETS).catch(err => console.warn('Cache add failed:', err));
            // Externe - best effort
            for (const url of EXTERNAL) {
                try { await cache.add(url); } catch (e) { /* ignore */ }
            }
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    // Network-first fuer HTML/JSON-Daten (frische Inhalte)
    if (request.mode === 'navigate' || request.url.endsWith('.json')) {
        event.respondWith(
            fetch(request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(request, clone));
                    return res;
                })
                .catch(() => caches.match(request).then(r => r || caches.match('./index.html')))
        );
        return;
    }

    // Cache-first fuer den Rest
    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;
            return fetch(request).then(res => {
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(request, clone));
                }
                return res;
            }).catch(() => {
                if (request.url.includes('font-awesome')) {
                    return new Response('', { headers: { 'Content-Type': 'text/css' } });
                }
            });
        })
    );
});
