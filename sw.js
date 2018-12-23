var CACHE_NAME = 'football-pwa-v5'

var urlsToCache = [
  '/',
  '/img/ball.png',
  '/img/empty_badge.svg',
  '/js/main.js',
  '/js/nav.js',
  '/js/api.js',
  '/pages/home.html',
  '/pages/teams.html',
  '/pages/matches.html',
  '/nav.html',
  '/index.html',
  '/materialize/css/materialize.min.css',
  '/materialize/js/materialize.min.js'
]

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  )
});

self.addEventListener('fetch', (event) => {
  event.respondWith(async function () {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) return cachedResponse;
    const networkResponse = await fetch(event.request);
    event.waitUntil(
      cache.put(event.request, networkResponse.clone())
    );
    return networkResponse;
  }());
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
});