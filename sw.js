const CACHE_NAME = 'michi-pwa-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Network-first fetch handler so updates are instant while keeping PWA Share Target registered
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
