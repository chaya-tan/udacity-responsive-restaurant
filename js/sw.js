var CACHE_NAME = 'my-site-cache';
var urlsToCache = [
  '/',
  '/restaurant_info.js',
  '/main.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(urlsToCache);
    })
  );
});