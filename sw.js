/**
 * VoiceNote Service Worker
 * Enables offline support, caching, and PWA functionality
 */

const CACHE_NAME = 'voicenote-v2';
const ICON_CACHE = 'voicenote-icons-v1';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './wachbuch.html',
    './manifest.json',
    './css/style.css',
    './css/editor.css',
    './css/drawing.css',
    './css/responsive.css',
    './css/logbook.css',
    './css/wachbuch.css',
    './js/storage.js',
    './js/recorder.js',
    './js/editor.js',
    './js/drawing.js',
    './js/ui.js',
    './js/app.js',
    './js/logbook.js',
    './js/logbook-ui.js',
    './js/wachbuch-app.js',
    './js/generate-icons.js',
    './icons/icon.svg'
];

const EXTERNAL_ASSETS = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install - Cache all essential assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // Cache local assets
            await cache.addAll(ASSETS_TO_CACHE);
            // Try to cache external assets (non-blocking)
            for (const url of EXTERNAL_ASSETS) {
                try {
                    await cache.add(url);
                } catch (e) {
                    console.warn('Could not cache external asset:', url);
                }
            }
        }).then(() => self.skipWaiting())
    );
});

// Activate - Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== ICON_CACHE)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Handle icon requests from cache
    if (request.url.includes('/icons/icon-')) {
        event.respondWith(
            caches.open(ICON_CACHE).then((cache) => {
                return cache.match(request).then((response) => {
                    if (response) return response;
                    // Fall back to SVG icon
                    return caches.match('./icons/icon.svg') || fetch(request);
                });
            })
        );
        return;
    }

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // For navigation requests (HTML pages), try network first
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => caches.match(request) || caches.match('./index.html'))
        );
        return;
    }

    // For other requests: cache first, then network
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;

            return fetch(request).then((response) => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            }).catch(() => {
                // Return offline fallback for Font Awesome
                if (request.url.includes('font-awesome')) {
                    return new Response('', { headers: { 'Content-Type': 'text/css' } });
                }
            });
        })
    );
});

// Handle background sync for data persistence
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-notes') {
        // Future: sync notes to cloud
        console.log('Background sync triggered');
    }
});

// Handle push notifications
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'VoiceNote Benachrichtigung',
        icon: './icons/icon-192.png',
        badge: './icons/icon-72.png',
        vibrate: [100, 50, 100],
        data: { url: data.url || './' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'VoiceNote', options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || './')
    );
});
