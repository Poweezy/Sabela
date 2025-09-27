const CACHE_NAME = 'climate-watch-v1';
const urlsToCache = [
  '/',
  '/style.min.css',
  '/script.min.js',
  '/img/logo.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});