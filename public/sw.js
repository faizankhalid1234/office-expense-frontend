// Only cache icons/manifest — NEVER cache HTML pages (causes stuck app)
const CACHE_NAME = "hh-expense-v2-static";
const STATIC_ONLY = ["/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ONLY))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== "GET") return;

  // Never intercept page navigation or Next.js assets
  if (
    event.request.mode === "navigate" ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/auth") ||
    url.pathname === "/" ||
    url.pathname.startsWith("/expenses") ||
    url.pathname.startsWith("/categories") ||
    url.pathname.startsWith("/reports") ||
    url.pathname.startsWith("/budget") ||
    url.pathname.startsWith("/settings")
  ) {
    return;
  }

  // Cache only static icons/manifest
  if (STATIC_ONLY.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
