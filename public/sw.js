// Offline cache for the training plan. Navigations are network-first with a short timeout so a new
// deploy is picked up as soon as there is signal; hashed assets are cache-first; offline shows the
// last-seen plan. Old caches are deleted on activate.
const VERSION = 'hq-v1';
const BASE = new URL(self.registration.scope).pathname;
const SHELL = [BASE, BASE + 'index.html', BASE + 'manifest.webmanifest', BASE + 'favicon.svg'];

self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });

const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

self.addEventListener('fetch', e => {
  const { request } = e; const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin) return;
  if (request.mode === 'navigate') {
    e.respondWith(withTimeout(fetch(request), 3000).then(res => { caches.open(VERSION).then(c => c.put(BASE + 'index.html', res.clone())); return res; })
      .catch(() => caches.match(BASE + 'index.html')));
    return;
  }
  if (url.pathname.startsWith(BASE + 'assets/') || url.pathname.startsWith(BASE + 'icons/')) {
    e.respondWith(caches.match(request).then(hit => hit || fetch(request).then(res => { caches.open(VERSION).then(c => c.put(request, res.clone())); return res; })));
  }
});
