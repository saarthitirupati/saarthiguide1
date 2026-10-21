// Saarthi Guide Service Worker v1
// Caches app shell & visited pages for full offline support on Tirumala hill

const CACHE_NAME = 'saarthi-v14';
const APP_SHELL = [
  '/',
  '/explore',
  '/essentials',
  '/offline-maps',
  '/onboarding',
  '/tirupati-hotels',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/banner/banner_poster.webp',
  '/audio/saarthi-opening-ident.wav',
  '/audio/saarthi-courtyard-ambient.wav',
  '/audio/japa-ambient-loop.wav',
  '/audio/bead-complete.wav',
  '/audio/reflection-end.wav',
  '/audio/milestone-quarter.wav',
  '/audio/japa-complete-108.wav',
  '/audio/saarthi-divine-journey.wav',
  '/audio/veena-pluck.wav',
  '/audio/mala-completion.wav',
];

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch(() => {
        // Silently skip if any shell resource fails (e.g. offline during install)
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigations & API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, chrome-extension, admin routes, analytics, and video streaming files
  // Video files require native HTTP 206 Partial Content range requests which fail when intercepted by SW
  if (
    request.method !== 'GET' ||
    url.protocol === 'chrome-extension:' ||
    url.pathname.startsWith('/saarthiadmin') ||
    url.pathname.startsWith('/api/v1/analytics') ||
    url.pathname.startsWith('/api/admin') ||
    url.pathname.match(/\.(mp4|webm|ogv|mov)$/i)
  ) {
    return;
  }

  // API calls for v1 content/places/status/alerts: network-first with cache fallback for offline usage
  if (url.pathname.startsWith('/api/v1/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || new Response(JSON.stringify({ error: 'Offline', offline: true }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Other API calls (admin, auth): bypass cache
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Static assets (_next/static, images, fonts, banner videos, audio): cache-first
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/banner/') ||
    url.pathname.startsWith('/maps/') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff2?|ttf|css|js|mp4)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          return new Response(null, { status: 404, statusText: 'Not Found' });
        });
      })
    );
    return;
  }

  // HTML page navigations: network-first, fallback to cache, then offline response
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const rootCached = await caches.match('/');
          if (rootCached) return rootCached;
          return new Response(
            '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Saarthi Guide - Offline</title><style>body{font-family:system-ui,-apple-system,sans-serif;margin:0;padding:24px;background:#0d1117;color:#f0f6fc;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;}h2{margin:0 0 12px;color:#d4af37;}p{color:#8b949e;margin:0 0 20px;}button{background:#d4af37;color:#0d1117;border:none;padding:12px 24px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;}</style></head><body><div><h2>Pilgrim Offline Notice</h2><p>You appear to be offline. Reconnect or reload when signal is restored.</p><button onclick="window.location.reload()">Retry Connection</button></div></body></html>',
            { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // Everything else: stale-while-revalidate with safe Response fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached || new Response(null, { status: 404, statusText: 'Not Found' }));

      return cached || fetchPromise;
    })
  );
});

// ── Push Notifications ──────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  let title = 'Saarthi Live Alert';
  let body = 'Live Tirumala darshan and temple advisory available.';
  let url = '/alerts';
  let icon = '/icon-192.png';
  let badge = '/icon-96.png';
  let tag = 'saarthi-alert-' + Date.now();
  let targetLocation = 'All Users';

  if (event.data) {
    try {
      const payload = event.data.json();
      if (payload.title) title = payload.title;
      if (payload.body) body = payload.body;
      if (payload.url) url = payload.url;
      if (payload.icon) icon = payload.icon;
      if (payload.badge) badge = payload.badge;
      if (payload.tag) tag = payload.tag;
      if (payload.target_location) targetLocation = payload.target_location;
    } catch (_err) {
      const text = event.data.text();
      if (text) body = text;
    }
  }

  const origin = self.location.origin || 'https://www.saarthiguide.in';
  const iconUrl = icon.startsWith('http') ? icon : new URL(icon, origin).href;
  const badgeUrl = badge.startsWith('http') ? badge : new URL(badge, origin).href;

  const options = {
    body: body,
    icon: iconUrl,
    badge: badgeUrl,
    tag: tag,
    renotify: true,
    data: { url: url },
    vibrate: [200, 100, 200],
    requireInteraction: true,
    silent: false,
  };

  event.waitUntil((async () => {
    // Location-targeted notification check against cached pilgrim location
    const isTestAlert = tag.includes('test') || title.toLowerCase().includes('test');
    if (targetLocation && targetLocation !== 'All Users' && !isTestAlert) {
      try {
        const cache = await caches.open('saarthi-user-context');
        const match = await cache.match('/user-location');
        if (match) {
          const loc = await match.json();
          const userRegion = (loc.locationName || '').toLowerCase();
          const target = targetLocation.toLowerCase();

          // Targeted delivery matching
          const matches = 
            target.includes('all') ||
            (target.includes('tirumala') && userRegion.includes('tirumala')) ||
            (target.includes('tirupati') && userRegion.includes('tirupati')) ||
            (target.includes('alipiri') && (userRegion.includes('alipiri') || userRegion.includes('tirupati'))) ||
            (target.includes('nearby') && (userRegion.includes('tirumala') || userRegion.includes('tirupati') || userRegion.includes('alipiri')));

          if (!matches) {
            // Pilgrim is not in target location; skip displaying notification
            return;
          }
        }
      } catch (_e) {}
    }

    return self.registration.showNotification(title, options);
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/alerts';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
