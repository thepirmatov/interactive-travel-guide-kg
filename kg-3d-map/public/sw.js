/**
 * Service Worker: caches map resources (PMTiles, terrain tiles, raster tiles)
 * so visited areas load instantly and work offline.
 */
const CACHE_NAME = 'kg-3d-map-v1';

const CACHE_ORIGINS = [
  'https://demotiles.maplibre.org',
  'https://a.tile.openstreetmap.org',
  'https://b.tile.openstreetmap.org',
  'https://c.tile.openstreetmap.org',
  'https://tiles.maps.eox.at',
  'https://a.tiles.maps.eox.at',
  'https://b.tiles.maps.eox.at',
  'https://c.tiles.maps.eox.at',
];

function shouldCache(url) {
  const u = url.toString();
  if (u.endsWith('.pmtiles')) return true;
  if (u.includes('demotiles.maplibre.org/terrain-tiles')) return true;
  if (u.includes('tile.openstreetmap.org')) return true;
  if (u.includes('tiles.maps.eox.at') && (u.includes('/wmts/') || u.includes('/{z}/'))) return true;
  return false;
}

function isCacheableOrigin(url) {
  const origin = new URL(url).origin;
  return CACHE_ORIGINS.some((o) => origin === o) || origin === self.location.origin;
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  if (request.method !== 'GET') return;
  if (!shouldCache(url) || !isCacheableOrigin(url)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        const fetchAndCache = () =>
          fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        if (cached) return cached;
        return fetchAndCache().catch(
          () => new Response('', { status: 503, statusText: 'Service Unavailable' })
        );
      })
    )
  );
});
