const CACHE_NAME = 'michi-pwa-v18';

// Immediate skipWaiting on install
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Immediately claim clients on activate & delete all old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

// Always fetch fresh network requests during active updates
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' }).catch(() => caches.match(event.request))
  );
});
