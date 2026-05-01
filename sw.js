/* === SERVICE WORKER — Inmobiliaria Prueba PWA === */
const CACHE_NAME = 'inmob-prueba-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/listado.html',
  '/propiedad.html',
  '/contacto.html',
  '/sobre-nosotros.html',
  '/style.css',
  '/main.js',
  '/listado.js',
  '/propiedad.js',
  '/properties.js',
  '/manifest.json',
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Ignore individual cache failures (external URLs may fail)
      });
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET and cross-origin requests
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && !url.hostname.includes('fonts.googleapis') && !url.hostname.includes('fonts.gstatic')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Background sync for contact forms
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

async function syncContactForms() {
  // In production, would sync queued form submissions
  console.log('[SW] Syncing pending contact forms...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Inmobiliaria Prueba', body: 'Nueva propiedad disponible' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://placehold.co/192x192/1C3A2F/C9A96E?text=IP',
      badge: 'https://placehold.co/72x72/1C3A2F/C9A96E?text=IP',
      data: data.url,
      actions: [
        { action: 'view', title: 'Ver propiedad' },
        { action: 'dismiss', title: 'Descartar' },
      ]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' && event.notification.data) {
    clients.openWindow(event.notification.data);
  }
});
