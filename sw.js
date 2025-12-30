const CACHE_NAME = 'dart-tracker-v1';
const urlsToCache = [
  '/darttracker/',
  '/darttracker/index.html',
  '/darttracker/manifest.json',
  '/darttracker/dartlogo.png',  // Stelle sicher, dass diese Datei im Repo ist und der Name exakt stimmt (Groß-/Kleinschreibung!)
];

self.addEventListener('install', event => {
  console.log('SW: Install event started');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Cache opened, adding URLs:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .then(() => console.log('SW: All resources cached successfully'))
      .catch(error => {
        console.error('SW: Cache error during install:', error);
        throw error;  // Stoppt die Installation bei Fehler
      })
  );
});

self.addEventListener('activate', event => {
  console.log('SW: Activate event');
  event.waitUntil(
    caches.keys().then(keys => {
      console.log('SW: Clearing old caches');
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('SW: Deleting cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('SW: Serving from cache:', event.request.url);
          return response;
        }
        console.log('SW: Fetching from network:', event.request.url);
        return fetch(event.request);
      })
  );
});
