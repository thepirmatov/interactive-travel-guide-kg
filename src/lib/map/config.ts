/**
 * Map configuration for 3D MapLibre map (used in MapView).
 * Set NEXT_PUBLIC_PMTILES_URL to your PMTiles URL if hosting elsewhere.
 */

/** Kyrgyzstan center [lng, lat] */
export const DEFAULT_CENTER: [number, number] = [75.5, 41.5];
export const DEFAULT_ZOOM = 6;

/** Hard bounds — map cannot pan outside Kyrgyzstan. [[sw lng, sw lat], [ne lng, ne lat]] */
export const KG_BOUNDS: [[number, number], [number, number]] = [
  [69.0, 39.0],
  [81.0, 43.8],
];
/** Default pitch (degrees) — immersive 3D */
export const DEFAULT_PITCH = 65;
export const MAX_PITCH = 85;
/** Slight rotation so north isn't straight up */
export const DEFAULT_BEARING = -15;
/** Terrain exaggeration — higher = more dramatic 3D mountains (demo tiles are subtle at country zoom) */
export const TERRAIN_EXAGGERATION = 4;

export const PMTILES_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PMTILES_URL) || '/kyrgyzstan.pmtiles';

/** Only use PMTiles when a URL is explicitly set, to avoid 404 for missing /kyrgyzstan.pmtiles */
export const USE_PMTILES = !!(typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PMTILES_URL);

export const TERRAIN_TILES_URL = 'https://demotiles.maplibre.org/terrain-tiles/tiles.json';

export const SATELLITE_LAYER_ENABLED = true;
export const SATELLITE_TILES =
  'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg';

/** Cinematic intro: flyTo center of KG after 1s delay. [lng, lat] */
export const FLYTO_CENTER: [number, number] = [74.5, 41.5];
export const FLYTO_ZOOM = 6.5;
export const FLYTO_PITCH = 70;
export const FLYTO_BEARING = -10;
/** Initial zoom before fly (zoomed out), then fly in to FLYTO_ZOOM */
export const FLYTO_START_ZOOM = 4;
export const FLYTO_START_PITCH = 50;
/** Delay before starting flyTo (ms) */
export const FLYTO_DELAY_MS = 1000;
/** Duration of flyTo animation (ms) — slow = majestic */
export const FLYTO_DURATION_MS = 4500;
