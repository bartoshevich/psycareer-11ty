"use strict";

(function () {
  const version = "1.0.0.2";
  const staticCacheName = `static-v${version}`;
  const imagesCacheName = `images-v${version}`;
  const mediaCacheName = `media-v${version}`;
  const pagesCacheName = `pages-v${version}`;
  const maxEntries = 50;

  const coreFilesToCache = [
    "/",
    "/offline/",
    "/articles/",
    "/about/",
    "/poleznye-ssylki/",
    "/style.css",
    "/main.js",
    "/Inter-Regular.woff2",
    "/Inter-Bold.woff2",
    "/Inter-Italic.woff2"
  ];

  const imagesToCache = [];

  const mediaToCache = [];

  self.addEventListener("install", (event) => {
    event.waitUntil(
      (async () => {
        try {
          await cacheFiles(staticCacheName, coreFilesToCache);
          await cacheFiles(imagesCacheName, imagesToCache);
          if (mediaToCache.length > 0) {
            await cacheFiles(mediaCacheName, mediaToCache);
          }
          await caches.open(pagesCacheName);
          self.skipWaiting();
        } catch (error) {
          console.error("Failed to cache some files during install", error);
        }
      })()
    );
  });

  async function cacheFiles(cacheName, files) {
    const cache = await caches.open(cacheName);
    for (const file of files) {
      try {
        await cache.add(file);
         console.log(`Cached: ${file}`);
      } catch (error) {
        console.error(`Failed to cache: ${file}`, error);
        throw error;
      }
    }
  }

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all([
          ...cacheNames
            .filter(
              (cacheName) =>
                cacheName !== staticCacheName &&
                cacheName !== imagesCacheName &&
                cacheName !== mediaCacheName &&
                cacheName !== pagesCacheName
            )
            .map((cacheName) => caches.delete(cacheName)),
          self.clients.claim(),
        ]).then(() => {
          console.log("Service worker activated and old caches cleared.");
        });
      })
    );
  });

  self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (url.origin !== location.origin) {
      return;
    }

    let strategy = staleWhileRevalidate;
    let cacheName = determineCacheName(request);

    if (
      request.destination === "document" ||
      request.headers.get("accept").includes("text/html")
    ) {
      strategy = networkFirst;
      cacheName = pagesCacheName;
    }

    event.respondWith(strategy(request, cacheName));
  });

  function determineCacheName(request) {
    if (
      request.destination === "image" ||
      /\.(jpg|jpeg|png|webp|avif|svg)$/.test(request.url)
    ) {
      return imagesCacheName;
    } else if (/\.(mp3|mp4)$/.test(request.url)) {
      return mediaCacheName;
    }
    return staticCacheName;
  }

  function staleWhileRevalidate(request, cacheName) {
    return caches.open(cacheName).then((cache) => {
      return cache.match(request).then((response) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok && networkResponse.status !== 206) {
              cache.put(request, networkResponse.clone()).then(() => {
                limitCacheSize(cacheName, maxEntries);
              });
            } else {
              console.error(
                "Network request failed and no response found in cache."
              );
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error("Failed to fetch and no response in cache: ", error);
            return response || caches.match("/offline/");
          });
        return response || fetchPromise;
      });
    });
  }

  function networkFirst(request, cacheName) {
    return fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok && networkResponse.status !== 206) {
          return caches.open(cacheName).then((cache) => {
            cache.put(request, networkResponse.clone()).then(() => {
              limitCacheSize(cacheName, maxEntries);
            });
            return networkResponse;
          });
        } else {
          console.error("Network request was not ok.");
          return networkResponse;
        }
      })
      .catch((error) => {
        console.error("Network error occurred: ", error);
        return caches
          .match(request)
          .then((response) => response || caches.match("/offline"));
      });
  }

  function limitCacheSize(cacheName, maxItems) {
    caches.open(cacheName).then((cache) => {
      cache.keys().then((keys) => {
        if (keys.length > maxItems) {
          cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxItems));
        }
      });
    });
  }
})();
