const CACHE = 'crypto-advisor-v1';
const ASSETS = ['./index.html', './manifest.json'];

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
  // Solo cache per le risorse locali, pass-through per API esterne
  if (e.request.url.includes('coingecko') || e.request.url.includes('anthropic')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// Ricezione messaggi dalla pagina principale
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SEND_NOTIFICATION') {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: e.data.icon || './icon-192.png',
      badge: './icon-192.png',
      tag: e.data.tag || 'crypto',
      renotify: true,
      vibrate: [200, 100, 200]
    });
  }
});
