// Service worker — offline-first for the family trip app.
// Strategy:
//  - App shell (HTML, CSS, JS chunks): stale-while-revalidate
//  - Images / fonts: cache-first, long-lived
//  - Google Fonts: stale-while-revalidate (so 飛機上 still has fonts)
//  - Navigation fallback: /offline.html when offline + not cached

const VERSION = 'fam-journey-v1';
const SHELL = `shell-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const FONTS = `fonts-${VERSION}`;

const SHELL_URLS = [
  '/',
  '/trips/okinawa-2026',
  '/offline.html',
  '/manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL).then((c) => c.addAll(SHELL_URLS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

function isFontReq(url) {
  return (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  );
}

function isAssetReq(req) {
  const d = req.destination;
  return d === 'image' || d === 'style' || d === 'script' || d === 'font';
}

async function staleWhileRevalidate(cacheName, req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req)
    .then((res) => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

async function cacheFirst(cacheName, req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200) cache.put(req, res.clone());
    return res;
  } catch {
    return cached || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navigation requests — try network, fall back to cached page, then offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || caches.match('/offline.html');
        })
    );
    return;
  }

  if (isFontReq(url)) {
    event.respondWith(staleWhileRevalidate(FONTS, req));
    return;
  }

  if (isAssetReq(req)) {
    // Next.js static chunks + images + styles
    if (url.pathname.startsWith('/_next/') || req.destination === 'image' || req.destination === 'font') {
      event.respondWith(cacheFirst(ASSETS, req));
    } else {
      event.respondWith(staleWhileRevalidate(ASSETS, req));
    }
  }
});
