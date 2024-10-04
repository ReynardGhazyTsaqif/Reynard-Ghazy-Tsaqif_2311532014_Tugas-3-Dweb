const CACHE_NAME = 'rynnify-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/about.html',
  '/contact.html',
  '/confirmation.html',
  '/offline.html',
  '/js.js',
  '/Pic/huruf.jpg', // Ikon aplikasi
  '/Pic/logo.png',  // Ikon aplikasi
  '/Pic/bg.avif',
  '/offline.html'   // Halaman fallback jika pengguna offline
];

// Install Service Worker dan cache aset statis
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching assets');
        return Promise.all(
          ASSETS_TO_CACHE.map(asset => {
            return cache.add(asset).catch(err => {
              console.error('Failed to cache asset:', asset, err);
            });
          })
        );
      })
      .catch((error) => {
        console.error('Failed to cache assets:', error);
      })
  );
});

// Aktifkan Service Worker dan hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event: Melayani aset dari cache atau jatuh ke fetch jaringan
self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
              return cachedResponse; // Kembalikan cache jika ditemukan
          }

          return fetch(event.request).then((networkResponse) => {
              if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                  return networkResponse;
              }

              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseToCache);
              });

              return networkResponse;
          }).catch(() => {
              // Jika fetch gagal (offline atau masalah jaringan), kembalikan halaman offline
              if (event.request.mode === 'navigate') {
                  return caches.match('/offline.html'); // Pastikan ini benar
              }
          });
      })
  );
});
