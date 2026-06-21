// Service worker de PURGA — no cachea nada; borra cachés viejas y fuerza versión fresca.
// (Reemplaza a cualquier SW viejo que estuviera cacheando index.html/JS y sirviendo versiones viejas.)
self.addEventListener('install', function(e){ self.skipWaiting(); });

self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function(k){ return caches.delete(k); }));
    } catch(err) {}
    try { await self.clients.claim(); } catch(err) {}
    // Recargar las pestañas abiertas una vez, ya con la caché limpia → toman la versión fresca.
    try {
      var cls = await self.clients.matchAll({ type: 'window' });
      cls.forEach(function(c){ try { c.navigate(c.url); } catch(e) {} });
    } catch(err) {}
  })());
});

// Sin handler de fetch: todas las requests van a la red (siempre fresco).
