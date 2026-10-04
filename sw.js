const C = "isk-v1", FILES = ["./", "index.html", "styles.css", "config.js", "payments.js", "app.js", "assets/logo.webp", "assets/icon.svg"];
self.addEventListener("install", e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES))));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))));
self.addEventListener("fetch", e => { if (e.request.method === "GET" && new URL(e.request.url).origin === location.origin)
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request))); });
