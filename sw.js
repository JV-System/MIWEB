const CACHE = 'sabores-v2';
const ASSETS = [
  '/Sabores-de-misiones/',
  '/Sabores-de-misiones/index.html',
  '/Sabores-de-misiones/manifest.json',
  '/Sabores-de-misiones/jvs-logo.png',
  '/Sabores-de-misiones/jvs-icon.png',
  '/Sabores-de-misiones/yerba.jpeg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Solo cachear mismo origen
  if (url.origin !== location.origin) {
    e.respondWith(fetch(e.request).catch(() => new Response('', {status: 408})));
    return;
  }
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request)
        .then(res => {
          // Guardar en cache dinámicamente
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match('/Sabores-de-misiones/index.html'))
      )
  );
});
