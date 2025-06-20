self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("intelli-cache").then((cache) => {
      return cache.addAll(["index.html", "style.css", "script.js", "icon.png"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
