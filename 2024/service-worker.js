(function () {
  const version = "v1";
  const cacheName = `state-of-the-cardano-developer-ecosystem-2024:${version}`;
  const appPrefix = "/state-of-the-developer-ecosystem/2024"

  const appShellFiles =
    [ "/"
    , "/assets/manifest.json"
    , "/assets/img/favicon.png"
    , "/assets/img/cardano.svg"
    , "/assets/img/maskable_icon_x192.png"
    , "/data/answers.json"
    ];

  const extraFiles =
    [ "/assets/css/style.css"
    , "/assets/js/shell.js"
    , "/assets/js/app.min.js"
    ];

  self.addEventListener("install", (e) => {
    e.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(appShellFiles
        .concat(extraFiles)
        .map(filename => `${appPrefix}${filename}`)
      );
    })());
  });

  self.addEventListener("activate", (e) => {
    e.waitUntil(caches.keys().then((ks) => {
      return Promise.all(ks.map((k) => {
        if (k === cacheName) { return; }
        return caches.delete(k);
      }));
    }));
  });

  self.addEventListener("fetch", (e) => {
    if (extraFiles.some(file => e.request.url.includes(file))) {
      e.respondWith(fetch(e.request).catch(() => { return caches.match(e.request); }));
    } else {
      e.respondWith(caches.match(e.request).then((res) => { return res || fetch(e.request); }));
    }
  });
}());
