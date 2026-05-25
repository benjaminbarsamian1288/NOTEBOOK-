const CACHE = 'st-katalog-v75';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/physik.css',
  './js/physik-live.js',
  './js/videotechnik.js',
  './js/pruefung.js',
  './js/sandbox.js',
  './js/plan.js',
  './js/sensoren.js',
  './js/begehung.js',
  './css/style.css',
  './css/visuals.css',
  './css/tools.css',
  './css/ency.css',
  './css/explainers.css',
  './css/floorplan.css',
  './css/building3d.css',
  './css/spektrum.css',
  './css/gallery.css',
  './css/gesetze.css',
  './css/mediathek.css',
  './css/haus3d.css',
  './css/wwd.css',
  './css/wwd-interactive.css',
  './css/mechanik.css',
  './css/mech-ency.css',
  './css/hersteller.css',
  './css/modern-refresh.css',
  './css/modern.css',
  './js/data.js',
  './js/util.js',
  './js/illustrations.js',
  './js/furniture.js',
  './js/bhe-symbols.js',
  './js/visuals.js',
  './js/encyclopedia.js',
  './js/explainers.js',
  './js/explainers-extra.js',
  './js/explainers-rest.js',
  './js/explainers-extra2.js',
  './js/encyclopedia-extra.js',
  './js/encyclopedia-ai.js',
  './js/product-photos.js',
  './js/product-photos-v2.js',
  './js/ency-view.js',
  './js/building3d.js',
  './js/spektrum.js',
  './js/gallery.js',
  './js/zwiebel3d.js',
  './js/gesetze.js',
  './js/paragraphen.js',
  './js/mediathek.js',
  './js/haus3d.js',
  './js/wwd.js',
  './js/wwd-interactive.js',
  './js/mechanik.js',
  './js/hersteller.js',
  './js/mech-ency-data.js',
  './js/mech-ency-view.js',
  './js/tools.js',
  './js/wizard.js',
  './js/views.js',
  './js/konfigurator.js',
  './js/charts.js',
  './js/search.js',
  './js/app.js',
  './data/data.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
