const CACHE_NAME = 'familyapp-cache-v21';
const urlsToCache = [
  '/',
  '/index.html',
  '/kakei.html',
  '/sokone.html',
  '/kaimono.html',
  '/list.html',
  '/nav.js',
  '/firebase-config.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/favicon.ico',
  'https://cdn.jsdelivr.net/npm/sortablejs@1.15.7/Sortable.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // addAll は一つ失敗すると Promise 全体が reject されるため、
        // 各 URL を個別に fetch->put して失敗を握りつぶす（ベストエフォート）
        return Promise.all(urlsToCache.map((url) => {
          return fetch(url).then((resp) => {
            if (!resp || !resp.ok) {
              // 404 等はキャッシュしないが、install を失敗させない
              console.warn('sw: could not fetch', url, resp && resp.status);
              return Promise.resolve();
            }
            return cache.put(url, resp.clone()).catch((err) => {
              console.warn('sw: cache.put failed for', url, err);
            });
          }).catch((err) => {
            console.warn('sw: fetch failed for', url, err);
            return Promise.resolve();
          });
        }));
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