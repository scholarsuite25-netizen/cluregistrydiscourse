// CLU PWA — versioned cache, offline fallback, no auth caching
const CACHE = "clu-v1";
const SHELL = ["/", "/offline", "/manifest.json"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // never cache private APIs or signed URLs
  if (url.pathname.startsWith("/api/") || url.search.includes("token=") || url.pathname.includes("supabase")) return;
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then((res) => {
      // cache shell only
      if (SHELL.includes(url.pathname)) { const clone = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, clone)); }
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match("/offline")))
  );
});
