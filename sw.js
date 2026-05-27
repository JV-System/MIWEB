const CACHE = 'sabores-v4';
const ASSETS = [
  '/Sabores-de-misiones/',
  '/Sabores-de-misiones/index.html',
  '/Sabores-de-misiones/manifest.json',
  '/Sabores-de-misiones/jvs-logo.png',
  '/Sabores-de-misiones/jvs-icon.png',
  '/Sabores-de-misiones/yerba.jpeg'
];

// Instalar: cachear assets locales, nunca bloquear si falla uno
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

// Activar: limpiar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first para mismo origen, network-only para externos
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // ignorar externas

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/Sabores-de-misiones/index.html'));
    })
  );
});
