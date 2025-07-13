const CACHE_NAME = 'reserva-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/dataSoruce.js',
  '/unavailable_periods.js',
  'https://cdn.anychart.com/releases/8.13.0/js/anychart-base.min.js',
  'https://cdn.anychart.com/releases/8.13.0/js/anychart-core.min.js',
  'https://cdn.anychart.com/releases/8.13.0/js/anychart-gantt.min.js',
  'https://cdn.anychart.com/releases/8.13.1/locales/es-bo.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});