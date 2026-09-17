// Caches only the app shell (this file set), so the editor UI opens instantly
// with no signal. Every GitHub API call still goes straight to the network --
// there is nothing meaningful to do with stale file/PDF data anyway.
const CACHE = "texpad-mobile-v4";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // Never intercept API calls -- always live, never cached.
  if (url.hostname.endsWith("github.com") || url.hostname.endsWith("githubusercontent.com")) return;
  if (event.request.method !== "GET") return;

  // Network-first for the page itself: while this is under active
  // development, "open the app" should mean "get the latest code" whenever
  // there's any signal at all, not silently serve whatever was cached on
  // first install. Falls back to the cached shell only when actually
  // offline -- that's the one case caching this at all is for.
  if (event.request.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => { caches.open(CACHE).then((c) => c.put(event.request, res.clone())); return res; })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
