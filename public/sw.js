const CACHE_NAME = 'familyapp-cache-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/kakei.html',
  '/sokone.html',
  '/zaiko.html',
  '/nav.js',
  '/icon-192.png',
  '/icon-512.png'
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
  // 基本的にネットワークから取得、失敗したらキャッシュから取得
  // Firebaseや外部APIとの通信はキャッシュせずネットワークに任せる
  if (event.request.url.startsWith('https://www.gstatic.com/') || 
      event.request.url.startsWith('https://firestore.googleapis.com/')) {
    return; // Firebase等の外部リクエストはService Workerでインターセプトしない
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});