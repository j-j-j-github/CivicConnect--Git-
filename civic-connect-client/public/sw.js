const CACHE_NAME = 'civic-connect-cache-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/citizen/dashboard',
        '/citizen/complaints',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST' && event.request.url.includes('/api/v1/complaints')) {
    // Basic Background Sync imitation if offline
    if (!navigator.onLine) {
      event.respondWith(
        new Response(JSON.stringify({ message: 'Saved offline. Will sync when online.', offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        })
      );
      // In a real app we'd save to IndexedDB here and sync later
      return;
    }
  }

  // Network falling back to cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
