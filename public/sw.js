// Cleanup service worker for localhost collisions across projects.
// This script unregisters itself immediately and clears old caches.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch (_) {
        // no-op
      }
      await self.registration.unregister();
      const clientsList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      clientsList.forEach((client) => client.navigate(client.url));
    })(),
  );
});
