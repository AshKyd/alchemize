const CACHE_NAME = "alchemize-v3";

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Don't cache responses when running from localhost
  const url = new URL(event.request.url);
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    return;
  }

  // Don't cache the workerService.js file itself
  if (url.pathname.endsWith("/workerService.js")) {
    return;
  }

  event.respondWith(
    (async () => {
      // First check if we have the resource in cache
      const cachedResponse = await caches.match(event.request);

      // If we have a cached response, return it immediately
      if (cachedResponse) {
        // Update the cache in the background with fresh data
        event.waitUntil(
          fetch(event.request)
            .then((networkResponse) => {
              return caches.open(CACHE_NAME).then((cache) => {
                // Clone the response since streams can only be read once
                const responseToCache = networkResponse.clone();
                return cache.put(event.request, responseToCache);
              });
            })
            .catch((error) => {
              console.log(
                "Background update failed, keeping cached version",
                error
              );
            })
        );

        // Return cached response immediately
        return cachedResponse;
      }

      // If not in cache, fetch from network
      const networkResponse = await fetch(event.request);

      const cache = await caches.open(CACHE_NAME);
      const responseToCache = networkResponse.clone();
      cache.put(event.request, responseToCache);

      return networkResponse;
    })()
  );
});
