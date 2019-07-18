var staticCacheName = 'mws-restaurant-static-v';
var m = new Date();
var dateString =
  m.getUTCFullYear() +
  ('0' + (m.getUTCMonth() + 1)).slice(-2) +
  ('0' + m.getUTCDate()).slice(-2) +
  ('0' + m.getUTCHours()).slice(-2) +
  ('0' + m.getUTCMinutes()).slice(-2) +
  ('0' + m.getUTCSeconds()).slice(-2);
var cache_id = dateString;
staticCacheName += cache_id;

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache
        .addAll([
          'index.html',
          'restaurant.html',
          '/css/styles.css',
          '/js/dbhelper.js',
          '/js/main.js',
          '/js/restaurant_info.js',
          '/img/*',
          '/js/register.js'
        ])
        .catch(error => {});
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith('mws-restaurant-') &&
              cacheName != staticCacheName
            );
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request).then(function(response) {
          let responseClone = response.clone();

          caches.open(staticCacheName).then(function(cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      }
    })
  );
});
