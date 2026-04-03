const CACHE='crypto-pro-v3';
const ASSETS=['./index.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.url.includes('coingecko')||e.request.url.includes('anthropic')||e.request.url.includes('alternative.me'))return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='NOTIFY'){self.registration.showNotification(e.data.title,{body:e.data.body,icon:'./icon-192.png',badge:'./icon-192.png',tag:e.data.tag||'crypto',renotify:true,vibrate:[200,100,200]});}});
