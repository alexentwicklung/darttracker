// sw.js - Service Worker für Offline-Funktionalität

const CACHE_NAME = 'dart-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',  // Passe den Pfad zu deinem Icon an
  // Füge weitere Dateien hinzu, z.B. CSS oder JS, falls du externe hast
];

// Installations-Event: Cache die Ressourcen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch-Event: Antworte mit gecachten Ressourcen, wenn offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Gib gecachte Version zurück, falls verfügbar
        if (response) {
          return response;
        }
        // Ansonsten versuche, die Anfrage zu laden (funktioniert nur online)
        return fetch(event.request);
      })
  );
});

// Aktivierungs-Event: Alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});