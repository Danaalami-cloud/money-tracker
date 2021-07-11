const URLS_TO_CACHE = [
    '/',
    "/db.js",
    '/index.js',
    "/manifest.json",
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
  ];
  
  const CACHE = 'my-site-v1';
  const DATA_CACHE = 'data-cache';
  
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(CACHE)
        .then((cache) => cache.addAll(URLS_TO_CACHE))
        .then(self.skipWaiting())
    );
  });
  
  
  
  self.addEventListener('fetch', (event) => {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE).then(cache => {
                return fetch(event.request).then(response => {
                    if(response.status === 200) {
                        cache.put(event.request.url, response.clone())
                    }
                    return response
                })
                .catch(error => {
                    return cache.match(event.request)
                })
            }).catch(error => console.log(error))
        )
        return; 
    }

    event.respondWith(
        caches.open(CACHE).then(cache => {
            return cache.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        })
    )

  });
  