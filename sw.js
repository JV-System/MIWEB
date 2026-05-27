const CACHE = 'sabores-v1';
const ASSETS = [
  '/Sabores-de-misiones/',
  '/Sabores-de-misiones/index.html',
  '/Sabores-de-misiones/jvs-logo.png',
  '/Sabores-de-misiones/jvs-icon.png',
  '/Sabores-de-misiones/yerba.jpeg',
  'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/Sabores-de-misiones/index.html')))
  );
});
