// Factictionary Full-Featured PWA Service Worker (PWABuilder Compliant)
// Supports: Offline Caching, Background Sync ('sync'), Periodic Sync ('periodicsync'), and Push Notifications ('push')

const CACHE_NAME = 'factictionary-pwa-v9';
const OFFLINE_URL = '/tools/?app=1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/tools/',
  '/assets/js/main.js',
  '/assets/css/style.css',
  '/assets/js/pdf-lib.min.js',
  '/assets/js/jszip.min.js',
  '/guides/',
  '/games/',
  '/directory.html',
  '/manifest.json',
  '/assets/images/factictionary-logo-96.png',
  '/assets/images/factictionary-logo-192.png',
  '/assets/images/factictionary-logo-512.png'
];

// 1. Install Event — Pre-cache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 2. Activate Event — Clean up old caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// 3. Fetch Event — Network-first with Cache & Offline Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  const isHtmlNav = event.request.mode === 'navigate' || event.request.url.endsWith('.html');
  const fetchPromise = isHtmlNav ? fetch(event.request, { cache: 'no-cache' }) : fetch(event.request);

  event.respondWith(
    fetchPromise
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        })
      )
  );
});

// 4. Background Sync ('sync') — Retry queued actions when connectivity returns
self.addEventListener('sync', (event) => {
  if (event.tag === 'factictionary-sync' || event.tag === 'sync-tools-state') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.add('/manifest.json'))
    );
  }
});

// 5. Periodic Background Sync ('periodicsync') — Refresh core catalog & widget data periodically
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'factictionary-periodic-sync' || event.tag === 'update-tools-catalog') {
    event.waitUntil(
      fetch('/assets/widgets/tools-data.json')
        .then((res) => {
          if (res.ok) {
            return caches.open(CACHE_NAME).then((cache) => cache.put('/assets/widgets/tools-data.json', res.clone()));
          }
        })
        .catch(() => {})
    );
  }
});

// 6. Push Notifications ('push') — Display incoming push notifications
self.addEventListener('push', (event) => {
  let payload = {
    title: 'Factictionary Tools & Apps',
    body: 'Explore 85+ privacy-first browser utilities and offline Android apps.',
    icon: '/assets/images/factictionary-logo-192.png',
    badge: '/assets/images/factictionary-logo-96.png',
    url: 'https://factictionary.in/tools/'
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = Object.assign(payload, parsed);
    } catch (e) {
      payload.body = event.data.text() || payload.body;
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    data: { url: payload.url },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'Open Tools Hub' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// 7. Notification Click Handler ('notificationclick')
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || 'https://factictionary.in/tools/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
