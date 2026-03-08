const CACHE_NAME = 'familyapp-cache-v20';
const urlsToCache = [
  '/',
  '/index.html',
  '/kakei.html',
  '/sokone.html',
  '/kaimono.html',
  '/nav.js',
  '/firebase-config.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Firestoreデータ通信やAuthの通信はキャッシュせずにスルー
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('identitytoolkit.googleapis.com') ||
      event.request.url.includes('securetoken.googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      // ネットワーク通信が成功した場合、静的ファイルやSDKを動的にキャッシュ
      if (event.request.method === 'GET' && 
         (event.request.url.startsWith(self.location.origin) || 
          event.request.url.startsWith('https://www.gstatic.com/') ||
          event.request.url.startsWith('https://cdn.jsdelivr.net/'))) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
      }
      return response;
    }).catch(() => {
      // ネットワークがオフライン・失敗した場合はキャッシュから返す
      return caches.match(event.request);
    })
  );
});